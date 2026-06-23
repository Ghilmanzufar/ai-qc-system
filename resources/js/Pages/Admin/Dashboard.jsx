import { Head, usePage, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

const StatCard = ({ label, value, color, icon, href }) => (
    <Link href={href} className="no-underline group">
        <div className={`bg-white rounded-2xl p-5 sm:p-6 border border-gray-100
            shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}>
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg`}
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)`, boxShadow: `0 4px 14px ${color}33` }}>
                    {icon}
                </div>
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-2 group-hover:text-indigo-500 transition-colors">
                Klik untuk kelola →
            </p>
        </div>
    </Link>
);

export default function Dashboard() {
    const { stats } = usePage().props;

    return (
        <AuthenticatedLayout>
            <Head title="Admin Dashboard" />

            {/* Header */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Ringkasan data sistem AI QC Anda</p>
            </div>

            {/* Stats Grid — responsive: 1 col mobile, 2 col tablet, 4 col desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                <StatCard
                    label="Total Users"
                    value={stats?.totalUsers ?? 0}
                    color="#6366f1"
                    href="/admin/users"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                />
                <StatCard
                    label="Model Produk"
                    value={stats?.totalModels ?? 0}
                    color="#8b5cf6"
                    href="/admin/products"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>}
                />
                <StatCard
                    label="Total Parts"
                    value={stats?.totalParts ?? 0}
                    color="#2a9d90"
                    href="/admin/products"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>}
                />
                <StatCard
                    label="Total Inspeksi"
                    value={stats?.totalInspections ?? 0}
                    color="#e76e50"
                    href="/admin/products"
                    icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>}
                />
            </div>

            {/* Quick Actions */}
            <div className="mt-8 sm:mt-10">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    <Link href="/admin/users" className="no-underline">
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm
                            hover:shadow-md hover:border-indigo-200 transition-all duration-300 cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600
                                    group-hover:bg-indigo-100 transition-colors">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-[15px]">Tambah User Baru</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Operator, Supervisor, atau Admin</p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/products" className="no-underline">
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm
                            hover:shadow-md hover:border-purple-200 transition-all duration-300 cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600
                                    group-hover:bg-purple-100 transition-colors">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-[15px]">Kelola Produk & Part</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Tambah model dan set AI file</p>
                                </div>
                            </div>
                        </div>
                    </Link>

                    <Link href="/supervisor/dashboard" className="no-underline">
                        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm
                            hover:shadow-md hover:border-teal-200 transition-all duration-300 cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600
                                    group-hover:bg-teal-100 transition-colors">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-[15px]">Live Monitoring</p>
                                    <p className="text-xs text-gray-400 mt-0.5">Lihat statistik real-time</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
