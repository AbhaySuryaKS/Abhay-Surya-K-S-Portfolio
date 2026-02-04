"use client";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";  
import { getQuote } from "@/components/getQuote.js";

export default function Home() {
    const nameSectionRef = useRef(null);
    const [quote, setQuote] = useState("");
    
    useEffect(() => {
        async function fetchQuote() {
            const fetchedQuote = await getQuote();
            setQuote(fetchedQuote);
        }
        fetchQuote();
    },[])
    
    const { scrollYProgress } = useScroll({
        target: nameSectionRef,
        offset: ["start start", "end start"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
    const nameOpacity = useTransform(smoothProgress, [0, 0.7], [1, 0]);
    const nameScale = useTransform(smoothProgress, [0, 1], [1, 1.1]);
    const nameBlur = useTransform(smoothProgress, [0, 0.8], ["blur(0px)", "blur(25px)"]);
    const navOpacity = useTransform(smoothProgress, [0.1, 0.3], [0, 1]);
    const navY = useTransform(smoothProgress, [0.1, 0.3], ["-100%", "0%"]);

    const navLinks = [
        { name: "Skills", href: "/skills", desc: "Technical proficiency" },
        { name: "Projects", href: "/projects", desc: "Production-ready works" },
        { name: "Certificates", href: "/certificates", desc: "Verified achievements" },
    ];

    return (
        <main className="w-full bg-neutral-950 text-neutral-300 relative overflow-x-hidden font-sans">            
            <motion.div style={{ opacity: navOpacity, y: navY }} className="fixed top-0 left-0 w-full z-25">
                <Navbar />
                <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />
                <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)]" />
            </motion.div>
            <section ref={nameSectionRef} className="relative h-[130vh] w-full">
                <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
                    <motion.div style={{ opacity: nameOpacity, scale: nameScale, filter: nameBlur }} className="text-center z-10">
                        <h1 className="text-[12vw] md:text-[10vw] font-black tracking-tighter leading-[0.8] text-white uppercase italic">
                            ABHAY <br/> <span className="text-neutral-600 not-italic">SURYA K S</span>
                        </h1>
                        <motion.div className="absolute bottom-[-25vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
                            <p className="text-[10px] tracking-[0.6em] text-cyan-500 uppercase font-bold animate-pulse">Scroll to reveal</p>
                            <div className="w-px h-12 bg-linear-to-b from-cyan-500 to-transparent" />
                        </motion.div>
                    </motion.div>
                </div>
            </section>
            <section className="relative h-fit z-20 py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-16 md:gap-24">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }} 
                        whileInView={{ opacity: 1, x: 0 }} 
                        transition={{ duration: 1 }}
                        className="relative w-full max-w-87.5 md:max-w-105 aspect-4/5 rounded-4xl overflow-hidden border border-white/5 shadow-2xl top-0"
                    >
                        <Image src="/profilepic.png" alt="Abhay Surya" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-1000" priority />
                        <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent to-transparent" />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        className="flex-1 space-y-16" 
                    >
                        <div className="space-y-6">
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-none">
                                Currently <span className="text-cyan-500 underline decoration-white/10 underline-offset-8">Architecting</span> the Modern Web.
                            </h2>
                            <p className="text-lg md:text-xl text-neutral-400 leading-relaxed font-light">
                                Based in Bangalore, pursuing Computer Science and Engineering at <span className="text-white font-medium">New Horizon College of Engineering</span>. I specialize in building highly-available applications that merge logic with aesthetic precision.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-white/30 pt-12">
                            <div className="space-y-4 mb-6 md:mb-0">
                                <h3 className="text-xs font-black tracking-[0.3em] uppercase text-cyan-500">Daily Stack</h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">
                                    I am currently mastering <span className="text-neutral-300">Fullstack Development with DevOps</span> integration. My workflow involves building autonomous systems using <span className="text-neutral-300">Agentic AI</span>.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-xs font-black tracking-[0.3em] uppercase text-neutral-500">Exploring Terms</h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">
                                    Venturing deep into <span className="text-neutral-300">Cloud Systems & Architecture</span>. Focused on mastering <span className="text-neutral-300">scalable, global-ready websites</span> on cloud-native infrastructures.
                                </p>
                            </div>
                        </div>
                        <div className="w-fit flex gap-6 bg-neutral-900/80 border border-white/20 hover:border-cyan-500 px-6 py-4 rounded-full mt-8 justify-center md:justify-start transition-colors duration-300 group">
                            <Link href="/skills" className="flex items-center gap-4 text-white group-hover:text-cyan-500 font-bold text-xs tracking-[0.3em] uppercase transition-colors">
                                Explore Portfolio 
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
            <section
                className="relative h-fit z-20 mx-6 my-2 md:mx-8" 
            >
                <motion.div 
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{duration: 1.5}}
                    className="p-4 border-l-2 border-cyan-500/60 bg-neutral-900/70 rounded-r-2xl"
                >
                    <span className="text-[10px] font-mono text-cyan-500/80 uppercase tracking-widest block mb-2">{'// Daily Intel'}</span>
                    <p className="text-neutral-300 italic font-serif text-lg leading-relaxed">
                        `{quote}`
                    </p>
                </motion.div>
            </section>
            <section className="relative z-20 py-24 w-full px-6 bg-neutral-900/10 border-t border-white/20">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{duration: 1.5}}
                    className="max-w-6xl mx-auto text-center md:text-left"
                >
                    <h3 className="text-4xl font-bold text-white tracking-tighter mb-12">Directory</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {navLinks.map((link, idx) => (
                            <Link key={link.name} href={link.href} className="group p-8 rounded-3xl border border-white/5 bg-neutral-900/70 hover:bg-neutral-900/60 hover:border-cyan-500/30 transition-all">
                                <span className="text-neutral-700 font-mono text-xs mb-4 block group-hover:text-cyan-600 transition-colors">0{idx + 1}</span>
                                <h4 className="text-xl font-bold text-white mb-2">{link.name}</h4>
                                <p className="text-xs text-neutral-500 leading-relaxed mb-6">{link.desc}</p>
                                <div className="h-px w-0 group-hover:w-full bg-cyan-500 transition-all duration-500" />
                            </Link>
                        ))}
                    </div>
                </motion.div>
            </section>
            <section className="relative z-20 py-24 flex flex-col items-center">
                <div className="flex flex-col items-center gap-8">
                    <div className="flex items-center gap-4 w-64">
                        <div className="h-px flex-1 bg-linear-to-r from-transparent to-neutral-600" />
                        <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-neutral-500">End of Page</span>
                        <div className="h-px flex-1 bg-linear-to-l from-transparent to-neutral-600" />
                    </div>
                    <div className="w-px h-12 bg-linear-to-b from-cyan-500 to-transparent" />
                </div>
                
                <p className="mt-12 text-[10px] text-neutral-800 tracking-[0.2em] font-mono">
                    {'System.Exit(0) // Abhay Surya Portfolio v1.0'}
                </p>
            </section>
        </main>
    );

}
