# The Monolith Project

A soul-centered cultural movement and music collective creating immersive experiences. High-fidelity web platform for event discovery, radio archives, and artist storytelling.

## 🚀 Overview

The Monolith Project website is a cinematic digital portal designed to frame the collective's vision through a high-performance, intent-driven user journey.

- **Experience:** Smooth Lenis scroll, Framer Motion transitions, and scene-aware page-load marks.
- **Content:** Centralized Inquiry Portal for partners, upcoming schedules, and a multi-season multimedia archive.
- **Tech Tier:** Modern React 19 architecture with a heavy focus on performance and SEO authority.

## 🛠 Tech Stack

- **Framework:** [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- **Logic:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/) + [Lenis](https://lenis.darkroom.engineering/) Smooth Scroll
- **Infrastructure:** [Netlify](https://www.netlify.com/) (Functions, Headers, Redirects)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/)) + [Drizzle ORM](https://orm.drizzle.team/)
- **Quality:** [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/) E2E, [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

## 📁 Project Structure

- `client/`: React frontend source.
- `server/`: Express backend / Netlify functions source.
- `shared/`: Shared business logic, SEO utilities, and constants.
- `scripts/`: Build-time helpers (SEO sync, image optimization, performance checks).
- `private/`: Internal project documentation and planning assets.

## ⚙️ Development

### Setup
```bash
npm install
```

### Environment
Copy `.env.example` to `.env` and configure your database and API keys.

### Local Development
```bash
npm run dev
```

### Build & Production
```bash
npm run build
npm start
```

## 📈 Quality Gates

We maintain a "God-Tier" experience through automated checks:
- `npm run check`: Type checking.
- `npm run test`: Unit and E2E testing.
- `npm run lhci`: Performance auditing.
- `npm run budget:check`: Bundle size and asset weight monitoring.

## 🗺 SEO & Discovery

The project utilizes a custom SEO engine (`shared/seo`) which automatically syncs event data into:
- Structured Data (JSON-LD) for Events, Brands, and Podcasts.
- Dynamic `sitemap.xml` generation.
- Optimized `robots.txt` configuration.

---
© 2026 The Monolith Project. All rights reserved.
