import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { HOME_NEXT_CHAPTER as chapter } from "@shared/home-next-chapter";
import ProgrammeLinks from "./ProgrammeLinks";
import EventStatusBadge from "./EventStatusBadge";
import "@/styles/home-next-chapter.css";

export default function HomeNextChapter({
  headingLevel = "h3",
}: {
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <section
      id="next-chapter"
      className="home-next-chapter"
      aria-labelledby="next-chapter-title"
    >
      <div className="next-chapter-masthead">
        <p>{chapter.brand}</p>
        <span>
          Chicago & beyond <span aria-hidden="true">↗</span>
        </span>
      </div>
      <div className="next-chapter-intro">
        <p className="next-chapter-year">{chapter.year}</p>
        <div className="next-chapter-copy">
          <Heading id="next-chapter-title" className="next-chapter-title">
            More nights.
            <br />
            <em>More stories.</em>
          </Heading>
          <p>{chapter.description}</p>
        </div>
      </div>
      <ProgrammeLinks />
      <div className="next-chapter-signup">
        <div>
          <p>Get First Access</p>
          <EventStatusBadge status="first-access" />
        </div>
        <Link
          href={chapter.signupHref}
          data-first-access="true"
          className="next-chapter-button editorial-action"
        >
          {chapter.signupLabel}
          <ArrowUpRight size={20} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
