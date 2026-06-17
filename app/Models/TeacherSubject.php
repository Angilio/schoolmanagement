<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TeacherSubject extends Model
{
    use HasFactory;

    protected $fillable = [
        'teacher_id',
        'subject_id',
        'classe_id',
        'serie_id',
        'section_id',
    ];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function serie()
    {
        return $this->belongsTo(Serie::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function evaluations()
    {
        return $this->belongsToMany(Evaluation::class, 'evaluation_teacher_subject')
            ->withTimestamps();
    }
}