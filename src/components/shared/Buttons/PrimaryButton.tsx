import type { LucideIcon } from "lucide-react";

interface PrimaryButtonProps {
  onClick?: () => void;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function PrimaryButton({
  onClick,
  icon: Icon,
  children,
  className = "",
  disabled = false,
  type = "button",
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-6 py-3 bg-[#00A996] hover:bg-[#008c7a] text-white rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
}
