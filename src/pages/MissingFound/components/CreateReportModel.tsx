import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Phone, UploadCloud, X, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import type { Report, ReportCategory, ReportType } from "../types";
import { fetchResidentsOptions } from "../api/missingFoundApi";

interface ResidentOption {
  residentId: string;
  fullName: string;
  phoneNumber: string;
  unitNumber: string;
  buildingName: string;
  unitLabel: string;
  displayLabel: string;
}

interface CreateReportModalProps {
  onClose: () => void;
  onSubmit: (
    report: Omit<Report, "id">,
    extra: { residentId: string }
  ) => void | Promise<void>;
  initial?: Report | null;
  submitting?: boolean;
  hasReporterId?: boolean;
}

const labelClass = "block text-[13px] font-semibold text-gray-700 mb-1.5";
const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 outline-none bg-white focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/15 transition-all placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed";

export default function CreateReportModal({
  onClose,
  onSubmit,
  initial,
  submitting = false,
  // hasReporterId مش بنستخدمها دلوقتي — الـ residentId اختياري دائماً
  // والـ backend هو اللي بيقرر يقبل reporterId/residentId.
}: CreateReportModalProps) {
  const isEdit = Boolean(initial);
  const bodyRef = useRef<HTMLDivElement>(null);

  /* ── Form state ── */
  const [residentId, setResidentId] = useState<string>("");
  const [type, setType] = useState<ReportType>(initial?.type ?? "Missing");
  const [category, setCategory] = useState<ReportCategory | "">(
    initial?.category ?? ""
  );
  const [title, setTitle] = useState(initial?.title ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [contact, setContact] = useState(initial?.contact ?? "");
  const [fullDesc, setFullDesc] = useState(initial?.fullDesc ?? "");
  const [photo, setPhoto] = useState<string | null>(initial?.photo ?? null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ── Residents fetching ── */
  const [residents, setResidents] = useState<ResidentOption[]>([]);
  const [residentsLoading, setResidentsLoading] = useState(false);
  const [residentsError, setResidentsError] = useState<string | null>(null);

  /* ── Custom dropdown state ── */
  const [residentMenuOpen, setResidentMenuOpen] = useState(false);
  const residentDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!residentMenuOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        residentDropdownRef.current &&
        !residentDropdownRef.current.contains(e.target as Node)
      ) {
        setResidentMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [residentMenuOpen]);

  useEffect(() => {
    let alive = true;
    setResidentsLoading(true);
    setResidentsError(null);
    fetchResidentsOptions({ size: 100 })
      .then((data) => {
        if (!alive) return;
        setResidents(data.residents ?? []);
      })
      .catch((err) => {
        if (!alive) return;
        setResidentsError(
          err instanceof Error ? err.message : "Failed to load residents"
        );
      })
      .finally(() => {
        if (alive) setResidentsLoading(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  /* ── Auto-fill contact when resident is selected ── */
  const selectedResident = useMemo(
    () => residents.find((r) => r.residentId === residentId),
    [residents, residentId]
  );
  useEffect(() => {
    if (selectedResident && !contact) {
      setContact(selectedResident.phoneNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedResident]);

  /* ── Validation ── */
  const validate = () => {
    const e: Record<string, string> = {};
    if (!category) e.category = "Category is required";
    if (!title.trim()) e.title = "Title is required";
    if (!location.trim()) e.location = "Location is required";
    if (!contact.trim()) e.contact = "Contact is required";
    if (!fullDesc.trim()) e.fullDesc = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (submitting) return;
    if (!validate()) {
      toast.error("Please fill in all required fields");
      bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    await onSubmit(
      {
        type,
        category: category as ReportCategory,
        title: title.trim(),
        shortDesc: fullDesc.trim().slice(0, 30),
        location: location.trim(),
        reportedBy:
          initial?.reportedBy ?? selectedResident?.fullName ?? "Resident",
        unit: initial?.unit ?? selectedResident?.unitLabel ?? "",
        status: initial?.status ?? "Open",
        date:
          initial?.date ??
          new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        contact: contact.trim(),
        fullDesc: fullDesc.trim(),
        photo,
      },
      { residentId }
    );
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[560px] max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
          <h2 className="text-[17px] font-bold text-gray-900">
            {isEdit ? "Edit Report" : "Create New Report"}
          </h2>
          <button
            onClick={onClose}
            disabled={submitting}
            className="w-8 h-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── Body ── */}
        <div ref={bodyRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Report On Behalf Of — Custom dropdown */}
          <div ref={residentDropdownRef}>
            <label className={labelClass}>
              Report On Behalf Of (Select Resident)
              <span className="text-red-500"> *</span>
            </label>
            <div className="relative">
              {/* Trigger */}
              <button
                type="button"
                disabled={submitting || residentsLoading}
                onClick={() => setResidentMenuOpen((s) => !s)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm rounded-xl border bg-white transition-all
                  ${errors.residentId ? "border-red-300" : "border-gray-200 hover:border-gray-300"}
                  ${residentMenuOpen ? "border-[#00A389] ring-2 ring-[#00A389]/15" : ""}
                  ${submitting || residentsLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <span className={selectedResident ? "text-gray-800" : "text-gray-400"}>
                  {residentsLoading
                    ? "Loading residents…"
                    : selectedResident
                    ? `${selectedResident.fullName} - ${selectedResident.unitLabel} (${selectedResident.phoneNumber})`
                    : "Choose resident..."}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 flex-shrink-0 ml-2 transition-transform ${
                    residentMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Options panel */}
              {residentMenuOpen && (
                <div className="absolute z-20 mt-1.5 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                  {/* Placeholder option */}
                  <button
                    type="button"
                    onClick={() => {
                      setResidentId("");
                      setResidentMenuOpen(false);
                    }}
                    className={`w-full text-left px-5 py-3 text-[15px] transition-colors ${
                      !residentId
                        ? "bg-blue-50 text-gray-700"
                        : "bg-white text-gray-700 hover:bg-blue-50"
                    }`}
                  >
                    Choose resident...
                  </button>

                  {/* Residents list */}
                  <div className="max-h-72 overflow-y-auto">
                    {residents.length === 0 && !residentsLoading && (
                      <div className="px-5 py-6 text-center text-xs text-gray-400">
                        {residentsError
                          ? "Couldn't load residents — you can submit without selecting one."
                          : "No residents available — submission will use your account."}
                      </div>
                    )}
                    {residents.map((r) => {
                      const isSelected = r.residentId === residentId;
                      return (
                        <button
                          key={r.residentId}
                          type="button"
                          onClick={() => {
                            setResidentId(r.residentId);
                            setResidentMenuOpen(false);
                          }}
                          className={`w-full text-left px-5 py-3 text-[15px] flex items-center justify-between gap-2 transition-colors ${
                            isSelected
                              ? "bg-blue-50 text-gray-900"
                              : "text-gray-700 hover:bg-blue-50"
                          }`}
                        >
                          <span className="truncate">
                            {r.fullName} - {r.unitLabel} ({r.phoneNumber})
                          </span>
                          {isSelected && (
                            <Check className="w-4 h-4 text-[#00A389] flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            {errors.residentId && (
              <p className="text-red-500 text-xs mt-1.5">{errors.residentId}</p>
            )}
            {residentsError && (
              <p className="text-red-500 text-xs mt-1.5">⚠ {residentsError}</p>
            )}
          </div>

          {/* Type of Report */}
          <div>
            <label className={labelClass}>
              Type of Report <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(["Missing", "Found"] as ReportType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  disabled={submitting}
                  className={`py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    type === t
                      ? "bg-[#00A389] text-white shadow-md shadow-[#00A389]/25"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  } disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Select Category */}
          <div>
            <label className={labelClass}>
              Select Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={category}
                disabled={submitting}
                onChange={(e) => setCategory(e.target.value as ReportCategory)}
                className={`${inputClass} appearance-none pr-10 ${
                  errors.category ? "border-red-300 focus:ring-red-200" : ""
                } ${!category ? "text-gray-400" : "text-gray-800"}`}
              >
                <option value="" disabled>
                  Choose one of the following
                </option>
                <option value="Item">Item</option>
                <option value="Pet">Pet</option>
                <option value="Person">Person</option>
                <option value="Vehicle">Vehicle</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {errors.category && (
              <p className="text-red-500 text-xs mt-1.5">{errors.category}</p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className={labelClass}>
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              disabled={submitting}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description"
              className={`${inputClass} ${
                errors.title ? "border-red-300 focus:ring-red-200" : ""
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>
            )}
          </div>

          {/* Detailed Description */}
          <div>
            <label className={labelClass}>
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={fullDesc}
              disabled={submitting}
              onChange={(e) => setFullDesc(e.target.value)}
              rows={4}
              placeholder="Provide detailed information (color, size, distinguishing features)"
              className={`${inputClass} resize-none leading-relaxed ${
                errors.fullDesc ? "border-red-300 focus:ring-red-200" : ""
              }`}
            />
            {errors.fullDesc && (
              <p className="text-red-500 text-xs mt-1.5">{errors.fullDesc}</p>
            )}
          </div>

          {/* Last Seen Location */}
          <div>
            <label className={labelClass}>
              Last Seen Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={location}
                disabled={submitting}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where was it last seen?"
                className={`${inputClass} pl-10 ${
                  errors.location ? "border-red-300 focus:ring-red-200" : ""
                }`}
              />
            </div>
            {errors.location && (
              <p className="text-red-500 text-xs mt-1.5">{errors.location}</p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className={labelClass}>
              Contact Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="tel"
                value={contact}
                disabled={submitting}
                onChange={(e) => setContact(e.target.value)}
                placeholder="+20 123 456 7890"
                className={`${inputClass} pl-10 ${
                  errors.contact ? "border-red-300 focus:ring-red-200" : ""
                }`}
              />
            </div>
            {errors.contact && (
              <p className="text-red-500 text-xs mt-1.5">{errors.contact}</p>
            )}
          </div>

          {/* Add Photos */}
          <div>
            <label className={labelClass}>Add Photos (optional)</label>
            <label
              className={`flex flex-col items-center justify-center text-center border-2 border-dashed rounded-xl px-6 py-8 cursor-pointer transition-colors hover:border-[#00A389] hover:bg-[#00A389]/5 ${
                photo
                  ? "border-[#00A389]/40 bg-[#00A389]/5"
                  : "border-gray-200 bg-gray-50/40"
              } ${submitting ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {photo ? (
                <img
                  src={photo}
                  alt="preview"
                  className="w-32 h-24 object-cover rounded-lg shadow-sm"
                />
              ) : (
                <>
                  <UploadCloud className="w-8 h-8 text-[#00A389] mb-2" />
                  <span className="text-sm font-semibold text-[#00A389]">
                    Click to upload
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    SVG, PNG, JPG or GIF (max. 800x400px)
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                disabled={submitting}
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-[#00A389] hover:bg-[#008F77] active:scale-[0.99] text-white text-sm font-semibold shadow-md hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {submitting && (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {submitting
              ? isEdit
                ? "Saving..."
                : "Submitting..."
              : isEdit
              ? "Save Changes"
              : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
