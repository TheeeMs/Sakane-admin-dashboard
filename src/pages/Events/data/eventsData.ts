import type { Event, EventStatistics } from "../types";

// Removed static sample events. The frontend now uses the backend API.
export const eventsData: Event[] = [];

export const calculateEventStatistics = (events: Event[]): EventStatistics => {
  return {
    total: events.length,
    pending: events.filter((e) => e.status === "pending").length,
    approved: events.filter((e) => e.status === "approved").length,
    ongoing: events.filter((e) => e.status === "ongoing").length,
    completed: events.filter((e) => e.status === "completed").length,
    rejected: events.filter((e) => e.status === "rejected").length,
  };
};
