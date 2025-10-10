"use client"

import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, AlertTriangle } from "lucide-react"
import { usePlan } from "@/hooks/use-plan"

interface PlanUsageIndicatorProps {
  type: "documents" | "projects" | "messages"
  className?: string
}

export function PlanUsageIndicator({ type, className }: PlanUsageIndicatorProps) {
  const { currentPlan, usage, setUpgradeModalOpen } = usePlan()

  const getUsageData = () => {
    switch (type) {
      case "documents":
        return {
          current: usage.activeDocuments,
          max: currentPlan.limits.maxActiveDocuments,
          label: "Documentos activos",
          unit: "documento",
        }
      case "projects":
        return {
          current: usage.projects,
          max: currentPlan.limits.maxProjects,
          label: "Proyectos",
          unit: "proyecto",
        }
      case "messages":
        return {
          current: usage.chatMessages,
          max: currentPlan.limits.maxChatMessages,
          label: "Mensajes este mes",
          unit: "mensaje",
        }
    }
  }

  const data = getUsageData()
  const isUnlimited = data.max === -1
  const percentage = isUnlimited ? 0 : (data.current / data.max) * 100
  const isNearLimit = percentage > 80
  const isAtLimit = percentage >= 100

  if (isUnlimited) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
          <Crown className="h-3 w-3 mr-1" />
          Ilimitado
        </Badge>
      </div>
    )
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{data.label}</span>
        <div className="flex items-center gap-2">
          <span className={`font-medium ${isAtLimit ? "text-red-500" : isNearLimit ? "text-yellow-500" : ""}`}>
            {data.current} / {data.max}
          </span>
          {(isNearLimit || isAtLimit) && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
        </div>
      </div>

      <Progress
        value={percentage}
        className="h-2"
        // @ts-ignore
        indicatorClassName={isAtLimit ? "bg-red-500" : isNearLimit ? "bg-yellow-500" : "bg-primary"}
      />

      {isAtLimit && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-red-500">Has alcanzado el límite de tu plan</p>
          <Button size="sm" variant="outline" onClick={() => setUpgradeModalOpen(true)} className="h-6 px-2 text-xs">
            <Crown className="h-3 w-3 mr-1" />
            Actualizar
          </Button>
        </div>
      )}
    </div>
  )
}
