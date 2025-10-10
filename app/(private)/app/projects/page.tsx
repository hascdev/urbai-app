"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AppTopbar } from "@/components/app-topbar"
import { formatTimeAgo } from "@/lib/mock-data"
import { Plus, Search, FolderOpen, FileText, Clock, MapPin, MoreVertical, Trash2, Share2, Archive } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useProjectStore } from "@/stores/project-store"
import { toast } from "sonner"

export default function ProjectsPage() {

	const router = useRouter()
	const [searchQuery, setSearchQuery] = useState("")
	const { projects, getProjects, removeProject } = useProjectStore()
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {

		const loadProjects = async () => {
			setIsLoading(true)
			await getProjects();
			setIsLoading(false)
		}

		loadProjects();

	}, []);

	// Filter projects based on search
	const filteredProjects = projects.filter(
		(project) =>
			project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.commune.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			project.type.name.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	const handleCreateProject = () => {
		router.push("/app/projects/new")
	}

	const handleOpenProject = (pid: string) => {
		router.push(`/app/projects/${pid}`)
	}

	const handleDeleteProject = async (pid: string) => {

		console.log("Delete project:", pid)
		const result = await removeProject(pid);
		console.log("Delete project result:", result)
		toast.success("Proyecto eliminado correctamente")
	}

	return (
		<div className="min-h-screen bg-white">
			<AppTopbar />

			<main className="max-w-7xl mx-auto px-6 py-8">
				{/* Header */}
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">Mis proyectos</h1>
						<p className="text-gray-600">Organiza y gestiona todos tus proyectos de construcción</p>
					</div>
					<Button onClick={handleCreateProject} className="bg-primary hover:bg-primary/90 text-white">
						<Plus className="mr-2 h-4 w-4" />
						Crear proyecto
					</Button>
				</div>

				{/* Search */}
				<div className="mb-6">
					<div className="relative w-full">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							placeholder="Buscar proyectos..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400"
						/>
					</div>
				</div>

				{/* Projects Grid */}
				{
					filteredProjects.length > 0 && !isLoading && (
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredProjects.map((project) => {
								return (
									<Card
										key={project.id}
										className="bg-white border-gray-200 hover:border-primary/30 transition-colors cursor-pointer group shadow-sm hover:shadow-md"
									>
										<CardHeader className="pb-3">
											<div className="flex items-start justify-between">
												<div className="flex-1 min-w-0">
													<CardTitle className="text-gray-900 text-lg mb-2 group-hover:text-primary transition-colors">
														{project.name}
													</CardTitle>
													<div className="flex items-center text-sm text-gray-600 mb-2">
														<MapPin className="h-4 w-4 mr-1" />
														{project.commune.name}
													</div>
													<Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
														{project.type.name}
													</Badge>
												</div>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
															<MoreVertical className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="bg-white border-gray-200">
														<DropdownMenuItem
															onClick={() => handleOpenProject(project.id)}
															className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50"
														>
															<FolderOpen className="mr-2 h-4 w-4" />
															Abrir proyecto
														</DropdownMenuItem>
														{/* 
													<DropdownMenuItem className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50">
														<Share2 className="mr-2 h-4 w-4" />
														Compartir
													</DropdownMenuItem>
													<DropdownMenuItem className="text-gray-900 hover:bg-gray-50 focus:bg-gray-50">
														<Archive className="mr-2 h-4 w-4" />
														Archivar
													</DropdownMenuItem> 
													*/}
														<DropdownMenuItem
															onClick={() => handleDeleteProject(project.id)}
															className="text-red-600 hover:bg-red-50 focus:bg-red-50"
														>
															<Trash2 className="mr-2 h-4 w-4" />
															Eliminar
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</CardHeader>
										<CardContent className="pt-0">
											<div className="space-y-3">
												<div className="flex items-center justify-between text-sm">
													<div className="flex items-center text-gray-600">
														<FileText className="h-4 w-4 mr-1" />
														{project.libraries.length} documento{project.libraries.length !== 1 ? "s" : ""}
													</div>
													<div className="flex items-center text-gray-600">
														<Clock className="h-4 w-4 mr-1" />
														{formatTimeAgo(project.updated_at)}
													</div>
												</div>

												{project.tags && project.tags.length > 0 && (
													<div className="flex flex-wrap gap-1">
														{project.tags.split(',').map((tag) => (
															<Badge key={tag} variant="secondary" className="bg-primary/10 text-primary text-xs">
																{tag}
															</Badge>
														))}
													</div>
												)}

												<Button
													size="sm"
													onClick={() => handleOpenProject(project.id)}
													className="w-full bg-white text-primary hover:bg-primary hover:text-white border-2 border-primary"
												>
													Abrir proyecto
												</Button>
											</div>
										</CardContent>
									</Card>
								)
							})}
						</div>
					)
				}
				{
					filteredProjects.length === 0 && !isLoading && (
						// Empty State
						<Card className="bg-white border-gray-200 border-dashed shadow-sm">
							<CardContent className="flex flex-col items-center justify-center py-16">
								<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
									<FolderOpen className="h-8 w-8 text-gray-400" />
								</div>
								<h3 className="text-lg font-semibold text-gray-900 mb-2">
									{searchQuery ? "No se encontraron proyectos" : "Aún no tienes proyectos"}
								</h3>
								<p className="text-gray-600 text-center mb-6 max-w-md">
									{searchQuery
										? "Intenta con otros términos de búsqueda"
										: "Crea tu primer proyecto y comienza a trabajar con la normativa"}
								</p>
								{!searchQuery && (
									<Button onClick={handleCreateProject} className="bg-primary hover:bg-primary/90 text-white">
										<Plus className="mr-2 h-4 w-4" />
										Crear primer proyecto
									</Button>
								)}
							</CardContent>
						</Card>
					)
				}
			</main>
		</div>
	)
}
