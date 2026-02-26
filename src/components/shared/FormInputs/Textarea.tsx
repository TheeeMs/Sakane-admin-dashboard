import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export function Textarea({ label, error, required, ...props }: TextareaProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        {...props}
        className={`w-full px-4 py-3 rounded-xl border ${
          error
            ? "border-red-300 focus:ring-red-500"
            : "border-gray-300 focus:ring-teal-500"
        } focus:outline-none focus:ring-2 focus:border-transparent transition-colors resize-none`}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
