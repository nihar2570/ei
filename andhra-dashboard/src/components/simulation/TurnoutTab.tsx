import React from 'react';
import type { TurnoutSettings } from '../AdvancedSimulationSuite';

interface TurnoutTabProps {
  turnoutSettings: TurnoutSettings;
  setTurnoutSettings: React.Dispatch<React.SetStateAction<TurnoutSettings>>;
}

export const TurnoutTab: React.FC<TurnoutTabProps> = ({
  turnoutSettings,
  setTurnoutSettings,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Urban Turnout */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-sky-400">Urban Voter Turnout Shift</span>
            <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
              {turnoutSettings.urbanShift >= 0 ? `+${turnoutSettings.urbanShift}%` : `${turnoutSettings.urbanShift}%`}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Visakhapatnam, Vijayawada, Guntur, Tirupati, and urban municipalities. Simulates urban corridor voter apathy vs middle-class turnout waves.
          </p>
          <input
            type="range"
            min="-15"
            max="15"
            step="1"
            value={turnoutSettings.urbanShift}
            onChange={(e) =>
              setTurnoutSettings((prev) => ({ ...prev, urbanShift: Number(e.target.value) }))
            }
            className="w-full accent-sky-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>-15% (Severe Apathy)</span>
            <span>+15% (Urban Surge)</span>
          </div>
        </div>

        {/* Rural Turnout */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-400">Rural Agrarian Turnout Shift</span>
            <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
              {turnoutSettings.ruralShift >= 0 ? `+${turnoutSettings.ruralShift}%` : `${turnoutSettings.ruralShift}%`}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Rural farmer constituencies. Simulates agrarian mobilization over crop loan waivers, MSP, and Rythu Bharosa.
          </p>
          <input
            type="range"
            min="-10"
            max="10"
            step="1"
            value={turnoutSettings.ruralShift}
            onChange={(e) =>
              setTurnoutSettings((prev) => ({ ...prev, ruralShift: Number(e.target.value) }))
            }
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>-10% (Agrarian Drop)</span>
            <span>+10% (Farmer Surge)</span>
          </div>
        </div>

        {/* Female Mobilization */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-purple-400">Aadabidda Nidhi &amp; Super-Six Female Mobilization</span>
            <span className="text-xs font-mono font-black text-white bg-slate-800 px-2 py-0.5 rounded">
              {turnoutSettings.femaleShift >= 0 ? `+${turnoutSettings.femaleShift}%` : `${turnoutSettings.femaleShift}%`}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Women voter mobilization driven by Aadabidda Nidhi, Stree Shakti free RTC bus travel, and Deepam subsidized gas (+ shifts votes to NDA coalition).
          </p>
          <input
            type="range"
            min="-8"
            max="8"
            step="1"
            value={turnoutSettings.femaleShift}
            onChange={(e) =>
              setTurnoutSettings((prev) => ({ ...prev, femaleShift: Number(e.target.value) }))
            }
            className="w-full accent-purple-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>-8% (Fatigue)</span>
            <span>+8% (Women Consolidation)</span>
          </div>
        </div>
      </div>

      {/* Turnout Presets */}
      <div className="flex items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
        <span className="text-slate-400 font-bold uppercase text-[10px]">Turnout Presets:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setTurnoutSettings({ urbanShift: 6, ruralShift: -2, femaleShift: 0 })}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold cursor-pointer"
          >
            Urban Anti-Incumbent Surge (+6% Urban)
          </button>
          <button
            onClick={() => setTurnoutSettings({ urbanShift: -6, ruralShift: 4, femaleShift: 3 })}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-bold cursor-pointer"
          >
            Rural Welfare Surge (+4% Rural, +3% Women)
          </button>
          <button
            onClick={() => setTurnoutSettings({ urbanShift: 0, ruralShift: 0, femaleShift: 0 })}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg font-bold cursor-pointer"
          >
            Reset (0%)
          </button>
        </div>
      </div>
    </div>
  );
};
