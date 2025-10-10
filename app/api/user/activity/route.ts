import { type NextRequest, NextResponse } from "next/server"

const mockActivity = [
  {
    id: "act_1",
    type: "project_created",
    title: "Creaste el proyecto 'Residencial Las Condes'",
    timestamp: "2024-01-15T10:30:00Z",
    projectId: "proj_1",
  },
  {
    id: "act_2",
    type: "document_added",
    title: "Añadiste 'Plan Regulador Las Condes 2023' al proyecto",
    timestamp: "2024-01-15T09:45:00Z",
    projectId: "proj_1",
  },
  {
    id: "act_3",
    type: "chat_message",
    title: "Consultaste sobre alturas máximas permitidas",
    timestamp: "2024-01-14T16:20:00Z",
    projectId: "proj_1",
  },
  {
    id: "act_4",
    type: "study_generated",
    title: "Generaste un resumen normativo",
    timestamp: "2024-01-14T15:30:00Z",
    projectId: "proj_1",
  },
  {
    id: "act_5",
    type: "document_viewed",
    title: "Revisaste 'Ordenanza General de Urbanismo'",
    timestamp: "2024-01-14T14:15:00Z",
    projectId: "proj_2",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "5")

  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json({
    activities: mockActivity.slice(0, limit),
    total: mockActivity.length,
  })
}
