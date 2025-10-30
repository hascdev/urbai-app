import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {

	try {

		const { message, vs_ids, location, commune_id } = await request.json();
		const body = { message, vs_ids, location, commune_id };
		console.log("POST - body", body);

		const response = await fetch(`https://urbai-api.vercel.app/api/agent`, {
			method: "POST",
			body: JSON.stringify(body)
		})

		const result = await response.json();
		if (result.error) {
			console.error("Error in chat API:", result.error)
			return NextResponse.json({ success: false, error: result.error }, { status: 400 })
		}

		const { answer, citations } = result;

		return NextResponse.json({
			success: true,
			answer,
			citations
		});

	} catch (error) {
		return NextResponse.json({ success: false, error: "Error procesando mensaje" }, { status: 400 })
	}
}
