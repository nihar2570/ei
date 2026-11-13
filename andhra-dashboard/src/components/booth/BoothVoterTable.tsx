import React from 'react';
import { Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ElectorRecord } from '../../data/voterRollService';
import type { CastePrediction } from '../../data/casteClassifierService';

interface BoothVoterTableProps {
  paginatedElectors: ElectorRecord[];
  voterTags: Record<string, ElectorRecord['triageTag']>;
  casteMap: Map<string, CastePrediction>;
  copiedEpic: string | null;
  onCopyEpic: (epic: string) => void;
  onToggleVoterTag: (epic: string, currentTag?: ElectorRecord['triageTag']) => void;
  currentPage: number;
  totalPaginationPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  filteredCount: number;
}

export const BoothVoterTable: React.FC<BoothVoterTableProps> = ({
  paginatedElectors,
  voterTags,
  casteMap,
  copiedEpic,
  onCopyEpic,
  onToggleVoterTag,
  currentPage,
  totalPaginationPages,
  setCurrentPage,
  filteredCount,
}) => {
  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto shadow-2xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3 w-12 text-center">Sl</th>
              <th className="py-2.5 px-3 w-28 font-mono">EPIC</th>
              <th className="py-2.5 px-3">Elector Name</th>
              <th className="py-2.5 px-3 w-36">Est. Community</th>
              <th className="py-2.5 px-3">Relative Name</th>
              <th className="py-2.5 px-3 w-20">Door</th>
              <th className="py-2.5 px-3 w-28 text-center">Age</th>
              <th className="py-2.5 px-3 w-14 text-center">Gender</th>
              <th className="py-2.5 px-3 w-16 text-center">Panna</th>
              <th className="py-2.5 px-3 w-28 text-center">Field Tag</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {paginatedElectors.map((e) => {
              const tag = voterTags[e.epic] || e.triageTag;
              const pred = casteMap.get(e.epic);
              return (
                <tr key={e.epic} className="hover:bg-indigo-50/40 transition-colors">
                  <td className="py-2 px-3 text-center font-mono font-bold text-slate-500">
                    {e.slNo}
                  </td>
                  <td className="py-2 px-3 font-mono font-semibold text-slate-900">
                    <div className="flex items-center gap-1">
                      <span className="text-[11px]">{e.epic}</span>
                      <button
                        type="button"
                        onClick={() => onCopyEpic(e.epic)}
                        className="text-slate-400 hover:text-indigo-600 cursor-pointer"
                        title="Copy EPIC ID"
                      >
                        {copiedEpic === e.epic ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="py-2 px-3 font-bold text-slate-900">
                    {e.name === 'Data to be added' ? (
                      <span className="text-slate-400 font-mono italic font-normal text-[11px]">
                        Data to be added
                      </span>
                    ) : (
                      <span>{e.name}</span>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    {pred ? (
                      <div
                        className="flex flex-col gap-0.5"
                        title={`Primary Bloc: ${pred.primaryBloc}\nDetailed Sub-Caste: ${pred.casteName} (${pred.subCategory || pred.category})\nConfidence: ${pred.probabilityPercent} (${pred.confidenceTier})\nBasis: ${pred.sourceBasis}`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${pred.color.badge}`}>
                            {pred.primaryBloc}
                          </span>
                          <span className="font-mono text-[10px] font-semibold text-slate-500">
                            {pred.probabilityPercent}
                          </span>
                        </div>
                        {pred.casteName !== pred.primaryBloc && (
                          <span className="text-[9px] text-slate-400 font-medium truncate max-w-[140px] pl-0.5" title={pred.casteName}>
                            {pred.casteName}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400 font-mono text-[10px] italic">Data to be added</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-slate-600">
                    {e.relativeName === 'Data to be added' ? (
                      <span className="text-slate-400 font-mono italic text-[11px]">Data to be added</span>
                    ) : (
                      <>
                        <span className="text-[10px] text-slate-400 font-mono mr-1">
                          ({e.relationType}/o)
                        </span>
                        {e.relativeName}
                      </>
                    )}
                  </td>
                  <td className="py-2 px-3 font-mono font-medium text-slate-700">
                    {e.houseNo === 'Data to be added' ? (
                      <span className="text-slate-400 font-mono italic text-[10px]">Data to be added</span>
                    ) : (
                      e.houseNo
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {e.name !== 'Data to be added' && e.age >= 18 ? (
                      <span className="font-mono font-bold text-slate-800">{e.age} yrs</span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono italic">
                        Data to be added
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        e.gender === 'F'
                          ? 'bg-pink-100 text-pink-700 border border-pink-200'
                          : 'bg-blue-100 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {e.gender}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-500">
                    P.{e.pannaPage}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onToggleVoterTag(e.epic, e.triageTag)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border cursor-pointer ${
                        tag === 'committed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : tag === 'swing'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : tag === 'lean_opp'
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}
                    >
                      {tag === 'committed'
                        ? '✓ Committed'
                        : tag === 'swing'
                        ? '⚡ Swing'
                        : tag === 'lean_opp'
                        ? '✕ Opponent'
                        : '○ Neutral'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPaginationPages > 1 && (
        <div className="px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing {paginatedElectors.length} of {filteredCount} electors (Page {currentPage} of{' '}
            {totalPaginationPages})
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs font-semibold">
              {currentPage} / {totalPaginationPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPaginationPages, p + 1))}
              disabled={currentPage === totalPaginationPages}
              className="p-1 rounded border border-slate-200 hover:bg-slate-50 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
