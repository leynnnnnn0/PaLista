<?php

namespace App\Http\Controllers;

use App\Models\Borrower;
use App\Models\Loan;
use App\Models\PaymentSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Get date filters - default to today
        $dateFrom = $request->input('date_from')
            ? Carbon::parse($request->input('date_from'))->startOfDay()
            : Carbon::today();

        $dateTo = $request->input('date_to')
            ? Carbon::parse($request->input('date_to'))->endOfDay()
            : Carbon::today();

        // Get calendar month - default to current month
        $calendarMonth = $request->input('calendar_month')
            ? Carbon::parse($request->input('calendar_month'))
            : Carbon::now();

        // Total Borrowers
        $totalBorrowers = Borrower::count();

        // Active Accounts (active loans)
        $activeAccounts = Loan::where('status', 'active')
            ->where('is_voided', false)
            ->count();

        // Total Payables (remaining balance of all active loans)
        $totalPayables = Loan::where('is_voided', false)
            ->get()
            ->sum('remaining_balance');

        // Overdue Loans (schedules past due and not fully paid)
        $today = Carbon::today();
        $overdueLoans = PaymentSchedule::where('status', 'pending')
            ->where('due_date', '<', $today)
            ->whereHas('loan', function ($query) {
                $query->where('is_voided', false);
            })
            ->count();

        // Get payment schedules within date range with borrower details
        $paymentSchedules = PaymentSchedule::whereBetween('due_date', [$dateFrom, $dateTo])
            ->whereHas('loan', function ($query) {
                $query->where('is_voided', false);
            })
            ->with(['loan.borrower', 'payment_histories'])
            ->orderBy('due_date', 'asc')
            ->get()
            ->map(function ($schedule) use ($today) {
                $totalPaid = $schedule->payment_histories->sum('amount_paid');
                $remainingAmount = max(0, $schedule->total_due - $totalPaid);

                return [
                    'id' => $schedule->id,
                    'borrower_name' => $schedule->loan->borrower->first_name . ' ' . $schedule->loan->borrower->last_name,
                    'loan_id' => $schedule->loan_id,
                    'due_date' => $schedule->due_date,
                    'amount_due' => $schedule->amount_due,
                    'total_due' => $schedule->total_due,
                    'paid_amount' => $totalPaid,
                    'remaining_amount' => $remainingAmount,
                    'status' => $schedule->status === 'paid' ? 'paid' : ($schedule->due_date < $today ? 'overdue' : 'pending'),
                    'penalty_amount' => $schedule->penalty_amount,
                    'rebate_amount' => $schedule->rebate_amount,
                ];
            });

        // Get calendar data for the selected month (all schedules with due dates)
        $calendarStart = $calendarMonth->copy()->startOfMonth();
        $calendarEnd = $calendarMonth->copy()->endOfMonth();

        $calendarData = PaymentSchedule::whereBetween('due_date', [$calendarStart, $calendarEnd])
            ->whereHas('loan', function ($query) {
                $query->where('is_voided', false);
            })
            ->with('payment_histories')
            ->get()
            ->groupBy(function ($schedule) {
                return Carbon::parse($schedule->due_date)->format('Y-m-d');
            })
            ->map(function ($schedules, $date) {
                $totalAmount = $schedules->sum(function ($schedule) {
                    $totalPaid = $schedule->payment_histories->sum('amount_paid');
                    return max(0, $schedule->total_due - $totalPaid);
                });

                return [
                    'date' => $date,
                    'count' => $schedules->count(),
                    'total_amount' => $totalAmount,
                ];
            })
            ->values();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalBorrowers' => $totalBorrowers,
                'activeAccounts' => $activeAccounts,
                'totalPayables' => $totalPayables,
                'overdueLoans' => $overdueLoans,
            ],
            'paymentSchedules' => $paymentSchedules,
            'calendarData' => $calendarData,
            'filters' => [
                'date_from' => $dateFrom->format('Y-m-d'),
                'date_to' => $dateTo->format('Y-m-d'),
            ],
        ]);
    }
}
