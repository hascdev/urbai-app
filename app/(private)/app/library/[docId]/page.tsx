"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AppTopbar } from "@/components/app-topbar"
import { ArrowLeft, FolderPlus, Calendar, MapPin, MessageSquare } from "lucide-react"
import { useLibraryStore } from "@/stores/library-store"
import { PDFViewer } from "@/components/pdf-viewer"
import { ProjectSelectorDialog } from "@/components/project-selector-dialog"
import { useProjectStore } from "@/stores/project-store"
import { toast } from "sonner"
import { libraryLevelColors, libraryStatusColors } from "@/lib/utils"

export default function DocumentDetailPage() {

	const router = useRouter()
	const params = useParams()
	const docId = params.docId as string
	const { projects, getProjects, addLibraryToProject } = useProjectStore();
	const { library, getLibrary } = useLibraryStore();
	const [isLoading, setIsLoading] = useState(false);
	const [showProjectSelector, setShowProjectSelector] = useState(false);

	useEffect(() => {
		const fetchInitalData = async () => {
			setIsLoading(true);
			await getLibrary(docId);
			setIsLoading(false);
		}
		fetchInitalData();
	}, [docId]);

	const handleStartChat = () => {
		router.push(`/app/projects/new?docId=${docId}`);
	}

	const handleAddToProject = async () => {
		await getProjects();
		setShowProjectSelector(true)
	}

	const handleProjectSelection = async (pid: string) => {

		if (library) {

			// Check if the document is already in some project
			const isDocumentInProject = projects.some((project) => project.libraries.some((lib) => lib.id === library.id));
			console.log("isDocumentInProject", isDocumentInProject);
			if (isDocumentInProject) {
				toast.info("El documento ya está en el proyecto seleccionado.");
				return;
			}

			await addLibraryToProject(pid, library);
			toast.success("Documento añadido al proyecto exitosamente");
			setShowProjectSelector(false)
			router.push(`/app/projects/${pid}`);
		}
	}

	if (isLoading) {
		return (
			<div className="h-screen bg-white flex flex-col overflow-hidden">
				<AppTopbar />
				<main className="max-w-7xl mx-auto px-6 py-8">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
						<p className="text-gray-600">Cargando documento...</p>
					</div>
				</main>
			</div>
		)
	}

	if (!library) {
		return (
			<div className="min-h-screen bg-white">
				<AppTopbar />
				<main className="max-w-7xl mx-auto px-6 py-8">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-900 mb-4">Documento no encontrado</h1>
						<Button onClick={() => router.back()} variant="outline" className="border-gray-200 text-gray-700">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Volver
						</Button>
					</div>
				</main>
			</div>
		)
	}

	const document = library.documents[0];

	return (
		<div className="min-h-screen bg-white">
			<AppTopbar />

			<main className="max-w-7xl mx-auto px-6 py-8">
				{/* Header */}
				<div className="flex items-center mb-6">
					<Button variant="ghost" onClick={() => router.back()} className="text-gray-600 hover:bg-gray-50 mr-4">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Volver a la librería
					</Button>
				</div>

				{/* Document Header */}
				<Card className="bg-white border-gray-200 mb-6 shadow-sm">
					<CardHeader>
						<div className="flex items-center justify-between gap-4">
							<div className="flex-1">
								<div className="flex flex-wrap gap-2 mb-4">
									<Badge className={`text-xs border ${libraryLevelColors[library.type.level_id as keyof typeof libraryLevelColors]}`}>{library.type.name}</Badge>
									<Badge className={`text-xs ${libraryStatusColors[library.status.name as keyof typeof libraryStatusColors]}`}>{library.status.name}</Badge>
									<Badge variant="secondary" className="bg-gray-100 text-gray-700">
										{document.pages} páginas
									</Badge>
								</div>
								<CardTitle className="text-2xl text-gray-900 mb-4">{library.name}</CardTitle>
								<div className="flex flex-wrap gap-4 text-sm text-gray-600">
									<div className="flex items-center">
										<MapPin className="h-4 w-4 mr-2" />
										{library.location.name}
									</div>
									<div className="flex items-center">
										<Calendar className="h-4 w-4 mr-2" />
										Actualizado: {library.date}
									</div>
								</div>
							</div>

							{/* Actions */}
							<div className="flex flex-col justify-center gap-2">
								<Button
									onClick={handleAddToProject}
									className="bg-primary hover:bg-primary/90 text-white">
									<FolderPlus className="mr-2 h-4 w-4" />
									Añadir a proyecto
								</Button>
								<Button
									variant="outline"
									onClick={handleStartChat}
									className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white bg-white"
								>
									<MessageSquare className="mr-2 h-4 w-4" />
									Iniciar consulta con este documento
								</Button>

								{/* <Button variant="ghost" className="w-full text-gray-600 hover:bg-gray-50 justify-start">
									<AlertTriangle className="mr-2 h-4 w-4" />
									Reportar inconsistencia
								</Button> */}
							</div>
						</div>
					</CardHeader>
				</Card>

				{/* PDF Viewer */}
				<div className="h-screen">
					<PDFViewer pdfUrl={document.url} />
				</div>

			</main>

			<ProjectSelectorDialog
				open={showProjectSelector}
				onOpenChange={setShowProjectSelector}
				projects={projects}
				selectedDocForProject={document.id}
				handleProjectSelection={handleProjectSelection}
			/>
		</div>
	)
}
