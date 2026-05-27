---
version: v2
name: Monolith Project Core
description: The core design system for the parent Monolith Project website and non-series route family. Monolith is the precise, dark, editorial shell that holds every series without letting them visually drift.

colors:
  canvas: "#050505"
  canvas-deep: "#020202"
  surface: "#111111"
  surface-soft: "#171310"
  surface-raised: "#1E1915"
  surface-light: "#F4ECD9"
  text: "#F5F1E8"
  text-muted: "#A69A8C"
  text-dim: "#6F675F"
  primary: "#E05A3A"
  accent-warm: "#F4D7A1"
  border: "#2A241E"
  border-strong: "#4B3C31"
  success: "#A7D8A5"

typography:
  display-xxl:
    fontFamily: General Sans, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 112px
    fontWeight: 500
    lineHeight: 0.82
    letterSpacing: 0
  display-xl:
    fontFamily: General Sans, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 96px
    fontWeight: 500
    lineHeight: 0.84
    letterSpacing: 0
  display-lg:
    fontFamily: General Sans, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 64px
    fontWeight: 500
    lineHeight: 0.88
    letterSpacing: 0
  title-lg:
    fontFamily: Archivo Black, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 48px
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: -0.02em
  title-md:
    fontFamily: Archivo Black, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 36px
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-md:
    fontFamily: Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  label-caps:
    fontFamily: JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.22em
  nav-label:
    fontFamily: General Sans, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0.08em

rounded:
  none: 0px
  xs: 6px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 56px
  3xl: 72px
  section: 96px
  shell: 32px
  gutter: 24px

components:
  shell-header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.full}"
    typography: "{typography.nav-label}"
    padding: "{spacing.md} {spacing.lg}"
  nav-link:
    textColor: "{colors.text-muted}"
    activeTextColor: "{colors.text}"
    typography: "{typography.nav-label}"
  hero-wordmark:
    textColor: "{colors.text}"
    typography: "{typography.display-xxl}"
  section-kicker:
    textColor: "{colors.primary}"
    typography: "{typography.label-caps}"
  section-title:
    textColor: "{colors.text}"
    typography: "{typography.display-lg}"
  cta-primary:
    backgroundColor: "{colors.text}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.full}"
    typography: "{typography.nav-label}"
    padding: "{spacing.md} {spacing.lg}"
  cta-accent:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.full}"
    typography: "{typography.nav-label}"
    padding: "{spacing.md} {spacing.lg}"
  cta-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.full}"
    typography: "{typography.nav-label}"
    padding: "{spacing.md} {spacing.lg}"
  card-editorial:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  card-decision:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  card-cream:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border-strong}"
    rounded: "{rounded.sm}"
    typography: "{typography.body-md}"
    padding: "{spacing.md}"
  badge-meta:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.accent-warm}"
    borderColor: "{colors.border}"
    rounded: "{rounded.full}"
    typography: "{typography.label-caps}"
    padding: "{spacing.sm} {spacing.md}"
  footer-band:
    backgroundColor: "{colors.canvas-deep}"
    textColor: "{colors.text-muted}"
    borderColor: "{colors.border}"
    padding: "{spacing.2xl} {spacing.shell}"

  ex-pricing-tier:
    description: Ticket or pass card. Uses decision-card chrome with a visible price/action hierarchy.
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "{spacing.lg}"
  ex-pricing-tier-featured:
    description: Featured event or highest-priority ticket path.
    backgroundColor: "{colors.text}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-data-table-cell:
    description: Command center tables for source, event, and revenue reporting.
    headerTypography: "{typography.label-caps}"
    bodyTypography: "{typography.body-sm}"
    rowBorder: "{colors.border}"
    cellPadding: "{spacing.md}"
  ex-auth-form-card:
    description: Newsletter, partner, and lead capture forms.
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-modal-card:
    description: Confirmation, preview, and admin utility modals.
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border-strong}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-empty-state-card:
    description: Empty dashboard states or missing archive states.
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
  ex-toast:
    description: Low-noise confirmation feedback.
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
---

# Monolith Project

## Overview

Monolith is the parent system shell. It should feel precise, dark, editorial, and controlled rather than ornamental. The brand should read as a serious event platform: premium enough for sponsors and venues, direct enough for ticket buyers, and quiet enough to let individual series own their own color and atmosphere.

