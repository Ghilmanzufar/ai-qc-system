<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Models\AnnouncementRead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller
{
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
