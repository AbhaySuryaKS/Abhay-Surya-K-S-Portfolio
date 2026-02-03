"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
    return (
        <main className="min-h-screen w-full bg-neutral-950 text-neutral-300 selection:bg-neutral-900/30 relative overflow-hidden font-sans">
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />
            <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_80%)]" />
            <div className="relative z-10 h-screen flex flex-col items-center justify-center px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative mb-8"
                >
                    <h1 className="text-[12rem] md:text-[18rem] font-black tracking-tighter text-white opacity-5 italic leading-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 0.2, repeat: Infinity }}
                            className="bg-red-500/10 border border-red-500/20 px-4 py-1 rounded-full backdrop-blur-md"
                        >
                            <span className="text-red-500 text-[10px] font-black tracking-[0.4em] uppercase">
                                Access_Denied
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-md"
                >
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">
                        Page not found.
                    </h2>
                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold leading-relaxed mb-10">
                        The requested node does not exist in the current directory. <br />
                    </p>
                    <div>
                        <Link 
                            href="/"
                            className="w-full sm:w-auto px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-cyan-500 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            Return_Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}