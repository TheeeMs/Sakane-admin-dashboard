export type QRStatus = "Active" | "Used" | "Expired";
export type VisitorType = "Guest" | "Delivery" | "Service" | "Family";

export interface QRAccessCode {
  id: number;
  code: string;
  visitorName: string;
  visitorType: VisitorType;
  visitorIcon: string;
  visitorIconBg: string;
  hostResident: string;
  unit: string;
  created: string;
  validUntil: string;
  status: QRStatus;
}

export interface GateStatistics {
  totalGuests: number;
  totalDeliveries: number;
  activeQRCodes: number;
}
