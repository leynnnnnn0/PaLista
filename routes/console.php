<?php

use App\Models\Loan;
use App\Notifications\DueLoanReminder;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->everyTwoSeconds();

Artisan::command('loans:send-reminders', function () {
    $this->info('Starting to send loan reminders...');

    // Get loans with payments due today
    $loansToRemind = Loan::whereHas('payment_schedules', function ($query) {
        $query->where('due_date', today());
    })
        ->where('status', 'active')
        ->with(['user', 'payment_schedules' => function ($query) {
            $query->where('due_date', today());
        }])
        ->get();

    if ($loansToRemind->isEmpty()) {
        $this->info('No loans due today. No reminders sent.');
        return;
    }

    // Group loans by user
    $loansByUser = $loansToRemind->groupBy('user_id');

    foreach ($loansByUser as $userId => $userLoans) {
        $user = $userLoans->first()->user;

        $this->newLine();
        $this->info("User: {$user->name} ({$user->email})");
        $this->info("Due loans: {$userLoans->count()}");

        // Prepare due loan data
        $dueLoans = $userLoans->map(function ($loan) {
            $duePayment = $loan->payment_schedules->first();

            return (object) [
                'loan_number' => $loan->loan_number,
                'borrower_name' => $loan->borrower->full_name,
                'amount_to_pay' => $duePayment->amount_due + $duePayment->rebate_amount ?? 0,
                'due_date' => $duePayment->due_date,
            ];
        });

        // Send notification
        $user->notify(new DueLoanReminder($dueLoans));

        $this->line("✓ Sent reminder to {$user->name} ({$user->email}) for {$dueLoans->count()} loan(s)");
    }

    $this->info("✓ All reminders sent successfully! Total: {$loansByUser->count()} user(s)");
})->purpose('Send daily loan payment reminders');

// Test command to preview data without sending emails
Artisan::command('loans:test-reminders', function () {
    $this->info('Testing loan reminders (no emails will be sent)...');

    $loansToRemind = Loan::whereHas('payment_schedules', function ($query) {
        $query->where('due_date', today());
    })
        ->where('status', 'active')
        ->with(['user', 'payment_schedules' => function ($query) {
            $query->where('due_date', today());
        }])
        ->get();

    if ($loansToRemind->isEmpty()) {
        $this->warn('No loans due today.');
        return;
    }

    $loansByUser = $loansToRemind->groupBy('user_id');

    foreach ($loansByUser as $userId => $userLoans) {
        $user = $userLoans->first()->user;

        $this->newLine();
        $this->info("User: {$user->name} ({$user->email})");
        $this->info("Due loans: {$userLoans->count()}");

        foreach ($userLoans as $loan) {
            $duePayment = $loan->payment_schedules->first();
            $this->line("  - Loan #{$loan->id}: ₱" . number_format($duePayment->amount_due + $duePayment->penalty_amount ?? 0, 2));
        }
    }

    $this->newLine();
    $this->info("Total users to notify: {$loansByUser->count()}");
})->purpose('Test loan reminders without sending emails');

