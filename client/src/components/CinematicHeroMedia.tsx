import { buildResponsiveImageSources } from "@/lib/responsiveImagePath";
import { HOME_HERO_PHOTOGRAPH as photograph } from "@/data/homeArtDirection";
export default function CinematicHeroMedia() {
  const sources = [
    ...buildResponsiveImageSources(photograph.mobileSource, "100vw").map(
      source => ({ ...source, media: "(max-width: 639px)" })
    ),
    ...buildResponsiveImageSources(photograph.source, "100vw"),
  ];
  return (
    <div className="monolith-hero-photo" aria-hidden="true">
      <picture>
        {sources.map((source, index) => (
          <source key={index} {...source} />
        ))}
        <img
          src={photograph.source}
          sizes="100vw"
          width={photograph.sourceWidth}
          height={photograph.sourceHeight}
          alt=""
          fetchPriority="high"
        />
      </picture>
    </div>
  );
}
