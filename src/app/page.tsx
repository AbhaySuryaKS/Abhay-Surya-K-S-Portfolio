"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  ArrowUpRight,
  Award,
  Code2,
  Download,
  ExternalLink,
  FileDown,
  FileText,
  FolderGit2,
  MapPin,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react"
import Loading from "./loading"

// ── TYPES ──
interface ProfileData {
  scrollHint: string
  greeting: string
  name: string
  role: string
  location: string
  availability: string
  bio: string
  profileImage: string
  resumePdf: string
  stats: { id: string; value: string; label: string }[]
  links: { name: string; value: string; icon_svg: string }[]
}

interface ProfileStatResponse {
  id: string | number
  value: string
  label: string
}

interface NavCard {
  id: string
  icon: LucideIcon
  title: string
  description: string
  href: string
  colorClass: string
}

// ── NAVIGATION CARDS DATA ──
const NAV_CARDS: NavCard[] = [
  {
    id: "skills",
    icon: Code2,
    title: "Skills",
    description: "A showcase of my technical expertise, frameworks, and proficiencies.",
    href: "/skills",
    colorClass:
      "from-blue-600/30 via-indigo-900/20 to-transparent border-blue-500/30 hover:border-blue-400/60",
  },
  {
    id: "certificates",
    icon: Award,
    title: "Certificates",
    description: "Courses and credentials that back up what I actually know how to do.",
    href: "/certificates",
    colorClass:
      "from-purple-600/30 via-violet-900/20 to-transparent border-purple-500/30 hover:border-purple-400/60",
  },
  {
    id: "projects",
    icon: FolderGit2,
    title: "Projects",
    description: "Explore the oceans of my work, from small ripples to big waves.",
    href: "/projects",
    colorClass:
      "from-cyan-600/30 via-teal-900/20 to-transparent border-cyan-500/30 hover:border-cyan-400/60",
  },
]

function NavPanel({ card, index }: { card: NavCard; index: number }) {
  const Icon = card.icon
  const isEven = index % 2 === 1

  return (
    <div className={`nav-card-item w-full lg:w-[60%] ${isEven ? "lg:ml-auto" : "lg:mr-auto"}`}>
      <a
        href={card.href}
        className={`group relative flex flex-col justify-between min-h-55 sm:min-h-60 w-full rounded-2xl border bg-linear-to-br ${card.colorClass} p-6 sm:p-8 backdrop-blur-md transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(37,99,235,0.25)]`}
      >
        <div className="flex items-center justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-inner transition-transform duration-300 group-hover:scale-105">
            <Icon className="h-6 w-6 text-white" aria-hidden />
          </div>
          <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-wider text-blue-400 transition-colors duration-300 group-hover:text-blue-300">
            View
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
              aria-hidden
            />
          </span>
        </div>
        <div className="flex flex-col gap-2 mt-6">
          <h3 className="font-bebas text-3xl sm:text-4xl tracking-wide text-white">
            {card.title}
          </h3>
          <p className="font-body text-xs sm:text-sm leading-relaxed text-gray-300">
            {card.description}
          </p>
        </div>
      </a>
    </div>
  )
}

