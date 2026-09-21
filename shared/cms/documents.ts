/**
 * CMS document registry — the stable keys, kinds, and metadata shapes shared
 * by the server repository (server/db/cmsRepo.ts), the seed script
 * (scripts/cms_seed.mts), and future admin tooling. Payload shapes live in
 * shared/cms/schemas.ts.
 */

/** The four content-managed documents backing the public site. */
export const CMS_DOCUMENTS = [
  {
    key: "events.catalogue",
    kind: "events-catalogue",
    label: "Events Catalogue",
  },
  {
    key: "sunsets.publication",
    kind: "sunsets-publication",
    label: "Sunsets Publication Record",
  },
  {
    key: "faqs.site",
    kind: "faqs-site",
    label: "Site FAQs",
  },
  {
    key: "home.featured",
    kind: "home-featured",
    label: "Home Featured Slots",
  },
  {
    key: "tracking.pixels",
    kind: "tracking-pixels",
    label: "Tracking Pixels & Analytics",
  },
] as const;

export type CmsDocumentKey = (typeof CMS_DOCUMENTS)[number]["key"];
export type CmsDocumentKind = (typeof CMS_DOCUMENTS)[number]["kind"];

/** Document keys in registry order. */
export const CMS_DOCUMENT_KEYS: CmsDocumentKey[] = CMS_DOCUMENTS.map(
  document => document.key
);

const DOCUMENTS_BY_KEY = new Map(CMS_DOCUMENTS.map(document => [document.key, document]));

export function isCmsDocumentKey(key: string): key is CmsDocumentKey {
  return DOCUMENTS_BY_KEY.has(key as CmsDocumentKey);
}

export function getCmsDocumentDefinition(key: CmsDocumentKey) {
  const definition = DOCUMENTS_BY_KEY.get(key);
  if (!definition) throw new Error(`Unknown CMS document key: ${key}`);
  return definition;
}

/** Lifecycle states of a stored revision row. */
export type CmsRevisionState = "draft" | "published" | "superseded";

/** Revision metadata — everything about a revision except its payload. */
export interface CmsRevisionMeta {
  id: number;
  documentKey: CmsDocumentKey;
  revision: number;
  state: CmsRevisionState;
  note: string | null;
  createdAt: string;
}

/** Document metadata with the current draft/published revision summaries. */
export interface CmsDocumentMeta {
  key: CmsDocumentKey;
  kind: CmsDocumentKind;
  label: string;
  draft: CmsRevisionMeta | null;
  published: CmsRevisionMeta | null;
  createdAt: string;
  updatedAt: string;
}
