import type { FC } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: FC<{ className?: string }>;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: "orange" | "blue" | "purple" | "green" | "red";
  loading?: boolean;
  subtext?: string;
}

const colorClasses = {
  orange: "bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20",
  blue: "bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20",
  purple: "bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20",
  green: "bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20",
  red: "bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20",
};

const iconBgClasses = {
  orange: "bg-orange-500/20",
  blue: "bg-blue-500/20",
  purple: "bg-purple-500/20",
  green: "bg-green-500/20",
  red: "bg-red-500/20",
};

const iconColorClasses = {
  orange: "text-orange-400",
  blue: "text-blue-400",
  purple: "text-purple-400",
  green: "text-green-400",
  red: "text-red-400",
};

export const StatCard = ({
  label,
  value,
  icon: Icon,
  trend,
  color = "blue",
  loading = false,
  subtext,
}: StatCardProps) => {
  return (
    <div
      className={`rounded-xl p-6 border backdrop-blur-sm transition-all duration-300 hover:border-opacity-40 ${colorClasses[color]}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-400 mb-2">{label}</p>
          <div className="flex items-baseline gap-2">
            {loading ? (
              <div className="h-8 w-20 bg-neutral-700 rounded animate-pulse" />
            ) : (
              <>
                <h3 className="text-3xl font-bold text-white">{value}</h3>
                {trend && (
                  <span
                    className={`text-xs font-medium ${
                      trend.isPositive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {trend.isPositive ? "+" : ""}{trend.value}
                  </span>
                )}
              </>
            )}
          </div>
          {subtext && (
            <p className="text-xs text-neutral-500 mt-2">{subtext}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${iconBgClasses[color]}`}>
          <Icon className={`w-6 h-6 ${iconColorClasses[color]}`} />
        </div>
      </div>
    </div>
  );
};
