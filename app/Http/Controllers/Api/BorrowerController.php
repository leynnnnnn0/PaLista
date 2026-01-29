<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BorrowerResource;
use App\Models\Borrower;
use Illuminate\Http\Request;

class BorrowerController extends Controller
{
    public function index(Request $request)
    {
        
        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query = Borrower::with('references')->whereAny(['first_name', 'last_name'], 'LIKE', "%{$searchTerm}%");

            $loans = $query->get();
            return BorrowerResource::collection($loans);
        }else {
            return response()->json([
                'message' => 'Search term is required.',
            ], 400);
        }
    }
}
