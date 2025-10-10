import { type NextRequest, NextResponse } from "next/server"

const mockProjects = [
  {
    id: "proj_1",
    name: "Proyecto Residencial Las Condes",
    comuna: "Las Condes",
    sources: 8,
    lastActivity: "2024-01-15T10:30:00Z",
    status: "active",
    createdAt: "2024-01-10T09:00:00Z",
    description: "Desarrollo residencial de 120 unidades",
  },
  {
    id: "proj_2",
    name: "Centro Comercial Providencia",
    comuna: "Providencia",
    sources: 12,
    lastActivity: "2024-01-14T16:45:00Z",
    status: "active",
    createdAt: "2024-01-08T14:20:00Z",
    description: "Centro comercial de 3 pisos con estacionamientos",
  },
  {
    id: "proj_3",
    name: "Edificio Corporativo Vitacura",
    comuna: "Vitacura",
    sources: 5,
    lastActivity: "2024-01-12T11:15:00Z",
    status: "draft",
    createdAt: "2024-01-05T08:30:00Z",
    description: "Torre corporativa de 25 pisos",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const status = searchParams.get("status")

  let filteredProjects = mockProjects
  if (status) {
    filteredProjects = mockProjects.filter((p) => p.status === status)
  }

  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({
    projects: filteredProjects.slice(0, limit),
    total: filteredProjects.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { name, comuna, type, description, tags, docId } = await request.json()

    const newProject = {
      id: `proj_${Date.now()}`,
      name,
      comuna,
      type: type || "",
      description: description || "",
      tags: tags || "",
      docId: docId || null,
      sources: 0,
      lastActivity: new Date().toISOString(),
      status: "draft",
      createdAt: new Date().toISOString(),
    }

    await new Promise((resolve) => setTimeout(resolve, 800))

    return NextResponse.json({
      success: true,
      project: newProject,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error creando proyecto" }, { status: 400 })
  }
}
