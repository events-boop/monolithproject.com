export type SitemapEntry = {
  path: string;
  changefreq?: string;
  priority?: string;
};

export const SITE_ORIGIN: string;
export const PUBLIC_SITEMAP_ENTRIES: readonly SitemapEntry[];
export function buildEventSitemapEntries(
  events?: ReadonlyArray<{
    id: string;
    slug?: string;
    status: string;
  }>
): SitemapEntry[];
export function mergeSitemapEntries(
  entries?: readonly SitemapEntry[]
): SitemapEntry[];
export function buildSitemapXml(entries?: readonly SitemapEntry[]): string;
export function buildRobotsTxt(): string;
