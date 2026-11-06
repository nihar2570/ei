import React, { useState, useMemo } from 'react';
import {
  X,
  RotateCcw,
  Sparkles,
  Search,
  Sliders,
  CheckCircle,
  Flame,
} from 'lucide-react';
import type { DemographicsDataset } from '../types';
import {
  type PartySwing,
  type MacroSwing,
  type CommunityMeta,
  ALL_COMMUNITIES,
  DECISIVE_KEYS,
  rebalanceShares,
} from './swing/swingCommunityMeta';
import { CommunitySwingCard } from './swing/CommunitySwingCard';
import { StatewideMacroSection } from './swing/StatewideMacroSection';

export type { PartySwing, MacroSwing, CommunityMeta };
export { ALL_COMMUNITIES, DECISIVE_KEYS };

interface SwingStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DemographicsDataset;
  swings: Record<string, PartySwing>;
  setSwings: React.Dispatch<React.SetStateAction<Record<string, PartySwing>>>;
  macroSwing: MacroSwing;
  setMacroSwing: React.Dispatch<React.SetStateAction<MacroSwing>>;
  tally: {
    counts: Record<string, number>;
    flippedCount: number;
    tossUpCount: number;
    tdpDiff?: number;
    ysrcpDiff?: number;
    jspDiff?: number;
    bjpDiff?: number;
    incDiff?: number;
  };
  onApplyPreset?: (presetKey: string) => void;
  activePreset?: string;
}

