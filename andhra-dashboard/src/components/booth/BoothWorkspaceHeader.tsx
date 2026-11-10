import React from 'react';
import {
  FileText,
  Layers,
  Home,
  Footprints,
  Printer,
  CheckCircle2,
  Zap,
  Search,
  Scan,
} from 'lucide-react';
import type { BoothVoterRollSummary } from '../../data/voterRollService';
import type { CasteCategory } from '../../data/casteClassifierService';
import { FORM_20_URLS } from '../../data/form20Urls';

interface BoothWorkspaceHeaderProps {
  data: BoothVoterRollSummary | null;
  selectedBoothNo: number;
  totalBoothsInAc: number;
  activeBoothMeta: any;
  selectedAcNo: number;
  currentAcName: string;
  isAcFullyExtracted: boolean;
  onOpenExtractorModal: () => void;
  onOpenTracker?: () => void;
  casteSummary: Record<string, number>;
  viewMode: 'table' | 'panna' | 'household' | 'padayatra' | 'ac-plan';
  setViewMode: (mode: 'table' | 'panna' | 'household' | 'padayatra' | 'ac-plan') => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  genderFilter: 'ALL' | 'M' | 'F';
  setGenderFilter: (val: 'ALL' | 'M' | 'F') => void;
  casteCategoryFilter: 'ALL' | CasteCategory;
  setCasteCategoryFilter: (val: 'ALL' | CasteCategory) => void;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  filteredCount: number;
}

