"use client";

import { useCallback, useMemo, useRef, useState } from "react";

const PURPLE = "#5B2D9B";
const ORANGE = "#F97316";

type SeriesKey = "products" | "leads";

type Props = {
  products: number[];
  leads: number[];
  labels: string[];
};

const CHART_W = 720;
const CHART_H = 280;
const CHART_PAD = { t: 28, r: 28, b: 40, l: 48 } as const;

function smoothPath(points: [number, number][]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0][0]},${points[0][1]}`;
  let d = `M ${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const mx = (x0 + x1) / 2;
    const my = (y0 + y1) / 2;
    d += ` Q ${x0},${y0} ${mx},${my}`;
  }
  const [xl, yl] = points[points.length - 1];
  d += ` T ${xl},${yl}`;
  return d;
}

export function AdminLeadStatsChart({ products, leads, labels }: Props) {
  const [visible, setVisible] = useState<Record<SeriesKey, boolean>>({
    products: true,
    leads: true,
  });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const w = CHART_W;
  const h = CHART_H;
  const pad = CHART_PAD;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;

  const maxVal = useMemo(() => {
    let m = 1;
    (Object.keys({ products, leads }) as SeriesKey[]).forEach((key) => {
      if (!visible[key]) return;
      const arr = key === "products" ? products : leads;
      arr.forEach((v) => {
        m = Math.max(m, v);
      });
    });
    return m * 1.08;
  }, [leads, products, visible]);

  const toPoints = useCallback(
    (data: number[]): [number, number][] =>
      data.map((v, i) => {
        const x = pad.l + (innerW * (data.length <= 1 ? 0 : i / (data.length - 1)));
        const y = pad.t + innerH * (1 - Math.min(1, v / maxVal));
        return [x, y];
      }),
    [innerH, innerW, maxVal, pad.l, pad.t]
  );

  const paths = useMemo(() => {
    return {
      products: visible.products ? smoothPath(toPoints(products)) : "",
      leads: visible.leads ? smoothPath(toPoints(leads)) : "",
    };
  }, [leads, products, toPoints, visible.leads, visible.products]);

  const fillPath = useMemo(() => {
    if (!visible.products || products.length < 2 || !paths.products) return "";
    const pts = toPoints(products);
    const last = pts[pts.length - 1];
    const first = pts[0];
    if (!first || !last) return "";
    return `${paths.products} L ${last[0]} ${pad.t + innerH} L ${first[0]} ${pad.t + innerH} Z`;
  }, [innerH, pad.t, paths.products, products, toPoints, visible.products]);

  function onMove(e: React.MouseEvent<SVGSVGElement>) {
    const el = svgRef.current;
    if (!el || products.length === 0) return;
    const rect = el.getBoundingClientRect();
    const sx = ((e.clientX - rect.left) / rect.width) * w;
    const step = innerW / Math.max(1, products.length - 1);
    const raw = (sx - pad.l) / step;
    const idx = Math.round(Math.min(products.length - 1, Math.max(0, raw)));
    setHoverIdx(idx);
  }

  const tooltipIdx = hoverIdx;
  const tooltipXFrac = tooltipIdx != null && products.length > 0
    ? products.length <= 1
      ? 0.5
      : tooltipIdx / (products.length - 1)
    : 0.5;

  return (
    <div
      className="rounded-[24px] bg-white p-6 md:p-8 h-full min-h-[320px] flex flex-col"
      style={{ boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#1a1a1a] tracking-tight">Record activity</h2>
          <p className="text-sm text-[#1a1a1a]/45 mt-1">Smoothed trend across recent weeks (derived from current totals).</p>
        </div>
        <button
          type="button"
          className="self-start sm:self-center rounded-full border border-black/[0.08] bg-[#F5F5F7] px-4 py-2 text-xs font-semibold text-[#1a1a1a]/70"
        >
          This month
        </button>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-3 mb-2">
        <ToggleRow
          label="Products"
          color={PURPLE}
          on={() => setVisible((v) => ({ ...v, products: !v.products }))}
          active={visible.products}
        />
        <ToggleRow
          label="Lead pipeline"
          color={ORANGE}
          on={() => setVisible((v) => ({ ...v, leads: !v.leads }))}
          active={visible.leads}
        />
      </div>

      <div className="flex-1 relative min-h-[220px]">
        <svg
          ref={svgRef}
          role="img"
          aria-label="Activity line chart"
          viewBox={`0 0 ${w} ${h}`}
          className="w-full h-full touch-none select-none"
          onMouseMove={onMove}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="adminChartFade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PURPLE} stopOpacity="0.12" />
              <stop offset="100%" stopColor={PURPLE} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = pad.t + innerH * t;
            return (
              <line
                key={t}
                x1={pad.l}
                x2={w - pad.r}
                y1={y}
                y2={y}
                stroke="#1a1a1a"
                strokeOpacity={0.06}
                strokeWidth={1}
              />
            );
          })}

          {fillPath ? <path d={fillPath} fill="url(#adminChartFade)" opacity={0.9} /> : null}

          {visible.products && paths.products ? (
            <path d={paths.products} fill="none" stroke={PURPLE} strokeWidth={3} strokeLinecap="round" />
          ) : null}
          {visible.leads && paths.leads ? (
            <path d={paths.leads} fill="none" stroke={ORANGE} strokeWidth={3} strokeLinecap="round" />
          ) : null}

          {tooltipIdx != null ? (
            <g>
              <line
                x1={pad.l + (innerW * (products.length <= 1 ? 0 : tooltipIdx / (products.length - 1)))}
                x2={pad.l + (innerW * (products.length <= 1 ? 0 : tooltipIdx / (products.length - 1)))}
                y1={pad.t}
                y2={pad.t + innerH}
                stroke={PURPLE}
                strokeOpacity={0.25}
                strokeWidth={1}
              />
            </g>
          ) : null}
        </svg>

        {tooltipIdx != null ? (
          <div
            className="pointer-events-none absolute z-10 rounded-2xl bg-white px-4 py-3 text-xs shadow-[0px_10px_30px_rgba(0,0,0,0.12)] border border-black/[0.06] -translate-x-1/2"
            style={{
              left: `${tooltipXFrac * 100}%`,
              top: 12,
              minWidth: 160,
            }}
          >
            <p className="font-bold text-[#1a1a1a] mb-1">{labels[tooltipIdx] ?? `Week ${tooltipIdx + 1}`}</p>
            {visible.products ? (
              <p className="text-[#1a1a1a]/70">
                Products: <span className="font-semibold" style={{ color: PURPLE }}>{products[tooltipIdx]}</span>
              </p>
            ) : null}
            {visible.leads ? (
              <p className="text-[#1a1a1a]/70">
                Leads: <span className="font-semibold" style={{ color: ORANGE }}>{leads[tooltipIdx]}</span>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  color,
  active,
  on,
}: {
  label: string;
  color: string;
  active: boolean;
  on: () => void;
}) {
  return (
    <button
      type="button"
      onClick={on}
      className="flex items-center gap-2.5 text-xs font-semibold text-[#1a1a1a]/70 hover:text-[#1a1a1a] transition-colors"
    >
      <span
        className="relative h-6 w-11 rounded-full transition-colors"
        style={{ background: active ? `${color}55` : "#E5E5EA" }}
      >
        <span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform"
          style={{
            left: active ? "calc(100% - 22px)" : 2,
            border: `2px solid ${active ? color : "#cfcfd6"}`,
          }}
        />
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
        {label}
      </span>
    </button>
  );
}
