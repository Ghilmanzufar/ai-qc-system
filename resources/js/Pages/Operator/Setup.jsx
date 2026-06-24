import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { Search, ChevronRight, Package, Box, LogOut, Menu, X, User, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';
import OperatorSidebar from '@/Components/Operator/Shared/OperatorSidebar';
import OperatorTopbar from '@/Components/Operator/Shared/OperatorTopbar';
import PartCard from '@/Components/Operator/Setup/PartCard';
import SetupConfirmModal from '@/Components/Operator/Setup/SetupConfirmModal';
import AnnouncementBanner from '@/Components/Operator/Shared/AnnouncementBanner';
import AlertModal from '@/Components/Operator/Shared/AlertModal';
import useSetupParts from '@/Hooks/Operator/Setup/useSetupParts';
import useAnnouncements from '@/Hooks/Operator/Shared/useAnnouncements';

export default function Setup({ productModels }) {
    const {
        searchQuery,
        setSearchQuery,
        selectedPartId,
        setSelectedPartId,
        filteredParts,
        selectedPart
    } = useSetupParts(productModels);

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleStart = () => {
        if (selectedPartId) {
            setIsConfirmOpen(true);
        }
    };

    const confirmStart = () => {
        if (selectedPartId) {
            localStorage.setItem('activeScannerPartId', selectedPartId);
            router.get(route('operator.scanner', { part_id: selectedPartId }));
        }
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    const { activeBroadcasts, activeAlerts, dismissAnnouncement } = useAnnouncements();

    return (
        <>
            <Head title="Setup Batch - Camera Inspection" />

            {/* Background Premium dengan Pattern dan Glow */}
            <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">
                {/* Subtle Tech Dot Pattern */}
                <div className="absolute inset-0 opacity-[0.35]" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                {/* Abstract Glow Background Elements */}
                <div className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-emerald-400/20 rounded-full blur-[120px] pointer-events-none" style={{ animation: 'drift 20s infinite ease-in-out' }}></div>
                <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-amber-400/15 rounded-full blur-[100px] pointer-events-none" style={{ animation: 'drift-reverse 25s infinite ease-in-out' }}></div>
                <div className="absolute top-[10%] left-[20%] w-[900px] h-[500px] bg-emerald-300/15 rounded-full blur-[120px] pointer-events-none" style={{ animation: 'drift 30s infinite ease-in-out' }}></div>

                {/* Sidebar & Topbar Components */}
                <OperatorSidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    onLogout={handleLogout}
                />

                <OperatorTopbar
                    onMenuClick={() => setIsSidebarOpen(true)}
                    title="Camera Inspection"
                    subtitle="Sistem Setup Batch"
                    extraClasses="bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-6 py-4"
                    rightContent={
                        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-bold text-emerald-700">Koneksi AI Siap</span>
                        </div>
                    }
                />

                <AnnouncementBanner announcements={activeBroadcasts} onDismiss={dismissAnnouncement} />
                <AlertModal alerts={activeAlerts} onDismiss={dismissAnnouncement} />

                <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto p-6 md:p-8 lg:p-12 z-10 relative">
                    {/* Header Section */}
                    <div className="text-center mb-10">
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-800 mb-4 tracking-tight">Pilih <span className="text-emerald-500">Part Number</span></h2>
                        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">Silakan cari dan pilih part-number yang akan diproses pada inspeksi kali ini.</p>
                    </div>

                    {/* Search Bar Premium */}
                    <div className="relative mb-8 max-w-3xl mx-auto w-full group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-emerald-500 group-focus-within:scale-110 transition-transform" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl text-lg text-slate-800 font-bold focus:outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-lg shadow-slate-200/50 placeholder-slate-400"
                            placeholder="Ketik part number, nama, atau model..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">Pencarian</span>
                        </div>
                    </div>

                    {/* Grid Layout untuk Card Parts */}
                    <div className="flex-1 bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] shadow-xl overflow-hidden flex flex-col max-h-[60vh] relative">
                        {/* Gradient Fade Top */}
                        <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-white/90 to-transparent z-10 pointer-events-none"></div>

                        <div className="overflow-y-auto p-6 lg:p-8 relative z-0 custom-scrollbar">
                            {filteredParts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredParts.map(part => (
                                        <PartCard
                                            key={part.id}
                                            part={part}
                                            isSelected={selectedPartId === part.id}
                                            onClick={() => setSelectedPartId(part.id)}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center flex flex-col items-center justify-center">
                                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                        <Package className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">Komponen Tidak Ditemukan</h3>
                                    <p className="text-slate-500 font-medium">Kata kunci "{searchQuery}" tidak cocok dengan data model maupun part manapun.</p>
                                </div>
                            )}
                        </div>

                        {/* Gradient Fade Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none rounded-b-[2rem]"></div>
                    </div>

                    {/* Floating Action Bar */}
                    <div className={`mt-8 transition-all duration-500 transform ${selectedPartId ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-50 pointer-events-none'}`}>
                        <button
                            onClick={handleStart}
                            disabled={!selectedPartId}
                            className={`
                                w-full max-w-2xl mx-auto py-5 px-8 rounded-full font-black text-xl flex items-center justify-center gap-3 transition-all
                                ${selectedPartId
                                    ? 'bg-slate-900 text-white shadow-2xl hover:bg-slate-800 hover:-translate-y-1 hover:shadow-emerald-500/20 border border-slate-700'
                                    : 'bg-slate-200 text-slate-400'
                                }
                            `}
                        >
                            MULAI INSPEKSI BATCH INI
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </button>
                    </div>
                </main>

                {/* Confirmation Modal */}
                <SetupConfirmModal
                    isOpen={isConfirmOpen}
                    onClose={() => setIsConfirmOpen(false)}
                    onConfirm={confirmStart}
                    part={selectedPart}
                />
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 10px;
                }
                @keyframes drift {
                    0% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.05); }
                    66% { transform: translate(-20px, 20px) scale(0.95); }
                    100% { transform: translate(0, 0) scale(1); }
                }
                @keyframes drift-reverse {
                    0% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-30px, 50px) scale(1.1); }
                    66% { transform: translate(20px, -20px) scale(0.9); }
                    100% { transform: translate(0, 0) scale(1); }
                }
            `}</style>
        </>
    );
}
