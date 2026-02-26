import { useState } from "react";
import { Users, Package, QrCode } from "lucide-react";
import { StatCard } from "./components/StatCard";
import { QRTable } from "./components/QRTable";
import { QRDetailsDrawer } from "./components/QRDetailsDrawer";
import { qrAccessData, getResidentInfo } from "./data/gateData";
import type { QRAccessCode, ResidentInfo } from "./types";

const GateAccessPage = () => {
  const [selectedResident, setSelectedResident] =
    useState<ResidentInfo | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calculate statistics from data
  const totalGuests = qrAccessData.filter(
    (item) => item.visitorType === "Guest" || item.visitorType === "Family",
  ).length;

  const totalDeliveries = qrAccessData.filter(
    (item) => item.visitorType === "Delivery",
  ).length;

  const activeQRCodes = qrAccessData.filter(
    (item) => item.status === "Active",
  ).length;

  const handleRowClick = (code: QRAccessCode) => {
    if (code.hostResidentId) {
      const resident = getResidentInfo(code.hostResidentId);
      if (resident) {
        setSelectedResident(resident);
        setIsDrawerOpen(true);
      }
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Delay clearing selected resident until animation finishes
    setTimeout(() => setSelectedResident(null), 300);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          icon={Users}
          iconBg="#00c950"
          iconColor="#00a63e"
          label="Total Guests"
          sublabel="Today's visitors"
          value={totalGuests}
          gradient="from-green-50 to-white"
          borderColor="border-green-100"
        />
        <StatCard
          icon={Package}
          iconBg="#ff6900"
          iconColor="#f54900"
          label="Total Deliveries"
          sublabel="Package deliveries"
          value={totalDeliveries}
          gradient="from-orange-50 to-white"
          borderColor="border-orange-100"
        />
        <StatCard
          icon={QrCode}
          iconBg="#00a996"
          iconColor="#008c7a"
          label="Active QR Codes"
          sublabel="Currently valid"
          value={activeQRCodes}
          gradient="from-teal-50 to-white"
          borderColor="border-teal-200/50"
        />
      </div>

      {/* QR Access Codes Table */}
      <QRTable data={qrAccessData} onRowClick={handleRowClick} />

      {/* QR Details Drawer */}
      <QRDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        resident={selectedResident}
      />
    </div>
  );
};

export default GateAccessPage;
