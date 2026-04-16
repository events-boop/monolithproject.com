import { motion } from "framer-motion";
import { signalChirp } from "@/lib/SignalChirpEngine";

const steps = [
  {
    number: "01",
    title: "ARRIVE WHEN YOU WANT",
    body: "We program the entire night for sustained energy, not just a single peak hour.",
    detail: "NO RUSH REQUIRED.",
  },
  {
    number: "02",
    title: "NO RIGID DRESS CODES",
    body: "Dress for the room, dress to move, and bring the right energy.",
    detail: "LOOK GOOD, STAY COMFORTABLE.",
  },
  {
    number: "03",
    title: "UNCOMPROMISED AUDIO",
    body: "We select venues for their acoustics and custom-tune the sound systems for every single event.",
    detail: "CLEAR, NOT JUST LOUD.",
  },
  {
    number: "04",
    title: "STAY FOR THE CLOSE",
    body: "The tension builds late, the sound deepens, and the room hits its peak in the final hours.",
    detail: "THE ROOM GETS BETTER LATE.",
  },
];

export default function WhatToExpect() {
  return (
    <section className="relative bg-[#EAEAEA] border-t border-black/10 overflow-hidden">
      {/* Architectural background grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 right-0 top-1/2 h-px bg-black/5" />
      </div>

      <div className="container layout-wide px-6 py-24 md:py-40">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10 mb-20 md:mb-28 border-b border-black/10 pb-12">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-black/40 block mb-6">
              What To Expect
            </span>
            <h2 className="font-heavy text-[clamp(3.5rem,7vw,8rem)] leading-[0.85] tracking-tighter uppercase text-black">
              <span className="block text-black/30">What To</span>
              <span className="block">Expect.</span>
            </h2>
          </div>
          <p className="font-sans text-lg font-light text-black/50 max-w-sm leading-relaxed">
            Four things that stay true across venues, lineups, and series.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-black/10 border border-black/10">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              onMouseEnter={() => signalChirp.hover()}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col p-8 md:p-12 lg:p-16 overflow-hidden cursor-default border-b border-black/10 last:border-b-0 md:[&:nth-child(3)]:border-b-0 md:[&:nth-child(4)]:border-b-0 md:border-t md:[&:nth-child(1)]:border-t-0 md:[&:nth-child(2)]:border-t-0"
            >
              {/* Black flood on hover */}
              <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out" />

              {/* Number — bleeds large in background */}
              <div
                className="absolute top-4 right-4 font-heavy leading-none select-none pointer-events-none text-black/[0.04] group-hover:text-white/[0.04] transition-colors duration-500"
                style={{ fontSize: "clamp(8rem, 18vw, 16rem)" }}
                aria-hidden="true"
              >
                {step.number}
              </div>

              <div className="relative z-10 flex flex-col h-full">
                {/* Number chip */}
                <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-black/30 group-hover:text-white/40 transition-colors duration-500 mb-10 md:mb-16">
                  {step.number} —
                </span>

                {/* Title */}
                <h3 className="font-heavy text-3xl md:text-4xl lg:text-5xl uppercase tracking-tighter leading-none text-black group-hover:text-white transition-colors duration-500 mb-8">
                  {step.title}
                </h3>

                {/* Body */}
                <p className="font-sans text-base md:text-lg font-light leading-relaxed text-black/60 group-hover:text-white/70 transition-colors duration-500 max-w-sm mb-auto">
                  {step.body}
                </p>

                {/* Detail chip */}
                <div className="mt-10 pt-6 border-t border-black/10 group-hover:border-white/10 transition-colors duration-500">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/40 group-hover:text-white/40 transition-colors duration-500">
                    {step.detail}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
