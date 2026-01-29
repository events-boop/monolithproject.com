# Monolith UI Fix List

## 1. Top Navigation
- [x] **Simplify Menu**: Reduced to core items (Chasing SunSets, Untold Story, Radio, Events).
- [x] **Clean Visuals**: Implemented glassmorphism and removed visual clutter.
- [x] **Aesthetics**: Unified "Monolith Slab" styling for CTAs (silver border, premium shadow).

### **2. Strategic Priority: Structure & Flow** (CRITICAL)
- [x] **Define the First Scroll Experience** (S-TIER IMPLEMENTED)
    - *Action:* Created `RitualDashboard` component immediately below hero.
    - *Features:* Bento Grid layout, interactive "Next Ritual" card with zoom effect, "Latest Radio" and "Roster" quick links.
    - *Result:* Immediate value proposition and cinematic entry point.
- [x] **Refine Hero Headline Layout**
    - *Action:* Adjusted `StaggeredText` spacing and vertical rhythm in `HeroSection`.
    - *Result:* Removed "stacked" feel, "THE MONOLITH" and "PROJECT" now breathe.
### **3. Expansion: New Core Pages** (ARCHITECTURAL UPGRADE)
- [x] **Radio / The Archive** (`/radio`)
    - *Features:* "Now Playing" Widget, Filterable Mix Grid, "Netflix for Audio" layout.
- [x] **Series: Chasing Sun(Sets)** (`/chasing-sunsets`)
    - *Features:* Golden Hour gradient theme, "Monolith Slab" styled Ticket/RSVP buttons, animated sun element.
- [x] **The Untold Story** (`/story`)
    - *Features:* Editorial manifesto layout, "Become a Member" CTA with premium Monolith styling.

## **4. Refinements & Polish**
- [x] **Clean Visuals**: Remove small repeating symbols and micro-text.
- [x] **Typography**: Ensure consistency across new pages.
- [x] **Add More Depth Between Sections**
    - *Action:* Use large scale parallax imagery or deep gradient fades between white/black sections.
    - *Current:* `RitualDashboard` has top/bottom smooth gradients.

## 5. RSVP Button
- [x] **Rename**: Updated to "Join the Ritual" (Home) / "Become a Member" (Story).
- [x] **Style**: Applied "Monolith Slab" aesthetic (silver border, ring, shadow) for consistent high-end feel.

## 6. Hero Headline
- [x] **Iconography**: Implemented `MonolithSlabWaves` with silver gradient, full container fill, and physics-based interaction.
- [x] **Contrast**: Added `StaggeredText` and adjusted gradients for visibility.

## 7. Hero Background
- [x] **Contrast**: Added top/bottom gradient masks to improve text readability over video.

## 8. Additional Items (Inferred from Workspace)
- [x] **Audio Player**: Refine persistent player (`AudioPlayer.tsx`).
- [x] **Ticker**: Optimize scrolling ticker (`Ticker.tsx`).
- [x] **Artists Section**: Polish grid and hover states (`ArtistsSection.tsx`).

## 9. Navigation & Layout Verification
- [x] **Radio**: Verified "Live Transmission" and "Archive" grid layout/padding.
- [x] **Artists**: Confirmed dynamic routing for `/artists/:id`.
- [x] **Connectivity**: Ensured `/chasing-sunsets`, `/story`, and `/sponsors` are fully accessible.
- [x] **Sponsors**: Verified "Partner Access" lock screen and content unlocking.
