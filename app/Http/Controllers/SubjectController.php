<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Subjects/Index', [
            'subjects' => Subject::latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'coefficient' => 'required|numeric|min:1'
        ]);

        Subject::create($request->all());

        return redirect()->back()->with('success', 'Matière ajoutée');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'coefficient' => 'required|numeric|min:1'
        ]);

        $subject = Subject::findOrFail($id);
        $subject->update($request->all());

        return redirect()->back()->with('success', 'Matière modifiée');
    }

    public function destroy($id)
    {
        Subject::findOrFail($id)->delete();

        return redirect()->back()->with('error', 'Matière supprimée');
    }
}