import React, { useMemo } from 'react';
import {
  Calendar,
  Search,
  Users,
  CheckCircle,
  Sparkles,
  ChevronUp,
  ChevronDown,
  Info,
  Award,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  Coins,
  Megaphone,
  Flame,
  UserCheck,
  Users2,
  Scale,
  Sliders,
  Zap,
  ArrowUpDown,
} from 'lucide-react';
import type { ConstituencyCandidatesData, CandidateFrictionValues } from '../../types';
import { getPartyColor, getPartyBg } from '../../types';

export interface ActionAllocation {
  digitalPoints: number; // 0 - 50
  rallyPoints: number;   // 0 - 50
  welfarePoints: number; // 0 - 50
}

export interface BattlegroundItem {
  ac_no: number;
  ac_name: string;
  district: string;
  pc_name?: string;
  winner_2023: string;
  runner_up_2023: string;
  margin_2023: number;
  isTargetWinning: boolean;
  deficit: number;
  target_community: string;
  target_community_pct: number;
  alloc: ActionAllocation;
  seatTotalPoints: number;
  totalSwing: number;
  projectedNewMargin: number;
  isFlippedToWin: boolean;
  isDefended: boolean;
  reservation?: string;
  adFocus: string;
  recommendedChannel: string;
  starLift: number;
  defectionShift: number;
  totalCumulativeSwing: number;
  cumulativeProjectedMargin: number;
  isCumulativelyFlipped: boolean;
  candidateFriction?: CandidateFrictionValues;
  candidateNetFrictionPct?: number;
  isMlaNegativeDrag?: boolean;
  actualWinner2024?: string;
  actualMargin2024?: number;
  isSimFlipped?: boolean;
  simFlippedFrom?: string;
  simMargin?: number;
}

export type BattlegroundSortOption =
  | 'margin_asc'
  | 'points_needed'
  | 'allocated_first'
  | 'margin_desc'
  | 'ac_no';

interface ConstituencyActionListProps {
  filteredBattlegrounds: BattlegroundItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  battlegroundMarginThreshold: number;
  setBattlegroundMarginThreshold: (threshold: number) => void;
  filterType: 'battleground' | 'all' | 'flipped' | 'mla_drag';
  setFilterType: (filter: 'battleground' | 'all' | 'flipped' | 'mla_drag') => void;
  expandedAcNo: number | null;
  setExpandedAcNo: (acNo: number | null) => void;
  handlePointChange: (
    acNo: number,
    field: 'digitalPoints' | 'rallyPoints' | 'welfarePoints',
    val: number
  ) => void;
  digitalYieldPerPoint: number;
  rallyYieldPerPoint: number;
  welfareYieldPerPoint: number;
  remainingPoints: number;
  totalPointsBudget?: number;
  targetParty: 'TDP' | 'YSRCP' | 'JSP' | 'BJP';
  candidatesData?: Record<string, ConstituencyCandidatesData> | null;
  onOpenDossier?: (acNo: number) => void;
  onAutoFlipAc?: (acNo: number) => void;
  onAutoAllocateBudget?: () => void;
  sortBy?: BattlegroundSortOption;
  setSortBy?: (sort: BattlegroundSortOption) => void;
}

