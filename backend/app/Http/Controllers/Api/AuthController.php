<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string'],
        ]);
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'programmer'
            ]);

            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'message' => 'register berhasil',
                'user' => $user,
                'token' => $token,
            ], 201);
        } catch (\Throwable $th) {
            return response()->json([
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required']
        ]);
        try {
            $user = User::where('email', $request->email)->first();

            if ($user === null) {
                return response()->json([
                    'message' => 'Email atau password salah'
                ], 401);
            } else {
                if (Hash::check($request->password, $user->password)) {
                    $token = $user->createToken('auth-token')->plainTextToken;
                    return response()->json([
                        'message' => 'login berhasil',
                        'user' => $user,
                        'token' => $token,
                        'token-type' => 'Bearer'
                    ], 200);
                } else {
                    return response()->json([
                        'message' => 'login gagal'
                    ], 401);
                }
            }
        } catch (\Throwable $th) {
            return response()->json([
                'error' => $th->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'message' => 'logout berhasil',
        ]);
    }
    public function me()
    {
        $user = Auth::user();
        return response()->json([
            'message' => 'user login',
            'user' => $user
        ], 200);
    }
}
