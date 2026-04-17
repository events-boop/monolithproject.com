import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BrandTranslatorTone = "neutral" | "warm" | "nocturne" | "radio";

const toneClasses: Record<BrandTranslatorTone, string> = {
  neutral: "border-white/20 bg-white/[0.03] text-white/60",
  warm: "border-[#E8B86D]/28 bg-[#E8B86D]/[0.08] text-[#F3D7A0]",
  nocturne: "border-[#22D3EE]/28 bg-[#22D3EE]/[0.08] text-[#B7F5FD]",
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
        "inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.3em] md:text-[10px]",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </div>
  );
}
