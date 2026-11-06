import React from 'react';
import type { ElectionCycle, CampaignMilestone, PollDataPoint } from './pollingData';
import { SURVEY_DATA_POINTS_2024 } from './pollingData';

interface TerminalValues {
  ndaVal: number;
  ndaLabel: string;
  ndaParty: string;
  ysrcpVal: number;
  ysrcpLabel: string;
  ysrcpParty: string;
  jspVal: number;
  jspLabel: string;
  jspParty: string;
}

interface PollingChartSvgProps {
  isTriangularSolo: boolean;
  activePreset?: string;
  displayMode: 'VOTE_SHARE' | 'SEATS';
  totalSeats: number;
  timeToX: (t: number) => number;
  valToY: (v: number) => number;
  chartW: number;
  chartH: number;
  paddingLeft: number;
  paddingTop: number;
  svgWidth: number;
  svgHeight: number;
  electionCycle: ElectionCycle;
  activeMilestones: CampaignMilestone[];
  handleJumpToMilestone: (m: CampaignMilestone) => void;
  hoveredMilestone: CampaignMilestone | null;
  setHoveredMilestone: (m: CampaignMilestone | null) => void;
  hoveredPoll: PollDataPoint | null;
  setHoveredPoll: (p: PollDataPoint | null) => void;
  tooltipPos: { x: number; y: number } | null;
  setTooltipPos: (pos: { x: number; y: number } | null) => void;
  ndaSplinePath: string;
  ysrcpSplinePath: string;
  jspSplinePath: string;
  terminalValues: TerminalValues;
  rightBadgePositions: Record<string, number>;
  scrubberTime: number;
}

