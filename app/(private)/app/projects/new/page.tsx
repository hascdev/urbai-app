"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppTopbar } from "@/components/app-topbar"
import { ArrowLeft, Plus } from "lucide-react"
import { useProjectFilters } from "@/hooks/use-project-filters"
import { Combobox } from "@/components/ui/combobox"
import { createProject } from "@/lib/project-action"
import { toast } from "sonner"

export default function NewProjectPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const docId = searchParams.get("docId") // If coming from library
	const { filterData, isLoading: filtersLoading, error: filtersError } = useProjectFilters();

	const [formData, setFormData] = useState({
		name: "",
		comuna: "",
		type: "",
		description: "",
		tags: "",
	})
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!formData.name.trim() || !formData.comuna || !formData.type) {
			alert("Por favor completa los campos requeridos")
			return
		}

		setIsLoading(true)
		const result = await createProject(formData);
		console.log("handleSubmit", result);
		setIsLoading(false);

		if (result && result?.data?.project) {
			router.push(`/app/projects/${result.data.project.id}`)
		} else {
			console.error("Ocurrió un error al crear el proyecto", result?.data?.failure);
			toast.error("Ocurrió un error al crear el proyecto");
		}
	}

	const handleCancel = () => {
		router.back()
	}

	return (
		<div className="min-h-screen bg-white">
			<AppTopbar />

			<main className="max-w-2xl mx-auto px-6 py-8">
				{/* Header */}
				<div className="flex items-center mb-8">
					<Button variant="ghost" onClick={handleCancel} className="text-gray-600 hover:bg-gray-50 mr-4">
						<ArrowLeft className="h-4 w-4 mr-2" />
						Volver
					</Button>
					<div>
						<h1 className="text-3xl font-bold text-gray-900">Crear nuevo proyecto</h1>
						<p className="text-gray-600">Configura tu proyecto para comenzar a trabajar</p>
					</div>
				</div>

				{/* Form */}
				<Card className="bg-white border-gray-200 shadow-sm">
					<CardHeader>
						<CardTitle className="text-gray-900">Información del proyecto</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div>
								<Label htmlFor="name" className="text-gray-900 mb-2 block">
									Nombre del proyecto *
								</Label>
								<Input
									id="name"
									placeholder="Ej: Vivienda Las Rosas"
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
									required
								/>
							</div>

							<div>
								<Label htmlFor="comuna" className="text-gray-900 mb-2 block">
									Comuna principal *
								</Label>
								<Combobox
									options={filterData.comunas}
									onSelectOption={(value) => setFormData({ ...formData, comuna: value })}
									value={formData.comuna}
									defaultValue={formData.comuna} />
							</div>

							<div>
								<Label htmlFor="type" className="text-gray-900 mb-2 block">
									Tipo de proyecto *
								</Label>
								<Select value={formData.type.toString()} onValueChange={(value) => setFormData({ ...formData, type: value })}>
									<SelectTrigger className="bg-gray-50 border-gray-200 text-gray-900">
										<SelectValue placeholder="Selecciona el tipo" />
									</SelectTrigger>
									<SelectContent className="bg-white border-gray-200">
										{filtersLoading ? (
											<SelectItem value="loading" disabled className="text-gray-500">
												Cargando tipos...
											</SelectItem>
										) : (
											filterData.types.map((type) => (
												<SelectItem key={type.value} value={type.value.toString()} className="text-gray-900">
													{type.label}
												</SelectItem>
											))
										)}
									</SelectContent>
								</Select>
							</div>

							<div>
								<Label htmlFor="description" className="text-gray-900 mb-2 block">
									Descripción (opcional)
								</Label>
								<Textarea
									id="description"
									placeholder="Describe brevemente tu proyecto..."
									value={formData.description}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
									className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 resize-none"
									rows={3}
								/>
							</div>

							<div>
								<Label htmlFor="tags" className="text-gray-900 mb-2 block">
									Tags (opcional)
								</Label>
								<Input
									id="tags"
									placeholder="Ej: unifamiliar, zona R3, esquina (separados por comas)"
									value={formData.tags}
									onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
									className="bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
								/>
								<p className="text-xs text-gray-500 mt-1">Separa los tags con comas</p>
							</div>

							{docId && (
								<div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
									<p className="text-primary text-sm">
										Este proyecto se creará con el documento seleccionado de la librería.
									</p>
								</div>
							)}

							<div className="flex space-x-3 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={handleCancel}
									className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-50 bg-white"
								>
									Cancelar
								</Button>
								<Button type="submit" disabled={isLoading} className="flex-1 bg-primary hover:bg-primary/90 text-white">
									{isLoading ? (
										<div className="flex items-center">
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Creando...
										</div>
									) : (
										<div className="flex items-center">
											<Plus className="mr-2 h-4 w-4" />
											Crear proyecto
										</div>
									)}
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>
			</main>
		</div>
	)
}
