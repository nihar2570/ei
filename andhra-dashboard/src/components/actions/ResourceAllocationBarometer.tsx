import React from 'react';
import {
  Target,
  Sparkles,
  RotateCcw,
  Sliders,
  X,
  ExternalLink,
} from 'lucide-react';
import type { ActiveScenarioBridge } from '../../types';
import type { WhatIfTab } from '../AdvancedSimulationSuite';

interface ResourceAllocationBarometerProps {
  targetParty: 'TDP' | 'YSRCP' | 'JSP' | 'BJP';
  setTargetParty: (p: 'TDP' | 'YSRCP' | 'JSP' | 'BJP') => void;
  autoAllocateBudget: () => void;
  resetAllocations: () => void;
  totalAllocated: number;
  totalPointsBudget: number;
  setTotalPointsBudget: React.Dispatch<React.SetStateAction<number>>;
  remainingPoints: number;
  flipsCount: number;
  totalVotesGained: number;
  isScenarioActive: boolean;
  scenarioBridge?: ActiveScenarioBridge | null;
  onUnlinkScenario?: () => void;
  onNavigateToWhatIf?: (category: WhatIfTab) => void;
  digitalYieldPerPoint: number;
  setDigitalYieldPerPoint: (val: number) => void;
  rallyYieldPerPoint: number;
  setRallyYieldPerPoint: (val: number) => void;
  welfareYieldPerPoint: number;
  setWelfareYieldPerPoint: (val: number) => void;
}

