<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use OwenIt\Auditing\Contracts\Auditable;

class Loan extends Model implements Auditable
{
    /** @use HasFactory<\Database\Factories\LoanFactory> */
    use HasFactory, \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'borrower_id',
        'amount',
        'interest_type',
        'interest_value',
        'interest_period',
        'loan_duration',
        'duration_unit',
        'payment_frequency',
        'transaction_date',
        'is_voided',
        'voided_at',
        'void_reason',
        'status',
    ];

    protected $appends = ['total_amount', 'interest', 'remaining_balance', 'duration', 'frequency', 'total_penalties', 'total_rebates'];

    public function getFrequencyAttribute()
    {
        return Str::of($this->interest_period)
            ->replace('_', ' ')
            ->upper()
            ->value();
    }

    public function getDurationAttribute()
    {
        return "{$this->loan_duration} {$this->duration_unit}";
    }

    public function getInterestAttribute()
    {
        $principal = $this->amount;
        $interestValue = $this->interest_value;
        $duration = $this->loan_duration;

        if ($this->interest_period === 'total') {
            // Original calculation - interest for entire loan
            if ($this->interest_type === 'percentage') {
                return ($principal * $interestValue) / 100;
            } else {
                return $interestValue;
            }
        } else {
            // Per-period interest calculation
            $periods = 0;

            // Convert duration to the interest period unit
            if ($this->interest_period === 'per_day') {
                if ($this->duration_unit === 'days') $periods = $duration;
                elseif ($this->duration_unit === 'weeks') $periods = $duration * 7;
                elseif ($this->duration_unit === 'months') $periods = $duration * 30;
            } elseif ($this->interest_period === 'per_week') {
                if ($this->duration_unit === 'days') $periods = $duration / 7;
                elseif ($this->duration_unit === 'weeks') $periods = $duration;
                elseif ($this->duration_unit === 'months') $periods = $duration * 4;
            } elseif ($this->interest_period === 'per_month') {
                if ($this->duration_unit === 'days') $periods = $duration / 30;
                elseif ($this->duration_unit === 'weeks') $periods = $duration / 4;
                elseif ($this->duration_unit === 'months') $periods = $duration;
            }

            if ($this->interest_type === 'percentage') {
                return ($principal * $interestValue * $periods) / 100;
            } else {
                return $interestValue * $periods;
            }
        }
    }

    public function getTotalAmountAttribute()
    {
        return ($this->amount + $this->interest);
    }

    public function getTotalPenaltiesAttribute()
    {
        // Sum all penalties from payment schedules
        return $this->payment_schedules()
            ->sum('penalty_amount') ?? 0;
    }

    public function getTotalRebatesAttribute()
    {
        // Sum all rebates from payment schedules
        return $this->payment_schedules()
            ->sum('rebate_amount') ?? 0;
    }

    public function getRemainingBalanceAttribute()
    {
        // Get total amount due (principal + interest)
        $totalAmount = $this->total_amount;

        // Add penalties
        $totalPenalties = $this->total_penalties;

        // Subtract rebates
        $totalRebates = $this->total_rebates;

        // Calculate adjusted total amount
        $adjustedTotal = $totalAmount + $totalPenalties - $totalRebates;

        // Calculate total paid from all payment histories across all schedules
        $totalPaid = $this->payment_schedules()
            ->with('payment_histories')
            ->get()
            ->flatMap(function ($schedule) {
                return $schedule->payment_histories;
            })
            ->sum('amount_paid');

        // Remaining balance = (Total + Penalties - Rebates) - Total Paid
        $remaining = $adjustedTotal - $totalPaid;

        return max(0, $remaining); // Ensure it doesn't go negative
    }

    public function borrower()
    {
        return $this->belongsTo(Borrower::class);
    }

    public function payment_schedules()
    {
        return $this->hasMany(PaymentSchedule::class);
    }

    /**
     * Boot method to set default values
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($loan) {
            // Set initial status if not provided
            if (empty($loan->status)) {
                $loan->status = 'active';
            }
        });
    }
}
