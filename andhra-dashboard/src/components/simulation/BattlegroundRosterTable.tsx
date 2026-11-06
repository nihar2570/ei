import React from 'react';
import { Search } from 'lucide-react';
import type { SimulatedConstituencyResult } from '../../types';
import { getPartyColor } from '../../types';

interface BattlegroundRosterTableProps {
  filteredList: SimulatedConstituencyResult[];
  searchFilter: string;
  setSearchFilter: (query: string) => void;
  activeAcNo: number | null;
  onSelectAc: (acNo: number) => void;
  onNavigateToActions: (acNo?: number) => void;
}

export const BattlegroundRosterTable: React.FC<BattlegroundRosterTableProps> = ({
  filteredList,
  searchFilter,
  setSearchFilter,
  activeAcNo,
  onSelectAc,
  onNavigateToActions,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider flex items-center gap-2">
          <span>Simulation Battleground Roster ({filteredList.length})</span>
        </h3>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter AC, district, caste..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs w-44 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-bold uppercase text-[10px]">
              <th className="py-2 px-3">AC #</th>
              <th className="py-2 px-3">Constituency</th>
              <th className="py-2 px-3">District</th>
              <th className="py-2 px-3">2024 Actual</th>
              <th className="py-2 px-3">Simulated Project</th>
              <th className="py-2 px-3 text-right">Sim. Margin</th>
              <th className="py-2 px-3">Key Demographic</th>
              <th className="py-2 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredList.slice(0, 15).map((r) => {
              const simColor = getPartyColor(r.simulated.winner_party);
              return (
                <tr
                  key={r.ac_no}
                  onClick={() => onSelectAc(r.ac_no)}
                  className={`hover:bg-slate-50 cursor-pointer transition-colors ${
                    r.ac_no === activeAcNo ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-500">#{r.ac_no}</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{r.ac_name}</td>
                  <td className="py-2.5 px-3 text-slate-500">{r.district}</td>
                  <td className="py-2.5 px-3 font-medium text-slate-700">
                    {r.votes_2023.winner_party} ({r.votes_2023.margin.toLocaleString()})
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[11px]"
                      style={{ backgroundColor: `${simColor}18`, color: simColor }}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: simColor }} />
                      {r.simulated.winner_party}
                      {r.simulated.is_flipped && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 px-1 rounded ml-1 font-extrabold">
                          FLIP
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                    {r.simulated.margin.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">
                    {r.key_demographic} ({r.key_demographic_pct}%)
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onNavigateToActions(r.ac_no);
                      }}
                      className="px-2 py-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition-colors"
                    >
                      Playbook 🎯
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
