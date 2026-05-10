export type Tab =
  | "General"
  | "Payment"
  | "Notifications"
  | "Security"
  | "Appearance"
  | "System";



export interface FormData {
  compoundName: string;
  contactEmail: string;
  contactPhone: string;
  emergencyNumber: string;
  address: string;
  totalUnits: string;
  totalBuildings: string;
  timezone: string;
  officeHours: string;
  emergencyContact: string;
}


export const INITIAL_SECURITY_FORM = {
  twoFactorEnabled: false,
  passwordPolicy: {
    minEightChars: true,
    upperLowerCase: true,
    atLeastOneNumber: true,
    specialChars: true,
  },
  sessionTimeout: "30",
  maxLoginAttempts: "5",
};

