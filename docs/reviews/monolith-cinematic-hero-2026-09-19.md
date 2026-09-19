# Cinematic homepage hero — September 19, 2026

Preview: https://6aae770f3d17fb91a4985c9d--monolithproject.netlify.app/

Expanded the hero to the full viewport width and a full desktop screen, with a 92svh mobile scene. Reduced the text, moved the title into the lower part of the frame, and replaced the heavy wash with a localized contrast gradient. The existing toolbar is unchanged. The approved Chasing Sun(Sets) logo, date, venue, hours, age restriction, status and tickets remain in a separate compact strip immediately below the scene, including the existing event-expiry condition.

Uses the existing Castaways film silently on eligible desktop devices, with a keyboard-accessible pause/play control. Phones, reduced-motion preferences, constrained connections and lower-powered devices keep the responsive still. The still's responsive size accounts for the tall crop to prevent a blurry mobile hero. Motion preference changes during playback return to the still.

Validation: TypeScript and production build passed; analytics/pixel build guard passed. Nine homepage/cinematic browser checks passed across five viewport widths. After the image-sizing and runtime motion preference refinement, all three focused cinematic checks passed again. Screenshots: `/tmp/monolith-cinematic-1363.png`, `/tmp/monolith-cinematic-390.png`, `/tmp/monolith-cinematic-film.png`.

Draft preview only. Existing uncommitted website fixes were preserved. This change is confined to HeroSection, home.css, the new CinematicHeroMedia component, its browser checks, and this note; no production push was made.
