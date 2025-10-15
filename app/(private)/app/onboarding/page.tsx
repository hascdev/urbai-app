"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { ArrowRight, ArrowLeft, BookOpen, MessageSquare, BarChart3 } from "lucide-react"
import Image from "next/image"

const onboardingSteps = [
	{
		id: 1,
		title: "Explora la Librería Normativa",
		description:
			"Accede a miles de documentos oficiales: PRC, OGUC, circulares DDU y más. Todo actualizado y verificado.",
		icon: BookOpen,
		tip: "Usa los filtros por comuna y tipo de documento para encontrar exactamente lo que necesitas.",
	},
	{
		id: 2,
		title: "Crea Proyectos y Chatea",
		description: "Organiza tus consultas por proyecto. Selecciona fuentes relevantes y pregunta en lenguaje natural.",
		icon: MessageSquare,
		tip: "Puedes activar múltiples fuentes para obtener respuestas más completas (requiere plan Pro).",
	},
	{
		id: 3,
		title: "Herramientas e Informes",
		description: "Crea resúmenes, mapas conceptuales e informes profesionales a partir de tus conversaciones.",
		icon: BarChart3,
		tip: "Los informes en PDF están disponibles para usuarios Pro y Custom.",
	},
]

export default function OnboardingPage() {
	const [currentStep, setCurrentStep] = useState(0)
	const { updateUser } = useAuth()
	const router = useRouter()

	const handleNext = () => {
		if (currentStep < onboardingSteps.length - 1) {
			setCurrentStep(currentStep + 1)
		} else {
			handleComplete()
		}
	}

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1)
		}
	}

	const handleComplete = () => {
		// Mark user as no longer first time
		//updateUser({ isFirstTime: false })
		router.push("/app/dashboard")
	}

	const handleSkip = () => {
		//updateUser({ isFirstTime: false })
		router.push("/app/dashboard")
	}

	const step = onboardingSteps[currentStep]

	return (
		<div className="min-h-screen bg-white flex items-center justify-center p-4">
			<div className="w-full max-w-4xl">
				{/* Header */}
				<div className="text-center mb-8">
					<Image
						src="/images/urbai-logo.png"
						alt="Urbai"
						width={120}
						height={40}
						className="h-10 w-auto mx-auto mb-4"
					/>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido a Urbai!</h1>
					<p className="text-gray-600">Te mostramos las funciones principales en 3 pasos</p>
				</div>

				{/* Progress indicator */}
				<div className="flex justify-center mb-8">
					<div className="flex space-x-2">
						{onboardingSteps.map((_, index) => (
							<div
								key={index}
								className={`h-2 w-8 rounded-full transition-colors ${index <= currentStep ? "bg-primary" : "bg-gray-200"
									}`}
							/>
						))}
					</div>
				</div>

				{/* Main content */}
				<Card className="bg-white border-gray-200 shadow-sm">
					<CardContent className="p-8">
						<div className="flex flex-col items-center justify-center text-center">
							<div className="p-3 bg-primary/10 rounded-lg mb-4">
								<step.icon className="h-8 w-8 text-primary" />
							</div>

							<div className="mb-4">
								<span className="text-sm text-gray-600">
									Paso {step.id} de {onboardingSteps.length}
								</span>
								<h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
							</div>

							<p className="text-gray-600 text-lg mb-6 leading-relaxed max-w-2xl">{step.description}</p>

							<div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 max-w-2xl">
								<p className="text-primary text-sm">
									<strong>Tip:</strong> {step.tip}
								</p>
							</div>

							{/* Navigation buttons */}
							<div className="flex justify-between items-center w-full max-w-2xl">
								<Button
									variant="ghost"
									onClick={handleSkip}
									className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
								>
									Saltar tour
								</Button>

								<div className="flex space-x-3">
									{currentStep > 0 && (
										<Button
											variant="outline"
											onClick={handlePrevious}
											className="border-gray-200 text-gray-900 hover:bg-gray-50 bg-white"
										>
											<ArrowLeft className="mr-2 h-4 w-4" />
											Anterior
										</Button>
									)}

									<Button onClick={handleNext} className="bg-primary hover:bg-primary/90 text-white">
										{currentStep === onboardingSteps.length - 1 ? "Comenzar" : "Siguiente"}
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Footer note */}
				<p className="text-center text-gray-600 text-sm mt-6">Puedes acceder a este tour nuevamente desde tu perfil</p>
			</div>
		</div>
	)
}
