import React, { useState, useMemo } from 'react';
import type { DetailedCandidate, ElectionData } from '../types';
import { getPartyColor } from '../types';
import {
  UserCheck,
  RotateCcw,
  HelpCircle,
} from 'lucide-react';
import {
  HEAVYWEIGHT_DATABASE,
  matchCandidateName,
  type CandidatePastRecord,
  getCandidatePastRecord,
} from './equity/heavyweightData';
import { EquityCandidateCard } from './equity/EquityCandidateCard';
import { EquityMethodologyModal } from './equity/EquityMethodologyModal';

export { HEAVYWEIGHT_DATABASE, matchCandidateName, getCandidatePastRecord };
export type { CandidatePastRecord };

interface CandidateEquityDecomposerProps {
  acNo: number;
  acName: string;
  winnerCandidate?: DetailedCandidate;
  runnerCandidate?: DetailedCandidate;
  totalValidVotes: number;
  electionData?: ElectionData | null;
}

export const CandidateEquityDecomposer: React.FC<CandidateEquityDecomposerProps> = ({
  acNo,
  acName,
  winnerCandidate,
  runnerCandidate,
  totalValidVotes: _totalValidVotes,
  electionData,
}) => {
  const [isMethodologyOpen, setIsMethodologyOpen] = useState(false);
  const [userWinnerEquityPct, setUserWinnerEquityPct] = useState<number | null>(null);
  const [userRunnerEquityPct, setUserRunnerEquityPct] = useState<number | null>(null);
  const [incumbencyMultiplier, setIncumbencyMultiplier] = useState<number>(1.0);

  // Regional PC / District average baseline for party performance
  const regionalPartyAvg = useMemo(() => {
    if (!electionData?.results?.['2023']) return {};
    const currentAc = electionData.results['2023'][String(acNo)];
    const pc = currentAc?.pc_name;
    const dist = currentAc?.district;

    const partyStats: Record<string, { votes: number; total: number }> = {};
    for (const ac of Object.values(electionData.results['2023'])) {
      const matchesGroup = pc ? ac.pc_name === pc : ac.district === dist;
      if (matchesGroup && ac.total_valid_votes > 0) {
        if (ac.winner?.party) {
          if (!partyStats[ac.winner.party]) partyStats[ac.winner.party] = { votes: 0, total: 0 };
          partyStats[ac.winner.party].votes += ac.winner.votes || 0;
          partyStats[ac.winner.party].total += ac.total_valid_votes;
        }
        if (ac.runner_up?.party) {
          if (!partyStats[ac.runner_up.party]) partyStats[ac.runner_up.party] = { votes: 0, total: 0 };
          partyStats[ac.runner_up.party].votes += ac.runner_up.votes || 0;
          partyStats[ac.runner_up.party].total += ac.total_valid_votes;
        }
      }
    }
    const avgs: Record<string, number> = {};
    for (const [p, d] of Object.entries(partyStats)) {
      if (d.total > 0) {
        avgs[p] = Number(((d.votes / d.total) * 100).toFixed(1));
      }
    }
    return avgs;
  }, [electionData, acNo]);

  const winnerPastRecord = useMemo(() => {
    return getCandidatePastRecord(winnerCandidate?.name || '', acNo, electionData);
  }, [winnerCandidate, acNo, electionData]);

  const runnerPastRecord = useMemo(() => {
    return getCandidatePastRecord(runnerCandidate?.name || '', acNo, electionData);
  }, [runnerCandidate, acNo, electionData]);

  const empiricalWinnerEquityPct = useMemo(() => {
    if (!winnerCandidate) return 18.0;
    const knownHeavyweight = HEAVYWEIGHT_DATABASE[acNo];
    if (knownHeavyweight && (matchCandidateName(winnerCandidate.name, knownHeavyweight.name) || knownHeavyweight.party === winnerCandidate.party)) {
      const knownPct = (knownHeavyweight.equityVotes / winnerCandidate.votes) * 100;
      return Number(knownPct.toFixed(1));
    }

    const baseNomineePct = 8.0;
    const incumbencyBonus = (winnerPastRecord.incumbencyBonusPct || 0) * incumbencyMultiplier;
    const regionalAvg = regionalPartyAvg[winnerCandidate.party] || 38.0;
    const delta = winnerCandidate.vote_share - regionalAvg;
    const outperformanceBonus = Number((delta * 0.35).toFixed(1));

    const totalPct = baseNomineePct + incumbencyBonus + Math.max(-3, Math.min(10, outperformanceBonus));
    return Number(Math.max(5.0, Math.min(42.0, totalPct)).toFixed(1));
  }, [winnerCandidate, acNo, winnerPastRecord, incumbencyMultiplier, regionalPartyAvg]);

  const empiricalRunnerEquityPct = useMemo(() => {
    if (!runnerCandidate) return 15.0;
    const baseNomineePct = 7.0;
    const incumbencyBonus = (runnerPastRecord.incumbencyBonusPct || 0) * incumbencyMultiplier;
    const regionalAvg = regionalPartyAvg[runnerCandidate.party] || 32.0;
    const delta = runnerCandidate.vote_share - regionalAvg;
    const outperformanceBonus = Number((delta * 0.35).toFixed(1));

    const totalPct = baseNomineePct + incumbencyBonus + Math.max(-3, Math.min(8, outperformanceBonus));
    return Number(Math.max(4.0, Math.min(38.0, totalPct)).toFixed(1));
  }, [runnerCandidate, runnerPastRecord, incumbencyMultiplier, regionalPartyAvg]);

  const finalWinnerEquityPct = userWinnerEquityPct ?? empiricalWinnerEquityPct;
  const finalRunnerEquityPct = userRunnerEquityPct ?? empiricalRunnerEquityPct;

  const winnerDecomposition = useMemo(() => {
    if (!winnerCandidate) return null;
    const totalVotes = winnerCandidate.votes;
    const personalPct = finalWinnerEquityPct;
    const personalVotes = Math.round(totalVotes * (personalPct / 100));
    const partyBaseline = Math.max(0, totalVotes - personalVotes);
    const partyPct = Number(((partyBaseline / totalVotes) * 100).toFixed(1));

    return {
      candidateName: winnerCandidate.name,
      party: winnerCandidate.party,
      totalVotes,
      partyBaseline,
      partyPct,
      personalVotes,
      personalPct,
      pastRecord: winnerPastRecord,
    };
  }, [winnerCandidate, finalWinnerEquityPct, winnerPastRecord]);

  const runnerDecomposition = useMemo(() => {
    if (!runnerCandidate) return null;
    const totalVotes = runnerCandidate.votes;
    const personalPct = finalRunnerEquityPct;
    const personalVotes = Math.round(totalVotes * (personalPct / 100));
    const partyBaseline = Math.max(0, totalVotes - personalVotes);
    const partyPct = Number(((partyBaseline / totalVotes) * 100).toFixed(1));

    return {
      candidateName: runnerCandidate.name,
      party: runnerCandidate.party,
      totalVotes,
      partyBaseline,
      partyPct,
      personalVotes,
      personalPct,
      pastRecord: runnerPastRecord,
    };
  }, [runnerCandidate, finalRunnerEquityPct, runnerPastRecord]);

  if (!winnerCandidate || !winnerDecomposition) return null;

  const actualMargin = winnerCandidate.votes - (runnerCandidate?.votes || 0);
  const winnerPartyColor = getPartyColor(winnerCandidate.party);
  const runnerPartyColor = runnerCandidate ? getPartyColor(runnerCandidate.party) : '#64748b';

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-4 sm:p-5 border border-indigo-500/30 shadow-xl space-y-4">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-indigo-500/20 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg">
              <UserCheck className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <span>Candidate Personal Equity vs. Party Symbol Decomposer</span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Calibrated against historical incumbency (2018/2014) and Parliamentary Constituency party baselines in <strong>{acName}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsMethodologyOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/50 transition-all cursor-pointer shadow-xs"
            title="View exact mathematical breakdown and adjust personal equity sliders"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-300" />
            <span>How is Equity Calculated?</span>
            {(userWinnerEquityPct !== null || userRunnerEquityPct !== null || incumbencyMultiplier !== 1.0) && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Custom overrides active" />
            )}
          </button>

          {(userWinnerEquityPct !== null || userRunnerEquityPct !== null || incumbencyMultiplier !== 1.0) && (
            <button
              type="button"
              onClick={() => {
                setUserWinnerEquityPct(null);
                setUserRunnerEquityPct(null);
                setIncumbencyMultiplier(1.0);
              }}
              className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Reset all adjustments and calibration overrides to default"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Side-by-Side Candidate Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <EquityCandidateCard
          decomposition={winnerDecomposition}
          partyColor={winnerPartyColor}
          isWinner={true}
        />
        {runnerDecomposition && runnerCandidate && (
          <EquityCandidateCard
            decomposition={runnerDecomposition}
            partyColor={runnerPartyColor}
            isWinner={false}
            actualMargin={actualMargin}
          />
        )}
      </div>

      {/* Methodology & Interactive Calibration Modal */}
      <EquityMethodologyModal
        isOpen={isMethodologyOpen}
        onClose={() => setIsMethodologyOpen(false)}
        acNo={acNo}
        acName={acName}
        winnerCandidate={winnerCandidate}
        runnerCandidate={runnerCandidate}
        winnerPastRecord={winnerPastRecord}
        runnerPastRecord={runnerPastRecord}
        winnerPartyColor={winnerPartyColor}
        runnerPartyColor={runnerPartyColor}
        incumbencyMultiplier={incumbencyMultiplier}
        setIncumbencyMultiplier={setIncumbencyMultiplier}
        finalWinnerEquityPct={finalWinnerEquityPct}
        setUserWinnerEquityPct={setUserWinnerEquityPct}
        empiricalWinnerEquityPct={empiricalWinnerEquityPct}
        finalRunnerEquityPct={finalRunnerEquityPct}
        setUserRunnerEquityPct={setUserRunnerEquityPct}
        empiricalRunnerEquityPct={empiricalRunnerEquityPct}
        onResetDefaults={() => {
          setUserWinnerEquityPct(null);
          setUserRunnerEquityPct(null);
          setIncumbencyMultiplier(1.0);
        }}
      />
    </div>
  );
};
