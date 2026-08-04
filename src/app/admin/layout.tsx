"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut } from "../../lib/auth-client"
import { Award, Code2, FolderGit2, LogOut, Sparkles, User } from "lucide-react"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/admin/login")
    router.refresh()
  }

  const navItems = [
    { name: "Profile", href: "/admin", icon: User },
    { name: "Skills", href: "/admin/skills", icon: Code2 },
    { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
    { name: "Certificates", href: "/admin/certificates", icon: Award },
  ]

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#050505] text-white selection:bg-blue-600/30">
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#0a0a0c]/80 px-4 backdrop-blur-xl lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-bebas text-xl tracking-wider text-white">Admin</span>
        </div>
        <nav className="flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.name}
                className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="sr-only">{item.name}</span>
              </Link>
            )
          })}
        </nav>
        <button
          onClick={handleSignOut}
          title="Sign Out"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Sign Out</span>
        </button>
      </header>
      <aside className="hidden lg:flex fixed left-0 top-0 z-30 h-screen w-64 flex-col justify-between border-r border-white/10 bg-[#0a0a0c]/80 p-6 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-8 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-bebas text-2xl tracking-wider text-white">Admin Portal</h2>
              <p className="text-[10px] text-gray-400 font-mono">CMS CONTROL PANEL</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </aside>
      <main className="flex-1 p-4 sm:p-6 lg:ml-64 lg:p-8 overflow-y-auto">{children}</main>
    </div>
  )
}