import { Search } from "lucide-react";
import type { Receipt, ReceiptStatus, FeeType } from "../types";

interface ReceiptsTableProps {
  receipts: Receipt[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onGenerateReceipt: () => void;
}

const statusColors: Record<ReceiptStatus, string> = {
  PAID: "bg-green-100 text-green-700 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  OVERDUE: "bg-red-100 text-red-700 border-red-200",
};

const feeTypeLabels: Record<FeeType, string> = {
  MAINTENANCE: "Maintenance",
  RENT: "Rent",
  UTILITIES: "Utilities",
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
    <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Financial & Receipts Hub
        </h3>
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search receipts..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent w-64"
            />
          </div>
          {/* Generate Receipt Button */}
          <button
            onClick={onGenerateReceipt}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#00A996] hover:bg-[#008c7a] text-white rounded-lg font-medium transition-colors duration-200"
          >
            Generate Receipt
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Receipt ID
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Resident Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Unit
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Fee Type
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Amount
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Issue Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Complete Date
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredReceipts.map((receipt) => (
              <tr key={receipt.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                  {receipt.receiptId}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {receipt.residentName}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">{receipt.unit}</td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {feeTypeLabels[receipt.feeType]}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                  EGP {receipt.amount.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {new Date(receipt.issueDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {receipt.completeDate
                    ? new Date(receipt.completeDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "-"}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusColors[receipt.status]}`}
                  >
                    {receipt.status.charAt(0) + receipt.status.slice(1).toLowerCase()}
                  </span>
                </td>
              </tr>
            ))}
            {filteredReceipts.length === 0 && (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500">
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
