import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminSidebar from '@/Components/Admin/Shared/AdminSidebar';
import AdminTopbar from '@/Components/Admin/Shared/AdminTopbar';

export default function AdminLayout({ children, title, user }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <Head title={`${title} - Admin Camera Inspection`} />

            {/* Sidebar */}
            <AdminSidebar 
                isOpen={isSidebarOpen} 
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
                user={user}
            />

            {/* Main Content Area */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isSidebarOpen ? 'md:pl-64' : 'pl-0'}`}>
                <AdminTopbar 
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    title={title}
                    user={user}
                />

                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