export const PollingChartSvg: React.FC<PollingChartSvgProps> = ({
  isTriangularSolo,
  activePreset,
  displayMode,
  totalSeats,
  timeToX,
  valToY,
  chartW,
  chartH,
  paddingLeft,
  paddingTop,
  svgWidth,
  svgHeight,
  electionCycle,
  activeMilestones,
  handleJumpToMilestone,
  hoveredMilestone,
  setHoveredMilestone,
  hoveredPoll,
  setHoveredPoll,
  tooltipPos,
  setTooltipPos,
  ndaSplinePath,
  ysrcpSplinePath,
  jspSplinePath,
  terminalValues,
  rightBadgePositions,
  scrubberTime,
}) => {
  return (
    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Legend & 50% / Majority Benchmark Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            <span className="font-bold text-amber-400">
              {isTriangularSolo ? 'TDP Solo' : 'NDA (TDP+JSP+BJP)'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-500 shadow-sm shadow-sky-500/50" />
            <span className="font-bold text-sky-400">YSRCP</span>
          </div>
          {isTriangularSolo && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span className="font-bold text-emerald-400">
                {activePreset === 'tdp_vs_jsp_bjp_2029' ? 'JSP + BJP' : 'JSP Solo'}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span>INC / Others</span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-slate-400">Majority Threshold:</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
            {displayMode === 'VOTE_SHARE' ? '50.0% Mark' : `${Math.ceil(totalSeats / 2)} Seats`}
          </span>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="w-full overflow-x-auto select-none">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto min-w-[760px] font-sans"
        >
          <defs>
            <linearGradient id="chartBgGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0B1120" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.8" />
            </linearGradient>

            <filter id="glowNda" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#F59E0B" floodOpacity="0.35" />
            </filter>
            <filter id="glowYsrcp" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#0284C7" floodOpacity="0.35" />
            </filter>
            <filter id="glowJsp" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#10B981" floodOpacity="0.35" />
            </filter>
          </defs>

          <rect
            x={paddingLeft}
            y={paddingTop}
            width={chartW}
            height={chartH}
            fill="url(#chartBgGrad)"
            rx="6"
          />

          {/* Horizontal Gridlines & Y-Axis Labels */}
          {displayMode === 'VOTE_SHARE' ? (
            (isTriangularSolo ? [15, 25, 35, 45, 50, 60] : [20, 30, 40, 50, 60]).map((val) => {
              const y = valToY(val);
              const is50 = val === 50;
              return (
                <g key={val}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={paddingLeft + chartW}
                    y2={y}
                    stroke={is50 ? '#059669' : '#1E293B'}
                    strokeWidth={is50 ? '1.5' : '1'}
                    strokeDasharray={is50 ? '4 3' : undefined}
                    opacity={is50 ? 0.75 : 0.6}
                  />
                  <text
                    x={paddingLeft - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    fill={is50 ? '#10B981' : '#64748B'}
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight={is50 ? 'bold' : 'normal'}
                  >
                    {val}.0%
                  </text>
                </g>
              );
            })
          ) : (
            [0, Math.round(totalSeats * 0.25), Math.round(totalSeats * 0.5), Math.round(totalSeats * 0.75), totalSeats].map(
              (seatsVal, idx) => {
                const y = valToY(seatsVal);
                const isMajority = idx === 2;
                return (
                  <g key={seatsVal}>
                    <line
                      x1={paddingLeft}
                      y1={y}
                      x2={paddingLeft + chartW}
                      y2={y}
                      stroke={isMajority ? '#059669' : '#1E293B'}
                      strokeWidth={isMajority ? '1.5' : '1'}
                      strokeDasharray={isMajority ? '4 3' : undefined}
                      opacity={isMajority ? 0.75 : 0.6}
                    />
                    <text
                      x={paddingLeft - 8}
                      y={y + 3.5}
                      textAnchor="end"
                      fill={isMajority ? '#10B981' : '#64748B'}
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight={isMajority ? 'bold' : 'normal'}
                    >
                      {seatsVal}
                    </text>
                  </g>
                );
              }
            )
          )}

          {/* Time Axis Gridlines & Labels */}
          {(electionCycle === '2024'
            ? [
                { label: 'Oct 23', date: '2023-10-01' },
                { label: 'Nov', date: '2023-11-01' },
                { label: 'Dec', date: '2023-12-01' },
                { label: 'Jan 24', date: '2024-01-01' },
                { label: 'Feb', date: '2024-02-01' },
                { label: 'Mar', date: '2024-03-01' },
                { label: 'Apr', date: '2024-04-01' },
                { label: 'May', date: '2024-05-01' },
                { label: 'Jun 4', date: '2024-06-04' },
              ]
            : [
                { label: 'Jun 24', date: '2024-06-04' },
                { label: '2025', date: '2025-05-01' },
                { label: '2026', date: '2026-05-01' },
                { label: '2027', date: '2027-05-01' },
                { label: '2028', date: '2028-05-01' },
                { label: 'May 29', date: '2029-05-10' },
              ]
          ).map((tick) => {
            const x = timeToX(new Date(tick.date).getTime());
            return (
              <g key={tick.label}>
                <line
                  x1={x}
                  y1={paddingTop}
                  x2={x}
                  y2={paddingTop + chartH}
                  stroke="#1E293B"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.4"
                />
                <text
                  x={x}
                  y={paddingTop + chartH + 18}
                  textAnchor="middle"
                  fill="#94A3B8"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {tick.label}
                </text>
              </g>
            );
          })}

          {/* Milestone Event Pins at Top Rail */}
          {activeMilestones.map((m, idx) => {
            const x = timeToX(m.timestamp);
            const isHovered = hoveredMilestone?.id === m.id;
            const pinY = paddingTop - 22;
            return (
              <g
                key={m.id}
                className="cursor-pointer group"
                onClick={() => handleJumpToMilestone(m)}
                onMouseEnter={(e) => {
                  setHoveredMilestone(m);
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredMilestone(null)}
              >
                {/* Subtle guide hairline that highlights on hover */}
                <line
                  x1={x}
                  y1={paddingTop - 6}
                  x2={x}
                  y2={paddingTop + chartH}
                  stroke={isHovered ? '#818CF8' : '#334155'}
                  strokeWidth={isHovered ? '1.5' : '1'}
                  strokeDasharray="2 3"
                  opacity={isHovered ? 0.9 : 0.25}
                  className="transition-all"
                />
                {/* Event Pin Pill Marker */}
                <rect
                  x={x - 14}
                  y={pinY}
                  width="28"
                  height="16"
                  rx="4"
                  fill={isHovered ? '#4338CA' : '#1E293B'}
                  stroke={isHovered ? '#A5B4FC' : '#475569'}
                  strokeWidth="1"
                  className="transition-colors"
                />
                <text
                  x={x}
                  y={pinY + 11.5}
                  textAnchor="middle"
                  fill={isHovered ? '#FFFFFF' : '#94A3B8'}
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="monospace"
                  className="pointer-events-none"
                >
                  {`M${idx + 1}`}
                </text>
              </g>
            );
          })}

          {/* Survey Scatter Points for 2024 */}
          {electionCycle === '2024' &&
            SURVEY_DATA_POINTS_2024.map((poll) => {
              const x = timeToX(poll.timestamp);
              const yNda = valToY(displayMode === 'VOTE_SHARE' ? poll.ndaVotePct : poll.ndaSeats);
              const yYsrcp = valToY(displayMode === 'VOTE_SHARE' ? poll.ysrcpVotePct : poll.ysrcpSeats);
              const dotRadius = Math.max(3.0, Math.min(6.0, Math.sqrt(poll.sampleSize) / 55));

              return (
                <g
                  key={poll.id}
                  className="cursor-pointer"
                  onMouseEnter={(e) => {
                    setHoveredPoll(poll);
                    setTooltipPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredPoll(null)}
                >
                  <line
                    x1={x}
                    y1={yNda}
                    x2={x}
                    y2={yYsrcp}
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                    opacity="0.3"
                  />
                  <circle
                    cx={x}
                    cy={yNda}
                    r={dotRadius}
                    fill="#F59E0B"
                    fillOpacity={poll.isExitPoll ? '0.9' : '0.45'}
                    stroke="#D97706"
                    strokeWidth={poll.isExitPoll ? '2' : '1'}
                    className="hover:r-7 transition-all hover:fill-amber-300"
                  />
                  <circle
                    cx={x}
                    cy={yYsrcp}
                    r={dotRadius}
                    fill="#0284C7"
                    fillOpacity={poll.isExitPoll ? '0.9' : '0.45'}
                    stroke="#0369A1"
                    strokeWidth={poll.isExitPoll ? '2' : '1'}
                    className="hover:r-7 transition-all hover:fill-sky-300"
                  />
                </g>
              );
            })}

          {/* Smooth Dual / Triple LOESS Spline Trendlines */}
          <path
            d={ndaSplinePath}
            fill="none"
            stroke="#F59E0B"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="url(#glowNda)"
          />
          <path
            d={ysrcpSplinePath}
            fill="none"
            stroke="#0284C7"
            strokeWidth="3.2"
            strokeLinecap="round"
            filter="url(#glowYsrcp)"
          />
          {isTriangularSolo && jspSplinePath && (
            <path
              d={jspSplinePath}
              fill="none"
              stroke="#10B981"
              strokeWidth="3.2"
              strokeLinecap="round"
              filter="url(#glowJsp)"
            />
          )}

          {/* Right Margin Callout Badges with Dynamic Collision Avoidance */}
          <g>
            {/* Lead 1: NDA or TDP Solo */}
            <text
              x={paddingLeft + chartW + 10}
              y={rightBadgePositions.nda - 6}
              fill="#F59E0B"
              fontSize="11"
              fontWeight="900"
              fontFamily="monospace"
            >
              {terminalValues.ndaParty}
            </text>
            <text
              x={paddingLeft + chartW + 10}
              y={rightBadgePositions.nda + 9}
              fill="#F59E0B"
              fontSize="13"
              fontWeight="900"
              fontFamily="monospace"
            >
              {terminalValues.ndaLabel}
            </text>

            {/* Lead 2: YSRCP */}
            <text
              x={paddingLeft + chartW + 10}
              y={rightBadgePositions.ysrcp - 6}
              fill="#0284C7"
              fontSize="11"
              fontWeight="900"
              fontFamily="monospace"
            >
              {terminalValues.ysrcpParty}
            </text>
            <text
              x={paddingLeft + chartW + 10}
              y={rightBadgePositions.ysrcp + 9}
              fill="#0284C7"
              fontSize="13"
              fontWeight="900"
              fontFamily="monospace"
            >
              {terminalValues.ysrcpLabel}
            </text>

            {/* Lead 3: JSP Solo (when triangular) */}
            {isTriangularSolo && terminalValues.jspLabel && (
              <>
                <text
                  x={paddingLeft + chartW + 10}
                  y={rightBadgePositions.jsp - 6}
                  fill="#10B981"
                  fontSize="11"
                  fontWeight="900"
                  fontFamily="monospace"
                >
                  {terminalValues.jspParty}
                </text>
                <text
                  x={paddingLeft + chartW + 10}
                  y={rightBadgePositions.jsp + 9}
                  fill="#10B981"
                  fontSize="13"
                  fontWeight="900"
                  fontFamily="monospace"
                >
                  {terminalValues.jspLabel}
                </text>
              </>
            )}
          </g>

          {/* Scrubber Vertical Cursor Line */}
          <g>
            <line
              x1={timeToX(scrubberTime)}
              y1={paddingTop - 10}
              x2={timeToX(scrubberTime)}
              y2={paddingTop + chartH}
              stroke="#E2E8F0"
              strokeWidth="2"
              strokeDasharray="4 2"
              opacity="0.9"
            />
            <circle
              cx={timeToX(scrubberTime)}
              cy={paddingTop - 10}
              r="4"
              fill="#E2E8F0"
            />
          </g>
        </svg>
      </div>

      {/* Hover Tooltips */}
      {hoveredPoll && tooltipPos && (
        <div
          className="fixed z-50 p-2.5 bg-slate-900 text-white rounded-lg border border-slate-700 shadow-2xl text-xs space-y-1 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y - 12}px` }}
        >
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1">
            <span className="font-bold text-indigo-300">{hoveredPoll.pollster}</span>
            <span className="font-mono text-[10px] text-slate-400">{hoveredPoll.date}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
            <div>
              <span className="text-amber-400 font-bold block">
                NDA: {hoveredPoll.ndaVotePct}% ({hoveredPoll.ndaSeats} seats)
              </span>
            </div>
            <div>
              <span className="text-sky-400 font-bold block">
                YSRCP: {hoveredPoll.ysrcpVotePct}% ({hoveredPoll.ysrcpSeats} seats)
              </span>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 pt-0.5">
            Sample: {hoveredPoll.sampleSize.toLocaleString()} respondents {hoveredPoll.isExitPoll && '• 🎯 Exit Poll'}
          </div>
        </div>
      )}

      {hoveredMilestone && tooltipPos && (
        <div
          className="fixed z-50 p-3 bg-slate-900 text-white rounded-xl border border-indigo-600/70 shadow-2xl max-w-sm text-xs space-y-1.5 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-4"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y - 12}px` }}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="font-bold text-amber-300">{hoveredMilestone.title}</span>
            <span className="font-mono text-[10px] text-slate-400">{hoveredMilestone.date}</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">{hoveredMilestone.description}</p>
          <div className="text-[10px] font-mono text-emerald-400 pt-1 border-t border-slate-800/80">
            ⚡ Impact: {hoveredMilestone.impact}
          </div>
        </div>
      )}
    </div>
  );
};