export default function HomePage() {
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Modal State for Resume
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false)
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null)

  // GSAP Refs
  const heroContainerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLElement>(null)
  const portfolioWrapRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const portfolioTextRef = useRef<HTMLHeadingElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const leftInfoRef = useRef<HTMLDivElement>(null)
  const bottomRightRef = useRef<HTMLDivElement>(null)
  const bottomCenterRef = useRef<HTMLDivElement>(null)
  const mobileContentWrapRef = useRef<HTMLDivElement>(null)

  const navContainerRef = useRef<HTMLDivElement>(null)
  const navHeadingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/profile")
        const json = await res.json()
        if (json && !json.error) {
          setData({
            scrollHint: "Scroll to Reveal",
            greeting: json.greeting || "Hello, I'm",
            name: json.name || "Abhay Surya K S",
            role: json.role || "Full-Stack Web Developer",
            location: json.location || "India",
            availability: json.availability || "Available",
            bio: json.bio || "",
            profileImage: json.profileImage || "/profile.png",
            resumePdf: json.resumePdf || "",
            stats:
              json.stats?.map((s: ProfileStatResponse) => ({
                id: String(s.id),
                value: s.value,
                label: s.label,
              })) || [],
            links: json.links || [],
          })
        }
      } catch (err) {
        console.error("Failed to load profile", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  useEffect(() => {
    if (!data?.resumePdf || !isResumeModalOpen) return

    try {
      const parts = data.resumePdf.split(",")
      const base64Data = parts.length > 1 ? parts[1] : parts[0]
      const binaryString = atob(base64Data)
      const bytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      const blob = new Blob([bytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)
      setPdfBlobUrl(url)

      return () => {
        URL.revokeObjectURL(url)
      }
    } catch (e) {
      console.error("Error generating PDF Blob URL:", e)
    }
  }, [isResumeModalOpen, data?.resumePdf])

  useEffect(() => {
    if (!data || loading) return

    gsap.registerPlugin(ScrollTrigger)
    const mm = gsap.matchMedia()

    mm.add("(min-width: 1024px)", () => {
      const ctx = gsap.context(() => {
        if (!stickyRef.current || !heroContainerRef.current) return

        gsap.set(portfolioWrapRef.current, { top: "50%", yPercent: -50 })
        gsap.set(portfolioTextRef.current, { opacity: 0.25 })
        gsap.set(scrollHintRef.current, { opacity: 1, y: 0 })
        gsap.set(portraitRef.current, { opacity: 0, y: 50 })
        gsap.set(badgeRef.current, { opacity: 0, y: -20 })
        gsap.set(leftInfoRef.current, { opacity: 0, x: -30 })
        gsap.set(bottomRightRef.current, { opacity: 0, x: 30 })
        gsap.set(bottomCenterRef.current, { opacity: 0, y: 30 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: stickyRef.current,
            scrub: 1,
            anticipatePin: 1,
          },
        })

        tl.to(scrollHintRef.current, { opacity: 0, y: -20, duration: 0.35, ease: "power2.in" })
        tl.to(
          portfolioWrapRef.current,
          { top: "0%", yPercent: 0, duration: 0.8, ease: "power3.out" },
          "-=0.1"
        ).to(portfolioTextRef.current, { opacity: 1, duration: 0.8, ease: "power3.out" }, "<")

        tl.to(portraitRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "<0.1")
        tl.to(badgeRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.4")
          .to(leftInfoRef.current, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, "<")
          .to(bottomRightRef.current, { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" }, "<")
          .to(bottomCenterRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "<")

        tl.to({}, { duration: 0.3 })
      }, heroContainerRef)

      return () => ctx.revert()
    })

    mm.add("(max-width: 1023.98px)", () => {
      const ctx = gsap.context(() => {
        if (!stickyRef.current || !heroContainerRef.current) return

        gsap.set(portfolioWrapRef.current, { top: "50%", yPercent: -50 })
        gsap.set(portfolioTextRef.current, { opacity: 0.25 })
        gsap.set(scrollHintRef.current, { opacity: 1, y: 0 })
        gsap.set(mobileContentWrapRef.current, { opacity: 0, y: 30 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: stickyRef.current,
            scrub: 1,
            anticipatePin: 1,
          },
        })

        tl.to(scrollHintRef.current, { opacity: 0, y: -14, duration: 0.35, ease: "power2.in" })
        tl.to(
          portfolioWrapRef.current,
          { top: "0%", yPercent: 0, duration: 0.8, ease: "power3.out" },
          "-=0.1"
        ).to(portfolioTextRef.current, { opacity: 0.85, duration: 0.8, ease: "power2.out" }, "<")

        tl.to(
          mobileContentWrapRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "<0.1"
        )

        tl.to({}, { duration: 0.3 })
      }, heroContainerRef)

      return () => ctx.revert()
    })

    const navCtx = gsap.context(() => {
      if (!navContainerRef.current || !navHeadingRef.current) return

      gsap.fromTo(
        navHeadingRef.current,
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: navContainerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      )

      const cards = gsap.utils.toArray<HTMLElement>(".nav-card-item")
      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { autoAlpha: 0, y: 40, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        )
      })
    }, navContainerRef)

    const timer = setTimeout(() => ScrollTrigger.refresh(), 200)
    return () => {
      clearTimeout(timer)
      mm.revert()
      navCtx.revert()
    }
  }, [data, loading])

  const handleOpenPdfFull = () => {
    if (pdfBlobUrl) {
      window.open(pdfBlobUrl, "_blank")
    }
  }

  const handleDownloadPdf = () => {
    if (!data?.resumePdf) return
    const filename = `${(data.name || "Resume").replace(/\s+/g, "_")}_Resume.pdf`
    const link = document.createElement("a")
    link.href = data.resumePdf
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading || !data) {
    return <Loading label="Loading Profile..." />
  }

  const gmailLink = data.links.find((l) => l.name.toLowerCase().includes("gmail")) || null
  const socialLinks = data.links.filter((l) => !l.name.toLowerCase().includes("gmail"))
  const reachOutHref = gmailLink?.value ? `mailto:${gmailLink.value}` : "#"

  return (
    <main className="relative w-full bg-[#050505] overflow-hidden">
      {/* ── ABOUT / HERO SECTION ── */}
      <div
        ref={heroContainerRef}
        className="relative w-full min-h-[220vh] bg-[#050505] overflow-hidden"
      >
        <section
          ref={stickyRef}
          aria-label="Portfolio Hero"
          className="sticky top-0 min-h-screen w-full overflow-hidden text-white px-4 sm:px-8 lg:px-16 flex flex-col lg:block items-center justify-start gap-0 pt-0 lg:py-0"
        >
          <div className="pointer-events-none absolute inset-0 z-0 ambient-studio-glow" />
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-112.5 w-150 rounded-full bg-blue-600/10 blur-[120px]" />

          {/* Top-Right Badge */}
          <div
            ref={badgeRef}
            className="hidden lg:flex absolute top-8 right-16 z-30 items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 backdrop-blur-md shadow-[0_0_20px_-4px_rgba(59,130,246,0.3)]"
          >
            <Sparkles className="h-4 w-4 text-[#60a5fa]" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-widest text-[#60a5fa]">
              {data.availability}
            </span>
          </div>

          {/* Big Typography */}
          <div
            ref={portfolioWrapRef}
            className="absolute inset-x-0 z-0 flex items-start justify-center pointer-events-none select-none pt-2 sm:pt-4"
          >
            <h1
              ref={portfolioTextRef}
              className="font-bebas text-[18vw] sm:text-[16vw] lg:text-[22vw] leading-none tracking-wider text-transparent bg-clip-text bg-linear-to-b from-blue-600/90 via-blue-700/30 to-transparent"
            >
              PORTFOLIO
            </h1>
          </div>

          {/* Scroll Hint */}
          <div
            ref={scrollHintRef}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-4"
          >
            <p className="font-allura text-3xl sm:text-4xl lg:text-5xl text-[#60a5fa] drop-shadow-[0_0_12px_rgba(96,165,250,0.5)] text-center">
              {data.scrollHint}
            </p>
          </div>

          {/* Mobile View */}
          <div
            ref={mobileContentWrapRef}
            className="lg:hidden flex flex-col items-center w-full z-10 pt-[18vw] sm:pt-[16vw] gap-4 pb-12"
          >
            <div className="relative z-10 w-full max-w-50 sm:max-w-65 h-[28vh] sm:h-[34vh] pointer-events-none flex items-end justify-center">
              <div className="relative w-full h-full">
                <Image
                  src={data.profileImage}
                  alt={`Portrait of ${data.name}`}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-contain object-bottom"
                />
              </div>
            </div>

            <div className="relative z-30 flex flex-col items-center text-center gap-1.5 px-4">
              <p className="font-allura text-2xl sm:text-3xl text-[#60a5fa]">{data.greeting}</p>
              <h2 className="font-bebas text-4xl sm:text-5xl tracking-wide uppercase leading-none text-white">
                {data.name}
              </h2>
              <p className="font-body text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#60a5fa]">
                {data.role}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                <MapPin className="h-3.5 w-3.5 text-[#60a5fa]" aria-hidden />
                <span>{data.location}</span>
              </div>
            </div>

            <div className="relative z-30 max-w-sm px-4 text-center">
              <p className="font-body text-xs sm:text-sm leading-relaxed text-gray-300/90">
                {data.bio}
              </p>
            </div>

            <div className="relative z-30 flex items-center justify-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-[#60a5fa]" aria-hidden />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#60a5fa]">
                {data.availability}
              </span>
            </div>

            <div className="relative z-30 flex flex-row gap-6 sm:gap-8 text-center pt-2">
              {data.stats.map((stat) => (
                <div key={stat.id} className="flex flex-col items-center">
                  <span className="font-bebas text-3xl sm:text-4xl text-transparent bg-clip-text bg-linear-to-r from-[#60a5fa] to-[#2563eb]">
                    {stat.value}
                  </span>
                  <span className="font-body text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative z-30 flex flex-col items-center gap-3 pt-2">
              <div className="flex items-center justify-center gap-3">
                <a
                  href={reachOutHref}
                  className="group inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-linear-to-r from-blue-600 to-blue-500 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)] transition-all hover:scale-105"
                >
                  Reach Out
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden/>
                </a>
                {data.resumePdf && (
                  <button
                    type="button"
                    onClick={() => setIsResumeModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/6 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all hover:scale-105 cursor-pointer"
                  >
                    Resume
                    <FileDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3 mt-1">
                {socialLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.value}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.name}
                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-white/10 bg-white/3 text-gray-300 hover:border-blue-500/40 hover:bg-blue-600/10 hover:text-[#60a5fa] transition-all hover:scale-105"
                  >
                    <div
                      className="h-4 w-4 flex items-center justify-center"
                      dangerouslySetInnerHTML={{ __html: link.icon_svg }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop View */}
          <div
            ref={leftInfoRef}
            className="hidden lg:flex absolute bottom-12 left-16 z-30 flex-col gap-2 text-left items-start"
          >
            <p className="font-allura text-4xl text-[#60a5fa]">{data.greeting}</p>
            <h2 className="font-bebas text-6xl tracking-wide uppercase leading-none text-white">
              {data.name}
            </h2>
            <p className="font-body text-sm font-semibold uppercase tracking-widest text-[#60a5fa]">
              {data.role}
            </p>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
              <MapPin className="h-3.5 w-3.5 text-[#60a5fa]" aria-hidden />
              <span>{data.location}</span>
            </div>
            <p className="font-body text-sm leading-relaxed text-gray-300/90 mt-2 max-w-sm">
              {data.bio}
            </p>
          </div>

          <div
            ref={portraitRef}
            className="hidden lg:flex absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-full max-w-125 h-[75vh] pointer-events-none items-end justify-center"
          >
            <div className="relative w-full h-full">
              <Image
                src={data.profileImage}
                alt={`Portrait of ${data.name}`}
                fill
                priority
                sizes="33vw"
                className="object-contain object-bottom"
              />
            </div>
          </div>

          <div
            ref={bottomRightRef}
            className="hidden lg:flex absolute bottom-12 right-16 z-30 flex-col gap-6 text-right"
          >
            {data.stats.map((stat) => (
              <div key={stat.id} className="flex flex-col items-end">
                <span className="font-bebas text-5xl text-transparent bg-clip-text bg-linear-to-r from-[#60a5fa] to-[#2563eb]">
                  {stat.value}
                </span>
                <span className="font-body text-xs uppercase tracking-widest text-gray-400 font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div
            ref={bottomCenterRef}
            className="hidden lg:flex absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-4"
          >
            <div className="flex items-center justify-center gap-4">
              <a
                href={reachOutHref}
                className="group inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-linear-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)] transition-all hover:scale-105"
              >
                Reach Out
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden/>
              </a>
              {data.resumePdf && (
                <button
                  type="button"
                  onClick={() => setIsResumeModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/6 px-6 py-3 text-sm font-semibold text-white transition-all hover:scale-105 cursor-pointer"
                >
                  Resume
                  <FileDown className="h-4 w-4" aria-hidden />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.value}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/3 text-gray-300 hover:border-blue-500/40 hover:bg-blue-600/10 hover:text-[#60a5fa] transition-all hover:scale-105"
                >
                  <div
                    className="h-4 w-4 flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: link.icon_svg }}
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── SCROLL NAVIGATION SECTION ── */}
      <div ref={navContainerRef} className="relative w-full bg-[#050505] py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 z-0 ambient-studio-glow" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 flex flex-col gap-10">
          <div ref={navHeadingRef} className="flex flex-col gap-2 text-center lg:text-left">
            <p className="font-allura text-3xl sm:text-4xl text-[#60a5fa]">Still Curious?</p>
            <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl uppercase tracking-wide text-white">
              Explore More
            </h2>
          </div>
          <div className="flex flex-col gap-6 sm:gap-8 w-full">
            {NAV_CARDS.map((card, index) => (
              <NavPanel key={card.id} card={card} index={index} />
            ))}
          </div>
        </div>
      </div>

      {/* ── RESUME PREVIEW MODAL ── */}
      {isResumeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6"
          onClick={() => setIsResumeModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-[#0a0a0c] shadow-[0_0_50px_rgba(0,0,0,0.8)] text-white flex flex-col max-h-[90vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                <h3 className="font-bebas text-2xl tracking-wide text-white">
                  Resume Preview
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsResumeModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="relative w-full h-[55vh] bg-black/80 overflow-hidden select-none">
              {pdfBlobUrl ? (
                <iframe
                  src={`${pdfBlobUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                  title="Resume Preview"
                  tabIndex={-1}
                  className="w-full h-full border-0 pointer-events-none select-none"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-500 text-xs">
                  Loading Resume Document...
                </div>
              )}

              {/* Glassmorphic Blur & Gradient Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent backdrop-blur-md pointer-events-auto flex flex-col items-center justify-end pb-6 px-4 text-center">
                <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Preview Restricted
                </p>
                <p className="text-[11px] text-gray-400 max-w-xs">
                  Open in a new tab or download the document to view full credentials.
                </p>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-white/10 bg-white/5">
              <span className="text-xs text-gray-400 font-body">
                {data.name}&apos;s Official Resume
              </span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleOpenPdfFull}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-gray-300 hover:border-white/30 hover:text-white transition-all cursor-pointer"
                >
                  <span>View Full PDF</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}