export const ResourceAllocationBarometer: React.FC<ResourceAllocationBarometerProps> = ({
  targetParty,
  setTargetParty,
  autoAllocateBudget,
  resetAllocations,
  totalAllocated,
  totalPointsBudget,
  setTotalPointsBudget,
  remainingPoints,
  flipsCount,
  totalVotesGained,
  isScenarioActive,
  scenarioBridge,
  onUnlinkScenario,
  onNavigateToWhatIf,
  digitalYieldPerPoint,
  setDigitalYieldPerPoint,
  rallyYieldPerPoint,
  setRallyYieldPerPoint,
  welfareYieldPerPoint,
  setWelfareYieldPerPoint,
}) => {
  return (
    <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white font-mono text-xs font-black px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> CAMPAIGN ACTIONS PLAYBOOK
            </span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700">
              Resource &amp; Point Allocator
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Caste-Targeted Ads, Rallies &amp; Welfare Campaign Allocator
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Perspective party selector */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl text-xs font-bold border border-slate-700">
            <span className="text-slate-400 px-2 text-[11px]">Strategy for:</span>
            {(['TDP', 'YSRCP', 'JSP', 'BJP'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setTargetParty(p)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  targetParty === p
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={autoAllocateBudget}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            title="Automatically distribute points to flip highest-yield seats"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" />
            Auto-Optimize Budget
          </button>

          <button
            type="button"
            onClick={resetAllocations}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Reset allocations"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-Time Strategic Impact Scoreboard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-400 font-semibold mb-1">Campaign Resource Points</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-white">{totalAllocated}</span>
              <span className="text-xs text-slate-400">/</span>
              <input
                type="number"
                min="100"
                max="100000"
                step="100"
                value={totalPointsBudget}
                onChange={(e) => setTotalPointsBudget(Math.max(0, Number(e.target.value) || 0))}
                className="w-20 px-1.5 py-0.5 bg-slate-900 border border-slate-600 rounded font-mono font-bold text-xs text-amber-400 text-right focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                title="Click to edit total point pool"
              />
              <span className="text-[10px] text-slate-400">Pool</span>
            </div>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full transition-all ${totalAllocated > totalPointsBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, (totalAllocated / Math.max(1, totalPointsBudget)) * 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-1">
              <span>Points Available</span>
              <span className="text-[10px] text-slate-400 font-mono">Add more:</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-3xl font-black ${remainingPoints >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {remainingPoints}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setTotalPointsBudget((prev) => prev + 100)}
                  className="px-2 py-1 bg-slate-700 hover:bg-slate-600 active:bg-emerald-700 text-white rounded text-[11px] font-mono font-bold cursor-pointer transition-colors shadow-2xs"
                  title="Add 100 points to available pool"
                >
                  +100
                </button>
                <button
                  type="button"
                  onClick={() => setTotalPointsBudget((prev) => prev + 250)}
                  className="px-2 py-1 bg-slate-700 hover:bg-slate-600 active:bg-emerald-700 text-white rounded text-[11px] font-mono font-bold cursor-pointer transition-colors shadow-2xs"
                  title="Add 250 points to available pool"
                >
                  +250
                </button>
                <button
                  type="button"
                  onClick={() => setTotalPointsBudget((prev) => prev + 500)}
                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded text-[11px] font-mono font-bold cursor-pointer transition-colors shadow-2xs"
                  title="Add 500 points to available pool"
                >
                  +500
                </button>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
            <span>{remainingPoints >= 0 ? 'Ready to assign' : 'Budget Overspent!'}</span>
            <span className="text-slate-500 text-[10px]">Total: {totalPointsBudget} pts</span>
          </div>
        </div>

        <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
          <div className="text-xs text-slate-400 font-semibold mb-1">Projected Net Seat Flips</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400">+{flipsCount}</span>
            <span className="text-xs text-slate-400">Seats for {targetParty}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">From allocated campaign inputs</div>
        </div>

        <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
          <div className="text-xs text-slate-400 font-semibold mb-1">Total Ground Vote Gain</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-400">
              +{totalVotesGained.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">Votes</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across prioritized battleground ACs
          </div>
        </div>
      </div>

      {/* Scenario Bridge Active Status Pill */}
      {isScenarioActive && scenarioBridge && (
        <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/60 to-slate-900/60 border border-indigo-500/40 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
              LINKED SCENARIO
            </span>
            <span className="font-bold text-white">{scenarioBridge.name}</span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              (Baseline outcomes derived from active simulation model)
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onNavigateToWhatIf && (
              <button
                type="button"
                onClick={() => onNavigateToWhatIf('coalition')}
                className="text-indigo-300 hover:text-white flex items-center gap-1 font-semibold cursor-pointer"
              >
                <span>Tweak in Simulation</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
            {onUnlinkScenario && (
              <button
                type="button"
                onClick={onUnlinkScenario}
                className="text-slate-400 hover:text-rose-300 p-1 cursor-pointer"
                title="Unlink simulation scenario and use 2024 certified baseline"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Yield Multiplier Calibration */}
      <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span className="font-bold">Conversion Yield Calibration:</span>
          <span className="text-slate-400 hidden sm:inline text-[11px]">
            Adjust empirical votes generated per allocated point
          </span>
        </div>

        <div className="flex items-center gap-4 flex-wrap font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">📱 Digital Ads:</span>
            <input
              type="number"
              min="5"
              max="500"
              value={digitalYieldPerPoint}
              onChange={(e) => setDigitalYieldPerPoint(Math.max(1, Number(e.target.value) || 0))}
              className="w-14 px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-xs text-sky-700 text-right focus:outline-hidden focus:ring-1 focus:ring-sky-500"
            />
            <span className="text-[10px] text-slate-500">votes/pt</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">🎤 Public Rallies:</span>
            <input
              type="number"
              min="5"
              max="500"
              value={rallyYieldPerPoint}
              onChange={(e) => setRallyYieldPerPoint(Math.max(1, Number(e.target.value) || 0))}
              className="w-14 px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-xs text-purple-700 text-right focus:outline-hidden focus:ring-1 focus:ring-purple-500"
            />
            <span className="text-[10px] text-slate-500">votes/pt</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-[11px]">🤝 Door-to-Door / Welfare:</span>
            <input
              type="number"
              min="5"
              max="500"
              value={welfareYieldPerPoint}
              onChange={(e) => setWelfareYieldPerPoint(Math.max(1, Number(e.target.value) || 0))}
              className="w-14 px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-xs text-amber-700 text-right focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
            <span className="text-[10px] text-slate-500">votes/pt</span>
          </div>
        </div>
      </div>
    </div>
  );
};
