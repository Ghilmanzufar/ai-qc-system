<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * Cek apakah user yang sedang login memiliki role yang diizinkan.
     * Contoh penggunaan di route: ->middleware('role:admin,supervisor')
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  Daftar role yang diizinkan (dipisah koma)
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        // Jika belum login, redirect ke halaman login
        if (!$user) {
            return redirect()->route('login');
        }

        // Jika role user tidak ada di daftar yang diizinkan
        if (!in_array($user->role, $roles)) {
            // Kembalikan halaman 403 Access Denied
            abort(403, 'Anda tidak memiliki izin untuk mengakses halaman ini.');
        }

        return $next($request);
    }
}
