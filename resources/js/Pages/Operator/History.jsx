import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { History as HistoryIcon, Clock, CheckCircle2, XCircle, Activity, Search, Camera, AlertCircle, AlertTriangle } from 'lucide-react';
import OperatorSidebar from '@/Components/Operator/Shared/OperatorSidebar';
import OperatorTopbar from '@/Components/Operator/Shared/OperatorTopbar';
import ConfirmModal from '@/Components/Operator/Shared/ConfirmModal';

export default function History({ inspections }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all"); // 'all' or 'reject'
    const [lastPartId, setLastPartId] = useState(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingNav, setPendingNav] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLastPartId(localStorage.getItem('last_part_id'));
        }

        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    // Filter by search term (inspection code or part number)
    const filteredInspections = inspections?.filter(item =>
        item.inspection_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.part?.part_no?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const formatTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="h-screen w-full max-w-[100vw] bg-[#F8FAFC] flex flex-col font-sans overflow-hidden relative">
            <Head title="Riwayat Inspeksi - Lens QC" />

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
                title="Lens QC"
                subtitle="Riwayat Inspeksi Harian"
                extraClasses="bg-white/80 backdrop-blur-md border-b border-slate-200/50"
                rightContent={
                    <div className="flex items-center gap-2 text-lg font-black text-slate-700 bg-white px-4 py-2 rounded-xl border border-slate-200 min-w-[100px] justify-center shadow-sm">
                        {currentTime || "Memuat..."}
                    </div>
                }
            />

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
                    <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col flex-1 max-h-[calc(100vh-250px)]">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Waktu</th>
                                        <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Kode Inspeksi</th>
                                        <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Model / Part No</th>
                                        <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Hasil Depan</th>
                                        <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Hasil Belakang</th>
                                        <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Keputusan Akhir</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredInspections.length > 0 ? (
                                        filteredInspections.map((item) => (
                                            <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2 text-slate-600 font-bold">
                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                        {formatTime(item.created_at)}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className="text-sm font-black text-slate-700">{item.inspection_code}</span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold text-slate-400">{item.part?.product_model?.name || '-'}</span>
                                                        <span className="text-sm font-black text-slate-800">{item.part?.part_no || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`text-xs font-black px-2 py-1 rounded-md ${item.front_status === 'OK' ? 'bg-emerald-100 text-emerald-700' : (item.front_status === 'NG' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500')}`}>
                                                        {item.front_status || '-'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`text-xs font-black px-2 py-1 rounded-md ${item.back_status === 'OK' ? 'bg-emerald-100 text-emerald-700' : (item.back_status === 'NG' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500')}`}>
                                                        {item.back_status || '-'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    {item.final_decision === 'PASS' ? (
                                                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg w-max shadow-sm">
                                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                            <span className="text-sm font-black text-emerald-700">PASS</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg w-max shadow-sm">
                                                            <XCircle className="w-4 h-4 text-red-600" />
                                                            <span className="text-sm font-black text-red-700">NG {item.defect_type ? `(${item.defect_type})` : ''}</span>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-slate-400">
                                                    <Activity className="w-12 h-12 mb-3 text-slate-300" />
                                                    <p className="text-lg font-bold text-slate-500">Belum ada riwayat hari ini</p>
                                                    <p className="text-sm">Riwayat inspeksi akan muncul di sini setelah Anda menyelesaikan pemindaian.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pb-10 max-h-[calc(100vh-250px)]">
                        {filteredInspections.filter(i => i.final_decision === 'NG').length > 0 ? (
                            filteredInspections.filter(i => i.final_decision === 'NG').map(item => (
                                <div key={item.id} className="bg-white rounded-3xl p-5 border border-red-100 shadow-xl shadow-red-500/5 flex flex-col relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
                                    <div className="flex justify-between items-start mb-4 mt-2">
                                        <div>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{formatTime(item.created_at)}</span>
                                            <h3 className="text-lg font-black text-slate-800">{item.inspection_code}</h3>
                                            <p className="text-sm font-bold text-slate-500">{item.part?.modelName || item.part?.product_model?.name || '-'} • {item.part?.part_no}</p>
                                        </div>
                                        <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100 flex items-center gap-1.5">
                                            <XCircle className="w-4 h-4" />
                                            <span className="text-sm font-black">NG</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100 flex-1">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Diagnosa Cacat:</p>
                                        <p className="text-sm font-medium text-slate-700">{item.defect_type || 'Defect tidak terspesifikasi atau terdeteksi oleh operator'}</p>
                                    </div>

                                    <button className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-lg">
                                        <Camera className="w-5 h-5" />
                                        Ambil Foto Bukti
                                    </button>
                                </div>
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
                    localStorage.removeItem('last_part_id');
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
