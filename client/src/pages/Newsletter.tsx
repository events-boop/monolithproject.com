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

export default function Newsletter() {
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
              <a
                href={hostedForms.newsletter || "#newsletter-signup"}
                target={hostedForms.newsletter ? "_blank" : undefined}
                rel={hostedForms.newsletter ? "noopener noreferrer" : undefined}
                data-first-access="true"
                className="first-access-primary editorial-action"
              >
                Get First Access
                {hostedForms.newsletter && (
                  <span className="sr-only"> (opens in a new tab)</span>
                )}
                <ArrowUpRight size={20} aria-hidden="true" />
              </a>
            </div>
            <figure className="first-access-signal">
              <img
                src="/brand/sunsets-fm/sunsets-fm-warm-signal-master.svg"
                width={1974}
                height={1974}
                alt="SUNSETS.FM — gold sunset arc above the original waveform"
              />
              <figcaption>
                <p>One signal. Infinite connections.</p>
                <a
                  href={hostedForms.radio}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get music updates
                  <span className="sr-only">
                    {" "}
                    from SUNSETS.FM (opens in a new tab)
                  </span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </figcaption>
            </figure>
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
