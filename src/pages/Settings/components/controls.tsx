// ─── controls.tsx ─────────────────────────────────────────────────────────────
// Shared primitives used across PaymentTab / NotificationTab / AppearanceTab /
// SystemTab. Mirrors the patterns already used in GeneralTab / SecurityTab
// (Tailwind, teal accent, soft gray surfaces).

import type { ReactNode } from "react";

// ── Section ───────────────────────────────────────────────────────────────────
interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Section({ title, children, className = "" }: SectionProps) {
  return (
    <section className={className}>
      <h2 className="text-base font-bold text-gray-800 mb-4">{title}</h2>
      {children}
    </section>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────
interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
}

export function Toggle({ checked, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 ${
        checked ? "bg-teal-500" : "bg-gray-300"
      } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ── Labelled input ────────────────────────────────────────────────────────────
interface FieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
  required = false,
}: FieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm text-gray-600">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
      />
    </div>
  );
}

// ── Labelled select ───────────────────────────────────────────────────────────
interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: Array<{ value: string; label: string }>;
  className?: string;
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  className = "",
}: SelectFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm text-gray-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Square brand checkbox (purple in design) ──────────────────────────────────
interface CheckboxRowProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  className?: string;
}

export function CheckboxRow({
  label,
  checked,
  onChange,
  className = "",
}: CheckboxRowProps) {
  return (
    <label
      className={
        "flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer select-none " +
        className
      }
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-fuchsia-600 cursor-pointer"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}

// ── Card-with-toggle row (icon + title + description + toggle on the right) ──
interface ToggleRowProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  highlighted?: boolean;
}

export function ToggleRow({
  icon,
  title,
  description,
  checked,
  onChange,
  highlighted = false,
}: ToggleRowProps) {
  return (
    <div
      className={
        "flex items-center justify-between px-4 py-4 rounded-xl border " +
        (highlighted
          ? "bg-teal-50/40 border-teal-200"
          : "bg-gray-50 border-gray-100")
      }
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <span className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          {description && (
            <p className="text-xs text-gray-400 mt-0.5">{description}</p>
          )}
        </div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
