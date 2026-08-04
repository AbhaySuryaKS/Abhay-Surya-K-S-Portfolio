"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Global runtime error:", error)
  }, [error])

  return (
    <main className="relative min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 ambient-studio-glow" />
      <div className="pointer-events-none absolute h-[350px] w-[350px] rounded-full bg-red-600/10 blur-[130px]" />
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg rounded-3xl border border-red-500/20 bg-white/[0.02] p-8 sm:p-12 backdrop-blur-md shadow-2xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 mb-4 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h1 className="font-bebas text-3xl sm:text-4xl tracking-wide text-white">
          Something Went Wrong
        </h1>
        <p className="font-body text-xs sm:text-sm text-gray-400 mt-2 mb-6 leading-relaxed">
          An unexpected error occurred while processing this request. You can try refreshing the view.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-red-500/30 bg-red-500/20 px-6 py-3 text-xs sm:text-sm font-semibold text-red-300 hover:bg-red-500/30 transition-all cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      </div>
    </main>
  )
}