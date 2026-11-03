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
          SUNSETS.FM <span>/</span> Coming soon
        </p>
        <h2 id="sunsets-launch-title">
          Be part of
          <br />
          <em>what comes next.</em>
        </h2>
      </div>
      <div className="home-launch-detail">
        <p>
          A new chapter from The Monolith Project. Join the SUNSETS music list
          for launch news, new recordings, and a closer connection to the
          artists.
        </p>
        <a
          className="home-network-primary"
          href={hostedForms.radio}
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign up for SUNSETS.FM <ArrowUpRight size={18} aria-hidden="true" />
        </a>
        <p className="home-launch-note">
          Opens our email signup form. Confirm your email from your inbox.
          Unsubscribe anytime.
        </p>
        <Link href={ROUTES.privacy} className="home-network-link">
          Privacy policy
        </Link>
      </div>
    </section>
  );
}
