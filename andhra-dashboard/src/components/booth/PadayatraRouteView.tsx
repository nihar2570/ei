import React from 'react';
import {
  Footprints,
  Compass,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
  LayoutGrid,
  Sparkles,
  Printer,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import type { PadayatraHouseStop } from '../../data/padayatraService';
import { formatHouseholdMembers } from '../../utils/voterRollUtils';

interface PadayatraMetrics {
  totalStops: number;
  totalVoters: number;
  visitedCount: number;
  progressPct: number;
  criticalSwingCount: number;
  youthHomes: number;
  womenHomes: number;
  estMinutes: number;
}

interface PadayatraRouteViewProps {
  padayatraMode: 'strategic_swing' | 'sequential_street';
  setPadayatraMode: (mode: 'strategic_swing' | 'sequential_street') => void;
  boothNo: number;
  mandalName?: string;
  currentAcName: string;
  visitedDoors: Set<string>;
  toggleVisitedDoor: (doorNo: string) => void;
  setVisitedDoors: React.Dispatch<React.SetStateAction<Set<string>>>;
  padayatraMetrics: PadayatraMetrics;
  padayatraLayout: 'sheet' | 'cards';
  setPadayatraLayout: (layout: 'sheet' | 'cards') => void;
  padayatraPersuadabilityFilter: string;
  setPadayatraPersuadabilityFilter: (val: string) => void;
  padayatraVisitedFilter: 'ALL' | 'PENDING' | 'VISITED';
  setPadayatraVisitedFilter: (val: 'ALL' | 'PENDING' | 'VISITED') => void;
  showBoothCheatSheet: boolean;
  setShowBoothCheatSheet: React.Dispatch<React.SetStateAction<boolean>>;
  boothKeySchemes: Array<{ caste: string; scheme: string; points: string[] }>;
  padayatraStops: PadayatraHouseStop[];
  filteredPadayatraStops: PadayatraHouseStop[];
  copiedTalkingPointDoor: string | null;
  handleCopyPadayatraScript: (stop: PadayatraHouseStop) => void;
  handleShareWhatsApp: (stop: PadayatraHouseStop) => void;
  expandedCardPitch: Set<string>;
  toggleCardPitch: (doorNo: string) => void;
  expandedDoorDetails: Set<string>;
  toggleExpandDoor: (doorNo: string) => void;
}

export const PadayatraRouteView: React.FC<PadayatraRouteViewProps> = ({
  padayatraMode,
  setPadayatraMode,
  boothNo,
  mandalName,
  currentAcName,
  visitedDoors,
  toggleVisitedDoor,
  setVisitedDoors,
  padayatraMetrics,
  padayatraLayout,
  setPadayatraLayout,
  padayatraPersuadabilityFilter,
  setPadayatraPersuadabilityFilter,
  padayatraVisitedFilter,
  setPadayatraVisitedFilter,
  showBoothCheatSheet,
  setShowBoothCheatSheet,
  boothKeySchemes,
  padayatraStops,
  filteredPadayatraStops,
  copiedTalkingPointDoor,
  handleCopyPadayatraScript,
  handleShareWhatsApp,
  expandedCardPitch,
  toggleCardPitch,
  expandedDoorDetails,
  toggleExpandDoor,
}) => {
  return (
    <div className="space-y-4">
      {/* Padayatra Route Controls & KPI Summary Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 text-white rounded-xl p-4 shadow-sm border border-amber-500/30 space-y-3 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5" />
                1-Click MLA Padayatra Route Planner
              </span>
              <span className="text-xs text-amber-300 font-mono">
                Polling Station #{boothNo} {mandalName ? `(${mandalName})` : ''}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-100">
              {padayatraMode === 'strategic_swing'
                ? '🎯 Strategic Swing Focus: Ranked by electoral impact & persuadability yield'
                : '🚶 Sequential Street Walking Path: Consecutive door order (minimizes walking distance)'}
            </h4>
          </div>

          {/* Route Mode Switcher */}
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-amber-400/30 text-xs">
            <button
              type="button"
              onClick={() => setPadayatraMode('strategic_swing')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                padayatraMode === 'strategic_swing'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Strategic Swing</span>
            </button>
            <button
              type="button"
              onClick={() => setPadayatraMode('sequential_street')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                padayatraMode === 'sequential_street'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-amber-200 hover:text-white'
              }`}
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>Street Sequence</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Real-time Walking Tracker */}
        <div className="pt-2 border-t border-amber-500/20 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-200 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Padayatra Progress:{' '}
              <strong className="text-white font-mono">{padayatraMetrics.visitedCount}</strong> of{' '}
              <strong className="text-white font-mono">{padayatraMetrics.totalStops}</strong> doors visited (
              {padayatraMetrics.progressPct}%)
            </span>
            {padayatraMetrics.visitedCount > 0 && (
              <button
                type="button"
                onClick={() => setVisitedDoors(new Set())}
                className="text-[11px] text-amber-300 hover:text-amber-100 underline cursor-pointer"
              >
                Reset Checklist
              </button>
            )}
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-amber-500/20">
            <div
              className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-300"
              style={{ width: `${padayatraMetrics.progressPct}%` }}
            />
          </div>
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-2 border-t border-amber-500/20 text-xs">
          <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">
            <span className="text-[10px] text-amber-300/80 block uppercase">Total Route Stops</span>
            <span className="text-sm font-black font-mono text-white">
              {padayatraMetrics.totalStops} Doors
            </span>
          </div>
          <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">
            <span className="text-[10px] text-amber-300/80 block uppercase">Electors Covered</span>
            <span className="text-sm font-black font-mono text-white">
              {padayatraMetrics.totalVoters} Voters
            </span>
          </div>
          <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">
            <span className="text-[10px] text-amber-300/80 block uppercase">Critical Swing Homes</span>
            <span className="text-sm font-black font-mono text-amber-300">
              {padayatraMetrics.criticalSwingCount}
            </span>
          </div>
          <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">
            <span className="text-[10px] text-amber-300/80 block uppercase">Youth (18–25) Homes</span>
            <span className="text-sm font-black font-mono text-indigo-300">
              {padayatraMetrics.youthHomes}
            </span>
          </div>
          <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">
            <span className="text-[10px] text-amber-300/80 block uppercase">Women Voters Homes</span>
            <span className="text-sm font-black font-mono text-pink-300">
              {padayatraMetrics.womenHomes}
            </span>
          </div>
          <div className="bg-black/30 p-2 rounded-lg border border-amber-500/20">
            <span className="text-[10px] text-amber-300/80 block uppercase">Est. Walk Duration</span>
            <span className="text-sm font-black font-mono text-emerald-300">
              ~{padayatraMetrics.estMinutes} mins
            </span>
          </div>
        </div>
      </div>

      {/* Padayatra Toolbar: Layout Switcher, Filters & Print Walking Sheet */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Layout Switcher */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs shrink-0">
            <button
              type="button"
              onClick={() => setPadayatraLayout('sheet')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                padayatraLayout === 'sheet'
                  ? 'bg-white text-indigo-700 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Walking Sheet (Compact)</span>
            </button>
            <button
              type="button"
              onClick={() => setPadayatraLayout('cards')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                padayatraLayout === 'cards'
                  ? 'bg-white text-indigo-700 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Stop Cards</span>
            </button>
          </div>

          {/* Filters */}
          <select
            value={padayatraPersuadabilityFilter}
            onChange={(e) => setPadayatraPersuadabilityFilter(e.target.value)}
            className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-700 font-medium cursor-pointer"
          >
            <option value="ALL">All Persuadability</option>
            <option value="High Persuadable">⚡ High Persuadable</option>
            <option value="Lean Support">🎯 Lean Support</option>
            <option value="Base Fortress">🛡️ Base Fortress</option>
            <option value="Challenger Lean">⚠️ Challenger Lean</option>
          </select>

          <select
            value={padayatraVisitedFilter}
            onChange={(e) => setPadayatraVisitedFilter(e.target.value as 'ALL' | 'PENDING' | 'VISITED')}
            className="px-2 py-1 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-700 font-medium cursor-pointer"
          >
            <option value="ALL">All Doors ({padayatraStops.length})</option>
            <option value="PENDING">Pending Walk ({padayatraStops.length - visitedDoors.size})</option>
            <option value="VISITED">Visited ({visitedDoors.size})</option>
          </select>

          <button
            type="button"
            onClick={() => setShowBoothCheatSheet(!showBoothCheatSheet)}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
              showBoothCheatSheet
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-3 h-3 text-indigo-500" />
            <span>{showBoothCheatSheet ? 'Hide Master Brief' : 'Show Master Brief'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="px-3 py-1 bg-slate-900 hover:bg-black text-amber-300 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            title="Print clean 2-page walking sheet for field volunteers"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Walking Sheet</span>
          </button>
        </div>
      </div>

      {/* Master Booth Talking Points Reference Brief (Displayed ONCE for the whole booth) */}
      {showBoothCheatSheet && (
        <div className="bg-white rounded-xl border border-indigo-100 p-3.5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                Master Field Reference
              </span>
              <h4 className="text-xs font-black text-slate-900">
                Booth #{boothNo} Core Campaign Talking Points
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">
              Use these core pillars as needed across all doors
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Pillar 1: Dominant Caste Welfare Schemes */}
            <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 space-y-1.5">
              <span className="text-[10px] font-black text-blue-900 uppercase tracking-wide flex items-center gap-1">
                🏛️ Key Community Schemes in this Booth:
              </span>
              <div className="space-y-1.5">
                {boothKeySchemes.map((s, idx) => (
                  <div key={idx} className="text-[11px] text-slate-800">
                    <strong className="text-blue-800 font-bold">{s.caste}:</strong> {s.scheme} &middot;{' '}
                    <span className="text-slate-600">{s.points[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pillar 2: Demographic / Family Guarantees */}
            <div className="p-2.5 bg-pink-50/50 rounded-lg border border-pink-100 space-y-1.5">
              <span className="text-[10px] font-black text-pink-900 uppercase tracking-wide flex items-center gap-1">
                👥 Demographic Guarantees:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-700">
                <li>
                  <strong className="text-pink-800">Youth (18–25):</strong> APPSC annual job calendar &amp;
                  Mega DSC recruitment drive.
                </li>
                <li>
                  <strong className="text-pink-800">Women:</strong> Aadabidda Nidhi ₹1,500/m aid, Deepam 3 gas
                  cylinders &amp; free bus travel.
                </li>
                <li>
                  <strong className="text-pink-800">Seniors (60+):</strong> NTR Bharosa monthly social security
                  pension to ₹4,000.
                </li>
              </ul>
            </div>

            {/* Pillar 3: Local Constituency Issue */}
            <div className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-100 space-y-1.5">
              <span className="text-[10px] font-black text-amber-900 uppercase tracking-wide flex items-center gap-1">
                📍 Local Ground Concern ({currentAcName}):
              </span>
              <p className="text-[11px] text-slate-900 font-bold">
                {padayatraStops[0]?.talkingPoints?.hyperLocalIssue?.concern ||
                  'Local infrastructure & civic amenities'}
              </p>
              <p className="text-[11px] text-slate-600">
                {padayatraStops[0]?.talkingPoints?.hyperLocalIssue?.pledge ||
                  'Prioritize development and community welfare funds'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: COMPACT FIELD WALKING SHEET (ROSTER TABLE) */}
      {padayatraLayout === 'sheet' ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3 w-10 text-center">✓</th>
                <th className="py-2.5 px-3 w-12 text-center font-mono">Stop</th>
                <th className="py-2.5 px-3 w-20 font-mono">Door</th>
                <th className="py-2.5 px-3 min-w-[200px]">Head of Household</th>
                <th className="py-2.5 px-3 w-44 whitespace-nowrap">Est. Caste</th>
                <th className="py-2.5 px-3 w-16 text-center">Voters</th>
                <th className="py-2.5 px-3 w-24 text-center whitespace-nowrap">Triage</th>
                <th className="py-2.5 px-3 w-32 text-center hidden print:table-cell">Field Notes</th>
                <th className="py-2.5 px-3 w-28 text-center print:hidden whitespace-nowrap pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-800">
              {filteredPadayatraStops.map((stop) => {
                const isVisited = visitedDoors.has(stop.doorNumber);
                return (
                  <React.Fragment key={stop.doorNumber}>
                    {/* Row 1: Household Roster Details */}
                    <tr
                      className={`transition-colors hover:bg-slate-50/80 ${
                        isVisited ? 'bg-emerald-50/30' : 'bg-white'
                      }`}
                    >
                      <td className="pt-2.5 pb-1 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isVisited}
                          onChange={() => toggleVisitedDoor(stop.doorNumber)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer w-3.5 h-3.5 print:hidden"
                        />
                        <span className="hidden print:inline-block w-3.5 h-3.5 border border-slate-400 rounded-xs" />
                      </td>
                      <td className="pt-2.5 pb-1 px-3 text-center font-mono font-bold text-slate-600">
                        #{stop.stopNumber}
                      </td>
                      <td className="pt-2.5 pb-1 px-3 font-mono font-bold text-slate-900">
                        {stop.doorNumber}
                      </td>
                      <td className="pt-2.5 pb-1 px-3 min-w-[200px]">
                        <div className="font-bold text-slate-900">{stop.headOfHouse}</div>
                        <div className="text-[10px] text-slate-500 font-medium truncate max-w-md">
                          {formatHouseholdMembers(stop.headOfHouse, stop.voters)}
                        </div>
                      </td>
                      <td className="pt-2.5 pb-1 px-3 whitespace-nowrap">
                        <div
                          className="inline-flex items-center gap-1.5 whitespace-nowrap cursor-help"
                          title={`Primary Bloc: ${stop.householdCaste.primaryBloc}\nDetailed Sub-Caste: ${stop.householdCaste.casteName}\nBasis: ${stop.householdCaste.sourceBasis}`}
                        >
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${stop.householdCaste.color.badge}`}
                          >
                            {stop.householdCaste.primaryBloc}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 font-semibold whitespace-nowrap">
                            {stop.householdCaste.probabilityPercent}
                          </span>
                        </div>
                      </td>
                      <td className="pt-2.5 pb-1 px-3 text-center font-mono font-bold">
                        <span>{stop.voterCount}</span>
                        <div className="flex justify-center gap-0.5 mt-0.5">
                          {stop.hasYouth && (
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Youth in home" />
                          )}
                          {stop.hasWomen && (
                            <span className="w-1.5 h-1.5 rounded-full bg-pink-500" title="Women in home" />
                          )}
                          {stop.hasSenior && (
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" title="Senior in home" />
                          )}
                        </div>
                      </td>
                      <td className="pt-2.5 pb-1 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                            stop.persuadability === 'High Persuadable'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : stop.persuadability === 'Lean Support'
                              ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                              : stop.persuadability === 'Base Fortress'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : 'bg-rose-100 text-rose-900 border-rose-300'
                          }`}
                        >
                          {stop.persuadability === 'High Persuadable'
                            ? '⚡ Swing'
                            : stop.persuadability === 'Lean Support'
                            ? '🎯 Lean'
                            : stop.persuadability === 'Base Fortress'
                            ? '🛡️ Fortress'
                            : 'Challenger'}
                        </span>
                      </td>
                      <td className="pt-2.5 pb-1 px-3 hidden print:table-cell text-slate-300 font-mono text-[9px] text-center">
                        ________________
                      </td>
                      <td className="pt-2.5 pb-1 px-3 text-center print:hidden pr-4 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleShareWhatsApp(stop)}
                            className="p-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                            title="Share household brief on WhatsApp"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyPadayatraScript(stop)}
                            className="p-1.5 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
                            title="Copy script"
                          >
                            {copiedTalkingPointDoor === stop.doorNumber ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Row 2: Personalized Doorway Hook */}
                    <tr
                      className={`transition-colors border-b border-slate-200 ${
                        isVisited ? 'bg-emerald-50/20' : 'bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <td colSpan={8} className="pt-0.5 pb-2.5 px-3 pr-4">
                        <div className="flex items-start sm:items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50/60 border border-amber-200/70 text-slate-800 print:bg-white print:border-slate-300">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded border border-amber-300 shrink-0 print:border-slate-400 print:text-slate-900 print:bg-slate-100">
                            <Sparkles className="w-3 h-3 text-amber-600 print:hidden" />
                            Personalized Doorway Hook
                          </span>
                          <p className="text-[11px] text-slate-800 font-medium italic leading-relaxed min-w-0">
                            &ldquo;{stop.talkingPoints.quickElevatorPitch}&rdquo;
                          </p>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* VIEW MODE 2: STOP CARDS */
        <div className="space-y-2.5">
          {filteredPadayatraStops.map((stop) => {
            const isVisited = visitedDoors.has(stop.doorNumber);
            const isExpandedPitch = expandedCardPitch.has(stop.doorNumber);
            const isExpandedVoters = expandedDoorDetails.has(stop.doorNumber);
            return (
              <div
                key={stop.doorNumber}
                className={`bg-white rounded-xl border transition-all shadow-2xs overflow-hidden ${
                  isVisited
                    ? 'border-emerald-300 bg-emerald-50/20 opacity-80'
                    : stop.persuadability === 'High Persuadable'
                    ? 'border-amber-300 ring-1 ring-amber-200'
                    : 'border-slate-200'
                }`}
              >
                <div className="p-3 space-y-2">
                  {/* Row 1: Header & Quick Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-900 text-amber-300">
                        Stop #{stop.stopNumber}
                      </span>
                      <span className="font-bold text-sm text-slate-900">
                        Door #{stop.doorNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Head: <strong className="text-slate-800">{stop.headOfHouse}</strong>
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-help ${stop.householdCaste.color.badge}`}
                        title={`Primary Bloc: ${stop.householdCaste.primaryBloc}\nDetailed Sub-Caste: ${stop.householdCaste.casteName}\nBasis: ${stop.householdCaste.sourceBasis}`}
                      >
                        {stop.householdCaste.primaryBloc} ({stop.householdCaste.probabilityPercent})
                      </span>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                          stop.persuadability === 'High Persuadable'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : stop.persuadability === 'Lean Support'
                            ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                            : stop.persuadability === 'Base Fortress'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-rose-100 text-rose-900 border-rose-300'
                        }`}
                      >
                        {stop.persuadability}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleShareWhatsApp(stop)}
                        className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleVisitedDoor(stop.doorNumber)}
                        className={`px-2 py-1 rounded font-bold text-[11px] flex items-center gap-1 border cursor-pointer ${
                          isVisited
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        <CheckCircle2
                          className={`w-3 h-3 ${isVisited ? 'text-emerald-600' : 'text-slate-400'}`}
                        />
                        <span>{isVisited ? 'Visited ✓' : 'Mark Visited'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Row 2: Personalized 1-Liner Doorway Hook */}
                  <div className="p-2 rounded-lg bg-amber-50/50 border border-amber-200/60 text-xs flex items-start justify-between gap-2">
                    <p className="text-slate-800 font-medium italic text-[11px]">
                      &ldquo;{stop.talkingPoints.openingGreeting} {stop.talkingPoints.quickElevatorPitch}&rdquo;
                    </p>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleExpandDoor(stop.doorNumber)}
                        className="text-[10px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                      >
                        {isExpandedVoters ? 'Hide Voters' : `${stop.voterCount} Voters`}
                      </button>
                      <span className="text-slate-300">&middot;</span>
                      <button
                        type="button"
                        onClick={() => toggleCardPitch(stop.doorNumber)}
                        className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer"
                      >
                        {isExpandedPitch ? 'Hide Schemes ▲' : 'View Schemes ▼'}
                      </button>
                    </div>
                  </div>

                  {/* Collapsible Voters Strip */}
                  {isExpandedVoters && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                      {stop.voters.map((v) => (
                        <div key={v.epic} className="p-1 rounded bg-white border border-slate-200 text-[11px]">
                          <span className="font-bold text-slate-800 block truncate">
                            {v.name === 'Data to be added' ? (
                              <span className="text-slate-400 font-mono italic font-normal">
                                Data to be added
                              </span>
                            ) : (
                              v.name
                            )}
                          </span>
                          <span className="font-mono text-[9px] text-slate-500">
                            ({v.gender}) &middot; <span className="text-slate-400 italic">Data to be added</span>{' '}
                            &middot; {v.triageTag}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Collapsible Full Talking Points Details */}
                  {isExpandedPitch && (
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-blue-700 uppercase">
                          🏛️ {stop.talkingPoints.communityPitch.heading}
                        </span>
                        <p className="text-[11px] text-slate-600">
                          {stop.talkingPoints.communityPitch.points[0]}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-pink-700 uppercase">
                          👥 Family Focus
                        </span>
                        <p className="text-[11px] text-slate-600">
                          {stop.talkingPoints.demographicPitch.points[0]}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-700 uppercase">
                          📍 Local Concern
                        </span>
                        <p className="text-[11px] text-slate-600">
                          {stop.talkingPoints.hyperLocalIssue.pledge}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
