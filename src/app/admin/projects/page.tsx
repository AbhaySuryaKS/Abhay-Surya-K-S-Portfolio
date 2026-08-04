"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { Flip } from "gsap/Flip"
import { ArrowUpRight, ChevronLeft, ChevronRight, Edit2, FolderGit2, Image as ImageIcon, Plus, RefreshCw, Sparkles, Trash2, Upload, X } from "lucide-react"

interface SkillOption {
  id: number
  name: string
}

interface ProjectCategory {
  id: number
  name: string
}

interface ProjectItem {
  id: number
  title: string
  category_ids: number[]
  category_names?: string[]
  description: string
  full_description: string
  image: string
  github_url: string
  live_url: string
  selected_skill_ids?: number[]
}

interface ColorTheme {
  bgGradient: string
  border: string
  hoverShadow: string
  badgeBg: string
  badgeText: string
}

const COLOR_THEMES: ColorTheme[] = [
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
  {
    bgGradient: "from-amber-600/20 via-orange-950/20 to-transparent",
    border: "border-amber-500/30 hover:border-amber-400/70",
    hoverShadow: "hover:shadow-[0_8px_30px_rgba(245,158,11,0.25)]",
    badgeBg: "bg-amber-500/20 border-amber-400/30",
    badgeText: "text-amber-400",
  },
]

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [availableSkills, setAvailableSkills] = useState<SkillOption[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [isLoading, setIsLoading] = useState(true)

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Edit States
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingCatId, setEditingCatId] = useState<number | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Form Fields
  const [title, setTitle] = useState("")
  const [selectedCatIds, setSelectedCatIds] = useState<number[]>([])
  const [description, setDescription] = useState("")
  const [fullDescription, setFullDescription] = useState("")
  const [image, setImage] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [liveUrl, setLiveUrl] = useState("")
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([])

  // Category Form Field
  const [categoryName, setCategoryName] = useState("")

  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const loadData = async () => {
    setIsLoading(true)
    const res = await fetch("/api/projects")
    const data = await res.json()
    if (data && !data.error) {
      setProjects(data.projects || [])
      setCategories(data.categories || [])
      setAvailableSkills(data.availableSkills || [])
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
  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category_names?.includes(activeCategory))

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev === null || prev === 0 ? filteredProjects.length - 1 : prev - 1))
  }, [filteredProjects.length, selectedIndex])

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return
    setSelectedIndex((prev) => (prev === null || prev === filteredProjects.length - 1 ? 0 : prev + 1))
  }, [filteredProjects.length, selectedIndex])

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const toggleCategorySelection = (catId: number) => {
    setSelectedCatIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    )
  }

  const toggleSkillSelection = (skillId: number) => {
    setSelectedSkillIds((prev) =>
      prev.includes(skillId) ? prev.filter((id) => id !== skillId) : [...prev, skillId]
    )
  }

  const handleOpenAdd = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const handleEdit = (e: React.MouseEvent, p: ProjectItem) => {
    e.stopPropagation()
    setEditingId(p.id)
    setTitle(p.title)
    setSelectedCatIds(p.category_ids || [])
    setDescription(p.description)
    setFullDescription(p.full_description || "")
    setImage(p.image || "")
    setGithubUrl(p.github_url || "")
    setLiveUrl(p.live_url || "")
    setSelectedSkillIds(p.selected_skill_ids || [])
    setIsModalOpen(true)
  }

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    if (!confirm("Delete this project?")) return
    await fetch(`/api/projects?id=${id}`, { method: "DELETE" })
    await loadData()
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const payload = {
      title,
      category_ids: selectedCatIds,
      description,
      full_description: fullDescription,
      image,
      github_url: githubUrl,
      live_url: liveUrl,
      selectedSkillIds,
    }

    if (editingId) {
      await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, ...payload }),
      })
    } else {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    }

    setIsSaving(false)
    setIsModalOpen(false)
    resetForm()
    await loadData()
  }

  const resetForm = () => {
    setEditingId(null)
    setTitle("")
    setSelectedCatIds([])
    setDescription("")
    setFullDescription("")
    setImage("")
    setGithubUrl("")
    setLiveUrl("")
    setSelectedSkillIds([])
  }

  // Category Actions
  const handleOpenAddCategory = () => {
    setEditingCatId(null)
    setCategoryName("")
    setIsCategoryModalOpen(true)
  }

  const handleEditCategory = (cat: ProjectCategory) => {
    setEditingCatId(cat.id)
    setCategoryName(cat.name)
    setIsCategoryModalOpen(true)
  }

  const handleDeleteCategory = async (catId: number) => {
    if (!confirm("Deleting this category will remove it from linked projects. Continue?")) return
    await fetch(`/api/projects?id=${catId}&type=category`, { method: "DELETE" })
    await loadData()
  }

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryName.trim()) return
    setIsSaving(true)

    if (editingCatId) {
      await fetch("/api/projects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "category", id: editingCatId, name: categoryName }),
      })
    } else {
      await fetch("/api/projects", {
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

  const selectedProject = selectedIndex !== null ? filteredProjects[selectedIndex] : null

  return (
    <section ref={sectionRef} className="relative w-full bg-[#050505] px-4 py-12 sm:px-8 lg:px-16 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 ambient-studio-glow" />

      {/* Header */}
      <div className="relative z-10 mx-auto mb-8 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#60a5fa] mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Projects Admin CMS</span>
          </div>
          <h2 className="font-bebas text-4xl sm:text-5xl uppercase tracking-wide text-white">Manage Featured Projects</h2>
        </div>

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
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)] cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Category Pills with Hover Actions */}
      <div className="relative z-10 mb-12 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-5xl mx-auto">
        {categoryNames.map((cat) => {
          const isActive = activeCategory === cat
          const catObj = categories.find((c) => c.name === cat)

          return (
            <div key={cat} className="group relative inline-flex items-center">
              <button
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

      {/* Projects Grid */}
      <div ref={gridRef} className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => {
          const style = COLOR_THEMES[index % COLOR_THEMES.length]
          const isFilteredIndex = filteredProjects.findIndex((p) => p.id === project.id)
          return (
            <div
              key={project.id}
              data-categories={project.category_names?.join(",")}
              ref={(el) => {
                cardRefs.current[project.id] = el
              }}
              onClick={() => {
                if (isFilteredIndex !== -1) setSelectedIndex(isFilteredIndex)
              }}
              className={`project-card group relative flex flex-col justify-between cursor-pointer overflow-hidden rounded-2xl border bg-linear-to-br ${style.bgGradient} ${style.border} ${style.hoverShadow} p-5 transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="absolute top-3 right-3 flex items-center gap-1 z-20">
                <button
                  type="button"
                  onClick={(e) => handleEdit(e, project)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-gray-300 hover:text-white hover:bg-blue-600/50 cursor-pointer"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, project.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/30 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <div className="relative h-48 w-full overflow-hidden rounded-xl bg-black/40 border border-white/10 mb-4">
                  {project.image ? (
                    <Image src={project.image} alt={project.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-600">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-80" />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1 pr-16">
                    {project.category_names?.map((c) => (
                      <span key={c} className={`rounded-full border px-2.5 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${style.badgeBg} ${style.badgeText}`}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="font-bebas text-2xl tracking-wide text-white group-hover:text-blue-400 transition-colors">{project.title}</h3>
                  <p className="font-body text-xs text-gray-300/90 line-clamp-2 leading-relaxed">{project.description}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-gray-400 group-hover:text-white transition-colors">
                <span>View Details</span>
                <FolderGit2 className="h-4 w-4 text-blue-400" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Input Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#0a0a0c] p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <h3 className="font-bebas text-2xl tracking-wide">{editingId ? "Edit Project" : "Add Project"}</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
                  Project Categories (Multiple Allowed)
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto rounded-xl border border-white/10 bg-black/50 p-2.5">
                  {categories.map((cat) => {
                    const isSelected = selectedCatIds.includes(cat.id)
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleCategorySelection(cat.id)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-medium cursor-pointer ${
                          isSelected ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {cat.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Short Description</label>
                <textarea rows={2} required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Full Overview</label>
                <textarea rows={3} value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white" />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Project Image</label>
                <div className="relative h-32 w-full overflow-hidden rounded-xl border border-white/15 bg-black/60 mb-2 flex items-center justify-center">
                  {image ? <Image src={image} alt="Preview" fill className="object-cover" /> : <ImageIcon className="h-8 w-8 text-gray-500" />}
                </div>
                <label className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/20 px-4 py-2 text-xs font-semibold text-blue-400 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  <span>Upload Image File</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">GitHub URL</label>
                  <input type="text" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Live Demo URL</label>
                  <input type="text" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} className="w-full rounded-xl border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Tech Stack (`stack` table)</label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto rounded-xl border border-white/10 bg-black/50 p-2.5">
                  {availableSkills.map((skill) => {
                    const isSelected = selectedSkillIds.includes(skill.id)
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkillSelection(skill.id)}
                        className={`rounded-lg px-2.5 py-1 text-[11px] font-medium cursor-pointer ${
                          isSelected ? "bg-blue-600 text-white" : "bg-white/5 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        {skill.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 bg-gradient-to-r from-blue-600 to-blue-500 py-3 text-sm font-semibold text-white cursor-pointer disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : editingId ? "Update Project" : "Save Project"}
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
                  placeholder="e.g. Full-Stack"
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

      {/* Modal View Details */}
      {selectedProject && selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-6" onClick={() => setSelectedIndex(null)}>
          <div ref={modalRef} onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/15 bg-[#0a0a0c] shadow-2xl text-white flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/20">
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.category_names?.map((c) => (
                  <span key={c} className="rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    {c}
                  </span>
                ))}
              </div>
              <button type="button" onClick={() => setSelectedIndex(null)} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-col lg:flex-row gap-6 p-6 max-h-[70vh] overflow-y-auto">
              <div className="relative min-h-65 sm:min-h-80 lg:w-1/2 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60 shrink-0">
                {selectedProject.image && <Image src={selectedProject.image} alt={selectedProject.title} fill className="object-cover" />}
              </div>
              <div className="flex flex-col justify-between lg:w-1/2 w-full gap-4">
                <div>
                  <h3 className="font-bebas text-3xl sm:text-4xl tracking-wide text-white leading-tight">{selectedProject.title}</h3>
                  <p className="font-body text-xs sm:text-sm leading-relaxed text-gray-300 mt-3">{selectedProject.full_description || selectedProject.description}</p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  {selectedProject.live_url && (
                    <a href={selectedProject.live_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-xs sm:text-sm font-semibold text-white">
                      <span>Live Demo</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                  {selectedProject.github_url && (
                    <a href={selectedProject.github_url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white">
                      <ArrowUpRight className="h-4 w-4" />
                      <span>Repository</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/20">
              <span className="text-xs text-gray-400">Project {selectedIndex + 1} of {filteredProjects.length}</span>
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