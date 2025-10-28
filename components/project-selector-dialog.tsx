"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Project } from "@/lib/definitions"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProjectSelectorDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    projects: Project[]
    selectedDocForProject?: string | null
    handleProjectSelection: (projectId: string) => void
}

export function ProjectSelectorDialog({ open, onOpenChange, projects, selectedDocForProject, handleProjectSelection }: ProjectSelectorDialogProps) {
    const router = useRouter()
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-white border-gray-200">
                <DialogHeader>
                    <DialogTitle className="text-gray-900">Seleccionar proyecto</DialogTitle>
                    <DialogDescription className="text-gray-600">
                        Elige el proyecto al que quieres añadir {selectedDocForProject ? "este documento" : "estos documentos"}.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {
                        projects.length > 0 ?
                            projects.map((project) => (
                                <Button
                                    key={project.id}
                                    variant="outline"
                                    onClick={() => handleProjectSelection(project.id)}
                                    className="w-full justify-start text-left p-3 h-auto hover:bg-gray-50 bg-white"
                                >
                                    <div className="flex flex-col gap-1">
                                        <p className="text-md font-medium text-gray-900">
                                            {project.name}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {project.commune.name} • {project.libraries.length} documento{project.libraries.length !== 1 ? "s" : ""}
                                        </p>
                                    </div>
                                </Button>
                            )) : (
                                <div className="flex items-center justify-center py-4 bg-gray-50 rounded-md border border-gray-200">
                                    <p className="text-muted-foreground text-sm text-center">No se encontraron proyectos donde puedes añadir {selectedDocForProject ? "el documento seleccionado" : "los documentos seleccionados"}.</p>
                                </div>
                            )
                    }
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-gray-200 text-gray-600"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => router.push("/app/projects/new")}
                        className="bg-primary hover:bg-primary/90 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear nuevo proyecto
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
