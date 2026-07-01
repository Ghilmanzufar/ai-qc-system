import { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

// Ikon SVG sederhana (agar tidak perlu dependensi tambahan)
const Icons = {
    Dashboard: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
    ),
    Users: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
    ),
    Package: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
    ),
    Scanner: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>
        </svg>
    ),
    Chart: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
        </svg>
    ),
    Logout: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
    ),
    Menu: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
        </svg>
    ),
    Close: () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    ),
};

// Konfigurasi menu berdasarkan role
const menuConfig = {
    admin: [
        { name: 'Dashboard', href: '/admin/dashboard', routeName: 'admin.dashboard', icon: Icons.Dashboard },
        { name: 'Kelola User', href: '/admin/users', routeName: 'admin.users', icon: Icons.Users },
        { name: 'Kelola Produk', href: '/admin/products', routeName: 'admin.products', icon: Icons.Package },
    ],
    supervisor: [
        { name: 'Live Monitoring', href: '/supervisor/dashboard', routeName: 'supervisor.dashboard', icon: Icons.Chart },
    ],
    operator: [
        { name: 'Scanner Packing', href: '/operator/scanner', routeName: 'operator.scanner', icon: Icons.Scanner },
    ],
};

// Label role yang ramah
const roleLabels = {
    admin: 'Administrator',
    supervisor: 'Supervisor',
    operator: 'Operator',
};

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const currentUrl = window.location.pathname;
    const menus = menuConfig[user?.role] || [];

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-[#f8f9fc] font-sans">
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 z-50 h-full w-[260px] bg-white border-r border-gray-200/80
                flex flex-col transition-transform duration-300 ease-in-out
                lg:translate-x-0
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo */}
                <div className="flex items-center justify-between px-6 h-[72px] border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-max px-3 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-200">
                            Packing
                        </div>
                        <div>
                            <h1 className="text-[15px] font-bold text-gray-900 leading-tight">AI Packing System</h1>
                            <p className="text-[11px] text-gray-400 leading-tight">Packing</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 rounded-lg hover:bg-gray-100 text-gray-400"
                    >
                        <Icons.Close />
                    </button>
                </div>

                {/* Nav Menu */}
                <nav className="flex-1 px-3 py-4 overflow-y-auto">
                    <p className="px-3 mb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Menu</p>
                    <div className="space-y-1">
                        {menus.map((item) => {
                            const isActive = currentUrl.startsWith(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium
                                        transition-all duration-200 no-underline
                                        ${isActive
                                            ? 'bg-gradient-to-r from-orange-50 to-purple-50 text-orange-700 shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }
                                    `}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className={isActive ? 'text-orange-600' : 'text-gray-400'}>
                                        <item.icon />
                                    </span>
                                    {item.name}
                                    {isActive && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* User Info & Logout */}
                <div className="border-t border-gray-100 p-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-semibold text-gray-900 truncate">{user?.name}</p>
                            <p className="text-[11px] text-gray-400 truncate">{roleLabels[user?.role] || user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl
                            text-[13px] font-medium text-red-600 bg-red-50
                            hover:bg-red-100 transition-colors duration-200 cursor-pointer border-0"
                    >
                        <Icons.Logout />
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:ml-[260px] min-h-screen flex flex-col">
                {/* Top Bar (Mobile) */}
                <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 lg:hidden">
                    <div className="flex items-center justify-between px-4 h-[60px]">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 cursor-pointer border-0 bg-transparent"
                        >
                            <Icons.Menu />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-max px-2 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                            Packing
                        </div>
                            <span className="text-[14px] font-bold text-gray-900">AI Packing System</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
