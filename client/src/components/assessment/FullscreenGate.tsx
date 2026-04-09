export const FullscreenGate = ({ onEnter }: { onEnter: () => void }) => {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-white">
                    Fullscreen Required
                </h2>
                <p className="text-neutral-400">
                    This assessment must run in fullscreen mode.
                </p>

                <button
                    onClick={onEnter}
                    className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-lg"
                >
                    Enter Fullscreen
                </button>
            </div>
        </div>
    );
};