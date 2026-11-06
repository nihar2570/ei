import React from 'react';
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
} from 'lucide-react';
import type { ConstituencyCandidatesData } from '../../types';
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
}

interface ConstituencyActionListProps {
  filteredBattlegrounds: BattlegroundItem[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  battlegroundMarginThreshold: number;
  setBattlegroundMarginThreshold: (threshold: number) => void;
  filterType: 'battleground' | 'all' | 'flipped';
  setFilterType: (filter: 'battleground' | 'all' | 'flipped') => void;
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
  targetParty: 'TDP' | 'YSRCP' | 'JSP' | 'BJP';
  candidatesData?: Record<string, ConstituencyCandidatesData> | null;
  onOpenDossier?: (acNo: number) => void;
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
  targetParty,
  candidatesData,
  onOpenDossier,
}) => {
  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
            Constituency Resource Allocation &amp; Community Directives
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
        </div>
      </div>

      {/* Single Collapsible Card List */}
      <div className="space-y-2">
        {filteredBattlegrounds.map((b) => {
          const isExpanded = expandedAcNo === b.ac_no;
          const hasPoints = b.seatTotalPoints > 0;
          const isFlipped = b.isFlippedToWin;
          const winnerColor = getPartyColor(b.winner_2023);

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

                {/* 2. Target Decisive Community Badge */}
                <div className="hidden lg:flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Target Community:</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-900 border border-indigo-200 flex items-center gap-1">
                    <Users className="w-3 h-3 text-indigo-600" />
                    {b.target_community} ({b.target_community_pct}%)
                  </span>
                </div>

                {/* 3. 2023 Baseline Result vs Projected Outcome */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="text-right hidden sm:block">
                    <div className="text-slate-400 text-[10px]">2023 Result</div>
                    <div className="font-bold">
                      <span style={{ color: winnerColor }}>{b.winner_2023}</span>{' '}
                      <span className="text-slate-500 font-mono">+{b.margin_2023.toLocaleString()}</span>
                    </div>
                  </div>

                  {isFlipped ? (
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-black flex items-center gap-1 shadow-2xs">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      FLIPPED (+{b.projectedNewMargin.toLocaleString()})
                    </span>
                  ) : b.isTargetWinning ? (
                    <span className="px-2.5 py-1 bg-sky-100 text-sky-800 border border-sky-300 rounded-lg text-xs font-bold">
                      Defended (+{b.projectedNewMargin.toLocaleString()})
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold">
                      Deficit: -{Math.abs(b.projectedNewMargin).toLocaleString()}
                    </span>
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

                  {/* Allocation 3 Pillars Controls */}
                  <div className="bg-white rounded-lg border border-slate-200 p-3 space-y-3">
                    <div className="flex items-center justify-between font-bold text-slate-800 text-[11px] border-b border-slate-100 pb-1.5">
                      <span>Deploy Campaign Resource Points Across 3 Strategic Pillars</span>
                      <span className="text-slate-500 font-normal">Available Pool: <strong className="text-emerald-700 font-bold">{remainingPoints} pts</strong></span>
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
