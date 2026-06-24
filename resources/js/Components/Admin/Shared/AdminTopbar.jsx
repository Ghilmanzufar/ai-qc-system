import React from 'react';
import { Menu } from 'lucide-react';

export default function AdminTopbar({ onMenuClick, title }) {
    return (
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 md:px-8 flex items-center shadow-sm">
            
            <div className="flex items-center gap-4">
                <button 
                    onClick={onMenuClick}
                    className="p-2 -ml-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
                
                <h1 className="text-2xl font-black text-slate-800 tracking-tight sm:block">{title}</h1>
            </div>
            
        </header>
    );
}
