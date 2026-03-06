import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const distRoot = path.join(projectRoot, "dist", "public");
const assetsSource = path.join(projectRoot, "client", "public", "images");

const turnstileSiteKey = process.env.PUBLIC_TURNSTILE_SITE_KEY ?? "";
const siteOrigin = "https://www.monolithproject.com";
const defaultSocialImagePath = "/images/chasing-sunsets-7.jpg";

const imageMetadata = {
  "chasing-sunsets-1.jpg": {
    width: 1024,
    height: 682,
    alt: "Crowd gathered at Chasing Sun(Sets) during golden hour."
  },
  "chasing-sunsets-2.jpg": {
    width: 682,
    height: 1024,
    alt: "Portrait from the Chasing Sun(Sets) event series."
  },
  "chasing-sunsets-3.jpg": {
    width: 1024,
    height: 682,
    alt: "DJ performance scene from Chasing Sun(Sets)."
  },
  "chasing-sunsets-4.jpg": {
    width: 1024,
    height: 682,
    alt: "Evening crowd and lighting design at Chasing Sun(Sets)."
  },
  "chasing-sunsets-5.jpg": {
    width: 1024,
    height: 682,
    alt: "Community dance moment during a Monolith Project set."
  },
  "chasing-sunsets-6.jpg": {
    width: 1024,
    height: 682,
    alt: "Event atmosphere with warm lighting and audience movement."
  },
  "chasing-sunsets-7.jpg": {
    width: 1024,
    height: 682,
    alt: "Signature Chasing Sun(Sets) visual with sunset crowd energy."
  },
  "chris-idh-radio.jpg": {
    width: 870,
    height: 894,
    alt: "Radio visual artwork for a Monolith Project show."
  },
  "deron-press.jpg": {
    width: 819,
    height: 1024,
    alt: "Press portrait image from Monolith Project media assets."
  },
  "juany-bravo-press.jpg": {
    width: 720,
    height: 720,
    alt: "Artist portrait used in Monolith Project press materials."
  },
  "juany-deron-flyer.png": {
    width: 562,
    height: 586,
    alt: "Event flyer artwork for a Monolith Project collaboration."
  },
  "lazare-carbon-center.png": {
    width: 743,
    height: 665,
    alt: "Lazare Carbon Center promotional visual for Monolith Project."
  }
};

function getImageDimensionAttributes(image) {
  const metadata = imageMetadata[image];
  if (!metadata) {
    return "";
  }

  return ` width="${metadata.width}" height="${metadata.height}"`;
}

function getImageAlt(image, fallbackAlt) {
  return imageMetadata[image]?.alt || fallbackAlt;
}

function getCanonicalUrl(slug) {
  return `${siteOrigin}${slug ? `/${slug}` : "/"}`;
}

