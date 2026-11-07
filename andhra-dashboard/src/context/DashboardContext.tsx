import React, { createContext, useContext, useState, useEffect } from 'react';
import type { MapColorShade } from '../types';

export type RegionalFilter = 'ALL' | 'COASTAL' | 'RAYALASEEMA' | string;

export interface MapShadeOption {
  key: MapColorShade;
  label: string;
  sub: string;
  badge: string;
  previewColors: string[];
}

export const MAP_SHADE_OPTIONS: MapShadeOption[] = [
  {
    key: 'medium_dark',
    label: 'Rich Pastel (+20% Darker)',
    sub: 'Default balanced contrast',
    badge: 'Recommended',
    previewColors: ['#fde047', '#fca5a5', '#93c5fd', '#fdba74'],
  },
  {
    key: 'very_dark',
    label: 'Deep Contrast (+40% Darker)',
    sub: 'High visibility on bright screens',
    badge: 'High Contrast',
    previewColors: ['#facc15', '#f87171', '#60a5fa', '#fb923c'],
  },
  {
    key: 'full_vibrant',
    label: 'Full Vibrant Party Colors',
    sub: '100% saturation for war room',
    badge: 'Vibrant',
    previewColors: ['#eab308', '#dc2626', '#2563eb', '#f97316'],
  },
  {
    key: 'soft_light',
    label: 'Soft Pastel (Original)',
    sub: 'Low contrast subtle tint',
    badge: 'Muted',
    previewColors: ['#fef08a', '#fecaca', '#bfdbfe', '#fed7aa'],
  },
];

interface DashboardContextType {
  isPlainEnglish: boolean;
  setIsPlainEnglish: (val: boolean | ((prev: boolean) => boolean)) => void;
  isZenMode: boolean;
  toggleZenMode: () => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  districtFilter: RegionalFilter;
  setDistrictFilter: (val: RegionalFilter) => void;
  mapColorShade: MapColorShade;
  setMapColorShade: (shade: MapColorShade) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlainEnglish, setIsPlainEnglishState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ts_dash_plain_english');
      if (saved !== null) return saved === 'true';
    }
    return false;
  });

  const setIsPlainEnglish = (val: boolean | ((prev: boolean) => boolean)) => {
    setIsPlainEnglishState((prev) => {
      const next = typeof val === 'function' ? val(prev) : val;
      try {
        localStorage.setItem('ts_dash_plain_english', String(next));
      } catch {}
      return next;
    });
  };

  const [mapColorShade, setMapColorShadeState] = useState<MapColorShade>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ts_dash_map_shade') as MapColorShade | null;
      if (saved && ['medium_dark', 'very_dark', 'full_vibrant', 'soft_light'].includes(saved)) {
        return saved;
      }
    }
    return 'medium_dark';
  });

  const setMapColorShade = (shade: MapColorShade) => {
    setMapColorShadeState(shade);
    try {
      localStorage.setItem('ts_dash_map_shade', shade);
    } catch {}
  };

  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [districtFilter, setDistrictFilter] = useState<RegionalFilter>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const toggleZenMode = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsZenMode(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsZenMode(false);
    }
  };

  // Sync fullscreen change with state
  useEffect(() => {
    const handleFsChange = () => {
      setIsZenMode(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        isPlainEnglish,
        setIsPlainEnglish,
        isZenMode,
        toggleZenMode,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        isShortcutsOpen,
        setIsShortcutsOpen,
        districtFilter,
        setDistrictFilter,
        mapColorShade,
        setMapColorShade,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

const defaultDashboardContext: DashboardContextType = {
  isPlainEnglish: false,
  setIsPlainEnglish: () => {},
  isZenMode: false,
  toggleZenMode: () => {},
  isCommandPaletteOpen: false,
  setIsCommandPaletteOpen: () => {},
  isShortcutsOpen: false,
  setIsShortcutsOpen: () => {},
  districtFilter: 'ALL',
  setDistrictFilter: () => {},
  mapColorShade: 'medium_dark',
  setMapColorShade: () => {},
  toastMessage: null,
  showToast: () => {},
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  return context || defaultDashboardContext;
};
