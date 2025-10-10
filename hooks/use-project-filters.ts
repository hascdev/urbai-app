"use client";

import { useState, useEffect, useCallback } from "react";
import { ProjectFilterData, FilterOption, fetchProjectFilterData } from "@/lib/project-filter-data";

interface UseProjectFiltersReturn {
    filterData: ProjectFilterData;
    isLoading: boolean;
    error: string | null;
    refreshFilters: () => Promise<void>;
}

export function useProjectFilters(): UseProjectFiltersReturn {
    const [filterData, setFilterData] = useState<ProjectFilterData>({
        comunas: [],
        types: [],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadFilters = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const data = await fetchProjectFilterData();
            setFilterData(data);
            
        } catch (err) {
            console.error('Error loading filters:', err);
            setError('Error al cargar los filtros');            
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFilters();
    }, [loadFilters]);

    const refreshFilters = useCallback(async () => {
        await loadFilters();
    }, [loadFilters]);

    return {
        filterData,
        isLoading,
        error,
        refreshFilters,
    };
}

// Hook optimizado para obtener solo opciones específicas
export function useProjectFilterOptions(type: 'comunas' | 'types'): {
    options: FilterOption[];
    isLoading: boolean;
    error: string | null;
} {
    const { filterData, isLoading, error } = useProjectFilters();
    
    return {
        options: filterData[type] || [],
        isLoading,
        error,
    };
}
