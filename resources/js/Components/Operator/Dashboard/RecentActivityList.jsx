import React from 'react';
import { router } from '@inertiajs/react';
import { Activity, ChevronRight, CheckCircle2, XCircle, Clock, ScanLine } from 'lucide-react';

export default function RecentActivityList({ recentActivity }) {
    const formatTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                        <Activity className="w-5 h-5 text-blue-600" />
                    </div>
                    Riwayat Inspeksi Terkini
                </h3>
                <button 
                    onClick={() => router.get(route('operator.history'))}
                    className="text-sm font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 bg-slate-50 hover:bg-blue-50 px-4 py-2 rounded-xl border border-slate-200 hover:border-blue-200 transition-all shadow-sm"
                >
                    Lihat Semua <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {recentActivity && recentActivity.length > 0 ? (
                <div className="space-y-4">
                    {recentActivity.map((item) => (
                        <div key={item.id} className="group flex items-center gap-5 p-4 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 transition-all hover:shadow-md hover:-translate-y-0.5">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${item.final_decision === 'PASS' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-600'}`}>
                                {item.final_decision === 'PASS' ? <CheckCircle2 className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-lg font-black text-slate-800 truncate">{item.inspection_code}</h4>
                                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                                        <Clock className="w-3.5 h-3.5 text-blue-500" />
                                        {formatTime(item.created_at)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-sm font-bold text-slate-500 truncate flex items-center gap-1.5">
                                        <ScanLine className="w-3.5 h-3.5" />
                                        {item.part?.part_no}
                                    </span>
                                    {item.final_decision === 'NG' && item.defect_type && (
                                        <span className="px-2.5 py-0.5 rounded-md bg-red-100 border border-red-200 text-red-700 text-[10px] font-black uppercase tracking-wider shadow-sm">
                                            {item.defect_type}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-48 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 border border-slate-200 shadow-sm">
                        <ScanLine className="w-8 h-8 text-slate-400" />
                    </div>
                    <p className="text-slate-600 text-lg font-black mb-1 tracking-wide">Belum Ada Inspeksi</p>
                    <p className="text-sm font-medium text-slate-500">Mulai bertugas dengan memindai komponen di halaman Scanner.</p>
                </div>
            )}
        </div>
    );
}
