import { useState, useEffect } from 'react';

export default function useHistory(inspections) {
    const [currentTime, setCurrentTime] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all"); // 'all' or 'reject'
    const [lastPartId, setLastPartId] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLastPartId(localStorage.getItem('activeScannerPartId'));
        }

        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);

    // Filter by search term (inspection code or part number)
    const filteredInspections = inspections?.filter(item =>
        item.inspection_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.part?.part_no?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const formatTime = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    };

    return {
        currentTime,
        searchTerm,
        setSearchTerm,
        activeTab,
        setActiveTab,
        lastPartId,
        filteredInspections,
        formatTime
    };
}
