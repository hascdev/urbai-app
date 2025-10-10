import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const formatTimeAgo = (timestamp: string): string => {
	const now = new Date()
	const time = new Date(timestamp)
	const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

	if (diffInHours < 1) return "Hace menos de 1 hora"
	if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`

	const diffInDays = Math.floor(diffInHours / 24)
	if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`

	const diffInWeeks = Math.floor(diffInDays / 7)
	return `Hace ${diffInWeeks} semana${diffInWeeks > 1 ? "s" : ""}`
}

export function escapeHtml(s: string) {
	return s
		.replace(/&/g, '&amp;').replace(/</g, '&lt;')
		.replace(/>/g, '&gt;').replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export function renderBadges(answer: string, citations: { id: string; article: string; quote: string; label?: string }[]) {
	let html = answer;
	const sorted = [...citations].sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
	for (const cit of sorted) {
		const n = cit.id.slice(1);
		const label = cit.label ?? n;
		const tooltip = `${cit.article}: ${cit.quote}`;
		const sup = `<div title='${escapeHtml(tooltip)}' style="font-size: 10px; margin-left: 4px; top: -2px;" class="relative inline-flex items-center rounded-full border px-2 py-0 overflow-hidden font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-primary/10 text-primary border-primary/20 hover:border-primary hover:bg-primary/10">${escapeHtml(cit.article)}</div>`;
		html = html.replaceAll(`{{${cit.id}}}`, sup);
	}
	return html;
}
