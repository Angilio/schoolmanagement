<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AcademicEvent extends Model
{
    protected $fillable = [
        'school_year_id',
        'title',
        'description',
        'start_date',
        'end_date'
    ];

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class);
    }
}