import React from 'react';
import { Menu } from 'lucide-react';

export default function OperatorTopbar({ onMenuClick, title, subtitle, rightContent, centerContent, extraClasses = "" }) {
    return (
        <nav className={`sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-4 ${extraClasses}`}>
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick}
                    className="flex w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 items-center justify-center transition-colors border border-slate-200 shadow-sm shrink-0"
                >
                    <Menu className="w-6 h-6 text-slate-700" />
                </button>
                <div className="hidden xl:block">
                    <h1 className="text-lg font-black text-slate-900 tracking-tight leading-tight">{title || "Lens QC"}</h1>
                    {subtitle && (
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{subtitle}</p>
                    )}
                </div>
            </div>

            {centerContent && (
                <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-3 min-w-[300px]">
                    {centerContent}
                </div>
            )}
            
            {rightContent && (
                <div className="flex items-center gap-4">
                    {rightContent}
                </div>
            )}
        </nav>
    );
}
