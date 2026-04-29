import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { LogIn, ShieldCheck, Sparkles } from "lucide-react";
import { Input } from "@/components/shared/FormInputs";
import { PrimaryButton } from "@/components/shared/Buttons";
import { useAuthStore } from "@/features/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    loginWithEmail,
    isHydrated,
    isAuthenticated,
    user,
    isLoading,
    error,
    clearError,
  } = useAuthStore();
  const [email, setEmail] = useState("admin@sakany.app");
  const [password, setPassword] = useState("Admin@12345");

  const from =
    (location.state as { from?: { pathname?: string } } | undefined)?.from
      ?.pathname ?? "/";

  useEffect(() => {
    clearError();
  }, [clearError]);

  if (isHydrated && isAuthenticated && user?.role === "ADMIN") {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await loginWithEmail({ email, password });
      navigate(from, { replace: true });
    } catch {
      // Error state is handled by the auth store.
    }
  };

  return (
    <div className="min-h-screen bg-[#07111F] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative hidden overflow-hidden border-r border-white/10 bg-gradient-to-br from-[#0B1D33] via-[#102844] to-[#0C1728] lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(0,169,150,0.28),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_30%)]" />
          <div className="relative flex flex-col justify-between p-12">
            <div className="flex items-center gap-3 text-white">
              <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-sm">
                <ShieldCheck className="h-6 w-6 text-[#62E3D4]" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-white/60">
                  Sakany Admin
                </p>
                <h1 className="text-3xl font-semibold">Admin access only</h1>
              </div>
            </div>

            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80 backdrop-blur">
                <Sparkles className="h-4 w-4 text-[#62E3D4]" />
                Secure dashboard entry
              </div>
              <h2 className="text-5xl font-semibold leading-tight text-white">
                Manage residents, events, and operations from one control panel.
              </h2>
              <p className="max-w-lg text-base leading-7 text-white/70">
                Only the seeded admin account can sign in here. Any non-admin
                session is cleared automatically by the dashboard.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center px-6 py-12 sm:px-10">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-[28px] border border-white/10 bg-white px-8 py-10 text-slate-900 shadow-[0_30px_100px_rgba(0,0,0,0.28)]"
          >
            <div className="mb-8 space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#009f8b]">
                Sign in
              </p>
              <h3 className="text-3xl font-semibold text-slate-950">
                Administrator access
              </h3>
              <p className="text-sm leading-6 text-slate-500">
                Use the seeded admin credentials to enter the dashboard.
              </p>
            </div>

            <div className="space-y-5">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@sakany.app"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Admin@12345"
                required
              />

              {error && (
                <p className="text-sm font-medium text-red-600">{error}</p>
              )}

              <PrimaryButton
                type="submit"
                disabled={isLoading}
                className="w-full justify-center bg-[#0B8E7E] hover:bg-[#087567]"
              >
                <LogIn className="h-5 w-5" />
                {isLoading ? "Signing in..." : "Enter dashboard"}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
