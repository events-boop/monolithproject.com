/**
 * Live routing smoke harness.
 *
 * Hits every public route, redirect rail, and domain alias on the deployed
 * site and fails loudly when a status code, redirect destination, or body
 * marker doesn't match expectations. Unit tests can't see config precedence,
 * unset env vars falling back to dead destinations, or DNS drift — this can.
 *
 * Usage:
 *   npm run smoke:routes                      # against production
 *   BASE_URL=https://deploy-preview-42--monolithproject.netlify.app \
 *     npm run smoke:routes                    # against a deploy preview
 *
 * Checks marked `warn: true` document known-pending issues (usually DNS or
 * env actions outside the repo). They report but don't fail the run; flip
 * them to hard checks once resolved.
 */

const BASE_URL = (process.env.BASE_URL || "https://monolithproject.com").replace(
  /\/$/,
  ""
);

type Check = {
  name: string;
  url: string;
  /** Expected HTTP status (exact). */
  status: number;
  /** Substring the Location header must contain (redirect checks). */
  redirectContains?: string;
  /** Substring the response body must contain (content checks). */
  bodyContains?: string;
  /** Report failures without failing the run (pending external action). */
  warn?: boolean;
};

const CHECKS: Check[] = [
  // --- Health probes -------------------------------------------------------
  {
    name: "API health probe (liveness JSON)",
    url: `${BASE_URL}/api/health`,
    status: 200,
    bodyContains: '"ok":true',
  },
  {
    name: "Bare /health probe (liveness JSON)",
    url: `${BASE_URL}/health`,
    status: 200,
    bodyContains: '"ok":true',
  },

  // --- Ticket rails --------------------------------------------------------
  {
    name: "Aug 22 ticket rail (coming soon until env set)",
    url: `${BASE_URL}/go/tickets/css-aug22`,
    status: 200,
    bodyContains: "August 22",
  },
  {
    name: "Sep 19 ticket rail (coming soon until env set)",
    url: `${BASE_URL}/go/tickets/css-sep19`,
    status: 200,
    bodyContains: "September 19",
  },
  {
    name: "July 4 ticket rail redirects to Posh",
    url: `${BASE_URL}/go/tickets/css-jul04`,
    status: 302,
    redirectContains: "posh.vip/e/",
  },
  {
    name: "sunsets-july4 alias",
    url: `${BASE_URL}/go/tickets/sunsets-july4`,
    status: 302,
    redirectContains: "/go/tickets/css-jul04",
  },
  {
    name: "Featured tickets fallback is a public page (not Posh admin)",
    url: `${BASE_URL}/go/tickets/featured`,
    status: 302,
    redirectContains: "/tickets",
  },
  {
    name: "Season pass rail",
    url: `${BASE_URL}/go/season-pass`,
    status: 302,
    redirectContains: "/go/tickets/season-pass",
  },
  {
    name: "Date alias: sunsets-2026-08-22",
    url: `${BASE_URL}/go/sunsets-2026-08-22/tickets`,
    status: 301,
    redirectContains: "/go/tickets/css-aug22",
  },
  {
    name: "Date alias: sunsets-2026-09-19",
    url: `${BASE_URL}/go/sunsets-2026-09-19/tickets`,
    status: 301,
    redirectContains: "/go/tickets/css-sep19",
  },

  // --- Waitlist rails ------------------------------------------------------
  {
    name: "Lake List alias",
    url: `${BASE_URL}/go/lakelist`,
    status: 302,
    redirectContains: "/go/waitlist/chasing-sunsets",
  },
  {
    name: "Chasing Sunsets waitlist reaches Laylo",
    url: `${BASE_URL}/go/waitlist/chasing-sunsets`,
    status: 302,
    redirectContains: "laylo.com",
  },

  // --- Media / social / forms rails ---------------------------------------
  {
    name: "Sunsets recap reaches YouTube",
    url: `${BASE_URL}/go/media/sunsets-recap`,
    status: 302,
    redirectContains: "youtu",
  },
  {
    name: "SoundCloud rail",
    url: `${BASE_URL}/go/media/sunsets-soundcloud`,
    status: 302,
    redirectContains: "soundcloud.com",
  },
  {
    name: "Gallery rail",
    url: `${BASE_URL}/go/gallery/chasing-sunsets`,
    status: 302,
    redirectContains: "pic-time.com",
  },
  {
    name: "VIP form rail reaches a live page (not a parked domain)",
    url: `${BASE_URL}/go/forms/sunsets-vip`,
    status: 302,
    redirectContains: "monolithproject.com/vip",
  },
  {
    name: "Instagram rail",
    url: `${BASE_URL}/go/social/instagram-sunsets`,
    status: 302,
    redirectContains: "instagram.com",
  },

  // --- Vanity paths --------------------------------------------------------
  {
    name: "/SUNSETS case variant",
    url: `${BASE_URL}/SUNSETS`,
    status: 301,
    redirectContains: "/sunsets",
  },
  {
    name: "/lake vanity",
    url: `${BASE_URL}/lake`,
    status: 301,
    redirectContains: "/sunsets",
  },
  {
    name: "/tables vanity (printed on cabana materials)",
    url: `${BASE_URL}/tables`,
    status: 301,
    redirectContains: "/vip",
  },

  // --- Key pages render ----------------------------------------------------
  {
    name: "Homepage renders",
    url: `${BASE_URL}/`,
    status: 200,
    bodyContains: "The Monolith Project",
  },
  {
    // Trailing slash: Netlify 301-normalizes bare paths onto prerendered dirs.
    name: "Tickets page renders",
    url: `${BASE_URL}/tickets/`,
    status: 200,
    bodyContains: "<title>",
  },
  {
    name: "VIP page renders",
    url: `${BASE_URL}/vip`,
    status: 200,
    bodyContains: "<title>",
  },

  // --- Campaign domains ----------------------------------------------------
  {
    name: "sunsets.vip root redirects to /sunsets",
    url: "https://sunsets.vip/",
    status: 301,
    redirectContains: "monolithproject.com/sunsets",
  },
  {
    name: "untold.vip serves the site",
    url: "https://untold.vip/",
    status: 200,
    bodyContains: "Monolith",
  },
  {
    name: "houseoffriends.vip serves the House of Friends launch page",
    url: "https://houseoffriends.vip/",
    status: 200,
    bodyContains: "House of Friends",
  },
  {
    name: "www.houseoffriends.vip redirects to the apex campaign domain",
    url: "https://www.houseoffriends.vip/",
    status: 301,
    redirectContains: "houseoffriends.vip/",
  },
  // Pending DNS repointing (registrar action) — flip to hard checks after.
  {
    name: "themonolithproject.com redirects to canonical [DNS PENDING]",
    url: "https://themonolithproject.com/",
    status: 301,
    redirectContains: "monolithproject.com",
    warn: true,
  },
  {
    name: "chasingsunsets.world redirects to canonical [DNS PENDING]",
    url: "https://chasingsunsets.world/",
    status: 301,
    redirectContains: "monolithproject.com",
    warn: true,
  },
];

