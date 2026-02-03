"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "react-toastify";

const MarqueeRow = ({ skills, direction = "left", speed = 30 }) => {
    const isLeft = direction === "left";
    return (
        <div className="group flex overflow-hidden py-3 mask-[linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <motion.div
              animate={{ x: isLeft ? [0, -1000] : [-1000, 0] }}
              transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
              className="flex gap-5 whitespace-nowrap px-4"
            >
                {[...skills, ...skills, ...skills, ...skills].map((skill, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center px-8 py-3.5 bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-2xl hover:border-cyan-500/40 hover:bg-neutral-800/60 transition-all duration-500 cursor-default"
                    >
                        <span className="text-sm md:text-base font-semibold tracking-wide text-neutral-400 group-hover:text-cyan-400 transition-colors">
                            {skill.name}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

function Skills() {
    const [rows, setRows] = useState({ r1: [], r2: [], r3: [] });
    const [currentLearning, setCurrentLearning] = useState([]);
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const { data, error } = await supabase
                  .from("skills")
                  .select("*")
                  .order("name", { ascending: true });

                if (data) {
                    const learning = data.filter(s => s.current_working === true);
                    const standardSkills = data.filter(s => s.current_working !== true);
                    setCurrentLearning(learning);
                    const total = standardSkills.length;
                    const part = Math.ceil(total / 3);
                    setRows({
                        r1: standardSkills.slice(0, part),
                        r2: standardSkills.slice(part, part * 2),
                        r3: standardSkills.slice(part * 2)
                    });
                }
            } catch (err) {
                toast.error("Failed to fetch skills. Please try reloading the page.");
            }
        };
        fetchSkills();
    }, []);
  
    return (
        <main className="min-h-screen w-full bg-neutral-950 text-neutral-300 selection:bg-grey-900/30 relative overflow-hidden font-sans">
            <Navbar />
                <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />
                <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)]" />
                <div className="relative z-10 pt-40 pb-20 flex flex-col items-center">
                <div className="text-center mb-28 px-6">
                    <motion.h1
                        initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
                        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8"
                    >
                        Skills & <span className="text-neutral-400">Tools</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-neutral-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed italic font-medium"
                    >
                        {"Where passion meets proficiency: the technical stack that fuels my interests."}
                    </motion.p>
                </div>
      
                <div className="w-full flex flex-col gap-4 relative max-w-8xl">
                    {rows.r1.length > 0 && <MarqueeRow skills={rows.r1} direction="left" speed={50} />}
                    {rows.r2.length > 0 && <MarqueeRow skills={rows.r2} direction="right" speed={40} />}
                    {rows.r3.length > 0 && <MarqueeRow skills={rows.r3} direction="left" speed={30} />}
                </div>
                {currentLearning.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="mt-28 flex flex-col items-center px-6 w-full max-w-4xl"
                    >
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-px w-12 bg-linear-to-r from-transparent to-cyan-500/50" />
                            <span className="text-[11px] uppercase tracking-[0.5em] text-cyan-500 font-bold">Currently Deep-Diving</span>
                            <div className="h-px w-12 bg-linear-to-l from-transparent to-cyan-500/50" />
                        </div>
          
                        <div className="flex flex-wrap justify-center gap-3">
                            {currentLearning.map((item, i) => (
                                <div key={i} className="relative group overflow-hidden px-6 py-2.5 rounded-xl border border-white/5 bg-white/2 hover:border-cyan-500/30 transition-all duration-300">
                                    <span className="relative z-10 text-xs md:text-sm font-bold text-neutral-400 group-hover:text-cyan-400 uppercase tracking-widest transition-colors">
                                        {item.name}
                                    </span>
                                    <div className="absolute inset-0 bg-cyan-500/5 animate-pulse" />
                                </div>
                            ))}
                            <span className="px-5 py-2.5 text-xs md:text-sm font-semibold text-neutral-600 uppercase tracking-widest flex items-center italic">
                                & more
                            </span>
                        </div>
                    </motion.div>
                )}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-32 flex flex-col items-center gap-8 group">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 font-medium text-center leading-loose">
                        This is not the end. There is more to know about me. <br />
                        <Link href="/certificates" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30 transition-all font-bold">
                            View my Certificates
                        </Link>
                    </p>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-px h-16 bg-linear-to-b from-cyan-500/50 to-transparent group-hover:h-24 transition-all duration-700" />
                        <p className="text-[10px] uppercase tracking-[1em] text-neutral-700 font-black">End of Skills</p>
                    </div>
                </motion.div>
              </div>
        </main>
    );
}

export default Skills;