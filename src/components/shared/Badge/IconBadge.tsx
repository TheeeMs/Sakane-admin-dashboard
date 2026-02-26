import type { LucideIcon } from "lucide-react";

interface IconBadgeProps {
  icon: LucideIcon;
  label: string;
  iconColor?: string;
  bgColor?: string;
  borderColor?: string;
}

export function IconBadge({
  icon: Icon,
  label,
  iconColor = "text-gray-600",
  bgColor = "bg-white",
  borderColor = "border-gray-200",
}: IconBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium ${iconColor} ${bgColor} border ${borderColor}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}
