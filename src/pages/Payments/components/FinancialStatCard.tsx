import { AlertTriangle, DollarSign, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import type { ReceiptStatistics } from "../types";

interface Props {
  statistics: ReceiptStatistics;
}

/** Animated number counter */
function useCountUp(target: number, duration = 900, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setValue(Math.round(ease * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [target, duration, delay]);
  return value;
}

export function FinancialStatCards({ statistics }: Props) {
  const animDebt      = useCountUp(statistics.outstandingDebt,    1100, 300);
  const animCollected = useCountUp(statistics.collectedThisMonth, 1100, 450);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">

      {/* ── Outstanding Debt (Red) ─────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-xl border border-[#FFE2E2] bg-gradient-to-br from-[#FFF5F5] to-white p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300"
        style={{ animation: "fadeSlideUp 0.5s ease 0.15s both" }}
      >
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-red-100/50 blur-2xl" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"
              style={{ animation: "popIn 0.4s ease 0.5s both" }}
            >
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Outstanding Debt</p>
              <p className="text-[11px] text-red-400 font-medium">Requires attention</p>
            </div>
          </div>
          <div
            className="w-8 h-8 rounded-full bg-[#FFE2E2] flex items-center justify-center"
            style={{ animation: "popIn 0.4s ease 0.6s both" }}
          >
            <span className="text-sm font-bold text-[#C10007]">
              {statistics.totalOverdue}
            </span>
          </div>
        </div>

        <div>
          <p className="text-2xl font-bold text-gray-900 tabular-nums">
            EGP {animDebt.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {statistics.totalOverdue} overdue payments
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-red-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">Overdue receipts</span>
          <button className="text-[11px] text-red-500 font-semibold hover:underline transition-all">
            View All
          </button>
        </div>
      </div>

      {/* ── Collected This Month (Teal) ────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-xl border border-[#00A996]/20 bg-gradient-to-br from-[#F0FDFB] to-white p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300"
        style={{ animation: "fadeSlideUp 0.5s ease 0.25s both" }}
      >
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-teal-100/50 blur-2xl" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center"
              style={{ animation: "popIn 0.4s ease 0.6s both" }}
            >
              <DollarSign className="w-5 h-5 text-[#00A996]" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Collected This Month</p>
              <p className="text-[11px] text-gray-400">February 2026</p>
            </div>
          </div>
          <div
            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full"
            style={{ animation: "popIn 0.4s ease 0.7s both" }}
          >
            <TrendingUp className="w-3 h-3" />
            +12%
          </div>
        </div>

        <div>
          <p className="text-2xl font-bold text-gray-900 tabular-nums">
            EGP {animCollected.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {statistics.totalPaid} successful payments
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-teal-100 flex items-center justify-between">
          <span className="text-[11px] text-gray-400">Paid receipts</span>
          <button className="text-[11px] text-[#00A996] font-semibold hover:underline transition-all">
            View Report
          </button>
        </div>
      </div>
    </div>
  );
}
