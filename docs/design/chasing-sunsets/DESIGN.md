---
version: alpha
name: Chasing Sun(Sets)
description: Reverse-engineered design system for the Chasing Sun(Sets) open-air series.
colors:
  primary: "#E8B86D"
  canvas: "#0B0A09"
  surface: "#2C1810"
  surfaceAlt: "#18110D"
  cream: "#FBF5ED"
  text: "#F8F2E8"
  muted: "#C9B08C"
  accentDeep: "#C2703E"
  border: "#5C4331"
typography:
  display-xl:
    fontFamily: Archivo Black
    fontSize: 88px
    fontWeight: 400
    lineHeight: 0.84
    letterSpacing: -0.04em
  display-accent:
    fontFamily: Instrument Serif
    fontSize: 56px
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: -0.02em
  title-md:
    fontFamily: Archivo Black
    fontSize: 36px
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: -0.02em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.22em
rounded:
  sm: 8px
  md: 18px
  lg: 28px
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
  hero-banner:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  cta-primary:
    backgroundColor: "{colors.text}"
    textColor: "{colors.surface}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  cta-secondary:
    backgroundColor: "{colors.surfaceAlt}"
    textColor: "{colors.text}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  section-kicker:
    typography: "{typography.label-caps}"
    textColor: "{colors.primary}"
---

# Chasing Sun(Sets)

## Overview

Chasing Sun(Sets) is the open-air arm of Monolith. It should feel warmer, lighter, and more breathable than the parent system, but never soft or beach-generic. The right emotional target is golden hour with discipline: sunlit, social, premium, and still rooted in house music credibility.

The route family is:

- `/chasing-sunsets`
- `/chasing-sunsets/:season`

The current page architecture is already clear:

1. hero
2. concept
3. manifesto / ticketing
4. records / archive
5. upcoming dates
6. submit / join
7. FAQ / funnel

Top fixes to prioritize:

- Increase the amount of warm-light breathing room so the page feels more open-air and less like a dark site with gold text.
- Standardize flyer, archive, and ticket modules into one family.
- Keep the summer-premium tone without drifting into generic beige lifestyle branding.
- Make the seasonal story easier to follow at a glance: next date, archive, lineup, join.

## Colors

This system is built around auburn-brown depth, sun gold accents, and cream relief surfaces.

- **Accent Gold** is the main highlight for Chasing Sun(Sets) and should drive headings, lines, and active states.
- **Auburn / Deep Brown** keeps the open-air system grounded and cinematic after sunset.
- **Cream** is essential. Without it, the page loses the air and warmth that separate it from Untold Story.

## Typography

Chasing Sun(Sets) should use a dual-voice system:

- **Archivo Black** for the structural headline voice
- **Instrument Serif** for select seasonal or poetic moments
- **Inter** for body copy
- **JetBrains Mono** for metadata and labels

The serif should be used as seasoning, not as the default headline style. The series still needs structural strength.

## Layout

This page should feel like a season deck more than a product landing page.

Key layout behaviors:

- wider horizontal breathing room than the parent site
- fewer stacked dark cards in a row
- stronger alternation between content, image, and seasonal data
- direct paths to schedule, archive, and join actions

The archive and upcoming modules should feel like part of the same summer system, not separate mini-sites.

## Elevation & Depth

Depth should come from warm gradients, dusk glows, framed image surfaces, and cream-vs-dark contrast. Chasing Sun(Sets) can hold more atmosphere than the parent brand, but the page should still read cleanly when color and motion are reduced.

Use:

- low, warm horizon glows
- thin gold borders
- framed editorial cards
- selective white CTA contrast

## Shapes

Chasing Sun(Sets) can be the roundest of the four systems, but only slightly. The series should still feel premium and controlled.

- hero cards and media panels: rounded but architectural
- pills: full rounded
- gallery and archive tiles: medium radius with strong framing

## Components

Core modules:

- seasonal hero with featured event
- concept / manifesto blocks
- ticketing surface
- archive or records strip
- upcoming dates grid
- join / submit CTA block
- FAQ and funnel surfaces

Component-level fixes:

- unify gold-border cards across concept, upcoming, and FAQ sections
- give image-led modules more room to breathe vertically
- keep the seasonal CTA pair consistent across all major blocks
- use flyers and crowd frames as proof, not decoration

## Do's and Don'ts

- Do let warmth and cream space carry the open-air feeling.
- Do use gold as the active signal everywhere inside the series.
- Do keep imagery grounded in lakefront, skyline, crowd, and sunset energy.
- Do make the route read as a season system instead of a single event flyer.
- Don't let the page collapse back into generic dark luxury blocks.
- Don't use purple, cyan, or unrelated neon accents here.
- Don't overload the page with isolated card styles or one-off borders.
