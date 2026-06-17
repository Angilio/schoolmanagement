<?php

namespace App\Http\Controllers;

use App\Models\Classe;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClasseController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Classes/Index', [
            'classes' => Classe::withCount('students')
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:classes,name',
            ],
        ]);

        Classe::create([
            'name' => $request->name,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Classe ajoutée avec succès.');
    }

    public function update(Request $request, Classe $class)
    {
        $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                'unique:classes,name,' . $class->id,
            ],
        ]);

        $class->update([
            'name' => $request->name,
        ]);

        return redirect()
            ->back()
            ->with('success', 'Classe modifiée avec succès.');
    }

    public function destroy(Classe $class)
    {
        if ($class->students()->exists()) {
            return redirect()
                ->back()
                ->with('error', 'Impossible de supprimer cette classe car elle contient des élèves.');
        }

        $class->delete();

        return redirect()
            ->back()
            ->with('success', 'Classe supprimée avec succès.');
    }
}