import React from 'react';
import { HelpCircle, X, History, TrendingUp, Sliders } from 'lucide-react';
import type { CandidatePastRecord } from './heavyweightData';
import type { DetailedCandidate } from '../../types';

interface EquityMethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  acNo: number;
  acName: string;
  winnerCandidate: DetailedCandidate;
  runnerCandidate?: DetailedCandidate;
  winnerPastRecord: CandidatePastRecord;
  runnerPastRecord: CandidatePastRecord;
  winnerPartyColor: string;
  runnerPartyColor: string;
  incumbencyMultiplier: number;
  setIncumbencyMultiplier: (val: number) => void;
  finalWinnerEquityPct: number;
  setUserWinnerEquityPct: (val: number | null) => void;
  empiricalWinnerEquityPct: number;
  finalRunnerEquityPct: number;
  setUserRunnerEquityPct: (val: number | null) => void;
  empiricalRunnerEquityPct: number;
  onResetDefaults: () => void;
}

export const EquityMethodologyModal: React.FC<EquityMethodologyModalProps> = ({
  isOpen,
  onClose,
  acNo,
  acName,
  winnerCandidate,
  runnerCandidate,
  winnerPastRecord,
  runnerPastRecord,
  winnerPartyColor,
  runnerPartyColor,
  incumbencyMultiplier,
  setIncumbencyMultiplier,
  finalWinnerEquityPct,
  setUserWinnerEquityPct,
  empiricalWinnerEquityPct,
  finalRunnerEquityPct,
  setUserRunnerEquityPct,
  empiricalRunnerEquityPct,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl max-w-2xl w-full p-5 sm:p-6 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <span>How Candidate Personal Equity is Formulated</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              AC #{acNo} {acName} &middot; Empirically calibrated against historical election archives
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: Historical Incumbency & Prior Election Track Record */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
            <History className="w-4 h-4 text-indigo-400" />
            <span>1. Historical Assembly Election Cross-Check (2018 &amp; 2014)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            {/* Winner History Card */}
            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white truncate max-w-[150px]">{winnerCandidate.name}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-bold" style={{ backgroundColor: `${winnerPartyColor}30`, color: winnerPartyColor }}>
                  {winnerCandidate.party}
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-slate-300">
                  <span>2018 Assembly:</span>
                  <strong className={winnerPastRecord.is2018Winner ? 'text-emerald-400' : winnerPastRecord.is2018RunnerUp ? 'text-sky-400' : 'text-slate-400'}>
                    {winnerPastRecord.is2018Winner ? '🏆 Won (Incumbent MLA)' : winnerPastRecord.is2018RunnerUp ? '🥈 Runner-up' : 'Not Contested'}
                  </strong>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>2014 Assembly:</span>
                  <strong className={winnerPastRecord.is2014Winner ? 'text-indigo-400' : winnerPastRecord.is2014RunnerUp ? 'text-sky-400' : 'text-slate-400'}>
                    {winnerPastRecord.is2014Winner ? '🏛️ Won (Former MLA)' : winnerPastRecord.is2014RunnerUp ? '🥈 Runner-up' : 'Not Contested'}
                  </strong>
                </div>
                <div className="pt-1 border-t border-slate-800 flex justify-between text-slate-400">
                  <span>Incumbency Lift:</span>
                  <span className="text-emerald-400 font-mono font-bold">+{winnerPastRecord.incumbencyBonusPct.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            {/* Runner-up History Card */}
            {runnerCandidate && (
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate max-w-[150px]">{runnerCandidate.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold" style={{ backgroundColor: `${runnerPartyColor}30`, color: runnerPartyColor }}>
                    {runnerCandidate.party}
                  </span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>2018 Assembly:</span>
                    <strong className={runnerPastRecord.is2018Winner ? 'text-emerald-400' : runnerPastRecord.is2018RunnerUp ? 'text-sky-400' : 'text-slate-400'}>
                      {runnerPastRecord.is2018Winner ? '🏆 Won (Incumbent MLA)' : runnerPastRecord.is2018RunnerUp ? '🥈 Runner-up' : 'Not Contested'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>2014 Assembly:</span>
                    <strong className={runnerPastRecord.is2014Winner ? 'text-indigo-400' : runnerPastRecord.is2014RunnerUp ? 'text-sky-400' : 'text-slate-400'}>
                      {runnerPastRecord.is2014Winner ? '🏛️ Won (Former MLA)' : runnerPastRecord.is2014RunnerUp ? '🥈 Runner-up' : 'Not Contested'}
                    </strong>
                  </div>
                  <div className="pt-1 border-t border-slate-800 flex justify-between text-slate-400">
                    <span>Incumbency Lift:</span>
                    <span className="text-sky-400 font-mono font-bold">+{runnerPastRecord.incumbencyBonusPct.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Mathematical Formulation */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-emerald-400">
            <TrendingUp className="w-4 h-4" />
            <span>2. The Three Component Attribution Pillars</span>
          </div>
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside text-[11px]">
            <li>
              <strong>Base Nominee Core (8%):</strong> Ground machinery, family caste network, and sarpanch patron linkages carried by any recognized ticket-holder.
            </li>
            <li>
              <strong>Prior Election Track Record (+3% to +15%):</strong> Sitting 2018 MLAs gain +10% for running local welfare offices, 2014 MLAs gain +5%, and 2018 runners-up gain +6% for established booth cadre.
            </li>
            <li>
              <strong>Regional Outperformance Delta:</strong> How much the candidate exceeded their party&apos;s average vote share across the 7 assembly segments in the same Parliamentary Constituency.
            </li>
          </ul>
        </div>

        {/* Section 3: Interactive Parameter Calibration */}
        <div className="bg-slate-950 p-4 rounded-xl border border-indigo-500/40 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4" />
              <span>3. Interactive Custom Calibration</span>
            </span>
            <span className="text-[11px] text-slate-400">Adjust weights directly if required</span>
          </div>

          {/* Slider 1: Incumbency Multiplier */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">Past MLA / Runner-up Weight Multiplier:</span>
              <span className="font-mono font-bold text-indigo-400">{incumbencyMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.0"
              max="2.0"
              step="0.1"
              value={incumbencyMultiplier}
              onChange={(e) => setIncumbencyMultiplier(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0.0x (Ignore Past History)</span>
              <span>1.0x (Standard Model)</span>
              <span>2.0x (Heavyweight Incumbency)</span>
            </div>
          </div>

          {/* Slider 2: Winner Equity % */}
          <div className="space-y-1 pt-1 border-t border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300">{winnerCandidate.name} Personal Equity %:</span>
              <span className="font-mono font-bold text-emerald-400">{finalWinnerEquityPct}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="45"
              step="0.5"
              value={finalWinnerEquityPct}
              onChange={(e) => setUserWinnerEquityPct(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>5% (Pure Party Wave)</span>
              <span>{empiricalWinnerEquityPct}% (Empirical Calc)</span>
              <span>45% (Unstoppable Cult Leader)</span>
            </div>
          </div>

          {/* Slider 3: Runner-up Equity % */}
          {runnerCandidate && (
            <div className="space-y-1 pt-1 border-t border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">{runnerCandidate.name} Personal Equity %:</span>
                <span className="font-mono font-bold text-sky-400">{finalRunnerEquityPct}%</span>
              </div>
              <input
                type="range"
                min="4"
                max="40"
                step="0.5"
                value={finalRunnerEquityPct}
                onChange={(e) => setUserRunnerEquityPct(Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>4% (Pure Symbol Ticket)</span>
                <span>{empiricalRunnerEquityPct}% (Empirical Calc)</span>
                <span>40% (Independent Titan)</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onResetDefaults}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors cursor-pointer"
          >
            Reset to Empirical Defaults
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Apply &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
