import React from 'react';
import { Search, Building } from 'lucide-react';
import type { MandalDetail } from '../../data/mandalData';
import { FORM_20_URLS } from '../../data/form20Urls';

interface BoothDirectorySidebarProps {
  filteredBoothsList: any[];
  allBoothsCount: number;
  selectedBoothNo: number;
  onSelectBooth: (boothNo: number) => void;
  boothSearch: string;
  setBoothSearch: (val: string) => void;
  mandals: MandalDetail[];
  boothFilterMandal: string;
  setBoothFilterMandal: (val: string) => void;
  selectedAcNo?: number;
}

export const BoothDirectorySidebar: React.FC<BoothDirectorySidebarProps> = ({
  filteredBoothsList,
  allBoothsCount,
  selectedBoothNo,
  onSelectBooth,
  boothSearch,
  setBoothSearch,
  mandals,
  boothFilterMandal,
  setBoothFilterMandal,
  selectedAcNo = 1,
}) => {
  const form20Url = FORM_20_URLS[selectedAcNo];

  return (
    <div id="booth-catalog" className="lg:col-span-3 space-y-3 print:hidden scroll-mt-24">
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-indigo-600" />
            Polling Stations ({filteredBoothsList.length})
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            Total: {allBoothsCount}
          </span>
        </div>

        {/* Booth Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search booth no. or school..."
            value={boothSearch}
            onChange={(e) => setBoothSearch(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden text-slate-900"
          />
        </div>

        {/* Mandal Filter */}
        {mandals.length > 0 && (
          <div className="space-y-1.5">
            <select
              value={boothFilterMandal}
              onChange={(e) => setBoothFilterMandal(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 font-medium cursor-pointer"
            >
              <option value="ALL">All Mandals ({mandals.length})</option>
              {mandals.map((m) => (
                <option key={m.mandal_id} value={m.name}>
                  {m.name} ({m.booths} booths)
                </option>
              ))}
            </select>

            <div className="flex flex-wrap gap-1 pt-0.5">
              <button
                type="button"
                onClick={() => setBoothFilterMandal('ALL')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer ${
                  boothFilterMandal === 'ALL'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {mandals.map((m) => {
                const isSelected = boothFilterMandal.toLowerCase() === m.name.toLowerCase();
                return (
                  <button
                    key={m.mandal_id}
                    type="button"
                    onClick={() => setBoothFilterMandal(isSelected ? 'ALL' : m.name)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer truncate max-w-[90px] ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title={`${m.name} (${m.booths} booths)`}
                  >
                    {m.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Scrollable Booth List */}
        <div className="max-h-[640px] overflow-y-auto space-y-1.5 pr-1">
          {filteredBoothsList.map((b) => {
            const isSelected = b.boothNo === selectedBoothNo;
            const pdfUrl =
              b.roll2026Url ||
              `https://voters.eci.gov.in/eroll/2026/s01/sir-draftroll/${selectedAcNo}/2026-EROLLGEN-S01-${selectedAcNo}-SIR-DraftRoll-Revision1-ENG-${b.boothNo}-WI.pdf`;
            return (
              <div
                key={b.boothNo}
                onClick={() => onSelectBooth(b.boothNo)}
                className={`w-full text-left p-2 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-400 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 font-mono">
                    Booth #{b.boothNo}
                  </span>
                  <div className="flex items-center gap-1">
                    {b.winnerParty && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                          b.tier === 'STRONGHOLD'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.tier === 'LEAN'
                            ? 'bg-blue-100 text-blue-800'
                            : b.tier === 'BATTLEGROUND_TOSS_UP'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.winnerParty} +{b.marginPct}%
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-500">
                      {b.electorate}v
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 truncate mt-0.5" title={b.name}>
                  {b.name.replace(`Polling Station #${b.boothNo} - `, '')}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 gap-1">
                  <span className="truncate max-w-[90px]">{b.mandalName}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    {b.isAuthenticExtract && (
                      <span className="text-[9px] font-mono px-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        ✓ SIR 2026
                      </span>
                    )}
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-200 font-bold transition-colors inline-flex items-center gap-0.5 cursor-pointer shadow-3xs"
                      title={`Open Official SIR 2026 Draft Roll PDF for Booth #${b.boothNo}`}
                    >
                      <span>PDF</span>
                      <span className="text-[8px]">↗</span>
                    </a>
                    {form20Url && (
                      <a
                        href={form20Url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 hover:text-emerald-900 border border-emerald-200 font-bold transition-colors inline-flex items-center gap-0.5 cursor-pointer shadow-3xs"
                        title={`Open Official 2024 Form-20 PDF for Booth #${b.boothNo}`}
                      >
                        <span>F20</span>
                        <span className="text-[8px]">↗</span>
                      </a>
                    )}
                    {b.lat && b.lng && (
                      <span className="text-[9px] font-mono text-indigo-500" title={`GPS: ${b.lat}, ${b.lng}`}>
                        📍 GPS
                      </span>
                    )}
                    <span className="text-[9px] px-1 rounded bg-slate-200 text-slate-700 font-medium">
                      {b.dominantCaste}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
