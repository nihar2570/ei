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
import { Megaphone, Users, Flame } from 'lucide-react';

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
    <div className="space-y-4 sm:space-y-5 pb-12 relative">
      {/* Floating Vertical Section Navigation */}
      <FloatingSideNav activeRoute={activeRouteTab} />

      {/* Hero Executive Banner with Scope Switcher (Compact Less-is-More Strip) */}
      <div
        id="reach-overview"
        className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4 text-white border border-slate-800 shadow-md relative overflow-hidden scroll-mt-24"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 relative z-10">
          <div className="space-y-0.5 min-w-0">
            <h1 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">
                {activeConstituency
                  ? `${activeConstituency.ac_name} (#${activeConstituency.ac_no}) · Voter Reach`
                  : 'Voter Reach & Micro-Targeting'}
              </span>
            </h1>
            <p className="text-xs text-slate-300/90 truncate">
              {activeConstituency
                ? `${activeConstituency.district} District · Caste, age & 5–10 touch campaign planning.`
                : 'Caste, age & 5–10 touch campaign planning across Andhra Pradesh.'}
            </p>
          </div>

          {/* Inline Scope Dropdown & Electorate Pill */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <select
              id="reach-scope-select"
              aria-label="Targeting Scope"
              value={scopeAcNo}
              onChange={(e) => {
                const val = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value);
                setScopeAcNo(val);
                if (val !== 'ALL' && onSelectAc) onSelectAc(val);
              }}
              className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="ALL">🌏 Statewide (175 ACs)</option>
              <optgroup label="Select Constituency (AC 1–175)">
                {acList.map((ac) => (
                  <option key={ac.ac_no} value={ac.ac_no}>
                    #{ac.ac_no} {ac.ac_name} ({ac.district})
                  </option>
                ))}
              </optgroup>
            </select>

            <div className="flex items-baseline gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 shrink-0">
              <span className="text-sm sm:text-base font-black text-white font-mono leading-none">
                {activeScopeElectors.toLocaleString()}
              </span>
              <span className="text-[11px] font-medium text-emerald-400">voters</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Dual-Pill Command Bar */}
      <div
        id="reach-routes"
        role="tablist"
        aria-label="Voter Reach Strategy Route"
        className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-900/95 p-1.5 rounded-2xl border border-slate-800 shadow-md scroll-mt-24"
      >
        {(
          [
            {
              id: 'blue_pill',
              label: 'Blue Pill: Demographic Reach & Ad Cadence',
              meta: 'Caste · Age · 5–10 Touch',
              Icon: Users,
              activeClass:
                'bg-gradient-to-r from-blue-600/25 via-indigo-600/20 to-slate-800/90 text-white border-blue-500/50 shadow-sm ring-1 ring-blue-400/20',
              iconActive: 'text-blue-400',
              metaActive: 'text-blue-300/90',
            },
            {
              id: 'red_pill',
              label: 'Red Pill: Moral Rupture & Visceral Taboos',
              meta: '7 Taboos · Dual-Party Triggers',
              Icon: Flame,
              activeClass:
                'bg-gradient-to-r from-rose-600/25 via-red-600/20 to-slate-800/90 text-white border-rose-500/50 shadow-sm ring-1 ring-rose-400/20',
              iconActive: 'text-rose-400',
              metaActive: 'text-rose-300/90',
            },
          ] as const
        ).map(({ id, label, meta, Icon, activeClass, iconActive, metaActive }) => {
          const isActive = activeRouteTab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveRouteTab(id)}
              className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer border ${
                isActive
                  ? activeClass
                  : 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-transparent'
              }`}
            >
              <span className="flex items-center gap-2 font-bold min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? iconActive : 'text-slate-500'}`} />
                <span className="truncate">{label}</span>
              </span>
              <span
                className={`text-[11px] font-mono shrink-0 hidden md:inline ${
                  isActive ? metaActive : 'text-slate-500'
                }`}
              >
                {meta}
              </span>
            </button>
          );
        })}
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
          party={party}
          onSelectParty={setParty}
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
