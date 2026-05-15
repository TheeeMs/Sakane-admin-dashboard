import { Clock, Eye, Trash2, Users, Calendar as CalendarIcon } from "lucide-react";
import type { PushNotification } from "../../types";
import { PriorityBadge, StatusBadge } from "../shared/Badges";

export function NotificationCard({
  notif,
  onDelete,
  onView,
}: {
  notif: PushNotification;
  onDelete: (id: string) => void;
  onView?: (notif: PushNotification) => void;
}) {
  return (
    <div className="group bg-white border border-gray-100 rounded-xl p-5 transition-all hover:border-[#00A389]/30 hover:shadow-md hover:shadow-[#00A389]/5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Title + badges */}
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h3 className="font-bold text-gray-900 text-[15px]">{notif.title}</h3>
            <StatusBadge status={notif.status} />
            <PriorityBadge priority={notif.priority} />
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
            {notif.description}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
            {notif.recipients !== undefined && (
              <span className="inline-flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {notif.recipients} recipients
              </span>
            )}
            {notif.readPercent !== undefined && (
              <span className="inline-flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {notif.readCount} read ({notif.readPercent}%)
              </span>
            )}
            {notif.sentAt && (
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {notif.sentAt}
              </span>
            )}
            {notif.scheduledAt && (
              <span className="inline-flex items-center gap-1">
                <CalendarIcon className="w-3.5 h-3.5" />
                {notif.scheduledAt}
              </span>
            )}
            {notif.sentBy && (
              <span className="text-gray-400">By {notif.sentBy}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1 flex-shrink-0">
          {onView && (
            <button
              onClick={() => onView(notif)}
              title="View details"
              className="w-9 h-9 rounded-lg text-gray-500 hover:bg-[#00A389]/10 hover:text-[#00A389] flex items-center justify-center transition"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(notif.id)}
            title="Delete"
            className="w-9 h-9 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