export const ConstituencyActionList: React.FC<ConstituencyActionListProps> = ({
  filteredBattlegrounds,
  searchQuery,
  setSearchQuery,
  battlegroundMarginThreshold,
  setBattlegroundMarginThreshold,
  filterType,
  setFilterType,
  expandedAcNo,
  setExpandedAcNo,
  handlePointChange,
  digitalYieldPerPoint,
  rallyYieldPerPoint,
  welfareYieldPerPoint,
  remainingPoints,
  totalPointsBudget = 1000,
  targetParty,
  candidatesData,
  onOpenDossier,
  onAutoFlipAc,
  onAutoAllocateBudget,
  sortBy,
  setSortBy,
}) => {
  const defendedCount = useMemo(() => {
    return filteredBattlegrounds.filter((b) => b.isTargetWinning && !b.isFlippedToWin).length;
  }, [filteredBattlegrounds]);

  const flippedCount = useMemo(() => {
    return filteredBattlegrounds.filter((b) => b.isFlippedToWin).length;
  }, [filteredBattlegrounds]);

  const deficitCount = useMemo(() => {
    return filteredBattlegrounds.filter((b) => !b.isTargetWinning && !b.isFlippedToWin).length;
  }, [filteredBattlegrounds]);
  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
            Constituency Strategic Resource Allocation
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search AC or District..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-44"
            />
          </div>

          {/* Battleground Margin Threshold Input */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-xs">
            <span className="text-slate-500 font-semibold text-[11px]">Margin &le;</span>
            <input
              type="number"
              min="500"
              max="50000"
              step="500"
              value={battlegroundMarginThreshold}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setBattlegroundMarginThreshold(isNaN(val) ? 0 : Math.max(0, val));
                setFilterType('battleground');
              }}
              className="w-16 px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-xs text-slate-900 text-right focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-slate-400 text-[10px]">votes</span>
            <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
              {[2000, 4000, 8000].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setBattlegroundMarginThreshold(t);
                    setFilterType('battleground');
                  }}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    battlegroundMarginThreshold === t && filterType === 'battleground'
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  &le;{t >= 1000 ? `${t / 1000}k` : t}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setFilterType('battleground')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'battleground'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Battlegrounds ({filteredBattlegrounds.length})
            </button>
            <button
              onClick={() => setFilterType('flipped')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'flipped'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Flipped / Allocated
            </button>
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All 175
            </button>
          </div>

          {/* Battleground Sorting Dropdown */}
          {sortBy && setSortBy && (
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-semibold text-[11px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as BattlegroundSortOption)}
                aria-label="Sort battlegrounds"
                className="bg-transparent font-bold text-xs text-slate-800 focus:outline-hidden cursor-pointer"
              >
                <option value="margin_asc">Tightest Margin First</option>
                <option value="points_needed">Easiest to Flip First</option>
                <option value="allocated_first">Active Allocations First</option>
                <option value="margin_desc">Highest Margin First</option>
                <option value="ac_no">Constituency # (1 - 175)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Mini-Pipeline Status Strip */}
      <div className="sticky top-2 z-20 backdrop-blur-md bg-white/95 border border-slate-200/90 shadow-2xs rounded-xl p-2.5 px-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Showing <strong className="text-slate-900 font-black">{filteredBattlegrounds.length}</strong> ACs
            {filterType === 'battleground' && (
              <span className="text-slate-500 font-mono text-[11px]">(Margin &le; {battlegroundMarginThreshold.toLocaleString()})</span>
            )}
          </span>

          <span className="text-slate-300">|</span>

          {/* Defended */}
          <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-200 font-bold flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3 h-3 text-sky-600" />
            Defended: <span className="font-mono font-black">{defendedCount}</span>
          </span>

          {/* Flipped */}
          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1 text-[11px]">
            <CheckCircle className="w-3 h-3 text-emerald-600" />
            Flipped: <span className="font-mono font-black">{flippedCount}</span>
          </span>

          {/* In Deficit */}
          <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-bold flex items-center gap-1 text-[11px]">
            <Flame className="w-3 h-3 text-rose-500" />
            In Deficit: <span className="font-mono font-black">{deficitCount}</span>
          </span>
        </div>

        {/* Right side: Points Budget Barometer + Quick Auto-Allocate */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-bold">
                Budget: <span className="font-mono text-slate-800">{totalPointsBudget - remainingPoints}</span> / {totalPointsBudget} pts
              </div>
              <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.round(((totalPointsBudget - remainingPoints) / totalPointsBudget) * 100))}%` }}
                />
              </div>
            </div>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
              remainingPoints > 100
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : remainingPoints > 0
                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {remainingPoints} left
            </span>
          </div>

          {onAutoAllocateBudget && (
            <button
              type="button"
              onClick={onAutoAllocateBudget}
              className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 active:scale-95 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
              title="Auto-allocate remaining points budget to closest battlegrounds"
            >
              <Zap className="w-3 h-3 text-indigo-600 fill-indigo-600" />
              Auto-Allocate
            </button>
          )}
        </div>
      </div>

      {/* Single Collapsible Card List */}
      <div className="space-y-2">
        {filteredBattlegrounds.map((b) => {
          const isExpanded = expandedAcNo === b.ac_no;
          const hasPoints = b.seatTotalPoints > 0;
          const isFlipped = b.isFlippedToWin;
          const winnerColor = getPartyColor(b.actualWinner2024 || b.winner_2023);

          return (
            <div
              key={b.ac_no}
              className={`bg-white rounded-xl border transition-all ${
                isFlipped
                  ? 'border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                  : hasPoints
                  ? 'border-indigo-300 ring-1 ring-indigo-400/20 shadow-2xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Compact 1-Line Row Summary */}
              <div
                onClick={() => setExpandedAcNo(isExpanded ? null : b.ac_no)}
                className="p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
              >
                {/* 1. AC No + Name + District */}
                <div className="flex items-center gap-2.5 min-w-[170px]">
                  <span className="font-mono text-xs font-black bg-slate-900 text-white px-2 py-0.5 rounded">
                    #{b.ac_no}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1.5">
                      {b.ac_name}
                      {b.reservation && b.reservation !== 'GEN' && (
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono font-bold">
                          {b.reservation}
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-500">{b.district}</span>
                  </div>
                </div>

                {/* 2. 2024 Baseline Result vs Projected Outcome */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="text-right hidden sm:block">
                    <div className="text-slate-400 text-[10px]">
                      {b.isSimFlipped ? '2024 Actual' : 'Baseline Result'}
                    </div>
                    <div className="font-bold">
                      <span style={{ color: winnerColor }}>
                        {b.actualWinner2024 || b.winner_2023}
                      </span>{' '}
                      <span className="text-slate-500 font-mono">
                        +{(b.actualMargin2024 ?? b.margin_2023).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {isFlipped ? (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-black flex items-center gap-1 shadow-2xs">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        FLIPPED (+{b.projectedNewMargin.toLocaleString()})
                      </span>
                      {b.isSimFlipped && (
                        <span
                          className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-bold flex items-center gap-0.5"
                          title={`Flipped in simulation from ${b.simFlippedFrom} to ${b.winner_2023} (+${(b.simMargin ?? b.margin_2023).toLocaleString()} votes)`}
                        >
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                          Sim: {b.winner_2023} +{(b.simMargin ?? b.margin_2023).toLocaleString()}
                        </span>
                      )}
                    </div>
                  ) : b.isSimFlipped ? (
                    <div className="flex items-center gap-1.5">
                      <span
                        className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-black flex items-center gap-1 shadow-2xs"
                        title={`Flipped in simulation from ${b.simFlippedFrom} to ${b.winner_2023} (+${(b.simMargin ?? b.margin_2023).toLocaleString()} votes)`}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        SIM FLIP ({b.simFlippedFrom} ➔ {b.winner_2023}: +{(b.simMargin ?? b.margin_2023).toLocaleString()})
                      </span>
                      {onAutoFlipAc && !b.isTargetWinning && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAutoFlipAc(b.ac_no);
                          }}
                          disabled={remainingPoints + b.seatTotalPoints <= 0}
                          className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-md text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          title={`Auto-solve minimum points required to flip #${b.ac_no} ${b.ac_name} to victory`}
                        >
                          <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                          Auto-Flip
                        </button>
                      )}
                    </div>
                  ) : b.isTargetWinning ? (
                    <span className="px-2.5 py-1 bg-sky-100 text-sky-800 border border-sky-300 rounded-lg text-xs font-bold">
                      Defended (+{b.projectedNewMargin.toLocaleString()})
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold">
                        Deficit: -{Math.abs(b.projectedNewMargin).toLocaleString()}
                      </span>
                      {onAutoFlipAc && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAutoFlipAc(b.ac_no);
                          }}
                          disabled={remainingPoints + b.seatTotalPoints <= 0}
                          className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-md text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          title={`Auto-solve minimum points required to flip #${b.ac_no} ${b.ac_name} to victory`}
                        >
                          <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                          Auto-Flip
                        </button>
                      )}
                    </div>
                  )}

                  {/* Cumulative Compounded Outcome if Star or Defection/Rebel active */}
                  {(b.starLift > 0 || b.defectionShift !== 0) && (
                    <div className="flex items-center gap-1">
                      {b.isCumulativelyFlipped ? (
                        <span
                          className="px-2 py-0.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded text-[11px] font-black flex items-center gap-1 shadow-2xs"
                          title={`Compounded Net Swing: +${b.totalCumulativeSwing.toLocaleString()} (Resource: +${b.totalSwing.toLocaleString()}, Star: +${b.starLift.toLocaleString()}, Rebel/Defection: ${b.defectionShift >= 0 ? '+' : ''}${b.defectionShift.toLocaleString()})`}
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          TOTAL FLIP (+{b.cumulativeProjectedMargin.toLocaleString()})
                        </span>
                      ) : b.cumulativeProjectedMargin > 0 ? (
                        <span
                          className="px-2 py-0.5 bg-indigo-100 text-indigo-900 border border-indigo-300 rounded text-[11px] font-bold font-mono"
                          title={`Compounded Total Margin: +${b.cumulativeProjectedMargin.toLocaleString()}`}
                        >
                          Total: +{b.cumulativeProjectedMargin.toLocaleString()}
                        </span>
                      ) : (
                        <span
                          className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-300 rounded text-[11px] font-bold font-mono"
                          title={`Compounded Total Deficit: ${b.cumulativeProjectedMargin.toLocaleString()}`}
                        >
                          Total: {b.cumulativeProjectedMargin.toLocaleString()}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* 4. Active Points & Projected Swing Pills & Expand Chevron */}
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    {hasPoints ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        +{b.totalSwing.toLocaleString()} votes ({b.seatTotalPoints} pts: {b.alloc.digitalPoints}d / {b.alloc.rallyPoints}r / {b.alloc.welfarePoints}w)
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">No points assigned</span>
                    )}
                  </div>

                  <button className="text-slate-400 hover:text-slate-700 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded Drawer (Revealed on Click): Resource Point Allocator Across 3 Pillars */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/60 rounded-b-xl text-xs space-y-3 animate-in fade-in duration-150">
                  {/* Demographic Directive Box */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between text-slate-800 font-bold text-xs">
                      <div className="flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-indigo-600" />
                        <span>Strategic Directive for {b.ac_name}: {b.target_community} ({b.target_community_pct}% of AC)</span>
                      </div>
                      <span className="font-mono text-indigo-700 font-black">
                        Total Allocated: {b.seatTotalPoints} pts &bull; Projected Swing: +{b.totalSwing.toLocaleString()} votes
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
                      <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <strong className="text-slate-700">Messaging Focus:</strong>{' '}
                        <span className="text-slate-600">{b.adFocus}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded border border-slate-100">
                        <strong className="text-slate-700">Delivery Channel:</strong>{' '}
                        <span className="text-slate-600">{b.recommendedChannel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Candidate Equity & ADR Matchup Box */}
                  {candidatesData && candidatesData[String(b.ac_no)] && (() => {
                    const acCands = candidatesData[String(b.ac_no)].candidates || [];
                    const targetCand = acCands.find((c) => c.party === targetParty) || acCands[0];
                    const oppCand = acCands.find((c) => c.party !== targetParty && !c.is_nota) || acCands[1];

                    if (!targetCand) return null;

                    const tCases = targetCand.myneta?.criminal_cases ?? 0;
                    const oCases = oppCand?.myneta?.criminal_cases ?? 0;
                    const hasLegalEdge = oppCand && tCases < oCases;
                    const hasAssetEdge = oppCand && (targetCand.myneta?.total_assets || 0) > (oppCand.myneta?.total_assets || 0);

                    return (
                      <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                            <Award className="w-4 h-4 text-amber-500" />
                            <span>Candidate Equity &amp; ADR Matchup ({b.ac_name})</span>
                          </div>
                          {onOpenDossier && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenDossier(b.ac_no);
                              }}
                              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                            >
                              <span>View Full Dossier</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          {/* Target Party Candidate */}
                          <div className="p-2.5 rounded-lg border border-indigo-100 bg-indigo-50/40 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-indigo-950 truncate max-w-[160px]" title={targetCand.name}>
                                {targetCand.name}
                              </span>
                              <span
                                className="px-1.5 py-0.2 rounded font-bold text-[10px]"
                                style={{ backgroundColor: getPartyBg(targetCand.party), color: getPartyColor(targetCand.party) }}
                              >
                                {targetCand.party}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600 text-[10px] pt-1 border-t border-indigo-100">
                              <span>Net Worth: <strong className="font-mono text-slate-900">{targetCand.myneta?.net_worth_formatted || 'N/A'}</strong></span>
                              <span className="flex items-center gap-1">
                                {tCases === 0 ? (
                                  <span className="text-emerald-700 font-bold flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> 0 Cases</span>
                                ) : (
                                  <span className="text-rose-700 font-bold flex items-center gap-0.5"><ShieldAlert className="w-3 h-3" /> {tCases} Cases</span>
                                )}
                              </span>
                            </div>
                            {targetCand.myneta?.education && (
                              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                <GraduationCap className="w-3 h-3 text-slate-400" />
                                <span className="truncate">{targetCand.myneta.education}</span>
                              </div>
                            )}
                          </div>

                          {/* Opponent Candidate */}
                          {oppCand ? (
                            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900 truncate max-w-[160px]" title={oppCand.name}>
                                  {oppCand.name}
                                </span>
                                <span
                                  className="px-1.5 py-0.2 rounded font-bold text-[10px]"
                                  style={{ backgroundColor: getPartyBg(oppCand.party), color: getPartyColor(oppCand.party) }}
                                >
                                  {oppCand.party}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-slate-600 text-[10px] pt-1 border-t border-slate-200">
                                <span>Net Worth: <strong className="font-mono text-slate-900">{oppCand.myneta?.net_worth_formatted || 'N/A'}</strong></span>
                                <span className="flex items-center gap-1">
                                  {oCases === 0 ? (
                                    <span className="text-emerald-700 font-bold flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> 0 Cases</span>
                                  ) : (
                                    <span className="text-rose-700 font-bold flex items-center gap-0.5"><ShieldAlert className="w-3 h-3" /> {oCases} Cases</span>
                                  )}
                                </span>
                              </div>
                              {oppCand.myneta?.education && (
                                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                                  <GraduationCap className="w-3 h-3 text-slate-400" />
                                  <span className="truncate">{oppCand.myneta.education}</span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 text-center flex items-center justify-center text-[11px]">
                              Opponent profile pending Form-20 filing
                            </div>
                          )}
                        </div>

                        {/* Tactical Narrative Directive based on Candidate Matchup */}
                        <div className="flex items-center gap-2 flex-wrap text-[10px] pt-1">
                          {hasLegalEdge && (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Legal Integrity Edge: Clean statutory record vs opponent ({oCases} cases). Hammer anti-corruption narrative in townhalls.
                            </span>
                          )}
                          {!hasLegalEdge && oCases > 5 && (
                            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 font-bold flex items-center gap-1">
                              <ShieldAlert className="w-3 h-3 text-rose-600" />
                              Opponent Legal Vulnerability: Opponent faces {oCases} pending criminal charges. Distribute Form-26 fact sheets to fence-sitters.
                            </span>
                          )}
                          {hasAssetEdge && (
                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold flex items-center gap-1">
                              <Coins className="w-3 h-3 text-amber-600" />
                              Resource Clout: Superior candidate financial base ({targetCand.myneta?.total_assets_formatted} vs {oppCand?.myneta?.total_assets_formatted}).
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Exported Candidate Health & Local MLA Drag Breakdown Card */}
                  {(b.candidateFriction || (b.candidateNetFrictionPct !== undefined && b.candidateNetFrictionPct !== 0)) && (
                    <div
                      className={`p-3.5 rounded-xl border space-y-2.5 ${
                        b.isMlaNegativeDrag
                          ? 'bg-rose-50/70 border-rose-200'
                          : 'bg-emerald-50/70 border-emerald-200'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`p-1.5 rounded-lg ${
                              b.isMlaNegativeDrag
                                ? 'bg-rose-500 text-white'
                                : 'bg-emerald-500 text-white'
                            }`}
                          >
                            {b.isMlaNegativeDrag ? <Flame className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5 className="font-black text-slate-900 text-xs">
                                Exported Candidate Health &amp; Local MLA Drag
                              </h5>
                              <span
                                className={`font-mono font-black text-[11px] px-2 py-0.5 rounded-md border ${
                                  b.isMlaNegativeDrag
                                    ? 'bg-rose-100 text-rose-900 border-rose-300'
                                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                }`}
                              >
                                {b.candidateNetFrictionPct !== undefined && b.candidateNetFrictionPct > 0
                                  ? `+${b.candidateNetFrictionPct}% Candidate Lift`
                                  : `${b.candidateNetFrictionPct}% MLA Drag`}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-600">
                              Sitting {b.winner_2023} MLA local friction levers exported from War Room simulation.
                            </span>
                          </div>
                        </div>

                        {b.isMlaNegativeDrag && (
                          <span className="text-[11px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded border border-rose-200">
                            ⚠️ Grassroots Anti-Incumbency Vulnerability
                          </span>
                        )}
                      </div>

                      {/* 4 Dimension Breakdown */}
                      {b.candidateFriction && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                          <div className="bg-white/90 p-2 rounded-lg border border-slate-200 space-y-0.5">
                            <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold">
                              <UserCheck className="w-3 h-3 text-indigo-500" />
                              <span>1. Accessibility</span>
                            </div>
                            <div className={`font-mono font-bold ${b.candidateFriction.accessibility < 0 ? 'text-rose-700' : b.candidateFriction.accessibility > 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                              {b.candidateFriction.accessibility >= 0
                                ? `+${b.candidateFriction.accessibility}%`
                                : `${b.candidateFriction.accessibility}%`}
                            </div>
                          </div>

                          <div className="bg-white/90 p-2 rounded-lg border border-slate-200 space-y-0.5">
                            <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold">
                              <ShieldAlert className="w-3 h-3 text-amber-500" />
                              <span>2. Syndicate / Mafia</span>
                            </div>
                            <div className={`font-mono font-bold ${b.candidateFriction.syndicateMafia < 0 ? 'text-rose-700' : b.candidateFriction.syndicateMafia > 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                              {b.candidateFriction.syndicateMafia >= 0
                                ? `+${b.candidateFriction.syndicateMafia}%`
                                : `${b.candidateFriction.syndicateMafia}%`}
                            </div>
                          </div>

                          <div className="bg-white/90 p-2 rounded-lg border border-slate-200 space-y-0.5">
                            <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold">
                              <Users2 className="w-3 h-3 text-sky-500" />
                              <span>3. Cadre Rebel</span>
                            </div>
                            <div className={`font-mono font-bold ${b.candidateFriction.cadreRebel < 0 ? 'text-rose-700' : b.candidateFriction.cadreRebel > 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                              {b.candidateFriction.cadreRebel >= 0
                                ? `+${b.candidateFriction.cadreRebel}%`
                                : `${b.candidateFriction.cadreRebel}%`}
                            </div>
                          </div>

                          <div className="bg-white/90 p-2 rounded-lg border border-slate-200 space-y-0.5">
                            <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold">
                              <Scale className="w-3 h-3 text-purple-500" />
                              <span>4. Caste Chemistry</span>
                            </div>
                            <div className={`font-mono font-bold ${b.candidateFriction.casteFaction < 0 ? 'text-rose-700' : b.candidateFriction.casteFaction > 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                              {b.candidateFriction.casteFaction >= 0
                                ? `+${b.candidateFriction.casteFaction}%`
                                : `${b.candidateFriction.casteFaction}%`}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tactical Remediation Guidance */}
                      <div className="text-[11px] text-slate-700 bg-white/90 p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                        <Sliders className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Playbook Corrective Strategy: </strong>
                          {b.isMlaNegativeDrag ? (
                            <span>
                              Sitting MLA drag ({b.candidateNetFrictionPct}%) creates vulnerability in grassroots booth retention. Prioritize direct voter outreach, assign higher digital &amp; door-to-door welfare points to bypass MLA anti-incumbency, and deploy non-MLA surrogate star campaigners to insulate the party vote.
                            </span>
                          ) : (
                            <span>
                              Sitting candidate enjoys personal goodwill lift (+{b.candidateNetFrictionPct}%). Maximize candidate-led townhalls and mandal padyatras.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Allocation 3 Pillars Controls */}
                  <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-bold text-slate-800 text-[11px] border-b border-slate-100 pb-1.5">
                      <span>Deploy Campaign Resource Points Across 3 Strategic Pillars</span>
                      <div className="flex items-center gap-2">
                        {onAutoFlipAc && !b.isTargetWinning && !b.isFlippedToWin && (
                          <button
                            type="button"
                            onClick={() => onAutoFlipAc(b.ac_no)}
                            disabled={remainingPoints + b.seatTotalPoints <= 0}
                            className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded text-[10px] font-bold flex items-center gap-1 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Zap className="w-3 h-3 text-amber-300 fill-amber-300" />
                            Auto-Flip Seat
                          </button>
                        )}
                        {b.seatTotalPoints > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              handlePointChange(b.ac_no, 'digitalPoints', 0);
                              handlePointChange(b.ac_no, 'rallyPoints', 0);
                              handlePointChange(b.ac_no, 'welfarePoints', 0);
                            }}
                            className="text-slate-400 hover:text-rose-600 text-[10px] font-semibold underline cursor-pointer"
                          >
                            Reset Points
                          </button>
                        )}
                        <span className="text-slate-500 font-normal">
                          Available: <strong className="text-emerald-700 font-bold">{remainingPoints} pts</strong>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Pillar 1: Digital Ads */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-indigo-900 flex items-center gap-1.5 text-xs">
                            <Megaphone className="w-3.5 h-3.5 text-indigo-600" />
                            Digital Ads
                          </span>
                          <span className="font-mono font-bold text-xs text-indigo-700">
                            {b.alloc.digitalPoints} pts
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Yield: ~{digitalYieldPerPoint} votes/pt &bull; Local reels &amp; WhatsApp
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="5"
                          value={b.alloc.digitalPoints}
                          onChange={(e) => handlePointChange(b.ac_no, 'digitalPoints', Number(e.target.value))}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          {[0, 10, 25, 40].map((val) => (
                            <button
                              key={val}
                              onClick={() => handlePointChange(b.ac_no, 'digitalPoints', val)}
                              className={`px-1.5 py-0.5 rounded border text-[9px] font-bold cursor-pointer transition-colors ${
                                b.alloc.digitalPoints === val ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {val}p
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pillar 2: CM Rallies */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                            <Users className="w-3.5 h-3.5 text-emerald-600" />
                            CM / Star Rallies
                          </span>
                          <span className="font-mono font-bold text-xs text-emerald-700">
                            {b.alloc.rallyPoints} pts
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Yield: ~{rallyYieldPerPoint} votes/pt &bull; Mandal meetings
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="5"
                          value={b.alloc.rallyPoints}
                          onChange={(e) => handlePointChange(b.ac_no, 'rallyPoints', Number(e.target.value))}
                          className="w-full accent-emerald-600 cursor-pointer"
                        />
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          {[0, 10, 20, 30].map((val) => (
                            <button
                              key={val}
                              onClick={() => handlePointChange(b.ac_no, 'rallyPoints', val)}
                              className={`px-1.5 py-0.5 rounded border text-[9px] font-bold cursor-pointer transition-colors ${
                                b.alloc.rallyPoints === val ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {val}p
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Pillar 3: Targeted Welfare */}
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                            <Award className="w-3.5 h-3.5 text-amber-600" />
                            Targeted Welfare
                          </span>
                          <span className="font-mono font-bold text-xs text-amber-700">
                            {b.alloc.welfarePoints} pts
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Yield: ~{welfareYieldPerPoint} votes/pt &bull; Community loan disbursals
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="5"
                          value={b.alloc.welfarePoints}
                          onChange={(e) => handlePointChange(b.ac_no, 'welfarePoints', Number(e.target.value))}
                          className="w-full accent-amber-600 cursor-pointer"
                        />
                        <div className="flex items-center justify-between gap-1 text-[10px]">
                          {[0, 10, 20, 30].map((val) => (
                            <button
                              key={val}
                              onClick={() => handlePointChange(b.ac_no, 'welfarePoints', val)}
                              className={`px-1.5 py-0.5 rounded border text-[9px] font-bold cursor-pointer transition-colors ${
                                b.alloc.welfarePoints === val ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {val}p
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cross-Tab Compounded Impact Panel if Star or Defection models are active on this AC */}
                  {(b.starLift > 0 || b.defectionShift !== 0) && (
                    <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-lg p-3 space-y-2 border border-indigo-900/60 shadow-sm">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-indigo-300">
                          <Sparkles className="w-3.5 h-3.5" />
                          Compounded Cross-Pillar Impact (Actions Engine)
                        </span>
                        <span className={`font-mono px-2 py-0.5 rounded text-[11px] font-black ${
                          b.cumulativeProjectedMargin > 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          Net Compounded Margin: {b.cumulativeProjectedMargin > 0 ? '+' : ''}{b.cumulativeProjectedMargin.toLocaleString()} votes
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                        <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
                          <span className="text-slate-400 block text-[9px] uppercase">Resource Allocator</span>
                          <span className="font-bold text-indigo-300">+{b.totalSwing.toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
                          <span className="text-slate-400 block text-[9px] uppercase">Star Campaigners</span>
                          <span className="font-bold text-amber-300">+{b.starLift.toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-800/80 p-2 rounded border border-slate-700/60">
                          <span className="text-slate-400 block text-[9px] uppercase">Defection / Rebel</span>
                          <span className={`font-bold ${b.defectionShift >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                            {b.defectionShift >= 0 ? '+' : ''}{b.defectionShift.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer with Dossier Link */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Seat Status: <strong>{b.isFlippedToWin ? 'Flipped to Victory' : b.isTargetWinning ? 'Defended' : `Deficit of ${Math.abs(b.projectedNewMargin).toLocaleString()} votes`}</strong>
                      {b.isSimFlipped && (
                        <span className="ml-2 font-mono text-amber-700 font-bold">
                          &bull; Simulation Flip: {b.simFlippedFrom} ➔ {b.winner_2023} (+{(b.simMargin ?? b.margin_2023).toLocaleString()} votes)
                        </span>
                      )}
                    </span>
                    {onOpenDossier && (
                      <button
                        onClick={() => onOpenDossier(b.ac_no)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                      >
                        Inspect Full AC Dossier ↗
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
