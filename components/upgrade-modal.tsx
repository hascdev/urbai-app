"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Crown } from "lucide-react"
import { usePlan } from "@/hooks/use-plan"
import { PLANS, formatPrice } from "@/lib/plans"

export function UpgradeModal() {
  const { isUpgradeModalOpen, setUpgradeModalOpen, upgradeToPro, upgradeReason } = usePlan()

  const proPlan = PLANS.pro
  const starterPlan = PLANS.starter

  return (
    <Dialog open={isUpgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Actualiza a PRO
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {upgradeReason && (
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-600 dark:text-yellow-400">{upgradeReason}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {/* Starter Plan */}
            <div className="border rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{starterPlan.name}</h3>
                <p className="text-2xl font-bold text-muted-foreground">{formatPrice(starterPlan.price)}</p>
              </div>

              <ul className="space-y-2">
                {starterPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* PRO Plan */}
            <div className="border-2 border-primary rounded-lg p-6 space-y-4 relative">
              <Badge className="absolute -top-2 left-4 bg-primary">Recomendado</Badge>

              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {proPlan.name}
                  <Crown className="h-4 w-4 text-yellow-500" />
                </h3>
                <p className="text-2xl font-bold">
                  {formatPrice(proPlan.price)}
                  <span className="text-sm font-normal text-muted-foreground">/{proPlan.interval}</span>
                </p>
              </div>

              <ul className="space-y-2">
                {proPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setUpgradeModalOpen(false)} className="flex-1">
              Continuar con Starter
            </Button>
            <Button onClick={upgradeToPro} className="flex-1">
              <Crown className="h-4 w-4 mr-2" />
              Actualizar a PRO
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
