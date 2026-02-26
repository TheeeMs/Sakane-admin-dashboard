import { useEffect } from "react";
import type { Event } from "../types";
import { EventHeader } from "./shared/EventHeader";
import { EventActionButtons } from "./shared/EventActionButtons";
import { EventDetailsGrid } from "./shared/EventDetailsGrid";
import { EventOrganizerCard } from "./shared/EventOrganizerCard";
import { EventAttendanceCard } from "./shared/EventAttendanceCard";
import { EventDescription } from "./shared/EventDescription";
import { EventGallery } from "./shared/EventGallery";
import { EventTags } from "./shared/EventTags";

interface EventDetailsModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventDetailsModal({
  event,
  isOpen,
  onClose,
}: EventDetailsModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const galleryImages = event.imageUrl
    ? [
        event.imageUrl,
        "https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&q=80",
        "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=80",
      ]
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image Section */}
        <EventHeader
          imageUrl={event.imageUrl}
          title={event.title}
          status={event.status}
          category={event.category}
          onClose={onClose}
        />

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Action Buttons */}
          <EventActionButtons />

          {/* Event Details Grid */}
          <EventDetailsGrid
            startDate={event.startDate}
            startTime={event.startTime}
            endTime={event.endTime}
            location={event.location}
          />

          {/* Organizer Section */}
          <EventOrganizerCard
            name={event.organizer.name}
            avatar={event.organizer.avatar}
            unit={event.organizer.unit}
          />

          {/* Attendance Section */}
          <EventAttendanceCard
            attendees={event.attendees}
            capacity={event.capacity}
          />

          {/* Event Description */}
          <EventDescription description={event.description} />

          {/* Event Gallery */}
          <EventGallery images={galleryImages} />

          {/* Tags */}
          <EventTags tags={event.tags} />
        </div>
      </div>
    </div>
  );
}
