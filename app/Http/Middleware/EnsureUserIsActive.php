<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user !== null && ! $user->is_active) {
            Auth::guard('web')->logout();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => __('Akun Anda dinonaktifkan. Silakan hubungi administrator.'),
                ], 403);
            }

            return redirect()->route('login')->withErrors([
                'email' => __('Akun Anda dinonaktifkan. Silakan hubungi administrator.'),
            ]);
        }

        return $next($request);
    }
}
