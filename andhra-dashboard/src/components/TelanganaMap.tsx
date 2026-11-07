import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import type { ConstituencyResult } from '../types';
import { getPastelPartyColor, getDistrictGrey } from '../types';
import type { MapProps, ThematicLayerKey } from './map/mapTypes';
import { getDemographicColor } from './map/mapTypes';
import { HexCartogramView } from './map/HexCartogramView';
import { MapLayersToolbar } from './map/MapLayersToolbar';
import { MapLegendOverlay } from './map/MapLegendOverlay';

export * from './map/mapTypes';

export const AndhraMap: React.FC<MapProps> = ({
  geoJsonData,
  districtGeoJsonData,
  yearResults,
  selectedAcNo,
  onSelectAc,
  viewMode,
  selectedYear,
  demographicsData,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);
  const districtLayerRef = useRef<L.GeoJSON | null>(null);
  const districtLabelsLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const hasFittedBoundsRef = useRef(false);
  const [mapReady, setMapReady] = useState(false);

  // District border and label display state
  const [showDistrictBorders, setShowDistrictBorders] = useState<boolean>(true);
  const [showDistrictLabels, setShowDistrictLabels] = useState<boolean>(false);

  // Basemap canvas state: 'light' (Esri World Light Gray Base, default) & 'osm' (OpenStreetMap)
  const [basemap, setBasemap] = useState<'light' | 'osm'>(() => {
    const saved = (localStorage.getItem('andhra_basemap') || localStorage.getItem('telangana_basemap')) as 'light' | 'osm' | null;
    if (saved && ['light', 'osm'].includes(saved)) {
      return saved;
    }
    return 'light';
  });

  // Google Maps-style Floating Layers & Settings Menu
  const [showLayersMenu, setShowLayersMenu] = useState(false);
  const layersMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (layersMenuRef.current) {
      try {
        L.DomEvent.disableClickPropagation(layersMenuRef.current);
        L.DomEvent.disableScrollPropagation(layersMenuRef.current);
      } catch {
        // Fallback safe
      }
    }

    if (!showLayersMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      const path = e.composedPath ? e.composedPath() : [];
      if (layersMenuRef.current) {
        if (path.length > 0 && path.includes(layersMenuRef.current)) return;
        if (layersMenuRef.current.contains(e.target as Node)) return;
      }
      setShowLayersMenu(false);
    };

    // Attach with small delay so the opening click event doesn't immediately dismiss the popover
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('click', handleClickOutside);
    }, 60);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showLayersMenu]);

  // Representation Mode: Geographic Map vs Equal-Area Hex Cartogram (#6)
  const [mapType, setMapType] = useState<'geographic' | 'hex_cartogram'>('geographic');

  // Thematic Demographic Heatmap Layer (#7)
  const [thematicLayer, setThematicLayer] = useState<ThematicLayerKey>('NONE');

  // Equal-Area Hex Cartogram Zoom, Pan & Color Scheme states
  const [hexZoom, setHexZoom] = useState<number>(1);
  const [hexPan, setHexPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hexColorMode, setHexColorMode] = useState<'pastel' | 'vibrant'>('pastel');

  const handleHexZoomIn = useCallback(() => {
    setHexZoom((z) => Math.min(3.5, Number((z + 0.25).toFixed(2))));
  }, []);

  const handleHexZoomOut = useCallback(() => {
    setHexZoom((z) => {
      const next = Math.max(0.75, Number((z - 0.25).toFixed(2)));
      if (next <= 1) setHexPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleHexReset = useCallback(() => {
    setHexZoom(1);
    setHexPan({ x: 0, y: 0 });
  }, []);

  // Fullscreen view state & refs
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleToggleFullscreen = () => {
    if (!isFullscreen) {
      setIsFullscreen(true);
      try {
        if (wrapperRef.current?.requestFullscreen) {
          wrapperRef.current.requestFullscreen().catch(() => {});
        }
      } catch {
        // Fallback to CSS fullscreen overlay
      }
    } else {
      setIsFullscreen(false);
      try {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      } catch {
        // Fallback
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
      }
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isFullscreen]);

  // Trigger Leaflet resize on fullscreen toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize({ pan: false });
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Andhra Pradesh Assembly geographic centroid [15.90, 80.76]
    const map = L.map(mapContainerRef.current, {
      center: [15.90, 80.76],
      zoom: 7,
      minZoom: 6,
      maxZoom: 12,
      zoomControl: true,
      attributionControl: false,
    });

    // Create a dedicated overlay pane for district boundaries above constituencies but below tooltips
    if (!map.getPane('districtPane')) {
      const districtPane = map.createPane('districtPane');
      districtPane.style.zIndex = '450';
      districtPane.style.pointerEvents = 'none';
    }

    if (!map.getPane('districtLabelPane')) {
      const labelPane = map.createPane('districtLabelPane');
      labelPane.style.zIndex = '460';
      labelPane.style.pointerEvents = 'none';
    }

    // Attach ResizeObserver to keep Leaflet synchronized with container layout shifts
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      setMapReady(false);
    };
  }, []);

  const attachTileLayer = useCallback(
    (map: L.Map, targetBasemap: 'light' | 'osm') => {
      if (tileLayerRef.current) {
        try {
          map.removeLayer(tileLayerRef.current);
        } catch {
          // Safe removal
        }
        tileLayerRef.current = null;
      }

      let layer: L.TileLayer;

      if (targetBasemap === 'osm') {
        layer = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors',
          }
        );
      } else {
        const cartoKey = import.meta.env.VITE_CARTO_API_KEY;
        if (cartoKey) {
          // CARTO Positron: crisp light basemap powered by official API key
          layer = L.tileLayer(
            `https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}{r}.png?key=${cartoKey}`,
            {
              maxZoom: 19,
              subdomains: 'abcd',
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            }
          );
        } else {
          // Esri World Light Gray Base fallback if no CARTO API key is provided
          layer = L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            {
              maxZoom: 16,
              attribution: 'Tiles &copy; Esri',
            }
          );
        }
      }

      layer.addTo(map);
      tileLayerRef.current = layer;
    },
    []
  );

  // Update Tile Layer when basemap changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;
    attachTileLayer(map, basemap);
  }, [mapReady, basemap, attachTileLayer]);

  // Invalidate Leaflet size and ensure tile layer is attached when switching back to geographic mode
  useEffect(() => {
    if (mapType === 'geographic' && mapInstanceRef.current) {
      const map = mapInstanceRef.current;
      if (mapContainerRef.current && !mapContainerRef.current.classList.contains('leaflet-container')) {
        mapContainerRef.current.classList.add('leaflet-container');
      }
      const timer = setTimeout(() => {
        if (!mapInstanceRef.current) return;
        map.invalidateSize({ pan: false });
        if (!tileLayerRef.current || !map.hasLayer(tileLayerRef.current)) {
          attachTileLayer(map, basemap);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [mapType, basemap, attachTileLayer]);

  const handleBasemapChange = (type: 'light' | 'osm') => {
    setBasemap(type);
    localStorage.setItem('andhra_basemap', type);
  };

  // Render 26 District Boundaries & Permanent Floating Text Labels in Dedicated Panes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    if (districtLayerRef.current) {
      map.removeLayer(districtLayerRef.current);
      districtLayerRef.current = null;
    }
    if (districtLabelsLayerRef.current) {
      map.removeLayer(districtLabelsLayerRef.current);
      districtLabelsLayerRef.current = null;
    }

    if (!districtGeoJsonData || !districtGeoJsonData.features || districtGeoJsonData.features.length === 0) {
      return;
    }

    // 1. Draw Subtle District Boundaries (50% softer opacity & lighter tone)
    if (showDistrictBorders) {
      const dLayer = L.geoJSON(districtGeoJsonData, {
        pane: 'districtPane',
        style: () => ({
          color: '#999999',
          weight: 1.8,
          opacity: 0.55,
          fillColor: 'transparent',
          fillOpacity: 0,
          dashArray: '4, 4',
          lineCap: 'round',
          lineJoin: 'round',
          interactive: false,
        }),
      });

      dLayer.addTo(map);
      districtLayerRef.current = dLayer;
    }

    // 2. Add Centroid District Labels
    if (showDistrictLabels) {
      const labelsGroup = L.layerGroup();
      districtGeoJsonData.features.forEach((feature: any) => {
        const dName =
          feature.properties?.DIST_NAME ||
          feature.properties?.district ||
          feature.properties?.District ||
          feature.properties?.NAME;

        if (!dName) return;

        const centroidLayer = L.geoJSON(feature);
        const bounds = centroidLayer.getBounds();
        if (!bounds.isValid()) return;
        const center = bounds.getCenter();

        const labelIcon = L.divIcon({
          className: 'district-centroid-label',
          html: `<div style="
            background: rgba(15, 23, 42, 0.75);
            color: #f8fafc;
            font-size: 10px;
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            white-space: nowrap;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
            pointer-events: none;
            letter-spacing: 0.2px;
          ">${dName}</div>`,
          iconSize: [80, 20],
          iconAnchor: [40, 10],
        });

        L.marker(center, {
          icon: labelIcon,
          pane: 'districtLabelPane',
          interactive: false,
        }).addTo(labelsGroup);
      });

      labelsGroup.addTo(map);
      districtLabelsLayerRef.current = labelsGroup;
    }
  }, [mapReady, districtGeoJsonData, showDistrictBorders, showDistrictLabels]);

  // Color functions based on viewMode & Thematic Demographics
  const getColor = (result: ConstituencyResult | undefined, acNo: number): string => {
    if (thematicLayer !== 'NONE' && demographicsData?.constituencies) {
      const acInfo = demographicsData.constituencies[String(acNo)];
      const casteProf = acInfo?.caste_profile as unknown as Record<string, number> | undefined;
      const ageProf = acInfo?.age_profile as unknown as Record<string, number> | undefined;
      let pct = 0;
      if (casteProf && thematicLayer in casteProf) {
        pct = casteProf[thematicLayer] || 0;
      } else if (ageProf && thematicLayer in ageProf) {
        pct = ageProf[thematicLayer] || 0;
      }
      return getDemographicColor(pct);
    }

    if (!result) return '#cbd5e1'; // soft grey for missing

    if (viewMode === 'winner') {
      return getPastelPartyColor(result.winner.party).fill;
    }

    if (viewMode === 'margin') {
      const marginPct = result.margin_pct;
      if (marginPct < 5) return '#fef9c3'; // soft pastel yellow (<5% razor thin)
      if (marginPct < 15) return '#fed7aa'; // soft pastel peach
      if (marginPct < 25) return '#fdba74'; // soft pastel orange
      return '#fca5a5'; // soft pastel coral (>25% landslide)
    }

    if (viewMode === 'swing') {
      if (!result.swing || result.swing.status === 'HOLD') {
        return '#cbd5e1'; // Incumbent Hold (soft neutral slate)
      }
      return getPastelPartyColor(result.winner.party).fill; // Flipped to new party in pastel
    }

    if (viewMode === 'district') {
      return getDistrictGrey(result.district);
    }

    return getPastelPartyColor(result.winner.party).fill;
  };

  // Render GeoJSON
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady || !geoJsonData) return;

    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
      geoJsonLayerRef.current = null;
    }

    const layer = L.geoJSON(geoJsonData, {
      style: (feature) => {
        const acNo = feature?.properties?.AC_NO;
        const result = yearResults[String(acNo)];
        const isSelected = selectedAcNo === acNo;
        const fillColor = getColor(result, acNo);

        return {
          fillColor,
          weight: isSelected ? 2.5 : 1,
          opacity: 1,
          color: isSelected ? '#0f172a' : '#ffffff',
          dashArray: '',
          fillOpacity: isSelected ? 0.95 : 0.88,
        };
      },
      onEachFeature: (feature, l) => {
        const acNo = feature?.properties?.AC_NO;
        const result = yearResults[String(acNo)];

        let demographicTip = '';
        if (thematicLayer !== 'NONE' && demographicsData?.constituencies) {
          const acInfo = demographicsData.constituencies[String(acNo)];
          const casteProf = acInfo?.caste_profile as unknown as Record<string, number> | undefined;
          const ageProf = acInfo?.age_profile as unknown as Record<string, number> | undefined;
          let pct = 0;
          if (casteProf && thematicLayer in casteProf) {
            pct = casteProf[thematicLayer] || 0;
          } else if (ageProf && thematicLayer in ageProf) {
            pct = ageProf[thematicLayer] || 0;
          }
          demographicTip = `
            <div style="margin-top: 4px; padding-top: 4px; border-top: 1px dashed rgba(255,255,255,0.2); font-size: 11px; color: #a5b4fc;">
              📊 ${thematicLayer.toUpperCase()}: <strong>${pct}%</strong>
            </div>
          `;
        }

        const tooltipContent = result
          ? `
            <div style="font-family: inherit; min-width: 160px; padding: 3px 2px;">
              <div style="font-weight: 800; font-size: 13.5px; color: #ffffff; margin-bottom: 2px; letter-spacing: -0.01em;">
                #${result.ac_no} ${result.ac_name}
              </div>
              <div style="font-size: 11px; font-weight: 500; color: #94a3b8; margin-bottom: 6px;">
                ${result.district} District
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; margin-bottom: 3px;">
                <span style="color: #94a3b8;">Winner:</span>
                <span style="font-weight: 700; color: ${getPastelPartyColor(result.winner.party).stroke}; margin-left: 8px;">
                  ${result.winner.party} (${result.winner.candidate})
                </span>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; margin-bottom: 3px;">
                <span style="color: #94a3b8;">Runner-up:</span>
                <span style="color: #e2e8f0; font-weight: 500; margin-left: 8px;">
                  ${result.runner_up.party} (${result.runner_up.candidate})
                </span>
              </div>
              <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; margin-top: 5px; padding-top: 5px; border-top: 1px solid #334155;">
                <span style="color: #94a3b8;">Margin:</span>
                <span style="font-weight: 700; font-family: monospace; color: #38bdf8;">
                  +${result.margin.toLocaleString()} (${result.margin_pct}%)
                </span>
              </div>
              ${demographicTip}
            </div>
          `
          : `
            <div style="font-family: inherit; min-width: 140px; padding: 2px;">
              <div style="font-weight: 700; font-size: 13px; color: #ffffff;">#${acNo} ${feature?.properties?.AC_NAME || 'Unknown'}</div>
              <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">No data for ${selectedYear}</div>
              ${demographicTip}
            </div>
          `;

        l.bindTooltip(tooltipContent, {
          sticky: true,
          className: 'custom-map-tooltip',
          direction: 'auto',
          offset: L.point(0, -10),
          opacity: 1,
        });

        l.on({
          mouseover: (e) => {
            const target = e.target;
            const isSel = selectedAcNo === acNo;
            target.setStyle({
              weight: isSel ? 3.5 : 2.5,
              color: isSel ? '#0f172a' : '#1e293b',
              fillOpacity: isSel ? 1 : 0.95,
            });
            target.bringToFront();
          },
          mouseout: (e) => {
            const target = e.target;
            const isSel = selectedAcNo === acNo;
            target.setStyle({
              weight: isSel ? 3 : 1.2,
              color: isSel ? '#1e293b' : '#ffffff',
              fillOpacity: isSel ? 0.95 : 0.85,
            });
          },
          click: (e) => {
            L.DomEvent.stopPropagation(e);
            onSelectAc(acNo);
          },
        });
      },
    }).addTo(map);

    geoJsonLayerRef.current = layer;

    // Bring selected AC to front so its darker grey fill and border are not obscured
    if (selectedAcNo && layer) {
      layer.eachLayer((l: any) => {
        if (l.feature?.properties?.AC_NO === selectedAcNo) {
          l.bringToFront();
        }
      });
    }

    // Fit bounds initially with brief delay ensuring DOM layout has computed dimensions
    if (!hasFittedBoundsRef.current && geoJsonData.features && geoJsonData.features.length > 0) {
      setTimeout(() => {
        if (mapInstanceRef.current && layer) {
          mapInstanceRef.current.invalidateSize();
          mapInstanceRef.current.fitBounds(layer.getBounds(), { padding: [20, 20], animate: false });
          hasFittedBoundsRef.current = true;
        }
      }, 100);
    }
  }, [mapReady, geoJsonData, yearResults, selectedAcNo, viewMode, selectedYear, onSelectAc, thematicLayer, demographicsData]);

  // One-click Re-center handler to reset map view directly to Andhra Pradesh boundary
  const handleRecenter = () => {
    const map = mapInstanceRef.current;
    const layer = geoJsonLayerRef.current;
    if (map && layer) {
      map.invalidateSize();
      map.fitBounds(layer.getBounds(), { padding: [20, 20], animate: true });
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={
        isFullscreen
          ? `fixed inset-0 z-[2500] w-screen h-screen ${mapType === 'hex_cartogram' ? 'bg-white' : 'bg-slate-950'} p-2 sm:p-4 flex flex-col overflow-hidden`
          : `relative w-full h-full min-h-[580px] ${mapType === 'hex_cartogram' ? 'bg-white' : 'bg-slate-950'} rounded-xl overflow-hidden border border-slate-200 shadow-inner`
      }
    >
      {/* 1. Leaflet Geographic Map Canvas Container */}
      <div
        className={`w-full h-full ${mapType === 'hex_cartogram' ? 'invisible pointer-events-none' : ''}`}
        style={{ minHeight: isFullscreen ? '100%' : '580px' }}
      >
        <div
          ref={mapContainerRef}
          className="w-full h-full"
          style={{ width: '100%', height: '100%', minHeight: isFullscreen ? '100%' : '580px' }}
        />
      </div>

      {/* 2. Equal-Area Hex Cartogram Canvas (#6) */}
      {mapType === 'hex_cartogram' && (
        <HexCartogramView
          selectedAcNo={selectedAcNo}
          onSelectAc={onSelectAc}
          yearResults={yearResults}
          viewMode={viewMode}
          selectedYear={selectedYear}
          demographicsData={demographicsData}
          thematicLayer={thematicLayer}
          hexColorMode={hexColorMode}
          hexZoom={hexZoom}
          hexPan={hexPan}
          setHexPan={setHexPan}
          handleHexReset={handleHexReset}
          handleHexZoomIn={handleHexZoomIn}
          handleHexZoomOut={handleHexZoomOut}
        />
      )}

      {/* 3. Top Right & Bottom Right Toolbar Controls */}
      <MapLayersToolbar
        mapType={mapType}
        setMapType={setMapType}
        hexColorMode={hexColorMode}
        setHexColorMode={setHexColorMode}
        hexZoom={hexZoom}
        hexPan={hexPan}
        handleHexReset={handleHexReset}
        handleRecenter={handleRecenter}
        showLayersMenu={showLayersMenu}
        setShowLayersMenu={setShowLayersMenu}
        layersMenuRef={layersMenuRef}
        showDistrictBorders={showDistrictBorders}
        setShowDistrictBorders={setShowDistrictBorders}
        showDistrictLabels={showDistrictLabels}
        setShowDistrictLabels={setShowDistrictLabels}
        basemap={basemap}
        handleBasemapChange={handleBasemapChange}
        isFullscreen={isFullscreen}
        handleToggleFullscreen={handleToggleFullscreen}
        thematicLayer={thematicLayer}
        setThematicLayer={setThematicLayer}
      />

      {/* 4. Bottom Left: Map Legend Overlay */}
      <MapLegendOverlay
        thematicLayer={thematicLayer}
        viewMode={viewMode}
        mapType={mapType}
        hexColorMode={hexColorMode}
        showDistrictBorders={showDistrictBorders}
      />
    </div>
  );
};

export const TelanganaMap = AndhraMap;
