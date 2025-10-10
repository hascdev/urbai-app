export type PlanType = "starter" | "pro"

export interface PlanLimits {
  maxActiveDocuments: number
  maxProjects: number
  maxChatMessages: number
  hasAdvancedChat: boolean
  hasStudyTools: boolean
  hasPrioritySupport: boolean
}

export interface Plan {
  id: PlanType
  name: string
  price: number
  currency: string
  interval: "month" | "year"
  limits: PlanLimits
  features: string[]
  popular?: boolean
}

export const PLANS: Record<PlanType, Plan> = {
  starter: {
    id: "starter",
    name: "Starter",
    price: 0,
    currency: "CLP",
    interval: "month",
    limits: {
      maxActiveDocuments: 1,
      maxProjects: 3,
      maxChatMessages: 50,
      hasAdvancedChat: false,
      hasStudyTools: false,
      hasPrioritySupport: false,
    },
    features: [
      "1 documento activo por proyecto",
      "Hasta 3 proyectos",
      "50 mensajes de chat por mes",
      "Acceso a la librería básica",
      "Soporte por email",
    ],
  },
  pro: {
    id: "pro",
    name: "PRO",
    price: 29990,
    currency: "CLP",
    interval: "month",
    limits: {
      maxActiveDocuments: -1, // unlimited
      maxProjects: -1, // unlimited
      maxChatMessages: -1, // unlimited
      hasAdvancedChat: true,
      hasStudyTools: true,
      hasPrioritySupport: true,
    },
    features: [
      "Documentos ilimitados por proyecto",
      "Proyectos ilimitados",
      "Chat avanzado sin límites",
      "Herramientas de estudio completas",
      "Análisis multi-documento",
      "Soporte prioritario",
      "Exportación de informes",
    ],
    popular: true,
  },
}

export function formatPrice(price: number, currency = "CLP"): string {
  if (price === 0) return "Gratis"

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(price)
}
