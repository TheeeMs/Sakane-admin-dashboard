// ─── SystemTab.tsx ────────────────────────────────────────────────────────────

import { useState } from "react";
import { Section, SelectField, Toggle } from "./controls";

// ── Icons ─────────────────────────────────────────────────────────────────────
const ServerIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-5 h-5 text-gray-500"
  >
    <rect x="2" y="3" width="20" height="6" rx="2" ry="2" />
    <rect x="2" y="15" width="20" height="6" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const DatabaseIconLg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-5 h-5 text-gray-500"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const RotateIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-5 h-5 text-orange-500 flex-shrink-0"
  >
    <polyline points="1 4 1 10 7 10" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────
export interface SystemFormData {
  maintenanceMode: boolean;
  lastBackupAt: string;
  backupSchedule: string;
  paymentGatewayKey: string;
  smsGatewayKey: string;
  emailServiceKey: string;
}

const INITIAL_SYSTEM_FORM: SystemFormData = {
  maintenanceMode: false,
  lastBackupAt: "Feb 12, 2026 at 3:00 AM",
  backupSchedule: "DAILY_3AM",
  paymentGatewayKey: "",
  smsGatewayKey: "",
  emailServiceKey: "",
};

const SCHEDULE_OPTIONS = [
  { value: "DAILY_3AM", label: "Daily at 3:00 AM" },
  { value: "WEEKLY_SUN", label: "Weekly on Sunday" },
  { value: "BIWEEKLY", label: "Every 2 weeks" },
  { value: "MONTHLY", label: "Monthly" },
];

// ── ApiKeyField ───────────────────────────────────────────────────────────────
function ApiKeyField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••••••••••"
        className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
      />
    </div>
  );
}

// ── SystemTab (main) ──────────────────────────────────────────────────────────
interface SystemTabProps {
  form?: SystemFormData;
  onChange?: (form: SystemFormData) => void;
  onBackupNow?: () => void;
  onReset?: () => void;
}

export default function SystemTab({
  form: externalForm,
  onChange,
  onBackupNow,
  onReset,
}: SystemTabProps) {
  const [internal, setInternal] = useState<SystemFormData>(INITIAL_SYSTEM_FORM);
  const form = externalForm ?? internal;

  const update = (patch: Partial<SystemFormData>) => {
    const next = { ...form, ...patch };
    setInternal(next);
    onChange?.(next);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Maintenance Mode */}
      <Section title="Maintenance Mode">
        <div className="flex items-center justify-between px-4 py-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center">
              <ServerIcon />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Enable Maintenance Mode
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Temporarily disable access for maintenance
              </p>
            </div>
          </div>
          <Toggle
            checked={form.maintenanceMode}
            onChange={(v) => update({ maintenanceMode: v })}
          />
        </div>
      </Section>

      {/* Backup & Restore */}
      <Section title="Backup & Restore">
        <div className="flex items-center justify-between px-4 py-4 bg-gray-50 rounded-xl border border-gray-100">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center">
              <DatabaseIconLg />
            </span>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Database Backup
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Last backup: {form.lastBackupAt}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBackupNow}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold transition"
          >
            <DownloadIcon />
            Backup Now
          </button>
        </div>

        <div className="mt-4">
          <SelectField
            label="Automatic Backup Schedule"
            value={form.backupSchedule}
            onChange={(v) => update({ backupSchedule: v })}
            options={SCHEDULE_OPTIONS}
          />
        </div>
      </Section>

      {/* API Configuration */}
      <Section title="API Configuration">
        <div className="space-y-4">
          <ApiKeyField
            label="Payment Gateway API Key"
            value={form.paymentGatewayKey}
            onChange={(v) => update({ paymentGatewayKey: v })}
          />
          <ApiKeyField
            label="SMS Gateway API Key"
            value={form.smsGatewayKey}
            onChange={(v) => update({ smsGatewayKey: v })}
          />
          <ApiKeyField
            label="Email Service API Key"
            value={form.emailServiceKey}
            onChange={(v) => update({ emailServiceKey: v })}
          />
        </div>
      </Section>

      {/* Reset banner */}
      <div className="flex items-center justify-between px-5 py-4 bg-orange-50 border border-orange-200 rounded-xl">
        <div className="flex items-center gap-3">
          <RotateIcon />
          <div>
            <p className="text-sm font-semibold text-orange-700">
              Reset to Default Settings
            </p>
            <p className="text-xs text-orange-500 mt-0.5">
              This will restore all settings to their default values
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition"
        >
          Reset Settings
        </button>
      </div>
    </div>
  );
}
