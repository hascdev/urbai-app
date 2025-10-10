"use client"

import { useState, useEffect, useRef } from "react"
import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core"
import { searchPlugin } from "@react-pdf-viewer/search"
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"
import type { ToolbarProps, ToolbarSlot } from '@react-pdf-viewer/toolbar';

import "@react-pdf-viewer/core/lib/styles/index.css"
import "@react-pdf-viewer/search/lib/styles/index.css"
import "@react-pdf-viewer/default-layout/lib/styles/index.css"


interface PDFViewerProps {
    pdfUrl: string
    searchText?: string
}

export function PDFViewer({ pdfUrl, searchText }: PDFViewerProps) {

    const [isDocumentLoaded, setDocumentLoaded] = useState(false);
    const hasSearched = useRef(false);

    const renderToolbar = (Toolbar: (props: ToolbarProps) => React.ReactElement) => (
        <Toolbar>
            {(props: ToolbarSlot) => {
                const {
                    CurrentPageInput,
                    Download,
                    GoToNextPage,
                    GoToPreviousPage,
                    NumberOfPages,
                    Print,
                    ShowSearchPopover,
                    Zoom,
                    ZoomIn,
                    ZoomOut,
                } = props;
                return (
                    <div style={{ alignItems: 'center', display: 'flex', width: '100%', height: '32px' }} >
                        <div style={{ padding: '0px 2px', height: '32px' }}>
                            <ShowSearchPopover />
                        </div>
                        <div style={{ padding: '0px 2px', height: '32px' }}>
                            <GoToPreviousPage />
                        </div>
                        <div style={{ padding: '0px 2px', width: '4rem', height: '32px' }}>
                            <CurrentPageInput />
                        </div>
                        <div style={{ padding: '0px 2px' }}>
                            <span style={{ marginLeft: '4px' }}>de</span> <NumberOfPages />
                        </div>
                        <div style={{ padding: '0px 2px', height: '32px' }}>
                            <GoToNextPage />
                        </div>
                        <div style={{ padding: '0px 2px', marginLeft: 'auto', height: '32px' }}>
                            <ZoomOut />
                        </div>
                        <div style={{ padding: '0px 2px', height: '32px' }}>
                            <Zoom />
                        </div>
                        <div style={{ padding: '0px 2px', height: '32px' }}>
                            <ZoomIn />
                        </div>
                        <div style={{ padding: '0px 2px', marginLeft: 'auto', height: '32px' }}>
                            <Download />
                        </div>
                        <div style={{ padding: '0px 2px', height: '32px' }}>
                            <Print />
                        </div>
                    </div>
                );
            }}
        </Toolbar>
    )

    const defaultLayoutPluginInstance = defaultLayoutPlugin({
        sidebarTabs: (defaultTabs) => [],
        renderToolbar,
    });

    const searchPluginInstance = searchPlugin()
    const { highlight } = searchPluginInstance

    const handleDocumentLoad = () => {
        console.log("Document loaded successfully")
        setDocumentLoaded(true)
    }

    useEffect(() => {
        if (isDocumentLoaded && searchText && !hasSearched.current) {
            hasSearched.current = true
            console.log("Starting search for:", searchText)
            highlight({
                keyword: searchText,
                matchCase: false,
            })
        }
    }, [isDocumentLoaded, searchText, highlight])

    return (
        <div className="h-full w-full overflow-hidden py-1">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                    fileUrl={pdfUrl}
                    plugins={[searchPluginInstance, defaultLayoutPluginInstance]}
                    defaultScale={SpecialZoomLevel.PageWidth}
                    onDocumentLoad={handleDocumentLoad}
                />
            </Worker>
        </div>
    )
}
