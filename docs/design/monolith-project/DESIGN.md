---
version: alpha
name: Monolith Project Core
description: Reverse-engineered core design system for the parent Monolith Project site and non-series route family.
colors:
  primary: "#E05A3A"
  canvas: "#050505"
  surface: "#111111"
  surfaceAlt: "#0D0D0D"
  surfaceLight: "#F4ECD9"
  text: "#F5F1E8"
  muted: "#8E867B"
  accentWarm: "#F4D7A1"
  border: "#2A241E"
typography:
  display-xl:
    fontFamily: Kanit
    fontSize: 96px
    fontWeight: 500
    lineHeight: 0.84
    letterSpacing: 0.01em
  display-lg:
    fontFamily: Kanit
    fontSize: 64px
    fontWeight: 500
    lineHeight: 0.88
    letterSpacing: 0
  title-md:
    fontFamily: Archivo Black
    fontSize: 40px
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: -0.02em
  wordmark:
    fontFamily: Kanit
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.08em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
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
  gutter: 24px
  shell: 32px
components:
  shell-header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.full}"
    padding: "{spacing.md}"
  hero-wordmark:
    typography: "{typography.display-xl}"
    textColor: "{colors.text}"
  cta-primary:
    backgroundColor: "{colors.text}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  cta-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.full}"
    padding: "{spacing.sm}"
  section-kicker:
    typography: "{typography.label-caps}"
    textColor: "{colors.primary}"
---

# Monolith Project

## Overview

The parent Monolith layer is the system shell for the entire site. It should feel precise, dark, editorial, and controlled rather than ornamental. The current site already has the right raw ingredients: a framed header, heavy display type, modular cards, and a strong black field. The problem is consistency. Some sections feel tightly art directed while others feel like separate microsites stitched together.

This file governs the non-series route family first:

- `/`
- `/schedule`
- `/lineup`
- `/about`
- `/partners`
- `/contact`
- `/archive`
- `/newsletter`

Top fixes to prioritize:

- Consolidate font token truth. `index.css` and `theme.css` currently compete.
- Standardize section title scale across core pages using one display system.
- Reduce abrupt visual mode changes on the home page between dark editorial, cream utility, and campaign blocks.
- Keep the parent Monolith shell neutral enough that series pages can inherit it without losing their own identity.

## Colors

The parent palette should stay anchored in near-black surfaces, warm off-white text, and a single clay-orange accent. The orange is not a decorative wash. It is the system signal for key actions, featured moments, and Monolith-owned emphasis.

- **Canvas:** almost-black foundation used behind the shell and main content
- **Surface / Surface Alt:** stacked dark layers used to separate sections without changing the entire visual language
- **Surface Light:** warm cream utility plane used sparingly for contrast-heavy content breaks
- **Accent:** Monolith clay-orange for parent-brand calls to action, ticket urgency, and route-level emphasis

## Typography

The core hierarchy should stay simple:

- **Kanit Medium 500** for the parent Monolith hero treatment, wordmark, and system-level page titles
- **Archivo Black** for secondary structural headlines that need more mass
- **Inter** for body copy and utility explanations
- **JetBrains Mono** for metadata, labels, timestamps, and navigation microcopy

Kanit is the in-between point for the parent identity: cleaner and less heavy than Archivo Black, but more substantial than the previous thin wordmark direction. The site should not introduce extra display voices at the parent-brand layer unless they belong to a series. This is the stabilizing system, not the experimental one.

## Layout

The parent site follows a fixed-shell, modular-section model:

- Hero or scene opener
- Campaign or featured event surface
- Utility sections such as schedule, archive, roster, or partner pathways
- Conversion footer or strip

On the home page specifically, the current flow is:

1. Hero
2. Chasing Sun(Sets) seasonal push
3. Featured indoor event
4. Season dates
5. Series split
6. Past-night proof
7. Partner / contact conversion

This layout is strong structurally. The next design pass should improve rhythm, not replace the architecture.

## Elevation & Depth

Depth should come from tonal layering, borders, framed surfaces, and restrained glows. The strongest current pattern is the shell-header plus dark-card system. Keep that. Avoid adding random glassmorphism or gradient surfaces unless they belong to a specific series.

Primary depth tools:

- dark-on-dark section layering
- 1px border separation
- occasional warm radial glow behind heroes or feature cards
- white pill CTAs reserved for the most important action in a section

## Shapes

The shape system should remain mixed but intentional:

- framed shells and section cards: medium to large rounded corners
- CTAs: full pills
- image modules: sharp to lightly rounded rectangles

Top correction: card radii and border treatment should not drift page to page. The parent shell needs one repeatable geometry system that the series pages can adapt.

## Components

Core components in the parent system:

- shell header with persistent framed navigation
- oversized hero wordmark plus secondary event card
- section kicker plus display headline pair
- white primary pill and dark secondary pill CTA pair
- feature cards for schedule, lineup, and archive pathways
- proof blocks for attendance, audience, archive, and partnerships

Component-level fixes:

- keep the `MONOLITH` hero treatment large and singular; avoid rebuilding a second headline underneath it
- use the same section title scale on home, lineup, about, partners, and contact
- keep roster, schedule, and archive cards in the same family so the site feels productized instead of assembled
- preserve the framed navigation and keep it visually calmer than the campaign content below it

## Do's and Don'ts

- Do use the parent Monolith layer as the visual stabilizer for the rest of the site.
- Do keep headings large, spare, and aligned to a repeatable rhythm.
- Do let orange act as a system signal, not a background default.
- Do treat cream sections as rare relief planes, not a second full theme.
- Don't mix competing font definitions across token files.
- Don't let campaign sections invent their own card radius, border density, or CTA hierarchy.
- Don't add decorative effects unless they help hierarchy or reinforce a specific series identity.
