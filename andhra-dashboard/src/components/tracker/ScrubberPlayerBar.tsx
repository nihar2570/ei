import React from 'react';
import { Play, Pause, RotateCcw, Calendar, Sparkles } from 'lucide-react';
import type { ElectionCycle, CampaignMilestone } from './pollingData';

interface ScrubberPlayerBarProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  scrubberTime: number;
  setScrubberTime: (time: number) => void;
  startDate: number;
  endDate: number;
  electionCycle: ElectionCycle;
  scrubberDateFormatted: string;
  currentScrubberValues: {
    nda: number;
    ysrcp: number;
    jsp: number;
    lead: number;
  };
  isTriangularSolo: boolean;
  displayMode: 'VOTE_SHARE' | 'SEATS';
  activeMilestoneNarrative: CampaignMilestone;
}

export const ScrubberPlayerBar: React.FC<ScrubberPlayerBarProps> = ({
  isPlaying,
  setIsPlaying,
  scrubberTime,
  setScrubberTime,
  startDate,
  endDate,
  electionCycle,
  scrubberDateFormatted,
  currentScrubberValues,
  isTriangularSolo,
  displayMode,
  activeMilestoneNarrative,
}) => {
  return (
    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-md space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
              isPlaying
                ? 'bg-amber-600 text-white hover:bg-amber-500'
                : 'bg-indigo-600 text-white hover:bg-indigo-500'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play Timeline'}</span>
          </button>

          <button
            onClick={() => {
              setScrubberTime(startDate);
              setIsPlaying(false);
            }}
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-800 cursor-pointer"
            title="Reset to timeline start"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2 text-xs">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-white font-mono text-sm">{scrubberDateFormatted}</span>
          </div>
        </div>

        {/* Dynamic Margin Indicator */}
        <div className="flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono">
          <span className="text-slate-400">Projected State:</span>
          <span className="font-bold text-amber-400">
            {isTriangularSolo ? 'TDP' : 'NDA'}{' '}
            {currentScrubberValues.lead > 0 ? `+${currentScrubberValues.lead}%` : `${currentScrubberValues.lead}%`}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300">
            {displayMode === 'VOTE_SHARE'
              ? `${isTriangularSolo ? 'TDP' : 'NDA'}: ${currentScrubberValues.nda}% | YSRCP: ${currentScrubberValues.ysrcp}%${isTriangularSolo ? ` | JSP: ${currentScrubberValues.jsp}%` : ''}`
              : `${isTriangularSolo ? 'TDP' : 'NDA'}: ${Math.round(currentScrubberValues.nda)}s | YSRCP: ${Math.round(currentScrubberValues.ysrcp)}s${isTriangularSolo ? ` | JSP: ${Math.round(currentScrubberValues.jsp)}s` : ''}`}
          </span>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min={startDate}
          max={endDate}
          step={electionCycle === '2024' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000}
          value={scrubberTime}
          onChange={(e) => {
            setScrubberTime(Number(e.target.value));
            setIsPlaying(false);
          }}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          {electionCycle === '2024' ? (
            <>
              <span>Oct 1, 2023 (Arrest)</span>
              <span>Jan 14, 2024 (Sankranti)</span>
              <span>Mar 9, 2024 (Triple Alliance)</span>
              <span>May 13, 2024 (Polling)</span>
              <span>Jun 4, 2024 (Counting Day)</span>
            </>
          ) : (
            <>
              <span>Jun 2024 (Mandate Baseline)</span>
              <span>Mid 2025 (Amaravati Delivery)</span>
              <span>Late 2026 (Mid-term Review)</span>
              <span>Early 2028 (Pre-poll Talks)</span>
              <span>May 2029 (Mandate)</span>
            </>
          )}
        </div>
      </div>

      {/* Context Card at Scrubbed Date */}
      <div className="p-3 bg-gradient-to-r from-slate-900 to-indigo-950/40 rounded-lg border border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-white">Active Timeline Phase:</span>
            <span className="text-amber-300 font-bold">{activeMilestoneNarrative.title}</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {activeMilestoneNarrative.description}
          </p>
        </div>

        <div className="shrink-0 bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-400">
          {activeMilestoneNarrative.impact}
        </div>
      </div>
    </div>
  );
};
