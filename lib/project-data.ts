"use server";

import { createClient } from "@/utils/supabase/server";
import { Project, ProjectLibrary, ProjectMessage, ProjectNote } from "@/lib/definitions";


export async function fetchProject(id: string) {

    try {

        const supabase = await createClient();

        const { data, error } = await supabase
            .from('project')
            .select('*, type:project_types(name), commune:communes(name), project_library(library_id)')
            .eq('id', id).maybeSingle();

        if (error) {
            throw error;
        }

        const { data: libraries, error: librariesError } = await supabase
            .from('library')
            .select('*, status:library_status(name), type:library_types(name, level_id, level:library_levels(name)), location:library_locations(name), documents:library_docs(*)')
            .in('id', data.project_library.map((pl: any) => pl.library_id));

        if (librariesError) {
            throw librariesError;
        }

        data.libraries = libraries;
        console.log("project", data);

        return data as unknown as Project;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch project data.');
    }
}

export async function fetchProjects() {

    try {

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('project')
            .select('*, type:project_types(name), commune:communes(name), project_library(library_id)')
            .eq('user_id', user?.id);

        if (error) {
            throw error;
        }

        for (const project of data) {

            const { data: libraries, error: librariesError } = await supabase
                .from('library')
                .select('*, status:library_status(name), type:library_types(name, level_id, level:library_levels(name)), location:library_locations(name), documents:library_docs(*)')
                .in('id', project.project_library.map((pl: any) => pl.library_id));
            
            if (librariesError) {
                throw librariesError;
            }
            project.libraries = libraries;
        }

        return data as unknown as Project[];

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch projects data.');
    }
}

export async function fetchProjectsByLocation(commune_id: string) {

    try {

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('project')
            .select('*, type:project_types(name), commune:communes(name), project_library(library_id)')
            .eq('user_id', user?.id)
            .eq('commune_id', commune_id);

        if (error) {
            throw error;
        }

        console.log("projects by location", data);

        for (const project of data) {

            const { data: libraries, error: librariesError } = await supabase
                .from('library')
                .select('*, status:library_status(name), type:library_types(name, level_id, level:library_levels(name)), location:library_locations(name), documents:library_docs(*)')
                .in('id', project.project_library.map((pl: any) => pl.library_id));
            
            if (librariesError) {
                throw librariesError;
            }
            project.libraries = libraries;
        }

        return data as unknown as Project[];

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch projects data.');
    }
}

export async function fetchLastProjects() {

    try {

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('project')
            .select('*, type:project_types(name), commune:communes(name), project_library(library_id)')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false })
            .limit(4);

        if (error) {
            throw error;
        }

        for (const project of data) {

            const { data: libraries, error: librariesError } = await supabase
                .from('library')
                .select('*, status:library_status(name), type:library_types(name, level_id, level:library_levels(name)), location:library_locations(name), documents:library_docs(*)')
                .in('id', project.project_library.map((pl: any) => pl.library_id));
            
            if (librariesError) {
                throw librariesError;
            }
            project.libraries = libraries;
        }

        return data as unknown as Project[];

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch projects data.');
    }
}

export async function fetchProjectMessages(project_id: string) {
    
    try {

        const supabase = await createClient();
        const { data, error } = await supabase
            .from('project_messages')
            .select('*')
            .eq('project_id', project_id)
            .order('date');

        if (error) {
            throw error;
        }

        return data as unknown as ProjectMessage[];

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch project messages data.');
    }
}

export async function fetchProjectNotes(project_id: string) {
    
    try {

        const supabase = await createClient();
        const { data, error } = await supabase
            .from('project_notes')
            .select('*')
            .eq('project_id', project_id)
            .order('created_at');

        if (error) {
            throw error;
        }

        return data as unknown as ProjectNote[];
        
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch project notes data.');
    }
}

export async function fetchProjectLibraries(project_id: string) {
    
    try {

        const supabase = await createClient();
        const { data, error } = await supabase
            .from('project_library')
            .select('*, library:library(id, name, type_id, status:library_status(name), type:library_types(name, level_id, level:library_levels(name)), location:library_locations(name, commune_id), documents:library_docs(*), vector_store_id)')
            .eq('project_id', project_id);

        if (error) {
            throw error;
        }

        return data as unknown as ProjectLibrary[];
        
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch project libraries data.');
    }
}