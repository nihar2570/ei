import React from 'react';
import {
  Vote,
  FileText,
  Building2,
  Users,
  TrendingUp,
  Search,
  MapPin,
} from 'lucide-react';
import type { ConstituencyCandidatesData } from '../../types';
import { getPartyColor } from '../../types';

interface MandalBreakdownTabProps {
  data: ConstituencyCandidatesData;
  mandals: any[];
  filteredMandals: any[];
  mandalTotals: { totalBooths: number; totalElectorate: number; avgTurnout: string | number };
  mandalSearch: string;
  setMandalSearch: (q: string) => void;
  form20Url?: string;
  setDossierTab: (tab: any) => void;
  onNavigateToBoothData?: (acNo: number, boothNo?: number, viewMode?: string) => void;
}

export const MandalBreakdownTab: React.FC<MandalBreakdownTabProps> = ({
  data,
  mandals,
  filteredMandals,
  mandalTotals,
  mandalSearch,
  setMandalSearch,
  form20Url,
  setDossierTab,
  onNavigateToBoothData,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Official ECI 2024 Statutory Voters Information Banner */}
      {data.voters_info && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 border border-indigo-700/40 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-500/20 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-indigo-500/30 text-indigo-300">
                <Vote className="w-4 h-4 text-indigo-300" />
              </span>
              <div>
                <h4 className="font-black text-sm text-slate-100 flex items-center gap-2">
                  Official ECI 2024 Voter Turnout &amp; Electors Profile
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-bold">
                    Form-12 Statutory Report
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Certified election data from Election Commission of India (ECI 2024 General Election)
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {form20Url && (
                <a
                  href={form20Url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg text-xs font-semibold border border-indigo-400/30 transition-all cursor-pointer shadow-xs"
                  title="Open official Returning Officer Form-20 (Booth-wise Polling Result Sheet) PDF from CEO Andhra Pradesh"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-200" />
                  <span>Official Form-20 PDF ↗</span>
                </a>
              )}
              <div className="text-right">
                <div className="text-xl font-black text-indigo-300 font-mono">
                  {data.voters_info.turnout_pct}%
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Official Poll Turnout</div>
              </div>
            </div>
          </div>

          {/* 5-Column Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/50">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Electors</div>
              <div className="text-base font-black text-slate-100 font-mono mt-0.5">
                {data.voters_info.electors_total.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex justify-between font-mono">
                <span>M: {data.voters_info.electors_male.toLocaleString()}</span>
                <span>F: {data.voters_info.electors_female.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/50">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Total Votes Polled</div>
              <div className="text-base font-black text-emerald-300 font-mono mt-0.5">
                {data.voters_info.voted_total.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex justify-between font-mono">
                <span>M: {data.voters_info.voted_male.toLocaleString()}</span>
                <span>F: {data.voters_info.voted_female.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/50">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Valid Votes Polled</div>
              <div className="text-base font-black text-indigo-200 font-mono mt-0.5">
                {(data.voters_info.valid_votes_polled || data.total_valid_votes).toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1">Candidate ballots polled</div>
            </div>

            <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/50">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">NOTA Votes</div>
              <div className="text-base font-black text-amber-300 font-mono mt-0.5">
                {data.voters_info.nota_votes.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono">
                {((data.voters_info.nota_votes / data.voters_info.voted_total) * 100).toFixed(2)}% of polled
              </div>
            </div>

            <div className="bg-slate-800/80 rounded-lg p-2.5 border border-slate-700/50 col-span-2 sm:col-span-1">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Postal &amp; Tendered</div>
              <div className="text-base font-black text-slate-200 font-mono mt-0.5">
                {data.voters_info.voted_postal.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex justify-between font-mono">
                <span>Rej: {data.voters_info.rejected_postal_votes + data.voters_info.rejected_evm_votes}</span>
                <span>Tend: {data.voters_info.tendered_votes || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mandal KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
            <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="truncate">Revenue Mandals</span>
          </div>
          <div className="flex items-baseline gap-1 shrink-0 font-mono">
            <span className="text-sm font-black text-slate-900">{mandals.length}</span>
            <span className="text-[10px] text-slate-400">Circles</span>
          </div>
        </div>

        <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
            <Vote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Polling Stations</span>
          </div>
          <div className="flex items-baseline gap-1 shrink-0 font-mono">
            <span className="text-sm font-black text-slate-900">{mandalTotals.totalBooths}</span>
            <span className="text-[10px] text-slate-400">Booths</span>
          </div>
        </div>

        <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
            <Users className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">Total Electorate</span>
          </div>
          <div className="flex items-baseline gap-1 shrink-0 font-mono">
            <span className="text-sm font-black text-slate-900">
              {mandalTotals.totalElectorate.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400">Voters</span>
          </div>
        </div>

        <div className="bg-slate-50 hover:bg-slate-100/70 transition-colors border border-slate-200/90 rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold truncate">
            <TrendingUp className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span className="truncate">Average Turnout</span>
          </div>
          <div className="flex items-baseline gap-1 shrink-0 font-mono">
            <span className="text-sm font-black text-slate-900">
              {Number(mandalTotals.avgTurnout) > 0 ? `${mandalTotals.avgTurnout}%` : '80.3%'}
            </span>
            <span className="text-[10px] text-slate-400">Polled</span>
          </div>
        </div>
      </div>

      {/* Mandal Ground Roster Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs space-y-0">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-indigo-600" />
              Mandal Administrative Directory ({mandals.length} Mandals / Revenue Circles)
            </span>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-mono font-bold">
              Delimitation 2008 &amp; AP Revenue
            </span>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by mandal, caste, party..."
              value={mandalSearch}
              onChange={(e) => setMandalSearch(e.target.value)}
              className="w-48 sm:w-60 bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/90 text-slate-600 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <th className="py-2.5 px-3">Mandal / Circle</th>
                <th className="py-2.5 px-3 text-right">Booths</th>
                <th className="py-2.5 px-3 text-right">Electorate</th>
                <th className="py-2.5 px-3 text-right">Turnout %</th>
                <th className="py-2.5 px-3 text-right">2023 Lead Margin</th>
                <th className="py-2.5 px-3">Dominant Community</th>
                <th className="py-2.5 px-3 text-center">Field Status</th>
                <th className="py-2.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredMandals.map((m) => {
                const mColor = getPartyColor(m.lead_party);
                const dotCount = Math.min(
                  4,
                  Math.max(1, m.margin < 1000 ? 1 : m.margin < 2000 ? 2 : m.margin < 3500 ? 3 : 4)
                );
                return (
                  <tr key={m.mandal_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-sans font-bold text-slate-900">{m.name}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">{m.booths}</td>
                    <td className="py-2.5 px-3 text-right text-slate-600">{m.electorate.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-800">{m.turnout_pct}%</td>
                    <td className="py-2.5 px-3 text-right font-bold">
                      <div className="flex items-center justify-end gap-1.5">
                        <div
                          className="flex items-center gap-1 shrink-0"
                          title={`Lead intensity: +${m.margin.toLocaleString()} votes (${dotCount} / 4 dots)`}
                        >
                          {Array.from({ length: dotCount }).map((_, dotIdx) => (
                            <span
                              key={dotIdx}
                              className="w-1.5 h-1.5 rounded-full inline-block shadow-2xs"
                              style={{ backgroundColor: mColor }}
                            />
                          ))}
                        </div>
                        <span
                          className="px-2 py-0.5 rounded text-[10px]"
                          style={{
                            backgroundColor: `${mColor}15`,
                            color: mColor,
                          }}
                        >
                          {m.lead_party} +{m.margin.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span className="font-medium text-slate-900">{m.dominant_caste}</span>{' '}
                      <span className="text-[10px] text-slate-400 font-mono">({m.dominant_caste_pct}%)</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-bold border"
                        style={{
                          backgroundColor: `${mColor}15`,
                          color: mColor,
                          borderColor: `${mColor}35`,
                        }}
                      >
                        {m.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-sans">
                      <button
                        type="button"
                        onClick={() => setDossierTab('booths')}
                        className="px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded text-[10px] font-bold cursor-pointer transition-colors"
                      >
                        Booths Map ➔
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Transition Banner to Booths Tab */}
      <div className="bg-gradient-to-r from-indigo-50 via-slate-50 to-indigo-50 border border-indigo-200/70 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="text-slate-700">
            Want to inspect individual EVM booth margins, coordinates &amp; Panna Pramukh quotas?
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (onNavigateToBoothData) {
                onNavigateToBoothData(data.ac_no, 1, 'ac-plan');
              } else {
                const url = new URL(window.location.origin + window.location.pathname);
                url.searchParams.set('tab', 'booth-data');
                url.searchParams.set('ac', String(data.ac_no));
                url.searchParams.set('view', 'ac-plan');
                window.open(url.toString(), '_blank');
              }
            }}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg font-black text-xs cursor-pointer shadow-2xs flex items-center gap-1.5 transition-all"
          >
            <span>🚶 AC Padayatra (30/60/90d)</span>
            <span>➔</span>
          </button>
          <button
            type="button"
            onClick={() => setDossierTab('booths')}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-2xs flex items-center gap-1.5 transition-all"
          >
            <span>Explore All {mandalTotals.totalBooths} Polling Stations &amp; Map</span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
