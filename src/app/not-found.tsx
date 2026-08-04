"use client"

import Link from "next/link"
import { ArrowLeft, Compass, Home, Radar, Sparkles } from "lucide-react"

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center bg-[#050505] px-4 text-white overflow-hidden select-none">
      {/* Background Ambient Studio Glow */}
      <div className="pointer-events-none absolute inset-0 z-0 ambient-studio-glow" />
      <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[160px] animate-pulse" />

      {/* Futuristic Radar & Orbit Graphics */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
        {/* Rotating Outer Ring */}
        <div className="h-[450px] w-[450px] sm:h-[600px] sm:w-[600px] rounded-full border border-blue-500/10 animate-[spin_30s_linear_infinite]" />
        
        {/* Counter-Rotating Inner Ring */}
        <div className="absolute h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] rounded-full border border-dashed border-indigo-500/15 animate-[spin_20s_linear_infinite_reverse]" />
        
        {/* Central Pulsing Sphere */}
        <div className="absolute h-48 w-48 rounded-full border border-blue-400/20 bg-blue-500/5 backdrop-blur-3xl shadow-[0_0_80px_rgba(59,130,246,0.15)] animate-ping" />
      </div>

      {/* Main Glassmorphic Card */}
      <div className="relative z-10 flex max-w-lg w-full flex-col items-center text-center gap-8 p-8 sm:p-10 rounded-3xl border border-white/15 bg-[#0a0a0c]/80 backdrop-blur-2xl shadow-[0_0_80px_rgba(0,0,0,0.9)]">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#60a5fa] shadow-[0_0_20px_-4px_rgba(59,130,246,0.3)]">
          <Radar className="h-3.5 w-3.5 animate-spin" />
          <span>Error 404 • Signal Lost</span>
        </div>

        {/* 404 Glitch-style Number Display */}
        <div className="relative flex items-center justify-center">
          <span className="font-bebas text-8xl sm:text-9xl tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-600 drop-shadow-[0_0_35px_rgba(59,130,246,0.4)]">
            404
          </span>
          <Sparkles className="absolute -top-2 -right-4 h-6 w-6 text-blue-400 animate-bounce" />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2 max-w-sm">
          <h1 className="font-bebas text-3xl sm:text-4xl tracking-wide uppercase text-white leading-none">
            Destination Unreachable
          </h1>
          <p className="font-body text-xs sm:text-sm leading-relaxed text-gray-400">
            The page or route you are looking for does not exist in this coordinates framework.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full pt-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-xs sm:text-sm font-semibold text-gray-300 hover:border-white/30 hover:text-white hover:bg-white/10 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>

          <Link
            href="/"
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-400/40 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_25px_-4px_rgba(59,130,246,0.6)] transition-transform hover:scale-[1.02]"
          >
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Quick Links Nav Section */}
        <div className="w-full border-t border-white/10 pt-5 flex items-center justify-between text-[11px] text-gray-500 font-body">
          <span className="inline-flex items-center gap-1">
            <Compass className="h-3.5 w-3.5 text-blue-400" />
            Quick Navigation:
          </span>
          <div className="flex items-center gap-3">
            <Link href="/skills" className="hover:text-blue-400 transition-colors">
              Skills
            </Link>
            <span>•</span>
            <Link href="/projects" className="hover:text-blue-400 transition-colors">
              Projects
            </Link>
            <span>•</span>
            <Link href="/certificates" className="hover:text-blue-400 transition-colors">
              Certificates
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}