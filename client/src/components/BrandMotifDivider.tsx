import { Sun } from "lucide-react";
import UntoldButterflyLogo from "@/components/UntoldButterflyLogo";

type DividerTone = "warm" | "nocturne" | "neutral";

interface BrandMotifDividerProps {
  tone?: DividerTone;
  className?: string;
}

const toneMap: Record<DividerTone, { line: string; sun: string; butterfly: string }> = {
  warm: {
    line: "from-transparent via-[#C2703E]/45 to-transparent",
    sun: "text-[#C2703E]",
    butterfly: "text-[#8B5CF6]",
  },
  nocturne: {
    line: "from-transparent via-white/24 to-transparent",
    sun: "text-primary",
    butterfly: "text-[#22D3EE]",
  },
  neutral: {
    line: "from-transparent via-white/24 to-transparent",
    sun: "text-primary",
    butterfly: "text-primary",
  },
};

export default function BrandMotifDivider({
  tone = "neutral",
  className = "",
}: BrandMotifDividerProps) {
  const ui = toneMap[tone];

  return (
    <div className={`px-6 ${className}`} aria-hidden="true">
      <div className="container max-w-6xl mx-auto flex items-center gap-4 md:gap-5">
        <div className={`h-px flex-1 bg-gradient-to-r ${ui.line}`} />
        <div className="inline-flex items-center gap-2">
          <Sun className={`w-3.5 h-3.5 ${ui.sun}`} />
          <UntoldButterflyLogo className={`w-3.5 h-3.5 ${ui.butterfly}`} />
        </div>
        <div className={`h-px flex-1 bg-gradient-to-r ${ui.line}`} />
      </div>
    </div>
  );
}
