import React from 'react';
import { Sliders, Sparkles, CheckCircle, Target } from 'lucide-react';
import type { PannaMobilizationResult } from '../../services/boothSolverEngine';

interface BoothMobilizationSimulatorProps {
  pannaConversionTarget: number;
  setPannaConversionTarget: (val: number) => void;
  turnoutPushPct: number;
  setTurnoutPushPct: (val: number) => void;
  totalBooths: number;
  actualMargin: number;
  targetParty: string;
  targetIsWinner: boolean;
  simulatedImpact: PannaMobilizationResult;
}

export const BoothMobilizationSimulator: React.FC<BoothMobilizationSimulatorProps> = ({
  pannaConversionTarget,
  setPannaConversionTarget,
  turnoutPushPct,
  setTurnoutPushPct,
  totalBooths,
  actualMargin,
  targetParty,
  targetIsWinner,
  simulatedImpact,
}) => {
  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Panna Pramukh Field Mobilization Simulator
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          Adjust booth-level voter conversion and turnout drives
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lever 1: Panna Undecided Conversion Target */}
        <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 font-medium">
              Voters Converted per Polling Station:
            </span>
            <span className="font-mono font-black text-emerald-700 text-sm">
              +{pannaConversionTarget} voters / booth
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="25"
            step="1"
            value={pannaConversionTarget}
            onChange={(e) => setPannaConversionTarget(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0 (Passive)</span>
            <span>12 (~1 voter/page)</span>
            <span>25 (Full Saturation)</span>
          </div>

          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-mono">
            Yield: <strong className="text-slate-900">+{simulatedImpact.directPersuasionGain.toLocaleString()} votes</strong> across {totalBooths} booths
          </div>
        </div>

        {/* Lever 2: Turnout Push among Committed Supporters */}
        <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-700 font-medium">
              Target Voter Turnout Mobilization Push:
            </span>
            <span className="font-mono font-black text-indigo-700 text-sm">
              +{turnoutPushPct}% turnout lift
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="6"
            step="0.5"
            value={turnoutPushPct}
            onChange={(e) => setTurnoutPushPct(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>0% (Baseline Turnout)</span>
            <span>+3.0% (Mandal Push)</span>
            <span>+6.0% (Hyper-Mobilization)</span>
          </div>

          <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 font-mono">
            Yield: <strong className="text-slate-900">+{simulatedImpact.turnoutExtraVotes.toLocaleString()} extra votes</strong> pulled to booths
          </div>
        </div>
      </div>

      {/* Live Simulation Outcome Banner */}
      <div
        className={`p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3 transition-all ${
          simulatedImpact.isFlipped
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs'
            : targetIsWinner
            ? 'bg-indigo-50 border-indigo-300 text-indigo-950 shadow-xs'
            : 'bg-amber-50/90 border-amber-300 text-amber-950 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {simulatedImpact.isFlipped ? (
            <Sparkles className="w-6 h-6 text-emerald-600 shrink-0 animate-bounce" />
          ) : targetIsWinner ? (
            <CheckCircle className="w-5 h-5 text-indigo-600 shrink-0" />
          ) : (
            <Target className="w-5 h-5 text-amber-600 shrink-0" />
          )}
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-slate-900">
              {simulatedImpact.isFlipped
                ? `🎉 SEAT FLIPPED TO ${targetParty}!`
                : targetIsWinner
                ? `🛡️ ${targetParty} DEFENSE FORTIFIED`
                : `⚠️ STILL SHORT BY ${Math.abs(simulatedImpact.projectedNewMargin).toLocaleString()} VOTES`}
            </div>
            <p className="text-[11px] text-slate-700 opacity-90">
              {simulatedImpact.isFlipped
                ? `By delivering +${pannaConversionTarget} voters per booth and +${turnoutPushPct}% turnout, ${targetParty} overturns the ${actualMargin.toLocaleString()} deficit to win by ${simulatedImpact.projectedNewMargin.toLocaleString()} votes!`
                : targetIsWinner
                ? `Panna mobilization expands ${targetParty}'s lead from ${actualMargin.toLocaleString()} to ${simulatedImpact.projectedNewMargin.toLocaleString()} votes.`
                : `Need an extra +${Math.ceil(Math.abs(simulatedImpact.projectedNewMargin) / totalBooths)} votes per booth to cross the finish line.`}
            </p>
          </div>
        </div>

        <div className="text-right font-mono">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Votes Mobilized</div>
          <div className="text-xl font-black text-slate-900">
            +{simulatedImpact.totalSimulatedGain.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};
