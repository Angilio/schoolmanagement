<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use App\Models\Trimestre;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EvaluationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Evaluations/Index', [
            'evaluations' => Evaluation::with([
                    'trimestre.schoolYear',
                ])
                ->latest()
                ->get(),

            'trimestres' => Trimestre::with('schoolYear')
                ->orderBy('school_year_id')
                ->orderBy('start_date')
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'trimestre_id' => ['required', 'exists:trimestres,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'grade_entry_deadline' => ['required', 'date', 'after_or_equal:start_date'],
        ]);

        Evaluation::create([
            'title' => $request->title,
            'trimestre_id' => $request->trimestre_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'grade_entry_deadline' => $request->grade_entry_deadline,
        ]);

        return redirect()
            ->route('admin.evaluations.index')
            ->with('success', 'Évaluation créée avec succès.');
    }

    public function update(Request $request, Evaluation $evaluation): RedirectResponse
    {
        $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'trimestre_id' => ['required', 'exists:trimestres,id'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'grade_entry_deadline' => ['required', 'date', 'after_or_equal:start_date'],
        ]);

        $evaluation->update([
            'title' => $request->title,
            'trimestre_id' => $request->trimestre_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'grade_entry_deadline' => $request->grade_entry_deadline,
        ]);

        return redirect()
            ->route('admin.evaluations.index')
            ->with('success', 'Évaluation modifiée avec succès.');
    }

    public function destroy(Evaluation $evaluation): RedirectResponse
    {
        $evaluation->delete();

        return redirect()
            ->route('admin.evaluations.index')
            ->with('success', 'Évaluation supprimée avec succès.');
    }
}