'use client'

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { Notification } from "@/lib/definitions";
import { createClient } from "@/utils/supabase/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import clsx from "clsx";
import { useAuth } from "@/hooks/use-auth";

export function NotificationPopover({ notifications }: { notifications: Notification[] }) {

    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [hasNewNotification, setHasNewNotification] = useState(false);
    const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);

    useEffect(() => {
        const supabase = createClient();
        supabase.channel('notifications')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, payload => {
                const notification = payload.new as Notification;
                console.log(notification);
                if (notification.receiver_id === user?.uid as string) {
                    notification.status = 'delivered';
                    setLocalNotifications([notification, ...localNotifications]);
                    setHasNewNotification(true);
                }
            })
            .subscribe();
    }, []);

    const handleOpenChange = (open: boolean) => {
        if (open) {
            setHasNewNotification(false);
        }
        setIsOpen(open);
    }

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <span className="relative inline-flex">
                    <Button variant="outline" size="icon" aria-label="Notificaciones" className="rounded-full">
                        <Bell className="h-5 w-5" />
                    </Button>
                    <span className={clsx("absolute top-0 right-0 -mt-1 -mr-1 size-3", hasNewNotification ? "flex" : "hidden")}>
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-urbai opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-urbai"></span>
                    </span>
                </span>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end" side="bottom">
                <div className="grid">
                    <div className="space-y-2 p-4">
                        <h4 className="font-medium leading-none">Notificaciones</h4>
                    </div>
                    <Separator />
                    <div className="grid gap-2 p-4">
                        {
                        localNotifications.length > 0 ?
                        localNotifications.map(notification => (
                        <div key={notification.id} className="grid grid-cols-[25px_1fr] items-start pb-5 last:mb-0 last:pb-0">
                            <span className={clsx("flex h-2 w-2 translate-y-1 rounded-full", notification.status === 'delivered' ? "bg-green-500" : "bg-gray-500")} />
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium leading-none">{notification.status === 'delivered' ? "Nuevo mensaje" : "Mensaje"}</p>
                                    <p className="text-sm font-medium leading-none text-muted-foreground">{new Date(notification.created_at).toLocaleTimeString('es-ES', { hour: "2-digit", minute: "2-digit", hour12: true })}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{notification.message}</p>
                            </div>
                        </div>
                        ))  :
                        <p className="text-sm text-muted-foreground">No tienes nuevas notificaciones.</p>                        
                        }                        
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}