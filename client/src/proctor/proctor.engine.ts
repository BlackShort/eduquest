import * as faceDetection from "@tensorflow-models/face-detection";
import "@tensorflow/tfjs-backend-webgl";

let detector: faceDetection.FaceDetector | null = null;

export async function initFaceDetector() {
  if (detector) return detector;

  const model = faceDetection.SupportedModels.MediaPipeFaceDetector;

  detector = await faceDetection.createDetector(model, {
    runtime: "tfjs",
  });

  return detector;
}

export async function detectFaces(
  video: HTMLVideoElement
): Promise<number> {
  if (!detector) return 0;

  const faces = await detector.estimateFaces(video);
  return faces.length;
}