import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Megaphone, Users, Package, FileText, Settings, LogOut, X } from 'lucide-react';
import LogoutConfirmModal from '@/Components/Operator/Shared/LogoutConfirmModal';

export default function AdminSidebar({ isOpen, onClose, onLogout, user }) {
    const { url } = usePage();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const menuItems = [
        {
            title: 'Dashboard',
            icon: LayoutDashboard,
            href: route('admin.dashboard'),
            active: url.startsWith('/admin/dashboard') || url === '/admin'
        },
        {
            title: 'Pengumuman',
            icon: Megaphone,
            href: route('admin.announcements.index'),
            active: url.startsWith('/admin/announcements')
        },
        {
            title: 'Laporan Inspeksi',
            icon: FileText,
            href: '#', // TODO: create route('admin.reports.index')
            active: url.startsWith('/admin/reports')
        },
        {
            title: 'Master Part',
            icon: Package,
            href: route('admin.products'), // Using the existing route from web.php
            active: url.startsWith('/admin/products') || url.startsWith('/admin/parts')
        },
        {
            title: 'Manajemen User',
            icon: Users,
            href: route('admin.users'), // Using the existing route from web.php
            active: url.startsWith('/admin/users')
        },
        {
            title: 'Pengaturan',
            icon: Settings,
            href: '#', // TODO: create route('admin.settings.index')
            active: url.startsWith('/admin/settings')
        }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-slate-900 text-slate-300 z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-6 bg-slate-950/50 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-max px-3 h-8 bg-green-500 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-green-500/20">
                            Packing
                        </div>
                        <span className="text-lg font-black text-white tracking-tight">Camera Inspection</span>
                    </div>
                    <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                                item.active 
                                ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' 
                                : 'hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-slate-400'}`} />
                            {item.title}
                        </Link>
                    ))}
                </nav>

                {/* Footer / User Area */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-orange-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
                            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-white truncate">{user?.name || 'Administrator'}</span>
                            <span className="text-xs font-semibold text-green-400 truncate uppercase tracking-wider">{user?.role || 'Admin'}</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsLogoutModalOpen(true)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-colors font-medium"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout System
                    </button>
                </div>
            </aside>

            <LogoutConfirmModal 
                isOpen={isLogoutModalOpen} 
                onClose={() => setIsLogoutModalOpen(false)} 
                onConfirm={onLogout} 
            />
        </>
    );
}