const pages = [
  {
    slug: "",
    title: "Monolith Project",
    description:
      "Intentional, community-focused events centered on music, togetherness, and culture.",
    eyebrow: "Monolith Project",
    heroTitle: "A cultural events platform built around sound, atmosphere, and community.",
    heroCopy:
      "Monolith Project creates golden-hour celebrations, immersive radio moments, and late-night gatherings with a sharper point of view than the average event page.",
    lead:
      "Use this as the launchpad for ticketing, partnerships, and direct audience growth while POSH continues to handle transactional event discovery.",
    ctas: [
      { href: "/contact", label: "Book Or Collaborate" },
      { href: "/events", label: "Explore Events" }
    ],
    content: `
      <section class="panel panel-grid">
        <div>
          <p class="section-kicker">What this site should do</p>
          <h2>Own the brand layer.</h2>
          <p>This site should not compete with ticketing platforms. It should deepen trust, centralize your story, and give people a cleaner path to contact, listen, and return.</p>
        </div>
        <div class="card-list">
          <article class="card">
            <h3>Events</h3>
            <p>Use editorial landing pages instead of one-off flyers when you need to build anticipation.</p>
          </article>
          <article class="card">
            <h3>Radio</h3>
            <p>Frame the radio show as an extension of the live experience, not a side project.</p>
          </article>
          <article class="card">
            <h3>Press</h3>
            <p>Keep a dedicated path for collaborations, media requests, and branded partnerships.</p>
          </article>
        </div>
      </section>
      <section class="panel">
        <div class="section-head">
          <div>
            <p class="section-kicker">Featured Images</p>
            <h2>Visual energy already exists. The site just needs structure.</h2>
          </div>
          <a class="link-arrow" href="/gallery">View full gallery</a>
        </div>
        <div class="gallery-grid gallery-grid-home">
          ${[
            "chasing-sunsets-7.jpg",
            "lazare-carbon-center.png",
            "juany-deron-flyer.png",
            "chris-idh-radio.jpg"
          ]
            .map(
              (image) => `
                <figure class="gallery-card">
                  <img src="/images/${image}" alt="${getImageAlt(
                    image,
                    "Monolith Project image"
                  )}" loading="lazy"${getImageDimensionAttributes(image)} />
                </figure>
              `
            )
            .join("")}
        </div>
      </section>
      <section class="panel panel-split">
        <div>
          <p class="section-kicker">Stay Close</p>
          <h2>Build your owned audience now.</h2>
          <p>Use the email list for drops, radio announcements, and event updates without depending entirely on third-party platforms.</p>
        </div>
        ${renderJoinForm("home")}
      </section>
    `
  },
  {
    slug: "events",
    title: "Events",
    description: "Event programming, atmosphere, and launch-ready event structure.",
    eyebrow: "Events",
    heroTitle: "Turn each event into a chapter, not a disposable post.",
    heroCopy:
      "The events page should function as both archive and anticipation engine. Each listing should carry story, imagery, and a clean conversion path.",
    lead:
      "This scaffold gives you a dedicated destination for future event cards and POSH links.",
    ctas: [
      { href: "/contact", label: "Submit Inquiry" },
      { href: "/", label: "Back Home" }
    ],
    content: `
      <section class="panel card-list">
        <article class="card">
          <h3>Chasing Sun(Sets)</h3>
          <p>Golden-hour energy, intentional pacing, and emotionally legible visual identity.</p>
        </article>
        <article class="card">
          <h3>Night Sessions</h3>
          <p>Immersive room design, deeper programming, and a more intimate narrative arc.</p>
        </article>
        <article class="card">
          <h3>Future Event Pattern</h3>
          <p>Add each event with a title, date, venue, description, hero image, and external ticket link.</p>
        </article>
      </section>
    `
  },
  {
    slug: "radio",
    title: "Radio",
    description: "Radio programming and recurring show identity.",
    eyebrow: "Radio",
    heroTitle: "Treat the radio show like a living extension of the events.",
    heroCopy:
      "Radio should feel like continuity between nights out. It gives the audience a reason to stay close between gatherings.",
    lead: "This page is the staging ground for mixes, guest features, and platform links.",
    ctas: [
      { href: "/contact", label: "Pitch A Collaboration" },
      { href: "/gallery", label: "See the visuals" }
    ],
    content: `
      <section class="panel panel-grid">
        <figure class="feature-image">
          <img src="/images/chris-idh-radio.jpg" alt="${getImageAlt(
            "chris-idh-radio.jpg",
            "Radio show visual"
          )}" loading="lazy"${getImageDimensionAttributes("chris-idh-radio.jpg")} />
        </figure>
        <div>
          <p class="section-kicker">Programming Direction</p>
          <h2>Make the archive matter.</h2>
          <p>Each episode should eventually include a short editorial description, guest details, and outbound listening links.</p>
          <p>Use this route to connect live audience energy with the broader Monolith ecosystem.</p>
        </div>
      </section>
    `
  },
  {
    slug: "gallery",
    title: "Gallery",
    description: "Photography, flyers, and campaign visuals.",
    eyebrow: "Gallery",
    heroTitle: "The visual system is already strong enough to support a premium site.",
    heroCopy:
      "Use the gallery as proof of atmosphere. It should feel curated, not like a dump of leftover assets.",
    lead: "These are the current local assets available in the repo.",
    ctas: [
      { href: "/events", label: "See event direction" },
      { href: "/contact", label: "Start a conversation" }
    ],
    content: `
      <section class="panel">
        <div class="gallery-grid">
          ${[
            "chasing-sunsets-1.jpg",
            "chasing-sunsets-2.jpg",
            "chasing-sunsets-3.jpg",
            "chasing-sunsets-4.jpg",
            "chasing-sunsets-5.jpg",
            "chasing-sunsets-6.jpg",
            "chasing-sunsets-7.jpg",
            "chris-idh-radio.jpg",
            "deron-press.jpg",
            "juany-bravo-press.jpg",
            "juany-deron-flyer.png",
            "lazare-carbon-center.png"
          ]
            .map(
              (image) => `
                <figure class="gallery-card">
                  <img src="/images/${image}" alt="${getImageAlt(
                    image,
                    "Monolith Project gallery image"
                  )}" loading="lazy"${getImageDimensionAttributes(image)} />
                </figure>
              `
            )
            .join("")}
        </div>
      </section>
    `
  },
  {
    slug: "about",
    title: "About",
    description: "About Monolith Project.",
    eyebrow: "About",
    heroTitle: "Built around intention, not noise.",
    heroCopy:
      "Monolith Project works best when the site speaks in the same tone as the events: precise, warm, and editorial rather than generic.",
    lead:
      "Use this route for the founding story, curatorial point of view, and the kind of collaborations you want more of.",
    ctas: [
      { href: "/contact", label: "Get in touch" },
      { href: "/radio", label: "Explore radio" }
    ],
    content: `
      <section class="panel panel-grid">
        <div>
          <p class="section-kicker">Positioning</p>
          <h2>A platform for events, media, and culture.</h2>
          <p>This should read less like a nightlife listing and more like the front door to a growing cultural brand.</p>
        </div>
        <div class="card-list">
          <article class="card">
            <h3>Intentional Events</h3>
            <p>Atmosphere and sequencing should feel authored.</p>
          </article>
          <article class="card">
            <h3>Owned Channels</h3>
            <p>The site and mailing list reduce platform dependence over time.</p>
          </article>
          <article class="card">
            <h3>Long-Term Brand Value</h3>
            <p>This is the foundation for press, partnerships, and future archives.</p>
          </article>
        </div>
      </section>
    `
  },
  {
    slug: "contact",
    title: "Contact",
    description: "Contact Monolith Project for bookings, press, and collaborations.",
    eyebrow: "Contact",
    heroTitle: "Bookings, partnerships, and press start here.",
    heroCopy:
      "The contact flow should be simple, fast, and trustworthy. One clear form, real validation, and reliable email delivery.",
    lead: "This route is wired to the Netlify function scaffold in `/api/contact`.",
    ctas: [
      { href: "/", label: "Return Home" },
      { href: "/events", label: "See Event Direction" }
    ],
    content: `
      <section class="panel panel-split">
        <div>
          <p class="section-kicker">Use Cases</p>
          <h2>Make the inquiry path obvious.</h2>
          <p>Bookings, branded work, media requests, and creative partnerships should all land in one reliable operational lane first.</p>
        </div>
        ${renderContactForm()}
      </section>
    `
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "Privacy policy for Monolith Project.",
    eyebrow: "Privacy Policy",
    heroTitle: "Privacy Policy",
    heroCopy:
      "This page explains how Monolith Project collects, uses, and protects personal information submitted through this website.",
    lead: "If you have questions about privacy requests, contact hello@monolithproject.com.",
    ctas: [{ href: "/contact", label: "Questions" }],
    content: `
      <section class="panel prose-panel">
        <h2>Information we collect</h2>
        <p>Monolith Project collects information you submit directly through contact and mailing-list forms, including name, email address, subject line, and message content.</p>
        <p>Form submissions may include technical metadata such as request timestamps and hashed IP data used for abuse prevention and service reliability.</p>
        <h2>How we use this information</h2>
        <p>We use submitted information to respond to inquiries, manage event communication, and deliver updates when you opt in to receive them.</p>
        <p>We do not sell personal information. We share data only with operational providers required to run this site and communicate with you.</p>
        <h2>Contact and requests</h2>
        <p>To request access, correction, or deletion of your submitted information, email hello@monolithproject.com.</p>
      </section>
    `
  },
  {
    slug: "terms",
    title: "Terms of Use",
    description: "Terms of use for Monolith Project.",
    eyebrow: "Terms of Use",
    heroTitle: "Terms of Use",
    heroCopy:
      "These terms describe the rules for using the Monolith Project website and related content.",
    lead: "By using this site, you agree to these terms and all applicable laws.",
    ctas: [{ href: "/contact", label: "Contact" }],
    content: `
      <section class="panel prose-panel">
        <h2>Acceptable use</h2>
        <p>You agree not to misuse this site, attempt unauthorized access, or interfere with site operations, forms, or infrastructure.</p>
        <h2>Intellectual property</h2>
        <p>All site content, branding, photography, and written material are owned by Monolith Project or used with permission unless otherwise stated.</p>
        <h2>External links and liability</h2>
        <p>This site may link to external platforms. Monolith Project is not responsible for the content or policies of third-party services.</p>
        <p>Site content is provided for informational purposes without warranties of any kind.</p>
      </section>
    `
  },
  {
    slug: "404",
    title: "Not Found",
    description: "Page not found.",
    eyebrow: "404",
    heroTitle: "That page does not exist.",
    heroCopy:
      "The route you asked for is not available in this build. Use the main navigation to get back into the site.",
    lead: "A real 404 route keeps staging and production behavior honest.",
    ctas: [
      { href: "/", label: "Go Home" },
      { href: "/contact", label: "Contact Monolith" }
    ],
    content: `
      <section class="panel prose-panel">
        <h2>Route not found</h2>
        <p>This is the dedicated 404 page for the generated site build.</p>
      </section>
    `
  }
];

