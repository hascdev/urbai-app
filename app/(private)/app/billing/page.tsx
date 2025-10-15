"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AppTopbar } from "@/components/app-topbar"
import { useAuth } from "@/hooks/use-auth"
import { Download, Calendar, AlertCircle, Star, Zap, Crown } from "lucide-react"
import { useRouter } from "next/navigation"
import { createPreference } from "@/lib/mercadopago-action"
import { toast } from "sonner"

const plans = [
	{
		id: "7fdfdef2-6352-474f-88f3-952c12df10f0",
		name: "Starter",
		description: "Acceso a toda la Librería Normativa",
		price: 0,
		currency: "CLP",
		period: "mes",
		subtitle: "",
		queries: "15",
		services: ["Proyectos ilimitados"],
		current: true,
		popular: false,
	},
	{
		id: "4056dcc9-5209-4138-8bb5-6373901eac84",
		name: "Basics",
		description: "Acceso a toda la Librería Normativa",
		price: 5990,
		currency: "CLP",
		period: "mes",
		subtitle: "(antes $9.990)",
		queries: "150",
		services: ["Proyectos ilimitados", "Soporte por correo electrónico"],
		current: false,
		popular: false,
	},
	{
		id: "72de63e7-f071-4ba4-bfe9-ba7b3c8eb292",
		name: "Pro",
		description: "Mismo catálogo que tienes en Basics",
		price: 14990,
		currency: "CLP",
		period: "mes",
		subtitle: "(antes $24.990)",		
		queries: "1.500",
		services: [
			"Soporte prioritario por chat (respuesta prioritaria < 24 h).",
			"Solicitud de incorporación de nuevos documentos a la Librería.",
			"Acceso anticipado a nuevas funciones y betas (opt-in).",
		],
		current: false,
		popular: true,
	},
	{
		id: "educacional",
		name: "Educacional",
		description: "Mismo catálogo que tienes en Pro",
		price: 0,
		currency: "CLP",
		period: "mes",
		subtitle: "",		
		queries: "150",
		services: [
			"Licencia renovable hasta terminar tus estudios",
			"Registro con e-mail académico (estudiantes y docentes)",
		],
		current: false,
		popular: false,
	},
	{
		id: "custom",
		name: "Custom",
		description: "Mismo catálogo que tienes en Pro",
		price: null,
		currency: "CLP",
		period: "A convenir",
		subtitle: "",		
		queries: "Ilimitadas",
		services: [
			"API y workflows a medida",
			"Integración en tu aplicación, sitio web o intranet",
			"Soporte 24/7",
			"Licencias en volumen para instituciones o empresas",
		],
		current: false,
		popular: false,
	},
]

