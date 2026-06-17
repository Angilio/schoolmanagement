<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bulletin extends Model
{
    protected $fillable = [
        'student_id',
        'trimestre_id',
        'school_year_id',
        'moyenne',
        'rang',
    ];

    protected $casts = [
        'moyenne' => 'decimal:2',
        'rang' => 'integer',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function trimestre()
    {
        return $this->belongsTo(Trimestre::class);
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class);
    }

    public function details()
    {
        return $this->hasMany(BulletinDetail::class);
    }
}