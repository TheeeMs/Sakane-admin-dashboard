import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({
  label,
  error,
  required,
  options,
  placeholder,
  ...props
}: SelectProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          {...props}
          className={`w-full px-4 py-3 rounded-xl border ${
            error
              ? "border-red-300 focus:ring-red-500"
              : "border-gray-300 focus:ring-teal-500"
          } focus:outline-none focus:ring-2 focus:border-transparent transition-colors appearance-none bg-white cursor-pointer`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
