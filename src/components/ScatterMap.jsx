import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { CATEGORY_CONFIG } from '../constants';

const PAD = { top: 56, right: 32, bottom: 64, left: 72 };
const MIN_R = 5;
const MAX_R = 20;
const FONT_SIZE = 10;
const LINE_H = 13;   // approximate label height
const CHAR_W = 5.6;  // approximate char width at fontSize 10
const DOT_PAD = 4;   // gap between dot edge and label

function dotRadius(employees = 100) {
  const minLog = Math.log10(10);
  const maxLog = Math.log10(450000);
  const t = Math.max(0, Math.min(1, (Math.log10(employees) - minLog) / (maxLog - minLog)));
  return MIN_R + t * (MAX_R - MIN_R);
}

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

// Compute label positions with iterative collision avoidance.
// Returns a map of { [name]: { lx, ly, anchor, cx, cy } }
function computeLabelPositions(companies, plotW, plotH) {
  if (plotW <= 0 || plotH <= 0) return {};

  const labels = companies.map((c) => {
    const cx = PAD.left + c.x * plotW;
    const cy = PAD.top + (1 - c.y) * plotH;
    const r = dotRadius(c.employees);
    const goRight = cx < PAD.left + plotW * 0.72;
    const lx = goRight ? cx + r + DOT_PAD : cx - r - DOT_PAD;
    const textW = c.name.length * CHAR_W;
    return { name: c.name, cx, cy, lx, ly: cy, textW, goRight };
  });

  // Iteratively push overlapping labels apart (vertical only)
  for (let iter = 0; iter < 50; iter++) {
    let moved = false;
    for (let i = 0; i < labels.length; i++) {
      for (let j = i + 1; j < labels.length; j++) {
        const a = labels[i];
        const b = labels[j];

        // Horizontal extent of each label box
        const aL = a.goRight ? a.lx : a.lx - a.textW;
        const aR = a.goRight ? a.lx + a.textW : a.lx;
        const bL = b.goRight ? b.lx : b.lx - b.textW;
        const bR = b.goRight ? b.lx + b.textW : b.lx;

        // Skip if no horizontal overlap (with 2px slop)
        if (aR + 2 < bL || bR + 2 < aL) continue;

        // Vertical overlap
        const aTop = a.ly - LINE_H;
        const bTop = b.ly - LINE_H;
        const overlap = Math.min(a.ly, b.ly) - Math.max(aTop, bTop);
        if (overlap <= 1) continue;

        // Push the two labels apart by half the overlap each
        const push = (overlap + 2) / 2;
        if (a.cy <= b.cy) {
          a.ly -= push;
          b.ly += push;
        } else {
          a.ly += push;
          b.ly -= push;
        }
        moved = true;
      }
    }
    if (!moved) break;
  }

  return Object.fromEntries(labels.map((l) => [l.name, l]));
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

  const labelPositions = useMemo(
    () => computeLabelPositions(companies, plotW, plotH),
    [companies, plotW, plotH]
  );

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
        <text x={PAD.left + 10} y={PAD.top + 16} fontSize={10} fill="#9ca3af" fontStyle="italic" className="dark:fill-gray-500">finance / insurance</text>
        <text x={PAD.left + 10} y={PAD.top + 29} fontSize={10} fill="#9ca3af" fontStyle="italic" className="dark:fill-gray-500">applied science</text>
        <text x={PAD.left + plotW - 10} y={PAD.top + 16} fontSize={10} fill="#9ca3af" fontStyle="italic" textAnchor="end" className="dark:fill-gray-500">research / EO</text>
        <text x={PAD.left + plotW - 10} y={PAD.top + 29} fontSize={10} fill="#9ca3af" fontStyle="italic" textAnchor="end" className="dark:fill-gray-500">deep science</text>
        <text x={PAD.left + 10} y={PAD.top + plotH - 18} fontSize={10} fill="#9ca3af" fontStyle="italic" className="dark:fill-gray-500">low finance</text>
        <text x={PAD.left + 10} y={PAD.top + plotH - 7} fontSize={10} fill="#9ca3af" fontStyle="italic" className="dark:fill-gray-500">applied science</text>
        <text x={PAD.left + plotW - 10} y={PAD.top + plotH - 18} fontSize={10} fill="#9ca3af" fontStyle="italic" textAnchor="end" className="dark:fill-gray-500">research / EO</text>
        <text x={PAD.left + plotW - 10} y={PAD.top + plotH - 7} fontSize={10} fill="#9ca3af" fontStyle="italic" textAnchor="end" className="dark:fill-gray-500">low finance</text>

        {/* Axis labels */}
        <text x={PAD.left + 8} y={PAD.top - 8} fontSize={11} fill="#6b7280" className="dark:fill-gray-400">applied</text>
        <text x={PAD.left + plotW - 8} y={PAD.top - 8} fontSize={11} fill="#6b7280" textAnchor="end" className="dark:fill-gray-400">research</text>
        <text x={midX} y={PAD.top - 8} fontSize={11} fill="#6b7280" textAnchor="middle" fontWeight="500" className="dark:fill-gray-300">Scientific depth</text>
        <text x={PAD.left + 8} y={PAD.top + plotH + 18} fontSize={10} fill="#9ca3af" className="dark:fill-gray-500">more applied / industry</text>
        <text x={PAD.left + plotW - 8} y={PAD.top + plotH + 18} fontSize={10} fill="#9ca3af" textAnchor="end" className="dark:fill-gray-500">more scientific / research</text>
        <text x={PAD.left - 10} y={PAD.top + 4} fontSize={11} fill="#6b7280" textAnchor="end" className="dark:fill-gray-400">high</text>
        <text x={PAD.left - 10} y={PAD.top + plotH + 4} fontSize={11} fill="#6b7280" textAnchor="end" className="dark:fill-gray-400">low</text>
        <text
          x={18} y={PAD.top + plotH / 2}
          fontSize={11} fill="#6b7280" textAnchor="middle"
          transform={`rotate(-90, 18, ${PAD.top + plotH / 2})`}
          className="dark:fill-gray-400"
        >
          Insurance/finance focus
        </text>

        {/* Connector lines (drawn below dots) */}
        {companies.map((c) => {
          const lpos = labelPositions[c.name];
          if (!lpos) return null;
          const displaced = Math.abs(lpos.ly - lpos.cy) > 10;
          if (!displaced) return null;
          const cfg = CATEGORY_CONFIG[c.category];
          // Line from dot edge toward label
          const angle = Math.atan2(lpos.ly - lpos.cy, lpos.lx - lpos.cx);
          const r = dotRadius(c.employees);
          const x1 = lpos.cx + Math.cos(angle) * (r + 2);
          const y1 = lpos.cy + Math.sin(angle) * (r + 2);
          return (
            <line
              key={`line-${c.name}`}
              x1={x1} y1={y1} x2={lpos.lx} y2={lpos.ly - 3}
              stroke={cfg.color} strokeWidth={0.75} opacity={0.35}
              strokeDasharray="2 2"
            />
          );
        })}

        {/* Company dots + labels */}
        {companies.map((c) => {
          const cx = toSvgX(c.x);
          const cy = toSvgY(c.y);
          const cfg = CATEGORY_CONFIG[c.category];
          const isSelected = selected?.name === c.name;
          const isHovered = hovered?.name === c.name;
          const baseR = dotRadius(c.employees);
          const r = isSelected ? baseR + 3 : isHovered ? baseR + 2 : baseR;

          const lpos = labelPositions[c.name];
          const labelX = lpos ? lpos.lx : cx + r + DOT_PAD;
          const labelY = lpos ? lpos.ly : cy;
          const labelAnchor = lpos ? (lpos.goRight ? 'start' : 'end') : 'start';

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
                y={labelY}
                fontSize={isSelected || isHovered ? 11 : FONT_SIZE}
                fontWeight={isSelected || isHovered ? '600' : '400'}
                fill={isSelected || isHovered ? '#111827' : '#374151'}
                textAnchor={labelAnchor}
                className="pointer-events-none dark:fill-gray-200"
                style={{ userSelect: 'none' }}
              >
                {c.name}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Bottom hint + size legend */}
      <div className="flex items-center justify-between mt-1 px-1">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Click any company to see details.
        </p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 dark:text-gray-500">employees</span>
          {[['~50', 50], ['~500', 500], ['~5k', 5000], ['~50k', 50000]].map(([label, n]) => (
            <div key={label} className="flex items-center gap-1">
              <svg width={dotRadius(n) * 2 + 2} height={dotRadius(n) * 2 + 2}>
                <circle
                  cx={dotRadius(n) + 1} cy={dotRadius(n) + 1} r={dotRadius(n)}
                  fill="none" stroke="#9ca3af" strokeWidth={1.5}
                />
              </svg>
              <span className="text-xs text-gray-400 dark:text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
