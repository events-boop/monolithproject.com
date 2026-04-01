# AI Competitor Research Framework

Use this framework when Claude, Gemini, or any other model is doing copy or competitor research for Monolith.

The goal is not to have AI write final copy.

The goal is to make AI useful for:

- market pattern detection
- category language analysis
- page teardown
- offer mapping
- trust-signal analysis
- gap identification

## 1. Research Objective

The research should answer:

- What language dominates event and nightlife websites in this category?
- What feels overused or weak?
- What structures convert well?
- What trust signals show up consistently?
- Where can Monolith be more distinct?
- What copy territory is open?

## 2. Research Categories

Study competitors in four groups.

### Group A: Direct Competitors

Chicago or similar-market event brands, nightlife collectives, recurring music series, boutique promoter brands.

### Group B: Adjacent Competitors

Festival brands, hospitality-driven event brands, experiential nightlife brands, ticket-driven event companies.

### Group C: Premium Inspiration

Luxury hospitality, member clubs, fashion/editorial brands, boutique travel or cultural brands with strong language systems.

### Group D: Anti-Examples

Sites with generic hype, weak structure, low-trust copy, cluttered ticket flows, or vague positioning.

## 3. Competitor Selection Template

Capture 8 to 15 examples total.

For each one:

- Brand:
- URL:
- Market:
- Category:
- Why this site matters:
- What page to analyze:
- Direct / adjacent / inspiration / anti-example:

## 4. Data Capture Template

Copy this block for each competitor.

### Competitor Card

- Brand:
- URL:
- Category:
- Market:
- Audience:
- Primary offer:
- Primary CTA:
- First impression in one sentence:

### Messaging Review

- H1:
- Subhead:
- Tone:
- Best line:
- Weakest line:
- Repeated phrases:
- Most obvious category cliches:
- Trust signals used:
- Urgency signals used:
- Exclusivity signals used:
- Operational clarity level:

### Structure Review

- Above-the-fold structure:
- Proof placement:
- Social proof placement:
- FAQ / logistics placement:
- Ticket flow clarity:
- Mobile clarity:

### Strategic Read

- What this brand is really selling:
- What emotional promise it makes:
- What it implies about the audience:
- What Monolith should learn from it:
- What Monolith should avoid from it:

### Scorecard

Score 1 to 5.

- Distinct positioning:
- Copy clarity:
- Atmosphere:
- Trust:
- Conversion clarity:
- Operational clarity:
- Overall coherence:

## 5. Pattern Extraction Template

After reviewing all competitors, force AI to summarize patterns in this exact structure.

### Category Patterns

- Most common headline pattern:
- Most common subhead pattern:
- Most common CTA pattern:
- Most common trust pattern:
- Most common urgency pattern:
- Most common proof pattern:

### Overused Language

List 10 to 20 phrases or tropes that should be treated as weak or generic.

### Strong Moves

List the structures or language moves that genuinely work.

### White Space

List copy territory the category is not owning well.

## 6. Monolith Gap Analysis Template

Ask the model to compare Monolith against the category in this format.

### Monolith vs Category

- Where Monolith already feels stronger:
- Where Monolith feels generic:
- Where Monolith is visually stronger than its copy:
- Where Monolith lacks proof:
- Where Monolith lacks clarity:
- Where Monolith can own a sharper narrative:

### Immediate Opportunities

- Homepage
- Ticket flow
- Series language
- Partner language
- Newsletter / retention language
- FAQ / operations language

## 7. AI Prompt Pack

Use these prompts as starting points.

## Prompt 1: Competitor Discovery

```text
You are doing structured competitor research for The Monolith Project, a Chicago-rooted music and event brand.

Your task:
1. Build a list of direct, adjacent, aspirational, and anti-example competitors.
2. Prioritize brands with strong event, nightlife, hospitality, editorial, or cultural positioning.
3. Return 12 examples max.

For each example include:
- Brand
- URL
- Category
- Why it is relevant
- Which page should be analyzed first

Do not write copy. Do not summarize vaguely. Focus on useful research targets.
```

## Prompt 2: Page Teardown

```text
Analyze this competitor page as if you are preparing a messaging strategy for The Monolith Project.

Return your answer in this structure only:
- Brand
- URL
- Audience
- What the page is trying to do
- H1
- Subhead
- Primary CTA
- Tone analysis
- Trust signals
- Exclusivity signals
- Operational clarity
- Strongest copy move
- Weakest copy move
- Category cliches used
- What Monolith should learn
- What Monolith should avoid

Be specific. Quote only short phrases when necessary.
```

## Prompt 3: Language Clustering

```text
You are analyzing a set of competitor event websites for copy patterns.

Based on the examples provided, cluster the language into:
- luxury language
- nightlife language
- festival language
- hospitality language
- editorial language
- generic hype language

For each cluster:
- define the pattern
- list repeated phrases
- explain why it works or fails
- say whether Monolith should borrow, refine, or reject it
```

## Prompt 4: White Space Analysis

```text
Based on the competitor set, identify the copy white space Monolith can own.

Return:
- 5 open narrative territories
- 5 overused category moves to avoid
- 5 strategic opportunities for Monolith's homepage
- 5 opportunities for event pages
- 5 opportunities for partner / booking pages

Keep this grounded in observed patterns, not abstract branding theory.
```

## Prompt 5: Monolith Brief Synthesis

```text
You are synthesizing competitor research into a brief for a copy rewrite of The Monolith Project.

Return the brief in this format:
- Category summary
- What the best competitors do well
- What the category gets wrong
- What Monolith should sound like
- What Monolith should never sound like
- Recommended voice attributes
- Recommended headline strategies
- Recommended CTA strategies
- Recommended proof strategies
- Page-by-page recommendations for:
  - Home
  - Tickets
  - Chasing Sun(Sets)
  - Untold Story
  - About
  - Partners
  - Booking
  - Newsletter
```

## 8. Required Research Output Format

No matter which model is used, request this final structure:

### Deliverable A: Competitor Table

One row per brand with:

- brand
- category
- URL
- positioning
- tone
- strongest move
- weakest move

### Deliverable B: Pattern Summary

- headline patterns
- CTA patterns
- proof patterns
- urgency patterns
- trust patterns

### Deliverable C: Language Bank

- phrases to borrow
- phrases to refine
- phrases to ban

### Deliverable D: Monolith Recommendations

- homepage
- event pages
- series pages
- partner pages
- newsletter / retention

## 9. QA Rules For AI Research

Reject any research output that:

- sounds generic
- does not name specific competitors
- gives abstract branding advice without examples
- confuses visual design with copy strategy
- recommends copy without explaining the market pattern behind it

Accept research only when it is:

- specific
- comparative
- page-aware
- pattern-based
- actionable

## 10. Human Synthesis Step

Before any copy rewrite starts, a human should condense the research into:

- 3 to 5 narrative decisions
- 3 to 5 voice decisions
- 3 to 5 structural decisions
- 10 banned phrases
- 10 preferred language moves

That synthesis becomes the real source of truth.

## 11. Recommended Workflow

Use this sequence:

1. Run competitor discovery.
2. Select 8 to 15 targets.
3. Run page teardowns.
4. Run pattern extraction.
5. Run Monolith gap analysis.
6. Convert findings into the Monolith copy system.
7. Rewrite pages using the page brief template.

## 12. Final Question Set

Ask this at the end of every research cycle:

- What does the category overstate?
- What does the category underspecify?
- What does Monolith already do visually that the copy does not yet support?
- What can Monolith say with authority that others cannot?
- What should the user understand in the first 10 seconds?
