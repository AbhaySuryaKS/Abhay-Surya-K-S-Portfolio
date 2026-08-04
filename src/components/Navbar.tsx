"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { Compass, User, Zap, Award, Layers } from "lucide-react";

type MenuState = "idle" | "descending" | "open" | "retracting";

export function Navbar() {
  const [menuState, setMenuState] = useState<MenuState>("idle");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandingRoute, setExpandingRoute] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const routes = [
    { name: "About", href: "/", icon: User },
    { name: "Skills", href: "/skills", icon: Zap },
    { name: "Certificates", href: "/certificates", icon: Award },
    { name: "Projects", href: "/projects", icon: Layers },
  ];

  const handleOpen = () => {
    setMenuState("descending");
    setTimeout(() => {
      setMenuState("open");
    }, 1000);
  };

  const handleClose = () => {
    if (menuState !== "open") return;
   
    setMenuState("retracting");
   
    setTimeout(() => {
      setMenuState("idle");
    }, 400);
  };

  const handleNavigate = (href: string) => {
    if (pathname === href) return;
   
    setExpandingRoute(href);
   
    setTimeout(() => {
      router.push(href);
      setMenuState("idle");
      setExpandingRoute(null);
    }, 350);
  };

  return (
    <>
      <div className="fixed top-6 left-6 z-50" style={{ perspective: "1000px" }}>
        <AnimatePresence mode="wait">
          {menuState === "idle" && (
            <motion.button
              key="launcher"
              initial={{ scale: 0, rotate: -180, filter: "brightness(4)" }}
              animate={{ scale: 1, rotate: 0, filter: "brightness(1)" }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.5, type: "spring", damping: 15 }}
              onClick={handleOpen}
              whileHover={{ scale: 1.08, y: -2, rotateY: 18 }}
              whileTap={{ scale: 0.94, y: 2, rotateY: -14 }}
              className="relative flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-br from-zinc-800 via-zinc-900 to-black overflow-hidden cursor-pointer"
              style={{
                boxShadow:
                  "0 4px 0 0 rgba(0,0,0,0.9), 0 10px 18px rgba(0,0,0,0.7), 0 0 16px 2px rgba(59,130,246,0.35), inset 0 0 0 1.5px rgba(96,165,250,0.5), inset 0 1.5px 2px rgba(255,255,255,0.2), inset 0 -3px 5px rgba(0,0,0,0.9)",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.22) 46%, transparent 62%)",
                }}
              />
              <Compass
                size={22}
                className="relative z-10 text-[#60a5fa] drop-shadow-[0_0_8px_rgba(59,130,246,0.85)]"
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {menuState !== "idle" && (
          <motion.div
            key="canvas"
            className="fixed inset-0 z-50 pointer-events-none"
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          >
            <motion.div
              key="backdrop"
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              onClick={handleClose}
              className="absolute inset-0 bg-black/60 pointer-events-auto"
            />
            <motion.div
              key="capsule"
              initial={{ top: "1.5rem", left: "1.5rem", x: 0, y: 0 }}
              animate={{
                top: "100%",
                left: "50%",
                x: "-50%",
                y: "-5rem",
                transition: {
                  duration: 1.0,
                  x: { duration: 1.0, ease: "linear" },
                  y: { duration: 1.0, ease: "easeIn" },
                },
              }}
              className="absolute flex items-center justify-center transform-gpu overflow-visible"
            >
              <motion.nav
                initial={{ width: "2.75rem", height: "2.75rem", borderRadius: "50%" }}
                animate={{
                  width:
                    menuState === "open" || menuState === "retracting"
                      ? "13.75rem"
                      : "2.75rem",
                  height:
                    menuState === "open" || menuState === "retracting"
                      ? "3.5rem"
                      : "2.75rem",
                  borderRadius:
                    menuState === "open" || menuState === "retracting"
                      ? "9999px"
                      : "50%",
                  opacity: menuState === "retracting" ? 0 : 1,
                  transition:
                    menuState === "retracting"
                      ? { opacity: { duration: 0.45, ease: "easeIn" } }
                      : { duration: 0.4, ease: "circOut" },
                }}
                className="relative flex items-center justify-center bg-linear-to-br from-zinc-900/90 via-black/95 to-black border border-white/10 overflow-visible"
                style={{
                  boxShadow:
                    "0 4px 0 0 rgba(0,0,0,0.9), 0 20px 40px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(59,130,246,0.25), inset 0 1.5px 2px rgba(255,255,255,0.15), inset 0 -4px 6px rgba(0,0,0,0.9)",
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 rounded-[inherit]"
                  style={{
                    background:
                      "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.12) 46%, transparent 62%)",
                  }}
                />
                <AnimatePresence mode="wait">
                  {menuState !== "open" && (
                    <motion.div
                      key="compass-icon"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 0.25 },
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute inset-0 flex items-center justify-center text-[#60a5fa] drop-shadow-[0_0_8px_rgba(59,130,246,0.85)]"
                    >
                      <Compass
                        size={26}
                        className={menuState === "descending" ? "animate-spin" : ""}
                        style={{ animationDuration: "2.5s" }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="flex items-center gap-2 px-2 overflow-visible">
                  {(menuState === "open" || menuState === "retracting") &&
                    routes.map((route, index) => {
                      const Icon = route.icon;
                      const isActive = pathname === route.href;
                      const isHovered = hoveredIndex === index;
                      const isExpanding = expandingRoute === route.href;
                      const ringColor = isActive
                        ? "rgba(96,165,250,0.8)"
                        : isHovered
                        ? "rgba(59,130,246,0.6)"
                        : "rgba(255,255,255,0.08)";
                      const glowColor = isActive
                        ? "rgba(59,130,246,0.45)"
                        : isHovered
                        ? "rgba(37,99,235,0.35)"
                        : "transparent";
                      const iconColorClass = isActive
                        ? "text-[#60a5fa] drop-shadow-[0_0_8px_rgba(59,130,246,0.85)]"
                        : isHovered
                        ? "text-[#93c5fd] drop-shadow-[0_0_6px_rgba(59,130,246,0.7)]"
                        : "text-zinc-400";
                      return (
                        <div
                          key={route.name}
                          className="relative pointer-events-auto"
                          style={{ perspective: "500px" }}
                        >
                          <div
                            className="absolute inset-0 rounded-full translate-y-0.75 bg-linear-to-b from-zinc-950 to-black"
                            style={{
                              boxShadow: "0 4px 6px rgba(0,0,0,0.8)",
                            }}
                          />
                          <AnimatePresence>
                            {isHovered && !isExpanding && (
                              <motion.div
                                initial={{ opacity: 0, y: 0, scale: 0.85 }}
                                animate={{ opacity: 1, y: -52, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.85 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="absolute left-1/2 -translate-x-1/2 pointer-events-none rounded-lg bg-black/90 border border-blue-500/40 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(0,0,0,0.9)] backdrop-blur-md whitespace-nowrap z-50 flex items-center justify-center"
                              >
                                {route.name}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-blue-500/40 rotate-45" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <motion.button
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => handleNavigate(route.href)}
                            initial={{ opacity: 0, scale: 0, x: 0, y: 0, rotate: 0 }}
                            animate={
                              menuState === "retracting"
                                ? {
                                    opacity: 0,
                                    scale: 0.5,
                                    transition: {
                                      delay: index * 0.02,
                                      duration: 0.3,
                                      ease: "easeIn",
                                    },
                                  }
                                : {
                                    opacity: 1,
                                    scale: 1,
                                    transition: { delay: index * 0.04 },
                                  }
                            }
                            whileHover={
                              !expandingRoute && menuState === "open"
                                ? { z: 20, y: -3, rotateY: 18, scale: 1.08 }
                                : {}
                            }
                            whileTap={
                              !expandingRoute && menuState === "open"
                                ? { z: -6, y: 2, rotateY: -14, scale: 0.94 }
                                : {}
                            }
                            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-zinc-800 via-zinc-900 to-black overflow-hidden transition-shadow duration-200 cursor-pointer"
                            style={{
                              boxShadow: `0 3px 6px rgba(0,0,0,0.6), 0 0 14px 2px ${glowColor}, inset 0 0 0 1.5px ${ringColor}, inset 0 1.5px 2px rgba(255,255,255,0.15), inset 0 -3px 4px rgba(0,0,0,0.9)`,
                              transformStyle: "preserve-3d",
                            }}
                          >
                            <div
                              className="pointer-events-none absolute inset-0 rounded-full"
                              style={{
                                background:
                                  "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.22) 46%, transparent 62%)",
                              }}
                            />
                            <div
                              className={`pointer-events-none absolute inset-0 rounded-full transition-opacity duration-200 ${
                                isActive || isHovered
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                              style={{
                                background: `radial-gradient(circle at 50% 85%, ${glowColor}, transparent 60%)`,
                              }}
                            />
                            <Icon
                              size={18}
                              className={`relative z-10 transition-colors duration-200 ${iconColorClass}`}
                            />
                          </motion.button>
                          <AnimatePresence>
                            {isExpanding && (
                              <motion.div
                                key="wipe"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 200, opacity: 1 }}
                                transition={{ duration: 0.35, ease: "easeIn" }}
                                className="absolute top-1/2 left-1/2 z-100 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#050505] pointer-events-none"
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                </div>
              </motion.nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}