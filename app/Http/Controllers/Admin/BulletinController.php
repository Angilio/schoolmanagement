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
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class BulletinController extends Controller
{

    private function studentPdfRowsFromArchives($archives, ?string $search = null)
    {
        $rows = collect();

        foreach ($archives as $archive) {
            $filters = $archive->filters;

            if (is_string($filters)) {
                $filters = json_decode($filters, true) ?: [];
            }

            $studentFiles = $filters['student_files'] ?? [];

            foreach ($studentFiles as $file) {
                $filePath = $file['file_path'] ?? null;

                if (!$filePath) {
                    continue;
                }

                $rows->push([
                    'archive_id' => $archive->id,
                    'school_year_id' => $archive->school_year_id,
                    'school_year' => $archive->schoolYear?->year ?? '-',
                    'classe' => $archive->classe?->name ?? 'Toutes classes',
                    'section' => $archive->section?->name,
                    'serie' => $archive->serie?->name,
                    'student_id' => $file['student_id'] ?? null,
                    'student_name' => $file['name'] ?? 'Élève',
                    'matricule' => $file['matricule'] ?? '-',
                    'file_path' => $filePath,
                    'file_name' => $file['name'] ?? basename($filePath),
                    'generated_at' => optional($archive->generated_at ?? $archive->created_at)->format('d/m/Y H:i'),
                    'download_url' => route('admin.bulletins.archives.student-pdf.download', [
                        'path' => base64_encode($filePath),
                    ]),
                ]);
            }
        }

        if ($search) {
            $search = Str::lower(Str::ascii($search));

            $rows = $rows->filter(function ($row) use ($search) {
                $name = Str::lower(Str::ascii($row['student_name'] ?? ''));
                $matricule = Str::lower(Str::ascii($row['matricule'] ?? ''));
                $fileName = Str::lower(Str::ascii($row['file_name'] ?? ''));

                return Str::contains($name, $search)
                    || Str::contains($matricule, $search)
                    || Str::contains($fileName, $search);
            });
        }

        return $rows->values();
    }

public function index(Request $request): Response
    {
        // 1. Récupération des filtres de la requête URL
        $classeId = $request->input('classe_id');
        $sectionId = $request->input('section_id');
        $trimestreId = $request->input('trimestre_id');

        // 2. Construction de la requête pour les bulletins
        $bulletinsQuery = Bulletin::with([
            'student.user',
            'student.classe',
            'student.section',
            'student.serie',
            'trimestre.schoolYear',
        ]);

        // Filtre Niveau 1 : Classe (appliqué sur la relation student)
        if (!empty($classeId)) {
            $bulletinsQuery->whereHas('student', function ($query) use ($classeId) {
                $query->where('classe_id', $classeId);
            });
        }

        // Filtre Niveau 2 : Section (appliqué sur la relation student, uniquement si classe_id est présent)
        if (!empty($classeId) && !empty($sectionId)) {
            $bulletinsQuery->whereHas('student', function ($query) use ($sectionId) {
                $query->where('section_id', $sectionId);
            });
        }

        // Filtre Niveau 3 : Trimestre (directement sur la table bulletins)
        if (!empty($classeId) && !empty($trimestreId)) {
            $bulletinsQuery->where('trimestre_id', $trimestreId);
        }

        // Tri par année, trimestre, puis par rang (les rangs NULL vont à la fin)
        $bulletins = $bulletinsQuery->orderByDesc('school_year_id')
            ->orderByDesc('trimestre_id')
            ->orderByRaw('rang IS NULL, rang ASC')
            ->paginate(20)
            ->withQueryString(); // Préserve les paramètres de filtres dans les liens de pagination

        // 3. Récupération des archives récentes pour l'affichage des PDF
        $recentArchives = BulletinArchive::with([
            'schoolYear',
            'classe',
            'section',
            'serie',
            'generator',
        ])
            ->latest()
            ->take(20)
            ->get();

        // 4. Renvoi des données à la vue Inertia
        return Inertia::render('Admin/Bulletins/Index', [
            'classes' => Classe::orderBy('id')->get(),
            'sections' => Section::orderBy('name')->get(),
            'series' => Serie::orderBy('name')->get(),
            'schoolYears' => SchoolYear::orderByDesc('id')->get(),

            'trimestres' => Trimestre::with('schoolYear')
                ->orderBy('school_year_id')
                ->orderBy('start_date')
                ->get(),

            'bulletins' => $bulletins,

            // Retourne l'état actuel des filtres au composant React
            'filters' => [
                'classe_id' => $classeId,
                'section_id' => $sectionId,
                'trimestre_id' => $trimestreId,
            ],

            'recentStudentPdfs' => $this->studentPdfRowsFromArchives($recentArchives)
                ->take(5)
                ->values(),

            'archives' => $recentArchives->take(5)->values(),
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

        $annualTrimestres = $this->getAnnualTrimestres((int) $schoolYearId);

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

        $validAverages = $annualBulletins
            ->pluck('moyenne')
            ->filter(fn ($value) => $value !== null)
            ->map(fn ($value) => (float) $value)
            ->values();

        $annualAverage = $validAverages->count() > 0
            ? round($validAverages->avg(), 2)
            : null;

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
            'classe_id' => ['nullable', 'exists:classes,id'],
            'section_id' => ['nullable', 'exists:sections,id'],
            'serie_id' => ['nullable', 'exists:series,id'],
        ]);

        $schoolYear = SchoolYear::findOrFail($validated['school_year_id']);

        $classe = !empty($validated['classe_id'])
            ? Classe::findOrFail($validated['classe_id'])
            : null;

        $section = !empty($validated['section_id'])
            ? Section::find($validated['section_id'])
            : null;

        $serie = !empty($validated['serie_id'])
            ? Serie::find($validated['serie_id'])
            : null;

        $trimestres = $this->getAnnualTrimestres((int) $schoolYear->id);

        if ($trimestres->isEmpty()) {
            abort(404, "Aucun trimestre trouvé pour cette année scolaire.");
        }

        $students = Student::with(['user', 'classe', 'section', 'serie'])
            ->when($classe, function ($query) use ($classe) {
                $query->where('classe_id', $classe->id);
            })
            ->when($section, function ($query) use ($section) {
                $query->where('section_id', $section->id);
            })
            ->when($serie, function ($query) use ($serie) {
                $query->where('serie_id', $serie->id);
            })
            ->orderBy('classe_id')
            ->orderBy('section_id')
            ->orderBy('serie_id')
            ->orderBy('matricule')
            ->get();

        if ($students->isEmpty()) {
            abort(404, "Aucun élève trouvé avec ces filtres.");
        }

        $allBulletins = Bulletin::with([
            'trimestre.schoolYear',
            'details.subject',
        ])
            ->whereIn('student_id', $students->pluck('id'))
            ->where('school_year_id', $schoolYear->id)
            ->whereIn('trimestre_id', $trimestres->pluck('id'))
            ->get()
            ->groupBy('student_id');

        $studentDataList = $students->map(function ($student) use (
            $schoolYear,
            $trimestres,
            $allBulletins
        ) {
            return $this->buildAnnualStudentBulletinData(
                $student,
                $schoolYear,
                $trimestres,
                $allBulletins->get($student->id, collect())
            );
        });

        $rankedRows = $this->rankAnnualRows(
            $studentDataList->map(function ($data) {
                return [
                    'student' => $data['student'],
                    'trimestres' => $data['trimesterResults'],
                    'annual_average' => $data['annualAverage'],
                    'annual_rank' => null,
                    'completed_trimestres' => $data['completedTrimestres'],
                ];
            })
        );

        $rankByStudent = $rankedRows->keyBy(function ($row) {
            return $row['student']->id;
        });

        $yearFolder = $this->cleanFileName(
            $schoolYear->year ?? 'annee_' . $schoolYear->id
        );

        $savedFiles = [];

        foreach ($studentDataList as $data) {
            $student = $data['student'];
            $rankRow = $rankByStudent->get($student->id);

            $data['annualRank'] = $rankRow['annual_rank'] ?? null;

            $studentFolderName = $this->cleanFileName(
                ($student->matricule ?: 'eleve_' . $student->id) .
                '_' .
                ($student->user?->name ?? 'sans_nom')
            );

            $studentFolder = "archives/bulletins/{$yearFolder}/eleves/{$studentFolderName}";

            $fileName = 'bulletin_annuel_' .
                $this->cleanFileName($student->matricule ?: 'eleve_' . $student->id) .
                '_' .
                now()->format('Ymd_His') .
                '.pdf';

            $filePath = "{$studentFolder}/{$fileName}";

            $pdf = Pdf::loadView('pdfs.bulletins.student_annual', $data)
                ->setPaper('a4', 'landscape');

            Storage::disk('public')->makeDirectory($studentFolder);
            Storage::disk('public')->put($filePath, $pdf->output());

            $savedFiles[] = [
                'student_id' => $student->id,
                'matricule' => $student->matricule,
                'name' => $student->user?->name,
                'file_path' => $filePath,
                'url' => Storage::url($filePath),
            ];
        }

        $summaryPdf = Pdf::loadView('pdfs.bulletins.annual_archive', [
            'schoolYear' => $schoolYear,
            'classe' => $classe,
            'section' => $section,
            'serie' => $serie,
            'trimestres' => $trimestres,
            'rows' => $rankedRows,
            'generatedAt' => now(),
            'savedFiles' => $savedFiles,
        ])->setPaper('a4', 'landscape');

        $scopeName = $classe
            ? $this->cleanFileName($classe->name)
            : 'toutes_classes';

        $summaryFileName = 'resume_generation_bulletins_' .
            $yearFolder .
            '_' .
            $scopeName .
            '_' .
            now()->format('Ymd_His') .
            '.pdf';

        $summaryFolder = "archives/bulletins/{$yearFolder}/resumes";
        $summaryPath = "{$summaryFolder}/{$summaryFileName}";

        Storage::disk('public')->makeDirectory($summaryFolder);
        Storage::disk('public')->put($summaryPath, $summaryPdf->output());

        BulletinArchive::create([
            'school_year_id' => $schoolYear->id,
            'classe_id' => $classe?->id,
            'section_id' => $section?->id,
            'serie_id' => $serie?->id,
            'file_path' => $summaryPath,
            'filters' => array_merge($validated, [
                'student_files' => $savedFiles,
            ]),
            'generated_by' => Auth::id(),
            'generated_at' => now(),
        ]);

        return $summaryPdf->download($summaryFileName);
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
            if (
                $previousMoyenne !== null &&
                (float) $bulletin->moyenne === (float) $previousMoyenne
            ) {
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

        $ranked = $rankable->map(function ($row, $index) use (
            &$rank,
            &$previousAverage,
            &$previousRank
        ) {
            if (
                $previousAverage !== null &&
                (float) $row['annual_average'] === (float) $previousAverage
            ) {
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

    private function getAnnualTrimestres(int $schoolYearId)
    {
        return Trimestre::where('school_year_id', $schoolYearId)
            ->get()
            ->sortBy(function ($trimestre) {
                return $this->trimestrePosition($trimestre);
            })
            ->values()
            ->take(3);
    }

    private function trimestrePosition($trimestre): int
    {
        $name = Str::lower(
            Str::ascii($trimestre->name ?? $trimestre->title ?? '')
        );

        if (
            Str::contains($name, [
                '1er',
                '1ere',
                '1e',
                '1eme',
                'premier',
                'premiere',
                'trimestre 1',
            ])
        ) {
            return 1;
        }

        if (
            Str::contains($name, [
                '2e',
                '2eme',
                'deuxieme',
                'second',
                'seconde',
                'trimestre 2',
            ])
        ) {
            return 2;
        }

        if (
            Str::contains($name, [
                '3e',
                '3eme',
                'troisieme',
                'trimestre 3',
            ])
        ) {
            return 3;
        }

        return 10 + (int) $trimestre->id;
    }

    private function buildAnnualStudentBulletinData(
        Student $student,
        SchoolYear $schoolYear,
        $trimestres,
        $studentBulletins
    ): array {
        $bulletinsByTrimestre = $studentBulletins->keyBy('trimestre_id');

        $allDetails = $studentBulletins->flatMap(function ($bulletin) {
            return $bulletin->details;
        });

        $subjectIds = $allDetails
            ->pluck('subject_id')
            ->filter()
            ->unique()
            ->values();

        $subjectRows = $subjectIds
            ->map(function ($subjectId) use (
                $trimestres,
                $bulletinsByTrimestre,
                $allDetails
            ) {
                $firstDetail = $allDetails->first(function ($detail) use ($subjectId) {
                    return (int) $detail->subject_id === (int) $subjectId;
                });

                $subject = $firstDetail?->subject;

                $coefficient = (int) (
                    $firstDetail?->coefficient
                    ?: $subject?->coefficient
                    ?: 1
                );

                $trimesterCells = [];
                $validAverages = [];

                foreach ($trimestres as $trimestre) {
                    $bulletin = $bulletinsByTrimestre->get($trimestre->id);

                    $detail = $bulletin?->details->first(function ($item) use ($subjectId) {
                        return (int) $item->subject_id === (int) $subjectId;
                    });

                    $average = $detail?->average;

                    $trimesterCells[] = [
                        'trimestre_id' => $trimestre->id,
                        'average' => $average,
                        'appreciation' => $detail?->appreciation,
                    ];

                    if ($average !== null) {
                        $validAverages[] = (float) $average;
                    }
                }

                $annualSubjectAverage = count($validAverages) > 0
                    ? round(array_sum($validAverages) / count($validAverages), 2)
                    : null;

                $weightedAnnual = $annualSubjectAverage !== null
                    ? round($annualSubjectAverage * $coefficient, 2)
                    : null;

                return [
                    'subject_id' => $subjectId,
                    'subject_name' => $subject?->name ?? '-',
                    'coefficient' => $coefficient,
                    'trimestres' => $trimesterCells,
                    'annual_average' => $annualSubjectAverage,
                    'weighted_annual' => $weightedAnnual,
                    'appreciation' => $annualSubjectAverage !== null
                        ? $this->getAppreciation((float) $annualSubjectAverage)
                        : '-',
                ];
            })
            ->sortBy('subject_name')
            ->values();

        $validSubjectRows = $subjectRows->filter(function ($row) {
            return $row['annual_average'] !== null;
        });

        $totalCoefficient = $validSubjectRows->sum('coefficient');

        $totalWeighted = $validSubjectRows->sum(function ($row) {
            return (float) ($row['weighted_annual'] ?? 0);
        });

        $annualAverage = $totalCoefficient > 0
            ? round($totalWeighted / $totalCoefficient, 2)
            : null;

        $trimesterResults = $trimestres
            ->map(function ($trimestre) use ($bulletinsByTrimestre) {
                $bulletin = $bulletinsByTrimestre->get($trimestre->id);

                return [
                    'trimestre_id' => $trimestre->id,
                    'trimestre_name' => $trimestre->name ?? $trimestre->title ?? 'Trimestre',
                    'moyenne' => $bulletin?->moyenne,
                    'rang' => $bulletin?->rang,
                ];
            })
            ->values();

        $completedTrimestres = $trimesterResults
            ->filter(function ($row) {
                return $row['moyenne'] !== null;
            })
            ->count();

        return [
            'student' => $student,
            'schoolYear' => $schoolYear,
            'trimestres' => $trimestres,
            'subjectRows' => $subjectRows,
            'trimesterResults' => $trimesterResults,
            'annualAverage' => $annualAverage,
            'annualRank' => null,
            'totalCoefficient' => $totalCoefficient,
            'totalWeighted' => $totalWeighted,
            'completedTrimestres' => $completedTrimestres,
            'generatedAt' => now(),
        ];
    }

    private function cleanFileName(?string $value): string
    {
        $clean = Str::of($value ?: 'sans_nom')
            ->ascii()
            ->lower()
            ->replaceMatches('/[^a-z0-9\-_]+/', '_')
            ->trim('_')
            ->toString();

        return $clean ?: 'sans_nom';
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

    public function archivesIndex(Request $request): Response
{
    $schoolYearId = $request->input('school_year_id');
    $search = trim((string) $request->input('search'));

    $archives = BulletinArchive::with([
        'schoolYear',
        'classe',
        'section',
        'serie',
        'generator',
    ])
        ->when($schoolYearId, function ($query) use ($schoolYearId) {
            $query->where('school_year_id', $schoolYearId);
        })
        ->latest()
        ->get();

    $studentPdfs = $this->studentPdfRowsFromArchives($archives, $search);

    return Inertia::render('Admin/Bulletins/Archives', [
        'schoolYears' => SchoolYear::orderByDesc('id')->get(),
        'studentPdfs' => $studentPdfs,
        'filters' => [
            'school_year_id' => $schoolYearId,
            'search' => $search,
        ],
    ]);
}

public function downloadStudentPdf(Request $request)
{
    $encodedPath = $request->query('path');

    abort_unless($encodedPath, 404);

    $filePath = base64_decode($encodedPath, true);

    abort_unless($filePath, 404);

    abort_unless(
        Str::startsWith($filePath, 'archives/bulletins/'),
        403
    );

    abort_unless(Storage::disk('public')->exists($filePath), 404);

    return response()->download(storage_path('app/public/' . $filePath));
}
}