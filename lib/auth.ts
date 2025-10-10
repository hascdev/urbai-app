// Simple authentication utilities for Urbai
export interface User {
    id: string
    name: string
    email: string
    phone: string
    plan: "starter" | "pro" | "custom"
    isFirstTime?: boolean
}

export interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
}

// Mock user data for development
const MOCK_USERS: User[] = [
    {
        id: "u_1",
        name: "Alin Rodriguez",
        email: "alin@example.com",
        phone: "+56912345678",
        plan: "starter",
        isFirstTime: false,
    },
]

// Session management using localStorage (in production, use secure cookies/JWT)
export const getStoredAuth = (): AuthState => {
    if (typeof window === "undefined") {
        return { user: null, isAuthenticated: false, isLoading: false }
    }

    try {
        const stored = localStorage.getItem("urbai_auth")
        if (stored) {
            const user = JSON.parse(stored)
            return { user, isAuthenticated: true, isLoading: false }
        }
    } catch (error) {
        console.error("Error reading auth from storage:", error)
    }

    return { user: null, isAuthenticated: false, isLoading: false }
}

export const setStoredAuth = (user: User) => {
    if (typeof window !== "undefined") {
        localStorage.setItem("urbai_auth", JSON.stringify(user))
    }
}

export const clearStoredAuth = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("urbai_auth")
    }
}

// Mock login function
export const mockLogin = async (name: string, emailOrPhone: string): Promise<User> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user exists (mock)
    let user = MOCK_USERS.find((u) => u.email === emailOrPhone || u.phone === emailOrPhone)

    if (!user) {
        // Create new user
        user = {
            id: `u_${Date.now()}`,
            name,
            email: emailOrPhone.includes("@") ? emailOrPhone : `${emailOrPhone.replace(/\D/g, "")}@temp.com`,
            phone: emailOrPhone.includes("@") ? "+56912345678" : emailOrPhone,
            plan: "starter",
            isFirstTime: true,
        }
    }

    setStoredAuth(user)
    return user
}

export const logout = () => {
    clearStoredAuth()
    window.location.href = "/app/login"
}
