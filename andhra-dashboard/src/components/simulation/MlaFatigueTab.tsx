import React from 'react';
import type { MacroSwing } from '../SwingStudioModal';
import type { MlaFatigueSettings } from '../StrategicSimulationModels';

interface MlaFatigueTabProps {
  macroSwing: MacroSwing;
  setMacroSwing: React.Dispatch<React.SetStateAction<MacroSwing>>;
  mlaFatigueSettings: MlaFatigueSettings;
  setMlaFatigueSettings: React.Dispatch<React.SetStateAction<MlaFatigueSettings>>;
}

export const MlaFatigueTab: React.FC<MlaFatigueTabProps> = ({
  macroSwing,
  setMacroSwing,
  mlaFatigueSettings,
  setMlaFatigueSettings,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Statewide Macro Swing */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-rose-400">Statewide Swing against NDA Coalition</span>
          <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
            {macroSwing.TDP}%
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Models uniform statewide anti-incumbency across all 175 constituencies. Negative values shave votes from TDP/NDA and transfer to YSRCP.
        </p>
        <input
          type="range"
          min="-12"
          max="6"
          step="0.5"
          value={macroSwing.TDP}
          onChange={(e) => {
            const val = Number(e.target.value);
            setMacroSwing({
              TDP: val,
              YSRCP: Math.round(-val * 0.85 * 10) / 10,
              JSP: Math.round(val * 0.15 * 10) / 10,
            });
          }}
          className="w-full accent-rose-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>-12% (Severe Backlash)</span>
          <span>0% (Neutral)</span>
          <span>+6% (Pro-Incumbent)</span>
        </div>
      </div>

      {/* MLA Surgery */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-purple-400">Incumbent MLA Replacement Surgery</span>
          <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
            {mlaFatigueSettings.replaceIncumbentPct}% Dropped
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Dropping unpopular sitting MLAs eliminates the local -4.5% voter fatigue penalty and grants a +4.0% fresh face boost.
        </p>
        <input
          type="range"
          min="0"
          max="50"
          step="5"
          value={mlaFatigueSettings.replaceIncumbentPct}
          onChange={(e) =>
            setMlaFatigueSettings((prev) => ({ ...prev, replaceIncumbentPct: Number(e.target.value) }))
          }
          className="w-full accent-purple-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>0% (All Retained)</span>
          <span>50% (Radical Ticket Surgery)</span>
        </div>
      </div>
    </div>
  );
};
