<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'classe_id',
        'serie_id',
        'section_id',
        'matricule',
        'birthdate',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function classe()
    {
        return $this->belongsTo(Classe::class, 'classe_id');
    }

    public function serie()
    {
        return $this->belongsTo(Serie::class, 'serie_id');
    }

    public function section()
    {
        return $this->belongsTo(Section::class, 'section_id');
    }

    public function bulletins()
    {
        return $this->hasMany(Bulletin::class);
    }

    public function notes()
    {
        return $this->hasMany(NoteDetail::class);
    }

    public function fullClassName(): string
    {
        return trim(
            ($this->classe?->name ?? '') . ' ' .
            ($this->serie?->name ?? '') . ' ' .
            ($this->section?->name ?? '')
        );
    }
}