function renderJoinForm(source) {
  return `
    <form class="form-panel" data-form-endpoint="/api/join" data-form-name="join">
      <div class="field-row">
        <label>
          <span>Email</span>
          <input type="email" name="email" required placeholder="you@example.com" />
        </label>
        <label>
          <span>First name</span>
          <input type="text" name="firstName" placeholder="First name" />
        </label>
      </div>
      <input type="hidden" name="source" value="${source}" />
      <label class="honeypot" aria-hidden="true">
        <span>Company</span>
        <input type="text" name="company" tabindex="-1" autocomplete="off" />
      </label>
      <div class="turnstile-slot" data-turnstile></div>
      <input type="hidden" name="turnstileToken" />
      <button type="submit">Join the list</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  `;
}

function renderContactForm() {
  return `
    <form class="form-panel" data-form-endpoint="/api/contact" data-form-name="contact">
      <div class="field-row">
        <label>
          <span>Name</span>
          <input type="text" name="name" required placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input type="email" name="email" required placeholder="you@example.com" />
        </label>
      </div>
      <label>
        <span>Subject</span>
        <input type="text" name="subject" required placeholder="Booking, press, partnership..." />
      </label>
      <label>
        <span>Message</span>
        <textarea name="message" required rows="6" placeholder="Tell us what you need."></textarea>
      </label>
      <label class="honeypot" aria-hidden="true">
        <span>Company</span>
        <input type="text" name="company" tabindex="-1" autocomplete="off" />
      </label>
      <div class="turnstile-slot" data-turnstile></div>
      <input type="hidden" name="turnstileToken" />
      <button type="submit">Send inquiry</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  `;
}

