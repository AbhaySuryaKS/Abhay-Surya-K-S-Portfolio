"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import emailjs from "@emailjs/browser";
import Link from "next/link";
import { toast } from "react-toastify";
import { supabase } from "@/lib/supabase";

export default function Contact() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", subject: "", description: "" });
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const { error } = await supabase.from("messages").insert([formData]);
            if (error) toast.error("Failed to save message. Please try again later.");
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID, 
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                {
                    from_email: formData.email,
                    subject: formData.subject,
                    message: formData.description,
                    to_email: process.env.NEXT_PUBLIC_MY_EMAIL_ID
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
            );
            setSent(true);
            setTimeout(() => {
                setIsFormOpen(false);
                setSent(false);
                setFormData({ email: "", subject: "", description: "" });
                toast.success("Message sent successfully!");
            }, 2000);
        } catch {
            toast.error("Failed to send message. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full bg-neutral-950 text-neutral-300 selection:bg-neutral-900/30 relative overflow-x-hidden font-sans">
            <Navbar />
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />
            <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_50%_0%,rgba(6,182,212,0.1),transparent_70%)]" />
            <div className="relative z-10 pt-40 pb-20 flex flex-col items-center max-w-7xl mx-auto px-6 text-center">
                <motion.header 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mb-16"
                >
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8">
                        Get In <span className="text-neutral-400">Touch</span>
                    </h1>
                </motion.header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-16">
                    <motion.div 
                        whileHover={{ y: -5 }}
                        className="bg-neutral-900/40 backdrop-blur-md border border-white/5 p-10 rounded-3xl flex flex-col justify-between items-start text-left group hover:border-cyan-500/30 transition-all duration-500"
                    >
                        <div>
                            <span className="text-cyan-500 text-[10px] font-bold tracking-widest uppercase mb-4 block">Available for Work</span>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Hire Me</h3>
                            <p className="text-xs text-neutral-500 font-medium leading-loose">
                                {`I am currently looking for new opportunities. Let’s build something great together.`}
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsFormOpen(true)}
                            className="mt-8 w-full py-4 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-cyan-500 transition-all"
                        >
                            Send Message 
                        </button>
                    </motion.div>
                    <motion.div 
                        whileHover="hover"
                        initial="initial"
                        className="bg-neutral-900/40 backdrop-blur-md border border-white/5 p-10 rounded-3xl flex flex-col justify-between items-start text-left group hover:border-cyan-500/30 transition-all duration-500 overflow-hidden relative"
                    >
                        <div className="z-20 relative pointer-events-none">
                            <span className="text-cyan-500 text-[10px] font-bold tracking-widest uppercase mb-4 block">Experience</span>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Resume</h3>
                            <p className="text-xs text-neutral-500 font-medium leading-loose max-w-45">
                                Download my professional CV to see my full background.
                            </p>
                        </div>
                        <div className="absolute -right-2.5 bottom-0 w-44 h-56 pointer-events-none z-10">
                            <motion.div 
                                variants={{
                                    initial: { y: 110, filter: "blur(12px)", opacity: 0.2, rotate: 5 },
                                    hover: { y: 10, filter: "blur(0px)", opacity: 1, rotate: 0 }
                                }}
                                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                className="w-full h-full bg-neutral-800 border border-white/10 rounded-t-xl p-5 shadow-2xl relative"
                            >
                                <div className="space-y-3 opacity-30">
                                    <div className="w-12 h-2 bg-white rounded" />
                                    <div className="w-full h-1 bg-white/40 rounded" />
                                    <div className="w-full h-1 bg-white/40 rounded" />
                                    <div className="w-2/3 h-1 bg-white/40 rounded" />
                                    <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                                        <div className="w-16 h-1 bg-cyan-500 rounded" />
                                        <div className="w-full h-1 bg-white/20 rounded" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <a 
                            href="/Abhay Surya K S Resume.pdf" 
                            download 
                            className="mt-8 w-full py-4 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl text-center hover:bg-neutral-800 transition-all relative z-20"
                        >
                            Download CV
                        </a>
                    </motion.div>
                </div>
                <div className="w-full max-w-4xl border-t border-white/5 pt-12 mb-20">
                    <div className="flex flex-wrap justify-center gap-8 mb-8">
                        <Link href={process.env.NEXT_PUBLIC_MY_GITHUB_URL} target="_blank" className="text-neutral-500 hover:text-cyan-400 text-[10px] font-bold uppercase tracking-widest transition-colors">Github</Link>
                        <Link href={process.env.NEXT_PUBLIC_MY_LINKEDIN_URL} target="_blank" className="text-neutral-500 hover:text-cyan-400 text-[10px] font-bold uppercase tracking-widest transition-colors">LinkedIn</Link>
                        <Link href={process.env.NEXT_PUBLIC_MY_TWITTER_URL} target="_blank" className="text-neutral-500 hover:text-cyan-400 text-[10px] font-bold uppercase tracking-widest transition-colors">X / Twitter</Link>
                        <Link href={process.env.NEXT_PUBLIC_MY_INSTAGRAM_URL} target="_blank" className="text-neutral-500 hover:text-cyan-400 text-[10px] font-bold uppercase tracking-widest transition-colors">Instagram</Link>
                        <Link href={`mailto:${process.env.NEXT_PUBLIC_MY_EMAIL_ID}`} className="text-neutral-500 hover:text-cyan-400 text-[10px] font-bold uppercase tracking-widest transition-colors">Email</Link>
                        <Link href={process.env.NEXT_PUBLIC_MY_CODEPEN_URL} target="_blank" className="text-neutral-500 hover:text-cyan-400 text-[10px] font-bold uppercase tracking-widest transition-colors">CodePen</Link>
                        <Link href={process.env.NEXT_PUBLIC_MY_REDDIT_URL} target="_blank" className="text-neutral-500 hover:text-cyan-400 text-[10px] font-bold uppercase tracking-widest transition-colors">Reddit</Link>
                    </div>
                    <div className="text-neutral-400 font-mono text-sm tracking-tighter">
                        PH: <span className="text-white">+91 90199 73843</span>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-8 py-12 bg-neutral-900/20 w-full rounded-3xl border border-white/5">
                    <div className="space-y-2">
                        <p className="text-[10px] uppercase tracking-[0.5em] text-cyan-500 font-bold">Fast Response</p>
                        <h4 className="text-xl font-black text-white uppercase">Quick Contact</h4>
                    </div>
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="px-10 py-4 border border-cyan-500/30 text-cyan-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-cyan-500 hover:text-black transition-all"
                    >
                        Contact Now
                    </button>
                </div>
            </div>
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                        className="fixed inset-0 z-25 bg-black/95 backdrop-blur-md flex items-center justify-center p-3"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} 
                            className="w-full max-w-xl bg-neutral-900 border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative"
                        >
                            <button onClick={() => setIsFormOpen(false)} className="absolute top-8 right-8 text-neutral-500 hover:text-white uppercase font-bold text-[10px] tracking-widest">Close</button>
                            
                            <form onSubmit={handleSubmit} className="space-y-2">
                                <div className="mb-4 text-left">
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Message Me</h2>
                                </div>
                                <input type="email" placeholder="Your Email" className="contact-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                                <input type="text" placeholder="Subject" className="contact-input" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required />
                                <textarea placeholder="How can I help you?" className="contact-input h-32 resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
                                <button 
                                    disabled={loading} 
                                    className="w-full py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.5em] hover:bg-cyan-500 transition-all rounded-2xl"
                                    onClick={handleSubmit}
                                >
                                    {sent ? "Sent Successfully" : loading ? "Sending..." : "Send Message"}
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .contact-input { width: 100%; background: #000; border: 1px solid #1a1a1a; padding: 18px; color: white; font-size: 11px; outline: none; border-radius: 15px; transition: all 0.3s ease; }
                .contact-input:focus { border-color: #06b6d4; }
            `}</style>
        </main>
    );
}