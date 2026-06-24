import React from 'react';
import { Camera, XCircle } from 'lucide-react';

export default function RejectCard({ item, formatTime }) {
    return (
        <div className="bg-white rounded-3xl p-5 border border-red-100 shadow-xl shadow-red-500/5 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-red-500"></div>
            <div className="flex justify-between items-start mb-4 mt-2">
                <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{formatTime(item.created_at)}</span>
                    <h3 className="text-lg font-black text-slate-800">{item.inspection_code}</h3>
                    <p className="text-sm font-bold text-slate-500">{item.part?.modelName || item.part?.product_model?.name || '-'} • {item.part?.part_no}</p>
                </div>
                <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border border-red-100 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm font-black">NG</span>
                </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100 flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">Diagnosa Cacat:</p>
                <p className="text-sm font-medium text-slate-700">{item.defect_type || 'Defect tidak terspesifikasi atau terdeteksi oleh operator'}</p>
            </div>

            <button className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md group-hover:shadow-lg">
                <Camera className="w-5 h-5" />
                Ambil Foto Bukti
            </button>
        </div>
    );
}
