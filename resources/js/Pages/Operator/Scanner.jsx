import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import { CheckCircle2, XCircle, Camera, Send, AlertTriangle, Settings2, LogOut, Activity, Focus, Video, Menu, X, User, RefreshCcw } from 'lucide-react';

export default function Scanner() {
    const { part, dailyStats: initialStats, auth } = usePage().props;
    
    // States
    const [stats, setStats] = useState(initialStats || { total: 0, ok: 0, ng: 0 });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const [aiOffline, setAiOffline] = useState(false);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
        }, 1000);
        return () => clearInterval(timer);
    }, []);


    // Camera Devices
    const [devices, setDevices] = useState([]);
    
    // --- FRONT SIDE STATE ---
    const frontVideoRef = useRef(null);
    const frontCanvasRef = useRef(null);
    const [frontCameraId, setFrontCameraId] = useState('');
    const [frontStream, setFrontStream] = useState(null);
    const [frontCaptured, setFrontCaptured] = useState(null);
    const [frontResult, setFrontResult] = useState(null);
    const [isAnalyzingFront, setIsAnalyzingFront] = useState(false);

    // --- BACK SIDE STATE ---
    const backVideoRef = useRef(null);
    const backCanvasRef = useRef(null);
    const [backCameraId, setBackCameraId] = useState('');
    const [backStream, setBackStream] = useState(null);
    const [backCaptured, setBackCaptured] = useState(null);
    const [backResult, setBackResult] = useState(null);
    const [isAnalyzingBack, setIsAnalyzingBack] = useState(false);

    // Enumerate Devices
    useEffect(() => {
        const getDevices = async () => {
            try {
                // Request permission first to get labels
                await navigator.mediaDevices.getUserMedia({ video: true });
                const mediaDevices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
                setDevices(videoDevices);
                
                if (videoDevices.length > 0) {
                    setFrontCameraId(videoDevices[0].deviceId);
                    if (videoDevices.length > 1) {
                        setBackCameraId(videoDevices[1].deviceId);
                    } else {
                        setBackCameraId(videoDevices[0].deviceId);
                    }
                }
            } catch (err) {
                console.error("Error enumerating devices:", err);
            }
        };
        getDevices();
    }, []);

    // Start Front Camera
    useEffect(() => {
        const startFrontCamera = async () => {
            if (frontStream) frontStream.getTracks().forEach(t => t.stop());
            if (!frontCameraId) return;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: frontCameraId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
                });
                setFrontStream(stream);
                if (frontVideoRef.current) frontVideoRef.current.srcObject = stream;
            } catch (err) {
                console.error("Front camera error:", err);
            }
        };
        startFrontCamera();
        return () => { if (frontStream) frontStream.getTracks().forEach(t => t.stop()); };
    }, [frontCameraId]);

    // Start Back Camera
    useEffect(() => {
        const startBackCamera = async () => {
            if (backStream) backStream.getTracks().forEach(t => t.stop());
            if (!backCameraId) return;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: backCameraId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
                });
                setBackStream(stream);
                if (backVideoRef.current) backVideoRef.current.srcObject = stream;
            } catch (err) {
                console.error("Back camera error:", err);
            }
        };
        startBackCamera();
        return () => { if (backStream) backStream.getTracks().forEach(t => t.stop()); };
    }, [backCameraId]);

    // Audio Feedback
    const playBeep = useCallback((type) => {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            if (type === 'OK') {
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, ctx.currentTime);
                gain.gain.setValueAtTime(0, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.5);
            } else {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(150, ctx.currentTime);
                gain.gain.setValueAtTime(0, ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
                gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.8);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.0);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 1.0);
            }
        } catch (e) {
            console.error("Audio API error", e);
        }
    }, []);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (document.activeElement.tagName === 'SELECT') return;
            if (e.code === 'Space') {
                e.preventDefault();
                // Capture both if both are not analyzing and not captured
                if (part && !aiOffline) {
                    if (!frontCaptured && !isAnalyzingFront) capturePhoto('front');
                    if (!backCaptured && !isAnalyzingBack) capturePhoto('back');
                }
            } else if (e.code === 'Enter') {
                e.preventDefault();
                if (frontCaptured && !isAnalyzingFront) submitPhoto('front');
                if (backCaptured && !isAnalyzingBack) submitPhoto('back');
            } else if (e.code === 'Escape' || e.code === 'KeyR' || e.code === 'Backspace') {
                e.preventDefault();
                retakePhoto('front');
                retakePhoto('back');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [frontCaptured, backCaptured, isAnalyzingFront, isAnalyzingBack, part, aiOffline]);

    // Auto dismiss results
    useEffect(() => {
        if (frontResult && frontResult.status === 'NG') {
            const timer = setTimeout(() => setFrontResult(null), 3000);
            return () => clearTimeout(timer);
        } else if (frontResult && frontResult.status === 'OK') {
            const timer = setTimeout(() => setFrontResult(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [frontResult]);

    useEffect(() => {
        if (backResult && backResult.status === 'NG') {
            const timer = setTimeout(() => setBackResult(null), 3000);
            return () => clearTimeout(timer);
        } else if (backResult && backResult.status === 'OK') {
            const timer = setTimeout(() => setBackResult(null), 1500);
            return () => clearTimeout(timer);
        }
    }, [backResult]);

    const capturePhoto = (side) => {
        if (!part) return;
        
        if (side === 'front' && frontVideoRef.current && frontCanvasRef.current) {
            const video = frontVideoRef.current;
            const canvas = frontCanvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            setFrontCaptured(canvas.toDataURL('image/jpeg', 0.9));
        } else if (side === 'back' && backVideoRef.current && backCanvasRef.current) {
            const video = backVideoRef.current;
            const canvas = backCanvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            setBackCaptured(canvas.toDataURL('image/jpeg', 0.9));
        }
    };

    const retakePhoto = (side) => {
        if (side === 'front') {
            setFrontCaptured(null);
            setFrontResult(null);
        } else {
            setBackCaptured(null);
            setBackResult(null);
        }
    };

    const submitPhoto = async (side) => {
        const image = side === 'front' ? frontCaptured : backCaptured;
        if (!image || !part) return;

        if (side === 'front') { setIsAnalyzingFront(true); setFrontResult(null); }
        else { setIsAnalyzingBack(true); setBackResult(null); }
        
        setAiOffline(false);

        try {
            const response = await axios.post('/operator/analyze', {
                part_id: part.id,
                image: image,
                side: side
            });

            const resData = response.data;
            if (resData.success) {
                const resObj = {
                    status: resData.status,
                    defect_type: resData.defect_type,
                    confidence: resData.confidence
                };
                
                if (side === 'front') setFrontResult(resObj);
                else setBackResult(resObj);
                
                playBeep(resData.status);

                setStats(prev => ({
                    total: prev.total + 1,
                    ok: resData.status === 'OK' ? prev.ok + 1 : prev.ok,
                    ng: resData.status === 'NG' ? prev.ng + 1 : prev.ng
                }));
                
                // Clear captured immediately to show live feed again, but keep result overlay
                if (side === 'front') setFrontCaptured(null);
                else setBackCaptured(null);
            }
        } catch (error) {
            console.error("Analyze error:", error);
            if (error.response?.data?.ai_offline || error.message === 'Network Error') {
                setAiOffline(true);
            } else {
                alert(error.response?.data?.message || 'Terjadi kesalahan sistem.');
            }
            playBeep('NG');
            if (side === 'front') setFrontCaptured(null);
            else setBackCaptured(null);
        } finally {
            if (side === 'front') setIsAnalyzingFront(false);
            else setIsAnalyzingBack(false);
        }
    };

    const handleLogout = () => {
        router.post('/logout');
    };

    // UI Helper for Camera Panel
    const renderCameraPanel = (side, title, stream, videoRef, cameraId, setCameraId, captured, result, isAnalyzing) => (
        <div className="flex flex-col min-h-[500px]">
            <div className="bg-white rounded-t-[24px] px-6 py-4 border border-slate-200/60 border-b-0 flex items-center justify-between shadow-sm z-10 relative">
                <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${stream ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500'}`}></div>
                    <h2 className="font-black text-slate-800 tracking-tight">{title}</h2>
                </div>
                <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-slate-400" />
                    <select 
                        value={cameraId}
                        onChange={(e) => setCameraId(e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-600 font-bold focus:outline-none focus:border-emerald-500 max-w-[150px] truncate"
                    >
                        {devices.map(d => (
                            <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.substring(0, 5)}`}</option>
                        ))}
                    </select>
                </div>
            </div>
            
            <div className="relative flex-1 bg-slate-900 rounded-b-[24px] overflow-hidden shadow-xl border-4 border-slate-800 flex items-center justify-center group">
                
                {/* Video Feed */}
                <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    muted
                    className={`w-full h-full object-cover transition-opacity ${captured ? 'opacity-0' : 'opacity-95'}`}
                />

                {/* Captured Image Preview */}
                {captured && (
                    <img src={captured} alt="Captured" className="absolute inset-0 w-full h-full object-contain bg-slate-900 z-10" />
                )}

                {/* Reticle / Crosshair (only when live) */}
                {stream && !captured && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-40 group-hover:opacity-80 transition-opacity z-0">
                        <div className="w-[60%] aspect-square border-2 border-white/30 rounded-[40px] relative flex items-center justify-center">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500/80"></div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1 h-6 bg-emerald-500/80"></div>
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-1 bg-emerald-500/80"></div>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-6 h-1 bg-emerald-500/80"></div>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {isAnalyzing && (
                    <div className="absolute inset-0 z-30 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center">
                        <div className="relative w-20 h-20 mb-6">
                            <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                            </div>
                        </div>
                        <p className="text-emerald-400 font-bold tracking-widest animate-pulse">ANALISIS SISI INI...</p>
                    </div>
                )}

                {/* Result Overlay */}
                {result && !isAnalyzing && (
                    <div className={`absolute inset-0 z-40 flex flex-col items-center justify-center p-6 text-center transition-all duration-300
                        ${result.status === 'OK' ? 'bg-emerald-500/80 backdrop-blur-sm' : 'bg-red-600/85 backdrop-blur-md'}
                    `}>
                        <div className="scale-up-animation flex flex-col items-center">
                            {result.status === 'OK' ? (
                                <>
                                    <CheckCircle2 className="w-28 h-28 text-white mb-4 drop-shadow-xl" />
                                    <h2 className="text-6xl font-black text-white drop-shadow-lg">PASS</h2>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-28 h-28 text-white mb-4 drop-shadow-xl" />
                                    <h2 className="text-6xl font-black text-white drop-shadow-lg">REJECT</h2>
                                    <div className="mt-6 px-8 py-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                                        <p className="text-white text-2xl font-bold uppercase tracking-wider">{result.defect_type || 'CACAT TERDETEKSI'}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Tombol Aksi di Bawah */}
                {!result && !isAnalyzing && (
                    <div className="absolute bottom-8 left-8 right-8 flex justify-center z-20">
                        {!captured ? (
                            <button 
                                onClick={() => capturePhoto(side)}
                                disabled={!part || !stream}
                                className={`
                                    w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl group/btn
                                    ${(!part || !stream) 
                                        ? 'bg-slate-800/80 text-slate-400 cursor-not-allowed border-4 border-slate-600/50 backdrop-blur-sm' 
                                        : 'bg-emerald-500 text-white hover:bg-emerald-400 active:scale-95 border-4 border-emerald-300 ring-4 ring-emerald-500/30'
                                    }
                                `}
                            >
                                <Camera className="w-8 h-8" />
                            </button>
                        ) : (
                            <div className="flex w-full gap-4">
                                <button 
                                    onClick={() => retakePhoto(side)}
                                    className="flex-1 py-4 bg-slate-800/90 backdrop-blur-md text-white text-lg font-bold rounded-2xl border-2 border-slate-600 hover:bg-slate-700 transition-colors shadow-xl flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="w-5 h-5" /> Retake
                                </button>
                                <button 
                                    onClick={() => submitPhoto(side)}
                                    className="flex-[2] py-4 flex items-center justify-center gap-3 bg-emerald-500 text-white text-xl font-black rounded-2xl shadow-2xl shadow-emerald-500/40 hover:bg-emerald-400 transition-transform active:scale-95 border-2 border-emerald-400"
                                >
                                    <Send className="w-6 h-6" /> KIRIM
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <Head title="Live Scanner" />
            
            {/* Hidden Canvas for capturing */}
            <canvas ref={frontCanvasRef} className="hidden" />
            <canvas ref={backCanvasRef} className="hidden" />

            <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
                
                {/* Sidebar Overlay */}
                {isSidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                                <Focus className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Lens QC</h2>
                        </div>
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <div className="flex-1 py-6 px-4 flex flex-col gap-2">
                        <div className="px-4 py-3 mb-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                                <User className="w-5 h-5 text-slate-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-500 uppercase">Operator Aktif</p>
                                <p className="text-sm font-bold text-slate-800">Sesi Saat Ini</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-slate-100">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Keluar dari Sistem
                        </button>
                    </div>
                </aside>

                {/* Navbar Premium + Parameter Sesi */}
                <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="flex w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 items-center justify-center transition-colors"
                        >
                            <Menu className="w-5 h-5 text-slate-700" />
                        </button>
                        <div className="hidden xl:block">
                            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">Lens QC</h1>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Multi-Angle Inspection</p>
                        </div>
                    </div>

                    {/* Info Batch Aktif */}
                    <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-3 min-w-[300px]">
                        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
                            <Activity className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-bold text-slate-700 whitespace-nowrap">
                                {part?.product_model?.name} <span className="mx-2 text-slate-300">|</span> <span className="text-emerald-700">{part?.part_no}</span>
                            </span>
                        </div>
                        <button 
                            onClick={() => router.get('/operator/setup')}
                            className="text-xs font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 border border-red-200 hover:border-transparent px-4 py-2 rounded-xl transition-all shadow-sm"
                        >
                            Selesaikan Batch
                        </button>
                    </div>
                    
                    {/* Statistik Harian */}
                    <div className="hidden lg:flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200">
                        <div className="px-3 py-1 bg-white rounded-lg border border-slate-100 flex flex-col items-center">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                            <span className="text-sm font-black text-slate-800 leading-none">{stats.total}</span>
                        </div>
                        <div className="px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-100 flex flex-col items-center">
                            <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Pass</span>
                            <span className="text-sm font-black text-emerald-700 leading-none">{stats.ok}</span>
                        </div>
                        <div className="px-3 py-1 bg-red-50 rounded-lg border border-red-100 flex flex-col items-center">
                            <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider">Reject</span>
                            <span className="text-sm font-black text-red-700 leading-none">{stats.ng}</span>
                        </div>
                    </div>

                    {/* Jam & Action */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-black text-slate-700 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 min-w-[100px] justify-center">
                            {currentTime || "Memuat..."}
                        </div>
                    </div>
                </nav>

                {/* AI Offline Warning Modal */}
                {aiOffline && (
                    <div className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <AlertTriangle className="w-12 h-12 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-black text-white mb-4 tracking-wider">SERVER AI OFFLINE</h2>
                        <p className="text-slate-400 max-w-sm mb-8">Sistem gagal mengirim gambar ke engine analisis Python.</p>
                        <button 
                            onClick={() => setAiOffline(false)}
                            className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 shadow-xl"
                        >
                            Tutup Peringatan
                        </button>
                    </div>
                )}

                {/* Konten Utama - 50/50 Grid Layout: DEPAN dan BELAKANG */}
                <main className="flex-1 w-full mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    
                    {/* PANEL DEPAN */}
                    {renderCameraPanel(
                        'front', 
                        'SISI DEPAN', 
                        frontStream, 
                        frontVideoRef, 
                        frontCameraId, 
                        setFrontCameraId, 
                        frontCaptured, 
                        frontResult, 
                        isAnalyzingFront
                    )}

                    {/* PANEL BELAKANG */}
                    {renderCameraPanel(
                        'back', 
                        'SISI BELAKANG', 
                        backStream, 
                        backVideoRef, 
                        backCameraId, 
                        setBackCameraId, 
                        backCaptured, 
                        backResult, 
                        isAnalyzingBack
                    )}

                </main>
            </div>
            
            <style>{`
                .scale-up-animation {
                    animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes scaleUp {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </>
    );
}
