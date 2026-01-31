<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BorrowerResource;
use App\Models\Borrower;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BorrowerController extends Controller
{
    public function search(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'search' => 'required|string|min:2|max:255'
        ]);

        $searchTerm = $validated['search'];


        // Query borrowers for authenticated user
        $borrowers = Borrower::where('user_id', Auth::id())
            ->with('references')
            ->where(function ($query) use ($searchTerm) {
                $query->where('first_name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('last_name', 'LIKE', "%{$searchTerm}%");
            })
            ->limit(10) // Add limit to prevent large datasets
            ->get();

        return BorrowerResource::collection($borrowers);
    }
}
