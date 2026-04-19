// ─── SakaneSettings.tsx ───────────────────────────────────────────────────────
// Root component — assembles all sub-components together.

import { useState } from "react";
import type { Tab, FormData } from "./types";
import { SaveIcon } from "./icons";
import { TAB_CONFIG } from "./SettingsTabs";
import SettingsTabs from "./SettingsTabs";
import GeneralTab from "./GeneralTab";
import SecurityTab from "./SecurityTab";

// ── EmptyTabPlaceholder ───────────────────────────────────────────────────────

function EmptyTabPlaceholder({ tab }: { tab: Tab }) {
  const icon = TAB_CONFIG.find((t) => t.label === tab)?.icon;
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4 text-gray-300">
        {icon}
      </div>
      <p className="text-sm font-medium">{tab} settings coming soon</p>
    </div>
  );
}

// ── SakaneSettings ────────────────────────────────────────────────────────────

const INITIAL_FORM: FormData = {
  compoundName: "Sakane Residential Compound",
  contactEmail: "info@sakane.com",
  contactPhone: "+20 100 123 4567",
  emergencyNumber: "+20 100 999 8888",
  address: "",
  totalUnits: "342",
  totalBuildings: "3",
  timezone: "",
  officeHours: "9:00 AM - 5:00 PM",
  emergencyContact: "Available",
};

export default function SakaneSettings() {
  const [activeTab, setActiveTab] = useState<Tab>("General");
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  const update = (key: keyof FormData) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">

        

        {/* 2. Main content */}
        <main className="flex-1 overflow-y-auto bg-white">

          {/* Page title + Save button */}
          <div className="px-6 pt-6 pb-2 flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-sm text-gray-400 mt-0.5">Configure system preferences and options</p>
            </div>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                saved
                  ? "bg-green-500 text-white"
                  : "bg-teal-600 hover:bg-teal-700 text-white"
              }`}
            >
              <SaveIcon />
              {saved ? "Saved!" : "Save All Changes"}
            </button>
          </div>

          {/* 3. Tab navigation */}
          <div className="mt-4">
            <SettingsTabs activeTab={activeTab} onChange={setActiveTab} />
          </div>

          {/* 4. Tab content */}
          <div className="px-6 py-6">
            {activeTab === "General" ? (
              <GeneralTab form={form} update={update} />
            ) : activeTab === "Security" ? (
              <SecurityTab />
            ) : (
              <EmptyTabPlaceholder tab={activeTab} />
            )}
          </div>

        </main>
      </div>
    </div>
  );
}