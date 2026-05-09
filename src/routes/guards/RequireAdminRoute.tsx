import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth";

const RequireAdminRoute = () => {
  const location = useLocation();
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A] text-white">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-white/80">
          Verifying admin session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default RequireAdminRoute;
