<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Evaluation;
use App\Models\Teacher;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = Auth::user();

        $teacher = Teacher::with([
            'teacherSubjects.subject',
            'teacherSubjects.classe',
            'teacherSubjects.section',
            'teacherSubjects.serie',
        ])
            ->where('user_id', $user->id)
            ->firstOrFail();

        $assignments = $teacher->teacherSubjects;

        $classes = $assignments
            ->groupBy('classe_id')
            ->map(function ($items) {
                $first = $items->first();

                return [
                    'id' => $first->classe?->id,
                    'name' => $first->classe?->name,
                    'sections' => $items
                        ->pluck('section.name')
                        ->filter()
                        ->unique()
                        ->values(),
                    'series' => $items
                        ->pluck('serie.name')
                        ->filter()
                        ->unique()
                        ->values(),
                    'subjects' => $items
                        ->pluck('subject.name')
                        ->filter()
                        ->unique()
                        ->values(),
                ];
            })
            ->values();

        $subjects = $assignments
            ->groupBy('subject_id')
            ->map(function ($items) {
                $first = $items->first();

                return [
                    'id' => $first->subject?->id,
                    'name' => $first->subject?->name,
                    'coefficient' => $first->subject?->coefficient,
                    'classes_count' => $items->pluck('classe_id')->unique()->count(),
                    'sections_count' => $items->pluck('section_id')->unique()->count(),
                ];
            })
            ->values();

        $openEvaluations = Evaluation::with('trimestre.schoolYear')
            ->whereDate('grade_entry_deadline', '>=', now()->toDateString())
            ->latest()
            ->take(5)
            ->get();

        $closedEvaluations = Evaluation::with('trimestre.schoolYear')
            ->whereDate('grade_entry_deadline', '<', now()->toDateString())
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Teacher/Dashboard', [
            'teacher' => $teacher,
            'stats' => [
                'classes' => $classes->count(),
                'subjects' => $subjects->count(),
                'sections' => $assignments->pluck('section_id')->unique()->count(),
                'assignments' => $assignments->count(),
                'openEvaluations' => $openEvaluations->count(),
            ],
            'classes' => $classes,
            'subjects' => $subjects,
            'openEvaluations' => $openEvaluations,
            'closedEvaluations' => $closedEvaluations,
        ]);
    }
}