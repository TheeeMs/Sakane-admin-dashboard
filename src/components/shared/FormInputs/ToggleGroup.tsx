import type { LucideIcon } from "lucide-react";

interface ToggleOption {
  value: string;
  label: string;
  icon?: LucideIcon;
}

interface ToggleGroupProps {
  label: string;
  required?: boolean;
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
}

export function ToggleGroup({
  label,
  required,
  options,
  value,
  onChange,
}: ToggleGroupProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-all ${
                isSelected
                  ? "bg-teal-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200"
              }`}
            >
              {Icon && <Icon className="w-5 h-5" />}
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
