<?php

namespace App\Http\Controllers;

use App\Models\Section;
use App\Models\Serie;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SectionController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Sections/Index', [
            'sections' => Section::withCount('students')
                ->latest()
                ->get(),

            'series' => Serie::withCount('students')
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:sections,name'],
        ]);

        Section::create([
            'name' => $request->name,
        ]);

        return back()->with('success', 'Section créée avec succès.');
    }

    public function update(Request $request, $id)
    {
        $section = Section::findOrFail($id);

        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:sections,name,' . $section->id],
        ]);

        $section->update([
            'name' => $request->name,
        ]);

        return back()->with('success', 'Section modifiée avec succès.');
    }

    public function destroy($id)
    {
        $section = Section::findOrFail($id);

        if ($section->students()->exists()) {
            return back()->with('error', 'Impossible de supprimer cette section car elle contient des élèves.');
        }

        $section->delete();

        return back()->with('success', 'Section supprimée avec succès.');
    }

    public function storeSerie(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:series,name'],
        ]);

        Serie::create([
            'name' => $request->name,
        ]);

        return back()->with('success', 'Série créée avec succès.');
    }

    public function updateSerie(Request $request, $id)
    {
        $serie = Serie::findOrFail($id);

        $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:series,name,' . $serie->id],
        ]);

        $serie->update([
            'name' => $request->name,
        ]);

        return back()->with('success', 'Série modifiée avec succès.');
    }

    public function destroySerie($id)
    {
        $serie = Serie::findOrFail($id);

        if ($serie->students()->exists()) {
            return back()->with('error', 'Impossible de supprimer cette série car elle contient des élèves.');
        }

        $serie->delete();

        return back()->with('success', 'Série supprimée avec succès.');
    }
}