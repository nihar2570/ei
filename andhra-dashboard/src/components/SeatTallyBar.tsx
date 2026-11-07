import React from 'react';
import type { YearSummary } from '../types';
import { getPartyColor, PARTY_CONFIG } from '../types';

interface SeatTallyBarProps {
  summary: YearSummary;
  year: string;
  bare?: boolean;
}

export const SeatTallyBar: React.FC<SeatTallyBarProps> = ({ summary, year: _year, bare = false }) => {
  const majorityMark = 88; // 175 seats in Andhra Pradesh
  const totalSeats = 175;
  const entries = Object.entries(summary.seat_tally);

  const barContent = (
    <div className="relative flex-1 min-w-[160px] h-5 bg-slate-100 rounded-lg overflow-hidden flex border border-slate-300/80 shadow-inner">
      {entries.map(([party, seats]) => {
        const widthPct = (seats / totalSeats) * 100;
        const isMajority = seats >= majorityMark;
        const bgColor = getPartyColor(party);
        const textColor = PARTY_CONFIG[party]?.textColor || '#ffffff';

        return (
          <div
            key={party}
            style={{
              width: `${widthPct}%`,
              backgroundColor: bgColor,
              color: textColor,
            }}
            className="h-full relative group transition-all duration-200 hover:brightness-110 flex items-center justify-center overflow-hidden px-1 select-none border-r border-black/10 last:border-r-0 cursor-default"
            title={`${party}: ${seats} seats (${widthPct.toFixed(1)}%)${isMajority ? ' • Majority Won' : ''}`}
          >
            {seats >= 3 ? (
              <div className="flex items-center gap-1 font-bold text-[11px] font-mono tracking-tight drop-shadow-2xs">
                <span className="hidden group-hover:inline font-sans text-[10px] uppercase font-bold tracking-normal transition-all">
                  {party}
                </span>
                <span>{seats}</span>
              </div>
            ) : seats >= 1 ? (
              <span className="font-bold text-[10px] font-mono">{seats}</span>
            ) : null}
          </div>
        );
      })}

      {/* Majority threshold line marker at ~50.3% */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-slate-900/90 z-10 shadow-xs"
        style={{ left: `${(majorityMark / totalSeats) * 100}%` }}
        title={`Majority Threshold: ${majorityMark} Seats (88 req.)`}
      />
    </div>
  );

  if (bare) {
    return barContent;
  }

  return (
    <div className="bg-white rounded-xl px-3 sm:px-4 py-2 shadow-2xs border border-slate-200/90 flex items-center gap-2.5 sm:gap-3.5">
      {barContent}
    </div>
  );
};

export default SeatTallyBar;
