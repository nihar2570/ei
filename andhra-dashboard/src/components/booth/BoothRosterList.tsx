import React, { useState, useMemo } from 'react';
import {
  Map as MapIcon,
  FileText,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  ExternalLink,
} from 'lucide-react';
import type { BoothDetail } from '../../services/boothSolverEngine';
import { getOfficialSir2026PdfUrl } from '../../data/voterRollService';

interface BoothRosterListProps {
  filteredBooths: BoothDetail[];
  visibleBoothCount: number;
  setVisibleBoothCount: React.Dispatch<React.SetStateAction<number>>;
  theme: 'light' | 'dark';
  acNo: number;
  targetParty: string;
  targetColor: string;
  winnerParty: string;
  runnerParty: string;
  standaloneMapOnly?: boolean;
  onNavigateToBoothData?: (acNo: number, boothNo?: number, viewMode?: string) => void;
  onSelectMapBooth: (boothNo: number) => void;
}

type SortField = 'boothNo' | 'name' | 'mandalName' | 'triage' | 'electorate' | 'turnoutPct' | 'margin';

export const BoothRosterList: React.FC<BoothRosterListProps> = ({
  filteredBooths,
  visibleBoothCount,
  setVisibleBoothCount,
  theme,
  acNo,
  targetParty,
  targetColor: _targetColor,
  winnerParty,
  runnerParty,
  standaloneMapOnly = false,
  onNavigateToBoothData,
  onSelectMapBooth,
}) => {
  const [sortKey, setSortKey] = useState<SortField>('boothNo');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: SortField) => {
    if (sortKey === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(field);
      setSortOrder('asc');
    }
  };

  const sortedBooths = useMemo(() => {
    const list = [...filteredBooths];
    list.sort((a, b) => {
      let valA: any = a[sortKey];
      let valB: any = b[sortKey];

      if (sortKey === 'triage') {
        const triageWeight: Record<string, number> = {
          battleground: 1,
          vulnerable: 2,
          fortress: 3,
          hostile: 4,
        };
        valA = triageWeight[a.triage] || 5;
        valB = triageWeight[b.triage] || 5;
      }

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
    return list;
  }, [filteredBooths, sortKey, sortOrder]);

  const displayedBooths = useMemo(() => {
    return sortedBooths.slice(0, visibleBoothCount);
  }, [sortedBooths, visibleBoothCount]);

  const handleExportCsv = () => {
    const headers = [
      'AC No',
      'Booth No',
      'Polling Station Name',
      'Location',
      'Mandal',
      'Electorate',
      'Turnout %',
      'Margin',
      'Lead / Winner Party',
      'Status Category',
      'Lat',
      'Lng',
    ];

    const rows = sortedBooths.map((b) => [
      acNo,
      b.boothNo,
      `"${b.name.replace(/"/g, '""')}"`,
      `"${b.location.replace(/"/g, '""')}"`,
      `"${b.mandalName}"`,
      b.electorate,
      b.turnoutPct,
      b.margin,
      b.margin >= 0 ? targetParty : winnerParty === targetParty ? runnerParty : winnerParty,
      b.triage,
      b.lat ?? '',
      b.lng ?? '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `AC_${acNo}_Polling_Stations_Roster.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortKey !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-30 group-hover:opacity-70 transition-opacity" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-indigo-500 font-bold" />
    ) : (
      <ArrowDown className="w-3 h-3 text-indigo-500 font-bold" />
    );
  };

  const isLight = theme === 'light';

  return (
    <div className={`flex flex-col min-h-0 pt-1 space-y-2 ${standaloneMapOnly ? 'flex-1 h-full' : ''}`}>
      {/* Top Controls: Record count + CSV Export */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <span className={`font-mono text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Showing <strong>{displayedBooths.length}</strong> of <strong>{filteredBooths.length}</strong> stations
          {sortKey !== 'boothNo' && ` (sorted by ${sortKey} ${sortOrder})`}
        </span>

        <button
          type="button"
          onClick={handleExportCsv}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer shadow-2xs ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
          }`}
          title="Export current station list with GPS coordinates & Form-20 margins to CSV"
        >
          <Download className="w-3.5 h-3.5 text-emerald-600" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Sortable Responsive Table */}
      <div
        className={`border rounded-xl overflow-x-auto overflow-y-auto ${
          standaloneMapOnly ? 'flex-1 min-h-0' : 'max-h-[500px]'
        } ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'}`}
      >
        <table className="w-full text-left text-xs border-collapse">
          <thead
            className={`sticky top-0 z-10 border-b text-[11px] font-bold uppercase tracking-wider ${
              isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-slate-950 text-slate-300 border-slate-800'
            }`}
          >
            <tr>
              <th
                onClick={() => handleSort('boothNo')}
                className="py-2.5 px-3 cursor-pointer group hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors w-16"
              >
                <div className="flex items-center gap-1">
                  <span>PS #</span>
                  {renderSortIndicator('boothNo')}
                </div>
              </th>
              <th
                onClick={() => handleSort('name')}
                className="py-2.5 px-3 cursor-pointer group hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Polling Station Name</span>
                  {renderSortIndicator('name')}
                </div>
              </th>
              <th
                onClick={() => handleSort('mandalName')}
                className="py-2.5 px-3 cursor-pointer group hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors w-28"
              >
                <div className="flex items-center gap-1">
                  <span>Mandal</span>
                  {renderSortIndicator('mandalName')}
                </div>
              </th>
              <th
                onClick={() => handleSort('triage')}
                className="py-2.5 px-3 cursor-pointer group hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors w-32"
              >
                <div className="flex items-center gap-1">
                  <span>Status</span>
                  {renderSortIndicator('triage')}
                </div>
              </th>
              <th
                onClick={() => handleSort('electorate')}
                className="py-2.5 px-3 cursor-pointer group hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors text-right w-24"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Electors</span>
                  {renderSortIndicator('electorate')}
                </div>
              </th>
              <th
                onClick={() => handleSort('turnoutPct')}
                className="py-2.5 px-3 cursor-pointer group hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors text-right w-24"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Turnout</span>
                  {renderSortIndicator('turnoutPct')}
                </div>
              </th>
              <th
                onClick={() => handleSort('margin')}
                className="py-2.5 px-3 cursor-pointer group hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors text-right w-32"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>2024 Margin</span>
                  {renderSortIndicator('margin')}
                </div>
              </th>
              <th className="py-2.5 px-3 text-center w-36">Actions</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-slate-800/80'}`}>
            {displayedBooths.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-slate-400 text-xs">
                  No polling stations match the current filter or search criteria.
                </td>
              </tr>
            ) : (
              displayedBooths.map((b) => {
                const isBattleground = b.triage === 'battleground';
                const isFortress = b.triage === 'fortress';
                const isVulnerable = b.triage === 'vulnerable';

                const isTargetLead = b.margin >= 0;
                const leadParty = isTargetLead
                  ? targetParty
                  : winnerParty === targetParty
                  ? runnerParty
                  : winnerParty;

                return (
                  <tr
                    key={b.boothNo}
                    className={`transition-colors text-xs ${
                      isLight
                        ? isBattleground
                          ? 'hover:bg-amber-50/70 bg-amber-50/20'
                          : isFortress
                          ? 'hover:bg-emerald-50/70'
                          : isVulnerable
                          ? 'hover:bg-yellow-50/70'
                          : 'hover:bg-rose-50/70'
                        : isBattleground
                        ? 'hover:bg-amber-950/30 bg-amber-950/10'
                        : isFortress
                        ? 'hover:bg-emerald-950/30'
                        : isVulnerable
                        ? 'hover:bg-yellow-950/30'
                        : 'hover:bg-rose-950/30'
                    }`}
                  >
                    {/* 1. PS # */}
                    <td className="py-2.5 px-3 font-mono font-bold">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded border text-[11px] ${
                          isLight
                            ? 'bg-slate-100 text-slate-800 border-slate-300'
                            : 'bg-slate-800 text-slate-200 border-slate-700'
                        }`}
                      >
                        #{b.boothNo}
                      </span>
                    </td>

                    {/* 2. Station Name & Locality */}
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-xs leading-snug">
                        {b.name}
                      </div>
                      <div className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                        {b.location}
                      </div>
                    </td>

                    {/* 3. Mandal */}
                    <td className="py-2.5 px-3">
                      <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                        {b.mandalName}
                      </span>
                    </td>

                    {/* 4. Status Badge */}
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border font-mono ${
                          isBattleground
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                            : isFortress
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                            : isVulnerable
                            ? 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-400 border-yellow-500/30'
                            : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {isBattleground
                          ? '🔥 Battleground'
                          : isFortress
                          ? '🛡️ Stronghold'
                          : isVulnerable
                          ? '⚠️ Tight Lead'
                          : 'Opponent Turf'}
                      </span>
                    </td>

                    {/* 5. Electorate */}
                    <td className="py-2.5 px-3 text-right font-mono font-semibold">
                      {b.electorate.toLocaleString()}
                    </td>

                    {/* 6. Turnout */}
                    <td className="py-2.5 px-3 text-right font-mono">
                      <span className={b.turnoutPct >= 80 ? 'text-emerald-600 font-bold' : ''}>
                        {b.turnoutPct}%
                      </span>
                    </td>

                    {/* 7. 2024 Margin */}
                    <td className="py-2.5 px-3 text-right font-mono">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                          isTargetLead
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300'
                        }`}
                      >
                        {isTargetLead ? `+${b.margin}` : `${b.margin}`} {leadParty}
                      </span>
                    </td>

                    {/* 8. Actions */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectMapBooth(b.boothNo)}
                          className={`p-1 rounded border transition-colors cursor-pointer ${
                            isLight
                              ? 'bg-slate-50 hover:bg-slate-200 text-amber-600 border-slate-300'
                              : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
                          }`}
                          title="Locate station on Map"
                        >
                          <MapIcon className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={getOfficialSir2026PdfUrl(acNo, b.boothNo)}
                          target="_blank"
                          rel="noreferrer"
                          className={`p-1 rounded border transition-colors cursor-pointer ${
                            isLight
                              ? 'bg-slate-50 hover:bg-slate-200 text-rose-600 border-slate-300'
                              : 'bg-slate-800 hover:bg-slate-700 text-rose-400 border-slate-700'
                          }`}
                          title="Open official SIR 2026 Voter Roll PDF"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            if (onNavigateToBoothData) {
                              onNavigateToBoothData(acNo, b.boothNo);
                            } else {
                              const url = new URL(window.location.origin + window.location.pathname);
                              url.searchParams.set('tab', 'booth-data');
                              url.searchParams.set('ac', String(acNo));
                              url.searchParams.set('booth', String(b.boothNo));
                              window.open(url.toString(), '_blank');
                            }
                          }}
                          className={`p-1 rounded border transition-colors cursor-pointer ${
                            isLight
                              ? 'bg-slate-50 hover:bg-slate-200 text-indigo-600 border-slate-300'
                              : 'bg-slate-800 hover:bg-slate-700 text-indigo-400 border-slate-700'
                          }`}
                          title="Open station voters and e-roll in dedicated tab"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination / Record Count Controls */}
      {filteredBooths.length > 25 && (
        <div
          className={`pt-2 border-t flex flex-wrap justify-between items-center gap-2 text-xs shrink-0 ${
            isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
          }`}
        >
          <span className="font-mono text-[11px]">
            Showing <strong>{displayedBooths.length}</strong> of <strong>{filteredBooths.length}</strong> stations
          </span>
          <div className="flex items-center gap-1.5">
            {displayedBooths.length < filteredBooths.length && (
              <>
                <button
                  type="button"
                  onClick={() => setVisibleBoothCount((prev) => Math.min(filteredBooths.length, prev + 25))}
                  className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer text-xs font-semibold ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                  }`}
                >
                  +25 More
                </button>
                <button
                  type="button"
                  onClick={() => setVisibleBoothCount((prev) => Math.min(filteredBooths.length, prev + 50))}
                  className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer text-xs font-semibold ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                  }`}
                >
                  +50 More
                </button>
                <button
                  type="button"
                  onClick={() => setVisibleBoothCount(filteredBooths.length)}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer text-xs font-bold"
                >
                  Show All ({filteredBooths.length})
                </button>
              </>
            )}
            {displayedBooths.length > 25 && (
              <button
                type="button"
                onClick={() => setVisibleBoothCount(25)}
                className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer text-xs ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                Reset to 25
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
