import type { CheckStatus } from "@/types/assessment.types";
import {
    CheckCircle2,
    XCircle,
    Loader2,
    AlertTriangle
} from "lucide-react";

interface StatusIconProps {
    status: CheckStatus;
    blocking: boolean;
}

export const StatusIcon = ({ status, blocking }: StatusIconProps) => {
    switch (status) {
        case "granted":
            return <CheckCircle2 className="w-5 h-5 text-green-400" />;
        case "failed":
            return <XCircle className={`w-5 h-5 ${blocking ? "text-red-400" : "text-amber-400"}`} />;
        case "warning":
            return <AlertTriangle className="w-5 h-5 text-amber-400" />;
        case "checking":
            return <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />;
        case "idle":
            return <div className="w-5 h-5 rounded-full border-2 border-neutral-700" />;
    }
};