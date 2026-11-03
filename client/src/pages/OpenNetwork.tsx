import { useEffect, useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import RadioLibrary, {
  networkEpisodes,
} from "@/components/open-network/RadioLibrary";
import RafaelSet from "@/components/open-network/RafaelSet";
import NetworkJourney from "@/components/open-network/NetworkJourney";
import {
  NetworkHero,
  NetworkVision,
  NetworkPillars,
  NetworkCreators,
  NetworkPrinciples,
  NetworkClosing,
} from "@/components/open-network/NetworkStory";
import { ROUTES } from "@shared/routes";
import "./open-network.css";

export default function OpenNetwork() {
  const [selectedId, setSelectedId] = useState(networkEpisodes[0].id);
  const [active, setActive] = useState<"radio" | "featured" | null>(null);
  useEffect(() => {
    const series = new URLSearchParams(window.location.search).get("series");
    const requestedEpisode = networkEpisodes.find(
      item => item.collection === series
    );
    if (requestedEpisode) setSelectedId(requestedEpisode.id);
    function stop() {
      setActive(null);
    }
    window.addEventListener("pagehide", stop);
    const id = window.setTimeout(() => {
      const hash = window.location.hash.slice(1);
      if (hash)
        document
          .getElementById(hash)
          ?.scrollIntoView({ block: "start", behavior: "instant" });
    }, 100);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("pagehide", stop);
    };
  }, []);
  function selectEpisode(id: string, play = false) {
    setSelectedId(id);
    setActive(play ? "radio" : null);
  }
  function heroListen() {
    selectEpisode(networkEpisodes[0].id, true);
    const room = document.getElementById("listening-room");
    room?.scrollIntoView({ block: "start", behavior: "instant" });
    room?.focus({ preventScroll: true });
  }
  return (
    <>
      <SEO
        title="Monolith × SUNSETS.FM — The Open Network"
        absoluteTitle
        canonicalPath={ROUTES.openNetwork}
        description="Chasing Sunsets Radio, a Monolith original powered by sunsets.fm. Listen to the sets, meet the artists, and explore the wider music discovery network."
        image="/media/chasing-radio/series-main.webp"
      />
      <Navigation brand="monolith" />
      <main
        id="main-content"
        tabIndex={-1}
        className="monolith-network page-shell-start"
      >
        <div className="network-breadcrumb">
          <Link href={ROUTES.home}>THE MONOLITH PROJECT</Link>
          <span aria-hidden="true">/</span>
          <span>THE OPEN NETWORK</span>
          <nav aria-label="On this page">
            <a href="#monolith-connection">The connection</a>
            <a href="#radio">Listen</a>
            <a href="#trust">Our principles</a>
          </nav>
        </div>
        <NetworkHero onListen={heroListen} />
        <section
          className="network-origin section-pad"
          id="monolith-connection"
          aria-labelledby="origin-title"
        >
          <div className="section-kicker">
            <span className="eyebrow">THE MONOLITH CONNECTION</span>
            <span>OUR WORLD, CONNECTED</span>
          </div>
          <div className="origin-heading">
            <h2 id="origin-title">
              Born in the gathering.
              <br />
              <em>Built to travel beyond it.</em>
            </h2>
            <p>
              Monolith brings people together through music. Chasing SUN(SETS)
              Radio carries that feeling beyond the night. SUNSETS.FM is the
              next chapter: a Monolith project connecting the music to the
              people and places around it.
            </p>
          </div>
          <ol className="origin-path">
            <li>
              <span>01 / THE ROOTS</span>
              <h3>The Monolith Project</h3>
              <p>The gatherings. The artists. The community.</p>
              <Link href={ROUTES.about}>Meet Monolith ↗</Link>
            </li>
            <li>
              <span>02 / THE STARTING POINT</span>
              <h3>Chasing SUN(SETS) Radio</h3>
              <p>Our sound, shared beyond the room.</p>
              <a href="#radio">Listen here ↓</a>
            </li>
            <li>
              <span>03 / THE NEXT CHAPTER</span>
              <h3>SUNSETS.FM</h3>
              <p>A wider network for music, people, and places.</p>
              <a
                href="https://sunsets.fm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Explore SUNSETS.FM ↗
              </a>
            </li>
          </ol>
        </section>
        <NetworkVision />
        <RafaelSet
          active={active === "featured"}
          onPlay={() => setActive("featured")}
          onStop={() => setActive(null)}
        />
        <NetworkPillars />
        <RadioLibrary
          selectedId={selectedId}
          active={active === "radio"}
          onSelect={selectEpisode}
          onStop={() => setActive(null)}
        />
        <NetworkJourney />
        <NetworkCreators />
        <NetworkPrinciples />
        <NetworkClosing />
      </main>
    </>
  );
}
