import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  iconBg: string;
  iconColor: string;
  gradient: string;
  borderColor: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
  gradient,
  borderColor,
}: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl ${gradient} p-6 border-2 ${borderColor} transition-all hover:shadow-lg hover:scale-105 duration-300`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`${iconBg} ${iconColor} p-3 rounded-lg`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          </div>
        </div>
      </div>

      {/* Decorative circle */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
    </div>
  );
}
