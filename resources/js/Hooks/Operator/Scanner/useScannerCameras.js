import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { playBeep } from '@/Utils/audio';
import useScannerKeyboard from '@/Hooks/Operator/Scanner/useScannerKeyboard';

export default function useScannerCameras(part, setStats, setAiOffline, isConfirmOpen) {
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
    const [isFrontCompleted, setIsFrontCompleted] = useState(false);

    // --- BACK SIDE STATE ---
    const backVideoRef = useRef(null);
    const backCanvasRef = useRef(null);
    const [backCameraId, setBackCameraId] = useState('');
    const [backStream, setBackStream] = useState(null);
    const [backCaptured, setBackCaptured] = useState(null);
    const [backResult, setBackResult] = useState(null);
    const [isAnalyzingBack, setIsAnalyzingBack] = useState(false);

    // Handlers to persist selection
    const handleSetFrontCameraId = useCallback((id) => {
        setFrontCameraId(id);
        localStorage.setItem('frontCameraId', id);
    }, []);

    const handleSetBackCameraId = useCallback((id) => {
        setBackCameraId(id);
        localStorage.setItem('backCameraId', id);
    }, []);

    // Enumerate Devices
    useEffect(() => {
        const getDevices = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ video: true });
                const mediaDevices = await navigator.mediaDevices.enumerateDevices();
                const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
                setDevices(videoDevices);
                
                if (videoDevices.length > 0) {
                    const savedFront = localStorage.getItem('frontCameraId');
                    const savedBack = localStorage.getItem('backCameraId');

                    // Set Front Camera (use saved if valid, else default to first)
                    if (savedFront && videoDevices.find(d => d.deviceId === savedFront)) {
                        setFrontCameraId(savedFront);
                    } else {
                        setFrontCameraId(videoDevices[0].deviceId);
                    }

                    // Set Back Camera (use saved if valid, else default to second if available, else first)
                    if (savedBack && videoDevices.find(d => d.deviceId === savedBack)) {
                        setBackCameraId(savedBack);
                    } else if (videoDevices.length > 1) {
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
        let currentStream = null;
        
        const startBackCamera = async () => {
            if (!backCameraId || !isFrontCompleted) {
                setBackStream(null);
                return;
            }
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: backCameraId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
                });
                currentStream = stream;
                setBackStream(stream);
                if (backVideoRef.current) backVideoRef.current.srcObject = stream;
            } catch (err) {
                console.error("Back camera error:", err);
            }
        };
        
        startBackCamera();
        
        return () => {
            if (currentStream) {
                currentStream.getTracks().forEach(t => t.stop());
            }
        };
    }, [backCameraId, isFrontCompleted]);

    // Audio Feedback removed (moved to Utils/audio.js)

    // Auto dismiss results
    useEffect(() => {
        if (frontResult && frontResult.status === 'OK') {
            const timer = setTimeout(() => {
                setFrontResult(null);
                setIsFrontCompleted(true);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [frontResult]);

    useEffect(() => {
        if (backResult && backResult.status === 'NG') {
            const timer = setTimeout(() => {
                setBackResult(null);
                setIsFrontCompleted(false); // Reset session
            }, 3000);
            return () => clearTimeout(timer);
        } else if (backResult && backResult.status === 'OK') {
            const timer = setTimeout(() => {
                setBackResult(null);
                setIsFrontCompleted(false); // Reset session
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [backResult]);

    const capturePhoto = useCallback((side) => {
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
    }, [part]);

    const retakePhoto = useCallback((side) => {
        if (side === 'front') {
            setFrontCaptured(null);
            setFrontResult(null);
            setIsFrontCompleted(false);
        } else {
            setBackCaptured(null);
            setBackResult(null);
        }
    }, []);

    const submitPhoto = useCallback(async (side) => {
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
    }, [part, frontCaptured, backCaptured, setStats, setAiOffline]);

    // Keyboard Shortcuts (Orchestrated by external hook)
    useScannerKeyboard({
        part, 
        isConfirmOpen, 
        isFrontCompleted, 
        frontCaptured, 
        backCaptured, 
        isAnalyzingFront, 
        isAnalyzingBack, 
        frontResult, 
        backResult,
        capturePhoto, 
        submitPhoto, 
        retakePhoto
    });

    return {
        devices,
        frontVideoRef, frontCanvasRef, frontCameraId, setFrontCameraId: handleSetFrontCameraId, frontStream, frontCaptured, frontResult, isAnalyzingFront, isFrontCompleted, setIsFrontCompleted, setFrontResult,
        backVideoRef, backCanvasRef, backCameraId, setBackCameraId: handleSetBackCameraId, backStream, backCaptured, backResult, isAnalyzingBack,
        capturePhoto, retakePhoto, submitPhoto
    };
}