function renderPage(page) {
  const canonicalUrl = getCanonicalUrl(page.slug);
  const ogImageUrl = `${siteOrigin}${defaultSocialImagePath}`;
  const robotsDirective = page.slug === "404" ? "noindex, nofollow" : "index, follow";

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Monolith Project",
      url: siteOrigin,
      inLanguage: "en-US",
      description:
        "Intentional, community-focused events centered on music, togetherness, and culture."
    }
  ];

  if (page.slug === "") {
    structuredData.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Monolith Project",
      url: siteOrigin,
      logo: `${siteOrigin}/images/juany-deron-flyer.png`,
      email: "hello@monolithproject.com"
    });
  }

  const nav = [
    ["Events", "/events"],
    ["Radio", "/radio"],
    ["Gallery", "/gallery"],
    ["About", "/about"],
    ["Contact", "/contact"]
  ]
    .map(
      ([label, href]) =>
        `<a href="${href}"${href === `/${page.slug}` || (href === "/" && page.slug === "") ? ' aria-current="page"' : ""}>${label}</a>`
    )
    .join("");

  const heroCtas = page.ctas
    .map(
      (cta, index) =>
        `<a class="${index === 0 ? "button-primary" : "button-secondary"}" href="${cta.href}">${cta.label}</a>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${page.title}</title>
    <meta name="description" content="${page.description}" />
    <meta name="robots" content="${robotsDirective}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:site_name" content="Monolith Project" />
    <meta property="og:type" content="${page.slug === "" ? "website" : "article"}" />
    <meta property="og:title" content="${page.title}" />
    <meta property="og:description" content="${page.description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${ogImageUrl}" />
    <meta property="og:image:alt" content="Monolith Project event visual" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${page.title}" />
    <meta name="twitter:description" content="${page.description}" />
    <meta name="twitter:image" content="${ogImageUrl}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Space+Grotesk:wght@400;500;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/styles.css" />
    ${turnstileSiteKey
      ? '<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" defer></script>'
      : ""}
    <script>
      window.MONOLITH_CONFIG = ${JSON.stringify({ turnstileSiteKey })};
    </script>
    ${structuredData
      .map(
        (schema) =>
          `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
      )
      .join("\n")}
    <script type="module" src="/forms.js"></script>
  </head>
  <body>
    <div class="page-shell">
      <header class="site-header">
        <a class="brand-mark" href="/">MONOLITH</a>
        <nav class="site-nav">${nav}</nav>
      </header>
      <main>
        <section class="hero">
          <p class="eyebrow">${page.eyebrow}</p>
          <h1>${page.heroTitle}</h1>
          <p class="hero-copy">${page.heroCopy}</p>
          <p class="hero-lead">${page.lead}</p>
          <div class="hero-actions">${heroCtas}</div>
        </section>
        ${page.content}
      </main>
      <footer class="site-footer">
        <div>
          <p class="section-kicker">Launch Direction</p>
          <p class="footer-copy">Own the brand site on your domain. Keep the conversion paths direct. Treat each page like an editorial environment instead of generic promo real estate.</p>
        </div>
        <div class="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </div>
      </footer>
    </div>
  </body>
