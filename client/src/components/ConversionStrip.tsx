import { motion } from "framer-motion";
import type { ScheduledEvent } from "@shared/events/types";
import {
  getExperienceEvent,
  getEventStartTimestamp,
  getSeriesColor,
  getSeriesColorOnLight,
} from "@/lib/siteExperience";
import { CTA_LABELS, getEventCta } from "@/lib/cta";
import ConversionCTA from "./ConversionCTA";
import { useCountdown } from "@/hooks/useCountdown";

function HUDDigit({ value, label, tone }: { value: number; label: string; tone: "warm" | "nocturne" }) {
  const isWarm = tone === "warm";

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex gap-1">
        {String(value)
          .padStart(2, "0")
          .split("")
          .map((digit, index) => (
            <div
              key={index}
              className={`flex h-12 w-8 items-center justify-center border font-heavy text-xl tabular-nums md:h-20 md:w-14 md:text-4xl ${
                isWarm
                  ? "border-[#C2703E]/14 bg-white/82 text-[#2C1810] shadow-[0_14px_24px_rgba(44,24,16,0.06)]"
                  : "border-white/10 bg-white/5 text-white"
              }`}
            >
              {digit}
            </div>
          ))}
      </div>
      <span
        className={`font-mono text-[11px] uppercase tracking-[0.3em] md:text-sm ${
          isWarm ? "text-[#2C1810]/42" : "text-white/30"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

interface ConversionStripProps {
  event?: ScheduledEvent;
  tone?: "warm" | "nocturne";
}

export default function ConversionStrip({
  event: providedEvent,
  tone = "nocturne",
}: ConversionStripProps = {}) {
  const event = providedEvent ?? getExperienceEvent("ticket");
  const cta = getEventCta(event);
  const targetDate = getEventStartTimestamp(event);
  const timeLeft = useCountdown(targetDate);

  if (!event) return null;

  const isWarm = tone === "warm";
  const themeColor = isWarm ? getSeriesColorOnLight(event.series) : getSeriesColor(event.series);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-full overflow-hidden border shadow-[0_40px_100px_rgba(0,0,0,0.16)] ${
        isWarm
          ? "border-[#C2703E]/14 bg-[linear-gradient(180deg,rgba(244,233,214,0.92),rgba(251,245,237,0.98))] shadow-[0_24px_60px_rgba(44,24,16,0.08)]"
          : "border-white/10 bg-black/60 backdrop-blur-3xl shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
      } group`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: isWarm
            ? "radial-gradient(rgba(44,24,16,0.45) 1px, transparent 0)"
            : "radial-gradient(#fff 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="container layout-wide relative z-10 px-6 py-10 md:py-14">
        <div className="flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-center lg:gap-8">
          <div className="flex max-w-sm flex-col gap-6">
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded-none px-2 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${
                  isWarm ? "text-white" : "text-black"
                }`}
                style={{ backgroundColor: themeColor }}
              >
                {event.status === "on-sale" ? "Ticket Window" : "Next Event"}
              </span>
              <span
                className={`rounded-none border px-2 py-1 text-[11px] font-bold uppercase tracking-[0.2em] ${
                  isWarm
                    ? "border-[#C2703E]/14 bg-white/56 text-[#2C1810]/56"
                    : "border-white/20 text-white/60"
                }`}
              >
                Early Access
              </span>
            </div>
            <div>
              <h2
                className={`font-heavy text-3xl uppercase leading-[0.9] tracking-tighter md:text-4xl ${
                  isWarm ? "text-[#2C1810]" : "text-white"
                }`}
              >
                {cta.label === CTA_LABELS.tickets ? "TICKETS LIVE" : "NEXT EVENT"}
                <br />
                <span style={{ color: themeColor }}>{event.headline || "EVENT DETAILS COMING SOON"}</span>
              </h2>
              <p
                className={`mt-4 font-sans text-[10px] uppercase tracking-widest leading-relaxed ${
                  isWarm ? "text-[#2C1810]/50" : "text-white/40"
                }`}
              >
                {event.status === "on-sale"
                  ? "Inventory is capped to protect the room. Secure your access before the next phase shift."
                  : "Subscribe for early access to the next ticket window before the public release."}
              </p>
            </div>
          </div>

          <div className="mx-auto flex items-center gap-4 md:gap-6 lg:mx-0">
            <HUDDigit value={timeLeft.days} label="Days" tone={tone} />
            <div className={`hidden h-12 w-px self-center md:block ${isWarm ? "bg-[#C2703E]/14" : "bg-white/10"}`} />
            <HUDDigit value={timeLeft.hours} label="Hours" tone={tone} />
            <HUDDigit value={timeLeft.minutes} label="Min" tone={tone} />
            <HUDDigit value={timeLeft.seconds} label="Sec" tone={tone} />
          </div>

          <ConversionCTA event={event} size="lg" showUrgency={true} />
        </div>
      </div>
    </motion.div>
  );
}
