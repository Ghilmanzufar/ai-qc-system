import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Megaphone, AlertTriangle, Plus, Trash2, CheckCircle2, Clock, X, Search } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function AnnouncementsIndex({ announcements, auth }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        body: '',
        type: 'broadcast',
        target_role: 'all',
        expires_at: ''
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.announcements.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghentikan pengumuman ini?')) {
            router.delete(route('admin.announcements.destroy', id));
        }
    };

    const filteredAnnouncements = announcements.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        a.body.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminLayout title="Papan Pengumuman" user={auth.user}>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">Manajemen Pengumuman</h2>
                    <p className="text-slate-500 font-medium">Buat dan kelola pesan siaran untuk semua stasiun kerja.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/30"
                >
                    <Plus className="w-5 h-5" />
                    Buat Pengumuman Baru
                </button>
            </div>

            {/* Content Cards */}
            <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-slate-400" />
                        Riwayat Pengumuman
                    </h3>
                    
                    <div className="relative w-full md:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Cari pesan..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-bold border-b border-slate-200">Status & Tipe</th>
                                <th className="p-4 font-bold border-b border-slate-200">Judul & Isi</th>
                                <th className="p-4 font-bold border-b border-slate-200">Target</th>
                                <th className="p-4 font-bold border-b border-slate-200">Insight</th>
                                <th className="p-4 font-bold border-b border-slate-200">Waktu Dibuat</th>
                                <th className="p-4 font-bold border-b border-slate-200 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAnnouncements.map((ann) => (
                                <tr key={ann.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 align-top">
                                        <div className="flex flex-col gap-2">
                                            {ann.is_active ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-700 w-max">
                                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Aktif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-600 w-max">
                                                    Nonaktif
                                                </span>
                                            )}
                                            
                                            {ann.type === 'alert' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 w-max">
                                                    <AlertTriangle className="w-3 h-3" /> Alert
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 w-max">
                                                    <Megaphone className="w-3 h-3" /> Broadcast
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 align-top max-w-sm">
                                        <p className="font-bold text-slate-800 text-sm mb-1 truncate">{ann.title}</p>
                                        <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{ann.body}</p>
                                    </td>
                                    <td className="p-4 align-top">
                                        <span className="text-xs font-bold text-slate-600 uppercase bg-slate-100 px-2 py-1 rounded-md">
                                            {ann.target_role}
                                        </span>
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                                                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-800">{ann.reads_count}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Telah Membaca</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 align-top text-xs text-slate-500 font-medium">
                                        {new Date(ann.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}<br/>
                                        {new Date(ann.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                        <div className="mt-1 text-slate-400 text-[10px]">Oleh: {ann.creator?.name}</div>
                                    </td>
                                    <td className="p-4 align-top text-right">
                                        {ann.is_active && (
                                            <button 
                                                onClick={() => handleDelete(ann.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hentikan Pengumuman"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}

                            {filteredAnnouncements.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-500">
                                        Tidak ada data pengumuman yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Buat Baru */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-[24px] w-full max-w-xl shadow-2xl overflow-hidden scale-up-animation">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-800">Buat Pengumuman Baru</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={submit} className="p-6 space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Tipe Pesan</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setData('type', 'broadcast')}
                                            className={`flex-1 py-2 px-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                                data.type === 'broadcast' 
                                                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                            }`}
                                        >
                                            <Megaphone className="w-4 h-4" /> Broadcast
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('type', 'alert')}
                                            className={`flex-1 py-2 px-3 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                                                data.type === 'alert' 
                                                ? 'bg-red-50 border-red-200 text-red-700' 
                                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                            }`}
                                        >
                                            <AlertTriangle className="w-4 h-4" /> Alert Modal
                                        </button>
                                    </div>
                                    {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Target Role</label>
                                    <select 
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                        value={data.target_role}
                                        onChange={e => setData('target_role', e.target.value)}
                                    >
                                        <option value="all">Semua Orang</option>
                                        <option value="operator">Hanya Operator</option>
                                        <option value="supervisor">Hanya Supervisor</option>
                                    </select>
                                    {errors.target_role && <p className="text-red-500 text-xs mt-1">{errors.target_role}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Judul Pengumuman</label>
                                <input 
                                    type="text" 
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Contoh: Info Shift Siang"
                                    required
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700">Isi Pesan Lengkap</label>
                                <textarea 
                                    value={data.body}
                                    onChange={e => setData('body', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none custom-scrollbar"
                                    placeholder="Tulis instruksi atau informasi detail di sini..."
                                    required
                                ></textarea>
                                {errors.body && <p className="text-red-500 text-xs mt-1">{errors.body}</p>}
                            </div>

                            <div className="pt-4 flex gap-3 border-t border-slate-100">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Siarkan Sekarang'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            <style>{`
                .scale-up-animation {
                    animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes scaleUp {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </AdminLayout>
    );
}
