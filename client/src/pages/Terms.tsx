import { TICKET_POLICY } from "@shared/events/ticket-policy";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import EntityBoostStrip from "@/components/EntityBoostStrip";

export default function Terms() {
  return (
    <div className="legal-document min-h-screen bg-background text-foreground">
      <SEO
        title="Terms of Service"
        description="Terms of Service for The Monolith Project website and events."
        canonicalPath="/terms"
      />
      <Navigation />
      <section className="page-shell-start pb-20 px-6">
        <div className="container layout-narrow">
          <p className="font-mono text-xs tracking-widest uppercase text-primary mb-4">
            Legal
          </p>
          <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-[0.9] uppercase mb-6">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-10">
            Last updated: October 3, 2026.
          </p>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="font-display text-3xl text-foreground mb-3 uppercase">
                Use of Site
              </h2>
              <p>
                This site is provided for event discovery, ticket access, and
                community updates. You agree not to misuse the site, interfere
                with services, or attempt unauthorized access.
              </p>
            </section>
            <section>
              <h2 className="font-display text-3xl text-foreground mb-3 uppercase">
                Tickets and Events
              </h2>
              <p>
                <strong className="text-foreground">
                  {TICKET_POLICY.salesFinal}
                </strong>
              </p>
              <p className="mt-3">
                Ticket purchases are fulfilled by third-party providers. Check
                the event guide and checkout for the applicable booking and
                entry terms. Event details, schedules and availability may
                change.
              </p>
              <p className="mt-3">{TICKET_POLICY.changes}</p>
              <p className="mt-3">
                For the postponed JOEZI × MASSUMA show, read the{" "}
                <a className="underline" href="/sunsets#event-status">
                  Sun(Sets) III ticket-holder update
                </a>{" "}
                and the{" "}
                <a className="underline" href="/sunsets#weather">
                  full weather and ticket policy
                </a>
                .
              </p>
            </section>
            <section>
              <h2 className="font-display text-3xl text-foreground mb-3 uppercase">
                Intellectual Property
              </h2>
              <p>
                Site content, branding, and media are owned by The Monolith
                Project or licensed partners. You may not reuse protected assets
                without written permission.
              </p>
            </section>
            <section>
              <h2 className="font-display text-3xl text-foreground mb-3 uppercase">
                Contact
              </h2>
              <p>
                Questions about these terms can be sent to{" "}
                <a
                  className="underline"
                  href="mailto:events@monolithproject.com"
                >
                  events@monolithproject.com
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </section>
      <EntityBoostStrip tone="dark" className="pb-20" />
    </div>
  );
}
