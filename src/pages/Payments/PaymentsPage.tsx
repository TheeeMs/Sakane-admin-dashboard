import { useState } from "react";
import {
  ReceiptStatusOverview,
  FinancialStatCards,
  ReceiptsTable,
  GenerateReceiptModal,
} from "./components";
import {
  mockReceipts,
  mockStatistics,
  mockResidents,
} from "./data/receiptsData";
import type { GenerateReceiptFormData } from "./types";

export function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateReceipt = () => {
    setIsModalOpen(true);
  };

  const handleSubmitReceipt = (data: GenerateReceiptFormData) => {
    console.log("Generating receipt:", data);
  };

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-gray-800">Financial & Receipts Hub</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Manage payment receipts and track financial status
        </p>
      </div>

      {/* Top 3-column cards row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left — Receipt Status Overview */}
        <ReceiptStatusOverview statistics={mockStatistics} />

        {/* Right 2 — Financial Stat Cards (outstanding + collected) */}
        <div className="lg:col-span-2">
          <FinancialStatCards statistics={mockStatistics} />
        </div>
      </div>

      {/* Receipts table */}
      <ReceiptsTable
        receipts={mockReceipts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onGenerateReceipt={handleGenerateReceipt}
      />

      {/* Generate Receipt Modal */}
      <GenerateReceiptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        residents={mockResidents}
        onSubmit={handleSubmitReceipt}
      />
    </div>
  );
}
