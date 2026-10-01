<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Hanya Project Manager yang bisa melihat daftar users
        if ($user->role !== 'project_manager') {
            return response()->json([
                'message' => 'Only Project Manager can view users'
            ], 403);
        }

        $query = User::query();

        // Filter by role jika ada parameter role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        $users = $query->get();

        return response()->json([
            'message' => 'Users retrieved successfully',
            'users' => $users
        ], 200);
    }
}
