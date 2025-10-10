"use server";

import { createClient } from "@/utils/supabase/server";

export interface FilterOption {
    value: string;
    label: string;
}

export interface ProjectFilterData {
    comunas: FilterOption[];
    types: FilterOption[];
}

export async function fetchProjectFilterData(): Promise<ProjectFilterData> {
    try {
        const supabase = await createClient();

        // Obtener todas las comunas únicas
        const { data: comunasData, error: comunasError } = await supabase
            .from('communes')
            .select('id, name')
            .order('name');

        if (comunasError) throw comunasError;

        // Obtener todos los tipos únicos
        const { data: typesData, error: typesError } = await supabase
            .from('project_types')
            .select('id, name')
            .order('id');

        if (typesError) throw typesError;

        // Procesar comunas
        const comunas: FilterOption[] = [            
            ...(comunasData?.map((item: any) => ({
                value: item.id,
                label: item.name
            })) || [])
        ];

        // Procesar tipos
        const types: FilterOption[] = [        
            ...(typesData?.map((item: any) => ({
                value: item.id,
                label: item.name
            })) || [])
        ];

        return { comunas, types };

    } catch (error) {
        console.error('Database Error fetching filter data:', error);
        throw new Error('Failed to fetch project filter data.');
    }
}

