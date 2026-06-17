<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\Subject;
use App\Models\Section;
use App\Models\Classe;
use App\Models\Serie;
use App\Models\TeacherSubject;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TeacherController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Teachers/Index', [
            'teachers' => Teacher::with([
                'user',
                'teacherSubjects.subject',
                'teacherSubjects.section',
                'teacherSubjects.classe',
                'teacherSubjects.serie',
            ])
                ->latest()
                ->paginate(20)
                ->withQueryString(),

            'subjects' => Subject::orderBy('name')->get(),
            'sections' => Section::orderBy('name')->get(),
            'classes' => Classe::orderBy('name')->get(),
            'series' => Serie::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $this->validateTeacherRequest($request);

        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt('12345678'),
            ]);

            $user->assignRole('Enseignant');

            $teacher = Teacher::create([
                'user_id' => $user->id,
            ]);

            foreach ($request->assignments as $assignment) {
                TeacherSubject::firstOrCreate([
                    'teacher_id' => $teacher->id,
                    'subject_id' => $assignment['subject_id'],
                    'classe_id' => $assignment['classe_id'],
                    'serie_id' => $assignment['serie_id'] ?? null,
                    'section_id' => $assignment['section_id'],
                ]);
            }
        });

        return back()->with('success', 'Enseignant créé avec succès.');
    }

    public function update(Request $request, Teacher $teacher)
    {
        $this->validateTeacherRequest($request, $teacher);

        DB::transaction(function () use ($request, $teacher) {
            $teacher->user->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);

            TeacherSubject::where('teacher_id', $teacher->id)->delete();

            foreach ($request->assignments as $assignment) {
                TeacherSubject::firstOrCreate([
                    'teacher_id' => $teacher->id,
                    'subject_id' => $assignment['subject_id'],
                    'classe_id' => $assignment['classe_id'],
                    'serie_id' => $assignment['serie_id'] ?? null,
                    'section_id' => $assignment['section_id'],
                ]);
            }
        });

        return back()->with('success', 'Enseignant modifié avec succès.');
    }

    public function destroy(Teacher $teacher)
    {
        DB::transaction(function () use ($teacher) {
            $user = $teacher->user;

            TeacherSubject::where('teacher_id', $teacher->id)->delete();

            $teacher->delete();

            if ($user) {
                $user->delete();
            }
        });

        return back()->with('success', 'Enseignant supprimé avec succès.');
    }

    private function validateTeacherRequest(Request $request, ?Teacher $teacher = null): void
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],

            'email' => [
                'required',
                'email',
                $teacher
                    ? Rule::unique('users', 'email')->ignore($teacher->user_id)
                    : Rule::unique('users', 'email'),
            ],

            'assignments' => ['required', 'array', 'min:1'],
            'assignments.*.subject_id' => ['required', 'exists:subjects,id'],
            'assignments.*.classe_id' => ['required', 'exists:classes,id'],
            'assignments.*.section_id' => ['required', 'exists:sections,id'],
            'assignments.*.serie_id' => ['nullable', 'exists:series,id'],
        ]);

        foreach ($request->assignments as $index => $assignment) {
            $classe = Classe::find($assignment['classe_id']);

            if (!$classe) {
                continue;
            }

            $classeName = strtolower(trim($classe->name));
            $isSeconde = str_contains($classeName, 'seconde');

            if ($isSeconde && !empty($assignment['serie_id'])) {
                throw ValidationException::withMessages([
                    "assignments.$index.serie_id" => 'La classe Seconde ne doit pas avoir de série.',
                ]);
            }

            if (!$isSeconde && empty($assignment['serie_id'])) {
                throw ValidationException::withMessages([
                    "assignments.$index.serie_id" => 'La série est obligatoire pour Première et Terminale.',
                ]);
            }
        }
    }
}