import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Shield, Wifi, Zap, Wind, Thermometer, Map, Globe } from "lucide-react";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { signalChirp } from "@/lib/SignalChirpEngine";

interface Metric {
    id: string;
    label: string;
    value: string;
    icon: any;
    status: "optimal" | "warning" | "error";
    unit?: string;
}

const INITIAL_METRICS: Metric[] = [
    { id: "signal", label: "Signal Intensity", value: "98.2", unit: "%", icon: Wifi, status: "optimal" },
    { id: "security", label: "Clearance Level", value: "ADMIN", icon: Shield, status: "optimal" },
    { id: "tickets", label: "Allocation Remaining", value: "42", unit: "%", icon: Zap, status: "warning" },
    { id: "crowd", label: "Density Forecast", value: "MEDIUM", icon: Activity, status: "optimal" },
    { id: "temp", label: "Venue Thermal", value: "72", unit: "°F", icon: Thermometer, status: "optimal" },
    { id: "wind", label: "Atmospheric Flow", value: "8", unit: "MPH", icon: Wind, status: "optimal" },
    { id: "location", label: "Core Coordinates", value: "41.8781° N", icon: Map, status: "optimal" },
    { id: "uptime", label: "System Uptime", value: "99.9", unit: "%", icon: Globe, status: "optimal" },
];

export default function Insights() {
    const [metrics, setMetrics] = React.useState<Metric[]>(INITIAL_METRICS);
    const [activeTab, setActiveTab] = React.useState<"metrics" | "logs">("metrics");
    const [glitchActive, setGlitchActive] = React.useState(false);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => prev.map(m => {
                if (m.id === "signal" || m.id === "tickets" || m.id === "temp") {
                    const currentVal = parseFloat(m.value);
                    const diff = (Math.random() - 0.5) * 0.2;
                    return { ...m, value: (currentVal + diff).toFixed(1) };
                }
                return m;
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setGlitchActive(true);
            setTimeout(() => setGlitchActive(false), 200);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const triggerHaptic = () => signalChirp.hover();

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-white">
            <SEO title="System Diagnostic // MONOLITH" description="Real-time environmental telemetry and architectural system health for the Monolith Project." />
            <Navigation />

            <main className="page-shell-start pb-32 px-6">
                <div className="container max-w-6xl mx-auto">
                    
                    {/* 📟 HUD HEADER */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
                        <div>
                            <span className="font-mono text-[10px] tracking-[0.4em] text-primary uppercase mb-4 block">System / Telemetry</span>
                            <h1 className="font-display text-[clamp(4.5rem,14vw,8.5rem)] leading-[0.8] uppercase tracking-tighter">
                                {glitchActive ? "DIAGNO5T1C" : "DIAGNOSTIC"}
                            </h1>
                        </div>
                        <div className="flex gap-4 p-1 bg-white/[0.03] border border-white/10 rounded-full font-mono text-[10px] uppercase tracking-widest backdrop-blur-xl">
                            {["metrics", "logs"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab as any); triggerHaptic(); }}
                                    className={`px-8 py-3 rounded-full transition-all ${activeTab === tab ? "bg-primary text-white" : "text-white/40 hover:text-white"}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === "metrics" ? (
                            <motion.div
                                key="metrics"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                            >
                                {metrics.map((metric, i) => (
                                    <div 
                                        key={metric.id}
                                        className="p-8 border border-white/5 bg-white/[0.015] backdrop-blur-md group hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden"
                                    >
                                        <div className={`absolute top-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${metric.status === 'warning' ? 'bg-yellow-400' : 'bg-primary'}`} />
                                        
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/30 group-hover:text-white group-hover:border-primary/40 transition-all duration-500">
                                                <metric.icon size={16} />
                                            </div>
                                            <span className={`text-[8px] tracking-[0.2em] font-bold ${metric.status === 'optimal' ? 'text-green-400' : 'text-yellow-400'}`}>
                                                {metric.status.toUpperCase()}
                                            </span>
                                        </div>

                                        <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.3em] mb-2">{metric.label}</p>
                                        <div className="flex items-baseline gap-1">
                                            <span className="font-display text-4xl group-hover:text-primary transition-colors">{metric.value}</span>
                                            {metric.unit && <span className="font-mono text-xs text-white/40">{metric.unit}</span>}
                                        </div>

                                        <div className="absolute bottom-0 right-0 p-4 opacity-[0.02] pointer-events-none text-white group-hover:opacity-[0.05]">
                                            <metric.icon size={64} />
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="logs"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="bg-[#0c0c0c] border border-white/5 p-8 font-mono text-[11px] leading-relaxed text-white/40 tracking-widest"
                            >
                                <div className="space-y-4">
                                    <p className="text-primary/60">[ 03:28:44 ] SYSTEM_INITIALIZATION: COMPLETED</p>
                                    <p>[ 03:28:45 ] NODE_ALLOCATION_GHQ_ACCESS: GRANTED</p>
                                    <p className="text-yellow-400/60">[ 03:28:46 ] TICKET_ALLOCATION_THRESHOLD: REACHED (LOW_SUPPLY)</p>
                                    <p>[ 03:28:47 ] SIGNAL_STRENGTH_REPORT: 98.2% (OPTIMAL)</p>
                                    <p>[ 03:28:48 ] ENVIRONMENTAL_THERMAL: 72°F (STABLE)</p>
                                    <p className="text-primary/60">[ 03:28:49 ] KERNEL_RITE_PROTOCOL: ACTIVE</p>
                                    <p className="animate-pulse">_</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* 🌐 SPATIAL COORDINATES SECTION */}
                    <div className="mt-24 grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                             <h2 className="font-display text-4xl uppercase text-white mb-6">Core Orientation</h2>
                             <p className="text-white/50 text-lg leading-relaxed mb-8">
                                The Monolith Project is anchored to the Chicago architectural grid. Our spatial coordinates remain locked but our environmental expressions shift with each season.
                             </p>
                             <div className="p-8 border border-white/5 bg-white/[0.02] relative group overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40" />
                                <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-white/20 mb-3 block">Environmental Anchor</span>
                                <p className="font-display text-2xl text-white group-hover:text-primary transition-colors">ALHAMBRA PALACE // 1240 W RANDOLPH ST</p>
                             </div>
                        </div>

                        <div className="aspect-video bg-white/[0.01] border border-white/5 relative flex items-center justify-center p-12 overflow-hidden hover:bg-white/[0.03] transition-colors group">
                             <div className="absolute inset-0 bg-noise opacity-[0.05] group-hover:opacity-[0.1] transition-opacity" />
                             <div className="relative text-center">
                                <span className="font-mono text-[10px] tracking-[1em] text-white/20 uppercase mb-8 block">Scanning...</span>
                                <div className="w-16 h-16 border border-white/20 rounded-full flex items-center justify-center relative group-hover:border-primary/50 transition-colors">
                                    <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
                                    <Activity className="text-white/40 group-hover:text-primary transition-colors" />
                                </div>
                             </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
