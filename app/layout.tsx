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
	title: "Urbai - Normativa inteligente para urbanismo y construcción",
	description: "Agente de inteligencia artificial diseñado específicamente para ayudar a profesionales de la arquitectura, ingeniería y construcción.",
	keywords: "WhatsApp, AI, chatbot, agent, agente, normativas, construcción, arquitectura, ingeniería",
	icons: {
        other: [
            {
                rel: "urbai-192x192",
                url: "/images/urbai-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                rel: "urbai-512x512",
                url: "/images/urbai-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    },
	openGraph: {
        title: 'Urbai - Normativa inteligente para urbanismo y construcción',
        description: 'Agente de inteligencia artificial diseñado específicamente para ayudar a profesionales de la arquitectura, ingeniería y construcción.',
        url: "https://www.urbai.cl",
        images: [
            {
                url: "https://www.urbai.cl/images/urbai-logo.png",
                secureUrl: "https://www.urbai.cl/images/urbai-logo.png",
                width: 1786,
                height: 946,
                alt: "Urbai - Normativa inteligente para urbanismo y construcción"
            }
        ]
    },
};

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
