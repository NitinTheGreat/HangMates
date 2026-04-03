"use client";

import { cn } from "@/lib/utils";

interface RadarChartProps {
  stats: Record<string, number>;
  size?: number;
  color?: string;
}

const STAT_LABELS: Record<string, string> = {
  humor: "Humor",
  energy: "Energy",
  chillFactor: "Chill",
  foodieScore: "Foodie",
  hypeFactor: "Hype",
  empathy: "Empathy",
  photography: "Photo",
  conversationDepth: "Convo",
  punctuality: "Punctual",
  adventure: "Adventure",
};

export default function RadarChart({
  stats,
  size = 280,
  color = "#FF6B35",
}: RadarChartProps) {
  const keys = Object.keys(STAT_LABELS);
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.35;
  const labelR = size * 0.46;
  const n = keys.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  function getPoint(index: number, radius: number) {
    const angle = startAngle + index * angleStep;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  }

  function polygon(radius: number) {
    return keys
      .map((_, i) => {
        const p = getPoint(i, radius);
        return `${p.x},${p.y}`;
      })
      .join(" ");
  }

  const dataPoints = keys.map((key, i) => {
    const val = stats[key] ?? 50;
    const r = (val / 100) * maxR;
    return getPoint(i, r);
  });

  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <div className={cn("flex items-center justify-center")}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Concentric outlines */}
        {[0.33, 0.66, 1].map((scale) => (
          <polygon
            key={scale}
            points={polygon(maxR * scale)}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        {keys.map((_, i) => {
          const p = getPoint(i, maxR);
          return (
            <line
              key={`axis-${i}`}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data fill */}
        <polygon
          points={dataPolygon}
          fill={`${color}33`}
          stroke={color}
          strokeWidth="2"
        />

        {/* Data vertices */}
        {dataPoints.map((p, i) => (
          <circle
            key={`dot-${i}`}
            cx={p.x}
            cy={p.y}
            r={3.5}
            fill={color}
          />
        ))}

        {/* Labels */}
        {keys.map((key, i) => {
          const p = getPoint(i, labelR);
          return (
            <text
              key={`label-${i}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#8A8A9A"
              fontSize="10"
              fontWeight="500"
            >
              {STAT_LABELS[key]}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
