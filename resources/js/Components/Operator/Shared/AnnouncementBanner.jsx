import React from 'react';
import { Megaphone, X, Clock } from 'lucide-react';

export default function AnnouncementBanner({ announcements, onDismiss }) {
    if (!announcements || announcements.length === 0) return null;

    const formatTime = (isoString) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    // Tampilkan yang terbaru saja di banner
    const latest = announcements[0];

    return (
        <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 flex items-center gap-3 shadow-md relative z-20 animate-slide-down">
            <div className="flex items-center gap-2 shrink-0">
                <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
                    <Megaphone className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-widest text-blue-100">Pengumuman</span>
            </div>

            <div className="flex-1 min-w-0 flex items-center gap-3">
                <span className="text-sm font-black truncate">{latest.title}</span>
                <span className="text-xs text-blue-200 hidden md:block font-medium truncate">— {latest.body}</span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-blue-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(latest.created_at)}
                </span>
                <button
                    onClick={() => onDismiss(latest.id, 'broadcast')}
                    className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-md flex items-center justify-center transition-colors"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}
