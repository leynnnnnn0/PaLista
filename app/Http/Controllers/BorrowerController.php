<?php

namespace App\Http\Controllers;

use App\Models\Borrower;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BorrowerController extends Controller
{
    public function index()
    {
        $borrowers = Borrower::with('loans.payment_schedules.payment_histories')
        ->where('user_id', Auth::id())
        ->latest()
        ->paginate(10);
        $borrowers->transform(function ($borrower) {
            return [
                'id' => $borrower->id,
                'full_name' => $borrower->full_name,
                'email' => $borrower->email,
                'contact_number' => $borrower->contact_number,
                'total_loans' => $borrower->loans->count(),
                'completed_loans' => $borrower->loans->where('status', 'completed')->count(),
            ];
        });

        return Inertia::render('Borrowers/Index', [
            'borrowers' => $borrowers,
        ]);
    }

    public function show(Borrower $borrower)
    {
        if($borrower->user_id != Auth::id()) return response(403);
        $borrower->load('references', 'loans.payment_schedules.payment_histories', 'documents');

        return Inertia::render('Borrowers/Show', [
            'borrower' => $borrower,
        ]);
    }

    public function create()
    {
        return Inertia::render('Borrowers/Create');
    }

    public function store(Request $request) 
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'email' => ['nullable','unique:borrowers,email'],
            'contact_number' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string'],
            'province' => ['nullable', 'string'],
            'zip_code' => ['nullable', 'string'],
            'country' => ['nullable', 'string'],
            'reference_name' => ['nullable', 'string'],
            'reference_contact' => ['nullable', 'string'],
        ]);

        $borrower = Borrower::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'] ?? null,
            'contact_number' => $validated['contact_number'] ?? null,
            'address' => $validated['address'] ?? null,
            'city' => $validated['city'] ?? null,
            'province' => $validated['province'] ?? null,
            'zip_code' => $validated['zip_code'] ?? null,
            'country' => $validated['country'] ?? null,
        ]);

        if (!empty($validated['reference_name']) || !empty($validated['reference_contact'])) {
            $borrower->references()->create([
                'name' => $validated['reference_name'] ?? null,
                'contact_number' => $validated['reference_contact'] ?? null,
            ]);
        }

        return response()->redirectToRoute('borrowers.index');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string'],
            'last_name' => ['required', 'string'],
            'email' => ['nullable', 'unique:borrowers,email,' . $id],
            'contact_number' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'city' => ['nullable', 'string'],
            'province' => ['nullable', 'string'],
            'zip_code' => ['nullable', 'string'],
            'country' => ['nullable', 'string'],
            'reference_name' => ['nullable', 'string'],
            'reference_contact' => ['nullable', 'string'],
        ]);

        $borrower = Borrower::where('user_id', Auth::id())->findOrFail($id);
        $borrower->update([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'] ?? null,
            'contact_number' => $validated['contact_number'] ?? null,
            'address' => $validated['address'] ?? null,
            'city' => $validated['city'] ?? null,
            'province' => $validated['province'] ?? null,
            'zip_code' => $validated['zip_code'] ?? null,
            'country' => $validated['country'] ?? null,
        ]);

        if (!empty($validated['reference_name']) || !empty($validated['reference_contact'])) {
            $borrower->references()->update([
                'name' => $validated['reference_name'] ?? null,
                'contact_number' => $validated['reference_contact'] ?? null,
            ]);
        }

        return response()->redirectToRoute('borrowers.index');

    }

    public function edit(Borrower $borrower)
    {
        if($borrower->user_id != Auth::id()) return response(403);
        $borrower->load('references');
        return Inertia::render('Borrowers/Edit', [
            'borrower' => $borrower
        ]);
    }
}
