import { useState, useEffect } from "react";
import { X, Phone, Mail, MessageCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import {
  maintenanceApi,
  type MaintenanceCardDto,
  type TechnicianOptionDto,
  type MaintenancePriority,
} from "./data/maintenanceApi";

// ─── Shared type used by MaintenancePage too ──────────────────────────────────
export interface MaintenanceRequest {
  id: string;
  type: "Private" | "Public";
  requestId: string;
  priority: "High" | "Medium" | "Low";
  issue: string;
  location: string;
  dateTime: string;
  status: "Unassigned" | "Assigned" | "Completed" | "In Progress";
  residentName?: string;
  residentUnit?: string;
  residentInitials?: string;
  residentPhone?: string;
  residentEmail?: string;
  description?: string;
  photos?: number;
  timeline?: { label: string; time: string }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getApiError = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined;
    return d?.message ?? err.message;
  }
  return err instanceof Error ? err.message : "Something went wrong";
};

const toBackendPriority = (p: "High" | "Medium" | "Low"): MaintenancePriority =>
  p === "High" ? "HIGH" : p === "Medium" ? "MEDIUM" : "LOW";

const getInitials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

// ─── Priority button config ───────────────────────────────────────────────────
const PRIORITY_BTN = {
  High:   { active: "bg-[#fef2f2] border-[#fb2c36]", text: "text-[#c10007]" },
  Medium: { active: "bg-[#fef9c2] border-[#f0b100]", text: "text-[#a65f00]" },
  Low:    { active: "bg-[#dbeafe] border-[#2b7fff]",  text: "text-[#1447e6]" },
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  request: MaintenanceRequest;
  actorId: string;
  onClose: () => void;
  onUpdated: () => void;
}

