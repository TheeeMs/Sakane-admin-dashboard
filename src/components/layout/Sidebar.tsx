import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wrench,
  CreditCard,
  Shield,
  Calendar,
  Megaphone,
  Search,
  MessageSquare,
  LayoutGrid,
  ChevronRight,
  Briefcase,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navSections = [
  {
    label: "MAIN",
    items: [{ icon: LayoutDashboard, label: "Dashboard", path: "/" }],
  },
  {
    label: "RESIDENT MANAGEMENT",
    items: [
      { icon: Users, label: "Residents", path: "/residents" },
      { icon: Wrench, label: "Maintenance", path: "/maintenance" },
      { icon: CreditCard, label: "Payments", path: "/payments" },
    ],
  },
  {
    label: "SECURITY & ACCESS",
    items: [{ icon: Shield, label: "Gate Access", path: "/gate-access" }],
  },
  {
    label: "COMMUNITY",
    items: [
      { icon: Calendar, label: "Events", path: "/events" },
      { icon: Megaphone, label: "Announcements", path: "/announcements" },
      { icon: Search, label: "Missing & Found", path: "/missing-found" },
      { icon: MessageSquare, label: "Feedback", path: "/feedback" },
    ],
  },
  {
    label: "STAFF",
    items: [{ icon: Briefcase, label: "Employees", path: "/employees" }],
  },
  {
    label: "SYSTEM",
    items: [{ icon: Settings, label: "Settings", path: "/settings" }],
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-[220px] min-h-screen bg-[#00A389] flex flex-col fixed left-0 top-0 z-40 shadow-xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-white/20">
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
          <LayoutGrid className="w-5 h-5 text-white" />
        </div>
        <span className="text-white text-xl font-bold tracking-wide">
          Sakane
        </span>
        <button className="ml-auto text-white/60 hover:text-white transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label} className="mb-2">
            <p className="text-white/50 text-[10px] font-semibold tracking-widest px-5 py-2 uppercase">
              {section.label}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-5 py-2.5 mx-2 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-white/75 group-hover:text-white",
                    )}
                  />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Sakane Admin</p>
            <p className="text-white/50 text-[10px]">Version 1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
