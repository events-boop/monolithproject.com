import type { Config, Context } from "@netlify/functions";

const INDEXNOW_KEY = "eb429ff55e9dae8ecfc8b8be13c6bf2b";
const SITE_ORIGIN = "https://monolithproject.com";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

// All public-facing URLs on the site
const SITE_URLS = [
  "/",
  "/story",
  "/chasing-sunsets",
  "/series",
  "/schedule",
  "/archive",
  "/radio",
  "/about",
  "/lineup",
  "/tickets",
  "/contact",
  "/travel",
  "/ambassadors",
].map((path) => `${SITE_ORIGIN}${path}`);

export default async function handler(req: Request, context: Context) {
  // Allow GET (manual trigger) or POST (deploy hook)
  try {
    const payload = {
      host: "monolithproject.com",
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`,
      urlList: SITE_URLS,
    };

    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    const status = response.status;

    // 200 = OK, 202 = Accepted (async), both are success
    if (status === 200 || status === 202) {
      return new Response(
        JSON.stringify({
          ok: true,
          status,
          submitted: SITE_URLS.length,
          urls: SITE_URLS,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ ok: false, status, message: "IndexNow API error" }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, message: String(err) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export const config: Config = {
  path: "/api/indexnow",
};
