import { useRef, useState } from "react";
import { Image as ImageIcon, Palette, Plus, Upload, X } from "lucide-react";
import type { AnnouncementPriority } from "../../data/communicationsApi";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: AnnouncementFormData) => void;
  isSubmitting?: boolean;
}

export type AnnouncementFormData = {
  title: string;
  content: string;
  priority: AnnouncementPriority;
  expiresAt?: string | null;
  /** Visual customization captured by the modal. */
  bgType: "image" | "color";
  bgColor?: string | null;
  /** Data URL string for the uploaded cover image (read in the browser). */
  image?: string | null;
};

type BackgroundType = "image" | "color";

const COLOR_PALETTE = [
  "#00A389",
  "#3b82f6",
  "#8b5cf6",
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#f97316",
  "#14b8a6",
  "#1e3a8a",
  "#94a3b8",
];

const labelClass = "block text-[13px] font-semibold text-gray-700 mb-1.5";
const inputClass =
  "w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/15 transition placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/* Inner form is remounted on each open via key, so useState initializers
 * run with the active notif's values — no setState-in-effect needed. */
function AnnouncementForm({
  onClose,
  onSubmit,
  isSubmitting,
}: {
  onClose: () => void;
  onSubmit: (payload: AnnouncementFormData) => void;
  isSubmitting: boolean;
}) {
  const [bgType, setBgType] = useState<BackgroundType>("image");
  const [bgColor, setBgColor] = useState(COLOR_PALETTE[0]);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority] = useState<AnnouncementPriority>("NORMAL");
  const [publishDate, setPublishDate] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [publishImmediately, setPublishImmediately] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError("Image is too large (max 5 MB).");
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setImageDataUrl(dataUrl);
      setImageError(null);
    } catch {
      setImageError("Failed to read the image file.");
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!title.trim()) next.title = "Title is required";
    if (!content.trim()) next.content = "Description is required";
    if (bgType === "image" && !imageDataUrl)
      next.image = "Please upload a cover image or switch to Color Background";
    if (bgType === "color" && !bgColor)
      next.bgColor = "Pick a background color";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      priority,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      bgType,
      bgColor: bgType === "color" ? bgColor : null,
      image: bgType === "image" ? imageDataUrl : null,
    });
  };

  // suppress unused warning — publishDate/publishImmediately are in the UI
  void publishDate;
  void publishImmediately;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-white w-full max-w-[600px] max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
        <h2 className="text-[17px] font-bold text-gray-900">
          Create News Announcement
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 flex items-center justify-center transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {/* Background type switcher */}
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-semibold text-gray-700">
              Background Type:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBgType("image")}
                className={
                  "flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition " +
                  (bgType === "image"
                    ? "bg-[#00A389] text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50")
                }
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Cover Image
              </button>
              <button
                type="button"
                onClick={() => setBgType("color")}
                className={
                  "flex items-center gap-2 px-3.5 py-2 rounded-lg text-[13px] font-semibold transition " +
                  (bgType === "color"
                    ? "bg-[#00A389] text-white shadow-sm"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50")
                }
              >
                <Palette className="w-3.5 h-3.5" />
                Color Background
              </button>
            </div>
          </div>
        </div>

        {/* Cover image OR color picker */}
        {bgType === "image" ? (
          <div>
            <label className={labelClass}>Cover Image</label>
            {imageDataUrl ? (
              <div className="relative">
                <img
                  src={imageDataUrl}
                  alt="Cover preview"
                  className="w-full h-44 object-cover rounded-xl border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageDataUrl(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-700 shadow flex items-center justify-center"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-200 rounded-xl px-6 py-10 cursor-pointer bg-gray-50 hover:border-[#00A389] hover:bg-[#00A389]/5 transition">
                <Upload className="w-7 h-7 text-gray-400 mb-2" />
                <span className="text-sm font-semibold text-gray-700">
                  Click to upload or drag and drop
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Recommended: 800x400px
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
            {imageError && (
              <p className="text-red-500 text-xs mt-1.5">{imageError}</p>
            )}
            {errors.image && !imageError && (
              <p className="text-red-500 text-xs mt-1.5">{errors.image}</p>
            )}
          </div>
        ) : (
          <div>
            <label className={labelClass}>
              Background Color <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {COLOR_PALETTE.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setBgColor(color)}
                  className={
                    "w-10 h-10 rounded-lg transition transform " +
                    (bgColor === color
                      ? "ring-2 ring-offset-2 ring-[#00A389] scale-105"
                      : "hover:scale-105")
                  }
                  style={{ background: color }}
                  aria-label={color}
                />
              ))}
            </div>
            <div
              className="h-10 rounded-lg border border-gray-200"
              style={{ background: bgColor }}
            />
            {errors.bgColor && (
              <p className="text-red-500 text-xs mt-1.5">{errors.bgColor}</p>
            )}
          </div>
        )}

        {/* Title */}
        <div>
          <label className={labelClass}>
            Title <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter announcement title"
            disabled={isSubmitting}
            className={
              inputClass +
              (errors.title ? " border-red-300 focus:ring-red-200" : "")
            }
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter announcement description"
            rows={4}
            disabled={isSubmitting}
            className={
              inputClass +
              " resize-none" +
              (errors.content ? " border-red-300 focus:ring-red-200" : "")
            }
          />
          {errors.content && (
            <p className="text-red-500 text-xs mt-1.5">{errors.content}</p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Publish Date</label>
            <input
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              disabled={isSubmitting}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Expiry Date (Optional)</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              disabled={isSubmitting}
              className={inputClass}
            />
          </div>
        </div>

        {/* Publish immediately */}
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={publishImmediately}
              onChange={(e) => setPublishImmediately(e.target.checked)}
              disabled={isSubmitting}
              className="mt-0.5 w-4 h-4 accent-[#00A389] cursor-pointer"
            />
            <div>
              <p className="text-sm font-bold text-emerald-700">
                Publish Immediately
              </p>
              <p className="text-xs text-emerald-600/80 mt-0.5">
                Make this announcement visible in the resident app
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-sm font-semibold transition disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A389] hover:bg-[#008F77] text-white text-sm font-semibold shadow-md hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          {isSubmitting ? "Creating..." : "Create Announcement"}
        </button>
      </div>
    </div>
  );
}

export function AnnouncementModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: AnnouncementModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40"
    >
      <AnnouncementForm
        onClose={onClose}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
