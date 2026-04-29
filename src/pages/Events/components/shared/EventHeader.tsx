import { X } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { CategoryBadge } from "./CategoryBadge";
import type { EventStatus, EventCategory } from "../../types";

interface EventHeaderProps {
  imageUrl?: string;
  title: string;
  status: EventStatus;
  category: EventCategory;
  onClose: () => void;
}

export function EventHeader({
  imageUrl,
  title,
  status,
  category,
  onClose,
}: EventHeaderProps) {
  return (
    <div className="relative h-64 overflow-hidden rounded-t-2xl">
      <img
        src={
          imageUrl ||
          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
        }
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition-colors shadow-lg"
      >
        <X className="w-5 h-5 text-gray-700" />
      </button>

      {/* Title and Badges */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="flex gap-2 mb-3">
          <StatusBadge status={status} />
          <CategoryBadge category={category} />
        </div>
        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </div>
    </div>
  );
}
