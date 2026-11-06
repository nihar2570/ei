import React, { useState, useMemo, useEffect } from 'react';
import type { DemographicsDataset, ActiveScenarioBridge, ConstituencyCandidatesData } from '../types';
import type { WhatIfTab } from './AdvancedSimulationSuite';
import {
  Target,
  Sparkles,
  TrendingUp,
  Copy,
  Check,
  CheckCircle,
  FileText,
  Star,
  AlertTriangle,
  Download,
  X,
  Handshake,
  Sliders,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { StarCampaignerAllocator } from './StarCampaignerAllocator';
import { DefectionRebelModeler, type DefectionEvent, PRESET_SCENARIOS } from './DefectionRebelModeler';
import { ExecutiveBriefingModal } from './ExecutiveBriefingModal';
import { ResourceAllocationBarometer } from './actions/ResourceAllocationBarometer';
import {
  ConstituencyActionList,
  type ActionAllocation,
} from './actions/ConstituencyActionList';
import {
  computeStarLiftMap,
  computeDefectionShiftMap,
  computeCumulativeAcImpacts,
  computeBattlegroundList,
  autoAllocateBudget as calculateSmartAllocations,
  generateStrategicPlanMemo,
} from '../services/actionEngine';

interface ActionsViewProps {
  data: DemographicsDataset;
  initialSelectedAc?: number | null;
  onOpenDossier?: (acNo: number) => void;
  scenarioBridge?: ActiveScenarioBridge | null;
  onUnlinkScenario?: () => void;
  onNavigateToWhatIf?: (category: WhatIfTab) => void;
  onActionsTallyChange?: (tally: {
    TDP: number;
    YSRCP: number;
    JSP: number;
    BJP: number;
    INC: number;
    coalitionCombined: number;
    flipsCount: number;
  }) => void;
  candidatesData?: Record<string, ConstituencyCandidatesData> | null;
}

export const ActionsView: React.FC<ActionsViewProps> = ({
  data,
  initialSelectedAc,
  onOpenDossier,
  scenarioBridge,
  onUnlinkScenario,
  onNavigateToWhatIf,
  onActionsTallyChange,
  candidatesData,
}) => {
  const isScenarioActive = Boolean(scenarioBridge && scenarioBridge.isExportedToActions);
  const isCoalition = scenarioBridge?.id === 'nda_2024_sweep' || true; // NDA alliance is the governing coalition
  // Default to TDP across Andhra Pradesh War Room
  const [targetParty, setTargetParty] = useState<'TDP' | 'YSRCP' | 'JSP' | 'BJP'>('TDP');
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [digitalYieldPerPoint, setDigitalYieldPerPoint] = useState<number>(45);
  const [rallyYieldPerPoint, setRallyYieldPerPoint] = useState<number>(65);
  const [welfareYieldPerPoint, setWelfareYieldPerPoint] = useState<number>(55);
  const [expandedAcNo, setExpandedAcNo] = useState<number | null>(initialSelectedAc || null);
  const [filterType, setFilterType] = useState<'battleground' | 'all' | 'flipped'>('battleground');
  const [battlegroundMarginThreshold, setBattlegroundMarginThreshold] = useState<number>(8000);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionSubTab, setActionSubTab] = useState<'tactical' | 'star_campaigners' | 'defections'>('tactical');
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);

  // Per-AC action allocations
  const [allocations, setAllocations] = useState<Record<number, ActionAllocation>>(() => {
    const init: Record<number, ActionAllocation> = {};
    // Seed default allocations for close Andhra battleground seats
    const topBattlegrounds = [25, 37, 71, 79, 81, 91, 166, 174];
    if (initialSelectedAc && !topBattlegrounds.includes(initialSelectedAc)) {
      topBattlegrounds.unshift(initialSelectedAc);
    }
    topBattlegrounds.forEach((acNo) => {
      init[acNo] = {
        digitalPoints: 20,
        rallyPoints: 15,
        welfarePoints: 15,
      };
    });
    return init;
  });

  // Star Campaigners Allocations store (shared across Playbook tabs)
  const [starAllocations, setStarAllocations] = useState<Record<string, Record<number, number>>>({});

  // Defection & Rebel Events store (shared across Playbook tabs)
  const [defectionEvents, setDefectionEvents] = useState<DefectionEvent[]>(() =>
    PRESET_SCENARIOS.map((s, idx) => ({ ...s, id: `preset_${idx + 1}` }))
  );

  // Compute star lift per AC for targetParty
  const starLiftMap = useMemo(() => {
    return computeStarLiftMap(data, starAllocations, targetParty);
  }, [data, starAllocations, targetParty]);

  // Compute net defection & rebel shift per AC for targetParty
  const defectionShiftMap = useMemo(() => {
    return computeDefectionShiftMap(data, defectionEvents, targetParty);
  }, [data, defectionEvents, targetParty]);

  // Pre-calculate cumulative AC impacts for fast lookup in child tabs
  const cumulativeAcImpacts = useMemo(() => {
    return computeCumulativeAcImpacts(
      data,
      allocations,
      starLiftMap,
      defectionShiftMap,
      targetParty,
      digitalYieldPerPoint,
      rallyYieldPerPoint,
      welfareYieldPerPoint
    );
  }, [data, allocations, starLiftMap, defectionShiftMap, targetParty, digitalYieldPerPoint, rallyYieldPerPoint, welfareYieldPerPoint]);

  // Campaign Resource Points Pool (customizable & expandable)
  const [totalPointsBudget, setTotalPointsBudget] = useState<number>(1000);
  const totalAllocated = useMemo(() => {
    return Object.values(allocations).reduce(
      (sum, a) => sum + a.digitalPoints + a.rallyPoints + a.welfarePoints,
      0
    );
  }, [allocations]);

  const remainingPoints = totalPointsBudget - totalAllocated;

  // Prioritize battleground seats sorted by tightest margin
  const battlegroundList = useMemo(() => {
    return computeBattlegroundList({
      data,
      targetParty,
      allocations,
      digitalYieldPerPoint,
      rallyYieldPerPoint,
      welfareYieldPerPoint,
      starLiftMap,
      defectionShiftMap,
      isScenarioActive,
      scenarioBridge,
    });
  }, [
    data,
    targetParty,
    allocations,
    digitalYieldPerPoint,
    rallyYieldPerPoint,
    welfareYieldPerPoint,
    starLiftMap,
    defectionShiftMap,
    isScenarioActive,
    scenarioBridge,
  ]);

  // Filtered battleground view based on search, threshold, and filter pill
  const filteredBattlegrounds = useMemo(() => {
    return battlegroundList
      .filter((b) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesName = b.ac_name.toLowerCase().includes(q);
          const matchesDist = b.district.toLowerCase().includes(q);
          const matchesNo = b.ac_no.toString().includes(q);
          if (!matchesName && !matchesDist && !matchesNo) return false;
        }

        if (filterType === 'battleground') {
          return b.margin_2023 <= battlegroundMarginThreshold;
        }
        if (filterType === 'flipped') {
          return b.isFlippedToWin || b.seatTotalPoints > 0;
        }
        return true;
      })
      .sort((a, b) => a.margin_2023 - b.margin_2023);
  }, [battlegroundList, filterType, battlegroundMarginThreshold, searchQuery]);

  // Handle single AC point adjustment
  const handlePointChange = (
    acNo: number,
    field: 'digitalPoints' | 'rallyPoints' | 'welfarePoints',
    val: number
  ) => {
    setAllocations((prev) => {
      const current = prev[acNo] || { digitalPoints: 0, rallyPoints: 0, welfarePoints: 0 };
      return {
        ...prev,
        [acNo]: {
          ...current,
          [field]: Math.max(0, val),
        },
      };
    });
  };

  // Automated Smart Allocator: Distributes points to top battleground seats for maximum seat yield, fully exhausting the total points budget
  const autoAllocateBudget = () => {
    const newAlloc = calculateSmartAllocations(
      totalPointsBudget,
      battlegroundList,
      digitalYieldPerPoint,
      rallyYieldPerPoint,
      welfareYieldPerPoint
    );
    setAllocations(newAlloc);
  };

  // Reset all allocations
  const resetAllocations = () => {
    setAllocations({});
  };

  // Seats flipped count
  const flippedCount = useMemo(() => {
    return battlegroundList.filter((b) => b.isFlippedToWin).length;
  }, [battlegroundList]);

  // Overall Cumulative Playbook Metrics across all 3 pillars
  const cumulativeMetrics = useMemo(() => {
    let baselineSeats = 0;
    let cumulativeSeatsWon = 0;
    let cumulativeFlipsCount = 0;
    let resourceTargetCount = 0;
    let totalResourceVotes = 0;
    let totalStarVotes = 0;
    let totalDefectionNetVotes = 0;

    battlegroundList.forEach((b) => {
      if (b.isTargetWinning) baselineSeats++;
      if (b.cumulativeProjectedMargin > 0) cumulativeSeatsWon++;
      if (b.isCumulativelyFlipped) cumulativeFlipsCount++;
      if (b.seatTotalPoints > 0) {
        resourceTargetCount++;
        totalResourceVotes += b.totalSwing;
      }
      totalStarVotes += b.starLift;
      totalDefectionNetVotes += b.defectionShift;
    });

    let activeStarCampaignerDays = 0;
    const starAcSet = new Set<number>();
    Object.values(starAllocations).forEach((acMap) => {
      Object.entries(acMap).forEach(([acNo, days]) => {
        if (days > 0) {
          activeStarCampaignerDays += days;
          starAcSet.add(Number(acNo));
        }
      });
    });
    const starConstituenciesCount = starAcSet.size;
    const activeDefectionsCount = defectionEvents.filter((e) => e.enabled).length;
    const netCombinedVotes = totalResourceVotes + totalStarVotes + totalDefectionNetVotes;

    return {
      baselineSeats,
      cumulativeSeatsWon,
      cumulativeFlipsCount,
      resourceTargetCount,
      totalResourceVotes,
      totalStarVotes,
      totalDefectionNetVotes,
      netCombinedVotes,
      activeStarCampaignerDays,
      starConstituenciesCount,
      activeDefectionsCount,
    };
  }, [battlegroundList, starAllocations, defectionEvents]);

  // 2023 Historical Baseline for Target Party
  const targetSeats2023 = useMemo(() => {
    return Object.values(data.constituencies).filter(
      (c) => c.winner_2023.party === targetParty
    ).length;
  }, [data, targetParty]);

  // Post-Actions Statewide Seat Tally across all parties (Andhra Pradesh 175 ACs)
  const postActionTally = useMemo(() => {
    let tdpSeats = 0;
    let ysrcpSeats = 0;
    let jspSeats = 0;
    let bjpSeats = 0;
    let incSeats = 0;
    let othSeats = 0;

    battlegroundList.forEach((b) => {
      if (b.cumulativeProjectedMargin > 0) {
        if (targetParty === 'TDP') tdpSeats++;
        else if (targetParty === 'YSRCP') ysrcpSeats++;
        else if (targetParty === 'JSP') jspSeats++;
        else if (targetParty === 'BJP') bjpSeats++;
      } else {
        const originalWinner = b.winner_2023;
        if (originalWinner === targetParty) {
          const runner = b.runner_up_2023;
          if (runner === 'TDP') tdpSeats++;
          else if (runner === 'YSRCP') ysrcpSeats++;
          else if (runner === 'JSP') jspSeats++;
          else if (runner === 'BJP') bjpSeats++;
          else if (runner === 'INC') incSeats++;
          else othSeats++;
        } else {
          if (originalWinner === 'TDP') tdpSeats++;
          else if (originalWinner === 'YSRCP') ysrcpSeats++;
          else if (originalWinner === 'JSP') jspSeats++;
          else if (originalWinner === 'BJP') bjpSeats++;
          else if (originalWinner === 'INC') incSeats++;
          else othSeats++;
        }
      }
    });

    const coalitionCombined = tdpSeats + jspSeats + bjpSeats;

    return {
      TDP: tdpSeats,
      YSRCP: ysrcpSeats,
      JSP: jspSeats,
      BJP: bjpSeats,
      INC: incSeats,
      OTH: othSeats,
      coalitionCombined,
    };
  }, [battlegroundList, targetParty]);

  const baselineCoalitionSeats = useMemo(() => {
    if (!scenarioBridge) return 164;
    return (
      (scenarioBridge.tally.counts.TDP || 0) +
      (scenarioBridge.tally.counts.JSP || 0) +
      (scenarioBridge.tally.counts.BJP || 0)
    );
  }, [scenarioBridge]);

  const postActionCoalitionSeats = postActionTally.coalitionCombined;
  const coalitionDiff = postActionCoalitionSeats - baselineCoalitionSeats;

  // 2024 Actual Combined Seats for NDA (TDP 135 + JSP 21 + BJP 8 = 164)
  const coalition2024Seats = useMemo(() => {
    let count = 0;
    Object.values(data.constituencies).forEach((c) => {
      if (c.winner_2023.party === 'TDP' || c.winner_2023.party === 'JSP' || c.winner_2023.party === 'BJP') count++;
    });
    return count;
  }, [data]);

  // Sync post-action tally with parent bridge/ribbon
  useEffect(() => {
    if (onActionsTallyChange) {
      onActionsTallyChange({
        TDP: postActionTally.TDP,
        YSRCP: postActionTally.YSRCP,
        JSP: postActionTally.JSP,
        BJP: postActionTally.BJP,
        INC: postActionTally.INC,
        coalitionCombined: postActionTally.coalitionCombined,
        flipsCount: cumulativeMetrics.cumulativeFlipsCount,
      });
    }
  }, [postActionTally, cumulativeMetrics.cumulativeFlipsCount, onActionsTallyChange]);

  // Generated Plan Memo content
  const generatedPlanMemo = useMemo(() => {
    return generateStrategicPlanMemo(
      battlegroundList,
      targetParty,
      totalAllocated,
      totalPointsBudget,
      flippedCount,
      digitalYieldPerPoint,
      rallyYieldPerPoint,
      welfareYieldPerPoint
    );
  }, [
    battlegroundList,
    targetParty,
    totalAllocated,
    totalPointsBudget,
    flippedCount,
    digitalYieldPerPoint,
    rallyYieldPerPoint,
    welfareYieldPerPoint,
  ]);

  // Download plan file handler
  const handleDownloadPlan = () => {
    const blob = new Blob([generatedPlanMemo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Andhra_Pradesh_Strategic_Campaign_Plan_${targetParty}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy plan to clipboard
  const handleCopyPlan = () => {
    navigator.clipboard.writeText(generatedPlanMemo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Playbook Sub-Navigation & Feature #11 Executive Briefing Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActionSubTab('tactical')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              actionSubTab === 'tactical'
                ? 'bg-white text-indigo-700 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-indigo-600" />
            <span>Resource Points Allocator</span>
          </button>

          <button
            onClick={() => setActionSubTab('star_campaigners')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              actionSubTab === 'star_campaigners'
                ? 'bg-white text-amber-700 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Star Campaigners</span>
          </button>

          <button
            onClick={() => setActionSubTab('defections')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
              actionSubTab === 'defections'
                ? 'bg-white text-rose-700 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Defections &amp; Rebels</span>
          </button>
        </div>

        {/* Executive Intelligence Briefing */}
        <button
          onClick={() => setIsExecutiveModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 hover:from-indigo-600 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer border border-indigo-500/30 group"
          title="Open printable C-Suite Executive Intelligence Briefing Dossier"
        >
          <FileText className="w-4 h-4 text-indigo-200 group-hover:scale-110 transition-transform" />
          <span>Executive Briefing</span>
        </button>
      </div>

      {/* 3-Stage Mandate Progression Card (Visible when simulation scenario is exported to Actions) */}
      {isScenarioActive && scenarioBridge && (
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-indigo-200 shadow-sm space-y-3.5 animate-in fade-in duration-150">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                    3-Stage Comprehensive Mandate Pipeline
                  </h3>
                  <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Simulation Active: {scenarioBridge.name}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Showing return-on-investment: 2023 Actual Mandate ➔ 2028 Simulation Scenario ➔ Field Playbook Compounded Lift
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateToWhatIf?.('coalition')}
                className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Open Simulations tab to modify what-ifs"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Modify What-Ifs</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              {onUnlinkScenario && (
                <button
                  onClick={onUnlinkScenario}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-all cursor-pointer flex items-center gap-1"
                  title="Unlink simulation scenario and restore 2024 actual results baseline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to 2024</span>
                </button>
              )}
            </div>
          </div>

          {/* 3-Stage Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Stage 1: 2024 Actual Mandate */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>Stage 1: 2024 Actual</span>
                <span className="text-[10px] font-mono text-slate-400 uppercase">Historical Base</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-700 font-mono">{targetSeats2023}</span>
                <span className="text-xs text-slate-500 font-medium">seats won ({targetParty})</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Official Election Commission of India 2024 result
              </p>
              {isCoalition && (
                <div className="text-[11px] font-mono text-amber-700 font-bold mt-1.5 pt-1.5 border-t border-slate-200 flex items-center justify-between">
                  <span>NDA 2024 Mandate:</span>
                  <span className="font-black text-amber-900">{coalition2024Seats} seats</span>
                </div>
              )}
            </div>

            {/* Stage 2: Simulation Scenario Base */}
            <div className="p-3.5 bg-indigo-50/70 rounded-xl border border-indigo-200 space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-900">
                <span>Stage 2: Simulation Base</span>
                <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-100 px-1.5 py-0.2 rounded">
                  {scenarioBridge.whatIfs.length} What-Ifs
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-indigo-950 font-mono">{cumulativeMetrics.baselineSeats}</span>
                <span className={`text-xs font-bold font-mono ${cumulativeMetrics.baselineSeats - targetSeats2023 >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {cumulativeMetrics.baselineSeats - targetSeats2023 >= 0 ? `+${cumulativeMetrics.baselineSeats - targetSeats2023}` : cumulativeMetrics.baselineSeats - targetSeats2023} vs 2024
                </span>
              </div>
              <p className="text-[11px] text-indigo-800 font-medium line-clamp-1" title={scenarioBridge.name}>
                {scenarioBridge.name}
              </p>
              {isCoalition && (
                <div className="text-[11px] font-mono text-amber-900 font-bold mt-1.5 pt-1.5 border-t border-indigo-200 flex items-center justify-between">
                  <span>NDA Alliance Simulation Base:</span>
                  <span className="font-black text-amber-950">
                    {baselineCoalitionSeats} seats (TDP {scenarioBridge.tally.counts.TDP || 0} + JSP {scenarioBridge.tally.counts.JSP || 0} + BJP {scenarioBridge.tally.counts.BJP || 0})
                  </span>
                </div>
              )}
            </div>

            {/* Stage 3: Field Actions Final */}
            <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-300 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span>Stage 3: Compounded Final</span>
                <span className="text-[10px] font-mono text-emerald-800 font-black bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                  Playbook Total
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-950 font-mono">
                  {cumulativeMetrics.cumulativeSeatsWon}
                </span>
                <span className="text-xs text-emerald-700 font-black font-mono">
                  +{cumulativeMetrics.cumulativeFlipsCount} Flips Unlocked
                </span>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium">
                {cumulativeMetrics.netCombinedVotes >= 0 ? '+' : ''}{cumulativeMetrics.netCombinedVotes.toLocaleString()} net votes generated from Ground Operations
              </p>
              {isCoalition && (
                <div className="text-[11px] font-mono font-bold mt-1.5 pt-1.5 border-t border-emerald-200 flex items-center justify-between">
                  <span className="text-amber-950">NDA Projected Total:</span>
                  <span className="font-black text-amber-900">
                    {postActionCoalitionSeats} seats
                    {coalitionDiff !== 0 && (
                      <span className={`ml-1 text-[10px] px-1 py-0.2 rounded ${coalitionDiff < 0 ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'}`}>
                        {coalitionDiff < 0 ? `${coalitionDiff}` : `+${coalitionDiff}`}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* NDA Coalition Combined Majority Barometer Banner */}
          {isCoalition && (
            <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-black text-amber-900 flex items-center gap-1.5">
                  <Handshake className="w-4 h-4 text-amber-600" />
                  <span>NDA Alliance Combined Projection:</span>
                </span>
                <span className="text-sm font-black font-mono text-amber-950">
                  {postActionCoalitionSeats} Seats
                </span>
                <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                  coalitionDiff < 0
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {coalitionDiff < 0 ? `${coalitionDiff} seats dropped` : 'Simulation baseline intact'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-mono text-xs">
                <span>Majority Mark: <strong>88 Seats</strong></span>
                <span>•</span>
                <span className={`font-bold ${postActionCoalitionSeats >= 88 ? 'text-emerald-800 font-black' : 'text-rose-800'}`}>
                  {postActionCoalitionSeats >= 88
                    ? `NDA holds +${postActionCoalitionSeats - 88} seat supermajority buffer`
                    : `Dropped below 88-seat majority (-${88 - postActionCoalitionSeats} seats)!`}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Live Cumulative Campaign Actions Engine Barometer */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-700/60 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-indigo-300">
                  Compounded Action Engine
                </span>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded font-mono font-bold">
                  Strategy for: {targetParty}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white">
                Live Cumulative Impact: Resource Allocator + Star Campaigners + Defections &amp; Rebels
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Target Total Won */}
            <div className="bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl text-right">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">{targetParty} Projected Won</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-white">{cumulativeMetrics.cumulativeSeatsWon}</span>
                <span className="text-xs text-slate-400 font-mono">/ 175 seats</span>
                <span className={`text-[11px] font-black px-1.5 py-0.2 rounded font-mono ${
                  cumulativeMetrics.cumulativeSeatsWon >= 88 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {cumulativeMetrics.cumulativeSeatsWon >= 88 ? 'MAJORITY' : `${88 - cumulativeMetrics.cumulativeSeatsWon} short`}
                </span>
              </div>
            </div>

            {/* NDA Coalition Combined Box */}
            {isCoalition && (
              <div className="bg-amber-950/70 border border-amber-500/50 px-3 py-1.5 rounded-xl text-right">
                <span className="text-[10px] text-amber-300 block font-bold uppercase tracking-wider">
                  NDA Alliance (Combined)
                </span>
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="text-lg font-black text-amber-200 font-mono">{postActionCoalitionSeats}</span>
                  <span className="text-xs text-amber-400 font-mono">/ 175</span>
                  <span className={`text-[11px] font-black px-1.5 py-0.2 rounded font-mono ${
                    postActionCoalitionSeats >= 88 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {postActionCoalitionSeats >= 88 ? 'MAJORITY' : 'UNDER 88'}
                  </span>
                  {coalitionDiff !== 0 && (
                    <span className={`text-[10px] font-mono font-bold px-1 rounded ${
                      coalitionDiff < 0 ? 'bg-rose-400/20 text-rose-300' : 'bg-emerald-400/20 text-emerald-300'
                    }`}>
                      {coalitionDiff < 0 ? `${coalitionDiff}` : `+${coalitionDiff}`}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4 Pillars Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          {/* Pillar 1: Resource Point Allocator */}
          <div className={`p-2.5 rounded-xl border transition-all ${
            cumulativeMetrics.resourceTargetCount > 0
              ? 'bg-indigo-950/40 border-indigo-500/40'
              : 'bg-slate-800/40 border-slate-700/50'
          }`}>
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3 text-indigo-400" /> Resource Allocator
              </span>
              <span className="font-mono text-indigo-300">{cumulativeMetrics.resourceTargetCount} ACs</span>
            </div>
            <div className="text-sm font-black text-indigo-200 font-mono">
              +{cumulativeMetrics.totalResourceVotes.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">votes</span>
            </div>
          </div>

          {/* Pillar 2: Star Campaigners */}
          <div className={`p-2.5 rounded-xl border transition-all ${
            cumulativeMetrics.activeStarCampaignerDays > 0
              ? 'bg-amber-950/40 border-amber-500/40'
              : 'bg-slate-800/40 border-slate-700/50'
          }`}>
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Star Campaigners
              </span>
              <span className="font-mono text-amber-300">{cumulativeMetrics.activeStarCampaignerDays} days</span>
            </div>
            <div className="text-sm font-black text-amber-200 font-mono">
              +{cumulativeMetrics.totalStarVotes.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">votes</span>
            </div>
          </div>

          {/* Pillar 3: Defections & Rebels */}
          <div className={`p-2.5 rounded-xl border transition-all ${
            cumulativeMetrics.activeDefectionsCount > 0
              ? 'bg-rose-950/40 border-rose-500/40'
              : 'bg-slate-800/40 border-slate-700/50'
          }`}>
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" /> Defections &amp; Rebels
              </span>
              <span className="font-mono text-rose-300">{cumulativeMetrics.activeDefectionsCount} events</span>
            </div>
            <div className="text-sm font-black text-rose-200 font-mono">
              {cumulativeMetrics.totalDefectionNetVotes >= 0 ? '+' : ''}
              {cumulativeMetrics.totalDefectionNetVotes.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">votes</span>
            </div>
          </div>

          {/* Consolidated Combined Lift */}
          <div className="p-2.5 rounded-xl border bg-emerald-950/40 border-emerald-500/40">
            <div className="flex items-center justify-between text-[11px] text-slate-300 font-bold mb-1">
              <span className="flex items-center gap-1 text-emerald-300">
                <TrendingUp className="w-3 h-3 text-emerald-400" /> Net Flips Gained
              </span>
              <span className="font-mono text-emerald-300 font-black">+{cumulativeMetrics.cumulativeFlipsCount} Flips</span>
            </div>
            <div className="text-sm font-black text-emerald-200 font-mono">
              {cumulativeMetrics.netCombinedVotes >= 0 ? '+' : ''}
              {cumulativeMetrics.netCombinedVotes.toLocaleString()} <span className="text-[10px] font-normal text-slate-400">net votes</span>
            </div>
          </div>
        </div>
      </div>

      {actionSubTab === 'star_campaigners' && (
        <StarCampaignerAllocator
          data={data}
          onOpenDossier={onOpenDossier}
          allocations={starAllocations}
          onAllocationsChange={setStarAllocations}
          cumulativeAcImpacts={cumulativeAcImpacts}
        />
      )}

      {actionSubTab === 'defections' && (
        <DefectionRebelModeler
          data={data}
          onOpenDossier={onOpenDossier}
          events={defectionEvents}
          onEventsChange={setDefectionEvents}
          cumulativeAcImpacts={cumulativeAcImpacts}
        />
      )}

      {actionSubTab === 'tactical' && (
        <div className="space-y-6">
          <ResourceAllocationBarometer
            targetParty={targetParty}
            setTargetParty={setTargetParty}
            autoAllocateBudget={autoAllocateBudget}
            resetAllocations={resetAllocations}
            totalAllocated={totalAllocated}
            totalPointsBudget={totalPointsBudget}
            setTotalPointsBudget={setTotalPointsBudget}
            remainingPoints={remainingPoints}
            flipsCount={flippedCount}
            totalVotesGained={cumulativeMetrics.totalResourceVotes}
            isScenarioActive={isScenarioActive}
            scenarioBridge={scenarioBridge}
            onUnlinkScenario={onUnlinkScenario}
            onNavigateToWhatIf={onNavigateToWhatIf}
            digitalYieldPerPoint={digitalYieldPerPoint}
            setDigitalYieldPerPoint={setDigitalYieldPerPoint}
            rallyYieldPerPoint={rallyYieldPerPoint}
            setRallyYieldPerPoint={setRallyYieldPerPoint}
            welfareYieldPerPoint={welfareYieldPerPoint}
            setWelfareYieldPerPoint={setWelfareYieldPerPoint}
          />

          <ConstituencyActionList
            filteredBattlegrounds={filteredBattlegrounds}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            battlegroundMarginThreshold={battlegroundMarginThreshold}
            setBattlegroundMarginThreshold={setBattlegroundMarginThreshold}
            filterType={filterType}
            setFilterType={setFilterType}
            expandedAcNo={expandedAcNo}
            setExpandedAcNo={setExpandedAcNo}
            handlePointChange={handlePointChange}
            digitalYieldPerPoint={digitalYieldPerPoint}
            rallyYieldPerPoint={rallyYieldPerPoint}
            welfareYieldPerPoint={welfareYieldPerPoint}
            remainingPoints={remainingPoints}
            targetParty={targetParty}
            candidatesData={candidatesData}
            onOpenDossier={onOpenDossier}
          />
        </div>
      )}

      {/* Executive Intelligence Briefing Modal */}
  <ExecutiveBriefingModal
    isOpen={isExecutiveModalOpen}
    onClose={() => setIsExecutiveModalOpen(false)}
    data={data}
    targetParty={targetParty}
  />

  {/* Strategic Campaign Plan Modal Popup with Download & Copy */}
  {isPlanModalOpen && (
    <div
      className="fixed inset-0 z-[2500] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={() => setIsPlanModalOpen(false)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white font-mono text-[10px] font-black px-2 py-0.5 rounded">
                STRATEGIC PLAN
              </span>
              <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                {targetParty} Campaign Action Plan
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              {totalAllocated} / {totalPointsBudget} Points Allocated &bull; +{flippedCount} Projected Net Flips
            </p>
          </div>

          <button
            onClick={() => setIsPlanModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Plan Text Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 bg-slate-900 text-slate-100 font-mono text-xs whitespace-pre-wrap leading-relaxed select-text">
          {generatedPlanMemo}
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-slate-500">
            Ready to export or distribute to leadership war room
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyPlan}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {copiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMemo ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
            </button>

            <button
              onClick={handleDownloadPlan}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span>Download (.txt)</span>
            </button>

            <button
              onClick={() => setIsPlanModalOpen(false)}
              className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
);
};
