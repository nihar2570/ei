import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  CheckCircle,
  Sliders,
  ExternalLink,
  RotateCcw,
  Handshake,
  ChevronDown,
  ChevronUp,
  Flame,
} from 'lucide-react';
import type { ActiveScenarioBridge } from '../../types';
import type { WhatIfTab } from '../AdvancedSimulationSuite';

export interface PlaybookCumulativeMetrics {
  baselineSeats: number;
  cumulativeSeatsWon: number;
  cumulativeFlipsCount: number;
  resourceTargetCount: number;
  totalResourceVotes: number;
  totalStarVotes: number;
  totalDefectionNetVotes: number;
  activeStarCampaignerDays: number;
  starConstituenciesCount: number;
  activeDefectionsCount: number;
  netCombinedVotes: number;
}

export interface PlaybookPipelineSummaryCardProps {
  isScenarioActive: boolean;
  scenarioBridge?: ActiveScenarioBridge | null;
  onNavigateToWhatIf?: (category: WhatIfTab) => void;
  onUnlinkScenario?: () => void;
  targetSeats2023: number;
  targetParty: string;
  coalition2024Seats: number;
  cumulativeMetrics: PlaybookCumulativeMetrics;
  isCoalition: boolean;
  postActionCoalitionSeats: number;
  coalitionDiff: number;
}

