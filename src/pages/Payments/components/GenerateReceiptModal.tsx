import { useState } from "react";
import { Modal, Input } from "@/components/shared";
import type { ReceiptType, FeeType, Resident } from "../types";

interface GenerateReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  residents: Resident[];
  onSubmit: (data: {
    receiptType: ReceiptType;
    selectedResidents: string[];
    feeType: FeeType;
    amount: number;
    dueDate: string;
    notes?: string;
  }) => void;
}

export function GenerateReceiptModal({
  isOpen,
  onClose,
  residents,
  onSubmit,
}: GenerateReceiptModalProps) {
  const [receiptType, setReceiptType] = useState<ReceiptType>("MULTIPLE");
  const [selectedResidents, setSelectedResidents] = useState<string[]>([]);
  const [feeType, setFeeType] = useState<FeeType>("MAINTENANCE");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleResidentToggle = (residentId: string) => {
    setSelectedResidents((prev) =>
      prev.includes(residentId)
        ? prev.filter((id) => id !== residentId)
        : [...prev, residentId]
    );
  };

  const handleSubmit = () => {
    if (selectedResidents.length === 0 || !amount || !dueDate) {
      return;
    }

    onSubmit({
      receiptType,
      selectedResidents,
      feeType,
      amount: parseFloat(amount),
      dueDate,
      notes: notes || undefined,
    });

    // Reset form
    setSelectedResidents([]);
    setAmount("");
    setDueDate("");
    setNotes("");
    onClose();
  };

  const isFormValid = selectedResidents.length > 0 && amount && dueDate;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate Payment Receipt"
      size="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="flex items-center gap-2 px-6 py-3 bg-[#00A996] hover:bg-[#008c7a] text-white rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate & Send
          </button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Subtitle */}
        <p className="text-gray-600 text-sm">
          Create a new payment receipt for a resident
        </p>

        {/* Receipt Type */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Receipt Type
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setReceiptType("SINGLE")}
              className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors ${
                receiptType === "SINGLE"
                  ? "border-[#00A996] bg-[#00A996] text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Single Resident
            </button>
            <button
              type="button"
              onClick={() => setReceiptType("MULTIPLE")}
              className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors ${
                receiptType === "MULTIPLE"
                  ? "border-[#00A996] bg-[#00A996] text-white"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Multiple Residents
            </button>
          </div>
        </div>

        {/* Select Residents */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Select Residents
          </label>
          <div className="border border-gray-300 rounded-xl max-h-48 overflow-y-auto">
            {residents.map((resident) => (
              <label
                key={resident.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <input
                  type="checkbox"
                  checked={selectedResidents.includes(resident.id)}
                  onChange={() => handleResidentToggle(resident.id)}
                  className="w-5 h-5 rounded border-gray-300 text-[#00A996] focus:ring-[#00A996]"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {resident.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Unit {resident.unit}, {resident.building}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Fee Type */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Fee Type
          </label>
          <div className="flex gap-3">
            {(["MAINTENANCE", "RENT", "UTILITIES"] as FeeType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFeeType(type)}
                className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-colors capitalize ${
                  feeType === type
                    ? "border-[#00A996] bg-[#00A996] text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {type.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Amount (EGP)
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A996] focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              EGP
            </span>
          </div>
        </div>

        {/* Due Date */}
        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
        />

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes or details about this receipt..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00A996] focus:border-transparent resize-none"
          />
        </div>
      </div>
    </Modal>
  );
}
