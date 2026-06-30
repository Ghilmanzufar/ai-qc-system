import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Layers, Info } from 'lucide-react';

export default function ResultPanel({ result, part }) {
    if (!result) {
        return (
            <div className="flex flex-col h-full min-h-[70vh]">
                <div className="bg-white rounded-[24px] p-8 border border-slate-200/60 shadow-sm flex flex-col items-center justify-center flex-1 h-full text-center">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                        <Info className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-400">Menunggu Inspeksi</h3>
                    <p className="text-slate-400 mt-2 max-w-sm">Ambil foto part menggunakan kamera di samping untuk melihat hasil analisis AI.</p>
                </div>
            </div>
        );
    }

    const isPass = result.status === 'OK' || result.status === 'PASS';

    return (
        <div className="flex flex-col h-full min-h-[70vh]">
            <div className="bg-white rounded-[24px] p-6 border border-slate-200/60 shadow-sm flex-1 flex flex-col relative overflow-hidden">
                {/* Background decorative elements */}
                <div className={`absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none ${isPass ? 'bg-emerald-500' : 'bg-red-500'}`}></div>

                <div className="flex items-center gap-3 mb-6">
                    <Layers className="w-5 h-5 text-slate-400" />
                    <h2 className="font-black text-slate-800 tracking-tight">INFORMASI HASIL</h2>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center mb-8">
                    {isPass ? (
                        <>
                            <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center mb-4 border-4 border-emerald-50 shadow-xl shadow-emerald-500/20">
                                <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                            </div>
                            <h2 className="text-5xl font-black text-emerald-600 tracking-tight">PASS</h2>
                            <p className="text-emerald-600/80 font-bold mt-2 text-lg">Part Memenuhi Standar</p>
                        </>
                    ) : (
                        <>
                            <div className="w-32 h-32 bg-red-100 rounded-full flex items-center justify-center mb-4 border-4 border-red-50 shadow-xl shadow-red-500/20">
                                <XCircle className="w-16 h-16 text-red-500" />
                            </div>
                            <h2 className="text-5xl font-black text-red-600 tracking-tight">REJECT</h2>
                            <p className="text-red-600/80 font-bold mt-2 text-lg">Part Tidak Memenuhi Standar</p>
                        </>
                    )}
                </div>

                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 space-y-4 relative z-10">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200 border-dashed">
                        <span className="text-slate-500 font-medium">Part Model</span>
                        <span className="font-bold text-slate-800">{part?.product_model?.name || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200 border-dashed">
                        <span className="text-slate-500 font-medium">Part Number</span>
                        <span className="font-bold text-slate-800">{part?.part_no || '-'}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200 border-dashed">
                        <span className="text-slate-500 font-medium">Jumlah Objek</span>
                        <span className={`font-black text-lg ${isPass ? 'text-emerald-600' : 'text-red-600'}`}>{result.object_count || 0} / 3</span>
                    </div>
                    
                    {/* Detail Kelas Objek */}
                    {result.class_details && Object.keys(result.class_details).length > 0 && (
                        <div className="pb-4 border-b border-slate-200 border-dashed">
                            <span className="text-slate-500 font-medium block mb-3">Detail Objek Terdeteksi:</span>
                            <div className="space-y-2">
                                {Object.entries(result.class_details).map(([className, count], index) => (
                                    <div key={index} className="flex justify-between items-center bg-white px-4 py-2 rounded-xl border border-slate-200">
                                        <span className="text-slate-700 font-medium capitalize">{className}</span>
                                        <span className="font-bold text-slate-800">{count}x</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 font-medium">Confidence (Akurasi AI)</span>
                        <span className="font-black text-slate-800">{result.confidence ? (result.confidence * 100).toFixed(1) + '%' : '-'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
