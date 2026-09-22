// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  assertBaseRevision,
  CmsConflictError,
  CmsUnavailableError,
  CmsValidationError,
  computeNextRevision,
  expectedBaseRevision,
  getCmsDocument,
  getPublishedPayload,
  listCmsDocuments,
  listRevisionHistory,
  publishRevision,
  restoreRevision,
  saveDraft,
} from "../cmsRepo";
import { hasDatabase } from "../client";

// These tests run without DATABASE_URL: every repository function must fail
// safe (null/empty reads, typed errors for mutations) instead of crashing.

describe("cmsRepo without a database", () => {
  it("confirms the test environment really has no database", () => {
    expect(hasDatabase()).toBe(false);
  });

  it("reads return empty/null", async () => {
    await expect(listCmsDocuments()).resolves.toEqual([]);
    await expect(getCmsDocument("events.catalogue")).resolves.toBeNull();
    await expect(getPublishedPayload("events.catalogue")).resolves.toBeNull();
    await expect(listRevisionHistory("events.catalogue")).resolves.toEqual([]);
  });

  it("mutations throw CmsUnavailableError", async () => {
    const validHomeFeatured = {
      slots: {
        hero: "css-sep19",
        banner: "css-sep19",
        funnel: "css-sep19",
        ticket: "css-sep19",
        guide: "css-sep19",
      },
    };
    await expect(
      saveDraft("home.featured", validHomeFeatured, null)
    ).rejects.toBeInstanceOf(CmsUnavailableError);
    await expect(
      publishRevision("home.featured", 1, null)
    ).rejects.toBeInstanceOf(CmsUnavailableError);
    await expect(
      restoreRevision("home.featured", 1, null)
    ).rejects.toBeInstanceOf(CmsUnavailableError);
  });

  it("saveDraft validates the payload before touching the database", async () => {
    await expect(
      saveDraft("home.featured", { slots: { hero: "css-sep19" } }, null)
    ).rejects.toBeInstanceOf(CmsValidationError);

    try {
      await saveDraft("home.featured", { slots: { hero: "css-sep19" } }, null);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(CmsValidationError);
      const issues = (error as CmsValidationError).issues;
      expect(issues.length).toBeGreaterThan(0);
      expect(issues.some(issue => issue.includes("slots"))).toBe(true);
    }
  });

  it("saveDraft rejects unknown document keys with CmsValidationError", async () => {
    await expect(saveDraft("nope.unknown", {}, null)).rejects.toBeInstanceOf(
      CmsValidationError
    );
  });
});

describe("expectedBaseRevision", () => {
  it("is 0 for a missing document", () => {
    expect(expectedBaseRevision(null)).toBe(0);
  });

  it("prefers the draft pointer over the published pointer", () => {
    expect(
      expectedBaseRevision({ draftRevisionId: 7, publishedRevisionId: 3 })
    ).toBe(7);
  });

  it("falls back to the published pointer when no draft exists", () => {
    expect(
      expectedBaseRevision({ draftRevisionId: null, publishedRevisionId: 3 })
    ).toBe(3);
  });

  it("is 0 when neither pointer is set", () => {
    expect(
      expectedBaseRevision({ draftRevisionId: null, publishedRevisionId: null })
    ).toBe(0);
  });
});

describe("assertBaseRevision", () => {
  const document = { draftRevisionId: null, publishedRevisionId: 3 };

  it("accepts a matching base", () => {
    expect(() => assertBaseRevision(document, 3)).not.toThrow();
  });

  it("treats null/undefined as 0 for new documents", () => {
    expect(() => assertBaseRevision(null, null)).not.toThrow();
    expect(() => assertBaseRevision(null, undefined)).not.toThrow();
    expect(() => assertBaseRevision(null, 0)).not.toThrow();
  });

  it("throws CmsConflictError on a stale base", () => {
    expect(() => assertBaseRevision(document, 2)).toThrow(CmsConflictError);
    expect(() => assertBaseRevision(document, null)).toThrow(CmsConflictError);
    expect(() => assertBaseRevision(null, 5)).toThrow(CmsConflictError);
  });
});

describe("computeNextRevision", () => {
  it("starts at 1 for an empty history", () => {
    expect(computeNextRevision([])).toBe(1);
  });

  it("is max + 1 regardless of ordering", () => {
    expect(computeNextRevision([1, 2, 3])).toBe(4);
    expect(computeNextRevision([9, 2, 5])).toBe(10);
  });
});
