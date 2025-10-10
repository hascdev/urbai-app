import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    // Mock authentication - always succeed for demo
    const mockUser = {
      id: `user_${Date.now()}`,
      name: name || "Usuario Demo",
      email: email || "demo@urbai.cl",
      plan: "starter",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      createdAt: new Date().toISOString(),
      isFirstTime: !email.includes("returning"), // Mock first-time detection
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return NextResponse.json({
      success: true,
      user: mockUser,
      token: `mock_token_${mockUser.id}`,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Error en el login" }, { status: 400 })
  }
}
