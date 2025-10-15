"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { BookOpenCheck } from "lucide-react"
import { PDFViewerDialog } from "@/components/pdf-viewer-dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LibraryDocument, MessageCitation, ProjectLibrary } from "@/lib/definitions"

interface MessageWithCitationsProps {
    content: string
    citations: MessageCitation[]
    projectLibraries: ProjectLibrary[]
}

export function MessageWithCitations({ content, citations, projectLibraries }: MessageWithCitationsProps) {

    const [openPDFViewerDialog, setOpenPDFViewerDialog] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [doc, setDoc] = useState<LibraryDocument | null>(null);

    // Sort citations by id number
    const sortedCitations = [...citations].sort((a, b) =>
        Number(a.id.slice(1)) - Number(b.id.slice(1))
    )

    // Create a map for quick lookup
    const citationMap = new Map(sortedCitations.map(cit => [cit.id, cit]))

    // Split content by citation markers and render
    const parts: (string | JSX.Element)[] = []
    let lastIndex = 0
    const regex = /\{\{(S\d+)\}\}/g
    let match

    while ((match = regex.exec(content)) !== null) {
        // Add text before the match
        if (match.index > lastIndex) {
            parts.push(content.substring(lastIndex, match.index))
        }

        // Add the citation badge
        const citationId = match[1]
        const citation = citationMap.get(citationId)

        if (citation) {
            parts.push(
                <Tooltip key={`${citationId}-${match.index}`}>
                    <TooltipTrigger asChild>
                        <Badge
                            variant="secondary"
                            className="mx-1 relative -top-0.5 text-[10px] px-2 py-0 h-auto bg-primary/10 text-primary border-primary/20 hover:border-primary hover:bg-primary/20"
                        >
                            {citation.article}
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start" className="max-w-sm p-4 overflow-auto border-primary/50">
                        <Button
                            variant="link"
                            size="sm"
                            className="flex items-center gap-2 font-semibold text-xs mb-2 hover:underline p-0 h-6"
                            onClick={() => handleClickCitation(citation)}>
                            <BookOpenCheck className="size-4 text-primary" />
                            {citation.article}
                        </Button>
                        <p className="text-xs text-justify">{citation.quote}</p>
                    </TooltipContent>
                </Tooltip>
            )
        }

        lastIndex = regex.lastIndex
    }

    async function handleClickCitation(citation: MessageCitation) {
        console.log("handleClickCitation", projectLibraries, citation);
        const library = projectLibraries.find(pl => pl.library.documents.find(d => d.storage_file_id === citation.file_id))?.library;
        if (!library) return;
        const doc = library.documents.find(d => d.storage_file_id === citation.file_id)
        if (!doc) return;
        doc.library = library;
        console.log("doc", doc);
        setDoc(doc);
        setSearchText(citation.quote.substring(0, 50));
        setOpenPDFViewerDialog(true);
    }

    // Add remaining text after the last match
    if (lastIndex < content.length) {
        parts.push(content.substring(lastIndex))
    }

    return (
        <div className="text-foreground leading-relaxed whitespace-pre-wrap">

            {
                parts.map((part, index) => {
                    if (typeof part === 'string') {
                        return <span key={index}>{part}</span>
                    }
                    return part
                })
            }

            {/* PDF Viewer Dialog */}
            <PDFViewerDialog
                open={openPDFViewerDialog}
                onOpenChange={setOpenPDFViewerDialog}
                doc={doc}
                searchText={searchText}
            />
        </div>
    )
}

