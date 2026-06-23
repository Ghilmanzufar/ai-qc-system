import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { Search, ChevronRight, Package, Box, LogOut, Menu, X, User, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function Setup({ productModels }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPartId, setSelectedPartId] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Flat map all parts for easy searching
    const allParts = useMemo(() => {
        if (!productModels || !Array.isArray(productModels)) return [];
        return productModels.flatMap(model => 
            (model.parts || []).map(part => ({
                ...part,
                modelName: model.name || ''
            }))
        );
    }, [productModels]);

    // Filter parts based on search query
    const filteredParts = useMemo(() => {
        if (!searchQuery.trim()) return allParts;
        const query = searchQuery.toLowerCase();
        return allParts.filter(part => 
            (part.part_no || '').toLowerCase().includes(query) ||
            (part.part_name || '').toLowerCase().includes(query) ||
            (part.modelName || '').toLowerCase().includes(query)
        );
    }, [searchQuery, allParts]);

    const selectedPart = allParts.find(p => p.id === selectedPartId);

    const handleStart = () => {
        if (selectedPartId) {
            router.get('/operator/scanner', { part_id: selectedPartId });
        }
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <>
            <Head title="Setup Batch - Lens QC" />
            
            {/* Background Premium dengan Pattern dan Glow */}
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-orange-50/30 flex flex-col font-sans relative overflow-hidden">
                {/* Abstract Glow Background Elements */}
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/15 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-orange-500/15 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none animate-pulse" style={{ animationDuration: '10s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-[800px] h-[400px] bg-amber-400/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none transform rotate-45"></div>

                {/* Sidebar Overlay */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                                <Box className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Lens QC</h2>
                        </div>
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="flex-1 py-6 px-4 flex flex-col gap-2">
                        <div className="px-4 py-3 mb-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                <User className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Operator Aktif</p>
                                <p className="text-sm font-bold text-slate-800">Sesi Saat Ini</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-100">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Keluar dari Sistem
                        </button>
                    </div>
                </aside>

                {/* Navbar Premium */}
                <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="flex w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 items-center justify-center transition-colors"
                        >
                            <Menu className="w-5 h-5 text-slate-700" />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-slate-800">Lens QC</h1>
                            <p className="text-[10px] font-bold text-emerald-600/80 uppercase tracking-wider mt-1">Sistem Setup Batch</p>
                        </div>
                    </div>
                    
                    <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-700">Koneksi AI Siap</span>
                    </div>
                </nav>

                <main className="flex-1 flex flex-col max-w-5xl w-full mx-auto p-6 md:p-8 lg:p-12 z-10 relative">
                    {/* Header Section */}
                    <div className="text-center mb-10">
                        <h2 className="text-4xl lg:text-5xl font-black text-slate-800 mb-4 tracking-tight">Persiapan <span className="text-emerald-500">Inspeksi</span></h2>
                        <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">Silakan cari dan pilih part number komponen yang akan diproses pada batch inspeksi kali ini.</p>
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
                                        <button
                                            key={part.id}
                                            onClick={() => setSelectedPartId(part.id)}
                                            className={`
                                                relative w-full text-left p-5 rounded-2xl flex items-start gap-5 transition-all duration-300 group
                                                ${selectedPartId === part.id 
                                                    ? 'bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-400 shadow-emerald-500/20 shadow-lg scale-[1.02] ring-4 ring-emerald-500/10' 
                                                    : 'bg-slate-200/90 border-2 border-slate-300/80 shadow-sm hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-slate-400'
                                                }
                                            `}
                                        >
                                            {/* Glowing indicator */}
                                            {selectedPartId === part.id && (
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur opacity-30 -z-10 animate-pulse"></div>
                                            )}

                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-inner ${
                                                selectedPartId === part.id ? 'bg-emerald-500 text-white' : 'bg-slate-300/80 text-slate-600 group-hover:bg-slate-100 group-hover:text-slate-700'
                                            }`}>
                                                <Layers className="w-7 h-7" />
                                            </div>

                                            <div className="flex-1 min-w-0 pt-0.5">
                                                <div className="flex justify-between items-center mb-1.5">
                                                    <span className={`text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded-md border ${
                                                        selectedPartId === part.id ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-white border-slate-300 text-slate-700'
                                                    }`}>
                                                        {part.part_no}
                                                    </span>
                                                </div>
                                                <h3 className={`text-xl font-black truncate leading-tight ${
                                                    selectedPartId === part.id ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'
                                                }`}>
                                                    {part.part_name}
                                                </h3>
                                                <p className={`text-sm font-medium mt-1 truncate ${
                                                    selectedPartId === part.id ? 'text-emerald-600/80' : 'text-slate-400'
                                                }`}>
                                                    {part.modelName}
                                                </p>
                                            </div>

                                            <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                                                selectedPartId === part.id ? 'bg-emerald-100 text-emerald-600' : 'text-transparent'
                                            }`}>
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                        </button>
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
            `}</style>
        </>
    );
}
