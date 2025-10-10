// Mock data for development
export interface Project {
  id: string
  name: string
  comuna: string
  type: "Vivienda" | "Equipamiento" | "Comercio" | "Espacio público" | "Otro"
  sources: string[]
  createdAt: string
  updatedAt: string
  tags?: string[]
}

export interface Document {
  id: string
  title: string
  type: "PRC" | "OGUC" | "Circular DDU" | "Ordenanza" | "Jurisprudencia" | "Límites Urbanos"
  comunas: string[]
  updatedAt: string
  pages: number
  size: string
  requestsCount: number
  state: "Actualizado" | "Obsoleto" | "En revisión"
  sourceUrl: string
}

export interface Activity {
  id: string
  type: "document_added" | "response_marked" | "request_sent" | "project_created"
  description: string
  timestamp: string
  projectId?: string
}

// Mock projects
export const mockProjects: Project[] = [
  {
    id: "p_1",
    name: "Vivienda Las Rosas",
    comuna: "Providencia",
    type: "Vivienda",
    sources: ["d_prc_providencia", "d_oguc"],
    createdAt: "2025-09-01T10:00:00Z",
    updatedAt: "2025-09-03T15:30:00Z",
    tags: ["unifamiliar", "zona R3"],
  },
  {
    id: "p_2",
    name: "Centro Comercial Norte",
    comuna: "Las Condes",
    type: "Comercio",
    sources: ["d_prc_lascondes", "d_oguc", "d_circular_458"],
    createdAt: "2025-08-28T14:20:00Z",
    updatedAt: "2025-09-02T09:15:00Z",
    tags: ["retail", "estacionamientos"],
  },
  {
    id: "p_3",
    name: "Plaza Vecinal Maipú",
    comuna: "Maipú",
    type: "Espacio público",
    sources: ["d_prc_maipu"],
    createdAt: "2025-08-25T11:45:00Z",
    updatedAt: "2025-08-30T16:20:00Z",
    tags: ["áreas verdes", "equipamiento"],
  },
]

// Mock documents
export const mockDocuments: Document[] = [
  {
    id: "d_prc_providencia",
    title: "Plan Regulador Comunal de Providencia",
    type: "PRC",
    comunas: ["Providencia"],
    updatedAt: "2024-06-01",
    pages: 240,
    size: "12.4 MB",
    requestsCount: 37,
    state: "Actualizado",
    sourceUrl: "https://example.gov/prc-providencia.pdf",
  },
  {
    id: "d_oguc",
    title: "Ordenanza General de Urbanismo y Construcciones",
    type: "OGUC",
    comunas: ["Nacional"],
    updatedAt: "2024-08-15",
    pages: 450,
    size: "28.7 MB",
    requestsCount: 156,
    state: "Actualizado",
    sourceUrl: "https://example.gov/oguc.pdf",
  },
  {
    id: "d_prc_lascondes",
    title: "Plan Regulador Comunal de Las Condes",
    type: "PRC",
    comunas: ["Las Condes"],
    updatedAt: "2024-07-20",
    pages: 180,
    size: "9.8 MB",
    requestsCount: 42,
    state: "Actualizado",
    sourceUrl: "https://example.gov/prc-lascondes.pdf",
  },
  {
    id: "d_circular_458",
    title: "Circular DDU N° 458",
    type: "Circular DDU",
    comunas: ["Nacional"],
    updatedAt: "2024-09-01",
    pages: 15,
    size: "1.2 MB",
    requestsCount: 89,
    state: "Actualizado",
    sourceUrl: "https://example.gov/circular-458.pdf",
  },
  {
    id: "d_prc_maipu",
    title: "Plan Regulador Comunal de Maipú",
    type: "PRC",
    comunas: ["Maipú"],
    updatedAt: "2024-05-10",
    pages: 320,
    size: "18.5 MB",
    requestsCount: 23,
    state: "Actualizado",
    sourceUrl: "https://example.gov/prc-maipu.pdf",
  },
  {
    id: "d_circular_337",
    title: "Circular DDU N° 337",
    type: "Circular DDU",
    comunas: ["Nacional"],
    updatedAt: "2024-08-28",
    pages: 8,
    size: "0.8 MB",
    requestsCount: 67,
    state: "Actualizado",
    sourceUrl: "https://example.gov/circular-337.pdf",
  },
]

// Mock activities
export const mockActivities: Activity[] = [
  {
    id: "a_1",
    type: "document_added",
    description: "Agregaste OGUC al proyecto Vivienda Las Rosas",
    timestamp: "2025-09-03T15:30:00Z",
    projectId: "p_1",
  },
  {
    id: "a_2",
    type: "response_marked",
    description: "Marcaste una respuesta como aprobada en Centro Comercial Norte",
    timestamp: "2025-09-02T14:20:00Z",
    projectId: "p_2",
  },
  {
    id: "a_3",
    type: "request_sent",
    description: "Solicitaste el Plan Regulador de Ñuñoa",
    timestamp: "2025-09-02T09:15:00Z",
  },
  {
    id: "a_4",
    type: "project_created",
    description: "Creaste el proyecto Plaza Vecinal Maipú",
    timestamp: "2025-08-25T11:45:00Z",
    projectId: "p_3",
  },
  {
    id: "a_5",
    type: "document_added",
    description: "Agregaste Circular DDU N° 458 al proyecto Centro Comercial Norte",
    timestamp: "2025-08-24T16:30:00Z",
    projectId: "p_2",
  },
]

// Helper functions
export const getProjectById = (id: string): Project | undefined => {
  return mockProjects.find((p) => p.id === id)
}

export const getDocumentById = (id: string): Document | undefined => {
  return mockDocuments.find((d) => d.id === id)
}

export const getDocumentsByIds = (ids: string[]): Document[] => {
  return mockDocuments.filter((d) => ids.includes(d.id))
}

export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Hace menos de 1 hora"
  if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`

  const diffInWeeks = Math.floor(diffInDays / 7)
  return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? "s" : ""}`
}
