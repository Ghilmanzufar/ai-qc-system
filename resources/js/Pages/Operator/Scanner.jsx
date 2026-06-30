import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { CheckCircle2, XCircle, Camera, Send, AlertTriangle, LogOut, Activity, Focus, Video, Menu, X, User, RefreshCcw } from 'lucide-react';
import OperatorSidebar from '@/Components/Operator/Shared/OperatorSidebar';
import OperatorTopbar from '@/Components/Operator/Shared/OperatorTopbar';
import CameraPanel from '@/Components/Operator/Scanner/CameraPanel';
import ConfirmModal from '@/Components/Operator/Shared/ConfirmModal';
import AiOfflineModal from '@/Components/Operator/Scanner/AiOfflineModal';
import AnnouncementBanner from '@/Components/Operator/Shared/AnnouncementBanner';
import AlertModal from '@/Components/Operator/Shared/AlertModal';
import useAnnouncements from '@/Hooks/Operator/Shared/useAnnouncements';
import useScannerCameras from '@/Hooks/Operator/Scanner/useScannerCameras';

import ResultPanel from '@/Components/Operator/Scanner/ResultPanel';

export default function Scanner() {
    const { part, dailyStats: initialStats, auth } = usePage().props;
    
    // States
    const [stats, setStats] = useState(initialStats || { total: 0, ok: 0, ng: 0 });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [pendingNav, setPendingNav] = useState(null);
    
    const [aiOffline, setAiOffline] = useState(false);
    const [currentTime, setCurrentTime] = useState('');

    const { activeBroadcasts, activeAlerts, dismissAnnouncement } = useAnnouncements();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Simpan part_id aktif ke localStorage agar bisa diakses dari halaman lain (Dashboard, History)
    useEffect(() => {
        if (part?.id) {
            localStorage.setItem('activeScannerPartId', String(part.id));
        }
    }, [part?.id]);

    const {
        devices,
        videoRef, canvasRef, cameraId, setCameraId, stream, captured, setCaptured, result, setResult, isAnalyzing,
        capturePhoto, retakePhoto, submitPhoto
    } = useScannerCameras(part, setStats, setAiOffline, isConfirmOpen);

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="Live Scanner" />
            
            {/* Hidden Canvas for capturing */}
            <canvas ref={canvasRef} className="hidden" />

            <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
                
                {/* Sidebar & Topbar Components */}
                <OperatorSidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)} 
                    onLogout={() => {
                        if (isAnalyzing) {
                            alert("Harap tunggu, proses analisis AI sedang berjalan!");
                            return;
                        }
                        handleLogout();
                    }}
                    onSetupClick={() => {
                        if (isAnalyzing) {
                            alert("Harap tunggu, proses analisis AI sedang berjalan!");
                            return;
                        }
                        setIsSidebarOpen(false);
                        setPendingNav(route('operator.setup'));
                        setIsConfirmOpen(true);
                    }}
                    onHistoryClick={() => {
                        if (isAnalyzing) {
                            alert("Harap tunggu, proses analisis AI sedang berjalan!");
                            return;
                        }
                        setIsSidebarOpen(false);
                        router.get(route('operator.history'));
                    }}
                />

                <OperatorTopbar 
                    onMenuClick={() => setIsSidebarOpen(true)}
                    title="Camera Inspection"
                    subtitle="AI Camera Scanner"
                    centerContent={
                        <>
                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl shadow-sm">
                                <Activity className="w-5 h-5 text-emerald-500" />
                                <span className="text-base font-black text-slate-800 whitespace-nowrap tracking-wide">
                                    {part?.product_model?.name} <span className="mx-2 text-emerald-300 font-normal">|</span> <span className="text-emerald-700 text-lg">{part?.part_no}</span>
                                </span>
                            </div>
                            <button 
                                onClick={() => {
                                    if (isAnalyzing) {
                                        alert("Harap tunggu, proses analisis AI sedang berjalan!");
                                        return;
                                    }
                                    setPendingNav(route('operator.setup'));
                                    setIsConfirmOpen(true);
                                }}
                                className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold transition-all border border-red-100 shadow-sm"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="hidden sm:inline">Akhiri Sesi</span>
                            </button>
                        </>
                    }
                    rightContent={
                        <>
                            <div className="hidden lg:flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-sm">
                                <div className="px-4 py-1.5 bg-white rounded-lg border border-slate-200 flex flex-col items-center shadow-sm min-w-[60px]">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total</span>
                                    <span className="text-lg font-black text-slate-800 leading-none">{stats.total}</span>
                                </div>
                                <div className="px-4 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100 flex flex-col items-center shadow-sm min-w-[60px]">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-0.5">Pass</span>
                                    <span className="text-lg font-black text-emerald-700 leading-none">{stats.ok}</span>
                                </div>
                                <div className="px-4 py-1.5 bg-red-50 rounded-lg border border-red-100 flex flex-col items-center shadow-sm min-w-[60px]">
                                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest mb-0.5">Reject</span>
                                    <span className="text-lg font-black text-red-700 leading-none">{stats.ng}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-lg font-black text-slate-700 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 min-w-[100px] justify-center shadow-sm">
                                {currentTime || "Memuat..."}
                            </div>
                        </>
                    }
                />

                <AiOfflineModal 
                    isOpen={aiOffline} 
                    onClose={() => setAiOffline(false)} 
                />

                <AlertModal alerts={activeAlerts} onDismiss={dismissAnnouncement} />

                <ConfirmModal 
                    isOpen={isConfirmOpen} 
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={() => {
                        localStorage.removeItem('activeScannerPartId');
                        localStorage.removeItem('last_part_id'); // Bersihkan yang lama juga jika ada
                        router.get(pendingNav || route('operator.setup'));
                    }}
                    message="Sesi inspeksi ini akan diakhiri jika Anda kembali ke halaman Persiapan Inspeksi. Lanjutkan?"
                />

                {/* Konten Utama - Grid Layout */}
                <AnnouncementBanner announcements={activeBroadcasts} onDismiss={dismissAnnouncement} />
                <main className="flex-1 w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-10 gap-6 items-stretch">
                    
                    {/* PANEL KAMERA (70%) */}
                    <div className="lg:col-span-7 flex flex-col">
                        <CameraPanel
                            side="front"
                            title="KAMERA INSPEKSI"
                            stream={stream}
                            videoRef={videoRef}
                            cameraId={cameraId}
                            setCameraId={setCameraId}
                            devices={devices}
                            captured={captured}
                            result={result}
                            isAnalyzing={isAnalyzing}
                            part={part}
                            onCapture={capturePhoto}
                            onRetake={retakePhoto}
                            onUpload={(dataUrl) => setCaptured(dataUrl)}
                            onSubmit={(side, forceContinue = false) => {
                                if (forceContinue) {
                                    setResult(null);
                                    setCaptured(null); // Clear image to start next capture
                                } else {
                                    submitPhoto();
                                }
                            }}
                        />
                    </div>

                    {/* PANEL HASIL INSPEKSI (30%) */}
                    <div className="lg:col-span-3 flex flex-col">
                        <ResultPanel result={result} part={part} />
                    </div>

                </main>
            </div>
            
            <style>{`
                .scale-up-animation {
                    animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes scaleUp {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </>
    );
}
