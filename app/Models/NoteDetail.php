<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NoteDetail extends Model
{
    protected $fillable = [
        'evaluation_id',
        'teacher_subject_id',
        'student_id',
        'note',
        'coefficient',
        'weighted_note',
        'appreciation',
    ];

    protected $casts = [
        'note' => 'decimal:2',
        'weighted_note' => 'decimal:2',
        'coefficient' => 'integer',
    ];

    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }

    public function teacherSubject()
    {
        return $this->belongsTo(TeacherSubject::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}