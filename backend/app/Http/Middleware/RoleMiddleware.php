<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // Cek apakah user sudah login
        if (!Auth::check()) {
            abort(401, 'Unauthorized');
        }

        $user = Auth::user();

        // Cek apakah role user ada dalam array roles yang diizinkan
        if (!in_array($user->role, $roles)) {
            abort(403, 'You are not allowed');
        }

        return $next($request);
    }
}
