"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { AppTopbar } from "@/components/app-topbar"
import { ProjectLayout } from "@/components/project-layout"
import { useAuth } from "@/hooks/use-auth"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Plus, Send, MapPin, Mic, ImageIcon, Trash2, GripVertical, BarChart3, FileOutput, StickyNote, Download, Share2, Smartphone, Bot, User, ExternalLink, X, Paperclip, } from "lucide-react"
import { fetchProject } from "@/lib/project-data"
import { Library } from "@/lib/definitions"
import { Separator } from "@/components/ui/separator"
import { MobileTabNavigation } from "@/components/mobile-tab-navigation"
import { DocumentsPanel } from "@/components/documents-panel"
import { ResultsPanel } from "@/components/results-panel"
import { ChatPanel } from "@/components/chat-panel"
import { useIsMobile } from "@/hooks/use-mobile"
import { useProjectStore } from "@/stores/project-store"

interface ChatMessage {
	id: string
	role: "user" | "assistant"
	content: string
	timestamp: string
	sources?: Array<{
		docId: string
		page: number
		label: string
		excerpt: string
	}>
}

interface StudyResult {
	id: string
	type: "summary" | "concept_map" | "report" | "note"
	title: string
	content: string
	createdAt: string
}

export default function ProjectPage() {
	
	const { user } = useAuth()
	const router = useRouter()
	const params = useParams()
	const project_id = params.project_id as string

	const { project, getProject } = useProjectStore()
	const [projectLoading, setProjectLoading] = useState(true)
	const [projectError, setProjectError] = useState<string | null>(null)

	const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false)
	const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false)
	const [activeTab, setActiveTab] = useState<"documents" | "chat" | "results">("chat")
	const isMobile = useIsMobile()

	useEffect(() => {
		const loadProject = async () => {
			try {
				setProjectLoading(true)
				await getProject(project_id)
				//setActiveSources(data.project.sources?.map((s: any) => s.id) || [])
				//setChatMessages(data.project.chatHistory || [])
			} catch (error) {
				console.error("Error loading project:", error)
				setProjectError("Error al cargar el proyecto")
			} finally {
				setProjectLoading(false)
			}
		}

		if (project_id) {
			loadProject()
		}
	}, [project_id])

	if (projectLoading) {
		return (
			<div className="h-screen bg-white flex flex-col overflow-hidden">
				<AppTopbar />
				<main className="max-w-7xl mx-auto px-6 py-8">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
						<p className="text-gray-600">Cargando proyecto...</p>
					</div>
				</main>
			</div>
		)
	}

	if (projectError || !project) {
		return (
			<div className="min-h-screen bg-white">
				<AppTopbar />
				<main className="max-w-7xl mx-auto px-6 py-8">
					<div className="text-center">
						<h1 className="text-2xl font-bold text-gray-900 mb-4">{projectError || "Proyecto no encontrado"}</h1>
						<Button onClick={() => router.push("/app/projects")} variant="outline">
							Volver a proyectos
						</Button>
					</div>
				</main>
			</div>
		)
	}

	if (isMobile) {
		return (
			<div className="h-screen flex flex-col bg-background overflow-hidden">
				<MobileTabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
				<div className="flex-1 overflow-hidden min-h-0">
					{activeTab === "documents" && <DocumentsPanel isMobile />}
					{activeTab === "chat" && <ChatPanel isMobile project_id={project_id} />}
					{activeTab === "results" && <ResultsPanel isMobile project_id={project_id} />}
				</div>
			</div>
		)
	}

	return (
		<div className="h-screen bg-white flex flex-col overflow-hidden">
			<AppTopbar />
			{/* Project Header */}
			<div className="bg-gray-100 px-6 py-4 flex-shrink-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<div className="flex items-center justify-between space-x-4">
							<h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
							<Separator orientation="vertical" className="h-4" />
							<div className="flex items-center space-x-4 text-sm text-gray-600">
								<div className="flex items-center">
									<MapPin className="h-4 w-4 mr-1" />
									{project.commune.name}
								</div>
								<Badge variant="outline" className="bg-white text-gray-700 hover:border-gray-700 text-xs">
									{project.type.name}
								</Badge>
								{project.tags &&
									project.tags.split(",").map((tag: string) => (
										<Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20 text-xs hover:border-primary hover:bg-primary/10">
											{tag}
										</Badge>
									))}
							</div>
						</div>
					</div>
					<div className="flex items-center space-x-2">
						{/* <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50">
							<Share2 className="h-4 w-4 mr-2" />
							Compartir
						</Button>
						{user?.plan !== "starter" && (
							<Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50">
								<Download className="h-4 w-4 mr-2" />
								Exportar
							</Button>
						)} */}
						<Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-50">
							<Smartphone className="h-4 w-4 mr-2" />
							Continuar en WhatsApp
						</Button>
					</div>
				</div>
			</div>
			<div className="flex-1 flex overflow-hidden bg-gray-100 min-h-0">
				{/* Left Panel - Documents */}
				<div className={`${leftPanelCollapsed ? "w-[82px]" : "w-80"} transition-all duration-300 bg-gray-100 flex-shrink-0 pl-2 pr-2 pb-2 h-full`} >
					<DocumentsPanel
						collapsed={leftPanelCollapsed}
						onToggleCollapse={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
					/>
				</div>

				{/* Center Panel - Chat */}
				<div className="flex-1 min-w-0 h-full bg-gray-100 pl-2 pr-2 pb-2">
					<ChatPanel project_id={project_id} />
				</div>

				{/* Right Panel - Results */}
				<div className={`${rightPanelCollapsed ? "w-[82px]" : "w-80"} transition-all duration-300 bg-gray-100 flex-shrink-0 pl-2 pr-2 pb-2 h-full`} >
					<ResultsPanel
						collapsed={rightPanelCollapsed}
						onToggleCollapse={() => setRightPanelCollapsed(!rightPanelCollapsed)}
						project_id={project_id}
					/>
				</div>
			</div>
		</div>
	)
}
