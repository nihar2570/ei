import React from 'react';
import { AlertTriangle } from 'lucide-react';
import type { CoalitionSettings } from '../StrategicSimulationModels';
import { DEFAULT_COALITION_SETTINGS } from '../StrategicSimulationModels';

interface CoalitionTabProps {
  isCoalitionActive: boolean;
  activePreset: string;
  onApplyPreset: (presetKey: string) => void;
  coalitionSettings: CoalitionSettings;
  setCoalitionSettings: React.Dispatch<React.SetStateAction<CoalitionSettings>>;
}

export const CoalitionTab: React.FC<CoalitionTabProps> = ({
  isCoalitionActive,
  activePreset,
  onApplyPreset,
  coalitionSettings,
  setCoalitionSettings,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {!isCoalitionActive && (
        <div className="bg-amber-950/60 border border-amber-500/40 p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              The active simulation is currently set to <strong>{activePreset}</strong>. To see coalition cadre transfer in action, activate the NDA Alliance (TDP+JSP+BJP) scenario.
            </span>
          </div>
          <button
            onClick={() => onApplyPreset('nda_2024_sweep')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Activate NDA Alliance
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Friction Slider 1: TDP to JSP */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-yellow-400">TDP Cadre Transfer to Janasena</span>
            <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
              {coalitionSettings.tdpToJspTransferPct}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Percentage of baseline TDP voters who vote for the Janasena candidate in the 21 JSP-allocated constituencies.
          </p>
          <input
            type="range"
            min="50"
            max="95"
            step="5"
            value={coalitionSettings.tdpToJspTransferPct}
            onChange={(e) =>
              setCoalitionSettings((prev) => ({ ...prev, tdpToJspTransferPct: Number(e.target.value) }))
            }
            className="w-full accent-yellow-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>50% (High Local Friction)</span>
            <span>95% (Perfect Alignment)</span>
          </div>
        </div>

        {/* Friction Slider 2: JSP to TDP */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-rose-400">Janasena Transfer to TDP</span>
            <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
              {coalitionSettings.jspToTdpTransferPct}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Percentage of passionate Kapu/youth Janasena voters who cast ballots for the TDP candidate in 144 seats.
          </p>
          <input
            type="range"
            min="50"
            max="95"
            step="5"
            value={coalitionSettings.jspToTdpTransferPct}
            onChange={(e) =>
              setCoalitionSettings((prev) => ({ ...prev, jspToTdpTransferPct: Number(e.target.value) }))
            }
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>50% (Kapu Dissent)</span>
            <span>95% (Disciplined Transfer)</span>
          </div>
        </div>

        {/* Friction Slider 3: Rebel Leakage to YSRCP */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-blue-400">Disgruntled Rebel Leakage to YSRCP</span>
            <span className="text-xs font-mono font-black text-blue-300 bg-blue-950 px-2 py-0.5 rounded">
              {coalitionSettings.rebelLeakagePct}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Local grassroots ticket rebels who defect or silently cross-vote for the YSRCP opposition candidate.
          </p>
          <input
            type="range"
            min="5"
            max="35"
            step="5"
            value={coalitionSettings.rebelLeakagePct}
            onChange={(e) =>
              setCoalitionSettings((prev) => ({ ...prev, rebelLeakagePct: Number(e.target.value) }))
            }
            className="w-full accent-blue-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>5% (Disciplined Alliance)</span>
            <span>35% (Mass Mutiny)</span>
          </div>
        </div>
      </div>

      {/* Quick One-Click Coalition Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
        <span className="text-slate-400 font-bold uppercase text-[10px]">NDA Coalition Presets:</span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() =>
              setCoalitionSettings({
                tdpToJspTransferPct: 90,
                jspToTdpTransferPct: 88,
                ndaToBjpTransferPct: 80,
                rebelLeakagePct: 8,
              })
            }
            className="px-3 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/60 rounded-lg font-bold cursor-pointer transition-colors"
          >
            2024 Clean Sweep (90:88 | 8% Leak)
          </button>
          <button
            onClick={() => setCoalitionSettings(DEFAULT_COALITION_SETTINGS)}
            className="px-3 py-1 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-300 border border-indigo-700/60 rounded-lg font-bold cursor-pointer transition-colors"
          >
            Standard Formula (85:80 | 12% Leak)
          </button>
          <button
            onClick={() =>
              setCoalitionSettings({
                tdpToJspTransferPct: 65,
                jspToTdpTransferPct: 60,
                ndaToBjpTransferPct: 60,
                rebelLeakagePct: 25,
              })
            }
            className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-300 border border-rose-700/60 rounded-lg font-bold cursor-pointer transition-colors"
          >
            High Friction &amp; Dissent (65:60 | 25% Leak)
          </button>
        </div>
      </div>
    </div>
  );
};
