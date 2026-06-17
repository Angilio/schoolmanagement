<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Bulletin;
use App\Models\Student;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class BulletinController extends Controller
{
    public function index(): Response
    {
        $student = $this->currentStudent();

        return Inertia::render('Student/Bulletins/Index', [
            'student' => $student->load(['user', 'classe', 'section', 'serie']),

            'bulletins' => Bulletin::with([
                'trimestre.schoolYear',
                'details.subject',
            ])
                ->where('student_id', $student->id)
                ->latest()
                ->get(),
        ]);
    }

    public function show(Bulletin $bulletin): Response
    {
        $student = $this->currentStudent();

        abort_if((int) $bulletin->student_id !== (int) $student->id, 403);

        $bulletin->load([
            'student.user',
            'student.classe',
            'student.section',
            'student.serie',
            'trimestre.schoolYear',
            'details.subject',
        ]);

        return Inertia::render('Student/Bulletins/Show', [
            'bulletin' => $bulletin,
        ]);
    }

    private function currentStudent(): Student
    {
        return Student::where('user_id', Auth::id())
            ->firstOrFail();
    }
}
