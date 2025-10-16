import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js";

// Deshabilitar caché para esta ruta
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
	
	try {

		const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
		
		const { data, error } = await supabase.rpc('get_users_summary');

		if (error) {
			throw error;
		}

		// Add 500 legacy users to the total
		data.total_users = (data.total_users || 0) + 500;

		return NextResponse.json({ data: data }, { 
			status: 200,
			headers: {
				'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
				'Pragma': 'no-cache',
				'Expires': '0',
			}
		});

	} catch (error) {
		console.error("Error fetching user activity:", error);
		return NextResponse.json({ error: "Error fetching user activity" }, { status: 500 });
	}
}
