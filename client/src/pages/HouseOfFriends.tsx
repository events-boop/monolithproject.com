import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  Camera,
  Clock3,
  Disc3,
  GraduationCap,
  Handshake,
  Radio,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import { useInquiry } from "@/contexts/InquiryContext";
import { ROUTES } from "@shared/routes";

const schedule = [
  {
    time: "11:00–12:15",
    length: "75 min",
    title: "Collaborative Set 01",
    note: "Arrival / discovery",
  },
  {
    time: "12:25–1:40",
    length: "75 min",
    title: "Collaborative Set 02",
    note: "Community pairing",
  },
  {
    time: "1:50–3:05",
    length: "75 min",
    title: "Collaborative Set 03",
    note: "Build the room",
  },
  {
    time: "3:15–4:30",
    length: "75 min",
    title: "Collaborative Set 04",
    note: "Experience meets emergence",
  },
  {
    time: "4:40–6:10",
    length: "90 min",
    title: "Founding Class B3B",
    note: "Featured three-camera performance",
    featured: true,
  },
  {
    time: "6:20–7:50",
    length: "90 min",
    title: "Monolith Sunset Builder",
    note: "Resident handoff / golden hour",
    sunset: true,
  },
  {
    time: "8:00–10:00",
    length: "120 min",
    title: "Enoo Napa",
    note: "Headline performance",
    headliner: true,
  },
];

const pathway = [
  {
    number: "01",
    icon: UsersRound,
    title: "Collaborate",
    copy: "Artists meet inside intentional B2B and B3B pairings—not isolated competition slots.",
  },
  {
    number: "02",
    icon: Camera,
    title: "Create Proof",
    copy: "Professional audio, film, photography, and social assets become part of each artist's working story.",
  },
  {
    number: "03",
    icon: GraduationCap,
    title: "Develop",
    copy: "Education, tools, feedback, and partner resources help artists move with stronger foundations.",
  },
  {
    number: "04",
    icon: Radio,
    title: "Keep Moving",
    copy: "The relationship continues through releases, future consideration, and the wider Monolith ecosystem.",
  },
];

const classBenefits = [
  {
    label: "Core program",
    title: "Featured Performance",
    copy: "A ninety-minute Founding Class B3B during Chasing Sun(Sets) II.",
  },
  {
    label: "Core program",
    title: "Professional Release",
    copy: "Three-camera film, direct master audio, photography, and approved media releases.",
  },
  {
    label: "Partner-supported",
    title: "Tools + Education",
    copy: "Equipment, software, memberships, and professional resources confirmed with Founding Partners.",
  },
  {
    label: "Ongoing pathway",
    title: "What Comes Next",
    copy: "Consideration for future performances, sessions, and opportunities throughout Monolith.",
  },
];

const partnerCategories = [
  "Presenting",
  "Equipment",
  "Education",
  "Technology",
  "Hydration",
  "Hospitality",
  "Venue",
  "Content",
];

const roadmap = [
  {
    year: "2026",
    title: "Founding Class",
    copy: "Launch the program, record the first class, and prove the operating system.",
  },
  {
    year: "2027",
    title: "House Sessions",
    copy: "Recurring sessions, an expanding catalog, and artist development across Monolith worlds.",
  },
  {
    year: "2028",
    title: "Platform",
    copy: "Scholarships, an incubator, partner-city sessions, and an annual artist showcase.",
  },
];

