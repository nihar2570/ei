import React, { useState, useMemo, useEffect } from 'react';
import type {
  DemographicsDataset,
  ElectionData,
  SimulatedConstituencyResult,
  ActiveScenarioBridge,
} from '../types';
import { Sparkles, Sliders, Target, ChevronRight, ArrowRight } from 'lucide-react';
import { SwingStudioModal } from './SwingStudioModal';
import type { MacroSwing, PartySwing } from './SwingStudioModal';
import { AdvancedSimulationSuite } from './AdvancedSimulationSuite';
import type { TurnoutSettings, WhatIfTab } from './AdvancedSimulationSuite';
import { SurveyConfiguratorModal } from './SurveyConfiguratorModal';
import {
  fetchSurveysCatalog,
  BUNDLED_SURVEYS,
  getCustomSurveys,
} from '../data/surveyScenarioService';
import type { CasteSurveyDataset } from '../data/surveyScenarioService';
import {
  DEFAULT_COALITION_SETTINGS,
  DEFAULT_MLA_FATIGUE_SETTINGS,
  DEFAULT_GROUND_CRISIS_SETTINGS,
} from './StrategicSimulationModels';
import type {
  CoalitionSettings,
  MlaFatigueSettings,
  GroundCrisisSettings,
} from './StrategicSimulationModels';
import {
  DEFAULT_ZERO_SWINGS,
  READABLE_COMMUNITY_NAMES,
  runConstituencySimulation,
  computeSimulationTally,
  generateScenarioWhatIfs,
} from '../services/simulationEngine';
import { ScenarioPresetRibbon } from './simulation/ScenarioPresetRibbon';
import { SimulationAssemblyBarometer } from './simulation/SimulationAssemblyBarometer';
import { BattlegroundBubbleChart } from './simulation/BattlegroundBubbleChart';
import { BattlegroundRosterTable } from './simulation/BattlegroundRosterTable';

export { DEFAULT_ZERO_SWINGS, READABLE_COMMUNITY_NAMES };

interface SimulationsViewProps {
  data: DemographicsDataset;
  electionData?: ElectionData | null;
  onNavigateToActions: (acNo?: number) => void;
  onSelectConstituencyDossier?: (acNo: number) => void;
  onBridgeChange?: (bridge: ActiveScenarioBridge) => void;
  requestedWhatIfTab?: WhatIfTab;
  onExportToActions?: () => void;
}

