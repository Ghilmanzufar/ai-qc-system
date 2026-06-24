import { useEffect } from 'react';

export default function useScannerKeyboard({
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
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (document.activeElement.tagName === 'SELECT') return;
            if (isConfirmOpen) return; // Prevent actions when modal is open
            if (e.code === 'Space') {
                e.preventDefault();
                // Capture both if both are not analyzing and not captured
                if (part) {
                    if (!isFrontCompleted && !frontCaptured && !isAnalyzingFront && !frontResult) {
                        capturePhoto('front');
                    } else if (isFrontCompleted && !backCaptured && !isAnalyzingBack && !backResult) {
                        capturePhoto('back');
                    }
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
    }, [
        frontCaptured, backCaptured, isAnalyzingFront, isAnalyzingBack, 
        part, isConfirmOpen, isFrontCompleted, frontResult, backResult, 
        capturePhoto, submitPhoto, retakePhoto
    ]);
}
