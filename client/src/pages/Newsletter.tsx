import WorldEtching from "@/components/WorldEtching";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import SEO from "@/components/SEO";
import { ROUTES } from "@shared/routes";
import ProgrammeLinks from "@/components/ProgrammeLinks";
import hostedForms from "@shared/signup-forms.json";
import "@/styles/newsletter-signal.css";
import MonolithSignupPreview from "@/components/audience-signup/MonolithSignupPreview";
import FirstAccessIntake from "@/components/FirstAccessIntake";

export default function Newsletter() {
  if (
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get("intake_preview") === "1"
  ) {
    return <FirstAccessIntake designPreview />;
  }
  if (
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get("audience_preview") === "1"
  ) {
    return <MonolithSignupPreview />;
  }

  return (
    <div className="first-access-page min-h-screen relative overflow-hidden">
      <SEO
        title="Newsletter"
        description="Join the Monolith list for priority ticket windows, lineup drops, and fresh radio mixes."
        canonicalPath="/newsletter"
      />
      <Navigation variant="dark" />

      <main id="main-content" tabIndex={-1}>
        <section
          className="first-access-hero page-shell-start-loose"
          aria-labelledby="first-access-title"
        >
          <WorldEtching />
          <div className="container layout-wide first-access-hero-grid">
            <div className="first-access-intro">
              <p className="first-access-kicker">
                The Monolith Project / First Access
              </p>
              <span className="first-access-season">2027 & beyond</span>
              <h1 id="first-access-title">
                Be the first
                <br />
                to know.
              </h1>
              <p className="first-access-description">
                The next room. The next artist. The next recording you keep
                coming back to. Stay close to what moves you.
              </p>
            </div>
            <div
              className="first-access-choice"
              aria-label="Choose your updates"
            >
              <p className="first-access-kicker">Choose what brings you here</p>
              <article id="newsletter-signup">
                <span>01 / The nights</span>
                <h2>Be in the room.</h2>
                <p>
                  Lineup announcements, ticket windows, and show updates from
                  Monolith.
                </p>
                <a
                  href={hostedForms.newsletter || "#newsletter"}
                  target={hostedForms.newsletter ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  data-first-access="true"
                >
                  Get First Access <ArrowUpRight size={18} />
                </a>
              </article>
              <article id="radio-updates">
                <span>02 / The music</span>
                <h2>Keep listening.</h2>
                <p>New radio sessions and music updates from SUNSETS.FM.</p>
                <a
                  href={hostedForms.radio}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get music updates <ArrowUpRight size={18} />
                </a>
              </article>
              <p className="first-access-choice-note">
                Each opens its own signup form. Choose the updates you want.
              </p>
            </div>
          </div>
          <div className="container layout-wide first-access-programmes">
            <ProgrammeLinks />
          </div>
        </section>
        {!hostedForms.newsletter && (
          <NewsletterSection source="newsletter_page" />
        )}
        <nav
          className="container layout-wide first-access-full-links"
          aria-label="Full Monolith destination links"
        >
          <p>Keep exploring</p>
          {[
            { label: "Chasing Sunsets", href: "https://sunsets.vip" },
            { label: "Untold Story", href: "https://untold.vip" },
            { label: "House of Friends", href: "https://houseoffriends.vip" },
            { label: "SUNSETS.FM", href: "https://sunsets.fm" },
          ].map(link => (
            <a href={link.href} key={link.href}>
              <strong>{link.label}</strong>
              <span>{link.href}</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ))}
          <Link href={ROUTES.schedule}>
            Full calendar <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </nav>
        <div className="container layout-wide first-access-utility">
          <Link href={ROUTES.privacy}>Privacy policy</Link>
        </div>
      </main>
    </div>
  );
}
