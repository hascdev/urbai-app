import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppTopbar } from "@/components/app-topbar"
import { Trash2 } from "lucide-react"
import UserForm from "@/components/user-form"
import { createClient } from "@/utils/supabase/server"
import { fetchSubscription, fetchUser } from "@/lib/user-data"
import { redirect } from "next/navigation"
import { UpgradeBanner } from "@/components/upgrade-banner"

export default async function AccountPage() {

	const supabase = await createClient()
	const { data: { user } } = await supabase.auth.getUser()

	if (!user) {
		redirect('/create-account')
	}

	const currentUser = await fetchUser(user);

	return (
		<div className="min-h-screen bg-white">
			<AppTopbar />

			<main className="max-w-7xl mx-auto px-6 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Mi cuenta</h1>
					<p className="text-gray-600">Gestiona tu perfil, preferencias y configuración de cuenta.</p>
				</div>

				<div className="flex flex-col gap-8">

					<div className="grid lg:grid-cols-3 gap-8">

						{/* Profile Information */}
						<Card className="w-full mx-auto lg:col-span-2">
							<CardContent className="p-6">
								<div className="flex flex-col gap-8">
									<div className='grid grid-cols-2 gap-4'>
										<div className='flex flex-col gap-2'>
											<h1 className="text-lg font-medium tracking-tight">
												Información de tu cuenta
											</h1>
											<p className="text-sm text-muted-foreground">
												{currentUser.active ? "Tu cuenta ya está activa, puedes actualizar tu información." : "Al actualizar tu información, recibirás un mensaje a tu número de whatsapp."}
											</p>
										</div>
										<UserForm user={currentUser} />
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Upgrade Banner */}
						<UpgradeBanner subscription={currentUser.subscription} active={currentUser.active} />

					</div>

					{/* Danger Zone */}
					<Card className="bg-white border-red-200 shadow-sm">
						<CardHeader>
							<CardTitle className="text-red-600">Zona de peligro</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-between">
								<div>
									<p className="font-medium text-gray-900">Eliminar cuenta</p>
									<p className="text-sm text-gray-600">
										Elimina permanentemente tu cuenta y todos los datos asociados
									</p>
								</div>
								<Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent">
									<Trash2 className="h-4 w-4 mr-2" />
									Eliminar cuenta
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	)
}
