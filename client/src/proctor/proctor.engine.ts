import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as faceDetection from "@tensorflow-models/face-detection";

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