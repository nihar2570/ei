import React, { useState, useMemo } from 'react';
import {
  Skull,
  Flame,
  HeartCrack,
  ShieldAlert,
  RotateCcw,
  Search,
  Trophy,
  Zap,
  Building2,
  AlertTriangle,
  Check,
  CheckSquare,
  Square,
  Shield,
  Briefcase,
  LayoutGrid,
  List,
  Layers,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  X,
  MapPin,
  Globe,
} from 'lucide-react';
import type { DemographicsDataset } from '../../types';
import {
  RED_PILL_MICRO_TRIGGERS,
  RED_PILL_CATEGORIES,
  type RedPillCategoryKey,
  type RedPillTrigger,
} from './redPillMicroTriggers';

export interface RedPillEmotionalMatrixProps {
  demographicsData?: DemographicsDataset;
  selectedAcNo?: number | null;
  onSelectAc?: (acNo: number) => void;
}

// Map each category to an appropriate icon
const getCategoryIcon = (key: RedPillCategoryKey) => {
  switch (key) {
    case 'kinship_dynasty':
      return <HeartCrack className="w-4 h-4 text-rose-400 shrink-0" />;
    case 'spiritual_sacrilege':
      return <Flame className="w-4 h-4 text-amber-400 shrink-0" />;
    case 'elder_matriarch':
      return <Shield className="w-4 h-4 text-indigo-400 shrink-0" />;
    case 'maternal_hearth':
      return <AlertTriangle className="w-4 h-4 text-emerald-400 shrink-0" />;
    case 'property_extortion':
      return <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />;
    case 'satrap_tyranny':
      return <ShieldAlert className="w-4 h-4 text-pink-400 shrink-0" />;
    case 'occupational_dignity':
      return <Briefcase className="w-4 h-4 text-purple-400 shrink-0" />;
    default:
      return <Skull className="w-4 h-4 text-slate-400 shrink-0" />;
  }
};

