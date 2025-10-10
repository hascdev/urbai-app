import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
})

export const metadata: Metadata = {
	title: "Urbai - Normativa inteligente para construcción",
	description: "Asistente de IA especializado en normativa de construcción y urbanismo en Chile",
	generator: "v0.app",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="es" className={`${inter.variable} antialiased`}>
			<body className="font-sans">
				<Suspense fallback={null}>{children}</Suspense>
				<Analytics />
				<Toaster />
			</body>
		</html>
	)
}
