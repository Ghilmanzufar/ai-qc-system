import React from 'react';
import { Clock, CheckCircle2, XCircle, Activity } from 'lucide-react';

export default function HistoryTable({ data, formatTime }) {
    return (
        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col flex-1 max-h-[calc(100vh-250px)]">
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Waktu</th>
                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Kode Inspeksi</th>
                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Model / Part No</th>
                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Hasil Depan</th>
                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Hasil Belakang</th>
                            <th className="py-4 px-6 text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Keputusan Akhir</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2 text-slate-600 font-bold">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            {formatTime(item.created_at)}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-sm font-black text-slate-700">{item.inspection_code}</span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-slate-400">{item.part?.product_model?.name || '-'}</span>
                                            <span className="text-sm font-black text-slate-800">{item.part?.part_no || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`text-xs font-black px-2 py-1 rounded-md ${item.front_status === 'OK' ? 'bg-emerald-100 text-emerald-700' : (item.front_status === 'NG' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500')}`}>
                                            {item.front_status || '-'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`text-xs font-black px-2 py-1 rounded-md ${item.back_status === 'OK' ? 'bg-emerald-100 text-emerald-700' : (item.back_status === 'NG' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500')}`}>
                                            {item.back_status || '-'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        {item.final_decision === 'PASS' ? (
                                            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg w-max shadow-sm">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                <span className="text-sm font-black text-emerald-700">PASS</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg w-max shadow-sm">
                                                <XCircle className="w-4 h-4 text-red-600" />
                                                <span className="text-sm font-black text-red-700">NG {item.defect_type ? `(${item.defect_type})` : ''}</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <Activity className="w-12 h-12 mb-3 text-slate-300" />
                                        <p className="text-lg font-bold text-slate-500">Belum ada riwayat hari ini</p>
                                        <p className="text-sm">Riwayat inspeksi akan muncul di sini setelah Anda menyelesaikan pemindaian.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
