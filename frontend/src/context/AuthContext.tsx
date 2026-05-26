import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { getStoredToken, login as loginRequest, logout as logoutRequest, register as registerRequest } from "@/services/auth"

type AuthContextValue = {
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => getStoredToken())

  useEffect(() => {
    const handleUnauthorized = () => setToken(null)
    window.addEventListener("munus:unauthorized", handleUnauthorized)
    return () => window.removeEventListener("munus:unauthorized", handleUnauthorized)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      login: async (email, password) => {
        const response = await loginRequest(email, password)
        setToken(response.access_token)
      },
      register: async (email, password) => {
        await registerRequest(email, password)
      },
      logout: () => {
        logoutRequest()
        setToken(null)
      },
    }),
    [token]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
