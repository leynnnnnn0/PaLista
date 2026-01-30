<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Borrower;
use App\Models\Loan;
use App\Models\PaymentSchedule;
use App\Models\PaymentHistory;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use phpDocumentor\Reflection\DocBlock\Tags\See;

class DatabaseSeeder extends Seeder
{
    private $totalLent = 0;
    private $totalInterest = 0;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('password'),
        ]);

        $this->seed();
        
    }

    public function seed(){
        // Create borrowers
        $borrowers = [];
        for ($i = 1; $i <= 10; $i++) {
            $borrowers[] = Borrower::create([
                'first_name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'email' => fake()->unique()->safeEmail(),
                'contact_number' => fake()->numerify('09#########'),
                'address' => fake()->streetAddress(),
                'city' => fake()->city(),
                'province' => fake()->randomElement([
                    'Metro Manila',
                    'Cavite',
                    'Laguna',
                    'Batangas',
                    'Rizal',
                    'Bulacan',
                    'Pampanga',
                    'Cebu',
                    'Davao'
                ]),
                'zip_code' => fake()->numerify('####'),
                'country' => 'PHILIPPINES',
            ]);
        }

        // Interest types and values
        $interestTypes = ['fixed', 'percentage'];
        $paymentFrequencies = ['daily', 'weekly', 'monthly'];
        $durationUnits = ['days', 'weeks', 'months'];
        $interestPeriods = ['total', 'per_day', 'per_week', 'per_month'];
        $statuses = ['active', 'completed', 'voided'];
        $paymentMethods = ['cash', 'bank_transfer', 'gcash', 'paymaya', 'check'];

        // Create 30 loans
        for ($i = 1; $i <= 10; $i++) {
            $borrower = $borrowers[array_rand($borrowers)];

            // Random loan parameters with realistic ranges
            $principalAmount = fake()->randomFloat(2, 5000, 100000);
            $interestType = fake()->randomElement($interestTypes);

            // Adjusted interest values to be within reasonable ranges
            if ($interestType === 'fixed') {
                $interestValue = fake()->randomFloat(2, 100, 2000); // Fixed: ₱100-₱2000
            } else {
                $interestValue = fake()->randomFloat(2, 1, 15); // Percentage: 1%-15%
            }

            $paymentFrequency = fake()->randomElement($paymentFrequencies);
            $durationUnit = fake()->randomElement($durationUnits);

            // Adjusted loan duration based on unit
            if ($durationUnit === 'days') {
                $loanDuration = fake()->numberBetween(7, 90); // 7-90 days
            } elseif ($durationUnit === 'weeks') {
                $loanDuration = fake()->numberBetween(1, 12); // 1-12 weeks
            } else {
                $loanDuration = fake()->numberBetween(1, 12); // 1-12 months
            }

            $interestPeriod = fake()->randomElement($interestPeriods);

            // Transaction date (varied across past 6 months)
            $transactionDate = Carbon::now()->subDays(fake()->numberBetween(1, 25));

            // Random status with weights (more active loans)
            $statusWeights = [
                'active' => 8,
                'completed' => 1,
                'voided' => 1,
            ];
            $randomStatus = $this->weightedRandom($statusWeights);

            // Calculate interest amount
            $interestAmount = $this->calculateInterestAmount(
                $principalAmount,
                $interestType,
                $interestValue,
                $interestPeriod,
                $loanDuration,
                $durationUnit
            );

            // Calculate total amount
            $totalAmount = $principalAmount + $interestAmount;

            // Track totals
            $this->totalLent += $principalAmount;
            $this->totalInterest += $interestAmount;

            // Create loan
            $loan = Loan::create([
                'borrower_id' => $borrower->id,
                'amount' => $principalAmount,
                'interest_type' => $interestType,
                'interest_value' => $interestValue,
                'transaction_date' => $transactionDate,
                'payment_frequency' => $paymentFrequency,
                'loan_duration' => $loanDuration,
                'duration_unit' => $durationUnit,
                'interest_period' => $interestPeriod,
                'status' => $randomStatus,
                'is_voided' => $randomStatus === 'voided',
                'voided_at' => $randomStatus === 'voided' ? $transactionDate->copy()->addDays(fake()->numberBetween(1, 30)) : null,
                'void_reason' => $randomStatus === 'voided' ? fake()->sentence() : null,
            ]);

            // Generate payment schedules based on frequency
            $scheduleCount = $this->getScheduleCount($paymentFrequency, $loanDuration, $durationUnit);
            $amountPerSchedule = $totalAmount / $scheduleCount;

            $currentDate = $transactionDate->copy();

            // Track payment progress for sequential payments
            $paidSchedulesCount = 0;

            for ($j = 0; $j < $scheduleCount; $j++) {
                // Calculate due date based on frequency
                $dueDate = $this->calculateDueDate($currentDate, $paymentFrequency, $j + 1);

                // Add random penalties (20% chance, smaller amounts)
                $penaltyAmount = fake()->boolean(20) ? fake()->randomFloat(2, 50, 300) : 0;
                $penaltyRemarks = $penaltyAmount > 0 ? 'Late payment penalty' : null;

                // Determine schedule status based on loan status (SEQUENTIAL)
                $scheduleStatus = $this->determineScheduleStatusSequential(
                    $randomStatus,
                    $dueDate,
                    $j,
                    $scheduleCount,
                    $paidSchedulesCount
                );

                $paymentSchedule = PaymentSchedule::create([
                    'loan_id' => $loan->id,
                    'due_date' => $dueDate,
                    'amount_due' => $amountPerSchedule,
                    'penalty_amount' => $penaltyAmount,
                    'penalty_remarks' => $penaltyRemarks,
                    'status' => $scheduleStatus,
                ]);

                // Create payment histories for paid/partial schedules (SEQUENTIAL)
                if (in_array($scheduleStatus, ['paid', 'partial'])) {
                    $totalDue = $amountPerSchedule + $penaltyAmount;

                    if ($scheduleStatus === 'paid') {
                        // Full payment
                        $paymentSchedule->payment_histories()->create([
                            'amount_paid' => $totalDue,
                            'payment_method' => fake()->randomElement($paymentMethods),
                            'reference_number' => fake()->boolean(70) ? 'REF-' . fake()->numerify('##########') : null,
                            'receipt_number' => 'RCP-' . fake()->numerify('######'),
                            'payment_date' => $dueDate->copy()->addDays(fake()->numberBetween(-2, 5)),
                        ]);
                        $paidSchedulesCount++;
                    } else {
                        // Partial payment (50-90% of total due) - only on last paid schedule
                        $partialAmount = $totalDue * fake()->randomFloat(2, 0.5, 0.9);
                        $paymentSchedule->payment_histories()->create([
                            'amount_paid' => $partialAmount,
                            'payment_method' => fake()->randomElement($paymentMethods),
                            'reference_number' => fake()->boolean(70) ? 'REF-' . fake()->numerify('##########') : null,
                            'receipt_number' => 'RCP-' . fake()->numerify('######'),
                            'payment_date' => $dueDate->copy()->addDays(fake()->numberBetween(-2, 5)),
                        ]);
                    }
                }
            }

            // Add some borrower references (50% chance)
            if (fake()->boolean(50) && $borrower->references()->count() === 0) {
                $borrower->references()->create([
                    'name' => fake()->name(),
                    'contact_number' => fake()->numerify('09#########'),
                ]);
            }
        }

        // Output totals
        $this->command->info('==============================================');
        $this->command->info('Database Seeding Summary');
        $this->command->info('==============================================');
        $this->command->info('Total Loans Created: 30');
        $this->command->info('Total Amount Lent: ₱' . number_format($this->totalLent, 2));
        $this->command->info('Total Interest: ₱' . number_format($this->totalInterest, 2));
        $this->command->info('Total Expected Return: ₱' . number_format($this->totalLent + $this->totalInterest, 2));
        $this->command->info('==============================================');
    }

    /**
     * Calculate interest amount only
     */
    private function calculateInterestAmount($principal, $interestType, $interestValue, $interestPeriod, $duration, $durationUnit)
    {
        if ($interestPeriod === 'total') {
            // One-time interest
            if ($interestType === 'percentage') {
                return $principal * $interestValue / 100;
            } else {
                return $interestValue;
            }
        } else {
            // Per-period interest
            $periods = 0;

            // Convert duration to interest period unit
            if ($interestPeriod === 'per_day') {
                if ($durationUnit === 'days') $periods = $duration;
                elseif ($durationUnit === 'weeks') $periods = $duration * 7;
                elseif ($durationUnit === 'months') $periods = $duration * 30;
            } elseif ($interestPeriod === 'per_week') {
                if ($durationUnit === 'days') $periods = $duration / 7;
                elseif ($durationUnit === 'weeks') $periods = $duration;
                elseif ($durationUnit === 'months') $periods = $duration * 4;
            } elseif ($interestPeriod === 'per_month') {
                if ($durationUnit === 'days') $periods = $duration / 30;
                elseif ($durationUnit === 'weeks') $periods = $duration / 4;
                elseif ($durationUnit === 'months') $periods = $duration;
            }

            if ($interestType === 'percentage') {
                return $principal * $interestValue * $periods / 100;
            } else {
                return $interestValue * $periods;
            }
        }
    }

    /**
     * Calculate number of payment schedules
     */
    private function getScheduleCount($frequency, $duration, $unit): int
    {
        $multiplier = [
            'daily' => ['days' => 1, 'weeks' => 7, 'months' => 30],
            'weekly' => ['days' => 1 / 7, 'weeks' => 1, 'months' => 4],
            'monthly' => ['days' => 1 / 30, 'weeks' => 1 / 4, 'months' => 1],
        ];

        return max(1, (int)round($duration * $multiplier[$frequency][$unit]));
    }

    /**
     * Calculate due date based on payment frequency
     */
    private function calculateDueDate($startDate, $frequency, $period): Carbon
    {
        $date = $startDate->copy();

        switch ($frequency) {
            case 'daily':
                return $date->addDays($period);
            case 'weekly':
                return $date->addWeeks($period);
            case 'monthly':
                return $date->addMonths($period);
            default:
                return $date->addMonths($period);
        }
    }

    /**
     * Determine payment schedule status based on loan status (SEQUENTIAL)
     * Payments must be made in order - can't pay schedule 3 before paying schedule 1 and 2
     */
    private function determineScheduleStatusSequential($loanStatus, $dueDate, $index, $totalSchedules, &$paidCount): string
    {
        $today = Carbon::today();

        // Voided loans - all pending
        if ($loanStatus === 'voided') {
            return 'pending';
        }

        // Completed loans - all paid in sequence
        if ($loanStatus === 'completed') {
            return 'paid';
        }

        // Defaulted loans - some paid in sequence, then stopped
        if ($loanStatus === 'defaulted') {
            $defaultedAfter = (int)($totalSchedules * 0.3); // Paid first 30%
            return $index < $defaultedAfter ? 'paid' : 'pending';
        }

        // Active loans - realistic sequential payment progression
        if ($dueDate->isFuture()) {
            return 'pending';
        }

        if ($dueDate->isPast()) {
            $daysPast = $today->diffInDays($dueDate);

            // Can only be paid if all previous schedules are paid
            if ($paidCount < $index) {
                return 'pending'; // Previous payments not complete
            }

            // Old dues - high chance of being paid
            if ($daysPast > 30) {
                $isPaid = fake()->boolean(90); // 90% chance
                if ($isPaid) {
                    return 'paid';
                } else {
                    // Maybe partial payment on the last paid schedule
                    return $index > 0 && fake()->boolean(30) ? 'partial' : 'pending';
                }
            }

            // Recent dues (7-30 days past) - moderate chance
            if ($daysPast > 7) {
                $isPaid = fake()->boolean(70); // 70% chance
                if ($isPaid) {
                    return 'paid';
                } else {
                    return $index > 0 && fake()->boolean(40) ? 'partial' : 'pending';
                }
            }

            // Very recent (0-7 days past) - lower chance
            $isPaid = fake()->boolean(40); // 40% chance
            if ($isPaid) {
                return 'paid';
            } else {
                return $index > 0 && fake()->boolean(20) ? 'partial' : 'pending';
            }
        }

        return 'pending';
    }

    /**
     * Get weighted random value
     */
    private function weightedRandom($weights): string
    {
        $rand = mt_rand(1, array_sum($weights));

        foreach ($weights as $key => $weight) {
            $rand -= $weight;
            if ($rand <= 0) {
                return $key;
            }
        }

        return array_key_first($weights);
    }
}
