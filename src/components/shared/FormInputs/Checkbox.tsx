import type { InputHTMLAttributes } from "react";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
  description?: string;
}

export function Checkbox({ label, description, ...props }: CheckboxProps) {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        {...props}
        className="mt-1 w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 focus:ring-2 cursor-pointer"
      />
      <div className="flex-1">
        <label className="block text-base font-medium text-gray-900 cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
