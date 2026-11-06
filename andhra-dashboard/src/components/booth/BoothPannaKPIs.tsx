import React from 'react';
import {
  Vote,
  TrendingUp,
  Target,
  Shield,
  Flame,
  AlertTriangle,
} from 'lucide-react';

interface BoothPannaKPIsProps {
  totalBooths: number;
  avgVotersPerBooth: number;
  avgPagesPerBooth: number;
  actualMargin: number;
  targetIsWinner: boolean;
  defenseBufferPerBooth: number;
  votesPerBoothNeeded: number;
  boothTriage: {
    fortressCount: number;
    battlegroundCount: number;
    vulnerableCount: number;
    hostileCount: number;
  };
  selectedTriageCategory: 'battleground' | 'fortress' | 'vulnerable' | 'hostile' | 'all' | null;
  onSelectTriage: (cat: 'battleground' | 'fortress' | 'vulnerable' | 'hostile' | 'all') => void;
}

export const BoothPannaKPIs: React.FC<BoothPannaKPIsProps> = ({
  totalBooths,
  avgVotersPerBooth,
  avgPagesPerBooth,
  actualMargin,
  targetIsWinner,
  defenseBufferPerBooth,
  votesPerBoothNeeded,
  boothTriage,
  selectedTriageCategory,
  onSelectTriage,
}) => {
  return (
    <div className="space-y-3.5">
      {/* Compact KPI Cards: Polling Stations, Deficit, & Votes-per-Booth */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Total Polling Stations */}
        <div className="bg-slate-50 py-2.5 px-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <Vote className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">Total Polling Stations</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono leading-none my-1">
            {totalBooths}
          </div>
          <div className="text-[10px] text-slate-500 font-mono truncate">
            ~{avgVotersPerBooth} electors &middot; ~{avgPagesPerBooth} pages
          </div>
        </div>

        {/* 2023 Actual Margin */}
        <div className="bg-slate-50 py-2.5 px-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <TrendingUp className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">2023 Margin Gap</span>
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono leading-none my-1">
            {actualMargin.toLocaleString()}
          </div>
          <div className="text-[10px] truncate">
            {targetIsWinner ? (
              <span className="text-emerald-700 font-bold">Defending Incumbent Lead</span>
            ) : (
              <span className="text-rose-700 font-bold">Challenger Net Deficit</span>
            )}
          </div>
        </div>

        {/* Highlight Card: Compact Votes-per-Booth Target Metric */}
        <div
          className={`py-2 px-3.5 rounded-xl border col-span-2 sm:col-span-2 shadow-xs flex flex-col justify-between ${
            targetIsWinner
              ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 border-emerald-300'
              : 'bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Target className={`w-3.5 h-3.5 ${targetIsWinner ? 'text-emerald-600' : 'text-rose-600'}`} />
              <span>{targetIsWinner ? 'Constituency Defense Buffer' : 'Panna Pramukh Flip Target'}</span>
            </div>
            <span
              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                targetIsWinner
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-rose-100 text-rose-800 border-rose-300'
              }`}
            >
              {targetIsWinner ? 'DEFENSE ACTIVE' : 'FLIP ROADMAP'}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-3 mt-1">
            <div className="flex items-baseline gap-1.5 shrink-0">
              <span className="text-2xl font-black text-slate-900 font-mono leading-none">
                {targetIsWinner ? `+${defenseBufferPerBooth}` : `+${votesPerBoothNeeded}`}
              </span>
              <span className="text-xs font-semibold text-slate-600">votes / booth</span>
            </div>
            <p className="text-[11px] text-slate-600 truncate text-right">
              {targetIsWinner
                ? `Comfortable buffer of +${defenseBufferPerBooth} votes ahead across all ${totalBooths} booths`
                : `Flipping ~${votesPerBoothNeeded} undecided voters per booth wins constituency!`}
            </p>
          </div>
        </div>
      </div>

      {/* Form-20 Booth Triage Segmentation (Interactive Cards) */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
            Form-20 Booth Triage Matrix (Click Category to View Booth Names)
          </span>
          <span className="text-[11px] text-slate-500">
            Click any category below to inspect individual polling station names
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
          {/* 1. Fortress Booths */}
          <button
            type="button"
            onClick={() => onSelectTriage('fortress')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedTriageCategory === 'fortress'
                ? 'bg-emerald-100/80 border-emerald-500 ring-2 ring-emerald-400 shadow-sm'
                : 'bg-white border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-emerald-600" /> 1. Fortress Booths
              </span>
              <span className="font-mono font-black text-slate-900">{boothTriage.fortressCount}</span>
            </div>
            <div className="text-[10px] text-slate-500">&gt;60% Loyal Vote Share</div>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200 text-slate-600">
              <span className="text-emerald-700 font-semibold">100% GOTV transport</span>
              <span className="text-[10px] text-indigo-600 font-medium">
                {selectedTriageCategory === 'fortress' ? 'Viewing ▼' : 'View →'}
              </span>
            </div>
          </button>

          {/* 2. Battleground / Swing Booths */}
          <button
            type="button"
            onClick={() => onSelectTriage('battleground')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedTriageCategory === 'battleground'
                ? 'bg-amber-100/80 border-amber-500 ring-2 ring-amber-400 shadow-sm'
                : 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-amber-800 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-600" /> 2. Battleground Booths
              </span>
              <span className="font-mono font-black text-slate-900">{boothTriage.battlegroundCount}</span>
            </div>
            <div className="text-[10px] text-amber-700 font-semibold">&le; 45 votes margin (Priority 1)</div>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200 text-slate-600">
              <span className="text-amber-800 font-semibold">Panna Saturation Target</span>
              <span className="text-[10px] text-amber-700 font-bold">
                {selectedTriageCategory === 'battleground' ? 'Viewing ▼' : 'View →'}
              </span>
            </div>
          </button>

          {/* 3. Vulnerable / Thin Lead Booths */}
          <button
            type="button"
            onClick={() => onSelectTriage('vulnerable')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedTriageCategory === 'vulnerable'
                ? 'bg-yellow-100/80 border-yellow-500 ring-2 ring-yellow-400 shadow-sm'
                : 'bg-white border-slate-200 hover:border-yellow-400 hover:bg-yellow-50/50 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-yellow-800 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" /> 3. Vulnerable Holds
              </span>
              <span className="font-mono font-black text-slate-900">{boothTriage.vulnerableCount}</span>
            </div>
            <div className="text-[10px] text-slate-500">Thin leads (1–40 votes)</div>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200 text-slate-600">
              <span className="text-yellow-700">Grievance Redressal</span>
              <span className="text-[10px] text-indigo-600 font-medium">
                {selectedTriageCategory === 'vulnerable' ? 'Viewing ▼' : 'View →'}
              </span>
            </div>
          </button>

          {/* 4. Hostile Booths */}
          <button
            type="button"
            onClick={() => onSelectTriage('hostile')}
            className={`p-3 rounded-lg border text-left transition-all cursor-pointer space-y-1.5 ${
              selectedTriageCategory === 'hostile'
                ? 'bg-rose-100/80 border-rose-500 ring-2 ring-rose-400 shadow-sm'
                : 'bg-white border-slate-200 hover:border-rose-400 hover:bg-rose-50/50 shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-rose-800 flex items-center gap-1">
                🛑 4. Hostile Fortresses
              </span>
              <span className="font-mono font-black text-slate-900">{boothTriage.hostileCount}</span>
            </div>
            <div className="text-[10px] text-slate-500">&gt;60% Opponent Dominance</div>
            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200 text-slate-600">
              <span className="text-rose-700">EVM Vigilance</span>
              <span className="text-[10px] text-indigo-600 font-medium">
                {selectedTriageCategory === 'hostile' ? 'Viewing ▼' : 'View →'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
