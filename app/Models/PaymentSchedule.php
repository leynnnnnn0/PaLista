<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class PaymentSchedule extends Model implements Auditable
{
    /** @use HasFactory<\Database\Factories\PaymentScheduleFactory> */
    use HasFactory, \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'loan_id',
        'due_date',
        'amount_due',
        'rebate_amount',
        'penalty_amount',
        'rebate_remarks',
        'penalty_remarks',
        'status',
    ];

        protected $appends = ['total_due'];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }

    public function getTotalDueAttribute()
    {
        return $this->amount_due - $this->rebate_amount + $this->penalty_amount;
    }

    public function payment_histories()
    {
        return $this->hasMany(PaymentHistory::class);
    }
}
