import { Search, Plus } from "lucide-react";
import type { Receipt, ReceiptStatus, FeeType } from "../types";

interface ReceiptsTableProps {
  receipts: Receipt[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onGenerateReceipt: () => void;
}

const statusConfig: Record<
  ReceiptStatus,
  { dot: string; bg: string; text: string; label: string }
> = {
  PAID: {
    dot: "bg-[#5A8DEE]",
    bg: "bg-[#EBF3FF]",
    text: "text-[#1A56DB]",
    label: "Paid",
  },
  PENDING: {
    dot: "bg-gray-400",
    bg: "bg-gray-100",
    text: "text-gray-600",
    label: "Pending",
  },
  OVERDUE: {
    dot: "bg-[#FF5757]",
    bg: "bg-red-50",
    text: "text-red-600",
    label: "Overdue",
  },
};

const feeTypeLabels: Record<FeeType, string> = {
  MAINTENANCE: "Maintenance",
  RENT: "Rent",
  UTILITIES: "Utilities",
};

const feeTypeBadge: Record<FeeType, string> = {
  MAINTENANCE: "bg-orange-50 text-orange-600",
  RENT: "bg-purple-50 text-purple-600",
  UTILITIES: "bg-sky-50 text-sky-600",
};

export function ReceiptsTable({
  receipts,
  searchQuery,
  onSearchChange,
  onGenerateReceipt,
}: ReceiptsTableProps) {
  const filteredReceipts = receipts.filter(
    (receipt) =>
      receipt.receiptId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.residentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      receipt.unit.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      {/* Table Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Financial & Receipts Hub</h3>
          <p className="text-xs text-gray-400 mt-0.5">All payment receipts</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search receipts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A996]/30 focus:border-[#00A996] text-sm w-52 transition-all"
            />
          </div>
          {/* Generate Receipt */}
          <button
            onClick={onGenerateReceipt}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00A996] hover:bg-[#008c7a] text-white rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Generate Receipt
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {[
                "Receipt ID",
                "Resident Name",
                "Unit",
                "Fee Type",
                "Amount",
                "Issue Date",
                "Complete Date",
                "Status",
              ].map((col) => (
                <th
                  key={col}
                  className="text-left py-3 px-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wide"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredReceipts.map((receipt, rowIdx) => {
              const sc = statusConfig[receipt.status];
              return (
                <tr
                  key={receipt.id}
                  className="hover:bg-gray-50/70 transition-colors duration-150 group"
                  style={{ animation: `fadeSlideUp 0.35s ease ${0.05 + rowIdx * 0.06}s both` }}
                >
                  {/* Status circle + Receipt ID */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full ${sc.bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <div className={`w-2.5 h-2.5 rounded-full ${sc.dot}`} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700">
                        {receipt.receiptId}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-700">{receipt.residentName}</td>
                  <td className="py-3 px-4 text-xs text-gray-500 font-medium">{receipt.unit}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded ${feeTypeBadge[receipt.feeType]}`}
                    >
                      {feeTypeLabels[receipt.feeType]}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs font-bold text-gray-800">
                    EGP {receipt.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-500">
                    {new Date(receipt.issueDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 text-xs text-gray-500">
                    {receipt.completeDate
                      ? new Date(receipt.completeDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${sc.bg} ${sc.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filteredReceipts.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400 text-sm">
                  No receipts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
