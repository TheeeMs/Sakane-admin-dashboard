import { useEffect, useMemo, useState } from "react";
import { Users, Package, QrCode } from "lucide-react";
import { StatCard } from "./components/StatCard";
import { QRTable } from "./components/QRTable";
import { QRDetailsDrawer } from "./components/QRDetailsDrawer";
import { gateApi, type AdminQrAccessItemDto } from "./data/gateApi";
import type { QRAccessCode, ResidentInfo, VisitorType, QRStatus } from "./types";

const mapVisitorType = (rawType: string): VisitorType => {
  const normalized = rawType?.toUpperCase() ?? "OTHER";
  const map: Record<string, VisitorType> = {
    GUEST: "Guest",
    DELIVERY: "Delivery",
    SERVICE: "Service",
    FAMILY: "Family",
    OTHER: "Other",
  };
  return map[normalized] ?? "Other";
};

const mapStatus = (rawStatus: string): QRStatus => {
  const normalized = rawStatus?.toUpperCase() ?? "EXPIRED";
  const map: Record<string, QRStatus> = {
    ACTIVE: "Active",
    USED: "Used",
    EXPIRED: "Expired",
    REVOKED: "Revoked",
  };
  return map[normalized] ?? "Expired";
};

const VISITOR_META: Record<VisitorType, { icon: string; iconBg: string }> = {
  Guest: { icon: "🧑", iconBg: "#f3e8ff" },
  Delivery: { icon: "📦", iconBg: "#ffedd5" },
  Service: { icon: "🔧", iconBg: "#dbeafe" },
  Family: { icon: "👨‍👩‍👧", iconBg: "#f3e8ff" },
  Other: { icon: "👤", iconBg: "#f1f5f9" },
};

const formatDateTime = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const isToday = (isoDate: string): boolean => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

const getInitials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "NA";

const mapDirectoryItem = (item: AdminQrAccessItemDto): QRAccessCode => {
  const visitorType = mapVisitorType(item.visitorType);
  const visitorMeta = VISITOR_META[visitorType];

  return {
    id: item.accessCodeId,
    code: item.qrCode,
    visitorName: item.visitorName,
    visitorType,
    visitorIcon: visitorMeta.icon,
    visitorIconBg: visitorMeta.iconBg,
    hostResident: item.hostResidentName,
    hostResidentId: item.hostResidentId,
    unit: item.unitNumber ?? "N/A",
    createdAtIso: item.createdAt,
    created: formatDateTime(item.createdAt),
    validUntil: formatDateTime(item.validUntil),
    status: mapStatus(item.status),
  };
};

const GateAccessPage = () => {
  const [codes, setCodes] = useState<QRAccessCode[]>([]);
  const [availableTabs, setAvailableTabs] = useState<Array<"All" | VisitorType>>([
    "All",
    "Guest",
    "Delivery",
    "Service",
    "Family",
    "Other",
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedResident, setSelectedResident] = useState<ResidentInfo | null>(
    null,
  );
  const [selectedResidentId, setSelectedResidentId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [deletingCodeId, setDeletingCodeId] = useState<string | null>(null);

  const loadDirectory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [codesResponse, typesResponse] = await Promise.all([
        gateApi.listCodes({ tab: "ALL", page: 0, size: 100 }),
        gateApi.listTypes(),
      ]);

      const directoryItems = codesResponse.data.items;
      setCodes(directoryItems.map(mapDirectoryItem));

      const parsedTabs = typesResponse.data
        .map((type) => mapVisitorType(type))
        .filter((value, index, array) => array.indexOf(value) === index);

      setAvailableTabs(["All", ...parsedTabs]);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load access codes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadDirectory();
  }, []);

  const totalGuests = useMemo(
    () => codes.filter((item) => item.createdAtIso && isToday(item.createdAtIso)).length,
    [codes],
  );

  const totalDeliveries = useMemo(
    () => codes.filter((item) => item.visitorType === "Delivery").length,
    [codes],
  );

  const activeQRCodes = useMemo(
    () => codes.filter((item) => item.status === "Active").length,
    [codes],
  );

  const loadResidentCodes = async (residentId: string) => {
    const response = await gateApi.listResidentCodes(residentId, {
      tab: "ALL",
      page: 0,
      size: 100,
    });

    const resident = response.data.resident;
    const mappedCodes: QRAccessCode[] = response.data.codes.map((item) => {
      const visitorType = mapVisitorType(item.visitorType);
      const visitorMeta = VISITOR_META[visitorType];
      return {
        id: item.accessCodeId,
        code: item.qrCode,
        visitorName: item.visitorName,
        visitorType,
        visitorIcon: visitorMeta.icon,
        visitorIconBg: visitorMeta.iconBg,
        hostResident: resident.fullName,
        hostResidentId: resident.residentId,
        unit: resident.unitNumber ?? "N/A",
        building: resident.buildingName ?? "N/A",
        createdAtIso: item.createdAt,
        created: formatDateTime(item.createdAt),
        validUntil: formatDateTime(item.validUntil),
        status: mapStatus(item.status),
      };
    });

    setSelectedResident({
      id: resident.residentId,
      name: resident.fullName,
      initials: resident.initials || getInitials(resident.fullName),
      unit: resident.unitNumber ?? "N/A",
      building: resident.buildingName ?? "N/A",
      phone: resident.phoneNumber ?? "N/A",
      qrCodes: mappedCodes,
    });
  };

  const handleRowClick = (code: QRAccessCode) => {
    if (code.hostResidentId) {
      setSelectedResidentId(code.hostResidentId);
      setSelectedResident({
        id: code.hostResidentId,
        name: code.hostResident,
        initials: getInitials(code.hostResident),
        unit: code.unit,
        building: code.building ?? "N/A",
        phone: "Loading...",
        qrCodes: [code],
      });
      setIsDrawerOpen(true);
      void loadResidentCodes(code.hostResidentId);
    }
  };

  const handleDownloadCode = async (codeId: string) => {
    const response = await gateApi.downloadCode(codeId);
    const blob = new Blob([response.data], { type: "text/plain" });
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = `qr-code-${codeId}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(objectUrl);
  };

  const handleDeleteCode = async (codeId: string) => {
    setDeletingCodeId(codeId);
    try {
      await gateApi.deleteCode(codeId);
      await loadDirectory();
      if (selectedResidentId) {
        await loadResidentCodes(selectedResidentId);
      }
    } finally {
      setDeletingCodeId(null);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedResidentId(null);
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

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">
          Loading QR access data...
        </div>
      )}

      {/* QR Access Codes Table */}
      <QRTable
        data={codes}
        availableTabs={availableTabs}
        onRowClick={handleRowClick}
      />

      {/* QR Details Drawer */}
      <QRDetailsDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        resident={selectedResident}
        deletingCodeId={deletingCodeId}
        onDownloadCode={(codeId) => void handleDownloadCode(codeId)}
        onDeleteCode={(codeId) => void handleDeleteCode(codeId)}
      />
    </div>
  );
};

export default GateAccessPage;
