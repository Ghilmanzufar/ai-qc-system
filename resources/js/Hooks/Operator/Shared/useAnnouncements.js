import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const POLL_INTERVAL_MS = 30000; // 30 detik

export default function useAnnouncements() {
    const [activeBroadcasts, setActiveBroadcasts] = useState([]);
    const [activeAlerts, setActiveAlerts]     = useState([]);
    // Set ID yang sudah ditutup (dismiss) oleh operator di sesi ini
    const [dismissedIds, setDismissedIds]     = useState(() => {
        try {
            const stored = localStorage.getItem('dismissedAnnouncementIds');
            return new Set(stored ? JSON.parse(stored) : []);
        } catch {
            return new Set();
        }
    });

    const fetchAnnouncements = useCallback(async () => {
        try {
            const { data } = await axios.get(route('operator.announcements.active'));

            const notDismissed = data.filter(a => !dismissedIds.has(a.id));

            setActiveBroadcasts(notDismissed.filter(a => a.type === 'broadcast'));
            setActiveAlerts(notDismissed.filter(a => a.type === 'alert'));
        } catch (err) {
            // Gagal polling = abaikan (misal server sedang restart)
            console.warn('[useAnnouncements] Polling gagal:', err.message);
        }
    }, [dismissedIds]);

    // Poll pertama kali + interval
    useEffect(() => {
        fetchAnnouncements();
        const interval = setInterval(fetchAnnouncements, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [fetchAnnouncements]);

    /**
     * Tutup / dismiss pengumuman tertentu.
     * - Untuk tipe Alert: juga kirim request "tandai sudah dibaca" ke server.
     */
    const dismissAnnouncement = useCallback(async (id, type) => {
        const newDismissed = new Set(dismissedIds);
        newDismissed.add(id);
        setDismissedIds(newDismissed);

        // Simpan ke localStorage agar persisten selama sesi browser
        try {
            localStorage.setItem('dismissedAnnouncementIds', JSON.stringify([...newDismissed]));
        } catch {}

        // Untuk Alert: kirim tracking ke server
        if (type === 'alert') {
            try {
                await axios.post(route('operator.announcements.read', { id }));
            } catch (err) {
                console.warn('[useAnnouncements] markRead gagal:', err.message);
            }
        }

        // Update state lokal langsung (tidak perlu tunggu poll berikutnya)
        setActiveBroadcasts(prev => prev.filter(a => a.id !== id));
        setActiveAlerts(prev => prev.filter(a => a.id !== id));
    }, [dismissedIds]);

    return {
        activeBroadcasts,
        activeAlerts,
        dismissAnnouncement,
    };
}
