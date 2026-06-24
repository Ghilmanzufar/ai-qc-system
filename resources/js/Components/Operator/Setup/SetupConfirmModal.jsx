import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckSquare, Square, AlertCircle } from 'lucide-react';

export default function SetupConfirmModal({ isOpen, onClose, onConfirm, part }) {
    const [checks, setChecks] = useState({
        kameraBersih: false,
        mejaRapi: false,
        pencahayaanNormal: false
    });

    // Reset checks when modal opens
    useEffect(() => {
        if (isOpen) {
            setChecks({
                kameraBersih: false,
                mejaRapi: false,
                pencahayaanNormal: false
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const allChecked = checks.kameraBersih && checks.mejaRapi && checks.pencahayaanNormal;

    const toggleCheck = (key) => {
        setChecks(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-[32px] p-6 md:p-10 max-w-xl w-full shadow-2xl scale-up-animation border border-emerald-100 flex flex-col max-h-[90vh]">
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto shadow-inner shadow-emerald-200">
                        <ShieldCheck className="w-8 h-8 text-emerald-500" />
                    </div>
                    
                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-2 text-center tracking-tight">Persiapan Terakhir</h2>
                    <p className="text-slate-500 text-base md:text-lg text-center mb-6 leading-relaxed">
                        Memulai inspeksi untuk Part <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{part?.part_no}</span>
                    </p>

                    <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-orange-800 mb-1">Wajib Checklist 5S</h4>
                                <p className="text-sm text-orange-700 leading-relaxed">
                                    Demi akurasi AI, pastikan Anda telah mengecek 3 hal berikut sebelum menyalakan kamera.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 mb-8">
                        {/* Check 1 */}
                        <div 
                            onClick={() => toggleCheck('kameraBersih')}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${checks.kameraBersih ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                            <div className="shrink-0">
                                {checks.kameraBersih ? <CheckSquare className="w-6 h-6 text-emerald-500" /> : <Square className="w-6 h-6 text-slate-300" />}
                            </div>
                            <div>
                                <p className={`font-bold text-base ${checks.kameraBersih ? 'text-emerald-800' : 'text-slate-700'}`}>Lensa Kamera Bersih</p>
                                <p className={`text-sm ${checks.kameraBersih ? 'text-emerald-600' : 'text-slate-500'}`}>Sudah dilap dari debu & sidik jari</p>
                            </div>
                        </div>

                        {/* Check 2 */}
                        <div 
                            onClick={() => toggleCheck('mejaRapi')}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${checks.mejaRapi ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                            <div className="shrink-0">
                                {checks.mejaRapi ? <CheckSquare className="w-6 h-6 text-emerald-500" /> : <Square className="w-6 h-6 text-slate-300" />}
                            </div>
                            <div>
                                <p className={`font-bold text-base ${checks.mejaRapi ? 'text-emerald-800' : 'text-slate-700'}`}>Meja Inspeksi Bersih</p>
                                <p className={`text-sm ${checks.mejaRapi ? 'text-emerald-600' : 'text-slate-500'}`}>Bebas dari kotoran & sisa komponen</p>
                            </div>
                        </div>

                        {/* Check 3 */}
                        <div 
                            onClick={() => toggleCheck('pencahayaanNormal')}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${checks.pencahayaanNormal ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                        >
                            <div className="shrink-0">
                                {checks.pencahayaanNormal ? <CheckSquare className="w-6 h-6 text-emerald-500" /> : <Square className="w-6 h-6 text-slate-300" />}
                            </div>
                            <div>
                                <p className={`font-bold text-base ${checks.pencahayaanNormal ? 'text-emerald-800' : 'text-slate-700'}`}>Lampu / Lighting Normal</p>
                                <p className={`text-sm ${checks.pencahayaanNormal ? 'text-emerald-600' : 'text-slate-500'}`}>Lampu sorot/ring light menyala baik</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-4 mt-2 border-t border-slate-100 shrink-0">
                    <button 
                        onClick={onClose}
                        className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl transition-colors text-lg"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={onConfirm}
                        disabled={!allChecked}
                        className={`flex-1 py-3.5 font-bold rounded-2xl transition-all text-lg shadow-lg ${
                            allChecked 
                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 translate-y-0' 
                            : 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
                        }`}
                    >
                        Mulai Inspeksi
                    </button>
                </div>

            </div>
        </div>
    );
}
