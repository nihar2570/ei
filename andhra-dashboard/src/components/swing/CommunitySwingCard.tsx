import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Lock, Unlock, GripVertical } from 'lucide-react';
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
  const othBase = baseline.OTH || 4;

  const tdpShare = Math.max(0, Math.min(100, Math.round((tdpBase + (currSwing.TDP || 0)) * 10) / 10));
  const ysrcpShare = Math.max(0, Math.min(100, Math.round((ysrcpBase + (currSwing.YSRCP || 0)) * 10) / 10));
  const jspShare = Math.max(0, Math.min(100, Math.round((jspBase + (currSwing.JSP || 0)) * 10) / 10));
  const othShare = Math.max(0, Math.round((100 - (tdpShare + ysrcpShare + jspShare)) * 10) / 10);

  // Divider positions on the 0-100% bar
  const h1Pos = tdpShare;
  const h2Pos = Math.min(100 - othShare, tdpShare + ysrcpShare);

  const barRef = useRef<HTMLDivElement>(null);
  const [activeHandle, setActiveHandle] = useState<'h1' | 'h2' | null>(null);

  // Global pointer move listener during drag for high precision & smoothness
  useEffect(() => {
    if (!activeHandle) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const rawPct = ((e.clientX - rect.left) / rect.width) * 100;
      const pct = Math.max(2, Math.min(98, Math.round(rawPct * 2) / 2)); // 0.5% resolution

      if (activeHandle === 'h1') {
        if (locked.TDP) return;
        const maxH1 = Math.min(85, tdpShare + ysrcpShare - 5);
        const clamped = Math.max(5, Math.min(maxH1, pct));
        onAdjust('TDP', clamped);
      } else if (activeHandle === 'h2') {
        if (locked.YSRCP && locked.JSP) return;
        const minH2 = tdpShare + 5;
        const maxH2 = 100 - (othBase || 4) - 2;
        const clamped = Math.max(minH2, Math.min(maxH2, pct));
        const newYsrcp = Math.max(3, Math.round((clamped - tdpShare) * 2) / 2);
        onAdjust('YSRCP', newYsrcp);
      }
    };

    const onPointerUp = () => {
      setActiveHandle(null);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, [activeHandle, tdpShare, ysrcpShare, othBase, locked, onAdjust]);

  return (
    <div
      className={`bg-white rounded-2xl p-4 sm:p-4.5 border transition-all ${
        isCustomized
          ? 'border-indigo-400 shadow-md ring-1 ring-indigo-200/60'
          : 'border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
      }`}
    >
      {/* Header: Community Name, Demographics, Region, Issues, Reset */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2.5 mb-2.5">
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
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 flex-wrap">
            <span className="truncate" title={comm.region}>
              📍 {comm.region}
            </span>
            <span className="text-[11px] text-indigo-700 font-medium truncate hidden md:inline" title={comm.keyIssues}>
              ⚡ {comm.keyIssues}
            </span>
          </div>
        </div>

        {isCustomized && (
          <button
            onClick={onReset}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 cursor-pointer transition-colors shrink-0"
            title="Reset to 2024 baseline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* SINGLE INTERACTIVE PARTITION SLIDER BAR */}
      <div className="space-y-2">
        <div className="relative pt-1 pb-1">
          {/* Track Bar with Partition Segments */}
          <div
            ref={barRef}
            className="w-full h-8 sm:h-9 rounded-xl overflow-hidden flex bg-slate-100 border border-slate-300 shadow-inner relative select-none"
          >
            {/* TDP Segment */}
            <div
              style={{ width: `${tdpShare}%` }}
              className="bg-[#eab308] h-full flex items-center justify-center text-white text-[11px] font-black font-mono shadow-xs overflow-hidden transition-all duration-75 px-1"
              title={`TDP: ${tdpShare}%`}
            >
              {tdpShare >= 15 && <span className="truncate drop-shadow-xs">TDP {tdpShare}%</span>}
            </div>

            {/* YSRCP Segment */}
            <div
              style={{ width: `${ysrcpShare}%` }}
              className="bg-[#0284c7] h-full flex items-center justify-center text-white text-[11px] font-black font-mono shadow-xs overflow-hidden transition-all duration-75 px-1"
              title={`YSRCP: ${ysrcpShare}%`}
            >
              {ysrcpShare >= 15 && <span className="truncate drop-shadow-xs">YSRCP {ysrcpShare}%</span>}
            </div>

            {/* JSP Segment */}
            <div
              style={{ width: `${jspShare}%` }}
              className="bg-[#e11d48] h-full flex items-center justify-center text-white text-[11px] font-black font-mono shadow-xs overflow-hidden transition-all duration-75 px-1"
              title={`JSP: ${jspShare}%`}
            >
              {jspShare >= 12 && <span className="truncate drop-shadow-xs">JSP {jspShare}%</span>}
            </div>

            {/* OTH (Residual) Segment */}
            <div
              style={{ width: `${othShare}%` }}
              className="bg-slate-300 h-full flex items-center justify-center text-slate-600 text-[10px] font-bold font-mono overflow-hidden transition-all duration-75"
              title={`OTH: ${othShare}%`}
            >
              {othShare >= 6 && <span className="truncate">{othShare}%</span>}
            </div>
          </div>

          {/* Draggable Divider Handle 1 (TDP / YSRCP Boundary) */}
          <div
            onPointerDown={(e) => {
              e.preventDefault();
              setActiveHandle('h1');
            }}
            style={{ left: `${h1Pos}%` }}
            className={`absolute top-0 -translate-x-1/2 w-5 h-10 sm:h-11 rounded-lg border-2 shadow-md flex items-center justify-center cursor-ew-resize transition-transform select-none z-10 ${
              locked.TDP
                ? 'bg-slate-200 border-slate-400 opacity-60 cursor-not-allowed'
                : activeHandle === 'h1'
                ? 'bg-white border-amber-500 ring-2 ring-amber-300 scale-105'
                : 'bg-white border-slate-700 hover:border-amber-500 hover:scale-105'
            }`}
            title="Drag to adjust TDP vs YSRCP balance"
            role="slider"
            aria-label="TDP and YSRCP partition"
            aria-valuenow={tdpShare}
          >
            <GripVertical className="w-3 h-3 text-slate-600" />
          </div>

          {/* Draggable Divider Handle 2 (YSRCP / JSP Boundary) */}
          <div
            onPointerDown={(e) => {
              e.preventDefault();
              setActiveHandle('h2');
            }}
            style={{ left: `${h2Pos}%` }}
            className={`absolute top-0 -translate-x-1/2 w-5 h-10 sm:h-11 rounded-lg border-2 shadow-md flex items-center justify-center cursor-ew-resize transition-transform select-none z-10 ${
              locked.YSRCP && locked.JSP
                ? 'bg-slate-200 border-slate-400 opacity-60 cursor-not-allowed'
                : activeHandle === 'h2'
                ? 'bg-white border-sky-500 ring-2 ring-sky-300 scale-105'
                : 'bg-white border-slate-700 hover:border-sky-500 hover:scale-105'
            }`}
            title="Drag to adjust YSRCP vs JSP balance"
            role="slider"
            aria-label="YSRCP and JSP partition"
            aria-valuenow={ysrcpShare}
          >
            <GripVertical className="w-3 h-3 text-slate-600" />
          </div>
        </div>

        {/* Compact 3-Party Quick Controls & Steppers Below Slider */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          {/* TDP Pill */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#eab308] shrink-0" />
              <span className="font-extrabold text-amber-950">TDP</span>
              <span className="font-mono font-black text-slate-900">{tdpShare}%</span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                  (currSwing.TDP || 0) > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : (currSwing.TDP || 0) < 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {(currSwing.TDP || 0) > 0 ? `+${currSwing.TDP}%` : `${currSwing.TDP || 0}%`}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onAdjust('TDP', Math.max(0, tdpShare - 1))}
                disabled={locked.TDP}
                className="w-5 h-5 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded text-xs font-bold cursor-pointer"
                title="Decrease TDP share 1%"
              >
                -
              </button>
              <button
                onClick={() => onAdjust('TDP', Math.min(95, tdpShare + 1))}
                disabled={locked.TDP}
                className="w-5 h-5 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded text-xs font-bold cursor-pointer"
                title="Increase TDP share 1%"
              >
                +
              </button>
              <button
                onClick={() => onToggleLock('TDP')}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  locked.TDP ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={locked.TDP ? 'TDP Locked' : 'Lock TDP share'}
              >
                {locked.TDP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* YSRCP Pill */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-sky-50/60 border border-sky-200/70 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] shrink-0" />
              <span className="font-extrabold text-sky-950">YSRCP</span>
              <span className="font-mono font-black text-slate-900">{ysrcpShare}%</span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                  (currSwing.YSRCP || 0) > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : (currSwing.YSRCP || 0) < 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {(currSwing.YSRCP || 0) > 0 ? `+${currSwing.YSRCP}%` : `${currSwing.YSRCP || 0}%`}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onAdjust('YSRCP', Math.max(0, ysrcpShare - 1))}
                disabled={locked.YSRCP}
                className="w-5 h-5 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded text-xs font-bold cursor-pointer"
                title="Decrease YSRCP share 1%"
              >
                -
              </button>
              <button
                onClick={() => onAdjust('YSRCP', Math.min(95, ysrcpShare + 1))}
                disabled={locked.YSRCP}
                className="w-5 h-5 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded text-xs font-bold cursor-pointer"
                title="Increase YSRCP share 1%"
              >
                +
              </button>
              <button
                onClick={() => onToggleLock('YSRCP')}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  locked.YSRCP ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={locked.YSRCP ? 'YSRCP Locked' : 'Lock YSRCP share'}
              >
                {locked.YSRCP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* JSP Pill */}
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-rose-50/60 border border-rose-200/70 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48] shrink-0" />
              <span className="font-extrabold text-rose-950">JSP</span>
              <span className="font-mono font-black text-slate-900">{jspShare}%</span>
              <span
                className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                  (currSwing.JSP || 0) > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : (currSwing.JSP || 0) < 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {(currSwing.JSP || 0) > 0 ? `+${currSwing.JSP}%` : `${currSwing.JSP || 0}%`}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onAdjust('JSP', Math.max(0, jspShare - 1))}
                disabled={locked.JSP}
                className="w-5 h-5 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded text-xs font-bold cursor-pointer"
                title="Decrease JSP share 1%"
              >
                -
              </button>
              <button
                onClick={() => onAdjust('JSP', Math.min(80, jspShare + 1))}
                disabled={locked.JSP}
                className="w-5 h-5 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded text-xs font-bold cursor-pointer"
                title="Increase JSP share 1%"
              >
                +
              </button>
              <button
                onClick={() => onToggleLock('JSP')}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  locked.JSP ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={locked.JSP ? 'JSP Locked' : 'Lock JSP share'}
              >
                {locked.JSP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
