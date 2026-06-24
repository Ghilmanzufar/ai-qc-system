import React from 'react';
import { Link } from '@inertiajs/react';
import { X, User, LogOut, Box, History } from 'lucide-react';

export default function OperatorSidebar({ isOpen, onClose, onLogout, onSetupClick, onHistoryClick, children }) {
    return (
        <>
            {/* Sidebar Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-black text-slate-800 tracking-tight">Lens QC</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="flex items-center justify-center w-12 h-12 bg-slate-50 text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all shadow-sm hover:shadow-md"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="flex-1 py-6 px-4 flex flex-col gap-2">
                    {/* Slot for custom priority buttons like "Lanjutkan Kamera" */}
                    {children}

                    {onSetupClick ? (
                        <button 
                            onClick={onSetupClick}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${route().current('operator.setup') ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Box className="w-5 h-5" />
                            Setup Batch
                        </button>
                    ) : (
                        <Link 
                            href={route('operator.setup')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${route().current('operator.setup') ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Box className="w-5 h-5" />
                            Setup Batch
                        </Link>
                    )}

                    {onHistoryClick ? (
                        <button 
                            onClick={onHistoryClick}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${route().current('operator.history') ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <History className="w-5 h-5" />
                            Riwayat Inspeksi
                        </button>
                    ) : (
                        <Link 
                            href={route('operator.history')}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-colors ${route().current('operator.history') ? 'bg-emerald-50 text-emerald-600' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <History className="w-5 h-5" />
                            Riwayat Inspeksi
                        </Link>
                    )}
                </div>

                <div className="p-4 border-t border-slate-100 flex flex-col gap-3 bg-slate-50/50">
                    <div className="px-3 py-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-slate-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Operator Aktif</p>
                            <p className="text-sm font-black text-slate-800 truncate">Sesi Saat Ini</p>
                        </div>
                    </div>

                    <button 
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 rounded-xl transition-colors border border-red-100 hover:border-transparent shadow-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Keluar dari Sistem
                    </button>
                </div>
            </aside>
        </>
    );
}
