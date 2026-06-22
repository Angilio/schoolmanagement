<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bulletin;
use App\Models\BulletinArchive;
use App\Models\BulletinDetail;
use App\Models\Classe;
use App\Models\NoteDetail;
use App\Models\SchoolYear;
use App\Models\Section;
use App\Models\Serie;
use App\Models\Student;
use App\Models\Trimestre;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BulletinController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Bulletins/Index', [
            'classes' => Classe::orderBy('id')->get(),
            'sections' => Section::orderBy('name')->get(),
            'series' => Serie::orderBy('name')->get(),
            'schoolYears' => SchoolYear::orderByDesc('id')->get(),

            'trimestres' => Trimestre::with('schoolYear')
                ->orderBy('school_year_id')
                ->orderBy('start_date')
                ->get(),

            /*
            |--------------------------------------------------------------------------
            | Tri demandé : les bulletins sont affichés par rang.
            |--------------------------------------------------------------------------
            */
            'bulletins' => Bulletin::with([
                'student.user',
                'student.classe',
                'student.section',
                'student.serie',
                'trimestre.schoolYear',
            ])
                ->orderByDesc('school_year_id')
                ->orderByDesc('trimestre_id')
                ->orderByRaw('rang IS NULL, rang ASC')
                ->paginate(20)
                ->withQueryString(),

            'archives' => BulletinArchive::with([
                'schoolYear',
                'classe',
                'section',
                'serie',
                'generator',
            ])
                ->latest()
                ->take(10)
                ->get(),
        ]);
    }

    public function generate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'classe_id' => ['required', 'exists:classes,id'],
            'trimestre_id' => ['required', 'exists:trimestres,id'],
            'section_id' => ['nullable', 'exists:sections,id'],
            'serie_id' => ['nullable', 'exists:series,id'],
        ]);

        $trimestre = Trimestre::with('schoolYear')
            ->findOrFail($validated['trimestre_id']);

        $students = Student::with(['user', 'classe', 'section', 'serie'])
            ->where('classe_id', $validated['classe_id'])
            ->when(!empty($validated['section_id']), function ($query) use ($validated) {
                $query->where('section_id', $validated['section_id']);
            })
            ->when(!empty($validated['serie_id']), function ($query) use ($validated) {
                $query->where('serie_id', $validated['serie_id']);
            })
            ->orderBy('section_id')
            ->orderBy('serie_id')
            ->orderBy('matricule')
            ->get();

        if ($students->isEmpty()) {
            return back()->with('error', 'Aucun élève trouvé pour cette classe.');
        }

        $studentIds = $students->pluck('id');

        /*
        |--------------------------------------------------------------------------
        | Notes du trimestre
        |--------------------------------------------------------------------------
        | Si le trimestre contient 2 évaluations, les 2 notes sont récupérées.
        | Ensuite on calcule la moyenne par matière.
        |--------------------------------------------------------------------------
        */
        $notesByStudent = NoteDetail::with([
            'evaluation',
            'teacherSubject.subject',
        ])
            ->whereIn('student_id', $studentIds)
            ->whereHas('evaluation', function ($query) use ($trimestre) {
                $query->where('trimestre_id', $trimestre->id);
            })
            ->get()
            ->groupBy('student_id');

        $generatedCount = 0;
        $skippedCount = 0;

        DB::transaction(function () use (
            $students,
            $notesByStudent,
            $trimestre,
            &$generatedCount,
            &$skippedCount
        ) {
            foreach ($students as $student) {
                $studentNotes = $notesByStudent->get($student->id, collect());

                if ($studentNotes->isEmpty()) {
                    $skippedCount++;
                    continue;
                }

                /*
                |--------------------------------------------------------------------------
                | Moyenne par matière
                |--------------------------------------------------------------------------
                | Exemple :
                | Math évaluation 1 = 12
                | Math évaluation 2 = 14
                | Moyenne Math = 13
                |--------------------------------------------------------------------------
                */
                $notesBySubject = $studentNotes
                    ->filter(function ($note) {
                        return $note->teacherSubject && $note->teacherSubject->subject;
                    })
                    ->groupBy(function ($note) {
                        return $note->teacherSubject->subject_id;
                    });

                if ($notesBySubject->isEmpty()) {
                    $skippedCount++;
                    continue;
                }

                $totalWeighted = 0;
                $totalCoefficient = 0;
                $subjectResults = [];

                foreach ($notesBySubject as $subjectId => $subjectNotes) {
                    $firstNote = $subjectNotes->first();
                    $subject = $firstNote->teacherSubject->subject;

                    /*
                    |--------------------------------------------------------------------------
                    | Moyenne de toutes les évaluations du trimestre pour cette matière.
                    |--------------------------------------------------------------------------
                    */
                    $average = round($subjectNotes->avg('note'), 2);

                    $coefficient = (int) (
                        $firstNote->coefficient
                        ?: $subject->coefficient
                        ?: 1
                    );

                    $weightedAverage = round($average * $coefficient, 2);

                    $totalWeighted += $weightedAverage;
                    $totalCoefficient += $coefficient;

                    $subjectResults[] = [
                        'subject_id' => $subject->id,
                        'average' => $average,
                        'coefficient' => $coefficient,
                        'weighted_average' => $weightedAverage,
                        'appreciation' => $this->getAppreciation($average),
                    ];
                }

                if ($totalCoefficient <= 0 || empty($subjectResults)) {
                    $skippedCount++;
                    continue;
                }

                $moyenne = round($totalWeighted / $totalCoefficient, 2);

                $bulletin = Bulletin::updateOrCreate(
                    [
                        'student_id' => $student->id,
                        'trimestre_id' => $trimestre->id,
                        'school_year_id' => $trimestre->school_year_id,
                    ],
                    [
                        'moyenne' => $moyenne,
                        'rang' => null,
                    ]
                );

                BulletinDetail::where('bulletin_id', $bulletin->id)->delete();

                foreach ($subjectResults as $result) {
                    BulletinDetail::create([
                        'bulletin_id' => $bulletin->id,
                        'subject_id' => $result['subject_id'],
                        'average' => $result['average'],
                        'coefficient' => $result['coefficient'],
                        'weighted_average' => $result['weighted_average'],
                        'appreciation' => $result['appreciation'],
                    ]);
                }

                $generatedCount++;
            }

            $this->updateRanks($students, $trimestre);
        });

        return back()->with(
            'success',
            "Bulletins générés avec succès. Générés : {$generatedCount}. Ignorés sans notes : {$skippedCount}."
        );
    }

    // public function show(Bulletin $bulletin): Response
    // {
    //     $bulletin->load([
    //         'student.user',
    //         'student.classe',
    //         'student.section',
    //         'student.serie',
    //         'trimestre.schoolYear',
    //         'details.subject',
    //     ]);

    //     return Inertia::render('Admin/Bulletins/Show', [
    //         'bulletin' => $bulletin,
    //     ]);
    // }

    public function show(Bulletin $bulletin): Response
    {
        $bulletin->load([
            'student.user',
            'student.classe',
            'student.section',
            'student.serie',
            'trimestre.schoolYear',
            'details.subject',
        ]);

        $student = $bulletin->student;
        $schoolYearId = $bulletin->school_year_id;

        $schoolYear = SchoolYear::find($schoolYearId);

        /*
        |--------------------------------------------------------------------------
        | On récupère toujours les 3 trimestres de l'année scolaire
        |--------------------------------------------------------------------------
        */
        $annualTrimestres = Trimestre::where('school_year_id', $schoolYearId)
            ->orderBy('start_date')
            ->orderBy('id')
            ->take(3)
            ->get()
            ->values();

        /*
        |--------------------------------------------------------------------------
        | On récupère tous les bulletins déjà générés pour cet élève dans l'année
        |--------------------------------------------------------------------------
        */
        $annualBulletins = Bulletin::with([
            'trimestre.schoolYear',
            'details.subject',
        ])
            ->where('student_id', $student->id)
            ->where('school_year_id', $schoolYearId)
            ->whereIn('trimestre_id', $annualTrimestres->pluck('id'))
            ->orderBy('trimestre_id')
            ->get()
            ->values();

        /*
        |--------------------------------------------------------------------------
        | Moyenne annuelle de l'élève
        |--------------------------------------------------------------------------
        */
        $validAverages = $annualBulletins
            ->pluck('moyenne')
            ->filter(fn ($value) => $value !== null)
            ->map(fn ($value) => (float) $value)
            ->values();

        $annualAverage = $validAverages->count() > 0
            ? round($validAverages->avg(), 2)
            : null;

        /*
        |--------------------------------------------------------------------------
        | Rang annuel dans la même classe / section / série
        |--------------------------------------------------------------------------
        */
        $classStudentIds = Student::where('classe_id', $student->classe_id)
            ->where('section_id', $student->section_id)
            ->when(
                $student->serie_id,
                fn ($query) => $query->where('serie_id', $student->serie_id),
                fn ($query) => $query->whereNull('serie_id')
            )
            ->pluck('id');

        $annualAverages = Bulletin::whereIn('student_id', $classStudentIds)
            ->where('school_year_id', $schoolYearId)
            ->whereIn('trimestre_id', $annualTrimestres->pluck('id'))
            ->whereNotNull('moyenne')
            ->select('student_id', DB::raw('AVG(moyenne) as annual_average'))
            ->groupBy('student_id')
            ->orderByDesc('annual_average')
            ->get();

        $annualRank = null;
        $rank = 1;
        $previousAverage = null;
        $previousRank = 1;

        foreach ($annualAverages as $index => $item) {
            if (
                $previousAverage !== null &&
                (float) $item->annual_average === (float) $previousAverage
            ) {
                $currentRank = $previousRank;
            } else {
                $currentRank = $rank;
                $previousRank = $currentRank;
            }

            if ((int) $item->student_id === (int) $student->id) {
                $annualRank = $currentRank;
                break;
            }

            $previousAverage = $item->annual_average;
            $rank = $index + 2;
        }

        return Inertia::render('Admin/Bulletins/Show', [
            'bulletin' => $bulletin,
            'schoolYear' => $schoolYear,
            'annualTrimestres' => $annualTrimestres,
            'annualBulletins' => $annualBulletins,
            'annualAverage' => $annualAverage,
            'annualRank' => $annualRank,
        ]);
    }

    public function archivePdf(Request $request)
    {
        $validated = $request->validate([
            'school_year_id' => ['required', 'exists:school_years,id'],
            'classe_id' => ['required', 'exists:classes,id'],
            'section_id' => ['nullable', 'exists:sections,id'],
            'serie_id' => ['nullable', 'exists:series,id'],
        ]);

        $schoolYear = SchoolYear::findOrFail($validated['school_year_id']);
        $classe = Classe::findOrFail($validated['classe_id']);
        $section = !empty($validated['section_id'])
            ? Section::find($validated['section_id'])
            : null;
        $serie = !empty($validated['serie_id'])
            ? Serie::find($validated['serie_id'])
            : null;

        $trimestres = Trimestre::where('school_year_id', $schoolYear->id)
            ->orderBy('start_date')
            ->get();

        $students = Student::with(['user', 'classe', 'section', 'serie'])
            ->where('classe_id', $classe->id)
            ->when($section, function ($query) use ($section) {
                $query->where('section_id', $section->id);
            })
            ->when($serie, function ($query) use ($serie) {
                $query->where('serie_id', $serie->id);
            })
            ->orderBy('section_id')
            ->orderBy('serie_id')
            ->orderBy('matricule')
            ->get();

        $bulletins = Bulletin::with(['trimestre'])
            ->whereIn('student_id', $students->pluck('id'))
            ->where('school_year_id', $schoolYear->id)
            ->get()
            ->groupBy('student_id');

        $rows = $students->map(function ($student) use ($trimestres, $bulletins) {
            $studentBulletins = $bulletins->get($student->id, collect());

            $trimesterResults = [];
            $validAverages = [];

            foreach ($trimestres as $trimestre) {
                $bulletin = $studentBulletins
                    ->firstWhere('trimestre_id', $trimestre->id);

                $moyenne = $bulletin?->moyenne;

                $trimesterResults[] = [
                    'trimestre_id' => $trimestre->id,
                    'trimestre_name' => $trimestre->name ?? $trimestre->title ?? 'Trimestre',
                    'moyenne' => $moyenne,
                    'rang' => $bulletin?->rang,
                ];

                if ($moyenne !== null) {
                    $validAverages[] = (float) $moyenne;
                }
            }

            $annualAverage = count($validAverages) > 0
                ? round(array_sum($validAverages) / count($validAverages), 2)
                : null;

            return [
                'student' => $student,
                'trimestres' => $trimesterResults,
                'annual_average' => $annualAverage,
                'annual_rank' => null,
                'completed_trimestres' => count($validAverages),
            ];
        });

        $rankedRows = $this->rankAnnualRows($rows);

        $pdf = Pdf::loadView('pdfs.bulletins.annual_archive', [
            'schoolYear' => $schoolYear,
            'classe' => $classe,
            'section' => $section,
            'serie' => $serie,
            'trimestres' => $trimestres,
            'rows' => $rankedRows,
            'generatedAt' => now(),
        ])->setPaper('a4', 'landscape');

        $fileName = 'archive_bulletins_' .
            $schoolYear->id . '_' .
            $classe->id . '_' .
            now()->format('Ymd_His') .
            '.pdf';

        $filePath = 'archives/bulletins/' . $fileName;

        Storage::disk('public')->put($filePath, $pdf->output());

        BulletinArchive::create([
            'school_year_id' => $schoolYear->id,
            'classe_id' => $classe->id,
            'section_id' => $section?->id,
            'serie_id' => $serie?->id,
            'file_path' => $filePath,
            'filters' => $validated,
            'generated_by' => Auth::id(),
            'generated_at' => now(),
        ]);

        return $pdf->download($fileName);
    }

    public function downloadArchive(BulletinArchive $archive)
    {
        $path = storage_path('app/public/' . $archive->file_path);

        abort_unless(file_exists($path), 404);

        return response()->download($path);
    }

    private function updateRanks($students, Trimestre $trimestre): void
    {
        $studentIds = $students->pluck('id');

        $bulletins = Bulletin::where('trimestre_id', $trimestre->id)
            ->whereIn('student_id', $studentIds)
            ->whereNotNull('moyenne')
            ->orderByDesc('moyenne')
            ->get();

        $rank = 1;
        $previousMoyenne = null;
        $previousRank = 1;

        foreach ($bulletins as $index => $bulletin) {
            if ($previousMoyenne !== null && (float) $bulletin->moyenne === (float) $previousMoyenne) {
                $currentRank = $previousRank;
            } else {
                $currentRank = $rank;
                $previousRank = $currentRank;
            }

            $bulletin->update([
                'rang' => $currentRank,
            ]);

            $previousMoyenne = $bulletin->moyenne;
            $rank = $index + 2;
        }
    }

    private function rankAnnualRows($rows)
    {
        $rankable = $rows
            ->filter(fn ($row) => $row['annual_average'] !== null)
            ->sortByDesc('annual_average')
            ->values();

        $rank = 1;
        $previousAverage = null;
        $previousRank = 1;

        $ranked = $rankable->map(function ($row, $index) use (&$rank, &$previousAverage, &$previousRank) {
            if ($previousAverage !== null && (float) $row['annual_average'] === (float) $previousAverage) {
                $currentRank = $previousRank;
            } else {
                $currentRank = $rank;
                $previousRank = $currentRank;
            }

            $row['annual_rank'] = $currentRank;

            $previousAverage = $row['annual_average'];
            $rank = $index + 2;

            return $row;
        });

        $withoutAverage = $rows
            ->filter(fn ($row) => $row['annual_average'] === null)
            ->map(function ($row) {
                $row['annual_rank'] = null;
                return $row;
            });

        return $ranked->merge($withoutAverage)->values();
    }

    private function getAppreciation(float $average): string
    {
        if ($average >= 16) {
            return 'Très bien';
        }

        if ($average >= 14) {
            return 'Bien';
        }

        if ($average >= 12) {
            return 'Assez bien';
        }

        if ($average >= 10) {
            return 'Passable';
        }

        return 'Insuffisant';
    }
}