import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function SetupConfirmModal({ isOpen, onClose, onConfirm, part }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-6">
            <div className="bg-white rounded-[32px] p-10 max-w-lg w-full shadow-2xl scale-up-animation border border-emerald-100">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner shadow-emerald-200">
                    <ShieldCheck className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-3 text-center tracking-tight">Konfirmasi Pilihan</h2>
                <p className="text-slate-500 text-lg text-center mb-8 leading-relaxed">
                    Anda akan memulai sesi inspeksi untuk Model <span className="font-bold text-slate-700">{part?.modelName}</span> dengan Part Number <span className="font-bold text-slate-700">{part?.part_no}</span>. Lanjutkan?
                </p>
                <div className="flex gap-4">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-lg"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl transition-colors text-lg shadow-lg shadow-emerald-500/30"
                    >
                        Ya, Mulai
                    </button>
                </div>
            </div>
        </div>
    );
}
