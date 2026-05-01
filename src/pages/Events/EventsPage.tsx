import { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { Event } from "./types";
import { calculateEventStatistics } from "./data/eventsData";
import { eventsApi, type AdminEventCardItemDto } from "./data/eventsApi";
import {
  PendingBanner,
  EventsGrid,
  EventDetailsModal,
  CreateEventModal,
} from "./components";
import { PrimaryButton, StatCard } from "@/components/shared";

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [pendingEvents, setPendingEvents] = useState<Event[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);

  const statistics = useMemo(() => calculateEventStatistics(events), [events]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleReviewPending = () => {
    setPendingOpen((prev) => !prev);
    if (!pendingOpen && pendingEvents.length === 0) {
      fetchPendingEvents();
    }
  };

  const handleCreateEvent = () => {
    setIsCreateOpen(true);
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
  };

  const formatTime = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(11, 16);
  };

  const mapStatus = (raw?: string | null): Event["status"] => {
    const normalized = (raw || "").toLowerCase();
    switch (normalized) {
      case "approved":
        return "approved";
      case "ongoing":
        return "ongoing";
      case "completed":
        return "completed";
      case "rejected":
      case "cancelled":
        return "rejected";
      case "proposed":
      case "pending":
      default:
        return "pending";
    }
  };

  const parseTags = (raw?: string | null) => {
    if (!raw) return [];
    return raw
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  };

  const mapCategory = (raw?: string | null): Event["category"] => {
    const normalized = (raw || "").toLowerCase();
    switch (normalized) {
      case "social":
        return "social";
      case "sports":
        return "sports";
      case "health":
      case "health & wellness":
      case "health and wellness":
        return "health";
      case "entertainment":
        return "entertainment";
      case "cultural":
        return "cultural";
      case "educational":
      case "education":
        return "education";
      default:
        return "social";
    }
  };

  const normalizeEvent = (raw: AdminEventCardItemDto, index: number): Event => {
    const organizerName =
      raw.organizerName || raw.hostName || "Unknown organizer";
    return {
      id: raw.eventId ?? `event-${index}`,
      title: raw.title ?? "Untitled Event",
      description: raw.description ?? "",
      imageUrl: raw.imageUrl ?? undefined,
      status: mapStatus(raw.uiStatus || raw.workflowStatus),
      category: mapCategory(raw.category),
      organizer: {
        name: organizerName,
      },
      location: raw.location ?? "",
      startDate: formatDate(raw.startDate),
      endDate: formatDate(raw.endDate),
      startTime: formatTime(raw.startDate),
      endTime: formatTime(raw.endDate) || undefined,
      capacity: raw.maxAttendees ?? 0,
      attendees: raw.currentAttendees ?? 0,
      tags: parseTags((raw as any).tags),
      createdAt: raw.createdAt ?? new Date().toISOString(),
    };
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await eventsApi.listEvents();
      const rawEvents = res.data.events || [];
      setEvents(rawEvents.map(normalizeEvent));
      const pendingFromApi =
        res.data.pendingApproval?.pendingCount ??
        res.data.summary?.pendingCount ??
        0;
      setPendingCount(pendingFromApi);
    } catch (err) {
      console.error("Failed to fetch events", err);
      setPendingCount(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingEvents = async () => {
    try {
      setPendingLoading(true);
      const res = await eventsApi.listEvents({
        status: "PENDING",
        page: 0,
        size: 5,
      });
      const rawEvents = res.data.events || [];
      setPendingEvents(rawEvents.map(normalizeEvent));
    } catch (err) {
      console.error("Failed to fetch pending events", err);
      setPendingEvents([]);
    } finally {
      setPendingLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await eventsApi.listCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error("Failed to load categories", err);
      setCategories([]);
    }
  };

  const categoryOptions = categories.length
    ? categories
    : [
        "Social",
        "Sports",
        "Health & Wellness",
        "Entertainment",
        "Cultural",
        "Educational",
      ];

  useEffect(() => {
    fetchEvents();
    fetchCategories();
  }, []);

  const handleCreateSubmit = async (
    payload: Parameters<typeof eventsApi.createEvent>[0],
  ) => {
    try {
      setCreating(true);
      await eventsApi.createEvent(payload);
      setIsCreateOpen(false);
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
    } finally {
      setCreating(false);
    }
  };

  const handleNotify = async (eventId: string) => {
    try {
      await eventsApi.notifyResidents(eventId);
      alert("Notification queued/sent");
    } catch (err) {
      console.error(err);
      alert("Failed to notify residents");
    }
  };

  const handleExport = async (eventId: string) => {
    try {
      const res = await eventsApi.exportAttendees(eventId);
      const blob = new Blob([res.data], {
        type: res.headers["content-type"] || "application/octet-stream",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `event-${eventId}-attendees.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export attendees");
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      await eventsApi.deleteEvent(eventId);
      alert("Event deleted");
      fetchEvents();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete event");
    }
  };

  const handleApprove = async (eventId: string) => {
    try {
      await eventsApi.approveEvent(eventId);
      alert("Event approved");
      fetchEvents();
      if (pendingOpen) {
        fetchPendingEvents();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to approve event");
    }
  };

  const handleReject = async (eventId: string) => {
    try {
      await eventsApi.rejectEvent(eventId);
      alert("Event rejected");
      fetchEvents();
      if (pendingOpen) {
        fetchPendingEvents();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to reject event");
    }
  };

  const handleComplete = async (eventId: string) => {
    try {
      await eventsApi.completeEvent(eventId);
      alert("Event marked complete");
      fetchEvents();
    } catch (err) {
      console.error(err);
      alert("Failed to complete event");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events Manager</h1>
            <p className="text-gray-600 mt-1">
              Manage and organize community events
            </p>
          </div>
          <PrimaryButton onClick={handleCreateEvent} icon={Plus}>
            Create Event
          </PrimaryButton>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            icon={Calendar}
            label="Total Events"
            value={statistics.total}
            iconBg="bg-teal-100"
            iconColor="text-[#00A996]"
            gradient="bg-gradient-to-br from-teal-50 to-cyan-50"
            borderColor="border-teal-200"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={statistics.pending}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
            gradient="bg-gradient-to-br from-yellow-50 to-amber-50"
            borderColor="border-yellow-200"
          />
          <StatCard
            icon={CheckCircle2}
            label="Approved"
            value={statistics.approved}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            gradient="bg-gradient-to-br from-green-50 to-emerald-50"
            borderColor="border-green-200"
          />
          <StatCard
            icon={AlertCircle}
            label="Ongoing"
            value={statistics.ongoing}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            gradient="bg-gradient-to-br from-blue-50 to-indigo-50"
            borderColor="border-blue-200"
          />
          <StatCard
            icon={CheckCircle2}
            label="Completed"
            value={statistics.completed}
            iconBg="bg-gray-100"
            iconColor="text-gray-600"
            gradient="bg-gradient-to-br from-gray-50 to-slate-50"
            borderColor="border-gray-200"
          />
        </div>

        {/* Pending Approval Banner */}
        <PendingBanner
          count={pendingCount}
          onViewClick={handleReviewPending}
          onToggle={handleReviewPending}
          isOpen={pendingOpen}
        />

        {pendingOpen && pendingCount > 0 && (
          <div className="bg-[#FFF9E8] border border-yellow-200 rounded-xl p-4 space-y-4">
            {pendingLoading ? (
              <div className="text-sm text-yellow-700">
                Loading pending events...
              </div>
            ) : (
              pendingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-yellow-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <img
                      src={
                        event.imageUrl ||
                        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
                      }
                      alt={event.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="min-w-0">
                      <h4 className="text-base font-semibold text-gray-900 truncate">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-2">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {event.startDate}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {event.organizer.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <button
                      onClick={() => handleApprove(event.id)}
                      className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                      aria-label="Approve event"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleReject(event.id)}
                      className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                      aria-label="Reject event"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleEventClick(event)}
                      className="px-3 py-2 rounded-lg border border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))
            )}
            {!pendingLoading && pendingEvents.length === 0 && (
              <div className="text-sm text-yellow-700">
                No pending events found.
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="text-sm text-gray-500">Loading events...</div>
        )}

        {/* Events Grid */}
        <EventsGrid events={events} onEventClick={handleEventClick} />

        {/* Event Details Modal */}
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onNotify={handleNotify}
          onExport={handleExport}
          onEdit={() => alert("Edit flow not implemented")}
          onDelete={handleDelete}
          onApprove={handleApprove}
          onReject={handleReject}
          onComplete={handleComplete}
        />

        <CreateEventModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          categories={categoryOptions}
          onSubmit={handleCreateSubmit}
          submitting={creating}
        />
      </div>
    </div>
  );
}
