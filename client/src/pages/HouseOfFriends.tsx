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
import { useEffect, useState } from "react";
import { Link } from "wouter";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";
import FamilyEventPromo from "@/components/FamilyEventPromo";
import { FAMILY_PROMO } from "@/content/familyPromo";
import { useInquiry } from "@/contexts/InquiryContext";
import { getHouseOfFriendsApplicationStatus } from "@/lib/api";
import { isHouseOfFriendsCampaignHost } from "@/lib/campaignHosts";
import { ROUTES } from "@shared/routes";

const launchMoments = [
  {
    number: "01",
    label: "Founding Class",
    title: "A shared performance",
    copy: "Selected emerging artists share their first Founding Class stage together inside Chasing Sun(Sets) II.",
    icon: UsersRound,
  },
  {
    number: "02",
    label: "Professional capture",
    title: "Proof artists can use",
    copy: "Performance audio, film, and photography turn the moment into a body of work that continues after the event.",
    icon: Camera,
  },
  {
    number: "03",
    label: "Founding Class preview",
    title: "The class enters the house",
    copy: "The wider Monolith community meets the Founding Class at Castaways Beach Club on August 22.",
    icon: Sparkles,
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
    copy: "A collaborative Founding Class performance during Chasing Sun(Sets) II.",
  },
  {
    label: "Core program",
    title: "Professional Release",
    copy: "Performance film, direct master audio, photography, and approved media releases.",
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
  const [applicationsOpen, setApplicationsOpen] = useState<boolean | null>(
    null
  );
  const applicationHref =
    typeof window !== "undefined" &&
    isHouseOfFriendsCampaignHost(window.location.hostname)
      ? "/apply"
      : ROUTES.houseOfFriendsApply;

  useEffect(() => {
    let active = true;
    void getHouseOfFriendsApplicationStatus()
      .then(result => {
        if (active) setApplicationsOpen(result.acceptingApplications);
      })
      .catch(() => {
        if (active) setApplicationsOpen(false);
      });

    return () => {
      active = false;
    };
  }, []);

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
        description="House of Friends is The Monolith Project's emerging-artist platform, with a July 31 give-back pop-up at Kashmir and the Founding Class preview on August 22."
        absoluteTitle
        canonicalUrl="https://houseoffriends.vip/"
        image="/og-image.jpg"
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
            <div className="hof-launch-chip">
              <span aria-hidden="true" />
              Next pop-up / July 31, 2026
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
                    href="/events/ape-drums-kashmir-july-31-2026"
                    className="btn-pill-neutral"
                  >
                    View the July 31 Ape Drums night
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  <Link href={applicationHref} className="btn-pill-outline">
                    {applicationsOpen === true
                      ? "Apply for the Founding Class"
                      : applicationsOpen === false
                        ? "View Founding Class details"
                        : "Founding Class applications"}
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
                  <span>HOF / POP-UP 001</span>
                  <span>Kashmir residency</span>
                </div>
                <div className="hof-signal-mark" aria-hidden="true">
                  <span>H</span>
                  <span>F</span>
                </div>
                <div className="hof-signal-date">
                  <span>Friday</span>
                  <strong>31</strong>
                  <span>July / 2026</span>
                </div>
                <dl className="hof-signal-meta">
                  <div>
                    <dt>Series</dt>
                    <dd>Monolith Project Residency</dd>
                  </div>
                  <div>
                    <dt>Place</dt>
                    <dd>Kashmir / Chicago</dd>
                  </div>
                  <div>
                    <dt>Lineup</dt>
                    <dd>ERIK THE DJ + Special Guest</dd>
                  </div>
                </dl>
                <div className="hof-signal-card-foot">
                  <span>Give-Back Party</span>
                  <span>Community / Music / Opportunity</span>
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
                House of Friends begins through live signals: a July 31
                give-back pop-up at Kashmir, followed by the Founding Class
                preview on August 22. Together they turn performance into an
                artist-development system with a real stage, professional
                output, partner investment, and a community built to continue.
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
                <h2 id="hof-day-title">The Founding Class opens August 22.</h2>
              </div>
              <p>
                After the July 31 Kashmir pop-up, House of Friends brings its
                Founding Class preview inside Chasing Sun(Sets) II—uniting
                selected artists, professional capture, and the wider Monolith
                community.
              </p>
            </motion.div>

            <div className="hof-day-meta">
              <div>
                <Clock3 className="h-4 w-4" aria-hidden="true" />
                <span>Saturday / August 22, 2026</span>
              </div>
              <div>
                <Disc3 className="h-4 w-4" aria-hidden="true" />
                <span>Chasing Sun(Sets) II</span>
              </div>
              <div>
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span>Castaways / Chicago</span>
              </div>
              <div>
                <UsersRound className="h-4 w-4" aria-hidden="true" />
                <span>Lineup / TBA</span>
              </div>
            </div>

            <div className="hof-launch-grid">
              {launchMoments.map(moment => {
                const Icon = moment.icon;
                return (
                  <motion.article
                    key={moment.number}
                    className="hof-launch-card"
                    {...reveal}
                  >
                    <div className="hof-launch-card-top">
                      <span>{moment.number}</span>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <p>{moment.label}</p>
                    <h3>{moment.title}</h3>
                    <small>{moment.copy}</small>
                  </motion.article>
                );
              })}
            </div>

            <motion.div className="hof-launch-actions" {...reveal}>
              <a href="/go/lakelist" className="btn-pill-neutral">
                Get August 22 first access
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link href="/events/css-aug22" className="btn-text-action">
                View event details
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <p className="hof-launch-note">
                Artist selections and performance timing will be announced
                through official Monolith channels.
              </p>
            </motion.div>
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
              <Link href={applicationHref}>
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

        {FAMILY_PROMO ? (
          <section
            className="hof-section"
            aria-label="Next in the Monolith family"
          >
            <div className="container layout-wide px-6">
              <div className="max-w-xl">
                <FamilyEventPromo />
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
