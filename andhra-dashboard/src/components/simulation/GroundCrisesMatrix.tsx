import React from 'react';
import { Flame } from 'lucide-react';
import type { GroundCrisisSettings } from '../StrategicSimulationModels';
import { DEFAULT_GROUND_CRISIS_SETTINGS } from '../StrategicSimulationModels';
import { CRISIS_REGISTRY } from './crisisRegistry';
import { CrisisCard } from './CrisisCard';

interface GroundCrisesMatrixProps {
  groundCrisisSettings: GroundCrisisSettings;
  setGroundCrisisSettings: React.Dispatch<React.SetStateAction<GroundCrisisSettings>>;
  activeCrisisCount: number;
}

export const GroundCrisesMatrix: React.FC<GroundCrisesMatrixProps> = ({
  groundCrisisSettings,
  setGroundCrisisSettings,
  activeCrisisCount,
}) => {
  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 rounded-xl border border-rose-900/40 shadow-lg space-y-4">
      {/* Header & Preset Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white">
                Andhra Pradesh Ground Realities &amp; Crisis Stress Matrix
              </h4>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border ${
                  activeCrisisCount > 0
                    ? 'bg-rose-950 text-rose-300 border-rose-700/60'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {activeCrisisCount} Crises Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Model live political fault lines: Amaravati capital delivery, Super-Six fiscal delay, Vizag Steel Plant disinvestment, cadre clashes &amp; Rayalaseema water concerns.
            </p>
          </div>
        </div>

        {/* Crisis Presets */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setGroundCrisisSettings(DEFAULT_GROUND_CRISIS_SETTINGS)}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold cursor-pointer transition-colors border border-slate-700"
          >
            Baseline (0 Crises)
          </button>
          <button
            onClick={() =>
              setGroundCrisisSettings({
                ...DEFAULT_GROUND_CRISIS_SETTINGS,
                cropInsuranceFarmerDistress: 3.5,
                aquaFarmerPowerTariffCrisis: 4.0,
                rayalaseemaWaterGrievance: 4.0,
              })
            }
            className="px-2.5 py-1 text-xs bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 rounded-lg font-bold cursor-pointer transition-colors"
          >
            🌾 Agrarian &amp; Aqua Distress
          </button>
          <button
            onClick={() =>
              setGroundCrisisSettings({
                ...DEFAULT_GROUND_CRISIS_SETTINGS,
                vizagSteelPlantBacklash: 5.0,
                govtEmployeePensionDiscontent: 4.0,
                tdpJspCadreClash: 3.5,
                amaravatiPaceSlowdown: 3.0,
              })
            }
            className="px-2.5 py-1 text-xs bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700/60 rounded-lg font-bold cursor-pointer transition-colors"
          >
            🏭 Industrial &amp; Employees Agitation
          </button>
          <button
            onClick={() =>
              setGroundCrisisSettings({
                ...DEFAULT_GROUND_CRISIS_SETTINGS,
                tirupatiPrasadamControversy: 4.5,
              })
            }
            className="px-2.5 py-1 text-xs bg-orange-950/80 hover:bg-orange-900 text-orange-200 border border-orange-700/60 rounded-lg font-bold cursor-pointer transition-colors"
          >
            🪔 Sanatana Devotional Surge
          </button>
          <button
            onClick={() =>
              setGroundCrisisSettings({
                amaravatiPaceSlowdown: 5.0,
                superSixFiscalFriction: 3.5,
                vizagSteelPlantBacklash: 5.0,
                redBookPolarization: 3.0,
                tdpJspCadreClash: 5.0,
                rayalaseemaWaterGrievance: 4.5,
                tirupatiPrasadamControversy: 0,
                polavaramDisplacementAgitation: 4.0,
                aquaFarmerPowerTariffCrisis: 4.0,
                cropInsuranceFarmerDistress: 3.5,
                liquorPolicyRetailDisruption: 3.0,
                govtEmployeePensionDiscontent: 4.0,
              })
            }
            className="px-2.5 py-1 text-xs bg-rose-950/90 hover:bg-rose-900 text-rose-200 border border-rose-600/70 rounded-lg font-bold cursor-pointer transition-colors"
          >
            ⚡ Full 12-Point Stress Test
          </button>
        </div>
      </div>

      {/* 12 Crisis Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {CRISIS_REGISTRY.map((config) => (
          <CrisisCard
            key={config.key}
            config={config}
            value={groundCrisisSettings[config.key]}
            onChange={(val) =>
              setGroundCrisisSettings((prev) => ({
                ...prev,
                [config.key]: val,
              }))
            }
          />
        ))}
      </div>
    </div>
  );
};
