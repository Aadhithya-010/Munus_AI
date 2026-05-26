import { api, TOKEN_KEY } from "./api"
import type { User } from "@/types"

type LoginResponse = {
  access_token: string
  token_type: string
}

type RegisterResponse = {
  success: boolean
  user: User
}

export async function login(email: string, password: string) {
  const form = new URLSearchParams()
  form.set("username", email)
  form.set("password", password)

  const { data } = await api.post<LoginResponse>("/api/v1/auth/login", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  })

  localStorage.setItem(TOKEN_KEY, data.access_token)
  return data
}

export async function register(email: string, password: string) {
  const { data } = await api.post<RegisterResponse>("/api/v1/auth/register", {
    email,
    password,
  })

  return data
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}
