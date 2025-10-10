import { create } from "zustand"
import { ProjectNote } from "@/lib/definitions"
import { fetchProjectNotes } from "@/lib/project-data"
import { createProjectNote, deleteProjectNote, updateProjectNote } from "@/lib/project-action"

interface NoteStore {
    notes: ProjectNote[]
    addNote: (project_id: string, name: string, content: string) => Promise<void>
    updateNote: (note_id: string, name?: string, content?: string) => Promise<void>
    fetchNotes: (project_id: string) => Promise<void>
    deleteNote: (note_id: string) => Promise<void>
}

export const useNoteStore = create<NoteStore>((set) => ({
    notes: [],
    fetchNotes: async (project_id: string) => {
        const notes = await fetchProjectNotes(project_id)
        set({ notes })
    },    
    addNote: async (project_id, name, content) => {

        const result = await createProjectNote({
            project_id: project_id,
            name: name,
            content: content
        });

        if (result && result?.data?.success) {
            const note = result.data.note as unknown as ProjectNote;
            set((state) => ({ notes: [...state.notes, note] }))
        }
    },
    updateNote: async (note_id, name, content) => {
        const result = await updateProjectNote({
            note_id: String(note_id),
            name: name,
            content: content
        });
        if (result && result?.data?.success) {
            const updatedNote = result.data.note as unknown as ProjectNote;
            set((state) => ({
                notes: state.notes.map(note => 
                    note.id === note_id ? updatedNote : note
                )
            }))
        }
    },
    deleteNote: async (note_id) => {
        const result = await deleteProjectNote({
            note_id: String(note_id)
        });

        if (result && result?.data?.success) {
            set((state) => ({
                notes: state.notes.filter(note => note.id !== note_id)
            }))
        }
    }
}))
