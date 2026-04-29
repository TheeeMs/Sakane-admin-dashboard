import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export function Input({ label, error, required, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...props}
        className={`w-full px-4 py-3 rounded-xl border ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-300 focus:ring-teal-500"
        } focus:outline-none focus:ring-2 focus:border-transparent transition-colors`}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
