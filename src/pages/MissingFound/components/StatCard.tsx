import type { ReactNode } from "react";
import { TrendUpIcon } from "./icons";

interface StatCardProps {
  icon: ReactNode;
  value: number;
  label: string;
  bg: string;
  border: string;
  valueColor: string;
}

export default function StatCard({ icon, value, label, bg, border, valueColor }: StatCardProps) {
  return (
    <div style={{
      background: bg,
      border: `1.5px solid ${border}`,
      borderRadius: 20,
      padding: "16px 18px",
    }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
      }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        }}>
          {icon}
        </div>
        <span style={{ color: "#10b981", display: "flex" }}>
          <TrendUpIcon />
        </span>
      </div>
      <div style={{
        fontSize: 30,
        fontWeight: 800,
        color: valueColor,
        lineHeight: 1,
        marginBottom: 4,
      }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}