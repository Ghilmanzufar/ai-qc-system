import { useState } from 'react';
import { Head, usePage, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// ========== MODALS ==========
function ModelModal({ isOpen, onClose }) {
    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });
    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/models', { onSuccess: () => { onClose(); reset(); } });
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Tambah Model Produk</h3>
                        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 cursor-pointer border-0 bg-transparent">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Model</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
                                placeholder="Contoh: Kipas Angin Elektrik" autoFocus />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer bg-white">Batal</button>
                            <button type="submit" disabled={processing} className={`flex-1 py-3 rounded-xl border-0 text-sm font-semibold text-white transition-all cursor-pointer shadow-lg shadow-indigo-500/25 ${processing ? 'bg-gray-400' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl'}`}>
                                {processing ? 'Menyimpan...' : 'Tambah Model'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

function PartModal({ isOpen, onClose, modelId, editPart }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        product_model_id: modelId || editPart?.product_model_id || '',
        part_no: editPart?.part_no || '',
        part_name: editPart?.part_name || '',
        ai_model_file: editPart?.ai_model_file || '',
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (editPart) {
            put(`/admin/parts/${editPart.id}`, { onSuccess: () => { onClose(); reset(); } });
        } else {
            post('/admin/parts', { onSuccess: () => { onClose(); reset(); } });
        }
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">{editPart ? 'Edit Part' : 'Tambah Part Baru'}</h3>
                        <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-400 cursor-pointer border-0 bg-transparent">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Part No.</label>
                            <input type="text" value={data.part_no} onChange={(e) => setData('part_no', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ${errors.part_no ? 'border-red-300' : 'border-gray-200'}`}
                                placeholder="Contoh: KP-001" autoFocus />
                            {errors.part_no && <p className="text-red-500 text-xs mt-1">{errors.part_no}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Part</label>
                            <input type="text" value={data.part_name} onChange={(e) => setData('part_name', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ${errors.part_name ? 'border-red-300' : 'border-gray-200'}`}
                                placeholder="Contoh: Baling-Baling" />
                            {errors.part_name && <p className="text-red-500 text-xs mt-1">{errors.part_name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                File AI Model <span className="text-gray-400 font-normal">(.pt)</span>
                            </label>
                            <input type="text" value={data.ai_model_file} onChange={(e) => setData('ai_model_file', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                                placeholder="Contoh: best.pt atau yolo26n.pt" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer bg-white">Batal</button>
                            <button type="submit" disabled={processing} className={`flex-1 py-3 rounded-xl border-0 text-sm font-semibold text-white transition-all cursor-pointer shadow-lg shadow-indigo-500/25 ${processing ? 'bg-gray-400' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-xl'}`}>
                                {processing ? 'Menyimpan...' : editPart ? 'Simpan Perubahan' : 'Tambah Part'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// ========== MAIN PAGE ==========
export default function Products() {
    const { productModels, flash } = usePage().props;
    const [modelModalOpen, setModelModalOpen] = useState(false);
    const [partModal, setPartModal] = useState({ open: false, modelId: null, editPart: null });

    const handleDeleteModel = (model) => {
        if (confirm(`Hapus model "${model.name}" beserta semua part-nya?`)) {
            router.delete(`/admin/models/${model.id}`);
        }
    };

    const handleDeletePart = (part) => {
        if (confirm(`Hapus part "${part.part_name}"?`)) {
            router.delete(`/admin/parts/${part.id}`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Kelola Produk" />

            {flash?.success && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
                    ✓ {flash.success}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Kelola Produk & Part</h1>
                    <p className="text-sm text-gray-500 mt-1">{productModels?.length || 0} model produk terdaftar</p>
                </div>
                <button onClick={() => setModelModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
                        bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold
                        shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30
                        transition-all duration-200 cursor-pointer border-0 active:scale-[0.98]">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    Tambah Model
                </button>
            </div>

            {/* Product Model Cards */}
            <div className="space-y-5">
                {productModels?.map((model) => (
                    <div key={model.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Model Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600
                                    flex items-center justify-center text-white shadow-md shrink-0">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{model.name}</h3>
                                    <p className="text-xs text-gray-400">{model.parts?.length || 0} parts</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <button onClick={() => setPartModal({ open: true, modelId: model.id, editPart: null })}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                                        text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer border-0">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    Tambah Part
                                </button>
                                <button onClick={() => handleDeleteModel(model)}
                                    className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 bg-red-50
                                        hover:bg-red-100 transition-colors cursor-pointer border-0">
                                    Hapus Model
                                </button>
                            </div>
                        </div>

                        {/* Parts — Desktop Table */}
                        {model.parts?.length > 0 ? (
                            <>
                                <div className="hidden sm:block">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-100">
                                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Part No.</th>
                                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nama Part</th>
                                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">AI Model</th>
                                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {model.parts.map((part) => (
                                                <tr key={part.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-3.5">
                                                        <span className="inline-flex px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-mono font-semibold text-gray-700">{part.part_no}</span>
                                                    </td>
                                                    <td className="px-6 py-3.5 text-sm text-gray-700 font-medium">{part.part_name}</td>
                                                    <td className="px-6 py-3.5">
                                                        {part.ai_model_file ? (
                                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-xs font-mono font-semibold text-emerald-700 border border-emerald-200">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                {part.ai_model_file}
                                                            </span>
                                                        ) : (
                                                            <span className="text-xs text-gray-300 italic">Belum diset</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3.5">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => setPartModal({ open: true, modelId: model.id, editPart: part })}
                                                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer border-0">Edit</button>
                                                            <button onClick={() => handleDeletePart(part)}
                                                                className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer border-0">Hapus</button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Parts — Mobile Cards */}
                                <div className="sm:hidden divide-y divide-gray-100">
                                    {model.parts.map((part) => (
                                        <div key={part.id} className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="inline-flex px-2 py-0.5 rounded-md bg-gray-100 text-xs font-mono font-semibold text-gray-600">{part.part_no}</span>
                                                    </div>
                                                    <p className="text-sm font-medium text-gray-900">{part.part_name}</p>
                                                    {part.ai_model_file && (
                                                        <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-xs font-mono text-emerald-700">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />{part.ai_model_file}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                <button onClick={() => setPartModal({ open: true, modelId: model.id, editPart: part })}
                                                    className="flex-1 py-2 rounded-xl text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer border-0">Edit</button>
                                                <button onClick={() => handleDeletePart(part)}
                                                    className="flex-1 py-2 rounded-xl text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer border-0">Hapus</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="px-6 py-8 text-center">
                                <p className="text-sm text-gray-400">Belum ada part untuk model ini.</p>
                                <button onClick={() => setPartModal({ open: true, modelId: model.id, editPart: null })}
                                    className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold
                                        text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer border-0">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                    Tambah Part Pertama
                                </button>
                            </div>
                        )}
                    </div>
                ))}

                {(!productModels || productModels.length === 0) && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-700">Belum ada model produk</h3>
                        <p className="text-sm text-gray-400 mt-1">Mulai dengan menambahkan model produk pertama Anda.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ModelModal isOpen={modelModalOpen} onClose={() => setModelModalOpen(false)} />
            <PartModal isOpen={partModal.open} onClose={() => setPartModal({ open: false, modelId: null, editPart: null })} modelId={partModal.modelId} editPart={partModal.editPart} />
        </AuthenticatedLayout>
    );
}
