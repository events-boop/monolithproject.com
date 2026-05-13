---
version: v2
name: Chasing Sun(Sets)
description: The open-air Chasing Sun(Sets) design system. Warm, lakefront, golden-hour, premium, and conversion-focused without becoming beach-generic or cluttered.

colors:
  canvas: "#0B0A09"
  canvas-deep: "#050403"
  surface: "#18110D"
  surface-warm: "#2C1810"
  surface-gold: "#3A2816"
  cream: "#FBF5ED"
  text: "#F8F2E8"
  text-muted: "#C9B08C"
  text-dim: "#8E7358"
  primary: "#E8B86D"
  primary-bright: "#FFD28A"
  accent-deep: "#C2703E"
  lake: "#193B3B"
  border: "#5C4331"
  border-gold: "#A87B3F"

typography:
  display-xxl:
    fontFamily: Archivo Black, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 96px
    fontWeight: 400
    lineHeight: 0.82
    letterSpacing: -0.04em
  display-xl:
    fontFamily: Archivo Black, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 88px
    fontWeight: 400
    lineHeight: 0.84
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Archivo Black, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 58px
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: -0.03em
  display-accent:
    fontFamily: Instrument Serif, Georgia, serif
    fontSize: 56px
    fontWeight: 400
    lineHeight: 0.92
    letterSpacing: -0.02em
  title-md:
    fontFamily: Archivo Black, Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 36px
    fontWeight: 400
    lineHeight: 0.94
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.58
    letterSpacing: 0
  body-md:
    fontFamily: Inter, Helvetica Neue, Arial, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
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
  button-label:
    fontFamily: JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace
    fontSize: 12px
    fontWeight: 700
    lineHeight: 1
    letterSpacing: 0.12em

rounded:
  none: 0px
  xs: 6px
  sm: 8px
  md: 18px
  lg: 28px
  xl: 36px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  3xl: 84px
  section: 104px
  linkbio: 20px

components:
  hero-band:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
    gradient: "radial warm gold over black lakefront base"
    rounded: "{rounded.xl}"
    padding: "{spacing.2xl}"
  linkbio-shell:
    backgroundColor: "{colors.canvas-deep}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.xl}"
    padding: "{spacing.linkbio}"
  section-kicker:
    textColor: "{colors.primary}"
    typography: "{typography.label-caps}"
  section-title:
    textColor: "{colors.text}"
    typography: "{typography.display-lg}"
  poetic-line:
    textColor: "{colors.primary-bright}"
    typography: "{typography.display-accent}"
  cta-primary:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.full}"
    typography: "{typography.button-label}"
    padding: "{spacing.md} {spacing.lg}"
  cta-gold:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.full}"
    typography: "{typography.button-label}"
    padding: "{spacing.md} {spacing.lg}"
  cta-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.full}"
    typography: "{typography.button-label}"
    padding: "{spacing.md} {spacing.lg}"
  event-card:
    backgroundColor: "{colors.surface-warm}"
    textColor: "{colors.text}"
    borderColor: "{colors.border-gold}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  link-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  link-card-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  proof-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  cream-panel:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  media-frame:
    backgroundColor: "{colors.surface-gold}"
    borderColor: "{colors.border-gold}"
    rounded: "{rounded.lg}"
    padding: "{spacing.sm}"
  signal-badge:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    borderColor: "{colors.border}"
    rounded: "{rounded.sm}"
    typography: "{typography.label-caps}"
    padding: "{spacing.sm} {spacing.md}"

  ex-pricing-tier:
    description: Date-specific ticket card for July 4, August 22, or September 19.
    backgroundColor: "{colors.surface-warm}"
    textColor: "{colors.text}"
    borderColor: "{colors.border-gold}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  ex-pricing-tier-featured:
    description: Featured next chapter card, usually July 4 or the most urgent on-sale date.
    backgroundColor: "{colors.primary}"
    textColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-product-selector:
    description: Event interest selector for First Access, VIP, partner, gallery, recap, or sound.
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
  ex-cart-drawer:
    description: Lightweight ticket path summary before sending users to Posh.
    backgroundColor: "{colors.canvas-deep}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  ex-app-shell-row:
    description: Dashboard row for source, button, or event performance in the command center.
    backgroundColor: "{colors.surface}"
    activeIndicator: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md}"
  ex-data-table-cell:
    description: Funnel dashboard cells for visits, signups, clicks, purchases, revenue, and cost metrics.
    headerTypography: "{typography.label-caps}"
    bodyTypography: "{typography.body-sm}"
    rowBorder: "{colors.border}"
    cellPadding: "{spacing.md}"
  ex-auth-form-card:
    description: First Access, VIP, ambassador, or partner lead capture form.
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border-gold}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-modal-card:
    description: Confirmation state after signup or lead submit.
    backgroundColor: "{colors.surface-warm}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  ex-empty-state-card:
    description: Empty gallery, no lineup yet, or ticket links coming soon state.
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.md}"
    padding: "{spacing.xl}"
  ex-toast:
    description: Confirmation toast for tracked click or saved lead.
    backgroundColor: "{colors.surface-gold}"
    textColor: "{colors.text}"
    borderColor: "{colors.border-gold}"
    rounded: "{rounded.sm}"
    padding: "{spacing.md} {spacing.lg}"
