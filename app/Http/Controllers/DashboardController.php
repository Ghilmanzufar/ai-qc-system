<?php

namespace App\Http\Controllers;

use App\Models\Inspection;
use App\Models\Part;
use App\Models\ProductModel;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Dashboard Admin — ringkasan sistem keseluruhan.
     */
    public function adminDashboard()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers' => User::count(),
                'totalParts' => Part::count(),
                'totalModels' => ProductModel::count(),
                'totalInspections' => Inspection::count(),
            ],
        ]);
    }

    /**
     * Dashboard Supervisor — Live Monitoring + Analytics.
     */
    public function supervisorDashboard()
    {
        return Inertia::render('Supervisor/Dashboard');
    }

    /**
     * API endpoint untuk Live Monitoring data (auto-refresh dari frontend).
     * Dipanggil oleh Supervisor Dashboard setiap 15 detik.
     */
    public function liveStats(Request $request)
    {
        $dateFrom = $request->get('date_from', today()->toDateString());
        $dateTo = $request->get('date_to', today()->toDateString());
        $shift = $request->get('shift'); // 'pagi' atau 'malam'
        $partId = $request->get('part_id');

        $query = Inspection::query()
            ->whereBetween('created_at', [$dateFrom . ' 00:00:00', $dateTo . ' 23:59:59']);

        // Filter Shift
        if ($shift === 'pagi') {
            $query->whereRaw('HOUR(created_at) BETWEEN 6 AND 17');
        } elseif ($shift === 'malam') {
            $query->where(function ($q) {
                $q->whereRaw('HOUR(created_at) >= 18')
                  ->orWhereRaw('HOUR(created_at) < 6');
            });
        }

        // Filter Part
        if ($partId) {
            $query->where('part_id', $partId);
        }

        $total = (clone $query)->count();
        $totalOk = (clone $query)->where('final_decision', 'PASS')->count();
        $totalNg = (clone $query)->where('final_decision', 'NG')->count();

        // Breakdown jenis cacat
        $defectBreakdown = (clone $query)
            ->where('final_decision', 'NG')
            ->whereNotNull('defect_type')
            ->selectRaw('defect_type, COUNT(*) as count')
            ->groupBy('defect_type')
            ->get();

        // Tren per jam untuk grafik
        $hourlyTrend = (clone $query)
            ->selectRaw('HOUR(created_at) as hour, final_decision, COUNT(*) as count')
            ->groupBy('hour', 'final_decision')
            ->orderBy('hour')
            ->get();

        return response()->json([
            'total' => $total,
            'ok' => $totalOk,
            'ng' => $totalNg,
            'ng_rate' => $total > 0 ? round(($totalNg / $total) * 100, 1) : 0,
            'defect_breakdown' => $defectBreakdown,
            'hourly_trend' => $hourlyTrend,
        ]);
    }
}
