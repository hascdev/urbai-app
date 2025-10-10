"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { PDFViewer } from "@/components/pdf-viewer"
import { LibraryDocument } from "@/lib/definitions"

interface PDFViewerDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    searchText?: string
    doc: LibraryDocument | null
}

export function PDFViewerDialog({ open, onOpenChange, doc, searchText }: PDFViewerDialogProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex flex-col gap-2">
                        {doc?.library.name}
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700 border-gray-200">
                                {doc?.library.type.name}
                            </Badge>
                            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200" >
                                {doc?.library.status.name}
                            </Badge>
                        </div>
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-hidden">{open && <PDFViewer pdfUrl={doc ? doc.url : ""} searchText={searchText} />}</div>
            </DialogContent>
        </Dialog>
    )
}
