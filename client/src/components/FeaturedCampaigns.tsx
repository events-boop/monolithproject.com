import { motion } from "framer-motion";
import { ArrowUpRight, PlayCircle, Calendar } from "lucide-react";
import { Link } from "wouter";

export default function FeaturedCampaigns() {
  return (
    <section className="py-24 bg-black border-t border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-[0.03] pointer-events-none" />
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 block mb-4">
                Active Campaigns
              </span>
              <h2 className="font-display text-4xl md:text-5xl uppercase text-white tracking-widest">
                Priority Targets
              </h2>
            </div>
            <p className="text-white/50 max-w-sm text-sm">
              Discover the defining chapters of The Monolith Project. Secure your place at our upcoming flagship sessions.
            </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Link href="/story" asChild>
            <a className="group relative border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col justify-end p-8 md:p-12 min-h-[500px] hover:border-[#22D3EE]/50 transition-colors">
              <div className="absolute inset-0 bg-[url('/images/untold-story.jpg')] bg-cover bg-center opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700" />
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black via-black/80 to-transparent" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] text-[9px] font-mono tracking-widest uppercase rounded flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-pulse"></span>
                      Artist Debut
                    </div>
                    <div className="flex items-center gap-1.5 text-white/50 text-[10px] font-mono tracking-widest uppercase">
                        <Calendar className="w-3.5 h-3.5" /> May 16, 2026
                    </div>
                </div>
                <h3 className="font-display text-4xl md:text-5xl uppercase text-white leading-[0.9] mb-4 group-hover:text-[#22D3EE] transition-colors">
                  Untold Story<br/>Eran Hersh
                </h3>
                <p className="text-white/60 font-sans max-w-sm mb-8 text-sm md:text-base">
                  A highly anticipated return for Untold Story. Eran Hersh brings his distinct Afro-Melodic sound to Chicago for a 360° dancefloor experience.
                </p>
                <div className="flex items-center gap-3 text-[#22D3EE] font-mono text-[10px] tracking-widest uppercase font-bold">
                    Explore Campaign <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </a>
          </Link>

          <Link href="/chasing-sunsets" asChild>
            <a className="group relative border border-white/10 bg-white/[0.02] overflow-hidden flex flex-col justify-end p-8 md:p-12 min-h-[500px] hover:border-[#E8B86D]/50 transition-colors">
              <div className="absolute inset-0 bg-[url('/images/chasing-sunsets.jpg')] bg-cover bg-center opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700" />
              <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black via-black/80 to-transparent" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1 bg-[#E8B86D]/10 border border-[#E8B86D]/20 text-[#E8B86D] text-[9px] font-mono tracking-widest uppercase rounded flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8B86D] animate-pulse"></span>  
                      Flagship Event
                    </div>
                    <div className="flex items-center gap-1.5 text-white/50 text-[10px] font-mono tracking-widest uppercase">
                        <Calendar className="w-3.5 h-3.5" /> July 4, 2026
                    </div>
                </div>
                <h3 className="font-display text-4xl md:text-5xl uppercase text-white leading-[0.9] mb-4 group-hover:text-[#E8B86D] transition-colors">
                  Chasing Sun(Sets)<br/>4th of July
                </h3>
                <p className="text-white/60 font-sans max-w-sm mb-8 text-sm md:text-base">
                  The summer flagship rooftop session. Start at sunset, continue after dark. Join the waitlist for priority entry before tickets go live.
                </p>
                <div className="flex items-center gap-3 text-[#E8B86D] font-mono text-[10px] tracking-widest uppercase font-bold">
                    Explore Campaign <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>
            </a>
          </Link>
        </div>

        {/* Third Row: Spotify & Space Video */}
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
            {/* Prominent Video Recaps */}
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 group overflow-hidden min-h-[300px] flex flex-col justify-center border-l-4 border-l-[#E05A3A]">
                <div className="absolute inset-0 bg-gradient-to-br from-black to-black/80 z-0" />
                <div className="absolute inset-0 bg-[url('/images/hero-monolith.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay z-0 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#E8B86D]/10 to-transparent mix-blend-screen pointer-events-none" />
                
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 h-full w-full">
                    <div className="max-w-md">
                        <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#E8B86D] mb-4 block">Event Archive</span>
                        <h3 className="font-display text-3xl md:text-5xl uppercase text-white mb-4 leading-[0.9] drop-shadow-xl">
                           Chasing Sun(Sets)<br/>4th of July 2025
                        </h3>
                        <p className="text-white/60 text-sm md:text-base leading-relaxed">
                            Look back at our defining daytime rooftop set from last summer before reserving your spot for 2026.
                        </p>
                    </div>

                    <a href="/videos/hero-video-short.mp4" target="_blank" className="shrink-0 flex items-center justify-center p-6 lg:p-10 rounded-full border border-white/20 bg-black/50 backdrop-blur-md group-hover:bg-white group-hover:text-black transition-all cursor-pointer shadow-2xl group-hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                        <PlayCircle className="w-8 h-8 md:w-12 md:h-12 text-white group-hover:text-black" />
                    </a>
                </div>
            </div>

            {/* Spotify Feature */}
            <div className="relative border border-white/10 bg-[#060606] p-6 md:p-8 flex flex-col justify-between group">
                <div className="mb-6">
                   <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40 mb-3 block">Newest Episode</span>
                   <h3 className="font-display text-2xl uppercase text-white mb-2">Radio Transmission</h3>
                   <p className="text-white/50 text-xs">Stream the newest Chasing Sun(Sets) episode directly on Spotify.</p>
                </div>
                
                <div className="w-full relative overflow-hidden bg-black/40 rounded-[12px]">
                  {/* Using a placeholder Spotify track ID - standard house mix */}
                  <iframe 
                    style={{ borderRadius: '12px', background: 'transparent' }} 
                    src="https://open.spotify.com/embed/playlist/37i9dQZF1DXa2PvUprniZG?utm_source=generator&theme=0" 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowFullScreen 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy">
                  </iframe>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}
