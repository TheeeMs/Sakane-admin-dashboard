import type { Receipt, ReceiptStatistics, Resident } from "../types";

export const mockReceipts: Receipt[] = [
  {
    id: "1",
    receiptId: "REC-001",
    residentName: "Layla Mohamed Hassan",
    unit: "201",
    feeType: "MAINTENANCE",
    amount: 5000,
    issueDate: "2024-01-15",
    completeDate: "2024-01-20",
    status: "PAID",
  },
  {
    id: "2",
    receiptId: "REC-002",
    residentName: "Ahmed Hassan Ali",
    unit: "305",
    feeType: "RENT",
    amount: 15000,
    issueDate: "2024-01-18",
    completeDate: "2024-01-25",
    status: "PAID",
  },
  {
    id: "3",
    receiptId: "REC-003",
    residentName: "Aisha Ahmed El-Sayed",
    unit: "410",
    feeType: "UTILITIES",
    amount: 3500,
    issueDate: "2024-01-20",
    status: "PENDING",
  },
  {
    id: "4",
    receiptId: "REC-004",
    residentName: "Mohamed Salah",
    unit: "102",
    feeType: "MAINTENANCE",
    amount: 2500,
    issueDate: "2024-01-10",
    status: "OVERDUE",
  },
  {
    id: "5",
    receiptId: "REC-005",
    residentName: "Fatima Ali",
    unit: "205",
    feeType: "RENT",
    amount: 12000,
    issueDate: "2024-01-22",
    completeDate: "2024-01-28",
    status: "PAID",
  },
];

export const mockStatistics: ReceiptStatistics = {
  totalPaid: 5,
  totalPending: 2,
  totalOverdue: 3,
  outstandingDebt: 24000,
  collectedThisMonth: 19850,
};

export const mockResidents: Resident[] = [
  {
    id: "1",
    name: "Layla Mohamed Hassan",
    unit: "201",
    building: "Building B",
    selected: false,
  },
  {
    id: "2",
    name: "Ahmed Hassan Ali",
    unit: "305",
    building: "Building B",
    selected: false,
  },
  {
    id: "3",
    name: "Aisha Ahmed El-Sayed",
    unit: "410",
    building: "Building C",
    selected: false,
  },
  {
    id: "4",
    name: "Mohamed Salah",
    unit: "102",
    building: "Building A",
    selected: false,
  },
  {
    id: "5",
    name: "Fatima Ali",
    unit: "205",
    building: "Building A",
    selected: false,
  },
];
