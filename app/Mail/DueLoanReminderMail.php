<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class DueLoanReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $dueLoans;
    public $totalAmount;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $dueLoans)
    {
        $this->user = $user;
        $this->dueLoans = $dueLoans;
        $this->totalAmount = $dueLoans->sum('amount_to_pay');
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            to: [new Address($this->user->email, $this->user->name)], // ✅ ADD THIS
            subject: 'Payment Reminder - ' . $this->dueLoans->count() . ' Due Today',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.due-loan-reminder',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
