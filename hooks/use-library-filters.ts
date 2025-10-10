"use client";

import { useState, useEffect, useCallback } from "react";
import { LibraryFilterData, FilterOption, fetchLibraryFilterData } from "@/lib/library-filter-data";

interface UseLibraryFiltersReturn {
    filterData: LibraryFilterData;
    isLoading: boolean;
    error: string | null;
    refreshFilters: () => Promise<void>;
}

export function useLibraryFilters(): UseLibraryFiltersReturn {
    const [filterData, setFilterData] = useState<LibraryFilterData>({
        comunas: [{ value: "all", label: "Todas las comunas" }],
        types: [{ value: "all", label: "Todos los tipos" }],
        states: [{ value: "all", label: "Todos los estados" }],
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadFilters = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const data = await fetchLibraryFilterData();
            setFilterData(data);
            
        } catch (err) {
            console.error('Error loading filters:', err);
            setError('Error al cargar los filtros');
            
            // Mantener datos por defecto en caso de error
            setFilterData({
                comunas: [
                    { value: "all", label: "Todas las comunas" },
                    { value: "Providencia", label: "Providencia" },
                    { value: "Las Condes", label: "Las Condes" },
                    { value: "Santiago", label: "Santiago" },
                    { value: "Maipú", label: "Maipú" },
                    { value: "Ñuñoa", label: "Ñuñoa" },
                    { value: "Nacional", label: "Nacional" },
                ],
                types: [
                    { value: "all", label: "Todos los tipos" },
                    { value: "PRC", label: "Plan Regulador Comunal" },
                    { value: "OGUC", label: "OGUC" },
                    { value: "Circular DDU", label: "Circular DDU" },
                    { value: "Ordenanza", label: "Ordenanza" },
                    { value: "Jurisprudencia", label: "Jurisprudencia" },
                    { value: "Límites Urbanos", label: "Límites Urbanos" },
                ],
                states: [
                    { value: "all", label: "Todos los estados" },
                    { value: "Actualizado", label: "Actualizado" },
                    { value: "Obsoleto", label: "Obsoleto" },
                    { value: "En revisión", label: "En revisión" },
                ]
            });
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
export function useLibraryFilterOptions(type: 'comunas' | 'types' | 'states'): {
    options: FilterOption[];
    isLoading: boolean;
    error: string | null;
} {
    const { filterData, isLoading, error } = useLibraryFilters();
    
    return {
        options: filterData[type] || [],
        isLoading,
        error,
    };
}
