
import { X, ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ResidentInfo, QRStatus } from "../types";
import { cn } from "@/lib/utils";

interface QRDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  resident: ResidentInfo | null;
}

const StatusBadge = ({ status }: { status: QRStatus }) => {
  const config = {
    Active: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
    },
    Used: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      dot: "bg-blue-500",
    },
    Expired: {
      bg: "bg-gray-100",
      text: "text-gray-600",
      dot: "bg-gray-400",
    },
  }[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        config.bg,
        config.text,
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", config.dot)} />
      {status}
    </span>
  );
};

export const QRDetailsDrawer = ({
  isOpen,
  onClose,
  resident,
}: QRDetailsDrawerProps) => {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !resident) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/20 backdrop-blur-[1px]"
    >
      <div
        className="h-full w-full max-w-[420px] bg-white shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Resident QR Codes
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100vh-80px)]">
          {/* Resident Info */}
          <div className="px-6 py-6 bg-gradient-to-br from-teal-50 to-white border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00A996] to-[#008c7a] flex items-center justify-center text-white text-lg font-bold shadow-lg">
                {resident.initials}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900">
                  {resident.name}
                </h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  {resident.unit}, {resident.building}
                </p>
                <p className="text-xs text-gray-500 mt-1">{resident.phone}</p>
              </div>
            </div>
          </div>

          {/* QR Codes List */}
          <div className="px-6 py-5">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-700">
                QR Codes
                <span className="ml-2 text-xs font-normal text-gray-500">
                  ({resident.qrCodes.length})
                </span>
              </h4>
            </div>

            <div className="space-y-3">
              {resident.qrCodes.map((code) => (
                <div
                  key={code.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {/* Visitor Icon */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: code.visitorIconBg }}
                    >
                      {code.visitorIcon}
                    </div>

                    {/* Visitor Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {code.visitorName}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {code.visitorType}
                          </p>
                        </div>
                        <StatusBadge status={code.status} />
                      </div>

                      {/* QR Code */}
                      <code className="block bg-white border border-gray-200 px-2.5 py-1.5 rounded text-xs font-mono text-gray-700 mb-2">
                        {code.code}
                      </code>

                      {/* Dates */}
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <p>Created: {code.created}</p>
                        <p>Valid until: {code.validUntil}</p>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <button className="text-gray-400 hover:text-gray-600 transition-colors mt-1">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
