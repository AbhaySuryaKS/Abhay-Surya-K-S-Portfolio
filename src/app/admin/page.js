"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";


export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        if (typeof window !== "undefined") return localStorage.getItem("admin-auth") === "true";
        return false;
    });
    const [activeTab, setActiveTab] = useState("projects");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState(["[SYSTEM] OS Initialized. Ready for input..."]);
    const [messages, setMessages] = useState([]);

    const initialFormState = { title: "", name: "", description: "", image_url: "", link: "", issuer: "", current_working: false };
    const [formData, setFormData] = useState(initialFormState);

    const tabs = [
        { id: "projects", label: "Projects", icon: "⚙" },
        { id: "certificates", label: "Certificates", icon: "⚒" },
        { id: "skills", label: "Skills", icon: "⚡" },
        { id: "messages", label: "Inbound_Msgs", icon: "✉"}
    ];

    const addLog = (msg) => {
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [`[${time}] ${msg}`, ...prev].slice(0, 10));
    };
    useEffect(() => {
        if (activeTab === "messages" && isAuthenticated) {
            const fetchMessages = async () => {
                addLog("SYNC_READ: Fetching messages...");
                const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
                if (error) addLog(`ERR: ${error.message}`);
                else setMessages(data || []);
            };
            fetchMessages();
        }
    }, [activeTab, isAuthenticated]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem("admin-auth", "true");
            addLog("AUTH_SUCCESS: Secure link established.");
        } else {
            addLog("AUTH_FAILURE: Access denied.");
        }
    };

    const handlePost = async (e) => {
        e.preventDefault();
        setLoading(true);
        addLog(`SYNC_START: Routing to ${activeTab}...`);
        
        let payload = activeTab === "projects" ? { title: formData.title, description: formData.description, image_url: formData.image_url, link: formData.link }
                    : activeTab === "certificates" ? { name: formData.name, issuer: formData.issuer, image_url: formData.image_url }
                    : { name: formData.name, current_working: formData.current_working };

        const { error } = await supabase.from(activeTab).insert([payload]);
        if (error) addLog(`ERR: ${error.message}`);
        else {
            addLog(`COMMIT_OK: Saved to ${activeTab}.`);
            setFormData(initialFormState);
        }
        setLoading(false);
    };

    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-neutral-950 flex items-center justify-center font-mono">
                <form onSubmit={handleLogin} className="space-y-6 p-12 bg-neutral-900 border border-white/5 rounded-3xl">
                    <h1 className="text-white font-black italic uppercase">Login_Required</h1>
                    <input type="password" placeholder="KEY" className="admin-input" onChange={(e) => setPassword(e.target.value)} />
                    <button className="w-full py-4 bg-white text-black font-black uppercase text-[10px]">Validate</button>
                </form>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-400 font-mono p-10">
            <header className="flex justify-between items-center mb-10 border-b border-white/5 pb-10">
                <h1 className="text-5xl font-black text-white italic uppercase tracking-tighter">OS.Admin_</h1>
                <button onClick={() => { setIsAuthenticated(false); localStorage.removeItem("admin-auth"); }} className="text-red-500 text-[10px] font-black uppercase">Logout</button>
            </header>

            <div className="grid grid-cols-12 gap-10">
                <div className="col-span-3 space-y-2">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-left p-4 rounded-xl text-[10px] uppercase font-bold tracking-widest ${activeTab === tab.id ? "bg-white text-black" : "bg-neutral-900 text-neutral-500"}`}>
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="col-span-6">
                    {activeTab === "messages" ? (
                        <div className="space-y-4">
                            {messages.map(msg => (
                                <div key={msg.id} className="bg-neutral-900/50 border border-white/5 p-6 rounded-2xl">
                                    <p className="text-cyan-500 text-[10px] font-bold uppercase mb-2">{msg.email}</p>
                                    <h4 className="text-white font-bold uppercase mb-2">{msg.subject}</h4>
                                    <p className="text-xs leading-relaxed">{msg.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <form onSubmit={handlePost} className="space-y-4 bg-neutral-900/50 p-8 rounded-2xl border border-white/5">
                            <h2 className="text-white text-xs uppercase italic font-black mb-4">Post_Data::{activeTab}</h2>
                            {activeTab === "projects" && (
                                <>
                                    <input type="text" placeholder="TITLE" className="admin-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                                    <textarea placeholder="DESC" className="admin-input h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                    <input type="text" placeholder="IMG_URL" className="admin-input" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
                                    <input type="text" placeholder="LINK" className="admin-input" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
                                </>
                            )}
                            {activeTab === "certificates" && (
                                <>
                                    <input type="text" placeholder="NAME" className="admin-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                                    <input type="text" placeholder="ISSUER" className="admin-input" value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} />
                                    <input type="text" placeholder="IMG_URL" className="admin-input" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
                                </>
                            )}
                            {activeTab === "skills" && (
                                <input type="text" placeholder="SKILL_NAME" className="admin-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            )}
                            <button className="w-full py-4 bg-cyan-600 text-white font-black uppercase text-[10px]">Execute_Post</button>
                        </form>
                    )}
                </div>

                <div className="col-span-3">
                    <div className="bg-black/50 p-6 rounded-2xl border border-white/5 h-100 overflow-y-auto no-scrollbar">
                        <p className="text-cyan-500 text-[9px] font-black uppercase mb-4">Logs_</p>
                        {logs.map((log, i) => <p key={i} className="text-[9px] mb-2 text-neutral-600 font-mono">{log}</p>)}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .admin-input { width: 100%; background: #000; border: 1px solid #1a1a1a; padding: 15px; color: white; font-size: 11px; outline: none; border-radius: 12px; }
                .admin-input:focus { border-color: #06b6d4; }
                .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </main>
    );
}