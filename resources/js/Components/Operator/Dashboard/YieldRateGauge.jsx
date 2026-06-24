import React from 'react';

export default function YieldRateGauge({ stats }) {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (stats.yield_rate / 100) * circumference;

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200"></div>
            <h3 className="text-xl font-black text-slate-800 mb-8 tracking-wide">Tingkat Kualitas (Yield Rate)</h3>
            
            <div className="relative flex items-center justify-center mb-8 mt-4">
                {/* Glow Effect behind SVG */}
                <div className={`absolute inset-0 rounded-full blur-[40px] opacity-[0.08] 
                    ${stats.yield_rate >= 90 ? 'bg-emerald-500' : (stats.yield_rate >= 75 ? 'bg-amber-500' : 'bg-red-500')}
                `}></div>
                
                <svg className="w-56 h-56 transform -rotate-90 relative z-10">
                    {/* Track */}
                    <circle 
                        cx="112" cy="112" r={radius} 
                        stroke="currentColor" strokeWidth="20" fill="transparent" 
                        className="text-slate-100"
                    />
                    {/* Value */}
                    <circle 
                        cx="112" cy="112" r={radius} 
                        stroke="currentColor" strokeWidth="20" fill="transparent" 
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={`${stats.yield_rate >= 90 ? 'text-emerald-500' : (stats.yield_rate >= 75 ? 'text-amber-500' : 'text-red-500')} transition-all duration-1500 ease-out`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <span className={`text-5xl font-black tracking-tight ${stats.yield_rate >= 90 ? 'text-emerald-600' : (stats.yield_rate >= 75 ? 'text-amber-600' : 'text-red-600')}`}>
                        {stats.yield_rate}%
                    </span>
                </div>
            </div>

            <div className="text-center w-full bg-slate-50 rounded-2xl py-4 px-6 border border-slate-100">
                <p className={`text-base font-bold flex items-center justify-center gap-2
                    ${stats.yield_rate >= 95 ? 'text-emerald-600' : (stats.yield_rate >= 80 ? 'text-amber-600' : 'text-red-600')}
                `}>
                    {stats.yield_rate >= 95 ? '🔥 Kinerja Luar Biasa!' : (stats.yield_rate >= 80 ? '👍 Kinerja Stabil' : '⚠️ Tingkatkan Ketelitian')}
                </p>
                <p className="text-slate-500 text-sm mt-1 font-medium">Berdasarkan total {stats.total} inspeksi hari ini</p>
            </div>
        </div>
    );
}
