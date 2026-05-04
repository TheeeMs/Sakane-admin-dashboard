import { useState } from "react";
import { AlertTriangle, DollarSign } from "lucide-react";
import {
  ReceiptStatusOverview,
  FinancialStatCard,
  ReceiptsTable,
  GenerateReceiptModal,
} from "./components";
import { mockReceipts, mockStatistics, mockResidents } from "./data/receiptsData";
import type { GenerateReceiptFormData } from "./types";

export function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGenerateReceipt = () => {
    setIsModalOpen(true);
  };

  const handleSubmitReceipt = (data: GenerateReceiptFormData) => {
    console.log("Generating receipt:", data);
    // Handle API call here
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Financial & Receipts Hub
        </h1>
        <p className="text-gray-600 mt-1">
          Manage payment receipts and track financial status
        </p>
      </div>

      {/* Top Section: Overview and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Receipt Status Overview */}
        <div className="lg:col-span-1">
          <ReceiptStatusOverview statistics={mockStatistics} />
        </div>

        {/* Financial Stat Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <FinancialStatCard
            label="Outstanding Debt"
            value={`EGP ${mockStatistics.outstandingDebt.toLocaleString()}`}
            icon={AlertTriangle}
            statusText="Requires attention"
            statusColor="text-red-600"
            count={mockStatistics.totalOverdue}
            countLabel="overdue payments"
            iconBg="bg-red-100"
            iconColor="text-red-600"
            gradient="bg-gradient-to-br from-red-50 to-transparent"
            borderColor="border-red-200"
          />
          <FinancialStatCard
            label="Collected This Month"
            subtitle="February 2024"
            value={`EGP ${mockStatistics.collectedThisMonth.toLocaleString()}`}
            icon={DollarSign}
            count={mockStatistics.totalPaid}
            countLabel="successful payments"
            iconBg="bg-green-100"
            iconColor="text-green-600"
            gradient="bg-gradient-to-br from-green-50 to-transparent"
            borderColor="border-green-200"
          />
        </div>
      </div>

      {/* Receipts Table */}
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
