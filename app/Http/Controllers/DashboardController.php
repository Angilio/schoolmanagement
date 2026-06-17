<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\Classe;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $studentsCount = Student::count();
        $teachersCount = Teacher::count();
        $subjectsCount = Subject::count();
        $classesCount = Classe::count();

        // Élèves par classe selon la nouvelle structure :
        // students.classe_id -> classes.id
        $studentsByClass = Classe::withCount('students')
            ->orderBy('name')
            ->get()
            ->map(function ($classe) {
                return [
                    'name' => $classe->name,
                    'count' => $classe->students_count,
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'students' => $studentsCount,
                'teachers' => $teachersCount,
                'subjects' => $subjectsCount,
                'classes' => $classesCount,
            ],

            'studentsByClass' => $studentsByClass,
        ]);
    }
}