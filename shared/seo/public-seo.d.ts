export type SitemapEntry = {
  path: string;
  changefreq?: string;
  priority?: string;
};

export const SITE_ORIGIN: string;
export const PUBLIC_SITEMAP_ENTRIES: readonly SitemapEntry[];
export function buildSitemapXml(entries?: readonly SitemapEntry[]): string;
export function buildRobotsTxt(): string;
