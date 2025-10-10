"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { useNoteStore } from "@/stores/note-store"
import { Loader2 } from "lucide-react"

interface AddNoteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    project_id: string
}

export function AddNoteDialog({ open, onOpenChange, project_id }: AddNoteDialogProps) {
    const { addNote } = useNoteStore()
    const [noteName, setNoteName] = useState("")
    const [noteContent, setNoteContent] = useState("")
    const [isPending, setIsPending] = useState(false)

    const handleCreateNote = async () => {
        if (noteName.trim() && noteContent.trim()) {
            setIsPending(true)
            await addNote(project_id, noteName.trim(), noteContent.trim())
            setIsPending(false)
            handleClose()
        }
    }

    const handleClose = () => {
        setNoteName("")
        setNoteContent("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear nueva nota</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <label htmlFor="note-name" className="text-sm font-medium">
                            Nombre de la nota
                        </label>
                        <Input
                            id="note-name"
                            value={noteName}
                            onChange={(e) => setNoteName(e.target.value)}
                            placeholder="Ingresa el nombre de la nota"
                            className="w-full"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="note-content" className="text-sm font-medium">
                            Contenido
                        </label>
                        <Textarea
                            id="note-content"
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            placeholder="Escribe el contenido de la nota..."
                            className="w-full min-h-[120px]"
                            rows={5}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button 
                        onClick={handleCreateNote}
                        disabled={!noteName.trim() || !noteContent.trim() || isPending}
                        className="text-white bg-primary hover:bg-primary/90"
                    >                        
                        {isPending && <Loader2 className="h-4 w-4 animate-spin me-2" />}
                        Crear nota
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
