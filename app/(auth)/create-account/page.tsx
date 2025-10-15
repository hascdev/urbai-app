'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { signInWithGoogle } from "@/lib/login-action";
import { ArrowRight, MessageSquare, BookOpen, BarChart3, ArrowLeft } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const onboardingSteps = [
    {
        id: 1,
        title: "Explora la Librería Normativa",
        description: "Accede a documentos oficiales. Todo actualizado y verificado.",
        icon: BookOpen,
        tip: "Usa los filtros por comuna y tipo de documento para encontrar exactamente lo que necesitas.",
    },
    {
        id: 2,
        title: "Crea Proyectos y Chatea",
        description: "Selecciona documentos relevantes y pregunta en lenguaje natural.",
        icon: MessageSquare,
        tip: "Puedes activar múltiples documentos para obtener respuestas más completas (requiere plan Pro).",
    },
    {
        id: 3,
        title: "Notas y Reportes",
        description: "Crea notas y reportes profesionales a partir de tus conversaciones.",
        icon: BarChart3,
        tip: "Las notas son ilimitadas y los reportes en PDF están disponibles para usuarios Pro y Custom.",
    },
]

export default function CreateAccount() {

    const { execute } = useAction(signInWithGoogle);
    const [currentStep, setCurrentStep] = useState(0)

    const handleNext = () => {
        if (currentStep < onboardingSteps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const step = onboardingSteps[currentStep]

    function handleGoogleLogin(formData: FormData) {
        execute();
    }

    return (
        <div className="min-h-screen flex">
            {/* Left side - Hero Slider */}
            <div className="hidden md:flex flex-1 bg-white flex-col justify-center items-center p-4 relative overflow-hidden">
                <div className="flex flex-col items-center justify-center bg-urbai rounded-md w-full h-full">
                    <div className="w-full max-w-3xl">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido!</h1>
                            <p className="text-gray-600">Te mostramos las funciones principales de Urbai en 3 pasos</p>
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
                                            variant="outline"
                                            onClick={handlePrevious}
                                            className={`border-gray-200 text-gray-900 hover:bg-gray-50 bg-white ${currentStep > 0 ? "visible" : "invisible"}`}
                                        >
                                            <ArrowLeft className="mr-2 h-4 w-4" />
                                            Anterior
                                        </Button>

                                        <Button 
                                            onClick={handleNext} 
                                            className={`bg-primary hover:bg-primary/90 text-white ${currentStep === onboardingSteps.length - 1 ? "invisible" : "visible"}`}>
                                            Siguiente
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex-1 flex items-center justify-center p-4 bg-white">
                <div className="w-full max-w-md space-y-6">
                    {/* Logo */}
                    <div className="flex items-center mb-12 -ml-1">
                        <Link href="/">
                            <Image src="/images/urbai-logo.png" alt="Urbai" width={120} height={40} />
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-semibold text-gray-900">Comienza aquí 🚀</h1>
                        </div>
                        <p className="text-sm text-gray-500">
                            ¡Conversar con normativas de construcción nunca fue tan fácil!
                        </p>
                    </div>

                    {/* Form */}
                    <form>
                        <Button formAction={handleGoogleLogin} className="w-full h-12 font-normal hover:border-urbai border-2 hover:bg-white" variant="outline">
                            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 186.69 190.5">
                                <g transform="translate(1184.583 765.171)">
                                    <path fill="#4285f4" d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z" />
                                    <path fill="#34a853" d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z" />
                                    <path fill="#fbbc05" d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z" />
                                    <path fill="#ea4335" d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z" />
                                </g>
                            </svg>
                            Continuar con Google
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="text-center space-y-2">
                        <p className="text-sm text-gray-500">Al continuar, aceptas nuestros <Link href="/legal/terms" target="_blank" className="text-gray-900 hover:text-[#625BF6]">términos y condiciones</Link> y la <Link href="/legal/privacy" target="_blank" className="text-gray-900 hover:text-[#625BF6]">política de privacidad</Link>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
