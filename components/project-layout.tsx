"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProjectLayoutProps {
    children: React.ReactNode
    leftPanel: React.ReactNode
    centerPanel: React.ReactNode
    rightPanel: React.ReactNode
}

export function ProjectLayout({ children, leftPanel, centerPanel, rightPanel }: ProjectLayoutProps) {
    const [leftCollapsed, setLeftCollapsed] = useState(false)
    const [rightCollapsed, setRightCollapsed] = useState(false)

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {children}
            <div className="flex-1 flex h-[calc(100vh-64px)] overflow-hidden bg-gray-100">
                {/* Left Panel - Sources */}
                <div
                    className={`${leftCollapsed ? "w-0" : "w-80"} transition-all duration-300 border-r border-gray-200 bg-gray-100 relative flex-shrink-0 pl-2 pr-2 pb-2`}
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setLeftCollapsed(!leftCollapsed)}
                        className="absolute right-3 top-4 z-10 bg-gray-100 border border-gray-300 text-gray-900 hover:bg-gray-200 h-6 w-6 p-0 shadow-sm"
                    >
                        {leftCollapsed ? (
                            <ChevronRight className="h-3 w-3 text-black" />
                        ) : (
                            <ChevronLeft className="h-3 w-3 text-black" />
                        )}
                    </Button>
                    {!leftCollapsed && <div className="h-full overflow-y-auto">{leftPanel}</div>}
                </div>

                {/* Center Panel - Chat */}
                <div className="flex-1 bg-white relative h-full overflow-hidden">{centerPanel}</div>

                {/* Right Panel - Herramientas */}
                <div
                    className={`${rightCollapsed ? "w-0" : "w-80"} transition-all duration-300 border-l border-gray-200 bg-white relative flex-shrink-0`}
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRightCollapsed(!rightCollapsed)}
                        className="absolute -left-3 top-4 z-10 bg-gray-100 border border-gray-300 text-gray-900 hover:bg-gray-200 h-6 w-6 p-0 shadow-sm"
                    >
                        {rightCollapsed ? (
                            <ChevronLeft className="h-3 w-3 text-black" />
                        ) : (
                            <ChevronRight className="h-3 w-3 text-black" />
                        )}
                    </Button>
                    {!rightCollapsed && <div className="h-full overflow-y-auto">{rightPanel}</div>}
                </div>
            </div>
        </div>
    )
}
