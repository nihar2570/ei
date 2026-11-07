import React, { useState, useRef, useMemo } from 'react';
import { Plus, Minus, RotateCcw } from 'lucide-react';
import { ANDHRA_HEX_COORDINATES } from '../../data/hexCoordinates';
import type { ConstituencyResult, Year, ViewMode, DemographicsDataset } from '../../types';
import { getPartyColor, getPastelPartyColor } from '../../types';
import type { ThematicLayerKey } from './mapTypes';
import { THEMATIC_LAYERS_META, getDemographicColor } from './mapTypes';
import { useDashboard } from '../../context/DashboardContext';

interface HexCartogramViewProps {
  selectedAcNo: number | null;
  onSelectAc: (acNo: number) => void;
  yearResults: Record<string, ConstituencyResult>;
  viewMode: ViewMode;
  selectedYear: Year;
  demographicsData?: DemographicsDataset | null;
  thematicLayer: ThematicLayerKey;
  hexColorMode: 'pastel' | 'vibrant';
  hexZoom: number;
  hexPan: { x: number; y: number };
  setHexPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  handleHexReset: () => void;
  handleHexZoomIn: () => void;
  handleHexZoomOut: () => void;
}

export const HexCartogramView: React.FC<HexCartogramViewProps> = ({
  selectedAcNo,
  onSelectAc,
  yearResults,
  viewMode,
  selectedYear,
  demographicsData,
  thematicLayer,
  hexColorMode,
  hexZoom,
  hexPan,
  setHexPan,
  handleHexReset,
  handleHexZoomIn,
  handleHexZoomOut,
}) => {
  const { mapColorShade } = useDashboard();
  const [hoveredHexAc, setHoveredHexAc] = useState<number | null>(null);
  const [isHexDragging, setIsHexDragging] = useState<boolean>(false);
  const hexPanStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number } | null>(null);
  const didHexDragRef = useRef<boolean>(false);
  const hexContainerRef = useRef<HTMLDivElement>(null);

  // Drag Pan Handlers
  const handleHexMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    hexPanStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      panX: hexPan.x,
      panY: hexPan.y,
    };
    didHexDragRef.current = false;
    setIsHexDragging(true);
  };

  const handleHexMouseMove = (e: React.MouseEvent) => {
    if (!hexPanStartRef.current) return;
    const dx = (e.clientX - hexPanStartRef.current.clientX) / hexZoom;
    const dy = (e.clientY - hexPanStartRef.current.clientY) / hexZoom;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      didHexDragRef.current = true;
    }
    setHexPan({
      x: hexPanStartRef.current.panX + dx,
      y: hexPanStartRef.current.panY + dy,
    });
  };

  const handleHexMouseUp = () => {
    hexPanStartRef.current = null;
    setIsHexDragging(false);
  };

  // Memoized 175-Constituency Hexagon Grid Items
  const hexItems = useMemo(() => {
    return Object.entries(ANDHRA_HEX_COORDINATES).map(([acNoStr, coord]) => {
      const acNo = Number(acNoStr);
      const res = yearResults[String(acNo)];
      const acName = res?.ac_name || `AC #${acNo}`;
      const district = res?.district || '';

      // Pointy-topped hexagon center
      const cx = 45 + coord.col * 49 + (coord.row % 2 === 1 ? 24.5 : 0);
      const cy = 40 + coord.row * 41;
      const r = 24;

      // Hexagon vertices
      const points = [0, 1, 2, 3, 4, 5]
        .map((i) => {
          const angle = (Math.PI / 180) * (60 * i + 30);
          return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`;
        })
        .join(' ');

      // Determine fill, stroke and text color
      let fillColor = '#64748b';
      let strokeColor = hexColorMode === 'pastel' ? '#cbd5e1' : '#1e293b';
      let textColor = hexColorMode === 'pastel' ? '#0f172a' : '#ffffff';
      let demographicPct = 0;

      if (thematicLayer !== 'NONE' && demographicsData?.constituencies) {
        const acInfo = demographicsData.constituencies[String(acNo)];
        const casteProf = acInfo?.caste_profile as unknown as Record<string, number> | undefined;
        const ageProf = acInfo?.age_profile as unknown as Record<string, number> | undefined;
        if (casteProf && thematicLayer in casteProf) {
          demographicPct = casteProf[thematicLayer] || 0;
        } else if (ageProf && thematicLayer in ageProf) {
          demographicPct = ageProf[thematicLayer] || 0;
        }
        fillColor = getDemographicColor(demographicPct);
        strokeColor = hexColorMode === 'pastel' ? '#a5b4fc' : '#1e293b';
        textColor = demographicPct > 18 ? '#ffffff' : '#0f172a';
      } else if (res) {
        if (viewMode === 'winner') {
          if (hexColorMode === 'pastel') {
            const p = getPastelPartyColor(res.winner.party, mapColorShade);
            fillColor = p.fill;
            strokeColor = p.stroke;
            textColor = '#0f172a';
          } else {
            fillColor = getPartyColor(res.winner.party);
            strokeColor = '#1e293b';
            textColor = '#ffffff';
          }
        } else if (viewMode === 'margin') {
          const m = res.margin_pct;
          if (hexColorMode === 'pastel') {
            if (m < 5) {
              fillColor = '#fef9c3'; strokeColor = '#facc15'; textColor = '#713f12';
            } else if (m < 15) {
              fillColor = '#fed7aa'; strokeColor = '#fb923c'; textColor = '#7c2d12';
            } else if (m < 25) {
              fillColor = '#fdba74'; strokeColor = '#f97316'; textColor = '#7c2d12';
            } else {
              fillColor = '#fca5a5'; strokeColor = '#f87171'; textColor = '#7f1d1d';
            }
          } else {
            if (m < 5) fillColor = '#fef08a';
            else if (m < 15) fillColor = '#fed7aa';
            else if (m < 25) fillColor = '#fb923c';
            else fillColor = '#ea580c';
            strokeColor = '#1e293b';
            textColor = (m < 15) ? '#0f172a' : '#ffffff';
          }
        } else if (viewMode === 'swing') {
          if (!res.swing || res.swing.status === 'HOLD') {
            fillColor = hexColorMode === 'pastel' ? '#f1f5f9' : '#64748b';
            strokeColor = hexColorMode === 'pastel' ? '#cbd5e1' : '#1e293b';
            textColor = hexColorMode === 'pastel' ? '#475569' : '#ffffff';
          } else {
            if (hexColorMode === 'pastel') {
              const p = getPastelPartyColor(res.winner.party, mapColorShade);
              fillColor = p.fill;
              strokeColor = p.stroke;
              textColor = '#0f172a';
            } else {
              fillColor = getPartyColor(res.winner.party);
              strokeColor = '#1e293b';
              textColor = '#ffffff';
            }
          }
        } else if (viewMode === 'district') {
          fillColor = hexColorMode === 'pastel' ? '#e2e8f0' : '#475569';
          strokeColor = hexColorMode === 'pastel' ? '#94a3b8' : '#1e293b';
          textColor = hexColorMode === 'pastel' ? '#0f172a' : '#ffffff';
        }
      }

      return {
        acNo,
        acName,
        district,
        cx,
        cy,
        points,
        fillColor,
        strokeColor,
        textColor,
        demographicPct,
        res,
      };
    });
  }, [yearResults, viewMode, thematicLayer, demographicsData, hexColorMode, mapColorShade]);

  const hoveredItem = useMemo(() => {
    if (!hoveredHexAc) return null;
    return hexItems.find((h) => h.acNo === hoveredHexAc);
  }, [hoveredHexAc, hexItems]);

  return (
    <div
      ref={hexContainerRef}
      className="absolute inset-0 z-[500] flex flex-col items-center justify-center p-3 bg-white select-none overflow-hidden"
    >
      <svg
        className="w-full h-full max-w-[760px] max-h-[620px] select-none"
        viewBox="0 0 650 575"
        onMouseDown={handleHexMouseDown}
        onMouseMove={handleHexMouseMove}
        onMouseUp={handleHexMouseUp}
        onMouseLeave={handleHexMouseUp}
        style={{ cursor: isHexDragging ? 'grabbing' : hexZoom > 1 ? 'grab' : 'default' }}
      >
        <defs>
          {/* Subtle background dot grid pattern */}
          <pattern id="hex-dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.9" fill="#e2e8f0" />
          </pattern>
        </defs>

        {/* Background texture */}
        <rect width="650" height="575" fill="url(#hex-dot-grid)" />

        {/* Scaled & Translated Hex Grid Group */}
        <g transform={`translate(${325 + hexPan.x}, ${287.5 + hexPan.y}) scale(${hexZoom}) translate(-325, -287.5)`}>
          {hexItems.map((item) => {
            const isSelected = selectedAcNo === item.acNo;
            const isHovered = hoveredHexAc === item.acNo;
            const shortName = item.acName.replace(/\s*\(.*\)/, '').slice(0, 7);

            return (
              <g
                key={item.acNo}
                onClick={(e) => {
                  e.stopPropagation();
                  if (didHexDragRef.current) return;
                  onSelectAc(item.acNo);
                }}
                onMouseEnter={() => setHoveredHexAc(item.acNo)}
                onMouseLeave={() => setHoveredHexAc(null)}
                className="cursor-pointer transition-transform duration-150"
              >
                {/* Glowing selection outline */}
                {isSelected && (
                  <polygon
                    points={item.points}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="5"
                    strokeOpacity="0.8"
                    className="animate-pulse"
                  />
                )}

                {/* Base Hexagon Tile */}
                <polygon
                  points={item.points}
                  fill={item.fillColor}
                  stroke={
                    isSelected
                      ? '#2563eb'
                      : isHovered
                      ? (hexColorMode === 'pastel' ? '#0f172a' : '#ffffff')
                      : item.strokeColor
                  }
                  strokeWidth={isSelected ? 3 : isHovered ? 2.2 : 1.3}
                  fillOpacity={isHovered ? 1 : 0.95}
                  style={{
                    transition: 'stroke 0.15s ease, stroke-width 0.15s ease',
                  }}
                />

                {/* AC Number */}
                <text
                  x={item.cx}
                  y={item.cy - 7}
                  fill={item.textColor}
                  opacity={0.7}
                  fontSize="7"
                  fontWeight="bold"
                  fontFamily="monospace"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  #{item.acNo}
                </text>

                {/* AC Short Name */}
                <text
                  x={item.cx}
                  y={item.cy + 2.5}
                  fill={item.textColor}
                  fontSize="7.5"
                  fontWeight="bold"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {shortName}
                </text>

                {/* Value Line: Party or Demographic % */}
                <text
                  x={item.cx}
                  y={item.cy + 12}
                  fill={item.textColor}
                  fontSize="7"
                  fontWeight="800"
                  fontFamily={thematicLayer !== 'NONE' ? 'monospace' : 'sans-serif'}
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {thematicLayer !== 'NONE'
                    ? `${item.demographicPct}%`
                    : item.res?.winner.party || 'OTH'}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Hex Cartogram Floating Zoom Controls (Top Left) */}
      <div className="absolute top-3 left-3 z-[1000] flex flex-col rounded-xl overflow-hidden shadow-md border border-slate-200 bg-white/95 backdrop-blur-md">
        <button
          type="button"
          onClick={handleHexZoomIn}
          className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-indigo-600 hover:bg-slate-100 border-b border-slate-200 transition-colors cursor-pointer"
          title="Zoom In (+)"
          aria-label="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
        <div
          className="text-[10px] font-mono font-bold text-slate-600 text-center py-1 select-none border-b border-slate-200 bg-slate-50/80"
          title="Current zoom level"
        >
          {Math.round(hexZoom * 100)}%
        </div>
        <button
          type="button"
          onClick={handleHexZoomOut}
          className="w-8 h-8 flex items-center justify-center text-slate-700 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Zoom Out (-)"
          aria-label="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
        {(hexZoom !== 1 || hexPan.x !== 0 || hexPan.y !== 0) && (
          <button
            type="button"
            onClick={handleHexReset}
            className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border-t border-slate-200 transition-colors cursor-pointer"
            title="Reset Zoom & Pan (100%)"
            aria-label="Reset zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Hex Cartogram Hovered AC HUD */}
      {hoveredItem && (
        <div className="absolute top-16 right-3 bg-white p-3.5 rounded-xl border border-slate-300 shadow-2xl z-[1000] text-xs text-slate-800 space-y-1.5 min-w-[220px] pointer-events-none transition-all">
          <div className="font-bold border-b border-slate-100 pb-1.5 flex items-center justify-between">
            <span className="text-slate-900 flex items-center gap-1.5">
              <span className="font-mono text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px] font-black">
                #{hoveredItem.acNo}
              </span>
              <span>{hoveredItem.acName}</span>
            </span>
            <span className="text-[10px] text-slate-500 font-normal">{hoveredItem.district}</span>
          </div>
          <div className="flex items-center justify-between pt-0.5 text-[11px]">
            <span className="text-slate-500">Winner ({selectedYear}):</span>
            <span className="font-bold flex items-center gap-1" style={{ color: getPartyColor(hoveredItem.res?.winner.party || '') }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getPartyColor(hoveredItem.res?.winner.party || '') }} />
              {hoveredItem.res?.winner.party} ({hoveredItem.res?.winner.candidate})
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-600">
            <span>Margin:</span>
            <span className="font-mono font-semibold text-slate-900">
              +{hoveredItem.res?.margin.toLocaleString()} ({hoveredItem.res?.margin_pct}%)
            </span>
          </div>
          {thematicLayer !== 'NONE' && (
            <div className="mt-1 pt-1 border-t border-slate-100 flex items-center justify-between text-indigo-700 font-bold">
              <span>{THEMATIC_LAYERS_META[thematicLayer].label}:</span>
              <span className="font-mono">{hoveredItem.demographicPct}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
