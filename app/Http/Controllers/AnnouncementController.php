<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\AnnouncementRead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller
{
    /**
     * [ADMIN] Tampilkan halaman manajemen pengumuman
     */
    public function index()
    {
        $announcements = Announcement::with('creator:id,name')
            ->withCount('reads')
            ->orderBy('created_at', 'desc')
            ->get();

        return inertia('Admin/Announcements/Index', [
            'announcements' => $announcements
        ]);
    }

    /**
     * [ADMIN] Buat pengumuman baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'type' => 'required|in:broadcast,alert',
            'target_role' => 'required|in:all,operator,supervisor',
            'expires_at' => 'nullable|date|after:now',
        ]);

        $validated['created_by'] = Auth::id();
        $validated['is_active'] = true;

        Announcement::create($validated);

        return redirect()->back()->with('success', 'Pengumuman berhasil dibuat dan sedang disiarkan.');
    }

    /**
     * [ADMIN] Nonaktifkan pengumuman (soft delete / set is_active = false)
     */
    public function destroy($id)
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->update(['is_active' => false]);

        return redirect()->back()->with('success', 'Pengumuman berhasil dihentikan.');
    }
    /**
     * [OPERATOR] API polling: ambil semua pengumuman aktif yang relevan untuk operator ini.
     * Dipanggil setiap 30 detik oleh frontend Operator.
     */
    public function active()
    {
        $userId = Auth::id();
        $userRole = Auth::user()->role; // 'operator', 'supervisor', 'admin'

        $announcements = Announcement::active()
            ->where(function ($q) use ($userRole) {
                $q->where('target_role', 'all')
                  ->orWhere('target_role', $userRole);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($ann) use ($userId) {
                return [
                    'id'         => $ann->id,
                    'title'      => $ann->title,
                    'body'       => $ann->body,
                    'type'       => $ann->type,
                    'created_at' => $ann->created_at->toIso8601String(),
                    'is_read'    => $ann->isReadBy($userId),
                ];
            });

        return response()->json($announcements);
    }

    /**
     * [OPERATOR] Tandai pengumuman sebagai sudah dibaca oleh user ini.
     */
    public function markRead($id)
    {
        $userId = Auth::id();

        $announcement = Announcement::findOrFail($id);

        // Insert, abaikan jika sudah ada (karena ada unique constraint)
        AnnouncementRead::firstOrCreate([
            'announcement_id' => $announcement->id,
            'user_id'         => $userId,
        ]);

        return response()->json(['success' => true]);
    }
}
