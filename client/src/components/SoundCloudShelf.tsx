import { ArrowUpRight, Headphones } from "lucide-react";
import { Link } from "wouter";
import { radioEpisodes } from "@/data/radioEpisodes";
import ResponsiveImage from "./ResponsiveImage";
export default function SoundCloudShelf() {
  return (
    <section className="listening-rail" aria-labelledby="listening-rail-title">
      <div className="container layout-wide">
        <header>
          <div>
            <p className="section-kicker">Sun(Sets) Radio</p>
            <h2 id="listening-rail-title">The music keeps moving.</h2>
          </div>
          <Link className="home-text-link" href="/radio">
            Explore Radio <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </header>
        <div className="listening-rail-grid">
          {radioEpisodes.slice(0, 2).map(episode => (
            <Link
              key={episode.slug}
              href={`/radio/${episode.slug}`}
              className="listening-rail-card"
            >
              <ResponsiveImage
                src={episode.coverImage || episode.image}
                alt={`${episode.guest} cover art`}
                width={240}
                height={240}
                sizes="(max-width: 639px) 104px, 160px"
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="section-kicker">
                  {episode.guest} · {episode.duration}
                </p>
                <h3>{episode.title}</h3>
                <span>
                  <Headphones size={16} aria-hidden="true" /> Open the episode{" "}
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
