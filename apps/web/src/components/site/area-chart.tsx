"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Point = { label: string; value: number };

export function AreaChart({
  data,
  height = 220,
  className,
  unit = "kg",
  accent = "moss",
  showAxis = true,
  strokeWidth = 2,
}: {
  data: Point[];
  height?: number;
  className?: string;
  unit?: string;
  accent?: "moss" | "lime";
  showAxis?: boolean;
  strokeWidth?: number;
}) {
  const gradientId = useId();
  const [hover, setHover] = useState<number | null>(null);

  const vb = { w: 1000, h: 320 };

  const { path, area, points, min, max } = useMemo(() => {
    const pad = { top: 26, right: 10, bottom: 6, left: 10 };
    const values = data.map((d) => d.value);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const span = rawMax - rawMin || 1;
    const lo = rawMin - span * 0.3;
    const hi = rawMax + span * 0.2;

    const x = (i: number) =>
      pad.left + (i / Math.max(1, data.length - 1)) * (vb.w - pad.left - pad.right);
    const y = (v: number) => pad.top + (1 - (v - lo) / (hi - lo)) * (vb.h - pad.top - pad.bottom);

    const pts = data.map((d, i) => ({ x: x(i), y: y(d.value), ...d }));

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const cur = pts[i];
      const cx = (prev.x + cur.x) / 2;
      d += ` C ${cx} ${prev.y}, ${cx} ${cur.y}, ${cur.x} ${cur.y}`;
    }
    const areaPath = `${d} L ${pts[pts.length - 1].x} ${vb.h - pad.bottom} L ${pts[0].x} ${
      vb.h - pad.bottom
    } Z`;

    return { path: d, area: areaPath, points: pts, min: rawMin, max: rawMax };
  }, [data, vb.h, vb.w]);

  const active = hover !== null ? points[hover] : null;
  const stroke = accent === "moss" ? "#47552a" : "#d9f26b";

  return (
    <div className={cn("w-full", className)}>
      <div className="relative w-full" style={{ height }}>
        <svg
          viewBox={`0 0 ${vb.w} ${vb.h}`}
          preserveAspectRatio="none"
          className="size-full"
          role="img"
          aria-label={`Trend from ${data[0].label} to ${data[data.length - 1].label}, ${min} to ${max} ${unit}`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.26" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>

          {showAxis &&
            [0.2, 0.55, 0.9].map((p) => (
              <line
                key={p}
                x1="0"
                x2={vb.w}
                y1={p * vb.h}
                y2={p * vb.h}
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="2 5"
                vectorEffect="non-scaling-stroke"
                className="text-[var(--line)]"
              />
            ))}

          <path d={area} fill={`url(#${gradientId})`} />
          <path
            d={path}
            fill="none"
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />

          {active && (
            <line
              x1={active.x}
              x2={active.x}
              y1="0"
              y2={vb.h}
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              className="text-ink-mute/35"
            />
          )}

          {points.map((p, i) => (
            <g key={p.label}>
              {(hover === i || i === points.length - 1) && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={hover === i ? 6 : 4.5}
                  fill={i === points.length - 1 ? "#d9f26b" : "#f6f2e6"}
                  stroke={stroke}
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              )}
              <rect
                x={p.x - vb.w / points.length / 2}
                y="0"
                width={vb.w / points.length}
                height={vb.h}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "crosshair" }}
              />
            </g>
          ))}
        </svg>

        {active && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-md border border-[var(--line)] bg-paper-raised px-2.5 py-1.5 shadow-sm"
            style={{
              left: `${(active.x / vb.w) * 100}%`,
              top: `${(active.y / vb.h) * 100}%`,
              transform: "translate(-50%, -135%)",
            }}
          >
            <p className="mono-tag text-ink-mute">{active.label}</p>
            <p className="num text-[0.8125rem] font-semibold text-ink">
              {active.value} {unit}
            </p>
          </div>
        )}
      </div>

      {showAxis && (
        <div className="mt-2.5 flex justify-between gap-1">
          {data.map((d, i) => (
            <span
              key={d.label}
              className={cn(
                "mono-tag whitespace-nowrap text-ink-mute",
                i !== 0 && i !== data.length - 1 && "hidden sm:inline",
              )}
            >
              {d.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
