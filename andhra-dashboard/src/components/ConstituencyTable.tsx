import React, { useState, useMemo, useEffect } from 'react';
import type { ConstituencyResult, Year } from '../types';
import { getPartyColor } from '../types';
import { Search, ArrowUpDown } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { AP_REGIONS } from './common/DistrictFilterRibbon';

interface ConstituencyTableProps {
  results: Record<string, ConstituencyResult>;
  selectedAcNo: number | null;
  onSelectAc: (acNo: number) => void;
  year: Year;
  onOpenDossier?: (acNo: number) => void;
}

export const ConstituencyTable: React.FC<ConstituencyTableProps> = ({
  results,
  selectedAcNo,
  onSelectAc,
  year,
  onOpenDossier,
}) => {
  const { districtFilter } = useDashboard();
  const [search, setSearch] = useState('');
  const [selectedParty, setSelectedParty] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState(districtFilter || 'ALL');
  const [sortBy, setSortBy] = useState<'ac_no' | 'margin_asc' | 'margin_desc' | 'votes' | 'turnout_desc' | 'turnout_asc'>('ac_no');

  useEffect(() => {
    if (districtFilter) {
      setSelectedDistrict(districtFilter);
    }
  }, [districtFilter]);

  const list = useMemo(() => Object.values(results), [results]);

  const districts = useMemo(() => {
    const s = new Set<string>();
    list.forEach((r) => {
      if (r.district) s.add(r.district);
    });
    return Array.from(s).sort();
  }, [list]);

  const parties = useMemo(() => {
    const s = new Set<string>();
    list.forEach((r) => {
      if (r.winner?.party) s.add(r.winner.party);
    });
    return Array.from(s).sort();
  }, [list]);

  const filteredAndSorted = useMemo(() => {
    return list
      .filter((r) => {
        const matchesSearch =
          r.ac_name.toLowerCase().includes(search.toLowerCase()) ||
          r.winner.candidate.toLowerCase().includes(search.toLowerCase()) ||
          r.district.toLowerCase().includes(search.toLowerCase()) ||
          String(r.ac_no) === search.trim();

        const matchesParty = selectedParty === 'ALL' || r.winner.party === selectedParty;
        let matchesDistrict = selectedDistrict === 'ALL' || r.district === selectedDistrict;
        if (selectedDistrict === 'COASTAL') {
          matchesDistrict = AP_REGIONS.coastal.districts.some((d) => d.toLowerCase() === r.district?.toLowerCase());
        } else if (selectedDistrict === 'RAYALASEEMA') {
          matchesDistrict = AP_REGIONS.rayalaseema.districts.some((d) => d.toLowerCase() === r.district?.toLowerCase());
        }

        return matchesSearch && matchesParty && matchesDistrict;
      })
      .sort((a, b) => {
        if (sortBy === 'margin_asc') return a.margin - b.margin;
        if (sortBy === 'margin_desc') return b.margin - a.margin;
        if (sortBy === 'votes') return b.winner.votes - a.winner.votes;
        if (sortBy === 'turnout_desc') return (b.turnout_pct || 0) - (a.turnout_pct || 0);
        if (sortBy === 'turnout_asc') return (a.turnout_pct || 0) - (b.turnout_pct || 0);
        return a.ac_no - b.ac_no;
      });
  }, [list, search, selectedParty, selectedDistrict, sortBy]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Controls */}
      <div className="px-3.5 py-2.5 border-b border-slate-200 bg-slate-50/60 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              {year} Constituency Directory ({filteredAndSorted.length} / {Object.keys(results).length || 175})
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-lg shadow-2xs">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="ac_no">Sort: AC Number (1-175)</option>
                <option value="margin_asc">Sort: Tightest Margin (Battlegrounds)</option>
                <option value="margin_desc">Sort: Highest Margin (Landslides)</option>
                <option value="votes">Sort: Highest Votes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Search AC name, candidate..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs"
            />
          </div>

          {/* Party Filter */}
          <div className="relative">
            <select
              value={selectedParty}
              onChange={(e) => setSelectedParty(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs cursor-pointer"
            >
              <option value="ALL">All Winning Parties ({list.length})</option>
              {parties.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* District Filter */}
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-2xs cursor-pointer"
            >
              <option value="ALL">All Districts ({districts.length})</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[440px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="bg-slate-100/90 text-slate-600 font-bold sticky top-0 z-10 border-b border-slate-200 text-[11px]">
            <tr>
              <th className="py-2 px-2.5 w-14"># AC</th>
              <th className="py-2 px-2.5">Constituency</th>
              <th className="py-2 px-2.5">District</th>
              <th className="py-2 px-2.5">Winner</th>
              <th className="py-2 px-2.5">Party</th>
              <th className="py-2 px-2.5">Runner-Up</th>
              <th className="py-2 px-2.5 text-right">Margin</th>
              <th
                className="py-2 px-2.5 text-right cursor-pointer hover:text-indigo-600 transition-colors select-none"
                onClick={() => setSortBy((prev) => (prev === 'turnout_desc' ? 'turnout_asc' : 'turnout_desc'))}
                title="Click to sort by turnout %"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Turnout</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2 px-2.5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAndSorted.map((r) => {
              const isSelected = selectedAcNo === r.ac_no;
              const partyColor = getPartyColor(r.winner.party);

              return (
                <tr
                  key={r.ac_no}
                  onClick={() => onSelectAc(r.ac_no)}
                  className={`group cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50/80 font-medium'
                      : 'hover:bg-slate-50/90 text-slate-700'
                  }`}
                >
                  <td className="py-1.5 px-2.5 font-mono text-slate-500 text-[11px]">{r.ac_no}</td>
                  <td className="py-1.5 px-2.5 font-semibold text-slate-900">
                    <div className="flex items-center justify-between gap-1">
                      <span>{r.ac_name}</span>
                      {onOpenDossier && (year === '2024' || year === '2023') && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDossier(r.ac_no);
                          }}
                          className="opacity-0 group-hover:opacity-100 hover:opacity-100 text-[9px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-1 py-0.2 rounded border border-indigo-200 transition-opacity flex items-center gap-0.5 cursor-pointer font-bold"
                          title="Open full candidate dossier"
                        >
                          Dossier ↗
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-1.5 px-2.5 text-slate-500 text-[11px]">{r.district}</td>
                  <td className="py-1.5 px-2.5 font-medium text-slate-900 truncate max-w-[140px] text-[11px]">
                    {r.winner.candidate}
                  </td>
                  <td className="py-1.5 px-2.5">
                    <span
                      className="inline-flex items-center gap-1 font-bold px-1.5 py-0.2 rounded text-[10px]"
                      style={{
                        backgroundColor: `${partyColor}18`,
                        color: partyColor,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: partyColor }}
                      />
                      {r.winner.party}
                    </span>
                  </td>
                  <td className="py-1.5 px-2.5 text-slate-500 truncate max-w-[130px] text-[11px]">
                    {r.runner_up.party} - {r.runner_up.candidate.split(' ')[0]}
                  </td>
                  <td className="py-1.5 px-2.5 text-right font-mono font-medium text-[11px]">
                    <span className="text-slate-900 font-bold">{r.margin.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 ml-1">({r.margin_pct}%)</span>
                  </td>
                  <td className="py-1.5 px-2.5 text-right font-mono font-bold text-slate-800 text-[11px]">
                    {r.turnout_pct > 0 ? (
                      <span
                        className={
                          r.turnout_pct >= 85
                            ? 'text-emerald-700'
                            : r.turnout_pct < 70
                            ? 'text-amber-700'
                            : 'text-slate-800'
                        }
                      >
                        {r.turnout_pct}%
                      </span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                  <td className="py-1.5 px-2.5 text-center">
                    {r.swing ? (
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                          r.swing.status === 'GAIN'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {r.swing.status === 'GAIN' ? 'GAIN' : 'HOLD'}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
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
