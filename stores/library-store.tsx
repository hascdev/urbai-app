import { Library, ProjectLibrary } from "@/lib/definitions";
import { fetchLibrary } from "@/lib/library-data";
import { fetchProjectLibraries } from "@/lib/project-data";
import { create } from "zustand";

interface LibraryStore {
    projectLibraries: ProjectLibrary[];
    library: Library | null;
    getProjectLibraries: (pid: string) => Promise<void>;
    getLibrary: (id: string) => Promise<void>;
}

export const useLibraryStore = create<LibraryStore>((set) => ({
    projectLibraries: [],
    library: null,
    getProjectLibraries: async (pid: string) => {
        const projectLibraries = await fetchProjectLibraries(pid);
        set({ projectLibraries })
    },
    getLibrary: async (id: string) => {
        const library = await fetchLibrary(id);
        set({ library })
    }
}))