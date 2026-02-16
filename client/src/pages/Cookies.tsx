import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO title="Cookie Policy" description="Cookie policy for The Monolith Project website." />
      <Navigation />
      <section className="pt-44 pb-20 px-6">
        <div className="container max-w-4xl mx-auto">
          <p className="font-mono text-xs tracking-widest uppercase text-primary mb-4">Legal</p>
          <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-[0.9] uppercase mb-6">Cookie Policy</h1>
          <p className="text-muted-foreground mb-10">Last updated: February 11, 2026.</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-display text-3xl text-foreground mb-3 uppercase">Essential Cookies</h2>
              <p>
                Essential cookies may be used for functional UI behavior and basic security/session support.
              </p>
            </section>
            <section>
              <h2 className="font-display text-3xl text-foreground mb-3 uppercase">Analytics Cookies</h2>
              <p>
                Analytics tools may be enabled to measure page performance and usage trends. These settings can change over time
                as we improve the site.
              </p>
            </section>
            <section>
              <h2 className="font-display text-3xl text-foreground mb-3 uppercase">Managing Cookies</h2>
              <p>
                You can control cookie behavior through your browser settings. Disabling certain cookies may affect some site functionality.
              </p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
