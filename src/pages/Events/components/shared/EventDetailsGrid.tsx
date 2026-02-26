import { Calendar, Clock, MapPin, Phone } from "lucide-react";
import { EventInfoItem } from "./EventInfoItem";
import { formatDate, formatTime } from "@/lib/formatters";

interface EventDetailsGridProps {
  startDate: string;
  startTime: string;
  endTime?: string;
  location: string;
  contact?: string;
}

export function EventDetailsGrid({
  startDate,
  startTime,
  endTime,
  location,
  contact = "+20 100 123 4567",
}: EventDetailsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <EventInfoItem
        icon={Calendar}
        label="Date"
        value={formatDate(startDate)}
        iconBg="bg-teal-100"
        iconColor="text-[#00A996]"
      />
      <EventInfoItem
        icon={Clock}
        label="Time & Duration"
        value={formatTime(startTime, endTime)}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />
      <EventInfoItem
        icon={MapPin}
        label="Location"
        value={location}
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
      />
      <EventInfoItem
        icon={Phone}
        label="Contact"
        value={contact}
        iconBg="bg-orange-100"
        iconColor="text-orange-600"
      />
    </div>
  );
}
