/*
  DESIGN: Cosmic Mysticism - Scrolling Ticker/Marquee
  - Continuous scrolling text using pure CSS keyframes
  - Fixed "triple layer" stacking bug by enforcing flex row layout
  - Clean single-line rendering
*/

import { useEffect, useRef } from "react";

interface TickerProps {
  items?: string[];
}

const defaultItems = [
  "EVENT IS LIVE",
  "LATEST TRANSMISSION: MONOLITH 001",
  "CHASING SUN(SETS) RADIO: NOW STREAMING",
  "UNTOLD STORY: COMING SOON",
  "TOGETHERNESS IS THE FREQUENCY",
  "MUSIC IS THE GUIDE",
];

export default function Ticker({ items = defaultItems }: TickerProps) {
  // We duplicate content to ensure seamless loop
  const tickerContent = [...items, ...items, ...items, ...items];

  return (
    <>
      <div className="w-full overflow-hidden bg-black border-b border-white/5 py-2.5 relative z-[100] select-none pointer-events-auto h-[40px] flex items-center">
        {/* CSS Mask for fade edges */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black via-black/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black via-black/80 to-transparent z-10 pointer-events-none" />

        {/* The Track */}
        <div className="flex select-none overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {tickerContent.map((item, index) => (
              <div key={index} className="flex items-center shrink-0">
                <span className="text-[10px] md:text-xs tracking-[0.3em] font-mono font-medium uppercase text-white/70 px-8 whitespace-nowrap">
                  {item}
                </span>
                <span className="text-[#D4A574] text-[10px] tracking-widest opacity-80 mr-8">+++</span>
              </div>
            ))}
          </div>
          <div className="flex animate-marquee aria-hidden:true whitespace-nowrap">
            {tickerContent.map((item, index) => (
              <div key={`clone-${index}`} className="flex items-center shrink-0">
                <span className="text-[10px] md:text-xs tracking-[0.3em] font-mono font-medium uppercase text-white/70 px-8 whitespace-nowrap">
                  {item}
                </span>
                <span className="text-[#D4A574] text-[10px] tracking-widest opacity-80 mr-8">+++</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

