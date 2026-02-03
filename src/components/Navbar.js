"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const tabs = ["about", "skills", "certificates", "projects", "contact"];
    const segments = pathname.split('/').filter(Boolean);
    const activeTab = segments.length === 0 ? "about" : segments[0];

    return (
        <nav className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-neutral-900/10 px-6 py-4 backdrop-blur-xl transition-all duration-300">
            <Link href="/" className="text-lg font-medium tracking-widest text-cyan-400 uppercase">
                Portfolio
            </Link>

            <ul className="hidden items-center gap-8 min-[720px]:flex">
                {tabs.map((item) => {
                    const isActive = activeTab === item;
                    const href = item === "about" ? "/" : `/${item}`;
                    
                    return (
                        <li key={item} className="relative">
                            <Link
                                href={href}
                                className={`relative py-2 text-sm font-medium transition-colors duration-300 ${
                                    isActive ? "text-white" : "text-neutral-400 hover:text-neutral-100"
                                }`}
                            >
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                                <span
                                    className={`absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all duration-300 ease-out ${
                                        isActive ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                                    }`}
                                />
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <button
                aria-label="Toggle Menu"
                className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full hover:bg-white/5 min-[720px]:hidden transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${isMobileMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
                <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`h-0.5 w-6 bg-white transition-all duration-300 ${isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
            <div
                className={`fixed w-fit h-auto top-0 right-0 p-8 m-4 rounded-3xl border border-white/10 backdrop-blur-3xl z-40 flex flex-col items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] min-[720px]:hidden ${
                    isMobileMenuOpen ? "translate-y-16 opacity-100 bg-neutral-950/90" : "-translate-y-full opacity-0"
                }`}
            >
                <ul className="flex flex-col items-center gap-6 text-center">
                    {tabs.map((item, index) => {
                        const isActive = activeTab === item;
                        const href = item === "about" ? "/" : `/${item}`;

                        return (
                            <li 
                                key={item} 
                                style={{ transitionDelay: isMobileMenuOpen ? `${index * 50}ms` : "0ms" }}
                                className={`transition-all duration-500 ${isMobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                            >
                                <Link
                                    href={href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`relative text-lg font-medium transition-colors duration-300 ${
                                        isActive ? "text-cyan-400" : "text-neutral-400"
                                    }`}
                                >
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;