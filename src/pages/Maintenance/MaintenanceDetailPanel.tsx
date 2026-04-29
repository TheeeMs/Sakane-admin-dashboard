import { useState } from "react";
import { X, Phone, Mail, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Priority = "High" | "Medium" | "Low";
type Status = "Unassigned" | "Assigned" | "Completed" | "In Progress";

export interface MaintenanceRequest {
  id: number;
  type: "Private" | "Public";
  requestId: string;
  priority: Priority;
  issue: string;
  location: string;
  dateTime: string;
  status: Status;
  // detail-panel extras
  residentName?: string;
  residentInitials?: string;
  residentUnit?: string;
  residentPhone?: string;
  residentEmail?: string;
  description?: string;
  photos?: number;
  timeline?: { label: string; time: string }[];
}

const TECHNICIANS = [
  "Mohamed Ahmed",
  "Sara El-Gendy",
  "Omar Youssef",
  "Khaled Ibrahim",
];

const PRIORITY_BTN: Record<
  Priority,
  { active: string; activeText: string }
> = {
  High: {
    active: "bg-[#fef2f2] border-[#fb2c36]",
    activeText: "text-[#c10007]",
  },
  Medium: {
    active: "bg-[#fef9c2] border-[#f0b100]",
    activeText: "text-[#a65f00]",
  },
  Low: {
    active: "bg-[#dbeafe] border-[#2b7fff]",
    activeText: "text-[#1447e6]",
  },
};

interface Props {
  request: MaintenanceRequest;
  onClose: () => void;
}

const MaintenanceDetailPanel = ({ request, onClose }: Props) => {
  const [priority, setPriority] = useState<Priority>(request.priority);
  const [technician, setTechnician] = useState("");

  const initials = request.residentInitials ?? "AA";
  const name = request.residentName ?? "Ahmed Ali";
  const unit = request.residentUnit ?? request.location;
  const phone = request.residentPhone ?? "+20 123 456 7890";
  const email = request.residentEmail ?? "ahmed.ali@sakane.com";
  const description =
    request.description ??
    "Water is leaking under the sink, started 2 hours ago. The leak is getting worse and there is water pooling on the floor.";
  const photos = request.photos ?? 3;
  const timeline = request.timeline ?? [
    { label: "Request Submitted", time: request.dateTime },
    { label: "Admin Viewed", time: "10:05 AM" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] flex flex-col overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-start justify-between p-6 pb-5 flex-shrink-0">
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

      <div className="flex flex-col gap-0 overflow-y-auto flex-1 px-6">
        {/* Resident Card */}
        <div className="bg-[#f9fafb] rounded-xl p-4 mb-5 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-[#00a996] to-[#008c7a] flex items-center justify-center flex-shrink-0">
              <span className="text-white text-base font-semibold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#2d3436] text-base leading-tight">{name}</p>
              <p className="text-[#00a996] text-sm">{unit}</p>
            </div>
            <button className="w-8 h-8 rounded-xl flex items-center justify-center text-[#00a996] hover:bg-[#e0f2f1] transition-colors flex-shrink-0">
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-[#636e72]">
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#636e72]">
              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{email}</span>
            </div>
          </div>
        </div>

        {/* Set Priority */}
        <div className="pb-5 mb-5 border-b border-[#f3f4f6] flex-shrink-0">
          <p className="text-base font-semibold text-[#2d3436] mb-3">Set Priority</p>
          <div className="flex gap-2">
            {(["High", "Medium", "Low"] as Priority[]).map((p) => {
              const cfg = PRIORITY_BTN[p];
              const isActive = priority === p;
              return (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl border-2 text-base font-normal transition-all duration-150",
                    isActive
                      ? `${cfg.active} ${cfg.activeText}`
                      : "border-[#e5e7eb] text-[#636e72] hover:border-gray-300"
                  )}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Assign Technician */}
        <div className="pb-5 mb-5 border-b border-[#f3f4f6] flex-shrink-0">
          <p className="text-base font-semibold text-[#2d3436] mb-3">Assign Technician</p>
          <div className="relative mb-3">
            <select
              value={technician}
              onChange={(e) => setTechnician(e.target.value)}
              className="w-full appearance-none border-2 border-[#e5e7eb] rounded-xl px-4 py-3 text-sm text-[#2d3436] bg-white outline-none focus:border-[#00a996] cursor-pointer transition-colors"
            >
              <option value="">Select technician…</option>
              {TECHNICIANS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </div>
          <button
            disabled={!technician}
            className={cn(
              "w-full py-3 rounded-xl text-base font-medium text-white transition-all",
              technician
                ? "bg-[#00a996] hover:bg-[#008c7a] cursor-pointer"
                : "bg-[#d1d5dc] cursor-not-allowed"
            )}
          >
            Assign Technician
          </button>
        </div>

        {/* Description */}
        <div className="pb-5 mb-5 border-b border-[#f3f4f6] flex-shrink-0">
          <p className="text-base font-semibold text-[#2d3436] mb-2">Description</p>
          <p className="text-sm text-[#636e72] leading-relaxed">{description}</p>

          {/* Photos */}
          <p className="text-base font-semibold text-[#2d3436] mt-4 mb-3">
            Photos ({photos})
          </p>
          <div className="flex gap-2">
            {Array.from({ length: photos }).map((_, i) => (
              <div
                key={i}
                className="flex-1 aspect-square rounded-xl bg-[#e5e7eb] flex items-center justify-center text-[#99a1af] text-xs"
              >
                📷 {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="pb-6 flex-shrink-0">
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
      </div>
    </div>
  );
};

export default MaintenanceDetailPanel;
