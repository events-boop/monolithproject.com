// @vitest-environment node
// Run only against an explicit, disposable local PostgreSQL database:
// CMS_TEST_DATABASE_URL=postgresql://user@127.0.0.1:55439/cms_atomic_test npx vitest run server/db/__tests__/cmsAtomic.integration.test.ts
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { readFileSync } from "node:fs";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../schema";
const harness = vi.hoisted(() => ({ db: null as any }));
vi.mock("../client", () => ({
  getDatabase: () => harness.db,
  hasDatabase: () => harness.db !== null,
}));
import {
  saveDraft,
  publishRevision,
  restoreRevision,
  getPublishedPayload,
  getCmsDocument,
  CmsConflictError,
  CmsValidationError,
} from "../cmsRepo";
import { cmsRestoreBodySchema } from "../../lib/schemas";

const url = process.env.CMS_TEST_DATABASE_URL;
const testSchema = `cms_test_${Date.now()}_${process.pid}`;
let pool: Pool;
const key = "home.featured";
const payload = (id: string) => ({
  slots: { hero: id, banner: id, funnel: id, ticket: id, guide: id },
});
const snapshot = async () => ({
  documents: (await pool.query("SELECT * FROM cms_documents ORDER BY key"))
    .rows,
  revisions: (await pool.query("SELECT * FROM cms_revisions ORDER BY id")).rows,
});
async function failOn(
  table: "cms_documents" | "cms_revisions",
  event: "INSERT" | "UPDATE"
) {
  await pool.query(`CREATE FUNCTION fail_write() RETURNS trigger LANGUAGE plpgsql AS $$
    BEGIN RAISE EXCEPTION 'Injected CMS write failure'; END $$;
    CREATE TRIGGER fail_write BEFORE ${event} ON ${table} FOR EACH ROW EXECUTE FUNCTION fail_write();`);
}
async function allowWrites(table: "cms_documents" | "cms_revisions") {
  await pool.query(
    `DROP TRIGGER fail_write ON ${table}; DROP FUNCTION fail_write();`
  );
}

