// ─── NotificationTab.tsx ──────────────────────────────────────────────────────

import { useState } from "react";
import { CheckboxRow, Section, ToggleRow } from "./controls";

// ── Channel icons ─────────────────────────────────────────────────────────────
const MailIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const BellIconLg = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4"
  >
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────
export interface NotificationFormData {
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  preferences: {
    paymentReminders: boolean;
    maintenanceUpdates: boolean;
    eventAnnouncements: boolean;
    securityAlerts: boolean;
    newResidentRegistrations: boolean;
    gateAccessLogs: boolean;
    feedbackSubmissions: boolean;
    systemUpdates: boolean;
  };
}

const INITIAL_NOTIF_FORM: NotificationFormData = {
  channels: { email: true, sms: false, push: true },
  preferences: {
    paymentReminders: true,
    maintenanceUpdates: true,
    eventAnnouncements: true,
    securityAlerts: true,
    newResidentRegistrations: true,
    gateAccessLogs: true,
    feedbackSubmissions: true,
    systemUpdates: true,
  },
};

const PREFERENCE_FIELDS: Array<{
  key: keyof NotificationFormData["preferences"];
  label: string;
}> = [
  { key: "paymentReminders", label: "Payment reminders" },
  { key: "maintenanceUpdates", label: "Maintenance updates" },
  { key: "eventAnnouncements", label: "Event announcements" },
  { key: "securityAlerts", label: "Security alerts" },
  { key: "newResidentRegistrations", label: "New resident registrations" },
  { key: "gateAccessLogs", label: "Gate access logs" },
  { key: "feedbackSubmissions", label: "Feedback submissions" },
  { key: "systemUpdates", label: "System updates" },
];

// ── NotificationTab (main) ────────────────────────────────────────────────────
interface NotificationTabProps {
  form?: NotificationFormData;
  onChange?: (form: NotificationFormData) => void;
}

export default function NotificationTab({
  form: externalForm,
  onChange,
}: NotificationTabProps) {
  const [internal, setInternal] = useState<NotificationFormData>(
    INITIAL_NOTIF_FORM,
  );
  const form = externalForm ?? internal;

  const update = (patch: Partial<NotificationFormData>) => {
    const next = { ...form, ...patch };
    setInternal(next);
    onChange?.(next);
  };

  const setChannel = (key: keyof NotificationFormData["channels"], val: boolean) =>
    update({ channels: { ...form.channels, [key]: val } });

  const setPref = (
    key: keyof NotificationFormData["preferences"],
    val: boolean,
  ) => update({ preferences: { ...form.preferences, [key]: val } });

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Notification Channels */}
      <Section title="Notification Channels">
        <div className="space-y-3">
          <ToggleRow
            icon={<MailIcon />}
            title="Email Notifications"
            description="Send notifications via email"
            checked={form.channels.email}
            onChange={(v) => setChannel("email", v)}
          />
          <ToggleRow
            icon={<PhoneIcon />}
            title="SMS Notifications"
            description="Send notifications via SMS"
            checked={form.channels.sms}
            onChange={(v) => setChannel("sms", v)}
          />
          <ToggleRow
            icon={<BellIconLg />}
            title="Push Notifications"
            description="Send notifications to mobile app"
            checked={form.channels.push}
            onChange={(v) => setChannel("push", v)}
          />
        </div>
      </Section>

      {/* Notification Preferences */}
      <Section title="Notification Preferences">
        <div className="space-y-2">
          {PREFERENCE_FIELDS.map(({ key, label }) => (
            <CheckboxRow
              key={key}
              label={label}
              checked={form.preferences[key]}
              onChange={(v) => setPref(key, v)}
            />
          ))}
        </div>
      </Section>
    </div>
  );
}
