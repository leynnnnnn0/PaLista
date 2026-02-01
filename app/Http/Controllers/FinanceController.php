<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\PaymentSchedule;
use App\Models\PaymentHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class FinanceController extends Controller
{
    public function index(Request $request)
    {
        // Get date filters from request - default to current year
        $dateFrom = $request->input('date_from')
            ? Carbon::parse($request->input('date_from'))->startOfDay()
            : Carbon::now()->startOfYear();

        $dateTo = $request->input('date_to')
            ? Carbon::parse($request->input('date_to'))->endOfDay()
            : Carbon::now()->endOfYear();

        // Calculate Total Lent (sum of active loans within date range based on transaction_date)
        $totalLent = Loan::where('is_voided', false)
            ->where('user_id', Auth::id())
            ->whereBetween('transaction_date', [$dateFrom, $dateTo])
            ->sum('amount');

        // Calculate Total Interest (total_amount - principal amount)
        $totalInterest = Loan::where('is_voided', false)
            ->whereBetween('transaction_date', [$dateFrom, $dateTo])
            ->where('user_id', Auth::id())
            ->get()
            ->sum(function ($loan) {
                return $loan->total_amount - $loan->amount;
            });

        // Calculate Total Rebate (sum of all rebate_amount from payment schedules)
        $totalRebate = PaymentSchedule::whereHas('loan', function ($query) use ($dateFrom, $dateTo) {
            $query->where('is_voided', false)
                ->whereBetween('transaction_date', [$dateFrom, $dateTo]);
            $query->where('user_id', Auth::id());
        })
            ->sum('rebate_amount');

        // Calculate Total Penalties
        $totalPenalties = PaymentSchedule::whereHas('loan', function ($query) use ($dateFrom, $dateTo) {
            $query->where('is_voided', false)
                ->whereBetween('transaction_date', [$dateFrom, $dateTo]);
            $query->where('user_id', Auth::id());
        })
            ->sum('penalty_amount');

        // Calculate Expected Total Return (Total Lent + Total Interest - Total Rebate + Total Penalties)
        $expectedTotalReturn = $totalLent + $totalInterest - $totalRebate + $totalPenalties;

        // Calculate Total Paid (sum of payment histories within date range, excluding completed/cancelled loans)
        $totalPaid = PaymentHistory::whereBetween('payment_date', [$dateFrom, $dateTo])
            ->whereHas('payment_schedule.loan', function ($query) {
                $query->where('is_voided', false);
                $query->where('user_id', Auth::id());
            })
            ->sum('amount_paid');

        // Calculate Total Payables (sum of remaining balances for active loans only)
        $activeLoans = Loan::where('is_voided', false)
            ->where('user_id', Auth::id())
            ->get();

        $totalPayables = $activeLoans->sum('remaining_balance');

        // Calculate Net Profit (Total Paid - Total Lent) for active loans only
        $activeLentAmount = Loan::where('is_voided', false)
            ->where('user_id', Auth::id())
            ->sum('amount');

        $activeTotalPaid = PaymentHistory::whereHas('payment_schedule.loan', function ($query) {
            $query->where('is_voided', false);
            $query->where('user_id', Auth::id());
        })
            ->sum('amount_paid');

        $netProfit = $activeTotalPaid - $activeLentAmount;

        // Calculate Collection Rate (Total Paid / Expected Total Return * 100)
        $collectionRate = $expectedTotalReturn > 0
            ? ($totalPaid / $expectedTotalReturn) * 100
            : 0;

        // Calculate Average Loan Size
        $activeLoanCount = Loan::where('is_voided', false)
            ->where('user_id', Auth::id())
            ->whereBetween('transaction_date', [$dateFrom, $dateTo])
            ->count();

        $averageLoanSize = $activeLoanCount > 0
            ? $totalLent / $activeLoanCount
            : 0;

        // Get monthly data for the date range (Payables vs Actual Paid)
        $monthlyData = $this->getMonthlyPaymentData($dateFrom, $dateTo);

        // Get Payables Breakdown (Pending vs Overdue)
        $payablesBreakdown = $this->getPayablesBreakdown();

        // Get Loan Status Distribution
        $loanStatusDistribution = $this->getLoanStatusDistribution($dateFrom, $dateTo);

        // Get Top Borrowers by Outstanding Balance


        return Inertia::render('Finance/Index', [
            'metrics' => [
                'totalLent' => $totalLent,
                'totalInterest' => $totalInterest,
                'totalRebate' => $totalRebate,
                'totalPenalties' => $totalPenalties,
                'expectedTotalReturn' => $expectedTotalReturn,
                'totalPaid' => $totalPaid,
                'totalPayables' => $totalPayables,
                'netProfit' => $netProfit,
                'collectionRate' => $collectionRate,
                'averageLoanSize' => $averageLoanSize,
                'activeLoanCount' => $activeLoanCount,
            ],
            'monthlyData' => $monthlyData,
            'payablesBreakdown' => $payablesBreakdown,
            'loanStatusDistribution' => $loanStatusDistribution,
            'filters' => [
                'date_from' => $dateFrom->format('Y-m-d'),
                'date_to' => $dateTo->format('Y-m-d'),
            ],
        ]);
    }

    private function getMonthlyPaymentData($dateFrom, $dateTo)
    {
        $months = [];
        $currentDate = $dateFrom->copy();

        // Generate months within the date range
        while ($currentDate->lte($dateTo)) {
            $monthStart = $currentDate->copy()->startOfMonth();
            $monthEnd = $currentDate->copy()->endOfMonth();

            // Ensure we don't go beyond the dateTo
            if ($monthEnd->gt($dateTo)) {
                $monthEnd = $dateTo->copy();
            }

            // Get all payment schedules with due dates in this month
            $schedulesInMonth = PaymentSchedule::whereBetween('due_date', [$monthStart, $monthEnd])
                ->whereHas('loan', function ($query) {
                    $query->where('is_voided', false);
                    $query->where('user_id', Auth::id());
                })
                ->with('payment_histories')
                ->get();

            // Calculate total amount due in this month (scheduled) - including penalties and rebates
            $totalDue = $schedulesInMonth->sum('total_due');

            // Calculate total amount paid for schedules due in this month (regardless of when paid)
            $totalPaid = $schedulesInMonth->sum(function ($schedule) {
                return $schedule->payment_histories->sum('amount_paid');
            });

            $months[] = [
                'month' => $currentDate->format('M Y'),
                'payables' => $totalDue,
                'actualPaid' => $totalPaid,
            ];

            // Move to next month
            $currentDate->addMonth();
        }

        return $months;
    }

    private function getPayablesBreakdown()
    {
        $today = Carbon::today();

        // Pending (not yet due or due today)
        $pending = PaymentSchedule::where('status', 'pending')
            ->where('due_date', '>=', $today)
            ->whereHas('loan', function ($query) {
                $query->where('is_voided', false);
                $query->where('user_id', Auth::id());
            })
            ->get()
            ->sum(function ($schedule) {
                $totalPaid = $schedule->payment_histories->sum('amount_paid');
                return max(0, $schedule->total_due - $totalPaid);
            });

        // Overdue (past due date and not fully paid)
        $overdue = PaymentSchedule::where('status', 'pending')
            ->where('due_date', '<', $today)
            ->whereHas('loan', function ($query) {
                $query->where('is_voided', false);
                $query->where('user_id', Auth::id());
            })
            ->get()
            ->sum(function ($schedule) {
                $totalPaid = $schedule->payment_histories->sum('amount_paid');
                return max(0, $schedule->total_due - $totalPaid);
            });

        return [
            [
                'name' => 'Pending',
                'value' => $pending,
                'color' => '#10b981',
            ],
            [
                'name' => 'Overdue',
                'value' => $overdue,
                'color' => '#ef4444',
            ],
        ];
    }

    private function getLoanStatusDistribution($dateFrom, $dateTo)
    {
        $statusCounts = Loan::where('is_voided', false)
            ->where('user_id', Auth::id())
            ->whereBetween('transaction_date', [$dateFrom, $dateTo])
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        $colors = [
            'active' => '#3b82f6',
            'completed' => '#10b981',
            'defaulted' => '#ef4444',
            'pending' => '#f59e0b',
        ];

        return $statusCounts->map(function ($item) use ($colors) {
            return [
                'name' => ucfirst($item->status),
                'value' => $item->count,
                'color' => $colors[$item->status] ?? '#94a3b8',
            ];
        })->values()->toArray();
    }
}
