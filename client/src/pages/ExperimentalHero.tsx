import Navigation from "@/components/Navigation";
import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

export default function ExperimentalHero() {
  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden font-mono">
      <Navigation />
      
      {/* BACKGROUND TEXT LAYER (Z-INDEX 0) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <h1 
          className="font-display text-[clamp(10rem,25vw,35rem)] leading-none text-white/90 tracking-tighter"
          style={{ transform: "scaleY(1.3)" }}
        >
          MONOLITH
        </h1>
      </div>

      {/* 3D OBJECT LAYER (Z-INDEX 10) */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pb-[10vh] pointer-events-none">
        <div className="relative w-[90vw] md:w-[60vw] max-w-[500px] h-[65vh] flex items-center justify-center pointer-events-auto">
            {/* When you generate the video in Luma/Higgsfield, drop it here: */}
            {/* <video autoPlay loop muted playsInline className="w-full h-full object-cover mix-blend-screen" src="/video/monolith-transparent.webm" /> */}
            
            {/* Placeholder shape */}
            <div 
              className="w-full h-full bg-gradient-to-b from-transparent via-black/60 to-[#050505] flex items-center justify-center border border-white/10 backdrop-blur-sm" 
              style={{ clipPath: "polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)" }}
            >
              <div className="text-center px-6">
                <span className="font-mono text-white/40 text-xs tracking-[0.3em] uppercase block mb-4">
                  [ 3D MONOLITH ASSET SPACE ]
                </span>
                <span className="font-mono text-white/20 text-[10px] tracking-widest block">
                  Export your Luma/Higgsfield render with a black background and apply mix-blend-mode: screen here.
                </span>
              </div>
            </div>
        </div>
      </div>

      {/* FOREGROUND UI LAYER (Z-INDEX 50) */}
      <div className="relative z-50 min-h-screen flex flex-col justify-between px-6 py-8 md:p-12 pointer-events-none">
        
        {/* Top Header/Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-20">
          <div className="flex flex-col gap-1 pointer-events-auto">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">The Monolith Project</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/80">Chicago, IL</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 mt-2">Sound / Culture / Connection</span>
          </div>
          
          <div className="hidden md:flex justify-center pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary">Signal: Live</span>
            </div>
          </div>

          <div className="hidden md:flex justify-end col-span-2 gap-12 pointer-events-auto">
            <Link href="/schedule" className="text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors">Chapters</Link>
            <Link href="/artists" className="text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors">Artists</Link>
            <Link href="/archive" className="text-[10px] uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors">Archive</Link>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-end pb-12 md:pb-0 pointer-events-auto">
          <div className="flex flex-col gap-1 hidden md:flex">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">The Monolith Project</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Music Events and Artist-Led</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Experiences</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Based in Chicago</span>
            <div className="w-8 h-px bg-white/30 mt-4" />
          </div>

          <div className="flex flex-col md:items-end gap-2 text-left md:text-right">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary">Next Chapter</span>
            <h2 className="font-display text-4xl md:text-5xl uppercase tracking-widest text-white mt-1">Untold Story IV</h2>
            <span className="text-[12px] uppercase tracking-[0.3em] text-white/80 mb-3">May 16</span>
            
            <MagneticButton strength={0.2}>
                <Link href="/events/eran-hersh-untold-story-iv" className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary hover:text-white transition-colors flex items-center gap-2">
                Reserve Entry <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
            </MagneticButton>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 flex justify-center items-center pointer-events-auto border-t border-white/5">
             <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40">
                A living archive of sound, story, and connection.
             </span>
        </div>

      </div>
    </div>
  );
}
