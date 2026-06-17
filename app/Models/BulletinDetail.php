<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BulletinDetail extends Model
{
    protected $fillable = [
        'bulletin_id',
        'subject_id',
        'average',
        'coefficient',
        'weighted_average',
        'appreciation',
    ];

    protected $casts = [
        'average' => 'decimal:2',
        'coefficient' => 'integer',
        'weighted_average' => 'decimal:2',
    ];

    public function bulletin()
    {
        return $this->belongsTo(Bulletin::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}