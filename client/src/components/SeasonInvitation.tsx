import { useId } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import ChasingSunsetsLogo from "./ChasingSunsetsLogo";
import UntoldButterflyLogo from "./UntoldButterflyLogo";
import { HOME_NEXT_CHAPTER } from "@shared/home-next-chapter";
import "@/styles/season-invitation.css";

export default function SeasonInvitation({
  programme,
  id,
}: {
  programme: "untold" | "sunsets";
  id?: string;
}) {
  const titleId = useId();
  const untold = programme === "untold";
  const chapter = HOME_NEXT_CHAPTER.programmes[untold ? 0 : 1];
  return (
    <section
      id={id}
      className="season-invitation"
      data-programme={programme}
      aria-labelledby={titleId}
    >
      <div className="container layout-wide season-invitation-grid">
        <div className="season-invitation-poster" aria-hidden="true">
          <span className="season-invitation-poster-top">
            The Monolith Project presents
          </span>
          <div className="season-invitation-mark">
            {untold ? (
              <UntoldButterflyLogo />
            ) : (
              <ChasingSunsetsLogo decorative />
            )}
          </div>
          <span className="season-invitation-year">
            {HOME_NEXT_CHAPTER.year}
          </span>
          <span className="season-invitation-poster-bottom">
            {chapter.name} / {chapter.edition}
          </span>
        </div>
        <div className="season-invitation-copy">
          <p className="season-invitation-kicker">
            The next chapter / {HOME_NEXT_CHAPTER.year}
          </p>
          <h2 id={titleId}>
            {untold ? "See you" : "Meet us"}
            <br />
            <em>{untold ? "after dark." : "at golden hour."}</em>
          </h2>
          <p className="season-invitation-edition">
            {chapter.name} · {chapter.edition}
          </p>
          <p className="season-invitation-description">
            {untold
              ? "New nights. Closer rooms. Be the first to hear what’s next for Untold Story."
              : "More music by the water. Be the first to hear what’s next for Chasing Sunsets."}
          </p>
          <Link
            href={HOME_NEXT_CHAPTER.signupHref}
            data-first-access="true"
            className="editorial-action"
          >
            Get First Access <ArrowUpRight size={20} aria-hidden="true" />
          </Link>
          <p className="season-invitation-note">
            Dates and artists to be announced.
          </p>
        </div>
      </div>
    </section>
  );
}
