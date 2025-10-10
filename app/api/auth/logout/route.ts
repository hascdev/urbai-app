import { NextResponse } from "next/server"

export async function POST() {
  // Mock logout - always succeed
  await new Promise((resolve) => setTimeout(resolve, 300))

  return NextResponse.json({
    success: true,
    message: "Sesión cerrada exitosamente",
  })
}
