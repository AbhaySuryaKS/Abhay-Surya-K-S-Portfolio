"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { Flip } from "gsap/Flip"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Sparkles } from "lucide-react"
import Loading from "../loading"

interface Skill {
  id: string
  name: string
  categories: string[]
  icon_svg: string
}

interface ColorTheme {
  bgGradient: string
  border: string
  hoverShadow: string
  iconBox: string
}

const COLOR_THEMES: ColorTheme[] = [
  {
    bgGradient: "from-blue-600/20 via-indigo-950/20 to-transparent",
    border: "border-blue-500/30 hover:border-blue-400/70",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(59,130,246,0.25)]",
    iconBox: "bg-blue-500/20 border-blue-400/30 text-blue-400 group-hover:bg-blue-500 group-hover:text-white",
  },
  {
    bgGradient: "from-emerald-600/20 via-teal-950/20 to-transparent",
    border: "border-emerald-500/30 hover:border-emerald-400/70",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(16,185,129,0.25)]",
    iconBox: "bg-emerald-500/20 border-emerald-400/30 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white",
  },
  {
    bgGradient: "from-purple-600/20 via-violet-950/20 to-transparent",
    border: "border-purple-500/30 hover:border-purple-400/70",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(168,85,247,0.25)]",
    iconBox: "bg-purple-500/20 border-purple-400/30 text-purple-400 group-hover:bg-purple-500 group-hover:text-white",
  },
  {
    bgGradient: "from-amber-600/20 via-orange-950/20 to-transparent",
    border: "border-amber-500/30 hover:border-amber-400/70",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(245,158,11,0.25)]",
    iconBox: "bg-amber-500/20 border-amber-400/30 text-amber-400 group-hover:bg-amber-500 group-hover:text-white",
  },
]

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [loading, setLoading] = useState<boolean>(true)

  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    async function loadSkills() {
      try {
        const res = await fetch("/api/skills")
        const json = await res.json()
        if (json && json.skills) {
          setSkills(
            json.skills.map((s: any) => ({
              id: String(s.id),
              name: s.name,
              categories: s.category_names || [],
              icon_svg: s.icon_svg || "",
            }))
          )
        }
      } catch (err) {
        console.error("Failed to fetch skills", err)
      } finally {
        setLoading(false)
      }
    }
    loadSkills()
  }, [])

  useEffect(() => {
    if (skills.length === 0) return

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

      const cards = gsap.utils.toArray<HTMLElement>(gridRef.current?.querySelectorAll(".skill-card") ?? [])

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
  }, [skills])

  const categories = ["All", ...Array.from(new Set(skills.flatMap((s) => s.categories)))]

  function handleFilter(category: string) {
    if (category === activeCategory) return

    const cards = Object.values(cardRefs.current).filter(Boolean) as HTMLDivElement[]
    const matches = (card: HTMLDivElement) => {
      if (category === "All") return true
      const cardCats = card.dataset.categories ? card.dataset.categories.split(",") : []
      return cardCats.includes(category)
    }

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
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          stagger: { grid: "auto", from: "start", amount: 0.3 },
          ease: "back.out(1.5)",
        }
      )
    })
  }

  const filteredCount =
    activeCategory === "All"
      ? skills.length
      : skills.filter((s) => s.categories.includes(activeCategory)).length

  if (loading || !skills) {
    return <Loading label="Loading skills..." />
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Skills"
      className="relative w-full bg-[#050505] px-4 py-24 sm:px-8 lg:px-16 overflow-hidden perspective-1000"
    >
      <div className="pointer-events-none absolute inset-0 z-0 ambient-studio-glow" />
      <div ref={headingRef} className="relative z-10 mx-auto mb-12 max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#60a5fa] mb-4">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Technical Proficiency</span>
        </div>
        <h2 className="font-bebas text-5xl sm:text-6xl lg:text-7xl uppercase tracking-wide text-white">
          Tools & Capabilities
        </h2>
      </div>

      {/* Category Pills */}
      <div className="relative z-10 mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
        {categories.map((category) => {
          const isActive = activeCategory === category
          return (
            <button
              key={category}
              type="button"
              onClick={() => handleFilter(category)}
              className={`relative rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
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

      {/* Skills Grid */}
      <div
        ref={gridRef}
        className="relative z-10 mx-auto grid max-w-6xl grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6"
      >
        {skills.map((skill, index) => {
          const style = COLOR_THEMES[index % COLOR_THEMES.length]

          return (
            <div
              key={skill.id}
              data-categories={skill.categories.join(",")}
              ref={(el) => {
                cardRefs.current[skill.id] = el
              }}
              className={`skill-card group relative flex flex-col items-center justify-center rounded-2xl border bg-linear-to-br ${style.bgGradient} ${style.border} ${style.hoverShadow} p-5 text-center transition-all duration-300 hover:-translate-y-1`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl border ${style.iconBox} shadow-inner transition-all duration-300 group-hover:scale-110`}
              >
                <div
                  className="h-6 w-6 flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: skill.icon_svg }}
                />
              </div>

              {/* Clean Skill Name Label */}
              <div className="mt-4 flex flex-col items-center">
                <span className="font-body text-sm font-semibold text-white tracking-wide">
                  {skill.name}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="relative z-10 mt-10 text-center">
        <span className="font-body text-xs text-gray-500 tracking-wider">
          Showing <span className="text-blue-400 font-semibold">{filteredCount}</span> of {skills.length} skills
        </span>
      </div>
    </section>
  )
}