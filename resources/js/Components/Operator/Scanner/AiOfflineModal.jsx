import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function AiOfflineModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-black text-white mb-4 tracking-wider">SERVER AI OFFLINE</h2>
            <p className="text-slate-400 max-w-sm mb-8">Sistem gagal mengirim gambar ke engine analisis Python.</p>
            <button 
                onClick={onClose}
                className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 shadow-xl"
            >
                Tutup Peringatan
            </button>
        </div>
    );
}