export const RedPillEmotionalMatrix: React.FC<RedPillEmotionalMatrixProps> = () => {
  // Preset default: Top 500 triggers active (~5.000% vote share shift, sufficient to win election!)
  const [activeTriggerIds, setActiveTriggerIds] = useState<Set<string>>(() => {
    const sorted = [...RED_PILL_MICRO_TRIGGERS].sort((a, b) => b.impactPct - a.impactPct);
    const initial = new Set<string>();
    let acc = 0;
    for (const t of sorted) {
      if (acc + t.impactPct <= 5.0005) {
        initial.add(t.id);
        acc += t.impactPct;
      }
    }
    return initial;
  });

  // UI View Mode: 'clusters' (Strategic grouping) | 'table' (High-density matrix) | 'cards' (Paginated visual cards)
  const [viewMode, setViewMode] = useState<'clusters' | 'table' | 'cards'>('clusters');

  // Selected Category filter
  const [selectedCategory, setSelectedCategory] = useState<'all' | RedPillCategoryKey>('all');

  // Selected Sub-Cluster filter
  const [selectedSubCluster, setSelectedSubCluster] = useState<string>('all');

  // Region filter
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Status / Impact filter: 'all' | 'active' | 'inactive' | 'high'
  const [filterType, setFilterType] = useState<'all' | 'active' | 'inactive' | 'high'>('all');

  // Pagination state for table and cards views
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);

  // Inspected Trigger Dossier (Drawer)
  const [inspectedTrigger, setInspectedTrigger] = useState<RedPillTrigger | null>(null);

  // Constant statewide electorate
  const currentElectors = 40500000;

  // Toggle single trigger
  const toggleTrigger = (id: string) => {
    setActiveTriggerIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Toggle an entire sub-cluster of triggers
  const toggleCluster = (clusterName: string) => {
    const clusterTriggers = RED_PILL_MICRO_TRIGGERS.filter((t) => t.subCluster === clusterName);
    const allActive = clusterTriggers.every((t) => activeTriggerIds.has(t.id));

    setActiveTriggerIds((prev) => {
      const next = new Set(prev);
      if (allActive) {
        clusterTriggers.forEach((t) => next.delete(t.id));
      } else {
        clusterTriggers.forEach((t) => next.add(t.id));
      }
      return next;
    });
  };

  // Calculations per category and total accumulated impact
  const {
    categoryStats,
    totalShiftPct,
    totalVotersStatewide,
    activeCount,
    projectedSeatsFlipped,
    clusterList,
  } = useMemo(() => {
    const catStats: Record<
      RedPillCategoryKey,
      { activeImpact: number; maxImpact: number; activeCount: number; totalCount: number }
    > = {
      kinship_dynasty: { activeImpact: 0, maxImpact: 1.850, activeCount: 0, totalCount: 0 },
      spiritual_sacrilege: { activeImpact: 0, maxImpact: 1.950, activeCount: 0, totalCount: 0 },
      elder_matriarch: { activeImpact: 0, maxImpact: 1.450, activeCount: 0, totalCount: 0 },
      maternal_hearth: { activeImpact: 0, maxImpact: 1.650, activeCount: 0, totalCount: 0 },
      property_extortion: { activeImpact: 0, maxImpact: 1.350, activeCount: 0, totalCount: 0 },
      satrap_tyranny: { activeImpact: 0, maxImpact: 1.050, activeCount: 0, totalCount: 0 },
      occupational_dignity: { activeImpact: 0, maxImpact: 0.700, activeCount: 0, totalCount: 0 },
    };

    const clusterMap: Record<
      string,
      {
        name: string;
        category: RedPillCategoryKey;
        region: string;
        totalCount: number;
        activeCount: number;
        maxImpact: number;
        activeImpact: number;
        sampleTriggers: RedPillTrigger[];
      }
    > = {};

    let totalShift = 0;
    let totalVoters = 0;
    let actCount = 0;

    RED_PILL_MICRO_TRIGGERS.forEach((trigger) => {
      catStats[trigger.category].totalCount++;

      // Clusters grouping
      if (!clusterMap[trigger.subCluster]) {
        clusterMap[trigger.subCluster] = {
          name: trigger.subCluster,
          category: trigger.category,
          region: trigger.regionAffinity,
          totalCount: 0,
          activeCount: 0,
          maxImpact: 0,
          activeImpact: 0,
          sampleTriggers: [],
        };
      }
      const c = clusterMap[trigger.subCluster];
      c.totalCount++;
      c.maxImpact += trigger.impactPct;
      if (c.sampleTriggers.length < 3) {
        c.sampleTriggers.push(trigger);
      }

      if (activeTriggerIds.has(trigger.id)) {
        actCount++;
        catStats[trigger.category].activeCount++;
        catStats[trigger.category].activeImpact += trigger.impactPct;
        c.activeCount++;
        c.activeImpact += trigger.impactPct;
        totalShift += trigger.impactPct;

        totalVoters += trigger.votersAffectedStatewide;
      }
    });

    totalShift = Number(Math.min(10.0, totalShift).toFixed(3));

    // Seat model: 1% ~ 13 seats, 2.5% ~ 32 seats, 5.0% ~ 68 seats (Majority), 7.5% ~ 98 seats, 10.0% ~ 124 seats
    const seats = Math.min(
      126,
      Math.round(totalShift * 12.4 + (totalShift >= 5.0 ? 6 : 0))
    );

    return {
      categoryStats: catStats,
      totalShiftPct: totalShift,
      totalVotersStatewide: totalVoters,
      activeCount: actCount,
      projectedSeatsFlipped: seats,
      clusterList: Object.values(clusterMap),
    };
  }, [activeTriggerIds]);

  // Presets
  const applyPreset = (preset: 'win_election' | 'blitz_10' | 'reset' | RedPillCategoryKey) => {
    if (preset === 'reset') {
      setActiveTriggerIds(new Set());
      return;
    }

    if (preset === 'blitz_10') {
      setActiveTriggerIds(new Set(RED_PILL_MICRO_TRIGGERS.map((t) => t.id)));
      return;
    }

    if (preset === 'win_election') {
      const sorted = [...RED_PILL_MICRO_TRIGGERS].sort((a, b) => b.impactPct - a.impactPct);
      const winSet = new Set<string>();
      let acc = 0;
      for (const t of sorted) {
        if (acc + t.impactPct <= 5.0005) {
          winSet.add(t.id);
          acc += t.impactPct;
        }
      }
      setActiveTriggerIds(winSet);
      return;
    }

    // Category presets
    const catTriggers = RED_PILL_MICRO_TRIGGERS.filter((t) => t.category === preset).map((t) => t.id);
    setActiveTriggerIds(new Set(catTriggers));
  };

  // Filter triggers
  const filteredTriggers = useMemo(() => {
    return RED_PILL_MICRO_TRIGGERS.filter((trigger) => {
      if (selectedCategory !== 'all' && trigger.category !== selectedCategory) {
        return false;
      }
      if (selectedSubCluster !== 'all' && trigger.subCluster !== selectedSubCluster) {
        return false;
      }
      if (selectedRegion !== 'all' && trigger.regionAffinity !== selectedRegion) {
        return false;
      }

      const isActive = activeTriggerIds.has(trigger.id);
      if (filterType === 'active' && !isActive) return false;
      if (filterType === 'inactive' && isActive) return false;
      if (filterType === 'high' && trigger.impactPct < 0.012) return false;

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = trigger.title.toLowerCase().includes(q);
        const matchTarget = trigger.targetGroup.toLowerCase().includes(q);
        const matchHook = trigger.hook.toLowerCase().includes(q);
        const matchCluster = trigger.subCluster.toLowerCase().includes(q);
        const matchId = trigger.id.toLowerCase().includes(q);
        return matchTitle || matchTarget || matchHook || matchCluster || matchId;
      }

      return true;
    });
  }, [
    selectedCategory,
    selectedSubCluster,
    selectedRegion,
    filterType,
    searchQuery,
    activeTriggerIds,
  ]);

  // Filtered clusters for 'clusters' view mode
  const filteredClusters = useMemo(() => {
    return clusterList.filter((cluster) => {
      if (selectedCategory !== 'all' && cluster.category !== selectedCategory) {
        return false;
      }
      if (selectedRegion !== 'all' && cluster.region !== selectedRegion) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          cluster.name.toLowerCase().includes(q) ||
          cluster.sampleTriggers.some((t) => t.title.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [clusterList, selectedCategory, selectedRegion, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredTriggers.length / pageSize));
  const paginatedTriggers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTriggers.slice(start, start + pageSize);
  }, [filteredTriggers, currentPage, pageSize]);

  // Reset page when filters change
  const handleFilterChange = (setter: () => void) => {
    setter();
    setCurrentPage(1);
  };

  // Bulk actions on current visible page
  const handleSelectPage = () => {
    setActiveTriggerIds((prev) => {
      const next = new Set(prev);
      paginatedTriggers.forEach((t) => next.add(t.id));
      return next;
    });
  };

  const handleDeselectPage = () => {
    setActiveTriggerIds((prev) => {
      const next = new Set(prev);
      paginatedTriggers.forEach((t) => next.delete(t.id));
      return next;
    });
  };

  const outcomeVerdict = useMemo(() => {
    if (totalShiftPct >= 10.0) {
      return {
        label: 'HISTORIC 10.000% TSUNAMI & COMPLETE OPPOSITION DECIMATION',
        badge: 'SUPERMAJORITY BLITZ',
        desc: 'Crushes 124+ seats, breaching unassailable bastions like Pulivendula, Kadapa, and Macherla.',
        color: 'text-rose-400',
        bg: 'from-rose-950/80 to-red-950/80 border-rose-500/80',
      };
    }
    if (totalShiftPct >= 7.5) {
      return {
        label: 'MASSIVE 7.500%+ LANDSLIDE WAVE (98+ SEATS)',
        badge: 'LANDSLIDE FORMATION',
        desc: 'Overcomes localized caste consolidation across all 3 regions with high emotional salience.',
        color: 'text-amber-400',
        bg: 'from-amber-950/80 to-yellow-950/80 border-amber-500/80',
      };
    }
    if (totalShiftPct >= 5.0) {
      return {
        label: 'DECISIVE ELECTION WIN SECURED (68+ SEATS FLIPPED)',
        badge: 'GOVERNMENT FORMATION GUARANTEED',
        desc: 'The red-pill psychological matrix alone shifts the balance of power beyond the 88-seat majority mark.',
        color: 'text-emerald-400',
        bg: 'from-emerald-950/80 to-teal-950/80 border-emerald-500/80',
      };
    }
    if (totalShiftPct >= 2.5) {
      return {
        label: 'TIPPING POINT REACHED (32+ SEATS FLIPPED)',
        badge: 'BATTLEGROUND MOMENTUM',
        desc: 'Swings tight marginals and fractures the core rural base in Rayalaseema and Coastal districts.',
        color: 'text-cyan-400',
        bg: 'from-cyan-950/80 to-blue-950/80 border-cyan-500/80',
      };
    }
    return {
      label: 'INITIAL PSYCHOLOGICAL SALVO (<2.5% SHIFT)',
      badge: 'MICRO-RUPTURE PHASE',
      desc: 'Local micro-deflections in progress. Activate high-impact triggers to reach the 5.0% Majority Threshold.',
      color: 'text-slate-400',
      bg: 'from-slate-900 to-slate-950 border-slate-800',
    };
  }, [totalShiftPct]);

  const categoryOrder: RedPillCategoryKey[] = [
    'kinship_dynasty',
    'spiritual_sacrilege',
    'elder_matriarch',
    'maternal_hearth',
    'property_extortion',
    'satrap_tyranny',
    'occupational_dignity',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150 relative">
      {/* 1. Executive Hero */}
      <div
        id="red-pill-overview"
        className="bg-gradient-to-r from-red-950 via-slate-950 to-rose-950 rounded-2xl p-5 sm:p-6 text-white border border-rose-900/60 shadow-xl relative overflow-hidden scroll-mt-24"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-rose-500/20 text-rose-300 border border-rose-400/30 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
                <Skull className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>The Red Pill Strategy &middot; 1,000 Micro-Triggers Arsenal</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                10.000% Cumulative Vote Share &middot; ~0.010% Verified Impact per Item
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Autonomous Psychological Warfare &amp; Moral Rupture Console</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              When manifesto advertising and conventional outreach plateau, <strong>universal moral taboos</strong> bypass caste loyalty. This console deploys <strong>1,000 verified micro-triggers</strong> (~4,050 voters each) organized across <strong>21 strategic battlefronts</strong> to build up to a <strong>10.000% net vote swing</strong>—flipping 68 to 124 seats without a single welfare promise.
            </p>
          </div>

          {/* Permanent Statewide Scope Badge */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1 shrink-0 min-w-[200px]">
            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scope: Statewide (All 175 ACs)</span>
            </div>
            <div className="text-xl font-black text-white font-mono">
              {currentElectors.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">
              Total AP Electorate Base
            </span>
          </div>
        </div>
      </div>

      {/* 2. THE HORIZONTAL STACKED BAR CHART (0.000% to 10.000% Election Victory Horizon) */}
      <div
        id="red-pill-barometer"
        className="bg-slate-900/95 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl relative scroll-mt-24"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-rose-950/80 text-rose-400 border border-rose-800">
                <Trophy className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-black text-white tracking-wide">
                Cumulative Vote Share Shift Barometer (0.000% &rarr; 10.000%)
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Horizontal stacked aggregation of all {activeCount} active micro-triggers by category towards decisive assembly victory milestones.
            </p>
          </div>

          {/* Big Live Metrics */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-rose-900/40 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Active Vote Shift:</span>
              <strong className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">
                +{totalShiftPct.toFixed(3)}%
                <span className="text-xs text-slate-500 font-normal ml-1">/ 10.000%</span>
              </strong>
            </div>

            <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-emerald-900/40 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Projected Assembly Seats:</span>
              <strong className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                +{projectedSeatsFlipped}
                <span className="text-xs text-slate-500 font-normal ml-1">/ 175</span>
              </strong>
            </div>
          </div>
        </div>

        {/* The Stacked Bar Track & Visual Threshold Markers */}
        <div className="space-y-2 pt-2">
          {/* Milestone Labels Above Bar */}
          <div className="relative w-full h-5 text-[10px] font-mono select-none">
            <div className="absolute left-0 text-slate-400">0.000%</div>
            <div className="absolute left-[25%] -translate-x-1/2 text-cyan-400 font-bold hidden sm:block">
              2.500% (Tipping)
            </div>
            <div className="absolute left-[50%] -translate-x-1/2 flex items-center gap-1 text-emerald-400 font-black bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500 shadow-md">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>5.000% WIN MAJORITY LINE</span>
            </div>
            <div className="absolute left-[75%] -translate-x-1/2 text-amber-400 font-bold hidden sm:block">
              7.500% (Landslide)
            </div>
            <div className="absolute right-0 text-rose-400 font-black">
              10.000% (Tsunami)
            </div>
          </div>

          {/* The Actual Stacked Bar */}
          <div className="relative w-full h-11 bg-slate-950 rounded-xl overflow-hidden border border-slate-700/80 shadow-inner flex">
            {categoryOrder.map((catKey) => {
              const meta = RED_PILL_CATEGORIES[catKey];
              const stats = categoryStats[catKey];
              const segmentPctOfTotal = (stats.activeImpact / 10.0) * 100;
              if (segmentPctOfTotal <= 0) return null;

              return (
                <div
                  key={catKey}
                  style={{
                    width: `${segmentPctOfTotal}%`,
                    backgroundColor: meta.color,
                  }}
                  title={`${meta.name}: +${stats.activeImpact.toFixed(3)}% (${stats.activeCount}/${stats.totalCount} active)`}
                  className="h-full relative group transition-all duration-300 hover:brightness-115 flex items-center justify-center overflow-hidden border-r border-slate-950/40"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {segmentPctOfTotal > 6 && (
                    <span className="text-[10px] font-black text-slate-950 font-mono tracking-tight truncate px-1 select-none">
                      +{stats.activeImpact.toFixed(2)}%
                    </span>
                  )}
                </div>
              );
            })}

            {/* Unallocated Remainder Track */}
            <div
              style={{ width: `${Math.max(0, 100 - (totalShiftPct / 10.0) * 100)}%` }}
              className="h-full bg-slate-900/60 relative"
            >
              <div className="w-full h-full opacity-20 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#334155_10px,#334155_20px)]" />
            </div>

            {/* Milestone Vertical Lines */}
            <div className="absolute left-[25%] top-0 bottom-0 w-0.5 border-r border-dashed border-cyan-400/70 pointer-events-none" />
            <div className="absolute left-[50%] top-0 bottom-0 w-1 bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)] pointer-events-none z-10" />
            <div className="absolute left-[75%] top-0 bottom-0 w-0.5 border-r border-dashed border-amber-400/70 pointer-events-none" />
          </div>

          {/* Milestone Details Below Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800 text-slate-300">
              <span className="text-[9px] text-slate-400 uppercase block font-bold">2.500% Milestone:</span>
              <strong className="text-cyan-400">+32 Seats</strong>
              <span className="text-slate-400 block text-[10px]">Tipping Point in Marginals</span>
            </div>

            <div className="bg-emerald-950/40 p-2 rounded-lg border border-emerald-800/80 text-emerald-200">
              <span className="text-[9px] text-emerald-400 uppercase block font-bold flex items-center gap-1">
                <Check className="w-2.5 h-2.5" />
                <span>5.000% Milestone:</span>
              </span>
              <strong className="text-emerald-300 text-xs">+68 Seats (Majority Won)</strong>
              <span className="text-emerald-400/80 block text-[10px]">Secures Clean 88+ Seats</span>
            </div>

            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800 text-slate-300">
              <span className="text-[9px] text-slate-400 uppercase block font-bold">7.500% Milestone:</span>
              <strong className="text-amber-400">+98 Seats</strong>
              <span className="text-slate-400 block text-[10px]">Historic Landslide Wave</span>
            </div>

            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800 text-slate-300">
              <span className="text-[9px] text-slate-400 uppercase block font-bold">10.000% Milestone:</span>
              <strong className="text-rose-400">+124 Seats</strong>
              <span className="text-slate-400 block text-[10px]">Total Opposition Decimation</span>
            </div>
          </div>
        </div>

        {/* Dynamic Strategic Verdict Ribbon */}
        <div className={`p-3.5 rounded-xl border bg-gradient-to-r ${outcomeVerdict.bg} flex flex-wrap items-center justify-between gap-3`}>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-black/40 border border-white/20 text-white font-mono">
                {outcomeVerdict.badge}
              </span>
              <h4 className={`text-xs sm:text-sm font-black ${outcomeVerdict.color}`}>
                {outcomeVerdict.label}
              </h4>
            </div>
            <p className="text-xs text-slate-200">{outcomeVerdict.desc}</p>
          </div>

          <div className="text-right text-xs font-mono shrink-0">
            <span className="text-[10px] text-slate-300 block">Voters Shifted Statewide:</span>
            <strong className="text-white text-base font-bold">
              {totalVotersStatewide.toLocaleString()}
            </strong>
          </div>
        </div>

        {/* Category Breakdown Badges */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[10px] uppercase font-bold tracking-wider">
              Category Contributions to Current +{totalShiftPct.toFixed(3)}% Shift:
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Click any badge to filter arsenal
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {categoryOrder.map((catKey) => {
              const meta = RED_PILL_CATEGORIES[catKey];
              const stats = categoryStats[catKey];
              const isSelected = selectedCategory === catKey;

              return (
                <button
                  key={catKey}
                  onClick={() => handleFilterChange(() => setSelectedCategory(isSelected ? 'all' : catKey))}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 text-white border-white shadow-md'
                      : 'bg-slate-950/80 hover:bg-slate-900 text-slate-300 border-slate-800'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  <span className="font-semibold">{meta.shortLabel}:</span>
                  <span className="font-mono font-bold text-white">
                    +{stats.activeImpact.toFixed(3)}%
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ({stats.activeCount}/{stats.totalCount})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. 1-Click Strategic Presets Bar */}
      <div
        id="red-pill-presets"
        className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2.5 shadow-sm scroll-mt-24"
      >
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5 text-rose-400">
            <Zap className="w-3.5 h-3.5" />
            <span>1-Click Strategic Blitz Presets:</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {activeCount} / 1,000 Micro-Triggers Active ({((activeCount / 1000) * 100).toFixed(0)}%)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('win_election')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-600 transition-colors cursor-pointer shadow-md"
          >
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span>🏆 Win Election (Top 500 / +5.000% Shift)</span>
          </button>

          <button
            onClick={() => applyPreset('blitz_10')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-600 transition-colors cursor-pointer shadow-md"
          >
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>⚡ 10.000% Supermajority Blitz (All 1,000 Active)</span>
          </button>

          <button
            onClick={() => applyPreset('kinship_dynasty')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs bg-pink-950/60 hover:bg-pink-900 text-pink-200 border border-pink-700/60 transition-colors cursor-pointer"
          >
            <HeartCrack className="w-3.5 h-3.5 text-pink-400" />
            <span>💔 Kinship (185 items / +1.850%)</span>
          </button>

          <button
            onClick={() => applyPreset('spiritual_sacrilege')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs bg-amber-950/60 hover:bg-amber-900 text-amber-200 border border-amber-700/60 transition-colors cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>🛕 Temple Sacrilege (195 / +1.950%)</span>
          </button>

          <button
            onClick={() => applyPreset('maternal_hearth')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-bold text-xs bg-teal-950/60 hover:bg-teal-900 text-teal-200 border border-teal-700/60 transition-colors cursor-pointer"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-teal-400" />
            <span>👩 Maternal Defense (165 / +1.650%)</span>
          </button>

          <button
            onClick={() => applyPreset('reset')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset All (0.000%)</span>
          </button>
        </div>
      </div>

      {/* 4. ANTI-CLUSTERFUCK TOOLBAR: View Modes, Search & Multi-Level Facets */}
      <div
        id="red-pill-triggers"
        className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3.5 shadow-sm scroll-mt-24"
      >
        {/* Row 1: View Mode Switcher & Global Search */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode('clusters')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'clusters'
                  ? 'bg-rose-950 text-rose-200 border border-rose-700 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Battlefront Clusters ({filteredClusters.length})</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-rose-950 text-rose-200 border border-rose-700 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Tactical Data Matrix</span>
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-rose-950 text-rose-200 border border-rose-700 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Paginated Cards</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search across 1,000 triggers: Tirumala, Viveka, Sharmila, 22A, Liquor..."
              value={searchQuery}
              onChange={(e) => handleFilterChange(() => setSearchQuery(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Region Dropdown Filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400" />
              <span>Region:</span>
            </span>
            <select
              value={selectedRegion}
              onChange={(e) => handleFilterChange(() => setSelectedRegion(e.target.value))}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-hidden focus:ring-1 focus:ring-rose-400 cursor-pointer"
            >
              <option value="all">All Regions (Statewide)</option>
              <option value="Rayalaseema">Rayalaseema Bastions</option>
              <option value="Coastal Andhra">Coastal Andhra Belts</option>
              <option value="Statewide">Statewide Distributed</option>
            </select>
          </div>
        </div>

        {/* Row 2: Secondary Filters & Pagination Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-850 text-xs">
          {/* Status & Impact Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Filter Status:
            </span>
            {[
              { id: 'all', label: `All (${filteredTriggers.length})` },
              { id: 'active', label: `Active (${activeCount})` },
              { id: 'inactive', label: `Inactive (${1000 - activeCount})` },
              { id: 'high', label: 'High Impact (≥0.012%)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => handleFilterChange(() => setFilterType(f.id as typeof filterType))}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs cursor-pointer transition-colors border ${
                  filterType === f.id
                    ? 'bg-rose-950 text-rose-200 border-rose-600'
                    : 'bg-slate-950 hover:bg-slate-850 text-slate-400 border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Quick Page Bulk Action (For table and cards mode) */}
          {viewMode !== 'clusters' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectPage}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold transition-colors cursor-pointer border border-slate-700"
                title="Activate all triggers on current page"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Select Page ({paginatedTriggers.length})</span>
              </button>

              <button
                onClick={handleDeselectPage}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold transition-colors cursor-pointer border border-slate-700"
                title="Deselect all triggers on current page"
              >
                <Square className="w-3.5 h-3.5 text-rose-400" />
                <span>Clear Page</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. VIEW MODE CONTENT (Anti-Clusterfuck Display) */}

      {/* VIEW MODE 1: CLUSTERS VIEW (The cleanest strategic overview of 21 battlefronts) */}
      {viewMode === 'clusters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Organized into <strong>{filteredClusters.length} Strategic Battlefront Clusters</strong> (1,000 Total Micro-Triggers)
            </span>
            <span className="font-mono text-[11px] text-slate-400">
              Click <strong>"Toggle Cluster"</strong> to deploy 20–35 triggers simultaneously.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClusters.map((cluster) => {
              const meta = RED_PILL_CATEGORIES[cluster.category];
              const isFullyActive = cluster.activeCount === cluster.totalCount;
              const isPartiallyActive = cluster.activeCount > 0 && !isFullyActive;

              return (
                <div
                  key={cluster.name}
                  className={`bg-slate-900/90 rounded-xl border p-4 space-y-3.5 flex flex-col justify-between transition-all ${
                    cluster.activeCount > 0
                      ? 'border-slate-700 shadow-md ring-1 ring-white/10'
                      : 'border-slate-850 opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    borderLeftWidth: '4px',
                    borderLeftColor: meta.color,
                  }}
                >
                  {/* Cluster Header */}
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="p-1 rounded bg-slate-800 border border-slate-700">
                          {getCategoryIcon(cluster.category)}
                        </span>
                        <span
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${meta.color}20`,
                            color: meta.color,
                          }}
                        >
                          {meta.shortLabel}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {cluster.region}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {cluster.name}
                    </h4>
                  </div>

                  {/* Impact Progress Bar for this cluster */}
                  <div className="space-y-1.5 bg-slate-950/80 p-2.5 rounded-lg border border-slate-850">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-400">Cluster Progress:</span>
                      <strong className="text-white font-bold">
                        +{cluster.activeImpact.toFixed(3)}% / +{cluster.maxImpact.toFixed(3)}%
                      </strong>
                    </div>

                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
                      <div
                        style={{
                          width: `${(cluster.activeCount / cluster.totalCount) * 100}%`,
                          backgroundColor: meta.color,
                        }}
                        className="h-full transition-all duration-300"
                      />
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                      <span>{cluster.activeCount} / {cluster.totalCount} Triggers Active</span>
                      <span>~{Math.round((40500000 * cluster.activeImpact) / 100).toLocaleString()} Voters</span>
                    </div>
                  </div>

                  {/* Sample Trigger Teasers */}
                  <div className="space-y-1 text-[11px] text-slate-300">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Key Micro-Hooks Included:
                    </span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-300 italic">
                      {cluster.sampleTriggers.map((st) => (
                        <li key={st.id} className="truncate">
                          {st.title}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cluster Action Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-850">
                    <button
                      onClick={() => {
                        setSelectedSubCluster(cluster.name);
                        setViewMode('table');
                      }}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <span>Drill into all {cluster.totalCount} items</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => toggleCluster(cluster.name)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                        isFullyActive
                          ? 'bg-rose-950 text-rose-200 border border-rose-700 hover:bg-rose-900'
                          : 'bg-emerald-950 text-emerald-200 border border-emerald-700 hover:bg-emerald-900'
                      }`}
                    >
                      {isFullyActive ? 'Deactivate All' : isPartiallyActive ? 'Activate Rest' : 'Activate All'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: HIGH-DENSITY TACTICAL DATA MATRIX (TABLE) */}
      {viewMode === 'table' && (
        <div className="bg-slate-900/95 border border-slate-800 rounded-xl overflow-hidden shadow-xl space-y-3 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              Showing rows <strong>{(currentPage - 1) * pageSize + 1}</strong> &ndash;{' '}
              <strong>{Math.min(currentPage * pageSize, filteredTriggers.length)}</strong> of{' '}
              <strong>{filteredTriggers.length}</strong> matching triggers
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold">Rows:</span>
              {[25, 50, 100].map((size) => (
                <button
                  key={size}
                  onClick={() => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold cursor-pointer ${
                    pageSize === size ? 'bg-rose-900 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-2">ID</th>
                  <th className="py-2.5 px-3">Title &amp; Psychological Mechanism</th>
                  <th className="py-2.5 px-3">Category / Cluster</th>
                  <th className="py-2.5 px-3">Target Group</th>
                  <th className="py-2.5 px-3 text-right">Impact</th>
                  <th className="py-2.5 px-3 text-right">Voters</th>
                  <th className="py-2.5 px-3 text-center">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {paginatedTriggers.map((t) => {
                  const isActive = activeTriggerIds.has(t.id);
                  const meta = RED_PILL_CATEGORIES[t.category];

                  return (
                    <tr
                      key={t.id}
                      className={`hover:bg-slate-800/60 transition-colors ${
                        isActive ? 'bg-slate-900/60' : 'opacity-65'
                      }`}
                    >
                      {/* Toggle */}
                      <td className="py-2 px-3">
                        <button
                          onClick={() => toggleTrigger(t.id)}
                          className={`w-7 h-4 rounded-full transition-colors relative flex items-center px-0.5 cursor-pointer ${
                            isActive ? 'bg-emerald-500' : 'bg-slate-800'
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full bg-white transform transition-transform ${
                              isActive ? 'translate-x-3' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </td>

                      {/* ID */}
                      <td className="py-2 px-2 font-mono font-bold text-slate-400 text-[10px]">
                        #{t.id.toUpperCase()}
                      </td>

                      {/* Title */}
                      <td className="py-2 px-3 max-w-sm">
                        <div className="font-bold text-white text-xs leading-snug truncate">
                          {t.title}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate italic">
                          "{t.hook}"
                        </div>
                      </td>

                      {/* Category & Cluster */}
                      <td className="py-2 px-3">
                        <span
                          className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${meta.color}20`,
                            color: meta.color,
                          }}
                        >
                          {meta.shortLabel}
                        </span>
                        <span className="block text-[10px] text-slate-400 truncate max-w-[140px]">
                          {t.subCluster}
                        </span>
                      </td>

                      {/* Target Group */}
                      <td className="py-2 px-3 text-slate-300 text-[11px] max-w-[160px] truncate">
                        {t.targetGroup}
                      </td>

                      {/* Impact */}
                      <td className="py-2 px-3 text-right font-mono font-bold text-rose-300">
                        +{t.impactPct.toFixed(4)}%
                      </td>

                      {/* Voters */}
                      <td className="py-2 px-3 text-right font-mono text-slate-400">
                        ~{t.votersAffectedStatewide.toLocaleString()}
                      </td>

                      {/* Inspect Dossier */}
                      <td className="py-2 px-3 text-center">
                        <button
                          onClick={() => setInspectedTrigger(t)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px]">
              Page {currentPage} of {totalPages}
            </span>

            <div className="flex items-center gap-1 font-mono">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-white"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-3 py-1 bg-slate-950 rounded border border-slate-800 font-bold text-white">
                {currentPage} / {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-white"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: PAGINATED CARDS VIEW */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing cards <strong>{(currentPage - 1) * pageSize + 1}</strong> &ndash;{' '}
              <strong>{Math.min(currentPage * pageSize, filteredTriggers.length)}</strong> of{' '}
              <strong>{filteredTriggers.length}</strong> triggers
            </span>
            <div className="flex items-center gap-1 font-mono">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-white"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 py-0.5 bg-slate-950 rounded text-xs font-bold text-white">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-white"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {paginatedTriggers.map((trigger) => {
              const isActive = activeTriggerIds.has(trigger.id);
              const meta = RED_PILL_CATEGORIES[trigger.category];

              return (
                <div
                  key={trigger.id}
                  onClick={() => toggleTrigger(trigger.id)}
                  className={`rounded-xl border p-3.5 space-y-2.5 transition-all duration-150 cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-slate-900/95 border-slate-700 shadow-md ring-1 ring-white/10'
                      : 'bg-slate-950/60 border-slate-850 hover:border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    borderLeftWidth: '4px',
                    borderLeftColor: meta.color,
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="p-1 rounded bg-slate-800 border border-slate-700">
                        {getCategoryIcon(trigger.category)}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        #{trigger.id.toUpperCase()}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${meta.color}20`,
                          color: meta.color,
                        }}
                      >
                        {meta.shortLabel}
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="inline-block px-2 py-0.5 rounded font-mono font-bold text-xs bg-slate-800 border border-slate-700 text-rose-300">
                        +{trigger.impactPct.toFixed(4)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                      {trigger.title}
                    </h4>
                    <div className="text-[10.5px] text-amber-300 font-medium">
                      🎯 Target: {trigger.targetGroup}
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-850/80 text-[11px] text-slate-300 leading-relaxed italic">
                    "{trigger.hook}"
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-850 text-[10px] font-mono">
                    <span className="text-slate-400">
                      Impact:{' '}
                      <strong className="text-white">
                        ~{trigger.votersAffectedStatewide.toLocaleString()} voters
                      </strong>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold ${isActive ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {isActive ? 'ACTIVE' : 'MUTED'}
                      </span>
                      <div
                        className={`w-8 h-4.5 rounded-full transition-colors relative flex items-center px-0.5 ${
                          isActive ? 'bg-emerald-500' : 'bg-slate-850'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full bg-white shadow-md transform transition-transform ${
                            isActive ? 'translate-x-3.5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cards Pagination Footer */}
          <div className="flex items-center justify-center gap-2 pt-3 font-mono text-xs">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              className="px-2 py-1 bg-slate-800 rounded disabled:opacity-40 text-slate-300 cursor-pointer"
            >
              First
            </button>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 bg-slate-800 rounded disabled:opacity-40 text-slate-300 cursor-pointer"
            >
              Prev
            </button>
            <span className="px-3 py-1 bg-slate-950 border border-slate-850 rounded text-white font-bold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2 py-1 bg-slate-800 rounded disabled:opacity-40 text-slate-300 cursor-pointer"
            >
              Next
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="px-2 py-1 bg-slate-800 rounded disabled:opacity-40 text-slate-300 cursor-pointer"
            >
              Last
            </button>
          </div>
        </div>
      )}

      {/* 6. INSPECTED TRIGGER TACTICAL DOSSIER SLIDE-OVER */}
      {inspectedTrigger && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setInspectedTrigger(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                {getCategoryIcon(inspectedTrigger.category)}
              </span>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-slate-400">
                  Tactical Dossier #{inspectedTrigger.id.toUpperCase()}
                </span>
                <h3 className="text-base font-black text-white">
                  {inspectedTrigger.title}
                </h3>
              </div>
            </div>

            <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
              <div className="flex justify-between items-center text-slate-400">
                <span>Strategic Battlefront:</span>
                <strong className="text-white">{inspectedTrigger.subCluster}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Target Demographic:</span>
                <strong className="text-amber-300">{inspectedTrigger.targetGroup}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Geographic Affinity:</span>
                <strong className="text-cyan-300">{inspectedTrigger.regionAffinity}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Primary Delivery Channel:</span>
                <strong className="text-emerald-300">{inspectedTrigger.deliveryChannel}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-850">
                <span>Impact Magnitude:</span>
                <strong className="text-rose-400 font-mono text-sm">
                  +{inspectedTrigger.impactPct.toFixed(4)}% (~{inspectedTrigger.votersAffectedStatewide.toLocaleString()} voters)
                </strong>
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Visceral Psychological Rupture Mechanism:
              </span>
              <p className="text-xs text-slate-200 bg-slate-950/70 p-3 rounded-lg border border-slate-850 italic leading-relaxed">
                "{inspectedTrigger.hook}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="text-[11px] text-slate-400">
                Status:{' '}
                <strong
                  className={
                    activeTriggerIds.has(inspectedTrigger.id)
                      ? 'text-emerald-400'
                      : 'text-slate-500'
                  }
                >
                  {activeTriggerIds.has(inspectedTrigger.id) ? 'ACTIVE' : 'MUTED'}
                </strong>
              </div>

              <button
                onClick={() => {
                  toggleTrigger(inspectedTrigger.id);
                  setInspectedTrigger(null);
                }}
                className={`px-4 py-2 rounded-lg font-bold text-xs cursor-pointer ${
                  activeTriggerIds.has(inspectedTrigger.id)
                    ? 'bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-700'
                    : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700'
                }`}
              >
                {activeTriggerIds.has(inspectedTrigger.id) ? 'Deactivate Trigger' : 'Activate Trigger'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedPillEmotionalMatrix;
