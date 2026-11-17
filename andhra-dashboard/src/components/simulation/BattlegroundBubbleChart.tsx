import React, { useMemo, useState } from 'react';
import { Flame, Sparkles, Target, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import type { SimulatedConstituencyResult, CandidateFrictionValues } from '../../types';
import { getPartyColor } from '../../types';
import type { SimulationTally } from '../../services/simulationEngine';
import { ConstituencyCandidateFrictionPanel } from './ConstituencyCandidateFrictionPanel';

interface BattlegroundBubbleChartProps {
  filteredList: SimulatedConstituencyResult[];
  activeAcNo?: number;
  selectedBubbleAc: number | null;
  setSelectedBubbleAc: (acNo: number | null) => void;
  tierFilter: 'ALL' | 'TOSS_UP' | 'FLIPS' | 'MLA_DRAG';
  setTierFilter: (filter: 'ALL' | 'TOSS_UP' | 'FLIPS' | 'MLA_DRAG') => void;
  tossUpThreshold: number;
  setTossUpThreshold: (val: number) => void;
  tally: SimulationTally;
  onSelectConstituencyDossier?: (acNo: number) => void;
  onNavigateToActions: (acNo?: number) => void;
  candidateFrictionOverrides?: Record<number, CandidateFrictionValues>;
  onUpdateCandidateFriction?: (acNo: number, values: CandidateFrictionValues) => void;
  onResetCandidateFriction?: (acNo: number) => void;
  allConstituencies?: SimulatedConstituencyResult[];
}

export const BattlegroundBubbleChart: React.FC<BattlegroundBubbleChartProps> = ({
  filteredList,
  activeAcNo,
  selectedBubbleAc,
  setSelectedBubbleAc,
  tierFilter,
  setTierFilter,
  tossUpThreshold,
  setTossUpThreshold,
  tally,
  onSelectConstituencyDossier,
  onNavigateToActions,
  candidateFrictionOverrides,
  onUpdateCandidateFriction,
  onResetCandidateFriction,
  allConstituencies,
}) => {
  const [isFrictionPanelOpen, setIsFrictionPanelOpen] = useState(true);

  const mlaDragCount = useMemo(() => {
    if (!candidateFrictionOverrides) return 0;
    return Object.values(candidateFrictionOverrides).filter((cf) => {
      const net = (cf.accessibility || 0) + (cf.syndicateMafia || 0) + (cf.cadreRebel || 0) + (cf.casteFaction || 0);
      return net < 0;
    }).length;
  }, [candidateFrictionOverrides]);

  const selectedConstituency = useMemo(() => {
    const fullList = allConstituencies && allConstituencies.length > 0 ? allConstituencies : filteredList;
    if (selectedBubbleAc) {
      const match = fullList.find((r) => r.ac_no === selectedBubbleAc);
      if (match) return match;
    }
    return filteredList[0] || fullList[0] || null;
  }, [selectedBubbleAc, filteredList, allConstituencies]);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <span>Battleground Triage Bubble Chart</span>
            <span className="text-[11px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
              {filteredList.length} ACs
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Bubble size is <strong className="text-slate-800">inversely proportional</strong> to victory margin (Large = Razor-thin battleground needing urgent intervention; Small = Safe fortress).
          </p>
        </div>

        {/* Tier Filters & Toss-Up Threshold Input */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-xs shadow-2xs">
            <label htmlFor="tossup-threshold-input" className="text-slate-700 font-bold whitespace-nowrap flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Toss-up margin &le;</span>
            </label>
            <input
              id="tossup-threshold-input"
              type="number"
              min="500"
              max="50000"
              step="500"
              value={tossUpThreshold}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setTossUpThreshold(isNaN(val) ? 0 : Math.max(0, val));
              }}
              className="w-16 px-1.5 py-0.5 bg-white border border-slate-300 rounded text-xs font-bold font-mono text-slate-900 text-right focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
            <span className="text-[11px] text-slate-500 font-medium">votes</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTierFilter('TOSS_UP')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                tierFilter === 'TOSS_UP' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3 h-3 text-rose-500" /> Toss-ups ({tally.tossUpCount})
            </button>
            <button
              onClick={() => setTierFilter('FLIPS')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                tierFilter === 'FLIPS' ? 'bg-white text-indigo-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-indigo-600" /> Flips ({tally.flippedCount})
            </button>
            {mlaDragCount > 0 && (
              <button
                onClick={() => setTierFilter('MLA_DRAG')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  tierFilter === 'MLA_DRAG' ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-rose-600 hover:text-rose-900'
                }`}
                title="Filter constituencies facing sitting MLA negative drag"
              >
                <Flame className="w-3 h-3 text-rose-500" /> MLA Drag ({mlaDragCount})
              </button>
            )}
            <button
              onClick={() => setTierFilter('ALL')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                tierFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All 175 ACs
            </button>
          </div>
        </div>
      </div>

      {/* Interactive SVG Bubble Chart Canvas */}
      <div className="relative w-full h-[380px] bg-slate-50/70 rounded-xl border border-slate-200/80 overflow-hidden select-none">
        <svg className="w-full h-full" viewBox="0 0 800 380">
          {/* Background Grid guidelines */}
          <line x1="75" y1="120" x2="780" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="75" y1="190" x2="780" y2="190" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="75" y1="260" x2="780" y2="260" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="427" y1="25" x2="427" y2="350" stroke="#f1f5f9" strokeWidth="1" />

          {/* Y-Axis Labels */}
          <text x="15" y="45" fill="#ca8a04" fontSize="10" fontWeight="bold">
            ▲ TDP/NDA Lead
          </text>
          <text x="15" y="60" fill="#94a3b8" fontSize="9" fontWeight="500">
            +{tierFilter === 'TOSS_UP' ? (tossUpThreshold >= 1000 ? `${(tossUpThreshold/1000).toFixed(0)}k` : tossUpThreshold) : '25k'}
          </text>

          <text x="15" y="187" fill="#64748b" fontSize="10" fontWeight="bold">
            0 Margin
          </text>
          <text x="15" y="198" fill="#94a3b8" fontSize="8" fontWeight="500">
            Tipping Point
          </text>

          <text x="15" y="325" fill="#0284c7" fontSize="10" fontWeight="bold">
            ▼ YSRCP Lead
          </text>
          <text x="15" y="340" fill="#94a3b8" fontSize="9" fontWeight="500">
            -{tierFilter === 'TOSS_UP' ? (tossUpThreshold >= 1000 ? `${(tossUpThreshold/1000).toFixed(0)}k` : tossUpThreshold) : '25k'}
          </text>

          {/* X-Axis Labels */}
          <text x="80" y="368" fill="#94a3b8" fontSize="10" fontWeight="500">
            ← Uttarandhra (Srikakulam, Vizianagaram, Vizag)
          </text>
          <text x="560" y="368" fill="#94a3b8" fontSize="10" fontWeight="500">
            Rayalaseema (Kurnool, Kadapa, Chittoor) →
          </text>

          {/* Bubbles */}
          {filteredList.map((ac) => {
            const cx = 80 + (ac.ac_no / 176) * 690;
            const maxMarginScale = tierFilter === 'TOSS_UP' ? Math.max(2500, tossUpThreshold) : 25000;
            const isNda = ac.simulated.winner_party === 'TDP' || ac.simulated.winner_party === 'JSP' || ac.simulated.winner_party === 'BJP';
            const signedMargin = isNda ? ac.simulated.margin : -ac.simulated.margin;
            const clamped = Math.max(-maxMarginScale, Math.min(maxMarginScale, signedMargin));
            const cy = 190 - (clamped / maxMarginScale) * 135;

            const invRadius = Math.max(7, Math.min(26, 36000 / Math.pow(Math.max(500, ac.simulated.margin), 0.74)));
            const partyColor = getPartyColor(ac.simulated.winner_party);
            const isSelected = ac.ac_no === activeAcNo || ac.ac_no === selectedBubbleAc;
            const isFlipped = ac.simulated.is_flipped;

            return (
              <g
                key={ac.ac_no}
                onClick={() => setSelectedBubbleAc(ac.ac_no)}
                className="cursor-pointer transition-transform duration-200"
              >
                {isFlipped && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={invRadius + 5}
                    fill="none"
                    stroke={partyColor}
                    strokeWidth="2"
                    strokeDasharray="4 3"
                    className="animate-pulse"
                  />
                )}

                {isSelected && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={invRadius + 6}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="2.5"
                  />
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r={invRadius}
                  fill={partyColor}
                  fillOpacity={isSelected ? 0.95 : 0.72}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  className="hover:opacity-100 transition-opacity"
                />

                {invRadius >= 14 && (
                  <text
                    x={cx}
                    y={cy + 3.5}
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    #{ac.ac_no}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Bubble Deep-Dive Inspector Panel */}
      {selectedConstituency && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
          {(() => {
            const currentFriction = candidateFrictionOverrides
              ? candidateFrictionOverrides[selectedConstituency.ac_no]
              : undefined;
            const acFrictionNet = currentFriction
              ? Number(
                  (
                    (currentFriction.accessibility || 0) +
                    (currentFriction.syndicateMafia || 0) +
                    (currentFriction.cadreRebel || 0) +
                    (currentFriction.casteFaction || 0)
                  ).toFixed(1)
                )
              : 0;
            const hasActiveFriction = acFrictionNet !== 0;

            return (
              <>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-slate-900 text-sm">
                        #{selectedConstituency.ac_no} {selectedConstituency.ac_name} ({selectedConstituency.district})
                      </span>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: getPartyColor(selectedConstituency.simulated.winner_party) }}
                      >
                        {selectedConstituency.simulated.winner_party} Win
                      </span>
                      {selectedConstituency.simulated.is_flipped && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded border border-amber-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          FLIPPED from {selectedConstituency.votes_2023.winner_party}
                        </span>
                      )}
                      {hasActiveFriction && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                            acFrictionNet < 0
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          <Flame className="w-3 h-3 text-amber-600" />
                          Candidate Drag: {acFrictionNet > 0 ? `+${acFrictionNet}%` : `${acFrictionNet}%`}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                      <span>
                        Simulated Margin:{' '}
                        <strong>{selectedConstituency.simulated.margin.toLocaleString()}</strong> votes ({selectedConstituency.simulated.margin_pct}%)
                      </span>
                      <span>&middot;</span>
                      <span>
                        Decisive Demographic:{' '}
                        <strong className="text-slate-800">{selectedConstituency.key_demographic}</strong> ({selectedConstituency.key_demographic_pct}%)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {allConstituencies && allConstituencies.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-1">
                        <span className="font-semibold text-slate-600">Switch AC:</span>
                        <select
                          value={selectedConstituency.ac_no}
                          onChange={(e) => setSelectedBubbleAc(Number(e.target.value))}
                          className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-hidden"
                        >
                          {allConstituencies.map((c) => (
                            <option key={c.ac_no} value={c.ac_no}>
                              #{c.ac_no} {c.ac_name} ({c.district})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {onUpdateCandidateFriction && onResetCandidateFriction && (
                      <button
                        type="button"
                        onClick={() => setIsFrictionPanelOpen(!isFrictionPanelOpen)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          hasActiveFriction
                            ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black border-amber-400 shadow-xs ring-2 ring-amber-300'
                            : isFrictionPanelOpen
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300'
                        }`}
                        title="Open 4 candidate friction sliders (Accessibility, Syndicate/Mafia, Rebel Sabotage, Caste Chemistry)"
                      >
                        <Sliders className="w-3.5 h-3.5 text-amber-500" />
                        <span>
                          {hasActiveFriction
                            ? `Candidate Drag: ${acFrictionNet > 0 ? `+${acFrictionNet}%` : `${acFrictionNet}%`} (Active)`
                            : '⚡ Candidate Drag (4 Sliders)'}
                        </span>
                        {isFrictionPanelOpen ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}

                    {onSelectConstituencyDossier && (
                      <button
                        onClick={() => onSelectConstituencyDossier(selectedConstituency.ac_no)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 transition-colors cursor-pointer"
                      >
                        View Dossier
                      </button>
                    )}
                    <button
                      onClick={() => onNavigateToActions(selectedConstituency.ac_no)}
                      className="flex items-center gap-1 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
                    >
                      <Target className="w-3.5 h-3.5" />
                      Target in Playbook 🎯
                    </button>
                  </div>
                </div>

                {/* Step-by-Step Compounded Simulation Impact Breakdown */}
                <div className="w-full pt-2 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">2024 ECI Baseline</span>
                    <span className="font-bold text-slate-800">
                      {selectedConstituency.votes_2023.winner_party} +{selectedConstituency.votes_2023.margin.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Compounded Simulated</span>
                    <span className="font-bold" style={{ color: getPartyColor(selectedConstituency.simulated.winner_party) }}>
                      {selectedConstituency.simulated.winner_party} +{selectedConstituency.simulated.margin.toLocaleString()}
                    </span>
                  </div>

                  <div className="bg-white p-2 rounded-lg border border-slate-200 col-span-2">
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Compounded Simulated Votes</span>
                    <div className="flex items-center gap-2 font-mono font-bold text-xs mt-0.5">
                      <span className="text-amber-700">TDP {selectedConstituency.simulated.party_votes.TDP?.toLocaleString()}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-sky-800">YSRCP {selectedConstituency.simulated.party_votes.YSRCP?.toLocaleString()}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-rose-700">JSP {selectedConstituency.simulated.party_votes.JSP?.toLocaleString()}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-orange-700">BJP {selectedConstituency.simulated.party_votes.BJP?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Expandable 4-Slider Candidate Friction Panel for this AC */}
                {isFrictionPanelOpen && onUpdateCandidateFriction && onResetCandidateFriction && (
                  <div className="w-full mt-3 animate-in fade-in slide-in-from-top-1">
                    <ConstituencyCandidateFrictionPanel
                      key={selectedConstituency.ac_no}
                      acNo={selectedConstituency.ac_no}
                      acName={selectedConstituency.ac_name}
                      district={selectedConstituency.district}
                      incumbentParty={selectedConstituency.votes_2023.winner_party}
                      margin2024={selectedConstituency.votes_2023.margin}
                      currentSimulatedMargin={selectedConstituency.simulated.margin}
                      currentSimulatedWinner={selectedConstituency.simulated.winner_party}
                      isFlipped={selectedConstituency.simulated.is_flipped}
                      frictionValues={candidateFrictionOverrides?.[selectedConstituency.ac_no]}
                      onUpdateFriction={onUpdateCandidateFriction}
                      onResetFriction={onResetCandidateFriction}
                    />
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};
