interface InsertUsersBarProps {
    title: string;
    subtitle: string;
    onAddOne?: () => void;
    onAddMany?: () => void;
}

export default function InsertUsersBar({
    title,
    subtitle,
    onAddOne,
    onAddMany
}: InsertUsersBarProps) {
    return (
        <div className="flex items-center justify-between mb-6 bg-neutral-900 border border-neutral-800 rounded-2xl px-6 py-4">
            <div>
                <h2 className="text-xl font-semibold text-white">
                    {title}
                </h2>

                <p className="text-sm text-neutral-400 mt-1">
                    {subtitle}
                </p>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onAddOne}
                    className="px-5 py-2.5 rounded-xl bg-white text-black font-medium hover:opacity-90 transition-all duration-200"
                >
                    Add One
                </button>

                <button
                    onClick={onAddMany}
                    className="px-5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-white font-medium hover:bg-neutral-700 transition-all duration-200"
                >
                    Add Many
                </button>
            </div>
        </div>
    );
}