import { Library, Project } from "@/lib/definitions";
import { createProjectLibraries, createProjectLibrary, deleteProject, deleteProjectLibrary } from "@/lib/project-action";
import { fetchProjects, fetchProject, fetchLastProjects, fetchProjectLibraries, fetchProjectsByLocation } from "@/lib/project-data";
import { create } from "zustand";

interface ProjectStore {
    projects: Project[];
    project: Project | null;
    activeLibraries: string[];
    getProjects: () => Promise<void>;
    getProjectsByLocation: (commune_id: string) => Promise<void>;
    getLastProjects: () => Promise<void>;
    removeProject: (pid: string) => Promise<void>;
    getProject: (id: string) => Promise<void>;
    addLibraryToProject: (pid: string, library: Library) => Promise<void>;
    addLibrariesToProject: (pid: string, libraries: Library[]) => Promise<void>;
    removeLibraryFromProject: (pid: string, lid: string) => Promise<void>;
    setActiveLibraries: (libraryIds: string[]) => void;
    toggleLibrary: (libraryId: string) => void;
    selectAllLibraries: () => void;
    deselectAllLibraries: () => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
    projects: [],
    project: null,
    activeLibraries: [],
    getProjects: async () => {
        const projects = await fetchProjects();
        set({ projects })
    },
    getProjectsByLocation: async (commune_id: string) => {
        const projects = await fetchProjectsByLocation(commune_id);
        set({ projects })
    },
    getLastProjects: async () => {
        const projects = await fetchLastProjects();
        set({ projects })
    },
    removeProject: async (pid: string) => {
        set((state) => ({ projects: state.projects.filter((project) => project.id !== pid) }));
        await deleteProject({ project_id: pid });
    },
    getProject: async (id: string) => {
        const project = await fetchProject(id);
        // Initialize activeLibraries with all libraries when project is loaded
        const libraryIds = project?.libraries?.map((lib) => lib.id) || [];
        set({ project, activeLibraries: libraryIds })
    },
    addLibraryToProject: async (pid: string, library: Library) => {
        set((state) => ({
            projects: state.projects.map((project) => project.id === pid ? { ...project, libraries: [...project.libraries, library] } : project),
            project: state.project?.id === pid ? { ...state.project, libraries: [...state.project.libraries, library] } : state.project,
            activeLibraries: state.project?.id === pid ? [...state.activeLibraries, library.id] : state.activeLibraries
        }));
        await createProjectLibrary({ project_id: pid, library_id: library.id });
    },
    addLibrariesToProject: async (pid: string, libraries: Library[]) => {
        set((state) => ({
            projects: state.projects.map((project) => project.id === pid ? { ...project, libraries: [...project.libraries, ...libraries] } : project),
            project: state.project?.id === pid ? { ...state.project, libraries: [...state.project.libraries, ...libraries] } : state.project,
            activeLibraries: state.project?.id === pid ? [...state.activeLibraries, ...libraries.map((lib) => lib.id)] : state.activeLibraries
        }));
        await createProjectLibraries({ project_id: pid, library_ids: libraries.map((library) => library.id) });
    },
    removeLibraryFromProject: async (pid: string, lid: string) => {
        set((state) => ({
            projects: state.projects.map((project) => project.id === pid ? { ...project, libraries: project.libraries.filter((l) => l.id !== lid) } : project),
            project: state.project?.id === pid ? { ...state.project, libraries: state.project.libraries.filter((l) => l.id !== lid) } : state.project,
            activeLibraries: state.activeLibraries.filter((id) => id !== lid)
        }));
        await deleteProjectLibrary({ project_id: pid, library_id: lid });
    },
    setActiveLibraries: (libraryIds: string[]) => {
        set({ activeLibraries: libraryIds })
    },
    toggleLibrary: (libraryId: string) => {
        set((state) => ({
            activeLibraries: state.activeLibraries.includes(libraryId)
                ? state.activeLibraries.filter((id) => id !== libraryId)
                : [...state.activeLibraries, libraryId]
        }))
    },
    selectAllLibraries: () => {
        set((state) => ({
            activeLibraries: state.project?.libraries?.map((lib) => lib.id) || []
        }))
    },
    deselectAllLibraries: () => {
        set({ activeLibraries: [] })
    }
}))