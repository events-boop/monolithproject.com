// @vitest-environment node
import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import express from "express";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";

const mockState = vi.hoisted(() => ({
  listCmsDocuments: vi.fn(),
  getCmsDocument: vi.fn(),
  saveDraft: vi.fn(),
  publishRevision: vi.fn(),
  restoreRevision: vi.fn(),
  listRevisionHistory: vi.fn(),
  getPublishedPayload: vi.fn(),
}));

vi.mock("../db/cmsRepo", async importOriginal => {
  const actual = await importOriginal<typeof import("../db/cmsRepo")>();
  return {
    ...actual,
    listCmsDocuments: (...args: unknown[]) =>
      mockState.listCmsDocuments(...args),
    getCmsDocument: (...args: unknown[]) => mockState.getCmsDocument(...args),
    saveDraft: (...args: unknown[]) => mockState.saveDraft(...args),
    publishRevision: (...args: unknown[]) => mockState.publishRevision(...args),
    restoreRevision: (...args: unknown[]) =>
      mockState.restoreRevision(...args),
    listRevisionHistory: (...args: unknown[]) =>
      mockState.listRevisionHistory(...args),
    getPublishedPayload: (...args: unknown[]) =>
      mockState.getPublishedPayload(...args),
  };
});

import {
  CmsConflictError,
  CmsNotFoundError,
  CmsUnavailableError,
  CmsValidationError,
} from "../db/cmsRepo";
import cmsAdminRouter from "../routes/cms-admin";

const SECRET = "test-admin-secret";

let server: Server | null = null;
let baseUrl = "";