export default function BillingPage() {

	const { user } = useAuth();
	const router = useRouter();

	const handleUpgrade = async (planId: string) => {
		console.log("handleUpgrade", planId);
		if (!user?.subscription?.id) {
			toast.info("No tienes una suscripción activa");
			return;
		}
		await createPreference({
			new_plan_id: planId,
			subscription_id: user?.subscription?.id
		})
	}

	const handleDownloadInvoice = (invoiceId: string) => {
		// Mock download
		alert(`Descargando factura ${invoiceId}...`)
	}

	return (
		<div className="min-h-screen bg-white">
			<AppTopbar />

			<main className="max-w-7xl mx-auto px-6 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Facturación</h1>
					<p className="text-gray-600">Gestiona tu suscripción, métodos de pago y facturas.</p>
				</div>

				<div className="grid lg:grid-cols-3 gap-8 mb-4">
					{/* Main Content */}
					<div className="lg:col-span-2 space-y-8">
						{/* Current Plan */}
						<Card className="bg-white border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-gray-900">Plan actual</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-start mb-4">
									<Badge className="bg-primary/10 text-primary border-primary/20 text-md hover:border-primary hover:bg-primary/10">
										{user?.subscription?.plan?.name?.toUpperCase() || "STARTER"}
									</Badge>
								</div>

								<div className="grid md:grid-cols-2 gap-4 mb-4">
									<div className="space-y-2">
										<p className="text-sm font-medium text-gray-700">Límites actuales:</p>
										<ul className="text-sm text-gray-600 space-y-1">
											<li>• Acceso a toda la Librería Normativa</li>
											<li>• {user?.subscription?.plan?.queries} consultas al mes</li>
										</ul>
									</div>
								</div>

								{user?.subscription?.plan?.name === "Starter" && (
									<div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
										<div className="flex items-start space-x-3">
											<AlertCircle className="h-5 w-5 text-primary mt-0.5" />
											<div>
												<p className="font-medium text-primary">Actualiza para desbloquear más funciones</p>
												<p className="text-sm text-gray-600 mt-1">
													Accede a multi-documento, exportación PDF y herramientas avanzadas con el plan PRO.
												</p>
											</div>
										</div>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Payment Method */}
						{/* <Card className="bg-white border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-gray-900">Método de pago</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between">
									<div className="flex items-center space-x-3">
										<div className="p-2 bg-gray-100 rounded-lg">
											<CreditCard className="h-5 w-5 text-gray-600" />
										</div>
										<div>
											<p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
											<p className="text-sm text-gray-600">Expira 12/25</p>
										</div>
									</div>
									<Button variant="outline" className="border-gray-200 text-gray-700 bg-transparent">
										Actualizar
									</Button>
								</div>
							</CardContent>
						</Card> */}

						{/* Billing History */}
						{/* <Card className="bg-white border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-gray-900">Historial de facturación</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{mockInvoices.map((invoice) => (
										<div
											key={invoice.id}
											className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
										>
											<div className="flex items-center space-x-3">
												<Calendar className="h-4 w-4 text-gray-500" />
												<div>
													<p className="font-medium text-gray-900">{invoice.period}</p>
													<p className="text-sm text-gray-600">{new Date(invoice.date).toLocaleDateString()}</p>
												</div>
											</div>
											<div className="flex items-center space-x-3">
												<div className="text-right">
													<p className="font-medium text-gray-900">${invoice.amount.toLocaleString()} CLP</p>
													<Badge className="bg-green-500/10 text-green-600 text-xs">
														{invoice.status === "paid" ? "Pagado" : "Pendiente"}
													</Badge>
												</div>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => handleDownloadInvoice(invoice.id)}
													className="text-gray-600 hover:bg-gray-50"
												>
													<Download className="h-4 w-4" />
												</Button>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card> */}
					</div>

					{/* Sidebar */}
					<div className="space-y-6">

						{/* Support */}
						<Card className="bg-white border-gray-200 shadow-sm">
							<CardHeader>
								<CardTitle className="text-gray-900">Soporte</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								<p className="text-sm text-gray-600">
									¿Necesitas ayuda con tu facturación o tienes preguntas sobre los planes?
								</p>
								<Button variant="outline" onClick={() => router.push("mailto:hola@urbai.cl?subject=Consulta Soporte")} className="w-full border-gray-200 text-gray-700 bg-transparent">
									Contactar soporte
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>

				{/* Available Plans */}
				<section className="py-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Planes disponibles</h1>
					<p className="text-gray-600 mb-8">Elige el plan que mejor se adapte a tus necesidades</p>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
						{
							plans.map((plan) => {
								const isCurrent = plan.id === user?.subscription?.plan_id;
								return (
									<Card
										key={plan.id}
										className={`relative bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow ${plan.popular ? "ring-2 ring-primary" : ""
											}`}
									>
										{plan.popular && (
											<div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
												<Badge className="bg-primary text-white">Recomendado</Badge>
											</div>
										)}

										<CardHeader className="text-center pb-4 min-h-36">
											<CardTitle className="text-gray-900 text-lg mb-2">{plan.name}</CardTitle>
											<div className="mb-2">
												<div className="text-xl font-bold text-gray-900">
													{
														plan.price !== null ? (
															<div className="flex items-center justify-center space-x-2">
																<div className="flex items-start justify-center font-bold text-gray-900 space-x-1">
																	<span className="text-3xl">$</span>
																	<span className="text-3xl">{plan.price.toLocaleString("es-CL")}</span>
																</div>
																<div className="flex flex-col items-start justify-center -space-y-1">
																	<span className="text-xs">CLP</span>
																	<span className="text-xs">al {plan.period}</span>
																</div>
															</div>
														) : (
															<div className="text-3xl font-bold text-gray-900">{plan.period}</div>
														)
													}
												</div>
												{
													plan.subtitle && <p className="text-sm font-medium text-gray-600 mt-2">{plan.subtitle}</p>
												}
											</div>
										</CardHeader>

										<CardContent className="space-y-4 text-sm min-h-96">
											<div className="text-center">
												<div className="text-gray-700 mb-3">{plan.description}</div>
											</div>

											<div>
												<p className="font-bold text-gray-900 mb-1.5">Consultas por mes</p>
												<p className="text-lg font-bold text-[#625BF6]">{plan.queries}</p>
											</div>

											<div>
												<p className="font-bold text-gray-900 mb-1.5">Servicios adicionales</p>
												<div className="text-gray-700">
													<ul className="list-disc list-inside space-y-2">
														{
															plan.services.map((service) => (
																<li key={service}>{service}</li>
															))
														}
													</ul>
												</div>
											</div>
										</CardContent>

										<CardFooter>
											{
												plan.id === "educacional" ? (
													<Button
														onClick={() => router.push("mailto:hola@urbai.cl?subject=Consulta Plan Educacional")}
														className="w-full bg-primary hover:bg-primary/90 text-white"
													>
														Contactar
													</Button>
												) : plan.id === "custom" ? (
													<Button
														onClick={() => router.push("mailto:hola@urbai.cl?subject=Consulta Plan Custom")}
														className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
													>
														Contactar
													</Button>
												) : (
													<Button
														onClick={() => handleUpgrade(plan.id)}
														disabled={isCurrent}
														className={`w-full ${plan.popular
															? "bg-primary hover:bg-primary/90 text-white"
															: "bg-gray-100 hover:bg-gray-200 text-gray-700"
															}`}
													>
														{isCurrent ? "Plan actual" :  plan.id === "7fdfdef2-6352-474f-88f3-952c12df10f0" ? "Comienza gratis" : "Comprar"}
													</Button>
												)
											}
										</CardFooter>
									</Card>
								)
							})
						}
					</div>
				</section>
			</main>
		</div>
	)
}
