"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AppTopbar } from "@/components/app-topbar"
import { useAuth } from "@/hooks/use-auth"
import { Plus, Volume2, Sparkles, FileOutput, StickyNote, BarChart3, Clock, User } from "lucide-react"

const herramientasTypes = [
  {
    id: "summary",
    title: "Resúmenes de audio",
    description: "Convierte conversaciones y reuniones en resúmenes estructurados",
    icon: Volume2,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    available: false,
  },
  {
    id: "concept_map",
    title: "Mapas conceptuales",
    description: "Visualiza relaciones entre normativas y conceptos clave",
    icon: Sparkles,
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    available: false,
  },
  {
    id: "report",
    title: "Informes",
    description: "Genera reportes profesionales en PDF con análisis detallado",
    icon: FileOutput,
    color: "bg-green-500/10 text-green-600 border-green-500/20",
    available: true,
  },
  {
    id: "note",
    title: "Notas",
    description: "Organiza y estructura tus apuntes y observaciones",
    icon: StickyNote,
    color: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    available: true,
  },
]

const mockHerramientasResults = [
  {
    id: "h1",
    type: "summary",
    title: "Resumen - Reunión Proyecto Las Condes",
    projectName: "Proyecto Residencial Las Condes",
    createdAt: "2024-01-15T10:30:00Z",
    status: "completed",
  },
  {
    id: "h2",
    type: "report",
    title: "Informe Normativo - Providencia",
    projectName: "Edificio Comercial Providencia",
    createdAt: "2024-01-14T15:20:00Z",
    status: "completed",
  },
]

export default function HerramientasPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const handleCreateHerramienta = (type: string) => {
    // In real app, this would open a modal or navigate to creation flow
    console.log("Creating herramienta:", type)
    alert(`Creando ${herramientasTypes.find((h) => h.id === type)?.title}...`)
  }

  return (
    <div className="min-h-screen bg-white">
      <AppTopbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Herramientas</h1>
          <p className="text-gray-600">
            Crea resúmenes, mapas conceptuales, informes y notas a partir de tus proyectos y conversaciones.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Available Tools */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Herramientas disponibles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {herramientasTypes.map((herramienta) => (
                  <Card
                    key={herramienta.id}
                    className="bg-white border-gray-200 hover:border-primary/30 transition-colors cursor-pointer shadow-sm hover:shadow-md"
                    onClick={() => handleCreateHerramienta(herramienta.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 rounded-lg ${herramienta.color}`}>
                            <herramienta.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-gray-900 text-lg">{herramienta.title}</CardTitle>
                            {herramienta.available ? (
                              <Badge className="bg-green-500/10 text-green-600 text-xs mt-1">Disponible</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-600 text-xs mt-1">Próximamente</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-gray-600 text-sm mb-4">{herramienta.description}</p>
                      <Button
                        size="sm"
                        className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20"
                        disabled={!herramienta.available}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear {herramienta.title.toLowerCase()}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Recent Results */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultados recientes</h2>
              {mockHerramientasResults.length > 0 ? (
                <div className="space-y-4">
                  {mockHerramientasResults.map((result) => {
                    const herramientaType = herramientasTypes.find((h) => h.id === result.type)
                    return (
                      <Card
                        key={result.id}
                        className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${herramientaType?.color}`}>
                                {herramientaType?.icon && <herramientaType.icon className="h-4 w-4" />}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 mb-1">{result.title}</h4>
                                <p className="text-sm text-gray-600 mb-2">{result.projectName}</p>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {new Date(result.createdAt).toLocaleDateString()}
                                  <User className="h-3 w-3 ml-3 mr-1" />
                                  {user?.name}
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-green-500/10 text-green-600 text-xs">
                              {result.status === "completed" ? "Completado" : "Procesando"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card className="bg-white border-gray-200 border-dashed shadow-sm">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <BarChart3 className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aún no has creado herramientas</h3>
                    <p className="text-gray-600 text-center mb-6 max-w-md">
                      Comienza creando tu primera herramienta desde las opciones disponibles arriba.
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="bg-white border-gray-200 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-gray-900 text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Herramientas creadas</span>
                  <span className="text-sm font-medium text-gray-900">{mockHerramientasResults.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Este mes</span>
                  <span className="text-sm font-medium text-gray-900">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plan actual</span>
                  <Badge className="bg-primary/10 text-primary text-xs border-primary/20">
                    {user?.plan?.toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Coming Soon */}
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 shadow-sm">
              <CardContent className="p-4">
                <h4 className="font-semibold text-primary mb-2">Próximamente</h4>
                <p className="text-sm text-gray-700 mb-3">
                  Nuevas herramientas específicas de Urbai para análisis normativo avanzado.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary hover:text-white bg-white"
                  disabled
                >
                  Mantente informado
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
