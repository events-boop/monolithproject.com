import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Info, Users, CupSoda, ShieldCheck, Music } from "lucide-react";

interface Zone {
    id: string;
    label: string;
    icon: any;
    desc: string;
    coord: { x: string; y: string };
    type: "ga" | "vip" | "service" | "peak";
}

const VENUE_ZONES: Zone[] = [
    { id: "main-floor", label: "Main Floor", icon: Users, desc: "The spatial core. Kinetic density 100%. GA access point.", coord: { x: "50%", y: "60%" }, type: "ga" },
    { id: "the-booth", label: "Signal Booth", icon: Music, desc: "Primary audio emitter. No-access exclusion zone.", coord: { x: "50%", y: "15%" }, type: "peak" },
    { id: "vip-balcony", label: "VIP Balcony", icon: ShieldCheck, desc: "Elevated perspective. Restricted clearance required.", coord: { x: "20%", y: "45%" }, type: "vip" },
    { id: "the-bar", label: "hydration node", icon: CupSoda, desc: "Liquid replenishment. Cashless terminal interface.", coord: { x: "85%", y: "50%" }, type: "service" },
    { id: "entrance", label: "check-in", icon: MapPin, desc: "Primary vector for environmental entry. Verify ID here.", coord: { x: "50%", y: "90%" }, type: "service" },
];

export default function TacticalVenueMap() {
    const [activeZone, setActiveZone] = React.useState<Zone | null>(null);

    return (
        <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden relative font-mono shadow-2xl">
            {/* 📟 UI HEADER */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] tracking-[0.4em] uppercase text-white/60">Tactical Venue Blueprint // VER 1.0</span>
                </div>
                <span className="text-[10px] text-white/20">COORD_REF: GHQ_440</span>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-[1fr_300px] h-[500px]">
                {/* 🛰️ THE BLUEPRINT GRID */}
                <div className="relative bg-[#050505] p-12 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px]" />
                    
                    {/* BLUEPRINT LINES (SIMULATED) */}
                    <div className="w-full h-full border border-white/5 rounded-lg relative flex items-center justify-center">
                        <div className="absolute inset-x-0 top-1/2 h-px bg-white/5" />
                        <div className="absolute inset-y-0 left-1/2 w-px bg-white/5" />
                        
                        {/* THE SCANNER CIRCLE */}
                        <motion.div 
                            animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute w-[80%] aspect-square rounded-full border border-primary/20"
                        />

                        {/* HOTSPOTS */}
                        {VENUE_ZONES.map((zone) => (
                            <motion.button
                                key={zone.id}
                                style={{ left: zone.coord.x, top: zone.coord.y }}
                                onClick={() => setActiveZone(zone)}
                                className={`absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center transition-all group z-20`}
                            >
                                <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${activeZone?.id === zone.id ? "bg-primary scale-150" : "bg-white/20"}`} />
                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center backdrop-blur-md transition-colors ${activeZone?.id === zone.id ? "bg-primary border-primary text-black" : "bg-black/80 border-white/20 text-white group-hover:border-primary group-hover:text-primary"}`}>
                                    <zone.icon size={14} />
                                </div>
                                <div className="absolute top-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                    <span className="text-[9px] bg-black border border-white/10 px-2 py-1 rounded text-white whitespace-nowrap tracking-widest">{zone.label}</span>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* 📊 DATA DOSSIER */}
                <div className="bg-[#0c0c0c] border-l border-white/5 p-6 flex flex-col justify-between overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {activeZone ? (
                            <motion.div
                                key={activeZone.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <span className={`text-[10px] tracking-[0.3em] font-bold uppercase transition-colors ${activeZone.type === 'ga' ? 'text-green-400' : activeZone.type === 'vip' ? 'text-primary' : activeZone.type === 'peak' ? 'text-blue-400' : 'text-white/40'}`}>
                                        Zone_Identity: {activeZone.type}
                                    </span>
                                    <h3 className="text-2xl font-display uppercase text-white tracking-tight">{activeZone.label}</h3>
                                </div>

                                <div className="p-4 bg-white/[0.03] border border-white/5 rounded-lg">
                                    <div className="flex items-center gap-2 mb-3 text-white/40">
                                        <Info size={12} />
                                        <span className="text-[10px] uppercase font-bold tracking-widest">Description</span>
                                    </div>
                                    <p className="text-xs text-white/60 leading-relaxed font-sans">{activeZone.desc}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-white/20 uppercase tracking-widest">Vector_X</span>
                                        <p className="text-xs text-white font-mono">{activeZone.coord.x}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-white/20 uppercase tracking-widest">Vector_Y</span>
                                        <p className="text-xs text-white font-mono">{activeZone.coord.y}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                                <Info size={32} className="mb-4" />
                                <p className="text-[10px] uppercase tracking-[0.3em]">Select a vector to initialize briefing.</p>
                            </div>
                        )}
                    </AnimatePresence>

                    <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between text-[9px] text-white/20 uppercase font-mono tracking-widest">
                            <span>GRID_SCAN: COMPLETED</span>
                            <span>PEAK_OCC: 88%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
