// ─── SettingsTabs.tsx ─────────────────────────────────────────────────────────

import  type{ Tab } from "./types";
import {
  HomeIcon,
  CreditCardIcon,
  BellIcon,
  ShieldIcon,
  PaletteIcon,
  DatabaseIcon,
} from "./icons";

interface SettingsTabsProps {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
}

const TAB_CONFIG: { label: Tab; icon: React.ReactNode }[] = [
  { label: "General",       icon: <HomeIcon /> },
  { label: "Payment",       icon: <CreditCardIcon /> },
  { label: "Notifications", icon: <BellIcon /> },
  { label: "Security",      icon: <ShieldIcon /> },
  { label: "Appearance",    icon: <PaletteIcon /> },
  { label: "System",        icon: <DatabaseIcon /> },
];

export { TAB_CONFIG };

export default function SettingsTabs({ activeTab, onChange }: SettingsTabsProps) {
  return (
    <div className="px-6 flex items-center gap-6 border-b border-gray-200">
      {TAB_CONFIG.map(({ label, icon }) => (
        <button
          key={label}
          onClick={() => onChange(label)}
          className={`flex items-center gap-2 px-1 pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === label
              ? "border-teal-500 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          {icon}
          {label}
        </button>
      ))}
    </div>
  );
}