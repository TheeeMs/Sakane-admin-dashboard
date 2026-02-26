import { useState, useMemo } from "react";
import { Calendar, Clock, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import type { Event } from "./types";
import { eventsData, calculateEventStatistics } from "./data/eventsData";
import { PendingBanner, EventsGrid, EventDetailsModal } from "./components";
import { PrimaryButton, StatCard } from "@/components/shared";

export function EventsPage() {
  const [events] = useState<Event[]>(eventsData);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    console.log("Review pending events");
    // TODO: Filter to pending events or open review modal
  };

  const handleCreateEvent = () => {
    console.log("Create new event");
    // TODO: Open create event modal
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
          count={statistics.pending}
          onViewClick={handleReviewPending}
        />

        {/* Events Grid */}
        <EventsGrid events={events} onEventClick={handleEventClick} />

        {/* Event Details Modal */}
        <EventDetailsModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
