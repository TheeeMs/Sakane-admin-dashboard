// ─── SecurityTab.tsx ──────────────────────────────────────────────────────────

import { useState } from "react";
import { INITIAL_SECURITY_FORM } from "./types";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SecurityFormData {
  twoFactorEnabled: boolean;
  passwordPolicy: {
    minEightChars: boolean;
    upperLowerCase: boolean;
    atLeastOneNumber: boolean;
    specialChars: boolean;
  };
  sessionTimeout: string;
  maxLoginAttempts: string;
}

// INITIAL_SECURITY_FORM moved to SecurityTab.constants.ts



// ── Toggle ────────────────────────────────────────────────────────────────────

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 ${
        checked ? "bg-teal-500" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

// ── PolicyRow ─────────────────────────────────────────────────────────────────

interface PolicyRowProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

function PolicyRow({ label, checked, onChange }: PolicyRowProps) {
  return (
    <div className="flex items-center justify-between px-4 py-4 bg-gray-50 rounded-xl border border-gray-100">
      <span className="text-sm text-gray-700">{label}</span>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ── InputField ────────────────────────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}

function InputField({ label, value, onChange, type = "text" }: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
      />
    </div>
  );
}

// ── Authentication Section ────────────────────────────────────────────────────

interface AuthenticationProps {
  enabled: boolean;
  onChange: (val: boolean) => void;
}

function Authentication({ enabled, onChange }: AuthenticationProps) {
  return (
    <section>
      <h2 className="text-base font-bold text-gray-800 mb-4">Authentication</h2>
      <div className="flex items-center justify-between px-4 py-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex items-center gap-3">
          {/* Key icon */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-400">
            <circle cx="7.5" cy="15.5" r="5.5" />
            <path d="M21 2l-9.6 9.6M15.5 7.5l3 3L21 8l-3-3" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-gray-800">Two-Factor Authentication</p>
            <p className="text-xs text-gray-400 mt-0.5">Add an extra layer of security to your account</p>
          </div>
        </div>
        <Toggle checked={enabled} onChange={onChange} />
      </div>
    </section>
  );
}

// ── PasswordPolicy Section ────────────────────────────────────────────────────

interface PasswordPolicyProps {
  policy: SecurityFormData["passwordPolicy"];
  onChange: (key: keyof SecurityFormData["passwordPolicy"], val: boolean) => void;
}

function PasswordPolicy({ policy, onChange }: PasswordPolicyProps) {
  const rules: { key: keyof SecurityFormData["passwordPolicy"]; label: string }[] = [
    { key: "minEightChars",     label: "Require minimum 8 characters" },
    { key: "upperLowerCase",    label: "Require uppercase and lowercase letters" },
    { key: "atLeastOneNumber",  label: "Require at least one number" },
    { key: "specialChars",      label: "Require special characters" },
  ];

  return (
    <section>
      <h2 className="text-base font-bold text-gray-800 mb-4">Password Policy</h2>
      <div className="space-y-2">
        {rules.map(({ key, label }) => (
          <PolicyRow
            key={key}
            label={label}
            checked={policy[key]}
            onChange={(val) => onChange(key, val)}
          />
        ))}
      </div>
    </section>
  );
}

// ── SessionManagement Section ─────────────────────────────────────────────────

interface SessionManagementProps {
  sessionTimeout: string;
  maxLoginAttempts: string;
  onTimeoutChange: (val: string) => void;
  onMaxAttemptsChange: (val: string) => void;
}

function SessionManagement({
  sessionTimeout,
  maxLoginAttempts,
  onTimeoutChange,
  onMaxAttemptsChange,
}: SessionManagementProps) {
  return (
    <section>
      <h2 className="text-base font-bold text-gray-800 mb-4">Session Management</h2>
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Session Timeout (minutes)"
          value={sessionTimeout}
          onChange={onTimeoutChange}
          type="number"
        />
        <InputField
          label="Max Login Attempts"
          value={maxLoginAttempts}
          onChange={onMaxAttemptsChange}
          type="number"
        />
      </div>
    </section>
  );
}

// ── SecurityAuditLog Banner ───────────────────────────────────────────────────

function SecurityAuditLog() {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-red-50 border border-red-200 rounded-xl">
      <div className="flex items-center gap-3">
        {/* Alert circle icon */}
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-red-500 flex-shrink-0">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-red-700">Security Audit Log</p>
          <p className="text-xs text-red-500 mt-0.5">View all security-related events and login attempts</p>
        </div>
      </div>
      <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-colors">
        View Logs
      </button>
    </div>
  );
}

// ── SecurityTab (main export) ─────────────────────────────────────────────────

interface SecurityTabProps {
  form?: SecurityFormData;
  onChange?: (form: SecurityFormData) => void;
}

export default function SecurityTab({ form: externalForm, onChange }: SecurityTabProps) {
  const [internalForm, setInternalForm] = useState<SecurityFormData>(INITIAL_SECURITY_FORM);

  // Support both controlled (via props) and uncontrolled (internal state) usage
  const form = externalForm ?? internalForm;

  const update = (partial: Partial<SecurityFormData>) => {
    const updated = { ...form, ...partial };
    setInternalForm(updated);
    onChange?.(updated);
  };

  const updatePolicy = (key: keyof SecurityFormData["passwordPolicy"], val: boolean) => {
    update({ passwordPolicy: { ...form.passwordPolicy, [key]: val } });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <Authentication
        enabled={form.twoFactorEnabled}
        onChange={(val) => update({ twoFactorEnabled: val })}
      />
      <PasswordPolicy
        policy={form.passwordPolicy}
        onChange={updatePolicy}
      />
      <SessionManagement
        sessionTimeout={form.sessionTimeout}
        maxLoginAttempts={form.maxLoginAttempts}
        onTimeoutChange={(val) => update({ sessionTimeout: val })}
        onMaxAttemptsChange={(val) => update({ maxLoginAttempts: val })}
      />
      <SecurityAuditLog />
    </div>
  );
}