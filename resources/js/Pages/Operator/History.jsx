import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { History as HistoryIcon, Clock, CheckCircle2, XCircle, Activity, Search, Camera, AlertCircle, AlertTriangle } from 'lucide-react';
import OperatorSidebar from '@/Components/Operator/Shared/OperatorSidebar';
import OperatorTopbar from '@/Components/Operator/Shared/OperatorTopbar';
import ConfirmModal from '@/Components/Operator/Shared/ConfirmModal';
import HistoryTable from '@/Components/Operator/History/HistoryTable';
import RejectCard from '@/Components/Operator/History/RejectCard';
import AnnouncementBanner from '@/Components/Operator/Shared/AnnouncementBanner';
import AlertModal from '@/Components/Operator/Shared/AlertModal';
import useHistory from '@/Hooks/Operator/History/useHistory';
import useAnnouncements from '@/Hooks/Operator/Shared/useAnnouncements';

export default function History({ inspections }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingNav, setPendingNav] = useState(null);

    const {
        currentTime,
        searchTerm,
        setSearchTerm,
        activeTab,
        setActiveTab,
        lastPartId,
        filteredInspections,
        formatTime
    } = useHistory(inspections);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const { activeBroadcasts, activeAlerts, dismissAnnouncement } = useAnnouncements();

    return (
        <div className="h-screen w-full max-w-[100vw] bg-[#F8FAFC] flex flex-col font-sans overflow-hidden relative">
            <Head title="Riwayat Inspeksi - Camera Inspection" />

            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none animate-pulse" style={{ animationDuration: '10s' }}></div>

            <OperatorSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)} 
                onLogout={handleLogout} 
                onSetupClick={() => {
                    if (lastPartId) {
                        setIsSidebarOpen(false);
                        setPendingNav(route('operator.setup'));
                        setIsConfirmOpen(true);
                    } else {
                        router.get(route('operator.setup'));
                    }
                }}
            >
                {lastPartId && (
                    <button
                        onClick={() => router.get(route('operator.scanner', { part_id: lastPartId }))}
                        className="w-full flex items-center justify-center gap-3 px-4 py-4 mb-4 text-sm font-black text-white bg-blue-600 hover:bg-blue-700 rounded-2xl transition-all shadow-lg shadow-blue-500/30"
                    >
                        <Camera className="w-5 h-5" />
                        Lanjutkan Kamera
                    </button>
                )}
            </OperatorSidebar>

            <OperatorTopbar
                onMenuClick={() => setIsSidebarOpen(true)}
                title="Camera Inspection"
                subtitle="Riwayat Inspeksi Harian"
                extraClasses="bg-white/80 backdrop-blur-md border-b border-slate-200/50"
                rightContent={
                    <div className="flex items-center gap-2 text-lg font-black text-slate-700 bg-white px-4 py-2 rounded-xl border border-slate-200 min-w-[100px] justify-center shadow-sm">
                        {currentTime || "Memuat..."}
                    </div>
                }
            />

            <AnnouncementBanner announcements={activeBroadcasts} onDismiss={dismissAnnouncement} />
            <AlertModal alerts={activeAlerts} onDismiss={dismissAnnouncement} />

            <main className="flex-1 flex flex-col max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8 z-10 relative">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            <HistoryIcon className="w-8 h-8 text-blue-500" />
                            Riwayat Sesi Saat Ini
                        </h2>
                        <p className="text-slate-500 font-medium mt-1">Daftar seluruh komponen yang telah diproses pada hari ini oleh Anda.</p>
                    </div>

                    <div className="relative group min-w-[300px]">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari Part No atau Kode..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 mb-6 bg-white/60 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-200/60 w-max shadow-sm">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'all'
                                ? 'bg-slate-900 text-white shadow-md'
                                : 'text-slate-500 hover:text-slate-800 hover:bg-white/80'
                            }`}
                    >
                        Semua Riwayat
                    </button>
                    <button
                        onClick={() => setActiveTab('reject')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'reject'
                                ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                                : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                            }`}
                    >
                        <AlertCircle className="w-4 h-4" />
                        Khusus Reject (NG)
                    </button>
                </div>

                {activeTab === 'all' ? (
                    <HistoryTable data={filteredInspections} formatTime={formatTime} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pb-10 max-h-[calc(100vh-250px)]">
                        {filteredInspections.filter(i => i.final_decision === 'NG').length > 0 ? (
                            filteredInspections.filter(i => i.final_decision === 'NG').map(item => (
                                <RejectCard key={item.id} item={item} formatTime={formatTime} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-200 border-dashed">
                                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                </div>
                                <h3 className="text-xl font-black text-slate-800 mb-1">Luar Biasa!</h3>
                                <p className="text-slate-500 font-medium">Tidak ada komponen cacat (NG) pada hari ini.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Confirmation Modal */}
            <ConfirmModal 
                isOpen={isConfirmOpen} 
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => {
                    localStorage.removeItem('activeScannerPartId');
                    localStorage.removeItem('last_part_id'); // Bersihkan yang lama juga jika ada
                    router.get(pendingNav || route('operator.setup'));
                }}
                message="Sesi inspeksi saat ini akan diakhiri jika Anda kembali ke halaman Persiapan Inspeksi. Lanjutkan?"
            />
            
            <style>{`
                .scale-up-animation {
                    animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes scaleUp {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}
