import { useState, useMemo } from 'react';
import { Calendar, Clock, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import type { Event } from './types';
import { eventsData, calculateEventStatistics } from './data/eventsData';
import { EventStatCard, PendingBanner, EventsGrid } from './components';

export function EventsPage() {
  const [events] = useState<Event[]>(eventsData);

  const statistics = useMemo(() => calculateEventStatistics(events), [events]);

  const handleEventClick = (event: Event) => {
    console.log('Event clicked:', event);
    // TODO: Open event details modal/drawer
  };

  const handleReviewPending = () => {
    console.log('Review pending events');
    // TODO: Filter to pending events or open review modal
  };

  const handleCreateEvent = () => {
    console.log('Create new event');
    // TODO: Open create event modal
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Events Manager</h1>
            <p className="text-gray-600 mt-1">Manage and organize community events</p>
          </div>
          <button
            onClick={handleCreateEvent}
            className="flex items-center gap-2 px-6 py-3 bg-[#00A996] hover:bg-[#008c7a] text-white rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <EventStatCard
            icon={Calendar}
            label="Total Events"
            value={statistics.total}
            iconBg="bg-teal-100"
            iconColor="text-[#00A996]"
            gradient="bg-gradient-to-br from-teal-50 to-cyan-50"
            borderColor="border-teal-200"
          />
          <EventStatCard
            icon={Clock}
            label="Pending"
            value={statistics.pending}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
            gradient="bg-gradient-to-br from-yellow-50 to-amber-50"
            borderColor="border-yellow-200"
          />
          <EventStatCard
            icon={CheckCircle2}
            label="Approved"
            value={statistics.approved}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            gradient="bg-gradient-to-br from-green-50 to-emerald-50"
            borderColor="border-green-200"
          />
          <EventStatCard
            icon={AlertCircle}
            label="Ongoing"
            value={statistics.ongoing}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            gradient="bg-gradient-to-br from-blue-50 to-indigo-50"
            borderColor="border-blue-200"
          />
          <EventStatCard
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
        <PendingBanner count={statistics.pending} onViewClick={handleReviewPending} />

        {/* Events Grid */}
        <EventsGrid events={events} onEventClick={handleEventClick} />
      </div>
    </div>
  );
}
