"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
	ArrowRight,
	MapPin,
	ImageIcon,
	Shield,
	Database,
	Bell,
	ChevronDown,
	Smartphone,
	FileText,
	Search,
	Star,
	BookOpen,
	Filter,
	Plus,
	X,
} from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { LastUsersAvatar } from "@/components/last-users-avatar"

const features = [
	{
		icon: Smartphone,
		title: "Acceso inmediato",
		subtitle: "Tu software, sin software",
		description:
			"Accede desde la web app sin descargas ni configuraciones. Si sabes usar WhatsApp o un navegador, ya sabes usar Urbai.",
	},
	{
		icon: BookOpen,
		title: "Librería normativa",
		subtitle: "Toda la información en un solo lugar",
		description:
			"Explora una base centralizada con normativas de urbanismo y de construcción, siempre actualizada y fácil de consultar.",
	},
	{
		icon: MapPin,
		title: "Normativa por ubicación",
		subtitle: "Referencia legal precisa",
		description: "Comparte una dirección o enlace de Maps y recibe al instante la normativa aplicable en esa zona.",
	},
	{
		icon: ImageIcon,
		title: "Análisis de imágenes",
		subtitle: "Verificación visual normativa",
		description:
			"Sube una imagen junto a tu consulta; Urbai detecta elementos relevantes y te indica su nivel de cumplimiento.",
	},
	{
		icon: Shield,
		title: "Basado en datos oficiales",
		subtitle: "Precisión y respaldo legal",
		description:
			"Cada dato se extrae y valida desde fuentes oficiales, para garantizar decisiones seguras y fundamentadas.",
	},
	{
		icon: Bell,
		title: "Alertas normativas",
		subtitle: "Notificaciones que importan",
		description: "Recibe avisos sobre cambios en planes comunales, nuevas ordenanzas o circulares relevantes.",
	},
]

const libraryCategories = [
	{ name: "DITEC", count: 45, icon: FileText },
	{ name: "Transferencia de Competencias", count: 12, icon: FileText },
	{ name: "Ley Agilización Permisos", count: 8, icon: FileText },
	{ name: "Ley Aportes Espacio Público", count: 15, icon: FileText },
	{ name: "Legislación Orgánica MINVU", count: 23, icon: FileText },
	{ name: "Leyes", count: 156, icon: FileText },
	{ name: "Decretos", count: 89, icon: FileText },
	{ name: "Planes Reguladores", count: 234, icon: MapPin },
	{ name: "Resoluciones", count: 67, icon: FileText },
	{ name: "Circulares DDU", count: 529, icon: Database },
	{ name: "Normas Técnicas Obligatorias", count: 34, icon: Shield },
	{ name: "Formularios", count: 28, icon: FileText },
	{ name: "Estadísticas", count: 19, icon: Database },
	{ name: "Elementos Técnicos", count: 42, icon: FileText },
	{ name: "Valores Monetarios", count: 16, icon: FileText },
	{ name: "Tasas de Interés", count: 8, icon: FileText },
	{ name: "Vallas de obra", count: 12, icon: FileText },
	{ name: "Publicaciones Seremi", count: 95, icon: FileText },
]

const featuredDocuments = [
	{ title: "OGUC - Ordenanza General de Urbanismo", category: "Leyes", date: "2024", format: "PDF" },
	{ title: "LGUC - Ley General de Urbanismo", category: "Leyes", date: "2024", format: "PDF" },
	{ title: "Circular DDU 192", category: "Circulares", date: "2024", format: "PDF" },
	{ title: "Plan Regulador Las Condes", category: "Planes", date: "2024", format: "PDF" },
	{ title: "Circular DDU 337", category: "Circulares", date: "2024", format: "PDF" },
	{ title: "Plan Regulador Santiago", category: "Planes", date: "2024", format: "PDF" },
]

const faqData = [
	{
		question: "¿Qué es Urbai y cómo puede ayudarme?",
		answer: (
			<>
				Urbai es una plataforma que centraliza la normativa urbana y de construcción de Chile en un solo lugar. Te ayuda
				a entender qué reglas aplican a tu proyecto y te entrega respuestas claras, rápidas y confiables.
			</>
		),
	},
	{
		question: "¿Quién puede beneficiarse?",
		answer: (
			<>
				Arquitectos, ingenieros, constructores, inmobiliarias, abogados, funcionarios municipales y cualquier persona
				que necesite claridad sobre normativas urbanas en Chile.
			</>
		),
	},
	{
		question: "¿La información es confiable y está actualizada?",
		answer: (
			<>
				Sí. Toda la información se extrae y valida desde fuentes oficiales: planes reguladores, ordenanzas municipales,
				circulares ministeriales, etc. La librería se actualiza de manera continua.
			</>
		),
	},
	{
		question: "¿Dónde puedo usar Urbai?",
		answer: (
			<>
				Puedes ingresar desde la web app en cualquier dispositivo con internet o usar el chat de WhatsApp para consultas
				rápidas.
			</>
		),
	},
	{
		question: "¿Cómo me registro y comienzo?",
		answer: (
			<>
				Regístrate en la web app con tu correo electrónico o activa tu cuenta con tu número en WhatsApp. El proceso toma
				menos de 2 minutos.
			</>
		),
	},
	{
		question: "¿Urbai reemplaza a un profesional o abogado?",
		answer: (
			<>
				No. Urbai facilita la comprensión de la normativa, pero no sustituye el criterio de un arquitecto, abogado o
				funcionario municipal. Es una herramienta de apoyo para ahorrar tiempo y reducir errores.
			</>
		),
	},
	{
		question: "¿Qué pasa si la respuesta no es la esperada?",
		answer: (
			<>
				Puedes hacer la consulta desde otro ángulo o reportar el caso para que lo revisemos. Siempre podrás contrastar
				con un profesional.
			</>
		),
	},
	{
		question: "¿Necesito instalar algo?",
		answer: (
			<>
				No. Urbai funciona directamente en la web app y también en WhatsApp. No requiere descargas ni configuraciones.
			</>
		),
	},
	{
		question: "¿Urbai entiende ubicaciones y mapas?",
		answer: (
			<>
				Sí. Puedes compartir una dirección o un enlace de Google Maps y Urbai te entregará la normativa aplicable a ese
				lugar.
			</>
		),
	},
	{
		question: "¿Puedo enviar planos o imágenes?",
		answer: <>Sí. Puedes adjuntar imágenes o planos para verificar si cumplen con las normas aplicables.</>,
	},
	{
		question: "¿Cuál es la cobertura geográfica de Urbai?",
		answer: (
			<>
				Actualmente cubre comunas de Chile con planes reguladores digitalizados, y la cobertura se amplía de forma
				progresiva.
			</>
		),
	},
	{
		question: "¿Privacidad y datos?",
		answer: (
			<>
				Tus datos personales y consultas están protegidos. Urbai no comparte información con terceros y cumple con los
				estándares de seguridad y privacidad.
			</>
		),
	},
	{
		question: "¿Cómo reportar un error?",
		answer: (
			<>
				Desde la web app o WhatsApp puedes notificar inconsistencias. Nuestro equipo revisará la información y hará los
				ajustes necesarios.
			</>
		),
	},
]

