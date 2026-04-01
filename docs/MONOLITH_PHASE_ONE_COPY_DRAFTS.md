# Monolith Phase One Copy Drafts

This document turns the strategy into first-pass copy that can be implemented against the current page structures.

It is not the final voice pass.

It is the first usable draft for:

- Home
- Tickets

These drafts are written to fit the current component architecture with minimal structural change.

## 1. Home Draft

Current implementation reference:

- [Home.tsx](/Users/starkindustries/Downloads/monolith-project%20website/client/src/pages/Home.tsx)
- [HeroSection.tsx](/Users/starkindustries/Downloads/monolith-project%20website/client/src/components/HeroSection.tsx)

## Home Strategy

The homepage should do this within the first screen:

1. Define what Monolith is.
2. Show the current live or next event signal.
3. Clarify the four-part brand house.
4. Make the world feel real, not decorative.
5. Offer one conversion path and one exploration path.

## Home SEO Draft

- Title: `Chicago Music Events, Series, and Cultural Nights | The Monolith Project`
- Meta description: `The Monolith Project curates Chicago music events, recurring series, and a living archive built around curation, atmosphere, and return-worthy rooms.`

## Home Hero Draft

### Eyebrow Options

- Chicago Music Project
- Chicago-Rooted Event World
- Music-First Cultural Project

Recommended:

`Chicago-Rooted Event World`

### Headline Direction

The current hero uses a branded “MONOLITH PROJECT” title plus a three-line descriptor underneath. Keep that structure.

### H1 Support Copy

Current:

- Immersive
- music events
- with a world around them.

Recommended replacement:

- Recurring
- music nights
- with taste, atmosphere, and memory.

Alternate:

- Chicago
- music rooms
- built to return to.

### Hero Subhead

Current:

`Monolith builds Chicago nights, recurring series, and artist-led lineups people come back to.`

Recommended:

`Monolith curates Chicago nights, recurring series, and artist-led rooms for people who care what the night feels like from the first track to the last hour.`

Shorter alternate:

`Monolith curates Chicago music nights and recurring series with the kind of room people actually want to return to.`

Architecture-forward alternate:

`Monolith holds together four connected expressions: The Monolith Project, Chasing Sun(Sets), the Chasing Sun(Sets) Radio Show, and Untold Story. Together they shape the room, the sound, and the memory around it.`

### Proof Chips

Current:

- Chicago rooted
- Music first
- Built to return to

Recommended:

- Chicago-rooted
- Music-first
- Room-led

Alternate:

- Curated rooms
- Return-worthy nights
- Built in Chicago

### Event Meta Line

Use this template in the event strip beneath the countdown:

`[Headline] — [Date] — [Venue / location]`

If tickets are live:

`[Headline] — [Date] — [Venue / location] — Tickets live`

If tickets are not live:

`[Headline] — [Date] — [Venue / location] — Schedule now live`

### Primary CTA

Keep:

- `Get Tickets`

### Secondary CTA

Recommended:

- `View Schedule`

Fallback when no live ticket window:

- `Open Insights`

### World Links

Keep the three-link structure, but frame them as exploration of worlds inside Monolith:

- `Chasing Sun(Sets)`
- `Untold Story`
- `Insights`

## Home Brand Clarity Block

Current implementation:

- Kicker: `How Monolith Works`
- H2: `One project. A few clear parts.`
- Body paragraph
- Three cards

### Kicker

Recommended:

`How The Project Holds Together`

### H2

Recommended:

`One cultural project. A few clear parts.`

Alternate:

`A music project with more than one surface.`

### Body Copy

Recommended:

`Monolith gets stronger when the structure is visible. The nights matter, but so do the series, the archive, and the people who keep showing up. This is a project built to hold a room now and mean more over time.`

Architecture-forward alternate:

`Monolith works because the parts are distinct and connected. The Monolith Project sets the standard. Chasing Sun(Sets) carries the warmer, open-air side. The Radio Show extends the taste behind it. Untold Story carries the project later into the night.`

## Home Summary Cards

These map to the existing three pillars in `companySummaryPillars`.

### Card 1

- Label: `Series`
- Title: `Events`
- Description: `Flagship nights, recurring chapters, and the next dates that define the live side of Monolith.`
- CTA: `View Schedule`

### Card 2

- Label: `Signals`
- Title: `Radio & Editorial`
- Description: `The Chasing Sun(Sets) Radio Show, the archive, and the signals that make the taste behind the room easier to hear and trust.`
- CTA: `Open Radio`

### Card 3

- Label: `Network`
- Title: `People In The Room`
- Description: `Artists, venue partners, collaborators, and returning guests connected by the same project.`
- CTA: `Meet The Network`

## Home Section Framing

Use these as guidance for adjacent component copy or section intros if needed later.

### Movement Section

- Intent: explain why Monolith exists beyond event promotion
- Tone: brand clarity
- Message anchor: `A project built around curation, atmosphere, and return-worthy rooms.`

### Chapters / Events Section

- Intent: distinguish series from one-off event marketing
- Message anchor: `Different chapters. One standard.`

### Roster Section

- Intent: frame artists as part of curation logic, not a random list
- Message anchor: `Artists selected for the room, not just the poster.`

### Archive Section

- Intent: show memory and proof
- Message anchor: `The archive makes the brand legible.`

### Sound / Radio Section

- Intent: extend taste beyond the event night
- Message anchor: `The Chasing Sun(Sets) Radio Show lets the world stay active between nights.`

### Past Events Section

- Intent: proof of recurrence
- Message anchor: `The project is easier to trust when the record is visible.`

### Feed / Social Section

