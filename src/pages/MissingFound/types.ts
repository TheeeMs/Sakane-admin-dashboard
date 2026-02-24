export type ReportType = "Missing" | "Found";
export type ReportStatus = "Open" | "Matched" | "Resolved" | "Closed";
export type ReportCategory = "Item" | "Pet" | "Person" | "Vehicle";

export interface Report {
  id: number;
  type: ReportType;
  category: ReportCategory;
  title: string;
  shortDesc: string;
  location: string;
  reportedBy: string;
  unit: string;
  status: ReportStatus;
  date: string;
  contact: string;
  fullDesc: string;
  photo: string | null;
}