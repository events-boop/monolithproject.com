import type { CSSProperties, IframeHTMLAttributes } from "react";

interface YouTubeEmbedProps {
  url: string;
  title: string;
  className?: string;
  style?: CSSProperties;
  loading?: IframeHTMLAttributes<HTMLIFrameElement>["loading"];
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  modestBranding?: boolean;
  rel?: boolean;
  start?: number;
  allowFullScreen?: boolean;
}

function getYouTubeVideoId(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1) || null;
    }

    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }

      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1] || null;
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1] || null;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export default function YouTubeEmbed({
  url,
  title,
  className,
  style,
  loading = "lazy",
  autoplay = false,
  muted = false,
  controls = true,
  loop = false,
  playsInline = true,
  modestBranding = true,
  rel = false,
  start,
  allowFullScreen = true,
}: YouTubeEmbedProps) {
  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    return null;
  }

  const embedUrl = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  embedUrl.searchParams.set("autoplay", autoplay ? "1" : "0");
  embedUrl.searchParams.set("mute", muted ? "1" : "0");
  embedUrl.searchParams.set("controls", controls ? "1" : "0");
  embedUrl.searchParams.set("playsinline", playsInline ? "1" : "0");
  embedUrl.searchParams.set("rel", rel ? "1" : "0");
  embedUrl.searchParams.set("modestbranding", modestBranding ? "1" : "0");
  embedUrl.searchParams.set("enablejsapi", "0");
  embedUrl.searchParams.set("iv_load_policy", "3");
  embedUrl.searchParams.set("disablekb", "1");

  if (loop) {
    embedUrl.searchParams.set("loop", "1");
    embedUrl.searchParams.set("playlist", videoId);
  }

  if (typeof start === "number" && Number.isFinite(start) && start > 0) {
    embedUrl.searchParams.set("start", String(Math.floor(start)));
  }

  return (
    <iframe
      className={className}
      style={style}
      src={embedUrl.toString()}
      title={title}
      loading={loading}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen={allowFullScreen}
    />
  );
}
