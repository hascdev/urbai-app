import { create } from "zustand"
import { ProjectMessage } from "@/lib/definitions"
import { fetchProjectMessages } from "@/lib/project-data"
import { createProjectMessage } from "@/lib/project-action"

interface MessageStore {
    messages: ProjectMessage[]
    addMessage: (message: ProjectMessage) => Promise<void>
    fetchMessages: (project_id: string) => Promise<void>
}

export const useMessageStore = create<MessageStore>((set) => ({
    messages: [],
    fetchMessages: async (project_id: string) => {
        const messages = await fetchProjectMessages(project_id)
        set({ messages })
    },    
    addMessage: async (message) => {

        const result = await createProjectMessage({
            id: message.id,
            project_id: message.project_id,
            message: message.content,
            role: message.role,
            citations: message.citations || null,
            location: message.location || null
        });

        console.log("addMessage - result", result);

        if (result && result?.data?.success) {
            set((state) => ({ messages: [...state.messages, message] }))
        }
    }
}))
