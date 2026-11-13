import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  Users,
  Download,
  FileText,
  Layers,
  Sparkles,
  Printer,
  Home,
  Shield,
  Fingerprint,
} from 'lucide-react';
import type { ElectorRecord, BoothVoterRollSummary } from '../data/voterRollService';
import { fetchBoothVoters } from '../data/voterRollService';
import {
  predictCaste,
  type CasteCategory,
  type CastePrediction,
} from '../data/casteClassifierService';
import { BoothVoterTable } from './booth/BoothVoterTable';
import { PannaPramukhSheet } from './booth/PannaPramukhSheet';
import { HouseholdClusterView } from './booth/HouseholdClusterView';
import { FORM_20_URLS } from '../data/form20Urls';

export interface BoothVoterRollModalProps {
  isOpen: boolean;
  onClose: () => void;
  acNo: number;
  acName: string;
  district: string;
  boothNo: number;
  boothName: string;
  mandalName: string;
  electorateCount?: number;
}

export const BoothVoterRollModal: React.FC<BoothVoterRollModalProps> = ({
  isOpen,
  onClose,
  acNo,
  acName,
  district,
  boothNo,
  boothName,
  mandalName,
  electorateCount = 840,
}) => {
  const form20Url = FORM_20_URLS[acNo];
  const [data, setData] = useState<BoothVoterRollSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'ALL' | 'M' | 'F'>('ALL');
  const [casteCategoryFilter, setCasteCategoryFilter] = useState<'ALL' | CasteCategory>('ALL');
  const [selectedPage, setSelectedPage] = useState<number | 'ALL'>('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'panna' | 'household'>('table');
  const [copiedEpic, setCopiedEpic] = useState<string | null>(null);

  // Pagination for large list
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  // Local state for interactive voter triage tag adjustments
  const [voterTags, setVoterTags] = useState<Record<string, ElectorRecord['triageTag']>>({});

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    setLoading(true);

    fetchBoothVoters(acNo, boothNo, boothName, mandalName, electorateCount).then((res) => {
      if (isMounted) {
        setData(res);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, acNo, boothNo, boothName, mandalName, electorateCount]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Caste predictions
  const casteMap = useMemo(() => {
    const map = new Map<string, CastePrediction>();
    if (!data?.electors) return map;
    data.electors.forEach((e) => {
      if (e.name && e.name !== 'Data to be added') {
        const pred = predictCaste(e.name, e.relativeName);
        if (pred) {
          map.set(e.epic, pred);
        }
      }
    });
    return map;
  }, [data, acNo, district, mandalName]);

  // Aggregate estimated caste breakdown
  const casteSummary = useMemo(() => {
    const summary: Record<CasteCategory, number> = {
      BC: 0,
      SC: 0,
      ST: 0,
      OC: 0,
      Minority: 0,
    };
    casteMap.forEach((pred) => {
      summary[pred.category] = (summary[pred.category] || 0) + 1;
    });
    return summary;
  }, [casteMap]);

  // Filter electors
  const filteredElectors = useMemo(() => {
    if (!data?.electors) return [];
    return data.electors.filter((e) => {
      if (genderFilter !== 'ALL' && e.gender !== genderFilter) return false;
      if (selectedPage !== 'ALL' && e.pannaPage !== selectedPage) return false;

      if (casteCategoryFilter !== 'ALL') {
        const pred = casteMap.get(e.epic);
        if (!pred || pred.category !== casteCategoryFilter) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesEpic = e.epic.toLowerCase().includes(q);
        const matchesName = e.name.toLowerCase().includes(q);
        const matchesRelative = e.relativeName.toLowerCase().includes(q);
        const matchesHouse = e.houseNo.toLowerCase().includes(q);
        const matchesPage = `page ${e.pannaPage}`.includes(q) || `panna ${e.pannaPage}`.includes(q);
        const pred = casteMap.get(e.epic);
        const matchesCaste = pred && (
          pred.casteName.toLowerCase().includes(q) ||
          pred.primaryBloc.toLowerCase().includes(q) ||
          pred.category.toLowerCase() === q
        );
        if (!matchesEpic && !matchesName && !matchesRelative && !matchesHouse && !matchesPage && !matchesCaste) {
          return false;
        }
      }
      return true;
    });
  }, [data, genderFilter, casteCategoryFilter, selectedPage, searchQuery, casteMap]);

  // Paginated electors
  const paginatedElectors = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredElectors.slice(start, start + pageSize);
  }, [filteredElectors, currentPage]);

  const totalPaginationPages = Math.ceil(filteredElectors.length / pageSize) || 1;

  // Household grouping
  const householdGroups = useMemo(() => {
    if (viewMode !== 'household') return [];
    const map = new Map<string, ElectorRecord[]>();
    filteredElectors.forEach((e) => {
      const existing = map.get(e.houseNo) || [];
      existing.push(e);
      map.set(e.houseNo, existing);
    });
    return Array.from(map.entries())
      .map(([houseNo, members]) => ({
        houseNo,
        members,
        section: members[0]?.section || 'Village Area',
      }))
      .sort((a, b) => b.members.length - a.members.length);
  }, [filteredElectors, viewMode]);

  // Panna grouping
  const pannaGroups = useMemo(() => {
    if (viewMode !== 'panna') return [];
    const map = new Map<number, ElectorRecord[]>();
    filteredElectors.forEach((e) => {
      const existing = map.get(e.pannaPage) || [];
      existing.push(e);
      map.set(e.pannaPage, existing);
    });
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([pageNum, members]) => ({
        pageNum,
        members,
      }));
  }, [filteredElectors, viewMode]);

  const handleCopyEpic = (epic: string) => {
    navigator.clipboard.writeText(epic);
    setCopiedEpic(epic);
    setTimeout(() => setCopiedEpic(null), 1800);
  };

  const toggleVoterTag = (epic: string, currentTag?: ElectorRecord['triageTag']) => {
    const baseTag = currentTag || 'neutral';
    const cycle: Record<ElectorRecord['triageTag'], ElectorRecord['triageTag']> = {
      committed: 'swing',
      swing: 'lean_opp',
      lean_opp: 'neutral',
      neutral: 'committed',
    };
    const nextTag = cycle[voterTags[epic] || baseTag];
    setVoterTags((prev) => ({ ...prev, [epic]: nextTag }));
  };

  const handleExportCsv = () => {
    if (!data) return;
    const headers = [
      'Sl No',
      'EPIC ID',
      'Elector Name',
      'Relative Name',
      'Relation',
      'House No',
      'Age',
      'Gender',
      'Section',
      'Panna Page',
      'Field Status',
    ];

    const rows = filteredElectors.map((e) => [
      e.slNo,
      e.epic,
      `"${e.name}"`,
      `"${e.relativeName}"`,
      e.relationType,
      `"${e.houseNo}"`,
      e.age,
      e.gender,
      `"${e.section}"`,
      e.pannaPage,
      voterTags[e.epic] || e.triageTag,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AC${acNo}_Booth_${boothNo}_Voter_Roll.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center font-mono font-black text-amber-400 text-base shadow-inner">
              #{boothNo}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 font-mono">
                  <Shield className="w-3 h-3 text-emerald-400" />
                  Electoral Roll Register &middot; CEO Andhra Pradesh
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  AC #{acNo} {acName} &middot; {district} District
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-indigo-500/20 text-indigo-300 border-indigo-400/40">
                  {electorateCount} Electors
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white mt-0.5 truncate max-w-2xl">
                {boothName} &middot; <span className="text-indigo-200 font-normal">{mandalName} Mandal</span>
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {form20Url && (
              <a
                href={form20Url}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                title={`Open Official CEO Andhra Pradesh 2024 Form-20 Polling Station Result Sheet for AC #${acNo} (Booth #${boothNo})`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Official 2024 Form-20 PDF ↗</span>
              </a>
            )}

            <a
              href={
                data?.roll2026Url ||
                `https://voters.eci.gov.in/eroll/2026/s01/sir-draftroll/${acNo}/2026-EROLLGEN-S01-${acNo}-SIR-DraftRoll-Revision1-ENG-${boothNo}-WI.pdf`
              }
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title={`Open Official CEO Andhra Pradesh SIR 2026 Draft Roll PDF for Booth #${boothNo}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official SIR 2026 PDF ↗</span>
            </a>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={loading || !data}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              title="Download Filtered Electors as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors cursor-pointer"
              title="Print Panna Pramukh Sheets"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Demographics & Panna KPI Banner */}
        {data && (
          <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Registered Electors</span>
                <span className="font-mono font-bold text-slate-900 text-sm">
                  {data.totalElectors.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-[10px]">
                ♀
              </span>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Sex Ratio</span>
                <span className="font-mono font-bold text-slate-900">
                  {data.femaleCount} F / {data.maleCount} M{' '}
                  <span className="text-[10px] font-normal text-slate-500">
                    ({Math.round((data.femaleCount / Math.max(1, data.maleCount)) * 1000)}/1k)
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Age Cohorts</span>
                <span className="font-mono text-xs text-slate-400 italic">
                  Data to be added
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Households / Doors</span>
                <span className="font-mono font-bold text-slate-900">
                  {data.householdCount} doors{' '}
                  <span className="text-[10px] font-normal text-slate-500">
                    (~{(data.totalElectors / Math.max(1, data.householdCount)).toFixed(1)}/door)
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-indigo-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-medium">Panna Allocation</span>
                <span className="font-mono font-bold text-purple-900">
                  {data.totalPages} Panna Pages{' '}
                  <span className="text-[10px] font-normal text-slate-500">(50/panna)</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Toolbar: Search, Filters & View Mode */}
        <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search EPIC, panna page..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Gender Filter */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
              {(['ALL', 'M', 'F'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setGenderFilter(g);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-colors cursor-pointer ${
                    genderFilter === g
                      ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {g === 'ALL' ? 'All' : g === 'M' ? 'Male ♂' : 'Female ♀'}
                </button>
              ))}
            </div>

            {/* Community / Caste Filter */}
            <select
              value={casteCategoryFilter}
              onChange={(e) => {
                setCasteCategoryFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden cursor-pointer font-medium"
              title="Filter electors by estimated caste / community"
            >
              <option value="ALL">All Communities</option>
              <option value="BC">BC ({casteSummary.BC}) · {data ? Math.round((casteSummary.BC / data.totalElectors) * 100) : 0}%</option>
              <option value="SC">SC ({casteSummary.SC}) · {data ? Math.round((casteSummary.SC / data.totalElectors) * 100) : 0}%</option>
              <option value="ST">ST ({casteSummary.ST}) · {data ? Math.round((casteSummary.ST / data.totalElectors) * 100) : 0}%</option>
              <option value="OC">OC ({casteSummary.OC}) · {data ? Math.round((casteSummary.OC / data.totalElectors) * 100) : 0}%</option>
              <option value="Minority">Minority ({casteSummary.Minority}) · {data ? Math.round((casteSummary.Minority / data.totalElectors) * 100) : 0}%</option>
            </select>

            {/* Panna Page Selector */}
            {data && (
              <select
                value={selectedPage}
                onChange={(e) => {
                  setSelectedPage(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">All Panna Pages ({data.totalPages})</option>
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>
                    Panna Page #{p} (Sl { (p - 1) * 50 + 1 }–{ Math.min(data.totalElectors, p * 50) })
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* View Mode Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Roll Table</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('panna')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'panna'
                  ? 'bg-white text-emerald-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Panna Pages</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('household')}
              className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'household'
                  ? 'bg-white text-amber-700 shadow-2xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Door-to-Door</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100/50">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-3">
              <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold">Loading E-Roll voter register for Booth #{boothNo}...</p>
            </div>
          ) : filteredElectors.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Users className="w-8 h-8 stroke-1" />
              <p className="text-sm font-semibold">No electors match the selected filters or search query.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setGenderFilter('ALL');
                  setCasteCategoryFilter('ALL');
                  setSelectedPage('ALL');
                }}
                className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
              >
                Reset all filters
              </button>
            </div>
          ) : viewMode === 'table' ? (
            <BoothVoterTable
              paginatedElectors={paginatedElectors}
              voterTags={voterTags}
              casteMap={casteMap}
              copiedEpic={copiedEpic}
              onCopyEpic={handleCopyEpic}
              onToggleVoterTag={toggleVoterTag}
              currentPage={currentPage}
              totalPaginationPages={totalPaginationPages}
              setCurrentPage={setCurrentPage}
              filteredCount={filteredElectors.length}
            />
          ) : viewMode === 'panna' ? (
            <PannaPramukhSheet
              pannaGroups={pannaGroups}
              voterTags={voterTags}
              casteMap={casteMap}
            />
          ) : (
            <HouseholdClusterView
              householdGroups={householdGroups}
              casteMap={casteMap}
            />
          )}
        </div>
      </div>
    </div>
  );
};
