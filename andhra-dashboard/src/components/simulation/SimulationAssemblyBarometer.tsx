import React from 'react';
import { Handshake, CheckCircle, Flame } from 'lucide-react';
import type { SimulationTally } from '../../services/simulationEngine';

interface SimulationAssemblyBarometerProps {
  tally: SimulationTally;
  tossUpThreshold: number;
}

export const SimulationAssemblyBarometer: React.FC<SimulationAssemblyBarometerProps> = ({
  tally,
  tossUpThreshold,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 pt-4">
      {/* Card 1: NDA Combined Total */}
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-slate-50 p-3.5 rounded-xl border border-amber-300 shadow-xs col-span-2 sm:col-span-1">
        <div className="flex items-center justify-between text-xs text-amber-900 mb-1">
          <span className="font-black flex items-center gap-1.5 text-slate-900">
            <Handshake className="w-4 h-4 text-amber-600" />
            NDA Alliance
          </span>
          <span className="text-[10px] font-bold font-mono text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
            88 Majority
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900">{tally.ndaTotal}</span>
          <span className="text-xs">
            {tally.ndaTotal >= 88 ? (
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <CheckCircle className="w-3 h-3 text-emerald-600" /> Majority (+{tally.ndaTotal - 88})
              </span>
            ) : (
              <span className="text-rose-700 font-bold">-{88 - tally.ndaTotal} to 88</span>
            )}
          </span>
        </div>
        <div className="text-[10px] text-amber-900 font-mono mt-1 font-semibold truncate">
          TDP: {tally.counts.TDP} | JSP: {tally.counts.JSP} | BJP: {tally.counts.BJP}
        </div>
      </div>

      {/* Card 2: TDP */}
      <div className="bg-slate-50 hover:bg-amber-50/50 transition-colors p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-bold flex items-center gap-1.5 text-amber-800">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFCC00] border border-amber-400" />
            TDP
          </span>
          <span
            className={`text-[10px] font-bold font-mono ${
              tally.tdpDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {tally.tdpDiff >= 0 ? `+${tally.tdpDiff}` : tally.tdpDiff} vs 2024
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900">{tally.counts.TDP}</span>
          <span className="text-xs text-slate-500">
            {tally.counts.TDP >= 88 ? (
              <span className="text-emerald-700 font-bold">Solo Majority</span>
            ) : (
              <span>Seats</span>
            )}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 truncate">
          Kosta &amp; Seema Strongholds
        </div>
      </div>

      {/* Card 3: YSRCP */}
      <div className="bg-slate-50 hover:bg-sky-50/50 transition-colors p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-bold flex items-center gap-1.5 text-sky-800">
            <span className="w-2.5 h-2.5 rounded-full bg-[#004B87]" />
            YSRCP
          </span>
          <span
            className={`text-[10px] font-bold font-mono ${
              tally.ysrcpDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {tally.ysrcpDiff >= 0 ? `+${tally.ysrcpDiff}` : tally.ysrcpDiff} vs 2024
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900">{tally.counts.YSRCP}</span>
          <span className="text-xs text-slate-500">
            {tally.counts.YSRCP >= 88 ? (
              <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                <CheckCircle className="w-3 h-3 text-emerald-600" /> Majority
              </span>
            ) : (
              <span className="text-amber-700 font-bold">-{88 - tally.counts.YSRCP} to Maj</span>
            )}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 truncate">
          Opposition Baseline (11)
        </div>
      </div>

      {/* Card 4: JSP */}
      <div className="bg-slate-50 hover:bg-rose-50/50 transition-colors p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-bold flex items-center gap-1.5 text-rose-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E61A24]" />
            JSP
          </span>
          <span
            className={`text-[10px] font-bold font-mono ${
              tally.jspDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {tally.jspDiff >= 0 ? `+${tally.jspDiff}` : tally.jspDiff} vs 2024
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900">{tally.counts.JSP}</span>
          <span className="text-xs text-slate-500">
            {tally.counts.JSP >= 21 ? '100% Strike Base' : 'Seats'}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 truncate">
          Godavari &amp; Uttarandhra
        </div>
      </div>

      {/* Card 5: BJP */}
      <div className="bg-slate-50 hover:bg-orange-50/50 transition-colors p-3.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-bold flex items-center gap-1.5 text-orange-700">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF9933]" />
            BJP
          </span>
          <span
            className={`text-[10px] font-bold font-mono ${
              tally.bjpDiff >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {tally.bjpDiff >= 0 ? `+${tally.bjpDiff}` : tally.bjpDiff} vs 2024
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-slate-900">{tally.counts.BJP}</span>
          <span className="text-xs text-slate-500">
            {tally.counts.BJP >= 8 ? '8 Won Base' : 'Seats'}
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 truncate">
          Urban &amp; Alliance ACs
        </div>
      </div>

      {/* Card 6: Triage & Flips Alert */}
      <div className="bg-rose-50/80 hover:bg-rose-100/60 transition-colors p-3.5 rounded-xl border border-rose-200 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-rose-800 mb-1 font-semibold">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-rose-600" /> Triage Alarms
          </span>
          <span className="bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-mono text-[10px] font-bold border border-rose-200">
            {tally.flippedCount} Flips
          </span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-rose-700">{tally.tossUpCount}</span>
          <span className="text-xs text-slate-600">
            Toss-ups (&le;{' '}
            {tossUpThreshold >= 1000
              ? `${(tossUpThreshold / 1000).toFixed(1).replace('.0', '')}k`
              : tossUpThreshold}{' '}
            votes)
          </span>
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5 truncate">Targeted Interventions</div>
      </div>
    </div>
  );
};
