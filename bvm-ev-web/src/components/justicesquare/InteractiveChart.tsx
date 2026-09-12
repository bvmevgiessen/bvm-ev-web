import React, { useState } from 'react';
import type { InfographicDataset } from '../../data/justiceSquare';

/**
 * Leichtgewichtiges, abhängigkeitsfreies SVG-Diagramm mit Hover-Tooltips.
 * Unterstützt Balken- und Liniendiagramme. Vollständig responsiv (viewBox).
 */
export default function InteractiveChart({ dataset }: { dataset: InfographicDataset }) {
  const [hover, setHover] = useState<number | null>(null);

  const W = 720;
  const H = 340;
  const padL = 48;
  const padR = 24;
  const padT = 28;
  const padB = 52;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const values = dataset.data.map((d) => d.value);
  const maxV = Math.max(...values);
  const niceMax = Math.ceil(maxV / 10) * 10 || 10;

  const x = (i: number) =>
    padL + (dataset.data.length === 1 ? innerW / 2 : (i * innerW) / (dataset.data.length - 1));
  const y = (v: number) => padT + innerH - (v / niceMax) * innerH;

  const gridLines = 4;

  return (
    <div className="relative w-full" data-testid={`infographic-chart-${dataset.key}`}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto select-none"
        role="img"
        aria-label={dataset.title}
      >
        {/* Y grid + labels */}
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const gy = padT + (i * innerH) / gridLines;
          const val = Math.round(niceMax - (i * niceMax) / gridLines);
          return (
            <g key={i}>
              <line x1={padL} y1={gy} x2={W - padR} y2={gy} stroke="#E2E8F0" strokeWidth={1} />
              <text x={padL - 10} y={gy + 4} textAnchor="end" className="fill-slate-400" fontSize={11} fontFamily="monospace">
                {val}
              </text>
            </g>
          );
        })}

        {/* BAR chart */}
        {dataset.type === 'bar' &&
          dataset.data.map((d, i) => {
            const barW = (innerW / dataset.data.length) * 0.56;
            const bx = padL + (i + 0.5) * (innerW / dataset.data.length) - barW / 2;
            const by = y(d.value);
            const active = hover === i;
            return (
              <rect
                key={d.label}
                x={bx}
                y={by}
                width={barW}
                height={padT + innerH - by}
                rx={6}
                fill={dataset.accent}
                opacity={hover === null || active ? 1 : 0.45}
                style={{ transition: 'opacity 200ms, y 300ms, height 300ms' }}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            );
          })}

        {/* LINE chart */}
        {dataset.type === 'line' && (
          <>
            <polyline
              fill="none"
              stroke={dataset.accent}
              strokeWidth={3}
              strokeLinejoin="round"
              strokeLinecap="round"
              points={dataset.data.map((d, i) => `${x(i)},${y(d.value)}`).join(' ')}
            />
            <polygon
              fill={dataset.accent}
              opacity={0.1}
              points={`${x(0)},${padT + innerH} ${dataset.data
                .map((d, i) => `${x(i)},${y(d.value)}`)
                .join(' ')} ${x(dataset.data.length - 1)},${padT + innerH}`}
            />
            {dataset.data.map((d, i) => {
              const active = hover === i;
              return (
                <g key={d.label}>
                  {/* invisible wide hit-area */}
                  <rect
                    x={x(i) - innerW / dataset.data.length / 2}
                    y={padT}
                    width={innerW / dataset.data.length}
                    height={innerH}
                    fill="transparent"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                  />
                  <circle
                    cx={x(i)}
                    cy={y(d.value)}
                    r={active ? 7 : 4}
                    fill="#fff"
                    stroke={dataset.accent}
                    strokeWidth={3}
                    style={{ transition: 'r 150ms' }}
                  />
                </g>
              );
            })}
          </>
        )}

        {/* X labels */}
        {dataset.data.map((d, i) => {
          const lx =
            dataset.type === 'bar'
              ? padL + (i + 0.5) * (innerW / dataset.data.length)
              : x(i);
          return (
            <text
              key={d.label}
              x={lx}
              y={H - padB + 22}
              textAnchor="middle"
              className={hover === i ? 'fill-slate-900' : 'fill-slate-500'}
              fontSize={11}
              fontWeight={hover === i ? 700 : 400}
            >
              {d.label}
            </text>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 rounded-xl bg-[#0F172A] px-4 py-2.5 text-white shadow-xl"
          data-testid="chart-tooltip"
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-slate-300">
            {dataset.data[hover].label}
          </p>
          <p className="text-lg font-bold leading-tight">
            {dataset.data[hover].value.toLocaleString('de-DE')}{' '}
            <span className="text-xs font-normal text-slate-300">{dataset.unit}</span>
          </p>
          {dataset.data[hover].note && (
            <p className="mt-0.5 text-[11px] text-amber-300">{dataset.data[hover].note}</p>
          )}
        </div>
      )}
    </div>
  );
}
