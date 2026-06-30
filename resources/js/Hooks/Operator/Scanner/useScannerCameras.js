import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { playBeep } from '@/Utils/audio';
import useScannerKeyboard from '@/Hooks/Operator/Scanner/useScannerKeyboard';

export default function useScannerCameras(part, setStats, setAiOffline, isConfirmOpen) {
    // Camera Devices
    const [devices, setDevices] = useState([]);
    
    // --- CAMERA STATE ---
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [cameraId, setCameraId] = useState('');
    const [stream, setStream] = useState(null);
    const [captured, setCaptured] = useState(null);
    const [result, setResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // Handlers to persist selection
    const handleSetCameraId = useCallback((id) => {
        setCameraId(id);
        localStorage.setItem('frontCameraId', id);
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
                    const savedCamera = localStorage.getItem('frontCameraId');

                    // Set Camera (use saved if valid, else default to first)
                    if (savedCamera && videoDevices.find(d => d.deviceId === savedCamera)) {
                        setCameraId(savedCamera);
                    } else {
                        setCameraId(videoDevices[0].deviceId);
                    }
                }
            } catch (err) {
                console.error("Error enumerating devices:", err);
            }
        };
        getDevices();
    }, []);

    // Start Camera
    useEffect(() => {
        const startCamera = async () => {
            if (stream) stream.getTracks().forEach(t => t.stop());
            if (!cameraId) return;
            try {
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: { deviceId: { exact: cameraId }, width: { ideal: 1920 }, height: { ideal: 1080 } }
                });
                setStream(newStream);
                if (videoRef.current) videoRef.current.srcObject = newStream;
            } catch (err) {
                console.error("Camera error:", err);
            }
        };
        startCamera();
        return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
    }, [cameraId]);

    // Auto dismiss results from the overlay (tapi tetap ada di state agar tampil di ResultPanel)
    // Sebenarnya jika kita membiarkan result ada di state, overlay di CameraPanel akan terus menutupi.
    // Solusinya: Kita bisa clear 'captured' dan mematikan overlay setelah beberapa saat, ATAU
    // kita hapus fitur auto-dismiss dan user harus pencet "Lanjutkan" untuk clear kamera, sementara di ResultPanel selalu tampil.
    // Mari kita biarkan user pencet "Lanjutkan" untuk memotret lagi.

    const capturePhoto = useCallback(() => {
        if (!part) return;
        
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            setCaptured(canvas.toDataURL('image/jpeg', 0.9));
        }
    }, [part]);

    const retakePhoto = useCallback(() => {
        setCaptured(null);
        setResult(null);
    }, []);

    const submitPhoto = useCallback(async () => {
        const image = captured;
        if (!image || !part) return;

        setIsAnalyzing(true); 
        setResult(null);
        setAiOffline(false);

        try {
            const response = await axios.post('/member/analyze', {
                part_id: part.id,
                image: image,
                side: 'front' // Tetap kirim 'front' agar backend tidak bingung
            });

            const resData = response.data;
            if (resData.success) {
                const resObj = {
                    status: resData.status,
                    defect_type: resData.defect_type,
                    class_details: resData.class_details,
                    object_count: resData.object_count,
                    confidence: resData.confidence,
                    annotated_image: resData.annotated_image
                };
                
                setResult(resObj);
                playBeep(resData.status);

                setStats(prev => ({
                    total: prev.total + 1,
                    ok: resData.status === 'OK' ? prev.ok + 1 : prev.ok,
                    ng: resData.status === 'NG' ? prev.ng + 1 : prev.ng
                }));
                
                // Jangan reset setCaptured(null) agar user masih bisa lihat foto yang terakhir di inspeksi (opsional)
                // Atau biarkan mereka harus tekan "Lanjutkan" untuk clear
            }
        } catch (error) {
            console.error("Analyze error:", error);
            if (error.response?.data?.ai_offline || error.message === 'Network Error') {
                setAiOffline(true);
            } else {
                alert(error.response?.data?.message || 'Terjadi kesalahan sistem.');
            }
            playBeep('NG');
            setCaptured(null);
        } finally {
            setIsAnalyzing(false);
        }
    }, [part, captured, setStats, setAiOffline]);

    // Keyboard Shortcuts (Orchestrated by external hook)
    useScannerKeyboard({
        part, 
        isConfirmOpen, 
        isFrontCompleted: false, // Not used anymore
        frontCaptured: captured, 
        backCaptured: null, 
        isAnalyzingFront: isAnalyzing, 
        isAnalyzingBack: false, 
        frontResult: result, 
        backResult: null,
        capturePhoto: () => capturePhoto(), 
        submitPhoto: () => submitPhoto(), 
        retakePhoto: () => retakePhoto()
    });

    return {
        devices,
        videoRef, canvasRef, cameraId, setCameraId: handleSetCameraId, stream, captured, setCaptured, result, setResult, isAnalyzing,
        capturePhoto, retakePhoto, submitPhoto
    };
}
