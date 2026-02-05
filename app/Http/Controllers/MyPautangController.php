<?php

namespace App\Http\Controllers;

use App\Models\Borrower;
use App\Models\Loan;
use App\Models\PaymentSchedule;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class MyPautangController extends Controller
{
    public function index(Request $request)
    {
        $query = Loan::where('user_id', Auth::id())->with('borrower');

        // Search by borrower name
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->whereHas('borrower', function ($q) use ($searchTerm) {
                $q->where(DB::raw("CONCAT(first_name, ' ', last_name)"), 'LIKE', "%{$searchTerm}%")
                    ->orWhere('first_name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('last_name', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Filter by status
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by aging (due dates)
        if ($request->filled('aging') && $request->aging !== 'aging') {
            switch ($request->aging) {
                case 'soon':
                    // Due in next 7 days
                    $query->whereHas('payment_schedules', function ($q) {
                        $q->where('status', '!=', 'paid')
                            ->whereBetween('due_date', [
                                Carbon::today(),
                                Carbon::today()->addDays(7)
                            ]);
                    });
                    break;

                case 'late':
                    // Past due (any overdue payment)
                    $query->whereHas('payment_schedules', function ($q) {
                        $q->where('status', '!=', 'paid')
                            ->where('due_date', '<', Carbon::today());
                    });
                    break;

                case 'critical':
                    // 30+ days late
                    $query->whereHas('payment_schedules', function ($q) {
                        $q->where('status', '!=', 'paid')
                            ->where('due_date', '<=', Carbon::today()->subDays(30));
                    });
                    break;
            }
        }

        $loans = $query->latest()->paginate(8)->withQueryString();

        $loans->transform(function ($loan) {
            return [
                'id' => $loan->id,
                'borrower' => $loan->borrower->full_name,
                'amount' => $loan->amount,
                'interest_type' => $loan->interest_type,
                'interest_value' => $loan->interest_value,
                'transaction_date' => Carbon::parse($loan->transaction_date)->format('F d, Y'),
                'total_amount' => $loan->total_amount,
                'remaining_balance' => $loan->remaining_balance,
                'status' => $loan->status,
            ];
        });

        return Inertia::render('MyPautang/Index', [
            'loans' => $loans,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status ?? 'all',
                'aging' => $request->aging ?? 'aging',
            ]
        ]);
    }


    public function create()
    {
        return Inertia::render('MyPautang/Create');
    }

    public function show($id)
    {
        $loan = Loan::where('user_id', Auth::id())->with('borrower', 'payment_schedules.payment_histories')->findOrFail($id);

        
                 
        return Inertia::render('MyPautang/Show', compact('loan'));
    }

    public function store(Request $request)
    {
        $isExistingBorrower = filter_var($request->is_existing_borrower, FILTER_VALIDATE_BOOLEAN);
        $validated = $request->validate([
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            Rule::when(!$isExistingBorrower, ['unique:borrowers,email']),
            'contact_number' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string'],
            'province' => ['nullable', 'string'],
            'zip_code' => ['nullable', 'string'],
            'country' => ['nullable', 'string'],
            'reference_name' => ['nullable', 'string'],
            'reference_contact' => ['nullable', 'string'],
            'documents' => ['nullable', 'array'],
            'documents.*' => ['file', 'max:5120'],
            'principal_amount' => ['required', 'numeric'],
            'interest_type' => ['required', 'string'],
            'interest_value' => ['required', 'numeric'],
            'transaction_date' => ['required', 'date'],
            'payment_schedule' => ['required', 'array'],
            'payment_schedule.*.date' => ['required', 'date'],
            'payment_schedule.*.amount' => ['required', 'numeric'],
            'payment_frequency' => ['required', 'string'],
            'loan_duration' => ['required', 'integer'],
            'duration_unit' => ['required', 'string'],
            'interest_period' => ['required', 'string'],
            'is_existing_borrower' => ['required'],
            'borrower_id' => ['nullable'],
        ]);

        DB::beginTransaction();
        $borrower = !$isExistingBorrower ? Borrower::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'] ?? null,
            'contact_number' => $validated['contact_number'] ?? null,
            'address' => $validated['address'] ?? null,
            'city' => $validated['city'] ?? null,
            'province' => $validated['province'] ?? null,
            'zip_code' => $validated['zip_code'] ?? null,
            'country' => $validated['country'] ?? null,
        ]) : Borrower::findOrFail($validated['borrower_id']);

     

        $loan = $borrower->loans()->create([
            'amount' => $validated['principal_amount'],
            'interest_type' => $validated['interest_type'],
            'interest_value' => $validated['interest_value'],
            'transaction_date' => $validated['transaction_date'],
            'payment_frequency' => $validated['payment_frequency'],
            'loan_duration' => $validated['loan_duration'],
            'duration_unit' => $validated['duration_unit'],
            'interest_period' => $validated['interest_period'],
        ]);

        if (!empty($validated['reference_name']) || !empty($validated['reference_contact']) && !$isExistingBorrower) {
            $borrower->references()->create([
                'name' => $validated['reference_name'] ?? null,
                'contact_number' => $validated['reference_contact'] ?? null,
            ]);
        }

        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $path = $file->store('borrower-documents', 'public');

                $borrower->documents()->create([
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]);
            }
        }

        $loan->payment_schedules()->createMany(
            array_map(function ($item) {
                return [
                    'due_date' => $item['date'],
                    'amount_due' => $item['amount'],
                    'status' => 'pending',
                ];
            }, $validated['payment_schedule'])
        );

        DB::commit();

        return response()->redirectToRoute('my-pautang.index');
    }

    public function penalty(Request $request, $id)
    {
        $paymentSchedule = PaymentSchedule::with('loan')->findOrFail($id);
        if($paymentSchedule->loan->user_id != Auth::id()) return response(403);
        $validated = $request->validate([
            'penalty_amount' => ['required', 'numeric'],
            'penalty_remarks' => ['nullable', 'string'],
        ]);
        $paymentSchedule->penalty_amount = $validated['penalty_amount'];
        $paymentSchedule->penalty_remarks = $validated['penalty_remarks'] ?? null;

        $paymentSchedule->save();

        return back();
    }

    public function recordPayment(Request $request)
    {
        $validated = $request->validate([
            'payment_schedule_id' => ['required', 'exists:payment_schedules,id'],
            'amount_paid' => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'string', 'in:cash,bank_transfer,gcash,paymaya,check'],
            'reference_number' => ['nullable', 'string', 'max:255'],
            'receipt_number' => ['nullable', 'string', 'max:255'],
            'payment_date' => ['required', 'date'],
        ]);

        DB::beginTransaction();

        try {
            $paymentSchedule = PaymentSchedule::with('payment_histories', 'loan')->findOrFail($validated['payment_schedule_id']);

            
            if($paymentSchedule->loan->user_id != Auth::id()) return response(403);
            // Calculate total amount paid so far
            $totalPaid = $paymentSchedule->payment_histories->sum('amount_paid');

            // Calculate remaining balance
            $remainingBalance = $paymentSchedule->total_due - $totalPaid;

            // Validate that payment doesn't exceed remaining balance
            if ($validated['amount_paid'] > $remainingBalance) {
                return back()->withErrors([
                    'amount_paid' => 'Payment amount cannot exceed remaining balance of ' . number_format($remainingBalance, 2)
                ]);
            }

            // Create payment history
            $paymentSchedule->payment_histories()->create([
                'amount_paid' => $validated['amount_paid'],
                'payment_method' => $validated['payment_method'],
                'reference_number' => $validated['reference_number'] ?? null,
                'receipt_number' => $validated['receipt_number'] ?? null,
                'payment_date' => $validated['payment_date'],
            ]);

            // Update payment schedule status
            $newTotalPaid = $totalPaid + $validated['amount_paid'];

            if ($newTotalPaid >= $paymentSchedule->total_due) {
                $paymentSchedule->status = 'paid';
            } elseif ($newTotalPaid > 0) {
                $paymentSchedule->status = 'partial';
            }

            $paymentSchedule->save();

            // Update loan remaining balance
            $loan = $paymentSchedule->loan;
            $this->updateLoanBalance($loan);

            DB::commit();

            return back()->with('success', 'Payment recorded successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to record payment: ' . $e->getMessage()]);
        }
    }

    public function updatePayment(Request $request, $id)
    {
        $validated = $request->validate([
            'amount_paid' => ['required', 'numeric', 'min:0.01'],
            'payment_method' => ['required', 'string', 'in:cash,bank_transfer,gcash,paymaya,check'],
            'reference_number' => ['nullable', 'string', 'max:255'],
            'receipt_number' => ['nullable', 'string', 'max:255'],
            'payment_date' => ['required', 'date'],
        ]);

        DB::beginTransaction();

        try {
            $paymentHistory = \App\Models\PaymentHistory::with('payment_schedule.loan')->findOrFail($id);
            if (Auth::id() != $paymentHistory->payment_schedule->loan->user_id) return response(403);
            $paymentSchedule = $paymentHistory->payment_schedule;

            // Calculate total paid excluding current payment being edited
            $totalPaidExcludingCurrent = $paymentSchedule->payment_histories()
                ->where('id', '!=', $id)
                ->sum('amount_paid');

            // Calculate remaining balance
            $remainingBalance = $paymentSchedule->total_due - $totalPaidExcludingCurrent;

            // Validate that updated payment doesn't exceed remaining balance
            if ($validated['amount_paid'] > $remainingBalance) {
                return back()->withErrors([
                    'amount_paid' => 'Payment amount cannot exceed remaining balance of ' . number_format($remainingBalance, 2)
                ]);
            }

            // Update payment history
            $paymentHistory->update([
                'amount_paid' => $validated['amount_paid'],
                'payment_method' => $validated['payment_method'],
                'reference_number' => $validated['reference_number'] ?? null,
                'receipt_number' => $validated['receipt_number'] ?? null,
                'payment_date' => $validated['payment_date'],
            ]);

            // Refresh and recalculate payment schedule status
            $paymentSchedule->refresh();
            $totalPaid = $paymentSchedule->payment_histories()->sum('amount_paid');

            if ($totalPaid >= $paymentSchedule->total_due) {
                $paymentSchedule->status = 'paid';
            } elseif ($totalPaid > 0) {
                $paymentSchedule->status = 'partial';
            } else {
                $paymentSchedule->status = 'pending';
            }

            $paymentSchedule->save();

            // Update loan remaining balance
            $loan = $paymentSchedule->loan;
            $this->updateLoanBalance($loan);

            DB::commit();

            return back()->with('success', 'Payment updated successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to update payment: ' . $e->getMessage()]);
        }
    }

    public function deletePayment($id)
    {
        DB::beginTransaction();

        try {
            $paymentHistory = \App\Models\PaymentHistory::with('payment_schedule.loan')->findOrFail($id);

            if (Auth::id() != $paymentHistory->payment_schedule->loan->user_id) return response(403);

            $paymentSchedule = $paymentHistory->payment_schedule;

            // Delete payment history
            $paymentHistory->delete();

            // Refresh and recalculate payment schedule status
            $paymentSchedule->refresh();
            $totalPaid = $paymentSchedule->payment_histories()->sum('amount_paid');

            if ($totalPaid >= $paymentSchedule->total_due) {
                $paymentSchedule->status = 'paid';
            } elseif ($totalPaid > 0) {
                $paymentSchedule->status = 'partial';
            } else {
                $paymentSchedule->status = 'pending';
            }

            $paymentSchedule->save();

            // Update loan remaining balance
            $loan = $paymentSchedule->loan;
            $this->updateLoanBalance($loan);

            DB::commit();

            return back()->with('success', 'Payment deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to delete payment: ' . $e->getMessage()]);
        }
    }

    /**
     * Helper method to update loan status based on payments
     */
    private function updateLoanBalance(Loan $loan)
    {
        if(Auth::id() != $loan->user_id) return response(403);
        // Refresh the loan to get latest data
        $loan->refresh();

        // Calculate total amount paid across all schedules
        $totalPaid = 0;
        foreach ($loan->payment_schedules as $schedule) {
            $totalPaid += $schedule->payment_histories()->sum('amount_paid');
        }

        // Get the computed total amount (includes penalties and rebates via the accessor)
        $totalAmountDue = $loan->total_amount + $loan->total_penalties - $loan->total_rebates;

        // Calculate remaining balance
        $remainingBalance = $totalAmountDue - $totalPaid;

        // Update loan status based on remaining balance
        if ($remainingBalance <= 0) {
            $loan->status = 'completed';
        } 

        $loan->save();
    }

    public function void($id){
        $validated = request()->validate([
            'void_reason' => ['required', 'string', 'max:1000'],
        ]);
        $loan = Loan::findOrFail($id);
        if (Auth::id() != $loan->user_id) return response(403);
        $loan->is_voided = true;
        $loan->voided_at = now();
        $loan->void_reason = $validated['void_reason'];
        $loan->status = 'voided';
        $loan->save();

        return back()->with('success', 'Loan has been voided successfully.');
    }

  
}
