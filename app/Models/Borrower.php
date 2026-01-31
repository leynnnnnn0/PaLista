<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use OwenIt\Auditing\Contracts\Auditable;


class Borrower extends Model implements Auditable
{
    /** @use HasFactory<\Database\Factories\BorrowerFactory> */
    use HasFactory, \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'contact_number',
        'email',
        'address',
        'city',
        'province',
        'zip_code',
        'country'
    ];

    protected $appends = ['full_name'];

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function loans()
    {
        return $this->hasMany(Loan::class);
    }

    public function documents()
    {
        return $this->hasMany(BorrowerDocument::class);
    }

    public function references()
    {
        return $this->hasOne(BorrowerReference::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($borrower) {

            if (empty($borrower->user_id)) {

                $borrower->user_id = Auth::id();
            }
        });
    }
}
