import { X, Shield, Calendar, Save, PenLine } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const [form, setForm] = useState({
    fullName: "Mohamed Mahmoud",
    email: "mohamed.mahmoud@sakane.com",
    phone: "+20 100 123 4567",
    department: "Administration",
  });

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const backdropRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[2px] animate-in fade-in duration-200"
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[520px] mx-4 animate-in zoom-in-95 fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">My Profile</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-150"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="px-7 py-5 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
          {/* Avatar + Name */}
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00A389] to-[#007A67] flex items-center justify-center text-white text-xl font-bold select-none shadow-md">
                MM
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
                <PenLine className="w-3 h-3 text-gray-500" />
              </button>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {form.fullName}
              </h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="flex items-center gap-1 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-full px-2.5 py-0.5">
                  <Shield className="w-3 h-3" />
                  Super Admin
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                Administrator since January 2024
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Personal Information
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-1">
                <label className="text-xs text-gray-500 mb-1 block font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 bg-white outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/10 transition-all placeholder-gray-300"
                />
              </div>
              <div className="col-span-1">
                <label className="text-xs text-gray-500 mb-1 block font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 bg-white outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/10 transition-all placeholder-gray-300"
                />
              </div>
              <div className="col-span-1">
                <label className="text-xs text-gray-500 mb-1 block font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 bg-white outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/10 transition-all placeholder-gray-300"
                />
              </div>
              <div className="col-span-1">
                <label className="text-xs text-gray-500 mb-1 block font-medium">
                  Department
                </label>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) =>
                    setForm({ ...form, department: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 bg-white outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/10 transition-all placeholder-gray-300"
                />
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Account Details
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <Shield className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-400 font-medium">
                    Role
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  Super Administrator
                </p>
              </div>
              <div className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50/50">
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-xs text-gray-400 font-medium">
                    Member Since
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  January 15, 2024
                </p>
              </div>
            </div>
          </div>

          {/* Activity Statistics */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Activity Statistics
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-blue-100 rounded-xl px-4 py-3 bg-blue-50/40 text-center">
                <p className="text-2xl font-bold text-blue-600">127</p>
                <p className="text-[11px] text-blue-500 mt-0.5 font-medium">
                  Actions This Month
                </p>
              </div>
              <div className="border border-emerald-100 rounded-xl px-4 py-3 bg-emerald-50/40 text-center">
                <p className="text-2xl font-bold text-emerald-600">45</p>
                <p className="text-[11px] text-emerald-500 mt-0.5 font-medium">
                  Tasks Completed
                </p>
              </div>
              <div className="border border-purple-100 rounded-xl px-4 py-3 bg-purple-50/40 text-center">
                <p className="text-2xl font-bold text-purple-600">98%</p>
                <p className="text-[11px] text-purple-500 mt-0.5 font-medium">
                  Response Rate
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-150 active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A389] hover:bg-[#008A74] text-white text-sm font-semibold transition-all duration-150 active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
