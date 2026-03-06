import { Link, useLocation } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";

interface ComingSoonConfig {
  title: string;
  headline: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

const CONTENT_BY_PATH: Record<string, ComingSoonConfig> = {
  "/shop": {
    title: "Shop",
    headline: "Shop Launching Soon",
    description: "Merch drops and limited releases are being prepared.",
    primaryCtaLabel: "Get Drop Alerts",
    primaryCtaHref: "/newsletter",
    secondaryCtaLabel: "View Tickets",
    secondaryCtaHref: "/tickets",
  },
  "/vip": {
    title: "VIP & Tables",
    headline: "VIP & Tables",
    description: "Table bookings and elevated experiences are opening soon.",
    primaryCtaLabel: "Request VIP Access",
    primaryCtaHref: "mailto:events@monolithproject.com?subject=VIP%20%26%20Tables%20Inquiry",
    secondaryCtaLabel: "View Tickets",
    secondaryCtaHref: "/tickets",
  },
  "/ambassadors": {
    title: "Ambassadors",
    headline: "Ambassador Program",
    description: "Applications are opening soon for community representatives.",
    primaryCtaLabel: "Join Waitlist",
    primaryCtaHref: "/newsletter",
    secondaryCtaLabel: "Contact Team",
    secondaryCtaHref: "/contact",
  },
  "/travel": {
    title: "Travel & Hotels",
    headline: "Travel & Hotels",
    description: "Preferred hotel blocks and travel guidance are being finalized.",
    primaryCtaLabel: "Get Travel Updates",
    primaryCtaHref: "/newsletter",
    secondaryCtaLabel: "View Schedule",
    secondaryCtaHref: "/schedule",
  },
  "/guide": {
    title: "Arrival Guide",
    headline: "Arrival Guide",
    description: "Venue entry, timing, and check-in guidance will be published soon.",
    primaryCtaLabel: "View Tickets",
    primaryCtaHref: "/tickets",
    secondaryCtaLabel: "Contact Team",
    secondaryCtaHref: "/contact",
  },
  "/submit": {
    title: "Artist Submission",
    headline: "Artist Submission",
    description: "Submissions will open soon for upcoming Monolith programming.",
    primaryCtaLabel: "Artist Inquiry",
    primaryCtaHref: "mailto:booking@monolithproject.com?subject=Artist%20Submission%20Inquiry",
    secondaryCtaLabel: "View Lineup",
    secondaryCtaHref: "/lineup",
  },
  "/press": {
    title: "Press & Media",
    headline: "Press & Media",
    description: "Press kits and media inquiry workflows are being prepared.",
    primaryCtaLabel: "Press Inquiry",
    primaryCtaHref: "mailto:events@monolithproject.com?subject=Press%20%26%20Media%20Inquiry",
    secondaryCtaLabel: "Contact Team",
    secondaryCtaHref: "/contact",
  },
  "/archive": {
    title: "Archive",
    headline: "Archive",
    description: "A full archive of events, visuals, and stories is coming soon.",
    primaryCtaLabel: "Listen on Radio",
    primaryCtaHref: "/radio",
    secondaryCtaLabel: "View Gallery",
    secondaryCtaHref: "/",
  },
  "/faq": {
    title: "FAQ",
    headline: "FAQ",
    description: "A centralized FAQ page is being assembled.",
    primaryCtaLabel: "Contact Team",
    primaryCtaHref: "/contact",
    secondaryCtaLabel: "View Tickets",
    secondaryCtaHref: "/tickets",
  },
};

const FALLBACK_CONTENT: ComingSoonConfig = {
  title: "Coming Soon",
  headline: "Page Launching Soon",
  description: "This page is being prepared.",
  primaryCtaLabel: "Contact Team",
  primaryCtaHref: "/contact",
  secondaryCtaLabel: "View Tickets",
  secondaryCtaHref: "/tickets",
};

function isExternalHref(href: string) {
  return href.startsWith("mailto:") || href.startsWith("http://") || href.startsWith("https://");
}

export default function ComingSoon() {
  const [location] = useLocation();
  const content = CONTENT_BY_PATH[location] || FALLBACK_CONTENT;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title={content.title} description={content.description} noIndex />
      <Navigation />

      <main id="main-content" tabIndex={-1} className="pt-40 pb-24 px-6">
        <div className="container max-w-3xl mx-auto text-center">
          <p className="font-mono text-xs tracking-[0.24em] uppercase text-primary/80 mb-6">Monolith Project</p>
          <h1 className="font-display text-5xl md:text-7xl tracking-tight-display mb-6">{content.headline}</h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-10">{content.description}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isExternalHref(content.primaryCtaHref) ? (
              <a
                href={content.primaryCtaHref}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-mono text-xs tracking-[0.16em] uppercase"
              >
                {content.primaryCtaLabel}
              </a>
            ) : (
              <Link
                href={content.primaryCtaHref}
                className="px-8 py-3 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-mono text-xs tracking-[0.16em] uppercase"
              >
                {content.primaryCtaLabel}
              </Link>
            )}
            {isExternalHref(content.secondaryCtaHref) ? (
              <a
                href={content.secondaryCtaHref}
                className="px-8 py-3 rounded-full border border-border hover:border-primary/60 transition-colors font-mono text-xs tracking-[0.16em] uppercase"
              >
                {content.secondaryCtaLabel}
              </a>
            ) : (
              <Link
                href={content.secondaryCtaHref}
                className="px-8 py-3 rounded-full border border-border hover:border-primary/60 transition-colors font-mono text-xs tracking-[0.16em] uppercase"
              >
                {content.secondaryCtaLabel}
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
