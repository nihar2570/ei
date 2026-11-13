import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import * as turf from '@turf/turf';
import {
  RotateCcw,
  Target,
  X,
  Users,
  Compass,
  FileText,
  Maximize2,
  Minimize2,
  ShieldAlert,
  Vote,
  Heart,
} from 'lucide-react';
import type { BoothDetail } from './BoothPannaDeficitSolver';
import { FORM_20_URLS } from '../data/form20Urls';
import { getOfficialSir2026PdfUrl } from '../data/voterRollService';

export type MapLayerMode = 'political' | 'panna' | 'gender';

export interface BoothTriageMapProps {
  acNo: number;
  acName: string;
  district: string;
  targetParty: string;
  booths: BoothDetail[];
  geoJsonData?: any;
  selectedTriageCategory?: 'battleground' | 'fortress' | 'vulnerable' | 'hostile' | 'all' | null;
  onSelectTriageCategory?: (cat: 'battleground' | 'fortress' | 'vulnerable' | 'hostile' | 'all') => void;
  selectedBoothNo?: number | null;
  onSelectBooth?: (booth: BoothDetail | null) => void;
  onViewVoterRoll?: (booth: BoothDetail) => void;
  onOpenStandaloneBooth?: (booth: BoothDetail) => void;
  theme?: 'dark' | 'light';
  onThemeChange?: (theme: 'dark' | 'light') => void;
  isFullPageMap?: boolean;
}

