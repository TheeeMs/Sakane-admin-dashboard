export type ReceiptStatus = "PAID" | "PENDING" | "OVERDUE";

export type FeeType = "MAINTENANCE" | "RENT" | "UTILITIES";

export type ReceiptType = "SINGLE" | "MULTIPLE";

export interface Receipt {
  id: string;
  receiptId: string;
  residentName: string;
  unit: string;
  feeType: FeeType;
  amount: number;
  issueDate: string;
  completeDate?: string;
  status: ReceiptStatus;
}

export interface ReceiptStatistics {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  outstandingDebt: number;
  collectedThisMonth: number;
}

export interface Resident {
  id: string;
  name: string;
  unit: string;
  building: string;
  selected?: boolean;
}

export interface GenerateReceiptFormData {
  receiptType: ReceiptType;
  selectedResidents: string[];
  feeType: FeeType;
  amount: number;
  dueDate: string;
  notes?: string;
}
