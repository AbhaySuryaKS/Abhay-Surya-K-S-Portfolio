"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await supabase
                .from("projects")
                .select("*")
                .order("created_at", { ascending: false });
                setProjects(data || []);
            } catch (error) {
                toast.error("Failed to fetch projects. Please try reloading the page.");
            }
        };
        fetchProjects();
    }, []);

    return (
        <main className="min-h-screen w-full bg-neutral-950 text-neutral-300 selection:bg-grey-900/30 relative overflow-hidden font-sans">
            <Navbar />
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />
            <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)]" />
            <div className="relative z-10 pt-40 pb-20 flex flex-col items-center">
                <header className="text-center mb-28 px-6">
                    <motion.h1
                        initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
                        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8"
                    >
                        Selected <span className="text-neutral-400">Projects</span>
                    </motion.h1>
                </header>
                <section className="w-full max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.length > 0 ? (
                        projects.map((project, idx) => (
                            <motion.div 
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="group relative bg-neutral-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 hover:border-cyan-500/30 transition-all duration-500"
                            >
                                <div className="relative aspect-video w-full mb-6 overflow-hidden rounded-2xl border border-white/5">
                                    <Image 
                                        src={project.image_url || "/defaultProject.png"} 
                                        alt={project.title} fill 
                                        className="object-cover group-hover:scale-105 transition-all duration-1000 opacity-60 group-hover:opacity-100" 
                                    />
                                </div>
                                <span className="text-neutral-700 font-mono text-xs mb-4 block">0{idx + 1}</span>
                                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">{project.title}</h2>
                                <p className="text-sm text-neutral-500 leading-relaxed mb-8 line-clamp-2">{project.description}</p>
                                <div className="flex gap-6">
                                    <Link href={project.link || "#"} className="text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white transition-colors">Source &lt;/&gt;</Link>
                                </div>
                            </motion.div>
                        ))
                    ):(
                        <p className="col-span-full text-center uppercase tracking-widest text-neutral-500">No Projects Found</p>
                    )}
                </section>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-32 flex flex-col items-center gap-8 group">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 font-medium text-center leading-loose">
                        Thats it, Now that you know me. <br />
                        <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30 transition-all font-bold">
                            Reach me out
                        </Link>
                    </p>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-px h-16 bg-linear-to-b from-cyan-500/50 to-transparent group-hover:h-24 transition-all duration-700" />
                        <p className="text-[10px] uppercase tracking-[1em] text-neutral-700 font-black">End of Projects</p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}