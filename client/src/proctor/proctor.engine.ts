import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as faceDetection from "@tensorflow-models/face-detection";
import type { IdentityQualityChecks } from "@/types/proctor";

let faceDetector: faceDetection.FaceDetector | null = null;
let phoneDetector : cocoSsd.ObjectDetection | null = null;  

// initialize tf
async function initTF() {
  if (tf.getBackend()) return;

  await tf.setBackend("webgl");
  await tf.ready();
}

/*Face Detection*/
export async function initFaceDetector() {
  await initTF();
  if (faceDetector) return faceDetector;

  const model = faceDetection.SupportedModels.MediaPipeFaceDetector;

  faceDetector = await faceDetection.createDetector(model, {
    runtime: "tfjs",
  });

  return faceDetector;
}

export async function detectFaces(
  video: HTMLVideoElement
): Promise<number> {
  if (!faceDetector) return 0;

  const faces = await faceDetector.estimateFaces(video);
  return faces.length;
}

/*Phone Detection*/
export async function initObjectDetector() {
  await initTF();
  if (phoneDetector) return phoneDetector;

  phoneDetector = await cocoSsd.load();
  return phoneDetector;
}

export async function detectPhone(
  video: HTMLVideoElement
): Promise<boolean> {
  if (!phoneDetector) return false;
  const predictions = await phoneDetector.detect(video);

  // coco-ssd uses label "cell phone"
  return predictions.some(
    (p) =>
      p.class === "cell phone" && p.score !== undefined && p.score > 0.6
  );
}

function getCanvasFromVideo(video: HTMLVideoElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;
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
  height: number
): number {
  const grayscale = new Float32Array(width * height);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const idx = (y * width + x) * 4;
      grayscale[y * width + x] =
        0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
    }
  }

  // Lightweight blur proxy: variance of local gradients.
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
  quality = 0.9
): string {
  const canvas = getCanvasFromVideo(video);
  return canvas.toDataURL("image/jpeg", quality);
}

export async function evaluateEnrollmentQuality(
  video: HTMLVideoElement
): Promise<IdentityQualityChecks> {
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
    canvas.height
  );

  const faceCount = await detectFaces(video);

  const checks: IdentityQualityChecks = {
    passed: false,
    singleFace: faceCount === 1,
    brightnessOk: brightnessScore >= 40,
    blurOk: blurScore >= 60,
    brightnessScore,
    blurScore,
  };

  checks.passed = checks.singleFace && checks.brightnessOk && checks.blurOk;
  return checks;
}

export async function extractFaceEmbedding(
  video: HTMLVideoElement
): Promise<number[] | null> {
  if (!faceDetector) {
    await initFaceDetector();
  }

  if (!faceDetector) return null;

  const faces = await faceDetector.estimateFaces(video);
  if (!faces || faces.length !== 1) return null;

  const face = faces[0] as {
    box?: {
      xMin?: number;
      yMin?: number;
      width?: number;
      height?: number;
      xMax?: number;
      yMax?: number;
      xCenter?: number;
      yCenter?: number;
      topLeft?: [number, number] | { x: number; y: number };
      bottomRight?: [number, number] | { x: number; y: number };
    };
    keypoints?: Array<{ x: number; y: number }>;
  };

  const width = video.videoWidth || 640;
  const height = video.videoHeight || 480;

  const box = face.box || {};

  function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  function readPoint(
    point?: [number, number] | { x: number; y: number }
  ): { x: number; y: number } | null {
    if (!point) return null;
    if (Array.isArray(point)) {
      return { x: point[0], y: point[1] };
    }
    return { x: point.x, y: point.y };
  }

  // Resolve box from multiple possible detector output shapes.
  let x = box.xMin ?? 0;
  let y = box.yMin ?? 0;
  let w = box.width ?? 0;
  let h = box.height ?? 0;

  if ((w === 0 || h === 0) && box.xMax !== undefined && box.yMax !== undefined) {
    w = Math.max(0, box.xMax - x);
    h = Math.max(0, box.yMax - y);
  }

  if ((w === 0 || h === 0) && box.xCenter !== undefined && box.yCenter !== undefined) {
    const bw = box.width ?? 0;
    const bh = box.height ?? 0;
    w = bw;
    h = bh;
    x = box.xCenter - bw / 2;
    y = box.yCenter - bh / 2;
  }

  if (w === 0 || h === 0) {
    const tl = readPoint(box.topLeft);
    const br = readPoint(box.bottomRight);
    if (tl && br) {
      x = tl.x;
      y = tl.y;
      w = Math.max(0, br.x - tl.x);
      h = Math.max(0, br.y - tl.y);
    }
  }

  // Fallback crop when detector doesn't provide complete box fields.
  if (w <= 0 || h <= 0) {
    x = width * 0.25;
    y = height * 0.2;
    w = width * 0.5;
    h = height * 0.6;
  }

  x = clamp(x, 0, Math.max(0, width - 1));
  y = clamp(y, 0, Math.max(0, height - 1));
  w = clamp(w, 1, width - x);
  h = clamp(h, 1, height - y);

  const boxVec = [
    x / width,
    y / height,
    w / width,
    h / height,
  ];

  const keypoints = face.keypoints ?? [];
  const selected = keypoints.slice(0, 8);
  const kpVec: number[] = [];

  for (const kp of selected) {
    kpVec.push(kp.x / width, kp.y / height);
  }

  // Keep fixed-size keypoint segment (16 values).
  while (kpVec.length < 16) kpVec.push(0);

  // Add image-based signature from face crop to avoid all-zero embeddings.
  const sourceCanvas = getCanvasFromVideo(video);
  const tiny = document.createElement("canvas");
  tiny.width = 8;
  tiny.height = 8;
  const tinyCtx = tiny.getContext("2d");

  if (!tinyCtx) {
    return [...boxVec, ...kpVec];
  }

  tinyCtx.drawImage(sourceCanvas, x, y, w, h, 0, 0, tiny.width, tiny.height);
  const data = tinyCtx.getImageData(0, 0, tiny.width, tiny.height).data;

  const pixelVec: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const gray = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    pixelVec.push(gray);
  }

  return [...boxVec, ...kpVec, ...pixelVec];
}