export const SimulationsView: React.FC<SimulationsViewProps> = ({
  data,
  electionData,
  onNavigateToActions,
  onSelectConstituencyDossier,
  onBridgeChange,
  requestedWhatIfTab,
  onExportToActions,
}) => {
  // Demographic swing offsets relative to baseline
  const [swings, setSwings] = useState<Record<string, PartySwing>>(DEFAULT_ZERO_SWINGS);
  const [fallbackElectionData, setFallbackElectionData] = useState<ElectionData | null>(null);

  useEffect(() => {
    if (!electionData) {
      fetch('/data/andhra_elections.json')
        .then((res) => res.json())
        .then((d) => setFallbackElectionData(d))
        .catch((err) => console.error('Failed to load fallback election data:', err));
    }
  }, [electionData]);

  const activeElectionData = electionData || fallbackElectionData;

  const [macroSwing, setMacroSwing] = useState<MacroSwing>({ TDP: 0, YSRCP: 0, JSP: 0 });
  const [turnoutSettings, setTurnoutSettings] = useState<TurnoutSettings>({
    urbanShift: 0,
    ruralShift: 0,
    femaleShift: 0,
  });
  const [coalitionSettings, setCoalitionSettings] = useState<CoalitionSettings>(DEFAULT_COALITION_SETTINGS);
  const [mlaFatigueSettings, setMlaFatigueSettings] = useState<MlaFatigueSettings>(DEFAULT_MLA_FATIGUE_SETTINGS);
  const [groundCrisisSettings, setGroundCrisisSettings] = useState<GroundCrisisSettings>(DEFAULT_GROUND_CRISIS_SETTINGS);
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>('nda_2024_sweep');
  const [selectedBubbleAc, setSelectedBubbleAc] = useState<number | null>(null);
  const [tierFilter, setTierFilter] = useState<'ALL' | 'TOSS_UP' | 'FLIPS'>('TOSS_UP');
  const [tossUpThreshold, setTossUpThreshold] = useState<number>(8000);
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Surveys state (Pre-filled realistic caste demographic surveys)
  const [allSurveys, setAllSurveys] = useState<CasteSurveyDataset[]>(Object.values(BUNDLED_SURVEYS));
  const [activeSurvey, setActiveSurvey] = useState<CasteSurveyDataset>(BUNDLED_SURVEYS.survey_peoples_pulse_2026);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchSurveysCatalog().then(() => {
      const custom = getCustomSurveys();
      const bundledList = Object.values(BUNDLED_SURVEYS);
      setAllSurveys([...bundledList, ...custom]);
    });
  }, []);

  // Count actively customized communities
  const activeCustomizedCount = useMemo(() => {
    let count = 0;
    Object.values(swings).forEach((s) => {
      if ((s.TDP || 0) !== 0 || (s.YSRCP || 0) !== 0 || (s.JSP || 0) !== 0) count++;
    });
    return count;
  }, [swings]);

  // Handle Preset Scenarios for Andhra Pradesh (Historical Benchmarks & 2029 Future Realignment)
  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    const reset: Record<string, PartySwing> = {
      kapu: { TDP: 0, YSRCP: 0, JSP: 0 },
      kamma: { TDP: 0, YSRCP: 0, JSP: 0 },
      reddy: { TDP: 0, YSRCP: 0, JSP: 0 },
      bc_turpu_kapu: { TDP: 0, YSRCP: 0, JSP: 0 },
      bc_yadava: { TDP: 0, YSRCP: 0, JSP: 0 },
      bc_kuruba_boya: { TDP: 0, YSRCP: 0, JSP: 0 },
      bc_settibalija_goud: { TDP: 0, YSRCP: 0, JSP: 0 },
      bc_padmashali: { TDP: 0, YSRCP: 0, JSP: 0 },
      bc_other: { TDP: 0, YSRCP: 0, JSP: 0 },
      sc_madiga_relli: { TDP: 0, YSRCP: 0, JSP: 0 },
      sc_mala: { TDP: 0, YSRCP: 0, JSP: 0 },
      st_tribal: { TDP: 0, YSRCP: 0, JSP: 0 },
      minority_muslim: { TDP: 0, YSRCP: 0, JSP: 0 },
      minority_christian: { TDP: 0, YSRCP: 0, JSP: 0 },
      youth_18_25: { TDP: 0, YSRCP: 0, JSP: 0 },
      age_26_40: { TDP: 0, YSRCP: 0, JSP: 0 },
      age_41_60: { TDP: 0, YSRCP: 0, JSP: 0 },
      age_60_plus: { TDP: 0, YSRCP: 0, JSP: 0 },
    };

    setTurnoutSettings({ urbanShift: 0, ruralShift: 0, femaleShift: 0 });
    setCoalitionSettings(DEFAULT_COALITION_SETTINGS);
    setMlaFatigueSettings(DEFAULT_MLA_FATIGUE_SETTINGS);
    setGroundCrisisSettings(DEFAULT_GROUND_CRISIS_SETTINGS);

    if (presetKey === 'nda_2024_sweep' || presetKey === 'baseline') {
      setMacroSwing({ TDP: 0, YSRCP: 0, JSP: 0 });
    } else if (presetKey === 'ysrcp_2019_wave') {
      setMacroSwing({ TDP: 0, YSRCP: 0, JSP: 0 });
    } else if (presetKey === 'bifurcation_2014') {
      setMacroSwing({ TDP: 0, YSRCP: 0, JSP: 0 });
    } else if (presetKey === 'nda_2029_defense') {
      reset.kapu = { TDP: -2, YSRCP: 2, JSP: 0 };
      reset.sc_madiga_relli = { TDP: -4, YSRCP: 4, JSP: 0 };
      reset.youth_18_25 = { TDP: -3, YSRCP: 3, JSP: 0 };
      setMacroSwing({ TDP: -3.5, YSRCP: 4.0, JSP: -1.5 });
      setTurnoutSettings({ urbanShift: -1.5, ruralShift: 1, femaleShift: 1 });
      setMlaFatigueSettings({ replaceIncumbentPct: 20, unpopularMlaPenalty: -3.0, freshFaceBoost: 3.5, targetParty: 'TDP' });
    } else if (presetKey === 'triangular_2029_solo') {
      reset.kapu = { TDP: -10, YSRCP: -4, JSP: 14 };
      reset.youth_18_25 = { TDP: -8, YSRCP: -4, JSP: 12 };
      setMacroSwing({ TDP: -4.0, YSRCP: 1.0, JSP: 3.0 });
      setTurnoutSettings({ urbanShift: 2, ruralShift: -1, femaleShift: 0 });
    } else if (presetKey === 'tdp_vs_jsp_bjp_2029') {
      reset.kapu = { TDP: -12, YSRCP: -4, JSP: 16 };
      reset.youth_18_25 = { TDP: -8, YSRCP: -3, JSP: 11 };
      reset.kamma = { TDP: 8, YSRCP: -8, JSP: 0 };
      setMacroSwing({ TDP: -3.0, YSRCP: 0.5, JSP: 2.5 });
      setTurnoutSettings({ urbanShift: 3, ruralShift: 0, femaleShift: 0 });
    } else if (presetKey === 'ysrcp_2029_resurgence') {
      reset.reddy = { TDP: -14, YSRCP: 14, JSP: 0 };
      reset.sc_mala = { TDP: -10, YSRCP: 10, JSP: 0 };
      reset.sc_madiga_relli = { TDP: -8, YSRCP: 8, JSP: 0 };
      reset.minority_muslim = { TDP: -12, YSRCP: 12, JSP: 0 };
      reset.minority_christian = { TDP: -14, YSRCP: 14, JSP: 0 };
      reset.bc_yadava = { TDP: -6, YSRCP: 6, JSP: 0 };
      setMacroSwing({ TDP: -6.5, YSRCP: 7.2, JSP: -2.0 });
      setTurnoutSettings({ urbanShift: -2, ruralShift: 4.5, femaleShift: 2 });
    } else if (presetKey === 'nda_2029_max_surge') {
      reset.kapu = { TDP: 8, YSRCP: -12, JSP: 4 };
      reset.kamma = { TDP: 10, YSRCP: -10, JSP: 0 };
      reset.bc_turpu_kapu = { TDP: 6, YSRCP: -6, JSP: 0 };
      reset.bc_yadava = { TDP: 5, YSRCP: -5, JSP: 0 };
      reset.bc_kuruba_boya = { TDP: 6, YSRCP: -6, JSP: 0 };
      reset.youth_18_25 = { TDP: 8, YSRCP: -10, JSP: 2 };
      setMacroSwing({ TDP: 3.5, YSRCP: -4.5, JSP: 1.0 });
      setTurnoutSettings({ urbanShift: 4, ruralShift: 1, femaleShift: 2 });
    } else if (presetKey.startsWith('survey_') || presetKey.startsWith('custom_survey_')) {
      const targetSurvey = allSurveys.find((s) => s.id === presetKey) || BUNDLED_SURVEYS[presetKey];
      if (targetSurvey) {
        setActiveSurvey(targetSurvey);
        Object.entries(targetSurvey.casteSwings).forEach(([commKey, s]) => {
          reset[commKey] = { TDP: s.TDP, YSRCP: s.YSRCP, JSP: s.JSP };
        });
        setMacroSwing({ TDP: 0, YSRCP: 0, JSP: 0 });
        setTurnoutSettings({ urbanShift: 0, ruralShift: 0, femaleShift: 0 });
        setCoalitionSettings(DEFAULT_COALITION_SETTINGS);
        setMlaFatigueSettings(DEFAULT_MLA_FATIGUE_SETTINGS);
        setGroundCrisisSettings(DEFAULT_GROUND_CRISIS_SETTINGS);
      }
    }

    setSwings(reset);
  };

  // Run pure simulation arithmetic across all 175 Constituencies via simulationEngine
  const simulatedResults: SimulatedConstituencyResult[] = useMemo(() => {
    return runConstituencySimulation({
      data,
      activePreset,
      activeCustomizedCount,
      swings,
      macroSwing,
      turnoutSettings,
      coalitionSettings,
      mlaFatigueSettings,
      groundCrisisSettings,
      activeElectionData,
      tossUpThreshold,
    });
  }, [
    data,
    activePreset,
    activeCustomizedCount,
    swings,
    macroSwing,
    turnoutSettings,
    coalitionSettings,
    mlaFatigueSettings,
    groundCrisisSettings,
    activeElectionData,
    tossUpThreshold,
  ]);

  // Compute assembly tally & delta benchmarks
  const tally = useMemo(() => {
    return computeSimulationTally(simulatedResults);
  }, [simulatedResults]);

  // Generate what-if badges
  const whatIfs = useMemo(() => {
    return generateScenarioWhatIfs(
      activePreset,
      coalitionSettings,
      swings,
      turnoutSettings,
      macroSwing,
      mlaFatigueSettings,
      groundCrisisSettings,
      activeSurvey ? `${activeSurvey.title} (${activeSurvey.sampleSize?.toLocaleString()} Sample)` : undefined
    );
  }, [
    activePreset,
    coalitionSettings,
    swings,
    turnoutSettings,
    macroSwing,
    mlaFatigueSettings,
    groundCrisisSettings,
    activeSurvey,
  ]);

  // Synchronize with parent app bridge
  useEffect(() => {
    if (!onBridgeChange) return;

    let scenarioName = '🤝 2024 NDA Mandate (164 Seats)';
    if (activePreset === 'nda_2024_sweep' || activePreset === 'baseline') scenarioName = '🤝 2024 Actual Mandate (164 Seats)';
    else if (activePreset === 'ysrcp_2019_wave') scenarioName = '🌊 2019 YSRCP Wave Benchmark (151 Seats)';
    else if (activePreset === 'bifurcation_2014') scenarioName = '⚖️ 2014 Post-Bifurcation Mandate (106 Seats)';
    else if (activePreset === 'nda_2029_defense') scenarioName = '🛡️ 2029 NDA Defense (Alliance Holds)';
    else if (activePreset === 'triangular_2029_solo' || activePreset === 'jsp_solo_split') scenarioName = '💥 2029 Triangular: TDP vs JSP vs YSRCP';
    else if (activePreset === 'tdp_vs_jsp_bjp_2029') scenarioName = '🤝🔥 2029 Realigned: TDP Solo vs JSP+BJP vs YSRCP';
    else if (activePreset === 'ysrcp_2029_resurgence') scenarioName = '⚡ 2029 YSRCP Resurgence (Welfare Backlash)';
    else if (activePreset === 'nda_2029_max_surge' || activePreset === 'nda_super_wave') scenarioName = '🎯 2029 NDA Max Surge (170+ Clean Sweep)';
    else if (activePreset.startsWith('survey_') || activePreset.startsWith('custom_survey_')) scenarioName = activeSurvey ? `📊 ${activeSurvey.title}` : '📊 Field Caste Polling Survey';
    else if (activePreset === 'custom') scenarioName = '⚙️ Custom AP Strategic Scenario';

    onBridgeChange({
      id: activePreset,
      name: scenarioName,
      description: 'Simulated 175-AC Andhra Pradesh election projection with active political modifiers',
      isExportedToActions: false,
      timestamp: Date.now(),
      whatIfs,
      simulatedResults,
      tally,
    });
  }, [activePreset, whatIfs, simulatedResults, tally, onBridgeChange]);

  // Filtered list for directory and bubble selection
  const filteredList = useMemo(() => {
    return simulatedResults.filter((r) => {
      if (tierFilter === 'TOSS_UP' && r.battleground_tier !== 'TOSS_UP') return false;
      if (tierFilter === 'FLIPS' && !r.simulated.is_flipped) return false;
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase().trim();
        return (
          r.ac_name.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q) ||
          r.simulated.winner_party.toLowerCase().includes(q) ||
          r.key_demographic.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [simulatedResults, tierFilter, searchFilter]);

  const activeAcNo = selectedBubbleAc ?? filteredList[0]?.ac_no ?? simulatedResults[0]?.ac_no ?? null;

  return (
    <div className="space-y-6">
      {/* Top Banner: CM Advisor War Room Barometer & Scenario Ribbon */}
      <div className="bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
        {/* Title & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white font-mono text-xs font-black px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3" /> AP CHIEF ADVISOR WAR ROOM
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                175 ACs &middot; 26 Reorganized Districts &middot; 88 to Majority
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Assembly Majority Barometer &amp; Battleground Simulator
            </h2>
          </div>

          {onExportToActions && (
            <button
              onClick={onExportToActions}
              className="px-3.5 py-1.5 text-xs rounded-xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              title="Export this simulation scenario to Actions & Playbook"
            >
              <span>Export to Actions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Strategic Presets Ribbon */}
        <ScenarioPresetRibbon
          activePreset={activePreset}
          applyPreset={applyPreset}
          activeSurvey={activeSurvey}
          onOpenSurveyModal={() => setIsSurveyModalOpen(true)}
        />

        {/* Real-time 6-Card AP Assembly Barometer */}
        <SimulationAssemblyBarometer
          tally={tally}
          tossUpThreshold={tossUpThreshold}
        />
      </div>

      {/* Step 2: Chief Advisor "What-If" War Room Modifiers */}
      <AdvancedSimulationSuite
        data={data}
        simulatedResults={simulatedResults}
        activePreset={activePreset}
        onApplyPreset={applyPreset}
        swings={swings}
        setSwings={setSwings}
        macroSwing={macroSwing}
        setMacroSwing={setMacroSwing}
        turnoutSettings={turnoutSettings}
        setTurnoutSettings={setTurnoutSettings}
        coalitionSettings={coalitionSettings}
        setCoalitionSettings={setCoalitionSettings}
        mlaFatigueSettings={mlaFatigueSettings}
        setMlaFatigueSettings={setMlaFatigueSettings}
        groundCrisisSettings={groundCrisisSettings}
        setGroundCrisisSettings={setGroundCrisisSettings}
        onNavigateToActions={onNavigateToActions}
        onOpenDemographicStudio={() => setIsStudioOpen(true)}
        activeCustomizedCount={activeCustomizedCount}
        requestedTab={requestedWhatIfTab}
      />

      {/* Step 3: Constituency Results & Battleground Map Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div>
          <span className="text-[10px] font-black tracking-wider uppercase text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded font-mono">
            Step 3: Assembly Results &amp; Constituency Battlegrounds
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-1">
            Constituency Triage Matrix &amp; Projected Outcomes (175 ACs)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStudioOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors cursor-pointer shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Demographic Studio</span>
            {activeCustomizedCount > 0 && (
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-mono font-bold">
                {activeCustomizedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigateToActions()}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Target className="w-3.5 h-3.5" />
            <span>Export to Playbook</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />
          </button>
        </div>
      </div>

      {/* Full-Width Results Chart & Directory */}
      <div className="space-y-4">
        {/* Battleground Bubble Chart & Selected Constituency Inspector */}
        <BattlegroundBubbleChart
          filteredList={filteredList}
          activeAcNo={activeAcNo ?? undefined}
          selectedBubbleAc={selectedBubbleAc}
          setSelectedBubbleAc={setSelectedBubbleAc}
          tierFilter={tierFilter}
          setTierFilter={setTierFilter}
          tossUpThreshold={tossUpThreshold}
          setTossUpThreshold={setTossUpThreshold}
          tally={tally}
          onSelectConstituencyDossier={onSelectConstituencyDossier}
          onNavigateToActions={onNavigateToActions}
        />

        {/* Directory of Battlegrounds and Flips */}
        <BattlegroundRosterTable
          filteredList={filteredList}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
          activeAcNo={activeAcNo}
          onSelectAc={setSelectedBubbleAc}
          onNavigateToActions={onNavigateToActions}
        />
      </div>

      {/* Demographic Swing Studio (Pattern C Large Overlay Window) */}
      <SwingStudioModal
        isOpen={isStudioOpen}
        onClose={() => setIsStudioOpen(false)}
        data={data}
        swings={swings}
        setSwings={setSwings}
        macroSwing={macroSwing}
        setMacroSwing={setMacroSwing}
        tally={tally}
        onApplyPreset={applyPreset}
        activePreset={activePreset}
      />

      {/* Demographic Caste Survey Configurator & Tuning Modal */}
      <SurveyConfiguratorModal
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
        activeSurvey={activeSurvey}
        allSurveys={allSurveys}
        onSelectSurvey={(s) => {
          setActiveSurvey(s);
          applyPreset(s.id);
        }}
        onApplySwings={(customSwings, updatedSurvey) => {
          setSwings(customSwings);
          if (updatedSurvey) {
            setActiveSurvey(updatedSurvey);
            setActivePreset(updatedSurvey.id);
          }
        }}
      />
    </div>
  );
};
