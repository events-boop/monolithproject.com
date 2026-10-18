/**
 * cmsRepo — versioned draft/published storage for CMS documents.
 *
 * Follows the same fail-safe contract as scheduledEventsRepo.ts: every read
 * returns null/empty and every mutation throws a typed CmsUnavailableError
 * when hasDatabase() is false, so the site never crashes without a database.
 *
 * Each mutation is one PostgreSQL statement: a document row lock guards
 * the expected pointers, and revision changes commit or roll back together.
 * This works with Neon HTTP without callback transactions.
 */
import { and, desc, eq, inArray, sql, type SQL } from "drizzle-orm";
import { getDatabase, hasDatabase } from "./client";
import { cmsDocuments, cmsRevisions } from "./schema";
import {
  getCmsDocumentDefinition,
  isCmsDocumentKey,
  type CmsDocumentKey,
  type CmsDocumentMeta,
  type CmsRevisionMeta,
  type CmsRevisionState,
} from "../../shared/cms/documents";
import { validateCmsPayload } from "../../shared/cms/schemas";

type Database = NonNullable<ReturnType<typeof getDatabase>>;
type DocumentRow = typeof cmsDocuments.$inferSelect;
type RevisionRow = typeof cmsRevisions.$inferSelect;

export class CmsUnavailableError extends Error {
  readonly code = "CMS_UNAVAILABLE";
  constructor() {
    super("CMS storage is unavailable: DATABASE_URL is not configured");
    this.name = "CmsUnavailableError";
  }
}

export class CmsValidationError extends Error {
  readonly code = "CMS_VALIDATION";
  readonly issues: string[];
  constructor(issues: string[]) {
    super(`CMS payload failed validation:\n${issues.join("\n")}`);
    this.name = "CmsValidationError";
    this.issues = issues;
  }
}

export class CmsConflictError extends Error {
  readonly code = "CMS_CONFLICT";
  readonly statusCode = 409;
  constructor(message: string) {
    super(message);
    this.name = "CmsConflictError";
  }
}

export class CmsNotFoundError extends Error {
  readonly code = "CMS_NOT_FOUND";
  readonly statusCode = 404;
  constructor(message: string) {
    super(message);
    this.name = "CmsNotFoundError";
  }
}

/* ------------------------------------------------------------------------ */
/* Pure helpers (unit-tested without a database)                             */
/* ------------------------------------------------------------------------ */

type RevisionPointers = Pick<
  DocumentRow,
  "draftRevisionId" | "publishedRevisionId"
>;

/**
 * The base a save must build on: the current draft revision id, or the
 * published revision id when no draft exists, or 0 for an empty document.
 */
export function expectedBaseRevision(document: RevisionPointers | null) {
  if (!document) return 0;
  return document.draftRevisionId ?? document.publishedRevisionId ?? 0;
}

function normalizeBaseRevision(baseRevision: number | null | undefined) {
  return baseRevision ?? 0;
}

export function assertBaseRevision(
  document: RevisionPointers | null,
  baseRevision: number | null | undefined
) {
  const expected = expectedBaseRevision(document);
  const actual = normalizeBaseRevision(baseRevision);
  if (actual !== expected) {
    throw new CmsConflictError(
      `Stale editor session: base revision ${actual} does not match the current base ${expected}. Reload the document and retry.`
    );
  }
}

/** Next per-document revision number (monotonic, starts at 1). */
export function computeNextRevision(revisionNumbers: number[]) {
  return revisionNumbers.length === 0 ? 1 : Math.max(...revisionNumbers) + 1;
}

/* ------------------------------------------------------------------------ */
/* Row mapping                                                               */
/* ------------------------------------------------------------------------ */

function toRevisionMeta(row: Omit<RevisionRow, "payload">): CmsRevisionMeta {
  return {
    id: row.id,
    documentKey: row.documentKey as CmsDocumentKey,
    revision: row.revision,
    state: row.state as CmsRevisionState,
    note: row.note,
    createdAt: row.createdAt,
  };
}

function requireDatabase(): Database {
  if (!hasDatabase()) throw new CmsUnavailableError();
  return getDatabase() as Database;
}

async function selectDocument(db: Database, key: string) {
  const rows = await db
    .select()
    .from(cmsDocuments)
    .where(eq(cmsDocuments.key, key));
  return rows[0] ?? null;
}