function startApp() {
  const app = express();
  app.use(express.json());
  app.use(cmsAdminRouter);
  return new Promise<void>(resolve => {
    server = app.listen(0, "127.0.0.1", () => {
      const { port } = server!.address() as AddressInfo;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
}

function call(
  path: string,
  options: { method?: string; body?: unknown; secret?: string | null } = {}
) {
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (options.secret) headers["x-admin-secret"] = options.secret;
  return fetch(`${baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
}

const trackingPayload = {
  metaPixelId: "1049241148606250",
  metaBrandPixelId: "166134370742863",
  ga4MeasurementId: "G-DE8Z8VS263",
};

const revisionMeta = {
  id: 7,
  documentKey: "tracking.pixels",
  revision: 3,
  state: "draft",
  note: null,
  createdAt: "2026-09-21T00:00:00.000Z",
};

beforeEach(async () => {
  vi.clearAllMocks();
  process.env.OPS_ADMIN_SECRET = SECRET;
  await startApp();
});

afterAll(() => {
  delete process.env.OPS_ADMIN_SECRET;
});

// Each test stops its own server; afterAll would race with parallel files.
afterEach(async () => {
  await new Promise<void>(resolve => server?.close(() => resolve()));
  server = null;
});

describe("cms admin auth", () => {
  it("returns 401 without credentials", async () => {
    const res = await call("/api/cms/documents");
    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe("INVALID_CREDENTIALS");
  });

  it("returns 401 with a wrong secret", async () => {
    const res = await call("/api/cms/documents", { secret: "nope" });
    expect(res.status).toBe(401);
  });

  it("returns 503 when OPS_ADMIN_SECRET is unset", async () => {
    delete process.env.OPS_ADMIN_SECRET;
    const res = await call("/api/cms/documents", { secret: SECRET });
    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error.code).toBe("UNAVAILABLE");
    process.env.OPS_ADMIN_SECRET = SECRET;
  });
});

describe("cms admin reads", () => {
  it("lists documents", async () => {
    mockState.listCmsDocuments.mockResolvedValue([
      { key: "tracking.pixels", kind: "tracking-pixels", label: "Tracking" },
    ]);
    const res = await call("/api/cms/documents", { secret: SECRET });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.documents).toHaveLength(1);
    expect(body.documents[0].key).toBe("tracking.pixels");
  });

  it("returns document detail with payloads and revisions", async () => {
    mockState.getCmsDocument.mockResolvedValue({
      document: { key: "tracking.pixels" },
      draftPayload: trackingPayload,
      publishedPayload: null,
      revisions: [revisionMeta],
    });
    const res = await call("/api/cms/documents/tracking.pixels", {
      secret: SECRET,
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.draftPayload.metaPixelId).toBe("1049241148606250");
    expect(body.revisions).toHaveLength(1);
  });

  it("404s on unknown document keys", async () => {
    const res = await call("/api/cms/documents/nope.unknown", {
      secret: SECRET,
    });
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error.code).toBe("NOT_FOUND");
  });

  it("404s when the document has not been created", async () => {
    mockState.getCmsDocument.mockResolvedValue(null);
    const res = await call("/api/cms/documents/tracking.pixels", {
      secret: SECRET,
    });
    expect(res.status).toBe(404);
  });
});

describe("cms admin draft saves", () => {
  it("saves a draft and returns the revision meta", async () => {
    mockState.saveDraft.mockResolvedValue(revisionMeta);
    const res = await call("/api/cms/documents/tracking.pixels/draft", {
      method: "PUT",
      secret: SECRET,
      body: { payload: trackingPayload, baseRevision: 6, note: "rotate GA4" },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.revision.revision).toBe(3);
    expect(mockState.saveDraft).toHaveBeenCalledWith(
      "tracking.pixels",
      trackingPayload,
      6,
      "rotate GA4"
    );
  });

  it("400s when payload is missing", async () => {
    const res = await call("/api/cms/documents/tracking.pixels/draft", {
      method: "PUT",
      secret: SECRET,
      body: { baseRevision: 6 },
    });
    expect(res.status).toBe(400);
    expect(mockState.saveDraft).not.toHaveBeenCalled();
  });

  it("400s with issues on CMS validation failure", async () => {
    mockState.saveDraft.mockRejectedValue(
      new CmsValidationError(["ga4MeasurementId: bad format"])
    );
    const res = await call("/api/cms/documents/tracking.pixels/draft", {
      method: "PUT",
      secret: SECRET,
      body: { payload: trackingPayload, baseRevision: 6 },
    });
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error.code).toBe("VALIDATION_ERROR");
    expect(body.issues).toContain("ga4MeasurementId: bad format");
  });

  it("409s on a stale base revision", async () => {
    mockState.saveDraft.mockRejectedValue(
      new CmsConflictError("Stale editor session")
    );
    const res = await call("/api/cms/documents/tracking.pixels/draft", {
      method: "PUT",
      secret: SECRET,
      body: { payload: trackingPayload, baseRevision: 1 },
    });
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error.code).toBe("CONFLICT");
    expect(body.error.retryable).toBe(true);
  });

  it("503s when CMS storage is unavailable", async () => {
    mockState.saveDraft.mockRejectedValue(new CmsUnavailableError());
    const res = await call("/api/cms/documents/tracking.pixels/draft", {
      method: "PUT",
      secret: SECRET,
      body: { payload: trackingPayload, baseRevision: null },
    });
    expect(res.status).toBe(503);
  });
});

describe("cms admin publish and restore", () => {
  it("publishes the current draft", async () => {
    mockState.publishRevision.mockResolvedValue({
      ...revisionMeta,
      state: "published",
    });
    const res = await call("/api/cms/documents/tracking.pixels/publish", {
      method: "POST",
      secret: SECRET,
      body: { revisionId: 7, expectedPublishedRevisionId: null },
    });
    expect(res.status).toBe(200);
    expect(mockState.publishRevision).toHaveBeenCalledWith(
      "tracking.pixels",
      7,
      null
    );
  });

  it("404s when the revision does not exist", async () => {
    mockState.publishRevision.mockRejectedValue(
      new CmsNotFoundError('Revision 9 not found for "tracking.pixels"')
    );
    const res = await call("/api/cms/documents/tracking.pixels/publish", {
      method: "POST",
      secret: SECRET,
      body: { revisionId: 9, expectedPublishedRevisionId: null },
    });
    expect(res.status).toBe(404);
  });

  it("restores a historical revision into a new draft", async () => {
    mockState.restoreRevision.mockResolvedValue({
      ...revisionMeta,
      revision: 4,
      note: "Restored from revision 2",
    });
    const res = await call("/api/cms/documents/tracking.pixels/restore", {
      method: "POST",
      secret: SECRET,
      body: { revisionId: 2, baseRevision: 6 },
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.revision.note).toContain("Restored");
    expect(mockState.restoreRevision).toHaveBeenCalledWith(
      "tracking.pixels",
      2,
      6
    );
  });

  it("400s when restore omits the base revision", async () => {
    const res = await call("/api/cms/documents/tracking.pixels/restore", {
      method: "POST",
      secret: SECRET,
      body: { revisionId: 2 },
    });
    expect(res.status).toBe(400);
    expect(mockState.restoreRevision).not.toHaveBeenCalled();
  });
});
