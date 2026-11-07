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
  selectedAcNo?: number;
  onSelectAc?: (acNo: number) => void;
  allConstituencies?: { ac_no: number; ac_name: string; district: string }[];
}

export const VoterReachView: React.FC<VoterReachViewProps> = ({ demographicsData }) => {
  // Targeting States
  const [party, setParty] = useState<CampaignParty>('TDP_JSP');
  const [selectedCaste, setSelectedCaste] = useState<CasteKey>('kapu');
  const [selectedAge, setSelectedAge] = useState<AgeKey>('youth_18_25');
  const [selectedIssue, setSelectedIssue] = useState<IssueKey>('jobs_fdi');

  // Compute live weighted statewide demographic percentages for ALL castes and ALL ages across all 175 constituencies
  const { totalStateElectors, allCastePcts, allAgePcts } = useMemo(() => {
    const acList = Object.values(demographicsData.constituencies || {});
    let totalE = 0;
    const casteSums: Record<string, number> = {};
    const ageSums: Record<string, number> = {};

    acList.forEach((c) => {
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

    (Object.keys(AGE_METAS) as AgeKey[]).forEach((k) => {
      aPcts[k] = totalE > 0 && ageSums[k] ? Number(((ageSums[k] / totalE) * 100).toFixed(1)) : 25.0;
    });

    return {
      totalStateElectors: finalElectors,
      allCastePcts: cPcts,
      allAgePcts: aPcts,
    };
  }, [demographicsData]);

  const castePct = allCastePcts[selectedCaste] || 15.0;
  const agePct = allAgePcts[selectedAge] || 22.0;

  // Real-world automatic persuadability verdict (Statewide Model)
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

  // Audience calculations across all 175 ACs
  const totalCohortVoters = Math.round(totalStateElectors * (castePct / 100) * (agePct / 100));
  const swingTargetVoters = Math.round(totalCohortVoters * (persuadability.swingPct / 100));

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Floating Vertical Section Navigation */}
      <FloatingSideNav />

      {/* Hero Executive Banner - Purely Statewide (No AC Switcher) */}
      <div
        id="reach-overview"
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-md relative overflow-hidden scroll-mt-24"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-indigo-400" />
                Statewide Andhra Pradesh • All 175 Assembly Segments
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                • Total Electorate: ~40.5M Voters
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-indigo-400 shrink-0" />
              Statewide Voter Reach &amp; 5–10 Touch Campaign Playbook
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Target voting blocs statewide by caste community and age bracket across all 175 constituencies.
              Analyze their quantitative grievance impact weights and budget a multi-channel campaign to convert the decisive swing vote.
            </p>
          </div>

          {/* Statewide Electorate Metric Card */}
          <div className="bg-slate-800/90 px-4 py-3 rounded-xl border border-slate-700 space-y-0.5 text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Statewide Electorate
            </span>
            <div className="text-lg font-black text-white">
              {totalStateElectors.toLocaleString()}
            </div>
            <span className="text-[10.5px] font-semibold text-emerald-400 block">
              175 Assembly Constituencies
            </span>
          </div>
        </div>
      </div>

      {/* Module 1: Cohort Targeting & Automatic Persuadability Verdict (Statewide) */}
      <CohortFilterCard
        party={party}
        onSelectParty={setParty}
        selectedCaste={selectedCaste}
        onSelectCaste={setSelectedCaste}
        selectedAge={selectedAge}
        onSelectAge={setSelectedAge}
        persuadability={persuadability}
        totalElectors={totalStateElectors}
        castePct={castePct}
        agePct={agePct}
        allCastePcts={allCastePcts}
        allAgePcts={allAgePcts}
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
