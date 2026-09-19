/** Supplied campaign artwork, preserved uncropped and sized for the web. */
export default function SunsetsCampaignArtwork({
  variant,
}: {
  variant: "wide" | "social";
}) {
  const wide = variant === "wide";
  const sizes = wide
    ? "(min-width: 900px) 50vw, 100vw"
    : "(min-width: 900px) 380px, 90vw";
  const widths = wide ? [640, 1280] : [480, 960];
  return (
    <picture>
      <source
        type="image/avif"
        srcSet={widths
          .map(w => `/sunsets/assets/campaign-${variant}-${w}.avif ${w}w`)
          .join(", ")}
        sizes={sizes}
      />
      <img
        src={`/sunsets/assets/campaign-${variant}-${widths[1]}.webp`}
        srcSet={widths
          .map(w => `/sunsets/assets/campaign-${variant}-${w}.webp ${w}w`)
          .join(", ")}
        sizes={sizes}
        width={wide ? 1774 : 1079}
        height={wide ? 887 : 1458}
        loading="lazy"
        decoding="async"
        alt={
          wide
            ? "Original September 19 JOEZI × MASSUMA artwork. This show is postponed; open the current event update."
            : "Chasing Sun(Sets) sunset DJ artwork. Follow @chasingsunsets.music."
        }
      />
    </picture>
  );
}
