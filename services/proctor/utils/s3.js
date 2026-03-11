import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

let s3Client = null;

// Reuse one S3 client instance per process.
function getS3Client() {
  if (s3Client) return s3Client;

  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    throw new Error("Missing AWS S3 environment configuration");
  }

  s3Client = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });

  return s3Client;
}

// Accept data URL or raw base64 input and normalize to buffer + mime type.
function parseImagePayload(imageBase64) {
  if (!imageBase64 || typeof imageBase64 !== "string") {
    throw new Error("imageBase64 is required");
  }

  const dataUrlMatch = imageBase64.match(
    /^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/,
  );

  if (dataUrlMatch) {
    return {
      mimeType: dataUrlMatch[1],
      buffer: Buffer.from(dataUrlMatch[2], "base64"),
    };
  }

  // Fallback for raw base64 payloads.
  return {
    mimeType: "image/jpeg",
    buffer: Buffer.from(imageBase64, "base64"),
  };
}

// Build extension used in generated object key.
function extensionFromMimeType(mimeType) {
  if (mimeType === "image/png") return "png";
  if (mimeType === "image/webp") return "webp";
  return "jpg";
}

// Upload image evidence and return storage metadata.
async function uploadImageToS3({ imageBase64, keyPrefix }) {
  const bucket = process.env.AWS_S3_PROCTOR_BUCKET;
  if (!bucket) {
    throw new Error("AWS_S3_PROCTOR_BUCKET is missing");
  }

  const { mimeType, buffer } = parseImagePayload(imageBase64);
  const ext = extensionFromMimeType(mimeType);
  const key = `${keyPrefix}/${Date.now()}-${randomUUID()}.${ext}`;

  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }),
  );

  return { key, bucket, mimeType };
}

export { uploadImageToS3 };
