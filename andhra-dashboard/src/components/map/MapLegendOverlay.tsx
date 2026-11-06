import React from 'react';
import type { ViewMode } from '../../types';
import { getPastelPartyColor } from '../../types';
import type { ThematicLayerKey } from './mapTypes';
import { THEMATIC_LAYERS_META } from './mapTypes';

interface MapLegendOverlayProps {
  thematicLayer: ThematicLayerKey;
  viewMode: ViewMode;
  mapType: 'geographic' | 'hex_cartogram';
  hexColorMode: 'pastel' | 'vibrant';
  showDistrictBorders: boolean;
}

export const MapLegendOverlay: React.FC<MapLegendOverlayProps> = ({
  thematicLayer,
  viewMode,
  mapType,
  hexColorMode,
  showDistrictBorders,
}) => {
  return (
    <div className="absolute bottom-4 left-4 bg-white/75 hover:bg-white/98 opacity-60 hover:opacity-100 backdrop-blur-md p-3 rounded-xl shadow-xs hover:shadow-xl border border-slate-200/80 hover:border-slate-300 transition-all duration-300 z-[1000] text-xs group cursor-default select-none">
      {thematicLayer !== 'NONE' ? (
        <div className="space-y-1.5 min-w-[210px]">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <span>{THEMATIC_LAYERS_META[thematicLayer].icon}</span>
            <span>{THEMATIC_LAYERS_META[thematicLayer].label} Density</span>
          </div>
          <p className="text-[10px] text-slate-500">{THEMATIC_LAYERS_META[thematicLayer].description}</p>
          <div className="grid grid-cols-6 gap-1 pt-1 text-[9px] text-center font-mono">
            <div>
              <div className="h-3 rounded-xs bg-[#f1f5f9] border border-slate-300" />
              <span className="text-slate-500">&lt;5%</span>
            </div>
            <div>
              <div className="h-3 rounded-xs bg-[#c7d2fe]" />
              <span className="text-slate-600">5-10%</span>
            </div>
            <div>
              <div className="h-3 rounded-xs bg-[#818cf8]" />
              <span className="text-slate-600">10-15%</span>
            </div>
            <div>
              <div className="h-3 rounded-xs bg-[#6366f1]" />
              <span className="text-slate-700">15-20%</span>
            </div>
            <div>
              <div className="h-3 rounded-xs bg-[#4f46e5]" />
              <span className="text-white bg-indigo-900 rounded-xs px-0.5">20-25%</span>
            </div>
            <div>
              <div className="h-3 rounded-xs bg-[#312e81]" />
              <span className="text-indigo-950 font-bold">&gt;25%</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="font-semibold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
            {viewMode === 'winner' && 'Party Legend'}
            {viewMode === 'margin' && 'Victory Margin'}
            {viewMode === 'swing' && 'Seat Swings & Holds'}
            {viewMode === 'district' && '26 Districts'}
          </div>

          {viewMode === 'district' && (
            <div className="space-y-1.5 max-w-[210px]">
              <p className="text-[11px] text-slate-600 leading-tight">
                Constituencies mapped into Andhra Pradesh&apos;s <span className="font-bold text-slate-800">26 reorganized districts</span>, shaded in distinct tones of grey.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-3.5 h-3.5 rounded-xs bg-[#e2e8f0] border border-slate-300" />
                <span className="w-3.5 h-3.5 rounded-xs bg-[#cbd5e1] border border-slate-400" />
                <span className="w-3.5 h-3.5 rounded-xs bg-[#94a3b8] border border-slate-500" />
                <span className="w-3.5 h-3.5 rounded-xs bg-[#64748b] border border-slate-600" />
                <span className="w-3.5 h-3.5 rounded-xs bg-[#475569] border border-slate-700" />
                <span className="text-[10px] text-slate-500 font-medium ml-0.5">26 Shades</span>
              </div>
            </div>
          )}

          {viewMode === 'winner' && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {(() => {
                const isPastel = mapType === 'hex_cartogram' && hexColorMode === 'pastel';
                const parties = [
                  { code: 'TDP', label: 'TDP', solid: '#eab308' },
                  { code: 'YSRCP', label: 'YSRCP', solid: '#1d4ed8' },
                  { code: 'JSP', label: 'Janasena (JSP)', solid: '#dc2626' },
                  { code: 'BJP', label: 'BJP', solid: '#f97316' },
                  { code: 'INC', label: 'INC (Congress)', solid: '#0284c7' },
                  { code: 'OTH', label: 'IND / Others', solid: '#64748b' },
                ];

                return parties.map((p) => {
                  const pastel = getPastelPartyColor(p.code);
                  return (
                    <div key={p.code} className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-xs"
                        style={{
                          backgroundColor: isPastel ? pastel.fill : p.solid,
                          border: isPastel ? `1px solid ${pastel.stroke}` : undefined,
                        }}
                      />
                      <span className="font-medium">{p.label}</span>
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {viewMode === 'margin' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#fef08a]" />
                <span>&lt; 5% (Battleground)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#fed7aa]" />
                <span>5% – 15% (Moderate)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#fb923c]" />
                <span>15% – 25% (Comfortable)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#ea580c]" />
                <span>&gt; 25% (Landslide)</span>
              </div>
            </div>
          )}

          {viewMode === 'swing' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#64748b]" />
                <span>Held by Incumbent Party</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#0284c7]" />
                <span>Flipped / Gained (Party Color)</span>
              </div>
            </div>
          )}

          {/* Boundary Legend */}
          {showDistrictBorders && (
            <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between gap-3 text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-4 h-[2px] bg-slate-500 rounded-full" />
                District Borders (Grey)
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-4 h-[1.5px] bg-white border border-slate-300 rounded-full" />
                AC Divider
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
