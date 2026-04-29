export type QRStatus = "Active" | "Used" | "Expired" | "Revoked";
export type VisitorType = "Guest" | "Delivery" | "Service" | "Family" | "Other";

export interface QRAccessCode {
  id: string;
  code: string;
  visitorName: string;
  visitorType: VisitorType;
  visitorIcon: string;
  visitorIconBg: string;
  hostResident: string;
  hostResidentId?: string;
  unit: string;
  building?: string;
  createdAtIso?: string;
  created: string;
  validUntil: string;
  status: QRStatus;
}

export interface ResidentInfo {
  id: string;
  name: string;
  initials: string;
  unit: string;
  building: string;
  phone: string;
  qrCodes: QRAccessCode[];
}

export interface GateStatistics {
  totalGuests: number;
  totalDeliveries: number;
  activeQRCodes: number;
}
