// src/lib/systemTemplateService.ts

import { apiFetch } from "./authService";

// ─── Types ───────────────────────────────────────────────────────────────────

export type TemplateCategory = "Payment" | "Maintenance" | "Security" | "Event" | "General";

export interface SystemTemplate {
  id: string;
  templateKey: string;
  title: string;
  category: TemplateCategory;
  messageTemplate: string;
  triggerCondition: string;
  notificationType?: string;
  keywords?: string;
  isEnabled: boolean;
  displayOrder: number;
  totalSent?: number;
  successRate?: number;
  lastSent?: string;
}

// ─── Icon + color config per category ────────────────────────────────────────

export const categoryConfig: Record<TemplateCategory | string, {
  icon: string;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
}> = {
  Payment: {
    icon: "🔔",
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
    badgeBg: "#ede9fe",
    badgeText: "#7c3aed",
  },
  Maintenance: {
    icon: "⚙️",
    iconBg: "#fff7ed",
    iconColor: "#ea580c",
    badgeBg: "#fce7f3",
    badgeText: "#be185d",
  },
  Security: {
    icon: "🔒",
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
    badgeBg: "#d1fae5",
    badgeText: "#065f46",
  },
  Event: {
    icon: "📅",
    iconBg: "#faf5ff",
    iconColor: "#7c3aed",
    badgeBg: "#dbeafe",
    badgeText: "#1d4ed8",
  },
  General: {
    icon: "📢",
    iconBg: "#eff6ff",
    iconColor: "#3b82f6",
    badgeBg: "#f3f4f6",
    badgeText: "#374151",
  },
};

// ─── Static data (fallback when API is unavailable) ───────────────────────────

export const staticTemplates: SystemTemplate[] = [
  {
    id: "3c3eedef-7192-4f65-bd49-53931f010000",
    templateKey: "PAYMENT_DUE_REMINDER",
    title: "Payment Due Reminder",
    category: "Payment",
    messageTemplate: "Your monthly payment of {amount} EGP is due on {date}. Please pay before the deadline to avoid late fees.",
    triggerCondition: "3 days before due date",
    isEnabled: true,
    displayOrder: 1,
    totalSent: 8234,
    successRate: 98.5,
    lastSent: "Feb 9",
  },
  {
    id: "49291481-b097-45da-93a8-02c2a946f000",
    templateKey: "PAYMENT_OVERDUE_NOTICE",
    title: "Payment Overdue Notice",
    category: "Payment",
    messageTemplate: "Your payment of {amount} EGP is now overdue. Please settle immediately to avoid service interruption.",
    triggerCondition: "1 day after due date",
    isEnabled: true,
    displayOrder: 2,
    totalSent: 456,
    successRate: 97.2,
    lastSent: "Feb 11",
  },
  {
    id: "b8fe8b93-0b85-4af1-8d96-4ab9936cf000",
    templateKey: "MAINTENANCE_REQUEST_RECEIVED",
    title: "Maintenance Request Received",
    category: "Maintenance",
    messageTemplate: "We received your maintenance request #{ticketId}. A technician will be assigned shortly.",
    triggerCondition: "When ticket created",
    isEnabled: true,
    displayOrder: 3,
    totalSent: 3421,
    successRate: 99.8,
    lastSent: "Feb 12",
  },
  {
    id: "5c76a716-9e04-4f82-bbc7-e1b05e1e1000",
    templateKey: "MAINTENANCE_COMPLETED",
    title: "Maintenance Completed",
    category: "Maintenance",
    messageTemplate: "Your maintenance request #{ticketId} has been completed. Please rate the service.",
    triggerCondition: "When ticket closed",
    isEnabled: true,
    displayOrder: 4,
    totalSent: 2987,
    successRate: 96.4,
    lastSent: "Feb 12",
  },
  {
    id: "d6ec8c9d-ad5d-4839-9eb4-bce1f8d4b000",
    templateKey: "SECURITY_ALERT_PUSH",
    title: "Security Alert Triggered",
    category: "Security",
    messageTemplate: "Security alert: {alertTitle}. Authorities have been notified and updates will follow.",
    triggerCondition: "When security alert created",
    isEnabled: true,
    displayOrder: 5,
    totalSent: 892,
    successRate: 99.1,
    lastSent: "Feb 11",
  },
  {
    id: "408af9a8-e01b-4e23-8da6-6d04661500",
    templateKey: "EVENT_REMINDER_AUTOMATED",
    title: "Upcoming Event Reminder",
    category: "Event",
    messageTemplate: "Reminder: {eventTitle} starts on {date}. Check details in the Events section.",
    triggerCondition: "24 hours before event",
    isEnabled: false,
    displayOrder: 6,
    totalSent: 892,
    successRate: 95.3,
    lastSent: "Feb 5",
  },
  {
    id: "bca89ffb-89ea-4120-9512-ad9fc3c4d000",
    templateKey: "ANNOUNCEMENT_BROADCAST",
    title: "Announcement Broadcast",
    category: "General",
    messageTemplate: "A new community announcement is available. Open the app to read full details.",
    triggerCondition: "When announcement published",
    isEnabled: true,
    displayOrder: 7,
    totalSent: 1567,
    successRate: 98.0,
    lastSent: "Feb 10",
  },
];

// ─── API call (tries backend, falls back to static) ──────────────────────────

export async function fetchSystemTemplates(): Promise<SystemTemplate[]> {
  try {
    const res = await apiFetch("/v1/system-notification-templates");
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : staticTemplates;
    }
  } catch {
    // fallback to static
  }
  return staticTemplates;
}
