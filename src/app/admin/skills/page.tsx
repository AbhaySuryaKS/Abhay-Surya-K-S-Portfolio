"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { Flip } from "gsap/Flip"
import { Edit2, Plus, RefreshCw, Sparkles, Trash2, X } from "lucide-react"

interface SkillItem {
  id: number
  name: string
  category_ids: number[]
  category_names?: string[]
  icon_svg: string
}

interface SkillCategory {
  id: number
  name: string
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

export default function AdminSkills() {
  const [skills, setSkills] = useState<SkillItem[]>([])
  const [categories, setCategories] = useState<SkillCategory[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [isLoading, setIsLoading] = useState(true)

  // Modals
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Edit States
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null)
  const [editingCatId, setEditingCatId] = useState<number | null>(null)

  // Skill Form Fields
  const [name, setName] = useState("")
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([])
  const [iconSvg, setIconSvg] = useState("")

  // Category Form Field
  const [categoryName, setCategoryName] = useState("")

  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const loadData = async () => {
    setIsLoading(true)
    const res = await fetch("/api/skills")
    const data = await res.json()
    if (data && !data.error) {
      setSkills(data.skills || [])
      setCategories(data.categories || [])
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    gsap.registerPlugin(Flip)
  }, [])

  const categoryNames = ["All", ...categories.map((c) => c.name)]

  function handleFilter(catName: string) {
    if (catName === activeCategory) return

    const cards = Object.values(cardRefs.current).filter(Boolean) as HTMLDivElement[]
    const matches = (card: HTMLDivElement) => {
      if (catName === "All") return true
      const cardCats = card.dataset.categories ? card.dataset.categories.split(",") : []
      return cardCats.includes(catName)
    }

    const wasVisible = new Map(cards.map((c) => [c, !c.classList.contains("hidden")]))
    const stillVisible = cards.filter((c) => wasVisible.get(c) && matches(c))
    const leaving = cards.filter((c) => wasVisible.get(c) && !matches(c))
    const entering = cards.filter((c) => !wasVisible.get(c) && matches(c))

    setActiveCategory(catName)

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

  const toggleCategorySelection = (catId: number) => {
    setSelectedCatIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    )
  }

  // Skill Actions
  const handleOpenAddSkill = () => {
    resetSkillForm()
    setIsSkillModalOpen(true)
  }

  const handleEditSkill = (skill: SkillItem) => {
    setEditingSkillId(skill.id)
    setName(skill.name)
    setSelectedCatIds(skill.category_ids || [])
    setIconSvg(skill.icon_svg || "")
    setIsSkillModalOpen(true)
  }

  const handleDeleteSkill = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return
    await fetch(`/api/skills?id=${id}`, { method: "DELETE" })
    await loadData()
  }

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = {
      name,
      category_ids: selectedCatIds,
      icon_svg: iconSvg,
    }

