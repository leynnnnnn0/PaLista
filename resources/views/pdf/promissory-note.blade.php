<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Promissory Note - {{ $loan->loan_number ?? 'LN00000001' }}</title>
    <style>
        @page {
            size: A4;
            margin: 2cm;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #000;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }

        .header h1 {
            font-size: 18pt;
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 5px;
        }

        .info-section {
            margin-bottom: 25px;
        }

        .info-row {
            display: flex;
            margin-bottom: 8px;
        }

        .info-label {
            font-weight: bold;
            width: 100px;
            flex-shrink: 0;
        }

        .info-value {
            flex-grow: 1;
            border-bottom: 1px solid #000;
            padding-left: 10px;
        }

        .promise-text {
            margin: 25px 0;
            padding: 15px;
            border: 2px solid #000;
            text-align: justify;
            line-height: 1.8;
        }

        .terms-section {
            margin: 25px 0;
        }

        .term-item {
            display: flex;
            margin-bottom: 12px;
            text-align: justify;
        }

        .term-number {
            font-weight: bold;
            width: 150px;
            flex-shrink: 0;
        }

        .term-content {
            flex-grow: 1;
        }

        .legal-text {
            margin: 25px 0;
            text-align: justify;
            line-height: 1.8;
        }

        .signature-section {
            margin-top: 40px;
            margin-bottom: 40px;
        }

        .signature-block {
            margin-bottom: 30px;
        }

        .signature-line {
            border-top: 1px solid #000;
            width: 300px;
            margin-top: 40px;
            margin-bottom: 5px;
        }

        .signature-label {
            font-weight: bold;
            margin-bottom: 3px;
        }

        .schedule-header {
            text-align: center;
            margin: 40px 0 25px 0;
            border-top: 2px solid #000;
            border-bottom: 2px solid #000;
            padding: 15px 0;
        }

        .schedule-header h2 {
            font-size: 16pt;
            font-weight: bold;
            letter-spacing: 2px;
        }

        .schedule-info {
            background-color: #f5f5f5;
            padding: 15px;
            margin-bottom: 20px;
            border: 1px solid #ccc;
        }

        .schedule-info-row {
            display: flex;
            padding: 5px 0;
        }

        .schedule-info-label {
            font-weight: bold;
            width: 180px;
        }

        .schedule-info-value {
            flex-grow: 1;
        }

        .payment-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .payment-table th {
            background-color: #333;
            color: white;
            padding: 10px;
            text-align: center;
            font-weight: bold;
            border: 1px solid #000;
        }

        .payment-table td {
            padding: 8px;
            border: 1px solid #000;
            text-align: center;
        }

        .payment-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }

        .amount-cell {
            text-align: right;
            font-weight: bold;
        }

        .page-break {
            page-break-after: always;
        }

        @media print {
            body {
                padding: 0;
            }
            
            .page-break {
                page-break-after: always;
            }
        }
    </style>
