<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #1e40af 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 20px;
            color: #2d3748;
        }
        .message {
            margin-bottom: 25px;
            font-size: 16px;
            color: #4a5568;
        }
        .loan-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
        }
        .loan-table thead {
            background-color: #1e40af;
            color: white;
        }
        .loan-table th {
            padding: 12px 15px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
        }
        .loan-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
        }
        .loan-table tbody tr:hover {
            background-color: #f7fafc;
        }
        .loan-table tbody tr:last-child td {
            border-bottom: none;
        }
        .total-row {
            background-color: #f7fafc;
            font-weight: 600;
        }
        .total-row td {
            border-top: 2px solid #667eea;
            padding-top: 15px;
        }
        .amount {
            color: #e53e3e;
            font-weight: 600;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #1e40af 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        .button:hover {
            transform: translateY(-2px);
        }
        .footer {
            background-color: #f7fafc;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #718096;
        }
        .footer a {
            color: #1e40af;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>💰 MyPautangLog</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Good morning, {{ $user->name }}! 👋
            </div>
            
            <div class="message">
                You have <strong>{{ $dueLoans->count() }}</strong> loan payment(s) due today.
            </div>
            
            <table class="loan-table">
                <thead>
                    <tr>
                        <th>Loan Number</th>
                        <th>Borrower Name</th>
                        <th style="text-align: right;">Amount to Pay</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($dueLoans as $loan)
                    <tr>
                        <td><strong>{{ $loan->loan_number }}</strong></td>
                        <td>{{ $loan->borrower_name }}</td>
                        <td style="text-align: right;" class="amount">
                            ₱{{ number_format($loan->amount_to_pay, 2) }}
                        </td>
                    </tr>
                    @endforeach
                    <tr class="total-row">
                        <td colspan="2" style="text-align: right;"><strong>Total Amount Due:</strong></td>
                        <td style="text-align: right;" class="amount">
                            ₱{{ number_format($totalAmount, 2) }}
                        </td>
                    </tr>
                </tbody>
            </table>
            
            <div style="text-align: center;">
                <a href="{{ url('/my-pautangs') }}" class="button">
                    View All Loans
                </a>
            </div>
            
            <div class="message" style="margin-top: 25px; font-size: 14px;">
                Don't forget to follow up with your borrowers today!
            </div>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} MyPautangLog. All rights reserved.</p>
            <p>
                <a href="{{ url('/') }}">Visit Website</a> | 
                <a href="{{ url('/settings') }}">Notification Settings</a>
            </p>
        </div>
    </div>
</body>
</html>