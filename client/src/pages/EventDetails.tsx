import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { getPublicEvents, usePublicSiteDataVersion } from "@/lib/siteData";
import { ArrowLeft, Clock, MapPin, Ticket, Star } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";
import ConversionCTA from "@/components/ConversionCTA";
import JoinSignalSection from "@/components/JoinSignalSection";
import ResponsiveImage from "@/components/ResponsiveImage";
import { getSeriesLabel, getSeriesColor } from "@/lib/siteExperience";
import { buildBreadcrumbSchema, buildScheduledEventSchema } from "@/lib/schema";

function getStatusLabel(status: string) {
  if (status === "on-sale") return "ON SALE";
  if (status === "coming-soon") return "COMING SOON";
  if (status === "sold-out") return "SOLD OUT";
  return "PAST";
}

function getShortDateLabel(dateLabel: string) {
  return dateLabel.replace(/,\s*\d{4}$/, "");
}

function buildEventSeoTitle(event: NonNullable<ReturnType<typeof getPublicEvents>[number]>) {
  const shortDate = getShortDateLabel(event.date);

  if (event.id === "us-s3e3") {
    return `Eran Hersh at Hideaway Chicago | ${shortDate}`;
  }

  const headline = event.headline || event.title;
  if (/venue reveal soon/i.test(event.venue)) {
    return `${headline} | ${shortDate}`;
  }

  return `${headline} at ${event.venue} | ${shortDate}`;
}

function buildEventSeoDescription(event: NonNullable<ReturnType<typeof getPublicEvents>[number]>) {
  const shortDate = getShortDateLabel(event.date);

  if (event.id === "us-s3e3") {
    return `Get tickets for Eran Hersh at Hideaway Chicago on ${shortDate}, part of Untold Story from The Monolith Project.`;
  }

  if (event.series === "chasing-sunsets") {
    return `${event.title} brings open-air Chicago house music to ${event.venue} on ${shortDate}. Get lineup, timing, and ticket updates.`;
  }

  if (event.series === "untold-story") {
    return `${event.title} brings after-dark Chicago house music to ${event.venue} on ${shortDate}. Get tickets, timing, and event details.`;
  }

  return `Get tickets and details for ${event.title} in Chicago on ${shortDate} from The Monolith Project.`;
}

