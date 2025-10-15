'use server';

import { actionClient } from "./safe-action";
import { createClient } from "@/utils/supabase/server";
import z from "zod";
import { Project, ProjectMessage, ProjectNote } from "@/lib/definitions";

export const createProject = actionClient.inputSchema(z.object({
        name: z.string(),
        comuna: z.string(),
        type: z.string(),
        description: z.string(),
        tags: z.string(),
    }))
    .action(async ({ parsedInput: { name, comuna, type, description, tags } }) => {

        console.log("createProject", name, comuna, type, description, tags);
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        //console.log("user", user);
        const { error, data } = await supabase.from('project').insert({
            user_id: user?.id,
            name: name,
            location_id: comuna,
            type_id: type,
            description: description,
            tags: tags
        }).select().single();

        if (error) {
            console.error("createProject - error", error);
            return { failure: error.message };
        }

        return { project: data as unknown as Project };
    }
);

export const createProjectMessage = actionClient.inputSchema(z.object({
    id: z.string(),
    project_id: z.string(),
    message: z.string(),
    role: z.enum(["user", "assistant"]),
    citations: z.array(z.object({
        id: z.string(),
        article: z.string(),
        quote: z.string(),
        file_id: z.string()
    })).optional().nullable()
}))
    .action(async ({ parsedInput: { id, project_id, message, role, citations } }) => {
        console.log("createProjectMessage", project_id, message, role);
        const supabase = await createClient();
        const { error, data } = await supabase.from('project_messages').insert({
            id: id,
            project_id: project_id,
            content: message,
            role: role,
            citations: citations
        });
        
        if (error) {
            console.error("createProjectMessage - error", error);
            return { failure: error.message };
        }

        return { success: "Message created successfully" };
    }
);

export const deleteProject = actionClient.inputSchema(z.object({
    project_id: z.string(),
}))
    .action(async ({ parsedInput: { project_id } }) => {
        console.log("deleteProject", project_id);
        const supabase = await createClient();
        const { error } = await supabase.from('project').delete().eq('id', project_id);

        if (error) {
            console.error("deleteProject - error", error);
            return { failure: error.message };
        }

        return { success: "Project deleted successfully" };
    }
);

export const createProjectLibrary = actionClient.inputSchema(z.object({
    project_id: z.string(),
    library_id: z.string(),
}))
    .action(async ({ parsedInput: { project_id, library_id } }) => {
        console.log("createProjectLibrary", project_id, library_id);
        const supabase = await createClient();
        const { error, data } = await supabase.from('project_library').insert({
            project_id: project_id,
            library_id: library_id
        });
        
        if (error) {
            console.error("createProjectLibrary - error", error);
            return { failure: error.message };
        }

        return { success: "Library created successfully" };
    }
);

export const createProjectLibraries = actionClient.inputSchema(z.object({
    project_id: z.string(),
    library_ids: z.array(z.string()),
}))
    .action(async ({ parsedInput: { project_id, library_ids } }) => {
        
        console.log("createProjectLibraries", project_id, library_ids);
        
        const supabase = await createClient();
        const projectLibrary = library_ids.map((lid) => ({
            project_id: project_id,
            library_id: lid
        }));

        const { error, data } = await supabase.from('project_library').insert(projectLibrary);
        
        if (error) {
            console.error("createProjectLibraries - error", error);
            return { failure: error.message };
        }

        return { success: "Libraries created successfully" };
    }
);

export const deleteProjectLibrary = actionClient.inputSchema(z.object({
    project_id: z.string(),
    library_id: z.string(),
}))
    .action(async ({ parsedInput: { project_id, library_id } }) => {
        console.log("deleteProjectLibrary", project_id, library_id);
        const supabase = await createClient();
        const { error } = await supabase.from('project_library').delete().eq('project_id', project_id).eq('library_id', library_id);

        if (error) {
            console.error("deleteProjectLibrary - error", error);
            return { failure: error.message };
        }

        return { success: "Library deleted successfully" };
    }
);

export const createProjectNote = actionClient.inputSchema(z.object({
    project_id: z.string(),
    name: z.string(),
    content: z.string(),
}))
    .action(async ({ parsedInput: { project_id, name, content } }) => {
        console.log("createProjectNote", project_id, name, content);
        const supabase = await createClient();
        const { error, data } = await supabase.from('project_notes').insert({
            project_id: project_id,
            name: name,
            content: content
        }).select().single();

        if (error) {
            console.error("createProjectNote - error", error);
            return { failure: error.message };
        }

        return { success: "Note created successfully", note: data as unknown as ProjectNote };
    }
);

export const updateProjectNote = actionClient.inputSchema(z.object({
    note_id: z.string(),
    name: z.string().optional(),
    content: z.string().optional(),
}))
    .action(async ({ parsedInput: { note_id, name, content } }) => {
        console.log("updateProjectNote", note_id, name, content);
        const supabase = await createClient();
        
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (content !== undefined) updateData.content = content;

        const { error, data } = await supabase
            .from('project_notes')
            .update(updateData)
            .eq('id', note_id)
            .select()
            .single();

        if (error) {
            console.error("updateProjectNote - error", error);
            return { failure: error.message };
        }

        return { success: "Note updated successfully", note: data as unknown as ProjectNote };
    }
);

export const deleteProjectNote = actionClient.inputSchema(z.object({
    note_id: z.string(),
}))
    .action(async ({ parsedInput: { note_id } }) => {
        console.log("deleteProjectNote", note_id);
        const supabase = await createClient();
        const { error } = await supabase.from('project_notes').delete().eq('id', note_id);

        if (error) {
            console.error("deleteProjectNote - error", error);
            return { failure: error.message };
        }

        return { success: "Note deleted successfully" };
    }
);