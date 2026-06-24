import { useState, useMemo } from 'react';

export default function useSetupParts(productModels) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPartId, setSelectedPartId] = useState(() => {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('last_part_id') : null;
        return saved ? parseInt(saved) : null;
    });

    // Flat map all parts for easy searching
    const allParts = useMemo(() => {
        if (!productModels || !Array.isArray(productModels)) return [];
        return productModels.flatMap(model => 
            (model.parts || []).map(part => ({
                ...part,
                modelName: model.name || ''
            }))
        );
    }, [productModels]);

    // Filter parts based on search query
    const filteredParts = useMemo(() => {
        if (!searchQuery.trim()) return allParts;
        const query = searchQuery.toLowerCase();
        return allParts.filter(part => 
            (part.part_no || '').toLowerCase().includes(query) ||
            (part.part_name || '').toLowerCase().includes(query) ||
            (part.modelName || '').toLowerCase().includes(query)
        );
    }, [searchQuery, allParts]);

    const selectedPart = allParts.find(p => p.id === selectedPartId);

    return {
        searchQuery,
        setSearchQuery,
        selectedPartId,
        setSelectedPartId,
        filteredParts,
        selectedPart
    };
}
