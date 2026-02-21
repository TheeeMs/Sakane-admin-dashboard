import type { PushNotification } from "../types";

export const instantNotifications: PushNotification[] = [  { id: 1, title: "Pool Maintenance Tomorrow", status: "Sent", priority: "HIGH", description: "The swimming pool will be closed tomorrow (Feb 13) from 9 AM to 2 PM for scheduled maintenance.", recipients: 342, readCount: 289, readPercent: 85, sentAt: "Sent Feb 12, 09:00 AM", sentBy: "Ahmed Mahmoud" },
  { id: 2, title: "New Fitness Classes Available", status: "Draft", priority: "LOW", description: "Join our new yoga and pilates classes starting next week! Check the Events section for schedule.", recipients: 0, sentBy: "Sarah Ali" },
  { id: 3, title: "Parking Regulation Update", status: "Sent", priority: "MEDIUM", description: "Reminder: All vehicles must display updated parking permits starting March 1st.", recipients: 512, readCount: 400, readPercent: 78, sentAt: "Sent Feb 10, 11:30 AM", sentBy: "Mohamed Mahmoud" },
];

export const scheduledNotifications: PushNotification[] = [
  { id: 4, title: "Monthly Community Meeting", status: "Scheduled", priority: "MEDIUM", description: "Reminder for the monthly community meeting happening on Feb 20th at 6 PM in the main hall.", recipients: 342, scheduledAt: "Scheduled Feb 20, 06:00 PM", sentBy: "Sarah Ali" },
  { id: 5, title: "Water Supply Interruption", status: "Scheduled", priority: "HIGH", description: "Water supply will be temporarily interrupted on Feb 18 from 8 AM to 12 PM for pipe maintenance.", recipients: 342, scheduledAt: "Scheduled Feb 18, 08:00 AM", sentBy: "Ahmed Mahmoud" },
];