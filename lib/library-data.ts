"use server";

import { createClient } from "@/utils/supabase/server";
import { Library } from "./definitions";

export async function fetchLibraries() {

    try {

        const supabase = await createClient();

        let query = supabase
            .from('library')
            .select('*, status:library_status(name), type:library_types(name, level_id, level:library_levels(name)), location:library_locations(name, commune_id), documents:library_docs(*), favorites:library_favorites(*)')

        if (process.env.NEXT_PUBLIC_ENV === 'production') {
            query = query.neq('status_id', 4); // 4 = No Liberado
        }
            
        const { data, error } = await query;

        if (error) {
            throw error;
        }

        console.log('Libraries data:', data);

        return data as Library[];

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch libraries data.');
    }
}

export async function fetchLibrary(id: string) {

    try {

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('library')
            .select('*, status:library_status(name), type:library_types(name, level_id, level:library_levels(name)), location:library_locations(name), documents:library_docs(*), favorites:library_favorites(*)')
            .eq('id', id).maybeSingle()

        if (error) {
            throw error;
        }

        return data as Library;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch library data.');
    }
}