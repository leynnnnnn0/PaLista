<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;
class BorrowerDocument extends Model implements Auditable
{
    /** @use HasFactory<\Database\Factories\BorrowerDocumentFactory> */
    use HasFactory, \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'borrower_id',
        'file_name',
        'file_path',
        'file_size',
        'mime_type'
    ];

    public function borrower()
    {
        return $this->belongsTo(Borrower::class);
    }
}
