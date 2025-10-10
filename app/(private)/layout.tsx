import type React from "react"
import { AuthProvider } from "@/hooks/use-auth"
import { PlanProvider } from "@/hooks/use-plan"
import { UpgradeModal } from "@/components/upgrade-modal"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function AppLayout({ children, }: { children: React.ReactNode }) {
	return (
		<AuthProvider>
			<PlanProvider>
				<TooltipProvider delayDuration={0}>
					{children}
					<UpgradeModal />
				</TooltipProvider>
			</PlanProvider>
		</AuthProvider>
	)
}
