# Monolith Project Asset Protocol

This protocol governs photography, video, artwork, posters, generated derivatives, and page-level media placement across the Monolith Project site. It is a required companion to `DESIGN.md`.

The standard is simple: assets must make the system feel premium, real, and culturally specific. Dark UI is acceptable; low-quality media is not.

## Quality Bar

Hero and feature assets must come from true high-quality sources:

- Desktop hero images: minimum 1920px wide source, preferably 2560px or larger.
- Mobile hero crops: minimum 1080px tall source when used as portrait media.
- Section feature images: minimum 1600px wide source for full-width use, 1200px wide for split layouts.
- Detail/card images: minimum 1024px wide source unless the design intentionally uses a small archival artifact.
- Video hero loops: source should be 1080p minimum, with clean motion, no obvious compression blocks, and a strong poster frame.
- Recap or editorial video: 1080p minimum, 4K preferred for source files.

Reject assets that are blurry, visibly upscaled, noisy from poor low-light capture, over-sharpened, heavily compressed, badly cropped, generic stock, or too abstract to prove the event/artist/place.

## Visual Direction

Use media to balance the site's dark architecture with proof of life:

- Prioritize real crowd, artist, venue, production, and golden-hour moments.
- Mix wide atmosphere shots with close editorial details: decks, lighting, wristbands, hands, signage, table service, entry moments, and crowd texture.
- Chasing Sun(Sets) should include warmth, daylight, golden hour, outdoor energy, and social movement.
- Untold Story can stay darker, but should still include faces, room energy, lighting, and DJ proximity.
- Monolith parent pages should use the strongest brand-level visuals: architectural, cinematic, precise, and real.
- Radio/audio pages should show equipment, artists, session moments, and broadcast context rather than generic waveform art.

Avoid using dark gradients, smoke, silhouettes, or abstract backgrounds as substitutes for real high-quality media.

## Storage Model

Do not dump raw asset libraries into normal git history.

- Source originals belong in a local/private archive or external object storage.
- Web-ready derivatives belong in `client/public/images` and `client/public/images/generated`.
- Every accepted asset should be listed in a catalog or documented in the relevant data file with title, alt text, source dimensions, intended page, usage rights, and credit when applicable.
- Large video originals should not be committed directly. Commit optimized web clips/posters only unless the team explicitly approves otherwise.

## Naming

Use descriptive, stable, lowercase filenames:

`series-subject-context-orientation-version.ext`

Examples:

- `chasing-sunsets-crowd-goldenhour-wide-v01.jpg`
- `untold-story-dj-booth-lowlight-wide-v01.jpg`
- `monolith-brand-hero-architecture-wide-v01.webp`
- `radio-broadcast-console-detail-v01.jpg`

Rules:

- Use hyphens, not spaces or underscores.
- Include the series or route family first.
- Include context, not just a date.
- Use `wide`, `portrait`, `square`, or `detail` when crop intent matters.
- Increment versions instead of overwriting a meaningfully different asset.

## Required Metadata

Each production asset should have enough metadata for future agents to use it correctly:

- Title or short label.
- Alt text suitable for accessibility.
- Source dimensions.
- Series or route family.
- Intended page/section.
- Focal point or crop guidance.
- Credit/usage rights.
- Mood tags such as `golden-hour`, `crowd`, `artist`, `venue`, `detail`, `radio`, `sponsor`, or `table-service`.

Never ship an image without meaningful alt text unless it is purely decorative and explicitly marked as such in the component.

## Derivatives

Generate derivatives from the best available source, not from already compressed web files.

Default image derivatives:

- `480w` for small mobile and thumbnails.
- `1024w` for mobile/standard responsive use.
- `1600w` for premium section and large card use.
- `1920w` for desktop hero use.

Special cases:

- Keep `2560w` or larger only when a page truly benefits from ultra-wide desktop treatment and the budget allows it.
- Do not generate fake `1920w` variants from sources that are materially smaller.
- Use AVIF first, WebP fallback, and original format only as fallback.
- Maintain aspect-ratio consistency unless a separate art-directed crop is intentionally created.

## Video Tiers

Classify video before adding it:

- `hero-loop`: short, muted, looped, poster-first, decorative but premium.
- `recap-clip`: editorial proof of event energy, can be embedded or lazy-loaded.
- `artist-session`: radio/live performance content with clear context.
- `archive-original`: source storage only, not directly served to users.

Hero loops should be short, compressed carefully, and paired with a high-quality poster. Below-the-fold video must lazy-load. Do not autoplay heavy longform video as a background.

## Page Placement Rules

Every major page should have at least one strong proof asset:

- Home: brand-level hero plus one real event/crowd proof moment.
- Chasing Sun(Sets): warm outdoor/golden-hour media.
- Untold Story: room, crowd, DJ proximity, and table/entry proof.
- Radio: session, studio, equipment, or artist broadcast visuals.
- Schedule/Tickets: event-specific image whenever available.
- Partners: polished venue, crowd, sponsor, or hospitality proof.
- Archive: real recap media, not generic placeholders.

Do not repeat the same hero image across unrelated pages unless it is intentionally acting as the Monolith parent brand image.

## Performance Rules

Premium media is allowed, but delivery must be intentional:

- Only the primary above-the-fold hero may be eager/high-priority.
- Everything below the fold should lazy-load.
- Use `ResponsiveImage` or the established responsive image pipeline for local raster assets.
- Use explicit dimensions, aspect ratio, or stable containers to avoid layout shift.
- Use poster-first loading for video.
- Avoid loading desktop-scale assets on mobile.
- Keep generated responsive manifests in sync when assets change.

Performance is not an excuse for low-quality visuals; it is a delivery problem to solve with responsive sources, compression, lazy loading, and art-directed crops.

## Acceptance Checklist

Before an asset becomes production media, confirm:

- The source is high enough quality for its intended placement.
- The asset adds real proof, emotion, place, artist context, or brand value.
- The crop works on desktop and mobile.
- Alt text and usage rights are known.
- Responsive derivatives exist for the intended use.
- The page does not become a dark-only wall of text.
- The asset does not introduce layout shift, oversized mobile downloads, or unnecessary autoplay cost.

If an asset fails this checklist, archive it or use it only in a lower-priority context.
