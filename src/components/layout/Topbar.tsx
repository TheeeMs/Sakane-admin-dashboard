import { Bell, Search, ChevronDown, Home, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

interface TopbarProps {
  breadcrumb?: string[];
}

const Topbar = ({ breadcrumb = ["Home", "Dashboard"] }: TopbarProps) => {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-gray-500">
        <Link
          to="/"
          className="flex items-center gap-1 hover:text-gray-700 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        {breadcrumb.slice(1).map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span
              className={
                i === breadcrumb.length - 2 ? "text-gray-800 font-medium" : ""
              }
            >
              {crumb}
            </span>
          </span>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Search className="w-4 h-4 text-gray-500" />
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
            3
          </span>
        </button>

        {/* User */}
        <button className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-full bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00A389] to-[#007A67] flex items-center justify-center text-white text-xs font-bold">
            MM
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-gray-800 leading-tight">
              Mohamed Mahmoud
            </p>
            <p className="text-[10px] text-gray-400 leading-tight">
              Super Admin
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;
