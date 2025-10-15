import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
	
	try {

		
		const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
		
		const { data, error } = await supabase.rpc('get_users_summary');

		if (error) {
			throw error;
		}

		return NextResponse.json({ data: data }, { status: 200 });

	} catch (error) {
		console.error("Error fetching user activity:", error);
		return NextResponse.json({ error: "Error fetching user activity" }, { status: 500 });
	}
}