export const PlaybookPipelineSummaryCard: React.FC<PlaybookPipelineSummaryCardProps> = ({
  isScenarioActive,
  scenarioBridge,
  onNavigateToWhatIf,
  onUnlinkScenario,
  targetSeats2023,
  targetParty,
  coalition2024Seats,
  cumulativeMetrics,
  isCoalition,
  postActionCoalitionSeats,
  coalitionDiff,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const candidateFrictionSummary = useMemo(() => {
    if (!scenarioBridge?.candidateFrictionOverrides) return null;
    const entries = Object.values(scenarioBridge.candidateFrictionOverrides);
    if (entries.length === 0) return null;
    let dragCount = 0;
    let liftCount = 0;
    entries.forEach((cf) => {
      const net = (cf.accessibility || 0) + (cf.syndicateMafia || 0) + (cf.cadreRebel || 0) + (cf.casteFaction || 0);
      if (net < 0) dragCount++;
      else if (net > 0) liftCount++;
    });
    return { total: entries.length, dragCount, liftCount };
  }, [scenarioBridge]);

  if (!isScenarioActive || !scenarioBridge) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-3 sm:p-3.5 border border-indigo-200/90 shadow-2xs space-y-2.5 animate-in fade-in duration-150">
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-indigo-50 text-indigo-600 border border-indigo-200/70 rounded-lg">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
              3-Stage Mandate Pipeline
            </h3>
            <span className="text-[11px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              <span>Simulation: {scenarioBridge.name}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onNavigateToWhatIf?.('coalition')}
            className="px-2.5 py-1 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
            title="Open Simulations tab to modify what-ifs"
          >
            <Sliders className="w-3 h-3" />
            <span>Modify What-Ifs</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
          {onUnlinkScenario && (
            <button
              type="button"
              onClick={onUnlinkScenario}
              className="px-2.5 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-all cursor-pointer flex items-center gap-1"
              title="Unlink simulation scenario and restore 2024 actual results baseline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all cursor-pointer"
            title={isExpanded ? 'Collapse pipeline breakdown' : 'Expand pipeline breakdown'}
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {isExpanded ? (
        /* Compressed 3-Stage Comparison Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {/* Stage 1: 2024 Actual Mandate */}
          <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-200/90 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
              <span>1. 2024 Actual</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase bg-slate-100 px-1.5 py-0.2 rounded">
                Official Base
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-xl font-black text-slate-800 font-mono">{targetSeats2023}</span>
              <span className="text-xs text-slate-500 font-medium">seats ({targetParty})</span>
            </div>
            {isCoalition && (
              <div className="text-[11px] font-mono text-amber-900 font-semibold pt-1 border-t border-slate-200/80 flex items-center justify-between">
                <span className="text-slate-500">NDA 2024 Mandate:</span>
                <span className="font-bold">{coalition2024Seats} seats</span>
              </div>
            )}
          </div>

          {/* Stage 2: Simulation Scenario Base */}
          <div className="p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900 mb-1">
              <span>2. Simulation Base</span>
              <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-100/90 px-1.5 py-0.2 rounded truncate max-w-[140px]" title={scenarioBridge.name}>
                {scenarioBridge.name}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-xl font-black text-indigo-950 font-mono">{cumulativeMetrics.baselineSeats}</span>
              <span className="text-xs text-indigo-800 font-medium">{targetParty}</span>
              <span className={`text-xs font-mono font-bold ${cumulativeMetrics.baselineSeats - targetSeats2023 >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                ({cumulativeMetrics.baselineSeats - targetSeats2023 >= 0 ? `+${cumulativeMetrics.baselineSeats - targetSeats2023}` : `${cumulativeMetrics.baselineSeats - targetSeats2023}`} vs '24)
              </span>
            </div>
            {isCoalition && (
              <div className="text-[11px] font-mono text-indigo-900 font-semibold pt-1 border-t border-indigo-200/60 flex items-center justify-between">
                <span className="text-indigo-600/80">Simulated Base:</span>
                <span className="font-bold">{cumulativeMetrics.baselineSeats} {targetParty}</span>
              </div>
            )}
            {candidateFrictionSummary && candidateFrictionSummary.total > 0 && (
              <div className="text-[10px] font-mono text-rose-800 font-bold pt-1 border-t border-indigo-200/60 flex items-center justify-between">
                <span className="flex items-center gap-1 text-rose-700">
                  <Flame className="w-3 h-3 text-rose-600 inline" />
                  <span>MLA Negative Drag:</span>
                </span>
                <span className="bg-rose-100 text-rose-900 px-1.5 py-0.2 rounded border border-rose-300">
                  {candidateFrictionSummary.dragCount} ACs ({candidateFrictionSummary.total} tuned)
                </span>
              </div>
            )}
          </div>

          {/* Stage 3: Compounded Post-Playbook Total */}
          <div className="p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-200/90 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-950 mb-1">
              <span>3. Compounded Final</span>
              <span className="text-[10px] font-mono text-emerald-800 font-black bg-emerald-100/90 px-1.5 py-0.2 rounded border border-emerald-200/80">
                Playbook Total
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 my-0.5">
              <span className="text-xl font-black text-emerald-950 font-mono">
                {cumulativeMetrics.cumulativeSeatsWon}
              </span>
              <span className="text-xs text-emerald-800 font-medium">{targetParty}</span>
              <span className="text-xs font-mono font-black text-emerald-700">
                (+{cumulativeMetrics.cumulativeFlipsCount} Playbook Flips)
              </span>
            </div>
            {isCoalition && (
              <div className="text-[11px] font-mono font-bold pt-1 border-t border-emerald-200/70 flex items-center justify-between">
                <span className="text-amber-950 flex items-center gap-1">
                  <Handshake className="w-3 h-3 text-amber-600 inline" />
                  <span>NDA Projected:</span>
                </span>
                <span className="font-black text-amber-900 flex items-center gap-1">
                  <span>{postActionCoalitionSeats} seats</span>
                  {coalitionDiff !== 0 && (
                    <span className={`text-[10px] font-mono font-bold px-1 rounded ${
                      coalitionDiff < 0 ? 'bg-rose-200 text-rose-900' : 'bg-emerald-200 text-emerald-900'
                    }`}>
                      {coalitionDiff < 0 ? `${coalitionDiff}` : `+${coalitionDiff}`}
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-1 rounded border ${
                    postActionCoalitionSeats >= 88 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-rose-100 text-rose-800 border-rose-200'
                  }`}>
                    {postActionCoalitionSeats >= 88 ? `+${postActionCoalitionSeats - 88} buf` : `-${88 - postActionCoalitionSeats}`}
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Collapsed Breadcrumb Summary */
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs pt-1 border-t border-slate-100 text-slate-600 font-mono">
          <div className="flex items-center gap-2 flex-wrap">
            <span>2024 Actual: <strong className="text-slate-800">{targetSeats2023}</strong> ({targetParty})</span>
            <span className="text-slate-300">➔</span>
            <span>Simulation: <strong className="text-indigo-900">{cumulativeMetrics.baselineSeats}</strong></span>
            <span className="text-slate-300">➔</span>
            <span>Compounded: <strong className="text-emerald-800">{cumulativeMetrics.cumulativeSeatsWon}</strong> (+{cumulativeMetrics.cumulativeFlipsCount} Playbook flips, {cumulativeMetrics.netCombinedVotes >= 0 ? '+' : ''}{cumulativeMetrics.netCombinedVotes.toLocaleString()} votes)</span>
          </div>
          {isCoalition && (
            <div className="text-amber-900 font-bold flex items-center gap-1">
              <Handshake className="w-3.5 h-3.5 text-amber-600" />
              <span>NDA Total: <strong>{postActionCoalitionSeats} seats</strong></span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
