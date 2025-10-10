import { type NextRequest, NextResponse } from "next/server"

const mockProjectDetails = {
  proj_1: {
    id: "proj_1",
    name: "Proyecto Residencial Las Condes",
    comuna: "Las Condes",
    description:
      "Desarrollo residencial de 120 unidades habitacionales con áreas verdes y estacionamientos subterráneos.",
    sources: [
      {
        id: "doc_1",
        title: "Plan Regulador Las Condes 2023",
        type: "Normativa Municipal",
        active: true,
        addedAt: "2024-01-10T10:00:00Z",
      },
      {
        id: "doc_2",
        title: "Ordenanza General de Urbanismo",
        type: "Normativa Nacional",
        active: true,
        addedAt: "2024-01-10T10:15:00Z",
      },
    ],
    chatHistory: [
      {
        id: "msg_1",
        type: "assistant",
        content:
          "¡Hola! Soy tu asistente de Urbai. Puedo ayudarte con consultas sobre normativas urbanas para tu proyecto en Las Condes. ¿En qué puedo asistirte?",
        timestamp: "2024-01-15T10:30:00Z",
      },
    ],
    studies: [],
    herramientas: [],
    createdAt: "2024-01-10T09:00:00Z",
    lastActivity: "2024-01-15T10:30:00Z",
  },
  p_1: {
    id: "p_1",
    name: "Vivienda Las Rosas",
    comuna: "Providencia",
    type: "Vivienda",
    description: "Proyecto de vivienda unifamiliar en zona residencial de Providencia.",
    sources: [
      {
        id: "d_prc_providencia",
        title: "Plan Regulador Comunal de Providencia",
        type: "PRC",
        active: true,
        addedAt: "2025-09-01T10:00:00Z",
      },
      {
        id: "d_oguc",
        title: "Ordenanza General de Urbanismo y Construcciones",
        type: "OGUC",
        active: true,
        addedAt: "2025-09-01T10:15:00Z",
      },
    ],
    chatHistory: [
      {
        id: "msg_1",
        type: "assistant",
        content:
          "¡Hola! Soy tu asistente de Urbai. Puedo ayudarte con consultas sobre normativas urbanas para tu proyecto Vivienda Las Rosas en Providencia. ¿En qué puedo asistirte?",
        timestamp: "2025-09-01T10:30:00Z",
      },
    ],
    studies: [],
    herramientas: [],
    createdAt: "2025-09-01T10:00:00Z",
    lastActivity: "2025-09-03T15:30:00Z",
  },
  p_2: {
    id: "p_2",
    name: "Centro Comercial Norte",
    comuna: "Las Condes",
    type: "Comercio",
    description: "Desarrollo comercial con retail y estacionamientos en Las Condes.",
    sources: [
      {
        id: "d_prc_lascondes",
        title: "Plan Regulador Comunal de Las Condes",
        type: "PRC",
        active: true,
        addedAt: "2025-08-28T14:20:00Z",
      },
      {
        id: "d_oguc",
        title: "Ordenanza General de Urbanismo y Construcciones",
        type: "OGUC",
        active: true,
        addedAt: "2025-08-28T14:25:00Z",
      },
      {
        id: "d_circular_458",
        title: "Circular DDU N° 458",
        type: "Circular DDU",
        active: true,
        addedAt: "2025-08-28T14:30:00Z",
      },
    ],
    chatHistory: [
      {
        id: "msg_1",
        type: "assistant",
        content:
          "¡Hola! Soy tu asistente de Urbai. Puedo ayudarte con consultas sobre normativas urbanas para tu proyecto Centro Comercial Norte en Las Condes. ¿En qué puedo asistirte?",
        timestamp: "2025-08-28T14:30:00Z",
      },
    ],
    studies: [],
    herramientas: [],
    createdAt: "2025-08-28T14:20:00Z",
    lastActivity: "2025-09-02T09:15:00Z",
  },
  p_3: {
    id: "p_3",
    name: "Plaza Vecinal Maipú",
    comuna: "Maipú",
    type: "Espacio público",
    description: "Proyecto de espacio público con áreas verdes y equipamiento comunitario.",
    sources: [
      {
        id: "d_prc_maipu",
        title: "Plan Regulador Comunal de Maipú",
        type: "PRC",
        active: true,
        addedAt: "2025-08-25T11:45:00Z",
      },
    ],
    chatHistory: [
      {
        id: "msg_1",
        type: "assistant",
        content:
          "¡Hola! Soy tu asistente de Urbai. Puedo ayudarte con consultas sobre normativas urbanas para tu proyecto Plaza Vecinal Maipú. ¿En qué puedo asistirte?",
        timestamp: "2025-08-25T12:00:00Z",
      },
    ],
    studies: [],
    herramientas: [],
    createdAt: "2025-08-25T11:45:00Z",
    lastActivity: "2025-08-30T16:20:00Z",
  },
}

export async function GET(request: NextRequest, { params }: { params: { projectId: string } }) {
  const projectId = params.projectId

  if (projectId.startsWith("proj_") && !mockProjectDetails[projectId as keyof typeof mockProjectDetails]) {
    const mockNewProject = {
      id: projectId,
      name: "Nuevo Proyecto",
      comuna: "Santiago",
      description: "Proyecto recién creado",
      sources: [],
      chatHistory: [
        {
          id: "msg_1",
          type: "assistant",
          content:
            "¡Hola! Soy tu asistente de Urbai. Puedo ayudarte con consultas sobre normativas urbanas para tu proyecto. ¿En qué puedo asistirte?",
          timestamp: new Date().toISOString(),
        },
      ],
      studies: [],
      herramientas: [],
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    }

    await new Promise((resolve) => setTimeout(resolve, 600))
    return NextResponse.json({ project: mockNewProject })
  }

  const project = mockProjectDetails[projectId as keyof typeof mockProjectDetails]

  if (!project) {
    return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 })
  }

  await new Promise((resolve) => setTimeout(resolve, 600))

  return NextResponse.json({ project })
}

export async function PUT(request: NextRequest, { params }: { params: { projectId: string } }) {
  try {
    const updates = await request.json()
    const projectId = params.projectId

    // Mock update - simulate success
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: "Proyecto actualizado exitosamente",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error actualizando proyecto" }, { status: 400 })
  }
}
