import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import ResponsiveImage from "./ResponsiveImage";

const stories = [
  {
    title: "By the lake.",
    date: "July 4, 2026",
    room: "Castaways Beach Club",
    copy: "Chasing Sun(Sets) I · Autograf × Kiko Franco",
    image: "/images/sunsets-hero-beach.jpg",
    href: "/chasing-sunsets/sunsets-i-2026",
  },
  {
    title: "Inside the room.",
    date: "March 21, 2026",
    room: "Alhambra Palace",
    copy: "Autograf · The Monolith Project",
    image: "/images/autograf-recap.jpg",
    href: "/archive/autograf-march-21-2026",
  },
];

/** Public, permanent event records. No speculative attendance or commercial claims. */
export default function ProjectStories() {
  return (
    <section
      className="project-stories container layout-wide"
      aria-label="Monolith event stories"
    >
      <div className="project-stories-heading">
        <p className="section-kicker">Made here / Chicago</p>
        <h2>
          The work lives
          <br />
          in the room.
        </h2>
        <Link href="/archive">
          Explore the archive <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="project-stories-grid">
        {stories.map(story => (
          <Link key={story.href} href={story.href} className="project-story">
            <figure>
              <ResponsiveImage
                src={story.image}
                alt={`${story.room} — ${story.copy}`}
                loading="lazy"
                sizes="(min-width: 768px) 50vw, 100vw"
                className="w-full h-full object-cover"
              />
            </figure>
            <div>
              <p>
                {story.date} / {story.room}
              </p>
              <h3>{story.title}</h3>
              <span>{story.copy}</span>
              <span className="project-story-action">
                View the chapter <ArrowUpRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
