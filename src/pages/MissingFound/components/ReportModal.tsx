
import {
  Bell,
  Calendar,
  CheckCircle2,
  Edit3,
  Link2,
  MapPin,
  Phone,
  Tag as TagIcon,
  Trash2,
  User as UserIcon,
  X,
} from "lucide-react";
import type { Report } from "../types";
import TypeBadge from "./TypeBadge";
import StatusBadge from "./StatusBadge";

interface ReportModalProps {
  report: Report | null;
  onClose: () => void;
  onEdit?: (report: Report) => void;
  onMarkResolved?: (report: Report) => void;
  onMarkMatched?: (report: Report) => void;
  onNotifyUser?: (report: Report) => void;
  onDelete?: (report: Report) => void;
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4">
      <div className="flex items-center gap-2 text-gray-400 text-xs font-medium mb-2">
        {icon}
        {label}
      </div>

      <div className="text-sm font-semibold text-gray-900 whitespace-pre-line leading-relaxed">
        {value || "-"}
      </div>
    </div>
  );
}

export default function ReportModal({
  report,
  onClose,
  onEdit,
  onMarkResolved,
  onMarkMatched,
  onNotifyUser,
  onDelete,
}: ReportModalProps) {
  if (!report) return null;

  const reportDateFormatted = `${report.date}${
    report.date && !report.date.includes(":") ? " at 02:30 PM" : ""
  }`;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[760px] max-h-[92vh] overflow-hidden rounded-[24px] bg-white shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Report Details</h2>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-2">
            <TypeBadge type={report.type} />
            <StatusBadge status={report.status} />
          </div>

          {/* Title */}
          <div>
            <h3 className="text-[28px] font-bold text-gray-900 leading-tight">
              {report.title}
            </h3>

            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <TagIcon className="w-4 h-4" />
              <span>{report.category}</span>
            </div>
          </div>

          {/* Photo */}
          {report.photo && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                Photos
              </h4>

              <img
                  src={report.photo || "/placeholder.jpg"}
                 alt={report.title}
                 className="w-[220px] h-[150px] rounded-xl object-cover border border-gray-200"
              />
            </div>
          )}

          {/* Description */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Detailed Description
            </h4>

            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-4 text-sm text-gray-700 leading-relaxed">
              {report.fullDesc || "No description provided."}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailItem
              icon={<MapPin className="w-4 h-4" />}
              label="Last Seen Location"
              value={report.location}
            />

            <DetailItem
              icon={<Phone className="w-4 h-4" />}
              label="Contact Number"
              value={report.contact}
            />

            <DetailItem
              icon={<UserIcon className="w-4 h-4" />}
              label="Reported By"
              value={`${report.reportedBy}\n${report.unit}`}
            />

            <DetailItem
              icon={<Calendar className="w-4 h-4" />}
              label="Report Date"
              value={reportDateFormatted}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap gap-3 items-center">
          {/* Edit */}
          <button
            onClick={() => {
              onEdit?.(report);
              onClose();
            }}
            className="h-11 px-5 rounded-xl bg-[#00A389] hover:bg-[#008A74] text-white text-sm font-semibold flex items-center gap-2 transition"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>

          {/* Resolve */}
          <button
            onClick={() => onMarkResolved?.(report)}
            className="h-11 px-5 rounded-xl border border-green-500 text-green-600 hover:bg-green-50 text-sm font-semibold flex items-center gap-2 transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            Mark Resolved
          </button>

          {/* Match */}
          <button
            onClick={() => onMarkMatched?.(report)}
            className="h-11 px-5 rounded-xl border border-orange-400 text-orange-500 hover:bg-orange-50 text-sm font-semibold flex items-center gap-2 transition"
          >
            <Link2 className="w-4 h-4" />
            Mark Matched
          </button>

          {/* Notify */}
          <button
            onClick={() => onNotifyUser?.(report)}
            className="h-11 px-5 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-50 text-sm font-semibold flex items-center gap-2 transition"
          >
            <Bell className="w-4 h-4" />
            Notify User
          </button>

          {/* Delete */}
          <button
            onClick={() => {
              onDelete?.(report);
              onClose();
            }}
            className="h-11 w-11 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="ml-auto h-11 px-6 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
