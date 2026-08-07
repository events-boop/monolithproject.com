// Pure data module — no client-code imports. Build scripts (prerender,
// sitemap sync) import this file directly, so it must stay dependency-free.
export interface InsightSection {
  title: string;
  paragraphs: string[];
}

export interface InsightRelatedLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface InsightEntry {
  slug: string;
  title: string;
  category: string;
  displayDate: string;
  datePublished: string;
  readTime: string;
  summary: string;
  deck: string;
  image: string;
  accent: "monolith" | "sunsets" | "radio" | "story";
  tags: string[];
  relatedLinks: InsightRelatedLink[];
  sections: InsightSection[];
}

export const insightEntries: InsightEntry[] = [
  {
    slug: "recap-sunsets-i-july-4-castaways",
    title: "SUN(SETS) I, on the record: July 4 at Castaways",
    category: "Event Recap",
    displayDate: "July 16, 2026",
    datePublished: "2026-07-16",
    readTime: "5 min read",
    summary:
      "The recap of SUN(SETS) I — July 4, 2026 at Castaways Beach Club on North Avenue Beach, Chicago. Autograf, Kiko Franco, and a ten-artist bill carried the first chapter of the lakefront season from noon to the last light.",
    deck: "Chapter One had one job: prove the lakefront ritual was real. Ten hours on North Avenue Beach later, the answer is in the archive.",
    image: "/images/sunsets-hero-beach.jpg",
    accent: "sunsets",
    tags: [
      "Event Recap",
      "Chasing Sun(Sets)",
      "Autograf",
      "Kiko Franco",
      "Castaways",
    ],
    relatedLinks: [
      { label: "Watch The Recap", href: "/go/media/sunsets-recap", external: true },
      { label: "Open The Gallery", href: "/go/gallery/chasing-sunsets", external: true },
      { label: "Hear The Sets", href: "/go/media/sunsets-soundcloud", external: true },
      { label: "Join The Lake List", href: "/go/lakelist" },
    ],
    sections: [
      {
        title: "What Chapter One had to prove",
        paragraphs: [
          "Chasing Sun(Sets) came home to the lake on July 4. Not as a holiday party — as a claim: that Chicago's lakefront deserves a house music ritual of its own, built around golden hour instead of a headline slot. Castaways Beach Club on North Avenue Beach held that claim for ten hours, from noon doors to the last set after sundown, and 2,800 people held it with us — through the heat, through a pass of rain, to the last light.",
          "A first chapter carries a different weight than a one-off event. Everything about the day — the pacing, the bill, the way the room filled — was designed to be repeatable. That was the test. A great party happens once. A ritual has to make you certain there will be a next one.",
        ],
      },
      {
        title: "Ten artists, one arc",
        paragraphs: [
          "Autograf and Kiko Franco anchored the bill, and around them the day belonged to the wider room: Amari, Eliana, Gianni Blu, Frank Bono, Erik The DJ, Jerome, Colin, and Nomar. Ten artists across ten hours is not a festival flex — it is how an open-air chapter has to move. People arrive in daylight, settle in, find each other. The music's job in the early hours is patience; its job at golden hour is release.",
          "That is also why this bill mattered beyond the two names at the top. The day proved the room can hold Chicago's own selectors next to touring acts without a seam. The standard is the same at 1 PM as it is at 8: rhythm first, clutter never.",
        ],
      },
      {
        title: "Golden hour is the headliner",
        paragraphs: [
          "The format truth of SUN(SETS) is that the sunset is the real headline slot, and everyone on the bill is playing toward it. Lake Michigan behind the decks, the light dropping through gold into dusk — the room's clock is the sky. No lighting rig can fake the moment the whole beach turns west.",
          "That is the difference between an event that uses a beautiful setting and one that is built around it. Chapter One was built around it, and the room understood: the day peaked exactly when the lake said it should.",
        ],
      },
      {
        title: "The record is open",
        paragraphs: [
          "The archive of Chapter One is live: the recap film, the full photo gallery, and the sets. If you were in the room, this is your record too — the project collects crowd footage, booth clips, and portraits through the Add To The Record channel on the Sun(Sets) page, and selected media enters the official archive with credit.",
          "This journal entry is the written half of that record. The gallery holds what it looked like. This holds why it worked.",
        ],
      },
      {
        title: "Chapter Two: August 22",
        paragraphs: [
          "The season is three dates on one lake. Chapter One is in the archive. Chapter Two lands August 22 at Castaways — tickets are live, with the artist reveal still to come — and Chapter Three closes the season on September 19 with Joezi x Massuma (UK). Every release lands here first — lineup, tickets, and the moments between chapters.",
          "If July 4 proved the ritual is real, August 22 is where it becomes a habit. See you at golden hour.",
        ],
      },
    ],
  },
  {
    slug: "artist-feature-ewerseen",
    title: "Why EWERSEEN fits the Chasing Sun(Sets) room",
    category: "Artist Feature",
    displayDate: "January 18, 2026",
    datePublished: "2026-01-18",
    readTime: "4 min read",
    summary:
      "Why EWERSEEN works in the Chasing Sun(Sets) lane: patient movement, clean structure, and rhythms that let the room open up before it peaks.",
    deck: "Not every guest fits an open-air chapter. The ones that do understand that the room has to breathe before it can lift. EWERSEEN is one of those bookings.",
    image: "/images/chasing-sunsets-premium.webp",
    accent: "sunsets",
    tags: ["Artist Feature", "Chasing Sun(Sets)", "Open-Air Curation"],
    relatedLinks: [
      { label: "Open Artist Profile", href: "/artists/ewerseen" },
      { label: "Listen To EP-02", href: "/radio/ep-02-ewerseen" },
      { label: "Explore Chasing Sun(Sets)", href: "/chasing-sunsets" },
    ],
    sections: [
      {
        title: "Why the booking makes sense",
        paragraphs: [
          "EWERSEEN makes sense for Chasing Sun(Sets) because the pacing never feels forced. The rhythms move, but they do not crowd the room. That matters in an open-air format where the first job is to let people arrive, settle in, and find each other before the energy climbs.",
          "There is also enough structure in the selections to make the set memorable without turning it into a highlight-reel performance. Monolith does better when the room feels shared, and EWERSEEN's style supports that.",
        ],
      },
      {
        title: "What to listen for",
        paragraphs: [
          "The easiest tell is patience. The drums stay active, but the mix leaves enough negative space for the room to breathe. That balance is a real booking signal for us: rhythm first, clutter never.",
          "The second tell is control. The transitions do not chase applause. They build continuity. That gives the crowd a cleaner sense of momentum, especially in the daylight-to-dusk window where too much intensity too early can flatten the whole chapter.",
        ],
      },
      {
        title: "Where to start",
        paragraphs: [
          "If you are new to the artist, start with the EP-02 radio drop. It is one of the clearest examples of how a guest can feel both musically precise and naturally suited to the Monolith room.",
        ],
      },
    ],
  },
  {
    slug: "set-drop-benchek-ep-01",
    title: "What to hear in BENCHEK's EP-01 set drop",
    category: "Set Drop",
    displayDate: "December 30, 2025",
    datePublished: "2025-12-30",
    readTime: "3 min read",
    summary:
      "A quick listen guide to EP-01 and the pacing choices that made it a clean entry point for the Chasing Sun(Sets) Radio Show.",
    deck: "The first radio drops do more than fill a feed. They tell people what standard the project is going to keep. EP-01 had to make that clear fast.",
    image: "/images/radio-show-gear.webp",
    accent: "radio",
    tags: ["Set Drop", "Radio Show", "BENCHEK"],
    relatedLinks: [
      { label: "Open EP-01", href: "/radio/ep-01-benchek" },
      { label: "Open The Radio Show", href: "/radio" },
      { label: "Read Brand Facts", href: "/chasing-sunsets-facts" },
    ],
    sections: [
      {
        title: "Why this drop matters",
        paragraphs: [
          "EP-01 had one job: prove that the radio show belongs in the same ecosystem as the live series. That means it could not sound like a random upload. It needed shape, restraint, and a clear sense of why this artist belonged in the first slot.",
          "BENCHEK delivered that. The mix feels deliberate from the first transition, which is exactly what an opening drop should do for a new radio identity.",
        ],
      },
      {
        title: "The pacing",
        paragraphs: [
          "The strongest part of the episode is the pacing. It starts warm, opens gradually, and only pushes harder once the listener is locked in. That mirrors the way a Monolith room should move in real life.",
          "Nothing about the set feels rushed for attention. That gives the mix replay value and makes it a real entry point instead of a one-time promo asset.",
        ],
      },
      {
        title: "What it says about the radio show",
        paragraphs: [
          "The takeaway is simple: the Chasing Sun(Sets) Radio Show should feel like programming, not content. EP-01 makes the case for that standard, and it gives future drops a clear bar to meet.",
        ],
      },
    ],
  },
  {
    slug: "show-note-autograf-chicago",
    title: "Why the AUTOGRAF Chicago date matters",
    category: "Show Note",
    displayDate: "March 17, 2026",
    datePublished: "2026-03-17",
    readTime: "4 min read",
    summary:
      "Why the March 21, 2026 AUTOGRAF Chicago date matters for Monolith: live energy, a recognizable name, and a room that can hold a full return moment.",
    deck: "The March 21, 2026 AUTOGRAF date at Alhambra Palace is not just another ticket link. It is the kind of booking that tests whether a room can hold familiarity, momentum, and taste at the same time.",
    image: "/images/autograf-recap.jpg",
    accent: "monolith",
    tags: ["Show Note", "AUTOGRAF", "March 21, 2026"],
    relatedLinks: [
      { label: "Get Tickets", href: "/tickets" },
      { label: "See The Schedule", href: "/schedule" },
      { label: "See The Archive", href: "/archive" },
    ],
    sections: [
      {
        title: "Why this date is different",
        paragraphs: [
          "AUTOGRAF already carries name recognition, but that is not the real point. What matters is what that recognition does inside a Monolith room. A familiar act can either flatten a night into generic expectation or give the room a bigger shared release. The setup at Alhambra Palace gives this one the second option.",
          "That is why the date matters. It is a chance to bring a wider circle into the project without dropping the curation standard.",
        ],
      },
      {
        title: "What the room needs from a live set",
        paragraphs: [
          "A live-forward act changes how the room behaves. People watch more closely. The timing of the build matters more. The handoff between support and headline has to feel intentional.",
          "For Monolith, that means the room still has to feel shared, not spectator-only. The best version of this night is not passive admiration. It is a live set that pulls the whole room into the same pace.",
        ],
      },
      {
        title: "What to expect",
        paragraphs: [
          "Expect a bigger emotional range than a standard club booking: melodic lift, live instrumentation, and a crowd that knows the night is designed to move somewhere. That is the version of an upcoming show note that actually helps people decide, because it tells them what the room is trying to become.",
        ],
      },
    ],
  },
  {
    slug: "fan-feature-people-in-the-room",
    title: "The people in the room are part of the format",
    category: "Fan Feature",
    displayDate: "February 28, 2026",
    datePublished: "2026-02-28",
    readTime: "3 min read",
    summary:
      "A note on the people who make a Monolith room feel like Monolith: returning guests, first-timers with taste, and dancers who come to share the night.",
    deck: "Monolith is music-first, but the crowd still matters. Not in a status way. In a room way. The people inside the chapter help determine whether the night feels disposable or worth returning to.",
    image: "/images/industrial-roster.webp",
    accent: "story",
    tags: ["Fan Feature", "Togetherness", "Room Culture"],
    relatedLinks: [
      { label: "See The Archive", href: "/archive" },
      { label: "Read The Night Guide", href: "/guide" },
      { label: "Join The Newsletter", href: "/newsletter" },
    ],
    sections: [
      {
        title: "The room is part of the format",
        paragraphs: [
          "We talk a lot about artists, lineups, and settings, but the room itself is part of the format. A room full of people who came to actually listen, move, and stay present changes the entire shape of a night.",
          "That is why fan features matter here. They are not filler. They document the social standard that makes the music land harder.",
        ],
      },
      {
        title: "What returning guests actually do",
        paragraphs: [
          "Returning guests create continuity. They know how Monolith rooms move. They help first-timers read the pace. They make the atmosphere feel less transactional and more shared without anyone having to explain it out loud.",
          "That is the real value of togetherness on a site like this. It is not a slogan. It is a visible pattern in the room.",
        ],
      },
      {
        title: "Why fan features belong here",
        paragraphs: [
          "If we want the journal to feel alive, it cannot only speak from the promoter angle. It also has to show the people who keep choosing the room. That is how the editorial layer starts feeling like a culture instead of a press packet.",
        ],
      },
    ],
  },
];

export function getInsightEntry(slug: string) {
  return insightEntries.find(entry => entry.slug === slug);
}
