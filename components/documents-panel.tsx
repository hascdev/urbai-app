"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { ChevronLeft, ChevronRight, Trash2, Eye, FilePlus2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Library, LibraryDocument } from "@/lib/definitions"
import { Card, CardContent } from "./ui/card"
import { useRouter } from "next/navigation"
import { useProjectStore } from "@/stores/project-store"
import { toast } from "sonner"
import { PDFViewerDialog } from "./pdf-viewer-dialog"

interface DocumentsPanelProps {
    collapsed?: boolean
    onToggleCollapse?: () => void
    isMobile?: boolean
}

export function DocumentsPanel({ collapsed = false, onToggleCollapse, isMobile = false }: DocumentsPanelProps) {

    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("")
    const [selectAll, setSelectAll] = useState(false)
    const { project, activeLibraries, toggleLibrary, selectAllLibraries, deselectAllLibraries, setActiveLibraries, removeLibraryFromProject } = useProjectStore();
    const [hierarchicalDocuments, setHierarchicalDocuments] = useState<any>({});
    const [openPDFViewerDialog, setOpenPDFViewerDialog] = useState(false);
    const [doc, setDoc] = useState<LibraryDocument | null>(null);

    useEffect(() => {
        if (project?.libraries) {
            setHierarchicalDocuments(categorizeDocumentsByHierarchy(project?.libraries || []));
        }
    }, [project]);

    // Sync selectAll checkbox with activeLibraries
    useEffect(() => {
        const totalLibraries = project?.libraries?.length || 0;
        const selectedLibraries = activeLibraries.length;
        
        if (totalLibraries > 0) {
            setSelectAll(selectedLibraries === totalLibraries);
        }
    }, [activeLibraries, project?.libraries]);

    const handleAllDocumentsSelected = (checked: boolean) => {
        if (checked) {
            selectAllLibraries();
        } else {
            deselectAllLibraries();
        }
    }

    const handleSelectDocument = (documentId: string, checked: boolean) => {
        toggleLibrary(documentId);
    }

    const handleDeleteDocument = async (lid: string) => {
        console.log("handleDeleteDocument", lid);
        if (project?.id) {
            await removeLibraryFromProject(project.id, lid);
            setActiveLibraries(activeLibraries.filter((id) => id !== lid));
            toast.success("Documento eliminado del proyecto exitosamente");            
        }
    }

    const categorizeDocumentsByHierarchy = (libraries: Library[]) => {
        const hierarchy = {
            1: { title: "Constitución Política", docs: libraries.filter((library) => library.type.level_id === 1), icon: "⚖️", color: "bg-red-50 border-red-200 text-red-800" },
            2: { title: "Leyes", docs: libraries.filter((library) => library.type.level_id === 2), icon: "📜", color: "bg-orange-50 border-orange-200 text-orange-800", },
            3: { title: "Reglamentos", docs: libraries.filter((library) => library.type.level_id === 3), icon: "📋", color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
            4: { title: "Planes Territoriales", docs: libraries.filter((library) => library.type.level_id === 4), icon: "🗺️", color: "bg-blue-50 border-blue-200 text-blue-800", },
            5: { title: "Normativa Administrativa", docs: libraries.filter((library) => library.type.level_id === 5), icon: "📄", color: "bg-gray-50 border-gray-200 text-gray-800" },
        }
        console.log("hierarchy", hierarchy);
        return hierarchy;
    }

    const handleClickDocument = (library: Library) => {        
        if (library.documents.length === 0) return;
        // TODO: Mejorar la selección de documento ya que pueden ser varios
        const doc = library.documents[0];
        doc.library = library;
        console.log("doc", doc);
        setDoc(doc);
        setOpenPDFViewerDialog(true);
    }

    if (collapsed && !isMobile) {
        return (
            <div className="h-full bg-sidebar flex flex-col rounded-lg border border-border">
                {/* Header */}
                <div className="p-4 border-b border-border">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" className="size-7" onClick={onToggleCollapse}>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="border-primary/50 text-primary">
                                <p className="text-xs">Expandir panel de documentos</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                {/* Add Document Button */}
                <ScrollArea className="flex-1 p-4">
                    <div className="flex flex-col gap-2">
                        
                    </div>
                </ScrollArea>
                <div className="p-4">
                    <div className="flex gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button 
                                        disabled={!project?.id}
                                        onClick={() => router.push(`/app/library?pid=${project?.id}`)}  
                                        className="w-8 h-8 text-white bg-primary hover:bg-primary/90">
                                        <FilePlus2 className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="border-primary/50 text-primary">
                                    <p className="text-xs">Añadir documentos</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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
                    <h2 className="text-lg font-semibold text-sidebar-foreground">Documentos</h2>
                    {!isMobile && (
                        <Button variant="ghost" className="size-7" onClick={onToggleCollapse}>
                            <ChevronLeft className="size-4" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Select All */}
            <div className="p-4 border-b border-sidebar-border">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="select-all"
                        checked={selectAll}
                        onCheckedChange={handleAllDocumentsSelected}
                    />
                    <label htmlFor="select-all" className="text-sm text-sidebar-foreground">
                        Seleccionar todos los documentos
                    </label>
                </div>
            </div>

            {/* Documents List */}
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                    {Object.entries(hierarchicalDocuments).map(([level, category]: [string, any]) => {
                        if (category.docs.length === 0) return null

                        return (
                            <div key={level} className="space-y-2">
                                <div className={`px-3 py-2 rounded-lg border ${category.color}`}>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm">{category.icon}</span>
                                        <h3 className="text-sm font-medium">{category.title}</h3>
                                        <Badge variant="secondary" className="text-xs bg-white/50">
                                            {category.docs.length}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="ml-2 space-y-2">
                                    {category.docs.map((library: Library) => (
                                        <Card key={library.id} className="bg-gray-50 border-gray-200 hover:border-primary/30 transition-colors">
                                            <CardContent className="p-2">
                                                <div className="flex items-start space-x-2">
                                                    <Checkbox
                                                        className="m-1"
                                                        checked={activeLibraries.includes(library.id)}
                                                        onCheckedChange={(checked) => handleSelectDocument(library.id, !!checked)}
                                                    />
                                                    <div className="flex-1 min-w-0 space-y-2">
                                                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{library.name}</h4>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                                                                {library.type.name}
                                                            </Badge>
                                                            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200" >
                                                                {library.status.name}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col space-y-1">
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => handleClickDocument(library)}
                                                            className="text-gray-500 hover:bg-gray-100 p-1 !h-8 !w-8">
                                                            <Eye className="h-2 w-2" />
                                                        </Button>
                                                        <Button 
                                                            variant="ghost" 
                                                            size="icon" 
                                                            onClick={() => handleDeleteDocument(library.id)}
                                                            className="text-gray-500 hover:bg-red-50 hover:text-red-600 p-1 !h-8 !w-8">
                                                            <Trash2 className="h-2 w-2" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </ScrollArea>

            {/* Add Document Button */}
            <div className="p-4">
                <div className="flex gap-2">
                    <Button 
                        size="sm" 
                        disabled={!project?.id}
                        onClick={() => router.push(`/app/library?pid=${project?.id}`)} 
                        className="w-full !h-10 text-white bg-primary hover:bg-primary/90" >
                        <FilePlus2 className="h-4 w-4 mr-2" />
                        Añadir documentos
                    </Button>
                </div>
            </div>

            {/* PDF Viewer Dialog */}
            <PDFViewerDialog
                open={openPDFViewerDialog}
                onOpenChange={setOpenPDFViewerDialog}
                doc={doc}
            />
        </div>
    )
}
