"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { createClient } from "@/utils/supabase/client"
import { AuthState, User } from "@/lib/definitions"
import { fetchUser } from "@/lib/user-data"

interface AuthContextType extends AuthState {
	login: (user: User) => void
	logout: () => void
	updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
	
	const [authState, setAuthState] = useState<AuthState>({
		user: null,
		isAuthenticated: false,
		isLoading: true,
	})

	useEffect(() => {
		// Initialize auth state from storage
		const getUser = async () => {
			const supabase = createClient();
			const { data: { user: supabaseUser } } = await supabase.auth.getUser();
			if (supabaseUser) {
				const user = await fetchUser(supabaseUser);
				setAuthState({ user, isAuthenticated: true, isLoading: false });
			} else {
				setAuthState({ user: null, isAuthenticated: false, isLoading: false });
			}
		}

		getUser();
	}, [])

	const login = (user: User) => {
		setAuthState({ user, isAuthenticated: true, isLoading: false, });
	}

	const logout = () => {
		//clearStoredAuth()
		setAuthState({ user: null, isAuthenticated: false, isLoading: false, });
	}

	const updateUser = (updates: Partial<User>) => {
		if (authState.user) {
			const updatedUser = { ...authState.user, ...updates }
			setAuthState((prev) => ({ ...prev, user: updatedUser }))
			// Update storage
			if (typeof window !== "undefined") {
				localStorage.setItem("urbai_auth", JSON.stringify(updatedUser))
			}
		}
	}

	return (
		<AuthContext.Provider
			value={{
				...authState,
				login,
				logout,
				updateUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider")
	}
	return context
}
