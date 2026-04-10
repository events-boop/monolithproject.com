// Untold Story palette — synced with CSS custom properties in index.css
// (--color-untold-violet, --color-untold-cyan, --color-untold-deep, --color-untold-card)
// Raw hex kept here for inline style alpha concatenation (e.g. `${violet}25`)
export const violet = "#8B5CF6";
export const cyan = "#22D3EE";
export const deepBg = "#06060F";
export const cardBg = "#0C0C1A";

export const eventVisuals = {
  poster: "/images/eran-hersh-live-5.webp",
  eran: "/images/eran-hersh-live-6.png",
};

export const lineupVisuals = [
  { name: "Eran Hersh", role: "Headliner", image: "/images/eran-hersh-live-6.png" },
  { name: "Hashtom", role: "Support", image: "/images/artist-haai.webp" },
  { name: "Local Support TBA", role: "Support", image: "/images/chasing-sunsets-premium.webp" },
];

export const untoldFaqs: Array<[string, string]> = [
  ["Are tickets refundable?", "All sales are final. No refunds or exchanges."],
  ["What time should I arrive?", "Doors open at 7:00 PM. Peak experience begins around 9:00 PM. Early arrival is recommended for the full journey."],
  ["Is there re-entry?", "No re-entry permitted once you leave the venue."],
  ["What's the age requirement?", "21+ only. Valid government-issued ID required for entry."],
  ["Is parking available?", "Street parking and nearby garage parking available in the West Loop. Rideshare recommended."],
  ["Do I need printed tickets?", "No. Mobile QR codes are accepted at the door."],
  ["What's the dress code?", "Elevated nightlife attire encouraged. Dress to move comfortably — this is a dancefloor experience."],
  ["Is food available?", "Yes. Food is available inside the venue."],
  ["Can I bring a camera?", "Personal photos welcome. Professional cameras require prior approval. This event will be photographed for Monolith Project and partner marketing channels."],
  ["What if the event is sold out?", "Limited door tickets may be available on the night of the event, but advance purchase is strongly recommended."],
];
