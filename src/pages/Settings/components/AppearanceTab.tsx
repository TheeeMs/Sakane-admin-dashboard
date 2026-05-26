// ─── AppearanceTab.tsx ────────────────────────────────────────────────────────

import { useRef, useState } from "react";
import { Section } from "./controls";

// ── Icons ─────────────────────────────────────────────────────────────────────
const UploadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7 text-gray-400"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const ImageIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-7 h-7 text-gray-400"
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────
export interface AppearanceFormData {
  logoLight: string | null;
  logoDark: string | null;
  primaryColor: string;
  favicon: string | null;
}

const INITIAL_APPEARANCE_FORM: AppearanceFormData = {
  logoLight: null,
  logoDark: null,
  primaryColor: "#00A996",
  favicon: null,
};

const PRESET_COLORS = [
  "#00A996",
  "#0d9488",
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#1e3a8a",
];

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// ── LogoDropzone ──────────────────────────────────────────────────────────────
interface LogoDropzoneProps {
  label: string;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  dark?: boolean;
  hint?: string;
}

function LogoDropzone({
  label,
  value,
  onChange,
  dark = false,
  hint = "PNG, SVG (max. 2MB)",
}: LogoDropzoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return; // 2MB
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
    } catch {
      /* ignore */
    }
  };

  const baseClass =
    "flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl px-6 py-10 cursor-pointer transition";
  const themeClass = dark
    ? "bg-[#0b1220] border-gray-700/60 hover:border-teal-400 hover:bg-[#0d1730]"
    : "bg-white border-gray-200 hover:border-teal-400 hover:bg-teal-50/30";
  const textClass = dark ? "text-teal-300" : "text-teal-600";
  const hintClass = dark ? "text-gray-400" : "text-gray-400";

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      {value ? (
        <div
          className={
            "relative rounded-xl border " +
            (dark
              ? "bg-[#0b1220] border-gray-700/60"
              : "bg-white border-gray-200")
          }
        >
          <img
            src={value}
            alt={label}
            className="w-full h-40 object-contain p-4"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-gray-700 text-xs font-semibold shadow"
          >
            Remove
          </button>
        </div>
      ) : (
        <label className={`${baseClass} ${themeClass}`}>
          <UploadIcon />
          <span className={`mt-2 text-sm font-semibold ${textClass}`}>
            Click to upload logo
          </span>
          <span className={`text-xs mt-1 ${hintClass}`}>{hint}</span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      )}
    </div>
  );
}

// ── FaviconDropzone ───────────────────────────────────────────────────────────
function FaviconDropzone({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (file.size > 1 * 1024 * 1024) return; // 1MB
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-800">Favicon</label>
      {value ? (
        <div className="relative w-fit rounded-xl border border-gray-200 bg-white p-4">
          <img src={value} alt="Favicon" className="w-12 h-12 object-contain" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-1 right-1 px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600 text-[10px] font-semibold"
          >
            Remove
          </button>
        </div>
      ) : (
        <label className="inline-flex w-fit flex-col items-center text-center border-2 border-dashed border-gray-200 rounded-xl px-8 py-6 cursor-pointer bg-white hover:border-teal-400 hover:bg-teal-50/30 transition">
          <ImageIcon />
          <span className="mt-2 text-sm font-semibold text-teal-600">
            Click to upload favicon
          </span>
          <span className="text-xs text-gray-400 mt-1">
            ICO, PNG (32x32px recommended)
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      )}
    </div>
  );
}

// ── AppearanceTab (main) ──────────────────────────────────────────────────────
interface AppearanceTabProps {
  form?: AppearanceFormData;
  onChange?: (form: AppearanceFormData) => void;
}

export default function AppearanceTab({
  form: externalForm,
  onChange,
}: AppearanceTabProps) {
  const [internal, setInternal] = useState<AppearanceFormData>(
    INITIAL_APPEARANCE_FORM,
  );
  const form = externalForm ?? internal;

  const update = (patch: Partial<AppearanceFormData>) => {
    const next = { ...form, ...patch };
    setInternal(next);
    onChange?.(next);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <Section title="Branding">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LogoDropzone
            label="Logo (Light Mode)"
            value={form.logoLight}
            onChange={(v) => update({ logoLight: v })}
          />
          <LogoDropzone
            label="Logo (Dark Mode)"
            value={form.logoDark}
            onChange={(v) => update({ logoDark: v })}
            dark
          />
        </div>

        {/* Primary color */}
        <div className="mt-6">
          <h3 className="text-sm font-bold text-gray-800 mb-3">
            Primary Color
          </h3>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryColor}
                onChange={(e) => update({ primaryColor: e.target.value })}
                className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer bg-white p-0"
                aria-label="Primary color"
              />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {form.primaryColor.toUpperCase()}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Used for buttons, links, and accents
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => update({ primaryColor: c })}
                  className={
                    "w-7 h-7 rounded-full border transition " +
                    (form.primaryColor.toLowerCase() === c.toLowerCase()
                      ? "ring-2 ring-offset-2 ring-teal-400 border-transparent"
                      : "border-gray-200 hover:scale-105")
                  }
                  style={{ background: c }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Favicon */}
        <div className="mt-6">
          <FaviconDropzone
            value={form.favicon}
            onChange={(v) => update({ favicon: v })}
          />
        </div>
      </Section>
    </div>
  );
}
