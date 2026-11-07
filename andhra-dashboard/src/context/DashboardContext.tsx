import React, { createContext, useContext, useState, useEffect } from 'react';

export type RegionalFilter = 'ALL' | 'COASTAL' | 'RAYALASEEMA' | string;

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
  toastMessage: null,
  showToast: () => {},
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  return context || defaultDashboardContext;
};