- Intent: show live pulse without making the brand depend on social content
- Message anchor: `The room travels, but the project stays coherent.`

### Funnel / Inner Circle Section

- Intent: convert attention into retention
- Message anchor: `Stay close to the next drop, the next room, and the next chapter.`

## Home Microcopy Options

### Event Banner

- `Tickets live for the current featured event`
- `Now live: the next Monolith room`

### Ticket Ticker

- `Get Tickets`
- `View Schedule`
- `Enter The Next Room`

### Footer / Utility Link Direction

- `Inner Circle`
- `Schedule`
- `Archive`
- `Partner Access`

## 2. Tickets Draft

Current implementation reference:

- [Tickets.tsx](/Users/starkindustries/Downloads/monolith-project%20website/client/src/pages/Tickets.tsx)

## Tickets Strategy

The tickets page should feel like a confident handoff from event desire to purchase confidence.

It should not read like a generic sales page.

It should answer:

- what the featured night is
- why it matters
- what the ticket action is
- what the user needs to know before buying

## Tickets SEO Draft

- Title: `Tickets and Event Access | The Monolith Project`
- Meta description: `Secure access to the next Monolith Project event. View the featured night, venue details, and ticket information before doors open.`

## Tickets Header Draft

### Eyebrow

Use the live event subtitle or series eyebrow if available.

Fallback:

`Featured Access`

### H1 Options

Current:

`GET TICKETS`

Recommended if keeping all-caps utility tone:

`TICKETS & ACCESS`

Alternate if you want more event framing:

`ENTER THE NEXT ROOM`

Recommendation:

Keep `GET TICKETS` if conversion clarity is the highest priority.

### Support Line

Current:

`Secure your spot. Limited capacity at every show.`

Recommended:

`Choose your way in. Every Monolith room runs on limited capacity, clear timing, and a crowd that gets there on purpose.`

Shorter alternate:

`Secure your place in the next room. Capacity stays limited by design.`

### Urgency Line

Current:

`Tickets selling fast — Limited availability`

Recommended:

`Limited capacity — once this room fills, it moves`

Alternate:

`Capacity stays tight — book before the room closes out`

## Featured Event Module Draft

This module should frame the featured event like editorial hospitality.

### Eyebrow Chip

Use the series / subtitle already present.

### Featured Event Heading

Keep the dynamic event headline.

### Description Intro

If `featuredEvent.description` exists, consider preceding it with a short intro line:

`The next featured room:`

### Context Line

Add or support with:

`A Monolith night built around sound, setting, and who shows up for both.`

### Date / Time / Venue / Age Labels

Current labels are good and should stay utilitarian:

- Date
- Doors
- Venue
- Age

### Supporting Logistics Tone

Use short confidence-building lines:

- `Doors open on time. Early arrival changes the pace of the room.`
- `Valid government-issued ID required for entry.`
- `Advance purchase is recommended when tickets are live.`

## Ticket Tier Section Draft

Important note:

The current ticket tiers appear partly illustrative rather than event-fed. Treat this section carefully until product truth is confirmed.

If the tier structure stays, write it to feel cleaner and more credible.

### Section Heading

Current:

`Choose Your Access`

Recommended:

`Choose Your Way In`

Alternate:

`Access Options`

### Section Intro

Add:

`Every tier gets you into the room. The difference is how early, how directly, and how elevated the entry feels.`

## Ticket Tier Copy Direction

### Early Bird

- Name: `Early Bird`
- Description: `Limited first-release access for guests who move early.`

### General Admission

- Name: `General Admission`
- Description: `Standard entry to the full Monolith night.`

### VIP Experience

- Name: `VIP Experience`
- Description: `Priority arrival and a more elevated way to move through the night.`

## Ticket Terms Copy

Current line is too compressed and generic:

`All tickets are non-refundable. By purchasing, you agree to our terms and conditions. Elevated nightlife attire required.`

Recommended rewrite:

`All ticket sales are final. Entry is subject to venue rules and valid ID requirements. Dress with the room in mind and plan to arrive early.`

Alternate:

`Tickets are non-refundable. Valid ID is required at entry. The room moves best when guests arrive early and dress with intention.`

## Final Conversion Block

Current:

`Ready? All ticket tiers are available on Posh.`

Recommended:

`When you’re ready, complete checkout through our live ticket link.`

Stronger alternate:

`If this is your room, move now. Checkout stays simple from here.`

### Button Copy

Keep:

- `Buy Tickets`

Alternate if needed:

- `Open Ticket Link`

## Tickets FAQ / Confidence Layer

If this page gets expanded later, add a short confidence strip with:

- `Mobile tickets accepted`
- `Valid government-issued ID required`
- `Doors and entry details on the event page`
- `Table or partner questions can route through contact`

## 3. Implementation Notes

These drafts were written to match current structure, not replace it.

### Home

Minimal implementation would likely touch:

- [HeroSection.tsx](/Users/starkindustries/Downloads/monolith-project%20website/client/src/components/HeroSection.tsx)
- [Home.tsx](/Users/starkindustries/Downloads/monolith-project%20website/client/src/pages/Home.tsx)
- possibly [VisitorContextPanel.tsx](/Users/starkindustries/Downloads/monolith-project%20website/client/src/components/VisitorContextPanel.tsx)

### Tickets

Minimal implementation would likely touch:

- [Tickets.tsx](/Users/starkindustries/Downloads/monolith-project%20website/client/src/pages/Tickets.tsx)

## 4. Next Draft Candidates

After Home and Tickets:

1. About
2. Chasing Sun(Sets)
3. Untold Story
4. Partners
5. Newsletter
