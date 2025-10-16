"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export function LastUsersAvatar() {

    const [avatars, setAvatars] = useState<string[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch("/api/user", {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                    }
                });

                const { data } = await response.json();
                setAvatars(data.last_10_avatar_urls || []);
                setTotal(data.total_users || 0);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (isLoading) {
        return null; // O puedes mostrar un skeleton loader
    }

    if (avatars.length === 0 || total === 0) {
        return null;
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 mt-12">
            <div className="flex items-center -space-x-3">
                {
                    avatars.map((avatar: string, index: number) => (
                        <Avatar key={index} className="w-12 h-12 border-2 border-white shadow-md hover:scale-110 transition-transform">
                            <AvatarImage src={avatar} />
                            <AvatarFallback className="bg-gradient-to-br from-[#625BF6] to-[#5048E5] text-white">U</AvatarFallback>
                        </Avatar>
                    ))
                }
                <Avatar className="w-auto h-12 border-2 border-white shadow-md bg-[#625BF6] hover:scale-110 transition-transform">
                    <AvatarFallback className="bg-gradient-to-br from-[#625BF6] to-[#5048E5] text-white text-xs font-semibold px-4">
                        y sumando...
                    </AvatarFallback>
                </Avatar>
            </div>
            <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600">
                    <span className="font-semibold text-primary">+{total}</span> usuarios activos confían en Urbai
                </p>
            </div>
        </div>
    )
}