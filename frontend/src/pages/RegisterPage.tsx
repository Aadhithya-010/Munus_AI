import { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/context/ToastContext"
import { getApiError } from "@/services/api"

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)

    try {
      await register(email, password)
      toast({ title: "Account created", description: "Sign in to start building your workspace.", tone: "success" })
      navigate("/login")
    } catch (error) {
      toast({ title: "Registration failed", description: getApiError(error), tone: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md glass-panel">
      <CardHeader>
        <CardTitle className="text-xl">Create account</CardTitle>
        <CardDescription>Set up access to your MUNUS AI workspace.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input type="email" placeholder="you@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <Input type="password" placeholder="Create password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <Button className="h-10 w-full" type="submit" disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            Register
            <ArrowRight className="size-4" />
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="text-primary hover:underline" to="/login">
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