</html>`;
}

const styles = `:root {
  --bg: #0d0d0b;
  --panel: rgba(27, 24, 20, 0.82);
  --panel-border: rgba(255, 219, 168, 0.12);
  --text: #f6efdf;
  --muted: #d7c6aa;
  --gold: #ffb04a;
  --copper: #d7722f;
  --smoke: #1c1814;
  --shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  color: var(--text);
  background:
    radial-gradient(circle at top, rgba(215, 114, 47, 0.22), transparent 28%),
    radial-gradient(circle at 85% 20%, rgba(255, 176, 74, 0.15), transparent 22%),
    linear-gradient(180deg, #16110d 0%, #090907 100%);
  font-family: "Space Grotesk", "Avenir Next", sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

img {
  display: block;
  width: 100%;
  height: auto;
}

.page-shell {
  width: min(1180px, calc(100% - 32px));
  margin: 0 auto;
  padding: 24px 0 48px;
}

.site-header,
.site-footer,
.panel,
.hero {
  backdrop-filter: blur(18px);
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 18px 22px;
  background: rgba(15, 13, 10, 0.72);
  border: 1px solid var(--panel-border);
  border-radius: 24px;
  position: sticky;
  top: 16px;
  z-index: 30;
}

.brand-mark {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.site-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.site-nav a {
  color: var(--muted);
  font-size: 0.95rem;
}

.site-nav a[aria-current="page"] {
  color: var(--text);
}

.hero {
  margin-top: 22px;
  padding: 64px 32px 36px;
  border: 1px solid var(--panel-border);
  border-radius: 30px;
  background:
    linear-gradient(135deg, rgba(255, 176, 74, 0.16), rgba(215, 114, 47, 0.03)),
    rgba(14, 12, 10, 0.78);
  box-shadow: var(--shadow);
}

.eyebrow,
.section-kicker {
  margin: 0 0 12px;
  color: var(--gold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.78rem;
}

.hero h1,
.panel h2 {
  margin: 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(3rem, 7vw, 5.2rem);
  line-height: 0.96;
}

.hero-copy,
.hero-lead,
.panel p,
.footer-copy {
  color: var(--muted);
  line-height: 1.7;
}

.hero-copy {
  max-width: 760px;
  margin: 18px 0 0;
  font-size: 1.1rem;
}

.hero-lead {
  max-width: 680px;
  margin: 12px 0 0;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 28px;
}

.button-primary,
.button-secondary,
.form-panel button {
  border-radius: 999px;
  padding: 14px 22px;
  border: 1px solid transparent;
  font-weight: 700;
  transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
}

.button-primary,
.form-panel button {
  background: linear-gradient(135deg, var(--gold), #ffcf7c);
  color: #23170c;
}

.button-secondary {
  border-color: rgba(255, 255, 255, 0.14);
  background: rgba(255, 255, 255, 0.03);
}

.button-primary:hover,
.button-secondary:hover,
.form-panel button:hover {
  transform: translateY(-1px);
}

a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 3px;
  box-shadow: 0 0 0 3px rgba(255, 176, 74, 0.25);
}

.panel {
  margin-top: 22px;
  padding: 28px;
  border-radius: 28px;
  border: 1px solid var(--panel-border);
  background: var(--panel);
  box-shadow: var(--shadow);
}

.panel-grid,
.panel-split,
.section-head,
.field-row,
.site-footer {
  display: grid;
  gap: 24px;
}

.panel-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.panel-split {
  grid-template-columns: 1.1fr 0.9fr;
  align-items: start;
}

.card-list {
  display: grid;
  gap: 18px;
}

.card {
  padding: 20px;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(255, 255, 255, 0.03);
}

.card h3,
.form-panel h3 {
  margin: 0 0 8px;
  font-size: 1.05rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.gallery-grid-home {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.gallery-card,
.feature-image {
  overflow: hidden;
  border-radius: 24px;
  min-height: 220px;
  background: rgba(255, 255, 255, 0.03);
}

.gallery-card img,
.feature-image img {
  height: 100%;
  object-fit: cover;
}

.link-arrow {
  color: var(--gold);
}

.form-panel {
  display: grid;
  gap: 16px;
  padding: 22px;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.form-panel label {
  display: grid;
  gap: 8px;
}

.form-panel input,
.form-panel textarea {
  width: 100%;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(7, 7, 7, 0.28);
  color: var(--text);
  padding: 14px 16px;
  font: inherit;
}

.form-panel textarea {
  resize: vertical;
  min-height: 160px;
}

.turnstile-slot {
  min-height: 66px;
}

.form-status {
  min-height: 1.4em;
  margin: 0;
  color: var(--muted);
}

.form-status.is-error {
  color: #ff9075;
}

.form-status.is-success {
  color: #ffe39c;
}

.honeypot {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}

.site-footer {
  grid-template-columns: 1.4fr 0.6fr;
  margin-top: 22px;
  padding: 28px;
  border: 1px solid var(--panel-border);
  border-radius: 28px;
  background: rgba(13, 11, 9, 0.84);
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
}

@media (max-width: 900px) {
  .panel-grid,
  .panel-split,
  .gallery-grid-home,
  .gallery-grid,
  .site-footer {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 720px) {
  .page-shell {
    width: min(100% - 20px, 1180px);
    padding-top: 16px;
  }

  .site-header,
  .panel,
  .hero,
  .site-footer {
    border-radius: 22px;
  }

  .site-header,
  .field-row,
  .panel-grid,
  .panel-split,
  .gallery-grid-home,
  .gallery-grid,
  .site-footer {
    grid-template-columns: 1fr;
  }

  .site-header {
    position: static;
  }

  .hero {
    padding: 42px 20px 24px;
  }

  .hero h1,
  .panel h2 {
    font-size: clamp(2.4rem, 12vw, 3.6rem);
  }
}`;

const formsScript = `const siteKey = window.MONOLITH_CONFIG?.turnstileSiteKey || "";
const widgets = new WeakMap();
const TURNSTILE_RETRY_DELAY_MS = 250;
const TURNSTILE_MAX_RETRIES = 30;

function setStatus(form, message, variant = "") {
  const status = form.querySelector(".form-status");
  if (!status) return;
  status.textContent = message;
  status.classList.remove("is-error", "is-success");
  if (variant) {
    status.classList.add(variant);
  }
}

function serializeForm(form) {
  const data = new FormData(form);
  return Object.fromEntries(data.entries());
}

function ensureTurnstile(form) {
  if (!siteKey) {
    return true;
  }

  if (!window.turnstile) {
    return false;
  }

  const slot = form.querySelector("[data-turnstile]");
  const tokenInput = form.querySelector('input[name="turnstileToken"]');
  if (!slot || !tokenInput || widgets.has(form)) {
    return widgets.has(form);
  }

  const widgetId = window.turnstile.render(slot, {
    sitekey: siteKey,
    theme: "dark",
    callback(token) {
      tokenInput.value = token;
    },
    "expired-callback"() {
      tokenInput.value = "";
    }
  });

  widgets.set(form, widgetId);
  return true;
}

function initTurnstileWithRetry(form, retriesRemaining = TURNSTILE_MAX_RETRIES) {
  if (ensureTurnstile(form)) {
    return;
  }

  if (retriesRemaining <= 0) {
    setStatus(
      form,
      "Security check is still loading. Please wait a moment and try again.",
      "is-error"
    );
    return;
  }

  window.setTimeout(() => {
    initTurnstileWithRetry(form, retriesRemaining - 1);
  }, TURNSTILE_RETRY_DELAY_MS);
}

async function handleSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const endpoint = form.dataset.formEndpoint;
  const payload = serializeForm(form);
  const turnstileTokenInput = form.querySelector('input[name="turnstileToken"]');

  if (siteKey && turnstileTokenInput && !turnstileTokenInput.value) {
    if (!ensureTurnstile(form)) {
      initTurnstileWithRetry(form);
      setStatus(
        form,
        "Security check is loading. Please wait a moment and submit again.",
        "is-error"
      );
      return;
    }

    setStatus(form, "Please complete the security check before submitting.", "is-error");
    return;
  }

  setStatus(form, "Submitting...");
  submitButton.disabled = true;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.error || "Unable to submit the form.");
    }

    setStatus(form, result.message || "Submitted.", "is-success");
    form.reset();

    if (turnstileTokenInput) {
      turnstileTokenInput.value = "";
    }

    const widgetId = widgets.get(form);
    if (widgetId !== undefined && window.turnstile) {
      window.turnstile.reset(widgetId);
    }
  } catch (error) {
    setStatus(form, error.message, "is-error");
  } finally {
    submitButton.disabled = false;
  }
}

window.addEventListener("load", () => {
  document.querySelectorAll("form[data-form-endpoint]").forEach((form) => {
    initTurnstileWithRetry(form);
    form.addEventListener("submit", handleSubmit);
  });
});`;

await rm(distRoot, { recursive: true, force: true });
await mkdir(distRoot, { recursive: true });
await cp(assetsSource, path.join(distRoot, "images"), { recursive: true });
await writeFile(path.join(distRoot, "styles.css"), styles, "utf8");
await writeFile(path.join(distRoot, "forms.js"), formsScript, "utf8");

for (const page of pages) {
  const outputDir = page.slug ? path.join(distRoot, page.slug) : distRoot;
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), renderPage(page), "utf8");
}

await writeFile(
  path.join(distRoot, "404.html"),
  renderPage(pages.find((page) => page.slug === "404")),
  "utf8"
);

const publicPaths = pages
  .filter((page) => page.slug !== "404")
  .map((page) => (page.slug ? `/${page.slug}` : "/"));
const generatedAt = new Date().toISOString();
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${publicPaths
  .map(
    (pathname) => `  <url>
    <loc>${siteOrigin}${pathname}</loc>
    <lastmod>${generatedAt}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`;

await writeFile(path.join(distRoot, "sitemap.xml"), sitemapXml, "utf8");

await writeFile(
  path.join(distRoot, "robots.txt"),
  `User-agent: *
Allow: /
Sitemap: ${siteOrigin}/sitemap.xml
`,
  "utf8"
);
