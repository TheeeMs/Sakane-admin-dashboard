import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import type { QRAccessCode, VisitorType, QRStatus } from "../types";
import { cn } from "@/lib/utils";

interface QRTableProps {
  data: QRAccessCode[];
  onRowClick?: (code: QRAccessCode) => void;
}

const FILTER_TABS: Array<"All" | VisitorType> = [
  "All",
  "Guest",
  "Delivery",
  "Service",
  "Family",
];

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
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold",
        config.bg,
        config.text,
      )}
    >
      <span className={cn("w-2 h-2 rounded-full", config.dot)} />
      {status}
    </span>
  );
};

export const QRTable = ({ data, onRowClick }: QRTableProps) => {
  const [activeTab, setActiveTab] = useState<"All" | VisitorType>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchTab = activeTab === "All" || item.visitorType === activeTab;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        item.code.toLowerCase().includes(q) ||
        item.visitorName.toLowerCase().includes(q) ||
        item.hostResident.toLowerCase().includes(q) ||
        item.unit.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [data, activeTab, search]);

  const getTabCount = (tab: "All" | VisitorType) => {
    if (tab === "All") return data.length;
    return data.filter((item) => item.visitorType === tab).length;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-5">
        <h2 className="text-xl font-semibold text-gray-900">QR Access Codes</h2>
        <p className="text-sm text-gray-500 mt-1">
          Manage visitor access and track gate entries
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-fit">
          {FILTER_TABS.map((tab) => {
            const isActive = activeTab === tab;
            const count = getTabCount(tab);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900",
                )}
              >
                {tab}
                <span
                  className={cn(
                    "ml-1.5 text-xs",
                    isActive ? "text-gray-500" : "text-gray-400",
                  )}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search */}
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by visitor, resident, QR code, or unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#00A996] focus:ring-2 focus:ring-[#00A996]/10 transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3">
                QR Code
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                Visitor Details
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                Host Resident
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                Unit
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                Created
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                Valid Until
              </th>
              <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-12 text-sm text-gray-400"
                >
                  No access codes found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className="hover:bg-teal-50/40 transition-colors cursor-pointer"
                >
                  {/* QR Code */}
                  <td className="px-6 py-4">
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">
                      {item.code}
                    </code>
                  </td>

                  {/* Visitor Details */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: item.visitorIconBg }}
                      >
                        {item.visitorIcon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.visitorName}
                        </p>
                        <span className="inline-block mt-0.5 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                          {item.visitorType}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Host Resident */}
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-700">{item.hostResident}</p>
                  </td>

                  {/* Unit */}
                  <td className="px-4 py-4">
                    <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                      {item.unit}
                    </span>
                  </td>

                  {/* Created */}
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-600">{item.created}</p>
                  </td>

                  {/* Valid Until */}
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-600">{item.validUntil}</p>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {filtered.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filtered.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-700">{data.length}</span>{" "}
            access codes
          </p>
        </div>
      )}
    </div>
  );
};
