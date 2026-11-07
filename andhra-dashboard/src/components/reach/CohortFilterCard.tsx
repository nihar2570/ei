import React, { useState } from 'react';
import type { CasteKey, AgeKey, CampaignParty, CohortPersuadability } from '../../types/voterReach';
import { CASTE_METAS, AGE_METAS } from './voterReachData';
import { Users, Filter, CheckCircle2, AlertCircle, HelpCircle, Flame, Globe2 } from 'lucide-react';

interface CohortFilterCardProps {
  party: CampaignParty;
  onSelectParty: (party: CampaignParty) => void;
  selectedCaste: CasteKey;
  onSelectCaste: (caste: CasteKey) => void;
  selectedAge: AgeKey;
  onSelectAge: (age: AgeKey) => void;
  persuadability: CohortPersuadability;
  totalElectors: number;
  castePct: number;
  agePct: number;
  allCastePcts: Record<CasteKey, number>;
  allAgePcts: Record<AgeKey, number>;
}

export const CohortFilterCard: React.FC<CohortFilterCardProps> = ({
  party,
  onSelectParty,
  selectedCaste,
  onSelectCaste,
  selectedAge,
  onSelectAge,
  persuadability,
  totalElectors,
  castePct,
  agePct,
  allCastePcts,
  allAgePcts,
}) => {
  const [casteCategoryFilter, setCasteCategoryFilter] = useState<string>('ALL');

  // Statewide voter pool
  const baseElectors = totalElectors || 40500000;
  const totalCohortVoters = Math.round(baseElectors * (castePct / 100) * (agePct / 100));

  // Dynamic automatic voter counts
  const baseVotersCount = Math.round(totalCohortVoters * (persuadability.basePct / 100));
  const swingVotersCount = Math.round(totalCohortVoters * (persuadability.swingPct / 100));
  const oppositionVotersCount = Math.round(totalCohortVoters * (persuadability.oppositionPct / 100));

  const casteCategories = ['ALL', 'BC', 'OC', 'SC', 'ST', 'Minority'];
  const casteList = Object.values(CASTE_METAS).filter(
    (c) => casteCategoryFilter === 'ALL' || c.category === casteCategoryFilter
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-6">
      {/* Step 1: Who are you campaigning for? (Party Perspective) */}
      <div
        id="reach-party"
        className="bg-slate-50 p-4 rounded-xl border border-slate-200/90 flex flex-wrap items-center justify-between gap-4 scroll-mt-24"
      >
        <div className="space-y-0.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            Step 1: Choose Your Campaign Party
          </span>
          <div className="text-sm font-bold text-slate-900">
            Who are you building this statewide voter outreach strategy for?
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* TDP + JSP + BJP Alliance */}
          <button
            onClick={() => onSelectParty('TDP_JSP')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              party === 'TDP_JSP'
                ? 'bg-amber-400 text-slate-900 shadow-md ring-2 ring-amber-500/50 scale-102'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>TDP + JanaSena + BJP Alliance</span>
          </button>

          {/* YSRCP */}
          <button
            onClick={() => onSelectParty('YSRCP')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              party === 'YSRCP'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-700/50 scale-102'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            <span>YSRCP</span>
          </button>
        </div>
      </div>

      {/* Step 2: Select Caste & Age Cohort */}
      <div id="reach-cohort" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start scroll-mt-24">
        {/* Left: Community / Caste (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              Step 2A: Pick Community / Caste
            </label>
            <span className="text-[11px] font-bold text-slate-500">
              Showing statewide % in each card
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-1">
            {casteCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCasteCategoryFilter(cat)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  casteCategoryFilter === cat
                    ? 'bg-slate-900 text-white font-black'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Caste grid: Showing all castes directly with their % of population in each card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {casteList.map((caste) => {
              const isSelected = selectedCaste === caste.key;
              const pct = allCastePcts[caste.key] ?? 0;
              return (
                <button
                  key={caste.key}
                  onClick={() => onSelectCaste(caste.key)}
                  className={`text-left px-2.5 py-2 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-950 font-black shadow-xs'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: caste.color }}
                    />
                    <span className="text-xs font-bold truncate">{caste.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Population Percentage in the card */}
                    <span className={`text-[11px] font-mono font-black px-1.5 py-0.2 rounded border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-700'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
                    }`}>
                      {pct}%
                    </span>
                    <span className="text-[8.5px] font-extrabold uppercase px-1 py-0.2 rounded bg-white border border-slate-200 text-slate-500">
                      {caste.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Age Bracket (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-indigo-600" />
              Step 2B: Pick Age Bracket
            </label>
            <span className="text-[11px] font-bold text-slate-500">
              Statewide age %
            </span>
          </div>

          <div className="space-y-2">
            {(Object.keys(AGE_METAS) as AgeKey[]).map((key) => {
              const meta = AGE_METAS[key];
              const isSelected = selectedAge === key;
              const pct = allAgePcts[key] ?? 0;
              return (
                <button
                  key={key}
                  onClick={() => onSelectAge(key)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-50/90 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-950 font-black shadow-xs'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold flex items-center gap-1.5">
                      <span>{meta.icon}</span>
                      <span>{meta.label}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Age Population Percentage in the card */}
                      <span className={`text-[11px] font-mono font-black px-2 py-0.5 rounded border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-700'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200/80'
                      }`}>
                        {pct}%
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {meta.range}
                      </span>
                    </div>
                  </div>
                  <div className="text-[10.5px] text-slate-500 mt-1 truncate">
                    {meta.focus}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Step 3: AUTOMATED REAL-WORLD PERSUADABILITY VERDICT (STATEWIDE) */}
      <div
        id="reach-verdict"
        className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 space-y-5 shadow-md scroll-mt-24"
      >
        {/* Top Header of the Verdict */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              Automated Poll Strategist Assessment ({party === 'TDP_JSP' ? 'TDP-JSP Perspective' : 'YSRCP Perspective'})
            </span>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <span>{CASTE_METAS[selectedCaste]?.name} ({AGE_METAS[selectedAge]?.range})</span>
            </h3>
          </div>

          {/* Statewide Indicator Badge */}
          <div className="flex items-center gap-1.5 bg-indigo-950/80 text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-700/50 text-xs font-bold">
            <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Statewide Model (All 175 ACs)</span>
          </div>
        </div>

        {/* 3 Persuadability Metric Tiles (Base / Swing / Opposition) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 1. Base Loyalists */}
          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-emerald-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Statewide Base
              </span>
              <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-700/40">
                {persuadability.basePct}%
              </span>
            </div>
            <div className="text-xl font-black text-white">
              {baseVotersCount.toLocaleString()}
            </div>
            <p className="text-[10.5px] text-slate-300">
              Committed loyalists. Focus on GOTV turnout across all 175 ACs.
            </p>
          </div>

          {/* 2. Swing Persuadables (THE PRIZE) */}
          <div className="bg-amber-500/10 p-3.5 rounded-xl border-2 border-amber-500/60 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                Battleground Swing
              </span>
              <span className="text-xs font-mono font-black text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/50">
                {persuadability.swingPct}%
              </span>
            </div>
            <div className="text-2xl font-black text-amber-300 flex items-baseline gap-1.5">
              <span>{swingVotersCount.toLocaleString()}</span>
              <span className="text-xs font-medium text-amber-200">Swing Voters to Win</span>
            </div>
            <p className="text-[10.5px] text-amber-100 font-medium">
              ★ <strong>Decisive statewide swing universe.</strong> Target these voters with 5–10 touches.
            </p>
          </div>

          {/* 3. Opposition Core */}
          <div className="bg-slate-800/70 p-3.5 rounded-xl border border-rose-500/30 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Opposition Core
              </span>
              <span className="text-xs font-mono font-black text-rose-400 bg-rose-950/60 px-1.5 py-0.2 rounded border border-rose-700/40">
                {persuadability.oppositionPct}%
              </span>
            </div>
            <div className="text-xl font-black text-white">
              {oppositionVotersCount.toLocaleString()}
            </div>
            <p className="text-[10.5px] text-slate-300">
              Hostile core. Conserve resources; do not waste positive ad spend.
            </p>
          </div>
        </div>

        {/* Visual Stacked Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800 border border-slate-700">
            <div
              style={{ width: `${persuadability.basePct}%` }}
              className="bg-emerald-500 h-full transition-all duration-300"
              title={`Base: ${persuadability.basePct}%`}
            />
            <div
              style={{ width: `${persuadability.swingPct}%` }}
              className="bg-amber-400 h-full transition-all duration-300"
              title={`Swing: ${persuadability.swingPct}%`}
            />
            <div
              style={{ width: `${persuadability.oppositionPct}%` }}
              className="bg-rose-500 h-full transition-all duration-300"
              title={`Opposition: ${persuadability.oppositionPct}%`}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>🟢 Base: {persuadability.basePct}%</span>
            <span>🟡 Swing: {persuadability.swingPct}%</span>
            <span>🔴 Opposition: {persuadability.oppositionPct}%</span>
          </div>
        </div>

        {/* Why They Swing & How to Win Them (Plain English Strategic Diagnostic) */}
        <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700 space-y-2.5">
          <div>
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-0.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              Why This Statewide Cohort Swings:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {persuadability.whyTheySwing}
            </p>
          </div>

          <div className="pt-2 border-t border-slate-700/80">
            <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 mb-0.5">
              <span>🎯</span>
              Winning Campaign Action Plan:
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {persuadability.winningStrategy}
            </p>
          </div>

          <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-700/80 text-[11px] text-amber-200">
            <span className="font-bold text-white block text-[10px] uppercase tracking-wider mb-0.5">
              Telugu Strategy Directive (రాష్ట్ర స్థాయి ప్రచార సూత్రం):
            </span>
            "{persuadability.teluguHook}"
          </div>
        </div>
      </div>
    </div>
  );
};