export const BoothWorkspaceHeader: React.FC<BoothWorkspaceHeaderProps> = ({
  data,
  selectedBoothNo,
  totalBoothsInAc,
  activeBoothMeta,
  selectedAcNo,
  currentAcName,
  isAcFullyExtracted,
  onOpenExtractorModal,
  onOpenTracker,
  casteSummary,
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  genderFilter,
  setGenderFilter,
  casteCategoryFilter,
  setCasteCategoryFilter,
  setCurrentPage,
  filteredCount,
}) => {
  const form20Url = FORM_20_URLS[selectedAcNo];

  return (
    <div className="space-y-3">
      {/* Active Booth Summary Header */}
      {data && (
        <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                  Booth #{data.boothNo} of {totalBoothsInAc}
                </span>
                <h3 className="text-sm font-black text-slate-900">{data.boothName}</h3>
                {activeBoothMeta?.lat && activeBoothMeta?.lng && (
                  <a
                    href={`https://www.google.com/maps?q=${activeBoothMeta.lat},${activeBoothMeta.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md font-mono hover:underline"
                    title="Open Polling Station Location on Google Maps"
                  >
                    📍 {activeBoothMeta.lat.toFixed(4)}, {activeBoothMeta.lng.toFixed(4)} ↗
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                <span>
                  Mandal: <strong className="text-slate-700">{data.mandalName}</strong>
                </span>
                <span>&middot;</span>
                <span>
                  Constituency:{' '}
                  <strong className="text-slate-700">
                    AC #{selectedAcNo} {currentAcName}
                  </strong>
                </span>
                {activeBoothMeta?.winnerParty && (
                  <>
                    <span>&middot;</span>
                    {form20Url ? (
                      <a
                        href={form20Url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-200 hover:border-emerald-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
                        title={`Open Official 2024 Form-20 Result Sheet for AC #${selectedAcNo} (Booth #${data.boothNo})`}
                      >
                        <span>2024 Form 20:</span>
                        <strong className="text-slate-900">{activeBoothMeta.winnerParty}</strong> (+
                        {activeBoothMeta.marginPct}% margin, {activeBoothMeta.totalVotes} votes cast) ↗
                      </a>
                    ) : (
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-200">
                        2024 Form 20:{' '}
                        <strong className="text-slate-900">{activeBoothMeta.winnerParty}</strong> (+
                        {activeBoothMeta.marginPct}% margin, {activeBoothMeta.totalVotes} votes cast)
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {isAcFullyExtracted ? (
                <button
                  type="button"
                  disabled
                  className="px-3 py-1.5 rounded-lg border border-emerald-400/40 bg-emerald-50 text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs opacity-90 cursor-default"
                  title="Official 2026 Special Intensive Revision Draft Roll is fully extracted and active for all booths in this AC"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>✓ Extracted</span>
                </button>
              ) : data.isAuthenticExtract ? (
                <button
                  type="button"
                  onClick={onOpenExtractorModal}
                  className="px-2.5 py-1.5 rounded-lg border border-emerald-400 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Authentic Official ECI 2026 Voter Roll is loaded. Click to inspect or re-extract."
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>✓ Extracted</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onOpenExtractorModal}
                  className="px-3 py-1.5 rounded-lg border border-amber-500 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg cursor-pointer animate-pulse"
                  title="Extract authentic voter list directly from 2026 ECI Draft Roll PDF in-memory"
                >
                  <Zap className="w-3.5 h-3.5 fill-current text-slate-950" />
                  <span>⚡ Extract</span>
                </button>
              )}

              {form20Url && (
                <a
                  href={form20Url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title={`Open Official CEO Andhra Pradesh 2024 Form-20 Polling Station Result Sheet for AC #${selectedAcNo} (Booth #${data.boothNo})`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Official 2024 Form-20 PDF ↗</span>
                </a>
              )}

              <a
                href={
                  data.roll2026Url ||
                  `https://voters.eci.gov.in/eroll/2026/s01/sir-draftroll/${selectedAcNo}/2026-EROLLGEN-S01-${selectedAcNo}-SIR-DraftRoll-Revision1-ENG-${data.boothNo}-WI.pdf`
                }
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                title={`Open Official CEO Andhra Pradesh SIR 2026 Draft Roll PDF for Booth #${data.boothNo}`}
              >
                <FileText className="w-3.5 h-3.5 text-rose-600" />
                <span>Official SIR 2026 PDF ↗</span>
              </a>

              {onOpenTracker && (
                <button
                  type="button"
                  onClick={onOpenTracker}
                  className="px-2.5 py-1.5 rounded-lg border border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  title="Open Statewide ECI SIR 2026 Discovery & Extraction Tracker"
                >
                  <Scan className="w-3.5 h-3.5 text-amber-600" />
                  <span>ECI Tracker</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => window.print()}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Print E-Roll Register"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 pt-2 border-t border-slate-100 text-xs">
            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-medium block">Total Electors</span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {data.totalElectors}
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-medium block">Gender Split</span>
              <span className="font-mono font-bold text-slate-900 text-xs">
                {data.femaleCount} F / {data.maleCount} M
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-medium block">Households</span>
              <span className="font-mono font-bold text-slate-900 text-xs">
                {data.householdCount} doors
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-medium block">Panna Pages</span>
              <span className="font-mono font-bold text-purple-700 text-xs">
                {data.totalPages} Pages (50/p)
              </span>
            </div>

            <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-400 uppercase font-medium block">Est. Community Mix</span>
              {casteSummary.BC + casteSummary.SC + casteSummary.ST + casteSummary.OC + casteSummary.Minority > 0 ? (
                <div className="flex items-center gap-1 text-[10px] font-mono font-bold truncate">
                  <span className="text-blue-700">
                    {data.totalElectors ? Math.round((casteSummary.BC / data.totalElectors) * 100) : 0}% BC
                  </span>
                  <span>·</span>
                  <span className="text-purple-700">
                    {data.totalElectors ? Math.round((casteSummary.SC / data.totalElectors) * 100) : 0}% SC
                  </span>
                  <span>·</span>
                  <span className="text-amber-700">
                    {data.totalElectors ? Math.round((casteSummary.ST / data.totalElectors) * 100) : 0}% ST
                  </span>
                </div>
              ) : (
                <span className="text-slate-400 font-mono italic text-[10px]">Data to be added</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tier 1: View Mode Tabs */}
      <div className="bg-slate-50/70 border border-slate-200 rounded-t-xl px-3.5 pt-2 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 border-t border-x ${
              viewMode === 'table'
                ? 'bg-white text-indigo-700 border-slate-200 -mb-px shadow-2xs font-black'
                : 'bg-transparent text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>E-Roll Register</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('panna')}
            className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 border-t border-x ${
              viewMode === 'panna'
                ? 'bg-white text-emerald-700 border-slate-200 -mb-px shadow-2xs font-black'
                : 'bg-transparent text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Panna Pages</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('household')}
            className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 border-t border-x ${
              viewMode === 'household'
                ? 'bg-white text-amber-700 border-slate-200 -mb-px shadow-2xs font-black'
                : 'bg-transparent text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Door-to-Door</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('padayatra')}
            className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-all cursor-pointer flex items-center gap-1.5 border-t border-x ${
              viewMode === 'padayatra'
                ? 'bg-white text-amber-900 border-amber-300 -mb-px shadow-2xs font-black ring-1 ring-amber-300'
                : 'bg-amber-50/60 text-amber-900 hover:bg-amber-100/80 border-transparent'
            }`}
            title="1-Click MLA Padayatra Sequenced Route & Household Talking Points"
          >
            <Footprints className="w-3.5 h-3.5 text-amber-600" />
            <span>🚶‍♂️ Booth Padayatra Script</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-mono pb-2 hidden sm:block">
          Booth #{data?.boothNo || selectedBoothNo} &middot; {data?.totalElectors || 0} Voters (
          {data?.householdCount || 0} Doors)
        </div>
      </div>

      {/* Tier 2: Elector Filter Controls */}
      {viewMode !== 'padayatra' && (
        <div className="p-3 bg-white border-x border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 flex-1 min-w-[280px] flex-wrap">
            {/* Search box */}
            <div className="relative w-64 max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search EPIC, panna page..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-6 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-slate-900"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Gender */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs shrink-0">
              {(['ALL', 'M', 'F'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => {
                    setGenderFilter(g);
                    setCurrentPage(1);
                  }}
                  className={`px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                    genderFilter === g
                      ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {g === 'ALL' ? 'All' : g === 'M' ? 'M' : 'F'}
                </button>
              ))}
            </div>

            {/* Community */}
            <select
              value={casteCategoryFilter}
              onChange={(e) => {
                setCasteCategoryFilter(e.target.value as 'ALL' | CasteCategory);
                setCurrentPage(1);
              }}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2 py-1 text-slate-700 font-medium cursor-pointer"
            >
              <option value="ALL">All Communities</option>
              <option value="BC">
                BC ({casteSummary.BC}) · {data ? Math.round((casteSummary.BC / data.totalElectors) * 100) : 0}%
              </option>
              <option value="SC">
                SC ({casteSummary.SC}) · {data ? Math.round((casteSummary.SC / data.totalElectors) * 100) : 0}%
              </option>
              <option value="ST">
                ST ({casteSummary.ST}) · {data ? Math.round((casteSummary.ST / data.totalElectors) * 100) : 0}%
              </option>
              <option value="OC">
                OC ({casteSummary.OC}) · {data ? Math.round((casteSummary.OC / data.totalElectors) * 100) : 0}%
              </option>
              <option value="Minority">
                Minority ({casteSummary.Minority}) ·{' '}
                {data ? Math.round((casteSummary.Minority / data.totalElectors) * 100) : 0}%
              </option>
            </select>

            {/* Age */}
            <select
              disabled
              className="text-xs bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 text-slate-400 cursor-not-allowed"
              title="Age data to be added from official rolls"
            >
              <option value="ALL">Age: Data to be added</option>
            </select>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Showing {filteredCount} of {data?.totalElectors || 0} electors
          </div>
        </div>
      )}
    </div>
  );
};
