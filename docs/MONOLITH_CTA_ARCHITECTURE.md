# Monolith CTA Conversion Architecture

The Monolith Project CTA strategy transitions from a fragmented collection of links to a centralized, drop-based ecosystem. This framework prioritizes psychological momentum, tool-specific efficiency, and a rigid hierarchy of calls-to-action to maximize conversion and long-term fan loyalty.

## The Triple-Stack Model

| Platform | Ownership | Primary Mechanism | Data Output |
| :--- | :--- | :--- | :--- |
| **Laylo** | **Intent Capture** | 1-Click RSVP / SMS Drops | Phone, Email, DM Permission |
| **Fillout** | **Qualification** | Multi-Step Logic Forms | Lead Score, VIP Preferences |
| **Posh** | **Transaction** | Tiered Ticketing / Referral | Final Sale, Order Value |

---

## Strategic CTA Hierarchy per Page

### **1. Homepage**
*   **Primary**: "Join Presale" or "Get Early Access" (**Laylo**)
*   **Secondary**: "View Events" (Scroll to Schedule)
*   **Fallback**: "Explore The Series" (Navigation)

### **2. Event Experience (Dynamic States)**

| Event State | Primary CTA (Tool) | Secondary CTA (Tool) | Fallback/Backup (Tool) |
| :--- | :--- | :--- | :--- |
| **Upcoming** | **Unlock Presale Access** (Laylo) | Join Waitlist (Laylo) | VIP / Tables (Fillout) |
| **On Sale** | **Get Tickets** (Posh) | VIP / Tables (Fillout) | Join SMS Updates (Laylo) |
| **Low Inventory** | **Claim Last Tickets** (Posh) | Final VIP Inquiry (Fillout) | SMS Re-stock Alert (Laylo) |
| **Sold Out** | **Join Waitlist** (Laylo) | VIP Inquiry (Fillout) | Next Drop Access (Laylo) |
| **Post-Event** | **Next Signal Access** (Laylo) | Watch Recap (Gallery) | Join The List (Laylo) |

### **3. VIP / Concierge Pages**
*   **Primary**: "Request VIP Access" (**Fillout**)
*   **Secondary**: "Talk To Concierge" (Direct SMS/WhatsApp)
*   **Trust Signal**: "An Elevated Signal Experience" (Section Header)

### **4. Series & Archive Pages**
*   **Primary**: "Join The List" (**Laylo**)
*   **Secondary**: "See Upcoming Dates" (Schedule)

---

## Conversion Section Anatomy

Every conversion block must consist of these four layers:

1.  **Narrative Header**: benefit-driven (e.g., "Don't Just Watch. Be Part of the Drop.")
2.  **Actionable Button**: high-contrast, verb-led (Get, Unlock, Join, Claim).
3.  **Urgency Microcopy**: positioned beneath the button (e.g., "Last drop sold out in 4 minutes").
4.  **Trust Signals**: positioned in the footer/background (PCI compliance, Official Partner logos).

---

## Implementation Rules

- **Singular Focus**: One primary CTA per page/section. No pages with competing asks.
- **Mobile First**: Primary actions must be anchored or repeated every 2-3 content sections.
- **State-Driven**: Components must dynamically swap CTA logic based on the `ScheduledEvent.status` and `eventWindowStatus`.

---

## Rollout Strategy

1.  **Phase 1 (Now)**: Standardize all `HeroSection` and `FeaturedCampaigns` buttons to match the state-driven copy rules.
2.  **Phase 2 (Next)**: Implement the custom `ConversionCTA` component that abstracts tool ownership (Laylo/Fillout/Posh).
3.  **Phase 3 (Later)**: Deploy first-party UTM cookie tracking to ensure seamless attribution from source to sale.