export const BoothTriageMap: React.FC<BoothTriageMapProps> = ({
  acNo,
  acName,
  district: _district,
  targetParty,
  booths,
  geoJsonData,
  selectedBoothNo,
  onSelectBooth,
  onViewVoterRoll,
  onOpenStandaloneBooth,
  theme: controlledTheme,
  isFullPageMap = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const boundaryLayerRef = useRef<L.GeoJSON | null>(null);
  const mandalLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const beaconLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersByBoothRef = useRef<Map<number, L.CircleMarker>>(new Map());
  const prevActiveBoothNoRef = useRef<number | null>(null);
  const activeBoothRef = useRef<BoothDetail | null>(null);

  const isLight = controlledTheme === 'light';

  // Active Map Layer Mode: 2024 Political Triage vs 2026 Panna Load vs 2026 Mahila Focus
  const [mapLayerMode, setMapLayerMode] = useState<MapLayerMode>('political');

  // Mandal lines overlay visibility toggle
  const [showMandalLines, setShowMandalLines] = useState<boolean>(true);
  // SVI (Sensitive & Intimidation Vulnerability Index) filter toggle
  const [sviFilterOnly, setSviFilterOnly] = useState<boolean>(false);

  // Active / Clicked Booth for detail inspection drawer
  const [activeBooth, setActiveBooth] = useState<BoothDetail | null>(null);
  activeBoothRef.current = activeBooth;

  // Sync with selectedBoothNo prop if passed
  useEffect(() => {
    if (selectedBoothNo) {
      const match = booths.find((b) => b.boothNo === selectedBoothNo);
      if (match) setActiveBooth(match);
    }
  }, [selectedBoothNo, booths]);

  // Extract AC polygon feature from geoJsonData
  const acFeature = useMemo(() => {
    if (!geoJsonData || !geoJsonData.features) return null;
    return (
      geoJsonData.features.find((f: any) => {
        const props = f.properties || {};
        const pAcNo = props.AC_NO ?? props.ac_no ?? props.ac ?? props.ID;
        return Number(pAcNo) === Number(acNo);
      }) || null
    );
  }, [geoJsonData, acNo]);

  // Group booths by Mandal to compute mandal centroids and boundaries
  const mandalGroups = useMemo(() => {
    const map = new Map<string, { latSum: number; lngSum: number; count: number }>();
    booths.forEach((b) => {
      const entry = map.get(b.mandalName) || { latSum: 0, lngSum: 0, count: 0 };
      entry.latSum += b.lat;
      entry.lngSum += b.lng;
      entry.count += 1;
      map.set(b.mandalName, entry);
    });

    return Array.from(map.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      centerLat: data.count > 0 ? data.latSum / data.count : 0,
      centerLng: data.count > 0 ? data.lngSum / data.count : 0,
    }));
  }, [booths]);

  // Compute Mandal Sectors by Voronoi clipping against the constituency boundary
  const mandalGeoJson = useMemo(() => {
    if (!acFeature || mandalGroups.length < 2) return null;
    try {
      const acBbox = turf.bbox(acFeature) as [number, number, number, number];
      const dx = (acBbox[2] - acBbox[0]) * 0.2;
      const dy = (acBbox[3] - acBbox[1]) * 0.2;
      const expandedBbox: [number, number, number, number] = [
        acBbox[0] - dx,
        acBbox[1] - dy,
        acBbox[2] + dx,
        acBbox[3] + dy,
      ];

      const points = turf.featureCollection(
        mandalGroups.map((m, idx) =>
          turf.point([m.centerLng, m.centerLat], { mandalName: m.name, idx, boothCount: m.count })
        )
      );

      const voronoi = turf.voronoi(points, { bbox: expandedBbox });
      const sectors: any[] = [];

      voronoi.features.forEach((cell, i) => {
        if (!cell) return;
        const mandal = mandalGroups[i];
        try {
          const inter = turf.intersect(turf.featureCollection([acFeature, cell]));
          if (inter) {
            inter.properties = {
              mandalName: mandal?.name || `Mandal ${i + 1}`,
              boothCount: mandal?.count || 0,
              centerLat: mandal?.centerLat || 0,
              centerLng: mandal?.centerLng || 0,
            };
            sectors.push(inter);
          }
        } catch {
          // ignore intersection edge cases
        }
      });

      if (sectors.length > 0) {
        return turf.featureCollection(sectors);
      }
    } catch (e) {
      console.warn('Could not generate mandal sectors for map:', e);
    }
    return null;
  }, [acFeature, mandalGroups]);

  // Helper color function (3-Tier Traffic Light model: Green / Amber / Red)
  const getTriageColor = (triage: string) => {
    switch (triage) {
      case 'battleground':
      case 'vulnerable':
        return '#f59e0b'; // Amber / Orange (Unified Contestable Swing & Vulnerable Holds)
      case 'fortress':
        return '#10b981'; // Emerald Green (Strongholds)
      case 'hostile':
        return '#f43f5e'; // Rose / Red (Opponent Bastions)
      default:
        return '#6366f1';
    }
  };

  // Helper color function for active map layer mode
  const getMarkerColor = (b: BoothDetail, mode: MapLayerMode): string => {
    if (mode === 'panna') {
      return b.pannaPages > 35 ? '#a855f7' : b.pannaPages >= 25 ? '#0ea5e9' : '#10b981';
    }
    if (mode === 'gender') {
      const fElectors = b.femaleElectors ?? Math.round(b.electorate * 0.51);
      const fRatio = b.electorate > 0 ? (fElectors / b.electorate) * 100 : 50;
      return fRatio >= 52.5 ? '#ec4899' : fRatio <= 47.5 ? '#3b82f6' : '#64748b';
    }
    return getTriageColor(b.triage);
  };

  // 1. Initialize Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    });

    // Zoom control in bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mandalLayerGroupRef.current = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = L.layerGroup().addTo(map);
    beaconLayerGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Basemap tile layer management (CARTO Dark Matter vs CARTO Positron)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    const cartoKey = import.meta.env.VITE_CARTO_API_KEY;
    const style = isLight ? 'light_all' : 'dark_all';
    const tileUrl = cartoKey
      ? `https://{s}.basemaps.cartocdn.com/rastertiles/${style}/{z}/{x}/{y}{r}.png?key=${cartoKey}`
      : `https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png`;

    const layer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    });

    layer.addTo(map);
    tileLayerRef.current = layer;
  }, [isLight]);

  // Handle map resizing when in full page mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [isFullPageMap]);

  // 3. Render AC Polygon Boundary & Fit Bounds
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (boundaryLayerRef.current) {
      map.removeLayer(boundaryLayerRef.current);
      boundaryLayerRef.current = null;
    }

    if (acFeature) {
      const boundaryLayer = L.geoJSON(acFeature, {
        style: () => ({
          color: isLight ? '#4338ca' : '#818cf8',
          weight: isLight ? 2.8 : 2.5,
          opacity: 0.95,
          fillColor: isLight ? '#6366f1' : '#312e81',
          fillOpacity: isLight ? 0.08 : 0.12,
          dashArray: '5, 5',
        }),
        interactive: false,
      }).addTo(map);

      boundaryLayerRef.current = boundaryLayer;

      try {
        const bounds = boundaryLayer.getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [35, 35] });
        }
      } catch {
        // Fallback
      }
    } else if (booths.length > 0) {
      const lats = booths.map((b) => b.lat).filter((lat) => !isNaN(lat) && lat !== 0);
      const lngs = booths.map((b) => b.lng).filter((lng) => !isNaN(lng) && lng !== 0);
      if (lats.length > 0 && lngs.length > 0) {
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);
        map.fitBounds(
          [
            [minLat, minLng],
            [maxLat, maxLng],
          ],
          { padding: [35, 35] }
        );
      }
    }
  }, [acFeature, booths, isLight]);

  // 4. Render Mandal Boundary Lines & Sector Labels within the AC
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = mandalLayerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    if (!showMandalLines || !mandalGeoJson) return;

    // Fast non-interactive visual boundary styling - avoids intercepting mouse events
    const sectorLayer = L.geoJSON(mandalGeoJson, {
      style: () => ({
        color: isLight ? '#0284c7' : '#38bdf8', // Vibrant sky-blue boundary line
        weight: isLight ? 1.8 : 1.5,
        opacity: 0.85,
        dashArray: '6, 6',
        fillColor: isLight ? '#0284c7' : '#0ea5e9',
        fillOpacity: isLight ? 0.04 : 0.03,
      }),
      interactive: false,
    });

    group.addLayer(sectorLayer);

    // Place subtle floating badges for Mandal sector centers
    mandalGroups.forEach((m) => {
      if (m.centerLat && m.centerLng) {
        const labelIcon = L.divIcon({
          className: 'mandal-label-pill',
          html: `<div style="
            display: inline-block;
            padding: 2px 8px;
            font-size: 10px;
            font-weight: 700;
            border-radius: 9999px;
            white-space: nowrap;
            background: ${isLight ? 'rgba(255,255,255,0.95)' : 'rgba(15,23,42,0.92)'};
            color: ${isLight ? '#0369a1' : '#7dd3fc'};
            border: 1px solid ${isLight ? '#7dd3fc' : 'rgba(56,189,248,0.45)'};
            box-shadow: 0 2px 5px rgba(0,0,0,0.18);
            pointer-events: none;
          ">📍 ${m.name}</div>`,
          iconSize: [80, 20],
          iconAnchor: [40, 10],
        });
        const labelMarker = L.marker([m.centerLat, m.centerLng], {
          icon: labelIcon,
          interactive: false,
          pane: 'overlayPane',
        });
        group.addLayer(labelMarker);
      }
    });
  }, [showMandalLines, mandalGeoJson, mandalGroups, isLight]);

  // Pre-group booths by coordinate key for instant multi-booth campus resolution
  const boothsByCoordKey = useMemo(() => {
    const map = new Map<string, BoothDetail[]>();
    booths.forEach((b) => {
      if (isNaN(b.lat) || isNaN(b.lng) || (b.lat === 0 && b.lng === 0)) return;
      const key = `${b.lat.toFixed(5)},${b.lng.toFixed(5)}`;
      const list = map.get(key) || [];
      list.push(b);
      map.set(key, list);
    });
    return map;
  }, [booths]);

  // 5. Render Polling Station Circle Markers with Zero-Lag Instant Tooltips
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();
    markersByBoothRef.current.clear();

    const displayBooths = sviFilterOnly
      ? booths.filter((b) => b.svi?.level === 'CRITICAL' || b.svi?.level === 'HIGH')
      : booths;

    displayBooths.forEach((b) => {
      if (isNaN(b.lat) || isNaN(b.lng) || (b.lat === 0 && b.lng === 0)) return;

      const isCurrentActive = activeBoothRef.current?.boothNo === b.boothNo;
      const isBattleground = b.triage === 'battleground' || b.triage === 'vulnerable';
      const isSviCritical = b.svi?.level === 'CRITICAL';
      const isSviHigh = b.svi?.level === 'HIGH';
      const color = getMarkerColor(b, mapLayerMode);

      const marker = L.circleMarker([b.lat, b.lng], {
        radius: isCurrentActive ? 9.5 : isSviCritical ? 8 : isBattleground ? 7 : 5.5,
        fillColor: color,
        color: isCurrentActive
          ? (isLight ? '#1e1b4b' : '#ffffff')
          : isSviCritical
          ? '#ef4444'
          : isSviHigh
          ? '#f59e0b'
          : isBattleground
          ? (isLight ? '#b45309' : '#fef3c7')
          : (isLight ? '#ffffff' : '#0f172a'),
        weight: isCurrentActive ? 3 : isSviCritical ? 2.5 : isBattleground ? 1.8 : 1,
        fillOpacity: isCurrentActive ? 1 : isLight ? 0.95 : 0.88,
        pane: isBattleground || isCurrentActive || isSviCritical ? 'markerPane' : 'overlayPane',
      });

      const coordKey = `${b.lat.toFixed(5)},${b.lng.toFixed(5)}`;
      const sisterBooths = boothsByCoordKey.get(coordKey) || [b];
      const isCampusCluster = sisterBooths.length > 1;

      // High-Contrast Tooltip with clean visibility in Light and Dark themes
      const titleColor = isLight ? '#0f172a' : '#ffffff';
      const locColor = isLight ? '#475569' : '#94a3b8';
      const voteColor = isLight ? '#0f172a' : '#f1f5f9';
      const borderDivColor = isLight ? '#e2e8f0' : '#334155';

      let tooltipContent = '';

      if (isCampusCluster) {
        const totalCampusElectors = sisterBooths.reduce((sum, sb) => sum + sb.electorate, 0);
        tooltipContent = `
          <div style="font-family: inherit; font-size: 11px; line-height: 1.4; min-width: 200px;">
            <div style="font-weight: 800; font-size: 12px; color: ${titleColor};">
              🏫 ${b.name}
            </div>
            <div style="color: ${locColor}; font-size: 10px; margin-top: 1px;">
              📍 ${b.location} &middot; <strong style="color: ${titleColor};">${b.mandalName} Mandal</strong>
            </div>
            <div style="margin-top: 4px; padding: 2px 6px; border-radius: 4px; background: ${isLight ? '#f1f5f9' : '#1e293b'}; border: 1px solid ${borderDivColor}; font-size: 10px; font-weight: 700; color: ${isLight ? '#4338ca' : '#a5b4fc'}; display: flex; align-items: center; justify-content: space-between;">
              <span>Campus Facility</span>
              <span>${sisterBooths.length} Polling Stations</span>
            </div>
            <div style="margin-top: 5px; border-top: 1px solid ${borderDivColor}; padding-top: 4px; display: flex; flex-direction: column; gap: 3px;">
              ${sisterBooths
                .map((sb) => {
                  const sbColor = getMarkerColor(sb, mapLayerMode);
                  return `
                    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                      <span style="font-family: monospace; font-weight: 700; color: ${titleColor};">PS #${sb.boothNo}</span>
                      <span style="font-weight: 700; color: ${sbColor}; text-transform: uppercase; font-size: 9px; letter-spacing: 0.04em;">
                        ${sb.winnerParty ? `${sb.winnerParty} (+${sb.margin})` : sb.triage}
                      </span>
                      <span style="font-family: monospace; font-size: 10px; font-weight: 600; color: ${voteColor};">${sb.electorate} electors</span>
                    </div>
                  `;
                })
                .join('')}
            </div>
            <div style="margin-top: 5px; padding-top: 4px; border-top: 1px dashed ${borderDivColor}; display: flex; align-items: center; justify-content: space-between; font-size: 10px; font-weight: 700; color: ${titleColor};">
              <span>Campus Total:</span>
              <span style="font-family: monospace; color: ${isLight ? '#4338ca' : '#818cf8'};">${totalCampusElectors.toLocaleString()} electors</span>
            </div>
          </div>
        `;
      } else {
        const femaleCount = b.femaleElectors || Math.round(b.electorate * 0.51);
        const femaleRatio = b.electorate > 0 ? (femaleCount / b.electorate) * 100 : 50;

        tooltipContent = `
          <div style="font-family: inherit; font-size: 11px; line-height: 1.4; min-width: 180px;">
            <div style="font-weight: 800; font-size: 12px; color: ${titleColor};">
              PS #${b.boothNo} &middot; ${b.name}
            </div>
            <div style="color: ${locColor}; font-size: 10px; margin-top: 2px;">
              📍 ${b.location} &middot; <strong style="color: ${titleColor};">${b.mandalName} Mandal</strong>
            </div>

            ${
              mapLayerMode === 'political'
                ? `
                ${
                  b.candidates
                    ? `
                    <div style="margin-top: 5px; border-top: 1px solid ${borderDivColor}; padding-top: 4px; display: flex; flex-direction: column; gap: 2px;">
                      ${Object.entries(b.candidates)
                        .map(
                          ([cand, val]) => `
                        <div style="display: flex; justify-content: space-between; font-size: 10px;">
                          <span style="color: ${locColor};">${cand}</span>
                          <span style="font-family: monospace; font-weight: 700; color: ${voteColor};">${val.toLocaleString()}</span>
                        </div>
                      `
                        )
                        .join('')}
                    </div>
                    `
                    : ''
                }
                <div style="margin-top: 5px; display: flex; align-items: center; justify-content: space-between; gap: 8px; border-top: 1px solid ${borderDivColor}; padding-top: 4px;">
                  <span style="font-weight: 700; color: ${color}; text-transform: uppercase; font-size: 9px; letter-spacing: 0.05em;">
                    ${b.winnerParty ? `${b.winnerParty} (+${b.margin?.toLocaleString()})` : b.triage}
                  </span>
                  <span style="font-family: monospace; font-weight: 700; color: ${voteColor};">
                    ${b.turnoutPct ? `${b.turnoutPct}% turnout` : `${b.electorate} electors`}
                  </span>
                </div>
              `
                : mapLayerMode === 'panna'
                ? `
                <div style="margin-top: 5px; border-top: 1px solid ${borderDivColor}; padding-top: 4px; display: flex; flex-direction: column; gap: 2px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: ${locColor};">Panna Pramukhs Needed:</span>
                    <span style="font-family: monospace; font-weight: 700; color: ${color};">${b.pannaPages} workers</span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: ${locColor};">Workload Intensity:</span>
                    <span style="font-weight: 700; font-size: 10px; color: ${color};">
                      ${b.pannaPages > 35 ? '🚨 Heavy Deficit (>35)' : b.pannaPages >= 25 ? '⚡ Standard (25-35)' : '✅ Light (<25)'}
                    </span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: ${locColor};">Total Electorate:</span>
                    <span style="font-family: monospace; color: ${voteColor};">${b.electorate} electors</span>
                  </div>
                </div>
              `
                : `
                <div style="margin-top: 5px; border-top: 1px solid ${borderDivColor}; padding-top: 4px; display: flex; flex-direction: column; gap: 2px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: ${locColor};">Female Electors:</span>
                    <span style="font-family: monospace; font-weight: 700; color: #ec4899;">
                      ${femaleCount.toLocaleString()} (${femaleRatio.toFixed(1)}%)
                    </span>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: ${locColor};">Male Electors:</span>
                    <span style="font-family: monospace; color: ${voteColor};">
                      ${(b.maleElectors || (b.electorate - femaleCount)).toLocaleString()}
                    </span>
                  </div>
                  <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 10px; color: ${color}; margin-top: 2px;">
                    <span>Target:</span>
                    <span>${femaleRatio >= 52.5 ? '🌸 High Mahila Welfare Target' : '⚖️ Balanced Gender'}</span>
                  </div>
                </div>
              `
            }

            ${
              b.form20Source
                ? `
                <div style="margin-top: 4px; padding: 2px 4px; border-radius: 3px; background: ${b.form20Source.includes('OFFICIAL') ? 'rgba(16,185,129,0.15)' : 'rgba(234,179,8,0.15)'}; color: ${b.form20Source.includes('OFFICIAL') ? '#34d399' : '#facc15'}; font-size: 9px; font-weight: 700; display: flex; justify-content: space-between;">
                  <span>${b.form20Source.includes('OFFICIAL') ? 'Official 2024 Form-20' : 'Mandal Model'}</span>
                  <span>AC #${acNo}</span>
                </div>
                `
                : ''
            }

            ${
              b.svi && (b.svi.level === 'CRITICAL' || b.svi.level === 'HIGH')
                ? `<div style="margin-top: 4px; padding: 2px 5px; border-radius: 4px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #f87171; font-weight: 800; font-size: 9px; display: flex; align-items: center; justify-content: space-between;">
                    <span>🛡️ SVI ${b.svi.level} (${b.svi.score}/100)</span>
                    <span>CAPF Alert</span>
                  </div>`
                : ''
            }
          </div>
        `;
      }

      marker.bindTooltip(tooltipContent, {
        className: isLight ? 'booth-tooltip-light' : 'booth-tooltip-dark',
        direction: 'top',
        offset: [0, -8],
        opacity: 1,
        sticky: false,
      });

      // Snappy, instant hover response
      marker.on('mouseover', () => {
        marker.bringToFront();
        marker.setStyle({
          radius: isBattleground ? 8.5 : 7.5,
          weight: 2.5,
        });
      });

      marker.on('mouseout', () => {
        const isStillActive = activeBoothRef.current?.boothNo === b.boothNo;
        marker.setStyle({
          radius: isStillActive ? 9.5 : isSviCritical ? 8 : isBattleground ? 7 : 5.5,
          color: isStillActive
            ? (isLight ? '#1e1b4b' : '#ffffff')
            : isSviCritical
            ? '#ef4444'
            : isSviHigh
            ? '#f59e0b'
            : isBattleground
            ? (isLight ? '#b45309' : '#fef3c7')
            : (isLight ? '#ffffff' : '#0f172a'),
          weight: isStillActive ? 3 : isSviCritical ? 2.5 : isBattleground ? 1.8 : 1,
        });
      });

      marker.on('click', () => {
        setActiveBooth(b);
        if (onSelectBooth) onSelectBooth(b);
      });

      markersByBoothRef.current.set(b.boothNo, marker);
      marker.addTo(markersGroup);
    });
  }, [booths, boothsByCoordKey, targetParty, onSelectBooth, isLight, sviFilterOnly, mapLayerMode]);

  // Fast highlight synchronization for Active Booth without reconstructing 400 SVG markers
  useEffect(() => {
    const prevNo = prevActiveBoothNoRef.current;
    if (prevNo && prevNo !== activeBooth?.boothNo) {
      const prevMarker = markersByBoothRef.current.get(prevNo);
      const prevBooth = booths.find((b) => b.boothNo === prevNo);
      if (prevMarker && prevBooth) {
        const isBg = prevBooth.triage === 'battleground';
        const isCrit = prevBooth.svi?.level === 'CRITICAL';
        const isHi = prevBooth.svi?.level === 'HIGH';
        prevMarker.setStyle({
          radius: isCrit ? 8 : isBg ? 7 : 5.5,
          color: isCrit
            ? '#ef4444'
            : isHi
            ? '#f59e0b'
            : isBg
            ? (isLight ? '#b45309' : '#fef3c7')
            : (isLight ? '#ffffff' : '#0f172a'),
          weight: isCrit ? 2.5 : isBg ? 1.8 : 1,
          fillOpacity: isLight ? 0.95 : 0.88,
        });
      }
    }

    if (activeBooth) {
      const currMarker = markersByBoothRef.current.get(activeBooth.boothNo);
      if (currMarker) {
        currMarker.setStyle({
          radius: 9.5,
          color: isLight ? '#1e1b4b' : '#ffffff',
          weight: 3,
          fillOpacity: 1,
        });
        currMarker.bringToFront();
      }
    }

    prevActiveBoothNoRef.current = activeBooth?.boothNo ?? null;
  }, [activeBooth, booths, isLight]);

  // 6. Smooth Camera Fly-To & Pulsing Beacon Reticle for Active / Located Booth
  useEffect(() => {
    const map = mapInstanceRef.current;
    const beaconGroup = beaconLayerGroupRef.current;
    if (!map || !beaconGroup) return;

    beaconGroup.clearLayers();

    if (!activeBooth || isNaN(activeBooth.lat) || isNaN(activeBooth.lng) || activeBooth.lat === 0) {
      return;
    }

    // Refresh map bounds in case container just transitioned from list view to map
    map.invalidateSize();

    // Smoothly fly camera directly to the booth coordinates with high zoom level (zoom 15)
    const currentZoom = map.getZoom();
    const targetZoom = Math.max(currentZoom, 15);
    map.flyTo([activeBooth.lat, activeBooth.lng], targetZoom, {
      animate: true,
      duration: 1.2,
      easeLinearity: 0.25,
    });

    // Add High-Visibility Animated Pulsing Radar Beacon
    const color = getTriageColor(activeBooth.triage);
    const beaconHtml = `
      <div style="position: relative; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; pointer-events: none;">
        <div style="
          position: absolute;
          width: 56px;
          height: 56px;
          border-radius: 9999px;
          background: ${color};
          opacity: 0.55;
          animation: ping 1.4s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          position: absolute;
          width: 34px;
          height: 34px;
          border-radius: 9999px;
          border: 2.5px solid ${color};
          background: rgba(255, 255, 255, 0.25);
          box-shadow: 0 0 16px ${color};
          animation: pulse 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        "></div>
        <div style="
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: #ffffff;
          border: 3.5px solid ${color};
          box-shadow: 0 2px 10px rgba(0,0,0,0.6);
        "></div>
      </div>
    `;

    const beaconIcon = L.divIcon({
      className: 'booth-radar-beacon',
      html: beaconHtml,
      iconSize: [56, 56],
      iconAnchor: [28, 28],
    });

    const beaconMarker = L.marker([activeBooth.lat, activeBooth.lng], {
      icon: beaconIcon,
      interactive: false,
      pane: 'markerPane',
      zIndexOffset: 2500,
    });

    beaconGroup.addLayer(beaconMarker);

    // Auto-open tooltip on the target booth marker once fly-to arrives
    const timer = setTimeout(() => {
      const marker = markersByBoothRef.current.get(activeBooth.boothNo);
      if (marker && map) {
        marker.openTooltip();
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [activeBooth]);

  // Center / Reset View handler
  const handleResetBounds = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (boundaryLayerRef.current) {
      map.fitBounds(boundaryLayerRef.current.getBounds(), { padding: [35, 35] });
    }
  };

  // Fullscreen map toggle state
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Lock body scroll and listen for Escape key on fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Robust multi-step Leaflet size invalidation on fullscreen transition
  useEffect(() => {
    const runInvalidate = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    runInvalidate();
    const t1 = setTimeout(runInvalidate, 60);
    const t2 = setTimeout(runInvalidate, 180);
    const t3 = setTimeout(runInvalidate, 350);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isFullscreen]);

  return (
    <div
      className={
        isFullscreen
          ? 'fixed inset-0 z-[99999] w-screen h-screen bg-slate-950 flex flex-col overflow-hidden m-0 p-0 rounded-none border-0'
          : `relative w-full rounded-xl overflow-hidden border transition-colors shadow-inner ${
              isLight ? 'border-slate-300 bg-slate-100' : 'border-slate-800 bg-slate-950'
            } ${isFullPageMap ? 'flex-1 flex flex-col min-h-0 h-full' : ''}`
      }
    >
      {/* Dedicated Top Banner in Fullscreen Mode */}
      {isFullscreen && (
        <div className="shrink-0 px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white z-30">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
              AC #{acNo}
            </span>
            <span className="font-bold text-sm text-white">{acName} Polling Stations Geospatial View</span>
            <span className="text-xs text-slate-400 hidden sm:inline">({booths.length} stations)</span>
          </div>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md"
          >
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Exit Fullscreen (Esc)</span>
          </button>
        </div>
      )}

      {/* Map Canvas */}
      <div
        className={`relative w-full ${
          isFullscreen
            ? 'flex-1 h-full min-h-0'
            : isFullPageMap
            ? 'flex-1 min-h-[450px] h-full'
            : 'h-[480px] sm:h-[540px]'
        } ${isLight ? 'bg-slate-100' : 'bg-slate-950'}`}
      >
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Top-Left: Map Layer Mode Switcher */}
        <div className="absolute top-3 left-3 z-20 flex items-center p-0.5 rounded-xl border backdrop-blur-md shadow-xl pointer-events-auto bg-slate-900/95 border-slate-700">
          <button
            type="button"
            onClick={() => setMapLayerMode('political')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapLayerMode === 'political'
                ? 'bg-amber-500 text-slate-950 shadow-md ring-1 ring-amber-400'
                : 'text-slate-300 hover:text-white'
            }`}
            title="2024 Political Triage: Fortress, Battleground, Vulnerable & Hostile"
          >
            <Vote className="w-3.5 h-3.5" />
            <span>2024 Triage</span>
          </button>
          <button
            type="button"
            onClick={() => setMapLayerMode('panna')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapLayerMode === 'panna'
                ? 'bg-purple-600 text-white shadow-md ring-1 ring-purple-400'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Panna Deficit: Volunteer workload intensity & worker deficits"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Panna Load</span>
          </button>
          <button
            type="button"
            onClick={() => setMapLayerMode('gender')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapLayerMode === 'gender'
                ? 'bg-pink-600 text-white shadow-md ring-1 ring-pink-400'
                : 'text-slate-300 hover:text-white'
            }`}
            title="Mahila / Gender Focus: Female elector concentration for direct welfare messaging"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Mahila / Gender</span>
          </button>
        </div>

        {/* Top Center: Active Focused Booth Banner */}
        {activeBooth && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/95 text-white text-xs font-semibold shadow-2xl border border-amber-500/70 backdrop-blur-md animate-in fade-in slide-in-from-top-2 pointer-events-auto max-w-[90%] sm:max-w-md">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="text-amber-300 font-mono font-bold shrink-0">PS #{activeBooth.boothNo}</span>
            <span className="truncate">{activeBooth.name}</span>
            <button
              type="button"
              onClick={handleResetBounds}
              className="ml-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-amber-200 hover:text-white transition-colors cursor-pointer border border-slate-700 shrink-0 font-mono font-bold"
              title="Reset zoom to view all constituency polling stations"
            >
              Fit AC
            </button>
          </div>
        )}

        {/* Top-Right Floating Controls (Mandals toggle & Reset bounds) */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 pointer-events-auto">
          {/* SVI Sensitive Polling Stations Filter */}
          <button
            type="button"
            onClick={() => setSviFilterOnly(!sviFilterOnly)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md backdrop-blur-md border ${
              sviFilterOnly
                ? 'bg-rose-600 text-white border-rose-500 shadow-rose-600/30 ring-2 ring-rose-400'
                : isLight
                ? 'bg-white/90 text-rose-700 hover:bg-rose-50 border-rose-200'
                : 'bg-slate-900/90 text-rose-300 hover:bg-rose-950/40 border-slate-700'
            }`}
            title="Filter to only show Sensitive & Intimidation Vulnerable Polling Stations (SVI Critical / High)"
          >
            <ShieldAlert className={`w-3.5 h-3.5 ${sviFilterOnly ? 'text-white' : 'text-rose-500'}`} />
            <span>{sviFilterOnly ? 'SVI Sensitive Only' : 'SVI Filter'}</span>
            <span
              className={`text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full ${
                sviFilterOnly
                  ? 'bg-white/20 text-white'
                  : 'bg-rose-500/10 text-rose-600 border border-rose-300/40'
              }`}
            >
              {booths.filter((b) => b.svi?.level === 'CRITICAL' || b.svi?.level === 'HIGH').length}
            </span>
          </button>

          {/* Mandal Lines Toggle */}
          <button
            type="button"
            onClick={() => setShowMandalLines(!showMandalLines)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md backdrop-blur-md border ${
              showMandalLines
                ? isLight
                  ? 'bg-sky-100/95 text-sky-800 border-sky-300'
                  : 'bg-sky-950/90 text-sky-300 border-sky-500/50'
                : isLight
                ? 'bg-white/90 text-slate-500 border-slate-300 hover:text-slate-800'
                : 'bg-slate-900/90 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle Mandal Sector Boundary Lines & Labels"
          >
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Mandal Lines</span>
          </button>

          {/* Reset Bounds */}
          <button
            type="button"
            onClick={handleResetBounds}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer shadow-md backdrop-blur-md ${
              isLight
                ? 'bg-white/90 hover:bg-slate-100 text-slate-600 border-slate-300'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
            title="Reset Map View / Fit Bounds"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Map Toggle */}
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer shadow-md backdrop-blur-md ${
              isFullscreen
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-600/30'
                : isLight
                ? 'bg-white/90 hover:bg-slate-100 text-slate-600 border-slate-300'
                : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700'
            }`}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand Map to Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Bottom Left Legend */}
        <div
          className={`absolute bottom-3 left-3 z-20 backdrop-blur-md p-2.5 rounded-xl border text-[11px] space-y-1.5 shadow-xl pointer-events-auto transition-colors ${
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-800 shadow-md'
              : 'bg-slate-900/90 border-slate-800 text-slate-300'
          }`}
        >
          {mapLayerMode === 'political' ? (
            <>
              <div
                className={`text-[10px] font-bold uppercase tracking-wider flex items-center justify-between gap-2 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Vote className="w-3 h-3 text-amber-500" />
                  <span>2024 Political Triage ({targetParty})</span>
                </div>
                <span className="font-mono text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                  {booths.some((b) => b.form20Source?.includes('OFFICIAL')) ? 'Official Form-20' : 'Mandal Model'}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-xs shrink-0" />
                  <span className="text-amber-500 font-bold whitespace-nowrap">Battleground &amp; Vulnerable (Swing)</span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shrink-0" />
                    <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>Stronghold (&gt;60% Safe)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-xs shrink-0" />
                    <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>Opponent Turf (&gt;60% Opp)</span>
                  </div>
                </div>
              </div>
            </>
          ) : mapLayerMode === 'panna' ? (
            <>
              <div
                className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <Users className="w-3 h-3 text-purple-400" />
                <span>Panna Deficit Legend (SIR 2026)</span>
              </div>
              <div className="flex flex-col gap-1 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-xs shrink-0" />
                  <span className="font-bold text-purple-400">Heavy Deficit (&gt;35 pages)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-xs shrink-0" />
                  <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>Standard Load (25-35 pages)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shrink-0" />
                  <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>Light Load (&lt;25 pages)</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div
                className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}
              >
                <Heart className="w-3 h-3 text-pink-400" />
                <span>Mahila Mobilization Legend</span>
              </div>
              <div className="flex flex-col gap-1 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500 shadow-xs shrink-0" />
                  <span className="font-bold text-pink-400">High Mahila Focus (&gt;52.5% Women)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-xs shrink-0" />
                  <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>Balanced Gender (48 - 52.5%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs shrink-0" />
                  <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>Male Concentration (&lt;48% Women)</span>
                </div>
              </div>
            </>
          )}

          {showMandalLines && (
            <div
              className={`pt-1 border-t text-[10px] flex items-center gap-1.5 ${
                isLight ? 'border-slate-200 text-sky-700' : 'border-slate-800 text-sky-300'
              }`}
            >
              <span className="w-3 border-b-2 border-dashed border-sky-400" />
              <span>Mandal Sector Boundaries</span>
            </div>
          )}
        </div>

        {/* Selected Booth Inspector Card (Sliding overlay) */}
        {activeBooth && (
          <div
            className={`absolute top-12 right-3 left-3 sm:left-auto sm:w-96 z-30 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border shadow-2xl space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150 transition-colors ${
              isLight
                ? 'bg-white/95 border-indigo-300 text-slate-900 shadow-indigo-100'
                : 'bg-slate-900/95 border-indigo-500/50 text-white'
            }`}
          >
            <div
              className={`flex items-start justify-between gap-2 border-b pb-2 ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                      isLight
                        ? 'bg-slate-100 text-amber-700 border-slate-300'
                        : 'bg-slate-800 text-amber-300 border-slate-700'
                    }`}
                  >
                    PS #{activeBooth.boothNo}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                      activeBooth.triage === 'battleground' || activeBooth.triage === 'vulnerable'
                        ? 'bg-amber-500/20 text-amber-500 border-amber-500/40'
                        : activeBooth.triage === 'fortress'
                        ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40'
                        : 'bg-rose-500/20 text-rose-600 border-rose-500/40'
                    }`}
                  >
                    {activeBooth.triage === 'battleground'
                      ? '🔥 Battleground (≤45 votes)'
                      : activeBooth.triage === 'vulnerable'
                      ? '⚠️ Tight Lead'
                      : activeBooth.triage === 'fortress'
                      ? '🛡️ Stronghold'
                      : 'Opponent Turf'}
                  </span>
                </div>
                <h4
                  className={`text-xs sm:text-sm font-bold mt-1 leading-snug ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  {activeBooth.name}
                </h4>
                <p className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  📍 {activeBooth.location} &middot;{' '}
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {activeBooth.mandalName} Mandal
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveBooth(null)}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div
              className={`grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg border ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-slate-950/80 border-slate-800 text-slate-200'
              }`}
            >
              <div>
                <span
                  className={`text-[10px] block uppercase ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  Registered Electors
                </span>
                <span
                  className={`font-mono font-bold flex items-center gap-1 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  <Users className="w-3 h-3 text-indigo-500" />
                  {activeBooth.electorate} (~{activeBooth.pannaPages} pages)
                </span>
              </div>
              <div>
                <span
                  className={`text-[10px] block uppercase ${
                    isLight ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  Panna Pramukhs
                </span>
                <span
                  className={`font-mono font-bold ${
                    isLight ? 'text-indigo-600' : 'text-indigo-300'
                  }`}
                >
                  {activeBooth.pannaPages} Assigned (30/p)
                </span>
              </div>
            </div>

            {/* 2024 Form-20 Candidate Vote Breakdown */}
            {activeBooth.candidates && (
              <div
                className={`p-2.5 rounded-lg border text-[11px] space-y-1.5 ${
                  isLight ? 'bg-indigo-50/60 border-indigo-200' : 'bg-indigo-950/30 border-indigo-800/40'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <span className="flex items-center gap-1.5">
                    <Vote className="w-3.5 h-3.5 text-indigo-500" />
                    <span>2024 Form-20 Result</span>
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      activeBooth.form20Source?.includes('OFFICIAL')
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {activeBooth.form20Source?.includes('OFFICIAL') ? 'Verified Form-20 OCR' : 'Mandal Model'}
                  </span>
                </div>
                <div className="space-y-1 pt-0.5">
                  {Object.entries(activeBooth.candidates).map(([cand, votes]) => (
                    <div key={cand} className="flex items-center justify-between text-[11px]">
                      <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{cand}</span>
                      <span className={`font-mono font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                        {votes.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div
                    className={`pt-1 border-t flex items-center justify-between font-bold text-[10px] ${
                      isLight ? 'border-indigo-200' : 'border-indigo-800/50'
                    }`}
                  >
                    <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>
                      Winner Lead:{' '}
                      <strong className="text-indigo-400">{activeBooth.winnerParty}</strong> (+{activeBooth.margin?.toLocaleString()} votes)
                    </span>
                    <span className="text-slate-400 font-mono">Turnout: {activeBooth.turnoutPct}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mahila / Gender Mobilization Card */}
            <div
              className={`p-2.5 rounded-lg border text-[11px] space-y-1.5 ${
                isLight ? 'bg-pink-50/50 border-pink-200' : 'bg-pink-950/20 border-pink-900/40'
              }`}
            >
              <div className="flex items-center justify-between font-bold text-xs">
                <span className="flex items-center gap-1.5 text-pink-500">
                  <Heart className="w-3.5 h-3.5" />
                  <span>Mahila / Gender Distribution (SIR 2026)</span>
                </span>
                <span className="font-mono text-[10px] text-pink-400 font-bold">
                  {(((activeBooth.femaleElectors || Math.round(activeBooth.electorate * 0.51)) / activeBooth.electorate) * 100).toFixed(1)}% Women
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Female Electors:</span>
                  <span className="font-mono font-bold text-pink-400">
                    {(activeBooth.femaleElectors || Math.round(activeBooth.electorate * 0.51)).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Male Electors:</span>
                  <span className="font-mono font-bold text-blue-400">
                    {(activeBooth.maleElectors || (activeBooth.electorate - (activeBooth.femaleElectors || Math.round(activeBooth.electorate * 0.51)))).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* SVI Threat Assessment Card */}
            {activeBooth.svi && (
              <div
                className={`text-[11px] p-2.5 rounded-lg border space-y-1.5 ${
                  activeBooth.svi.level === 'CRITICAL'
                    ? 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                    : activeBooth.svi.level === 'HIGH'
                    ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                    : isLight
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-xs">
                    <ShieldAlert
                      className={`w-3.5 h-3.5 ${
                        activeBooth.svi.level === 'CRITICAL'
                          ? 'text-rose-400'
                          : activeBooth.svi.level === 'HIGH'
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    />
                    <span>SVI Vulnerability Index: {activeBooth.svi.level}</span>
                  </span>
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 rounded bg-black/30">
                    Score: {activeBooth.svi.score}/100
                  </span>
                </div>
                <div className="text-[10px] space-y-0.5 opacity-90">
                  {activeBooth.svi.reasons.map((r, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-current" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-1 border-t border-current/20 flex items-center justify-between text-[10px] font-mono">
                  <span>EC Protocol:</span>
                  <strong className="underline">
                    {activeBooth.svi.recommendedCapf
                      ? '🚨 Deploy CAPF & 100% Webcasting'
                      : 'Standard Micro-Observer'}
                  </strong>
                </div>
              </div>
            )}

            {/* Panna Pramukh Directive */}
            <div
              className={`text-[11px] p-2 rounded-lg border flex items-start gap-1.5 ${
                isLight
                  ? 'bg-amber-50/80 border-amber-200 text-slate-800'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
              }`}
            >
              <Target className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Ground Directive:</strong> {activeBooth.actionNote}
              </span>
            </div>

            {/* View in Dedicated Standalone E-Panna & Rolls Tab */}
            <button
              type="button"
              onClick={() => {
                if (onOpenStandaloneBooth) {
                  onOpenStandaloneBooth(activeBooth);
                } else {
                  const url = new URL(window.location.origin + window.location.pathname);
                  url.searchParams.set('tab', 'booth-data');
                  url.searchParams.set('ac', String(acNo));
                  url.searchParams.set('booth', String(activeBooth.boothNo));
                  window.open(url.toString(), '_blank');
                }
              }}
              className="w-full py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white group"
              title="Open full E-Panna, voter register, and household caste intelligence in dedicated standalone tab"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-200 group-hover:scale-110 transition-transform" />
              <span>Open in E-Panna &amp; Rolls Standalone Tab ({activeBooth.electorate} Electors) ↗</span>
            </button>

            {FORM_20_URLS[acNo] && (
              <a
                href={FORM_20_URLS[acNo]}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all border flex items-center justify-center gap-1.5 cursor-pointer mt-1 ${
                  isLight
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-700'
                }`}
                title={`Open Official CEO Andhra Pradesh 2024 Form-20 PDF for AC #${acNo} (Station #${activeBooth.boothNo})`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-600" />
                <span>Official 2024 Form-20 PDF (Station #{activeBooth.boothNo}) ↗</span>
              </a>
            )}

            <a
              href={getOfficialSir2026PdfUrl(acNo, activeBooth.boothNo)}
              target="_blank"
              rel="noreferrer"
              className={`w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all border flex items-center justify-center gap-1.5 cursor-pointer mt-1 ${
                isLight
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-300'
                  : 'bg-rose-950/80 hover:bg-rose-900 text-rose-300 border-rose-700'
              }`}
              title={`Open Official ECI SIR 2026 Draft Roll PDF for AC #${acNo} (Station #${activeBooth.boothNo})`}
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>Official SIR 2026 PDF (Station #{activeBooth.boothNo}) ↗</span>
            </a>

            {/* Optional Quick Overlay Modal */}
            {onViewVoterRoll && (
              <button
                type="button"
                onClick={() => onViewVoterRoll(activeBooth)}
                className={`w-full py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-all border flex items-center justify-center gap-1.5 cursor-pointer mt-1 ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-600'
                }`}
                title="Quick preview modal"
              >
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>Quick Preview Modal</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
