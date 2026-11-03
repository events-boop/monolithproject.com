import { useState } from "react";
import { networkEpisodes } from "./RadioLibrary";

const journeys = [
  {
    image: "/media/chasing-radio/series-main.webp",
    alt: "Chasing SUN(SETS) Radio series artwork",
    caption: "01 / IT STARTS WITH A SOUND",
    description:
      "A listener discovers a Chasing SUN(SETS) set. The sound of a Monolith gathering travels beyond the room.",
    label: "Find a frequency.",
  },
  {
    image: networkEpisodes[0].image,
    alt: "SOMMERS (UK) — Chasing Sunsets Episode 011 cover",
    caption: "02 / THE PEOPLE BEHIND THE FREQUENCY",
    description:
      "That set introduces an artist. Their taste, craft, and story reveal another side of the music.",
    label: "Meet the people.",
  },
  {
    image: "/media/open-network/arodes.webp",
    alt: "ARODES playing at Santa Monica Pier",
    caption: "03 / EVERY PLACE HAS A STORY",
    description:
      "SUNSETS.FM connects the recording to a wider scene: a city, a station, a venue, a gathering, or another creator.",
    label: "Discover a place.",
  },
  {
    image: "/open-network/assets/landscape.webp",
    alt: "A golden sunset across the landscape",
    caption: "04 / THE NEXT CHAPTER IS YOURS",
    description:
      "Discovery brings us back together. A new artist, a shared story, a future night with Monolith.",
    label: "Return with a story.",
  },
];
export default function NetworkJourney() {
  const [step, setStep] = useState(0);
  const item = journeys[step];
  return (
    <section
      className="journey paper section-pad"
      id="connections"
      aria-labelledby="journey-title"
    >
      <div className="section-kicker">
        <span className="eyebrow">THE NETWORK EFFECT IS HUMAN</span>
        <span>03 / 05</span>
      </div>
      <div className="journey-layout">
        <div className="journey-art">
          <img
            src={item.image}
            alt={item.alt}
            loading="lazy"
            width={1000}
            height={1000}
          />
          <span className="art-caption">{item.caption}</span>
        </div>
        <div className="journey-text">
          <h2 className="section-title" id="journey-title">
            One discovery.
            <br />
            <em>A thousand directions.</em>
          </h2>
          <p className="journey-intro">
            A set introduces an artist. An artist reveals a scene. A scene opens
            a world.
          </p>
          <div
            className="journey-steps"
            aria-label="Explore the discovery journey"
          >
            {journeys.map((journey, i) => (
              <button
                key={journey.label}
                onClick={() => setStep(i)}
                aria-pressed={step === i}
              >
                <span>0{i + 1}</span>
                <strong>{journey.label}</strong>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <p className="journey-description" aria-live="polite">
            {item.description}
          </p>
          <p className="journey-route">
            Find → Listen → Understand → Connect → Return.
          </p>
        </div>
      </div>
    </section>
  );
}
