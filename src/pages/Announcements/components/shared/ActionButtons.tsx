import { useState } from "react";

export function ActionBtn({ icon, title, color, hoverColor, onClick }: { icon: string; title: string; color: string; hoverColor: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return <button title={title} onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: h ? `${hoverColor}15` : "transparent", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: h ? hoverColor : color, transition: "all 0.15s" }}>{icon}</button>;
}

export function SysActionBtn({ icon, title, hoverColor }: { icon: React.ReactNode; title: string; hoverColor: string }) {
  const [h, setH] = useState(false);
  return <button title={title} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)} style={{ background: h ? `${hoverColor}15` : "transparent", border: "none", borderRadius: 7, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: h ? hoverColor : "#9ca3af", transition: "all 0.15s" }}>{icon}</button>;
}