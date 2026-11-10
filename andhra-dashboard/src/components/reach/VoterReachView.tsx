import React, { useState, useMemo } from 'react';
import type { DemographicsDataset } from '../../types';
import type { CasteKey, AgeKey, IssueKey, CampaignParty } from '../../types/voterReach';
import {
  CASTE_METAS,
  AGE_METAS,
  ISSUES_METAS,
  calculateCohortIssueWeights,
  calculateCohortPersuadability,
} from './voterReachData';
import { CohortFilterCard } from './CohortFilterCard';
import { IssueSalienceMatrix } from './IssueSalienceMatrix';
import { MultiTouchCadencePlanner } from './MultiTouchCadencePlanner';
import { FloatingSideNav } from './FloatingSideNav';
import { RedPillEmotionalMatrix } from './RedPillEmotionalMatrix';
import { Megaphone, Globe2 } from 'lucide-react';

interface VoterReachViewProps {
  demographicsData: DemographicsDataset;
  selectedAcNo?: number | null;
  onSelectAc?: (acNo: number) => void;
  allConstituencies?: { ac_no: number; ac_name: string; district: string }[];
}

export const VoterReachView: React.FC<VoterReachViewProps> = ({
  demographicsData,
  onSelectAc,
}) => {
  // Strategy Route Mode: 'blue_pill' (Advertising & Demographics) vs 'red_pill' (Moral Taboos & Kinship Ruptures)
  const [activeRouteTab, setActiveRouteTab] = useState<'blue_pill' | 'red_pill'>('blue_pill');

  // Targeting States (Blue Pill)
  const [party, setParty] = useState<CampaignParty>('TDP_JSP');
  const [selectedCaste, setSelectedCaste] = useState<CasteKey>('kapu');
  const [selectedAge, setSelectedAge] = useState<AgeKey>('youth_18_25');
  const [selectedIssue, setSelectedIssue] = useState<IssueKey>('jobs_fdi');

  // Targeting Scope: 'ALL' (Statewide) or specific AC number - defaults to statewide always
  const [scopeAcNo, setScopeAcNo] = useState<number | 'ALL'>('ALL');

  const acList = useMemo(() => {
    if (!demographicsData?.constituencies) return [];
    return Object.values(demographicsData.constituencies).sort((a, b) => a.ac_no - b.ac_no);
  }, [demographicsData]);

  const activeConstituency = useMemo(() => {
    if (scopeAcNo === 'ALL') return null;
    return demographicsData?.constituencies?.[String(scopeAcNo)] || null;
  }, [scopeAcNo, demographicsData]);

  // Compute live weighted statewide demographic percentages for ALL castes and ALL ages across all 175 constituencies
  const { totalStateElectors, allCastePcts, allAgePcts } = useMemo(() => {
    const list = Object.values(demographicsData.constituencies || {});
    let totalE = 0;
    const casteSums: Record<string, number> = {};
    const ageSums: Record<string, number> = {};

    list.forEach((c) => {
      const electors = c.total_electors || 231400;
      totalE += electors;
      if (c.caste_profile) {
        Object.entries(c.caste_profile).forEach(([k, v]) => {
          if (typeof v === 'number') {
            casteSums[k] = (casteSums[k] || 0) + electors * (v / 100);
          }
        });
      }
      if (c.age_profile) {
        Object.entries(c.age_profile).forEach(([k, v]) => {
          if (typeof v === 'number') {
            ageSums[k] = (ageSums[k] || 0) + electors * (v / 100);
          }
        });
      }
    });

    const finalElectors = totalE > 0 ? totalE : 40500000;
    const cPcts: Record<CasteKey, number> = {} as any;
    const aPcts: Record<AgeKey, number> = {} as any;

    (Object.keys(CASTE_METAS) as CasteKey[]).forEach((k) => {
      cPcts[k] = totalE > 0 && casteSums[k] ? Number(((casteSums[k] / totalE) * 100).toFixed(1)) : 8.0;
    });

    const defaultAgePcts: Record<AgeKey, number> = {
      youth_18_25: 14.8,
      age_26_40: 34.2,
      age_41_60: 32.5,
      age_60_plus: 18.5,
    };

    (Object.keys(AGE_METAS) as AgeKey[]).forEach((k) => {
      aPcts[k] = totalE > 0 && ageSums[k] ? Number(((ageSums[k] / totalE) * 100).toFixed(1)) : defaultAgePcts[k];
    });

    return {
      totalStateElectors: finalElectors,
      allCastePcts: cPcts,
      allAgePcts: aPcts,
    };
  }, [demographicsData]);

  // Active scope electors and demographic distributions
  const activeScopeElectors = useMemo(() => {
    if (scopeAcNo === 'ALL' || !activeConstituency) {
      return totalStateElectors;
    }
    return activeConstituency.total_electors || 231400;
  }, [scopeAcNo, activeConstituency, totalStateElectors]);

  const activeCastePcts = useMemo((): Record<CasteKey, number> => {
    if (scopeAcNo === 'ALL' || !activeConstituency?.caste_profile) {
      return allCastePcts;
    }
    const prof = activeConstituency.caste_profile as any;
    const res: Record<CasteKey, number> = { ...allCastePcts };
    (Object.keys(CASTE_METAS) as CasteKey[]).forEach((k) => {
      if (typeof prof[k] === 'number') {
        res[k] = prof[k];
      }
    });
    return res;
  }, [scopeAcNo, activeConstituency, allCastePcts]);

  const activeAgePcts = useMemo((): Record<AgeKey, number> => {
    if (scopeAcNo === 'ALL' || !activeConstituency?.age_profile) {
      return allAgePcts;
    }
    const prof = activeConstituency.age_profile as any;
    const res: Record<AgeKey, number> = { ...allAgePcts };
    (Object.keys(AGE_METAS) as AgeKey[]).forEach((k) => {
      if (typeof prof[k] === 'number') {
        res[k] = prof[k];
      }
    });
    return res;
  }, [scopeAcNo, activeConstituency, allAgePcts]);

  const castePct = activeCastePcts[selectedCaste] || 15.0;
  const agePct = activeAgePcts[selectedAge] || 22.0;

  // Real-world automatic persuadability verdict (Statewide / AC Model)
  const persuadability = useMemo(() => {
    return calculateCohortPersuadability(party, selectedCaste, selectedAge);
  }, [party, selectedCaste, selectedAge]);

  // Compute weighted issue impact % for this cohort
  const issueWeights = useMemo(() => {
    return calculateCohortIssueWeights(selectedCaste, selectedAge);
  }, [selectedCaste, selectedAge]);

  // Top issue for this cohort
  const topIssueKey = useMemo(() => {
    return (Object.keys(issueWeights) as IssueKey[]).reduce((prev, curr) =>
      issueWeights[curr] > issueWeights[prev] ? curr : prev
    );
  }, [issueWeights]);

  // Audience calculations for current scope
  const totalCohortVoters = Math.round(activeScopeElectors * (castePct / 100) * (agePct / 100));
  const swingTargetVoters = Math.round(totalCohortVoters * (persuadability.swingPct / 100));

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Floating Vertical Section Navigation */}
      <FloatingSideNav activeRoute={activeRouteTab} />

      {/* Hero Executive Banner with Scope Switcher */}
      <div
        id="reach-overview"
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white border border-slate-800 shadow-md relative overflow-hidden scroll-mt-24"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 flex-1 min-w-0 pr-0 lg:pr-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                {activeConstituency ? (
                  <span>AC #{activeConstituency.ac_no} {activeConstituency.ac_name} &middot; {activeConstituency.district} District</span>
                ) : (
                  <span>Statewide Andhra Pradesh • All 175 Assembly Segments</span>
                )}
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                &middot; {activeScopeElectors.toLocaleString()} Voters
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Megaphone className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 shrink-0" />
              {activeConstituency ? (
                <span>{activeConstituency.ac_name} Voter Reach &amp; Micro-Targeting Playbook</span>
              ) : (
                <span>Statewide Voter Reach &amp; 5–10 Touch Campaign Playbook</span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {activeConstituency ? (
                <>Micro-target voting blocs in <strong>{activeConstituency.ac_name}</strong> by caste and age cohort. Calibrate door-to-door, digital, and ground cadre touchpoints to mobilize the decisive swing vote.</>
              ) : (
                <>Target voting blocs statewide by caste community and age bracket across all 175 constituencies. Analyze quantitative grievance impact weights and budget a multi-channel campaign to convert the decisive swing vote.</>
              )}
            </p>
          </div>

          {/* Clean Scope Selector & Electorate Metric Card (Side-by-side on right) */}
          <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
            <div className="bg-slate-800/90 px-3 py-2 rounded-xl border border-slate-700/80 space-y-1">
              <label htmlFor="reach-scope-select" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Targeting Scope:
              </label>
              <select
                id="reach-scope-select"
                value={scopeAcNo}
                onChange={(e) => {
                  const val = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value);
                  setScopeAcNo(val);
                  if (val !== 'ALL' && onSelectAc) onSelectAc(val);
                }}
                className="bg-slate-900 border border-slate-600 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-400 cursor-pointer"
              >
                <option value="ALL">🌏 Statewide (All 175 ACs)</option>
                <optgroup label="Select Constituency (AC 1–175)">
                  {acList.map((ac) => (
                    <option key={ac.ac_no} value={ac.ac_no}>
                      #{ac.ac_no} {ac.ac_name} ({ac.district})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="bg-slate-800/90 px-3.5 py-2 rounded-xl border border-slate-700/80 space-y-0.5 text-right shrink-0 min-w-[130px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {activeConstituency ? 'Constituency Electorate' : 'Statewide Electorate'}
              </span>
              <div className="text-base sm:text-lg font-black text-white font-mono leading-tight">
                {activeScopeElectors.toLocaleString()}
              </div>
              <span className="text-[10px] font-semibold text-emerald-400 block truncate max-w-[150px]">
                {activeConstituency ? `${activeConstituency.ac_name} #${activeConstituency.ac_no}` : '175 Constituencies'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Dual-Pill Route Switcher */}
      <div
        id="reach-routes"
        className="flex flex-wrap items-center gap-2 bg-white p-1.5 sm:p-2 rounded-2xl border border-slate-200/90 shadow-2xs scroll-mt-24"
      >
        {/* Blue Pill Route */}
        <button
          type="button"
          onClick={() => setActiveRouteTab('blue_pill')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeRouteTab === 'blue_pill'
              ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-xs ring-2 ring-blue-500/20 font-black'
              : 'bg-slate-50 text-slate-700 hover:text-blue-700 hover:bg-blue-50/60 border border-slate-200'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${activeRouteTab === 'blue_pill' ? 'bg-blue-300' : 'bg-blue-500'}`} />
          <span>🔵 Blue Pill: Demographic Reach &amp; Ad Cadence</span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border hidden sm:inline ${
              activeRouteTab === 'blue_pill'
                ? 'bg-blue-900/40 text-blue-100 border-blue-400/30'
                : 'bg-slate-200/70 text-slate-600 border-slate-300/80'
            }`}
          >
            Caste &middot; Age &middot; 5–10 Touch
          </span>
        </button>

        {/* Red Pill Route */}
        <button
          type="button"
          onClick={() => setActiveRouteTab('red_pill')}
          className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeRouteTab === 'red_pill'
              ? 'bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 text-white shadow-xs ring-2 ring-rose-500/20 font-black'
              : 'bg-slate-50 text-slate-700 hover:text-rose-700 hover:bg-rose-50/60 border border-slate-200'
          }`}
        >
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${activeRouteTab === 'red_pill' ? 'bg-rose-300' : 'bg-rose-500'}`} />
          <span>🔴 Red Pill: Moral Rupture &amp; Visceral Taboos</span>
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              activeRouteTab === 'red_pill'
                ? 'bg-rose-900/40 text-rose-100 border-rose-400/30'
                : 'bg-rose-100/70 text-rose-700 border-rose-200'
            }`}
          >
            7 Sacred Taboos &middot; 1,000 Triggers
          </span>
        </button>
      </div>

      {/* Conditionally Render Routes */}
      {activeRouteTab === 'blue_pill' ? (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Module 1: Cohort Targeting & Automatic Persuadability Verdict */}
          <CohortFilterCard
            party={party}
            onSelectParty={setParty}
            selectedCaste={selectedCaste}
            onSelectCaste={setSelectedCaste}
            selectedAge={selectedAge}
            onSelectAge={setSelectedAge}
            persuadability={persuadability}
            totalElectors={activeScopeElectors}
            castePct={castePct}
            agePct={agePct}
            allCastePcts={activeCastePcts}
            allAgePcts={activeAgePcts}
            isStatewide={scopeAcNo === 'ALL'}
            scopeLabel={activeConstituency ? `AC #${activeConstituency.ac_no} ${activeConstituency.ac_name}` : 'Statewide'}
          />

          {/* Module 2: Issue Salience & Grievance Weights */}
          <IssueSalienceMatrix
            issueWeights={issueWeights}
            selectedIssue={selectedIssue}
            onSelectIssue={setSelectedIssue}
            targetParty={party === 'TDP_JSP' ? 'TDP' : 'YSRCP'}
          />

          {/* Module 3: 5–10 Touch Multi-Channel Ad Cadence Planner (Statewide Universe) */}
          <MultiTouchCadencePlanner
            selectedTier="mid"
            targetVotersCount={swingTargetVoters}
            casteName={CASTE_METAS[selectedCaste]?.name || selectedCaste}
            ageLabel={AGE_METAS[selectedAge]?.label || selectedAge}
            topIssueTitle={ISSUES_METAS[topIssueKey]?.title || 'Key Grievance'}
          />
        </div>
      ) : (
        <RedPillEmotionalMatrix
          demographicsData={demographicsData}
          selectedAcNo={scopeAcNo === 'ALL' ? null : scopeAcNo}
          onSelectAc={(acNo) => {
            setScopeAcNo(acNo);
            if (onSelectAc) onSelectAc(acNo);
          }}
        />
      )}
    </div>
  );
};

export default VoterReachView;
