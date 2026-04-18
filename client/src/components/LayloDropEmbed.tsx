import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Bell } from "lucide-react";

const LAYLO_SCRIPT_SRC = "https://embed.laylo.com/embed.js";
const LAYLO_SCRIPT_ID = "laylo-embed-script";

function ensureLayloScript() {
  if (typeof document === "undefined") return;
  if (document.getElementById(LAYLO_SCRIPT_ID)) return;
  const s = document.createElement("script");
  s.id = LAYLO_SCRIPT_ID;
  s.src = LAYLO_SCRIPT_SRC;
  s.async = true;
  document.head.appendChild(s);
}

interface LayloDropEmbedProps {
  dropId?: string;
  fallbackHref?: string;
  fallbackLabel?: string;
  accentColor?: string;
  variant?: "card" | "inline";
  className?: string;
}

export default function LayloDropEmbed({
  dropId,
  fallbackHref = "/alerts",
  fallbackLabel = "Get Alerts First",
  accentColor,
  variant = "card",
  className,
}: LayloDropEmbedProps) {
  useEffect(() => {
    if (dropId) ensureLayloScript();
  }, [dropId]);

  if (!dropId) {
    return (
      <Link
        href={fallbackHref}
        className={`group inline-flex items-center justify-between gap-3 px-5 py-4 font-mono text-[11px] tracking-[0.3em] uppercase font-bold transition-all duration-300 hover:-translate-y-0.5 border border-white/20 hover:border-white/50 ${className ?? ""}`}
        style={accentColor ? { color: accentColor } : undefined}
        data-cta-source="laylo-fallback"
        data-cta-tool="laylo"
      >
        <span className="flex items-center gap-2">
          <Bell className="w-3.5 h-3.5" />
          {fallbackLabel}
        </span>
        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    );
  }

  const containerClass =
    variant === "inline"
      ? `w-full ${className ?? ""}`
      : `w-full border border-white/10 bg-black/40 p-5 md:p-6 ${className ?? ""}`;

  return (
    <div className={containerClass} data-cta-source="laylo-embed" data-cta-tool="laylo">
      <div id={`laylo-drop-${dropId}`} />
    </div>
  );
}
