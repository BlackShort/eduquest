interface FullscreenGateProps {
    onEnter: () => void;
}

export const FullscreenGate = ({ onEnter }: FullscreenGateProps) => {
    return (
        <div className="absolute h-screen w-full overflow-hidden inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Fullscreen Required</h2>
                <p className="text-neutral-400">
                    This assessment must run in fullscreen mode.
                </p>
                <button
                    onClick={onEnter}
                    className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-400
                               text-white font-semibold rounded-lg transition duration-200 cursor-pointer"
                >
                    Enter Fullscreen
                </button>
            </div>
        </div>
    );
};