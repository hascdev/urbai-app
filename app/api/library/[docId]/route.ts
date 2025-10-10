import { type NextRequest, NextResponse } from "next/server"

const mockDocumentDetails = {
  doc_1: {
    id: "doc_1",
    title: "Plan Regulador Las Condes 2023",
    type: "Normativa Municipal",
    comuna: "Las Condes",
    estado: "Vigente",
    fecha: "2023-12-15",
    description:
      "Plan regulador actualizado para la comuna de Las Condes con nuevas zonificaciones residenciales y comerciales. Incluye modificaciones a las alturas máximas permitidas y coeficientes de constructibilidad.",
    tags: ["residencial", "zonificación", "alturas", "constructibilidad"],
    url: "/documents/plan-regulador-las-condes-2023.pdf",
    metadata: {
      pages: 156,
      size: "2.4 MB",
      language: "Español",
      lastModified: "2023-12-15T14:30:00Z",
    },
    sections: [
      { title: "Disposiciones Generales", page: 1 },
      { title: "Zonificación Residencial", page: 15 },
      { title: "Zonificación Comercial", page: 45 },
      { title: "Alturas y Densidades", page: 78 },
      { title: "Áreas Verdes", page: 120 },
    ],
  },
}

export async function GET(request: NextRequest, { params }: { params: { docId: string } }) {
  const docId = params.docId
  const document = mockDocumentDetails[docId as keyof typeof mockDocumentDetails]

  if (!document) {
    return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 })
  }

  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json({ document })
}
