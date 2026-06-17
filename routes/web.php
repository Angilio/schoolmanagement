<?php

use App\Http\Controllers\Admin\AcademicController;
use App\Http\Controllers\ClasseController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\Teacher\DashboardController as TeacherDashboardController;
use App\Http\Controllers\Teacher\NoteEntryController;
use App\Http\Controllers\Admin\BulletinController as AdminBulletinController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Student\BulletinController as StudentBulletinController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

use Spatie\Permission\Models\Role;
use App\Models\User;

Route::get('/', [HomeController::class, 'index'])
    ->name('welcome');

Route::get('/dashboard', function () {

    return Inertia::render('Dashboard');

})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo.update');

});

Route::middleware(['auth', 'role:Admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        /*
        |--------------------------------------------------------------------------
        | DASHBOARD
        |--------------------------------------------------------------------------
        */

        Route::get('/dashboard', [DashboardController::class, 'index'])
            ->name('dashboard');

        /*
        |--------------------------------------------------------------------------
        | CLASSES
        |--------------------------------------------------------------------------
        */

        Route::resource('classes', ClasseController::class)->only([
            'index',
            'store',
            'update',
            'destroy'
        ]);

        /*
        |--------------------------------------------------------------------------
        | SECTIONS
        |--------------------------------------------------------------------------
        */

        Route::resource('sections', SectionController::class)->only([
            'index',
            'store',
            'update',
            'destroy'
        ]);

        /*
        |--------------------------------------------------------------------------
        | SERIES
        |--------------------------------------------------------------------------
        */

        Route::post('/sections/series', [
            SectionController::class,
            'storeSerie'
        ]);

        Route::put('/sections/series/{id}', [
            SectionController::class,
            'updateSerie'
        ]);

        Route::delete('/sections/series/{id}', [
            SectionController::class,
            'destroySerie'
        ]);

        /*
        |--------------------------------------------------------------------------
        | SUBJECTS
        |--------------------------------------------------------------------------
        */

        Route::resource('subjects', SubjectController::class)->only([
            'index',
            'store',
            'update',
            'destroy'
        ]);

        /*
        |--------------------------------------------------------------------------
        | TEACHERS
        |--------------------------------------------------------------------------
        */

        Route::resource('teachers', TeacherController::class)->only([
            'index',
            'store',
            'update',
            'destroy'
        ]);

        /*
        |--------------------------------------------------------------------------
        | STUDENTS
        |--------------------------------------------------------------------------
        */

        Route::resource('students', StudentController::class)->only([
            'index',
            'store',
            'update',
            'destroy'
        ]);

        /*
        |--------------------------------------------------------------------------
        | ACADEMIC MODULE
        |--------------------------------------------------------------------------
        */

        Route::prefix('academic')
            ->name('academic.')
            ->controller(AcademicController::class)
            ->group(function () {

                /*
                |--------------------------------------------------------------------------
                | DASHBOARD
                |--------------------------------------------------------------------------
                */

                Route::get('/', 'index')
                    ->name('index');

                /*
                |--------------------------------------------------------------------------
                | SCHOOL YEARS
                |--------------------------------------------------------------------------
                */

                Route::post('/school-years', 'storeSchoolYear')
                    ->name('school-years.store');

                Route::put('/school-years/{schoolYear}', 'updateSchoolYear')
                    ->name('school-years.update');

                Route::delete('/school-years/{schoolYear}', 'destroySchoolYear')
                    ->name('school-years.destroy');

                /*
                |--------------------------------------------------------------------------
                | TRIMESTRES
                |--------------------------------------------------------------------------
                */

                Route::post('/trimestres', 'storeTrimestre')
                    ->name('trimestres.store');

                Route::put('/trimestres/{trimestre}', 'updateTrimestre')
                    ->name('trimestres.update');

                Route::delete('/trimestres/{trimestre}', 'destroyTrimestre')
                    ->name('trimestres.destroy');

                /*
                |--------------------------------------------------------------------------
                | EVENTS
                |--------------------------------------------------------------------------
                */

                Route::post('/events', 'storeEvent')
                    ->name('events.store');

                Route::put('/events/{event}', 'updateEvent')
                    ->name('events.update');

                Route::delete('/events/{event}', 'destroyEvent')
                    ->name('events.destroy');

            });

        Route::resource('evaluations', EvaluationController::class)
            ->except(['show', 'create', 'edit']);
        
        //bulletins
        Route::get('/bulletins', [AdminBulletinController::class, 'index'])
            ->name('bulletins.index');

        Route::post('/bulletins/generate', [AdminBulletinController::class, 'generate'])
            ->name('bulletins.generate');

        Route::get('/bulletins/archive-pdf', [AdminBulletinController::class, 'archivePdf'])
            ->name('bulletins.archive-pdf');

        Route::get('/bulletins/archives/{archive}/download', [AdminBulletinController::class, 'downloadArchive'])
            ->name('bulletins.archives.download');

        Route::get('/bulletins/{bulletin}', [AdminBulletinController::class, 'show'])
            ->name('bulletins.show');

    });

    // Route::middleware(['auth', 'role:Enseignant'])
    // ->prefix('teacher')
    // ->name('teacher.')
    // ->group(function () {
    //     Route::get('/dashboard', [TeacherDashboardController::class, 'index'])
    //         ->name('dashboard');
    // });

    Route::middleware(['auth', 'role:Enseignant'])
    ->prefix('teacher')
    ->name('teacher.')
    ->group(function () {
        Route::get('/dashboard', [TeacherDashboardController::class, 'index'])
            ->name('dashboard');

        Route::get('/notes', [NoteEntryController::class, 'index'])
            ->name('notes.index');

        Route::post('/notes', [NoteEntryController::class, 'store'])
            ->name('notes.store');
    });


    Route::middleware(['auth'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        Route::get('/bulletins', [StudentBulletinController::class, 'index'])
            ->name('bulletins.index');

        Route::get('/bulletins/{bulletin}', [StudentBulletinController::class, 'show'])
            ->name('bulletins.show');
    });

require __DIR__ . '/auth.php';