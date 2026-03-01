import { useState, useEffect, useCallback } from 'react';

export function useUnsavedChanges<T>(initialData: T) {
    const [currentData, setCurrentData] = useState<T>(initialData);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        setIsDirty(JSON.stringify(initialData) !== JSON.stringify(currentData));
    }, [initialData, currentData]);

    const updateField = useCallback((field: keyof T, value: any) => {
        setCurrentData(prev => ({ ...prev, [field]: value }));
    }, []);

    const reset = useCallback(() => {
        setCurrentData(initialData);
    }, [initialData]);

    return {
        currentData,
        isDirty,
        updateField,
        reset,
        setCurrentData
    };
}
