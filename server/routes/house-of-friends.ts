import { createWriteStream } from "fs";
import { mkdir, rename, rm, stat } from "fs/promises";
import path from "path";
import { pipeline } from "stream/promises";
import { randomUUID } from "crypto";
import { Router, type Response } from "express";
import type { HouseOfFriendsAssetType } from "@shared/house-of-friends";
import {
  houseOfFriendsApplicationSchema,
  houseOfFriendsCompleteSchema,
} from "../lib/schemas";
import { asyncHandler } from "../lib/async";
import { logEvent } from "../lib/logging";
import { honeypotFieldName, readHoneypotValue } from "../lib/honeypot";
import { isProductionRuntime } from "../lib/runtime-trust";
import { createRateLimitMiddleware } from "../services/rate-limit";
import {
  completeHouseOfFriendsApplication,
  getHouseOfFriendsApplicationReadiness,
  getLocalAssetPath,
  HouseOfFriendsStorageError,
  prepareHouseOfFriendsApplication,
  verifyApplicationToken,
} from "../services/house-of-friends-storage";
import { deliverHouseOfFriendsApplication } from "../services/house-of-friends-applications";

const router = Router();

router.get("/api/house-of-friends/applications/status", (_req, res) => {
  const readiness = getHouseOfFriendsApplicationReadiness();
  return res.json({ ok: true, ...readiness });
});

const prepareLimiter = createRateLimitMiddleware({
  scope: "api:house-of-friends:prepare",
  windowMs: 60 * 60 * 1_000,
  limit: 6,
  message:
    "Too many application attempts. Wait an hour before starting another one.",
});

const completeLimiter = createRateLimitMiddleware({
  scope: "api:house-of-friends:complete",
  windowMs: 60 * 60 * 1_000,
  limit: 12,
  message: "Too many completion attempts. Wait before trying again.",
});

function sendStorageError(res: Response, error: unknown, requestId: string) {
  if (!(error instanceof HouseOfFriendsStorageError)) return false;
  res.status(error.status).json({
    ok: false,
    requestId,
    error: {
      code: error.code,
      message: error.message,
      retryable: error.status >= 500 || error.status === 409,
    },
  });
  return true;
}

router.post(
  "/api/house-of-friends/applications",
  prepareLimiter,
  asyncHandler(async (req, res) => {
    const requestId = randomUUID();
    if (readHoneypotValue(req.body)) {
      logEvent("bot.honeypot_triggered", {
        requestId,
        route: "/api/house-of-friends/applications",
        field: honeypotFieldName,
      });
      return res.status(202).json({
        ok: true,
        requestId,
        message: "Application received.",
      });
    }

    const parsed = houseOfFriendsApplicationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        requestId,
        error: {
          code: "VALIDATION_ERROR",
          message: "Review the highlighted application fields and files.",
          retryable: false,
          fields: parsed.error.flatten().fieldErrors,
        },
      });
    }

    const {
      [honeypotFieldName]: _honeypot,
      metadata_correlation_id: _legacyHoneypot,
      ...application
    } = parsed.data;

    try {
      const prepared = await prepareHouseOfFriendsApplication(application);
      logEvent("house_of_friends.application_prepared", {
        requestId,
        applicationId: prepared.applicationId,
        referenceCode: prepared.referenceCode,
      });
      return res.status(201).json({ ...prepared, requestId });
    } catch (error) {
      if (sendStorageError(res, error, requestId)) return;
      throw error;
    }
  })
);

router.put(
  "/api/house-of-friends/applications/:applicationId/assets/:assetType",
  asyncHandler(async (req, res) => {
    const requestId = randomUUID();
    if (isProductionRuntime()) {
      return res.status(404).json({
        ok: false,
        requestId,
        error: {
          code: "NOT_FOUND",
          message: "This upload route is available only in local preview.",
          retryable: false,
        },
      });
    }

    const token = req.header("x-hof-application-token")?.trim();
    if (!token) {
      return res.status(401).json({
        ok: false,
        requestId,
        error: {
          code: "INVALID_UPLOAD_TOKEN",
          message: "The upload session is missing.",
          retryable: false,
        },
      });
    }

    try {
      const payload = verifyApplicationToken(token);
      const assetType = req.params.assetType as HouseOfFriendsAssetType;
      const asset = payload.assets[assetType];
      if (
        payload.storageMode !== "local" ||
        payload.applicationId !== req.params.applicationId ||
        !asset
      ) {
        throw new HouseOfFriendsStorageError(
          "The upload session does not match this file.",
          "INVALID_UPLOAD_TOKEN",
          401
        );
      }

      const contentType = req.header("content-type")?.split(";")[0]?.trim();
      const contentLength = Number.parseInt(
        req.header("content-length") || "",
        10
      );
      if (contentType !== asset.type || contentLength !== asset.size) {
        throw new HouseOfFriendsStorageError(
          "The selected file no longer matches the prepared upload.",
          "UPLOAD_MISMATCH",
          409
        );
      }

      const targetPath = getLocalAssetPath(asset.key);
      await mkdir(path.dirname(targetPath), { recursive: true });
      const temporaryPath = `${targetPath}.uploading-${randomUUID()}`;

      try {
        await pipeline(
          req,
          createWriteStream(temporaryPath, { flags: "wx", mode: 0o600 })
        );
        const uploaded = await stat(temporaryPath);
        if (uploaded.size !== asset.size) {
          throw new HouseOfFriendsStorageError(
            "The file upload ended before the full file arrived.",
            "UPLOAD_MISMATCH",
            409
          );
        }
        await rename(temporaryPath, targetPath);
      } catch (error) {
        await rm(temporaryPath, { force: true }).catch(() => undefined);
        throw error;
      }

      return res.status(204).end();
    } catch (error) {
      if (sendStorageError(res, error, requestId)) return;
      throw error;
    }
  })
);

router.post(
  "/api/house-of-friends/applications/complete",
  completeLimiter,
  asyncHandler(async (req, res) => {
    const requestId = randomUUID();
    const parsed = houseOfFriendsCompleteSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        ok: false,
        requestId,
        error: {
          code: "VALIDATION_ERROR",
          message: "The upload session is missing or invalid.",
          retryable: false,
        },
      });
    }

    try {
      const application = await completeHouseOfFriendsApplication(
        parsed.data.applicationToken
      );
      await deliverHouseOfFriendsApplication(application, requestId);
      return res.status(201).json({
        ok: true,
        requestId,
        applicationId: application.applicationId,
        referenceCode: application.referenceCode,
        message:
          "Your House of Friends Founding Class application is registered.",
      });
    } catch (error) {
      if (sendStorageError(res, error, requestId)) return;
      throw error;
    }
  })
);

export default router;
