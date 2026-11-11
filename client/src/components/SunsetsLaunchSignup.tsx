import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import hostedForms from "@shared/signup-forms.json";
import { ROUTES } from "@shared/routes";

export default function SunsetsLaunchSignup() {
  return (
    <section
      id="sunsets-fm-signup"
      className="home-launch-signup"
      aria-labelledby="sunsets-launch-title"
    >
      <div>
        <p className="home-eyebrow">
          SUNSETS.FM <span>/</span> The music continues
        </p>
        <h2 id="sunsets-launch-title">
          One signal.
          <br />
          <em>Infinite connections.</em>
        </h2>
      </div>
      <div className="home-launch-detail">
        <p>
          Keep the music close. Discover artist-led sets and get the latest from
          SUNSETS.FM.
        </p>
        <a
          className="home-network-primary editorial-action"
          href={hostedForms.radio}
          target="_blank"
          rel="noopener noreferrer"
        >
          Get music updates <ArrowUpRight size={18} aria-hidden="true" />
        </a>
        <Link href={ROUTES.sunsetsFM} className="home-network-link">
          Explore SUNSETS.FM <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
        <Link href={ROUTES.privacy} className="home-network-link">
          Privacy policy
        </Link>
      </div>
    </section>
  );
}
