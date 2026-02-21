import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

// Map pathnames to human-readable breadcrumb labels
const BREADCRUMB_MAP: Record<string, string> = {
  "/": "Dashboard",
  "/residents": "Residents",
  "/maintenance": "Maintenance",
  "/payments": "Payments",
  "/gate-access": "Gate Access",
  "/events": "Events",
  "/announcements": "Announcements",
  "/missing-found": "Missing & Found",
  "/feedback": "Feedback",
  "/employees": "Employees",
  "/settings": "Settings",
};

const Layout = () => {
  const location = useLocation();
  const pageLabel = BREADCRUMB_MAP[location.pathname] ?? "Page";
  const breadcrumb = ["Home", pageLabel];

  return (
    <div className="flex min-h-screen bg-[#F4F6F8]">
      <Sidebar />
      <div className="flex-1 ml-[220px] flex flex-col min-h-screen">
        <Topbar breadcrumb={breadcrumb} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
