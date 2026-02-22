import type { SystemNotif, NotifCategory } from "../types";

export const systemNotifData: SystemNotif[] = [
  { id: 1, title: "Payment Due Reminder", enabled: true, category: "Payment", template: "Your monthly payment of {amount} EGP is due on {date}. Please pay before the deadline to avoid late fees.", triggerCondition: "3 days before due date", totalSent: 8234, successRate: 98.5, lastSent: "Feb 9", icon: "🔔" },
  { id: 2, title: "Payment Overdue Notice", enabled: true, category: "Payment", template: "Your payment of {amount} EGP is now overdue. Please settle immediately to avoid service interruption.", triggerCondition: "1 day after due date", totalSent: 456, successRate: 97.2, lastSent: "Feb 11", icon: "🔔" },
  { id: 3, title: "Maintenance Request Received", enabled: true, category: "Maintenance", template: "We received your maintenance request #{ticketId}. A technician will be assigned shortly.", triggerCondition: "When ticket created", totalSent: 3421, successRate: 99.8, lastSent: "Feb 12", icon: "⚙" },
  { id: 4, title: "Maintenance Completed", enabled: true, category: "Maintenance", template: "Your maintenance request #{ticketId} has been completed. Please rate the service.", triggerCondition: "When ticket closed", totalSent: 2987, successRate: 96.4, lastSent: "Feb 12", icon: "⚙" },
  { id: 5, title: "Event Registration Confirmed", enabled: true, category: "Event", template: "You're registered for {eventName} on {date}. See you there!", triggerCondition: "When user registers", totalSent: 1567, successRate: 99.1, lastSent: "Feb 11", icon: "📅" },
  { id: 6, title: "Event Reminder", enabled: false, category: "Event", template: "Reminder: {eventName} starts tomorrow at {time}!", triggerCondition: "1 day before event", totalSent: 892, successRate: 95.3, lastSent: "Feb 5", icon: "📅" },
  { id: 7, title: "Guest Access Code Generated", enabled: true, category: "Security", template: "Guest access code for {guestName}: {code}. Valid for {duration}.", triggerCondition: "When QR code created", totalSent: 4521, successRate: 99.9, lastSent: "Feb 12", icon: "🔒" },
];

export const categoryColors: Record<NotifCategory, { bg: string; text: string }> = {
  Payment:     { bg: "#ede9fe", text: "#7c3aed" },
  Maintenance: { bg: "#fce7f3", text: "#be185d" },
  Event:       { bg: "#dbeafe", text: "#1d4ed8" },
  Security:    { bg: "#d1fae5", text: "#065f46" },
};

export const priorityConfig = {
  HIGH:   { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  MEDIUM: { bg: "#fefce8", text: "#854d0e", border: "#fef08a" },
  LOW:    { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
};

export const statusConfig = {
  Sent:      { bg: "#f0fdf4", text: "#15803d", icon: "✓" },
  Draft:     { bg: "#fafafa", text: "#525252", icon: "✏" },
  Scheduled: { bg: "#eff6ff", text: "#1d4ed8", icon: "🕐" },
};