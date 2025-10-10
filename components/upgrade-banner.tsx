"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Subscription } from "@/lib/definitions"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import confetti from 'canvas-confetti';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function UpgradeBanner({ subscription, active }: { subscription: Subscription | null, active: boolean }) {

	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const status = searchParams.get('status');
		if (status && status === 'success') {
			confetti({
				particleCount: 150,
				spread: 100,
				origin: { y: 0.6 }
			});
		}
	}, [searchParams]);


	if (!subscription || !subscription.plan) return null;

	return (
		<Card className="bg-white border-primary/30 shadow-sm flex flex-col h-full">
			<CardHeader className="shrink-0">
				<CardTitle className="text-gray-900">
					<h1 className="text-lg font-medium tracking-tight">
						Plan actual
					</h1>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4 flex-1 flex flex-col">
				<div className="flex flex-col justify-between h-full">
					<div className="flex flex-col justify-between h-full">
						<div className="flex flex-col items-center justify-center h-full text-center space-y-4 mb-4">
							<Badge className="bg-primary/10 text-primary border-primary/20 text-md hover:border-primary hover:bg-primary/10">
								{subscription.plan.name?.toUpperCase() || "STARTER"}
							</Badge>
							<div className="text-xl font-bold text-gray-900">
								<div className="flex items-center justify-center space-x-2">
									<div className="flex items-start justify-center font-bold text-gray-900 space-x-1">
										<span className="text-3xl">$</span>
										<span className="text-3xl">{subscription.plan.price ? Number(subscription.plan.price).toLocaleString("es-CL") : "0"}</span>
									</div>
									<div className="flex flex-col items-start justify-center -space-y-1">
										<span className="text-xs">CLP</span>
										<span className="text-xs">al mes</span>
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col justify-center h-full text-sm space-y-2">
							<div className="flex justify-between text-sm mb-1">
								<span className="text-gray-600">Consultas disponibles este mes</span>
								<span className="text-gray-900">{subscription.remaining} / {Number(subscription.plan.queries)}</span>
							</div>
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div className="bg-primary h-2 rounded-full" style={{ width: `${(subscription.remaining / Number(subscription.plan.queries)) * 100}%` }}></div>
							</div>
						</div>
						<div className="flex flex-col justify-center h-full text-center text-xs">
							<span className="text-gray-600">Elige el plan que mejor se adapte a tus necesidades</span>
						</div>
					</div>
					<Button onClick={() => router.push("/app/billing")} className="w-full shrink-0 bg-primary hover:bg-primary/90 text-white" >
						Mejorar mi plan
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}