export default function HouseOfFriends() {
  const { openInquiry } = useInquiry();
  const shouldReduceMotion = useReducedMotion();
  const reveal = {
    initial: shouldReduceMotion ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: {
      duration: shouldReduceMotion ? 0 : 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  } as const;

  return (
    <div className="hof-page min-h-screen overflow-x-clip bg-black text-white">
      <SEO
        title="House of Friends | Artist Development by The Monolith Project"
        description="House of Friends is The Monolith Project's emerging-artist platform for collaboration, professional content, education, and future opportunity."
        absoluteTitle
        canonicalPath={ROUTES.houseOfFriends}
        noIndex
      />

      <Navigation variant="dark" brand="monolith" />

      <main id="main-content" tabIndex={-1}>
        <section className="hof-hero" aria-labelledby="hof-title">
          <div className="hof-etch-field" aria-hidden="true">
            <span className="hof-etch-word">HOUSE OF FRIENDS</span>
            <span className="hof-etch-axis hof-etch-axis-a" />
            <span className="hof-etch-axis hof-etch-axis-b" />
            <span className="hof-etch-house" />
            <span className="hof-etch-table" />
            <span className="hof-etch-door" />
            <span className="hof-etch-signal" />
          </div>

          <div className="container layout-wide relative z-10 px-6">
            <div className="hof-draft-chip">
              <span aria-hidden="true" />
              Working draft / Internal preview
            </div>

            <div className="hof-hero-grid">
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <p className="hof-kicker">
                  Artist development / Founding Class 2026
                </p>
                <h1 id="hof-title" className="hof-hero-title">
                  <span>House</span>
                  <span>of Friends</span>
                </h1>
                <p className="hof-hero-thesis">
                  We are not looking for a winner.
                  <strong> We are building a pathway.</strong>
                </p>
                <p className="hof-hero-copy">
                  A new Monolith platform connecting emerging artists with
                  collaborative performance, professional content, education,
                  tools, and what comes next.
                </p>

                <div className="hof-hero-actions">
                  <Link
                    href={ROUTES.houseOfFriendsApply}
                    className="btn-pill-neutral"
                  >
                    Apply for the Founding Class
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <button
                    type="button"
                    className="btn-pill-outline"
                    onClick={() => openInquiry("sponsor")}
                  >
                    Become a Founding Partner
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>

              <motion.aside
                className="hof-signal-card"
                initial={
                  shouldReduceMotion ? false : { opacity: 0, scale: 0.96 }
                }
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.9,
                  delay: 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                aria-label="House of Friends launch details"
              >
                <div className="hof-signal-card-top">
                  <span>HOF / 001</span>
                  <span>Launch signal</span>
                </div>
                <div className="hof-signal-mark" aria-hidden="true">
                  <span>H</span>
                  <span>F</span>
                </div>
                <div className="hof-signal-date">
                  <span>Saturday</span>
                  <strong>22</strong>
                  <span>August / 2026</span>
                </div>
                <dl className="hof-signal-meta">
                  <div>
                    <dt>Inside</dt>
                    <dd>Chasing Sun(Sets) II</dd>
                  </div>
                  <div>
                    <dt>Place</dt>
                    <dd>Castaways / Chicago</dd>
                  </div>
                  <div>
                    <dt>First Class</dt>
                    <dd>Three selected artists</dd>
                  </div>
                </dl>
                <div className="hof-signal-card-foot">
                  <span>The Monolith Project</span>
                  <span>Opportunity / Community / Proof</span>
                </div>
              </motion.aside>
            </div>
          </div>
        </section>

        <section
          className="hof-signal-strip"
          aria-label="House of Friends mission"
        >
          <div className="container layout-wide px-6">
            {[
              "Create opportunities",
              "Build community",
              "Invest in artists",
              "Continue the story",
            ].map((item, index) => (
              <div key={item}>
                <span>0{index + 1}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="hof-section hof-intro" id="vision">
          <div className="container layout-wide px-6">
            <motion.div className="hof-section-heading" {...reveal}>
              <p className="hof-kicker">01 / The idea</p>
              <h2>A house drawn around opportunity.</h2>
              <p>
                House of Friends begins with one event, but it is designed to
                outlive it. The launch transforms a daytime lineup into an
                artist-development system with a real stage, professional
                output, partner investment, and a community that continues after
                August 22.
              </p>
            </motion.div>

            <motion.blockquote className="hof-manifesto" {...reveal}>
              <span aria-hidden="true">“</span>
              <p>
                The goal is not to discover who beats everyone else. The goal is
                to discover what becomes possible when the right people build
                together.
              </p>
            </motion.blockquote>

            <div className="hof-pathway-grid">
              {pathway.map(item => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.number}
                    className="hof-pathway-card"
                    {...reveal}
                  >
                    <div>
                      <span>{item.number}</span>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.copy}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="hof-section hof-architecture-section"
          aria-labelledby="hof-architecture-title"
        >
          <div className="container layout-wide px-6">
            <motion.div
              className="hof-section-heading hof-section-heading-split"
              {...reveal}
            >
              <div>
                <p className="hof-kicker">02 / The ecosystem</p>
                <h2 id="hof-architecture-title">
                  One platform. Many rooms. One pathway.
                </h2>
              </div>
              <p>
                House of Friends does not belong beneath one event series. It
                moves through the worlds created by The Monolith Project.
              </p>
            </motion.div>

            <motion.div className="hof-architecture" {...reveal}>
              <div className="hof-arch-parent">
                <span>The parent platform</span>
                <strong>The Monolith Project</strong>
              </div>
              <div
                className="hof-arch-worlds"
                aria-label="Monolith event worlds"
              >
                <div>
                  <span>Daylight</span>
                  <strong>Sun(Sets)</strong>
                </div>
                <div>
                  <span>After dark</span>
                  <strong>Untold Story</strong>
                </div>
                <div>
                  <span>Still forming</span>
                  <strong>Future Worlds</strong>
                </div>
              </div>
              <div className="hof-arch-bridge" aria-hidden="true">
                <span />
              </div>
              <div className="hof-arch-house">
                <span>Artist development across every room</span>
                <strong>House of Friends</strong>
                <p>
                  Performance · Education · Content · Community · Future
                  bookings
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section
          className="hof-section hof-day"
          id="launch-day"
          aria-labelledby="hof-day-title"
        >
          <div className="container layout-wide px-6">
            <motion.div
              className="hof-section-heading hof-section-heading-split"
              {...reveal}
            >
              <div>
                <p className="hof-kicker">03 / August 22</p>
                <h2 id="hof-day-title">The day builds like a story.</h2>
              </div>
              <p>
                Six pre-headliner blocks. Ten-minute protected transitions. The
                Founding Class is the featured late-afternoon payoff—not simply
                the first opener.
              </p>
            </motion.div>

            <div className="hof-day-meta">
              <div>
                <Clock3 className="h-4 w-4" aria-hidden="true" />
                <span>11:00 AM–10:00 PM</span>
              </div>
              <div>
                <Disc3 className="h-4 w-4" aria-hidden="true" />
                <span>Chasing Sun(Sets) II</span>
              </div>
              <div>
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>Castaways / Chicago</span>
              </div>
            </div>

            <ol className="hof-timeline">
              {schedule.map((set, index) => (
                <motion.li
                  key={`${set.time}-${set.title}`}
                  className="hof-timeline-row"
                  data-featured={set.featured || undefined}
                  data-sunset={set.sunset || undefined}
                  data-headliner={set.headliner || undefined}
                  {...reveal}
                >
                  <span className="hof-timeline-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <time>{set.time}</time>
                  <span className="hof-timeline-length">{set.length}</span>
                  <div>
                    <h3>{set.title}</h3>
                    <p>{set.note}</p>
                  </div>
                  <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                </motion.li>
              ))}
            </ol>

            <p className="hof-working-note">
              Working program subject to artist contracts, technical advancing,
              and public announcement clearance.
            </p>
          </div>
        </section>

        <section
          className="hof-section hof-class"
          id="artist-program"
          aria-labelledby="hof-class-title"
        >
          <div className="container layout-wide px-6">
            <motion.div className="hof-class-hero" {...reveal}>
              <p className="hof-kicker">04 / The first three</p>
              <span className="hof-class-count" aria-hidden="true">
                03
              </span>
              <div>
                <h2 id="hof-class-title">The Founding Class of 2026.</h2>
                <p>
                  Three emerging artists selected for a shared performance, a
                  professional body of work, and a relationship designed to
                  continue beyond one booking.
                </p>
              </div>
            </motion.div>

            <div className="hof-benefit-grid">
              {classBenefits.map((benefit, index) => (
                <motion.article
                  key={benefit.title}
                  className="hof-benefit-card"
                  {...reveal}
                >
                  <div>
                    <span>{benefit.label}</span>
                    <strong>0{index + 1}</strong>
                  </div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.copy}</p>
                </motion.article>
              ))}
            </div>

            <motion.div className="hof-applicant-note" {...reveal}>
              <div>
                <p className="hof-kicker">The wider house</p>
                <h3>Every application should create value.</h3>
              </div>
              <p>
                Artist registration now keeps the full submission together:
                profile, bio, current photo, and one DJ set inside a private
                applicant workspace. No application payment is collected.
              </p>
              <Link href={ROUTES.houseOfFriendsApply}>
                Applications / Enter the house
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </motion.div>
          </div>
        </section>

        <section
          className="hof-section hof-partners"
          id="founding-partners"
          aria-labelledby="hof-partners-title"
        >
          <div className="container layout-wide px-6">
            <motion.div
              className="hof-section-heading hof-section-heading-split"
              {...reveal}
            >
              <div>
                <p className="hof-kicker">05 / Founding Partners</p>
                <h2 id="hof-partners-title">
                  Support the pathway—not a prize table.
                </h2>
              </div>
              <p>
                Partners help fund performance, tools, education, hospitality,
                and professional releases through defined categories and
                measurable deliverables.
              </p>
            </motion.div>

            <div className="hof-partner-layout">
              <motion.div className="hof-partner-letter" {...reveal}>
                <span className="hof-letter-label">
                  Founding Partner Invitation / Excerpt
                </span>
                <blockquote>
                  “We believe the strongest communities are built by creating
                  opportunities for others.”
                </blockquote>
                <p>
                  House of Friends invites a select group of organizations to
                  help introduce a recurring artist-development platform built
                  around collaboration, creativity, and direct investment in
                  emerging artists.
                </p>
                <button
                  type="button"
                  className="btn-pill-neutral"
                  onClick={() => openInquiry("sponsor")}
                >
                  Start a Founding Partner Conversation
                  <Handshake className="h-4 w-4" aria-hidden="true" />
                </button>
              </motion.div>

              <div className="hof-partner-categories">
                {partnerCategories.map((category, index) => (
                  <motion.div key={category} {...reveal}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{category}</strong>
                    <small>Official Partner</small>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="hof-section hof-roadmap"
          aria-labelledby="hof-roadmap-title"
        >
          <div className="container layout-wide px-6">
            <motion.div className="hof-section-heading" {...reveal}>
              <p className="hof-kicker">06 / Beyond one day</p>
              <h2 id="hof-roadmap-title">The launch is the first proof.</h2>
            </motion.div>

            <div className="hof-roadmap-grid">
              {roadmap.map((phase, index) => (
                <motion.article key={phase.year} {...reveal}>
                  <span>{phase.year}</span>
                  <div className="hof-roadmap-node" aria-hidden="true">
                    <i />
                  </div>
                  <p>Phase 0{index + 1}</p>
                  <h3>{phase.title}</h3>
                  <small>{phase.copy}</small>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="hof-section hof-closing"
          aria-labelledby="hof-closing-title"
        >
          <div className="container layout-wide px-6">
            <motion.div className="hof-closing-card" {...reveal}>
              <div className="hof-closing-etch" aria-hidden="true">
                HOUSE / 001
              </div>
              <p className="hof-kicker">The Monolith Project presents</p>
              <h2 id="hof-closing-title">
                Help build the first House of Friends.
              </h2>
              <p>
                Launching August 22, 2026, inside Chasing Sun(Sets) II at
                Castaways Beach Club.
              </p>
              <div>
                <button
                  type="button"
                  className="btn-pill-neutral"
                  onClick={() => openInquiry("sponsor")}
                >
                  Founding Partner Inquiry
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <Link href={ROUTES.sunsets} className="btn-text-action">
                  Explore Chasing Sun(Sets)
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
