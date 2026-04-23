import { ArrowUpRight, Sun, Headphones } from "lucide-react";
import { Link } from "wouter";
import SEO from "@/components/SEO";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";
import MagneticButton from "@/components/MagneticButton";

export default function Alerts() {
    return (
        <div className="min-h-screen bg-[#06060F] text-white relative overflow-hidden flex flex-col items-center justify-center selection:bg-white/20">
            <SEO
                title="Alerts | The Monolith Project"
                description="Sign up for exclusive venue coordinates and lineup drops from Chasing Sun(Sets), Untold Story, and the Sun(Sets) Radio Show."
            />

            {/* Background cinematic glows */}
            <div className="pointer-events-none absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] blur-[120px] bg-gradient-to-br from-[#E8B86D]/15 to-transparent rounded-full opacity-50" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] blur-[120px] bg-gradient-to-tl from-[#8B5CF6]/15 to-transparent rounded-full opacity-50" />
            </div>

            {/* Subtle Grain overlay */}
            <div className="pointer-events-none absolute inset-0 z-0 opacity-20 mix-blend-overlay bg-noise" />

            <main className="relative z-10 w-full max-w-lg px-6 py-20 flex flex-col items-center">

                {/* Header */}
                <div className="mb-12 text-center">
                    <Link href="/">
                        <a className="font-display text-2xl tracking-widest text-white/90 hover:text-white transition-colors cursor-pointer inline-block mb-4">
                            MONOLITH
                        </a>
                    </Link>
                    <h1 className="font-display text-4xl md:text-5xl uppercase tracking-wide mb-3">
                        Select Your Drop
                    </h1>
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                        Venue coordinates · Private links · Pre-sale access
                    </p>
                </div>

                {/* Links Grid */}
                <div className="w-full space-y-4">

                    {/* Chasing Sunsets Card */}
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#E8B86D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 flex flex-col items-start gap-4 h-full min-h-[140px] justify-between">
                            <div className="flex items-center gap-3 w-full">
                                <div className="w-10 h-10 rounded-full bg-black/40 border border-[#E8B86D]/20 flex items-center justify-center text-[#E8B86D]">
                                    <Sun size={18} />
                                </div>
                                <div>
                                    <h3 className="font-display text-2xl tracking-wide text-white group-hover:text-[#E8B86D] transition-colors">CHASING SUN(SETS)</h3>
                                    <p className="font-mono text-[10px] tracking-widest text-[#E8B86D]/70 uppercase">Rooftop Series</p>
                                </div>
                            </div>
                            <MagneticButton strength={0.2}>
                                <button className="btn-pill-sunsets btn-pill-wide btn-pill-compact justify-between">
                                    <span>Enable Alerts</span>
                                    <ArrowUpRight size={16} className="opacity-70" />
                                </button>
                            </MagneticButton>
                        </div>
                    </div>

                    {/* Untold Story Card */}
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 flex flex-col items-start gap-4 h-full min-h-[140px] justify-between">
                            <div className="flex items-center gap-3 w-full">
                                <div className="w-10 h-10 rounded-full bg-black/40 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6]">
                                    <UntoldButterflyLogo className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="font-display text-2xl tracking-wide text-white group-hover:text-[#8B5CF6] transition-colors">UNTOLD STORY</h3>
                                    <p className="font-mono text-[10px] tracking-widest text-[#8B5CF6]/70 uppercase">Late Night 360°</p>
                                </div>
                            </div>
                            <MagneticButton strength={0.2}>
                                <button className="btn-pill-untold btn-pill-wide btn-pill-compact justify-between">
                                    <span>Enable Alerts</span>
                                    <ArrowUpRight size={16} className="opacity-70" />
                                </button>
                            </MagneticButton>
                        </div>
                    </div>

                    {/* Radio Card */}
                    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#fff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10 flex flex-col items-start gap-4 h-full min-h-[140px] justify-between">
                            <div className="flex items-center gap-3 w-full">
                                <div className="w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white/80">
                                    <Headphones size={18} />
                                </div>
                                <div>
                                    <h3 className="font-display text-2xl tracking-wide text-white transition-colors">SUN(SETS) RADIO</h3>
                                    <p className="font-mono text-[10px] tracking-widest text-white/50 uppercase">The Global Connection</p>
                                </div>
                            </div>
                            <MagneticButton strength={0.2}>
                                <button className="btn-pill-radio btn-pill-wide btn-pill-compact justify-between">
                                    <span>Enable Alerts</span>
                                    <ArrowUpRight size={16} className="opacity-70" />
                                </button>
                            </MagneticButton>
                        </div>
                    </div>

                </div>

                <div className="mt-12 text-center text-white/30 font-mono text-[10px] tracking-widest uppercase">
                    Powered by Laylo
                    <br />
                    (Mockup Version)
                </div>
            </main>
        </div>
    );
}
