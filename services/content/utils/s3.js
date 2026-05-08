import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let s3Client = null;

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

function getAssignmentBucket() {
  const bucket = process.env.AWS_S3_ASSIGNMENT_BUCKET;

  if (!bucket) {
    throw new Error("AWS_S3_ASSIGNMENT_BUCKET is missing");
  }

  return bucket;
}

function safeFileName(originalName = "assignment") {
  const baseName = originalName
    .replace(/\\/g, "/")
    .split("/")
    .pop()
    .replace(/\.pdf$/i, "");

  const sanitized = baseName
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return sanitized || "assignment";
}

async function uploadAssignmentPdfToS3({
  buffer,
  originalName,
  mimeType,
  testId,
  studentId,
  uploadedAt = new Date(),
}) {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error("Assignment PDF buffer is required");
  }

  const bucket = getAssignmentBucket();
  const timestamp = uploadedAt.getTime();
  const key = `assignments/${testId}/${studentId}/${timestamp}-${safeFileName(originalName)}.pdf`;

  const client = getS3Client();
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimeType || "application/pdf",
    }),
  );

  return {
    bucket,
    key,
    originalName: originalName || "assignment.pdf",
    mimeType: mimeType || "application/pdf",
    size: buffer.length,
    uploadedAt,
  };
}

async function createSignedAssignmentDownloadUrl({ key, expiresIn = 300 }) {
  const bucket = getAssignmentBucket();

  if (!key) {
    throw new Error("S3 object key is required");
  }

  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const signedUrl = await getSignedUrl(client, command, { expiresIn });

  return {
    signedUrl,
    expiresIn,
    bucket,
    key,
  };
}

export {
  createSignedAssignmentDownloadUrl,
  getS3Client,
  safeFileName,
  uploadAssignmentPdfToS3,
};
