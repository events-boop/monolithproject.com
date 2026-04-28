---
version: alpha
name: Chasing Sun(Sets) Radio
description: Reverse-engineered design system for the Chasing Sun(Sets) Radio show and episode archive.
colors:
  primary: "#D4A574"
  canvas: "#060606"
  surface: "#111111"
  surfaceAlt: "#171312"
  text: "#F7F2EA"
  muted: "#A59584"
  accentWarm: "#C2703E"
  border: "#3B2D24"
  signal: "#E8B86D"
typography:
  display-xl:
    fontFamily: Archivo Black
    fontSize: 80px
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: -0.04em
  title-md:
    fontFamily: Archivo Black
    fontSize: 34px
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: -0.02em
  cover-label:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.22em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: 8px
  md: 16px
  lg: 24px
  full: 999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  section: 96px
components:
  episode-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  cta-primary:
    backgroundColor: "{colors.text}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  cta-secondary:
    backgroundColor: "{colors.surfaceAlt}"
    textColor: "{colors.text}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  section-kicker:
    typography: "{typography.cover-label}"
    textColor: "{colors.primary}"
---

# Chasing Sun(Sets) Radio

## Overview

Radio is the between-shows layer of Monolith. It should feel archival, curated, and playable. The best version of this page behaves like an editorial music shelf with strong episode discovery. The current route already has that raw material, but some decorative ideas compete with the actual listening flow.

The route family is:

- `/radio`
- `/radio/:slug`

Current architecture:

1. hero with featured artist
2. visual / globe / media bridge
3. supporting copy and discovery blocks
4. episode list
5. listener map
6. FAQ
7. per-episode detail pages

Top fixes to prioritize:

- Choose one accent system. Radio currently mixes sunset-gold logic with separate pink references in parts of the codebase.
- Prioritize episode discovery over decorative spectacle.
- Keep cover-art modules square, consistent, and legible.
- Make the archive, tracklist, and episode pages feel like one unified content product.

## Colors

Radio should stay in the warm-dark family so it remains connected to Chasing Sun(Sets), but it needs slightly more technical precision than the open-air page.

- **Signal Gold / Copper** is the preferred accent system.
- **Black and charcoal surfaces** keep the archive feeling serious and collectible.
- **Warm neutrals** prevent the page from drifting into generic streaming-app UI.

If a secondary accent is used, it must be intentional and documented. Right now the safer decision is to normalize on the gold / copper family.

## Typography

Radio is the most metadata-heavy of the four systems, so typography needs stronger hierarchy between large titles and technical labels.

- **Archivo Black** for section and episode titles
- **Inter** for summaries and narrative
- **JetBrains Mono** for episode codes, timestamps, tracklist metadata, labels, and player language

The page should feel more like a record archive than a campaign page.

## Layout

Radio should organize around clear listening pathways:

- featured episode
- browse all episodes
- jump into a specific episode page
- scan tracklist and guest context

The route should not bury the episode library under motion-heavy transitions or unrelated visual gimmicks. Hero spectacle is fine as long as the archive still reads immediately below it.

## Elevation & Depth

Use depth through framed cover art, stacked dark surfaces, and subtle warm glows. Radio should feel less atmospheric than Chasing Sun(Sets) and less nocturnal than Untold Story. It is a content shelf first.

Use:

- square artwork panels
- mono metadata strips
- restrained warm highlights
- strong contrast around playable content

## Shapes

Shapes should be clean and repeatable:

- square or near-square episode art
- medium-radius cards
- full-pill controls for main actions
- sharp internal dividers for tracklists

The geometry should reinforce browsing and scanning.

## Components

Core modules:

- featured radio hero
- episode cover shelf
- tracklist / player list
- guest link block
- map and audience context
- FAQ and submission pathways
- episode detail pages

Component-level fixes:

- normalize all episode previews to the same cover-art system
- reduce visual competition between hero motion and archive usability
- keep the same metadata language between radio hub and episode detail pages
- make audio-first modules dominant over decorative stage imagery

## Do's and Don'ts

- Do treat radio as an archive product, not a side campaign.
- Do keep metadata clear, uppercase, and mono-driven.
- Do make covers, episodes, and tracklists easy to scan quickly.
- Do keep the accent system in the sunset gold / copper family unless deliberately changed.
- Don't split the visual identity between gold and pink without a documented rule.
- Don't let decorative 3D elements overpower the actual episode library.
- Don't use weak or inconsistent artwork crops for featured episodes.
