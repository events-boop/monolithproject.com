import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface JoinSignalSectionProps {
  className?: string;
  tone?: "dark" | "warm";
}

const toneStyles = {
  dark: {
    section: "bg-black border-white/10 text-white",
    eyebrow: "text-primary",
    heading: "text-white",
    body: "text-white/70",
    panel: "border-white/15 bg-white/[0.02] text-white/80",
  },
  warm: {
    section: "bg-[#F4ECD9] border-black/10 text-[#121212]",
    eyebrow: "text-[#A8492E]",
    heading: "text-[#121212]",
    body: "text-black/70",
    panel: "border-black/10 bg-white/45 text-black/75",
  },
} as const;

export default function JoinSignalSection({
  className,
  tone = "dark",
}: JoinSignalSectionProps) {
  const styles = toneStyles[tone];

  return (
    <section
      className={cn(
        "relative border-y py-16 md:py-20 overflow-hidden",
        styles.section,
        className,
      )}
    >
      <div className="absolute inset-0 bg-noise opacity-[0.04] pointer-events-none" />
      <div className="container layout-wide px-6 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <span
              className={cn(
                "font-mono text-[11px] tracking-[0.35em] uppercase font-bold block mb-4",
                styles.eyebrow,
              )}
            >
              Join The Drop List
            </span>
            <h2
              className={cn(
                "font-display text-[2.3rem] leading-[0.9] tracking-tight uppercase md:text-[3.4rem] mb-4",
                styles.heading,
              )}
            >
              Stay In The Loop, Not The Noise
            </h2>
            <p className={cn("max-w-2xl text-sm md:text-base leading-relaxed", styles.body)}>
              Tickets, updates, and radio drops from one Chicago-rooted music company.
              Direct updates, no generic blast.
            </p>
          </div>

          <div className={cn("rounded-2xl border p-5 md:p-6", styles.panel)}>
            <div className="grid gap-3 sm:grid-cols-3">
              <Link href="/schedule" className="btn-pill btn-pill-compact w-full justify-center">
                View Upcoming Shows <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link href="/newsletter" className="btn-pill-outline btn-pill-compact w-full justify-center">
                Sign Up for Drops <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link href="/radio" className="btn-pill-neutral btn-pill-compact w-full justify-center">
                Listen to Radio <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
