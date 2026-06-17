<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\User;
use App\Models\Section;
use App\Models\Classe;
use App\Models\Serie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Students/Index', [
            'students' => Student::with([
                'user',
                'classe',
                'section',
                'serie',
            ])->latest()->get(),

            'classes' => Classe::orderBy('name')->get(),
            'sections' => Section::orderBy('name')->get(),
            'series' => Serie::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'classe_id' => ['required', 'exists:classes,id'],
            'section_id' => ['required', 'exists:sections,id'],
            'serie_id' => ['nullable', 'exists:series,id'],
            'birthdate' => ['nullable', 'date'],
        ]);

        DB::transaction(function () use ($request) {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt('12345678'),
            ]);

            Student::create([
                'user_id' => $user->id,
                'classe_id' => $request->classe_id,
                'section_id' => $request->section_id,
                'serie_id' => $request->serie_id ?: null,
                'birthdate' => $request->birthdate,
                'matricule' => $this->generateMatricule(),
            ]);
        });

        return back()->with('success', 'Élève créé avec succès.');
    }

    public function update(Request $request, Student $student)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($student->user_id),
            ],
            'classe_id' => ['required', 'exists:classes,id'],
            'section_id' => ['required', 'exists:sections,id'],
            'serie_id' => ['nullable', 'exists:series,id'],
            'birthdate' => ['nullable', 'date'],
        ]);

        DB::transaction(function () use ($request, $student) {
            $student->user->update([
                'name' => $request->name,
                'email' => $request->email,
            ]);

            $student->update([
                'classe_id' => $request->classe_id,
                'section_id' => $request->section_id,
                'serie_id' => $request->serie_id ?: null,
                'birthdate' => $request->birthdate,
            ]);
        });

        return back()->with('success', 'Élève modifié avec succès.');
    }

    public function destroy(Student $student)
    {
        DB::transaction(function () use ($student) {
            $user = $student->user;

            $student->delete();

            if ($user) {
                $user->delete();
            }
        });

        return back()->with('success', 'Élève supprimé avec succès.');
    }

    private function generateMatricule(): string
    {
        do {
            $matricule = 'STU' . date('Y') . rand(1000, 9999);
        } while (Student::where('matricule', $matricule)->exists());

        return $matricule;
    }
}