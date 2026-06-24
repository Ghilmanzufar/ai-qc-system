import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Camera, AlertTriangle, Users, Package, Clock, CheckCircle2 } from 'lucide-react';

const COLORS = ['#ef4444', '#f97316', '#eab308', '#3b82f6'];

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass, bgClass }) => (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${bgClass} ${colorClass}`}>
            <Icon className="w-7 h-7" />
        </div>
        <div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
            <p className="text-xs font-semibold mt-1 text-slate-500">{subtitle}</p>
        </div>
    </div>
);

export default function Dashboard() {
    const { stats, trendData, topDefects, recentActivity, auth } = usePage().props;

    return (
        <AdminLayout title="Dashboard Analytics" user={auth?.user}>
            <Head title="Admin Dashboard" />

            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Overview Hari Ini</h1>
                <p className="text-slate-500 mt-1 font-medium">Pantauan real-time aktivitas inspeksi AI QC di seluruh lini produksi.</p>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Total Inspeksi" 
                    value={stats?.todayInspections || 0} 
                    subtitle="Part di-scan hari ini"
                    icon={Camera}
                    colorClass="text-blue-600"
                    bgClass="bg-blue-50"
                />
                <StatCard 
                    title="Global Yield Rate" 
                    value={`${stats?.yieldRate || 0}%`} 
                    subtitle="Tingkat kelulusan (PASS)"
                    icon={Activity}
                    colorClass="text-emerald-600"
                    bgClass="bg-emerald-50"
                />
                <StatCard 
                    title="Total Defect / NG" 
                    value={stats?.todayNg || 0} 
                    subtitle="Part ditolak hari ini"
                    icon={AlertTriangle}
                    colorClass="text-red-600"
                    bgClass="bg-red-50"
                />
                <StatCard 
                    title="Member Aktif" 
                    value={stats?.activeOperators || 0} 
                    subtitle="Bekerja pada shift ini"
                    icon={Users}
                    colorClass="text-purple-600"
                    bgClass="bg-purple-50"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Main Trend Chart */}
                <div className="lg:col-span-2 bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Tren Inspeksi (7 Hari Terakhir)</h3>
                        <p className="text-sm text-slate-500">Perbandingan produk lulus uji (PASS) vs gagal uji (NG).</p>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPass" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorNg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}
                                    cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '5 5' }}
                                />
                                <Area type="monotone" dataKey="pass" name="PASS" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPass)" />
                                <Area type="monotone" dataKey="ng" name="NG" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorNg)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Defects Pie Chart */}
                <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm flex flex-col">
                    <div className="mb-2">
                        <h3 className="text-lg font-bold text-slate-800">Top 4 Jenis Defect (Hari Ini)</h3>
                        <p className="text-sm text-slate-500">Distribusi masalah terbanyak.</p>
                    </div>
                    {topDefects && topDefects.length > 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center">
                            <div className="h-48 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={topDefects}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="total"
                                        >
                                            {topDefects.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value) => [`${value} Part`, 'Jumlah']}
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-full grid grid-cols-2 gap-2 mt-4">
                                {topDefects.map((defect, index) => (
                                    <div key={index} className="flex items-center gap-2 text-xs">
                                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-slate-600 truncate" title={defect.defect_type}>{defect.defect_type}</span>
                                        <span className="font-bold text-slate-800 ml-auto">{defect.total}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                <CheckCircle2 className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-sm font-bold text-slate-500">Belum Ada Defect Hari Ini</p>
                            <p className="text-xs text-slate-400 mt-1">Luar biasa! Produksi berjalan sempurna sejauh ini.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-[24px] p-6 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Aktivitas Inspeksi Terbaru (Global)</h3>
                        <p className="text-sm text-slate-500">10 data pemindaian terakhir dari semua lini.</p>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                                <th className="pb-3 font-semibold w-24">Waktu</th>
                                <th className="pb-3 font-semibold">Member</th>
                                <th className="pb-3 font-semibold">Part Number</th>
                                <th className="pb-3 font-semibold text-center w-24">Status AI</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentActivity?.map((activity) => (
                                <tr key={activity.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="py-3">
                                        <div className="flex items-center gap-2 text-sm text-slate-500">
                                            <Clock className="w-4 h-4 text-slate-300" />
                                            {new Date(activity.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {activity.user?.name?.charAt(0) || '?'}
                                            </div>
                                            <span className="text-sm font-bold text-slate-700">{activity.user?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Package className="w-4 h-4 text-slate-400" />
                                            <span className="font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{activity.part?.part_no || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 text-center">
                                        {activity.final_decision === 'PASS' ? (
                                            <span className="inline-flex px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-black tracking-wider rounded-lg">PASS</span>
                                        ) : (
                                            <span className="inline-flex px-3 py-1 bg-red-100 text-red-700 text-xs font-black tracking-wider rounded-lg">NG</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {(!recentActivity || recentActivity.length === 0) && (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-slate-400 text-sm">
                                        Belum ada aktivitas inspeksi hari ini.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </AdminLayout>
    );
}
