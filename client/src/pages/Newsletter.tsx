import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

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
      />
      <Navigation variant="light" />

      <section className="pt-44 md:pt-48 pb-8 px-6 relative">
        <div className="container max-w-6xl mx-auto">
          <span className="font-mono text-xs tracking-[0.24em] uppercase text-charcoal/50 block">Early Access</span>
          <h1 className="font-display text-[clamp(3rem,8.5vw,7rem)] leading-[0.88] uppercase mt-4">
            Stay In The Loop
          </h1>
          <p className="text-charcoal/70 mt-4 max-w-2xl">
            Join the Monolith list for priority ticket windows, lineup drops, and fresh radio mixes.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 max-w-3xl">
            {benefits.map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-charcoal/15 bg-white/70 px-3 py-1.5 text-[10px] font-bold tracking-[0.14em] uppercase text-charcoal/80"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/schedule" asChild>
              <a className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] uppercase text-charcoal/70 hover:text-charcoal transition-colors">
                Back to Schedule
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      <NewsletterSection
        source="newsletter_page"
        compactIntro
        description="One signup, direct signal: ticket access, lineup updates, and mixes worth saving."
        benefits={benefits}
      />
      <Footer />
    </div>
  );
}
