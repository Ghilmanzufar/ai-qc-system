import { useState, useEffect } from 'react';

export default function useDashboard() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState("");
    const [greeting, setGreeting] = useState("Selamat datang");
    const [lastPartId, setLastPartId] = useState(null);

    useEffect(() => {
        // Baca part_id aktif yang disimpan oleh Scanner.jsx di localStorage
        const storedPartId = localStorage.getItem('activeScannerPartId');
        if (storedPartId) {
            setLastPartId(storedPartId);
        }
    }, []);

    useEffect(() => {
        const updateTimeAndGreeting = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            
            const hour = now.getHours();
            if (hour < 11) setGreeting("Selamat Pagi");
            else if (hour < 15) setGreeting("Selamat Siang");
            else if (hour < 18) setGreeting("Selamat Sore");
            else setGreeting("Selamat Malam");
        };

        updateTimeAndGreeting();
        const timer = setInterval(updateTimeAndGreeting, 1000);
        return () => clearInterval(timer);
    }, []);

    return {
        isSidebarOpen,
        setIsSidebarOpen,
        currentTime,
        greeting,
        lastPartId
    };
}
