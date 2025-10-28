"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { AppTopbar } from "@/components/app-topbar"
import { useAuth } from "@/hooks/use-auth"
import { Search, Grid3X3, List, Map, Plus, FileText, AlertTriangle, Eye, FolderPlus, Heart, MoreVertical, Calendar, MapPin, Users, X, } from "lucide-react"
import { useLibrary } from "@/hooks/use-library"
import { useLibraryFilters } from "@/hooks/use-library-filters"
import { Library, SUBSCRIPTION_PLANS_IDS } from "@/lib/definitions"
import { useProjectStore } from "@/stores/project-store"
import { createFavorite } from "@/lib/library-action"
import { toast } from "sonner"
import { ProjectSelectorDialog } from "@/components/project-selector-dialog"
import { libraryLevelColors, libraryStatusColors } from "@/lib/utils"
import { LIBRARY_TYPE_PRC } from "@/lib/constants"

type ViewMode = "grid" | "list" | "map"

interface LibraryFilters {
	search: string
	comuna: string
	type: string
	state: string
	dateFrom: string
	dateTo: string
	sortBy: string
}

// Los datos de filtros ahora se obtienen dinámicamente desde Supabase

const sortOptions = [
	{ value: "recent", label: "Más recientes" },
	{ value: "alphabetical", label: "Orden alfabético" },
	{ value: "requests", label: "Más solicitados" },
	{ value: "size", label: "Tamaño" },
	{ value: "hierarchy", label: "Jerarquía normativa" },
]

