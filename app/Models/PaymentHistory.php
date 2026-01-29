<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class PaymentHistory extends Model implements Auditable
{
    /** @use HasFactory<\Database\Factories\PaymentHistoryFactory> */
    use HasFactory, \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'payment_schedule_id',
        'amount_paid',
        'payment_method',
        'reference_number',
        'receipt_number',
        'payment_date',
    ];

    public function payment_schedule()
    {
        return $this->belongsTo(PaymentSchedule::class);
    }
}
