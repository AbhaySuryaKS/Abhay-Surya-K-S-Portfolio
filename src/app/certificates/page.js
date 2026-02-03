"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";

export default function Certificates() {
    const [certs, setCerts] = useState([]);

    useEffect(() => {
        const fetchCerts = async () => {
            try {
                const { data, error } = await supabase
                    .from("certificates")
                    .select("*")
                    .order("name", { ascending: true });
                setCerts(data || []);
            } catch (err) {
                toast.error("Failed to fetch certificates. Please try reloading the page.");
            }
        };
        fetchCerts();
    }, []);

    return (
        <main className="min-h-screen w-full bg-neutral-950 text-neutral-300 selection:bg-neutral-900/30 relative overflow-x-hidden font-sans">
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
                        Achievements <span className="text-neutral-400">& Accolades</span>
                    </motion.h1>
                </header>
                <section className="w-full max-w-7xl px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certs.length > 0 ? (
                        certs.map((cert, idx) => (
                            <motion.div
                                key={cert.id || idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-neutral-900/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all duration-500"
                            >
                                <div className="relative aspect-4/3 overflow-hidden transition-all duration-1000 border-b border-white/5">
                                    <Image
                                        fill
                                        src={cert.image_url || "/defaultCertificate.png"}
                                        alt={cert.name}
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                    />
                                </div>
                                <div className="p-8">
                                    <span className="text-cyan-500 font-mono text-[10px] tracking-widest uppercase mb-3 block">Cert_#{idx + 1}</span>
                                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">{cert.name}</h3>
                                    <p className="text-xs text-neutral-500 uppercase tracking-widest font-black">{cert.issuer}</p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="col-span-full text-center text-neutral-500">No certificates found.</p>
                    )}
                </section>
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mt-32 flex flex-col items-center gap-8 group">
                    <div className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 font-medium text-center leading-loose">
                        More to go. <br />
                        <Link href="/projects" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 decoration-cyan-500/30 transition-all font-bold">
                            View my Projects
                        </Link>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-px h-16 bg-linear-to-b from-cyan-500/50 to-transparent group-hover:h-24 transition-all duration-700" />
                        <p className="text-[10px] uppercase tracking-[1em] text-neutral-700 font-black">End of Certificates</p>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}