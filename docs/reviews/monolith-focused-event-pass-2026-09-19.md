# Focused pass 1: event messaging and upcoming shows

Preview: https://6aaeb7969225984ae6350ed2--monolithproject.netlify.app/#season

The live homepage was confirmed to serve an older bundle than the existing redesign preview. Production has not been replaced by this pass.

- Homepage calendar now presents date, headliners, support, venue, time, ticket availability and one primary action in consistent cards.
- September 19 uses approved JOEZI × MASSUMA information and AllEvents checkout. October launch remains an announcement with event details, without implying that tickets or presale benefits are available.
- Expired events are excluded using the shared lifecycle logic. The finale's homepage promotion and calendar entry retire after September 19 at 10 PM Chicago time.
- Removed stale August/July fallback copy from the Sunsets prerender route. Its event metadata and information use the same approved publication as the current guide.
- Preserved the cinematic hero, toolbar, artist section and Radio shelf. Subsequent artist-discovery and featured-Radio changes are separate tasks.

Validation: type check, production build, pixel guard, 9 Playwright checks, 7 event-logic tests, desktop and phone visual review. No purchase or subscription was submitted. Screenshots: `/tmp/monolith-upcoming-1363.png`, `/tmp/monolith-upcoming-390.png`.

Next sequence: artist introductions with listening/appearance links; featured Radio mix; a small Journal feature; access benefits after owner confirmation.
