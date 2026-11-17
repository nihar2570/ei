import React, { useState, useMemo, useEffect } from 'react';
import type {
  DemographicsDataset,
  ElectionData,
  SimulatedConstituencyResult,
  ActiveScenarioBridge,
  CandidateFrictionValues,
} from '../types';
import { Sparkles, Sliders, Target, ChevronRight, ArrowRight, BarChart3, PieChart, Table, RotateCcw, Flame } from 'lucide-react';
import { FloatingSideNav, type NavSection } from './common/FloatingSideNav';
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

const SIMULATION_SECTIONS: NavSection[] = [
  {
    id: 'sim-barometer',
    label: 'Assembly Barometer & Presets',
    shortLabel: 'Barometer',
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: 'sim-suite',
    label: 'What-If Scenarios Suite',
    shortLabel: 'What-If',
    icon: <Sliders className="w-4 h-4" />,
  },
  {
    id: 'sim-bubble',
    label: 'Battleground Bubble Chart',
    shortLabel: 'Chart',
    icon: <PieChart className="w-4 h-4" />,
  },
  {
    id: 'sim-roster',
    label: '175-AC Battleground Roster',
    shortLabel: 'Roster',
    icon: <Table className="w-4 h-4" />,
  },
];

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
  const [tierFilter, setTierFilter] = useState<'ALL' | 'TOSS_UP' | 'FLIPS' | 'MLA_DRAG'>('TOSS_UP');
  const [tossUpThreshold, setTossUpThreshold] = useState<number>(8000);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [candidateFrictionOverrides, setCandidateFrictionOverrides] = useState<Record<number, CandidateFrictionValues>>({});

  const handleUpdateCandidateFriction = (acNo: number, values: CandidateFrictionValues) => {
    setCandidateFrictionOverrides((prev) => ({
      ...prev,
      [acNo]: values,
    }));
  };

  const handleResetCandidateFriction = (acNo: number) => {
    setCandidateFrictionOverrides((prev) => {
      const copy = { ...prev };
      delete copy[acNo];
      return copy;
    });
  };

  const handleResetAllCandidateFriction = () => {
    setCandidateFrictionOverrides({});
  };

  const candidateFrictionStats = useMemo(() => {
    const keys = Object.keys(candidateFrictionOverrides);
    const count = keys.length;
    let negativeDragCount = 0;
    let positiveLiftCount = 0;
    keys.forEach((k) => {
      const v = candidateFrictionOverrides[Number(k)];
      if (v) {
        const net = (v.accessibility || 0) + (v.syndicateMafia || 0) + (v.cadreRebel || 0) + (v.casteFaction || 0);
        if (net < 0) negativeDragCount++;
        else if (net > 0) positiveLiftCount++;
      }
    });
    return { count, negativeDragCount, positiveLiftCount };
  }, [candidateFrictionOverrides]);

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
      candidateFrictionOverrides,
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
    candidateFrictionOverrides,
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
      activeSurvey ? `${activeSurvey.title} (${activeSurvey.sampleSize?.toLocaleString()} Sample)` : undefined,
      candidateFrictionOverrides
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
    candidateFrictionOverrides,
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
      candidateFrictionOverrides,
    });
  }, [activePreset, whatIfs, simulatedResults, tally, candidateFrictionOverrides, onBridgeChange]);

  // Filtered list for directory and bubble selection
  const filteredList = useMemo(() => {
    return simulatedResults.filter((r) => {
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase().trim();
        return (
          r.ac_name.toLowerCase().includes(q) ||
          r.district.toLowerCase().includes(q) ||
          r.simulated.winner_party.toLowerCase().includes(q) ||
          r.key_demographic.toLowerCase().includes(q) ||
          String(r.ac_no) === q
        );
      }
      if (tierFilter === 'TOSS_UP' && r.battleground_tier !== 'TOSS_UP') return false;
      if (tierFilter === 'FLIPS' && !r.simulated.is_flipped) return false;
      if (tierFilter === 'MLA_DRAG' && (!r.candidate_friction_net_pct || r.candidate_friction_net_pct >= 0)) return false;
      return true;
    });
  }, [simulatedResults, tierFilter, searchFilter]);

  const activeAcNo = selectedBubbleAc ?? filteredList[0]?.ac_no ?? simulatedResults[0]?.ac_no ?? null;

  return (
    <div className="space-y-6 relative">
      {/* Floating Vertical Section Navigation */}
      <FloatingSideNav sections={SIMULATION_SECTIONS} />

      {/* Top Banner: CM Advisor War Room Barometer & Scenario Ribbon */}
      <div id="sim-barometer" className="scroll-mt-24 bg-white text-slate-900 rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-4">
        {/* Title & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-600 text-white font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3 h-3" /> AP CHIEF ADVISOR WAR ROOM
              </span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200 font-medium">
                175 ACs &middot; 26 Reorganized Districts &middot; 88 to Majority
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Assembly Majority Barometer &amp; Battleground Simulator
            </h2>
          </div>

          {onExportToActions && (
            <button
              onClick={onExportToActions}
              className="px-3.5 py-1.5 text-xs rounded-lg font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
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
      <div id="sim-suite" className="scroll-mt-24">
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
      </div>

      {/* Prominent Candidate Health & Local Friction Modifiers Status Banner */}
      {candidateFrictionStats.count > 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-indigo-50 border-2 border-amber-300 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-500 text-slate-950 font-black shadow-xs">
              <Flame className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-black text-slate-900 text-sm">
                  Candidate Health &amp; Local Friction Modifiers Active
                </h4>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1 shadow-2xs">
                  <Flame className="w-3 h-3 text-rose-600 animate-pulse" />
                  {candidateFrictionStats.negativeDragCount} ACs Facing Sitting MLA Negative Drag
                </span>
                {candidateFrictionStats.positiveLiftCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    {candidateFrictionStats.positiveLiftCount} ACs Popular Nominee Lift
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Constituency-level candidate accessibility, syndicate perception, cadre revolt, and caste friction modifiers are actively tuned and bound to the exported scenario.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setTierFilter(tierFilter === 'MLA_DRAG' ? 'ALL' : 'MLA_DRAG')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center gap-1 ${
                tierFilter === 'MLA_DRAG'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white hover:bg-rose-50 text-rose-700 border-rose-300 shadow-2xs'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{tierFilter === 'MLA_DRAG' ? 'Showing MLA Drag ACs' : `Filter ${candidateFrictionStats.negativeDragCount} MLA Drag ACs`}</span>
            </button>
            <button
              onClick={handleResetAllCandidateFriction}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset All ({candidateFrictionStats.count} ACs)</span>
            </button>
          </div>
        </div>
      )}

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

        <div className="flex items-center gap-2 flex-wrap">
          {Object.keys(candidateFrictionOverrides).length > 0 && (
            <button
              onClick={handleResetAllCandidateFriction}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors cursor-pointer"
              title="Reset candidate friction overrides on all ACs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset Candidate Overrides ({Object.keys(candidateFrictionOverrides).length} ACs)</span>
            </button>
          )}

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
        <div id="sim-bubble" className="scroll-mt-24">
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
            candidateFrictionOverrides={candidateFrictionOverrides}
            onUpdateCandidateFriction={handleUpdateCandidateFriction}
            onResetCandidateFriction={handleResetCandidateFriction}
            allConstituencies={simulatedResults}
          />
        </div>

        {/* Directory of Battlegrounds and Flips */}
        <div id="sim-roster" className="scroll-mt-24">
          <BattlegroundRosterTable
            filteredList={filteredList}
            searchFilter={searchFilter}
            setSearchFilter={setSearchFilter}
            activeAcNo={activeAcNo}
            onSelectAc={setSelectedBubbleAc}
            onNavigateToActions={onNavigateToActions}
          />
        </div>
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
