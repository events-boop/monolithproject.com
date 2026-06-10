import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowUpRight, Bell } from "lucide-react";

const LAYLO_SCRIPT_SRC = "https://embed.laylo.com/laylo-sdk.js";
const LAYLO_SCRIPT_ID = "laylo-embed-script";
const LAYLO_PROFILE_HREF = "https://laylo.com/monolithproject";

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
  profileLabel?: string;
  showFooterLinks?: boolean;
  variant?: "card" | "inline";
  className?: string;
}

function buildLayloEmbedSrc(dropId: string, accentColor?: string) {
  const params = new URLSearchParams({
    dropId,
    color: (accentColor ?? "b6bdce").replace("#", ""),
    minimal: "false",
    theme: "dark",
    background: "solid",
  });

  return `https://embed.laylo.com?${params.toString()}`;
}

function buildLayloProfileHref(dropId: string) {
  const params = new URLSearchParams({
    utm_source: "multidropEmbed",
    utm_campaign: dropId,
    utm_medium: "profileLink",
  });

  return `${LAYLO_PROFILE_HREF}?${params.toString()}`;
}

function buildLayloDropHref(dropId: string) {
  const params = new URLSearchParams({
    utm_source: "multidropEmbed",
    utm_campaign: dropId,
    utm_medium: "multidropLink",
  });

  return `https://laylo.com/d/${dropId}?${params.toString()}`;
}

export default function LayloDropEmbed({
  dropId,
  fallbackHref = "/alerts",
  fallbackLabel = "Get Alerts First",
  accentColor,
  profileLabel = "Follow CHASING SUN(SETS)",
  showFooterLinks = true,
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
    <div
      className={containerClass}
      data-cta-source="laylo-embed"
      data-cta-tool="laylo"
    >
      <iframe
        id={`laylo-drop-${dropId}`}
        className="block min-h-[430px] w-full border-0 bg-transparent"
        scrolling="no"
        allow="web-share"
        allowTransparency
        title="CHASING SUN(SETS) first access signup"
        src={buildLayloEmbedSrc(dropId, accentColor)}
      />
      {showFooterLinks ? (
        <div className="flex items-center justify-between gap-3 px-1 pt-2 text-[10px] font-semibold leading-3 tracking-[0.02em] text-stone-400">
          <a
            href={buildLayloProfileHref(dropId)}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-dotted underline-offset-4 transition hover:text-white"
          >
            {profileLabel}
          </a>
          <a
            href={buildLayloDropHref(dropId)}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 underline decoration-dotted underline-offset-4 transition hover:text-white"
          >
            View on Laylo
          </a>
        </div>
      ) : null}
    </div>
  );
}
