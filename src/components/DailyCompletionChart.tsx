'use client';

import { useState } from 'react';
import type { DailyCompletionPoint } from '@/lib/stats';

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
}

const WIDTH = 640;
const HEIGHT = 140;
const GAP = 4;
const CHART_TOP = 10;
const CHART_BOTTOM = HEIGHT - 22;

export function DailyCompletionChart({ data }: { data: DailyCompletionPoint[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const max = Math.max(1, ...data.map((d) => d.count));
  const barWidth = (WIDTH - GAP * (data.length - 1)) / data.length;
  const usableHeight = CHART_BOTTOM - CHART_TOP;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        role="img"
        aria-label="Son 14 günde tamamlanan görev sayısı, güne göre"
      >
        <line
          x1="0"
          y1={CHART_BOTTOM}
          x2={WIDTH}
          y2={CHART_BOTTOM}
          style={{ stroke: 'var(--border)' }}
          strokeWidth="1"
        />
        {data.map((d, i) => {
          const barHeight = d.count === 0 ? 0 : Math.max(3, (d.count / max) * usableHeight);
          const x = i * (barWidth + GAP);
          const y = CHART_BOTTOM - barHeight;
          const isHovered = hoverIndex === i;
          const showLabel = i === 0 || i === data.length - 1 || i % 3 === 0;
          return (
            <g key={d.date}>
              <rect
                x={x}
                y={CHART_TOP}
                width={barWidth}
                height={CHART_BOTTOM - CHART_TOP}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
              />
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={Math.min(4, barWidth / 2)}
                style={{ fill: isHovered ? 'var(--accent)' : 'var(--success)' }}
              />
              {showLabel && (
                <text
                  x={x + barWidth / 2}
                  y={HEIGHT - 6}
                  textAnchor="middle"
                  style={{ fill: 'var(--ink-400)', fontSize: 9 }}
                >
                  {formatDayLabel(d.date)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {hoverIndex !== null && (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 text-xs text-ink-900 shadow-sm"
          style={{
            left: `${((hoverIndex * (barWidth + GAP) + barWidth / 2) / WIDTH) * 100}%`,
            top: `${(CHART_TOP / HEIGHT) * 100}%`,
          }}
        >
          <span className="font-medium tabular-nums">{data[hoverIndex].count}</span> görev ·{' '}
          {formatDayLabel(data[hoverIndex].date)}
        </div>
      )}
    </div>
  );
}
