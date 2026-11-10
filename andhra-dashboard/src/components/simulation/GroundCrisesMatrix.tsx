import React, { useState, useMemo } from 'react';
import {
  Flame,
  Filter,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  Users,
  Handshake,
  Landmark,
  Gavel,
  Scale,
  Sprout,
  CheckCircle2,
} from 'lucide-react';
import type { GroundCrisisSettings } from '../StrategicSimulationModels';
import { DEFAULT_GROUND_CRISIS_SETTINGS } from '../StrategicSimulationModels';
import type { CrisisCategory } from './crisisRegistry';
import { CRISIS_REGISTRY, CRISIS_CATEGORIES } from './crisisRegistry';
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
  const [selectedCategory, setSelectedCategory] = useState<'all' | CrisisCategory>('all');
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  // Count active crises per category
  const categoryActiveCounts = useMemo(() => {
    const counts: Record<string, number> = { all: activeCrisisCount };
    CRISIS_REGISTRY.forEach((config) => {
      const val = groundCrisisSettings[config.key];
      if (typeof val === 'number' && val > 0) {
        counts[config.category] = (counts[config.category] || 0) + 1;
      }
    });
    return counts;
  }, [groundCrisisSettings, activeCrisisCount]);

  // Filtered crisis cards based on selected category
  const filteredCrises = useMemo(() => {
    if (selectedCategory === 'all') return CRISIS_REGISTRY;
    return CRISIS_REGISTRY.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  // Expand / Collapse toggles
  const handleToggleExpandKey = (key: string) => {
    setExpandedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const handleExpandAll = () => {
    setExpandedKeys(new Set(CRISIS_REGISTRY.map((c) => c.key)));
  };

  const handleCollapseAll = () => {
    setExpandedKeys(new Set());
  };

  // Helper for Category icons
  const getCategoryIcon = (id: 'all' | CrisisCategory) => {
    switch (id) {
      case 'family_dynastic':
        return <Users className="w-3.5 h-3.5" />;
      case 'coalition_alliance':
        return <Handshake className="w-3.5 h-3.5" />;
      case 'governance_economy':
        return <Landmark className="w-3.5 h-3.5" />;
      case 'legal_investigative':
        return <Gavel className="w-3.5 h-3.5" />;
      case 'caste_social':
        return <Scale className="w-3.5 h-3.5" />;
      case 'agrarian_labor':
        return <Sprout className="w-3.5 h-3.5" />;
      default:
        return <Filter className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 rounded-xl border border-rose-900/40 shadow-lg space-y-4">
      {/* Header & Preset Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white tracking-wide">
                Andhra Pradesh Ground Realities &amp; Crisis Stress Matrix
              </h4>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono font-bold border transition-colors ${
                  activeCrisisCount > 0
                    ? 'bg-rose-950 text-rose-300 border-rose-700/80 shadow-sm ring-1 ring-rose-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {activeCrisisCount} of 21 Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Model real-world fault lines: family feuds, coalition ultimatums, central agency raids, caste backlashes, and agrarian friction.
            </p>
          </div>
        </div>

        {/* Global Expand & Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setGroundCrisisSettings(DEFAULT_GROUND_CRISIS_SETTINGS)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold cursor-pointer transition-colors border border-slate-700"
            title="Reset all crisis sliders to 0% baseline"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset All</span>
          </button>

          {expandedKeys.size === CRISIS_REGISTRY.length ? (
            <button
              type="button"
              onClick={handleCollapseAll}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold cursor-pointer transition-colors border border-slate-700"
              title="Collapse all card descriptions into compact view"
            >
              <Minimize2 className="w-3 h-3 text-amber-400" />
              <span>Collapse Cards</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleExpandAll}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-bold cursor-pointer transition-colors border border-slate-700"
              title="Expand all cards to see descriptions and geographic breakdowns"
            >
              <Maximize2 className="w-3 h-3 text-cyan-400" />
              <span>Expand Cards</span>
            </button>
          )}
        </div>
      </div>

      {/* Curated Presets Bar (Multi-line wrap, no horizontal scroll) */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mr-1 flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Scenarios:</span>
        </span>

        <button
          onClick={() =>
            setGroundCrisisSettings({
              ...DEFAULT_GROUND_CRISIS_SETTINGS,
              ysrFamilyLegacyWar: 4.5,
              jrNtrVoteSplit: 3.5,
            })
          }
          className="px-2.5 py-1.5 text-[11px] bg-amber-950/70 hover:bg-amber-900 text-amber-200 border border-amber-700/60 rounded-lg font-bold cursor-pointer transition-colors shadow-sm"
        >
          👑 Family &amp; Dynastic War
        </button>

        <button
          onClick={() =>
            setGroundCrisisSettings({
              ...DEFAULT_GROUND_CRISIS_SETTINGS,
              pawanKalyanCoalitionUltimatum: 5.0,
              tdpJspCadreClash: 4.0,
              bjpCentralPressureMinorityAlienation: 4.0,
            })
          }
          className="px-2.5 py-1.5 text-[11px] bg-red-950/70 hover:bg-red-900 text-red-200 border border-red-700/60 rounded-lg font-bold cursor-pointer transition-colors shadow-sm"
        >
          🤝 Coalition Friction &amp; Ultimatum
        </button>

        <button
          onClick={() =>
            setGroundCrisisSettings({
              ...DEFAULT_GROUND_CRISIS_SETTINGS,
              centralAgencyLeadershipArrest: 4.0,
              assetFreezingCampaignFreeze: 3.5,
            })
          }
          className="px-2.5 py-1.5 text-[11px] bg-purple-950/70 hover:bg-purple-900 text-purple-200 border border-purple-700/60 rounded-lg font-bold cursor-pointer transition-colors shadow-sm"
        >
          ⚖️ CBI/ED Arrest &amp; Asset Freeze
        </button>

        <button
          onClick={() =>
            setGroundCrisisSettings({
              ...DEFAULT_GROUND_CRISIS_SETTINGS,
              scSubCategorizationBacklash: 4.5,
              kapuReservationBcFriction: 4.0,
              tirupatiPrasadamControversy: 3.5,
            })
          }
          className="px-2.5 py-1.5 text-[11px] bg-blue-950/70 hover:bg-blue-900 text-blue-200 border border-blue-700/60 rounded-lg font-bold cursor-pointer transition-colors shadow-sm"
        >
          👥 Caste &amp; Quota Polarization
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
          className="px-2.5 py-1.5 text-[11px] bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/60 rounded-lg font-bold cursor-pointer transition-colors shadow-sm"
        >
          🌾 Agrarian &amp; Aqua Distress
        </button>

        <button
          onClick={() =>
            setGroundCrisisSettings({
              ...DEFAULT_GROUND_CRISIS_SETTINGS,
              superSixFiscalFriction: 4.0,
              treasuryOverdraftDbtFreeze: 5.0,
              amaravatiPaceSlowdown: 4.0,
            })
          }
          className="px-2.5 py-1.5 text-[11px] bg-rose-950/70 hover:bg-rose-900 text-rose-200 border border-rose-700/60 rounded-lg font-bold cursor-pointer transition-colors shadow-sm"
        >
          💸 Treasury Freeze &amp; Fiscal Crunch
        </button>

        <button
          onClick={() =>
            setGroundCrisisSettings({
              amaravatiPaceSlowdown: 4.0,
              superSixFiscalFriction: 3.5,
              vizagSteelPlantBacklash: 4.5,
              redBookPolarization: 3.0,
              tdpJspCadreClash: 4.0,
              rayalaseemaWaterGrievance: 3.5,
              tirupatiPrasadamControversy: 0,
              polavaramDisplacementAgitation: 3.5,
              aquaFarmerPowerTariffCrisis: 3.5,
              cropInsuranceFarmerDistress: 3.0,
              liquorPolicyRetailDisruption: 3.0,
              govtEmployeePensionDiscontent: 3.5,
              ysrFamilyLegacyWar: 4.0,
              jrNtrVoteSplit: 3.0,
              pawanKalyanCoalitionUltimatum: 4.5,
              bjpCentralPressureMinorityAlienation: 3.5,
              centralAgencyLeadershipArrest: 3.5,
              assetFreezingCampaignFreeze: 3.0,
              scSubCategorizationBacklash: 3.5,
              kapuReservationBcFriction: 3.5,
              treasuryOverdraftDbtFreeze: 4.0,
            })
          }
          className="px-2.5 py-1.5 text-[11px] bg-rose-950/90 hover:bg-rose-900 text-rose-200 border border-rose-600/70 rounded-lg font-bold cursor-pointer transition-colors shadow-sm"
        >
          ⚡ 21-Crisis Full Stress Test
        </button>
      </div>

      {/* Category Grouping Tabs (Multi-line wrap, no horizontal scroll) */}
      <div className="flex flex-wrap items-center gap-2 pb-2.5 border-b border-slate-800 text-xs">
        {CRISIS_CATEGORIES.map((cat) => {
          const isActiveTab = selectedCategory === cat.id;
          const activeCount = categoryActiveCounts[cat.id] || 0;
          const totalInCat =
            cat.id === 'all'
              ? CRISIS_REGISTRY.length
              : CRISIS_REGISTRY.filter((c) => c.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-all border ${
                isActiveTab
                  ? 'bg-rose-950/80 text-rose-200 border-rose-600 shadow-sm'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className={isActiveTab ? 'text-rose-400' : 'text-slate-400'}>
                {getCategoryIcon(cat.id)}
              </span>
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  activeCount > 0
                    ? 'bg-rose-600 text-white font-black'
                    : isActiveTab
                    ? 'bg-rose-900/60 text-rose-300'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {activeCount > 0 ? `${activeCount}/${totalInCat}` : totalInCat}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filtered Crisis Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredCrises.map((config) => {
          const isCardExpanded = expandedKeys.has(config.key);
          return (
            <CrisisCard
              key={config.key}
              config={config}
              value={groundCrisisSettings[config.key]}
              isExpanded={isCardExpanded}
              onToggleExpand={() => handleToggleExpandKey(config.key)}
              onChange={(val) =>
                setGroundCrisisSettings((prev) => ({
                  ...prev,
                  [config.key]: val,
                }))
              }
            />
          );
        })}
      </div>

      {/* Category Footer Note */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2.5 px-1">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            Showing <strong className="text-white">{filteredCrises.length}</strong> of{' '}
            <strong className="text-white">{CRISIS_REGISTRY.length}</strong> crises in category{' '}
            <span className="text-rose-400">
              {CRISIS_CATEGORIES.find((c) => c.id === selectedCategory)?.label}
            </span>
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Click &ldquo;Details&rdquo; on any card to reveal geographic impact &amp; flips
        </span>
      </div>
    </div>
  );
};