export default function LibraryPage() {

	const { user } = useAuth();
	const { libraries, refreshLibraries } = useLibrary();
	const { projects, getProjects, getProjectsByLocation, project, getProject, addLibraryToProject, addLibrariesToProject } = useProjectStore();
	const { filterData, isLoading: filtersLoading, error: filtersError } = useLibraryFilters();
	const router = useRouter()
	const searchParams = useSearchParams()
	const projectId = searchParams.get("pid") // Get project ID from URL params
	const [viewMode, setViewMode] = useState<ViewMode>("grid")
	const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])
	const [showRequestModal, setShowRequestModal] = useState(false)
	const [showProjectSelector, setShowProjectSelector] = useState(false) // Add project selector modal
	const [selectedDocForProject, setSelectedDocForProject] = useState<string | null>(null) // Track selected document
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		console.log("projectId", projectId);
		if (projectId) {
			setIsLoading(true);
			const loadProject = async () => {
				await getProject(projectId);
				setIsLoading(false);
			}
			loadProject();
		} else {
			setIsLoading(true);
			const reloadLibraries = async () => {
				await refreshLibraries();
				setIsLoading(false);
			}
			reloadLibraries();
		}
	}, [projectId])

	const [filters, setFilters] = useState<LibraryFilters>({
		search: "",
		comuna: "all",
		type: "all",
		state: "all",
		dateFrom: "",
		dateTo: "",
		sortBy: "recent",
	})

	// Filter and sort documents
	const filteredDocuments = useMemo(() => {

		let filtered = libraries;
		if (projectId && project) {
			// Filter libraries that are not in the project
			// For type_id === 5 (PRC), only show libraries from the same comuna
			filtered = libraries.filter((library) => {
				// No mostrar librerías que ya están en el proyecto
				const isNotInProject = !project.libraries.some((projectLibrary) => projectLibrary.id === library.id);
				
				// Si es type_id === 5 (PRC), además verificar que sea de la misma comuna
				if (library.type_id === 5) {
					return isNotInProject && library.location.commune_id === project.commune_id;
				}
				
				// Para otros tipos, solo verificar que no esté en el proyecto
				return isNotInProject;
			});
		}

		// Search filter
		if (filters.search) {
			const searchLower = filters.search.toLowerCase()
			filtered = filtered.filter(
				(doc) =>
					doc.name.toLowerCase().includes(searchLower) ||
					doc.type.name.toLowerCase().includes(searchLower) ||
					doc.location.name.toLowerCase().includes(searchLower),
			)
		}

		// Type filter
		if (filters.type && filters.type !== "all") {
			filtered = filtered.filter((doc) => doc.type.name === filters.type)
		}

		// Comuna filter
		if (filters.comuna && filters.comuna !== "all") {
			filtered = filtered.filter((doc) => doc.location.name.includes(filters.comuna))
		}

		// State filter
		if (filters.state && filters.state !== "all") {
			filtered = filtered.filter((doc) => doc.status.name === filters.state)
		}

		// Sort
		switch (filters.sortBy) {
			case "alphabetical":
				filtered.sort((a, b) => a.name.localeCompare(b.name))
				break
			case "requests":
				filtered.sort((a, b) => b.documents.length - a.documents.length)
				break
			case "hierarchy":
				// Don't sort here, we'll handle hierarchy display separately
				break
			case "recent":
			default:
				filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
				break
		}

		return filtered
	}, [filters, libraries, projectId, project]);

	const categorizeDocumentsByHierarchy = (libraries: Library[]) => {
		console.log("categorizeDocumentsByHierarchy", libraries);
		const hierarchy = {
			1: { title: "Constitución Política", docs: libraries.filter((library) => library.type.level_id === 1), icon: "⚖️", color: "bg-red-50 border-red-200 text-red-800" },
			2: { title: "Leyes", docs: libraries.filter((library) => library.type.level_id === 2), icon: "📜", color: "bg-orange-50 border-orange-200 text-orange-800", },
			3: { title: "Reglamentos", docs: libraries.filter((library) => library.type.level_id === 3), icon: "📋", color: "bg-yellow-50 border-yellow-200 text-yellow-800" },
			4: { title: "Planes Territoriales", docs: libraries.filter((library) => library.type.level_id === 4), icon: "🗺️", color: "bg-blue-50 border-blue-200 text-blue-800", },
			5: { title: "Normativa Administrativa", docs: libraries.filter((library) => library.type.level_id === 5), icon: "📄", color: "bg-gray-50 border-gray-200 text-gray-800" },
		}
		console.log("hierarchy", hierarchy);
		return hierarchy
	}

	const hierarchicalDocuments = useMemo(() => {
		if (filters.sortBy === "hierarchy") {
			return categorizeDocumentsByHierarchy(filteredDocuments)
		}
		return null
	}, [filteredDocuments, filters.sortBy])

	const handleDocumentSelect = (docId: string, checked: boolean) => {
		if (checked) {
			// Verificar si el documento a seleccionar es type_id === 5
			const docToSelect = libraries.find((lib) => lib.id === docId)
			if (docToSelect?.type_id === LIBRARY_TYPE_PRC) {
				// Si ya hay un documento type_id === 5 seleccionado, deseleccionarlo primero
				const currentTypeId5 = selectedDocuments.find((id) => {
					const lib = libraries.find((l) => l.id === id)
					return lib?.type_id === LIBRARY_TYPE_PRC
				})
				if (currentTypeId5) {
					// Remover el anterior type_id === 5 y agregar el nuevo
					setSelectedDocuments([...selectedDocuments.filter((id) => id !== currentTypeId5), docId])
					return
				}
			}
			setSelectedDocuments([...selectedDocuments, docId])
		} else {
			setSelectedDocuments(selectedDocuments.filter((id) => id !== docId))
		}
	}

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			// Filtrar documentos con type_id === 5
			const typeId5Docs = filteredDocuments.filter((doc) => doc.type_id === 5)
			const otherDocs = filteredDocuments.filter((doc) => doc.type_id !== 5)

			// Si hay documentos type_id === 5, solo seleccionar el primero junto con los demás
			if (typeId5Docs.length > 0) {
				setSelectedDocuments([...otherDocs.map((doc) => doc.id), typeId5Docs[0].id])
			} else {
				// Si no hay documentos type_id === 5, seleccionar todos normalmente
				setSelectedDocuments(filteredDocuments.map((doc) => doc.id))
			}
		} else {
			setSelectedDocuments([])
		}
	}

	const handleAddToProject = async (library: Library) => {

		console.log("handleAddToProject", library);

		// Add library to project from project page
		if (projectId) {
			console.log(`Adding document ${library.id} to project ${projectId}`)
			if (library) {
				await addLibraryToProject(projectId, library);
				toast.success("Documento añadido al proyecto exitosamente");
				router.push(`/app/projects/${projectId}`);
				return;
			}
		}

		// From click on add to project button in the library card
		if (library.type_id !== LIBRARY_TYPE_PRC) {
			// Show all projects for non PRC (Plan Regulador Comunal) library types
			await getProjects();
		} else {
			// Show only projects in the same comuna
			await getProjectsByLocation(library.location.commune_id);
		}

		setSelectedDocForProject(library.id);
		setShowProjectSelector(true);
	}

	const handleBulkAddToProject = async () => {

		// Get libraries to add
		const librariesToAdd = selectedDocuments.map((lid) => libraries.find((library) => library.id === lid)).filter((library) => library !== undefined);
		console.log("librariesToAdd", librariesToAdd);

		if (projectId) {
			console.log(`Adding documents ${selectedDocuments} to project ${projectId}`)
			if (librariesToAdd && librariesToAdd.length > 0) {
				await addLibrariesToProject(projectId, librariesToAdd);
				toast.success(`${selectedDocuments.length} documentos añadidos al proyecto exitosamente`);
				setSelectedDocuments([]);
				router.push(`/app/projects/${projectId}`);
				return;
			}
			return
		}

		const prcLibrary = librariesToAdd.find((library) => library?.type_id === LIBRARY_TYPE_PRC);

		if (!prcLibrary) {
			// Show all projects for non PRC (Plan Regulador Comunal) library types
			await getProjects();
		} else {
			// Show only projects in the same comuna of the PRC library
			await getProjectsByLocation(prcLibrary.location.commune_id);
		}

		setShowProjectSelector(true);
	}

	const handleProjectSelection = async (selectedProjectId: string) => {
		// From click on project button in the dialog
		console.log("handleProjectSelection", selectedProjectId);
		if (selectedDocForProject) {
			// Check if the document is already in some project
			const isDocumentInProject = projects.some((project) => project.libraries.some((library) => library.id === selectedDocForProject));
			console.log("isDocumentInProject", isDocumentInProject);
			if (isDocumentInProject) {
				toast.info("El documento ya está en el proyecto seleccionado.");
				return;
			}
			const library = libraries.find((library) => library.id === selectedDocForProject);
			if (library) {
				await addLibraryToProject(selectedProjectId, library);
				toast.success("Documento añadido al proyecto exitosamente");
				setShowProjectSelector(false)
				setSelectedDocForProject(null)
				setSelectedDocuments([])
				router.push(`/app/projects/${selectedProjectId}`);
			}
		} else if (selectedDocuments.length > 0) {
			console.log(`Adding ${selectedDocuments.length} documents to project ${selectedProjectId}`)
			const existDocumentsInProject = projects.some((project) => project.libraries.some((library) => selectedDocuments.includes(library.id)));
			if (existDocumentsInProject) {
				toast.info("Algunos documentos ya están en el proyecto seleccionado.");
				return;
			}
			const librariesToAdd = selectedDocuments.map((lid) => libraries.find((library) => library.id === lid)).filter((library) => library !== undefined);
			if (librariesToAdd && librariesToAdd.length > 0) {
				await addLibrariesToProject(selectedProjectId, librariesToAdd);
				toast.success(`${selectedDocuments.length} documentos añadidos al proyecto exitosamente`);
				setShowProjectSelector(false)
				setSelectedDocForProject(null)
				setSelectedDocuments([])
				router.push(`/app/projects/${selectedProjectId}`)
			}
		}
	}

	const handleRequestDocument = () => {
		if (user?.subscription?.plan_id === SUBSCRIPTION_PLANS_IDS.starter) {
			// Show upgrade modal for starter users
			toast.error("La función de solicitar documentos requiere plan Pro o Custom")
			return
		}
		setShowRequestModal(true)
	}

	const clearFilters = () => {
		setFilters({
			search: "",
			comuna: "all",
			type: "all",
			state: "all",
			dateFrom: "",
			dateTo: "",
			sortBy: "recent",
		})
	}

	if (isLoading) {
		return (
			<div className="h-screen bg-white flex flex-col overflow-hidden">
				<AppTopbar />
				<main className="max-w-7xl mx-auto px-6 py-8">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
						<p className="text-gray-600">Cargando...</p>
					</div>
				</main>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-white">
			<AppTopbar />

			<main className="max-w-7xl mx-auto px-6 py-8">
				{/* Header */}
				<div className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<div>
							<h1 className="text-3xl font-bold text-gray-900 mb-2">Librería normativa</h1>
							<p className="text-gray-600">Explora documentos oficiales. Lo que no encuentres, solicítalo.</p>
						</div>
						<Button onClick={handleRequestDocument} className="bg-primary hover:bg-primary/90 text-white">
							<Plus className="mr-2 h-4 w-4" />
							Solicitar documento
						</Button>
					</div>
				</div>
				{
					projectId && project && (
						<div className="mt-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
							<p className="text-sm text-primary font-medium">
								Estas agregando nuevos documentos al proyecto <span className="font-bold">{project?.name}</span>
							</p>
						</div>
					)
				}

				{/* Library Section */}
				<div className="mb-12"></div>

				{/* Filters */}
				<Card className="bg-white border-gray-200 mb-6 shadow-sm">
					<CardContent className="p-6">
						{/* Error de filtros */}
						{filtersError && (
							<div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
								<p className="text-sm text-yellow-800">
									⚠️ {filtersError}. Se están usando opciones por defecto.
								</p>
							</div>
						)}
						{/* Search and View Toggle */}
						<div className="flex flex-col lg:flex-row gap-4 mb-4">
							<div className="flex-1 relative">
								<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
								<Input
									placeholder="Buscar por comuna, tipo, nombre..."
									value={filters.search}
									onChange={(e) => setFilters({ ...filters, search: e.target.value })}
									className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
								/>
							</div>
							<div className="flex items-center space-x-2">
								<Button
									variant={viewMode === "grid" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("grid")}
									className={viewMode === "grid" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}
								>
									<Grid3X3 className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "list" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("list")}
									className={viewMode === "list" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}
								>
									<List className="h-4 w-4" />
								</Button>
								<Button
									variant={viewMode === "map" ? "default" : "ghost"}
									size="sm"
									onClick={() => setViewMode("map")}
									className={viewMode === "map" ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50"}
									disabled
								>
									<Map className="h-4 w-4" />
								</Button>
							</div>
						</div>

						{/* Filter Controls */}
						<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
							<Select value={filters.comuna} onValueChange={(value) => setFilters({ ...filters, comuna: value })}>
								<SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900">
									<SelectValue placeholder="Comuna" />
								</SelectTrigger>
								<SelectContent className="bg-white border-gray-200">
									{filtersLoading ? (
										<SelectItem value="loading" disabled className="text-gray-500">
											Cargando comunas...
										</SelectItem>
									) : (
										filterData.comunas.map((option) => (
											<SelectItem key={option.value} value={option.value} className="text-gray-900">
												{option.label}
											</SelectItem>
										))
									)}
								</SelectContent>
							</Select>

							<Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
								<SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900">
									<SelectValue placeholder="Tipo" />
								</SelectTrigger>
								<SelectContent className="bg-white border-gray-200">
									{filtersLoading ? (
										<SelectItem value="loading" disabled className="text-gray-500">
											Cargando tipos...
										</SelectItem>
									) : (
										filterData.types.map((option) => (
											<SelectItem key={option.value} value={option.value} className="text-gray-900">
												{option.label}
											</SelectItem>
										))
									)}
								</SelectContent>
							</Select>

							<Select value={filters.state} onValueChange={(value) => setFilters({ ...filters, state: value })}>
								<SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900">
									<SelectValue placeholder="Estado" />
								</SelectTrigger>
								<SelectContent className="bg-white border-gray-200">
									{filtersLoading ? (
										<SelectItem value="loading" disabled className="text-gray-500">
											Cargando estados...
										</SelectItem>
									) : (
										filterData.states.map((option) => (
											<SelectItem key={option.value} value={option.value} className="text-gray-900">
												{option.label}
											</SelectItem>
										))
									)}
								</SelectContent>
							</Select>

							<Select value={filters.sortBy} onValueChange={(value) => setFilters({ ...filters, sortBy: value })}>
								<SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900">
									<SelectValue placeholder="Ordenar por" />
								</SelectTrigger>
								<SelectContent className="bg-white border-gray-200">
									{sortOptions.map((option) => (
										<SelectItem key={option.value} value={option.value} className="text-gray-900">
											{option.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<Button
								variant="outline"
								onClick={clearFilters}
								className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
							>
								<X className="h-4 w-4 mr-2" />
								Limpiar
							</Button>

							<div className="flex items-center space-x-2">
								<Checkbox
									id="select-all"
									checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0}
									onCheckedChange={handleSelectAll}
								/>
								<label htmlFor="select-all" className="text-sm text-gray-600">
									Seleccionar todo
								</label>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Bulk Actions Bar */}
				{selectedDocuments.length > 0 && (
					<Card className="bg-primary/5 border-primary/20 mb-6">
						<CardContent className="p-4">
							<div className="flex items-center justify-between">
								<span className="text-sm text-primary font-medium">
									{selectedDocuments.length} documento{selectedDocuments.length !== 1 ? "s" : ""} seleccionado
									{selectedDocuments.length !== 1 ? "s" : ""}. Recuerda que solo puedes seleccionar un Plan Regulador Comunal (PRC) a la vez.
								</span>
								<div className="flex space-x-2">
									<Button
										size="sm"
										onClick={handleBulkAddToProject}
										className="bg-primary hover:bg-primary/90 text-white"
									>
										<FolderPlus className="h-4 w-4 mr-2" />
										{projectId ? "Añadir al proyecto" : "Añadir a proyecto"}
									</Button>
									{/* {user?.plan !== "starter" && (
										<Button
											size="sm"
											variant="outline"
											className="border-primary/30 text-primary hover:bg-primary hover:text-white bg-white"
										>
											<Download className="h-4 w-4 mr-2" />
											Descargar
										</Button>
									)} */}
									<Button
										size="sm"
										variant="ghost"
										onClick={() => setSelectedDocuments([])}
										className="text-gray-600 hover:bg-gray-50"
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Results */}
				<div className="mb-4 flex items-center justify-between">
					<p className="text-gray-600">
						{filteredDocuments.length} {filteredDocuments.length !== 1 ? "documentos encontrados" : "documento encontrado"}
					</p>
				</div>

				{/* Documents Grid/List */}
				{
					filteredDocuments.length > 0 && !isLoading && (
						filters.sortBy === "hierarchy" && hierarchicalDocuments ? (
							<div className="space-y-6">
								{/* Hierarchy explanation */}
								<div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
									<h3 className="text-sm font-semibold text-blue-900 mb-2">📚 Organización por Jerarquía Normativa</h3>
									<p className="text-xs text-blue-800 mb-2">
										Los documentos se organizan automáticamente según su rango normativo. En caso de conflicto entre
										normas, prevalece siempre la de mayor jerarquía.
									</p>
									<p className="text-xs text-blue-700">
										<strong>Orden de prevalencia:</strong> Constitución → Leyes → Reglamentos → Planes Territoriales →
										Normativa Administrativa
									</p>
								</div>

								{/* Hierarchical display */}
								{Object.entries(hierarchicalDocuments).map(([level, category]) => {
									if (category.docs.length === 0) return null

									return (
										<div key={level} className="space-y-4">
											<div className={`px-4 py-3 rounded-lg border ${category.color}`}>
												<div className="flex items-center justify-between">
													<div className="flex items-center space-x-3">
														<span className="text-lg">{category.icon}</span>
														<div>
															<h3 className="font-semibold text-sm">{category.title}</h3>
															<p className="text-xs opacity-75">Nivel {level} - Mayor jerarquía</p>
														</div>
													</div>
													<Badge variant="secondary" className="bg-white/50 text-xs">
														{category.docs.length} documento{category.docs.length !== 1 ? "s" : ""}
													</Badge>
												</div>
											</div>

											<div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4 ml-6" : "space-y-3 ml-6"} >
												{category.docs.map((library) => (
													<LibraryCard
														key={library.id}
														library={library}
														viewMode={viewMode}
														isSelected={selectedDocuments.includes(library.id)}
														onSelect={(checked) => handleDocumentSelect(library.id, checked)}
														onAddToProject={() => handleAddToProject(library)}
														onView={() => router.push(`/app/library/${library.id}`)}
														projectMode={!!projectId}
														hierarchyLevel={Number.parseInt(level)}
													/>
												))}
											</div>
										</div>
									)
								})}
							</div>
						) : (
							<div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
								{filteredDocuments.map((library) => (
									<LibraryCard
										key={library.id}
										library={library}
										viewMode={viewMode}
										isSelected={selectedDocuments.includes(library.id)}
										onSelect={(checked) => handleDocumentSelect(library.id, checked)}
										onAddToProject={() => handleAddToProject(library)}
										onView={() => router.push(`/app/library/${library.id}`)}
										projectMode={!!projectId}
									/>
								))}
							</div>
						)
					)
				}
				{
					filteredDocuments.length === 0 && !isLoading && (
						// Empty State
						<Card className="bg-white border-gray-200 border-dashed shadow-sm">
							<CardContent className="flex flex-col items-center justify-center py-16">
								<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
									<FileText className="h-8 w-8 text-gray-400" />
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">No encontramos documentos</h3>
								<p className="text-gray-600 text-center mb-6 max-w-md">
									No encontramos documentos para tu búsqueda. ¿No encontraste lo que buscas? Solicítalo aquí.
								</p>
								<Button onClick={handleRequestDocument} className="bg-primary hover:bg-primary/90 text-white">
									<Plus className="mr-2 h-4 w-4" />
									Solicitar documento
								</Button>
								{user?.subscription?.plan_id !== SUBSCRIPTION_PLANS_IDS.starter && (
									<p className="text-xs text-gray-500 mt-2">Usuarios Pro tienen prioridad en ≤48 h.</p>
								)}
							</CardContent>
						</Card>
					)
				}
			</main>

			<ProjectSelectorDialog
				open={showProjectSelector}
				onOpenChange={setShowProjectSelector}
				projects={projects}
				selectedDocForProject={selectedDocForProject}
				handleProjectSelection={handleProjectSelection}
			/>
		</div>
	)
}

interface LibraryCardProps {
	library: Library
	viewMode: ViewMode
	isSelected: boolean
	onSelect: (checked: boolean) => void
	onAddToProject: () => void
	onView: () => void
	projectMode?: boolean
	hierarchyLevel?: number
}

function LibraryCard({
	library,
	viewMode,
	isSelected,
	onSelect,
	onAddToProject,
	onView,
	projectMode,
	hierarchyLevel,
}: LibraryCardProps) {

	const [isFavorite, setIsFavorite] = useState(false);

	useEffect(() => {
		setIsFavorite(library.favorites.some((favorite) => favorite.library_id === library.id));
	}, [library.id]);

	const handleUpdateFavorite = async () => {
		setIsFavorite(!isFavorite);
		createFavorite({ library_id: library.id, favorite: !isFavorite });
	};

	const getHierarchyIndicator = (level?: number) => {
		if (!level) return null

		const indicators = {
			1: { icon: "⚖️", label: "Constitución", color: "bg-red-100 text-red-800 border-red-200" },
			2: { icon: "📜", label: "Ley", color: "bg-orange-100 text-orange-800 border-orange-200" },
			3: { icon: "📋", label: "Reglamento", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
			4: { icon: "🗺️", label: "Plan Territorial", color: "bg-blue-100 text-blue-800 border-blue-200" },
			5: { icon: "📄", label: "Normativa Admin.", color: "bg-gray-100 text-gray-800 border-gray-200" },
		}

		const indicator = indicators[level as keyof typeof indicators]
		if (!indicator) return null

		return (
			<Badge className={`text-xs border ${indicator.color} mb-2`}>
				{indicator.icon} {indicator.label}
			</Badge>
		)
	}

	if (viewMode === "list") {
		return (
			<Card className="bg-white border-gray-200 hover:border-primary/30 transition-colors shadow-sm">
				<CardContent className="p-4">
					<div className="flex items-center space-x-4">
						<Checkbox checked={isSelected} onCheckedChange={onSelect} />
						<div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
							<FileText className="h-6 w-6 text-gray-400" />
						</div>
						<div className="flex-1 min-w-0">
							{getHierarchyIndicator(hierarchyLevel)}
							<h4 className="font-medium text-gray-900 mb-1 truncate">{document.title}</h4>
							<div className="flex items-center gap-2 mb-2">
								<Badge className={`text-xs border ${libraryLevelColors[library.type.level_id as keyof typeof libraryLevelColors]}`}>{library.type.name}</Badge>
								<Badge className={`text-xs ${libraryStatusColors[library.status.name as keyof typeof libraryStatusColors]}`}>{library.status.name}</Badge>
								<span className="text-xs text-gray-500">{library.documents.length} {library.documents.length !== 1 ? "documentos" : "documento"}</span>
							</div>
							<div className="flex items-center text-xs text-gray-500">
								<MapPin className="h-3 w-3 mr-1" />
								{library.location.name}
								{/* <Users className="h-3 w-3 ml-3 mr-1" />
								Solicitado 0 veces */}
								<Calendar className="h-3 w-3 ml-3 mr-1" />
								{library.date}
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={handleUpdateFavorite}
								className="text-gray-400 hover:bg-gray-50"
							>
								<Heart className={`h-4 w-4 ${isFavorite ? "fill-red-400 text-red-400" : ""}`} />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={onView}
								className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
							>
								<Eye className="h-4 w-4 mr-2" />
								Abrir
							</Button>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-50">
										<MoreVertical className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="bg-white border-gray-200">
									<DropdownMenuItem
										onClick={onAddToProject}
										className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
									>
										<FolderPlus className="mr-2 h-4 w-4" />
										{projectMode ? "Añadir al proyecto" : "Añadir a proyecto"}
									</DropdownMenuItem>
									<DropdownMenuItem className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50">
										<AlertTriangle className="mr-2 h-4 w-4" />
										Reportar error
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className="bg-white border-gray-200 hover:border-primary/30 transition-colors shadow-sm">
			<CardContent className="p-4">
				<div className="flex items-center justify-between mb-3">
					<Checkbox checked={isSelected} onCheckedChange={onSelect} />
					<Button
						variant="ghost"
						size="sm"
						onClick={handleUpdateFavorite}
						className="text-gray-400 hover:bg-gray-50 p-1"
					>
						<Heart className={`h-4 w-4 ${isFavorite ? "fill-red-400 text-red-400" : ""}`} />
					</Button>
				</div>

				<div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
					<FileText className="h-6 w-6 text-gray-400" />
				</div>

				{getHierarchyIndicator(hierarchyLevel)}

				<h4 className="font-medium text-gray-900 mb-2 text-sm line-clamp-2 min-h-[2.5rem]">{library.name}</h4>

				<div className="flex flex-wrap gap-1 mb-3">
					<Badge className={`text-xs border ${libraryLevelColors[library.type.level_id as keyof typeof libraryLevelColors]}`}>{library.type.name}</Badge>
					<Badge className={`text-xs ${libraryStatusColors[library.status.name as keyof typeof libraryStatusColors]}`}>{library.status.name}</Badge>
				</div>

				<div className="space-y-1 mb-4 text-xs text-gray-500">
					<div className="flex items-center">
						<MapPin className="h-3 w-3 mr-1" />
						{library.location.name}
					</div>
					<div className="flex items-center">
						<FileText className="h-3 w-3 mr-1" />
						{library.documents.length} {library.documents.length !== 1 ? "documentos" : "documento"}
					</div>
					{/* 
					<div className="flex items-center">
						<Users className="h-3 w-3 mr-1" />
						Solicitado 0 veces
					</div>
					*/}
					<div className="flex items-center">
						<Calendar className="h-3 w-3 mr-1" />
						{library.date}
					</div>
				</div>

				<div className="space-y-2">
					<Button size="sm" onClick={onView} className="w-full bg-primary hover:bg-primary/90 text-white">
						<Eye className="h-4 w-4 mr-2" />
						Abrir
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={onAddToProject}
						className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white bg-white"
					>
						<FolderPlus className="h-4 w-4 mr-2" />
						{projectMode ? "Añadir al proyecto" : "Añadir a proyecto"}
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
