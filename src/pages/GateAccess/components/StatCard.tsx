import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  sublabel: string;
  value: string | number;
  gradient: string;
  borderColor: string;
}

export const StatCard = ({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  sublabel,
  value,
  gradient,
  borderColor,
}: StatCardProps) => {
  return (
    <div
      className={`relative h-[145px] rounded-2xl border p-6 shadow-sm bg-gradient-to-br ${gradient} ${borderColor}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-xs text-gray-500 mt-1">{sublabel}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center shadow-lg`}
          style={{
            background: `linear-gradient(135deg, ${iconColor}, ${iconColor}dd)`,
          }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-800 mt-4">{value}</p>
    </div>
  );
};
