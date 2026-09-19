"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Lock, LogIn } from "lucide-react"
import { Logo } from "@/components/site/logo"
import { api } from "@/lib/client"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@capilora.in")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setBusy(true)
    try {
      await api("/api/auth/login", { method: "POST", json: { email, password } })
      router.push("/admin")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-forest-950 to-forest-700 px-4">
      <div className="card w-full max-w-md p-8">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Logo />
          <div className="inline-flex items-center gap-1.5 rounded-full bg-lime-100 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-forest-800">
            <Lock className="h-3 w-3" /> Admin Panel
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {error && <p className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-600">{error}</p>}
          <button className="btn-primary w-full" disabled={busy}>
            <LogIn className="h-4 w-4" /> {busy ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  )
}