async function selectRevision(db: Database, id: number) {
  const rows = await db
    .select()
    .from(cmsRevisions)
    .where(eq(cmsRevisions.id, id));
  return rows[0] ?? null;
}

async function selectRevisionMetaByIds(db: Database, ids: number[]) {
  if (ids.length === 0) return new Map<number, CmsRevisionMeta>();
  const rows = await db
    .select({
      id: cmsRevisions.id,
      documentKey: cmsRevisions.documentKey,
      revision: cmsRevisions.revision,
      state: cmsRevisions.state,
      note: cmsRevisions.note,
      createdAt: cmsRevisions.createdAt,
    })
    .from(cmsRevisions)
    .where(inArray(cmsRevisions.id, ids));
  return new Map(rows.map(row => [row.id, toRevisionMeta(row)]));
}

function requireExactlyOne<T>(rows: T[], message: string): T {
  if (rows.length !== 1) throw new CmsConflictError(message);
  return rows[0];
}

async function executeMutation(db: Database, statement: SQL) {
  try {
    return (await db.execute<RevisionRow>(statement)).rows;
  } catch (error) {
    const cause =
      (error as { cause?: { code?: string; constraint?: string } }).cause ??
      (error as { code?: string; constraint?: string });
    if (
      cause.code === "40001" ||
      cause.code === "40P01" ||
      (cause.code === "23505" &&
        cause.constraint === "cms_revisions_document_revision_idx")
    ) {
      throw new CmsConflictError(
        "CMS content changed concurrently; reload and retry"
      );
    }
    throw error;
  }
}

/** Lock only the exact document version read by this operation. */
function lockedDocument(document: DocumentRow) {
  return sql`
    SELECT d.* FROM cms_documents d
    WHERE d.key = ${document.key}
      AND d.draft_revision_id IS NOT DISTINCT FROM ${document.draftRevisionId}::bigint
      AND d.published_revision_id IS NOT DISTINCT FROM ${document.publishedRevisionId}::bigint
      AND (d.draft_revision_id IS NULL OR EXISTS (
        SELECT 1 FROM cms_revisions r WHERE r.id = d.draft_revision_id
          AND r.document_key = d.key AND r.state = 'draft'
      ))
      AND (d.published_revision_id IS NULL OR EXISTS (
        SELECT 1 FROM cms_revisions r WHERE r.id = d.published_revision_id
          AND r.document_key = d.key AND r.state = 'published'
      ))
    FOR UPDATE OF d
  `;
}

const returnedRevision = sql`
  r.id::float8 AS id, r.document_key AS "documentKey", r.revision,
  r.state, r.payload, r.note, r.created_at::text AS "createdAt"
`;

/** One statement; a failed insert, supersede, or pointer update rolls back all three. */
async function replaceDraft(
  db: Database,
  document: DocumentRow,
  payload: unknown,
  note: string | null
) {
  const rows = await executeMutation(
    db,
    sql`
    WITH locked AS MATERIALIZED (${lockedDocument(document)}),
    inserted AS (
      INSERT INTO cms_revisions (document_key, revision, state, payload, note)
      SELECT l.key,
        COALESCE((SELECT MAX(revision) FROM cms_revisions WHERE document_key = l.key), 0) + 1,
        'draft', ${JSON.stringify(payload)}::jsonb, ${note}
      FROM locked l
      RETURNING *
    ), superseded AS (
      UPDATE cms_revisions r SET state = 'superseded'
      FROM locked l, inserted n
      WHERE r.id = l.draft_revision_id AND r.document_key = l.key
      RETURNING r.id
    ), moved AS (
      UPDATE cms_documents d SET draft_revision_id = n.id, updated_at = now()
      FROM locked l, inserted n WHERE d.key = l.key
      RETURNING d.key
    )
    SELECT ${returnedRevision} FROM inserted r JOIN moved m ON m.key = r.document_key
  `
  );
  return requireExactlyOne(
    rows,
    `Draft for "${document.key}" changed concurrently; reload and retry`
  );
}

/* ------------------------------------------------------------------------ */
/* Public API                                                                */
/* ------------------------------------------------------------------------ */

