<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromissoryNote extends Model
{
    /** @use HasFactory<\Database\Factories\PromissoryNoteFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'lender',
        'penalty_percentage'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
