"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ChevronRight, ChevronLeft, StickyNote, FileOutput, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useNoteStore } from "@/stores/note-store"
import { useEffect, useState, useRef } from "react"
import { formatTimeAgo } from "@/lib/utils"
import { AddNoteDialog } from "@/components/add-note-dialog"

interface ResultsPanelProps {
    collapsed?: boolean
    onToggleCollapse?: () => void
    isMobile?: boolean
    project_id: string
}

export function ResultsPanel({ collapsed = false, onToggleCollapse, isMobile = false, project_id }: ResultsPanelProps) {

    const { notes, fetchNotes, updateNote, deleteNote } = useNoteStore();
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState<string>("");
    const [showNewNoteDialog, setShowNewNoteDialog] = useState(false);
    const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchInitialNotes = async () => {
            console.log("fetchInitialNotes", project_id);
            await fetchNotes(project_id);
        }
        if (project_id) {
            fetchInitialNotes();
        }
    }, [project_id]);

    const handleDeleteNote = async (nid: string) => {
        await deleteNote(nid);
    }

    const handleStartEditing = (nid: string, currentName: string) => {
        setEditingNoteId(nid);
        setEditingName(currentName);
    }

    const handleSaveEdit = async (nid: string) => {
        if (editingName.trim() !== "") {
            console.log("handleSaveEdit", nid, editingName.trim());
            await updateNote(nid, editingName.trim());
        }
        setEditingNoteId(null);
        setEditingName("");
    }

    const handleCancelEdit = () => {
        setEditingNoteId(null);
        setEditingName("");
    }

    const handleKeyPress = (e: React.KeyboardEvent, nid: string) => {
        if (e.key === 'Enter') {
            handleSaveEdit(nid);
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    }

    const toggleNoteExpansion = (noteId: string) => {
        setExpandedNotes(prev => {
            const newSet = new Set(prev);
            if (newSet.has(noteId)) {
                newSet.delete(noteId);
            } else {
                newSet.add(noteId);
            }
            return newSet;
        });
    }

    const isNoteExpanded = (noteId: string) => expandedNotes.has(noteId);

    if (collapsed && !isMobile) {
        return (
            <div className="h-full bg-sidebar flex flex-col rounded-lg border border-border">
                {/* Header */}
                <div className="p-4 border-b border-border">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" className="size-7" onClick={onToggleCollapse}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="border-primary/50 text-primary">
                            <p className="text-xs">Expandir panel de resultados</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
                {/* Add Result Button */}
                <ScrollArea className="flex-1 p-4">
                    {/* <div className="flex flex-col gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={() => { }} className="size-8 px-2 text-primary bg-gray-50 border border-gray-200 hover:bg-gray-50 hover:border-primary/30" >
                                        <FileOutput className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="border-primary/50 text-primary">
                                    <p className="text-xs">Generar informe</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button onClick={() => { }} className="size-8 px-2 text-primary bg-gray-50 border border-gray-200 hover:bg-gray-50 hover:border-primary/30" >
                                        <StickyNote className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="border-primary/50 text-primary">
                                    <p className="text-xs">Notas</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div> */}
                </ScrollArea>
                <div className="p-4">
                    <div className="flex gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={() => setShowNewNoteDialog(true)} className="w-8 h-8 text-white bg-primary hover:bg-primary/90" >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="border-primary/50 text-primary">
                                <p className="text-xs">Agregar nota</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full bg-sidebar flex flex-col rounded-lg border border-border">
            {/* Header */}
            <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-sidebar-foreground">Resultados</h2>
                    {!isMobile && (
                        <Button variant="ghost" className="size-7" onClick={onToggleCollapse}>
                            <ChevronRight className="size-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Results Grid */}
            <ScrollArea className="flex-1 p-4">
                {/* 
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <Card
                        className="bg-gray-50 border-gray-200 hover:border-primary/30 transition-colors cursor-pointer"
                        onClick={() => { }}
                    >
                        <CardContent className="p-3 text-center">
                            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-2">
                                <FileOutput className="h-6 w-6 text-primary mx-auto mb-2" />
                            </div>
                            <p className="text-xs text-gray-900 font-medium">Generar informe</p>
                        </CardContent>
                    </Card>

                    <Card
                        className="bg-gray-50 border-gray-200 hover:border-primary/30 transition-colors cursor-pointer"
                        onClick={() => { }}
                    >
                        <CardContent className="p-3 text-center">
                            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-2">
                                <StickyNote className="h-6 w-6 text-primary mx-auto mb-2" />
                            </div>
                            <p className="text-xs text-gray-900 font-medium">Notas</p>
                        </CardContent>
                    </Card>
                </div> */}

                {/* Recent Items */}
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-sidebar-foreground mb-3">Notas recientes</h3>
                    {
                        notes.length > 0 && notes.map((note) => (
                            <Card key={note.id}>
                                <CardContent className="p-4">
                                    {
                                        editingNoteId === note.id ? (
                                            <div className="w-full flex items-center justify-between mb-2">
                                                <Input
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    onKeyDown={(e) => handleKeyPress(e, note.id)}
                                                    onBlur={() => handleSaveEdit(note.id)}
                                                    className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                                                    autoFocus
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full flex items-center justify-between mb-2">
                                                <div className="w-full flex items-center gap-2">
                                                    <StickyNote className="h-4 w-4 text-primary" />
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span
                                                                className="w-full text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                                                                onClick={() => handleStartEditing(note.id, note.name)}>
                                                                {note.name}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="bottom" align="start" className="border-primary/50 text-primary">
                                                            <p className="text-xs">Editar nombre de la nota</p>
                                                        </TooltipContent>
                                                    </Tooltip>

                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteNote(note.id)}
                                                    className="text-gray-500 hover:bg-red-50 hover:text-red-600 p-1 !h-8 !w-8">
                                                    <Trash2 className="h-2 w-2" />
                                                </Button>
                                            </div>
                                        )
                                    }
                                    <div>
                                        <p className={`text-xs text-foreground mb-2 ${isNoteExpanded(note.id) ? '' : 'line-clamp-3'}`}>
                                            {note.content}
                                        </p>
                                        {note.content && note.content.length > 150 && (
                                            <button
                                                onClick={() => toggleNoteExpansion(note.id)}
                                                className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1 mb-2"
                                            >
                                                {isNoteExpanded(note.id) ? (
                                                    <>
                                                        Ver menos
                                                        <ChevronUp className="h-3 w-3" />
                                                    </>
                                                ) : (
                                                    <>
                                                        Ver más
                                                        <ChevronDown className="h-3 w-3" />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">{formatTimeAgo(note.created_at)}</p>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>
            </ScrollArea>

            {/* Add Note Button */}
            <div className="p-4">
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        onClick={() => setShowNewNoteDialog(true)}
                        className="w-full !h-10 text-white bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar nota
                    </Button>
                </div>
            </div>

            {/* Add Note Dialog */}
            <AddNoteDialog
                open={showNewNoteDialog}
                onOpenChange={setShowNewNoteDialog}
                project_id={project_id}
            />
        </div>
    )
}
