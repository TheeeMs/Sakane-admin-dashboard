import { AlertTriangle, type LucideIcon } from "lucide-react";

interface FinancialStatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  statusText?: string;
  statusColor?: string;
  count?: number;
  countLabel?: string;
  iconBg: string;
  iconColor: string;
  gradient: string;
  borderColor: string;
}

export function FinancialStatCard({
  label,
  value,
  subtitle,
  icon: CustomIcon,
  statusText,
  statusColor = "text-gray-600",
  count,
  countLabel,
  iconBg,
  iconColor,
  gradient,
  borderColor,
}: FinancialStatCardProps) {
  const Icon = CustomIcon;

  return (
    <div
      className={`relative overflow-hidden rounded-xl ${gradient} p-6 border-2 ${borderColor} transition-all hover:shadow-lg hover:scale-105 duration-300`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`${iconBg} ${iconColor} p-3 rounded-lg`}>
              <Icon className="w-6 h-6" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
        {statusText && (
          <div className={`flex items-center gap-1 text-xs font-medium ${statusColor}`}>
            <AlertTriangle className="w-3 h-3" />
            <span>{statusText}</span>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {count !== undefined && countLabel && (
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">{count}</p>
            <p className="text-xs text-gray-500">{countLabel}</p>
          </div>
        )}
      </div>

      {/* Decorative circle */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
    </div>
  );
}
