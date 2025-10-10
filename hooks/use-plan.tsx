"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type PlanType, type Plan, PLANS } from "@/lib/plans"
import { useAuth } from "./use-auth"

interface PlanUsage {
  activeDocuments: number
  projects: number
  chatMessages: number
}

interface PlanContextType {
  currentPlan: Plan
  usage: PlanUsage
  canAddDocument: () => boolean
  canCreateProject: () => boolean
  canSendMessage: () => boolean
  checkLimit: (action: "document" | "project" | "message") => { allowed: boolean; reason?: string }
  upgradeToPro: () => void
  isUpgradeModalOpen: boolean
  setUpgradeModalOpen: (open: boolean) => void
  upgradeReason: string | null
}

const PlanContext = createContext<PlanContextType | undefined>(undefined)

export function PlanProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [currentPlan, setCurrentPlan] = useState<Plan>(PLANS.starter)
  const [usage, setUsage] = useState<PlanUsage>({
    activeDocuments: 0,
    projects: 2, // Mock current usage
    chatMessages: 25, // Mock current usage
  })
  const [isUpgradeModalOpen, setUpgradeModalOpen] = useState(false)
  const [upgradeReason, setUpgradeReason] = useState<string | null>(null)

  // Mock: Load user's plan from localStorage or API
  useEffect(() => {
    if (user) {
      const savedPlan = localStorage.getItem(`user_plan_${user.id}`)
      if (savedPlan && savedPlan in PLANS) {
        setCurrentPlan(PLANS[savedPlan as PlanType])
      }
    }
  }, [user])

  const canAddDocument = () => {
    return currentPlan.limits.maxActiveDocuments === -1 || usage.activeDocuments < currentPlan.limits.maxActiveDocuments
  }

  const canCreateProject = () => {
    return currentPlan.limits.maxProjects === -1 || usage.projects < currentPlan.limits.maxProjects
  }

  const canSendMessage = () => {
    return currentPlan.limits.maxChatMessages === -1 || usage.chatMessages < currentPlan.limits.maxChatMessages
  }

  const checkLimit = (action: "document" | "project" | "message") => {
    switch (action) {
      case "document":
        if (!canAddDocument()) {
          return {
            allowed: false,
            reason: `Has alcanzado el límite de ${currentPlan.limits.maxActiveDocuments} documento${currentPlan.limits.maxActiveDocuments > 1 ? "s" : ""} activo${currentPlan.limits.maxActiveDocuments > 1 ? "s" : ""} por proyecto.`,
          }
        }
        break
      case "project":
        if (!canCreateProject()) {
          return {
            allowed: false,
            reason: `Has alcanzado el límite de ${currentPlan.limits.maxProjects} proyectos.`,
          }
        }
        break
      case "message":
        if (!canSendMessage()) {
          return {
            allowed: false,
            reason: `Has alcanzado el límite de ${currentPlan.limits.maxChatMessages} mensajes este mes.`,
          }
        }
        break
    }
    return { allowed: true }
  }

  const upgradeToPro = () => {
    // Mock upgrade process
    setCurrentPlan(PLANS.pro)
    if (user) {
      localStorage.setItem(`user_plan_${user.id}`, "pro")
    }
    setUpgradeModalOpen(false)
    setUpgradeReason(null)
  }

  const showUpgradeModal = (reason: string) => {
    setUpgradeReason(reason)
    setUpgradeModalOpen(true)
  }

  // Mock: Update usage when actions are performed
  const updateUsage = (type: keyof PlanUsage, increment = 1) => {
    setUsage((prev) => ({
      ...prev,
      [type]: prev[type] + increment,
    }))
  }

  return (
    <PlanContext.Provider
      value={{
        currentPlan,
        usage,
        canAddDocument,
        canCreateProject,
        canSendMessage,
        checkLimit,
        upgradeToPro,
        isUpgradeModalOpen,
        setUpgradeModalOpen,
        upgradeReason,
      }}
    >
      {children}
    </PlanContext.Provider>
  )
}

export function usePlan() {
  const context = useContext(PlanContext)
  if (context === undefined) {
    throw new Error("usePlan must be used within a PlanProvider")
  }
  return context
}
