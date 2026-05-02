export type Priority = "HIGH" | "NORMAL" | "LOW";
export type Status = "Sent" | "Draft" | "Scheduled";
export type Tab = "push" | "news" | "system";
export type SubTab = "instant" | "scheduled";
export type AnnouncementStatus = "Live" | "Inactive";
export type NotifCategory = "Payment" | "Maintenance" | "Event" | "Security";

export interface PushNotification {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  description: string;
  recipients?: number;
  readCount?: number;
  readPercent?: number;
  sentAt?: string;
  sentBy?: string;
  scheduledAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  status: AnnouncementStatus;
  views: number;
  date: string;
  image?: string;
  bgColor?: string;
  priority?: "LOW" | "NORMAL" | "HIGH";
  expiresAt?: string | null;
}

export interface SystemNotif {
  id: number;
  title: string;
  enabled: boolean;
  category: NotifCategory;
  template: string;
  triggerCondition: string;
  totalSent: number;
  successRate: number;
  lastSent: string;
  icon: string;
}
