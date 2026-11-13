import React from 'react';
import {
  Vote,
  TrendingUp,
  Flame,
  Shield,
} from 'lucide-react';

interface BoothPannaKPIsProps {
  totalBooths: number;
  totalMandals: number;
  avgVotersPerBooth: number;
  actualMargin: number;
  targetIsWinner: boolean;
  targetParty: string;
  battlegroundCount: number;
  strongholdCount: number;
}

export const BoothPannaKPIs: React.FC<BoothPannaKPIsProps> = ({
  totalBooths,
  totalMandals,
  avgVotersPerBooth,
  actualMargin,
  targetIsWinner,
  targetParty,
  battlegroundCount,
  strongholdCount,
}) => {
  const avgMarginPerBooth = Math.round(actualMargin / Math.max(1, totalBooths));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
      {/* 1. Total Polling Stations */}
      <div className="bg-slate-50 py-2.5 px-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
          <Vote className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="truncate">Total Polling Stations</span>
        </div>
        <div className="text-2xl font-black text-slate-900 font-mono leading-none my-1">
          {totalBooths}
        </div>
        <div className="text-[10px] text-slate-500 font-mono truncate">
          ~{avgVotersPerBooth} electors &middot; {totalMandals} Mandals
        </div>
      </div>

      {/* 2. 2024 Actual Margin Gap */}
      <div className="bg-slate-50 py-2.5 px-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
          <TrendingUp className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span className="truncate">2024 Margin Gap</span>
        </div>
        <div className="text-2xl font-black text-slate-900 font-mono leading-none my-1">
          {actualMargin.toLocaleString()}
        </div>
        <div className="text-[10px] truncate">
          {targetIsWinner ? (
            <span className="text-emerald-700 font-bold">{targetParty} Defending Lead (+{avgMarginPerBooth}/PS)</span>
          ) : (
            <span className="text-rose-700 font-bold">{targetParty} Net Deficit (-{avgMarginPerBooth}/PS)</span>
          )}
        </div>
      </div>

      {/* 3. Razor-Thin Battleground Stations */}
      <div className="bg-slate-50 py-2.5 px-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
          <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="truncate">Swing Battlegrounds</span>
        </div>
        <div className="text-2xl font-black text-amber-600 font-mono leading-none my-1">
          {battlegroundCount}
        </div>
        <div className="text-[10px] text-amber-700 font-medium truncate">
          Decided by &le;45 votes &middot; Prime swing turf
        </div>
      </div>

      {/* 4. Stronghold Stations */}
      <div className="bg-slate-50 py-2.5 px-3 rounded-xl border border-slate-200 shadow-2xs flex flex-col justify-between">
        <div className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
          <Shield className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">{targetParty} Strongholds</span>
        </div>
        <div className="text-2xl font-black text-emerald-700 font-mono leading-none my-1">
          {strongholdCount}
        </div>
        <div className="text-[10px] text-emerald-700 font-medium truncate">
          &gt;60% safe vote share &middot; Base mobilization
        </div>
      </div>
    </div>
  );
};
