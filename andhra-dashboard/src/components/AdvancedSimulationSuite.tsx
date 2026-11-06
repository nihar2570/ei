import React, { useState, useMemo, useEffect } from 'react';
import type { DemographicsDataset, SimulatedConstituencyResult } from '../types';
import type { MacroSwing, PartySwing } from './SwingStudioModal';
import {
  Handshake,
  Users,
  TrendingDown,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Sliders,
} from 'lucide-react';
import { CampaignPollingTracker538 } from './CampaignPollingTracker538';
import type {
  CoalitionSettings,
  MlaFatigueSettings,
  GroundCrisisSettings,
} from './StrategicSimulationModels';
import { CasteBlocsTab } from './simulation/CasteBlocsTab';
import { CoalitionTab } from './simulation/CoalitionTab';
import { TurnoutTab } from './simulation/TurnoutTab';
import { MlaFatigueTab } from './simulation/MlaFatigueTab';
import { GroundCrisesMatrix } from './simulation/GroundCrisesMatrix';

export interface TurnoutSettings {
  urbanShift: number;   // -15% to +15%
  ruralShift: number;   // -10% to +10%
  femaleShift: number;  // -8% to +8%
}

export interface AdvancedSimulationSuiteProps {
  data: DemographicsDataset;
  simulatedResults: SimulatedConstituencyResult[];
  activePreset: string;
  onApplyPreset: (presetKey: string) => void;
  swings: Record<string, PartySwing>;
  setSwings: React.Dispatch<React.SetStateAction<Record<string, PartySwing>>>;
  macroSwing: MacroSwing;
  setMacroSwing: React.Dispatch<React.SetStateAction<MacroSwing>>;
  turnoutSettings: TurnoutSettings;
  setTurnoutSettings: React.Dispatch<React.SetStateAction<TurnoutSettings>>;
  coalitionSettings: CoalitionSettings;
  setCoalitionSettings: React.Dispatch<React.SetStateAction<CoalitionSettings>>;
  mlaFatigueSettings: MlaFatigueSettings;
  setMlaFatigueSettings: React.Dispatch<React.SetStateAction<MlaFatigueSettings>>;
  groundCrisisSettings: GroundCrisisSettings;
  setGroundCrisisSettings: React.Dispatch<React.SetStateAction<GroundCrisisSettings>>;
  onNavigateToActions: (acNo?: number) => void;
  onOpenDemographicStudio?: () => void;
  activeCustomizedCount?: number;
  requestedTab?: WhatIfTab;
  onTabChange?: (tab: WhatIfTab) => void;
}

export type WhatIfTab =
  | 'caste_blocs'
  | 'coalition'
  | 'turnout'
  | 'anti_incumbency'
  | 'target_60'
  | 'polling_momentum';

// Urban constituency numbers (Key municipal corporations & urban industrial belts in Andhra Pradesh)
export const URBAN_AC_NOS = new Set([
  // Visakhapatnam Greater Corporation (21, 22, 23, 24, 25)
  21, 22, 23, 24, 25,
  // Vijayawada Municipal Corporation (79, 80, 81)
  79, 80, 81,
  // Guntur City (94, 95) & Tenali (91)
  94, 95, 91,
  // Godavari Urban Centers: Kakinada City (41), Rajahmundry City (50), Bhimavaram (59), Eluru (65)
  41, 50, 59, 65,
  // Rayalaseema Urban Centers: Kurnool (137), Tirupati (167), Kadapa (126), Anantapur Urban (153), Nandyal (139), Proddatur (132), Hindupur (157), Adoni (146)
  137, 167, 126, 153, 139, 132, 157, 146,
  // South Coastal Urban Centers: Nellore City (117), Ongole (108), Machilipatnam (75)
  117, 108, 75,
  // North Coastal Urban Centers: Vizianagaram (18), Srikakulam (5)
  18, 5,
]);

