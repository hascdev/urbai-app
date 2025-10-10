"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { mockLogin } from "@/lib/auth"
import { ArrowRight, Smartphone } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [name, setName] = useState("")
  const [emailOrPhone, setEmailOrPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !emailOrPhone.trim()) {
      setError("Por favor completa todos los campos")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const user = await mockLogin(name.trim(), emailOrPhone.trim())
      login(user)

      // Redirect based on first time user
      if (user.isFirstTime) {
        router.push("/app/onboarding")
      } else {
        router.push("/app/dashboard")
      }
    } catch (err) {
      setError("Error al iniciar sesión. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/urbai-logo.png"
            alt="Urbai"
            width={120}
            height={40}
            className="h-10 w-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Bienvenido a Urbai</h1>
          <p className="text-gray-600">Ingresa para acceder a tu plataforma</p>
        </div>

        <Card className="bg-white border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                  Nombre completo
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="contact" className="block text-sm font-medium text-gray-900 mb-2">
                  Email o teléfono
                </label>
                <Input
                  id="contact"
                  type="text"
                  placeholder="tu@email.com o +56 9 1234 5678"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded border border-red-200">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Continuar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-600">o continúa con</span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 border-gray-200 text-gray-900 hover:bg-gray-50 bg-white"
                onClick={() => {
                  // Mock WhatsApp integration
                  window.open("https://wa.me/56912345678", "_blank")
                }}
              >
                <Smartphone className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>

            <p className="text-xs text-gray-600 text-center mt-6">
              Al continuar, aceptas nuestros{" "}
              <a href="/legal/terms" className="text-primary hover:underline">
                Términos y Condiciones
              </a>{" "}
              y{" "}
              <a href="/legal/privacy" className="text-primary hover:underline">
                Política de Privacidad
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
