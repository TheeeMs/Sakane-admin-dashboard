interface EventOrganizerCardProps {
  name: string;
  avatar?: string;
  unit?: string;
}

export function EventOrganizerCard({
  name,
  avatar,
  unit,
}: EventOrganizerCardProps) {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 border-2 border-teal-100">
      <p className="text-sm text-gray-500 mb-3">ORGANIZER</p>
      <div className="flex items-center gap-4">
        <img
          src={avatar || "https://i.pravatar.cc/150"}
          alt={name}
          className="w-14 h-14 rounded-full border-2 border-white shadow-md"
        />
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-1">{name}</h4>
          {unit && <p className="text-sm text-gray-600">{unit}</p>}
        </div>
      </div>
    </div>
  );
}
