"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { User, LogOut } from "lucide-react"
import Image from "next/image"
import { signOutAction } from "@/lib/login-action"
import { useNotificationStore } from "@/stores/notification-store"
import { NotificationPopover } from "@/components/notification-popover"
import { FeedbackPopover } from "@/components/feedback-popover"

export function AppTopbar() {

	const [searchQuery, setSearchQuery] = useState("")
	const { user, logout } = useAuth()
	const router = useRouter()
	const { notifications, fetchNotifications } = useNotificationStore();

	useEffect(() => {	
		const loadNotifications = async () => {
			await fetchNotifications()
		}
		loadNotifications();
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			// Navigate to search results (will implement later)
			console.log("Searching for:", searchQuery)
		}
	}

	const handleCreateProject = () => {
		router.push("/app/projects/new")
	}

	const handleLibrary = () => {
		router.push("/app/library")
	}

	const handleLogout = async () => {
		await signOutAction()
		logout()
		router.push("/");
	}

	return (
		<header className="sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-sm shadow-sm">
			<div className="grid grid-cols-3 items-center px-6 py-3">
				{/* Logo and Home Link */}
				<div className="flex items-center space-x-4">
					<button
						onClick={() => router.push("/app/dashboard")}
						className="flex items-center hover:opacity-80 transition-opacity"
					>
						<Image src="/images/urbai-logo.png" alt="Urbai" width={120} height={40} className="h-8 w-auto" />
					</button>
				</div>

				{/* Navigation - Centered */}
				<nav className="hidden md:flex items-center justify-center space-x-1">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => router.push("/app/dashboard")}
						className="text-gray-700 hover:text-primary hover:bg-gray-50"
					>
						Inicio
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => router.push("/app/projects")}
						className="text-gray-700 hover:text-primary hover:bg-gray-50"
					>
						Proyectos
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={handleLibrary}
						className="text-gray-700 hover:text-primary hover:bg-gray-50"
					>
						Librería
					</Button>
					{/* <Button
						variant="ghost"
						size="sm"
						onClick={() => router.push("/app/herramientas")}
						className="text-gray-700 hover:text-primary hover:bg-gray-50"
					>
						Herramientas
					</Button> */}
					<Button
						variant="ghost"
						size="sm"
						onClick={() => router.push("/app/account")}
						className="text-gray-700 hover:text-primary hover:bg-gray-50"
					>
						Cuenta
					</Button>
				</nav>

				{/* Search Bar */}
				{/* 
				<div className="flex-1 max-w-md mx-6">
					<form onSubmit={handleSearch} className="relative">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
						<Input
							type="text"
							placeholder="Buscar documentos, proyectos..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-primary focus:ring-primary"
						/>
					</form>
				</div> 
				*/}

				{/* Actions */}
				<div className="flex items-center justify-end space-x-3">					
					<FeedbackPopover />
					<NotificationPopover notifications={notifications} />
					{/* User Menu */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="relative size-10 rounded-full">
								<Avatar className="size-10">
									<AvatarFallback className="bg-primary text-white text-sm">
										{user?.name?.charAt(0)?.toUpperCase() || "U"}
									</AvatarFallback>
								</Avatar>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56 bg-white border-gray-200">
							<div className="p-2 space-y-2">
								<p className="text-sm font-medium text-gray-900">{user?.name}</p>
								<p className="text-xs text-gray-600">{user?.email}</p>
							</div>
							<DropdownMenuSeparator className="bg-gray-200" />
							<DropdownMenuItem
								onClick={() => router.push("/app/account")}
								className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
							>
								<User className="mr-2 h-4 w-4" />
								Mi cuenta
							</DropdownMenuItem>
							{/* <DropdownMenuItem
								onClick={() => router.push("/app/billing")}
								className="text-gray-700 hover:bg-gray-50 focus:bg-gray-50"
							>
								<Settings className="mr-2 h-4 w-4" />
								Facturación
							</DropdownMenuItem> */}
							<DropdownMenuSeparator className="bg-gray-200" />
							<DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 focus:bg-red-50">
								<LogOut className="mr-2 h-4 w-4" />
								Cerrar sesión
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	)
}