---

# Chasing Sun(Sets)

## Overview

Chasing Sun(Sets) is the open-air arm of Monolith. It should feel warmer, lighter, and more breathable than the parent system, but never soft, generic, or beachy. The target is golden hour with discipline: sunlit, social, premium, lakefront, and still rooted in house music credibility.

This file governs:

- `/sunsets`
- `/chasing-sunsets`
- `/chasing-sunsets/:season`
- date-specific Chasing Sun(Sets) ticket and lead flows

## Design Intent

The page should work as a modern mini hub: Instagram bio link, ad landing page, QR destination, ticket hub, recap hub, and first-access funnel. It is allowed to be more atmospheric than the parent Monolith shell, but it still needs direct conversion paths.

Priority hierarchy:

1. Join First Access / Join the Chat.
2. 2026 Schedule / Tickets.
3. VIP / Tables.
4. Watch Recap.
5. Follow the Sound.
6. Gallery.
7. Partner Inquiry.

## Color Rules

The system is built around auburn depth, sun gold accents, lake darkness, and cream relief.

- Gold is the active signal. Use it for next chapters, button focus, date emphasis, and section markers.
- Deep brown and black carry the after-sunset premium feel.
- Cream creates air and conversion clarity. Use it for primary CTAs and occasional relief panels.
- Lake green should be a quiet undertone, not a dominant theme.
- Avoid purple, cyan, neon blue, or unrelated festival colors.

## Typography Rules

Use four voices only:

- Archivo Black for structural Chasing Sun(Sets) headlines.
- Instrument Serif for poetic lines and seasonal moments.
- Inter for body and explanatory copy.
- JetBrains Mono for signal labels, dates, metadata, dashboard, and button microcopy.

The serif is seasoning. Do not make the full page soft or editorial by overusing it.

## Layout Rules

The route should feel like a season deck and a conversion hub at the same time.

Core page architecture:

- Hero with name, one-liner, and primary first-access CTA.
- Next chapter or schedule surface.
- Link-in-bio action stack.
- Experience proof using recap, gallery, sound, and crowd imagery.
- VIP / partner / ambassador lead path.
- FAQ or confidence block.
- Final CTA.

For `/sunsets`, keep the structure tighter:

- Brand/title.
- First Access as the dominant button.
- Schedule/Tickets directly underneath.
- Secondary links grouped by intent.
- Confirmation copy: "You're in. Welcome to the Chasing Sun(Sets) circle. Watch the sun. Stay for the (sets)."

## Component Rules

Use the tokenized components above as the source of truth.

- `linkbio-shell` frames the social landing page. It can be compact, but not cramped.
- `link-card-primary` is reserved for Join First Access / Join the Chat.
- `event-card` is for July 4, August 22, and September 19 ticket paths.
- `media-frame` should hold real recap, gallery, lakefront, skyline, crowd, or flyer assets.
- `cream-panel` should appear only when the page needs a strong clarity break.
- `signal-badge` is for Lakefront, House, Chicago, First Access, VIP, and similar metadata.

## Funnel Rules

The user should always understand the next click.

- First Access sends to Laylo.
- Tickets send to Posh.
- VIP / Tables sends to Fillout or a native lead form.
- Watch Recap sends to YouTube.
- Follow the Sound sends to SoundCloud.
- Gallery sends to Pic-Time.
- Partner Inquiry sends to Fillout or a native lead form.

**Action Stack & Link-in-Bio Specifics:**
Link stacks must not be text-only lists. They must support a `gallery` component type pointing to Pic-Time. They must use dynamic external asset URLs (like SoundCloud artworks or gallery thumbnails) instead of fallback brand assets to establish immediate visual hierarchy for the cards.

Every link click should be trackable with button name, destination URL, page path, event slug when relevant, session id, and UTM fields.

## Responsive Rules

Mobile is the primary viewport because this is a link-in-bio surface.

- The primary CTA must be visible without feeling buried under decorative copy.
- Text inside buttons must fit at 320px width.
- Date cards should not require horizontal scrolling.
- Background glows should not reduce contrast.
- The page can feel cinematic, but the action stack must stay obvious.

## Do's and Don'ts

### Do

- Let warmth and cream space carry the open-air feeling.
- Use gold as the active signal everywhere inside the series.
- Keep imagery grounded in lakefront, skyline, crowd, sound, sunset, and real event proof.
- Make the route read as a season system, not a single flyer.
- Keep CTA copy direct and repeated at natural decision points.

### Don't

- Don't let the page collapse into generic dark luxury blocks.
- Don't overload the page with isolated card styles or one-off borders.
- Don't use decorative glows where content clarity is needed.
- Don't make the link-in-bio page send users to the home page before they see the CTAs.
- Don't put a long form on the first screen if Laylo is the primary capture layer.
