import type { ExtendedScreen, NetworkResult, PatchFn, SetPhaseFn } from "@/types/assessment.types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDashboardPath(role?: string): string {
  switch (role) {
    case "user":
      return "/dashboard";
    default:
      return "/dashboard";
  }
}


export async function queryPermission(name: PermissionName): Promise<PermissionState> {
  try {
    const result = await navigator.permissions.query({ name });
    return result.state;
  } catch {
    return "prompt";
  }
}

export async function measureNetworkSpeed(): Promise<NetworkResult> {
  const SIZE_BYTES = 200_000;

  const t0 = performance.now();
  try {
    await fetch("https://www.google.com/generate_204", { cache: "no-store", mode: "no-cors" });
  } catch {
    // non-fatal — latency will be inflated but not a blocker
  }

  const latencyMs = Math.round(performance.now() - t0);

  try {
    const ts = performance.now();
    const res = await fetch(`https://httpbin.org/bytes/${SIZE_BYTES}`, { cache: "no-store" });
    await res.arrayBuffer();
    const durationSec = (performance.now() - ts) / 1000;
    const mbps = parseFloat(((SIZE_BYTES * 8) / durationSec / 1_000_000).toFixed(2));
    return { mbps, latencyMs };
  } catch {
    return { mbps: 0, latencyMs };
  }
}

export function hasMultipleDisplays(): boolean {
  const extScreen = window.screen as ExtendedScreen;
  return extScreen.isExtended === true;
}

export async function runChecks(
  patch: PatchFn,
  setPhase: SetPhaseFn,
  mounted: () => boolean
): Promise<void> {
  const safe = (fn: () => void) => { if (mounted()) fn(); };

  safe(() => setPhase("running"));

  // 1. Camera
  safe(() => patch("camera", { status: "checking" }));
  const camState = await queryPermission("camera" as PermissionName);

  if (camState === "granted") {
    safe(() => patch("camera", { status: "granted", detail: "Access already permitted" }));
  } else if (camState === "denied") {
    safe(() => patch("camera", {
      status: "failed",
      detail: "Blocked in browser — click the lock icon in the URL bar to allow camera",
    }));
  } else {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      safe(() => patch("camera", { status: "granted" }));
    } catch {
      safe(() => patch("camera", {
        status: "failed",
        detail: "Camera access denied — allow it and retry",
      }));
    }
  }

  // 2. Microphone
  safe(() => patch("microphone", { status: "checking" }));
  const micState = await queryPermission("microphone" as PermissionName);

  if (micState === "granted") {
    safe(() => patch("microphone", { status: "granted", detail: "Access already permitted" }));
  } else if (micState === "denied") {
    safe(() => patch("microphone", {
      status: "failed",
      detail: "Blocked in browser — click the lock icon in the URL bar to allow microphone",
    }));
  } else {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      safe(() => patch("microphone", { status: "granted" }));
    } catch {
      safe(() => patch("microphone", {
        status: "failed",
        detail: "Microphone access denied — allow it and retry",
      }));
    }
  }

  // 3. Multiple displays
  safe(() => patch("display", { status: "checking" }));
  await new Promise<void>((resolve) => setTimeout(resolve, 300));

  if (hasMultipleDisplays()) {
    safe(() => patch("display", {
      status: "failed",
      detail: "Multiple monitors detected — disconnect secondary displays and retry",
    }));
  } else {
    safe(() => patch("display", { status: "granted", detail: "Single display confirmed" }));
  }

  // 4. Network speed
  safe(() => patch("network", { status: "checking" }));
  const { mbps, latencyMs } = await measureNetworkSpeed();

  if (mbps === 0) {
    safe(() => patch("network", {
      status: "warning",
      detail: "Could not measure speed — check your internet connection",
    }));
  } else if (mbps < 1) {
    safe(() => patch("network", {
      status: "warning",
      detail: `${mbps} Mbps detected (min 1 Mbps recommended) — may cause instability`,
    }));
  } else {
    safe(() => patch("network", {
      status: "granted",
      detail: `${mbps} Mbps · ${latencyMs}ms latency`,
    }));
  }

  safe(() => setPhase("done"));
}
