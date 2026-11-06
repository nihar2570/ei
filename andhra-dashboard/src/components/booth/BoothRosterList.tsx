import React from 'react';
import { Users, Map as MapIcon, Target } from 'lucide-react';
import type { BoothDetail } from '../../services/boothSolverEngine';

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

export const BoothRosterList: React.FC<BoothRosterListProps> = ({
  filteredBooths,
  visibleBoothCount,
  setVisibleBoothCount,
  theme,
  acNo,
  targetParty,
  targetColor,
  winnerParty,
  runnerParty,
  standaloneMapOnly = false,
  onNavigateToBoothData,
  onSelectMapBooth,
}) => {
  return (
    <div className={standaloneMapOnly ? 'flex-1 flex flex-col min-h-0 pt-1' : 'pt-1'}>
      <div
        className={`space-y-2 overflow-y-auto pr-1 ${
          standaloneMapOnly ? 'flex-1 min-h-0' : 'max-h-96'
        }`}
      >
        {filteredBooths.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No polling stations match the current filter or search criteria.
          </div>
        ) : (
          filteredBooths.slice(0, visibleBoothCount).map((b) => {
            const isBattleground = b.triage === 'battleground';
            const isFortress = b.triage === 'fortress';
            const isVulnerable = b.triage === 'vulnerable';
            const isLead = b.margin > 0;
            const opponentParty = winnerParty === targetParty ? runnerParty : winnerParty;

            return (
              <div
                key={b.boothNo}
                className={`p-3 rounded-xl border transition-all text-xs space-y-2 ${
                  isBattleground
                    ? theme === 'light'
                      ? 'bg-amber-50/80 border-amber-300 hover:border-amber-500 shadow-2xs'
                      : 'bg-slate-950/80 border-amber-500/40 hover:border-amber-400'
                    : isFortress
                    ? theme === 'light'
                      ? 'bg-emerald-50/80 border-emerald-300 hover:border-emerald-500 shadow-2xs'
                      : 'bg-slate-950/80 border-emerald-500/30 hover:border-emerald-400'
                    : isVulnerable
                    ? theme === 'light'
                      ? 'bg-yellow-50/80 border-yellow-300 hover:border-yellow-500 shadow-2xs'
                      : 'bg-slate-950/80 border-amber-700/30 hover:border-amber-500'
                    : theme === 'light'
                    ? 'bg-rose-50/80 border-rose-300 hover:border-rose-500 shadow-2xs'
                    : 'bg-slate-950/80 border-rose-900/30 hover:border-rose-500'
                }`}
              >
                {/* Top Row: Station No, Name, Location & Status Badge */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono font-bold text-xs px-2 py-0.5 rounded border ${
                          theme === 'light'
                            ? 'bg-slate-200 text-slate-800 border-slate-300'
                            : 'bg-slate-800 text-amber-300 border-slate-700'
                        }`}
                      >
                        PS #{b.boothNo}
                      </span>
                      <span
                        className={`font-bold text-xs sm:text-sm ${
                          theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                        }`}
                      >
                        {b.name}
                      </span>
                    </div>
                    <p className={`text-[11px] ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                      📍 {b.location} &middot;{' '}
                      <span className={`font-medium ${theme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
                        {b.mandalName} Mandal
                      </span>
                    </p>
                  </div>

                  {/* Status Badge & Actions */}
                  <div className="flex items-center gap-2">
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
                      className={`px-2 py-0.5 rounded border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        theme === 'light'
                          ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                          : 'bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border-indigo-700'
                      }`}
                      title="Open full voter roll, EPIC IDs, and Panna pages in standalone tab"
                    >
                      <Users className="w-3 h-3 text-indigo-500" />
                      <span>E-Roll ({b.electorate}) ↗</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigateToBoothData) {
                          onNavigateToBoothData(acNo, b.boothNo, 'padayatra');
                        } else {
                          const url = new URL(window.location.origin + window.location.pathname);
                          url.searchParams.set('tab', 'booth-data');
                          url.searchParams.set('ac', String(acNo));
                          url.searchParams.set('booth', String(b.boothNo));
                          url.searchParams.set('view', 'padayatra');
                          window.open(url.toString(), '_blank');
                        }
                      }}
                      className={`px-2 py-0.5 rounded border text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        theme === 'light'
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-amber-950/80 hover:bg-amber-900 text-amber-200 border-amber-700'
                      }`}
                      title="Generate 1-click MLA Padayatra walking route & door-to-door talking points"
                    >
                      <span>🚶‍♂️ Padayatra Plan ↗</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectMapBooth(b.boothNo)}
                      className={`px-2 py-0.5 rounded border text-[10px] font-medium flex items-center gap-1 cursor-pointer transition-colors ${
                        theme === 'light'
                          ? 'bg-white hover:bg-slate-100 text-indigo-700 border-slate-300'
                          : 'bg-slate-800 hover:bg-indigo-900/60 text-indigo-300 hover:text-white border-slate-700'
                      }`}
                      title="Locate and fly into this booth on the Geospatial Map"
                    >
                      <MapIcon className="w-3 h-3 text-amber-500" />
                      <span>Locate on Map</span>
                    </button>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${
                        isBattleground
                          ? 'bg-amber-500/20 text-amber-600 border-amber-500/40'
                          : isFortress
                          ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40'
                          : isVulnerable
                          ? 'bg-amber-400/20 text-amber-700 border-amber-400/40'
                          : 'bg-rose-500/20 text-rose-600 border-rose-500/40'
                      }`}
                    >
                      {isBattleground
                        ? '🔥 Battleground (≤45 votes)'
                        : isFortress
                        ? '🏰 Fortress Hold'
                        : isVulnerable
                        ? '⚠️ Vulnerable Hold'
                        : '🛑 Hostile Stronghold'}
                    </span>
                  </div>
                </div>

                {/* Middle Row: Form-20 Votes, Electorate, Margin */}
                <div
                  className={`grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t text-[11px] ${
                    theme === 'light' ? 'border-slate-200 text-slate-700' : 'border-slate-800/80 text-slate-200'
                  }`}
                >
                  <div>
                    <span className={`block text-[10px] uppercase ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                      Registered Electors
                    </span>
                    <span className={`font-mono font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                      {b.electorate}
                    </span>
                    <span className={`text-[10px] ml-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                      ({b.pannaPages} pages)
                    </span>
                  </div>

                  <div>
                    <span className={`block text-[10px] uppercase ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                      Voter Turnout
                    </span>
                    <span className={`font-mono font-bold ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-300'}`}>
                      {b.turnoutPct}%
                    </span>
                    <span className={`text-[10px] ml-1 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                      polled
                    </span>
                  </div>

                  <div>
                    <span className={`block text-[10px] uppercase ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                      Form-20 Polled Votes
                    </span>
                    <span className="font-mono">
                      <strong style={{ color: targetColor }}>
                        {targetParty}: {b.targetVotes}
                      </strong>{' '}
                      vs {opponentParty}: {b.opponentVotes}
                    </span>
                  </div>

                  <div>
                    <span className={`block text-[10px] uppercase ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                      Margin Gap
                    </span>
                    <span className={`font-mono font-bold ${isLead ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isLead ? `+${b.margin} lead` : `${b.margin} deficit`}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Panna Pramukh Field Directive */}
                <div
                  className={`pt-1.5 border-t flex items-center justify-between text-[11px] ${
                    theme === 'light' ? 'border-slate-200 text-slate-700' : 'border-slate-800/60 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>
                      <strong>Panna Directive:</strong> {b.actionNote}
                    </span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination / Show More */}
      {filteredBooths.length > visibleBoothCount && (
        <div
          className={`pt-2 border-t flex justify-between items-center text-xs shrink-0 ${
            theme === 'light' ? 'border-slate-200 text-slate-600' : 'border-slate-800 text-slate-400'
          }`}
        >
          <span className="font-mono text-[11px]">
            Showing {visibleBoothCount} of {filteredBooths.length} stations
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setVisibleBoothCount((prev) => Math.min(filteredBooths.length, prev + 25))}
              className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer text-xs font-medium ${
                theme === 'light'
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
              }`}
            >
              Load 25 More
            </button>
            <button
              onClick={() => setVisibleBoothCount(filteredBooths.length)}
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer text-xs font-bold"
            >
              Show All ({filteredBooths.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
