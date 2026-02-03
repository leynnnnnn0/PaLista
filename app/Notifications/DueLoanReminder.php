<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use App\Mail\DueLoanReminderMail;

class DueLoanReminder extends Notification
{
    use Queueable;

    public $dueLoans;

    public function __construct($dueLoans)
    {
        $this->dueLoans = $dueLoans;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable)
    {
        return new DueLoanReminderMail($notifiable, $this->dueLoans);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'due_loan_count' => $this->dueLoans->count(),
            'total_amount' => $this->dueLoans->sum('amount_to_pay'),
        ];
    }
}
