import React, { useState, useMemo, useEffect } from 'react';
import type { DemographicsDataset, ActiveScenarioBridge, ConstituencyCandidatesData } from '../types';
import type { WhatIfTab } from './AdvancedSimulationSuite';
import {
  Target,
  Sparkles,
  TrendingUp,
  FileText,
  Star,
  AlertTriangle,
  Sliders,
  ShieldAlert,
} from 'lucide-react';
import { StarCampaignerAllocator } from './StarCampaignerAllocator';
import { DefectionRebelModeler, type DefectionEvent, PRESET_SCENARIOS } from './DefectionRebelModeler';
import { ExecutiveBriefingModal } from './ExecutiveBriefingModal';
import { PlaybookPipelineSummaryCard } from './actions/PlaybookPipelineSummaryCard';
import { StrategicPlanMemoModal } from './actions/StrategicPlanMemoModal';
import { ResourceAllocationBarometer } from './actions/ResourceAllocationBarometer';
import { FloatingSideNav, type NavSection } from './common/FloatingSideNav';
import {
  ConstituencyActionList,
  type ActionAllocation,
  type BattlegroundSortOption,
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
  const [filterType, setFilterType] = useState<'battleground' | 'all' | 'flipped' | 'mla_drag'>('battleground');
  const [battlegroundMarginThreshold, setBattlegroundMarginThreshold] = useState<number>(4000);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<BattlegroundSortOption>('margin_asc');
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
        if (filterType === 'mla_drag') {
          return b.isMlaNegativeDrag === true;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'margin_asc') {
          return a.margin_2023 - b.margin_2023;
        }
        if (sortBy === 'margin_desc') {
          return b.margin_2023 - a.margin_2023;
        }
        if (sortBy === 'points_needed') {
          // Easiest to flip first: lowest remaining deficit or closest positive margin
          const aDeficit = a.isTargetWinning ? -a.projectedNewMargin : (a.margin_2023 - a.totalSwing);
          const bDeficit = b.isTargetWinning ? -b.projectedNewMargin : (b.margin_2023 - b.totalSwing);
          return aDeficit - bDeficit;
        }
        if (sortBy === 'allocated_first') {
          if (b.seatTotalPoints !== a.seatTotalPoints) {
            return b.seatTotalPoints - a.seatTotalPoints;
          }
          return a.margin_2023 - b.margin_2023;
        }
        if (sortBy === 'ac_no') {
          return a.ac_no - b.ac_no;
        }
        return a.margin_2023 - b.margin_2023;
      });
  }, [battlegroundList, filterType, battlegroundMarginThreshold, searchQuery, sortBy]);

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

  // 1-Click "Auto-Flip" Deficit Solver: solves minimum points across 3 pillars to flip an AC to victory
  const handleAutoFlipAc = (acNo: number) => {
    const item = battlegroundList.find((b) => b.ac_no === acNo);
    if (!item) return;

    const currAlloc = allocations[acNo] || { digitalPoints: 0, rallyPoints: 0, welfarePoints: 0 };
    const currPoints = currAlloc.digitalPoints + currAlloc.rallyPoints + currAlloc.welfarePoints;
    const availablePool = remainingPoints + currPoints;
    if (availablePool <= 0) return;

    const commFactor = item.target_community_pct / 18;
    const dYield = digitalYieldPerPoint * commFactor;
    const rYield = rallyYieldPerPoint * commFactor;
    const wYield = welfareYieldPerPoint * commFactor;

    // Baseline deficit taking into account star campaigners and defection shifts
    const baselineDeficit = item.isTargetWinning ? 0 : (item.margin_2023 - item.starLift - item.defectionShift);
    const votesNeeded = Math.max(50, baselineDeficit + 100);

    const avgYield = 0.4 * dYield + 0.35 * rYield + 0.25 * wYield;
    let targetPts = Math.ceil(votesNeeded / Math.max(5, avgYield));

    targetPts = Math.min(150, Math.min(targetPts, availablePool));

    let d = Math.min(50, Math.round(targetPts * 0.40));
    let r = Math.min(50, Math.round(targetPts * 0.35));
    let w = Math.min(50, targetPts - d - r);

    let swing = Math.round(d * dYield + r * rYield + w * wYield);
    while (swing < votesNeeded && (d < 50 || r < 50 || w < 50) && (d + r + w) < availablePool) {
      if (d < 50) d++;
      else if (r < 50) r++;
      else if (w < 50) w++;
      swing = Math.round(d * dYield + r * rYield + w * wYield);
    }

    setAllocations((prev) => ({
      ...prev,
      [acNo]: {
        digitalPoints: d,
        rallyPoints: r,
        welfarePoints: w,
      },
    }));
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

  // Dynamic Side Navigation sections tailored to the active sub-tab
  const navSections: NavSection[] = useMemo(() => {
    if (actionSubTab === 'defections') {
      return [
        {
          id: 'act-modules',
          label: 'Playbook Sub-Modules',
          shortLabel: 'Modules',
          icon: <Sliders className="w-4 h-4" />,
        },
        {
          id: 'defection-scorecard',
          label: 'Defection Engine & Scorecard',
          shortLabel: 'Scorecard',
          icon: <AlertTriangle className="w-4 h-4" />,
        },
        {
          id: 'defection-registry',
          label: 'Active Defection & Rebel Registry',
          shortLabel: 'Registry',
          icon: <ShieldAlert className="w-4 h-4" />,
        },
      ];
    }
    if (actionSubTab === 'star_campaigners') {
      return [
        {
          id: 'act-modules',
          label: 'Playbook Sub-Modules',
          shortLabel: 'Modules',
          icon: <Sliders className="w-4 h-4" />,
        },
        {
          id: 'star-campaigners',
          label: 'Star Campaigner Squads & Quotas',
          shortLabel: 'Stars',
          icon: <Star className="w-4 h-4" />,
        },
        {
          id: 'star-targets',
          label: 'Constituency Tour Schedule',
          shortLabel: 'Schedule',
          icon: <Target className="w-4 h-4" />,
        },
      ];
    }
    return [
      {
        id: 'act-modules',
        label: 'Playbook Sub-Modules',
        shortLabel: 'Modules',
        icon: <Sliders className="w-4 h-4" />,
      },
      {
        id: 'act-operations',
        label: 'Tactical Resource Allocator',
        shortLabel: 'Allocator',
        icon: <Sparkles className="w-4 h-4" />,
      },
      {
        id: 'act-targets',
        label: '175-AC Battleground Priorities',
        shortLabel: 'Targets',
        icon: <Target className="w-4 h-4" />,
      },
    ];
  }, [actionSubTab]);

  return (
    <div className="space-y-6 relative">
      {/* Floating Vertical Section Navigation */}
      <FloatingSideNav sections={navSections} />

      {/* Smart Interactive KPI Sub-Navigation & Executive Briefing Trigger */}
      <div id="act-modules" className="scroll-mt-24 flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Module KPI Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
          {/* Tab 1: Tactical Resource Allocator */}
          <button
            type="button"
            onClick={() => setActionSubTab('tactical')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left cursor-pointer group ${
              actionSubTab === 'tactical'
                ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 shadow-2xs ring-1 ring-indigo-500/20'
                : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200/80 text-slate-700'
            }`}
          >
            <span className={`p-1.5 rounded-lg shrink-0 transition-colors ${
              actionSubTab === 'tactical'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-200/80 text-slate-600 group-hover:bg-slate-300/80'
            }`}>
              <Target className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 justify-between">
                <span className={`text-xs truncate ${actionSubTab === 'tactical' ? 'font-black text-indigo-950' : 'font-bold text-slate-800'}`}>
                  Resource Allocator
                </span>
                <span className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                  actionSubTab === 'tactical'
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-slate-200/70 text-slate-700'
                }`}>
                  +{cumulativeMetrics.totalResourceVotes.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                {cumulativeMetrics.resourceTargetCount} ACs targeted
              </p>
            </div>
          </button>

          {/* Tab 2: Star Campaigners */}
          <button
            type="button"
            onClick={() => setActionSubTab('star_campaigners')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left cursor-pointer group ${
              actionSubTab === 'star_campaigners'
                ? 'bg-amber-50/80 border-amber-300 text-amber-950 shadow-2xs ring-1 ring-amber-500/20'
                : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200/80 text-slate-700'
            }`}
          >
            <span className={`p-1.5 rounded-lg shrink-0 transition-colors ${
              actionSubTab === 'star_campaigners'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-slate-200/80 text-slate-600 group-hover:bg-slate-300/80'
            }`}>
              <Star className="w-3.5 h-3.5 fill-current" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 justify-between">
                <span className={`text-xs truncate ${actionSubTab === 'star_campaigners' ? 'font-black text-amber-950' : 'font-bold text-slate-800'}`}>
                  Star Campaigners
                </span>
                <span className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                  actionSubTab === 'star_campaigners'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-200/70 text-slate-700'
                }`}>
                  +{cumulativeMetrics.totalStarVotes.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                {cumulativeMetrics.activeStarCampaignerDays} days deployed
              </p>
            </div>
          </button>

          {/* Tab 3: Defections & Rebels */}
          <button
            type="button"
            onClick={() => setActionSubTab('defections')}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left cursor-pointer group ${
              actionSubTab === 'defections'
                ? 'bg-rose-50/80 border-rose-300 text-rose-950 shadow-2xs ring-1 ring-rose-500/20'
                : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200/80 text-slate-700'
            }`}
          >
            <span className={`p-1.5 rounded-lg shrink-0 transition-colors ${
              actionSubTab === 'defections'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-slate-200/80 text-slate-600 group-hover:bg-slate-300/80'
            }`}>
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 justify-between">
                <span className={`text-xs truncate ${actionSubTab === 'defections' ? 'font-black text-rose-950' : 'font-bold text-slate-800'}`}>
                  Defections &amp; Rebels
                </span>
                <span className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                  actionSubTab === 'defections'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200/70 text-slate-700'
                }`}>
                  {cumulativeMetrics.totalDefectionNetVotes >= 0 ? '+' : ''}
                  {cumulativeMetrics.totalDefectionNetVotes.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                {cumulativeMetrics.activeDefectionsCount} events active
              </p>
            </div>
          </button>
        </div>

        {/* Right Section: Net Ground Lift Pill + Executive Briefing Button */}
        <div className="flex items-center gap-2 shrink-0 justify-between sm:justify-end border-t xl:border-t-0 pt-2 xl:pt-0 border-slate-100">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/90 border border-emerald-200/90 rounded-xl text-left">
            <span className="p-1 bg-emerald-100 text-emerald-700 rounded-md shrink-0">
              <TrendingUp className="w-3 h-3" />
            </span>
            <div className="leading-tight">
              <div className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                Net Playbook Lift
              </div>
              <div className="text-xs font-mono font-black text-emerald-950 flex items-center gap-1">
                <span className="text-emerald-700">+{cumulativeMetrics.cumulativeFlipsCount} Flips</span>
                <span className="text-emerald-300">•</span>
                <span>{cumulativeMetrics.netCombinedVotes >= 0 ? '+' : ''}{cumulativeMetrics.netCombinedVotes.toLocaleString()} votes</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsExecutiveModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 hover:from-indigo-600 hover:to-indigo-700 text-white font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer border border-indigo-500/30 group shrink-0"
            title="Open printable C-Suite Executive Intelligence Briefing Dossier"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-200 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Executive Briefing</span>
            <span className="sm:hidden">Briefing</span>
          </button>
        </div>
      </div>

      {/* 3-Stage Mandate Progression Card & Live Playbook Pipeline Summary */}
      <PlaybookPipelineSummaryCard
        isScenarioActive={isScenarioActive}
        scenarioBridge={scenarioBridge}
        onNavigateToWhatIf={onNavigateToWhatIf}
        onUnlinkScenario={onUnlinkScenario}
        targetSeats2023={targetSeats2023}
        targetParty={targetParty}
        coalition2024Seats={coalition2024Seats}
        cumulativeMetrics={cumulativeMetrics}
        isCoalition={isCoalition}
        postActionCoalitionSeats={postActionCoalitionSeats}
        coalitionDiff={coalitionDiff}
      />

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
          <div id="act-operations" className="scroll-mt-24">
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
          </div>

          <div id="act-targets" className="scroll-mt-24">
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
              totalPointsBudget={totalPointsBudget}
              targetParty={targetParty}
              candidatesData={candidatesData}
              onOpenDossier={onOpenDossier}
              onAutoFlipAc={handleAutoFlipAc}
              onAutoAllocateBudget={autoAllocateBudget}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
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
  <StrategicPlanMemoModal
    isOpen={isPlanModalOpen}
    onClose={() => setIsPlanModalOpen(false)}
    targetParty={targetParty}
    totalAllocated={totalAllocated}
    totalPointsBudget={totalPointsBudget}
    flippedCount={flippedCount}
    planMemo={generatedPlanMemo}
    onCopyPlan={handleCopyPlan}
    onDownloadPlan={handleDownloadPlan}
    copiedMemo={copiedMemo}
  />
</div>
);
};
