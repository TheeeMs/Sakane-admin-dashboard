// src/components/shared/LoadingSpinner.tsx

interface Props {
  size?: number;
  text?: string;
}

export function LoadingSpinner({ size = 80, text = "Loading…" }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const r  = size * 0.42;

  // 8 dots around a circle
  const dots = Array.from({ length: 8 }, (_, i) => {
    const angle  = (i / 8) * 2 * Math.PI - Math.PI / 2;
    const x      = cx + r * Math.cos(angle);
    const y      = cy + r * Math.sin(angle);
    const dotR   = size * 0.06;
    const delay  = `${(i * 0.175).toFixed(2)}s`;
    return { x, y, dotR, delay };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: "40px 0" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
        <style>{`
          @keyframes sakane-spin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
          @keyframes sakane-pulse {
            0%, 100% { opacity: 0.25; }
            50%       { opacity: 1; }
          }
          .sakane-ring {
            transform-origin: ${cx}px ${cy}px;
            animation: sakane-spin 1.8s linear infinite;
          }
        `}</style>

        {/* Rotating ring */}
        <g className="sakane-ring">
          {dots.map((d, i) => (
            <circle
              key={i}
              cx={d.x}
              cy={d.y}
              r={d.dotR}
              fill="#0d9488"
              style={{
                animation: `sakane-pulse 1.4s ease-in-out ${d.delay} infinite`,
              }}
            />
          ))}
        </g>

        {/* Center bg */}
        <circle cx={cx} cy={cy} r={size * 0.28} fill="#f0fdf4" />

        {/* S letter */}
        <text
          x={cx}
          y={cy + size * 0.13}
          textAnchor="middle"
          fontFamily="'DM Sans', sans-serif"
          fontSize={size * 0.32}
          fontWeight="700"
          fill="#0d9488"
        >
          S
        </text>
      </svg>

      {text && (
        <p style={{ margin: 0, fontSize: 14, color: "#6b7280", fontWeight: 500 }}>{text}</p>
      )}
    </div>
  );
}