import { Calendar, Clock, MapPin, MoreVertical } from 'lucide-react';
import type { Event } from '../types';
import { StatusBadge } from './shared/StatusBadge';
import { ProgressBar } from './shared/ProgressBar';

interface EventCardProps {
  event: Event;
  onCardClick?: (event: Event) => void;
}

export function EventCard({ event, onCardClick }: EventCardProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      social: 'bg-purple-100 text-purple-700',
      sports: 'bg-blue-100 text-blue-700',
      health: 'bg-green-100 text-green-700',
      entertainment: 'bg-pink-100 text-pink-700',
      cultural: 'bg-orange-100 text-orange-700',
      education: 'bg-indigo-100 text-indigo-700'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div
      onClick={() => onCardClick?.(event)}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-200 hover:border-[#00A996]"
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <StatusBadge status={event.status} />
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Handle menu action
          }}
          className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
        >
          <MoreVertical className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title & Description */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#00A996] transition-colors">
          {event.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>
              {new Date(event.startDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{event.startTime} {event.endTime && `- ${event.endTime}`}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <ProgressBar current={event.attendees} max={event.capacity} />
        </div>

        {/* Organizer */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4">
          <img
            src={event.organizer.avatar || 'https://i.pravatar.cc/150'}
            alt={event.organizer.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {event.organizer.name}
            </p>
            {event.organizer.unit && (
              <p className="text-xs text-gray-500 truncate">{event.organizer.unit}</p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {event.tags.slice(0, 3).map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
            >
              {tag}
            </span>
          ))}
          {event.tags.length > 3 && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
              +{event.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
