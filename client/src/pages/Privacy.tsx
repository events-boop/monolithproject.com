import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <section className="pt-44 pb-20 px-6">
        <div className="container max-w-4xl mx-auto">
          <p className="font-mono text-xs tracking-widest uppercase text-primary mb-4">Legal</p>
          <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-[0.9] uppercase mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-10">Last updated: February 11, 2026.</p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-display text-3xl text-foreground mb-3 uppercase">What We Collect</h2>
              <p>
                We collect information you provide directly, such as newsletter signups and booking inquiries, including
                email and optional profile details.
              </p>
            </section>
            <section>
              <h2 className="font-display text-3xl text-foreground mb-3 uppercase">How We Use Data</h2>
              <p>
                Data is used to deliver updates, respond to inquiries, and improve event communication. We may use trusted
                third-party providers for newsletter and ticket workflows.
              </p>
            </section>
            <section>
              <h2 className="font-display text-3xl text-foreground mb-3 uppercase">Data Sharing</h2>
              <p>
                We do not sell personal data. Information is shared only with service providers needed to operate our platform
                and events.
              </p>
            </section>
            <section>
              <h2 className="font-display text-3xl text-foreground mb-3 uppercase">Contact</h2>
              <p>
                For privacy requests, contact <a className="underline" href="mailto:events@monolithproject.com">events@monolithproject.com</a>.
              </p>
            </section>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
