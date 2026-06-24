import React from 'react';
import { Target, ScanLine, CheckCircle2, XCircle } from 'lucide-react';

export default function StatCards({ stats }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Target Card */}
            <div className="bg-white rounded-3xl p-7 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 group-hover:opacity-10 transition-all duration-500">
                    <Target className="w-24 h-24 text-blue-600" />
                </div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
                        <Target className="w-6 h-6" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-wider mb-2 text-xs">Target Harian</p>
                    <div className="flex items-end gap-2 mb-4">
                        <h3 className="text-5xl font-black text-slate-800">{stats.total}</h3>
                        <span className="text-xl font-bold text-slate-400 mb-1">/ {stats.target}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5 mb-2 overflow-hidden">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full relative"
                            style={{ width: `${stats.target_achievement}%` }}
                        ></div>
                    </div>
                    <p className="text-sm font-bold text-blue-600">{stats.target_achievement}% Tercapai</p>
                </div>
            </div>

            {/* Total Scanned Card */}
            <div className="bg-white rounded-3xl p-7 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 group-hover:opacity-10 transition-all duration-500">
                    <ScanLine className="w-24 h-24 text-indigo-600" />
                </div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4 border border-indigo-100">
                        <ScanLine className="w-6 h-6" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-wider mb-2 text-xs">Total Diperiksa</p>
                    <h3 className="text-6xl font-black text-slate-800 mb-1">{stats.total}</h3>
                    <p className="text-indigo-600/70 font-bold">Komponen</p>
                </div>
            </div>

            {/* PASS Card */}
            <div className="bg-white rounded-3xl p-7 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 group-hover:opacity-10 transition-all duration-500">
                    <CheckCircle2 className="w-24 h-24 text-emerald-600" />
                </div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 border border-emerald-100">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-wider mb-2 text-xs">Produk Lolos (PASS)</p>
                    <h3 className="text-6xl font-black text-slate-800 mb-1">{stats.pass}</h3>
                    <p className="text-emerald-600/70 font-bold">Komponen Bagus</p>
                </div>
            </div>

            {/* NG Card */}
            <div className="bg-white rounded-3xl p-7 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-125 group-hover:opacity-10 transition-all duration-500">
                    <XCircle className="w-24 h-24 text-red-600" />
                </div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 border border-red-100">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-wider mb-2 text-xs">Produk Cacat (NG)</p>
                    <h3 className="text-6xl font-black text-slate-800 mb-1">{stats.ng}</h3>
                    <p className="text-red-600/70 font-bold">Komponen Ditolak</p>
                </div>
            </div>
        </div>
    );
}