/** All documents with draft/published revision metadata — never payloads. */
export async function listCmsDocuments(): Promise<CmsDocumentMeta[]> {
  if (!hasDatabase()) return [];
  const db = getDatabase() as Database;

  const documents = await db.select().from(cmsDocuments);
  const pointerIds = documents.flatMap(document =>
    [document.draftRevisionId, document.publishedRevisionId].filter(
      (id): id is number => id !== null
    )
  );
  const metaById = await selectRevisionMetaByIds(db, pointerIds);

  return documents.map(document => {
    const definition = isCmsDocumentKey(document.key)
      ? getCmsDocumentDefinition(document.key)
      : null;
    return {
      key: document.key as CmsDocumentKey,
      kind: (definition?.kind ?? document.kind) as CmsDocumentMeta["kind"],
      label: definition?.label ?? document.key,
      draft:
        document.draftRevisionId !== null
          ? (metaById.get(document.draftRevisionId) ?? null)
          : null,
      published:
        document.publishedRevisionId !== null
          ? (metaById.get(document.publishedRevisionId) ?? null)
          : null,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  });
}

export interface CmsDocumentDetail {
  document: CmsDocumentMeta;
  draftPayload: unknown | null;
  publishedPayload: unknown | null;
  revisions: CmsRevisionMeta[];
}

/** One document with both current payloads and its full revision history. */
export async function getCmsDocument(
  key: string
): Promise<CmsDocumentDetail | null> {
  if (!hasDatabase()) return null;
  const db = getDatabase() as Database;

  const document = await selectDocument(db, key);
  if (!document) return null;

  const pointerIds = [
    document.draftRevisionId,
    document.publishedRevisionId,
  ].filter((id): id is number => id !== null);
  const metaById = await selectRevisionMetaByIds(db, pointerIds);
  const definition = isCmsDocumentKey(document.key)
    ? getCmsDocumentDefinition(document.key)
    : null;

  const draftRevision = document.draftRevisionId
    ? await selectRevision(db, document.draftRevisionId)
    : null;
  const publishedRevision = document.publishedRevisionId
    ? await selectRevision(db, document.publishedRevisionId)
    : null;

  return {
    document: {
      key: document.key as CmsDocumentKey,
      kind: (definition?.kind ?? document.kind) as CmsDocumentMeta["kind"],
      label: definition?.label ?? document.key,
      draft:
        document.draftRevisionId !== null
          ? (metaById.get(document.draftRevisionId) ?? null)
          : null,
      published:
        document.publishedRevisionId !== null
          ? (metaById.get(document.publishedRevisionId) ?? null)
          : null,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    },
    draftPayload: draftRevision?.payload ?? null,
    publishedPayload: publishedRevision?.payload ?? null,
    revisions: await listRevisionHistory(key),
  };
}

/**
 * Saves a new draft. `baseRevision` is the revision id the editor session
 * loaded (the current draft id, or the published id when no draft exists,
 * or null/0 for a new document); a mismatch throws CmsConflictError.
 */
export async function saveDraft(
  key: string,
  payload: unknown,
  baseRevision: number | null,
  note?: string
): Promise<CmsRevisionMeta> {
  if (!isCmsDocumentKey(key)) {
    throw new CmsValidationError([`Unknown CMS document key "${key}"`]);
  }
  const validation = validateCmsPayload(key, payload);
  if (!validation.success) throw new CmsValidationError(validation.issues);

  const db = requireDatabase();
  const definition = getCmsDocumentDefinition(key);

  let document = await selectDocument(db, key);
  if (!document) {
    if (normalizeBaseRevision(baseRevision) !== 0) {
      throw new CmsConflictError(
        `Document "${key}" does not exist; base revision must be 0`
      );
    }
    const inserted = await db
      .insert(cmsDocuments)
      .values({ key, kind: definition.kind })
      .onConflictDoNothing()
      .returning();
    document = inserted[0] ?? (await selectDocument(db, key));
    if (!document) {
      throw new CmsConflictError(`Could not create document "${key}"`);
    }
  }

  assertBaseRevision(document, baseRevision);
  const revision = await replaceDraft(db, document, payload, note ?? null);

  return toRevisionMeta(revision);
}

/**
 * Publishes the current draft revision. `expectedPublishedRevisionId` is the
 * published pointer the caller observed (null when nothing is published);
 * the document CAS is null-safe so a concurrent publish throws CmsConflictError.
 */
export async function publishRevision(
  key: string,
  revisionId: number,
  expectedPublishedRevisionId: number | null
): Promise<CmsRevisionMeta> {
  const db = requireDatabase();

  const document = await selectDocument(db, key);
  if (!document) throw new CmsNotFoundError(`Document "${key}" not found`);

  const revision = await selectRevision(db, revisionId);
  if (!revision || revision.documentKey !== key) {
    throw new CmsNotFoundError(`Revision ${revisionId} not found for "${key}"`);
  }
  if (revision.state !== "draft" || document.draftRevisionId !== revisionId) {
    throw new CmsConflictError(
      `Only the current draft revision of "${key}" can be published`
    );
  }

  const validation = validateCmsPayload(key, revision.payload);
  if (!validation.success) throw new CmsValidationError(validation.issues);
  if (document.publishedRevisionId !== expectedPublishedRevisionId) {
    throw new CmsConflictError(
      `Published revision for "${key}" changed; reload and retry`
    );
  }

  const rows = await executeMutation(
    db,
    sql`
    WITH locked AS MATERIALIZED (${lockedDocument(document)}),
    changed AS (
      UPDATE cms_revisions r
      SET state = CASE WHEN r.id = ${revisionId}::bigint THEN 'published' ELSE 'superseded' END
      FROM locked l
      WHERE r.document_key = l.key
        AND (r.id = l.draft_revision_id OR r.id = l.published_revision_id)
      RETURNING r.*
    ), moved AS (
      UPDATE cms_documents d
      SET published_revision_id = r.id, draft_revision_id = NULL, updated_at = now()
      FROM locked l, changed r
      WHERE d.key = l.key AND r.id = l.draft_revision_id
      RETURNING d.key
    )
    SELECT ${returnedRevision} FROM changed r JOIN moved m ON m.key = r.document_key
    WHERE r.id = ${revisionId}::bigint
  `
  );
  const published = requireExactlyOne(
    rows,
    `Publication for "${key}" changed concurrently; reload and retry`
  );

  return toRevisionMeta(published);
}

/**
 * Copies any historical revision into a NEW draft revision. The published
 * pointer is never touched.
 */
export async function restoreRevision(
  key: string,
  revisionId: number,
  baseRevision: number | null
): Promise<CmsRevisionMeta> {
  const db = requireDatabase();

  const document = await selectDocument(db, key);
  if (!document) throw new CmsNotFoundError(`Document "${key}" not found`);

  const source = await selectRevision(db, revisionId);
  if (!source || source.documentKey !== key) {
    throw new CmsNotFoundError(`Revision ${revisionId} not found for "${key}"`);
  }

  if (baseRevision === undefined) {
    throw new CmsValidationError([
      "baseRevision is required when restoring a revision",
    ]);
  }
  assertBaseRevision(document, baseRevision);
  const validation = validateCmsPayload(key, source.payload);
  if (!validation.success) throw new CmsValidationError(validation.issues);
  const draft = await replaceDraft(
    db,
    document,
    source.payload,
    `Restored from revision ${source.revision}`
  );

  return toRevisionMeta(draft);
}

/**
 * The public read path: payload of the published revision only, or null.
 * Drafts are never returned here.
 */
export async function getPublishedPayload(
  key: string
): Promise<unknown | null> {
  if (!hasDatabase()) return null;
  const db = getDatabase() as Database;

  // A single snapshot avoids reading an old pointer and then a newly superseded row.
  const rows = await db
    .select({ payload: cmsRevisions.payload })
    .from(cmsDocuments)
    .innerJoin(
      cmsRevisions,
      and(
        eq(cmsRevisions.id, cmsDocuments.publishedRevisionId),
        eq(cmsRevisions.documentKey, cmsDocuments.key),
        eq(cmsRevisions.state, "published")
      )
    )
    .where(eq(cmsDocuments.key, key));
  return rows[0]?.payload ?? null;
}

/** Full revision history for a document, newest first (meta only). */
export async function listRevisionHistory(
  key: string
): Promise<CmsRevisionMeta[]> {
  if (!hasDatabase()) return [];
  const db = getDatabase() as Database;

  const rows = await db
    .select({
      id: cmsRevisions.id,
      documentKey: cmsRevisions.documentKey,
      revision: cmsRevisions.revision,
      state: cmsRevisions.state,
      note: cmsRevisions.note,
      createdAt: cmsRevisions.createdAt,
    })
    .from(cmsRevisions)
    .where(eq(cmsRevisions.documentKey, key))
    .orderBy(desc(cmsRevisions.revision));
  return rows.map(row => toRevisionMeta(row));
}
