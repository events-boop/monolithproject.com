import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Link } from "wouter";

type ChipTone = "warm" | "nocturne";

interface FloatingFactsChipProps {
  tone?: ChipTone;
  storageKey: string;
}

const toneClasses: Record<ChipTone, string> = {
  warm:
    "bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(255,245,229,0.78))] border-[#C2703E]/28 text-[#2C1810]",
  nocturne:
    "bg-[linear-gradient(145deg,rgba(10,10,16,0.92),rgba(10,10,16,0.72))] border-white/16 text-white",
};

export default function FloatingFactsChip({
  tone = "nocturne",
  storageKey,
}: FloatingFactsChipProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      setIsDismissed(raw === "1");
    } catch {
      setIsDismissed(false);
    } finally {
      setIsReady(true);
    }
  }, [storageKey]);

  const dismiss = () => {
    setIsDismissed(true);
    try {
      window.localStorage.setItem(storageKey, "1");
    } catch {
      // Ignore storage errors and keep the chip hidden for this session.
    }
  };

  if (!isReady || isDismissed) return null;

  return (
    <div className="fixed left-4 md:left-6 bottom-5 md:bottom-7 z-50">
      <div
        className={`max-w-[280px] rounded-full border shadow-[0_14px_36px_rgba(0,0,0,0.26)] backdrop-blur-xl ${toneClasses[tone]}`}
      >
        <div className="flex items-center gap-2 pl-4 pr-2 py-2">
          <Link
            href="/chasing-sunsets-facts"
            className="font-mono text-[11px] tracking-[0.12em] uppercase hover:opacity-80 transition-opacity whitespace-nowrap"
          >
            Chasing Sun(Sets) Facts
          </Link>
          <button
            type="button"
            onClick={dismiss}
            className="ml-auto w-7 h-7 inline-flex items-center justify-center rounded-full hover:bg-black/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"
            aria-label="Dismiss facts shortcut"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
