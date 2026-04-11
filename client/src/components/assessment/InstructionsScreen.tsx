import { useEffect, useState } from "react";

export const InstructionsScreen = ({ onStart }: { onStart: () => void }) => {
    const [time, setTime] = useState(20);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((t) => {
                if (t <= 1) {
                    clearInterval(interval);
                    onStart();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [onStart]);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
            <div className="text-center text-white max-w-xl space-y-6">
                <h2 className="text-3xl font-bold">Instructions</h2>

                <ul className="text-neutral-400 text-left space-y-2">
                    <li>• Do not switch tabs</li>
                    <li>• Keep your face visible</li>
                    <li>• No external devices allowed</li>
                    <li>• Any suspicious activity will be recorded</li>
                </ul>

                <p className="text-orange-400 font-semibold">
                    Starting in {time}s...
                </p>
            </div>
        </div>
    );
};