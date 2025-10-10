import { type NextRequest, NextResponse } from "next/server"

const mockHerramientas = [
  {
    id: "herramienta_1",
    type: "summary",
    title: "Resumen Normativo - Proyecto Las Condes",
    projectId: "proj_1",
    status: "completed",
    createdAt: "2024-01-14T15:30:00Z",
    content: {
      summary: "Análisis completo de las normativas aplicables al proyecto residencial en Las Condes.",
      keyPoints: [
        "Altura máxima: 4 pisos (14m)",
        "Coeficiente de constructibilidad: 1.8",
        "Superficie mínima de áreas verdes: 20%",
        "Estacionamientos requeridos: 1 por cada 2 unidades",
      ],
    },
  },
  {
    id: "herramienta_2",
    type: "concept_map",
    title: "Mapa Conceptual - Normativas Urbanas",
    projectId: "proj_1",
    status: "processing",
    createdAt: "2024-01-15T09:15:00Z",
    content: null,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get("projectId")

  let filteredHerramientas = mockHerramientas
  if (projectId) {
    filteredHerramientas = mockHerramientas.filter((h) => h.projectId === projectId)
  }

  await new Promise((resolve) => setTimeout(resolve, 400))

  return NextResponse.json({
    herramientas: filteredHerramientas,
    total: filteredHerramientas.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { type, projectId, title } = await request.json()

    const newHerramienta = {
      id: `herramienta_${Date.now()}`,
      type,
      title: title || `Nueva ${type}`,
      projectId,
      status: "processing",
      createdAt: new Date().toISOString(),
      content: null,
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return NextResponse.json({
      success: true,
      herramienta: newHerramienta,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error creando herramienta" }, { status: 400 })
  }
}