export const AdvancedSimulationSuite: React.FC<AdvancedSimulationSuiteProps> = ({
  simulatedResults,
  activePreset,
  onApplyPreset,
  swings,
  setSwings,
  macroSwing,
  setMacroSwing,
  turnoutSettings,
  setTurnoutSettings,
  coalitionSettings,
  setCoalitionSettings,
  mlaFatigueSettings,
  setMlaFatigueSettings,
  groundCrisisSettings,
  setGroundCrisisSettings,
  onOpenDemographicStudio,
  activeCustomizedCount = 0,
  requestedTab,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState<WhatIfTab>(requestedTab || 'caste_blocs');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const activeCrisisCount = useMemo(() => {
    let c = 0;
    if (groundCrisisSettings.amaravatiPaceSlowdown > 0) c++;
    if (groundCrisisSettings.superSixFiscalFriction > 0) c++;
    if (groundCrisisSettings.vizagSteelPlantBacklash > 0) c++;
    if (groundCrisisSettings.redBookPolarization > 0) c++;
    if (groundCrisisSettings.tdpJspCadreClash > 0) c++;
    if (groundCrisisSettings.rayalaseemaWaterGrievance > 0) c++;
    if (groundCrisisSettings.tirupatiPrasadamControversy > 0) c++;
    if (groundCrisisSettings.polavaramDisplacementAgitation > 0) c++;
    if (groundCrisisSettings.aquaFarmerPowerTariffCrisis > 0) c++;
    if (groundCrisisSettings.cropInsuranceFarmerDistress > 0) c++;
    if (groundCrisisSettings.liquorPolicyRetailDisruption > 0) c++;
    if (groundCrisisSettings.govtEmployeePensionDiscontent > 0) c++;
    return c;
  }, [groundCrisisSettings]);

  useEffect(() => {
    if (requestedTab) {
      setActiveTab(requestedTab);
      setIsCollapsed(false);
    }
  }, [requestedTab]);

  const handleSelectTab = (tab: WhatIfTab) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  // Real-time seat tallies from compounded results
  const simulatedPartyTally = useMemo(() => {
    const tally: Record<string, number> = { TDP: 0, YSRCP: 0, JSP: 0, BJP: 0, INC: 0, Others: 0 };
    let totalFlips = 0;
    simulatedResults.forEach((r) => {
      const p = r.simulated.winner_party;
      tally[p] = (tally[p] || 0) + 1;
      if (r.simulated.is_flipped) totalFlips++;
    });
    return { tally, totalFlips };
  }, [simulatedResults]);

  const isCoalitionActive = [
    'nda_2024_sweep',
    'nda_2029_defense',
    'nda_2029_max_surge',
    'nda_super_wave',
    'baseline',
    'tdp_vs_jsp_bjp_2029',
  ].includes(activePreset);

  const isHistorical = [
    'nda_2024_sweep',
    'baseline',
    'ysrcp_2019_wave',
    'bifurcation_2014',
  ].includes(activePreset);

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl overflow-hidden transition-all">
      {/* Header & Collapsed Summary Ribbon */}
      <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black tracking-wider uppercase text-indigo-400 font-mono">
                War Room Modifiers
              </span>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded font-mono font-bold">
                Step 2: Add What-Ifs
              </span>
              {isCoalitionActive && (
                <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-700/50 px-2 py-0.5 rounded font-mono font-bold">
                  NDA Alliance Active
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Chief Advisor "What-If" Simulation Suite</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Status Pills */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              Tally: TDP {simulatedPartyTally.tally.TDP || 0} | YSRCP {simulatedPartyTally.tally.YSRCP || 0} | JSP {simulatedPartyTally.tally.JSP || 0} | BJP {simulatedPartyTally.tally.BJP || 0}
            </span>
            <span className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              Turnout: {turnoutSettings.urbanShift !== 0 || turnoutSettings.ruralShift !== 0 ? 'Shifted' : 'Baseline'}
            </span>
            <span className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[11px]">
              Macro: {macroSwing.TDP !== 0 ? `TDP ${macroSwing.TDP}%` : '0%'}
            </span>
            {isCoalitionActive && (
              <span className="px-2 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800 text-[11px] font-bold">
                Friction: {coalitionSettings.rebelLeakagePct}% Leak
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            {isCollapsed ? (
              <>
                <ChevronDown className="w-4 h-4 text-indigo-400" />
                <span>Expand What-Ifs</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-4 h-4 text-slate-400" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-4 sm:p-5 space-y-5">
          {/* 5 Clean What-If Navigation Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => handleSelectTab('caste_blocs')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'caste_blocs'
                  ? 'bg-amber-600 text-white shadow-md font-black ring-1 ring-amber-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Users className="w-4 h-4 text-amber-300" />
              <span>1. Decisive Caste &amp; Blocs</span>
            </button>

            <button
              onClick={() => handleSelectTab('coalition')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'coalition'
                  ? 'bg-purple-600 text-white shadow-md font-black ring-1 ring-purple-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Handshake className="w-4 h-4 text-purple-300" />
              <span>2. Coalition &amp; Friction</span>
            </button>

            <button
              onClick={() => handleSelectTab('turnout')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'turnout'
                  ? 'bg-sky-600 text-white shadow-md font-black ring-1 ring-sky-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <Users className="w-4 h-4 text-sky-300" />
              <span>3. Turnout &amp; Mobilization</span>
            </button>

            <button
              onClick={() => handleSelectTab('anti_incumbency')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'anti_incumbency'
                  ? 'bg-rose-600 text-white shadow-md font-black ring-1 ring-rose-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <TrendingDown className="w-4 h-4 text-rose-300" />
              <span>4. Anti-Inc &amp; Crises</span>
              {activeCrisisCount > 0 && (
                <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-500/50 px-1.5 py-0.2 rounded font-mono font-bold">
                  {activeCrisisCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleSelectTab('polling_momentum')}
              className={`px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'polling_momentum' || activeTab === 'target_60'
                  ? 'bg-amber-600 text-white shadow-md font-black ring-1 ring-amber-400/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-amber-300" />
              <span>5. Polling &amp; Momentum</span>
            </button>
          </div>

          {/* TAB 1: DECISIVE CASTE & DEMOGRAPHIC BLOCS */}
          {activeTab === 'caste_blocs' && (
            <CasteBlocsTab
              swings={swings}
              setSwings={setSwings}
              onOpenDemographicStudio={onOpenDemographicStudio}
              activeCustomizedCount={activeCustomizedCount}
              isHistorical={isHistorical}
              activePreset={activePreset}
            />
          )}

          {/* TAB 2: COALITION FRICTION & CADRE TRANSFER */}
          {activeTab === 'coalition' && (
            <CoalitionTab
              isCoalitionActive={isCoalitionActive}
              activePreset={activePreset}
              onApplyPreset={onApplyPreset}
              coalitionSettings={coalitionSettings}
              setCoalitionSettings={setCoalitionSettings}
            />
          )}

          {/* TAB 3: TURNOUT & MOBILIZATION */}
          {activeTab === 'turnout' && (
            <TurnoutTab
              turnoutSettings={turnoutSettings}
              setTurnoutSettings={setTurnoutSettings}
            />
          )}

          {/* TAB 4: ANTI-INCUMBENCY & GROUND REALITIES */}
          {activeTab === 'anti_incumbency' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Row 1: Statewide Macro & MLA Replacement Surgery */}
              <MlaFatigueTab
                macroSwing={macroSwing}
                setMacroSwing={setMacroSwing}
                mlaFatigueSettings={mlaFatigueSettings}
                setMlaFatigueSettings={setMlaFatigueSettings}
              />

              {/* Row 2: Andhra Pradesh Ground Realities & Crisis Stress-Testing Matrix */}
              <GroundCrisesMatrix
                groundCrisisSettings={groundCrisisSettings}
                setGroundCrisisSettings={setGroundCrisisSettings}
                activeCrisisCount={activeCrisisCount}
              />
            </div>
          )}

          {/* TAB 5: POLLING & MOMENTUM (2024 RETROSPECTIVE + 2029 FORECAST SCENARIOS) */}
          {(activeTab === 'target_60' || activeTab === 'polling_momentum') && (
            <CampaignPollingTracker538
              activePreset={activePreset}
              simulatedResults={simulatedResults}
              onApplyPreset={onApplyPreset}
            />
          )}
        </div>
      )}
    </div>
  );
};
