import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, HelpCircle, X } from 'lucide-react';
import type { Year, ViewMode, DemographicsDataset, ElectionData, ActiveTab } from '../types';
import { getPartyColor } from '../types';

interface HeaderBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedYear: Year;
  setSelectedYear: (year: Year) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  electionData: ElectionData | null;
  setSelectedAcNo: (acNo: number) => void;
  onOpenDossier?: (acNo: number) => void;
  demographicsData?: DemographicsDataset | null;
  setIsExecutiveBriefingOpen?: (open: boolean) => void;
  onHelpOpen: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeTab,
  setActiveTab,
  selectedYear,
  setSelectedYear,
  viewMode,
  setViewMode,
  electionData,
  setSelectedAcNo,
  onOpenDossier: _onOpenDossier,
  demographicsData: _demographicsData,
  setIsExecutiveBriefingOpen: _setIsExecutiveBriefingOpen,
  onHelpOpen,
}) => {
  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const years: Year[] = ['2014', '2019', '2024'];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live autocomplete matches based on AC number or name
  const matchingAcs = useMemo(() => {
    if (!electionData || !search.trim()) return [];
    const q = search.trim().toLowerCase();
    const isNumeric = /^\d+$/.test(q);
    const yearResults = electionData.results[selectedYear] || electionData.results['2024'] || {};

    const list = Object.values(yearResults).filter((r) => {
      if (isNumeric) {
        return String(r.ac_no).startsWith(q) || String(r.ac_no) === q;
      }
      return (
        r.ac_name.toLowerCase().includes(q) ||
        r.district.toLowerCase().includes(q) ||
        (r.winner?.candidate && r.winner.candidate.toLowerCase().includes(q))
      );
    });

    if (isNumeric) {
      return list.sort((a, b) => a.ac_no - b.ac_no).slice(0, 10);
    }

    return list
      .sort((a, b) => {
        const aStarts = a.ac_name.toLowerCase().startsWith(q) ? 0 : 1;
        const bStarts = b.ac_name.toLowerCase().startsWith(q) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return a.ac_name.localeCompare(b.ac_name);
      })
      .slice(0, 10);
  }, [electionData, selectedYear, search]);

  const selectConstituency = (acNo: number) => {
    setSelectedAcNo(acNo);
    setSearch('');
    setIsSearchOpen(false);
    if (activeTab !== 'results') {
      setActiveTab('results');
    }
  };

  const handleAcSearch = () => {
    if (matchingAcs.length > 0) {
      selectConstituency(matchingAcs[0].ac_no);
    }
  };

  // Press Enter triggers search on top match, Escape closes dropdown
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAcSearch();
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-[1100] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-tr from-yellow-500 via-amber-600 to-red-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-xs shrink-0">
              AP
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                Andhra Pradesh Intelligence
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                175 Constituencies War Room
              </p>
            </div>
          </div>

          {/* Central tab switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs">
            <button
              onClick={() => setActiveTab('results')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-white text-indigo-700 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📊 Results &amp; Map</span>
            </button>
            <button
              onClick={() => setActiveTab('simulations')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'simulations'
                  ? 'bg-white text-indigo-700 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🔮 Simulations</span>
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'actions'
                  ? 'bg-white text-indigo-700 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🎯 Actions &amp; Playbook</span>
            </button>
            <button
              onClick={() => setActiveTab('booth-data')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'booth-data'
                  ? 'bg-white text-indigo-700 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📋 E-Panna &amp; Rolls</span>
              <span
                className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded-full border border-emerald-200 font-extrabold"
                title="Statewide booth rolls across all 175 constituencies"
              >
                175 ACs
              </span>
            </button>
          </div>

          {/* Right side: Help & Preferences */}
          <div className="flex items-center gap-2">
            <button
              onClick={onHelpOpen}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-2xs"
              title="Help, Guides & Display Scaling"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Help &amp; Settings</span>
            </button>
          </div>
        </div>

        {/* Sub-bar for Results tab: Year/Map view + Search */}
        {activeTab === 'results' && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 mt-2 border-t border-slate-100">
            {/* Year selector */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Election Year:</span>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => setSelectedYear(y)}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                      selectedYear === y
                        ? 'bg-white text-indigo-600 shadow-xs font-extrabold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            {/* Map view mode */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Map View:</span>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
                <button
                  onClick={() => setViewMode('winner')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    viewMode === 'winner'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Party Colors
                </button>
                <button
                  onClick={() => setViewMode('margin')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    viewMode === 'margin'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Margins
                </button>
                <button
                  onClick={() => setViewMode('swing')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    viewMode === 'swing'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  disabled={selectedYear === '2014'}
                  title={selectedYear === '2014' ? 'No prior election in state history' : 'Seat flip comparison'}
                >
                  Seat Swings
                </button>
              </div>
            </div>

            {/* AC Search with Live Autocomplete Dropdown */}
            <div className="relative w-52 sm:w-64" ref={searchContainerRef}>
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search AC # or name"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => {
                  if (search.trim()) setIsSearchOpen(true);
                }}
                onKeyDown={onKeyDown}
                className="w-full text-xs pl-9 pr-7 py-1.5 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Autocomplete Dropdown */}
              {isSearchOpen && search.trim().length > 0 && (
                <div className="absolute right-0 sm:left-0 sm:right-auto w-72 top-full mt-1.5 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden z-[1200] max-h-80 overflow-y-auto animate-in fade-in duration-100">
                  <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                    <span>Matching Constituencies</span>
                    <span>{matchingAcs.length} found</span>
                  </div>

                  {matchingAcs.length === 0 ? (
                    <div className="px-3 py-4 text-center text-xs text-slate-400">
                      No constituency matching &ldquo;<span className="font-semibold text-slate-600">{search}</span>&rdquo;
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {matchingAcs.map((ac) => {
                        const partyColor = getPartyColor(ac.winner?.party || 'OTH');
                        return (
                          <button
                            key={ac.ac_no}
                            type="button"
                            onClick={() => selectConstituency(ac.ac_no)}
                            className="w-full px-3 py-2 text-left hover:bg-indigo-50/80 transition-colors flex items-center justify-between gap-2 group cursor-pointer"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="font-mono text-[10px] font-bold bg-slate-100 group-hover:bg-indigo-100 text-slate-700 group-hover:text-indigo-800 px-1.5 py-0.5 rounded border border-slate-200 shrink-0 transition-colors">
                                #{ac.ac_no}
                              </span>
                              <div className="truncate">
                                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                                  {ac.ac_name}
                                </div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {ac.district} District &middot; {ac.winner?.candidate || 'N/A'}
                                </div>
                              </div>
                            </div>

                            <span
                              className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 flex items-center gap-1"
                              style={{
                                backgroundColor: `${partyColor}15`,
                                color: partyColor,
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: partyColor }} />
                              {ac.winner?.party || 'WON'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

