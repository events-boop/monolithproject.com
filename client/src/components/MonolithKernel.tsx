import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Command, Zap, Search, Globe, ChevronRight } from "lucide-react";
import { useUI } from "@/contexts/UIContext";
import { useLocation } from "wouter";

const KERNEL_COMMANDS = [
    { cmd: "/scene untold", desc: "Shift environmental frequency to Untold Story" },
    { cmd: "/scene sets", desc: "Align with Chasing Sun(Sets) wave-form" },
    { cmd: "/goto archive", desc: "Initialize spatial jump to Gallery" },
    { cmd: "/goto tickets", desc: "Surface access node for active events" },
    { cmd: "/rites", desc: "Retrieve personalized Rite dossier" },
    { cmd: "/system diagnostic", desc: "Run kernel-level performance audit" },
    { cmd: "/sensory overload", desc: "INITIALIZE EXPERIMENTAL OVERLOAD PROTOCOL" },
];

export default function MonolithKernel() {
    const [isOpen, setIsOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const { isSensoryOverloadActive, setSensoryOverloadActive } = useUI();
    const [, setLocation] = useLocation();

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const executeCommand = (cmdStr: string) => {
        const c = cmdStr.toLowerCase().trim();
        
        if (c.includes("/scene untold")) {
            document.documentElement.dataset.scene = "untold";
            setIsOpen(false);
        } else if (c.includes("/scene sets")) {
            document.documentElement.dataset.scene = "chasing-sunsets";
            setIsOpen(false);
        } else if (c.includes("/goto archive")) {
            setLocation("/archive");
            setIsOpen(false);
        } else if (c.includes("/goto tickets")) {
            setLocation("/tickets");
            setIsOpen(false);
        } else if (c.includes("/rites")) {
            const saved = localStorage.getItem("monolith-starred-rites");
            alert(`PERSONALIZED_RITES: ${saved ? JSON.parse(saved).join(", ") : "NO_SIGNALS_FOUND"}`);
            setIsOpen(false);
        } else if (c.includes("/sensory overload")) {
            setSensoryOverloadActive(!isSensoryOverloadActive);
            setIsOpen(false);
        }
        
        setInputValue("");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 lg:p-24 backdrop-blur-md bg-black/60">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] relative"
                    >
                        {/* 📽️ CRT SCANLINE OVERLAY */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                        <div className="p-4 border-b border-white/5 flex items-center gap-3">
                            <Terminal size={18} className="text-white/40" />
                            <input
                                autoFocus
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && executeCommand(inputValue)}
                                placeholder="EXECUTE KERNEL COMMAND..."
                                className="w-full bg-transparent border-none outline-none text-white font-mono text-sm tracking-widest placeholder:text-white/20"
                            />
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10">
                                <Command size={10} className="text-white/40" />
                                <span className="text-[10px] text-white/40 font-mono">ENTER</span>
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 scrollbar-hide">
                            <div className="px-3 py-2 text-[10px] text-white/20 font-bold tracking-[0.2em] uppercase">
                                System Nodes / Available Commands
                            </div>
                            {KERNEL_COMMANDS.filter(k => k.cmd.includes(inputValue.toLowerCase())).map((k, i) => (
                                <button
                                    key={i}
                                    onClick={() => executeCommand(k.cmd)}
                                    className="w-full text-left p-3 rounded-lg flex items-center justify-between group hover:bg-white/5 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                            {k.cmd.startsWith("/scene") ? <Zap size={14} className="text-orange-400" /> : <Globe size={14} className="text-blue-400" />}
                                        </div>
                                        <div>
                                            <div className="text-xs font-mono text-white tracking-widest uppercase">{k.cmd}</div>
                                            <div className="text-[10px] text-white/40 font-mono mt-0.5">{k.desc}</div>
                                        </div>
                                    </div>
                                    <ChevronRight size={14} className="text-white/10 group-hover:text-white/40 transition-colors" />
                                </button>
                            ))}
                        </div>

                        <div className="p-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[9px] text-white/20 font-mono tracking-widest">
                            <div className="flex gap-4">
                                <span>VER 3001.0.1</span>
                                <span>ID: KERNEL_R_01</span>
                            </div>
                            <div className="flex gap-4">
                                <span>ACTIVE_FREQUENCIES: 04</span>
                                <span>STATUS: OPTIMAL</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
