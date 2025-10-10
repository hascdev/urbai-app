"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AppTopbar } from "@/components/app-topbar"
import { useAuth } from "@/hooks/use-auth"
import { formatTimeAgo } from "@/lib/mock-data"
import { Plus, BookOpen, FolderOpen, FileText, Clock, MapPin, Users } from "lucide-react"
import { useProjectStore } from "@/stores/project-store"

export default function DashboardPage() {

	const { user } = useAuth()
	const router = useRouter()
	const [selectedFilter, setSelectedFilter] = useState("Todos")
	const [isLoading, setIsLoading] = useState(true)

	const { projects, getLastProjects } = useProjectStore();

	useEffect(() => {
		const loadProjects = async () => {
			await getLastProjects()
			setIsLoading(false)
		}
		loadProjects()
	}, []);

	const handleCreateProject = () => {
		router.push("/app/projects/new")
	}

	const handleExploreLibrary = () => {
		router.push("/app/library")
	}

	const handleOpenProject = (projectId: string) => {
		router.push(`/app/projects/${projectId}`)
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
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">Hola 👋</h1>
						<p className="text-gray-600">Bienvenido de vuelta, {user?.name}. Continúa donde lo dejaste.</p>
					</div>
					<div className="flex space-x-3">
						<Button
							variant="outline"
							onClick={handleExploreLibrary}
							className="border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
						>
							<BookOpen className="mr-2 h-4 w-4" />
							Librería
						</Button>
						<Button onClick={handleCreateProject} className="bg-primary hover:bg-primary/90 text-white">
							<Plus className="mr-2 h-4 w-4" />
							Crear proyecto
						</Button>
					</div>
				</div>

				<div className="grid lg:grid-cols-3 gap-8">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						{/* Featured Projects Section */}
						{/* {
						projects.length > 0 && (
							<section>
								<div className="flex items-center mb-6">
									<Star className="h-5 w-5 text-primary mr-2" />
									<h2 className="text-xl font-semibold text-gray-900">Mis proyectos destacados</h2>
								</div>
								<div className="grid md:grid-cols-2 gap-6">
									{projects.map((project) => {										
										return (
											<Card
												key={project.id}
												className="bg-white border-gray-200 hover:border-primary/30 transition-colors cursor-pointer group shadow-sm hover:shadow-md"
												onClick={() => handleOpenProject(project.id)}
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
														<Star className="h-4 w-4 text-primary fill-primary" />
													</div>
												</CardHeader>
												<CardContent className="pt-0">
													<div className="flex items-center justify-between text-sm mb-4">
														<div className="flex items-center text-gray-600">
															<FileText className="h-4 w-4 mr-1" />
															{project.libraries.length} documento{project.libraries.length !== 1 ? "s" : ""}
														</div>
														<div className="flex items-center text-gray-600">
															<Clock className="h-4 w-4 mr-1" />
															{formatTimeAgo(project.updated_at)}
														</div>
													</div>
													<Button
														size="sm"
														className="w-full bg-white text-primary hover:bg-primary hover:text-white border-2 border-primary"
														onClick={(e) => {
															e.stopPropagation()
															handleOpenProject(project.id)
														}}
													>
														Abrir proyecto
													</Button>
												</CardContent>
											</Card>
										)
									})}
								</div>
							</section>
							)
						}*/}

						{/* Recent Projects Section */}
						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-6">Proyectos recientes</h2>

							{
								projects.length > 0 && !isLoading && (
									<div className="grid md:grid-cols-2 gap-6">
										{
											projects.map((project) => {

												return (
													<Card key={project.id} className="bg-white border-gray-200 hover:border-primary/30 transition-colors group shadow-sm" >
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
															</div>
														</CardHeader>
														<CardContent className="pt-0">
															<div className="flex items-center justify-between text-sm mb-4">
																<div className="flex items-center text-gray-600">
																	<FileText className="h-4 w-4 mr-1" />
																	{project.libraries.length} documento{project.libraries.length !== 1 ? "s" : ""}
																</div>
																<div className="flex items-center text-gray-600">
																	<Clock className="h-4 w-4 mr-1" />
																	{formatTimeAgo(project.updated_at)}
																</div>
															</div>
															<Button
																size="sm"
																className="w-full bg-white text-primary hover:bg-primary hover:text-white border-2 border-primary"
																onClick={(e) => {
																	e.stopPropagation()
																	handleOpenProject(project.id)
																}}
															>
																Abrir proyecto
															</Button>
														</CardContent>
													</Card>
												)
											})
										}
										<Card className="bg-white border-gray-200 border-dashed hover:border-primary/30 transition-colors cursor-pointer group shadow-sm" onClick={handleCreateProject}>
											<CardContent className="flex flex-col items-center justify-center py-12">
												<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
													<FolderOpen className="h-8 w-8 text-gray-400 group-hover:text-primary transition-colors" />
												</div>
												<h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">Crear proyecto</h3>
											</CardContent>
										</Card>
									</div>
								)
							}
							{
								projects.length === 0 && !isLoading && (

									// Empty state
									<Card className="bg-white border-gray-200 border-dashed shadow-sm">
										<CardContent className="flex flex-col items-center justify-center py-12">
											<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
												<FolderOpen className="h-8 w-8 text-gray-400" />
											</div>
											<h3 className="text-lg font-semibold text-gray-900 mb-2">Aún no tienes proyectos</h3>
											<p className="text-gray-600 text-center mb-6 max-w-md">
												Crea uno y comienza a conversar con la normativa. Agrega fuentes desde la Librería y escribe tu
												primera pregunta.
											</p>
											<Button onClick={handleCreateProject} className="bg-primary hover:bg-primary/90 text-white">
												<Plus className="mr-2 h-4 w-4" />
												Crear primer proyecto
											</Button>
										</CardContent>
									</Card>
								)
							}
						</section>

						{/* Featured Library Section */}
						{/* 
						<section>
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-xl font-semibold text-gray-900">Librería destacada</h2>
								<Button
									variant="ghost"
									size="sm"
									onClick={handleExploreLibrary}
									className="text-primary hover:bg-primary/10"
								>
									Ver todo
								</Button>
							</div>

							<div className="flex flex-wrap gap-2 mb-6">
								{filterOptions.map((filter) => (
									<Button
										key={filter}
										variant={selectedFilter === filter ? "default" : "outline"}
										size="sm"
										onClick={() => setSelectedFilter(filter)}
										className={
											selectedFilter === filter
												? "bg-primary text-white hover:bg-primary/90"
												: "border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
										}
									>
										{filter}
									</Button>
								))}
							</div>

							<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
								{filteredDocuments.map((doc) => (
									<Card
										key={doc.id}
										className="bg-white border-gray-200 hover:border-primary/30 transition-colors shadow-sm hover:shadow-md"
									>
										<CardContent className="p-4">
											<div className="flex items-start justify-between mb-3">
												<div className="flex-1 min-w-0">
													<h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">{doc.title}</h4>
													<div className="flex items-center gap-2 mb-2">
														<Badge className={`text-xs border ${documentTypeColors[doc.type]}`}>{doc.type}</Badge>
														<span className="text-xs text-gray-500">{doc.pages} pág.</span>
													</div>
													<p className="text-xs text-gray-500">{doc.comunas.join(", ")}</p>
												</div>
											</div>
											<Button
												size="sm"
												variant="outline"
												className="w-full border-primary/30 text-primary hover:bg-primary hover:text-white bg-white"
												onClick={() => handleAddToProject(doc.id)}
											>
												Añadir a proyecto
											</Button>
										</CardContent>
									</Card>
								))}
							</div>
						</section> 
						*/}
					</div>

					{/* Sidebar */}
					<div className="space-y-8">
						<section>
							<h2 className="text-xl font-semibold text-gray-900 mb-6">&nbsp;</h2>
							<Card className="bg-white border-primary/30 min-h-56">
								<CardHeader className="pb-3">
									<CardTitle className="text-gray-900 text-lg mb-2">
										Resumen
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6 flex flex-col justify-center">
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<Users className="h-4 w-4 text-primary mr-2" />
											<span className="text-sm text-gray-600">Plan actual</span>
										</div>
										<Badge className="bg-primary/10 text-primary border-primary/20 text-xs hover:border-primary hover:bg-primary/10">
											{user?.subscription?.plan?.name?.toUpperCase()}
										</Badge>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<FolderOpen className="h-4 w-4 text-primary mr-2" />
											<span className="text-sm text-gray-600">Proyectos activos</span>
										</div>
										<Badge variant="outline" className="bg-gray-100 text-gray-700 hover:border-gray-500 hover:bg-gray-100 text-xs">
											{projects.length}
										</Badge>
									</div>
									<div className="flex items-center justify-between">
										<div className="flex items-center">
											<FileText className="h-4 w-4 text-primary mr-2" />
											<span className="text-sm text-gray-600">Documentos usados</span>
										</div>
										<Badge variant="outline" className="bg-gray-100 text-gray-700 hover:border-gray-500 hover:bg-gray-100 text-xs">
											{new Set(projects.flatMap((p) => p.libraries)).size}
										</Badge>
									</div>
								</CardContent>
							</Card>
						</section>
					</div>
				</div>
			</main>
		</div>
	)
}
