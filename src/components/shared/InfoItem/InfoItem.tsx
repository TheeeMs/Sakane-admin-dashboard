import type { LucideIcon } from "lucide-react";

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  iconBg: string;
  iconColor: string;
}

export function InfoItem({
  icon: Icon,
  label,
  value,
  iconBg,
  iconColor,
}: InfoItemProps) {
  return (
    <div className="flex gap-3">
      <div
        className={`flex-shrink-0 w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
