import React from 'react';
import {
  Layers,
  Hexagon,
  Map as MapIcon,
  Crosshair,
  Maximize2,
  Minimize2,
  RotateCcw,
  Palette,
} from 'lucide-react';
import type { ThematicLayerKey } from './mapTypes';
import { THEMATIC_LAYERS_META, THEMATIC_LAYER_GROUPS } from './mapTypes';

interface MapLayersToolbarProps {
  mapType: 'geographic' | 'hex_cartogram';
  setMapType: (t: 'geographic' | 'hex_cartogram') => void;
  hexColorMode: 'pastel' | 'vibrant';
  setHexColorMode: React.Dispatch<React.SetStateAction<'pastel' | 'vibrant'>>;
  hexZoom: number;
  hexPan: { x: number; y: number };
  handleHexReset: () => void;
  handleRecenter: () => void;
  showLayersMenu: boolean;
  setShowLayersMenu: React.Dispatch<React.SetStateAction<boolean>>;
  layersMenuRef: React.RefObject<HTMLDivElement | null>;
  showDistrictBorders: boolean;
  setShowDistrictBorders: React.Dispatch<React.SetStateAction<boolean>>;
  showDistrictLabels: boolean;
  setShowDistrictLabels: React.Dispatch<React.SetStateAction<boolean>>;
  basemap: 'light' | 'osm';
  handleBasemapChange: (bm: 'light' | 'osm') => void;
  isFullscreen: boolean;
  handleToggleFullscreen: () => void;
  thematicLayer: ThematicLayerKey;
  setThematicLayer: (layer: ThematicLayerKey) => void;
}

export const MapLayersToolbar: React.FC<MapLayersToolbarProps> = ({
  mapType,
  setMapType,
  hexColorMode,
  setHexColorMode,
  hexZoom,
  hexPan,
  handleHexReset,
  handleRecenter,
  showLayersMenu,
  setShowLayersMenu,
  layersMenuRef,
  showDistrictBorders,
  setShowDistrictBorders,
  showDistrictLabels,
  setShowDistrictLabels,
  basemap,
  handleBasemapChange,
  isFullscreen,
  handleToggleFullscreen,
  thematicLayer,
  setThematicLayer,
}) => {
  return (
    <>
      {/* Top Right: Unified Control Toolbar (Map vs Hex Mode + Quick Actions) */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
        {/* Representation Mode: Geographic Map vs Hex Cartogram Toggle */}
        <div className="bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-md flex items-center gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMapType('geographic')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              mapType === 'geographic'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Map</span>
          </button>
          <button
            type="button"
            onClick={() => setMapType('hex_cartogram')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              mapType === 'hex_cartogram'
                ? 'bg-indigo-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Hexagon className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Hex</span>
            <span className="text-[9px] bg-indigo-500/30 text-indigo-200 px-1.5 py-0.2 rounded font-mono font-bold">
              175
            </span>
          </button>
        </div>

        {/* Quick Actions (Center, Layers, Fullscreen) */}
        <div className="flex items-center gap-1.5">
          {/* Hex mode: Color Palette toggle (Pastel vs Vibrant) */}
          {mapType === 'hex_cartogram' && (
            <button
              type="button"
              onClick={() => setHexColorMode((m) => (m === 'pastel' ? 'vibrant' : 'pastel'))}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl border shadow-md flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                hexColorMode === 'pastel'
                  ? 'bg-rose-950/80 border-rose-500/50 text-rose-200 hover:bg-rose-900/80'
                  : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title={`Color Scheme: currently ${hexColorMode === 'pastel' ? 'Pastel' : 'Vibrant'} (click to toggle)`}
            >
              <Palette className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden sm:inline capitalize">{hexColorMode}</span>
            </button>
          )}

          {/* Hex mode: Reset View / Fit (when zoomed or panned) */}
          {mapType === 'hex_cartogram' && (hexZoom !== 1 || hexPan.x !== 0 || hexPan.y !== 0) && (
            <button
              type="button"
              onClick={handleHexReset}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white shadow-md flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
              title="Reset hex cartogram zoom & pan (100%)"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Reset</span>
            </button>
          )}

          {/* Re-center Button (Geographic mode only) */}
          {mapType === 'geographic' && (
            <button
              type="button"
              onClick={handleRecenter}
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white shadow-md flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
              title="Re-center map on Andhra Pradesh"
            >
              <Crosshair className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Center</span>
            </button>
          )}

          {/* Floating Layers & Settings Menu (Geographic mode only) */}
          {mapType === 'geographic' && (
            <div
              ref={layersMenuRef}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="relative"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLayersMenu((prev) => !prev);
                }}
                className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl border shadow-md flex items-center gap-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  showLayersMenu
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-500/20'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-slate-700/80 hover:text-white'
                }`}
                title="Map Overlays & Canvas"
              >
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Layers</span>
              </button>

              {/* Simple Small Popover Overlay */}
              {showLayersMenu && (
                <div className="absolute right-0 top-full mt-2 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-2xl w-60 text-xs space-y-3.5 text-slate-800 animate-in fade-in zoom-in-95 duration-150 text-left">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Map Overlays</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowLayersMenu(false)}
                      className="text-slate-400 hover:text-slate-700 text-xs font-bold p-0.5 rounded cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* District Boundaries & Labels */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      District Overlays (26 AP)
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setShowDistrictBorders(!showDistrictBorders)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          showDistrictBorders
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>Borders</span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            showDistrictBorders ? 'bg-indigo-600' : 'bg-slate-300'
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowDistrictLabels(!showDistrictLabels)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          showDistrictLabels
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <span>Names</span>
                        <span
                          className={`w-2 h-2 rounded-full ${
                            showDistrictLabels ? 'bg-indigo-600' : 'bg-slate-300'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Basemap Selection */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Basemap Canvas
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleBasemapChange('light')}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs text-center transition-all cursor-pointer ${
                          basemap === 'light'
                            ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                        title="Light Grayscale Canvas (CARTO Positron / Esri Light)"
                      >
                        Light Canvas
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBasemapChange('osm')}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs text-center transition-all cursor-pointer ${
                          basemap === 'osm'
                            ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                        title="OpenStreetMap Standard"
                      >
                        OSM
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white shadow-md flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand Fullscreen'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden md:inline">Expand</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Right: Thematic Map Overlay Layer Selector */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <div className="bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-xl flex items-center gap-2 text-xs text-white">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider hidden sm:flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Map Overlay:</span>
          </span>
          <select
            id="thematic-layer-select"
            name="thematicLayer"
            value={thematicLayer}
            onChange={(e) => setThematicLayer(e.target.value as ThematicLayerKey)}
            className="bg-slate-800 text-white font-medium rounded-lg px-2.5 py-1 text-xs border border-slate-700 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
          >
            {THEMATIC_LAYER_GROUPS.map((group) => (
              <optgroup
                key={group.id}
                label={group.label}
                className="bg-slate-950 font-bold text-slate-400 text-[10px]"
              >
                {group.keys.map((key) => {
                  const meta = THEMATIC_LAYERS_META[key];
                  if (!meta) return null;
                  return (
                    <option
                      key={key}
                      value={key}
                      className="bg-slate-900 text-white font-normal text-xs"
                    >
                      {meta.icon} {meta.label}
                    </option>
                  );
                })}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};
