import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";

export default function Newsletter() {
  const benefits = [
    "Early Access Tickets",
    "Lineup Announcements",
    "New Radio Show Mixes",
    "Private Event Drops",
  ];

  return (
    <div className="min-h-screen bg-sand text-charcoal relative overflow-hidden">
      <SEO
        title="Newsletter"
        description="Join the Monolith list for priority ticket windows, lineup drops, and fresh radio mixes."
        canonicalPath="/newsletter"
      />
      <Navigation variant="light" />

      <section className="page-shell-start-loose pb-8 px-6 relative">
        <div className="container layout-default">
          <span className="section-kicker text-charcoal/50 block">Newsletter</span>
          <h1 className="section-display-title mt-4 max-w-[11ch] text-balance">
            GET MONOLITH UPDATES
          </h1>
          <p className="text-charcoal/70 mt-4 max-w-2xl text-lg">
            Join the Monolith newsletter. Get early ticket windows, lineup drops, and new radio episodes before the public push.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-8 items-start sm:items-center border-t border-charcoal/10 pt-12">
            <Link href="/schedule" asChild>
              <a className="btn-text-action btn-text-action-dark">
                See The Schedule
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Link>
            
            <Link href="/vip" asChild>
              <a className="btn-text-action btn-text-action-dark">
                VIP Tables
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      <EntityBoostStrip tone="light" className="pb-8" />
      <NewsletterSection source="newsletter_page" />
    </div>
  );
}
