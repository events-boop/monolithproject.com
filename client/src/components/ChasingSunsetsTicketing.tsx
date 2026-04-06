import { motion } from "framer-motion";
import { Check, ArrowRight, Lock, Anchor } from "lucide-react";
import { useUI } from "@/contexts/UIContext";

export default function ChasingSunsetsTicketing() {
  const { openDrawer } = useUI();

  return (
    <div className="py-24 px-6 border-t border-[#E8B86D]/20 bg-black/40 backdrop-blur-3xl relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E8B86D]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C2703E]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container layout-default relative z-10">
            <div className="text-center mb-20">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#E8B86D] block mb-4">Official Release</span>
                <h2 className="font-display text-4xl md:text-5xl lg:text-7xl uppercase text-white tracking-widest leading-[0.85] mb-6">
                    The 2026 Season
                </h2>
                <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">
                    A three-part arc. Three distinct golden hours. Secure your place for the entire summer or lock in the July 4th flagship opener. 
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 mt-8 font-mono text-[10px] tracking-widest text-white/40 uppercase">
                    <span>July 04</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>August 22</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>September 19</span>
                </div>
            </div>

            {/* Season Passes Tier (The Anchor) */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
                {/* GA Season Pass */}
                <div className="border border-white/10 bg-white/[0.02] rounded-[32px] p-8 md:p-10 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[40px] rounded-full group-hover:bg-[#E8B86D]/10 transition-colors" />
                    
                    <span className="font-mono text-[10px] tracking-widest uppercase text-white/50 mb-2">Access All Dates</span>
                    <h3 className="font-display text-4xl uppercase text-white mb-2">Season Pass</h3>
                    
                    <div className="flex items-baseline gap-2 mb-8">
                        <span className="font-display text-5xl text-white tracking-tighter">$119</span>
                        <span className="font-mono text-[10px] tracking-widest uppercase text-white/40">GA Tier</span>
                    </div>

                    <ul className="space-y-4 mb-10 flex-1">
                        {[
                            "Guaranteed entry to all 3 summer dates",
                            "Significant savings vs. single ticket pricing",
                            "Priority access to internal venue announcements",
                            "Skip the presale rush"
                        ].map((perk, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                                <Check className="w-5 h-5 text-[#E8B86D] shrink-0" />
                                <span>{perk}</span>
                            </li>
                        ))}
                    </ul>

                    <button 
                        onClick={() => openDrawer('newsletter')}
                        className="w-full py-4 border border-white/20 rounded-full font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-white hover:bg-white hover:text-black transition-colors"
                    >
                        Get Updates
                    </button>
                </div>

                {/* VIP Season Pass */}
                <div className="border border-[#E8B86D]/40 bg-[#1A0F00]/90 rounded-[32px] p-8 md:p-10 flex flex-col relative overflow-hidden group shadow-[0_20px_60px_rgba(232,184,109,0.1)]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#E8B86D]/10 blur-[60px] rounded-full" />
                    
                    <div className="inline-flex items-center self-start px-3 py-1 bg-[#E8B86D]/10 border border-[#E8B86D]/30 text-[#E8B86D] text-[9px] font-mono tracking-widest uppercase rounded mb-4 gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8B86D] animate-pulse"></span>
                        Highly Limited
                    </div>

                    <h3 className="font-display text-4xl uppercase text-white mb-2 line-clamp-1">VIP Pass</h3>
                    
                    <div className="flex items-baseline gap-2 mb-8 relative z-10">
                        <span className="font-display text-5xl text-[#E8B86D] tracking-tighter">$249</span>
                        <span className="font-mono text-[10px] tracking-widest uppercase text-[#E8B86D]/60 mt-2">VIP Tier</span>
                    </div>

                    <ul className="space-y-4 mb-10 flex-1 relative z-10">
                        {[
                            "Expedited premium entry lane",
                            "Dedicated viewing zones with prime sightlines",
                            "Private bar line & premium restrooms",
                            "Commemorative physical season credential",
                            "Internal first-access to July 5 Boat Show release"
                        ].map((perk, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-white/90">
                                <Check className="w-5 h-5 text-[#E8B86D] shrink-0 drop-shadow-[0_0_8px_rgba(232,184,109,0.5)]" />
                                <span>{perk}</span>
                            </li>
                        ))}
                    </ul>

                    <button 
                        onClick={() => openDrawer('newsletter')}
                        className="w-full py-4 bg-gradient-to-r from-[#E8B86D] to-[#C2703E] rounded-full font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#1A0F00] hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(232,184,109,0.3)] relative z-10"
                    >
                        Request VIP Table
                    </button>
                </div>
            </div>

            {/* Single Events */}
            <div className="grid lg:grid-cols-[1fr_400px] gap-8 mt-16">
                
                {/* July 4 Single Release */}
                <div className="border border-white/10 bg-white/[0.02] rounded-[32px] p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 border-b border-white/10 pb-8">
                        <div>
                            <span className="font-mono text-[10px] tracking-widest uppercase text-white/50 mb-2 block">Opening Chapter</span>
                            <h3 className="font-display text-4xl uppercase text-white leading-none">July 4th Single</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="relative flex h-2 w-2">
                                <span className={`animate-ping absolute inline-flex h-full w-full opacity-75 bg-green-400`} />
                                <span className={`relative inline-flex h-2 w-2 bg-green-400`} />
                            </span>
                            <span className="font-mono text-[10px] tracking-widest uppercase text-green-400 font-bold">Registration Open</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                <span className="text-white font-mono text-sm tracking-widest uppercase">Founders Access</span>
                                <span className="text-[#E8B86D] font-display text-2xl tracking-tighter">$30</span>
                            </div>
                            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                <span className="text-white/50 font-mono text-sm tracking-widest uppercase">Early Bird</span>
                                <span className="text-white/50 font-display text-2xl tracking-tighter"><Lock className="w-3.5 h-3.5 inline mr-1 opacity-50" />$40</span>
                            </div>
                            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                <span className="text-white/30 font-mono text-sm tracking-widest uppercase">Final Door</span>
                                <span className="text-white/30 font-display text-2xl tracking-tighter line-through decoration-white/20"><Lock className="w-3.5 h-3.5 inline mr-1 opacity-50"/>$70</span>
                            </div>
                        </div>

                        <div className="flex flex-col justify-end">
                            <button 
                                onClick={() => openDrawer('newsletter')}
                                className="w-full py-4 border border-[#E8B86D]/50 rounded-full font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#E8B86D] hover:bg-[#E8B86D]/10 transition-colors flex items-center justify-center gap-2"
                            >
                                Secure At $30 <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                            <p className="text-center text-white/30 mt-4 text-[9px] font-mono tracking-widest uppercase">Pricing guarantees priority entry</p>
                        </div>
                    </div>
                </div>

                {/* The "Classified" Secret Tier */}
                <div className="border border-white/5 bg-black/60 rounded-[32px] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                     {/* scanlines */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] pointer-events-none" />
                    
                    <Anchor className="w-8 h-8 text-white/20 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-2">Classified</span>
                    <h3 className="font-display text-2xl uppercase text-white/40 mb-4 tracking-widest">July 5th Recovery</h3>
                    
                    <div className="px-4 py-2 border border-white/10 bg-white/5 mt-2 rounded font-mono text-[9px] tracking-[0.3em] uppercase text-white/50 flex flex-col items-center gap-1">
                        <Lock className="w-3 h-3" />
                        Decrypting: 06.20.2026
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
