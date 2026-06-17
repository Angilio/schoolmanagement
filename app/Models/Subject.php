<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'name',
        'coefficient'
    ];

    public function bulletinDetails()
    {
        return $this->hasMany(BulletinDetail::class);
    }

    public function teacherSubjects()
    {
        return $this->hasMany(TeacherSubject::class);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }
}