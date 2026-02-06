<?php

namespace App\Services;

use App\Models\Borrower;
use Carbon\Carbon;

class CreditScoreService
{
    public function calculateCreditScore(Borrower $borrower): array
    {
        $loans = $borrower->loans()->with('payment_schedules.payment_histories')->get();

        if ($loans->isEmpty()) {
            return [
                'score' => 0,
                'rating' => 'No History',
                'factors' => [
                    'payment_history' => 0,
                    'credit_utilization' => 0,
                    'loan_performance' => 0,
                    'account_age' => 0,
                ],
                'insights' => [],
            ];
        }

        // 1. Payment History Score (40% weight) - max 40 points
        $paymentHistoryScore = $this->calculatePaymentHistoryScore($loans);

        // 2. Credit Utilization Score (25% weight) - max 25 points
        $utilizationScore = $this->calculateUtilizationScore($loans);

        // 3. Loan Performance Score (25% weight) - max 25 points
        $performanceScore = $this->calculatePerformanceScore($loans);

        // 4. Account Age Score (10% weight) - max 10 points
        $accountAgeScore = $this->calculateAccountAgeScore($loans);

        // Total Score
        $totalScore = $paymentHistoryScore + $utilizationScore + $performanceScore + $accountAgeScore;

        // Rating
        $rating = $this->getRating($totalScore);

        // Generate insights
        $insights = $this->generateInsights($paymentHistoryScore, $utilizationScore, $totalScore);

        return [
            'score' => round($totalScore),
            'rating' => $rating,
            'factors' => [
                'payment_history' => round($paymentHistoryScore),
                'credit_utilization' => round($utilizationScore),
                'loan_performance' => round($performanceScore),
                'account_age' => round($accountAgeScore),
            ],
            'insights' => $insights,
        ];
    }

    private function calculatePaymentHistoryScore($loans): float
    {
        $allSchedules = $loans->flatMap->payment_schedules;
        $totalPayments = $allSchedules->count();

        if ($totalPayments === 0) {
            return 0;
        }

        $paidOnTime = $allSchedules->filter(function ($schedule) {
            return $schedule->status === 'paid' && $schedule->penalty_amount == 0;
        })->count();

        $latePayments = $allSchedules->filter(function ($schedule) {
            return $schedule->penalty_amount > 0;
        })->count();

        $missedPayments = $allSchedules->filter(function ($schedule) {
            return $schedule->status === 'overdue' ||
                   ($schedule->status === 'pending' && Carbon::parse($schedule->due_date)->isPast());
        })->count();

        $onTimeRate = $paidOnTime / $totalPayments;
        $lateRate = $latePayments / $totalPayments;
        $missedRate = $missedPayments / $totalPayments;

        $score = 40 * $onTimeRate - 20 * $lateRate - 30 * $missedRate;

        return max(0, min(40, $score));
    }

    private function calculateUtilizationScore($loans): float
    {
        $totalBorrowed = $loans->sum('amount');
        $totalRemaining = $loans->sum('remaining_balance');

        if ($totalBorrowed == 0) {
            return 25;
        }

        $utilizationRate = $totalRemaining / $totalBorrowed;

        if ($utilizationRate > 0.8) {
            return 10;
        } elseif ($utilizationRate > 0.5) {
            return 15;
        } elseif ($utilizationRate > 0.3) {
            return 20;
        }

        return 25;
    }

    private function calculatePerformanceScore($loans): float
    {
        $totalPenalties = $loans->sum('total_penalties');
        $totalRebates = $loans->sum('total_rebates');
        $paidLoans = $loans->where('status', 'paid')->count();
        $activeLoans = $loans->where('status', 'active')->count();

        $score = 15;

        if ($paidLoans > 0) {
            $score += 5;
        }

        if ($totalPenalties == 0) {
            $score += 3;
        }

        if ($totalRebates > 0) {
            $score += 2;
        }

        if ($activeLoans > 3) {
            $score -= 5;
        }

        return max(0, min(25, $score));
    }

    private function calculateAccountAgeScore($loans): float
    {
        $oldestLoan = $loans->min('transaction_date');

        if (!$oldestLoan) {
            return 0;
        }

        $monthsSinceFirst = Carbon::parse($oldestLoan)->diffInMonths(now());

        return min(10, ($monthsSinceFirst / 12) * 10);
    }

    private function getRating(float $score): string
    {
        if ($score >= 90) {
            return 'Excellent';
        } elseif ($score >= 75) {
            return 'Very Good';
        } elseif ($score >= 60) {
            return 'Good';
        } elseif ($score >= 45) {
            return 'Fair';
        }

        return 'Poor';
    }

    private function generateInsights(float $paymentHistory, float $utilization, float $totalScore): array
    {
        $insights = [];

        if ($paymentHistory < 30) {
            $insights[] = [
                'type' => 'warning',
                'title' => 'Improve Payment History',
                'message' => 'Pay on time to boost your score',
            ];
        }

        if ($utilization < 15) {
            $insights[] = [
                'type' => 'warning',
                'title' => 'High Credit Utilization',
                'message' => 'Pay down existing loans',
            ];
        }

        if ($totalScore >= 75) {
            $insights[] = [
                'type' => 'success',
                'title' => 'Excellent Standing',
                'message' => 'Keep up the good work!',
            ];
        }

        return $insights;
    }
}