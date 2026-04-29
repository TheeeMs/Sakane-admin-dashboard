import { ProgressBar } from "@/components/shared/ProgressBar";
import { calculatePercentage } from "@/lib/formatters";

interface EventAttendanceCardProps {
  attendees: number;
  capacity: number;
}

export function EventAttendanceCard({
  attendees,
  capacity,
}: EventAttendanceCardProps) {
  const percentage = calculatePercentage(attendees, capacity);

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-100">
      <p className="text-sm text-gray-500 mb-3">ATTENDANCE</p>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-3xl font-bold text-gray-900">{attendees}</span>
        <span className="text-gray-500">/ {capacity}</span>
      </div>
      <ProgressBar
        current={attendees}
        max={capacity}
        label={`${attendees} / ${capacity}`}
        showPercentage={false}
      />
      <p className="text-xs text-gray-600 mt-2">{percentage}% capacity</p>
    </div>
  );
}
