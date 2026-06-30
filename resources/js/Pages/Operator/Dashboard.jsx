import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Clock, Sparkles, Camera } from 'lucide-react';
import OperatorSidebar from '@/Components/Operator/Shared/OperatorSidebar';
import OperatorTopbar from '@/Components/Operator/Shared/OperatorTopbar';
import StatCards from '@/Components/Operator/Dashboard/StatCards';
import YieldRateGauge from '@/Components/Operator/Dashboard/YieldRateGauge';
import RecentActivityList from '@/Components/Operator/Dashboard/RecentActivityList';
import AnnouncementBanner from '@/Components/Operator/Shared/AnnouncementBanner';
import AlertModal from '@/Components/Operator/Shared/AlertModal';
import ConfirmModal from '@/Components/Operator/Shared/ConfirmModal';
import useDashboard from '@/Hooks/Operator/Dashboard/useDashboard';
import useAnnouncements from '@/Hooks/Operator/Shared/useAnnouncements';

export default function Dashboard({ stats, recentActivity, auth }) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const { 
        isSidebarOpen, 
        setIsSidebarOpen, 
        currentTime, 
        greeting, 
        lastPartId 
    } = useDashboard();

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const { activeBroadcasts, activeAlerts, dismissAnnouncement } = useAnnouncements();

    return (
        <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col font-sans overflow-hidden relative selection:bg-blue-500 selection:text-white">
            <Head title="Dashboard Kinerja - Camera Inspection" />

            {/* Light Mode Premium Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-400/15 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDuration: '10s' }}></div>

            <ConfirmModal 
                isOpen={isConfirmOpen} 
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => {
                    localStorage.removeItem('activeScannerPartId');
                    localStorage.removeItem('last_part_id');
                    router.get(route('operator.setup'));
                }}
                message="Sesi inspeksi ini akan diakhiri jika Anda kembali ke halaman Persiapan Inspeksi. Lanjutkan?"
            />

            <OperatorSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                onLogout={handleLogout}
                onSetupClick={lastPartId ? () => {
                    setIsSidebarOpen(false);
                    setIsConfirmOpen(true);
                } : undefined}
            >
                {lastPartId && (
                    <button
                        onClick={() => router.get(route('operator.scanner', { part_id: lastPartId }))}
                        className="w-full flex items-center justify-center gap-3 px-4 py-4 mb-2 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all shadow-lg shadow-blue-500/30"
                    >
                        <Camera className="w-5 h-5" />
                        Lanjutkan Kamera
                    </button>
                )}
            </OperatorSidebar>

            <OperatorTopbar
                onMenuClick={() => setIsSidebarOpen(true)}
                title="Camera Inspection"
                subtitle="Dashboard Kinerja Member"
                extraClasses="bg-white/80 backdrop-blur-xl border-b border-slate-200"
                rightContent={
                    <div className="flex items-center gap-2 text-sm font-black text-slate-700 bg-white px-5 py-2.5 rounded-2xl border border-slate-200 shadow-sm">
                        <Clock className="w-4 h-4 text-blue-500" />
                        {currentTime || "..."}
                    </div>
                }
            />

            <AnnouncementBanner announcements={activeBroadcasts} onDismiss={dismissAnnouncement} />
            <AlertModal alerts={activeAlerts} onDismiss={dismissAnnouncement} />

            <main className="flex-1 flex flex-col max-w-[1400px] w-full mx-auto p-4 md:p-6 lg:p-8 z-10 relative overflow-y-auto custom-scrollbar">
                
                {/* Greeting Banner */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 mb-8 relative overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-100 group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-gradient-to-br from-blue-100 to-transparent rounded-full blur-3xl group-hover:bg-blue-200/50 transition-all duration-700"></div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-xs font-bold text-emerald-600 flex items-center gap-1.5 uppercase tracking-wider">
                                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Sesi Aktif
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-3 tracking-tight">
                                {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{auth?.user?.name || 'Member'}</span>
                            </h1>
                            <p className="text-slate-500 text-lg font-medium max-w-xl">
                                Pantau terus performa dan kualitas inspeksi Anda hari ini. Tetap fokus dan capai target!
                            </p>
                        </div>
                    </div>
                </div>

                <StatCards stats={stats} />

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <YieldRateGauge stats={stats} />
                    <RecentActivityList recentActivity={recentActivity} />
                </div>

            </main>
        </div>
    );
}
