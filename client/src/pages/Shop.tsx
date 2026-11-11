import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import ProgrammeLinks from "@/components/ProgrammeLinks";
import { ROUTES } from "@shared/routes";
import "@/styles/shop-editorial.css";

export default function Shop() {
  return (
    <div className="collection-page min-h-screen">
      <SEO
        title="Shop"
        description="Official Monolith Project merchandise coming soon. Sign up for early access to the collection."
        canonicalPath="/shop"
      />
      <Navigation />
      <main id="main-content" tabIndex={-1} className="page-shell-start-loose">
        <section
          className="container layout-wide collection-intro"
          aria-labelledby="collection-title"
        >
          <div className="collection-copy">
            <p className="collection-kicker">
              The Monolith Project / Objects & editions
            </p>
            <span className="collection-status">In development</span>
            <h1 id="collection-title">
              Collection
              <br />
              <em>01.</em>
            </h1>
            <p className="collection-description">
              For the nights that stay with you. Limited-run garments and
              accessories from The Monolith Project.
            </p>
            <Link
              href={ROUTES.newsletter}
              data-first-access="true"
              className="editorial-action"
            >
              Get First Access <ArrowUpRight size={20} aria-hidden="true" />
            </Link>
            <p className="collection-note">
              Be the first to hear when it’s ready.
            </p>
          </div>
          <div className="collection-poster" aria-hidden="true">
            <div className="collection-poster-masthead">
              <span>
                Monolith
                <br />
                Project
              </span>
              <span>
                Chicago
                <br />
                Collection 01
              </span>
            </div>
            <div className="collection-poster-art">
              <span>01</span>
              <div className="collection-orbits" />
            </div>
            <div className="collection-poster-footer">
              <span>
                Made for
                <br />
                the memories.
              </span>
              <ArrowUpRight size={34} />
            </div>
            <span className="collection-poster-stub">
              Collection 01 / In development
            </span>
          </div>
        </section>
        <section
          className="container layout-wide collection-world"
          aria-labelledby="collection-world-title"
        >
          <header>
            <p className="collection-kicker">Until then</p>
            <h2 id="collection-world-title">Step into our world.</h2>
            <Link href={ROUTES.schedule}>
              Explore the calendar <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </header>
          <ProgrammeLinks />
        </section>
      </main>
    </div>
  );
}
