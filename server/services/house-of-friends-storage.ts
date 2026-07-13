import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createHmac, randomBytes, randomUUID, timingSafeEqual } from "crypto";
import { mkdir, readFile, stat, writeFile } from "fs/promises";
import path from "path";
import type {
  HouseOfFriendsAssetType,
  HouseOfFriendsPrepareRequest,
  HouseOfFriendsPrepareResponse,
} from "@shared/house-of-friends";
import { HOUSE_OF_FRIENDS_APPLICATION_YEAR } from "@shared/house-of-friends";

const TOKEN_LIFETIME_SECONDS = 60 * 60;
const LOCAL_UPLOAD_ROOT = path.resolve(process.cwd(), "var/uploads");

type StorageMode = "r2" | "local";

type R2Config = {
  bucket: string;
  client: S3Client;
};

type ApplicationTokenPayload = {
  applicationId: string;
  referenceCode: string;
  folderPrefix: string;
  profileKey: string;
  assets: Record<
    HouseOfFriendsAssetType,
    {
      key: string;
      name: string;
      size: number;
      type: string;
    }
  >;
  storageMode: StorageMode;
  expiresAt: number;
};

export type StoredHouseOfFriendsApplication = HouseOfFriendsPrepareRequest & {
  applicationId: string;
  referenceCode: string;
  folderPrefix: string;
  profileKey: string;
  photoObjectKey: string;
  djSetObjectKey: string;
  status: "uploading" | "submitted";
  createdAt: string;
  submittedAt?: string;
};

export class HouseOfFriendsStorageError extends Error {
  constructor(
    message: string,
    readonly code:
      | "APPLICATIONS_CLOSED"
      | "STORAGE_NOT_CONFIGURED"
      | "INVALID_UPLOAD_TOKEN"
      | "UPLOAD_INCOMPLETE"
      | "UPLOAD_MISMATCH",
    readonly status = 400
  ) {
    super(message);
  }
}

let localSigningSecret: string | undefined;

const PRODUCTION_APPLICATION_VARS = [
  "DATABASE_URL",
  "HOF_R2_ACCOUNT_ID",
  "HOF_R2_ACCESS_KEY_ID",
  "HOF_R2_SECRET_ACCESS_KEY",
  "HOF_R2_BUCKET",
  "HOF_APPLICATION_SIGNING_SECRET",
] as const;

export function getHouseOfFriendsApplicationReadiness() {
  if (process.env.NODE_ENV !== "production") {
    return {
      acceptingApplications: true,
      message: "House of Friends applications are open in local preview.",
    };
  }

  const applicationsOpen =
    process.env.HOF_APPLICATIONS_OPEN?.trim().toLowerCase() === "true";
  const infrastructureReady = PRODUCTION_APPLICATION_VARS.every(variable =>
    Boolean(process.env[variable]?.trim())
  );

  if (!applicationsOpen) {
    return {
      acceptingApplications: false,
      message:
        "Founding Class applications are being prepared. Opening details will be announced soon.",
    };
  }

  if (!infrastructureReady) {
    return {
      acceptingApplications: false,
      message:
        "Founding Class applications are temporarily unavailable while secure intake is connected.",
    };
  }

  return {
    acceptingApplications: true,
    message: "House of Friends Founding Class applications are open.",
  };
}

function readR2Config(): R2Config | null {
  const accountId = process.env.HOF_R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.HOF_R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.HOF_R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.HOF_R2_BUCKET?.trim();

  const configured = [accountId, accessKeyId, secretAccessKey, bucket].filter(
    Boolean
  ).length;
  if (configured === 0) return null;
  if (configured !== 4) {
    throw new HouseOfFriendsStorageError(
      "House of Friends media storage is only partially configured.",
      "STORAGE_NOT_CONFIGURED",
      503
    );
  }

  return {
    bucket: bucket!,
    client: new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    }),
  };
}

function resolveStorageMode(): StorageMode {
  const readiness = getHouseOfFriendsApplicationReadiness();
  if (!readiness.acceptingApplications) {
    throw new HouseOfFriendsStorageError(
      readiness.message,
      process.env.HOF_APPLICATIONS_OPEN?.trim().toLowerCase() === "true"
        ? "STORAGE_NOT_CONFIGURED"
        : "APPLICATIONS_CLOSED",
      503
    );
  }

  if (readR2Config()) return "r2";
  if (process.env.NODE_ENV !== "production") return "local";

  throw new HouseOfFriendsStorageError(
    "Artist applications are not open yet. Media storage must be connected before launch.",
    "STORAGE_NOT_CONFIGURED",
    503
  );
}

function getSigningSecret(storageMode: StorageMode) {
  const configured = process.env.HOF_APPLICATION_SIGNING_SECRET?.trim();
  if (configured) return configured;

  if (storageMode === "local" && process.env.NODE_ENV !== "production") {
    localSigningSecret ||= randomBytes(48).toString("base64url");
    return localSigningSecret;
  }

  throw new HouseOfFriendsStorageError(
    "Application signing is not configured.",
    "STORAGE_NOT_CONFIGURED",
    503
  );
}

