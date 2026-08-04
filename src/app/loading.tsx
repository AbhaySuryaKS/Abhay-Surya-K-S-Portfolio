"use client"

import { Sparkles } from "lucide-react"

export default function Loading({ label = "Extracting Content..." }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505] text-white">
      {/* Background Studio Glow */}
      <div className="pointer-events-none absolute inset-0 z-0 ambient-studio-glow" />
      <div className="pointer-events-none absolute h-[350px] w-[320px] rounded-full bg-blue-600/15 blur-[140px] animate-pulse" />

      {/* Center Animated Loader Core */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-4">
        <div className="relative flex h-20 w-20 items-center justify-center">
          {/* Rotating gradient ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-indigo-500 animate-spin" />

          {/* Outer glowing ripple */}
          <div className="absolute inset-2 rounded-full border border-blue-400/20 bg-blue-500/10 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.35)] animate-ping" />

          {/* Center Sparkle Icon */}
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-blue-400/30 bg-black/80 text-[#60a5fa] shadow-inner">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
        </div>

        {/* Minimal Animated Text */}
        <div className="flex flex-col items-center gap-1.5">
          <h2 className="font-bebas text-3xl sm:text-4xl tracking-widest uppercase text-white">
            System Initializing
          </h2>
          <span className="font-body text-[11px] font-semibold uppercase tracking-widest text-[#60a5fa] animate-pulse">
            {label}
          </span>
        </div>
      </div>
    </div>
  )
}