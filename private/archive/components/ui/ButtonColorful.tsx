import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  glow?: "coral" | "gold" | "violet";
}

const glowGradients = {
  coral: "from-[#E0603A] via-[#D4884E] to-[#E8B86D]",
  gold: "from-[#E8B86D] via-[#D4884E] to-[#C2703E]",
  violet: "from-violet-500 via-purple-500 to-fuchsia-500",
};

export function ButtonColorful({
  className,
  label = "Explore",
  glow = "coral",
  ...props
}: ButtonColorfulProps) {
  return (
    <Button
      className={cn(
        "relative h-11 px-6 overflow-hidden rounded-full",
        "bg-black/80 border border-white/10",
        "transition-all duration-300",
        "group",
        className,
      )}
      {...props}
    >
      {/* Vivid gradient glow */}
      <div
        className={cn(
          "absolute inset-0 rounded-full",
          "bg-gradient-to-r",
          glowGradients[glow],
          "opacity-60 group-hover:opacity-100",
          "blur-sm transition-opacity duration-500",
        )}
      />

      {/* Inner dark shell for contrast */}
      <div className="absolute inset-[1px] rounded-full bg-black/70 group-hover:bg-black/50 transition-colors duration-500" />

      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        <span className="text-sm font-bold uppercase tracking-[0.15em] text-white/90 group-hover:text-white transition-colors">
          {label}
        </span>
        <ArrowUpRight className="w-3.5 h-3.5 text-white/70 group-hover:text-white transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Button>
  );
}
