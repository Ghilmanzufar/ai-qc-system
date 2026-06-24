import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function AlertModal({ alerts, onDismiss }) {
    if (!alerts || alerts.length === 0) return null;

    // Tampilkan satu alert pada satu waktu (yang pertama/terbaru)
    const alert = alerts[0];

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-red-900/60 backdrop-blur-sm animate-pulse-once" />

            {/* Modal */}
            <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full overflow-hidden border-4 border-red-500 scale-up-animation">
                
                {/* Top stripe */}
                <div className="h-3 w-full bg-gradient-to-r from-red-500 via-orange-400 to-red-500 bg-size-200 animate-gradient" />

                {/* Header */}
                <div className="bg-gradient-to-br from-red-500 to-red-700 px-8 py-10 flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-white/30">
                        <AlertTriangle className="w-10 h-10 text-white animate-bounce" />
                    </div>
                    <span className="text-xs font-black text-red-200 uppercase tracking-[0.3em] mb-2">⚠ Peringatan Sistem</span>
                    <h2 className="text-3xl font-black text-white tracking-tight">{alert.title}</h2>
                </div>

                {/* Body */}
                <div className="px-8 py-7">
                    <p className="text-base font-medium text-slate-700 text-center leading-relaxed">
                        {alert.body}
                    </p>
                </div>

                {/* Footer */}
                <div className="px-8 pb-8">
                    <button
                        onClick={() => onDismiss(alert.id, 'alert')}
                        className="w-full py-4 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl text-lg tracking-wide"
                    >
                        <CheckCircle2 className="w-6 h-6" />
                        Saya Mengerti
                    </button>
                </div>
            </div>
        </div>
    );
}
