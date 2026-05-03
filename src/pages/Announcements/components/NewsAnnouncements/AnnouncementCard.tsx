import { Calendar, Edit3, Eye, Trash2 } from "lucide-react";
import type { Announcement } from "../../types";

type AnnouncementCardProps = {
  item: Announcement;
  onDelete: (id: string) => void;
  onEdit?: (item: Announcement) => void;
  onView?: (item: Announcement) => void;
};

export function AnnouncementCard({
  item,
  onDelete,
  onEdit,
  onView,
}: AnnouncementCardProps) {
  const isLive = item.status === "Live";
  const hasImage = !!item.image;
  const hasColor = !!item.bgColor && !hasImage;

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col transition-all hover:border-[#00A389]/30 hover:shadow-lg hover:shadow-[#00A389]/5 hover:-translate-y-0.5">
      {/* Cover area */}
      <div
        className="relative h-36 flex items-center justify-center"
        style={{
          background: hasImage
            ? `url(${item.image}) center/cover no-repeat`
            : hasColor
            ? item.bgColor!
            : "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
        }}
      >
        {hasColor && (
          <span
            className="text-white font-extrabold text-lg text-center px-5"
            style={{ textShadow: "0 1px 4px rgba(0,0,0,0.25)" }}
          >
            {item.title}
          </span>
        )}
        {/* Status pill */}
        <div
          className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold text-white ${
            isLive ? "bg-emerald-500" : "bg-gray-500"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
          {item.status}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col">
        {!hasColor && (
          <h3 className="m-0 mb-1.5 text-[15px] font-bold text-gray-900 line-clamp-1">
            {item.title}
          </h3>
        )}
        <p className="m-0 mb-3 text-[13px] text-gray-600 leading-relaxed flex-1 line-clamp-3">
          {item.description}
        </p>
        {/* Meta */}
        <div className="flex justify-between text-xs text-gray-400 mb-3">
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {item.views.toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {item.date}
          </span>
        </div>
        {/* Actions */}
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-[#00A389] text-[#00A389] text-[13px] font-semibold hover:bg-[#00A389]/10 transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
          {onView && (
            <button
              onClick={() => onView(item)}
              title="View"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-[#00A389] hover:text-[#00A389] transition"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(item.id)}
            title="Delete"
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
