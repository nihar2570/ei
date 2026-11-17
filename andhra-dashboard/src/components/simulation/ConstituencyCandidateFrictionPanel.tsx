import React from 'react';
import {
  Flame,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  UserCheck,
  ShieldAlert,
  Users2,
  Scale,
  Sparkles,
} from 'lucide-react';
import type { CandidateFrictionValues } from '../../types';
import { getPartyColor } from '../../types';

interface ConstituencyCandidateFrictionPanelProps {
  acNo: number;
  acName: string;
  district: string;
  incumbentParty: string;
  incumbentCandidateName?: string;
  margin2024: number;
  currentSimulatedMargin: number;
  currentSimulatedWinner: string;
  isFlipped: boolean;
  frictionValues?: CandidateFrictionValues;
  onUpdateFriction: (acNo: number, values: CandidateFrictionValues) => void;
  onResetFriction: (acNo: number) => void;
}

const DEFAULT_FRICTION: CandidateFrictionValues = {
  accessibility: 0,
  syndicateMafia: 0,
  cadreRebel: 0,
  casteFaction: 0,
};

export const ConstituencyCandidateFrictionPanel: React.FC<ConstituencyCandidateFrictionPanelProps> = ({
  acNo,
  acName,
  district,
  incumbentParty,
  incumbentCandidateName,
  margin2024: _margin2024,
  currentSimulatedMargin,
  currentSimulatedWinner,
  isFlipped,
  frictionValues = DEFAULT_FRICTION,
  onUpdateFriction,
  onResetFriction,
}) => {
  const accessibility = frictionValues.accessibility ?? 0;
  const syndicateMafia = frictionValues.syndicateMafia ?? 0;
  const cadreRebel = frictionValues.cadreRebel ?? 0;
  const casteFaction = frictionValues.casteFaction ?? 0;

  const netDelta = Number(
    (accessibility + syndicateMafia + cadreRebel + casteFaction).toFixed(1)
  );
  const isCustomized =
    accessibility !== 0 || syndicateMafia !== 0 || cadreRebel !== 0 || casteFaction !== 0;

  const handleSliderChange = (key: keyof CandidateFrictionValues, value: number) => {
    onUpdateFriction(acNo, {
      ...frictionValues,
      [key]: value,
    });
  };

  const applyPreset = (preset: 'damage' | 'lift' | 'clean') => {
    if (preset === 'damage') {
      onUpdateFriction(acNo, {
        accessibility: -3.0,
        syndicateMafia: -4.0,
        cadreRebel: -2.5,
        casteFaction: -1.5,
      });
    } else if (preset === 'lift') {
      onUpdateFriction(acNo, {
        accessibility: 2.5,
        syndicateMafia: 1.5,
        cadreRebel: 2.0,
        casteFaction: 1.0,
      });
    } else {
      onResetFriction(acNo);
    }
  };

  const incumbentColor = getPartyColor(incumbentParty);
  const winnerColor = getPartyColor(currentSimulatedWinner);

  return (
    <div className="bg-slate-900/95 text-white rounded-xl border border-slate-800 p-4 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30">
            <Flame className="w-4 h-4" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-black text-sm text-white">
                Candidate Health &amp; Local Friction Modifiers
              </h4>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                AC #{acNo} {acName} ({district})
              </span>
              <span
                className="text-[10px] font-bold px-1.5 py-0.2 rounded text-white"
                style={{ backgroundColor: incumbentColor }}
              >
                Sitting {incumbentParty} MLA
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Simulate candidate personal accessibility, syndicate backlash, cadre revolt, and caste friction on the sitting {incumbentParty} MLA.
            </p>
          </div>
        </div>

        {/* Action Preset Buttons & Reset */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => applyPreset('damage')}
            className="px-2 py-1 text-[11px] font-bold rounded-md bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 transition-colors cursor-pointer"
            title="Apply heavy local anti-incumbency (-11% drag)"
          >
            🔥 High Damage (-11%)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('lift')}
            className="px-2 py-1 text-[11px] font-bold rounded-md bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 transition-colors cursor-pointer"
            title="Apply high candidate popularity (+7% lift)"
          >
            ⭐ Popular Nominee (+7%)
          </button>
          {isCustomized && (
            <button
              type="button"
              onClick={() => onResetFriction(acNo)}
              className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Reset sliders for this constituency"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* The 4 Continuous Dimension Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Dimension 1: Accessibility */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/90 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
              1. Accessibility &amp; Availability
            </span>
            <span
              className={`font-mono font-bold text-xs px-1.5 py-0.2 rounded ${
                accessibility > 0
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                  : accessibility < 0
                  ? 'bg-rose-900/60 text-rose-300 border border-rose-700'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {accessibility > 0 ? `+${accessibility}%` : `${accessibility}%`}
            </span>
          </div>
          <input
            type="range"
            min="-4.0"
            max="3.5"
            step="0.5"
            value={accessibility}
            onChange={(e) => handleSliderChange('accessibility', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>-4.0% (Absentee/Remote)</span>
            <span>+3.5% (Weekly Darbar)</span>
          </div>
        </div>

        {/* Dimension 2: Syndicate & Corruption Perception */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/90 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              2. Syndicate / Mafia Perception
            </span>
            <span
              className={`font-mono font-bold text-xs px-1.5 py-0.2 rounded ${
                syndicateMafia > 0
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                  : syndicateMafia < 0
                  ? 'bg-rose-900/60 text-rose-300 border border-rose-700'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {syndicateMafia > 0 ? `+${syndicateMafia}%` : `${syndicateMafia}%`}
            </span>
          </div>
          <input
            type="range"
            min="-5.5"
            max="2.0"
            step="0.5"
            value={syndicateMafia}
            onChange={(e) => handleSliderChange('syndicateMafia', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>-5.5% (Sand/Land Mafia)</span>
            <span>+2.0% (Clean Goodwill)</span>
          </div>
        </div>

        {/* Dimension 3: Cadre Cohesion & Rebel Sabotage */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/90 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Users2 className="w-3.5 h-3.5 text-sky-400" />
              3. Cadre Cohesion &amp; Rebel Sabotage
            </span>
            <span
              className={`font-mono font-bold text-xs px-1.5 py-0.2 rounded ${
                cadreRebel > 0
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                  : cadreRebel < 0
                  ? 'bg-rose-900/60 text-rose-300 border border-rose-700'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {cadreRebel > 0 ? `+${cadreRebel}%` : `${cadreRebel}%`}
            </span>
          </div>
          <input
            type="range"
            min="-4.5"
            max="2.5"
            step="0.5"
            value={cadreRebel}
            onChange={(e) => handleSliderChange('cadreRebel', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>-4.5% (Rebel Sabotage)</span>
            <span>+2.5% (Unified Machine)</span>
          </div>
        </div>

        {/* Dimension 4: Caste & Faction Chemistry */}
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/90 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-purple-400" />
              4. Local Caste &amp; Faction Chemistry
            </span>
            <span
              className={`font-mono font-bold text-xs px-1.5 py-0.2 rounded ${
                casteFaction > 0
                  ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                  : casteFaction < 0
                  ? 'bg-rose-900/60 text-rose-300 border border-rose-700'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {casteFaction > 0 ? `+${casteFaction}%` : `${casteFaction}%`}
            </span>
          </div>
          <input
            type="range"
            min="-4.0"
            max="2.0"
            step="0.5"
            value={casteFaction}
            onChange={(e) => handleSliderChange('casteFaction', parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>-4.0% (Sub-Caste Revolt)</span>
            <span>+2.0% (Social Coalition)</span>
          </div>
        </div>
      </div>

      {/* Net Outcome Strip */}
      <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">
              Net Candidate Swing ({incumbentParty})
            </span>
            <div
              className={`text-sm font-black font-mono flex items-center gap-1 ${
                netDelta > 0
                  ? 'text-emerald-400'
                  : netDelta < 0
                  ? 'text-rose-400'
                  : 'text-slate-300'
              }`}
            >
              {netDelta > 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : netDelta < 0 ? (
                <TrendingDown className="w-4 h-4 text-rose-400" />
              ) : null}
              <span>{netDelta > 0 ? `+${netDelta}% Personal Lift` : netDelta < 0 ? `${netDelta}% Personal Drag` : '0.0% Baseline'}</span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 block uppercase font-mono">
              Simulated Outcome in #{acNo}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <span
                className="px-2 py-0.5 rounded text-[11px] text-white"
                style={{ backgroundColor: winnerColor }}
              >
                {currentSimulatedWinner}
              </span>
              <span className="font-mono text-slate-200">
                +{currentSimulatedMargin.toLocaleString()} margin
              </span>
              {isFlipped && (
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  FLIPPED from {incumbentParty}
                </span>
              )}
            </div>
          </div>
        </div>

        {incumbentCandidateName && (
          <div className="text-[11px] text-slate-400 font-sans text-right hidden lg:block">
            Sitting MLA: <strong className="text-slate-200">{incumbentCandidateName}</strong> ({incumbentParty})
          </div>
        )}
      </div>
    </div>
  );
};
