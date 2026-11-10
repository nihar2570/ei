import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  Flame,
  TrendingUp,
  TrendingDown,
  RotateCcw,
} from 'lucide-react';
import type { DetailedCandidate } from '../../types';
import { getPartyColor } from '../../types';

interface CandidateDragScorecardProps {
  acNo: number;
  acName: string;
  winnerCandidate?: DetailedCandidate;
  runnerCandidate?: DetailedCandidate;
  baselineMarginVotes: number;
  baselineMarginPct: number;
  totalValidVotes: number;
}

export interface FrictionDimension {
  id: string;
  label: string;
  description: string;
  options: {
    label: string;
    value: number; // percentage impact
    tag: string;
    desc: string;
  }[];
}

const FRICTION_DIMENSIONS: FrictionDimension[] = [
  {
    id: 'accessibility',
    label: 'Accessibility & Grassroots Connect',
    description: 'Ground presence, town-halls, availability to local electorate',
    options: [
      {
        label: 'Accessible / Weekly Janta Darbar',
        value: 3.5,
        tag: '+3.5% Lift',
        desc: 'Candidate resides locally in AC, available weekly for voter petitions',
      },
      {
        label: 'Moderate / District Headquarters Presence',
        value: 0.5,
        tag: '+0.5% Neutral',
        desc: 'Visits constituency 2-3 times a month, handles major petitions',
      },
      {
        label: 'Absentee / Hyderabad-Based Elite',
        value: -4.0,
        tag: '-4.0% Drag',
        desc: 'Rarely accessible to general public; operates through local brokers',
      },
    ],
  },
  {
    id: 'corruption',
    label: 'Local Corruption & Syndicate Perception',
    description: 'Public resentment regarding sand, mining, land, or liquor syndicates',
    options: [
      {
        label: 'Clean Reputation / Developmental Goodwill',
        value: 2.0,
        tag: '+2.0% Lift',
        desc: 'High moral stature, focused on welfare and infrastructure',
      },
      {
        label: 'Average Political Image / Minor Allegations',
        value: 0.0,
        tag: '0.0% Neutral',
        desc: 'Standard political frictions, no acute public outrage',
      },
      {
        label: 'Severe Local Resentment (Sand/Land Mafia)',
        value: -5.5,
        tag: '-5.5% Drag',
        desc: 'Widespread public grievance over contractor nexus and extortion',
      },
    ],
  },
  {
    id: 'cadreFriction',
    label: 'Cadre Cohesion & Rebel Sabotage Risk',
    description: 'Unity of party machinery and alliance partner coordination',
    options: [
      {
        label: 'Unified Cadre & Smooth Alliance Coordination',
        value: 2.5,
        tag: '+2.5% Lift',
        desc: '100% booth committee activation; alliance partners work in sync',
      },
      {
        label: 'Latent Discontent / Grudging Cadre Support',
        value: 0.0,
        tag: '0.0% Neutral',
        desc: 'Second-rung leaders unenthusiastic; slow campaign momentum',
      },
      {
        label: 'Active Rebel Sabotage / Cross-Voting Threat',
        value: -6.0,
        tag: '-6.0% Drag',
        desc: 'Disgruntled ex-ticket aspirant actively funding rival or independent',
      },
    ],
  },
  {
    id: 'casteChemistry',
    label: 'Demographic & Subcaste Chemistry Fit',
    description: 'Alignment with AC dominant subcaste clusters and local social equations',
    options: [
      {
        label: 'Strong Social Equation / Coalition Anchor',
        value: 2.5,
        tag: '+2.5% Lift',
        desc: 'Naturally commands broad multi-caste support across mandals',
      },
      {
        label: 'Neutral Demographic Balance',
        value: 0.0,
        tag: '0.0% Neutral',
        desc: 'Relying primarily on core party symbol voting base',
      },
      {
        label: 'Demographic Friction / "Outsider" Backlash',
        value: -3.0,
        tag: '-3.0% Drag',
        desc: 'Perceived as alien to local dominant communities or subcastes',
      },
    ],
  },
];