// WhatsApp Icon Component
const WhatsAppIcon = ({ className = "h-5 w-5" }) => (
	<svg className={className} viewBox="0 0 24 24" fill="currentColor">
		<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
	</svg>
)

export default function Home() {

	const router = useRouter()
	const [displayText, setDisplayText] = useState("")
	const [currentTextIndex, setCurrentTextIndex] = useState(0)
	const [isTyping, setIsTyping] = useState(true)

	const rotatingTexts = [
		"Todo el contenido normativo que necesitas,",
		"Todos los planes reguladores que necesitas,",
		"Todas las circulares que necesitas,",
		"Todas las leyes que necesitas,",
		"Todos los decretos que necesitas,",
	]

	useEffect(() => {
		const currentText = rotatingTexts[currentTextIndex]
		let timeoutId: NodeJS.Timeout

		if (isTyping) {
			// Typing effect
			if (displayText.length < currentText.length) {
				timeoutId = setTimeout(() => {
					setDisplayText(currentText.slice(0, displayText.length + 1))
				}, 50) // 50ms per character for smooth typing
			} else {
				// Wait 2.5 seconds before starting to delete
				timeoutId = setTimeout(() => {
					setIsTyping(false)
				}, 2500)
			}
		} else {
			// Deleting effect
			if (displayText.length > 0) {
				timeoutId = setTimeout(() => {
					setDisplayText(displayText.slice(0, -1))
				}, 30) // 30ms per character for faster deletion
			} else {
				// Move to next text and start typing
				setCurrentTextIndex((prev) => (prev + 1) % rotatingTexts.length)
				setIsTyping(true)
			}
		}

		return () => clearTimeout(timeoutId)
	}, [displayText, currentTextIndex, isTyping, rotatingTexts])

	const [currentFeature, setCurrentFeature] = useState(0)
	const featuresContainerRef = useRef<HTMLDivElement>(null)
	const [showIPTTooltip, setShowIPTTooltip] = useState(false)

	const [name, setName] = useState("")
	const [phone, setPhone] = useState("")
	const [acceptedTerms, setAcceptedTerms] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [submissionMessage, setSubmissionMessage] = useState("")

	const [selectedDate, setSelectedDate] = useState(15)
	const [currentMonth, setCurrentMonth] = useState("Mayo 2025")
	const [showIPTDropdown, setShowIPTDropdown] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState("Todos")
	const [searchQuery, setSearchQuery] = useState("")
	const [openFAQ, setOpenFAQ] = useState<number | null>(null)

	const [showRequestModal, setShowRequestModal] = useState(false)
	const [showRequestRestrictionModal, setShowRequestRestrictionModal] = useState(false)
	const [showFiltersModal, setShowFiltersModal] = useState(false)

	const [requestForm, setRequestForm] = useState({
		documentType: "",
		documentName: "",
		contactName: "",
		contactEmail: "",
		contactPhone: "",
		description: "",
	})
	const [filters, setFilters] = useState({
		documentType: "",
		year: "",
		region: "",
		sortBy: "recent",
	})

	const [rotatingTextsIndex, setCurrentRotatingTextsIndex] = useState(0)
	const [isRotatingTextsAnimating, setIsRotatingTextsAnimating] = useState(false)

	// Basic validation for Chilean phone number (+56 9 XXXXXXXX)
	const isValidPhone = /^(\+56)?\s?9\s?\d{4}\s?\d{4}$/.test(phone) || phone === ""

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!name || !phone || !acceptedTerms || !isValidPhone) {
			setSubmissionMessage("Por favor, completa todos los campos y acepta los términos.")
			return
		}

		setIsLoading(true)
		setSubmissionMessage("")

		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 2000))

		setIsLoading(false)
		setSubmissionMessage("Mensaje enviado. Revisa WhatsApp.")
		setName("")
		setPhone("")
		setAcceptedTerms(false)
	}

	const generateCalendarDays = () => {
		const days = []
		// Simular días del mes anterior (grises)
		for (let i = 0; i < 4; i++) {
			days.push({ day: 28 + i, isCurrentMonth: false })
		}
		// Días del mes actual
		for (let i = 1; i <= 31; i++) {
			days.push({ day: i, isCurrentMonth: true })
		}
		// Días del siguiente mes (grises)
		for (let i = 1; i <= 7; i++) {
			days.push({ day: i, isCurrentMonth: false })
		}
		return days.slice(0, 42) // 6 semanas × 7 días
	}

	const availableSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"]

	const sampleDocuments = [
		{
			title: "Plan Regulador Comunal de Santiago",
			category: "PRC",
			year: "2024",
			type: "PDF",
			region: "Metropolitana",
			comuna: "Santiago",
		},
		{
			title: "Ordenanza General de Urbanismo y Construcciones",
			category: "OGUC",
			year: "2024",
			type: "PDF",
			region: "Nacional",
			comuna: "Todas",
		},
		{
			title: "Circular DDU N° 458",
			category: "Circular DDU",
			year: "2023",
			type: "PDF",
			region: "Nacional",
			comuna: "Todas",
		},
		{
			title: "Plan Regional de Desarrollo Urbano RM",
			category: "PRDU",
			year: "2023",
			type: "PDF",
			region: "Metropolitana",
			comuna: "Todas RM",
		},
		{
			title: "Límites Urbanos Las Condes",
			category: "Límites Urbanos",
			year: "2024",
			type: "PDF",
			region: "Metropolitana",
			comuna: "Las Condes",
		},
		{
			title: "Plan Seccional Providencia Centro",
			category: "Plan Seccional",
			year: "2023",
			type: "PDF",
			region: "Metropolitana",
			comuna: "Providencia",
		},
	]

	const getFilteredDocuments = () => {
		let filtered = sampleDocuments

		if (selectedCategory !== "Todos") {
			filtered = filtered.filter((doc) => doc.category === selectedCategory)
		}

		if (searchQuery) {
			filtered = filtered.filter(
				(doc) =>
					doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
					doc.comuna.toLowerCase().includes(searchQuery.toLowerCase()),
			)
		}

		if (filters.documentType) {
			filtered = filtered.filter((doc) => doc.category === filters.documentType)
		}

		if (filters.year) {
			filtered = filtered.filter((doc) => doc.year === filters.year)
		}

		if (filters.region) {
			filtered = filtered.filter((doc) => doc.region === filters.region)
		}

		// Ordenar según filtro
		if (filters.sortBy === "recent") {
			filtered.sort((a, b) => Number.parseInt(b.year) - Number.parseInt(a.year))
		} else if (filters.sortBy === "alphabetical") {
			filtered.sort((a, b) => a.title.localeCompare(b.title))
		}

		return filtered
	}

	const handleRequestSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		// Aquí se enviaría la solicitud al backend
		console.log("Solicitud enviada:", requestForm)
		setShowRequestModal(false)
		setRequestForm({
			documentType: "",
			documentName: "",
			contactName: "",
			contactEmail: "",
			contactPhone: "",
			description: "",
		})
		// Mostrar mensaje de éxito (podrías usar un toast aquí)
		alert("¡Solicitud enviada exitosamente! Te contactaremos pronto.")
	}

	const libraryDocuments = [
		{
			title: "Plan Regulador Comunal de Santiago",
			category: "Planes",
			description: "Descripción del Plan Regulador Comunal de Santiago",
			pages: 120,
			updated: "2024-01-15",
		},
		{
			title: "Ley General de Urbanismo y Construcciones",
			category: "Leyes",
			description: "Descripción de la Ley General de Urbanismo y Construcciones",
			pages: 250,
			updated: "2024-02-20",
		},
		{
			title: "Circular DDU 458",
			category: "Normativa Administrativa",
			description: "Descripción de la Circular DDU 458",
			pages: 30,
			updated: "2024-03-10",
		},
		{
			title: "Constitución Política de la República de Chile",
			category: "Constitución",
			description: "Descripción de la Constitución Política de la República de Chile",
			pages: 80,
			updated: "2024-04-05",
		},
		{
			title: "Reglamento de Construcción",
			category: "Reglamentos",
			description: "Descripción del Reglamento de Construcción",
			pages: 180,
			updated: "2024-05-01",
		},
	]

	const [selectedHierarchy, setSelectedHierarchy] = useState<string | null>(null)

	const hierarchyDescriptions = {
		Constitución:
			"Garantiza derechos fundamentales aplicables a todo desarrollo urbano (ej.: derecho a vivienda digna, protección del medio ambiente urbano).\n\n➡️ Prevalencia: Es la norma suprema, prevalece sobre todas las demás.",
		Leyes:
			"Incluye la LGUC y otras leyes generales (Bases del Medio Ambiente, Monumentos Nacionales). Regulan usos de suelo, densidades, accesibilidad, etc.\n\n➡️ Prevalencia: Están por debajo de la Constitución, pero por encima de reglamentos, planes y normativa administrativa.",
		Reglamentos:
			"OGUC y normas técnicas que detallan parámetros constructivos (alturas, retiros, habitabilidad, accesibilidad).\n\n➡️ Prevalencia: Se subordinan a la Constitución y a las leyes, pero prevalecen sobre planes y normativa administrativa.",
		Planes:
			"Instrumentos de planificación territorial como PRC, PRM, PRI, Planes Seccionales; definen parámetros específicos del predio.\n\n➡️ Prevalencia: Se subordinan a la Constitución, leyes y reglamentos, pero prevalecen sobre normativa administrativa.",
		"Normativa Administrativa":
			"Dictámenes de Contraloría, circulares y oficios MINVU/DDU que orientan la aplicación de normas.\n\n➡️ Prevalencia: Es el nivel más específico y siempre se subordina a los demás.",
	}

	const handleHierarchyClick = (hierarchy: string) => {
		setSelectedHierarchy(hierarchy)
	}

	const handleCloseModal = () => {
		setSelectedHierarchy(null)
	}

	const handleViewPlans = () => {
		setShowRequestRestrictionModal(false)
		setTimeout(() => {
			document.getElementById("planes")?.scrollIntoView({ behavior: "smooth" })
		}, 0)
	}

	return (
		<div className="min-h-screen bg-white">
			{/* Header */}
			<header className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 border-b border-gray-100">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						<div className="flex items-center">
							<Image src="/images/urbai-logo.png" alt="Urbai" width={120} height={40} className="h-8 w-auto" />
						</div>
						<nav className="hidden md:flex space-x-8 ml-auto mr-8">
							<a href="#que" className="text-gray-900 hover:text-[#625BF6] font-medium transition-colors">
								¿Qué?
							</a>
							<a href="#caracteristicas" className="text-gray-900 hover:text-[#625BF6] font-medium transition-colors">
								Características
							</a>
							<a href="#libreria" className="text-gray-900 hover:text-[#625BF6] font-medium transition-colors">
								Librería
							</a>
							<a href="#planes" className="text-gray-900 hover:text-[#625BF6] font-medium transition-colors">
								Planes
							</a>
							<a href="#faq" className="text-gray-900 hover:text-[#625BF6] font-medium transition-colors">
								FAQ
							</a>
						</nav>
						<Button
							className="bg-[#625BF6] hover:bg-[#5048E5] text-white font-medium transition-colors"
							onClick={() => router.push("/app")}
						>
							Comenzar ahora
						</Button>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="h-screen flex items-center justify-center">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-9 w-full">
					<div className="flex flex-col items-center justify-center text-center gap-10">
						<h1 className="text-4xl md:text-6xl font-bold text-gray-900 text-balance mb-4">
							<span className="inline-block min-h-[1.2em]">
								{displayText}
								<span className="animate-pulse">|</span>
							</span>{" "}
							<span className="text-[#625BF6]">en un solo lugar</span>
						</h1>
						<p className="text-xl text-gray-600 leading-relaxed max-w-3xl">
							Agiliza tu investigación normativa con respuestas precisas y recursos relevantes para tus proyectos.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button
								size="lg"
								className="bg-[#625BF6] hover:bg-[#5048E5] text-white font-medium px-8 py-4 text-lg transition-colors"
								onClick={() => router.push("/app")}
							>
								Usar Urbai App
								<ArrowRight className="ml-2 h-5 w-5" />
							</Button>
							{/* 
						<Button
							size="lg"
							variant="outline"
							className="border-[#625BF6] text-[#625BF6] hover:bg-[#625BF6] hover:text-white font-medium px-8 py-4 text-lg transition-colors bg-transparent"
							onClick={() => window.open("https://wa.me/56912345678", "_blank")}
						>
							Usar en WhatsApp
						</Button> 
						*/}
						</div>

						{/* Urbai users section */}
						<LastUsersAvatar />
					</div>
				</div>
			</section>

			{/* Meta Business Provider Section */}

			{/* What Section */}
			<section id="que" className="py-20 bg-gray-50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid lg:grid-cols-1 gap-16 items-center">

						{/* Registration Form - Left Side */}
						{/* <div className="relative flex justify-center">
							<Card className="border-2 border-gray-100 shadow-lg mt-8 w-full max-w-md">
								<CardContent className="p-8">
									<form onSubmit={handleSubmit} className="space-y-6">
										<div>
											<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
												Nombre completo
											</label>
											<Input
												id="name"
												type="text"
												placeholder="Ingresa tu nombre completo"
												value={name}
												onChange={(e) => setName(e.target.value)}
												className="w-full"
												required
											/>
										</div>

										<div>
											<label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
												Número de teléfono
											</label>
											<Input
												id="phone"
												type="tel"
												placeholder="+56 9 1234 5678"
												value={phone}
												onChange={(e) => setPhone(e.target.value)}
												className="w-full"
												required
												aria-invalid={!isValidPhone}
											/>
											{!isValidPhone && phone !== "" && (
												<p className="text-red-500 text-xs mt-1">Formato de teléfono inválido. Ej: +56 9 1234 5678</p>
											)}
										</div>

										<div className="flex items-center space-x-2">
											<Checkbox
												id="terms"
												checked={acceptedTerms}
												onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
												required
											/>
											<label
												htmlFor="terms"
												className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
											>
												Acepto{" "}
												<a
													href="https://www.urbai.cl/legal/terms"
													target="_blank"
													rel="noopener noreferrer"
													className="text-[#625BF6] hover:underline"
												>
													términos y condiciones
												</a>
											</label>
										</div>

										<Button
											type="submit"
											className="w-full bg-[#625BF6] hover:bg-[#5048E5] text-white font-medium py-3 transition-colors"
											disabled={!name || !phone || !acceptedTerms || !isValidPhone || isLoading}
										>
											{isLoading ? "Enviando..." : "Recibir WhatsApp"}
										</Button>

										<Button
											variant="outline"
											className="w-full border-[#625BF6] text-[#625BF6] hover:bg-[#625BF6] hover:text-white transition-colors bg-transparent text-sm"
											onClick={() => console.log("Continuar con Google")}
										>
											Continuar con Google
										</Button>
									</form>
									{submissionMessage && (
										<div className="mt-4 text-center text-sm text-gray-600" aria-live="polite">
											{submissionMessage}
										</div>
									)}
									<p className="text-xs text-gray-500 mt-4 text-center">
										Al registrarte recibirás un mensaje de activación por WhatsApp. No compartiremos tu número. Nunca.
									</p>
								</CardContent>
							</Card>
						</div> */}

						{/* Content - Right Side */}
						<div>
							<h2 className="text-4xl font-bold text-gray-900 mb-6">Comienza en 2 minutos</h2>

							<p className="text-xl text-gray-600 mb-8 leading-relaxed">
								Urbai permite a profesionales y actores del sector construcción acceder a información clara y
								actualizada sobre la normativa aplicable a sus proyectos, en segundos y desde cualquier dispositivo, a
								través de nuestra web app o WhatsApp.
							</p>

							<div>
								<div className="space-y-6">
									<div className="flex items-start">
										<div className="flex-shrink-0 text-2xl mr-4">1️⃣</div>
										<div>
											<span className="font-semibold text-gray-900">Ingresa a Urbai</span>
											<br />
											<span className="text-gray-600">Crea una cuenta y registrate.</span>
										</div>
									</div>

									<div className="flex items-start">
										<div className="flex-shrink-0 text-2xl mr-4">2️⃣</div>
										<div>
											<span className="font-semibold text-gray-900">Haz consultas</span>
											<br />
											<span className="text-gray-600">Accede desde la web app o desde WhatsApp.</span>
										</div>
									</div>

									<div className="flex items-start">
										<div className="flex-shrink-0 text-2xl mr-4">3️⃣</div>
										<div>
											<span className="font-semibold text-gray-900">Recibe respuestas</span>
											<br />
											<span className="text-gray-600">Normativa precisa y actualizada al instante.</span>
										</div>
									</div>
								</div>
								<p className="text-sm text-gray-500 mt-6">Tiempo medio de activación: {"<"} 2 min.</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="caracteristicas" className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">Características</h2>
						<p className="text-xl text-gray-600">Funciones clave que hacen de Urbai tu aliado perfecto</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{features.map((feature, index) => (
							<div
								key={index}
								className="rounded-xl p-6 border border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
							>
								{/* Header Section - Fixed Height */}
								<div className="flex items-start mb-6 min-h-[90px]">
									<div className="p-3 bg-[#625BF6]/10 rounded-lg mr-4 flex-shrink-0">
										<feature.icon className="h-7 w-7 text-[#625BF6]" />
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{feature.title}</h3>
										<p className="text-base text-[#625BF6] font-semibold leading-tight">{feature.subtitle}</p>
									</div>
								</div>

								{/* Description Section - Flexible Height */}
								<div className="flex-1 flex items-start">
									<p className="text-gray-600 leading-relaxed text-base">{feature.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Library Section */}
			<section id="libreria" className="py-20 bg-gray-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">Librería normativa</h2>
						<p className="text-xl text-gray-600 mb-8">Explora todo el contenido que respalda tus decisiones</p>

						{/* Search Bar */}
						{/* <div className="max-w-2xl mx-auto relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
							<Input
								type="text"
								placeholder="Buscar por palabra clave, tipo de documento, comuna..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-[#625BF6] rounded-lg"
							/>
						</div> */}

						{/* Modificando el botón para mostrar restricción en lugar de abrir directamente el modal */}
						{/* <div className="mt-6">
							<Button
								onClick={() => setShowRequestRestrictionModal(true)}
								className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
							>
								<Plus className="h-5 w-5 mr-2" />
								Solicitar nuevo documento
							</Button>
						</div> */}
					</div>

					{/* Featured Documents */}
					{/* <div className="mb-12">
						<h3 className="text-2xl font-bold text-gray-900 mb-6">Recién añadidos</h3>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[
								...featuredDocuments,
								{
									title: "Circular DDU 227 - Estacionamientos",
									category: "Circular DDU",
									date: "2024",
									description: "Normativa sobre estacionamientos en edificaciones",
								},
								{
									title: "PRC Las Condes - Actualización 2024",
									category: "PRC",
									date: "2024",
									description: "Plan Regulador Comunal actualizado",
								},
								{
									title: "Ordenanza Local de Construcción",
									category: "Ordenanza",
									date: "2023",
									description: "Normativas locales de construcción",
								},
								{
									title: "Ley General de Urbanismo Actualizada",
									category: "LGUC",
									date: "2024",
									description: "Ley General de Urbanismo y Construcciones",
								},
								{
									title: "Manual de Vialidad Urbana",
									category: "Manual",
									date: "2023",
									description: "Especificaciones técnicas de vialidad",
								},
								{
									title: "Normas Sísmicas NCh433",
									category: "Norma",
									date: "2024",
									description: "Normas de diseño sísmico",
								},
							].map((doc, index) => {
								const getHierarchyColor = (category: string) => {
									if (category.toLowerCase().includes("constitución"))
										return "bg-red-500/10 text-red-600 border-red-500/20"
									if (category.toLowerCase().includes("ley") || category.toLowerCase().includes("lguc"))
										return "bg-orange-500/10 text-orange-600 border-orange-500/20"
									if (
										category.toLowerCase().includes("reglamento") ||
										category.toLowerCase().includes("decreto") ||
										category.toLowerCase().includes("ordenanza")
									)
										return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
									if (category.toLowerCase().includes("plan") || category.toLowerCase().includes("prc"))
										return "bg-blue-500/10 text-blue-600 border-blue-500/20"
									if (category.toLowerCase().includes("circular"))
										return "bg-green-500/10 text-green-600 border-green-500/20"
									return "bg-gray-500/10 text-gray-600 border-gray-500/20"
								}

								return (
									<Card
										key={index}
										className="border border-gray-200 hover:border-[#625BF6] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
									>
										<CardContent className="p-6">
											<div className="flex justify-between items-start mb-3">
												<div className="flex-1 min-w-0">
													<h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight truncate">
														{doc.title}
													</h4>
													<div className="flex items-center gap-1 mb-2 flex-wrap">
														<span
															className={`text-xs px-2 py-1 rounded-full truncate max-w-[80px] border ${getHierarchyColor(doc.category)}`}
														>
															{doc.category}
														</span>
														<span className="text-xs text-gray-500">{doc.date}</span>
														<span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">PDF</span>
													</div>
												</div>
												<Button variant="ghost" size="sm" className="p-1 h-8 w-8 flex-shrink-0">
													<Star className="h-4 w-4 text-gray-400 hover:text-yellow-500" />
												</Button>
											</div>
											<Button size="sm" className="w-full bg-[#625BF6] hover:bg-[#5048E5] text-white">
												Ver documento
											</Button>
										</CardContent>
									</Card>
								)
							})}
						</div>
					</div> */}

					{/* Categories Grid */}
					{/* <div className="grid lg:grid-cols-4 gap-8">

						<div className="lg:col-span-1">
							<h3 className="text-xl font-bold text-gray-900 mb-6">Categorías</h3>
							<div className="space-y-2">
								<Button
									variant={selectedCategory === "Todos" ? "default" : "ghost"}
									className={`w-full justify-start text-left ${selectedCategory === "Todos" ? "bg-[#625BF6] text-white" : "text-gray-700 hover:bg-gray-100"}`}
									onClick={() => setSelectedCategory("Todos")}
								>
									<BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
									<span className="truncate">Todos los documentos</span>
								</Button>
								{libraryCategories.map((category, index) => (
									<Button
										key={index}
										variant={selectedCategory === category.name ? "default" : "ghost"}
										className={`w-full justify-between text-left text-sm ${selectedCategory === category.name ? "bg-[#625BF6] text-white" : "text-gray-700 hover:bg-gray-100"} min-h-[40px]`}
										onClick={() => setSelectedCategory(category.name)}
									>
										<div className="flex items-center min-w-0 flex-1">
											<category.icon className="h-4 w-4 mr-2 flex-shrink-0" />
											<span className="truncate text-xs">{category.name}</span>
										</div>
										<span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full ml-2 flex-shrink-0">
											{category.count}
										</span>
									</Button>
								))}
							</div>
						</div>

						<div className="lg:col-span-3">
							<div className="flex justify-between items-center mb-6">
								<h3 className="text-xl font-bold text-gray-900 truncate">
									{selectedCategory === "Todos" ? "Todos los documentos" : selectedCategory}
								</h3>
								<Button variant="outline" size="sm" onClick={() => setShowFiltersModal(true)}>
									<Filter className="h-4 w-4 mr-2" />
									Filtros
								</Button>
							</div>

							<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
								{getFilteredDocuments().map((doc, index) => {
									const getHierarchyColor = (category: string) => {
										if (category.toLowerCase().includes("constitución"))
											return "bg-red-500/10 text-red-600 border-red-500/20"
										if (category.toLowerCase().includes("ley"))
											return "bg-orange-500/10 text-orange-600 border-orange-500/20"
										if (category.toLowerCase().includes("reglamento") || category.toLowerCase().includes("decreto"))
											return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
										if (category.toLowerCase().includes("plan") || category.toLowerCase().includes("prc"))
											return "bg-blue-500/10 text-blue-600 border-blue-500/20"
										return "bg-gray-500/10 text-gray-600 border-gray-500/20"
									}

									return (
										<Card
											key={index}
											className="border border-gray-200 hover:border-[#625BF6] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
										>
											<CardContent className="p-6">
												<div className="flex justify-between items-start mb-3">
													<div className="flex-1 min-w-0">
														<h4 className="font-semibold text-gray-900 mb-2 text-sm leading-tight truncate">
															{doc.title}
														</h4>
														<div className="flex items-center gap-1 mb-2 flex-wrap">
															<span
																className={`text-xs px-2 py-1 rounded-full truncate max-w-[80px] border ${getHierarchyColor(doc.category)}`}
															>
																{doc.category}
															</span>
															<span className="text-xs text-gray-500">{doc.year}</span>
															<span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{doc.type}</span>
														</div>
														<p className="text-xs text-gray-500">{doc.comuna}</p>
													</div>
													<Button variant="ghost" size="sm" className="p-1 h-8 w-8 flex-shrink-0">
														<Star className="h-4 w-4 text-gray-400 hover:text-yellow-500" />
													</Button>
												</div>
												<Button size="sm" className="w-full bg-[#625BF6] hover:bg-[#5048E5] text-white">
													Ver documento
												</Button>
											</CardContent>
										</Card>
									)
								})}
							</div>

							<div className="text-center mt-8">
								<Button
									variant="outline"
									className="border-[#625BF6] text-[#625BF6] hover:bg-[#625BF6] hover:text-white bg-transparent"
								>
									Cargar más documentos
								</Button>
							</div>
						</div>
					</div> */}

					<div className="mt-12">
						<h3 className="text-2xl font-bold text-gray-900 mb-6">Jerarquía Normativa</h3>
						<div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
							<h4 className="text-lg font-semibold text-gray-900 mb-3">¿Cómo funciona la jerarquía normativa?</h4>
							<p className="text-gray-700 leading-relaxed">
								Cada nivel normativo tiene un orden de prevalencia. La Constitución es la norma suprema, seguida por las
								leyes, luego los reglamentos, después los planes territoriales y finalmente la normativa administrativa.
								Este orden ayuda a resolver contradicciones cuando distintas normas parecen entrar en conflicto.
							</p>
						</div>
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
								{[
									{ name: "Constitución", color: "bg-red-100 text-red-800 border-red-200" },
									{ name: "Leyes", color: "bg-orange-100 text-orange-800 border-orange-200" },
									{ name: "Reglamentos", color: "bg-yellow-100 text-black border-yellow-200" },
									{ name: "Planes", color: "bg-blue-100 text-blue-800 border-blue-200" },
									{ name: "Normativa Administrativa", color: "bg-green-100 text-green-800 border-green-200" },
								].map((item) => (
									<button
										key={item.name}
										onClick={() => handleHierarchyClick(item.name)}
										className={`${item.color} rounded-lg p-4 text-center hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer font-medium leading-4 tracking-normal border-2 my-2.5`}
									>
										{item.name}
									</button>
								))}
							</div>

							<p className="text-sm text-blue-800 text-center">
								<strong>Orden de prevalencia:</strong> Constitución → Leyes → Reglamentos → Planes Territoriales →
								Normativa Administrativa
							</p>
						</div>
					</div>

					{/* {selectedHierarchy && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
							<div className="bg-white rounded-lg max-w-md w-full p-6">
								<div className="flex justify-between items-center mb-4">
									<h3 className="text-lg font-semibold text-gray-900">{selectedHierarchy}</h3>
									<button
										onClick={handleCloseModal}
										className="text-gray-400 hover:text-gray-600 transition-colors"
										type="button"
									>
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
										</svg>
									</button>
								</div>
								<p className="text-gray-700 leading-relaxed whitespace-pre-line">
									{hierarchyDescriptions[selectedHierarchy as keyof typeof hierarchyDescriptions]}
								</p>
							</div>
						</div>
					)}

					{showRequestRestrictionModal && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
							<div className="bg-white rounded-lg max-w-md w-full">
								<div className="p-6">
									<div className="flex justify-between items-center mb-4">
										<h3 className="text-xl font-bold text-gray-900">Desbloquea documentos bajo demanda</h3>
										<Button variant="ghost" size="sm" onClick={() => setShowRequestRestrictionModal(false)}>
											<X className="h-4 w-4" />
										</Button>
									</div>

									<div className="mb-6">
										<div className="flex items-center justify-center mb-4">
											<div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
												<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														strokeWidth={2}
														d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
													/>
												</svg>
											</div>
										</div>

										<p className="text-gray-600 text-center mb-4">
											La función de <strong>solicitar nuevos documentos</strong> está disponible únicamente para
											usuarios de los planes <strong>Pro</strong> y <strong>Custom</strong>.
										</p>

										<p className="text-sm text-gray-500 text-center">
											Actualiza tu plan para acceder a esta funcionalidad y obtener documentos personalizados según tus
											necesidades.
										</p>
									</div>

									<div className="flex gap-3">
										<Button variant="outline" onClick={() => setShowRequestRestrictionModal(false)} className="flex-1">
											Cerrar
										</Button>
										<Button
											onClick={handleViewPlans}
											className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
										>
											Ver Planes
										</Button>
									</div>
								</div>
							</div>
						</div>
					)}

					{showRequestModal && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
							<div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
								<div className="p-6">
									<div className="flex justify-between items-center mb-4">
										<h3 className="text-xl font-bold text-gray-900">Solicitar nuevo documento</h3>
										<Button variant="ghost" size="sm" onClick={() => setShowRequestModal(false)}>
											<X className="h-4 w-4" />
										</Button>
									</div>

									<form onSubmit={handleRequestSubmit} className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Tipo de documento *</label>
											<select
												required
												value={requestForm.documentType}
												onChange={(e) => setRequestForm({ ...requestForm, documentType: e.target.value })}
												className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#625BF6]"
											>
												<option value="">Seleccionar tipo</option>
												<option value="PRC">Plan Regulador Comunal</option>
												<option value="PRDU">Plan Regional de Desarrollo Urbano</option>
												<option value="Circular DDU">Circular DDU</option>
												<option value="Límites Urbanos">Límites Urbanos</option>
												<option value="Plan Seccional">Plan Seccional</option>
												<option value="Ley">Ley</option>
												<option value="Decreto">Decreto</option>
												<option value="Otro">Otro</option>
											</select>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Nombre del documento *</label>
											<Input
												required
												value={requestForm.documentName}
												onChange={(e) => setRequestForm({ ...requestForm, documentName: e.target.value })}
												placeholder="Ej: Plan Regulador Comunal de Valparaíso"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Descripción adicional</label>
											<textarea
												value={requestForm.description}
												onChange={(e) => setRequestForm({ ...requestForm, description: e.target.value })}
												placeholder="Información adicional sobre el documento solicitado"
												className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#625BF6] h-20 resize-none"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo *</label>
											<Input
												required
												value={requestForm.contactName}
												onChange={(e) => setRequestForm({ ...requestForm, contactName: e.target.value })}
												placeholder="Tu nombre completo"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
											<Input
												required
												type="email"
												value={requestForm.contactEmail}
												onChange={(e) => setRequestForm({ ...requestForm, contactEmail: e.target.value })}
												placeholder="tu@email.com"
											/>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
											<Input
												value={requestForm.contactPhone}
												onChange={(e) => setRequestForm({ ...requestForm, contactPhone: e.target.value })}
												placeholder="+56 9 1234 5678"
											/>
										</div>

										<div className="flex gap-3 pt-4">
											<Button
												type="button"
												variant="outline"
												onClick={() => setShowRequestModal(false)}
												className="flex-1"
											>
												Cancelar
											</Button>
											<Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
												Enviar solicitud
											</Button>
										</div>
									</form>
								</div>
							</div>
						</div>
					)}

					{showFiltersModal && (
						<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
							<div className="bg-white rounded-lg max-w-md w-full">
								<div className="p-6">
									<div className="flex justify-between items-center mb-4">
										<h3 className="text-xl font-bold text-gray-900">Filtros</h3>
										<Button variant="ghost" size="sm" onClick={() => setShowFiltersModal(false)}>
											<X className="h-4 w-4" />
										</Button>
									</div>

									<div className="space-y-4">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Tipo de documento</label>
											<select
												value={filters.documentType}
												onChange={(e) => setFilters({ ...filters, documentType: e.target.value })}
												className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#625BF6]"
											>
												<option value="">Todos los tipos</option>
												<option value="PRC">Plan Regulador Comunal</option>
												<option value="PRDU">Plan Regional de Desarrollo Urbano</option>
												<option value="OGUC">OGUC</option>
												<option value="Circular DDU">Circular DDU</option>
												<option value="Límites Urbanos">Límites Urbanos</option>
												<option value="Plan Seccional">Plan Seccional</option>
											</select>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
											<select
												value={filters.year}
												onChange={(e) => setFilters({ ...filters, year: e.target.value })}
												className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#625BF6]"
											>
												<option value="">Todos los años</option>
												<option value="2024">2024</option>
												<option value="2023">2023</option>
												<option value="2022">2022</option>
												<option value="2021">2021</option>
											</select>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Región</label>
											<select
												value={filters.region}
												onChange={(e) => setFilters({ ...filters, region: e.target.value })}
												className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#625BF6]"
											>
												<option value="">Todas las regiones</option>
												<option value="Nacional">Nacional</option>
												<option value="Metropolitana">Región Metropolitana</option>
												<option value="Valparaíso">Región de Valparaíso</option>
												<option value="Biobío">Región del Biobío</option>
											</select>
										</div>

										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Ordenar por</label>
											<select
												value={filters.sortBy}
												onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
												className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#625BF6]"
											>
												<option value="recent">Más recientes</option>
												<option value="alphabetical">Orden alfabético</option>
											</select>
										</div>

										<div className="flex gap-3 pt-4">
											<Button
												variant="outline"
												onClick={() => {
													setFilters({
														documentType: "",
														year: "",
														region: "",
														sortBy: "recent",
													})
												}}
												className="flex-1"
											>
												Limpiar filtros
											</Button>
											<Button
												onClick={() => setShowFiltersModal(false)}
												className="flex-1 bg-[#625BF6] hover:bg-[#5048E5] text-white"
											>
												Aplicar filtros
											</Button>
										</div>
									</div>
								</div>
							</div>
						</div>
					)} */}
				</div>
			</section>

			{/* Pricing Plans */}
			<section id="planes" className="py-20 bg-white">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">Planes</h2>
						<p className="text-xl text-gray-600 mb-8">Elige el plan que mejor se adapte a tus necesidades</p>
					</div>

					{/* All Plans in One Row */}
					<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
						{/* Starter Plan */}
						<Card className="border-2 border-gray-200 hover:border-[#625BF6] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
							<CardHeader className="text-center pb-4 min-h-36">
								<CardTitle className="text-gray-900 text-lg mb-2">Starter</CardTitle>
								<div className="mb-2">
									<div className="text-xl font-bold text-gray-900">
										<div className="flex items-center justify-center space-x-2">
											<div className="flex items-start justify-center font-bold text-gray-900 space-x-1">
												<span className="text-3xl">$</span>
												<span className="text-3xl">0</span>
											</div>
											<div className="flex flex-col items-start justify-center -space-y-1">
												<span className="text-xs">CLP</span>
												<span className="text-xs">al mes</span>
											</div>
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4 text-sm min-h-96">

								<div className="text-center">
									<div className="text-gray-700 mb-3">Acceso a toda la Librería Normativa</div>
								</div>

								<div>
									<p className="font-bold text-gray-900 mb-1.5">Consultas por mes</p>
									<p className="text-lg font-bold text-[#625BF6]">15</p>
								</div>

								<div className="mb-6">
									<h4 className="font-semibold text-gray-900 mb-1.5 text-xs lg:text-sm">Servicios adicionales</h4>
									<div className="text-gray-700">
										<ul className="list-disc list-inside space-y-2">
											<li>Proyectos ilimitados</li>
										</ul>
									</div>
								</div>

							</CardContent>

							<CardFooter>
								<Button
									className="w-full bg-[#625BF6] hover:bg-[#5048E5] text-white font-medium transition-colors text-sm"
									onClick={() => router.push("/create-account")}
								>
									Comienza gratis
								</Button>
							</CardFooter>
						</Card>

						{/* Basics Plan */}
						<Card className="border-2 border-gray-200 hover:border-[#625BF6] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
							<CardHeader className="text-center pb-4 min-h-36">
								<CardTitle className="text-gray-900 text-lg mb-2">Basics</CardTitle>
								<div className="mb-2">
									<div className="text-xl font-bold text-gray-900">
										<div className="flex items-center justify-center space-x-2">
											<div className="flex items-start justify-center font-bold text-gray-900 space-x-1">
												<span className="text-3xl">$</span>
												<span className="text-3xl">5.990</span>
											</div>
											<div className="flex flex-col items-start justify-center -space-y-1">
												<span className="text-xs">CLP</span>
												<span className="text-xs">al mes</span>
											</div>
										</div>
									</div>
									<p className="text-sm font-medium text-gray-600 mt-2">(antes $9.990)</p>
								</div>
							</CardHeader>
							<CardContent className="space-y-4 text-sm min-h-96">
								<div className="text-center">
									<div className="text-gray-700 mb-3">Acceso a toda la Librería Normativa</div>
								</div>

								<div>
									<p className="font-bold text-gray-900 mb-1.5">Consultas por mes</p>
									<p className="text-lg font-bold text-[#625BF6]">150</p>
								</div>

								<div className="mb-6">
									<h4 className="font-semibold text-gray-900 mb-1.5 text-xs lg:text-sm">Servicios adicionales</h4>
									<div className="text-gray-700">
										<ul className="list-disc list-inside space-y-2">
											<li>Proyectos ilimitados</li>
											<li>Soporte por correo electrónico</li>
										</ul>
									</div>
								</div>
							</CardContent>
							<CardFooter className="flex flex-col gap-2">
								<Button
									className="w-full bg-[#625BF6] hover:bg-[#5048E5] text-white font-medium transition-colors text-sm"
									onClick={() => router.push("/app/billing")}
								>
									Comprar
								</Button>
								<Button
									variant="outline"
									className="w-full border-[#625BF6] text-[#625BF6] hover:bg-[#625BF6] hover:text-white text-sm bg-transparent"
									onClick={() => router.push("/create-account")}
								>
									Prueba gratis
								</Button>
							</CardFooter>
						</Card>

						{/* Pro Plan */}
						<Card className="border-2 border-[#625BF6] bg-gradient-to-br from-[#625BF6]/5 to-[#625BF6]/10 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative">
							<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
								<span className="bg-[#625BF6] text-white px-3 py-1 rounded-full text-xs font-medium">Recomendado</span>
							</div>
							<CardHeader className="text-center pb-4 min-h-36">
								<CardTitle className="text-gray-900 text-lg mb-2">Pro</CardTitle>
								<div className="mb-2">
									<div className="text-xl font-bold text-gray-900">
										<div className="flex items-center justify-center space-x-2">
											<div className="flex items-start justify-center font-bold text-gray-900 space-x-1">
												<span className="text-3xl">$</span>
												<span className="text-3xl">14.990</span>
											</div>
											<div className="flex flex-col items-start justify-center -space-y-1">
												<span className="text-xs">CLP</span>
												<span className="text-xs">al mes</span>
											</div>
										</div>
									</div>
									<p className="text-sm font-medium text-gray-600 mt-2">(antes $24.990)</p>
								</div>
							</CardHeader>
							<CardContent className="space-y-4 text-sm min-h-96">
								<div className="text-center">
									<div className="text-gray-700 mb-3">Mismo catálogo que tienes en Basics</div>
								</div>

								<div>
									<p className="font-bold text-gray-900 mb-1.5">Consultas por mes</p>
									<p className="text-lg font-bold text-[#625BF6]">1.500</p>
								</div>

								<div className="mb-6">
									<h4 className="font-semibold text-gray-900 mb-1.5 text-xs lg:text-sm">Servicios adicionales</h4>
									<div className="text-gray-700">
										<ul className="list-disc list-inside space-y-2">
											<li>Soporte prioritario por chat (respuesta prioritaria {"<"} 24 h).</li>
											<li>Solicitud de incorporación de nuevos documentos a la Librería.</li>
											<li>Acceso anticipado a nuevas funciones y betas (opt-in).</li>
										</ul>
									</div>
								</div>

							</CardContent>
							<CardFooter className="flex flex-col gap-2">
								<Button
									className="w-full bg-[#625BF6] hover:bg-[#5048E5] text-white font-medium transition-colors text-sm"
									onClick={() => router.push("/app/billing")}
								>
									Comprar
								</Button>
								<Button
									variant="outline"
									className="w-full border-[#625BF6] text-[#625BF6] hover:bg-[#625BF6] hover:text-white text-sm bg-transparent"
									onClick={() => router.push("/create-account")}
								>
									Prueba gratis
								</Button>
							</CardFooter>
						</Card>

						{/* Educacional Plan */}
						<Card className="border-2 border-gray-200 hover:border-[#625BF6] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
							<CardHeader className="text-center pb-4 min-h-36">
								<CardTitle className="text-gray-900 text-lg mb-2">Educacional</CardTitle>
								<div className="mb-2">
									<div className="text-xl font-bold text-gray-900">
										<div className="flex items-center justify-center space-x-2">
											<div className="flex items-start justify-center font-bold text-gray-900 space-x-1">
												<span className="text-3xl">$</span>
												<span className="text-3xl">0</span>
											</div>
											<div className="flex flex-col items-start justify-center -space-y-1">
												<span className="text-xs">CLP</span>
												<span className="text-xs">al mes</span>
											</div>
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent className="space-y-4 text-sm min-h-96">
								<div className="text-center">
									<div className="text-gray-700 mb-3">Mismo catálogo que tienes en Pro</div>
								</div>

								<div>
									<p className="font-bold text-gray-900 mb-1.5">Consultas por mes</p>
									<p className="text-lg font-bold text-green-600">150</p>
								</div>

								<div className="mb-6">
									<h4 className="font-semibold text-gray-900 mb-1.5 text-xs lg:text-sm">Servicios adicionales</h4>
									<div className="text-gray-700">
										<ul className="list-disc list-inside space-y-2">
											<li>Licencia renovable hasta terminar tus estudios</li>
											<li>Registro con e-mail académico (estudiantes y docentes)</li>
										</ul>
									</div>
								</div>

							</CardContent>
							<CardFooter>
								<Button
									className="w-full bg-green-600 hover:bg-green-700 text-white font-medium transition-colors text-sm"
									onClick={() => router.push("/create-account")}
								>
									Regístrate gratis
								</Button>
							</CardFooter>
						</Card>

						{/* Custom Plan */}
						<Card className="border-2 border-gray-200 hover:border-[#625BF6] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
							<CardHeader className="text-center pb-4 min-h-36">
								<CardTitle className="text-gray-900 text-lg mb-2">Custom</CardTitle>
								<div className="mb-2">
									<p className="text-sm font-medium text-gray-600 mt-2">A convenir</p>
								</div>
							</CardHeader>
							<CardContent className="space-y-4 text-sm min-h-96">

								<div className="text-center">
									<div className="text-gray-700 mb-3">Mismo catálogo que tienes en Pro</div>
								</div>

								<div>
									<p className="font-bold text-gray-900 mb-1.5">Consultas por mes</p>
									<p className="text-lg font-bold text-[#625BF6]">Ilimitadas</p>
								</div>

								<div className="mb-6">
									<h4 className="font-semibold text-gray-900 mb-1.5 text-xs lg:text-sm">Servicios adicionales</h4>
									<div className="text-gray-700">
										<ul className="list-disc list-inside space-y-2">
											<li>API y workflows a medida</li>
											<li>Integración en tu aplicación, sitio web o intranet</li>
											<li>Soporte 24/7</li>
											<li>Licencias en volumen para instituciones o empresas</li>
										</ul>
									</div>
								</div>

							</CardContent>
							<CardFooter>
								<Button
									className="w-full bg-[#625BF6] hover:bg-[#5048E5] text-white font-medium transition-colors text-sm"
									onClick={() => window.open("mailto:contacto@urbai.cl?subject=Consulta Plan Custom", "_blank")}
								>
									Contactar ventas
								</Button>
							</CardFooter>
						</Card>
					</div>

					<div className="text-center mt-12">
						<p className="text-gray-600 mb-4">¿Necesitas ayuda para elegir el plan correcto?</p>
						<Button
							variant="outline"
							className="border-[#625BF6] text-[#625BF6] hover:bg-[#625BF6] hover:text-white bg-transparent"
							onClick={() => window.open("mailto:hola@urbai.cl?subject=Consulta Plan", "_blank")}
						>
							<WhatsAppIcon className="mr-2 h-4 w-4" />
							Hablar con un experto
						</Button>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section id="faq" className="py-20 bg-gray-50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-bold text-gray-900 mb-4">Preguntas frecuentes</h2>
						<p className="text-xl text-gray-600">Resolvemos las dudas más comunes sobre Urbai</p>
					</div>

					<div className="space-y-4">
						{faqData.map((faq, index) => (
							<Card key={index} className="border border-gray-200 hover:border-[#625BF6] transition-colors">
								<CardContent className="p-0">
									<button
										className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-[#625BF6] focus:ring-inset"
										onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
									>
										<div className="flex justify-between items-center">
											<h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
											<ChevronDown
												className={`h-5 w-5 text-gray-500 transition-transform ${openFAQ === index ? "rotate-180" : ""}`}
											/>
										</div>
									</button>
									{openFAQ === index && (
										<div className="px-6 pb-6">
											<div className="text-gray-600 leading-relaxed">{faq.answer}</div>
										</div>
									)}
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Final Message Section */}
			<section className="py-16 bg-gray-50">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<h2 className="font-bold text-gray-900 mb-4 text-5xl">
						Comienza con <span className="text-[#625BF6]">Urbai</span> hoy
					</h2>
					<p className="text-lg text-gray-600 mb-8">Elige tu forma preferida de trabajar con normativa</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<Button
							className="bg-[#625BF6] hover:bg-[#5048E5] text-white px-8 py-3 text-lg font-semibold"
							onClick={() => router.push("/app")}
						>
							Plataforma Web
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
						{/* <Button
							variant="outline"
							className="border-[#625BF6] text-[#625BF6] hover:bg-[#625BF6] hover:text-white px-8 py-3 text-lg font-semibold bg-transparent"
						>
							Usar en WhatsApp
						</Button> */}
					</div>
				</div>
			</section>

			<footer className="bg-white border-t border-gray-200 py-12">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
						{/* Left: Urbai Logo */}
						<div className="flex justify-center lg:justify-start">
							<Image src="/images/urbai-logo.png" alt="Urbai" width={120} height={40} className="h-8 w-auto" />
						</div>

						{/* Center: Contact sections in 4 columns */}
						<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 col-span-1 lg:col-span-2">
							<div className="flex flex-col items-center lg:items-start">
								<h3 className="text-sm font-semibold text-gray-900 mb-4">Contacto</h3>
								<div className="space-y-2 text-sm text-gray-600">
									<a href="mailto:hola@urbai.cl" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#625BF6] transition-colors">hola@urbai.cl</a>
								</div>
							</div>

							<div className="flex flex-col items-center lg:items-start">
								<h3 className="text-sm font-semibold text-gray-900 mb-4">Síguenos</h3>
								<div className="flex flex-col gap-2 text-sm text-gray-600">
									<a href="https://www.linkedin.com/company/urbai" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#625BF6] transition-colors">LinkedIn</a>
									<a href="https://www.instagram.com/urbai_cl/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#625BF6] transition-colors">Instagram</a>
								</div>
							</div>

							<div className="flex flex-col items-center lg:items-start">
								<h3 className="text-sm font-semibold text-gray-900 mb-4">Ubicación</h3>
								<div className="space-y-2 text-sm text-gray-600">
									<p>Santiago, Chile</p>
								</div>
							</div>

							<div className="flex flex-col items-center lg:items-start">
								<h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
								<div className="flex flex-col gap-2 text-sm text-gray-600">
									<a href="/legal/terms" rel="noopener noreferrer" className="text-gray-600 hover:text-[#625BF6] transition-colors">Términos y Condiciones</a>
									<a href="/legal/privacy" rel="noopener noreferrer" className="text-gray-600 hover:text-[#625BF6] transition-colors">Política de Privacidad</a>
								</div>
							</div>
						</div>

						{/* Right: Meta and WhatsApp Provider badges */}
						<div className="flex justify-center lg:justify-end">
							<Image
								src="/images/meta-whatsapp-providers.png"
								alt="Meta and WhatsApp Business Providers"
								width={200}
								height={100}
								className="h-auto max-w-full"
								style={{ objectFit: "contain" }}
							/>
						</div>
					</div>

					<div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
						<p>© 2025 Urbai. Todos los derechos reservados.</p>
					</div>
				</div>
			</footer>
		</div>
	)
}
