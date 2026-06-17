<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\NoteDetail;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\TeacherSubject;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class NoteEntryController extends Controller
{
    public function index(Request $request): Response
    {
        $teacher = $this->currentTeacher();
        $today = now()->toDateString();

        $assignments = TeacherSubject::with([
            'subject',
            'classe',
            'section',
            'serie',
        ])
            ->where('teacher_id', $teacher->id)
            ->orderBy('classe_id')
            ->orderBy('section_id')
            ->orderBy('serie_id')
            ->orderBy('subject_id')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Sécurité front : on n'envoie dans le select que les évaluations ouvertes.
        |--------------------------------------------------------------------------
        */
        $evaluations = Evaluation::with('trimestre.schoolYear')
            ->whereDate('grade_entry_deadline', '>=', $today)
            ->latest()
            ->get();

        $selectedEvaluationId = $request->integer('evaluation_id') ?: null;
        $selectedTeacherSubjectId = $request->integer('teacher_subject_id') ?: null;

        $students = collect();
        $existingNotes = collect();
        $selectedEvaluation = null;
        $selectedAssignment = null;
        $canEdit = false;

        if ($selectedEvaluationId && $selectedTeacherSubjectId) {
            $selectedEvaluation = Evaluation::with('trimestre.schoolYear')
                ->find($selectedEvaluationId);

            $selectedAssignment = TeacherSubject::with([
                'subject',
                'classe',
                'section',
                'serie',
            ])
                ->where('teacher_id', $teacher->id)
                ->where('id', $selectedTeacherSubjectId)
                ->first();

            if ($selectedEvaluation && $selectedAssignment) {
                $canEdit = $today <= $selectedEvaluation->grade_entry_deadline;

                /*
                |--------------------------------------------------------------------------
                | Si l'évaluation est clôturée, on n'affiche pas la liste des élèves.
                |--------------------------------------------------------------------------
                */
                if ($canEdit) {
                    $studentsQuery = Student::with([
                        'user',
                        'classe',
                        'section',
                        'serie',
                    ])
                        ->where('classe_id', $selectedAssignment->classe_id)
                        ->where('section_id', $selectedAssignment->section_id);

                    if ($selectedAssignment->serie_id) {
                        $studentsQuery->where('serie_id', $selectedAssignment->serie_id);
                    }

                    $students = $studentsQuery
                        ->orderBy('matricule')
                        ->get();

                    $existingNotes = NoteDetail::where('evaluation_id', $selectedEvaluation->id)
                        ->where('teacher_subject_id', $selectedAssignment->id)
                        ->get()
                        ->keyBy('student_id');
                }
            }
        }

        return Inertia::render('Teacher/Notes/Index', [
            'assignments' => $assignments,
            'evaluations' => $evaluations,

            'selected' => [
                'evaluation_id' => $selectedEvaluationId,
                'teacher_subject_id' => $selectedTeacherSubjectId,
                'evaluation' => $selectedEvaluation,
                'assignment' => $selectedAssignment,
                'can_edit' => $canEdit,
                'today' => $today,
            ],

            'students' => $students,
            'existingNotes' => $existingNotes,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $teacher = $this->currentTeacher();

        /*
        |--------------------------------------------------------------------------
        | Normaliser les virgules en points
        |--------------------------------------------------------------------------
        */
        $normalizedNotes = collect($request->input('notes', []))
            ->map(function ($item) {
                if (isset($item['note'])) {
                    $item['note'] = str_replace(',', '.', $item['note']);
                }

                return $item;
            })
            ->values()
            ->toArray();

        $request->merge([
            'notes' => $normalizedNotes,
        ]);

        $validated = $request->validate([
            'evaluation_id' => ['required', 'exists:evaluations,id'],
            'teacher_subject_id' => ['required', 'exists:teacher_subjects,id'],

            'notes' => ['required', 'array', 'min:1'],
            'notes.*.student_id' => ['required', 'exists:students,id'],
            'notes.*.note' => [
                'required',
                'numeric',
                'min:0',
                'max:20',
                'regex:/^\d+(\.\d{1,2})?$/',
            ],
        ], [
            'notes.*.note.required' => 'La note est obligatoire.',
            'notes.*.note.numeric' => 'La note doit être un nombre.',
            'notes.*.note.regex' => 'La note doit avoir au maximum deux chiffres après la virgule.',
            'notes.*.note.min' => 'La note doit être positive.',
            'notes.*.note.max' => 'La note ne doit pas dépasser 20.',
        ]);

        $evaluation = Evaluation::findOrFail($validated['evaluation_id']);

        /*
        |--------------------------------------------------------------------------
        | Sécurité backend obligatoire
        |--------------------------------------------------------------------------
        | Même si quelqu'un force la requête depuis le navigateur,
        | aucune note ne sera enregistrée après la date limite.
        |--------------------------------------------------------------------------
        */
        if (now()->toDateString() > $evaluation->grade_entry_deadline) {
            throw ValidationException::withMessages([
                'evaluation_id' => 'La date limite de saisie des notes est dépassée. Vous ne pouvez plus ajouter ou modifier les notes.',
            ]);
        }

        $assignment = TeacherSubject::with('subject')
            ->where('teacher_id', $teacher->id)
            ->where('id', $validated['teacher_subject_id'])
            ->firstOrFail();

        $coefficient = (int) ($assignment->subject?->coefficient ?? 1);

        DB::transaction(function () use ($validated, $assignment, $coefficient) {
            foreach ($validated['notes'] as $index => $item) {
                $student = Student::where('id', $item['student_id'])
                    ->where('classe_id', $assignment->classe_id)
                    ->where('section_id', $assignment->section_id)
                    ->when($assignment->serie_id, function ($query) use ($assignment) {
                        $query->where('serie_id', $assignment->serie_id);
                    })
                    ->first();

                if (!$student) {
                    throw ValidationException::withMessages([
                        "notes.$index.student_id" => 'Cet élève ne correspond pas à la classe, section ou série sélectionnée.',
                    ]);
                }

                $note = round((float) $item['note'], 2);

                if ($note < 0 || $note > 20) {
                    throw ValidationException::withMessages([
                        "notes.$index.note" => 'La note doit être comprise entre 0 et 20.',
                    ]);
                }

                $weightedNote = round($note * $coefficient, 2);

                NoteDetail::updateOrCreate(
                    [
                        'evaluation_id' => $validated['evaluation_id'],
                        'teacher_subject_id' => $assignment->id,
                        'student_id' => $student->id,
                    ],
                    [
                        'note' => $note,
                        'coefficient' => $coefficient,
                        'weighted_note' => $weightedNote,
                    ]
                );
            }
        });

        return back()->with('success', 'Notes enregistrées avec succès.');
    }

    private function currentTeacher(): Teacher
    {
        return Teacher::where('user_id', Auth::id())
            ->firstOrFail();
    }
}