export const CandidateDragScorecard: React.FC<CandidateDragScorecardProps> = ({
  acNo: _acNo,
  acName,
  winnerCandidate,
  runnerCandidate,
  baselineMarginVotes,
  baselineMarginPct,
  totalValidVotes,
}) => {
  // State: selected option index for each dimension for Winner & Runner
  const [winnerSelections, setWinnerSelections] = useState<Record<string, number>>({
    accessibility: 0,
    corruption: 0,
    cadreFriction: 0,
    casteChemistry: 0,
  });

  const [runnerSelections, setRunnerSelections] = useState<Record<string, number>>({
    accessibility: 1,
    corruption: 1,
    cadreFriction: 1,
    casteChemistry: 1,
  });

  const [activeCandidateView, setActiveCandidateView] = useState<'winner' | 'runner'>('winner');

  // Compute Net % Impact
  const winnerNetPct = useMemo(() => {
    return FRICTION_DIMENSIONS.reduce((sum, dim) => {
      const optIdx = winnerSelections[dim.id] ?? 0;
      return sum + (dim.options[optIdx]?.value || 0);
    }, 0);
  }, [winnerSelections]);

  const runnerNetPct = useMemo(() => {
    return FRICTION_DIMENSIONS.reduce((sum, dim) => {
      const optIdx = runnerSelections[dim.id] ?? 1;
      return sum + (dim.options[optIdx]?.value || 0);
    }, 0);
  }, [runnerSelections]);

  // Combined differential impact on the margin
  // Winner lift increases margin; Runner lift decreases margin
  const netMarginShiftPct = Number((winnerNetPct - runnerNetPct).toFixed(1));
  const netMarginShiftVotes = Math.round((netMarginShiftPct / 100) * totalValidVotes);

  const adjustedMarginPct = Number((baselineMarginPct + netMarginShiftPct).toFixed(1));
  const adjustedMarginVotes = baselineMarginVotes + netMarginShiftVotes;
  const isSeatFlipped = adjustedMarginVotes < 0;

  const currentCandidate = activeCandidateView === 'winner' ? winnerCandidate : runnerCandidate;
  const currentSelections = activeCandidateView === 'winner' ? winnerSelections : runnerSelections;
  const currentSetSelections = activeCandidateView === 'winner' ? setWinnerSelections : setRunnerSelections;
  const currentNetPct = activeCandidateView === 'winner' ? winnerNetPct : runnerNetPct;

  const handleReset = () => {
    setWinnerSelections({
      accessibility: 0,
      corruption: 0,
      cadreFriction: 0,
      casteChemistry: 0,
    });
    setRunnerSelections({
      accessibility: 1,
      corruption: 1,
      cadreFriction: 1,
      casteChemistry: 1,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Banner */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30">
              <Flame className="w-4 h-4" />
            </span>
            <h3 className="font-black text-sm sm:text-base tracking-tight">
              Candidate Local Drag &amp; Factional Friction Scorecard
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Prashant Kishor War-Room Model
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Simulate how candidate personal accessibility, local contractor corruption, cadre revolt, and caste chemistry swing the baseline race by <strong>-10% to +10%</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
          title="Reset to default baseline"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Model</span>
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* KPI Summary Bar: Baseline vs. PK Adjusted Outcome */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
              1. 2024 Certified Baseline Margin
            </span>
            <div className="text-lg font-black text-slate-900 font-mono">
              {winnerCandidate?.party} +{baselineMarginPct}%
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              {baselineMarginVotes.toLocaleString()} votes lead ({acName})
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
              2. Net Candidate Personal Impact
            </span>
            <div
              className={`text-lg font-black font-mono flex items-center gap-1.5 ${
                netMarginShiftPct > 0
                  ? 'text-emerald-600'
                  : netMarginShiftPct < 0
                  ? 'text-rose-600'
                  : 'text-slate-700'
              }`}
            >
              {netMarginShiftPct > 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              ) : netMarginShiftPct < 0 ? (
                <TrendingDown className="w-4 h-4 text-rose-600" />
              ) : null}
              <span>
                {netMarginShiftPct >= 0 ? `+${netMarginShiftPct}%` : `${netMarginShiftPct}%`} (
                {netMarginShiftVotes >= 0
                  ? `+${netMarginShiftVotes.toLocaleString()}`
                  : netMarginShiftVotes.toLocaleString()}{' '}
                votes)
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Winner: {winnerNetPct >= 0 ? `+${winnerNetPct}%` : `${winnerNetPct}%`} | Runner:{' '}
              {runnerNetPct >= 0 ? `+${runnerNetPct}%` : `${runnerNetPct}%`}
            </p>
          </div>

          <div
            className={`p-3 rounded-xl border space-y-1 ${
              isSeatFlipped
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : adjustedMarginVotes <= 3000
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}
          >
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider opacity-80">
              3. PK Friction-Adjusted Margin
            </span>
            <div className="text-lg font-black font-mono">
              {isSeatFlipped ? (
                <span>
                  FLIPPED TO {runnerCandidate?.party} (+{Math.abs(adjustedMarginPct)}%)
                </span>
              ) : (
                <span>
                  {winnerCandidate?.party} +{adjustedMarginPct}%
                </span>
              )}
            </div>
            <p className="text-[11px] font-mono opacity-90">
              {isSeatFlipped
                ? `${Math.abs(adjustedMarginVotes).toLocaleString()} vote deficit`
                : `${adjustedMarginVotes.toLocaleString()} vote lead (${
                    adjustedMarginVotes <= 3000 ? 'Razor-Thin Battleground' : 'Comfortable'
                  })`}
            </p>
          </div>
        </div>

        {/* Candidate Selector Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCandidateView('winner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeCandidateView === 'winner'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getPartyColor(winnerCandidate?.party || '') }}
              />
              <span>
                {winnerCandidate?.name} ({winnerCandidate?.party}) - Winner
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/20">
                {winnerNetPct >= 0 ? `+${winnerNetPct}%` : `${winnerNetPct}%`}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCandidateView('runner')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeCandidateView === 'runner'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: getPartyColor(runnerCandidate?.party || '') }}
              />
              <span>
                {runnerCandidate?.name || 'Runner Up'} ({runnerCandidate?.party})
              </span>
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-white/20">
                {runnerNetPct >= 0 ? `+${runnerNetPct}%` : `${runnerNetPct}%`}
              </span>
            </button>
          </div>

          <span className="text-xs text-slate-500 font-mono hidden md:inline">
            Modifying: <strong>{currentCandidate?.name}</strong> (Total Personal Delta:{' '}
            <strong
              className={
                currentNetPct > 0
                  ? 'text-emerald-600'
                  : currentNetPct < 0
                  ? 'text-rose-600'
                  : 'text-slate-700'
              }
            >
              {currentNetPct >= 0 ? `+${currentNetPct}%` : `${currentNetPct}%`}
            </strong>
            )
          </span>
        </div>

        {/* 4 Interactive Friction Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {FRICTION_DIMENSIONS.map((dim) => {
            const currentSelectedIdx = currentSelections[dim.id] ?? 0;
            return (
              <div
                key={dim.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2.5 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{dim.label}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{dim.description}</p>
                  </div>
                  <span
                    className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                      dim.options[currentSelectedIdx].value > 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : dim.options[currentSelectedIdx].value < 0
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {dim.options[currentSelectedIdx].tag}
                  </span>
                </div>

                {/* Option Selector Radio Tiles */}
                <div className="space-y-1.5">
                  {dim.options.map((opt, optIdx) => {
                    const isSelected = currentSelectedIdx === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() =>
                          currentSetSelections((prev) => ({ ...prev, [dim.id]: optIdx }))
                        }
                        className={`w-full text-left p-2 rounded-lg border text-xs transition-all cursor-pointer flex items-start gap-2 ${
                          isSelected
                            ? 'bg-white border-indigo-500 shadow-2xs ring-1 ring-indigo-500/30'
                            : 'bg-white/80 border-slate-200 hover:bg-white text-slate-700'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full border mt-0.5 shrink-0 flex items-center justify-center ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600'
                              : 'border-slate-400 bg-white'
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-semibold ${
                                isSelected ? 'text-indigo-950 font-bold' : 'text-slate-800'
                              }`}
                            >
                              {opt.label}
                            </span>
                            <span
                              className={`font-mono text-[10px] font-bold ${
                                opt.value > 0
                                  ? 'text-emerald-600'
                                  : opt.value < 0
                                  ? 'text-rose-600'
                                  : 'text-slate-500'
                              }`}
                            >
                              {opt.value > 0 ? `+${opt.value}%` : `${opt.value}%`}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Prashant Kishor Field Directive Synthesis */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 text-slate-900 space-y-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-500 text-white font-black text-[10px]">
              PK STRATEGIC DIRECTIVE
            </span>
            <span className="text-xs font-bold text-amber-950">
              Ground Campaign Prescription for AC #{_acNo} ({acName})
            </span>
          </div>

          <p className="text-xs text-amber-900 leading-relaxed">
            {winnerNetPct < -2.0 ? (
              <>
                ⚠️ <strong>High Personal Baggage Warning:</strong> Candidate{' '}
                {winnerCandidate?.name} carries a net{' '}
                <strong className="text-rose-700 font-mono">{winnerNetPct}% drag</strong> due to
                local grievance. <strong>Prescription:</strong> Do not rely on candidate-led rallies.
                Deploy alliance partner leaders (JSP/TDP senior ministers) to conduct localized door-to-door
                outreach, and address specific contractor/mining syndication grievances before polling day.
              </>
            ) : winnerNetPct > 3.0 ? (
              <>
                🌟 <strong>Super-Nominee Asset:</strong> Candidate {winnerCandidate?.name} generates a
                substantial <strong className="text-emerald-700 font-mono">+{winnerNetPct}% lift</strong>{' '}
                over the party symbol. <strong>Prescription:</strong> Maximize walking padayatras across
                hostile and battleground polling stations. Candidate personal goodwill can flip 8–15
                otherwise uncommitted booths in this constituency.
              </>
            ) : (
              <>
                ⚖️ <strong>Party-Symbol Dependent:</strong> Candidate {winnerCandidate?.name} is operating
                near baseline neutrality ({winnerNetPct >= 0 ? `+${winnerNetPct}%` : `${winnerNetPct}%`}).
                <strong> Prescription:</strong> The outcome depends 80% on booth-level Panna Pramukh
                discipline, direct cash benefit mobilization, and neutralizing rebel candidate vote bleeding.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
