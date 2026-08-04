"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { Flip } from "gsap/Flip"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Award, ChevronLeft, ChevronRight, ExternalLink, Sparkles, X } from "lucide-react"

interface Certificate {
  id: string
  name: string
  categories: string[]
  description: string
  image: string
  issuedBy: string
  date: string
  credentialUrl?: string
}

const COLOR_THEMES = [
  {
    bgGradient: "from-blue-600/20 via-indigo-950/20 to-transparent",
    border: "border-blue-500/30 hover:border-blue-400/70",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)]",
    badgeBg: "bg-blue-500/20 border-blue-400/30",
    badgeText: "text-blue-400",
  },
  {
    bgGradient: "from-emerald-600/20 via-teal-950/20 to-transparent",
    border: "border-emerald-500/30 hover:border-emerald-400/70",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(16,185,129,0.25)]",
    badgeBg: "bg-emerald-500/20 border-emerald-400/30",
    badgeText: "text-emerald-400",
  },
  {
    bgGradient: "from-purple-600/20 via-violet-950/20 to-transparent",
    border: "border-purple-500/30 hover:border-purple-400/70",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(168,85,247,0.25)]",
    badgeBg: "bg-purple-500/20 border-purple-400/30",
    badgeText: "text-purple-400",
  },
]

