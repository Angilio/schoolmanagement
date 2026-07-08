<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Bulletin;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ParentDashboardController extends Controller
{
    public function index(): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $parentProfile = $user->parentProfile()
            ->with([
                'students.user',
                'students.classe',
                'students.section',
                'students.serie',
            ])
            ->first();

        $students = $parentProfile
            ? $parentProfile->students
            : collect();

        $studentIds = $students->pluck('id');

        $bulletins = Bulletin::with([
            'student.user',
            'student.classe',
            'student.section',
            'student.serie',
            'trimestre.schoolYear',
        ])
            ->whereIn('student_id', $studentIds)
            ->latest()
            ->take(10)
            ->get();

        $average = $studentIds->isNotEmpty()
            ? Bulletin::whereIn('student_id', $studentIds)
                ->whereNotNull('moyenne')
                ->avg('moyenne')
            : null;

        return Inertia::render('Parent/Dashboard', [
            'parent' => $user,
            'parentProfile' => $parentProfile,
            'students' => $students,
            'bulletins' => $bulletins,
            'stats' => [
                'children_count' => $students->count(),
                'bulletins_count' => Bulletin::whereIn('student_id', $studentIds)->count(),
                'average' => $average !== null ? round($average, 2) : null,
            ],
        ]);
    }

    public function showBulletin(Bulletin $bulletin): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $parentProfile = $user->parentProfile()->first();

        abort_if(!$parentProfile, 403);

        $isAllowed = $parentProfile->students()
            ->where('students.id', $bulletin->student_id)
            ->exists();

        abort_unless($isAllowed, 403);

        $bulletin->load([
            'student.user',
            'student.classe',
            'student.section',
            'student.serie',
            'trimestre.schoolYear',
            'details.subject',
        ]);

        return Inertia::render('Parent/BulletinShow', [
            'bulletin' => $bulletin,
        ]);
    }
}