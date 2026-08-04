"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "../../../lib/auth-client"
import { Lock, Mail, RefreshCw, ShieldAlert, Sparkles } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const { error: authError } = await signIn.email({
      email,
      password,
      callbackURL: "/admin",
    })

    if (authError) {
      setError(authError.message || "Invalid credentials. Access denied.")
      setIsLoading(false)
    } else {
      router.push("/admin")
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#050505] px-4 text-white selection:bg-blue-600/30">
      <div className="pointer-events-none fixed inset-0 z-0 ambient-studio-glow" />
      <div className="pointer-events-none fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[350px] w-[500px] rounded-full bg-blue-600/10 blur-[130px]" />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#0a0a0c]/80 p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-[#60a5fa] mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Neon Auth Portal</span>
          </div>
          <h1 className="font-bebas text-4xl tracking-wide uppercase">Admin Sign In</h1>
          <p className="font-body text-xs text-gray-400 mt-1">
            Sign in with your admin credentials to access the dashboard.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300">
            <ShieldAlert className="h-4 w-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-xl border border-white/10 bg-black/50 pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/50 pl-10 pr-4 py-2.5 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-xs sm:text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            {isLoading && <RefreshCw className="h-4 w-4 animate-spin" />}
            <span>{isLoading ? "Authenticating..." : "Access Dashboard"}</span>
          </button>
        </form>
      </div>
    </div>
  )
}