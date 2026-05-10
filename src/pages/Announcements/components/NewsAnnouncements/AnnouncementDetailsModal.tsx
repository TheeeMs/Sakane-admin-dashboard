import { Edit3, X } from "lucide-react";
import type { Announcement } from "../../types";

interface AnnouncementDetailsModalProps {
  isOpen: boolean;
  item: Announcement | null;
  onClose: () => void;
  onEdit?: (item: Announcement) => void;
}

function formatLong(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function AnnouncementDetailsModal({
  isOpen,
  item,
  onClose,
  onEdit,
}: AnnouncementDetailsModalProps) {
  if (!isOpen || !item) return null;

  const hasImage = !!item.image;
  const hasColor = !!item.bgColor && !hasImage;
  const isLive = item.status === "Live";

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-[600px] max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-[17px] font-bold text-gray-900">
            Announcement Details
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Cover */}
          <div
            className="relative w-full h-44 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100"
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
                className="text-white text-lg font-extrabold text-center px-6"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.25)" }}
              >
                {item.title}
              </span>
            )}
          </div>

          {/* Title + description */}
          <div>
            <h3 className="m-0 text-[18px] font-bold text-gray-900">
              {item.title}
            </h3>
            {item.description && (
              <p className="m-0 mt-2 text-sm text-gray-700 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
              <p className="m-0 text-[11px] font-medium text-blue-600">
                Total Views
              </p>
              <p className="m-0 mt-1 text-2xl font-extrabold text-blue-800">
                {(item.views ?? 0).toLocaleString()}
              </p>
            </div>
            <div
              className={
                "rounded-xl px-4 py-3 border " +
                (isLive
                  ? "bg-emerald-50 border-emerald-100"
                  : "bg-gray-50 border-gray-100")
              }
            >
              <p
                className={
                  "m-0 text-[11px] font-medium " +
                  (isLive ? "text-emerald-600" : "text-gray-500")
                }
              >
                Status
              </p>
              <p
                className={
                  "m-0 mt-1 text-xl font-extrabold " +
                  (isLive ? "text-emerald-700" : "text-gray-700")
                }
              >
                {item.status}
              </p>
            </div>
            <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
              <p className="m-0 text-[11px] font-medium text-violet-600">
                Published
              </p>
              <p className="m-0 mt-1 text-base font-bold text-violet-800">
                {item.date || "—"}
              </p>
            </div>
          </div>

          {/* Detail rows */}
          <div className="rounded-xl border border-gray-100 divide-y divide-gray-100">
            <div className="flex justify-between px-4 py-3">
              <span className="text-sm text-gray-500">Created By</span>
              <span className="text-sm font-semibold text-gray-800">
                {"—"}
              </span>
            </div>
            <div className="flex justify-between px-4 py-3">
              <span className="text-sm text-gray-500">Expires On</span>
              <span className="text-sm font-semibold text-red-600">
                {formatLong(item.expiresAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-sm font-semibold transition"
          >
            Close
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A389] hover:bg-[#008F77] text-white text-sm font-semibold shadow-md hover:shadow-lg transition"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
