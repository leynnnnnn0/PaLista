<?php

namespace App\Console\Commands;

use App\Models\Loan;
use Illuminate\Console\Command;

class SendDueLoanReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-due-loan-reminder';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This will send a due loan reminder.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $loansToRemind = Loan::whereHas('payment_schedules', function ($query) {
            $query->where('due_date', today());
        })
            ->with('user')
            ->get();

        
    }
}