</head>
<body>
    <!-- PROMISSORY NOTE PAGE -->
    <div class="header">
        <h1>PROMISSORY NOTE</h1>
    </div>

    <div class="info-section">
        <div class="info-row">
            <span class="info-label">Date:</span>
            <span class="info-value">{{ \Carbon\Carbon::parse($loan->transaction_date ?? now())->format('F d, Y') }}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Place:</span>
            <span class="info-value">{{ $borrower->address ?? '_____________________________' }}</span>
        </div>
    </div>

    <div class="promise-text">
        I, <strong>{{ strtoupper($borrower->first_name . ' ' . $borrower->last_name) }}</strong>, of legal age, with residence at 
        <strong>{{ $borrower->address ?? '_____________________________' }}</strong>, hereby promise to pay, 
        the sum of <strong>{{ strtoupper($loan->total_amount_words ?? 'SIXTEEN THOUSAND ') }}</strong> 
        (<strong>{{ number_format($loan->total_amount ?? 16000, 2) }}</strong>), payable under the following terms and conditions:
    </div>

    <div class="terms-section">
        <div class="term-item">
            <span class="term-number">1. Loan Amount:</span>
            <span class="term-content">{{ number_format($loan->principal_amount ?? 10000, 2) }}</span>
        </div>

        <div class="term-item">
            <span class="term-number">2. Interest Rate:</span>
            <span class="term-content">
                @if($loan->interest_type === 'percentage')
                    {{ $loan->interest_value }}% 
                @else
                    {{ number_format($loan->interest_value, 2) }}
                @endif
                @if($loan->interest_period === 'per_day')
                    per day
                @elseif($loan->interest_period === 'per_week')
                    per week
                @elseif($loan->interest_period === 'per_month')
                    per month
                @else
                    (one-time)
                @endif
                payable in {{ $loan->payment_frequency_text ?? '6 Semi Monthly' }} installments
            </span>
        </div>

        <div class="term-item">
            <span class="term-number">3. Payment Schedule:</span>
            <span class="term-content">
                Payments shall be made 
                @if($loan->payment_frequency === 'daily')
                    daily
                @elseif($loan->payment_frequency === 'weekly')
                    weekly
                @elseif($loan->payment_frequency === 'twice_monthly')
                    every 21 of the month (twice monthly)
                @elseif($loan->payment_frequency === 'monthly')
                    monthly
                @endif
                starting on {{ \Carbon\Carbon::parse($loan->first_payment_date ?? now())->format('F d, Y') }}, 
                until full settlement on or before {{ \Carbon\Carbon::parse($loan->maturity_date ?? now()->addMonths(3))->format('F d, Y') }}.
            </span>
        </div>

        <div class="term-item">
            <span class="term-number">4. Maturity Date:</span>
            <span class="term-content">
                The loan shall be fully paid on or before <strong>{{ \Carbon\Carbon::parse($loan->maturity_date ?? now()->addMonths(3))->format('F d, Y') }}</strong>.
            </span>
        </div>

        <div class="term-item">
            <span class="term-number">5. Penalty:</span>
            <span class="term-content">
                A penalty of {{ $loan->penalty_rate ?? '2' }}% per {{ $loan->penalty_period ?? 'Semi Monthly' }} shall be charged on overdue payments.
            </span>
        </div>
    </div>

    <div class="legal-text">
        In case of default, I authorize the lender to take necessary legal action for the collection of the balance, 
        including penalties and expenses incurred.
    </div>

    <div class="legal-text">
        This Promissory Note is signed voluntarily and with full understanding of its terms.
    </div>

    <div class="signature-section">
        <div class="signature-block">
            <div class="signature-label">Borrower's Signature:</div>
            <div class="signature-line"></div>
            <div class="signature-label">Printed Name:</div>
            <div>{{ strtoupper($borrower->first_name . ' ' . $borrower->last_name) }}</div>
        </div>

        <div class="signature-block">
            <div class="signature-label">Lender's Signature:</div>
            <div class="signature-line"></div>
            <div class="signature-label">Printer Name:</div>
            <div>{{ strtoupper($lender->business_name) }}</div>
        </div>
    </div>

    <!-- PAGE BREAK -->
    <div class="page-break"></div>

    <!-- SCHEDULE OF PAYMENTS PAGE -->
    <div class="schedule-header">
        <h2>SCHEDULE OF PAYMENTS</h2>
    </div>

    <div class="schedule-info">
        <div class="schedule-info-row">
            <span class="schedule-info-label">Name:</span>
            <span class="schedule-info-value">{{ strtoupper($borrower->first_name . ' ' . $borrower->last_name) }}</span>
        </div>
        <div class="schedule-info-row">
            <span class="schedule-info-label">Loan Date:</span>
            <span class="schedule-info-value">{{ \Carbon\Carbon::parse($loan->transaction_date ?? now())->format('F d, Y') }}</span>
        </div>
        <div class="schedule-info-row">
            <span class="schedule-info-label">Loan Number:</span>
            <span class="schedule-info-value">{{ $loan->loan_number ?? 'LN00000001' }}</span>
        </div>
        <div class="schedule-info-row">
            <span class="schedule-info-label">Loan Amount:</span>
            <span class="schedule-info-value">{{ number_format($loan->principal_amount ?? 10000, 2) }}</span>
        </div>
        <div class="schedule-info-row">
            <span class="schedule-info-label">Loan Payable:</span>
            <span class="schedule-info-value">{{ number_format($loan->total_amount ?? 16000, 2) }}</span>
        </div>
        <div class="schedule-info-row">
            <span class="schedule-info-label">Payable:</span>
            <span class="schedule-info-value">
                @if($loan->payment_frequency === 'daily')
                    Daily
                @elseif($loan->payment_frequency === 'weekly')
                    Weekly
                @elseif($loan->payment_frequency === 'twice_monthly')
                    Semi Monthly
                @elseif($loan->payment_frequency === 'monthly')
                    Monthly
                @endif
            </span>
        </div>
        <div class="schedule-info-row">
            <span class="schedule-info-label">Number of Payments:</span>
            <span class="schedule-info-value">{{ count($loan->payment_schedules ?? []) }}</span>
        </div>
        <div class="schedule-info-row">
            <span class="schedule-info-label">Due ({{ $loan->payment_frequency === 'twice_monthly' ? 'Semi Monthly' : ucfirst($loan->payment_frequency ?? 'Monthly') }}):</span>
            <span class="schedule-info-value">{{ number_format($loan->payment_amount ?? 2666.67, 2) }}</span>
        </div>
    </div>

    <table class="payment-table">
        <thead>
            <tr>
                <th>Date</th>
                <th>Amount Due</th>
            </tr>
        </thead>
        <tbody>
            @php
                $balance = $loan->total_amount ?? 16000;
            @endphp
            @forelse($loan->payment_schedules ?? [] as $payment)
                @php
                    $balance -= $payment['amount'];
                @endphp
                <tr>
                    <td>{{ \Carbon\Carbon::parse($payment['due_date'])->format('F d, Y') }}</td>
                    <td class="amount-cell">{{ number_format($payment['amount_due'], 2) }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="2">No payment schedule available</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>