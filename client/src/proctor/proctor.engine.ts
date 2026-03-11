import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as blazeface from "@tensorflow-models/blazeface";
import type { IdentityQualityChecks } from "@/types/proctor";

let faceDetector: blazeface.BlazeFaceModel | null = null;
let phoneDetector : cocoSsd.ObjectDetection | null = null;  

// Initialize TFJS backend once.
async function initTF() {
  if (tf.getBackend()) return;

  await tf.setBackend("webgl");
  await tf.ready();
}

// Face detector setup and inference.
export async function initFaceDetector() {
  await initTF();
  if (faceDetector) return faceDetector;

  // Load BlazeFace model with keypoints support
  faceDetector = await blazeface.load({
    maxFaces: 3,
    iouThreshold:0.3,
    scoreThreshold:0.75
  });

  return faceDetector;
}

export async function detectFaces(
  video: HTMLVideoElement
): Promise<number> {
  if (!faceDetector) return 0;

  const faces = await faceDetector.estimateFaces(video, false, false);  // false = don't flip horizontally
  return faces.length;
}

// Phone detector setup and inference.
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

  // coco-ssd class label for phones is "cell phone".
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
    brightnessOk: brightnessScore >= 30,
    blurOk: blurScore >= 20,
    brightnessScore,
    blurScore,
  };

  // Allow minor detector jitter while still enforcing basic quality constraints.
  checks.passed = faceCount >= 1 && checks.brightnessOk && checks.blurOk;
  return checks;
}

export async function extractFaceEmbedding(
  video: HTMLVideoElement
): Promise<number[] | null> {
  if (!faceDetector) {
    await initFaceDetector();
  }

  if (!faceDetector) return null;

  const faces = await faceDetector.estimateFaces(video, false);  // BlazeFace API
  if (!faces || faces.length < 1) return null;

  // BlazeFace returns faces in this format:
  // { topLeft: [x, y], bottomRight: [x, y], landmarks: [[x1, y1], [x2, y2], ...] }
  const face = faces[0] as {
    topLeft: [number, number];
    bottomRight: [number, number]; 
    landmarks: number[][];  // 6 keypoints: [rightEye, leftEye, nose, mouth, rightEar, leftEar]
  };

  const width = video.videoWidth || 640;
  const height = video.videoHeight || 480;

  function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  // BlazeFace provides simple topLeft and bottomRight coordinates
  let x = face.topLeft[0];
  let y = face.topLeft[1];
  let w = face.bottomRight[0] - face.topLeft[0];
  let h = face.bottomRight[1] - face.topLeft[1];

  // Fallback to a central crop if box data is invalid
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

  // BlazeFace landmarks: 6 keypoints [rightEye, leftEye, nose, mouth, rightEar, leftEar]
  const landmarks = face.landmarks || [];
  const kpVec: number[] = [];

  // Take up to 8 keypoints (16 values), use all 6 available from BlazeFace
  for (let i = 0; i < Math.min(8, landmarks.length); i++) {
    const landmark = landmarks[i];
    if (landmark && landmark.length >= 2) {
      kpVec.push(landmark[0] / width, landmark[1] / height);
    }
  }

  // Keep a fixed-size keypoint segment for stable vector length
  while (kpVec.length < 16) kpVec.push(0);

  console.log('🎯 Keypoints extracted:', kpVec.filter(x => x !== 0).length / 2, 'landmarks found');
  console.log('🎯 KpVec values:', kpVec);

  // Add an image signature so the vector carries appearance information.
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