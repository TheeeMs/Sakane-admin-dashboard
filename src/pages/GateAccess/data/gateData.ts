import type { QRAccessCode, ResidentInfo } from "../types";

export const qrAccessData: QRAccessCode[] = [
  {
    id: 1,
    code: "QR2024001A2034",
    visitorName: "John Smith",
    visitorType: "Guest",
    visitorIcon: "🧑",
    visitorIconBg: "#f3e8ff",
    hostResident: "Mohamed Ahmed Ali",
    hostResidentId: "resident-1",
    unit: "Unit 205",
    building: "Building A",
    created: "2024-02-12 09:30 AM",
    validUntil: "2024-02-12 11:59 PM",
    status: "Active",
  },
  {
    id: 2,
    code: "QR2024028B571",
    visitorName: "DHL Express",
    visitorType: "Delivery",
    visitorIcon: "📦",
    visitorIconBg: "#ffedd5",
    hostResident: "Fatima Hassan Mahmoud",
    hostResidentId: "resident-2",
    unit: "Unit 310",
    building: "Building B",
    created: "2024-02-12 08:45 AM",
    validUntil: "2024-02-12 12:00 PM",
    status: "Used",
  },
  {
    id: 3,
    code: "QR2024013C2304",
    visitorName: "AC Repair Technician",
    visitorType: "Service",
    visitorIcon: "🔧",
    visitorIconBg: "#dbeafe",
    hostResident: "Omar Youssef Ibrahim",
    hostResidentId: "resident-3",
    unit: "Unit 102",
    building: "Building C",
    created: "2024-02-11 02:00 PM",
    validUntil: "2024-02-11 10:00 PM",
    status: "Expired",
  },
  {
    id: 4,
    code: "QR2024898B8982",
    visitorName: "Sarah Johnson",
    visitorType: "Guest",
    visitorIcon: "👤",
    visitorIconBg: "#f3e8ff",
    hostResident: "Mohamed Ahmed Ali",
    hostResidentId: "resident-1",
    unit: "Unit 205",
    building: "Building A",
    created: "2024-02-12 10:15 AM",
    validUntil: "2024-02-12 11:59 PM",
    status: "Active",
  },
  {
    id: 5,
    code: "QR20244065E5466",
    visitorName: "Sarah's Parents",
    visitorType: "Family",
    visitorIcon: "👨‍👩‍👧",
    visitorIconBg: "#f3e8ff",
    hostResident: "Sarah Al-Zahrani",
    hostResidentId: "resident-4",
    unit: "Unit 102",
    building: "Building A",
    created: "2024-02-12 03:00 PM",
    validUntil: "2024-02-12 11:59 PM",
    status: "Used",
  },
  {
    id: 6,
    code: "QR20244968F7898",
    visitorName: "Amazon Delivery",
    visitorType: "Delivery",
    visitorIcon: "📦",
    visitorIconBg: "#ffedd5",
    hostResident: "Mohamed Ahmed Ali",
    hostResidentId: "resident-1",
    unit: "Unit 205",
    building: "Building A",
    created: "2024-02-12 07:30 AM",
    validUntil: "2024-02-12 02:00 PM",
    status: "Used",
  },
  {
    id: 7,
    code: "QR2024496T02194",
    visitorName: "Ahmed Hassan",
    visitorType: "Guest",
    visitorIcon: "🧑",
    visitorIconBg: "#f3e8ff",
    hostResident: "Khaled Rehman",
    hostResidentId: "resident-5",
    unit: "Unit 405",
    building: "Building C",
    created: "2024-02-12 11:00 AM",
    validUntil: "2024-02-12 11:59 PM",
    status: "Active",
  },
];

// Get resident info with their QR codes
export const getResidentInfo = (residentId: string): ResidentInfo | null => {
  const residentCodes = qrAccessData.filter(
    (code) => code.hostResidentId === residentId,
  );

  if (residentCodes.length === 0) return null;

  const firstCode = residentCodes[0];
  const nameParts = firstCode.hostResident.split(" ");
  const initials = nameParts
    .slice(0, 2)
    .map((n) => n[0])
    .join("");

  return {
    id: residentId,
    name: firstCode.hostResident,
    initials: initials.toUpperCase(),
    unit: firstCode.unit,
    building: firstCode.building || "Building A",
    phone: "+20 100 123 4567", // Mock phone number
    qrCodes: residentCodes,
  };
};
