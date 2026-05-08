import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as blazeface from "@tensorflow-models/blazeface";
import * as faceapi from "@vladmandic/face-api";
import type { IdentityQualityChecks } from "@/types/proctor";

let faceDetector: blazeface.BlazeFaceModel | null = null;
let phoneDetector: cocoSsd.ObjectDetection | null = null;
let faceApiReady = false;

function isVideoReady(video: HTMLVideoElement): boolean {
  return video.videoWidth > 0 && video.videoHeight > 0;
}

async function waitForVideoReady(
  video: HTMLVideoElement,
  timeoutMs = 3000,
): Promise<void> {
  if (isVideoReady(video)) return;

  await new Promise<void>((resolve, reject) => {
    const timeoutId = window.setTimeout(() => {
      cleanup();
      reject(new Error("Camera video is not ready"));
    }, timeoutMs);

    const onReady = () => {
      if (isVideoReady(video)) {
        cleanup();
        resolve();
      }
    };

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      video.removeEventListener("loadedmetadata", onReady);
      video.removeEventListener("canplay", onReady);
      video.removeEventListener("playing", onReady);
    };

    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("canplay", onReady);
    video.addEventListener("playing", onReady);
    onReady();
  });
}

// Initialize face-api models
export async function initFaceApi(): Promise<boolean> {
  if (faceApiReady) return true;

  try {
    const MODEL_URL =
      "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/";
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    faceApiReady = true;
    console.log("Face-API models loaded successfully");
    return true;
  } catch (err) {
    console.error("Failed to load face-api models from CDN:", err);
    console.error("Make sure you have internet connection for CDN access");
    return false;
  }
}

// Face detector setup and inference.
export async function initFaceDetector() {
  if (faceDetector) return faceDetector;

  // Load BlazeFace model with keypoints support
  faceDetector = await blazeface.load({
    maxFaces: 3,
    iouThreshold: 0.3,
    scoreThreshold: 0.75,
  });

  return faceDetector;
}

export async function detectFaces(video: HTMLVideoElement): Promise<number> {
  if (!faceDetector) return 0;
  if (!isVideoReady(video)) return 0;

  const faces = await faceDetector.estimateFaces(video, false, false); // false = don't flip horizontally
  return faces.length;
}

// Phone detector setup and inference.
export async function initObjectDetector() {
  if (phoneDetector) return phoneDetector;

  phoneDetector = await cocoSsd.load();
  return phoneDetector;
}

export async function detectPhone(video: HTMLVideoElement): Promise<boolean> {
  if (!phoneDetector) return false;
  const predictions = await phoneDetector.detect(video);

  // coco-ssd class label for phones is "cell phone".
  return predictions.some(
    (p) => p.class === "cell phone" && p.score !== undefined && p.score > 0.6,
  );
}

function getCanvasFromVideo(video: HTMLVideoElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  const width = video.videoWidth;
  const height = video.videoHeight;

  if (!width || !height) {
    throw new Error("Camera video is not ready for capture");
  }

  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to create canvas context for identity capture");
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function estimateBrightnessFromImageData(data: Uint8ClampedArray): number {
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    sum += 0.299 * r + 0.587 * g + 0.114 * b;
  }
  return sum / (data.length / 4);
}

function estimateBlurScoreFromImageData(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): number {
  const grayscale = new Float32Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = (y * width + x) * 4;
      grayscale[y * width + x] =
        0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
    }
  }

  // Blur proxy based on local gradient variance.
  let gradSum = 0;
  let gradSqSum = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const center = grayscale[y * width + x];
      const right = grayscale[y * width + (x + 1)];
      const down = grayscale[(y + 1) * width + x];
      const grad = Math.abs(right - center) + Math.abs(down - center);

      gradSum += grad;
      gradSqSum += grad * grad;
      count += 1;
    }
  }

  if (count === 0) return 0;

  const mean = gradSum / count;
  const variance = gradSqSum / count - mean * mean;
  return Math.max(0, variance);
}

export function captureVideoFrameAsBase64(
  video: HTMLVideoElement,
  quality = 0.9,
): string {
  if (!isVideoReady(video)) {
    throw new Error("Camera video is not ready for capture");
  }

  const canvas = getCanvasFromVideo(video);
  return canvas.toDataURL("image/jpeg", quality);
}

export async function evaluateEnrollmentQuality(
  video: HTMLVideoElement,
): Promise<IdentityQualityChecks> {
  await waitForVideoReady(video);

  const canvas = getCanvasFromVideo(video);
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to evaluate quality without canvas context");
  }

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const brightnessScore = estimateBrightnessFromImageData(imageData.data);
  const blurScore = estimateBlurScoreFromImageData(
    imageData.data,
    canvas.width,
    canvas.height,
  );

  const faceCount = await detectFaces(video);

  const checks: IdentityQualityChecks = {
    passed: false,
    singleFace: faceCount === 1,
    brightnessOk: brightnessScore >= 75,
    blurOk: blurScore >= 55,
    brightnessScore,
    blurScore,
  };

  // Keep enrollment strict: exactly one face with sufficient lighting and clarity.
  checks.passed = checks.singleFace && checks.brightnessOk && checks.blurOk;
  return checks;
}

export async function extractFaceEmbedding(
  video: HTMLVideoElement,
): Promise<number[] | null> {
  await waitForVideoReady(video);

  // Initialize face-api if not already done
  if (!faceApiReady) {
    await initFaceApi();
  }

  if (!faceApiReady) {
    console.warn("face-api not ready, falling back to blazeface");
    return null;
  }

  try {
    // Detect face with face-api which uses deep learning
    const detections = await faceapi
      .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detections || !detections.descriptor) {
      // console.log("No face detected by face-api");
      return null;
    }

    // face-api provides a 128-dimensional descriptor trained specifically for face recognition
    // Convert to array for consistency
    const embedding = Array.from(detections.descriptor);

    // console.log(
    //   "🎯 Face embedding extracted via face-api:",
    //   embedding.length,
    //   "dimensions",
    // );
    return embedding;
  } catch (err) {
    console.error("Error extracting face embedding with face-api:", err);
    return null;
  }
}
