<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class BorrowerReference extends Model implements Auditable
{
    /** @use HasFactory<\Database\Factories\BorrowerReferenceFactory> */
    use HasFactory, \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'borrower_id',
        'name',
        'contact_number',
    ];

    public function borrower()
    {
        return $this->belongsTo(Borrower::class);
    }
}
