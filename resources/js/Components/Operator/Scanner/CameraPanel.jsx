import React from 'react';
import { Camera, Send, CheckCircle2, XCircle, RefreshCcw, Video } from 'lucide-react';

export default function CameraPanel({
    side, 
    title, 
    stream, 
    videoRef, 
    cameraId, 
    setCameraId, 
    devices,
    captured, 
    result, 
    isAnalyzing, 
    isFrontCompleted,
    part,
    onCapture,
    onRetake,
    onSubmit
}) {
    return (
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

                {/* Standby UI (Back Camera only) */}
                {side === 'back' && !isFrontCompleted && (
                    <div className="absolute inset-0 z-10 bg-slate-900 flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                            <Camera className="w-10 h-10 text-slate-500" />
                        </div>
                        <p className="text-slate-400 font-bold tracking-widest text-sm text-center px-4">
                            MENUNGGU ANALISIS DEPAN SELESAI
                        </p>
                    </div>
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
                                    <div className="mt-6 px-8 py-3 bg-black/60 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl mb-6">
                                        <p className="text-white text-2xl font-bold uppercase tracking-wider">{result.defect_type || 'CACAT TERDETEKSI'}</p>
                                    </div>
                                    {side === 'front' && (
                                        <div className="flex gap-4 w-full max-w-sm">
                                            <button 
                                                onClick={() => onRetake(side)}
                                                className="flex-1 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors border border-slate-600 shadow-xl pointer-events-auto"
                                            >
                                                Retake Ulang
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    // In component version, this is handled by parent, but we can pass a special event or handle it here
                                                    // For clean code, it's better to let parent handle the 'Lanjutkan' click
                                                    onSubmit(side, true); // true = force continue
                                                }}
                                                className="flex-1 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-400 transition-colors shadow-xl pointer-events-auto"
                                            >
                                                Lanjutkan
                                            </button>
                                        </div>
                                    )}
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
                                onClick={() => onCapture(side)}
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
                                    onClick={() => onRetake(side)}
                                    className="flex-1 py-4 bg-slate-800/90 backdrop-blur-md text-white text-lg font-bold rounded-2xl border-2 border-slate-600 hover:bg-slate-700 transition-colors shadow-xl flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw className="w-5 h-5" /> Retake
                                </button>
                                <button 
                                    onClick={() => onSubmit(side)}
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
