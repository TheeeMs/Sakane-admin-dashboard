export function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <div onClick={onChange} style={{ width: 44, height: 24, borderRadius: 999, background: enabled ? "#0d9488" : "#d1d5db", cursor: "pointer", position: "relative", transition: "background 0.2s" }}>
      <div style={{ position: "absolute", top: 3, left: enabled ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </div>
  );
}