export default function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadCertificates() {
      try {
        const res = await fetch("/api/certificates")
        const json = await res.json()
        if (json && json.certificates) {
          const loadedCerts = json.certificates.map((c: any) => ({
            id: String(c.id),
            name: c.name,
            categories: c.category_names?.length > 0 ? c.category_names : ["Award"],
            issuedBy: c.issued_by,
            date: c.date,
            description: c.description || "",
            image: c.image || "/profile.png",
            credentialUrl: c.credential_url || undefined,
          }))

          setCertificates(loadedCerts)

          const catList = json.categories?.map((cat: any) => cat.name) || []
          setCategories(["All", ...catList])
        }
      } catch (err) {
        console.error("Failed to fetch certificates", err)
      } finally {
        setLoading(false)
      }
    }
    loadCertificates()
  }, [])

  useEffect(() => {
    if (certificates.length === 0) return

    gsap.registerPlugin(Flip, ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        }
      )

      const cards = gsap.utils.toArray<HTMLElement>(gridRef.current?.querySelectorAll(".cert-card") ?? [])

      gsap.fromTo(
        cards,
        { autoAlpha: 0, scale: 0.5, z: -100, y: 40 },
        {
          autoAlpha: 1,
          scale: 1,
          z: 0,
          y: 0,
          duration: 0.7,
          ease: "back.out(1.4)",
          stagger: { grid: "auto", from: "start", amount: 0.6 },
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [certificates])

  const filteredCertificates = activeCategory === "All" 
    ? certificates 
    : certificates.filter((c) => c.categories.includes(activeCategory))

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev === null || prev === 0 ? filteredCertificates.length - 1 : prev - 1))
  }, [filteredCertificates.length, selectedIndex])

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev === null || prev === filteredCertificates.length - 1 ? 0 : prev + 1))
  }, [filteredCertificates.length, selectedIndex])

  useEffect(() => {
    if (selectedIndex === null) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setSelectedIndex(null)
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === "ArrowRight") handleNext()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex, handleNext, handlePrev])

  function handleFilter(category: string) {
    if (category === activeCategory) return

    const cards = Object.values(cardRefs.current).filter(Boolean) as HTMLDivElement[]
    const matches = (card: HTMLDivElement) => category === "All" || card.dataset.categories?.split(",").includes(category)
    const wasVisible = new Map(cards.map((c) => [c, !c.classList.contains("hidden")]))
    const stillVisible = cards.filter((c) => wasVisible.get(c) && matches(c))
    const leaving = cards.filter((c) => wasVisible.get(c) && !matches(c))
    const entering = cards.filter((c) => !wasVisible.get(c) && matches(c))

    setActiveCategory(category)

    const tl = gsap.timeline()
    if (leaving.length) {
      tl.to(leaving, { opacity: 0, scale: 0.7, duration: 0.2, stagger: 0.015, ease: "power2.in" })
    }

    tl.add(() => {
      const state = Flip.getState(stillVisible)
      leaving.forEach((c) => c.classList.add("hidden"))
      entering.forEach((c) => c.classList.remove("hidden"))

      Flip.from(state, { duration: 0.5, ease: "power2.inOut", stagger: 0.02, absolute: true })

      gsap.fromTo(
        entering,
        { opacity: 0, scale: 0.6, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, stagger: { grid: "auto", from: "start", amount: 0.3 }, ease: "back.out(1.5)" }
      )
    })
  }

  const selectedCert = selectedIndex !== null ? filteredCertificates[selectedIndex] : null

  if (loading) return null

  return (
    <section ref={sectionRef} aria-label="Certificates & Credentials" className="relative w-full bg-[#050505] px-4 py-24 sm:px-8 lg:px-16 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 ambient-studio-glow" />
      
      <div ref={headingRef} className="relative z-10 mx-auto mb-12 max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#60a5fa] mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Verified Accomplishments</span>
        </div>
        <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl uppercase tracking-wide text-white">Certificates & Awards</h2>
      </div>

      <div className="relative z-10 mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
        {categories.map((category) => {
          const isActive = activeCategory === category
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleFilter(category)}
              className={`relative rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "border border-blue-400/40 bg-linear-to-r from-blue-600/80 to-blue-500/80 text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)]"
                  : "border border-white/10 bg-white/3 text-gray-400 hover:border-white/20 hover:bg-white/6 hover:text-white"
              }`}
            >
              {category}
            </button>
          )
        })}
      </div>

      <div ref={gridRef} className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((cert, index) => {
          const style = COLOR_THEMES[index % COLOR_THEMES.length]
          const isFilteredIndex = filteredCertificates.findIndex((c) => c.id === cert.id)
          return (
            <div
              key={cert.id}
              data-categories={cert.categories.join(",")}
              ref={(el) => {
                cardRefs.current[cert.id] = el
              }}
              onClick={() => {
                if (isFilteredIndex !== -1) setSelectedIndex(isFilteredIndex)
              }}
              className={`cert-card group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-2xl border bg-linear-to-br ${style.bgGradient} ${style.border} ${style.hoverShadow} p-5 transition-all duration-300 hover:-translate-y-1`}
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden rounded-xl bg-black/40 border border-white/10 mb-4">
                  <Image src={cert.image} alt={cert.name} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {cert.categories.map((cName) => (
                      <span key={cName} className={`rounded-full border px-2.5 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${style.badgeBg} ${style.badgeText}`}>
                        {cName}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs text-gray-400 font-body">
                    <span>{cert.issuedBy}</span>
                    <span>{cert.date}</span>
                  </div>
                  <h3 className="font-bebas text-2xl tracking-wide text-white group-hover:text-blue-400 transition-colors">{cert.name}</h3>
                  <p className="font-body text-xs text-gray-300/90 line-clamp-2 leading-relaxed mt-1">{cert.description}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                <span>View Certificate Details</span>
                <Award className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          )
        })}
      </div>

      <div className="relative z-10 mt-10 text-center">
        <span className="font-body text-xs text-gray-500 tracking-wider">
          Showing <span className="text-blue-400 font-semibold">{filteredCertificates.length}</span> of {certificates.length} certificates
        </span>
      </div>

      {selectedCert && selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6" onClick={() => setSelectedIndex(null)}>
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-[#0a0a0c] shadow-2xl text-white flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/20">
              <div className="flex items-center gap-2">
                {selectedCert.categories.map((cName) => (
                  <span key={cName} className="rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    {cName}
                  </span>
                ))}
                <span className="text-xs text-gray-400">{selectedCert.issuedBy} • {selectedCert.date}</span>
              </div>
              <button type="button" onClick={() => setSelectedIndex(null)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col lg:flex-row gap-6 p-6 max-h-[70vh] overflow-y-auto">
              <div className="relative min-h-65 sm:min-h-80 lg:w-1/2 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60 shrink-0">
                <Image src={selectedCert.image} alt={selectedCert.name} fill sizes="50vw" className="object-contain p-2" />
              </div>
              <div className="flex flex-col justify-between lg:w-1/2 w-full gap-4">
                <div>
                  <h3 className="font-bebas text-3xl sm:text-4xl tracking-wide text-white leading-tight">{selectedCert.name}</h3>
                  <p className="font-body text-xs sm:text-sm leading-relaxed text-gray-300 mt-3">{selectedCert.description}</p>
                </div>
                {selectedCert.credentialUrl && (
                  <a href={selectedCert.credentialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs sm:text-sm font-semibold text-white">
                    <span>Verify Credential</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/20">
              <span className="text-xs text-gray-400 font-body">Certificate {selectedIndex + 1} of {filteredCertificates.length}</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={handlePrev} className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>
                <button type="button" onClick={handleNext} className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white">
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}