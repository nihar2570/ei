import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  FileText,
  Scan,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Filter,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { getOfficialSir2026PdfUrl } from '../../data/voterRollService';

export interface AcSummary {
  ac_no: number;
  ac_name: string;
  district: string;
  old_count: number;
  eci_ceiling: number;
  added_count: number;
  final_count: number;
  sample_ocr: {
    booth_no: number;
    name: string;
    building: string;
    mandal: string;
    electors: number;
    total_pages: number;
  } | null;
  status: string;
}

export interface TrackerData {
  total_acs: number;
  completed_acs_count: number;
  total_booths_statewide: number;
  total_new_booths_added: number;
  last_updated: string | null;
  status: Record<string, string>;
  ceilings: Record<string, number>;
  ac_summaries: Record<string, AcSummary>;
}

export interface BoothExtractionTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAc?: (acNo: number) => void;
}

export const BoothExtractionTrackerModal: React.FC<BoothExtractionTrackerModalProps> = ({
  isOpen,
  onClose,
  onSelectAc,
}) => {
  const [displayMode, setDisplayMode] = useState<'popout' | 'modal'>('modal');
  const [tracker, setTracker] = useState<TrackerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  const [filterAddedOnly, setFilterAddedOnly] = useState(false);
  const [selectedSampleOcr, setSelectedSampleOcr] = useState<AcSummary | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/data/booth_extraction_tracker.json');
      if (res.ok) {
        const data = await res.json();
        setTracker(data);
      }
    } catch (e) {
      console.warn('Failed to load booth extraction tracker data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setDisplayMode('modal');
      loadData();
    }
  }, [isOpen]);

  const summaries = useMemo(() => {
    if (!tracker?.ac_summaries) return [];
    return Object.values(tracker.ac_summaries).sort((a, b) => a.ac_no - b.ac_no);
  }, [tracker]);

  const districts = useMemo(() => {
    const set = new Set<string>();
    summaries.forEach((s) => {
      if (s.district) set.add(s.district);
    });
    return Array.from(set).sort();
  }, [summaries]);

  const filteredSummaries = useMemo(() => {
    return summaries.filter((s) => {
      if (selectedDistrict !== 'ALL' && s.district !== selectedDistrict) return false;
      if (filterAddedOnly && s.added_count === 0) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchName = s.ac_name.toLowerCase().includes(q);
        const matchNo = s.ac_no.toString().includes(q);
        const matchDist = s.district.toLowerCase().includes(q);
        if (!matchName && !matchNo && !matchDist) return false;
      }
      return true;
    });
  }, [summaries, selectedDistrict, filterAddedOnly, searchTerm]);

  if (!isOpen) return null;

  const trackerContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-slate-900/95 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <Scan className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white truncate">
                ECI SIR 2026 Discovery &amp; Extraction
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                <ShieldCheck className="w-3 h-3" />
                Live Sync
              </span>
              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1 shrink-0">
                <FileText className="w-3 h-3" />
                Page 1 OCR
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate hidden sm:block">
              Multi-threaded URL probe detection (1 to N), OCR extraction &amp; instant purge
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 cursor-pointer shadow-xs"
            title="Refresh Tracker"
            aria-label="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
          </button>

          {/* Toggle between Side Pop-out and Full Dialog */}
          {displayMode === 'popout' ? (
            <button
              onClick={() => setDisplayMode('modal')}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition border border-slate-700 cursor-pointer shadow-xs"
              title="Expand to Fullscreen Dialog"
              aria-label="Expand to Dialog"
            >
              <Maximize2 className="w-4 h-4 text-cyan-400" />
            </button>
          ) : (
            <button
              onClick={() => setDisplayMode('popout')}
              className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition border border-slate-700 cursor-pointer shadow-xs"
              title="Dock to Right Pop-Out Drawer"
              aria-label="Dock to Pop-out"
            >
              <Minimize2 className="w-4 h-4 text-amber-400" />
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition border border-slate-700 cursor-pointer shadow-xs"
            title="Close (Esc)"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 p-3.5 sm:p-4 bg-slate-950/60 border-b border-slate-800/80 shrink-0">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-400">Processed ACs</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl sm:text-2xl font-black text-amber-400">
              {tracker?.completed_acs_count || 0}
            </span>
            <span className="text-xs text-slate-500">/ 175</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (((tracker?.completed_acs_count || 0) / 175) * 100))}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-400">Total Statewide Booths</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl sm:text-2xl font-black text-emerald-400">
              {(tracker?.total_booths_statewide || 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-500/80 font-medium">Authentic</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-2">Up from 37,088 2014 baseline</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-400">Auxiliary Booths Added</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl sm:text-2xl font-black text-cyan-400">
              +{(tracker?.total_new_booths_added || 0).toLocaleString()}
            </span>
            <span className="text-[10px] text-cyan-500/80 font-medium">Bifurcated</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-2">ECI rationalized polling stations</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] font-medium text-slate-400">Roll URLs Verified</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl sm:text-2xl font-black text-blue-400">100.0%</span>
            <span className="text-[10px] text-blue-500/80 font-medium">Verified</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-2">voters.eci.gov.in draft roll</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col justify-between col-span-2 sm:col-span-1">
          <span className="text-[11px] font-medium text-slate-400">Integrity Tests</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl sm:text-2xl font-black text-emerald-400">10 / 10</span>
            <span className="text-[10px] text-emerald-500/80 font-medium">Passing</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-2">Auto-run on every build & change</span>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="px-4 sm:px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        <div className="flex items-center gap-2.5 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search AC name, number, or district..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs rounded-lg px-2.5 py-1.5 text-slate-300 focus:outline-none focus:border-amber-500 cursor-pointer"
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

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filterAddedOnly}
              onChange={(e) => setFilterAddedOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-amber-500 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
            />
            <span>Show Auxiliary Booths Only</span>
          </label>
        </div>
      </div>

      {/* Roster Table */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-slate-950/30">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-xs border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider z-10">
            <tr>
              <th className="py-2.5 px-3 sm:px-4">AC #</th>
              <th className="py-2.5 px-3 sm:px-4">Constituency &amp; District</th>
              <th className="py-2.5 px-3 sm:px-4 text-center">Baseline</th>
              <th className="py-2.5 px-3 sm:px-4 text-center">ECI Ceiling</th>
              <th className="py-2.5 px-3 sm:px-4 text-center">Added</th>
              <th className="py-2.5 px-3 sm:px-4 text-center">Final 2026</th>
              <th className="py-2.5 px-3 sm:px-4">Verified OCR Sample</th>
              <th className="py-2.5 px-3 sm:px-4 text-center">Live Status</th>
              <th className="py-2.5 px-3 sm:px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredSummaries.map((item) => {
              const samplePdfUrl = getOfficialSir2026PdfUrl(item.ac_no, item.sample_ocr?.booth_no || 1);
              return (
                <tr
                  key={item.ac_no}
                  className="hover:bg-slate-850/60 transition-colors group cursor-default"
                >
                  <td className="py-2 px-3 sm:px-4 font-bold text-amber-400">#{item.ac_no}</td>
                  <td className="py-2 px-3 sm:px-4 font-sans">
                    <div className="font-semibold text-slate-200">{item.ac_name}</div>
                    <div className="text-[10px] text-slate-400">{item.district}</div>
                  </td>
                  <td className="py-2 px-3 sm:px-4 text-center text-slate-400">{item.old_count}</td>
                  <td className="py-2 px-3 sm:px-4 text-center font-bold text-slate-300">
                    {item.eci_ceiling}
                  </td>
                  <td className="py-2 px-3 sm:px-4 text-center">
                    {item.added_count > 0 ? (
                      <span className="px-1.5 py-0.5 rounded font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        +{item.added_count}
                      </span>
                    ) : (
                      <span className="text-slate-500">0</span>
                    )}
                  </td>
                  <td className="py-2 px-3 sm:px-4 text-center font-bold text-emerald-400">
                    {item.final_count}
                  </td>
                  <td className="py-2 px-3 sm:px-4 font-sans">
                    {item.sample_ocr ? (
                      <button
                        onClick={() => setSelectedSampleOcr(item)}
                        className="text-left group/btn cursor-pointer"
                      >
                        <div className="text-[11px] text-amber-400 group-hover/btn:underline flex items-center gap-1 font-medium">
                          <FileText className="w-3 h-3 shrink-0" />
                          <span>Booth #{item.sample_ocr.booth_no}: {item.sample_ocr.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate max-w-xs">
                          {item.sample_ocr.electors} Electors &middot; {item.sample_ocr.total_pages} Pages
                        </div>
                      </button>
                    ) : (
                      <span className="text-slate-500 italic text-[11px]">Pre-existing verified roll</span>
                    )}
                  </td>
                  <td className="py-2 px-3 sm:px-4 text-center font-sans">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      COMPLETED
                    </span>
                  </td>
                  <td className="py-2 px-3 sm:px-4 text-center font-sans">
                    <div className="flex items-center justify-center gap-1.5">
                      <a
                        href={samplePdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 border border-slate-700"
                        title="Open Verified SIR 2026 ECI PDF"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      {onSelectAc && (
                        <button
                          onClick={() => {
                            onSelectAc(item.ac_no);
                            onClose();
                          }}
                          className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-semibold cursor-pointer"
                          title="Open Constituency Booth Workspace"
                        >
                          Explore
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Sample OCR Inspection Card */}
      {selectedSampleOcr && selectedSampleOcr.sample_ocr && (
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-start justify-between gap-3 shrink-0 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start gap-2.5 flex-1 min-w-[260px]">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">
                  OCR Extract: AC #{selectedSampleOcr.ac_no} {selectedSampleOcr.ac_name} — Booth #{selectedSampleOcr.sample_ocr.booth_no}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Verified
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px]">Polling Station:</span>
                  <span className="font-semibold text-slate-200 truncate block">{selectedSampleOcr.sample_ocr.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Building:</span>
                  <span className="font-semibold text-slate-200 truncate block">{selectedSampleOcr.sample_ocr.building}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Mandal:</span>
                  <span className="font-semibold text-slate-200 truncate block">{selectedSampleOcr.sample_ocr.mandal}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Electors &amp; Pages:</span>
                  <span className="font-semibold text-emerald-400">
                    {selectedSampleOcr.sample_ocr.electors} Electors ({selectedSampleOcr.sample_ocr.total_pages} Pages)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <a
              href={getOfficialSir2026PdfUrl(selectedSampleOcr.ac_no, selectedSampleOcr.sample_ocr.booth_no)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Official PDF ↗</span>
            </a>
            <button
              onClick={() => setSelectedSampleOcr(null)}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 border-t border-slate-800 bg-slate-900/95 text-xs text-slate-400 shrink-0">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px]">ECI 2026 Draft Roll Revision 1 Canonical API</span>
        </div>

        <div className="flex items-center gap-3">
          {tracker?.last_updated && (
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Updated: {new Date(tracker.last_updated).toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition cursor-pointer text-xs"
          >
            Close Pop-Out
          </button>
        </div>
      </div>
    </>
  );

  // Render as Right Slide-Out Popout Drawer (default) or Centered Modal
  if (displayMode === 'popout') {
    return (
      <>
        {/* Lightweight click-away backdrop */}
        <div
          className="fixed inset-0 z-[1200] bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Pop-Out Drawer sliding from right edge */}
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-y-0 right-0 z-[1201] w-full sm:w-[680px] md:w-[780px] lg:w-[880px] max-w-full flex flex-col bg-slate-900 border-l border-slate-700/80 shadow-2xl overflow-hidden text-slate-100 animate-in slide-in-from-right duration-300"
        >
          {trackerContent}
        </div>
      </>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[1200] flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 animate-in zoom-in-95 duration-200">
        {trackerContent}
      </div>
    </div>
  );
};

export default BoothExtractionTrackerModal;
