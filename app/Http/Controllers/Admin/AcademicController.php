<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AcademicEvent;
use App\Models\SchoolYear;
use App\Models\Trimestre;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        return Inertia::render('Admin/Academic/Index', [

            'schoolYears' => SchoolYear::latest()->get(),

            'trimestres' => Trimestre::with('schoolYear')
                ->latest()
                ->get(),

            'events' => AcademicEvent::with('schoolYear')
                ->latest()
                ->get()

        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | SCHOOL YEARS
    |--------------------------------------------------------------------------
    */

    public function storeSchoolYear(Request $request)
    {
        $request->validate([
            'year' => 'required|unique:school_years'
        ]);

        SchoolYear::create([
            'year' => $request->year,
            'active' => false
        ]);

        return back();
    }

    public function updateSchoolYear(Request $request, SchoolYear $schoolYear)
    {
        $request->validate([
            'year' => 'required|unique:school_years,year,' . $schoolYear->id
        ]);

        $schoolYear->update([
            'year' => $request->year
        ]);

        return back();
    }

    public function destroySchoolYear(SchoolYear $schoolYear)
    {
        $schoolYear->delete();

        return back();
    }

    /*
    |--------------------------------------------------------------------------
    | TRIMESTRES
    |--------------------------------------------------------------------------
    */

    public function storeTrimestre(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'school_year_id' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);

        Trimestre::create($request->all());

        return back();
    }

    public function updateTrimestre(Request $request, Trimestre $trimestre)
    {
        $request->validate([
            'name' => 'required',
            'school_year_id' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date'
        ]);

        $trimestre->update($request->all());

        return back();
    }

    public function destroyTrimestre(Trimestre $trimestre)
    {
        $trimestre->delete();

        return back();
    }

    /*
    |--------------------------------------------------------------------------
    | EVENTS
    |--------------------------------------------------------------------------
    */

    public function storeEvent(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'school_year_id' => 'required',
            'start_date' => 'required|date'
        ]);

        AcademicEvent::create($request->all());

        return back();
    }

    public function updateEvent(Request $request, AcademicEvent $event)
    {
        $request->validate([
            'title' => 'required',
            'school_year_id' => 'required',
            'start_date' => 'required|date'
        ]);

        $event->update($request->all());

        return back();
    }

    public function destroyEvent(AcademicEvent $event)
    {
        $event->delete();

        return back();
    }
}