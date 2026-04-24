import { lazy, Suspense, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import SectionDivider from "@/components/SectionDivider";
import ViewportLazy from "@/components/ViewportLazy";
import { usePublicSiteDataVersion } from "@/lib/siteData";
import { Skeleton } from "@/components/ui/skeleton";
import ConversionCTA from "@/components/ConversionCTA";
import {
  getEventVenueLabel,
  getExperienceEvent,
  getSeriesExperienceEvent,
  getSeriesLabel,
} from "@/lib/siteExperience";
import { getEventDetailsHref } from "@/lib/cta";
import { CHASING_SUNSETS_DROP_URL } from "@/lib/dropLinks";

const FeaturedRecap = lazy(() => import("@/components/FeaturedRecap"));
const ScheduleSection = lazy(() => import("@/components/ScheduleSection"));
const FeaturedSets = lazy(() => import("@/components/FeaturedSets"));
const PartnershipMarquee = lazy(() => import("@/components/PartnershipMarquee"));
import SEO from "@/components/SEO";
import { buildSitewideIdentitySchema } from "@/lib/schema";
import { LIVE_RED, MONOLITH_ORANGE, SUN_SETS_GOLD } from "@/lib/brand";

function getStatusLabel(status?: string) {
  if (status === "on-sale") return "ON SALE";
  if (status === "coming-soon") return "COMING SOON";
  if (status === "sold-out") return "SOLD OUT";
  return "PAST";
}

export default function Home() {
  usePublicSiteDataVersion();
  const featuredMoment = getExperienceEvent("hero");
  const chasingSeasonEvent = getSeriesExperienceEvent("chasing-sunsets", "hero");
  const untoldMoment = getSeriesExperienceEvent("untold-story", "hero");
  const featuredMomentHref = getEventDetailsHref(featuredMoment);
  const featuredMomentSummary =
    featuredMoment?.description ||
    featuredMoment?.experienceIntro ||
    "The next Monolith show, ticket window, and venue details live here first.";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden bg-noise bg-scanlines">
      <SEO
        title="Monolith Project | Chicago House & Techno Event Series & Radio Show"
        description="The Monolith Project is a Chicago-rooted music company producing house music events, open-air Chasing Sun(Sets) gatherings, after-dark Untold Story rooms, and artist-led radio."
        schemaData={buildSitewideIdentitySchema()}
      />

      {/* Ambient static background glows for depth */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute -left-[8vw] -top-[10vh] h-[42rem] w-[42rem] rounded-full opacity-[0.12]"
          style={{ background: "radial-gradient(circle, var(--scene-glow) 0%, transparent 62%)" }}
        />
        <div
          className="absolute -right-[8vw] bottom-[-16vh] h-[34rem] w-[34rem] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 68%)" }}
        />
      </div>
      <Navigation />

      <main id="main-content" tabIndex={-1}>
        <HeroSection />

        <section id="campaigns" className="relative z-10 border-y border-white/10 bg-[#080808] py-14 md:py-20">
          <div className="container layout-wide px-6">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5 md:mb-10">
              <span className="font-mono text-[11px] uppercase tracking-[0.35em] text-primary">Next Show / Featured Event</span>
              {featuredMoment?.status ? (
                <span className="border border-white/20 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/75">
                  {getStatusLabel(featuredMoment.status)}
                </span>
              ) : null}
            </div>

            {featuredMoment ? (
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
                <div>
                  <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.28em] text-white/60">
                    {getSeriesLabel(featuredMoment.series)}
                  </span>
                  <h2 className="font-display text-[clamp(2.2rem,5vw,4.8rem)] leading-[0.9] uppercase tracking-tight text-white">
                    {featuredMoment.headline || featuredMoment.title}
                  </h2>
                  <p className="mt-4 font-display text-xl text-[#F4D7A1] md:text-2xl">
                    Tickets, date, and venue details for the next Monolith show.
                  </p>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
                    {featuredMomentSummary}
                  </p>
                </div>

                <div className="border border-white/15 bg-white/[0.02] p-5 md:p-6">
                  <dl className="grid grid-cols-2 gap-4 border-b border-white/10 pb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                    <div>
                      <dt className="text-white/40">Date</dt>
                      <dd className="mt-1 text-white">{featuredMoment.date}</dd>
                    </div>
                    <div>
                      <dt className="text-white/40">Time</dt>
                      <dd className="mt-1 text-white">{featuredMoment.time}</dd>
                    </div>
                    <div>
                      <dt className="text-white/40">Venue</dt>
                      <dd className="mt-1 text-white">{featuredMoment.venue}</dd>
                    </div>
                    <div>
                      <dt className="text-white/40">City</dt>
                      <dd className="mt-1 text-white">{featuredMoment.location}</dd>
                    </div>
                  </dl>
                  <p className="mt-4 text-sm text-white/65">{getEventVenueLabel(featuredMoment)}</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                    <ConversionCTA event={featuredMoment} size="md" showUrgency={false} />
                    <Link href={featuredMomentHref} className="btn-pill-outline btn-pill-compact w-full justify-center sm:w-auto">
                      View Event Details <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-white/70">Featured event details are being updated.</p>
            )}
          </div>
        </section>

        <section className="relative z-10 border-b border-white/10 bg-[#0d0d0d] py-14 md:py-20">
          <div className="container layout-wide px-6">
            <div className="mb-8 border-b border-white/10 pb-5 md:mb-10">
              <span className="block font-mono text-[11px] uppercase tracking-[0.35em] text-[#E8B86D]">
                Chasing Sun(Sets) Season 2026
              </span>
            </div>
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <h2 className="font-display text-[clamp(2.3rem,5vw,5rem)] leading-[0.9] uppercase tracking-tight text-white">
                  Sign up for the next open-air drop.
                </h2>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
                  Chasing Sun(Sets) is Monolith&apos;s open-air series: house music by the water, headline moments at golden hour, and a Chicago crowd that comes for the music first.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <a
                    href={CHASING_SUNSETS_DROP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill-neutral btn-pill-wide w-full justify-center sm:w-auto"
                  >
                    Sign Up for Drops
                  </a>
                  <Link href="/chasing-sunsets" className="btn-pill-outline btn-pill-wide w-full justify-center sm:w-auto">
                    View Chasing Sun(Sets)
                  </Link>
                  <Link href="/schedule" className="btn-text-action">
                    See Upcoming Shows
                  </Link>
                </div>
              </div>

              <div className="border border-white/15 bg-white/[0.02] p-5 md:p-6">
                <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-[#E8B86D]">
                  Season Focus
                </span>
                <h3 className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] leading-[0.92] uppercase tracking-tight text-white">
                  {chasingSeasonEvent?.headline || chasingSeasonEvent?.title || "Next Chasing Sun(Sets) Chapter"}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/70">
                  {chasingSeasonEvent?.description ||
                    chasingSeasonEvent?.experienceIntro ||
                    "The next Chasing Sun(Sets) chapter is where the summer season starts to take shape."}
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/70">
                  <div>
                    <dt className="text-white/40">Date</dt>
                    <dd className="mt-1 text-white">{chasingSeasonEvent?.date || "Coming Soon"}</dd>
                  </div>
                  <div>
                    <dt className="text-white/40">Location</dt>
                    <dd className="mt-1 text-white">
                      {chasingSeasonEvent ? getEventVenueLabel(chasingSeasonEvent) : "Chicago"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-white/40">Status</dt>
                    <dd className="mt-1 text-white">{getStatusLabel(chasingSeasonEvent?.status)}</dd>
                  </div>
                  <div>
                    <dt className="text-white/40">Lineup</dt>
                    <dd className="mt-1 text-white">{chasingSeasonEvent?.lineup || "Drop Pending"}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>

        <div id="season" className="bg-[#F4ECD9] transition-colors duration-500 relative z-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-24 z-20"
            style={{ background: "linear-gradient(to bottom, rgba(17,17,17,0.35), transparent)" }}
          />
          <SectionDivider number="01" label="Upcoming Shows" dark={false} glow={SUN_SETS_GOLD} />
          <ViewportLazy minHeightClassName="min-h-[780px]" rootMargin="0px 0px">
            <Suspense fallback={<Skeleton className="h-[780px] w-full opacity-10" />}>
              <ScheduleSection />
            </Suspense>
          </ViewportLazy>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 z-20"
            style={{ background: "linear-gradient(to top, rgba(12,12,12,0.4), transparent)" }}
          />
        </div>

        <section id="series" className="relative z-10 border-b border-white/10 bg-[#111111] py-14 md:py-20">
          <div className="container layout-wide px-6">
            <div className="mb-8 border-b border-white/10 pb-5 md:mb-10">
              <span className="block font-mono text-[11px] uppercase tracking-[0.35em] text-[#E8B86D]">
                One platform, multiple series.
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <Link href="/chasing-sunsets" className="group border border-white/10 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04] md:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">Open Air</p>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">Chasing Sun(Sets)</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Open-air house music gatherings shaped by golden hour, lakefront energy, and community.
                </p>
              </Link>
              <Link href="/story" className="group border border-white/10 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04] md:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">After Dark</p>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">Untold Story</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  After-dark rooms built for deeper sound, immersive dancefloors, and artist-led moments.
                </p>
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                  {untoldMoment?.date || "Current indoor event details live on the story page"}
                </p>
              </Link>
              <Link href="/radio" className="group border border-white/10 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04] md:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">Radio</p>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">Radio</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Mixes, conversations, and cultural memory from the artists shaping the sound.
                </p>
              </Link>
              <Link href="/partners" className="group border border-white/10 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04] md:p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">Collaborations</p>
                <h3 className="mt-3 font-display text-2xl uppercase text-white">Partners</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  Brand and venue collaborations built around real audience energy, content, and community.
                </p>
              </Link>
            </div>
          </div>
        </section>

        <section className="relative z-10 border-b border-white/10 bg-[#111111] py-10 md:py-14">
          <div className="container layout-wide px-6">
            <div className="mb-6">
              <span className="block font-mono text-[11px] uppercase tracking-[0.35em] text-primary">
                Past nights / Proof points
              </span>
            </div>
            <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-black/45 p-4 md:p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">What It Is</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">Chicago-rooted music company</p>
              </div>
              <div className="bg-black/45 p-4 md:p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">Show Types</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  Open-air, rooftop, and after-dark chapters
                </p>
              </div>
              <div className="bg-black/45 p-4 md:p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">Audience Reach</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">1M+ organic impressions across past event content</p>
              </div>
              <div className="bg-black/45 p-4 md:p-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/70">Attendance</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">
                  6,000+ community attendance across flagship open-air moments
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="bg-[#0c0c0c] relative z-10 transition-colors duration-500">
          <SectionDivider id="featured" number="02" label="Past Nights" glow={`${LIVE_RED}14`} />
          <ViewportLazy minHeightClassName="min-h-[620px]" rootMargin="0px 0px">
            <Suspense fallback={<Skeleton className="h-[620px] w-full opacity-10" />}>
              <FeaturedRecap />
            </Suspense>
          </ViewportLazy>
        </div>

        <div id="showcase" className="bg-black relative z-10">
          <SectionDivider number="03" label="Radio" glow={MONOLITH_ORANGE} dense />
          <ViewportLazy minHeightClassName="min-h-[420px]" rootMargin="0px 0px">
            <Suspense fallback={<Skeleton className="h-[420px] w-full opacity-10" />}>
              <FeaturedSets />
            </Suspense>
          </ViewportLazy>
        </div>

        <section id="community" className="relative z-10 border-y border-white/10 bg-[#0c0b0a] py-16 md:py-20">
          <div className="container layout-wide px-6">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
              <div>
                <span className="font-mono text-[11px] tracking-[0.35em] uppercase font-bold block mb-4 text-primary">
                  Partners / Contact
                </span>
                <h2 className="font-display text-[2.3rem] leading-[0.9] tracking-tight uppercase md:text-[3.4rem] mb-4 text-white">
                  Bring your venue, brand, or idea into the room.
                </h2>
                <p className="max-w-2xl text-sm md:text-base leading-relaxed text-white/70">
                  Monolith works with venues, sponsors, artists, media, and cultural partners who want to build real audience energy around shows, content, and community.
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/[0.02] p-5 md:p-6">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link href="/partners" className="btn-pill btn-pill-compact w-full justify-center">
                    Partner With Us <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link href="/contact" className="btn-pill-outline btn-pill-compact w-full justify-center">
                    Contact <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ViewportLazy minHeightClassName="min-h-[120px]" rootMargin="0px 0px">
          <Suspense fallback={<Skeleton className="h-[120px] w-full opacity-10" />}>
            <PartnershipMarquee />
          </Suspense>
        </ViewportLazy>
      </main>
    </div>
  );
}
