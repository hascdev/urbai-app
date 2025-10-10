"use server";

import { createClient } from "@/utils/supabase/server";

export interface FilterOption {
    value: string;
    label: string;
}

export interface LibraryFilterData {
    comunas: FilterOption[];
    types: FilterOption[];
    states: FilterOption[];
}

export async function fetchLibraryFilterData(): Promise<LibraryFilterData> {
    try {
        const supabase = await createClient();

        // Obtener todas las comunas únicas
        const { data: comunasData, error: comunasError } = await supabase
            .from('library_locations')
            .select('id, name')
            .order('name');

        if (comunasError) throw comunasError;

        // Obtener todos los tipos únicos
        const { data: typesData, error: typesError } = await supabase
            .from('library_types')
            .select('id, name, level_id')
            .order('level_id');

        if (typesError) throw typesError;

        // Obtener todos los estados únicos
        const { data: statesData, error: statesError } = await supabase
            .from('library_status')
            .select('id, name')
            .order('name');

        if (statesError) throw statesError;

        // Procesar comunas
        const comunas: FilterOption[] = [
            { value: "all", label: "Todas las comunas" },
            ...(comunasData?.map((item: any) => ({
                value: item.name,
                label: item.name
            })) || [])
        ];

        // Procesar tipos
        const types: FilterOption[] = [
            { value: "all", label: "Todos los tipos" },
            ...(typesData?.map((item: any) => ({
                value: item.name,
                label: item.name
            })) || [])
        ];

        // Procesar estados
        const states: FilterOption[] = [
            { value: "all", label: "Todos los estados" },
            ...(statesData?.map((item: any) => ({
                value: item.name,
                label: item.name
            })) || [])
        ];

        return {
            comunas,
            types,
            states
        };

    } catch (error) {
        console.error('Database Error fetching filter data:', error);
        
        // Fallback a datos estáticos en caso de error
        return {
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
        };
    }
}

