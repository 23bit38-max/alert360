import { useState, useEffect, useMemo } from 'react';
import { fetchAccidents } from '@/services/supabase.service';

export const useReportsAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [accidents, setAccidents] = useState<any[]>([]);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await fetchAccidents();
            setAccidents(data || []);
        } catch (error) {
            console.error('Failed to fetch analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const operatorActiveness = useMemo(() => {
        return [...Array(31)].map((_, i) => ({
            day: i + 1,
            value: Math.floor(Math.random() * 100),
            month: 'FEB'
        }));
    }, []);

    return {
        loading,
        accidents,
        loadData,
        operatorActiveness
    };
};
