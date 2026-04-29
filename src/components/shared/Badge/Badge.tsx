interface BadgeProps {
  label: string;
  variant?: "default" | "success" | "warning" | "error" | "info" | "purple";
  size?: "sm" | "md";
}

export function Badge({ label, variant = "default", size = "md" }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    error: "bg-red-100 text-red-700",
    info: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${variants[variant]} ${sizes[size]}`}
    >
      {label}
    </span>
  );
}