describe.skipIf(!url)("CMS atomic PostgreSQL writes", () => {
  beforeAll(async () => {
    const parsed = new URL(url!);
    if (
      !["127.0.0.1", "localhost", "[::1]"].includes(parsed.hostname) ||
      parsed.pathname !== "/cms_atomic_test"
    )
      throw new Error(
        "CMS tests require a local disposable database named cms_atomic_test"
      );
    pool = new Pool({
      connectionString: url,
      options: `-c search_path=${testSchema}`,
      max: 8,
    });
    await pool.query(`CREATE SCHEMA ${testSchema}`);
    const migration = readFileSync(
      new URL("../migrations/0007_glossy_impossible_man.sql", import.meta.url),
      "utf8"
    ).replaceAll('"public"."cms_documents"', `"${testSchema}"."cms_documents"`);
    await pool.query(migration);
    harness.db = drizzle(pool, { schema });
  });
  beforeEach(async () => {
    await pool.query(
      "DROP TRIGGER IF EXISTS fail_write ON cms_documents; DROP TRIGGER IF EXISTS fail_write ON cms_revisions; DROP FUNCTION IF EXISTS fail_write(); TRUNCATE cms_revisions, cms_documents RESTART IDENTITY CASCADE;"
    );
  });
  afterAll(async () => {
    harness.db = null;
    if (pool) {
      await pool.query(`DROP SCHEMA IF EXISTS ${testSchema} CASCADE`);
      await pool.end();
    }
  });

  it("keeps drafts private, publishes, and restores without changing the live publication", async () => {
    const first = await saveDraft(key, payload("first"), null);
    expect(await getPublishedPayload(key)).toBeNull();
    await publishRevision(key, first.id, null);
    const second = await saveDraft(key, payload("second"), first.id);
    expect(await getPublishedPayload(key)).toEqual(payload("first"));
    await publishRevision(key, second.id, first.id);
    const restored = await restoreRevision(key, first.id, second.id);
    expect(restored.revision).toBe(3);
    expect(await getPublishedPayload(key)).toEqual(payload("second"));
    expect((await getCmsDocument(key))?.draftPayload).toEqual(payload("first"));
  });

  it.each(["insert", "pointer"])(
    "rolls back a failed draft %s and allows a clean retry",
    async stage => {
      const first = await saveDraft(key, payload("first"), null);
      const before = await snapshot();
      const table = stage === "insert" ? "cms_revisions" : "cms_documents";
      await failOn(table, stage === "insert" ? "INSERT" : "UPDATE");
      await expect(
        saveDraft(key, payload("second"), first.id)
      ).rejects.toThrow();
      expect(await snapshot()).toEqual(before);
      await allowWrites(table);
      const second = await saveDraft(key, payload("second"), first.id);
      expect(second.revision).toBe(2);
    }
  );

  it.each(["revision", "pointer"])(
    "preserves live content when publish fails at the %s write",
    async stage => {
      const first = await saveDraft(key, payload("first"), null);
      await publishRevision(key, first.id, null);
      const second = await saveDraft(key, payload("second"), first.id);
      const before = await snapshot();
      const table = stage === "revision" ? "cms_revisions" : "cms_documents";
      await failOn(table, "UPDATE");
      await expect(publishRevision(key, second.id, first.id)).rejects.toThrow();
      expect(await snapshot()).toEqual(before);
      expect(await getPublishedPayload(key)).toEqual(payload("first"));
      await allowWrites(table);
      await publishRevision(key, second.id, first.id);
      expect(await getPublishedPayload(key)).toEqual(payload("second"));
    }
  );

  it("rejects stale restore and initial-seed bases without displacing an editor's draft", async () => {
    const first = await saveDraft(key, payload("first"), null);
    const second = await saveDraft(key, payload("second"), first.id);
    const before = await snapshot();
    await expect(
      restoreRevision(key, first.id, first.id)
    ).rejects.toBeInstanceOf(CmsConflictError);
    await expect(saveDraft(key, payload("seed"), null)).rejects.toBeInstanceOf(
      CmsConflictError
    );
    expect(await snapshot()).toEqual(before);
    expect((await getCmsDocument(key))?.document.draft?.id).toBe(second.id);
    expect(
      cmsRestoreBodySchema.safeParse({ revisionId: first.id }).success
    ).toBe(false);
  });

  it("revalidates historical payloads before restore or publication", async () => {
    const first = await saveDraft(key, payload("first"), null);
    // Emulates content accepted by an earlier schema revision.
    await pool.query(
      "UPDATE cms_revisions SET payload = '{}'::jsonb WHERE id = $1",
      [first.id]
    );
    const before = await snapshot();
    await expect(publishRevision(key, first.id, null)).rejects.toBeInstanceOf(
      CmsValidationError
    );
    await expect(
      restoreRevision(key, first.id, first.id)
    ).rejects.toBeInstanceOf(CmsValidationError);
    expect(await snapshot()).toEqual(before);
  });

  it("rolls back a failed restore and preserves the active draft", async () => {
    const first = await saveDraft(key, payload("first"), null);
    const second = await saveDraft(key, payload("second"), first.id);
    const before = await snapshot();
    await failOn("cms_documents", "UPDATE");
    await expect(restoreRevision(key, first.id, second.id)).rejects.toThrow();
    expect(await snapshot()).toEqual(before);
  });

  it("rejects a duplicate concurrent publication without losing live content", async () => {
    const first = await saveDraft(key, payload("first"), null);
    const results = await Promise.allSettled([
      publishRevision(key, first.id, null),
      publishRevision(key, first.id, null),
    ]);
    expect(
      results.filter(result => result.status === "fulfilled")
    ).toHaveLength(1);
    expect(
      (
        results.find(
          result => result.status === "rejected"
        ) as PromiseRejectedResult
      ).reason
    ).toBeInstanceOf(CmsConflictError);
    expect(await getPublishedPayload(key)).toEqual(payload("first"));
  });

  it("keeps a live publication available throughout a competing save and publish", async () => {
    const first = await saveDraft(key, payload("first"), null);
    await publishRevision(key, first.id, null);
    const second = await saveDraft(key, payload("second"), first.id);
    const results = await Promise.allSettled([
      saveDraft(key, payload("third"), second.id),
      publishRevision(key, second.id, first.id),
    ]);
    expect(results.some(result => result.status === "fulfilled")).toBe(true);
    const live = await getPublishedPayload(key);
    expect([payload("first"), payload("second")]).toContainEqual(live);
    const state = await snapshot();
    expect(
      state.revisions.filter(row => row.state === "published")
    ).toHaveLength(1);
    expect(
      state.revisions.filter(row => row.state === "draft").length
    ).toBeLessThanOrEqual(1);
    expect(state.revisions.find(row => row.state === "published")?.id).toBe(
      state.documents[0].published_revision_id
    );
  });

  it("allows only one concurrent save from the same base and leaves no orphan revisions", async () => {
    const first = await saveDraft(key, payload("first"), null);
    const blocker = await pool.connect();
    await blocker.query("BEGIN");
    await blocker.query(
      "SELECT * FROM cms_documents WHERE key = $1 FOR UPDATE",
      [key]
    );
    let writes: Promise<PromiseSettledResult<any>[]>;
    try {
      writes = Promise.allSettled([
        saveDraft(key, payload("left"), first.id),
        saveDraft(key, payload("right"), first.id),
      ]);
      // Ensure both operations have reached the contended row, rather than relying on timing.
      const deadline = Date.now() + 4000;
      let blocked = 0;
      while (Date.now() < deadline) {
        const result = await pool.query(
          "SELECT count(*)::int AS count FROM pg_stat_activity WHERE datname = current_database() AND wait_event_type = 'Lock' AND query LIKE '%WITH locked AS MATERIALIZED%'"
        );
        blocked = result.rows[0].count;
        if (blocked >= 2) break;
        await new Promise(resolve => setTimeout(resolve, 20));
      }
      expect(blocked).toBe(2);
    } finally {
      await blocker.query("COMMIT");
      blocker.release();
    }
    const results = await writes!;
    expect(
      results.filter(result => result.status === "fulfilled")
    ).toHaveLength(1);
    const rejected = results.find(
      result => result.status === "rejected"
    ) as PromiseRejectedResult;
    expect(rejected.reason).toBeInstanceOf(CmsConflictError);
    const state = await snapshot();
    expect(state.revisions).toHaveLength(2);
    expect(state.revisions.filter(row => row.state === "draft")).toHaveLength(
      1
    );
    expect(state.revisions.find(row => row.state === "draft")?.id).toBe(
      state.documents[0].draft_revision_id
    );
  });
});
