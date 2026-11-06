import React from 'react';
import { RotateCcw, Lock, Unlock } from 'lucide-react';
import type { CommunityMeta } from './swingCommunityMeta';

interface CommunitySwingCardProps {
  comm: CommunityMeta;
  baseline: { TDP?: number; YSRCP?: number; JSP?: number; OTH?: number };
  currSwing: { TDP?: number; YSRCP?: number; JSP?: number };
  isCustomized: boolean;
  locked: { TDP?: boolean; YSRCP?: boolean; JSP?: boolean };
  onToggleLock: (party: 'TDP' | 'YSRCP' | 'JSP') => void;
  onAdjust: (party: 'TDP' | 'YSRCP' | 'JSP', newVal: number) => void;
  onReset: () => void;
}

export const CommunitySwingCard: React.FC<CommunitySwingCardProps> = ({
  comm,
  baseline,
  currSwing,
  isCustomized,
  locked,
  onToggleLock,
  onAdjust,
  onReset,
}) => {
  const tdpBase = baseline.TDP || 46;
  const ysrcpBase = baseline.YSRCP || 40;
  const jspBase = baseline.JSP || 10;

  const tdpShare = Math.max(0, Math.min(100, Math.round((tdpBase + (currSwing.TDP || 0)) * 10) / 10));
  const ysrcpShare = Math.max(0, Math.min(100, Math.round((ysrcpBase + (currSwing.YSRCP || 0)) * 10) / 10));
  const jspShare = Math.max(0, Math.min(100, Math.round((jspBase + (currSwing.JSP || 0)) * 10) / 10));
  const othShare = Math.max(0, Math.round((100 - (tdpShare + ysrcpShare + jspShare)) * 10) / 10);

  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all ${
        isCustomized
          ? 'border-indigo-400 shadow-md ring-1 ring-indigo-200/60'
          : 'border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{comm.name}</h4>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold border border-slate-200">
              {comm.sharePct} AP
            </span>
            {isCustomized && (
              <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-md font-bold font-mono">
                Modified
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1" title={comm.region}>
            📍 {comm.region}
          </p>
          <p className="text-[11px] text-indigo-700 font-medium mt-0.5 line-clamp-1" title={comm.keyIssues}>
            ⚡ {comm.keyIssues}
          </p>
        </div>

        {isCustomized && (
          <button
            onClick={onReset}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer transition-colors shrink-0"
            title="Reset to 2024 baseline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 100% Stacked Horizontal Segmented Bar */}
      <div className="space-y-1 mb-3">
        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100 border border-slate-200 shadow-inner">
          <div style={{ width: `${tdpShare}%` }} className="bg-[#eab308] h-full rounded-l-full transition-all duration-150" title={`TDP: ${tdpShare}%`} />
          <div style={{ width: `${ysrcpShare}%` }} className="bg-[#0284c7] h-full transition-all duration-150" title={`YSRCP: ${ysrcpShare}%`} />
          <div style={{ width: `${jspShare}%` }} className="bg-[#e11d48] h-full transition-all duration-150" title={`JSP: ${jspShare}%`} />
          <div style={{ width: `${othShare}%` }} className="bg-slate-300 h-full rounded-r-full transition-all duration-150" title={`OTH: ${othShare}%`} />
        </div>
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
          <span>TDP: {tdpShare}%</span>
          <span>YSRCP: {ysrcpShare}%</span>
          <span>JSP: {jspShare}%</span>
          <span>OTH: {othShare}%</span>
        </div>
      </div>

      {/* 3 Party Sliders: TDP, YSRCP, JSP */}
      <div className="space-y-2.5">
        {/* TDP Slider */}
        <div className="bg-slate-50/70 p-2.5 rounded-xl border border-amber-200/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
              <span className="text-xs font-black text-amber-900">TDP</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900 font-mono">{tdpShare}%</span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  (currSwing.TDP || 0) > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : (currSwing.TDP || 0) < 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {(currSwing.TDP || 0) > 0 ? `+${currSwing.TDP}%` : `${currSwing.TDP || 0}%`}
              </span>
              <button
                onClick={() => onToggleLock('TDP')}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  locked.TDP ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={locked.TDP ? 'Locked' : 'Click to lock'}
              >
                {locked.TDP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAdjust('TDP', Math.max(0, tdpShare - 1))}
              disabled={locked.TDP}
              className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-md text-xs font-bold cursor-pointer shadow-2xs"
            >
              -
            </button>
            <input
              type="range"
              min="10"
              max="90"
              step="0.5"
              value={tdpShare}
              disabled={locked.TDP}
              onChange={(e) => onAdjust('TDP', Number(e.target.value))}
              className="flex-1 accent-amber-600 cursor-pointer disabled:opacity-40 h-1.5 bg-slate-200 rounded-lg"
            />
            <button
              onClick={() => onAdjust('TDP', Math.min(95, tdpShare + 1))}
              disabled={locked.TDP}
              className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-md text-xs font-bold cursor-pointer shadow-2xs"
            >
              +
            </button>
          </div>
        </div>

        {/* YSRCP Slider */}
        <div className="bg-slate-50/70 p-2.5 rounded-xl border border-sky-200/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
              <span className="text-xs font-black text-sky-900">YSRCP</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900 font-mono">{ysrcpShare}%</span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  (currSwing.YSRCP || 0) > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : (currSwing.YSRCP || 0) < 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {(currSwing.YSRCP || 0) > 0 ? `+${currSwing.YSRCP}%` : `${currSwing.YSRCP || 0}%`}
              </span>
              <button
                onClick={() => onToggleLock('YSRCP')}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  locked.YSRCP ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={locked.YSRCP ? 'Locked' : 'Click to lock'}
              >
                {locked.YSRCP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAdjust('YSRCP', Math.max(0, ysrcpShare - 1))}
              disabled={locked.YSRCP}
              className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-md text-xs font-bold cursor-pointer shadow-2xs"
            >
              -
            </button>
            <input
              type="range"
              min="5"
              max="90"
              step="0.5"
              value={ysrcpShare}
              disabled={locked.YSRCP}
              onChange={(e) => onAdjust('YSRCP', Number(e.target.value))}
              className="flex-1 accent-sky-600 cursor-pointer disabled:opacity-40 h-1.5 bg-slate-200 rounded-lg"
            />
            <button
              onClick={() => onAdjust('YSRCP', Math.min(95, ysrcpShare + 1))}
              disabled={locked.YSRCP}
              className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-md text-xs font-bold cursor-pointer shadow-2xs"
            >
              +
            </button>
          </div>
        </div>

        {/* JSP Slider */}
        <div className="bg-slate-50/70 p-2.5 rounded-xl border border-rose-200/60 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" />
              <span className="text-xs font-black text-rose-900">JSP</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900 font-mono">{jspShare}%</span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                  (currSwing.JSP || 0) > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : (currSwing.JSP || 0) < 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {(currSwing.JSP || 0) > 0 ? `+${currSwing.JSP}%` : `${currSwing.JSP || 0}%`}
              </span>
              <button
                onClick={() => onToggleLock('JSP')}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  locked.JSP ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={locked.JSP ? 'Locked' : 'Click to lock'}
              >
                {locked.JSP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAdjust('JSP', Math.max(0, jspShare - 1))}
              disabled={locked.JSP}
              className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-md text-xs font-bold cursor-pointer shadow-2xs"
            >
              -
            </button>
            <input
              type="range"
              min="0"
              max="70"
              step="0.5"
              value={jspShare}
              disabled={locked.JSP}
              onChange={(e) => onAdjust('JSP', Number(e.target.value))}
              className="flex-1 accent-rose-600 cursor-pointer disabled:opacity-40 h-1.5 bg-slate-200 rounded-lg"
            />
            <button
              onClick={() => onAdjust('JSP', Math.min(80, jspShare + 1))}
              disabled={locked.JSP}
              className="w-6 h-6 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-md text-xs font-bold cursor-pointer shadow-2xs"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
