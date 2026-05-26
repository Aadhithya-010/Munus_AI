import { FormEvent, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { getApiError } from "@/services/api"

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast({ title: "Welcome back", description: "You are signed in to MUNUS AI.", tone: "success" })
      navigate((location.state as { from?: { pathname?: string } })?.from?.pathname || "/dashboard", { replace: true })
    } catch (error) {
      toast({ title: "Login failed", description: getApiError(error, "Check your credentials."), tone: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md glass-panel">
      <CardHeader>
        <CardTitle className="text-xl">Sign in</CardTitle>
        <CardDescription>Continue to your AI meeting workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input type="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input type="password" placeholder="Password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <Button className="h-10 w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Sign in
            <ArrowRight className="size-4" />
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          New to MUNUS?{" "}
          <Link className="text-primary hover:underline" to="/register">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
