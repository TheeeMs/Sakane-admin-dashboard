import { useEffect, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";
import type { ReceiptStatistics } from "../types";

interface Props {
  statistics: ReceiptStatistics;
}

/** Animates a number from 0 → target over `duration` ms */
function useCountUp(target: number, duration = 900, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        setValue(Math.round(ease * target));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return value;
}

export function ReceiptStatusOverview({ statistics }: Props) {
  const total = statistics.totalPaid + statistics.totalPending + statistics.totalOverdue;
  const paidPct    = total > 0 ? Math.round((statistics.totalPaid    / total) * 100) : 0;
  const overduePct = total > 0 ? Math.round((statistics.totalOverdue / total) * 100) : 0;

  // Arc geometry
  const r = 90;
  const halfCirc = Math.PI * r; // ≈ 282.74
  const arcPath = `M 10 100 A ${r} ${r} 0 0 1 190 100`;

  // Animated arc lengths (0 → target over 1.2 s)
  const [paidDash,    setPaidDash]    = useState(0);
  const [overdueDash, setOverdueDash] = useState(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const targetPaid    = (paidPct    / 100) * halfCirc;
    const targetOverdue = (overduePct / 100) * halfCirc;
    const duration = 1200;
    const delay    = 200;

    const timer = setTimeout(() => {
      const start = performance.now();
      const step  = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        setPaidDash(ease * targetPaid);
        setOverdueDash(ease * targetOverdue);
        if (progress < 1) {
          animRef.current = requestAnimationFrame(step);
        }
      };
      animRef.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [paidPct, overduePct, halfCirc]);

  // Animated center percentage
  const displayPct  = useCountUp(paidPct, 1000, 300);

  const rows = [
    { color: "#5A8DEE", bg: "#5A8DEE22", label: "Paid",    count: statistics.totalPaid },
    { color: "#D1D5DB", bg: "#D1D5DB44", label: "Pending", count: statistics.totalPending },
    { color: "#FF5757", bg: "#FF575722", label: "Overdue", count: statistics.totalOverdue },
  ];

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col h-full"
      style={{ animation: "fadeSlideUp 0.5s ease both" }}
    >
      {/* Title */}
      <h3 className="text-sm font-semibold text-gray-800 text-center">
        Receipt Status Overview
      </h3>

      {/* Semicircle gauge */}
      <div className="relative flex justify-center mt-3" style={{ height: 112 }}>
        <svg width="200" height="105" viewBox="0 0 200 105" className="overflow-visible">
          {/* Gray background arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="#E8E8E8"
            strokeWidth="22"
            strokeLinecap="round"
          />
          {/* Blue paid arc */}
          <path
            d={arcPath}
            fill="none"
            stroke="#5A8DEE"
            strokeWidth="22"
            strokeLinecap="round"
            strokeDasharray={`${paidDash} ${halfCirc}`}
            style={{ transition: "none" }}
          />
          {/* Red overdue arc (on top) */}
          <path
            d={arcPath}
            fill="none"
            stroke="#FF5757"
            strokeWidth="22"
            strokeLinecap="round"
            strokeDasharray={`${overdueDash} ${halfCirc}`}
            style={{ transition: "none" }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-1">
          <p
            className="text-2xl font-bold text-gray-800 leading-none tabular-nums"
            style={{ animation: "fadeIn 0.4s ease 0.8s both" }}
          >
            {displayPct}%
          </p>
          <p
            className="text-[11px] text-gray-400 mt-0.5"
            style={{ animation: "fadeIn 0.4s ease 1s both" }}
          >
            Total Paid
          </p>
        </div>
      </div>

      {/* Trend badge */}
      <div
        className="flex justify-center mt-3"
        style={{ animation: "fadeIn 0.5s ease 1.1s both" }}
      >
        <span className="flex items-center gap-1 bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
          <TrendingUp className="w-3.5 h-3.5" />
          +8% from last month
        </span>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-4" />

      {/* Legend rows — staggered fade-in */}
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className="flex items-center gap-3"
            style={{ animation: `fadeSlideUp 0.4s ease ${1.1 + i * 0.1}s both` }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: row.bg }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: row.color }} />
            </div>
            <span className="text-xs text-gray-500 flex-1">{row.label}</span>
            <span className="text-xs font-bold text-gray-800">{row.count} receipts</span>
          </div>
        ))}
      </div>
    </div>
  );
}