This file governs the non-series route family first:

- `/`
- `/schedule`
- `/lineup`
- `/about`
- `/partners`
- `/contact`
- `/archive`
- `/newsletter`
- `/tickets`
- `/events/:slug`

## Required Companion Standards

All image and video work must also follow [ASSET_PROTOCOL.md](./ASSET_PROTOCOL.md). Do not add low-resolution, muddy, over-compressed, stock-like, or purely atmospheric media to solve visual gaps. The Monolith system is dark by design, but every major page needs high-quality visual proof that the world is real, premium, and lived-in.

## Design Intent

The parent site is not a nightlife flyer. It is the operating system around the nights. It should establish trust, clarity, and structure. Series pages can be warmer, louder, or more seasonal, but the Monolith layer stays disciplined.

Priority corrections:

- Keep one typography truth across CSS, components, and docs.
- Use the same section title rhythm across home, schedule, lineup, archive, partners, and contact.
- Keep event detail and ticket pages practical: date, venue, arrival, price, checkout path, and final action.
- Reduce abrupt theme jumps unless the section is intentionally handing off to a series system.

## Color Rules

The core palette is near-black, warm off-white, and clay orange.

- Canvas is almost black. It should feel architectural, not blue-black or purple-black.
- Clay orange is the system signal for owned emphasis and urgent action.
- Cream is a relief plane. Use it sparingly for high-contrast utility sections, not as a second full theme.
- Borders should be warm and low-contrast by default. Strong borders are reserved for forms, active states, or conversion cards.

## Typography Rules

Use four voices only:

- General Sans for the parent hero, page titles, wordmark, and navigation.
- Archivo Black for secondary structural headlines that need mass.
- Inter for body, form, dashboard, and utility copy.
- JetBrains Mono for metadata, coordinates, labels, and analytics-style UI.

Do not introduce new display fonts at the parent layer. Series pages may have their own accent voice, but Monolith is the stabilizer.

## Layout Rules

The parent site follows a fixed-shell, modular-section model:

- Hero or scene opener.
- Featured campaign or event surface.
- Utility sections such as schedule, archive, roster, or partner pathways.
- Conversion footer or strip.

**Action Stacks & Link-in-Bio:**

- Avoid generic list links. Use visual action stacks where each routing node (tickets, music, gallery) is treated as a component card.
- Must support a specific `gallery` action type natively, integrating with tools like Pic-Time.
- Bio links and action stacks should utilize external or specific asset imagery (e.g., SoundCloud covers, specific photography) rather than generic brand fallback images, creating an immediate, high-fidelity visual hierarchy.

Event and ticket conversion pages follow a stricter funnel:

- Scene-setting hero with one primary action.
- Compact decision cards for date, arrival, entry, ticket path, and price.
- Proof section that explains why the event is worth acting on.
- Final action block so the user never needs to scroll back to convert.

## Component Rules

Use the tokenized components above as the source of truth.

- `shell-header` is the global frame. Keep it calmer than the campaign content below it.
- `cta-primary` is the highest-priority conversion action.
- `cta-accent` is for urgent Monolith-owned moments, not every button.
- `card-decision` is for ticket/event facts.
- `card-editorial` is for story, proof, lineup, and archive modules.
- `card-cream` is for rare relief and contrast.

## Responsive Rules

At mobile widths, prioritize scan order over visual symmetry.

- Hero wordmarks should scale down by breakpoint, not viewport math.
- Button labels must wrap or shorten cleanly.
- Decision cards can stack, but their action should remain visible without hunting.
- Navigation can collapse, but the primary CTA should remain reachable.

## Do's and Don'ts

### Do

- Use Monolith as the visual stabilizer for the full site.
- Keep headings large, spare, and aligned to a repeatable rhythm.
- Let clay orange act as a system signal, not a decorative wash.
- Use forms and ticket pages to reduce uncertainty.
- Keep roster, schedule, and archive cards in the same productized family.

### Don't

- Don't mix competing font definitions across token files.
- Don't let campaign sections invent unrelated radius, border, or CTA styles.
- Don't add decorative motifs to solve hierarchy. Use spacing, type, framing, and copy first.
- Don't overuse cream sections.
- Don't make ticket pages poetic at the expense of clear checkout decisions.
