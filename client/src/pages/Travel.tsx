import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import ResponsiveImage from "@/components/ResponsiveImage";
import RoomConciergeCard from "@/components/RoomConciergeCard";

export default function Travel() {
  return (
    <div className="travel-editorial min-h-screen bg-background text-foreground">
      <SEO
        title="Plan Your Visit — Chicago"
        description="Choose your Monolith event and room before planning your visit to Chicago. Venue references and the current event calendar."
        canonicalPath="/travel"
      />
      <Navigation />
      <main
        id="main-content"
        tabIndex={-1}
        className="container layout-wide px-6 page-shell-start-loose pb-24"
      >
        <header className="travel-intro">
          <div>
            <p className="section-kicker">Chicago / Come for the music</p>
            <h1>
              Make room
              <br />
              for the city.
            </h1>
            <p>
              Start with the show, then build your visit around its room. Our
              lakefront afternoons and late-night chapters take you to different
              parts of Chicago.
            </p>
            <Link className="lg-pill-amber" href="/schedule">
              Find your show <ArrowUpRight size={17} />
            </Link>
          </div>
          <figure>
            <ResponsiveImage
              src="/images/sunsets-hero-beach.jpg"
              alt="The lakefront setting of Chasing Sun(Sets) at Castaways"
              priority
              sizes="(min-width: 800px) 50vw, 100vw"
              className="w-full h-full object-cover"
            />
            <figcaption>Chasing Sun(Sets) / Castaways Beach Club</figcaption>
          </figure>
        </header>
        <section className="travel-steps" aria-label="Planning your visit">
          <article>
            <span>01</span>
            <h2>Confirm the room.</h2>
            <p>
              Use the address and date on your event confirmation. A venue in
              the archive is not an announcement of the next show.
            </p>
          </article>
          <article>
            <span>02</span>
            <h2>Build your stay around it.</h2>
            <p>
              Check accommodation availability and cancellation terms directly
              with the property. No hotel discounts or partner rates are
              currently published here.
            </p>
          </article>
          <article>
            <span>03</span>
            <h2>Check the journey.</h2>
            <p>
              Use the map for your selected venue to plan the route, then check
              transport conditions on the day.
            </p>
            <Link href="/guide">Arrival guide →</Link>
          </article>
        </section>
        <RoomConciergeCard allowRoomSwitch />
        <aside className="editorial-status-note">
          <h2>Arriving with a group?</h2>
          <p>
            For hosting or accessibility questions, speak with the team before
            finalizing your plans.
          </p>
          <Link href="/contact">Contact the host team →</Link>
        </aside>
      </main>
    </div>
  );
}