function encodeToken(payload: ApplicationTokenPayload) {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );
  const signature = createHmac("sha256", getSigningSecret(payload.storageMode))
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifyApplicationToken(token: string) {
  const [encodedPayload, providedSignature, extra] = token.split(".");
  if (!encodedPayload || !providedSignature || extra) {
    throw new HouseOfFriendsStorageError(
      "The upload session is invalid. Start the application again.",
      "INVALID_UPLOAD_TOKEN",
      401
    );
  }

  let payload: ApplicationTokenPayload;
  try {
    payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as ApplicationTokenPayload;
  } catch {
    throw new HouseOfFriendsStorageError(
      "The upload session is invalid. Start the application again.",
      "INVALID_UPLOAD_TOKEN",
      401
    );
  }

  const expectedSignature = createHmac(
    "sha256",
    getSigningSecret(payload.storageMode)
  )
    .update(encodedPayload)
    .digest("base64url");
  const provided = Buffer.from(providedSignature);
  const expected = Buffer.from(expectedSignature);

  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected) ||
    !payload.expiresAt ||
    payload.expiresAt < Date.now()
  ) {
    throw new HouseOfFriendsStorageError(
      "The upload session expired. Start the application again.",
      "INVALID_UPLOAD_TOKEN",
      401
    );
  }

  return payload;
}

function extensionForType(contentType: string) {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "audio/x-m4a": "m4a",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/flac": "flac",
    "audio/x-flac": "flac",
  };
  return extensions[contentType] || "bin";
}

function safeLocalPath(objectKey: string) {
  const resolved = path.resolve(LOCAL_UPLOAD_ROOT, objectKey);
  if (!resolved.startsWith(`${LOCAL_UPLOAD_ROOT}${path.sep}`)) {
    throw new HouseOfFriendsStorageError(
      "The upload path is invalid.",
      "INVALID_UPLOAD_TOKEN",
      401
    );
  }
  return resolved;
}

export function getLocalAssetPath(objectKey: string) {
  return safeLocalPath(objectKey);
}

async function writeJsonObject(
  storageMode: StorageMode,
  objectKey: string,
  body: StoredHouseOfFriendsApplication
) {
  const serialized = JSON.stringify(body, null, 2);
  if (storageMode === "r2") {
    const config = readR2Config();
    if (!config) throw new Error("R2 configuration disappeared.");
    await config.client.send(
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: objectKey,
        Body: serialized,
        ContentType: "application/json; charset=utf-8",
        CacheControl: "private, no-store",
      })
    );
    return;
  }

  const filePath = safeLocalPath(objectKey);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, serialized, { encoding: "utf8", mode: 0o600 });
}

async function readJsonObject(
  payload: ApplicationTokenPayload
): Promise<StoredHouseOfFriendsApplication> {
  if (payload.storageMode === "r2") {
    const config = readR2Config();
    if (!config) {
      throw new HouseOfFriendsStorageError(
        "Media storage is unavailable.",
        "STORAGE_NOT_CONFIGURED",
        503
      );
    }
    const response = await config.client.send(
      new GetObjectCommand({
        Bucket: config.bucket,
        Key: payload.profileKey,
      })
    );
    const serialized = await response.Body?.transformToString("utf8");
    if (!serialized) throw new Error("Application profile is empty.");
    return JSON.parse(serialized) as StoredHouseOfFriendsApplication;
  }

  return JSON.parse(
    await readFile(safeLocalPath(payload.profileKey), "utf8")
  ) as StoredHouseOfFriendsApplication;
}

async function createUploadTargets(
  payload: ApplicationTokenPayload,
  applicationToken: string
) {
  if (payload.storageMode === "local") {
    return (Object.keys(payload.assets) as HouseOfFriendsAssetType[]).map(
      assetType => ({
        assetType,
        key: payload.assets[assetType].key,
        method: "PUT" as const,
        url: `/api/house-of-friends/applications/${payload.applicationId}/assets/${assetType}`,
        headers: {
          "Content-Type": payload.assets[assetType].type,
          "X-HOF-Application-Token": applicationToken,
        },
      })
    );
  }

  const config = readR2Config();
  if (!config) throw new Error("R2 configuration disappeared.");

  return Promise.all(
    (Object.keys(payload.assets) as HouseOfFriendsAssetType[]).map(
      async assetType => ({
        assetType,
        key: payload.assets[assetType].key,
        method: "PUT" as const,
        url: await getSignedUrl(
          config.client,
          new PutObjectCommand({
            Bucket: config.bucket,
            Key: payload.assets[assetType].key,
            ContentType: payload.assets[assetType].type,
          }),
          { expiresIn: TOKEN_LIFETIME_SECONDS }
        ),
        headers: {
          "Content-Type": payload.assets[assetType].type,
        },
      })
    )
  );
}

