<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolYear extends Model
{
    protected $fillable = [
        'year',
        'active'
    ];

    public function bulletins()
    {
        return $this->hasMany(Bulletin::class);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    public function trimestres()
    {
        return $this->hasMany(Trimestre::class);
    }

    public function academicEvents()
    {
        return $this->hasMany(AcademicEvent::class);
    }
}