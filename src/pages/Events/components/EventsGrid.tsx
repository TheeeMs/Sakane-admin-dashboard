import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import type { Event, EventStatus } from '../types';
import { EventCard } from './EventCard';

interface EventsGridProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

type FilterType = 'all' | EventStatus;

export function EventsGrid({ events, onEventClick }: EventsGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All Events' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' }
  ];

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filter by status
      if (activeFilter !== 'all' && event.status !== activeFilter) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.organizer.name.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [events, activeFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events by title, organizer, or location..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A996] focus:border-transparent"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-200 ${
                activeFilter === filter.value
                  ? 'bg-[#00A996] text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-[#00A996] hover:text-[#00A996]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredEvents.length}</span> of{' '}
          <span className="font-semibold">{events.length}</span> events
        </p>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} onCardClick={onEventClick} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}
