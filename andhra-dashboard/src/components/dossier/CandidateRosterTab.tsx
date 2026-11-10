import React from 'react';
import {
  Vote,
  Award,
  Users,
  ShieldAlert,
  ShieldCheck,
  Coins,
  GraduationCap,
  Filter,
  Search,
} from 'lucide-react';
import type { ConstituencyCandidatesData, ElectionData } from '../../types';
import { getPartyColor, getPartyBg } from '../../types';
import { CandidateEquityDecomposer } from '../CandidateEquityDecomposer';
import { CandidateDragScorecard } from './CandidateDragScorecard';

interface CandidateRosterTabProps {
  data: ConstituencyCandidatesData;
  electionData?: ElectionData | null;
  winner: any;
  margin: number;
  marginPct: number | string;
  adrStats: {
    crorepatiCount: number;
    totalCriminalCases: number;
    highestNetWorthCandidate?: any;
    mostCasesCandidate?: any;
  };
  filterMode: '1000' | '5000' | 'all';
  handleFilterPreset: (preset: '1000' | '5000' | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  topLimit: number | 'ALL';
  setTopLimit: (limit: number | 'ALL') => void;
  filteredCandidates: any[];
  showAge: boolean;
  setShowAge: React.Dispatch<React.SetStateAction<boolean>>;
  showEducation: boolean;
  setShowEducation: React.Dispatch<React.SetStateAction<boolean>>;
  showCriminalCases: boolean;
  setShowCriminalCases: React.Dispatch<React.SetStateAction<boolean>>;
  showNetWorth: boolean;
  setShowNetWorth: React.Dispatch<React.SetStateAction<boolean>>;
  setMinVotes: (n: number) => void;
}

export const CandidateRosterTab: React.FC<CandidateRosterTabProps> = ({
  data,
  electionData,
  winner,
  margin,
  marginPct,
  adrStats,
  filterMode,
  handleFilterPreset,
  searchQuery,
  setSearchQuery,
  topLimit,
  setTopLimit,
  filteredCandidates,
  showAge,
  setShowAge,
  showEducation,
  setShowEducation,
  showCriminalCases,
  setShowCriminalCases,
  showNetWorth,
  setShowNetWorth,
  setMinVotes,
}) => {
  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Quick Metrics KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
            <Vote className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">Valid Votes</span>
          </div>
          <div className="flex items-baseline gap-1 shrink-0 font-mono">
            <span className="text-sm font-black text-slate-900">
              {data.total_valid_votes.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-indigo-700">
              {data.voters_info ? `${data.voters_info.turnout_pct}%` : 'cast'}
            </span>
          </div>
        </div>

        <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
            <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Margin ({winner?.party})</span>
          </div>
          <div className="flex items-baseline gap-1 shrink-0 font-mono">
            <span className="text-sm font-black text-slate-900">{margin.toLocaleString()}</span>
            <span className="text-[10px] font-bold text-emerald-700">({marginPct}%)</span>
          </div>
        </div>

        <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
            <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">Candidates</span>
          </div>
          <div className="flex items-baseline gap-1 shrink-0 font-mono">
            <span className="text-sm font-black text-slate-900">{data.total_candidates}</span>
            <span className="text-[10px] text-slate-400">({data.candidates_above_1000} ≥ 1k)</span>
          </div>
        </div>

        <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="truncate">ADR Profile</span>
          </div>
          <div className="flex items-baseline gap-1 shrink-0 font-mono">
            <span className="text-sm font-black text-slate-900">{adrStats.crorepatiCount}</span>
            <span className="text-[10px] text-slate-500 font-medium font-sans">
              Crorepatis ({adrStats.totalCriminalCases} cases)
            </span>
          </div>
        </div>
      </div>

      {/* Feature #6: Candidate Personal Equity vs Party Symbol Decomposer */}
      <CandidateEquityDecomposer
        acNo={data.ac_no}
        acName={data.ac_name}
        winnerCandidate={data.candidates[0]}
        runnerCandidate={data.candidates[1]}
        totalValidVotes={data.total_valid_votes}
        electionData={electionData}
      />

      {/* Prashant Kishor Candidate Local Drag & Factional Friction Scorecard */}
      <CandidateDragScorecard
        acNo={data.ac_no}
        acName={data.ac_name}
        winnerCandidate={data.candidates[0]}
        runnerCandidate={data.candidates[1]}
        baselineMarginVotes={margin}
        baselineMarginPct={typeof marginPct === 'number' ? marginPct : parseFloat(marginPct) || 0}
        totalValidVotes={data.total_valid_votes}
      />

      {/* Candidate Filter & Control Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            Filter Ballot:
          </span>

          {/* Threshold Presets */}
          <button
            type="button"
            onClick={() => handleFilterPreset('1000')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterMode === '1000'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
            title="Show candidates with at least 1,000 votes"
          >
            ≥ 1,000 Votes (Default)
          </button>

          <button
            type="button"
            onClick={() => handleFilterPreset('5000')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterMode === '5000'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
            title="Show major candidates with at least 5,000 votes"
          >
            ≥ 5,000 Votes
          </button>

          <button
            type="button"
            onClick={() => handleFilterPreset('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'all'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
            title="Show all candidates including independents"
          >
            All ({data.total_candidates})
          </button>
        </div>

        {/* Top X limit & Search */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5" />
            <input
              type="text"
              placeholder="Search candidate / party..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent focus:outline-hidden text-xs w-36 sm:w-44"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Top X Limit */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-500 font-medium hidden sm:inline">Top:</span>
            <select
              value={topLimit}
              onChange={(e) => setTopLimit(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-hidden"
            >
              <option value="ALL">All</option>
              <option value="3">Top 3</option>
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
            </select>
          </div>
        </div>
      </div>

      {/* Candidates & MyNeta Disclosures Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2.5 text-xs">
          <span className="font-bold text-slate-700">
            Displaying {filteredCandidates.length} Candidates{' '}
            {filterMode === '1000' && '(polling ≥ 1,000 votes)'}
            {filterMode === '5000' && '(polling ≥ 5,000 votes)'}
          </span>

          {/* Individual Column Toggles */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-semibold text-slate-500 mr-0.5">Show Columns:</span>

            <button
              type="button"
              onClick={() => {
                const allActive = showAge && showEducation && showCriminalCases && showNetWorth;
                setShowAge(!allActive);
                setShowEducation(!allActive);
                setShowCriminalCases(!allActive);
                setShowNetWorth(!allActive);
              }}
              className={`px-2 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                showAge && showEducation && showCriminalCases && showNetWorth
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
              }`}
              title="Toggle all disclosure columns"
            >
              {showAge && showEducation && showCriminalCases && showNetWorth ? 'Hide All' : 'Select All'}
            </button>

            <button
              type="button"
              onClick={() => setShowAge((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                showAge
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title="Toggle Age column"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  showAge ? 'bg-white' : 'bg-slate-300'
                }`}
              />
              Age
            </button>

            <button
              type="button"
              onClick={() => setShowEducation((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                showEducation
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title="Toggle Education column"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  showEducation ? 'bg-white' : 'bg-slate-300'
                }`}
              />
              Education
            </button>

            <button
              type="button"
              onClick={() => setShowCriminalCases((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                showCriminalCases
                  ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title="Toggle Criminal Cases column"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  showCriminalCases ? 'bg-white' : 'bg-slate-300'
                }`}
              />
              Criminal Cases
            </button>

            <button
              type="button"
              onClick={() => setShowNetWorth((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${
                showNetWorth
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title="Toggle Net Worth column"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  showNetWorth ? 'bg-white' : 'bg-slate-300'
                }`}
              />
              Net Worth
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3 w-12 text-center">Rank</th>
                <th className="py-2.5 px-3">Candidate</th>
                <th className="py-2.5 px-3">Party</th>
                {showAge && <th className="py-2.5 px-3 text-center">Age</th>}
                {showEducation && <th className="py-2.5 px-3">Education</th>}
                <th className="py-2.5 px-3 text-right">Votes</th>
                <th className="py-2.5 px-3 text-right">Vote Share</th>
                {showCriminalCases && <th className="py-2.5 px-3 text-center">Criminal Cases</th>}
                {showNetWorth && <th className="py-2.5 px-3 text-right">Net Worth</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((cand) => {
                const partyColor = cand.is_nota ? '#94a3b8' : getPartyColor(cand.party);
                const partyBg = cand.is_nota ? '#f1f5f9' : getPartyBg(cand.party);
                const isWinner = cand.rank === 1;
                const isRunner = cand.rank === 2;

                return (
                  <tr
                    key={cand.rank}
                    className={`hover:bg-slate-50 transition-colors ${
                      isWinner ? 'bg-indigo-50/20 font-medium' : ''
                    }`}
                  >
                    {/* Rank */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                          isWinner
                            ? 'bg-amber-400 text-slate-900 shadow-xs'
                            : isRunner
                            ? 'bg-slate-200 text-slate-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {cand.rank}
                      </span>
                    </td>

                    {/* Candidate Name */}
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {cand.name}
                        {isWinner && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                            Winner
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Party */}
                    <td className="py-3 px-3">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-md font-bold text-xs"
                        style={{
                          backgroundColor: partyBg,
                          color: partyColor,
                        }}
                      >
                        {cand.party}
                      </span>
                      <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                        {cand.raw_party}
                      </div>
                    </td>

                    {/* Age */}
                    {showAge && (
                      <td className="py-3 px-3 text-center font-medium text-slate-700">
                        {cand.myneta?.age ? `${cand.myneta.age} yrs` : <span className="text-slate-400">—</span>}
                      </td>
                    )}

                    {/* Education */}
                    {showEducation && (
                      <td className="py-3 px-3">
                        {cand.myneta?.education ? (
                          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                            <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[140px]">{cand.myneta.education}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    )}

                    {/* Votes */}
                    <td className="py-3 px-3 text-right">
                      <div className="font-bold text-slate-900">{cand.votes.toLocaleString()}</div>
                      {cand.postal_votes > 0 ? (
                        <div className="text-[10px] text-slate-400">Postal: {cand.postal_votes}</div>
                      ) : null}
                    </td>

                    {/* Vote Share % */}
                    <td className="py-3 px-3 text-right">
                      <div className="font-bold text-slate-800">{cand.vote_share}%</div>
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full ml-auto mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${cand.vote_share}%`, backgroundColor: partyColor }}
                        />
                      </div>
                    </td>

                    {/* Criminal Cases */}
                    {showCriminalCases && (
                      <td className="py-3 px-3 text-center">
                        {cand.myneta ? (
                          cand.myneta.criminal_cases === 0 ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              0 (Clean)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                              <ShieldAlert className="w-3 h-3 text-rose-600" />
                              {cand.myneta.criminal_cases} Cases
                            </span>
                          )
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </td>
                    )}

                    {/* Net Worth */}
                    {showNetWorth && (
                      <td className="py-3 px-3 text-right">
                        {cand.myneta ? (
                          <div>
                            <div className="font-bold text-slate-900 flex items-center justify-end gap-1">
                              {cand.myneta.net_worth_formatted}
                              {cand.myneta.is_crorepati && (
                                <span title="Crorepati candidate">
                                  <Coins className="w-3 h-3 text-amber-500" />
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-500">
                              Assets: {cand.myneta.total_assets_formatted}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCandidates.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <p className="font-medium text-sm">No candidates match the specified filter.</p>
            <button
              type="button"
              onClick={() => {
                setMinVotes(0);
                handleFilterPreset('all');
                setSearchQuery('');
              }}
              className="mt-2 text-indigo-600 hover:underline text-xs font-semibold cursor-pointer"
            >
              Reset filters to show all candidates
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
