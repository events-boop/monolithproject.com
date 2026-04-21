import { ArrowRight } from "lucide-react";

export default function Ticker() {
  const words = [
    "UNCOMPROMISED SOUND",
    "CHICAGO LATE-NIGHT",
    "THE MONOLITH PROJECT",
    "CAPACITY CAPPED",
  ];

  // Repeat sufficiently to loop seamlessly across massive screens
  const items = [...words, ...words, ...words, ...words, ...words];

  return (
    <div
      aria-label="Monolith Structural Marquee"
      className="group relative z-40 block w-full overflow-hidden border-y border-white/10 bg-black select-none pointer-events-none"
      style={{ height: "auto" }}
    >
      <div className="flex overflow-hidden py-4 md:py-6 items-center">
        <div className="flex w-max min-w-full shrink-0 animate-marquee items-center whitespace-nowrap">
          {items.map((word, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center justify-center pl-8 md:pl-16"
            >
              <span 
                className="font-heavy text-[clamp(4rem,9vw,9rem)] uppercase leading-none tracking-tighter text-transparent mix-blend-overlay"
                style={{ WebkitTextStroke: "2px rgba(255,255,255,0.4)" }}
              >
                {word}
              </span>
              <span className="font-heavy text-[clamp(4rem,9vw,9rem)] uppercase leading-none tracking-tighter text-[#d4a853] mx-8 md:mx-16 mix-blend-difference opacity-50">
                //
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