    if (editingSkillId) {
      await fetch("/api/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingSkillId, ...payload }),
      })
    } else {
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    }

    setIsSaving(false)
    setIsSkillModalOpen(false)
    resetSkillForm()
    await loadData()
  }

  const resetSkillForm = () => {
    setEditingSkillId(null)
    setName("")
    setSelectedCatIds([])
    setIconSvg("")
  }

  // Category Actions
  const handleOpenAddCategory = () => {
    setEditingCatId(null)
    setCategoryName("")
    setIsCategoryModalOpen(true)
  }

  const handleEditCategory = (cat: SkillCategory) => {
    setEditingCatId(cat.id)
    setCategoryName(cat.name)
    setIsCategoryModalOpen(true)
  }

  const handleDeleteCategory = async (catId: number) => {
    if (!confirm("Deleting this category will remove it from linked skills. Continue?")) return
    await fetch(`/api/skills?id=${catId}&type=category`, { method: "DELETE" })
    await loadData()
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryName.trim()) return
    setIsSaving(true)

    if (editingCatId) {
      await fetch("/api/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "category", id: editingCatId, name: categoryName }),
      })
    } else {
      await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "category", name: categoryName }),
      })
    }

    setIsSaving(false)
    setIsCategoryModalOpen(false)
    setCategoryName("")
    setEditingCatId(null)
    await loadData()
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-400">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  const filteredSkills =
    activeCategory === "All"
      ? skills
      : skills.filter((s) => s.category_names?.includes(activeCategory))

  return (
    <section ref={sectionRef} className="relative w-full bg-[#050505] px-4 py-12 sm:px-8 lg:px-16 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 ambient-studio-glow" />

      {/* Top Controller Header */}
      <div className="relative z-10 mx-auto mb-8 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#60a5fa] mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Skills Admin CMS</span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-5xl uppercase tracking-wide text-white">Manage Tools & Capabilities</h2>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenAddCategory}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-gray-300 hover:border-white/30 hover:text-white cursor-pointer transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddSkill}
            className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)] cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Skill</span>
          </button>
        </div>
      </div>

      {/* Category Pills with Hover Actions */}
      <div className="relative z-10 mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-5xl mx-auto">
        {categoryNames.map((category) => {
          const isActive = activeCategory === category
          const catObj = categories.find((c) => c.name === category)

          return (
            <div key={category} className="group relative inline-flex items-center">
              <button
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

              {catObj && (
                <div className="absolute -top-2 -right-1 hidden items-center gap-1 group-hover:flex z-30">
                  <button
                    type="button"
                    onClick={() => handleEditCategory(catObj)}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-500 cursor-pointer"
                  >
                    <Edit2 className="h-2.5 w-2.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(catObj.id)}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow-md hover:bg-red-500 cursor-pointer"
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Skills Grid */}
      <div ref={gridRef} className="relative z-10 mx-auto grid max-w-6xl grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
        {skills.map((skill, index) => {
          const style = COLOR_THEMES[index % COLOR_THEMES.length]
          return (
            <div
              key={skill.id}
              data-categories={skill.category_names?.join(",")}
              ref={(el) => {
                cardRefs.current[skill.id] = el
              }}
              className={`skill-card group relative flex flex-col items-center justify-between rounded-2xl border bg-linear-to-br ${style.bgGradient} ${style.border} ${style.hoverShadow} p-5 text-center transition-all duration-300 hover:-translate-y-1`}
            >
              {/* Card Action Controls */}
              <div className="absolute top-2 right-2 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity z-20">
                <button
                  type="button"
                  onClick={() => handleEditSkill(skill)}
                  className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-gray-300 hover:text-white hover:bg-blue-600/50 cursor-pointer"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="flex h-6 w-6 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/30 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>

              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${style.iconBox} shadow-inner transition-all duration-300 group-hover:scale-110 mt-2`}>
                <div className="h-6 w-6 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: skill.icon_svg || "" }} />
              </div>

              <div className="mt-4 flex flex-col items-center">
                <span className="font-body text-sm font-semibold text-white tracking-wide">{skill.name}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="relative z-10 mt-10 text-center">
        <span className="font-body text-xs text-gray-500 tracking-wider">
          Showing <span className="text-blue-400 font-semibold">{filteredSkills.length}</span> of {skills.length} skills
        </span>
      </div>

      {/* Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-[#0a0a0c] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="font-bebas text-2xl tracking-wide">{editingSkillId ? "Edit Skill" : "Add New Skill"}</h3>
              <button type="button" onClick={() => setIsSkillModalOpen(false)} className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Skill Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. React.js"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
                  Assigned Categories (Multiple Allowed)
                </label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto rounded-xl border border-white/10 bg-black/50 p-3">
                  {categories.map((cat) => {
                    const isChecked = selectedCatIds.includes(cat.id)
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategorySelection(cat.id)}
                        className={`rounded-lg px-3 py-1 text-xs font-medium cursor-pointer transition-colors ${
                          isChecked
                            ? "bg-blue-600 text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Icon SVG Code</label>
                <textarea
                  rows={4}
                  value={iconSvg}
                  onChange={(e) => setIconSvg(e.target.value)}
                  placeholder='<svg viewBox="0 0 24 24">...</svg>'
                  className="font-mono w-full rounded-xl border border-white/10 bg-black/50 p-3 text-xs text-blue-300 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">SVG Live Preview</label>
                <div className="flex items-center justify-center rounded-xl border border-dashed border-white/20 bg-black/40 p-4 min-h-[60px]">
                  {iconSvg ? (
                    <div className="h-8 w-8 text-blue-400 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: iconSvg }} />
                  ) : (
                    <span className="text-xs text-gray-500">Paste SVG string to preview icon</span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-sm font-semibold text-white shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : editingSkillId ? "Update Skill" : "Save Skill"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-[#0a0a0c] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="font-bebas text-2xl tracking-wide">{editingCatId ? "Edit Category" : "Add Category"}</h3>
              <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Web Development"
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-sm font-semibold text-white shadow-lg cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : editingCatId ? "Update Category" : "Save Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}