const MaintenanceDetailPanel = ({ request, actorId, onClose, onUpdated }: Props) => {
  // Card data from API
  const [card, setCard] = useState<MaintenanceCardDto | null>(null);
  const [cardLoading, setCardLoading] = useState(true);
  const [cardError, setCardError] = useState<string | null>(null);

  // Technicians
  const [technicians, setTechnicians] = useState<TechnicianOptionDto[]>([]);
  const [techLoading, setTechLoading] = useState(true);

  // Panel state
  const [priority, setPriority] = useState<"High" | "Medium" | "Low">(request.priority);
  const [selectedTech, setSelectedTech] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // ─── Load card details ──────────────────────────────────────────────────
  useEffect(() => {
    setCardLoading(true);
    setCardError(null);
    setCard(null);
    setPriority(request.priority);
    setSelectedTech("");

    maintenanceApi
      .getCard(request.id)
      .then((res) => {
        setCard(res.data);
        // Pre-select existing technician if any
        if (res.data.assignedTechnician) {
          setSelectedTech(res.data.assignedTechnician.technicianId);
        }
      })
      .catch((err) => setCardError(getApiError(err)))
      .finally(() => setCardLoading(false));
  }, [request.id, request.priority]);

  // ─── Load technicians ────────────────────────────────────────────────────
  useEffect(() => {
    setTechLoading(true);
    maintenanceApi
      .listTechnicians(false)
      .then((res) => setTechnicians(res.data))
      .catch(() => {/* non-critical */})
      .finally(() => setTechLoading(false));
  }, []);

  // ─── Actions ─────────────────────────────────────────────────────────────
  const handleSetPriority = async (p: "High" | "Medium" | "Low") => {
    setPriority(p);
    setSaveError(null);
    try {
      await maintenanceApi.setPriority(request.id, toBackendPriority(p), actorId);
      setSaveSuccess("Priority updated");
      setTimeout(() => setSaveSuccess(null), 2500);
      onUpdated();
    } catch (err) {
      setSaveError(getApiError(err));
    }
  };

  const handleAssign = async () => {
    if (!selectedTech) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      await maintenanceApi.assignTechnician(request.id, {
        technicianId: selectedTech,
        actorId,
        assignmentNote: "Assigned from command center",
      });
      setSaveSuccess("Technician assigned successfully");
      setTimeout(() => setSaveSuccess(null), 2500);
      onUpdated();
    } catch (err) {
      setSaveError(getApiError(err));
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Derived display data ─────────────────────────────────────────────────
  const residentName = card?.resident.fullName ?? request.residentName ?? "—";
  const residentUnit = card?.resident.unitLabel ?? request.residentUnit ?? request.location;
  const residentPhone = card?.resident.phoneNumber ?? request.residentPhone ?? "—";
  const residentEmail = card?.resident.email ?? request.residentEmail ?? "—";
  const description = card?.description ?? request.description ?? "No description provided.";
  const initials = getInitials(residentName) || "??";
  const photos = card?.photoUrls ?? [];
  const timeline = card?.timeline ?? [];

  return (
    <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-5 border-b border-[#f3f4f6] flex-shrink-0">
        <h3 className="text-xl font-semibold text-[#2d3436] leading-tight pr-4">
          {request.issue}
        </h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all flex-shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Toast messages */}
      {(saveSuccess || saveError) && (
        <div className={cn(
          "mx-6 mt-3 px-4 py-2 rounded-xl text-sm font-medium flex-shrink-0",
          saveSuccess ? "bg-[#e0f2f1] text-[#00a996]" : "bg-red-50 text-red-600"
        )}>
          {saveSuccess ?? saveError}
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">

        {/* Loading skeleton */}
        {cardLoading && (
          <div className="space-y-3 animate-pulse">
            <div className="h-20 bg-gray-100 rounded-xl" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
            <div className="h-4 bg-gray-100 rounded w-1/2" />
          </div>
        )}

        {cardError && (
          <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-xl">{cardError}</p>
        )}

        {/* Resident Card */}
        {!cardLoading && (
          <div className="bg-[#f9fafb] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#00a996] to-[#008c7a] flex items-center justify-center flex-shrink-0">
                <span className="text-white text-base font-semibold">{initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#2d3436] text-base leading-tight">{residentName}</p>
                <p className="text-[#00a996] text-sm">{residentUnit}</p>
              </div>
              <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[#00a996] hover:bg-[#e0f2f1] transition-colors">
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#636e72]">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{residentPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#636e72]">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{residentEmail}</span>
              </div>
            </div>
          </div>
        )}

        {/* Set Priority */}
        <div className="pb-5 border-b border-[#f3f4f6]">
          <p className="text-base font-semibold text-[#2d3436] mb-3">Set Priority</p>
          <div className="flex gap-2">
            {(["High", "Medium", "Low"] as const).map((p) => {
              const cfg = PRIORITY_BTN[p];
              const isActive = priority === p;
              return (
                <button
                  key={p}
                  onClick={() => void handleSetPriority(p)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl border-2 text-base font-normal transition-all duration-150",
                    isActive ? `${cfg.active} ${cfg.text}` : "border-[#e5e7eb] text-[#636e72] hover:border-gray-300"
                  )}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Assign Technician */}
        <div className="pb-5 border-b border-[#f3f4f6]">
          <p className="text-base font-semibold text-[#2d3436] mb-3">Assign Technician</p>
          <div className="relative mb-3">
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              disabled={techLoading}
              className="w-full appearance-none border-2 border-[#e5e7eb] rounded-xl px-4 py-3 text-sm text-[#2d3436] bg-white outline-none focus:border-[#00a996] cursor-pointer transition-colors disabled:opacity-60"
            >
              <option value="">
                {techLoading ? "Loading technicians…" : "Select technician…"}
              </option>
              {technicians.map((t) => (
                <option key={t.technicianId} value={t.technicianId}>
                  {t.fullName}{!t.available ? " (busy)" : ""}
                </option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <button
            disabled={!selectedTech || isSaving}
            onClick={() => void handleAssign()}
            className={cn(
              "w-full py-3 rounded-xl text-base font-medium text-white transition-all flex items-center justify-center gap-2",
              selectedTech && !isSaving
                ? "bg-[#00a996] hover:bg-[#008c7a] cursor-pointer"
                : "bg-[#d1d5dc] cursor-not-allowed"
            )}
          >
            {isSaving && <RefreshCw className="w-4 h-4 animate-spin" />}
            Assign Technician
          </button>
        </div>

        {/* Description + Photos */}
        <div className="pb-5 border-b border-[#f3f4f6]">
          <p className="text-base font-semibold text-[#2d3436] mb-2">Description</p>
          <p className="text-sm text-[#636e72] leading-relaxed">{description}</p>

          {photos.length > 0 && (
            <>
              <p className="text-base font-semibold text-[#2d3436] mt-4 mb-3">
                Photos ({photos.length})
              </p>
              <div className="flex gap-2">
                {photos.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Photo ${i + 1}`}
                    className="flex-1 aspect-square rounded-xl object-cover bg-[#e5e7eb]"
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Timeline */}
        {timeline.length > 0 && (
          <div className="pb-4">
            <p className="text-base font-semibold text-[#2d3436] mb-4">Timeline</p>
            <div className="flex flex-col gap-4">
              {timeline.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#00a996] flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#2d3436]">{item.label}</p>
                    <p className="text-xs text-[#636e72]">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceDetailPanel;
