import { StatusIcon } from "@/components/assessment/status-icon";
import type { CheckItem, CheckStatus } from "@/types/assessment.types";

interface CheckCardProps {
    check: CheckItem;
}

const statusToContainerClass: Record<CheckStatus, string> = {
    granted: "bg-neutral-900 border-green-500/20",
    failed: "bg-red-500/5 border-red-500/25",
    warning: "bg-amber-500/5 border-amber-500/20",
    checking: "bg-neutral-900 border-neutral-800",
    idle: "bg-neutral-900/50 border-neutral-800/50",
};

const statusToIconClass: Record<CheckStatus, string> = {
    granted: "bg-green-500/10 text-green-400",
    failed: "bg-red-500/10 text-red-400",
    warning: "bg-amber-500/10 text-amber-400",
    checking: "bg-neutral-800 text-orange-400",
    idle: "bg-neutral-800 text-neutral-600",
};

export const CheckCard = ({ check }: CheckCardProps) => {
    const { icon: Icon, label, sublabel, status, detail, blocking } = check;

    const containerClass =
        status === "failed" && !blocking
            ? "bg-amber-500/5 border-amber-500/20"
            : statusToContainerClass[status];

    const iconClass =
        status === "failed" && !blocking
            ? "bg-amber-500/10 text-amber-400"
            : statusToIconClass[status];

    return (
        <div className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${containerClass}`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-300 ${iconClass}`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-white">{label}</p>
                    {!blocking && (
                        <span className="text-xs text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded font-mono leading-none">
                            optional
                        </span>
                    )}
                </div>
                <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                    {detail ?? sublabel}
                </p>
            </div>
            <div className="shrink-0 mt-0.5">
                <StatusIcon status={status} blocking={blocking} />
            </div>
        </div>
    );
};