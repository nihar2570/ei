import React, { useState } from 'react';
import { TrendingUp, ChevronDown, ChevronUp, Lock, Unlock } from 'lucide-react';
import type { MacroSwing } from './swingCommunityMeta';

interface StatewideMacroSectionProps {
  macroSwing: MacroSwing;
  setMacroSwing: React.Dispatch<React.SetStateAction<MacroSwing>>;
  statewideBaseline: { TDP: number; YSRCP: number; JSP: number; BJP: number; INC: number; OTH: number };
  onApplyPreset?: (presetKey: string) => void;
  activePreset?: string;
  onAdjustMacro: (party: 'TDP' | 'YSRCP' | 'JSP', newVal: number) => void;
  macroLocked: { TDP?: boolean; YSRCP?: boolean; JSP?: boolean };
  setMacroLocked: React.Dispatch<React.SetStateAction<{ TDP?: boolean; YSRCP?: boolean; JSP?: boolean }>>;
}

export const StatewideMacroSection: React.FC<StatewideMacroSectionProps> = ({
  macroSwing,
  setMacroSwing,
  statewideBaseline,
  onApplyPreset,
  activePreset,
  onAdjustMacro,
  macroLocked,
  setMacroLocked,
}) => {
  const [isMacroExpanded, setIsMacroExpanded] = useState<boolean>(false);
  const hasMacroShift = (macroSwing.TDP || 0) !== 0 || (macroSwing.YSRCP || 0) !== 0 || (macroSwing.JSP || 0) !== 0;

  const currMacroTDP = Math.max(0, Math.min(100, Math.round((statewideBaseline.TDP + (macroSwing.TDP || 0)) * 10) / 10));
  const currMacroYSRCP = Math.max(0, Math.min(100, Math.round((statewideBaseline.YSRCP + (macroSwing.YSRCP || 0)) * 10) / 10));
  const currMacroJSP = Math.max(0, Math.min(100, Math.round((statewideBaseline.JSP + (macroSwing.JSP || 0)) * 10) / 10));
  const currMacroOTH = Math.max(0, Math.round((100 - (currMacroTDP + currMacroYSRCP + currMacroJSP)) * 10) / 10);

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl">
            <TrendingUp className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-900">
                Statewide Uniform Macro Swing
              </h3>
              {hasMacroShift && (
                <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-full font-bold font-mono">
                  Active: TDP {(macroSwing.TDP || 0) >= 0 ? `+${macroSwing.TDP || 0}` : macroSwing.TDP}%, YSRCP {(macroSwing.YSRCP || 0) >= 0 ? `+${macroSwing.YSRCP || 0}` : macroSwing.YSRCP}%, JSP {(macroSwing.JSP || 0) >= 0 ? `+${macroSwing.JSP || 0}` : macroSwing.JSP}%
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Applies a statewide uniform swing across all 175 constituencies layered on demographic adjustments
            </p>
          </div>
        </div>

        {/* Presets & Expand Toggle */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Presets:</span>
          <button
            onClick={() => setMacroSwing({ TDP: 0, YSRCP: 0, JSP: 0 })}
            className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
              !hasMacroShift
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            Baseline
          </button>
          <button
            onClick={() => setMacroSwing({ TDP: 3, YSRCP: -2.5, JSP: -0.5 })}
            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer"
          >
            TDP +3%
          </button>
          <button
            onClick={() => setMacroSwing({ TDP: -3, YSRCP: 3.5, JSP: -0.5 })}
            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 cursor-pointer"
          >
            YSRCP +3.5%
          </button>
          <button
            onClick={() => setMacroSwing({ TDP: -2, YSRCP: -2, JSP: 4 })}
            className="px-2.5 py-1 text-xs rounded-lg font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 cursor-pointer"
          >
            JSP +4%
          </button>
          {onApplyPreset && (
            <button
              onClick={() => onApplyPreset('nda_2024_sweep')}
              className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                activePreset === 'nda_2024_sweep'
                  ? 'bg-amber-600 text-white shadow-xs font-black'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
              }`}
              title="2024 NDA Pre-Poll Alliance baseline (164 seats)"
            >
              <span>🤝 NDA Alliance</span>
            </button>
          )}
          <button
            onClick={() => setIsMacroExpanded(!isMacroExpanded)}
            className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer shadow-2xs ml-1"
          >
            <span>{isMacroExpanded ? 'Hide Sliders' : 'Fine-Tune Sliders'}</span>
            {isMacroExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Compact Segmented Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500 font-medium">Projected Statewide Vote Share:</span>
          <div className="flex items-center gap-3 text-xs font-bold font-mono">
            <span className="text-amber-700">TDP {currMacroTDP}%</span>
            <span className="text-sky-700">YSRCP {currMacroYSRCP}%</span>
            <span className="text-rose-700">JSP {currMacroJSP}%</span>
            <span className="text-slate-500">OTH {currMacroOTH}%</span>
          </div>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200 shadow-inner">
          <div style={{ width: `${currMacroTDP}%` }} className="bg-[#eab308] h-full rounded-l-full transition-all duration-150" title={`TDP: ${currMacroTDP}%`} />
          <div style={{ width: `${currMacroYSRCP}%` }} className="bg-[#0284c7] h-full transition-all duration-150" title={`YSRCP: ${currMacroYSRCP}%`} />
          <div style={{ width: `${currMacroJSP}%` }} className="bg-[#e11d48] h-full transition-all duration-150" title={`JSP: ${currMacroJSP}%`} />
          <div style={{ width: `${currMacroOTH}%` }} className="bg-slate-400 h-full rounded-r-full transition-all duration-150" title={`OTH: ${currMacroOTH}%`} />
        </div>
      </div>

      {/* Collapsible Fine-Tuning Sliders */}
      {isMacroExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
          {/* TDP Macro Control */}
          <div className="bg-slate-50 p-3 rounded-xl border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                <span className="text-xs font-black text-amber-900">TDP (Telugu Desam)</span>
              </div>
              <button
                onClick={() => setMacroLocked((prev) => ({ ...prev, TDP: !prev.TDP }))}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  macroLocked.TDP ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={macroLocked.TDP ? 'TDP is locked from auto-rebalancing' : 'Click to lock TDP'}
              >
                {macroLocked.TDP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-900 font-mono">{currMacroTDP}%</span>
              <span
                className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                  (macroSwing.TDP || 0) > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : (macroSwing.TDP || 0) < 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {(macroSwing.TDP || 0) > 0 ? `+${macroSwing.TDP}%` : `${macroSwing.TDP || 0}%`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAdjustMacro('TDP', Math.max(0, currMacroTDP - 1))}
                disabled={macroLocked.TDP}
                className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
              >
                -
              </button>
              <input
                type="range"
                min="20"
                max="75"
                step="0.5"
                value={currMacroTDP}
                disabled={macroLocked.TDP}
                onChange={(e) => onAdjustMacro('TDP', Number(e.target.value))}
                className="flex-1 accent-amber-600 cursor-pointer disabled:opacity-40 h-1.5 bg-slate-200 rounded-lg"
              />
              <button
                onClick={() => onAdjustMacro('TDP', Math.min(85, currMacroTDP + 1))}
                disabled={macroLocked.TDP}
                className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
              >
                +
              </button>
            </div>
          </div>

          {/* YSRCP Macro Control */}
          <div className="bg-slate-50 p-3 rounded-xl border border-sky-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7]" />
                <span className="text-xs font-black text-sky-900">YSRCP (YSR Congress)</span>
              </div>
              <button
                onClick={() => setMacroLocked((prev) => ({ ...prev, YSRCP: !prev.YSRCP }))}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  macroLocked.YSRCP ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={macroLocked.YSRCP ? 'YSRCP is locked from auto-rebalancing' : 'Click to lock YSRCP'}
              >
                {macroLocked.YSRCP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-900 font-mono">{currMacroYSRCP}%</span>
              <span
                className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                  (macroSwing.YSRCP || 0) > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : (macroSwing.YSRCP || 0) < 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {(macroSwing.YSRCP || 0) > 0 ? `+${macroSwing.YSRCP}%` : `${macroSwing.YSRCP || 0}%`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAdjustMacro('YSRCP', Math.max(0, currMacroYSRCP - 1))}
                disabled={macroLocked.YSRCP}
                className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
              >
                -
              </button>
              <input
                type="range"
                min="15"
                max="65"
                step="0.5"
                value={currMacroYSRCP}
                disabled={macroLocked.YSRCP}
                onChange={(e) => onAdjustMacro('YSRCP', Number(e.target.value))}
                className="flex-1 accent-sky-600 cursor-pointer disabled:opacity-40 h-1.5 bg-slate-200 rounded-lg"
              />
              <button
                onClick={() => onAdjustMacro('YSRCP', Math.min(80, currMacroYSRCP + 1))}
                disabled={macroLocked.YSRCP}
                className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
              >
                +
              </button>
            </div>
          </div>

          {/* JSP Macro Control */}
          <div className="bg-slate-50 p-3 rounded-xl border border-rose-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" />
                <span className="text-xs font-black text-rose-900">JSP (Janasena Party)</span>
              </div>
              <button
                onClick={() => setMacroLocked((prev) => ({ ...prev, JSP: !prev.JSP }))}
                className={`p-1 rounded-md transition-colors cursor-pointer ${
                  macroLocked.JSP ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
                title={macroLocked.JSP ? 'JSP is locked from auto-rebalancing' : 'Click to lock JSP'}
              >
                {macroLocked.JSP ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-black text-slate-900 font-mono">{currMacroJSP}%</span>
              <span
                className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                  (macroSwing.JSP || 0) > 0
                    ? 'bg-emerald-100 text-emerald-800'
                    : (macroSwing.JSP || 0) < 0
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {(macroSwing.JSP || 0) > 0 ? `+${macroSwing.JSP}%` : `${macroSwing.JSP || 0}%`}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAdjustMacro('JSP', Math.max(0, currMacroJSP - 1))}
                disabled={macroLocked.JSP}
                className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
              >
                -
              </button>
              <input
                type="range"
                min="0"
                max="40"
                step="0.5"
                value={currMacroJSP}
                disabled={macroLocked.JSP}
                onChange={(e) => onAdjustMacro('JSP', Number(e.target.value))}
                className="flex-1 accent-rose-600 cursor-pointer disabled:opacity-40 h-1.5 bg-slate-200 rounded-lg"
              />
              <button
                onClick={() => onAdjustMacro('JSP', Math.min(60, currMacroJSP + 1))}
                disabled={macroLocked.JSP}
                className="w-7 h-7 flex items-center justify-center bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-300 text-slate-700 rounded-lg text-sm font-bold cursor-pointer transition-colors shadow-2xs"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
