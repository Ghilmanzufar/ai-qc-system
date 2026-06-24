import React from 'react';
import { Layers, CheckCircle2 } from 'lucide-react';

export default function PartCard({ part, isSelected, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
                relative w-full text-left p-5 rounded-2xl flex items-start gap-5 transition-all duration-300 group
                ${isSelected 
                    ? 'bg-gradient-to-br from-emerald-50 to-white border-2 border-emerald-400 shadow-emerald-500/20 shadow-lg scale-[1.02] ring-4 ring-emerald-500/10' 
                    : 'bg-slate-200/90 border-2 border-slate-300/80 shadow-sm hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-slate-400'
                }
            `}
        >
            {/* Glowing indicator */}
            {isSelected && (
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-2xl blur opacity-30 -z-10 animate-pulse"></div>
            )}

            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-inner ${
                isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-300/80 text-slate-600 group-hover:bg-slate-100 group-hover:text-slate-700'
            }`}>
                <Layers className="w-7 h-7" />
            </div>

            <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded-md border ${
                        isSelected ? 'bg-emerald-100 border-emerald-200 text-emerald-700' : 'bg-white border-slate-300 text-slate-700'
                    }`}>
                        {part.part_no}
                    </span>
                </div>
                <h3 className={`text-xl font-black truncate leading-tight ${
                    isSelected ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'
                }`}>
                    {part.part_name}
                </h3>
                <p className={`text-sm font-medium mt-1 truncate ${
                    isSelected ? 'text-emerald-600/80' : 'text-slate-400'
                }`}>
                    {part.modelName}
                </p>
            </div>

            <div className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                isSelected ? 'bg-emerald-100 text-emerald-600' : 'text-transparent'
            }`}>
                <CheckCircle2 className="w-5 h-5" />
            </div>
        </button>
    );
}