export default function EventDetails() {
  usePublicSiteDataVersion();
  const [, params] = useRoute("/events/:slug");
  const [, setLocation] = useLocation();
  const slug = params?.slug;

  const event = getPublicEvents().find((e) => e.slug === slug || e.id === slug);
  const canonicalEventSlug = event?.slug || event?.id;
  const canonicalEventPath = canonicalEventSlug ? `/events/${canonicalEventSlug}` : `/events/${slug}`;
  const navigationBrand =
    event?.series === "chasing-sunsets"
      ? "chasing-sunsets"
      : event?.series === "untold-story"
        ? "untold-story"
        : "monolith";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!event || !slug || !canonicalEventSlug || slug === canonicalEventSlug) return;
    setLocation(canonicalEventPath, { replace: true });
  }, [canonicalEventPath, canonicalEventSlug, event, setLocation, slug]);

  if (!event) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="font-display text-4xl mb-4">Event Cipher Null</h1>
        <p className="font-mono text-white/50 mb-8">The requested event data could not be located.</p>
        <MagneticButton>
          <button onClick={() => setLocation("/schedule")} className="btn-pill-outline">
            Return to Schedule
          </button>
        </MagneticButton>
      </div>
    );
  }

  const bgImage = event.image || "/images/hero-monolith.webp";
  const pageTitle = buildEventSeoTitle(event);
  const pageDescription = buildEventSeoDescription(event);
  const schemaData = [
    buildScheduledEventSchema(event, canonicalEventPath),
    buildBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Schedule", path: "/schedule" },
      { name: event.headline || event.title, path: canonicalEventPath },
    ]),
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
      <SEO
        title={pageTitle}
        description={pageDescription}
        absoluteTitle
        canonicalPath={canonicalEventPath}
        schemaData={schemaData}
      />

      <Navigation brand={navigationBrand} />

      <main id="main-content" tabIndex={-1}>
        <div className="relative pt-[20vh] pb-[10vh] min-h-[70vh] flex flex-col justify-end px-6 xl:px-12 border-b border-white/10">
          <ResponsiveImage
            src={bgImage}
            alt={event.title}
            priority
            sizes="100vw"
            className="absolute inset-0 z-0 h-full w-full object-cover opacity-40 blur-sm brightness-50 transition-opacity duration-1000"
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

          <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col items-start">
            <button onClick={() => setLocation("/schedule")} className="btn-text-action mb-12">
              <ArrowLeft className="w-4 h-4" /> Schedule
            </button>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="font-mono text-xs uppercase tracking-[0.4em]" style={{ color: getSeriesColor(event.series) }}>
                {getSeriesLabel(event.series)}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] px-3 py-1 border border-white/20 text-white/75">
                {getStatusLabel(event.status)}
              </span>
            </div>

            <h1 className="font-display text-[clamp(3rem,8vw,8rem)] leading-[0.85] tracking-tighter uppercase mb-6 drop-shadow-2xl max-w-5xl">
              {event.headline || event.title}
            </h1>

            <div className="flex flex-wrap gap-x-8 gap-y-4 font-mono text-white/70 text-xs md:text-sm tracking-[0.2em] uppercase mb-12">
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-white/40" /> {event.venue}, {event.location}</div>
              <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-white/40" /> {event.date} // {event.time}</div>
              {event.lineup && (
                <div className="flex items-center gap-2"><Star className="w-4 h-4 text-white/40" /> {event.lineup}</div>
              )}
              {event.ticketTiers && event.ticketTiers.length > 0 && (
                <div className="flex items-center gap-2 text-white"><Ticket className="w-4 h-4" /> From ${event.ticketTiers[0].price}</div>
              )}
            </div>

            <div className="w-full sm:w-auto">
              <ConversionCTA event={event} size="lg" className="w-full sm:w-auto px-12 py-5 text-[15px]" showUrgency={true} />
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 xl:px-12 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 flex flex-col gap-16">
            {event.description && (
              <section>
                <h3 className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase mb-8 border-b border-white/10 pb-4">Transmission</h3>
                <div className="prose prose-invert prose-p:text-white/70 prose-p:leading-relaxed prose-p:font-light text-lg">
                  <p>{event.description}</p>
                </div>
              </section>
            )}

            {event.whatToExpect && event.whatToExpect.length > 0 && (
              <section>
                <h3 className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase mb-8 border-b border-white/10 pb-4">Atmosphere</h3>
                <ul className="flex flex-col gap-4">
                  {event.whatToExpect.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-4 text-white/80"><Star className="w-5 h-5 text-primary shrink-0 mt-0.5" /> {item}</li>
                  ))}
                </ul>
              </section>
            )}

            {event.faqs && event.faqs.length > 0 && (
              <section>
                <h3 className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase mb-8 border-b border-white/10 pb-4">Logistics</h3>
                <div className="flex flex-col gap-6">
                  {event.faqs.map((faq, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/5 p-6 rounded-sm">
                      <h4 className="font-bold text-white mb-2 font-mono tracking-wide text-sm">{faq.q}</h4>
                      <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-white/[0.03] border border-white/10 p-8 flex flex-col gap-6 sticky top-32">
              <h3 className="font-mono text-[10px] tracking-[0.4em] text-white/40 uppercase border-b border-white/10 pb-4">Dossier</h3>

              <div className="flex flex-col gap-4 text-sm font-mono tracking-wide text-white/80">
                {event.format && <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-white/40">Format</span><span>{event.format}</span></div>}
                {event.sound && <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-white/40">Sound</span><span>{event.sound}</span></div>}
                {event.dress && <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-white/40">Dress</span><span>{event.dress}</span></div>}
                {event.age && <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-white/40">Age</span><span>{event.age}</span></div>}
                <div className="flex justify-between pb-2"><span className="text-white/40">Location</span><span>{event.location}</span></div>
              </div>

              {event.eventNotice && (
                <div className="mt-4 p-4 bg-primary/10 border border-primary/20 text-primary text-xs leading-relaxed font-mono">
                  {event.eventNotice}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <JoinSignalSection />
    </div>
  );
}
