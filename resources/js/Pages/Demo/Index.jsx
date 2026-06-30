import React, { useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { UploadCloud, CheckCircle, AlertTriangle, RefreshCw, Box } from 'lucide-react';

export default function DemoIndex() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    
    const imageRef = useRef(null);
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null);
            setError(null);
        }
    };

    const handleImageLoad = (e) => {
        setImageSize({
            width: e.target.naturalWidth,
            height: e.target.naturalHeight
        });
    };

    const handleAnalyze = async () => {
        if (!selectedFile) return;

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await axios.post('/demo/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                setResult(response.data.data);
            } else {
                setError(response.data.message || 'Terjadi kesalahan tidak diketahui.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Gagal terhubung ke server.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
    };

    // Fungsi untuk mengubah kordinat YOLO (pixel absolut) menjadi persentase CSS
    const getBoxStyle = (box) => {
        if (!imageSize.width || !imageSize.height) return {};
        
        const [x1, y1, x2, y2] = box;
        const left = (x1 / imageSize.width) * 100;
        const top = (y1 / imageSize.height) * 100;
        const width = ((x2 - x1) / imageSize.width) * 100;
        const height = ((y2 - y1) / imageSize.height) * 100;

        return {
            left: `${left}%`,
            top: `${top}%`,
            width: `${width}%`,
            height: `${height}%`
        };
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Head title="AI Inference Demo" />

            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                            AI
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Live AI Inference</h1>
                            <p className="text-xs text-gray-500">FastAPI & YOLO Integration Demo</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        
                        {/* Kolom Kiri: Upload & Preview */}
                        <div className="p-8 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/50">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <UploadCloud className="w-5 h-5 text-indigo-500" />
                                1. Upload Gambar
                            </h2>

                            {!previewUrl ? (
                                <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors duration-200 group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <div className="p-4 bg-indigo-50 rounded-full mb-4 group-hover:scale-110 transition-transform duration-200">
                                            <UploadCloud className="w-8 h-8 text-indigo-500" />
                                        </div>
                                        <p className="mb-2 text-sm font-semibold text-gray-700">Klik untuk upload foto</p>
                                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (Maks 5MB)</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/jpeg, image/png, image/jpg" onChange={handleFileChange} />
                                </label>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative rounded-xl overflow-hidden bg-gray-900 shadow-inner group flex items-center justify-center h-80">
                                        <img 
                                            ref={imageRef}
                                            src={previewUrl} 
                                            alt="Preview" 
                                            className="max-h-full max-w-full object-contain"
                                            onLoad={handleImageLoad}
                                        />
                                        
                                        {/* Bounding Boxes Overlay */}
                                        {result && result.detections && result.detections.map((det, index) => (
                                            <div 
                                                key={index}
                                                className="absolute border-2 border-red-500 bg-red-500/20 z-10"
                                                style={getBoxStyle(det.box)}
                                            >
                                                <span className="absolute -top-6 left-[-2px] bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-t-md whitespace-nowrap shadow-md">
                                                    {det.label} ({(det.confidence * 100).toFixed(1)}%)
                                                </span>
                                            </div>
                                        ))}

                                        {/* Loading Overlay */}
                                        {isAnalyzing && (
                                            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                                                <RefreshCw className="w-10 h-10 text-white animate-spin mb-3" />
                                                <p className="text-white font-medium">AI sedang menganalisis...</p>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={handleAnalyze}
                                            disabled={isAnalyzing || result}
                                            className={`flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all shadow-md flex items-center justify-center gap-2
                                                ${isAnalyzing || result 
                                                    ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5'
                                                }`}
                                        >
                                            {isAnalyzing ? (
                                                <>Menganalisis...</>
                                            ) : result ? (
                                                <>Selesai</>
                                            ) : (
                                                <>
                                                    <Box className="w-5 h-5" />
                                                    Proses dengan AI
                                                </>
                                            )}
                                        </button>
                                        <button 
                                            onClick={handleReset}
                                            className="py-3 px-4 rounded-xl font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Kolom Kanan: Hasil */}
                        <div className="p-8 bg-white">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                2. Hasil Inspeksi AI
                            </h2>

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 mb-6 animate-in fade-in slide-in-from-top-4">
                                    <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                                    <div>
                                        <h4 className="font-semibold text-sm">Gagal memproses gambar</h4>
                                        <p className="text-sm mt-1">{error}</p>
                                    </div>
                                </div>
                            )}

                            {!result && !error && !isAnalyzing && (
                                <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                                    <Box className="w-12 h-12 mb-3 text-gray-300" />
                                    <p className="text-sm">Silakan upload dan proses gambar terlebih dahulu.</p>
                                </div>
                            )}

                            {isAnalyzing && (
                                <div className="h-64 flex flex-col items-center justify-center">
                                    <div className="w-full max-w-xs space-y-4">
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 rounded-full animate-pulse w-full"></div>
                                        </div>
                                        <p className="text-center text-sm text-gray-500">Menghubungi FastAPI Server...</p>
                                    </div>
                                </div>
                            )}

                            {result && (
                                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                                    {/* Status Badge */}
                                    <div className="mb-8 p-6 rounded-2xl border text-center flex flex-col items-center justify-center shadow-sm relative overflow-hidden
                                        ${result.result_status === 'OK' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}"
                                        style={{ backgroundColor: result.result_status === 'OK' ? '#ecfdf5' : '#fef2f2', borderColor: result.result_status === 'OK' ? '#a7f3d0' : '#fecaca' }}
                                    >
                                        <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl font-black">
                                            {result.result_status}
                                        </div>
                                        <span className={`text-sm font-bold tracking-wider mb-2 ${result.result_status === 'OK' ? 'text-emerald-700' : 'text-red-700'}`}>
                                            STATUS KEPUTUSAN
                                        </span>
                                        <span className={`text-5xl font-black ${result.result_status === 'OK' ? 'text-emerald-600' : 'text-red-600'}`}>
                                            {result.result_status}
                                        </span>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Total Deteksi</p>
                                            <p className="text-2xl font-bold text-gray-900">{result.total_detections} <span className="text-sm font-normal text-gray-500">objek</span></p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Kecepatan</p>
                                            <p className="text-2xl font-bold text-gray-900">&lt;1 <span className="text-sm font-normal text-gray-500">detik</span></p>
                                        </div>
                                    </div>

                                    {/* Detections List */}
                                    {result.total_detections > 0 && (
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Rincian Deteksi</h3>
                                            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                                {result.detections.map((det, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-300 transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs">
                                                                #{i+1}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900 capitalize">{det.label}</p>
                                                                <p className="text-xs text-gray-500">Box: {det.box.map(n => Math.round(n)).join(', ')}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm font-bold text-indigo-600">{(det.confidence * 100).toFixed(1)}%</p>
                                                            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Confidence</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
