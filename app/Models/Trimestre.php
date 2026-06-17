<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Trimestre extends Model
{
    protected $fillable = [
            'name',
            'school_year_id',
            'start_date',
            'end_date'
        ];

    public function bulletins()
    {
        return $this->hasMany(Bulletin::class);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class);
    }
}