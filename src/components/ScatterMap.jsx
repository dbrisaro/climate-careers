import { useState, useRef, useEffect, useCallback } from 'react';
import { CATEGORY_CONFIG } from '../constants';

const PAD = { top: 36, right: 24, bottom: 48, left: 56 };

function useSize(ref) {
  const [size, setSize] = useState({ w: 600, h: 480 });
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => {
      setSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

export default function ScatterMap({ companies, selected, onSelect }) {
  const containerRef = useRef(null);
  const { w, h } = useSize(containerRef);
  const [hovered, setHovered] = useState(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0 });

  const plotW = w - PAD.left - PAD.right;
  const plotH = h - PAD.top - PAD.bottom;

  const toSvgX = (x) => PAD.left + x * plotW;
  const toSvgY = (y) => PAD.top + (1 - y) * plotH;

  const handleMouseMove = useCallback((e, company) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setHovered(company);
  }, []);

  const xTicks = [0, 0.25, 0.5, 0.75, 1];
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div ref={containerRef} className="relative w-full h-full select-none">
      <svg
        width={w}
        height={h}
        className="overflow-visible"
        onMouseLeave={() => setHovered(null)}
      >
        {/* Grid lines */}
        {xTicks.map((t) => (
          <line
            key={`gx${t}`}
            x1={toSvgX(t)}
            x2={toSvgX(t)}
            y1={PAD.top}
            y2={PAD.top + plotH}
            stroke="currentColor"
            strokeOpacity={0.08}
            strokeWidth={1}
            className="text-gray-500"
          />
        ))}
        {yTicks.map((t) => (
          <line
            key={`gy${t}`}
            x1={PAD.left}
            x2={PAD.left + plotW}
            y1={toSvgY(t)}
            y2={toSvgY(t)}
            stroke="currentColor"
            strokeOpacity={0.08}
            strokeWidth={1}
            className="text-gray-500"
          />
        ))}

        {/* Axes */}
        <line x1={PAD.left} x2={PAD.left + plotW} y1={PAD.top + plotH} y2={PAD.top + plotH}
          stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} className="text-gray-500" />
        <line x1={PAD.left} x2={PAD.left} y1={PAD.top} y2={PAD.top + plotH}
          stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} className="text-gray-500" />

        {/* X axis label */}
        <text
          x={PAD.left + plotW / 2}
          y={h - 6}
          textAnchor="middle"
          fontSize={11}
          className="fill-gray-400"
        >
          ← Applied / Industry &nbsp;&nbsp; Scientific depth &nbsp;&nbsp; Research / Deep science →
        </text>

        {/* Y axis label */}
        <text
          x={13}
          y={PAD.top + plotH / 2}
          textAnchor="middle"
          fontSize={11}
          transform={`rotate(-90, 13, ${PAD.top + plotH / 2})`}
          className="fill-gray-400"
        >
          Insurance & Finance orientation →
        </text>

        {/* Corner labels */}
        <text x={PAD.left + 4} y={PAD.top - 8} fontSize={9} className="fill-gray-300 dark:fill-gray-600">High finance</text>
        <text x={PAD.left + plotW - 4} y={PAD.top - 8} fontSize={9} textAnchor="end" className="fill-gray-300 dark:fill-gray-600">Science + finance</text>
        <text x={PAD.left + 4} y={PAD.top + plotH + 16} fontSize={9} className="fill-gray-300 dark:fill-gray-600">Low finance</text>
        <text x={PAD.left + plotW - 4} y={PAD.top + plotH + 16} fontSize={9} textAnchor="end" className="fill-gray-300 dark:fill-gray-600">Pure science</text>

        {/* Company dots */}
        {companies.map((c) => {
          const cx = toSvgX(c.x);
          const cy = toSvgY(c.y);
          const cfg = CATEGORY_CONFIG[c.category];
          const isSelected = selected?.name === c.name;
          const isHovered = hovered?.name === c.name;
          const r = isSelected ? 10 : isHovered ? 9 : 7;

          return (
            <g key={c.name}>
              {(isSelected || isHovered) && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={r + 4}
                  fill={cfg.color}
                  opacity={0.15}
                />
              )}
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={cfg.color}
                opacity={isSelected ? 1 : isHovered ? 0.9 : 0.75}
                stroke={isSelected ? 'white' : 'transparent'}
                strokeWidth={2}
                className="cursor-pointer transition-all duration-100"
                onMouseMove={(e) => handleMouseMove(e, c)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect(isSelected ? null : c)}
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div
          className="pointer-events-none absolute z-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-3 py-2 text-sm max-w-56"
          style={{
            left: Math.min(tooltip.x + 12, w - 230),
            top: Math.max(tooltip.y - 40, 4),
          }}
        >
          <p className="font-semibold text-gray-900 dark:text-gray-50">{hovered.name}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 leading-snug line-clamp-2">
            {hovered.description}
          </p>
          <div className="flex gap-0.5 mt-1">
            {[1,2,3,4,5].map(i => (
              <span key={i} className={`text-xs ${i <= hovered.fit ? 'text-amber-400' : 'text-gray-200 dark:text-gray-700'}`}>★</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
