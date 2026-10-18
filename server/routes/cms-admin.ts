/**
 * CMS admin API — HTTP surface for the versioned document store in
 * server/db/cmsRepo.ts. Every route sits behind the shared admin guard
 * (OPS_ADMIN_SECRET, fail-closed) and a scoped rate limiter.
 *
 * Payloads are re-validated by the repository against shared/cms/schemas.ts
 * (the publish gate); the zod schemas here only shape the request envelope.
 * Typed repository errors map to HTTP: validation → 400, not found → 404,
 * conflict → 409, unavailable → 503.
 */
import express from "express";
import { randomUUID } from "crypto";
import { logEvent } from "../lib/logging";
import { asyncHandler } from "../lib/async";
import { createAdminRouteGuard } from "../lib/admin-auth";
import { createRateLimitMiddleware } from "../services/rate-limit";
import {
  cmsPublishBodySchema,
  cmsRestoreBodySchema,
  cmsSaveDraftBodySchema,
} from "../lib/schemas";
import { isCmsDocumentKey } from "../../shared/cms/documents";
import {
  CmsConflictError,
  CmsNotFoundError,
  CmsUnavailableError,
  CmsValidationError,
  getCmsDocument,
  listCmsDocuments,
  publishRevision,
  restoreRevision,
  saveDraft,
} from "../db/cmsRepo";

const router = express.Router();

const cmsAdminLimiter = createRateLimitMiddleware({
  scope: "cms:admin",
  windowMs: 15 * 60 * 1000,
  limit: 120,
  message: "Too many CMS admin requests; retry later.",
});

router.use("/api/cms", createAdminRouteGuard({ scope: "cms" }));
router.use("/api/cms", cmsAdminLimiter);

function respondError(
  res: express.Response,
  status: number,
  code: string,
  message: string,
  retryable: boolean,
  extra?: Record<string, unknown>
) {
  return res.status(status).json({
    ok: false,
    requestId: randomUUID(),
    error: { code, message, retryable },
    ...extra,
  });
}

/** Maps cmsRepo typed errors onto the standard error envelope. */
function respondRepoError(res: express.Response, error: unknown) {
  if (error instanceof CmsValidationError) {
    return respondError(res, 400, "VALIDATION_ERROR", error.message, false, {
      issues: error.issues,
    });
  }
  if (error instanceof CmsNotFoundError) {
    return respondError(res, 404, "NOT_FOUND", error.message, false);
  }
  if (error instanceof CmsConflictError) {
    return respondError(res, 409, "CONFLICT", error.message, true);
  }
  if (error instanceof CmsUnavailableError) {
    return respondError(res, 503, "UNAVAILABLE", error.message, true);
  }
  throw error;
}

/** All managed documents with draft/published revision metadata. */
router.get(
  "/api/cms/documents",
  asyncHandler(async (_req, res) => {
    try {
      res.json({
        ok: true,
        requestId: randomUUID(),
        documents: await listCmsDocuments(),
      });
    } catch (error) {
      respondRepoError(res, error);
    }
  })
);

/** One document: both current payloads plus full revision history. */
router.get(
  "/api/cms/documents/:key",
  asyncHandler(async (req, res) => {
    const { key } = req.params;
    if (!isCmsDocumentKey(key)) {
      return respondError(
        res,
        404,
        "NOT_FOUND",
        `Unknown CMS document key "${key}"`,
        false
      );
    }
    try {
      const detail = await getCmsDocument(key);
      if (!detail) {
        return respondError(
          res,
          404,
          "NOT_FOUND",
          `Document "${key}" has not been created yet`,
          false
        );
      }
      res.json({ ok: true, requestId: randomUUID(), ...detail });
    } catch (error) {
      respondRepoError(res, error);
    }
  })
);

/** Saves a new draft, superseding any current draft. */
router.put(
  "/api/cms/documents/:key/draft",
  asyncHandler(async (req, res) => {
    const { key } = req.params;
    if (!isCmsDocumentKey(key)) {
      return respondError(
        res,
        404,
        "NOT_FOUND",
        `Unknown CMS document key "${key}"`,
        false
      );
    }
    const parsed = cmsSaveDraftBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return respondError(
        res,
        400,
        "VALIDATION_ERROR",
        "Invalid draft request body",
        false,
        { issues: parsed.error.issues.map(issue => issue.message) }
      );
    }
    try {
      const revision = await saveDraft(
        key,
        parsed.data.payload,
        parsed.data.baseRevision,
        parsed.data.note
      );
      logEvent("admin.cms_draft_saved", {
        documentKey: key,
        revision: revision.revision,
      });
      res.json({ ok: true, requestId: randomUUID(), revision });
    } catch (error) {
      respondRepoError(res, error);
    }
  })
);

/** Publishes the current draft revision. */
router.post(
  "/api/cms/documents/:key/publish",
  asyncHandler(async (req, res) => {
    const { key } = req.params;
    if (!isCmsDocumentKey(key)) {
      return respondError(
        res,
        404,
        "NOT_FOUND",
        `Unknown CMS document key "${key}"`,
        false
      );
    }
    const parsed = cmsPublishBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return respondError(
        res,
        400,
        "VALIDATION_ERROR",
        "Invalid publish request body",
        false,
        { issues: parsed.error.issues.map(issue => issue.message) }
      );
    }
    try {
      const revision = await publishRevision(
        key,
        parsed.data.revisionId,
        parsed.data.expectedPublishedRevisionId
      );
      logEvent("admin.cms_revision_published", {
        documentKey: key,
        revision: revision.revision,
      });
      res.json({ ok: true, requestId: randomUUID(), revision });
    } catch (error) {
      respondRepoError(res, error);
    }
  })
);

/** Copies a historical revision into a new draft (never touches published). */
router.post(
  "/api/cms/documents/:key/restore",
  asyncHandler(async (req, res) => {
    const { key } = req.params;
    if (!isCmsDocumentKey(key)) {
      return respondError(
        res,
        404,
        "NOT_FOUND",
        `Unknown CMS document key "${key}"`,
        false
      );
    }
    const parsed = cmsRestoreBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return respondError(
        res,
        400,
        "VALIDATION_ERROR",
        "Invalid restore request body",
        false,
        { issues: parsed.error.issues.map(issue => issue.message) }
      );
    }
    try {
      const revision = await restoreRevision(
        key,
        parsed.data.revisionId,
        parsed.data.baseRevision
      );
      logEvent("admin.cms_revision_restored", {
        documentKey: key,
        revision: revision.revision,
        restoredFrom: parsed.data.revisionId,
      });
      res.json({ ok: true, requestId: randomUUID(), revision });
    } catch (error) {
      respondRepoError(res, error);
    }
  })
);

export default router;
