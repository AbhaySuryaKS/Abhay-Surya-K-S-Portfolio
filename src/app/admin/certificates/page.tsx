"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { Flip } from "gsap/Flip"
import { 
  Award, ChevronLeft, ChevronRight, Edit2, ExternalLink, 
  Image as ImageIcon, Plus, RefreshCw, Sparkles, Trash2, Upload, X, FolderPlus, Tag 
} from "lucide-react"

interface CertCategory {
  id: number
  name: string
}

interface CertItem {
  id: number
  name: string
  category_ids: number[]
  category_names: string[]
  description: string
  image: string
  issued_by: string
  date: string
  credential_url: string
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

export default function AdminCertificates() {
  const [certificates, setCertificates] = useState<CertItem[]>([])
  const [categories, setCategories] = useState<CertCategory[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [isLoading, setIsLoading] = useState(true)
  const [isCertModalOpen, setIsCertModalOpen] = useState(false)
  const [isCatModalOpen, setIsCatModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([])
  const [issuedBy, setIssuedBy] = useState("")
  const [date, setDate] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [credentialUrl, setCredentialUrl] = useState("")
  const [editingCatId, setEditingCatId] = useState<number | null>(null)
  const [catNameInput, setCatNameInput] = useState("")

  const gridRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const loadData = async () => {
    setIsLoading(true)
    const res = await fetch("/api/certificates")
    const data = await res.json()
    if (data && !data.error) {
      setCertificates(data.certificates || [])
      setCategories(data.categories || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
    gsap.registerPlugin(Flip)
  }, [])

  const categoryNames = ["All", ...categories.map((c) => c.name)]
  const filteredCertificates = activeCategory === "All" 
    ? certificates 
    : certificates.filter((c) => c.category_names?.includes(activeCategory))

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

  function handleFilter(cat: string) {
    if (cat === activeCategory) return
    const cards = Object.values(cardRefs.current).filter(Boolean) as HTMLDivElement[]
    const matches = (card: HTMLDivElement) => cat === "All" || card.dataset.categories?.split(",").includes(cat)
    const wasVisible = new Map(cards.map((c) => [c, !c.classList.contains("hidden")]))
    const stillVisible = cards.filter((c) => wasVisible.get(c) && matches(c))
    const leaving = cards.filter((c) => wasVisible.get(c) && !matches(c))
    const entering = cards.filter((c) => !wasVisible.get(c) && matches(c))

    setActiveCategory(cat)

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!catNameInput.trim()) return

    if (editingCatId) {
      await fetch("/api/certificates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "category", id: editingCatId, name: catNameInput }),
      })
    } else {
      await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "category", name: catNameInput }),
      })
    }

    setCatNameInput("")
    setEditingCatId(null)
    await loadData()
  }

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Delete this category? Associated certificate links will be unlinked.")) return
    await fetch(`/api/certificates?type=category&id=${id}`, { method: "DELETE" })
    await loadData()
  }

  const handleOpenAdd = () => {
    resetCertForm()
    setIsCertModalOpen(true)
  }

  const handleEdit = (e: React.MouseEvent, c: CertItem) => {
    e.stopPropagation()
    setEditingId(c.id)
    setName(c.name)
    setSelectedCatIds(c.category_ids || [])
    setIssuedBy(c.issued_by)
    setDate(c.date)
    setDescription(c.description || "")
    setImage(c.image || "")
    setCredentialUrl(c.credential_url || "")
    setIsCertModalOpen(true)
  }

  const handleDeleteCert = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (!confirm("Delete this certificate?")) return
    await fetch(`/api/certificates?id=${id}`, { method: "DELETE" })
    await loadData()
  }

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = {
      name,
      category_ids: selectedCatIds,
      issued_by: issuedBy,
      date,
      description,
      image,
      credential_url: credentialUrl,
    }

    if (editingId) {
      await fetch("/api/certificates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      })
    } else {
      await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    }

    setIsSaving(false)
    setIsCertModalOpen(false)
    resetCertForm()
    await loadData()
  }

  const resetCertForm = () => {
    setEditingId(null)
    setName("")
    setSelectedCatIds([])
    setIssuedBy("")
    setDate("")
    setDescription("")
    setImage("")
    setCredentialUrl("")
  }

  const toggleCategorySelection = (catId: number) => {
    setSelectedCatIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-400">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const selectedCert = selectedIndex !== null ? filteredCertificates[selectedIndex] : null

  return (
    <section className="relative w-full bg-[#050505] px-4 py-12 sm:px-8 lg:px-16 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 ambient-studio-glow" />
      <div className="relative z-10 mx-auto mb-8 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#60a5fa] mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Certificates Admin CMS</span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-5xl uppercase tracking-wide text-white">Manage Certificates & Categories</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsCatModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            <FolderPlus className="h-4 w-4" />
            <span>Manage Categories</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)] cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <Plus className="h-4 w-4" />
            <span>Add Certificate</span>
          </button>
        </div>
      </div>
      <div className="relative z-10 mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
        {categoryNames.map((cat) => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleFilter(cat)}
              className={`relative rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-300 cursor-pointer ${
                isActive
                  ? "border border-blue-400/40 bg-linear-to-r from-blue-600/80 to-blue-500/80 text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)]"
                  : "border border-white/10 bg-white/3 text-gray-400 hover:border-white/20 hover:bg-white/6 hover:text-white"
              }`}
            >
              {cat}
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
              data-categories={cert.category_names?.join(",")}
              ref={(el) => {
                cardRefs.current[cert.id] = el
              }}
              onClick={() => {
                if (isFilteredIndex !== -1) setSelectedIndex(isFilteredIndex)
              }}
              className={`cert-card group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-2xl border bg-linear-to-br ${style.bgGradient} ${style.border} ${style.hoverShadow} p-5 transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="absolute top-3 right-3 flex items-center gap-1 z-20">
                <button
                  type="button"
                  onClick={(e) => handleEdit(e, cert)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-gray-300 hover:text-white hover:bg-blue-600/50 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteCert(e, cert.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/30 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <div className="relative h-44 w-full overflow-hidden rounded-xl bg-black/40 border border-white/10 mb-4">
                  {cert.image ? (
                    <Image src={cert.image} alt={cert.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-600">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {cert.category_names?.map((cName) => (
                      <span key={cName} className={`rounded-full border px-2.5 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${style.badgeBg} ${style.badgeText}`}>
                        {cName}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs text-gray-400 font-body">
                    <span>{cert.issued_by}</span>
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

      {/* Category Management Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0a0a0c] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="font-bebas text-2xl tracking-wide">Manage Categories</h3>
              <button type="button" onClick={() => setIsCatModalOpen(false)} className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="Category Name..."
                value={catNameInput}
                onChange={(e) => setCatNameInput(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 shrink-0">
                {editingCatId ? "Update" : "Add"}
              </button>
            </form>

            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm">
                  <span className="font-medium text-gray-200">{cat.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCatId(cat.id)
                        setCatNameInput(cat.name)
                      }}
                      className="text-gray-400 hover:text-white"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => handleDeleteCategory(cat.id)} className="text-red-400 hover:text-red-300">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal (Add/Edit) */}
      {isCertModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#0a0a0c] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="font-bebas text-2xl tracking-wide">{editingId ? "Edit Certificate" : "Add Certificate"}</h3>
              <button type="button" onClick={() => setIsCertModalOpen(false)} className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCert} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Categories (Select Multiple)</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border border-white/10 rounded-xl bg-black/30">
                  {categories.map((cat) => {
                    const isSelected = selectedCatIds.includes(cat.id)
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => toggleCategorySelection(cat.id)}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-colors cursor-pointer ${
                          isSelected
                            ? "border-blue-500 bg-blue-500/20 text-blue-300"
                            : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                        }`}
                      >
                        <Tag className="h-3 w-3" />
                        <span>{cat.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Issued By</label>
                  <input type="text" required value={issuedBy} onChange={(e) => setIssuedBy(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Year / Date</label>
                  <input type="text" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Certificate Image</label>
                <div className="relative h-32 w-full overflow-hidden rounded-xl border border-white/15 bg-black/60 mb-2 flex items-center justify-center">
                  {image ? <Image src={image} alt="Preview" fill className="object-contain p-2" /> : <ImageIcon className="h-8 w-8 text-gray-500" />}
                </div>
                <label className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/20 px-4 py-2 text-xs font-semibold text-blue-400 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  <span>Upload Image File</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Credential Link</label>
                <input type="text" value={credentialUrl} onChange={(e) => setCredentialUrl(e.target.value)} placeholder="https://..." className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white" />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-sm font-semibold text-white cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : editingId ? "Update Certificate" : "Save Certificate"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detail View Modal */}
      {selectedCert && selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6" onClick={() => setSelectedIndex(null)}>
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-[#0a0a0c] shadow-2xl text-white flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-2">
                {selectedCert.category_names?.map((cName) => (
                  <span key={cName} className="rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    {cName}
                  </span>
                ))}
                <span className="text-xs text-gray-400">{selectedCert.issued_by} • {selectedCert.date}</span>
              </div>
              <button type="button" onClick={() => setSelectedIndex(null)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col lg:flex-row gap-6 p-6 max-h-[70vh] overflow-y-auto">
              <div className="relative min-h-65 sm:min-h-80 lg:w-1/2 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60 shrink-0">
                {selectedCert.image && <Image src={selectedCert.image} alt={selectedCert.name} fill className="object-contain p-2" />}
              </div>
              <div className="flex flex-col justify-between lg:w-1/2 w-full gap-4">
                <div>
                  <h3 className="font-bebas text-3xl sm:text-4xl tracking-wide text-white leading-tight">{selectedCert.name}</h3>
                  <p className="font-body text-xs sm:text-sm leading-relaxed text-gray-300 mt-3">{selectedCert.description}</p>
                </div>
                {selectedCert.credential_url && (
                  <a href={selectedCert.credential_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs sm:text-sm font-semibold text-white">
                    <span>Verify Credential</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/5">
              <span className="text-xs text-gray-400">Certificate {selectedIndex + 1} of {filteredCertificates.length}</span>
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