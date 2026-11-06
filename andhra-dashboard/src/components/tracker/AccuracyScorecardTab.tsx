import React, { useMemo } from 'react';
import { Clock, CheckCircle2, Sparkles, Award } from 'lucide-react';
import type { AccuracyRow, ElectionCycle } from './pollingData';
import { SURVEY_DATA_POINTS_2024 } from './pollingData';

interface LiveSimulationData {
  totalSeats: number;
  tally: Record<string, number>;
  ndaSeats: number;
  ysrcpSeats: number;
  jspSeats: number;
  votePcts: {
    TDP: number;
    YSRCP: number;
    JSP: number;
    BJP: number;
    NDA: number;
  };
}

interface AccuracyScorecardTabProps {
  electionCycle: ElectionCycle;
  liveSimulationData: LiveSimulationData;
  isTriangularSolo: boolean;
  activePreset?: string;
  onApplyPreset?: (presetKey: string) => void;
}

export const AccuracyScorecardTab: React.FC<AccuracyScorecardTabProps> = ({
  electionCycle,
  liveSimulationData,
  isTriangularSolo,
  activePreset,
  onApplyPreset,
}) => {
  // 2029 Strategic Scenarios List
  const scenarios2029: AccuracyRow[] = useMemo(() => [
    {
      agency: '1. 2029 NDA Defense (Alliance Holds)',
      type: '2029 Strategic Scenario',
      date: 'May 2029',
      sample: '175 Constituencies',
      ndaSeatsEst: '139 Seats (TDP 115, JSP 18, BJP 6)',
      ysrcpSeatsEst: '36 Seats',
      ndaVotePct: 51.8,
      ysrcpVotePct: 44.5,
      calledWinner: 'NDA',
      verdictDelta: 'Alliance holds majority despite natural 5-yr fatigue',
      accuracyGrade: 'Forecast',
      presetKey: 'nda_2029_defense',
    },
    {
      agency: '2. 2029 Triangular Contest (JSP Solo 175)',
      type: '2029 Strategic Scenario',
      date: 'May 2029',
      sample: '175 Constituencies',
      ndaSeatsEst: '84 Seats (TDP Solo)',
      ysrcpSeatsEst: '61 Seats',
      jspSeatsEst: '28 Seats (JSP Solo)',
      ndaVotePct: 38.2,
      ysrcpVotePct: 39.1,
      jspVotePct: 21.4,
      calledWinner: 'Hung',
      verdictDelta: 'Alliance breaks; volatile 3-corner dogfights across 50+ seats',
      accuracyGrade: 'Forecast',
      presetKey: 'triangular_2029_solo',
    },
    {
      agency: '3. 2029 Realigned (TDP Solo vs JSP+BJP vs YSRCP)',
      type: '2029 Strategic Scenario',
      date: 'May 2029',
      sample: '175 Constituencies',
      ndaSeatsEst: '78 Seats (TDP Solo)',
      ysrcpSeatsEst: '59 Seats',
      jspSeatsEst: '38 Seats (JSP+BJP)',
      ndaVotePct: 36.8,
      ysrcpVotePct: 38.5,
      jspVotePct: 23.2,
      calledWinner: 'Hung',
      verdictDelta: 'JSP+BJP front mounts formidable youth/Kapu challenge',
      accuracyGrade: 'Forecast',
      presetKey: 'tdp_vs_jsp_bjp_2029',
    },
    {
      agency: '4. 2029 YSRCP Resurgence (Welfare Backlash)',
      type: '2029 Strategic Scenario',
      date: 'May 2029',
      sample: '175 Constituencies',
      ndaSeatsEst: '77 Seats (TDP 68, JSP 7, BJP 2)',
      ysrcpSeatsEst: '98 Seats (Majority)',
      ndaVotePct: 46.5,
      ysrcpVotePct: 48.2,
      calledWinner: 'YSRCP',
      verdictDelta: 'Welfare disbursement delays flip 30+ rural seats past 88 mark',
      accuracyGrade: 'Forecast',
      presetKey: 'ysrcp_2029_resurgence',
    },
    {
      agency: '5. 2029 NDA Max Delivery Surge (170+ Clean Sweep)',
      type: '2029 Strategic Scenario',
      date: 'May 2029',
      sample: '175 Constituencies',
      ndaSeatsEst: '171 Seats (TDP 141, JSP 21, BJP 9)',
      ysrcpSeatsEst: '4 Seats',
      ndaVotePct: 57.2,
      ysrcpVotePct: 37.5,
      calledWinner: 'NDA',
      verdictDelta: 'Amaravati completion & industrial jobs spark pro-incumbency sweep',
      accuracyGrade: 'Forecast',
      presetKey: 'nda_2029_max_surge',
    },
    {
      agency: '★ Active Live Simulation (Your Custom Sliders)',
      type: '2029 Strategic Scenario',
      date: 'Live Calculation',
      sample: `${liveSimulationData.totalSeats} ACs Evaluated`,
      ndaSeatsEst: isTriangularSolo
        ? `${liveSimulationData.tally.TDP || 0} TDP / ${liveSimulationData.tally.JSP || 0} JSP`
        : `${liveSimulationData.ndaSeats} NDA Seats`,
      ysrcpSeatsEst: `${liveSimulationData.ysrcpSeats} YSRCP Seats`,
      jspSeatsEst: `${liveSimulationData.jspSeats} JSP Seats`,
      ndaVotePct: isTriangularSolo ? liveSimulationData.votePcts.TDP : liveSimulationData.votePcts.NDA,
      ysrcpVotePct: liveSimulationData.votePcts.YSRCP,
      jspVotePct: liveSimulationData.votePcts.JSP,
      calledWinner: liveSimulationData.ndaSeats >= 88 ? 'NDA' : liveSimulationData.ysrcpSeats >= 88 ? 'YSRCP' : 'Hung',
      verdictDelta: 'Dynamic real-time compound result from your active settings',
      accuracyGrade: 'A+',
    },
  ], [liveSimulationData, isTriangularSolo]);

  if (electionCycle === '2029') {
    return (
      <div className="space-y-4 animate-in fade-in duration-150">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              1. Alliance Cohesion Benchmark
            </span>
            <div className="text-2xl font-black text-white font-mono">139 vs 36</div>
            <p className="text-xs text-slate-400">
              Natural 5-year anti-incumbency (-3.5% swing). When TDP, JSP, and BJP contest collectively, majority holds comfortably.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/40 bg-rose-950/10 space-y-1">
            <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider">
              2. Triangular Volatility Benchmark
            </span>
            <div className="text-2xl font-black text-rose-300 font-mono">84 vs 61 vs 28</div>
            <p className="text-xs text-slate-400">
              JSP contesting 175 seats solo captures ~21% vote share, fragmenting anti-YSRCP consolidation and triggering a Hung Assembly risk.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/60 bg-emerald-950/20 space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
              3. Your Active Simulation Outcome
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {liveSimulationData.ndaSeats} vs {liveSimulationData.ysrcpSeats}
            </div>
            <p className="text-xs text-slate-300">
              Calculated live across all 175 ACs incorporating your active caste swings, turnout adjustments, and 12 ground crises.
            </p>
          </div>
        </div>

        {/* 2029 Scenarios Comparison Table */}
        <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-sm text-white">2029 Strategic Scenario Matrix &amp; Live Simulation Comparison</h3>
            </div>
            <span className="text-xs text-purple-300 font-mono">5 Future Pathways + Live Engine</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">2029 Scenario</th>
                  <th className="py-2.5 px-3">Alliance Coalition Dynamic</th>
                  <th className="py-2.5 px-3 text-amber-400">NDA / TDP Est</th>
                  <th className="py-2.5 px-3 text-sky-400">YSRCP Est</th>
                  <th className="py-2.5 px-3 text-emerald-400">JSP Est</th>
                  <th className="py-2.5 px-3">Projected Mandate</th>
                  <th className="py-2.5 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {scenarios2029.map((row, idx) => {
                  const isLive = row.agency.includes('Live Simulation');
                  const isActivePreset = row.presetKey && activePreset === row.presetKey;

                  return (
                    <tr
                      key={idx}
                      className={
                        isLive
                          ? 'bg-emerald-950/30 font-bold ring-1 ring-emerald-500/30'
                          : isActivePreset
                          ? 'bg-purple-950/30 font-bold'
                          : 'hover:bg-slate-900/50'
                      }
                    >
                      <td className="py-2.5 px-3 text-white font-bold flex items-center gap-1.5">
                        {isLive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        <span>{row.agency}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 max-w-xs">{row.verdictDelta}</td>
                      <td className="py-2.5 px-3 text-amber-300 font-bold">{row.ndaSeatsEst}</td>
                      <td className="py-2.5 px-3 text-sky-300 font-bold">{row.ysrcpSeatsEst}</td>
                      <td className="py-2.5 px-3 text-emerald-300 font-bold">{row.jspSeatsEst || 'Part of NDA'}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            row.calledWinner === 'NDA' || row.calledWinner === 'TDP'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : row.calledWinner === 'YSRCP'
                              ? 'bg-sky-950 text-sky-300 border border-sky-800'
                              : 'bg-purple-950 text-purple-300 border border-purple-800'
                          }`}
                        >
                          {row.calledWinner}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {row.presetKey && onApplyPreset ? (
                          <button
                            onClick={() => onApplyPreset(row.presetKey!)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors border ${
                              isActivePreset
                                ? 'bg-purple-600 text-white border-purple-500'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                            }`}
                          >
                            {isActivePreset ? 'ACTIVE' : 'Apply'}
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-bold">LIVE RESULT</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-1.5 text-xs">
            <span className="font-bold text-purple-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>How Does the 2029 Forecasting Simulator Work?</span>
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              The 2029 forecast bridges the certified 2024 general election baseline with forward-looking political dynamics. When you adjust caste swings in Tab 1, coalition frictions in Tab 2, turnout in Tab 3, or activate any of the 12 ground crises in Tab 4, the terminal 2029 point and trendline splines recalculate in real time to reflect your compounding inputs.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2024 Polls vs Reality Scorecard
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            1. Pre-Poll Survey Consensus
          </span>
          <div className="text-2xl font-black text-white font-mono">112 vs 63</div>
          <p className="text-xs text-slate-400">
            NDA 48.5% | YSRCP 42.5%. Underestimated the silent surge due to fear of local volunteer retaliation.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase tracking-wider">
            2. Exit Poll Consensus
          </span>
          <div className="text-2xl font-black text-indigo-300 font-mono">144 vs 31</div>
          <p className="text-xs text-slate-400">
            NDA 53.8% | YSRCP 40.0%. Accurately predicted an NDA alliance landslide across coastal districts.
          </p>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/60 bg-emerald-950/20 space-y-1">
          <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
            3. Certified Form-20 Ground Reality
          </span>
          <div className="text-2xl font-black text-emerald-400 font-mono">164 vs 11</div>
          <p className="text-xs text-slate-300">
            NDA 55.4% | YSRCP 39.6%. Resulted in an historic 164-seat supermajority with a 15.8% victory margin.
          </p>
        </div>
      </div>

      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">AP 2024 Pollster Accuracy Leaderboard</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">9 Documented Surveys Evaluated</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Agency / Pollster</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Sample</th>
                <th className="py-2.5 px-3 text-amber-400">NDA Est</th>
                <th className="py-2.5 px-3 text-sky-400">YSRCP Est</th>
                <th className="py-2.5 px-3">Winner Call</th>
                <th className="py-2.5 px-3">Delta vs Reality</th>
                <th className="py-2.5 px-3">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {SURVEY_DATA_POINTS_2024.filter((p) => p.isExitPoll).map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50">
                  <td className="py-2.5 px-3 text-white font-bold">{p.pollster}</td>
                  <td className="py-2.5 px-3 text-slate-400">Exit Poll</td>
                  <td className="py-2.5 px-3 text-slate-400">{p.date}</td>
                  <td className="py-2.5 px-3 text-slate-300">{p.sampleSize.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-amber-300 font-bold">{p.ndaSeats} seats</td>
                  <td className="py-2.5 px-3 text-sky-300 font-bold">{p.ysrcpSeats} seats</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                      NDA
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">
                    {Math.abs(p.ndaSeats - 164)} seats delta
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded font-black text-xs bg-emerald-950 text-emerald-300 border border-emerald-700">
                      {Math.abs(p.ndaSeats - 164) <= 12 ? 'A+' : 'A'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
