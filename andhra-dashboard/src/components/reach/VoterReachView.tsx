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
  // Targeting States
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
      <FloatingSideNav />

      {/* Hero Executive Banner with Scope Switcher */}
      <div
        id="reach-overview"
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 sm:p-6 text-white border border-slate-800 shadow-md relative overflow-hidden scroll-mt-24"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
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
                &middot; {activeConstituency ? `${activeScopeElectors.toLocaleString()} Registered Voters` : '~40.5M Voters'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-400 shrink-0" />
              {activeConstituency ? (
                <span>{activeConstituency.ac_name} Voter Reach &amp; Micro-Targeting Playbook</span>
              ) : (
                <span>Statewide Voter Reach &amp; 5–10 Touch Campaign Playbook</span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeConstituency ? (
                <>Micro-target voting blocs in <strong>{activeConstituency.ac_name}</strong> by caste and age cohort. Calibrate door-to-door, digital, and ground cadre touchpoints to mobilize the decisive swing vote.</>
              ) : (
                <>Target voting blocs statewide by caste community and age bracket across all 175 constituencies. Analyze quantitative grievance impact weights and budget a multi-channel campaign to convert the decisive swing vote.</>
              )}
            </p>
          </div>

          {/* Clean Scope Selector & Electorate Metric Card */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2.5 shrink-0">
            <div className="bg-slate-800/90 p-2 rounded-xl border border-slate-700 space-y-1">
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

            <div className="bg-slate-800/90 px-4 py-2.5 rounded-xl border border-slate-700 space-y-0.5 text-right shrink-0 min-w-[140px]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {activeConstituency ? 'Constituency Electorate' : 'Statewide Electorate'}
              </span>
              <div className="text-lg font-black text-white font-mono">
                {activeScopeElectors.toLocaleString()}
              </div>
              <span className="text-[10.5px] font-semibold text-emerald-400 block">
                {activeConstituency ? `${activeConstituency.ac_name} AC #${activeConstituency.ac_no}` : '175 Assembly Constituencies'}
              </span>
            </div>
          </div>
        </div>
      </div>

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
  );
};

export default VoterReachView;
