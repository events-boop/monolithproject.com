import {
  GetBucketCorsCommand,
  HeadBucketCommand,
  PutBucketCorsCommand,
  S3Client,
} from "@aws-sdk/client-s3";

function requireEnvironment(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

const accountId = requireEnvironment("HOF_R2_ACCOUNT_ID");
const accessKeyId = requireEnvironment("HOF_R2_ACCESS_KEY_ID");
const secretAccessKey = requireEnvironment("HOF_R2_SECRET_ACCESS_KEY");
const bucket = requireEnvironment("HOF_R2_BUCKET");
const allowedOrigins = (
  process.env.HOF_ALLOWED_UPLOAD_ORIGINS ||
  "https://monolithproject.com,https://www.monolithproject.com,https://houseoffriends.vip,https://www.houseoffriends.vip"
)
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

await client.send(new HeadBucketCommand({ Bucket: bucket }));
await client.send(
  new PutBucketCorsCommand({
    Bucket: bucket,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: allowedOrigins,
          AllowedMethods: ["PUT", "HEAD"],
          AllowedHeaders: ["content-type"],
          ExposeHeaders: ["ETag"],
          MaxAgeSeconds: 3_600,
        },
      ],
    },
  })
);

const configured = await client.send(
  new GetBucketCorsCommand({ Bucket: bucket })
);
const rule = configured.CORSRules?.[0];
if (
  !rule ||
  !allowedOrigins.every(origin => rule.AllowedOrigins?.includes(origin))
) {
  throw new Error("R2 CORS verification failed.");
}

console.log(
  JSON.stringify(
    {
      ok: true,
      bucket,
      allowedOrigins,
      allowedMethods: rule.AllowedMethods,
      exposedHeaders: rule.ExposeHeaders,
    },
    null,
    2
  )
);
