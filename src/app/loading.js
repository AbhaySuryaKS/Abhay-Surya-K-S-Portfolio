"use client";
import { motion } from "framer-motion";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-neutral-950 overflow-hidden font-sans">
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />
            <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(50,60,50,0.2),transparent_80%)]" />
            <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-24 h-24 mb-8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-t-2 border-b-2 border-cyan-500/30 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-4 border border-cyan-400/50 rounded-full bg-cyan-500/5 backdrop-blur-sm"
                    />
                    <motion.div 
                        animate={{ top: ["20%", "80%", "20%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-1/2 -translate-x-1/2 w-12 h-px bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                    />
                </div>
                <div className="flex flex-col items-center gap-3">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                    >
                        <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-black tracking-[0.6em] uppercase text-cyan-500">
                            Initializing_Vault
                        </span>
                    </motion.div>
                    <div className="h-0.5 w-48 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="h-full w-1/3 bg-linear-to-r from-transparent via-cyan-500 to-transparent shadow-[0_0_8px_rgba(34,211,238,0.4)]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}