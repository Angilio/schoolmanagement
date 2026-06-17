<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BulletinArchive extends Model
{
    protected $fillable = [
        'school_year_id',
        'classe_id',
        'section_id',
        'serie_id',
        'file_path',
        'filters',
        'generated_by',
        'generated_at',
    ];

    protected $casts = [
        'filters' => 'array',
        'generated_at' => 'datetime',
    ];

    public function schoolYear()
    {
        return $this->belongsTo(SchoolYear::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function serie()
    {
        return $this->belongsTo(Serie::class);
    }

    public function generator()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}