import { create } from "zustand"
import { Notification } from "@/lib/definitions"
import { fetchUserNotifiactions } from "@/lib/notification-data"

interface NotificationStore {
    notifications: Notification[]
    fetchNotifications: () => Promise<void>
}

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: [],
    fetchNotifications: async () => {
        const notifications = await fetchUserNotifiactions()
        set({ notifications })
    }
}))
