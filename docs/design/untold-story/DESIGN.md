---
version: alpha
name: Untold Story
description: Reverse-engineered design system for the Untold Story after-dark series.
colors:
  primary: "#22D3EE"
  canvas: "#05060B"
  surface: "#06060F"
  surfaceAlt: "#0C0C1A"
  text: "#F5F7FA"
  muted: "#8DA3B3"
  accentAtmosphere: "#8B5CF6"
  border: "#17313A"
  warning: "#E05A3A"
typography:
  display-xl:
    fontFamily: Archivo Black
    fontSize: 84px
    fontWeight: 400
    lineHeight: 0.84
    letterSpacing: -0.04em
  display-accent:
    fontFamily: Syne
    fontSize: 52px
    fontWeight: 700
    lineHeight: 0.9
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
  hero-panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
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
    typography: "{typography.label-caps}"
    textColor: "{colors.primary}"
---

# Untold Story

## Overview

Untold Story is the after-dark counterpart to Chasing Sun(Sets). It should feel denser, sharper, and more immersive, but not muddy, generic, or “luxury nightlife” in the lazy sense. The page needs to communicate a real room: darker, tighter, more focused, more physical.

The route family is:

- `/story`
- `/untold-story`
- `/untold-story/:season`

The current architecture is:

1. hero
2. anchor navigation
3. event content
4. contrast statement
5. episode gallery
6. season records
7. updates / join

Top fixes to prioritize:

- Keep cyan as the working accent and violet as atmosphere only.
- Tighten the relationship between hero, event details, records, and archive so the page feels like one chapter.
- Remove any warm or generic promotional imagery that weakens the room identity.
- Standardize the edge treatment of dark cards and archive modules.

## Colors

Untold Story lives in a deep black-blue environment with cyan as the functional highlight and violet reserved for glow, atmosphere, and supporting gradients.

- **Cyan** is the active signal for navigation, anchors, focus lines, and utility emphasis.
- **Violet** is not a primary UI color. It is an atmospheric layer.
- **White / icy off-white text** should stay crisp so the page retains club precision.

## Typography

The series should feel more severe and less relaxed than Chasing Sun(Sets).

- **Archivo Black** carries the main structural headline system.
- **Syne** can be used for more character-driven or identity-heavy moments.
- **Inter** handles explanation and body text.
- **JetBrains Mono** stays responsible for labels, timestamps, coordinates, and system metadata.

The result should feel like editorial nightlife, not fantasy branding.

## Layout

Untold Story should use a tighter vertical rhythm than the open-air series. Sections can stack more densely, but they still need clear breakpoints between event, contrast, archive, and subscription.

Preferred layout behaviors:

- stronger border framing
- tighter content columns
- fewer cream or relief surfaces
- high contrast between content zones

The anchor navigation is important here. It should feel like a chapter index.

## Elevation & Depth

Depth comes from darkness, glow, and contrast instead of warm gradients. Use cyan and violet light sparingly behind major moments, then let borders and negative space carry the hierarchy.

Best tools:

- deep layered blacks
- cyan focus lines
- light edge glows
- monochrome-to-cyan transitions in hero and feature modules

## Shapes

Untold Story should feel slightly sharper than the rest of the site.

- cards: medium radius, never too soft
- CTA pills: still rounded, but denser and more restrained
- image frames: assertive borders and cropped edges

## Components

Core modules:

- event-led hero
- anchor index
- event details and conversion card
- contrast / manifesto block
- record gallery
- archive and season record modules
- updates and subscriber conversion strip

Component-level fixes:

- make event, ticketing, and archive components feel like the same design family
- reduce decorative drift; every cyan or violet effect should point to structure
- keep artist and room photography dominant over abstract texture
- use typography and spacing to create pressure, not clutter

## Do's and Don'ts

- Do make the page feel like a late-night room with discipline.
- Do use cyan for real interface emphasis.
- Do keep the archive and live-event modules visually connected.
- Do let darkness and restraint carry the premium feeling.
- Don't let violet become the default UI accent.
- Don't use warm seasonal tones that belong to Chasing Sun(Sets).
- Don't over-soften cards, borders, or typography.
