import { useState } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const roleBadgeColors = {
    admin: 'bg-orange-50 text-orange-700 border-orange-200',
    supervisor: 'bg-amber-50 text-amber-700 border-amber-200',
    member: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const roleLabels = {
    admin: 'Admin',
    supervisor: 'Supervisor',
    member: 'Member',
};

// ========== MODAL COMPONENT ==========
function UserModal({ isOpen, onClose, editUser }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: editUser?.name || '',
        email: editUser?.email || '',
        password: '',
        role: editUser?.role || 'member',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editUser) {
            put(`/admin/users/${editUser.id}`, { onSuccess: () => { onClose(); reset(); } });
        } else {
            post('/admin/users', { onSuccess: () => { onClose(); reset(); } });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">
                            {editUser ? 'Edit User' : 'Tambah User Baru'}
                        </h3>
                        <button onClick={onClose}
                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100
                                text-gray-400 hover:text-gray-600 transition-colors cursor-pointer border-0 bg-transparent">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                            <input
                                type="text" value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all
                                    focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10
                                    ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
                                placeholder="Masukkan nama lengkap"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                            <input
                                type="email" value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all
                                    focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10
                                    ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                                placeholder="nama@perusahaan.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password {editUser && <span className="text-gray-400 font-normal">(kosongkan jika tidak diubah)</span>}
                            </label>
                            <input
                                type="password" value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none transition-all
                                    focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                                placeholder="••••••••"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none transition-all
                                    focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10
                                    bg-white cursor-pointer appearance-none"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '20px' }}
                            >
                                <option value="member">Member</option>
                                <option value="supervisor">Supervisor</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose}
                                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-medium
                                    text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer bg-white">
                                Batal
                            </button>
                            <button type="submit" disabled={processing}
                                className={`flex-1 py-3 rounded-xl border-0 text-sm font-semibold text-white
                                    transition-all cursor-pointer shadow-lg shadow-orange-500/25
                                    ${processing ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-xl'}`}>
                                {processing ? 'Menyimpan...' : editUser ? 'Simpan Perubahan' : 'Tambah User'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// ========== MAIN PAGE ==========
export default function Users() {
    const { users, flash, auth } = usePage().props;
    const [modalOpen, setModalOpen] = useState(false);
    const [editUser, setEditUser] = useState(null);

    const openCreate = () => { setEditUser(null); setModalOpen(true); };
    const openEdit = (user) => { setEditUser(user); setModalOpen(true); };
    const handleDelete = (user) => {
        if (confirm(`Yakin ingin menghapus "${user.name}"?`)) {
            router.delete(`/admin/users/${user.id}`);
        }
    };

    return (
        <AdminLayout title="Manajemen User" user={auth.user}>
            <Head title="Kelola User" />

            {/* Flash Message */}
            {flash?.success && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
                    ✓ {flash.success}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Kelola User</h1>
                    <p className="text-sm text-gray-500 mt-1">{users?.length || 0} user terdaftar</p>
                </div>
                <button onClick={openCreate}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
                        bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold
                        shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30
                        transition-all duration-200 cursor-pointer border-0 active:scale-[0.98]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Tambah User
                </button>
            </div>

            {/* Desktop Table (hidden on mobile) */}
            <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user) => (
                            <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-purple-500
                                            flex items-center justify-center text-white font-bold text-sm shrink-0">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-900 text-sm">{user.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleBadgeColors[user.role]}`}>
                                        {roleLabels[user.role]}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => openEdit(user)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-orange-600
                                                bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer border-0">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(user)}
                                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-600
                                                bg-red-50 hover:bg-red-100 transition-colors cursor-pointer border-0">
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards (hidden on desktop) */}
            <div className="md:hidden space-y-3">
                {users?.map((user) => (
                    <div key={user.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-purple-500
                                    flex items-center justify-center text-white font-bold text-sm shrink-0">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
                                </div>
                            </div>
                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${roleBadgeColors[user.role]}`}>
                                {roleLabels[user.role]}
                            </span>
                        </div>
                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                            <button onClick={() => openEdit(user)}
                                className="flex-1 py-2 rounded-xl text-xs font-medium text-orange-600
                                    bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer border-0">
                                Edit
                            </button>
                            <button onClick={() => handleDelete(user)}
                                className="flex-1 py-2 rounded-xl text-xs font-medium text-red-600
                                    bg-red-50 hover:bg-red-100 transition-colors cursor-pointer border-0">
                                Hapus
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && <UserModal isOpen={modalOpen} onClose={() => setModalOpen(false)} editUser={editUser} />}
        </AdminLayout>
    );
}
