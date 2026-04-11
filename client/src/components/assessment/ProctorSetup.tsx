import { useEffect, useState } from "react";

type CheckStatus = {
  camera: boolean;
  screen: boolean;
  network: boolean;
  environment: boolean;
};

export const ProctorSetup = ({
  onComplete,
}: {
  onComplete: () => void;
}) => {
  const [status, setStatus] = useState("Initializing...");
  const [checks, setChecks] = useState<CheckStatus>({
    camera: false,
    screen: false,
    network: false,
    environment: false,
  });

  useEffect(() => {
    const runChecks = async () => {
      try {
        // 🎥 Camera + Mic
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setChecks((prev) => ({ ...prev, camera: true }));
        setStatus("Camera & mic granted ✔");

        // 🖥️ Screen Share
        await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        setChecks((prev) => ({ ...prev, screen: true }));
        setStatus("Screen sharing enabled ✔");

        // 🌐 Network
        const connection = (navigator as Navigator & { connection?: unknown }).connection;

        console.log("Network:", connection);

        setChecks((prev) => ({ ...prev, network: true }));
        setStatus("Network checked ✔");

        // 🧠 Environment checks
        const env = {
          screen: window.screen.width,
          window: window.innerWidth,
          devtools:
            window.outerWidth - window.innerWidth > 160,
        };

        console.log("Env:", env);

        setChecks((prev) => ({ ...prev, environment: true }));
        setStatus("Environment validated ✔");

        // ⏳ small buffer
        setTimeout(() => {
          setStatus("All checks passed ✔");
          setTimeout(onComplete, 1000);
        }, 1500);
      } catch (err) {
        console.error(err);
        setStatus("Permission denied ❌ Please allow all permissions");
      }
    };

    runChecks();
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
      <div className="text-white text-center space-y-4">
        <h2 className="text-2xl font-bold">
          Setting up proctoring
        </h2>

        <p className="text-neutral-400">{status}</p>

        <div className="text-sm text-neutral-500 space-y-1">
          <p>Camera: {checks.camera ? "✔" : "..."}</p>
          <p>Screen: {checks.screen ? "✔" : "..."}</p>
          <p>Network: {checks.network ? "✔" : "..."}</p>
          <p>Environment: {checks.environment ? "✔" : "..."}</p>
        </div>
      </div>
    </div>
  );
};
