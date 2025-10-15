import { Card, CardContent } from "@/components/ui/card"
import { AppTopbar } from "@/components/app-topbar"
import UserForm from "@/components/user-form"
import { createClient } from "@/utils/supabase/server"
import { fetchUser } from "@/lib/user-data"
import { redirect } from "next/navigation"
import { UpgradeBanner } from "@/components/upgrade-banner"
import { DeleteAccountCard } from "@/components/delete-account-card"

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
					<DeleteAccountCard />
				</div>
			</main>
		</div>
	)
}
