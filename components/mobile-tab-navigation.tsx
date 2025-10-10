"use client"

import { Button } from "@/components/ui/button"
import { FileText, MessageCircle, Brain } from "lucide-react"

interface MobileTabNavigationProps {
    activeTab: "documents" | "chat" | "results"
    onTabChange: (tab: "documents" | "chat" | "results") => void
}

export function MobileTabNavigation({ activeTab, onTabChange }: MobileTabNavigationProps) {
    const tabs = [
        { id: "documents" as const, label: "Documentos", icon: FileText },
        { id: "chat" as const, label: "Chat", icon: MessageCircle },
        { id: "results" as const, label: "Resultados", icon: Brain },
    ]

    return (
        <div className="flex border-b border-border bg-background">
            {tabs.map((tab) => {
                const IconComponent = tab.icon
                const isActive = activeTab === tab.id

                return (
                    <Button
                        key={tab.id}
                        variant="ghost"
                        className={`flex-1 rounded-none border-b-2 transition-colors ${isActive
                                ? "border-primary text-primary bg-primary/5"
                                : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        <IconComponent className="h-4 w-4 mr-2" />
                        {tab.label}
                    </Button>
                )
            })}
        </div>
    )
}
