import { type NextRequest, NextResponse } from "next/server"

const mockDocuments = [
  {
    id: "doc_1",
    title: "Plan Regulador Las Condes 2023",
    type: "Normativa Municipal",
    comuna: "Las Condes",
    estado: "Vigente",
    fecha: "2023-12-15",
    description: "Plan regulador actualizado para la comuna de Las Condes con nuevas zonificaciones residenciales.",
    tags: ["residencial", "zonificación", "alturas"],
    url: "/documents/plan-regulador-las-condes-2023.pdf",
  },
  {
    id: "doc_2",
    title: "Ordenanza General de Urbanismo y Construcciones",
    type: "Normativa Nacional",
    comuna: "Nacional",
    estado: "Vigente",
    fecha: "2023-08-20",
    description: "Normativa nacional que regula la construcción y urbanización en Chile.",
    tags: ["construcción", "urbanismo", "nacional"],
    url: "/documents/oguc-2023.pdf",
  },
  {
    id: "doc_3",
    title: "Reglamento Ambiental Providencia",
    type: "Normativa Ambiental",
    comuna: "Providencia",
    estado: "Vigente",
    fecha: "2023-11-10",
    description: "Regulaciones ambientales específicas para proyectos en Providencia.",
    tags: ["ambiental", "sustentabilidad"],
    url: "/documents/reglamento-ambiental-providencia.pdf",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search")?.toLowerCase()
  const comuna = searchParams.get("comuna")
  const tipo = searchParams.get("tipo")
  const estado = searchParams.get("estado")
  const limit = Number.parseInt(searchParams.get("limit") || "20")

  let filteredDocs = mockDocuments

  if (search) {
    filteredDocs = filteredDocs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(search) ||
        doc.description.toLowerCase().includes(search) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(search)),
    )
  }

  if (comuna && comuna !== "all") {
    filteredDocs = filteredDocs.filter((doc) => doc.comuna === comuna)
  }

  if (tipo && tipo !== "all") {
    filteredDocs = filteredDocs.filter((doc) => doc.type === tipo)
  }

  if (estado && estado !== "all") {
    filteredDocs = filteredDocs.filter((doc) => doc.estado === estado)
  }

  await new Promise((resolve) => setTimeout(resolve, 400))

  return NextResponse.json({
    documents: filteredDocs.slice(0, limit),
    total: filteredDocs.length,
    filters: {
      comunas: ["Las Condes", "Providencia", "Vitacura", "Ñuñoa"],
      tipos: ["Normativa Municipal", "Normativa Nacional", "Normativa Ambiental"],
      estados: ["Vigente", "Derogado", "En Tramitación"],
    },
  })
}
