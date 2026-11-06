import React from 'react';
import { Crown, History, Award } from 'lucide-react';
import type { CandidatePastRecord } from './heavyweightData';

interface CandidateDecomposition {
  candidateName: string;
  party: string;
  totalVotes: number;
  partyBaseline: number;
  partyPct: number;
  personalVotes: number;
  personalPct: number;
  pastRecord: CandidatePastRecord;
}

interface EquityCandidateCardProps {
  decomposition: CandidateDecomposition;
  partyColor: string;
  isWinner: boolean;
  actualMargin?: number;
}

export const EquityCandidateCard: React.FC<EquityCandidateCardProps> = ({
  decomposition,
  partyColor,
  isWinner,
  actualMargin,
}) => {
  const { pastRecord } = decomposition;

  return (
    <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/80 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: partyColor }}
          />
          <span className="font-bold text-xs text-white truncate max-w-[180px]" title={decomposition.candidateName}>
            {decomposition.candidateName}
          </span>
          <span
            className="text-[10px] font-black px-1.5 py-0.2 rounded"
            style={{ backgroundColor: `${partyColor}25`, color: partyColor }}
          >
            {decomposition.party} ({isWinner ? 'Winner' : 'Runner-up'})
          </span>
        </div>

        {isWinner ? (
          pastRecord.is2018Winner ? (
            <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3 text-emerald-400" />
              2018 Incumbent MLA
            </span>
          ) : pastRecord.is2014Winner ? (
            <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
              <History className="w-3 h-3 text-indigo-400" />
              2014 Former MLA
            </span>
          ) : null
        ) : actualMargin !== undefined ? (
          <span className="text-[10px] text-slate-400 font-mono">
            Deficit: {actualMargin.toLocaleString()} votes
          </span>
        ) : null}
      </div>

      {/* Segmented Progress Bar: Party Baseline vs Personal Pull */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[11px] font-mono">
          <span className="text-slate-400">
            Party Brand: <strong className="text-white">{decomposition.partyPct}%</strong> ({decomposition.partyBaseline.toLocaleString()} votes)
          </span>
          <span className={isWinner ? 'text-indigo-300 font-bold' : 'text-sky-300 font-bold'}>
            Personal Equity: <strong className="text-white">+{decomposition.personalPct}%</strong> (+{decomposition.personalVotes.toLocaleString()})
          </span>
        </div>

        <div className="w-full h-3.5 rounded-lg overflow-hidden flex bg-slate-950 p-0.5 border border-slate-700">
          {/* Party Symbol Share */}
          <div
            style={{ width: `${decomposition.partyPct}%`, backgroundColor: partyColor }}
            className="h-full rounded-l transition-all"
            title={`Party Symbol Baseline: ${decomposition.partyBaseline.toLocaleString()} votes (${decomposition.partyPct}%)`}
          />
          {/* Personal Equity Share */}
          <div
            style={{ width: `${decomposition.personalPct}%` }}
            className={`h-full rounded-r transition-all ${
              isWinner
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500'
                : 'bg-gradient-to-r from-sky-500 to-cyan-500'
            }`}
            title={`Candidate Personal Equity: +${decomposition.personalVotes.toLocaleString()} votes (+${decomposition.personalPct}%)`}
          />
        </div>

        {/* Historical Verification Badges */}
        <div className="flex flex-wrap items-center justify-between gap-1 pt-1 text-[10px]">
          <div className="flex flex-wrap items-center gap-1.5">
            {pastRecord.tags.length > 0 ? (
              pastRecord.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1 ${
                    isWinner
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                  }`}
                >
                  <Award className={`w-3 h-3 ${isWinner ? 'text-emerald-400' : 'text-sky-400'}`} />
                  {tag}
                </span>
              ))
            ) : (
              <span className="px-2 py-0.5 rounded-full text-slate-400 bg-slate-900 border border-slate-800">
                ⭐ Fresh {isWinner ? 'Contestant' : 'Challenger'} (No 2014/2018 Run)
              </span>
            )}
          </div>
          <span className="text-slate-400 font-mono text-[10px]">
            Valid: {decomposition.totalVotes.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};
