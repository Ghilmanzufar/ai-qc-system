import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <>
            <Head title="Supervisor Dashboard" />
            <div style={{ padding: '32px', fontFamily: "'Inter', sans-serif" }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a2e' }}>Live Monitoring</h1>
                <p style={{ color: '#6b7280', marginTop: '8px' }}>Halaman ini akan menampilkan grafik real-time produksi.</p>
                <p style={{ color: '#9ca3af', marginTop: '16px', fontStyle: 'italic' }}>⏳ Grafik & Live Stats akan dibangun di Phase 6...</p>
            </div>
        </>
    );
}
