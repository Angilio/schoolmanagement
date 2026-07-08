<?php

namespace App\Http\Controllers;

use App\Models\Bulletin;
use App\Models\Classe;
use App\Models\Evaluation;
use App\Models\SchoolYear;
use App\Models\Section;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Trimestre;
use App\Models\User;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class HomeController extends Controller
{
    public function index(): Response
    {
        // Role::firstOrCreate([
        //     'name' => 'Parent',
        //     'guard_name' => 'web',
        // ]);

        $user = Auth::user();

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,

            'dashboardUrl' => $user ? $this->getDashboardUrl($user) : null,

            'currentSchoolYear' => SchoolYear::latest('id')->first(),

            'stats' => [
                'students' => Student::count(),
                'teachers' => Teacher::count(),
                'classes' => Classe::count(),
                'sections' => Section::count(),
                'subjects' => Subject::count(),
                'evaluations' => Evaluation::count(),
                'bulletins' => Bulletin::count(),
                'users' => User::count(),
                'schoolYears' => SchoolYear::count(),
                'trimestres' => Trimestre::count(),
            ],

            'latestBulletins' => Bulletin::with([
                'student.user',
                'student.classe',
                'student.section',
                'student.serie',
                'trimestre.schoolYear',
            ])
                ->latest()
                ->take(4)
                ->get(),
        ]);
    }

    private function getDashboardUrl(User $user): string
    {
        if ($user->hasRole('Admin') && Route::has('admin.dashboard')) {
            return route('admin.dashboard');
        }

        if ($user->hasRole('Enseignant') && Route::has('teacher.dashboard')) {
            return route('teacher.dashboard');
        }

        if (Student::where('user_id', $user->id)->exists() && Route::has('student.bulletins.index')) {
            return route('student.bulletins.index');
        }

        return route('dashboard');
    }
}