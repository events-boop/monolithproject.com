export type SceneId = "monolith" | "story" | "sunsets" | "radio" | "paper";
export type SceneTicketTheme = "default" | "violet" | "warm";

export interface SceneConfig {
  id: SceneId;
  variant: "dark" | "light";
  brand: "monolith" | "chasing-sunsets";
  ticketTheme: SceneTicketTheme;
  accent: string;
  glow: string;
}

const scenes: Record<SceneId, SceneConfig> = {
  monolith: {
    id: "monolith",
    variant: "dark",
    brand: "monolith",
    ticketTheme: "default",
    accent: "#E05A3A",
    glow: "rgba(224, 90, 58, 0.35)",
  },
  story: {
    id: "story",
    variant: "dark",
    brand: "monolith",
    ticketTheme: "violet",
    accent: "#8B5CF6",
    glow: "rgba(139, 92, 246, 0.38)",
  },
  sunsets: {
    id: "sunsets",
    variant: "dark",
    brand: "chasing-sunsets",
    ticketTheme: "warm",
    accent: "#C2703E",
    glow: "rgba(194, 112, 62, 0.35)",
  },
  radio: {
    id: "radio",
    variant: "dark",
    brand: "monolith",
    ticketTheme: "default",
    accent: "#F43F5E",
    glow: "rgba(244, 63, 94, 0.3)",
  },
  paper: {
    id: "paper",
    variant: "light",
    brand: "monolith",
    ticketTheme: "default",
    accent: "#8B5CF6",
    glow: "rgba(139, 92, 246, 0.16)",
  },
};

function normalizePathname(pathname?: string) {
  const clean = pathname?.split("?")[0]?.split("#")[0] || "/";
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean;
}

export function getSceneForPath(pathname?: string): SceneConfig {
  const normalized = normalizePathname(pathname);

  if (
    normalized.startsWith("/story") ||
    normalized.startsWith("/untold-story")
  ) {
    return scenes.story;
  }

  if (normalized.startsWith("/chasing-sunsets")) {
    return scenes.sunsets;
  }

  if (normalized.startsWith("/radio")) {
    return scenes.radio;
  }

  if (
    normalized.startsWith("/newsletter") ||
    normalized.startsWith("/contact") ||
    normalized.startsWith("/faq")
  ) {
    return scenes.paper;
  }

  return scenes.monolith;
}
