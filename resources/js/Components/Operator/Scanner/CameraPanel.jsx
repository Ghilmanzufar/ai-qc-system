import React, { useState, useEffect } from 'react';
import { Camera, Send, CheckCircle2, XCircle, RefreshCcw, Video, Upload, ChevronRight } from 'lucide-react';

const WarpingProcessTracker = () => {
    const steps = [
        "Memisahkan Objek (Grayscale & Threshold)...",
        "Mengekstrak Masking (Contour Detection)...",
        "Mendeteksi Titik Fitur (ORB)...",
        "Menghitung Rotasi & Skala (Homography)...",
        "Meluruskan Gambar (Warp Perspective)..."
    ];
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Total delay di useScannerCameras adalah 1500ms
        // Kita punya 5 step, jadi tiap step sekitar 250-300ms
        const interval = setInterval(() => {
            setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
        }, 280);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-sm mt-4 px-6 py-4 bg-slate-900/80 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-xl">
            <h3 className="text-emerald-400 font-black mb-4 text-xs tracking-[0.2em] uppercase text-center">
                Visualisasi Proses OpenCV
            </h3>
            <div className="space-y-2.5">
                {steps.map((step, idx) => (
                    <div key={idx} className={`flex items-center gap-3 text-sm font-semibold transition-all duration-300 ${idx < currentStep ? 'text-emerald-400' : idx === currentStep ? 'text-white translate-x-1' : 'text-slate-500/50'}`}>
                        {idx < currentStep ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                        ) : idx === currentStep ? (
                            <RefreshCcw className="w-4 h-4 shrink-0 animate-spin text-emerald-400" />
                        ) : (
                            <div className="w-4 h-4 shrink-0 rounded-full border-2 border-slate-600/50"></div>
                        )}
                        <span className={idx === currentStep ? 'animate-pulse' : ''}>{step}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default function CameraPanel({
    title, 
    stream, 
    videoRef, 
    cameraId, 
    setCameraId, 
    devices,
    captured, 
    result, 
    isAnalyzing, 
    processStep,
    part,
    onCapture,
    onRetake,
    onSubmit,
    onUpload
}) {
    return (
        <div className="flex flex-col h-full min-h-[70vh]">
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

                {/* Captured Image Preview OR Annotated Image */}
                {captured && (
                    <img 
                        src={result?.annotated_image || captured} 
                        alt={result ? "Annotated" : "Captured"} 
                        className="absolute inset-0 w-full h-full object-contain bg-slate-900 z-10" 
                    />
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
                    <div className="absolute inset-0 z-30 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
                        <div className="relative w-16 h-16 mb-4 shrink-0">
                            <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                            </div>
                        </div>
                        
                        {processStep === 'WARPING' ? (
                            <WarpingProcessTracker />
                        ) : (
                            <div className="mt-4 px-6 py-4 bg-slate-800/60 rounded-xl border border-slate-700/50">
                                <p className="text-emerald-400 font-bold tracking-widest animate-pulse text-center">ANALISIS AI (YOLO)...</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Result Status Badge (Top Right) */}
                {result && !isAnalyzing && (
                    <>
                        <div className={`absolute top-4 right-4 z-40 px-6 py-3 rounded-2xl font-black text-xl shadow-2xl flex items-center gap-3
                            ${result.status === 'OK' || result.status === 'PASS' ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white'}
                        `}>
                            {result.status === 'OK' || result.status === 'PASS' ? (
                                <>
                                    <CheckCircle2 className="w-7 h-7" />
                                    PASS
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-7 h-7" />
                                    REJECT
                                </>
                            )}
                        </div>

                        {/* Defect Type Info (Bottom Right) */}
                        {result.defect_type && (
                            <div className="absolute bottom-4 right-4 z-40 px-5 py-3 bg-black/70 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
                                <p className="text-white text-base font-bold uppercase">{result.defect_type}</p>
                            </div>
                        )}

                        {/* Action Buttons (Bottom Center) */}
                        <div className="absolute bottom-8 left-8 right-8 flex justify-center items-center gap-6 z-40">
                            <div className="flex w-full gap-4">
                                <button 
                                    onClick={() => onRetake()}
                                    className="flex-1 py-4 bg-slate-800/90 backdrop-blur-md text-white text-lg font-bold rounded-2xl border-2 border-slate-600 hover:bg-slate-700 transition-colors shadow-xl flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="w-5 h-5" /> Retake
                                </button>
                                <button 
                                    onClick={() => {
                                        onSubmit(null, true); // true = force continue
                                    }}
                                    className="flex-[2] py-4 flex items-center justify-center gap-3 bg-emerald-500 text-white text-xl font-black rounded-2xl shadow-2xl shadow-emerald-500/40 hover:bg-emerald-400 transition-transform active:scale-95 border-2 border-emerald-400"
                                >
                                    <Send className="w-6 h-6" /> LANJUTKAN
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {/* Tombol Aksi di Bawah */}
                {!result && !isAnalyzing && (
                    <div className="absolute bottom-8 left-8 right-8 flex justify-center items-center gap-6 z-20">
                        {!captured ? (
                            <>
                                <button 
                                    onClick={() => onCapture()}
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
                                
                                <label className={`
                                    w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-2xl cursor-pointer
                                    ${!part
                                        ? 'bg-slate-800/80 text-slate-400 cursor-not-allowed border-4 border-slate-600/50 backdrop-blur-sm'
                                        : 'bg-blue-500 text-white hover:bg-blue-400 active:scale-95 border-4 border-blue-300 ring-4 ring-blue-500/30'
                                    }
                                `}>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        disabled={!part}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    // Pass dataUrl to parent somehow, but we don't have onUpload prop yet.
                                                    // Let's add onUpload to props.
                                                    if (onUpload) onUpload(reader.result);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }} 
                                    />
                                    <Upload className="w-8 h-8" />
                                </label>
                            </>
                        ) : (
                            <div className="flex w-full gap-4">
                                <button 
                                    onClick={() => onRetake()}
                                    className="flex-1 py-4 bg-slate-800/90 backdrop-blur-md text-white text-lg font-bold rounded-2xl border-2 border-slate-600 hover:bg-slate-700 transition-colors shadow-xl flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="w-5 h-5" /> Retake
                                </button>
                                <button 
                                    onClick={() => onSubmit()}
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
}