type Result = {
  check: Check;
  ok: boolean;
  detail: string;
};

async function runCheck(check: Check): Promise<Result> {
  try {
    const response = await fetch(check.url, {
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
      headers: { "user-agent": "monolith-smoke-routes/1.0" },
    });

    if (response.status !== check.status) {
      return {
        check,
        ok: false,
        detail: `expected ${check.status}, got ${response.status}`,
      };
    }

    if (check.redirectContains) {
      const location = response.headers.get("location") || "";
      if (!location.includes(check.redirectContains)) {
        return {
          check,
          ok: false,
          detail: `redirect "${location}" missing "${check.redirectContains}"`,
        };
      }
    }

    if (check.bodyContains) {
      const body = await response.text();
      if (!body.includes(check.bodyContains)) {
        return {
          check,
          ok: false,
          detail: `body missing "${check.bodyContains}"`,
        };
      }
    }

    return { check, ok: true, detail: "" };
  } catch (error) {
    return {
      check,
      ok: false,
      detail: error instanceof Error ? error.message : "request failed",
    };
  }
}

const results = await Promise.all(CHECKS.map(runCheck));

let failures = 0;
let warnings = 0;

for (const { check, ok, detail } of results) {
  if (ok) {
    console.log(`  PASS  ${check.name}`);
  } else if (check.warn) {
    warnings += 1;
    console.log(`  WARN  ${check.name} — ${detail}`);
  } else {
    failures += 1;
    console.log(`  FAIL  ${check.name} — ${detail}`);
    console.log(`        ${check.url}`);
  }
}

console.log(
  `\n${results.length} checks against ${BASE_URL}: ` +
    `${results.length - failures - warnings} passed, ${failures} failed, ${warnings} warned`
);

if (failures > 0) process.exit(1);