export const SwingStudioModal: React.FC<SwingStudioModalProps> = ({
  isOpen,
  onClose,
  data,
  swings,
  setSwings,
  macroSwing,
  setMacroSwing,
  tally,
  onApplyPreset,
  activePreset,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'DECISIVE' | 'BC' | 'SC_ST' | 'OC_MIN' | 'AGE'>('DECISIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [lockedParties, setLockedParties] = useState<Record<string, { TDP?: boolean; YSRCP?: boolean; JSP?: boolean }>>({});
  const [macroLocked, setMacroLocked] = useState<{ TDP?: boolean; YSRCP?: boolean; JSP?: boolean }>({});

  // 2024 Andhra Pradesh Statewide Baseline (55.4% NDA vs 39.4% YSRCP)
  const statewideBaseline = useMemo(() => {
    return { TDP: 45.6, YSRCP: 39.4, JSP: 8.5, BJP: 2.8, INC: 1.7, OTH: 2.0 };
  }, []);

  // Filtered list of communities
  const filteredCommunities = useMemo(() => {
    return ALL_COMMUNITIES.filter((c) => {
      if (activeTab === 'DECISIVE') {
        if (!DECISIVE_KEYS.has(c.key)) return false;
      } else if (activeTab !== 'ALL' && c.category !== activeTab) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          c.name.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q) ||
          c.keyIssues.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeTab, searchQuery]);

  // Reset a single community
  const handleResetCommunity = (key: string) => {
    setSwings((prev) => ({
      ...prev,
      [key]: { TDP: 0, YSRCP: 0, JSP: 0 },
    }));
  };

  // Reset all
  const handleResetAll = () => {
    const resetSwings: Record<string, PartySwing> = {};
    ALL_COMMUNITIES.forEach((c) => {
      resetSwings[c.key] = { TDP: 0, YSRCP: 0, JSP: 0 };
    });
    setSwings(resetSwings);
    setMacroSwing({ TDP: 0, YSRCP: 0, JSP: 0 });
  };

  // Toggle party lock for a community
  const toggleLock = (commKey: string, party: 'TDP' | 'YSRCP' | 'JSP') => {
    setLockedParties((prev) => ({
      ...prev,
      [commKey]: {
        ...prev[commKey],
        [party]: !prev[commKey]?.[party],
      },
    }));
  };

  // Handle Community Party adjustment (Simplex Rebalance)
  const handleAdjustCommunity = (commKey: string, party: 'TDP' | 'YSRCP' | 'JSP', newVal: number) => {
    const baseline = data.baseline_exit_poll?.[commKey] || { TDP: 46, YSRCP: 40, JSP: 10, OTH: 4 };
    const currSwing = swings[commKey] || { TDP: 0, YSRCP: 0, JSP: 0 };

    const currentShares = {
      TDP: (baseline.TDP || 46) + (currSwing.TDP || 0),
      YSRCP: (baseline.YSRCP || 40) + (currSwing.YSRCP || 0),
      JSP: (baseline.JSP || 10) + (currSwing.JSP || 0),
      OTH: baseline.OTH || 4,
    };

    const locked = lockedParties[commKey] || {};
    const updated = rebalanceShares(currentShares, party, newVal, locked);

    setSwings((prev) => ({
      ...prev,
      [commKey]: {
        TDP: Math.round((updated.TDP - (baseline.TDP || 46)) * 10) / 10,
        YSRCP: Math.round((updated.YSRCP - (baseline.YSRCP || 40)) * 10) / 10,
        JSP: Math.round((updated.JSP - (baseline.JSP || 10)) * 10) / 10,
      },
    }));
  };

  // Handle Statewide Macro adjustment
  const handleAdjustMacro = (party: 'TDP' | 'YSRCP' | 'JSP', newVal: number) => {
    const currentShares = {
      TDP: statewideBaseline.TDP + (macroSwing.TDP || 0),
      YSRCP: statewideBaseline.YSRCP + (macroSwing.YSRCP || 0),
      JSP: statewideBaseline.JSP + (macroSwing.JSP || 0),
      OTH: (statewideBaseline.BJP || 2.8) + (statewideBaseline.INC || 1.7) + (statewideBaseline.OTH || 2.0),
    };

    const updated = rebalanceShares(currentShares, party, newVal, macroLocked);

    setMacroSwing({
      TDP: Math.round((updated.TDP - statewideBaseline.TDP) * 10) / 10,
      YSRCP: Math.round((updated.YSRCP - statewideBaseline.YSRCP) * 10) / 10,
      JSP: Math.round((updated.JSP - statewideBaseline.JSP) * 10) / 10,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-6xl h-[92vh] flex flex-col text-slate-900 overflow-hidden">
        {/* Sticky Header: War Room Barometer & Controls */}
        <div className="bg-white border-b border-slate-200 p-4 sm:p-5 flex flex-col gap-3 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl">
                <Sliders className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Demographic Swing Studio
                  </h2>
                  <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-0.5 rounded-full font-bold">
                    Demographics Engine • 100% Simplex Balancer
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Interactive multi-party vote share engine for TDP, YSRCP &amp; JSP across 18 demographic groups
                </p>
              </div>
            </div>

            {/* Right Controls: Reset & Close */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer shadow-2xs"
                title="Reset all swings to 2024 baseline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Live Majority Gauge Bar (88 to Majority Mark in AP 175 ACs) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200">
            {/* TDP */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-amber-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                <span className="text-xs font-bold text-amber-900">TDP</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-slate-900">{tally.counts.TDP || 0}</span>
                <span className={`text-[10px] font-mono font-bold ${(tally.tdpDiff || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {(tally.tdpDiff || 0) >= 0 ? `+${tally.tdpDiff || 0}` : tally.tdpDiff}
                </span>
                {(tally.counts.TDP || 0) >= 88 && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
            </div>

            {/* YSRCP */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-sky-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                <span className="text-xs font-bold text-sky-900">YSRCP</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-slate-900">{tally.counts.YSRCP || 0}</span>
                <span className={`text-[10px] font-mono font-bold ${(tally.ysrcpDiff || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {(tally.ysrcpDiff || 0) >= 0 ? `+${tally.ysrcpDiff || 0}` : tally.ysrcpDiff}
                </span>
                {(tally.counts.YSRCP || 0) >= 88 && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
              </div>
            </div>

            {/* JSP */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-rose-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" />
                <span className="text-xs font-bold text-rose-900">JSP</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-slate-900">{tally.counts.JSP || 0}</span>
                <span className={`text-[10px] font-mono font-bold ${(tally.jspDiff || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {(tally.jspDiff || 0) >= 0 ? `+${tally.jspDiff || 0}` : tally.jspDiff}
                </span>
              </div>
            </div>

            {/* BJP */}
            <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-orange-200 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                <span className="text-xs font-bold text-orange-900">BJP</span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-slate-900">{tally.counts.BJP || 0}</span>
                <span className={`text-[10px] font-mono font-bold ${(tally.bjpDiff || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {(tally.bjpDiff || 0) >= 0 ? `+${tally.bjpDiff || 0}` : tally.bjpDiff}
                </span>
              </div>
            </div>

            {/* Triage / Flips */}
            <div className="flex items-center justify-between px-3 py-2 bg-rose-50 rounded-lg border border-rose-200 col-span-2 sm:col-span-1 shadow-2xs">
              <div className="flex items-center gap-1 text-rose-700 text-xs font-bold">
                <Flame className="w-3.5 h-3.5" />
                <span>Flips / Triage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-rose-900 font-mono">{tally.flippedCount} flips</span>
                <span className="text-[10px] text-slate-500 font-mono">({tally.tossUpCount} close)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-slate-100/50">
          {/* Section 1: Statewide Macro Swing */}
          <StatewideMacroSection
            macroSwing={macroSwing}
            setMacroSwing={setMacroSwing}
            statewideBaseline={statewideBaseline}
            onApplyPreset={onApplyPreset}
            activePreset={activePreset}
            onAdjustMacro={handleAdjustMacro}
            macroLocked={macroLocked}
            setMacroLocked={setMacroLocked}
          />

          {/* Section 2: Demographic Category Filter Tabs & Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl border border-slate-300/60 overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveTab('DECISIVE')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'DECISIVE'
                    ? 'bg-amber-500 text-white font-black shadow-xs'
                    : 'text-amber-800 hover:text-amber-950 hover:bg-amber-100/50'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Quick Battleground Sliders (7)</span>
              </button>
              <button
                onClick={() => setActiveTab('ALL')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'ALL'
                    ? 'bg-white text-indigo-700 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Groups ({ALL_COMMUNITIES.length})
              </button>
              <button
                onClick={() => setActiveTab('BC')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'BC'
                    ? 'bg-white text-indigo-700 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Backward Classes (~50%)
              </button>
              <button
                onClick={() => setActiveTab('SC_ST')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'SC_ST'
                    ? 'bg-white text-indigo-700 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                SC &amp; ST (~28%)
              </button>
              <button
                onClick={() => setActiveTab('OC_MIN')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'OC_MIN'
                    ? 'bg-white text-indigo-700 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Minorities &amp; OCs (~22%)
              </button>
              <button
                onClick={() => setActiveTab('AGE')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'AGE'
                    ? 'bg-white text-indigo-700 font-black shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Age Cohorts
              </button>
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search caste, district, issue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-800 placeholder-slate-400 text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-2xs"
              />
            </div>
          </div>

          {/* Section 3: Clean 2-Column Grid of Community Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCommunities.map((comm) => {
              const baseline = data.baseline_exit_poll?.[comm.key] || {
                TDP: 46,
                YSRCP: 40,
                JSP: 10,
                OTH: 4,
              };
              const currSwing = swings[comm.key] || { TDP: 0, YSRCP: 0, JSP: 0 };
              const isCustomized = (currSwing.TDP || 0) !== 0 || (currSwing.YSRCP || 0) !== 0 || (currSwing.JSP || 0) !== 0;
              const locked = lockedParties[comm.key] || {};

              return (
                <CommunitySwingCard
                  key={comm.key}
                  comm={comm}
                  baseline={baseline}
                  currSwing={currSwing}
                  isCustomized={isCustomized}
                  locked={locked}
                  onToggleLock={(p) => toggleLock(comm.key, p)}
                  onAdjust={(p, val) => handleAdjustCommunity(comm.key, p, val)}
                  onReset={() => handleResetCommunity(comm.key)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