export async function prepareHouseOfFriendsApplication(
  application: HouseOfFriendsPrepareRequest
): Promise<HouseOfFriendsPrepareResponse> {
  const storageMode = resolveStorageMode();
  const applicationId = `hof_${HOUSE_OF_FRIENDS_APPLICATION_YEAR}_${randomUUID()}`;
  const referenceCode = `HOF26-${randomBytes(4).toString("hex").toUpperCase()}`;
  const folderPrefix = `house-of-friends/${HOUSE_OF_FRIENDS_APPLICATION_YEAR}/applications/${referenceCode.toLowerCase()}`;
  const profileKey = `${folderPrefix}/profile/application.json`;
  const photoObjectKey = `${folderPrefix}/photo/artist-photo.${extensionForType(application.photo.type)}`;
  const djSetObjectKey = `${folderPrefix}/dj-set/submission.${extensionForType(application.djSet.type)}`;
  const createdAt = new Date().toISOString();

  const tokenPayload: ApplicationTokenPayload = {
    applicationId,
    referenceCode,
    folderPrefix,
    profileKey,
    assets: {
      photo: {
        ...application.photo,
        key: photoObjectKey,
      },
      "dj-set": {
        ...application.djSet,
        key: djSetObjectKey,
      },
    },
    storageMode,
    expiresAt: Date.now() + TOKEN_LIFETIME_SECONDS * 1_000,
  };

  const storedApplication: StoredHouseOfFriendsApplication = {
    ...application,
    applicationId,
    referenceCode,
    folderPrefix,
    profileKey,
    photoObjectKey,
    djSetObjectKey,
    status: "uploading",
    createdAt,
  };

  await writeJsonObject(storageMode, profileKey, storedApplication);
  const applicationToken = encodeToken(tokenPayload);
  const uploads = await createUploadTargets(tokenPayload, applicationToken);

  return {
    ok: true,
    applicationId,
    referenceCode,
    folderPrefix,
    applicationToken,
    uploads,
  };
}

async function verifyRemoteAssets(payload: ApplicationTokenPayload) {
  const config = readR2Config();
  if (!config) {
    throw new HouseOfFriendsStorageError(
      "Media storage is unavailable.",
      "STORAGE_NOT_CONFIGURED",
      503
    );
  }

  for (const assetType of Object.keys(
    payload.assets
  ) as HouseOfFriendsAssetType[]) {
    const asset = payload.assets[assetType];
    let response;
    try {
      response = await config.client.send(
        new HeadObjectCommand({ Bucket: config.bucket, Key: asset.key })
      );
    } catch {
      throw new HouseOfFriendsStorageError(
        `${assetType === "photo" ? "Artist photo" : "DJ set"} upload is incomplete.`,
        "UPLOAD_INCOMPLETE",
        409
      );
    }

    if (response.ContentLength !== asset.size) {
      throw new HouseOfFriendsStorageError(
        `${assetType === "photo" ? "Artist photo" : "DJ set"} did not upload completely.`,
        "UPLOAD_MISMATCH",
        409
      );
    }
  }
}

async function verifyLocalAssets(payload: ApplicationTokenPayload) {
  for (const assetType of Object.keys(
    payload.assets
  ) as HouseOfFriendsAssetType[]) {
    const asset = payload.assets[assetType];
    let fileStats;
    try {
      fileStats = await stat(safeLocalPath(asset.key));
    } catch {
      throw new HouseOfFriendsStorageError(
        `${assetType === "photo" ? "Artist photo" : "DJ set"} upload is incomplete.`,
        "UPLOAD_INCOMPLETE",
        409
      );
    }

    if (!fileStats.isFile() || fileStats.size !== asset.size) {
      throw new HouseOfFriendsStorageError(
        `${assetType === "photo" ? "Artist photo" : "DJ set"} did not upload completely.`,
        "UPLOAD_MISMATCH",
        409
      );
    }
  }
}

export async function completeHouseOfFriendsApplication(token: string) {
  const payload = verifyApplicationToken(token);
  if (payload.storageMode === "r2") await verifyRemoteAssets(payload);
  else await verifyLocalAssets(payload);

  const application = await readJsonObject(payload);
  if (
    application.applicationId !== payload.applicationId ||
    application.folderPrefix !== payload.folderPrefix
  ) {
    throw new HouseOfFriendsStorageError(
      "The application record does not match this upload session.",
      "INVALID_UPLOAD_TOKEN",
      401
    );
  }

  const completed: StoredHouseOfFriendsApplication = {
    ...application,
    status: "submitted",
    submittedAt: application.submittedAt || new Date().toISOString(),
  };
  await writeJsonObject(payload.storageMode, payload.profileKey, completed);
  return completed;
}
