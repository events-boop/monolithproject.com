import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import {
  MONOLITH_LAUNCH_NOTICE,
  buildLaunchNoticeSchema,
} from "@shared/events/historical-notices";
import { ROUTES } from "@shared/routes";

export default function HistoricalEventNotice() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={MONOLITH_LAUNCH_NOTICE.title}
        description={MONOLITH_LAUNCH_NOTICE.description}
        canonicalPath={MONOLITH_LAUNCH_NOTICE.path}
        schemaData={buildLaunchNoticeSchema()}
      />
      <Navigation />
      <main
        id="main-content"
        tabIndex={-1}
        className="page-shell-start px-6 pb-24"
      >
        <article className="container layout-default max-w-3xl py-12 md:py-20">
          <p className="section-kicker text-primary">
            The Monolith Project / Event update
          </p>
          <h1 className="mt-6 font-display text-4xl leading-tight md:text-6xl">
            {MONOLITH_LAUNCH_NOTICE.title}
          </h1>
          <p className="mt-8 font-mono text-sm font-bold uppercase tracking-widest text-primary">
            {MONOLITH_LAUNCH_NOTICE.status}
          </p>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            {MONOLITH_LAUNCH_NOTICE.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={ROUTES.newsletter}
              data-first-access="true"
              className="btn-pill-monolith"
            >
              Get First Access{" "}
              <ArrowUpRight className="ml-3 h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href={ROUTES.schedule} className="btn-pill-outline">
              View calendar
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
