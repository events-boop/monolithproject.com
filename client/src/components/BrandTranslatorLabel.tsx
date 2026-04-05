import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BrandTranslatorTone = "neutral" | "warm" | "nocturne" | "radio";

const toneClasses: Record<BrandTranslatorTone, string> = {
  neutral: "border-white/14 bg-white/[0.03] text-white/62",
  warm: "border-[#E8B86D]/28 bg-[#E8B86D]/[0.08] text-[#F3D7A0]",
  nocturne: "border-[#8B5CF6]/28 bg-[#8B5CF6]/[0.08] text-[#D2C1FF]",
  radio: "border-primary/24 bg-primary/[0.08] text-primary/90",
};

interface BrandTranslatorLabelProps {
  children: ReactNode;
  className?: string;
  tone?: BrandTranslatorTone;
}

export default function BrandTranslatorLabel({
  children,
  className,
  tone = "neutral",
}: BrandTranslatorLabelProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.34em] md:text-[10px]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
