import { useState, useRef, useEffect, useCallback } from 'react';
import { CATEGORY_CONFIG } from '../constants';

const PAD = { top: 56, right: 32, bottom: 64, left: 72 };
const DOT_R = 9;

function useSize(ref) {
  const [size, setSize] = useState({ w: 700, h: 520 });
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

  const plotW = w - PAD.left - PAD.right;
  const plotH = h - PAD.top - PAD.bottom;

  const toSvgX = (x) => PAD.left + x * plotW;
  const toSvgY = (y) => PAD.top + (1 - y) * plotH;

  const handleMouseEnter = useCallback((company) => setHovered(company), []);
  const handleMouseLeave = useCallback(() => setHovered(null), []);

  const midX = PAD.left + plotW / 2;
  const midY = PAD.top + plotH / 2;

  return (
    <div ref={containerRef} className="relative w-full h-full select-none">
      <svg width={w} height={h} className="overflow-visible">

        {/* Plot background */}
        <rect
          x={PAD.left} y={PAD.top} width={plotW} height={plotH}
          fill="white" stroke="#e5e7eb" strokeWidth={1}
          className="dark:fill-gray-900 dark:stroke-gray-700"
        />

        {/* Quadrant dividers */}
        <line x1={midX} x2={midX} y1={PAD.top} y2={PAD.top + plotH}
          stroke="#d1d5db" strokeWidth={1} strokeDasharray="4 3"
          className="dark:stroke-gray-600" />
        <line x1={PAD.left} x2={PAD.left + plotW} y1={midY} y2={midY}
          stroke="#d1d5db" strokeWidth={1} strokeDasharray="4 3"
          className="dark:stroke-gray-600" />

        {/* Quadrant corner labels */}
        {/* Top-left */}
        <text x={PAD.left + 10} y={PAD.top + 16} fontSize={10} fill="#9ca3af" fontStyle="italic" className="dark:fill-gray-500">finance / insurance</text>
        <text x={PAD.left + 10} y={PAD.top + 29} fontSize={10} fill="#9ca3af" fontStyle="italic" className="dark:fill-gray-500">applied science</text>
        {/* Top-right */}
        <text x={PAD.left + plotW - 10} y={PAD.top + 16} fontSize={10} fill="#9ca3af" fontStyle="italic" textAnchor="end" className="dark:fill-gray-500">research / EO</text>
        <text x={PAD.left + plotW - 10} y={PAD.top + 29} fontSize={10} fill="#9ca3af" fontStyle="italic" textAnchor="end" className="dark:fill-gray-500">deep science</text>
        {/* Bottom-left */}
        <text x={PAD.left + 10} y={PAD.top + plotH - 18} fontSize={10} fill="#9ca3af" fontStyle="italic" className="dark:fill-gray-500">low finance</text>
        <text x={PAD.left + 10} y={PAD.top + plotH - 7} fontSize={10} fill="#9ca3af" fontStyle="italic" className="dark:fill-gray-500">applied science</text>
        {/* Bottom-right */}
        <text x={PAD.left + plotW - 10} y={PAD.top + plotH - 18} fontSize={10} fill="#9ca3af" fontStyle="italic" textAnchor="end" className="dark:fill-gray-500">research / EO</text>
        <text x={PAD.left + plotW - 10} y={PAD.top + plotH - 7} fontSize={10} fill="#9ca3af" fontStyle="italic" textAnchor="end" className="dark:fill-gray-500">low finance</text>

        {/* X axis top labels */}
        <text x={PAD.left + 8} y={PAD.top - 8} fontSize={11} fill="#6b7280" className="dark:fill-gray-400">applied</text>
        <text x={PAD.left + plotW - 8} y={PAD.top - 8} fontSize={11} fill="#6b7280" textAnchor="end" className="dark:fill-gray-400">research</text>
        <text x={midX} y={PAD.top - 8} fontSize={11} fill="#6b7280" textAnchor="middle" fontWeight="500" className="dark:fill-gray-300">Scientific depth</text>

        {/* X axis bottom labels */}
        <text x={PAD.left + 8} y={PAD.top + plotH + 18} fontSize={10} fill="#9ca3af" className="dark:fill-gray-500">more applied / industry</text>
        <text x={PAD.left + plotW - 8} y={PAD.top + plotH + 18} fontSize={10} fill="#9ca3af" textAnchor="end" className="dark:fill-gray-500">more scientific / research</text>

        {/* Y axis labels */}
        <text x={PAD.left - 10} y={PAD.top + 4} fontSize={11} fill="#6b7280" textAnchor="end" className="dark:fill-gray-400">high</text>
        <text x={PAD.left - 10} y={PAD.top + plotH + 4} fontSize={11} fill="#6b7280" textAnchor="end" className="dark:fill-gray-400">low</text>
        <text
          x={18}
          y={PAD.top + plotH / 2}
          fontSize={11} fill="#6b7280" textAnchor="middle"
          transform={`rotate(-90, 18, ${PAD.top + plotH / 2})`}
          className="dark:fill-gray-400"
        >
          Insurance/finance focus
        </text>

        {/* Company dots + labels */}
        {companies.map((c, i) => {
          const cx = toSvgX(c.x);
          const cy = toSvgY(c.y);
          const cfg = CATEGORY_CONFIG[c.category];
          const isSelected = selected?.name === c.name;
          const isHovered = hovered?.name === c.name;
          const r = isSelected ? DOT_R + 3 : isHovered ? DOT_R + 2 : DOT_R;

          // Alternate label above/below dot to reduce overlap in dense clusters
          const labelRight = cx < PAD.left + plotW * 0.72;
          const labelX = labelRight ? cx + r + 4 : cx - r - 4;
          const labelAnchor = labelRight ? 'start' : 'end';
          // Stagger vertical offset by index to spread overlapping labels
          const yOffset = (i % 2 === 0) ? 4 : -3;

          return (
            <g key={c.name}>
              {(isSelected || isHovered) && (
                <circle cx={cx} cy={cy} r={r + 5} fill={cfg.color} opacity={0.15} />
              )}
              <circle
                cx={cx} cy={cy} r={r}
                fill={cfg.color}
                opacity={isSelected ? 1 : 0.85}
                stroke={isSelected ? 'white' : isHovered ? 'white' : 'rgba(255,255,255,0.4)'}
                strokeWidth={isSelected ? 2.5 : 1.5}
                className="cursor-pointer transition-all duration-100"
                onMouseEnter={() => handleMouseEnter(c)}
                onMouseLeave={handleMouseLeave}
                onClick={() => onSelect(isSelected ? null : c)}
              />
              <text
                x={labelX}
                y={cy + yOffset}
                fontSize={isSelected || isHovered ? 11 : 10}
                fontWeight={isSelected || isHovered ? '600' : '400'}
                fill={isSelected || isHovered ? '#111827' : '#374151'}
                textAnchor={labelAnchor}
                className="cursor-pointer pointer-events-none dark:fill-gray-200"
                style={{ userSelect: 'none' }}
              >
                {c.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Bottom hint */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 px-1">
        Haz click en cualquier empresa para ver detalles.
      </p>
    </div>
  );
}
