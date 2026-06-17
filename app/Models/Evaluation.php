<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    protected $fillable = [
        'title',
        'trimestre_id',
        'start_date',
        'end_date',
        'grade_entry_deadline',
    ];

    public function trimestre()
    {
        return $this->belongsTo(Trimestre::class);
    }

    public function notes()
    {
        return $this->hasMany(NoteDetail::class);
    }
}