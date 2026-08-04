"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { CheckCircle2, Edit2, FileText, Image as ImageIcon, Plus, RefreshCw, Save, Trash2, Upload, X } from "lucide-react"

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const [profile, setProfile] = useState({
    greeting: "",
    name: "",
    role: "",
    location: "",
    availability: "",
    profileImage: "",
    resumePdf: "",
    bio: "",
    links: [] as { id?: number; name: string; value: string; icon_svg: string }[],
    stats: [] as { id?: number; value: string; label: string; sort_order: number }[],
  })

  useEffect(() => {
    async function load() {
      setIsLoading(true)
      const res = await fetch("/api/profile")
      const data = await res.json()
      if (data && !data.error) setProfile(data)
      setIsLoading(false)
    }
    load()
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setProfile((prev) => ({ ...prev, profileImage: reader.result as string }))
      reader.readAsDataURL(file)
    }
  }

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setProfile((prev) => ({ ...prev, resumePdf: reader.result as string }))
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
    setIsSaving(false)
    setIsEditing(false)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-gray-400">
        <RefreshCw className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-8">
      {/* Top Controller Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="font-bebas text-4xl sm:text-5xl tracking-wide uppercase text-white">Profile Overview</h1>
          <p className="font-body text-xs text-gray-400 mt-1">Manage single profile row, social icon SVGs, and document assets.</p>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-semibold text-gray-300 hover:text-white"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)] cursor-pointer"
            >
              {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : savedSuccess ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Save className="h-4 w-4" />}
              <span>{isSaving ? "Saving..." : savedSuccess ? "Saved!" : "Save Profile"}</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-[0_0_20px_-4px_rgba(59,130,246,0.6)] cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Media Column */}
        <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md">
          <h3 className="font-bebas text-2xl tracking-wide text-white">Media Assets</h3>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Profile Photo</label>
            <div className="relative h-48 w-full overflow-hidden rounded-xl border border-white/15 bg-black/60 mb-3 flex items-center justify-center">
              {profile.profileImage ? <Image src={profile.profileImage} alt="Profile" fill className="object-contain" /> : <ImageIcon className="h-8 w-8 text-gray-500" />}
            </div>
            {isEditing && (
              <label className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/20 px-4 py-2 text-xs font-semibold text-blue-400 cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>Upload Photo</span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          <hr className="border-white/10" />

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Resume PDF</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/50 p-3 mb-3">
              <FileText className="h-5 w-5 text-blue-400 shrink-0" />
              <span className="text-xs text-gray-300 truncate">{profile.resumePdf ? "PDF Document Saved" : "No PDF Uploaded"}</span>
            </div>
            {isEditing && (
              <label className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 cursor-pointer">
                <Upload className="h-4 w-4" />
                <span>Upload PDF</span>
                <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md">
            <h3 className="font-bebas text-2xl tracking-wide text-white">General Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Greeting Prefix</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.greeting}
                  onChange={(e) => setProfile({ ...profile, greeting: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white disabled:opacity-60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Role</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.role}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Location</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Availability Badge</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.availability}
                onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Biography</label>
              <textarea
                rows={3}
                disabled={!isEditing}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-sm text-white disabled:opacity-60"
              />
            </div>
          </div>

          {/* Social Links Panel */}
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="font-bebas text-2xl tracking-wide text-white">Social Links (Icon SVGs)</h3>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setProfile((prev) => ({ ...prev, links: [...prev.links, { name: "github", value: "https://", icon_svg: "" }] }))}
                  className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs text-blue-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Link</span>
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {profile.links.map((link, idx) => (
                <div key={idx} className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/40 p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 shrink-0" dangerouslySetInnerHTML={{ __html: link.icon_svg || "" }} />
                    <input
                      type="text"
                      disabled={!isEditing}
                      placeholder="Name"
                      value={link.name}
                      onChange={(e) => {
                        const next = [...profile.links]
                        next[idx].name = e.target.value
                        setProfile({ ...profile, links: next })
                      }}
                      className="w-1/3 rounded-lg border border-white/10 bg-black/50 px-3 py-1 text-xs text-white disabled:opacity-60"
                    />
                    <input
                      type="text"
                      disabled={!isEditing}
                      placeholder="URL"
                      value={link.value}
                      onChange={(e) => {
                        const next = [...profile.links]
                        next[idx].value = e.target.value
                        setProfile({ ...profile, links: next })
                      }}
                      className="w-2/3 rounded-lg border border-white/10 bg-black/50 px-3 py-1 text-xs text-white disabled:opacity-60"
                    />
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => setProfile((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== idx) }))}
                        className="p-1 text-gray-500 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  {isEditing && (
                    <textarea
                      rows={2}
                      placeholder="<svg>... Icon SVG String</svg>"
                      value={link.icon_svg}
                      onChange={(e) => {
                        const next = [...profile.links]
                        next[idx].icon_svg = e.target.value
                        setProfile({ ...profile, links: next })
                      }}
                      className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-1 text-[11px] font-mono text-blue-300"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Stats Panel */}
          <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="font-bebas text-2xl tracking-wide text-white">Stats Counters</h3>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => setProfile((prev) => ({ ...prev, stats: [...prev.stats, { value: "0+", label: "New Stat", sort_order: prev.stats.length }] }))}
                  className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs text-blue-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Stat</span>
                </button>
              )}
            </div>

            {profile.stats.map((stat, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  disabled={!isEditing}
                  value={stat.value}
                  onChange={(e) => {
                    const next = [...profile.stats]
                    next[idx].value = e.target.value
                    setProfile({ ...profile, stats: next })
                  }}
                  className="w-1/3 rounded-xl border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-blue-400 font-bold disabled:opacity-60"
                />
                <input
                  type="text"
                  disabled={!isEditing}
                  value={stat.label}
                  onChange={(e) => {
                    const next = [...profile.stats]
                    next[idx].label = e.target.value
                    setProfile({ ...profile, stats: next })
                  }}
                  className="w-2/3 rounded-xl border border-white/10 bg-black/50 px-3 py-1.5 text-xs text-white disabled:opacity-60"
                />
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setProfile((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== idx) }))}
                    className="p-1.5 text-gray-500 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}