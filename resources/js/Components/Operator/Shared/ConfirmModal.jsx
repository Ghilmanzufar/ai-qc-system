import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-6">
            <div className="bg-white rounded-[32px] p-12 max-w-2xl w-full shadow-2xl scale-up-animation border border-red-100">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8 mx-auto shadow-inner shadow-red-200">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-4xl font-black text-slate-800 mb-4 text-center tracking-tight">Ganti Model/Part?</h2>
                <p className="text-slate-500 text-xl text-center mb-10 leading-relaxed">
                    {message || "Sesi inspeksi ini akan diakhiri jika Anda kembali ke halaman Persiapan Inspeksi. Lanjutkan?"}
                </p>
                <div className="flex gap-5">
                    <button 
                        onClick={onClose}
                        className="flex-1 px-6 py-4 bg-slate-100 text-slate-700 text-xl font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-colors text-lg shadow-lg shadow-red-500/30"
                    >
                        Ya, Selesaikan
                    </button>
                </div>
            </div>
        </div>
    );
}
