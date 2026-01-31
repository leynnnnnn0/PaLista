<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Borrower;
use App\Models\PromissoryNote;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PromissoryNoteController extends Controller
{
    public function index()
    {
        $promissoryNote = PromissoryNote::firstOrCreate(['id' => Auth::id()],[]);


        return Inertia::render('PromissoryNote/Index',[
            'promissoryNote' => $promissoryNote
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'lender' => ['required'],
            'penalty_percentage' => ['required', 'numeric']
        ]);

        $promissoryNote = PromissoryNote::findOrFail($id);

        $promissoryNote->update($validated);

        return back();
    }
    /**
     * Generate and download promissory note for a loan
     */
    public function generate($loanId)
    {
        // Fetch loan with relationships
        $loan = Loan::with(['borrower', 'payment_schedules'])->findOrFail($loanId);
        if($loan->user_id != Auth::id()) return response(403);;
        $borrower = $loan->borrower;

        // Calculate total amount in words
        $totalAmountWords = $this->numberToWords($loan->total_amount);

        // Calculate payment amount
        $paymentAmount = $loan->payment_schedules->count() > 0
            ? $loan->total_amount / $loan->payment_schedules->count()
            : 0;

        // Prepare data for the view

        $promissoryNote = PromissoryNote::firstOrCreate(['id' => Auth::id()], []);
        $data = [
            'loan' => (object) [
                'loan_number' => $loan->loan_number ?? $this->generateLoanNumber($loan->id),
                'transaction_date' => $loan->transaction_date,
                'principal_amount' => $loan->amount,
                'interest_type' => $loan->interest_type,
                'interest_value' => $loan->interest_value,
                'interest_period' => $loan->interest_period,
                'total_amount' => $loan->total_amount,
                'total_amount_words' => $totalAmountWords,
                'payment_frequency' => $loan->payment_frequency,
                'payment_frequency_text' => $this->getPaymentFrequencyText($loan),
                'first_payment_date' => $loan->payment_schedules[0]['due_date'] ?? now(),
                'maturity_date' => $loan->payment_schedules[$loan->payment_schedules->count() - 1]['due_date'],
                'payment_schedules' => $loan->payment_schedules,
                'payment_amount' => $paymentAmount,
                'penalty_rate' => $promissoryNote->penalty_percentage, // Default penalty rate
                'penalty_period' => $this->getPenaltyPeriod($loan->payment_frequency),
            ],
            'borrower' => (object) [
                'first_name' => $borrower->first_name,
                'last_name' => $borrower->last_name,
                'address' => $this->getFullAddress($borrower),
            ],
            'lender' => (object) [
                'business_name' => $promissoryNote->lender,
            ],
        ];

        // Generate PDF
        $pdf = Pdf::loadView('pdf.promissory-note', $data);
        $pdf->setPaper('A4', 'portrait');

        // Return download
        return $pdf->download("Promissory_Note_{$loan->loan_number}_{$borrower->last_name}.pdf");
    }

    /**
     * Preview promissory note in browser
     */
    public function preview($loanId)
    {
        // Fetch loan with relationships
        $loan = Loan::with(['borrower', 'payment_schedules'])->findOrFail($loanId);
        $borrower = $loan->borrower;

        // Calculate total amount in words
        $totalAmountWords = $this->numberToWords($loan->total_amount);

        // Calculate payment amount
        $paymentAmount = $loan->payment_schedules->count() > 0
            ? $loan->total_amount / $loan->payment_schedules->count()
            : 0;

        // Prepare data for the view
        $data = [
            'loan' => (object) [
                'loan_number' => $loan->loan_number ?? $this->generateLoanNumber($loan->id),
                'transaction_date' => $loan->transaction_date,
                'principal_amount' => $loan->amount,
                'interest_type' => $loan->interest_type,
                'interest_value' => $loan->interest_value,
                'interest_period' => $loan->interest_period,
                'total_amount' => $loan->total_amount,
                'total_amount_words' => $totalAmountWords,
                'payment_frequency' => $loan->payment_frequency,
                'payment_frequency_text' => $this->getPaymentFrequencyText($loan),
                'first_payment_date' => $loan->payment_schedules[0]['due_date'],
                'maturity_date' => $loan->payment_schedules[$loan->payment_schedules->count() - 1]['due_date'],
                'payment_schedules' => $loan->payment_schedules,
                'payment_amount' => $paymentAmount,
                'penalty_rate' => 2,
                'penalty_period' => $this->getPenaltyPeriod($loan->payment_frequency),
            ],
            'borrower' => (object) [
                'first_name' => $borrower->first_name,
                'last_name' => $borrower->last_name,
                'address' => $this->getFullAddress($borrower),
            ],
            'lender' => (object) [
                'business_name' => config('app.business_name', 'Your Business Name'),
            ],
        ];

        // Return view
        return view('pdf.promissory-note', $data);
    }

    /**
     * Generate loan number
     */
    private function generateLoanNumber($id)
    {
        return 'LN' . str_pad($id, 8, '0', STR_PAD_LEFT);
    }

    /**
     * Get full address from borrower
     */
    private function getFullAddress($borrower)
    {
        $parts = array_filter([
            $borrower->address,
            $borrower->city,
            $borrower->province,
            $borrower->country,
        ]);

        return implode(', ', $parts);
    }

    /**
     * Get payment frequency text for promissory note
     */
    private function getPaymentFrequencyText($loan)
    {
        $count = count($loan->payment_schedules);

        switch ($loan->payment_frequency) {
            case 'daily':
                return "$count Daily";
            case 'weekly':
                return "$count Weekly";
            case 'twice_monthly':
                return "$count Semi Monthly";
            case 'monthly':
                return "$count Monthly";
            default:
                return "$count Installments";
        }
    }

    /**
     * Get penalty period based on payment frequency
     */
    private function getPenaltyPeriod($frequency)
    {
        switch ($frequency) {
            case 'daily':
                return 'Day';
            case 'weekly':
                return 'Week';
            case 'twice_monthly':
                return 'Semi Monthly';
            case 'monthly':
                return 'Month';
            default:
                return 'Payment Period';
        }
    }

    /**
     * Convert number to words (for Philippine Peso)
     */
    private function numberToWords($number)
    {
        $number = number_format($number, 2, '.', '');
        list($pesos, $centavos) = explode('.', $number);

        $result = $this->convertToWords($pesos) . ' PESOS';

        if ($centavos > 0) {
            $result .= ' AND ' . $this->convertToWords($centavos) . ' CENTAVOS';
        }

        return $result;
    }

    /**
     * Helper function to convert numbers to words
     */
    private function convertToWords($number)
    {
        $ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
        $tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
        $teens = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];

        if ($number == 0) {
            return 'ZERO';
        }

        $number = (int) $number;

        if ($number < 10) {
            return $ones[$number];
        } elseif ($number < 20) {
            return $teens[$number - 10];
        } elseif ($number < 100) {
            return $tens[(int)($number / 10)] . ($number % 10 != 0 ? '-' . $ones[$number % 10] : '');
        } elseif ($number < 1000) {
            return $ones[(int)($number / 100)] . ' HUNDRED' . ($number % 100 != 0 ? ' ' . $this->convertToWords($number % 100) : '');
        } elseif ($number < 1000000) {
            return $this->convertToWords((int)($number / 1000)) . ' THOUSAND' . ($number % 1000 != 0 ? ' ' . $this->convertToWords($number % 1000) : '');
        } elseif ($number < 1000000000) {
            return $this->convertToWords((int)($number / 1000000)) . ' MILLION' . ($number % 1000000 != 0 ? ' ' . $this->convertToWords($number % 1000000) : '');
        }

        return (string) $number;
    }
}
