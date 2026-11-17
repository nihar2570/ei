import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Sliders,
  Target,
  Flame,
  TrendingUp,
  ShieldCheck,
  Scale,
  BarChart3,
  Globe,
  Landmark,
  GitFork,
  Layers,
  Vote,
} from 'lucide-react';
import type { CasteSurveyDataset } from '../../data/surveyScenarioService';

interface ScenarioPresetRibbonProps {
  activePreset: string;
  applyPreset: (presetKey: string) => void;
  activeSurvey: CasteSurveyDataset | null;
  onOpenSurveyModal: () => void;
}

type RibbonCategory = 'historical' | 'strategic_2029' | 'surveys';

export const ScenarioPresetRibbon: React.FC<ScenarioPresetRibbonProps> = ({
  activePreset,
  applyPreset,
  activeSurvey,
  onOpenSurveyModal,
}) => {
  // Determine which category currently owns the active preset
  const getCategoryForPreset = (preset: string): RibbonCategory => {
    if (preset.startsWith('survey_') || preset.startsWith('custom_survey_')) {
      return 'surveys';
    }
    if (
      preset === 'nda_2029_defense' ||
      preset === 'triangular_2029_solo' ||
      preset === 'jsp_solo_split' ||
      preset === 'tdp_vs_jsp_bjp_2029' ||
      preset === 'ysrcp_2029_resurgence'
    ) {
      return 'strategic_2029';
    }
    return 'historical';
  };

  const activeCategory = getCategoryForPreset(activePreset);
  const [selectedTab, setSelectedTab] = useState<RibbonCategory>(activeCategory);

  // Auto-switch tab if the activePreset changes from another trigger (e.g. reset or command palette)
  useEffect(() => {
    setSelectedTab(activeCategory);
  }, [activePreset, activeCategory]);

  return (
    <div className="space-y-3">
      {/* Main Card Container */}
      <div className="bg-slate-50/70 p-3 sm:p-3.5 rounded-2xl border border-slate-200/90 space-y-3">
        {/* Top Control Bar: Segmented Tabs + Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2.5 border-b border-slate-200/80">
          {/* Segmented Mode Selector */}
          <div className="inline-flex p-1 bg-slate-200/60 rounded-xl gap-1 text-xs">
            <button
              onClick={() => setSelectedTab('historical')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTab === 'historical'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-slate-500" />
              <span>Historical Benchmarks</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                3
              </span>
              {activeCategory === 'historical' && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" title="Active model running" />
              )}
            </button>

            <button
              onClick={() => setSelectedTab('strategic_2029')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTab === 'strategic_2029'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>2029 Strategic Scenarios</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                4
              </span>
              {activeCategory === 'strategic_2029' && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" title="Active model running" />
              )}
            </button>

            <button
              onClick={() => setSelectedTab('surveys')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTab === 'surveys'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Vote className="w-3.5 h-3.5 text-slate-500" />
              <span>Field Caste Surveys</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                5
              </span>
              {activeCategory === 'surveys' && (
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" title="Active model running" />
              )}
            </button>
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-1.5">
            {selectedTab === 'surveys' && (
              <button
                onClick={onOpenSurveyModal}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Configure and tune caste demographics, swings, and sample preferences for this survey"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>Configure Survey</span>
              </button>
            )}

            <button
              onClick={() => applyPreset('baseline')}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-white/80 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reset all swings to 2024 baseline (TDP 135, JSP 21, BJP 8, YSRCP 11)"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>Reset to Baseline</span>
            </button>
          </div>
        </div>

        {/* Dynamic Contextual Preset Buttons for Selected Tab */}
        <div className="flex flex-wrap items-center gap-2">
          {/* TAB 1: HISTORICAL BENCHMARKS */}
          {selectedTab === 'historical' && (
            <>
              <button
                onClick={() => applyPreset('nda_2024_sweep')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'nda_2024_sweep'
                    ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200 shadow-2xs'
                }`}
                title="2024 Actual Mandate: TDP 135 + JSP 21 + BJP 8 = 164 seats vs YSRCP 11"
              >
                <Scale className="w-3.5 h-3.5 opacity-80" />
                <span>2024 Actual Mandate (164)</span>
              </button>

              <button
                onClick={() => applyPreset('ysrcp_2019_wave')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'ysrcp_2019_wave'
                    ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200 shadow-2xs'
                }`}
                title="2019 YSRCP Landslide benchmark: 151 seats, 49.9% vote share"
              >
                <TrendingUp className="w-3.5 h-3.5 opacity-80" />
                <span>2019 YSRCP Wave (151)</span>
              </button>

              <button
                onClick={() => applyPreset('bifurcation_2014')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'bifurcation_2014'
                    ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200 shadow-2xs'
                }`}
                title="2014 Post-Bifurcation Mandate: TDP 102 + BJP 4 = 106 seats vs YSRCP 67"
              >
                <Landmark className="w-3.5 h-3.5 opacity-80" />
                <span>2014 Bifurcation Mandate (106)</span>
              </button>
            </>
          )}

          {/* TAB 2: 2029 STRATEGIC SCENARIOS */}
          {selectedTab === 'strategic_2029' && (
            <>
              <button
                onClick={() => applyPreset('nda_2029_defense')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'nda_2029_defense'
                    ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200 shadow-2xs'
                }`}
                title="2029 Pre-poll alliance holds: TDP + JSP + BJP collective defense against 5-yr anti-incumbency (-3.5% swing)"
              >
                <ShieldCheck className="w-3.5 h-3.5 opacity-80" />
                <span>2029 NDA Defense (Alliance Holds)</span>
              </button>

              <button
                onClick={() => applyPreset('triangular_2029_solo')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'triangular_2029_solo' || activePreset === 'jsp_solo_split'
                    ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200 shadow-2xs'
                }`}
                title="2029 Alliance Breaks: Janasena contests all 175 ACs solo, dividing Kapu and youth vote pools"
              >
                <GitFork className="w-3.5 h-3.5 opacity-80" />
                <span>2029 Triangular: TDP vs JSP vs YSRCP</span>
              </button>

              <button
                onClick={() => applyPreset('tdp_vs_jsp_bjp_2029')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'tdp_vs_jsp_bjp_2029'
                    ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200 shadow-2xs'
                }`}
                title="2029 Realigned: JSP and BJP form alliance against TDP and YSRCP across all 175 seats"
              >
                <Flame className="w-3.5 h-3.5 opacity-80" />
                <span>2029 Realigned: TDP Solo vs JSP+BJP</span>
              </button>

              <button
                onClick={() => applyPreset('ysrcp_2029_resurgence')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'ysrcp_2029_resurgence'
                    ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200 shadow-2xs'
                }`}
                title="2029 Agrarian & Welfare Backlash: Discontent over Super-Six execution and rural distress pushes YSRCP past 88"
              >
                <Target className="w-3.5 h-3.5 opacity-80" />
                <span>2029 YSRCP Resurgence</span>
              </button>
            </>
          )}

          {/* TAB 3: FIELD CASTE SURVEYS */}
          {selectedTab === 'surveys' && (
            <>
              <button
                onClick={() => applyPreset('survey_peoples_pulse_2026')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'survey_peoples_pulse_2026'
                    ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200 shadow-2xs'
                }`}
                title="People's Pulse 2026: Multistage caste tracker (54,200 sample) - Solid BC retention & Kapu consolidation (154 NDA)"
              >
                <BarChart3 className="w-3.5 h-3.5 opacity-80" />
                <span>People's Pulse (154 NDA)</span>
              </button>

              <button
                onClick={() => applyPreset('survey_lok_poll_2026')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'survey_lok_poll_2026'
                    ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200 shadow-2xs'
                }`}
                title="Lok Poll 2026: Macro demographic field study (42,800 sample) - Rural BC price-rise friction (142 NDA / 33 YSRCP)"
              >
                <Target className="w-3.5 h-3.5 opacity-80" />
                <span>Lok Poll (142 NDA)</span>
              </button>

              <button
                onClick={() => applyPreset('survey_ipac_field_wing_2026')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'survey_ipac_field_wing_2026'
                    ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200 shadow-2xs'
                }`}
                title="IPAC Field Wing 2026: DBT & Welfare saturation survey (85,000 respondents) - High rural agrarian competition (118 NDA / 57 YSRCP)"
              >
                <Flame className="w-3.5 h-3.5 opacity-80" />
                <span>IPAC Field Wing (118 NDA)</span>
              </button>

              <button
                onClick={() => applyPreset('survey_atma_sakshi_2026')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'survey_atma_sakshi_2026'
                    ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200 shadow-2xs'
                }`}
                title="Atma Sakshi (CPS) 2026: Granular caste arithmetic index (46,500 sample) - BC + Kapu + Kamma social coalition (148 NDA)"
              >
                <Scale className="w-3.5 h-3.5 opacity-80" />
                <span>Atma Sakshi (148 NDA)</span>
              </button>

              <button
                onClick={() => applyPreset('survey_cvoter_macro_2026')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'survey_cvoter_macro_2026'
                    ? 'bg-slate-900 text-white shadow-xs ring-1 ring-slate-900'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100/70 border border-slate-200 shadow-2xs'
                }`}
                title="C-Voter / Macro Pulse 2026: National CATI tracker (38,500 sample) - Double-engine governance approval (150 NDA)"
              >
                <Globe className="w-3.5 h-3.5 opacity-80" />
                <span>C-Voter Pulse (150 NDA)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Sleek Contextual Active Scenario Indicator Bar */}
      {(activePreset === 'nda_2024_sweep' || activePreset === 'baseline') && (
        <div className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200/90 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
            <span>
              <strong className="text-slate-900 font-semibold">2024 Actual Mandate (164 NDA / 11 YSRCP):</strong> Official pre-poll alliance (TDP 135 + JSP 21 + BJP 8) secured 55.4% vote share across Coastal Andhra &amp; Rayalaseema.
            </span>
          </div>
          <span className="text-[11px] bg-white text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-200 font-semibold shrink-0">
            88 Majority &middot; 164 Baseline
          </span>
        </div>
      )}

      {activePreset === 'ysrcp_2019_wave' && (
        <div className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200/90 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
            <span>
              <strong className="text-slate-900 font-semibold">2019 YSRCP Wave Benchmark (151 Seats / 49.9% Vote Share):</strong> Wave propelled by Navaratnalu, rural consolidation, and fractured opposition (TDP 23, JSP 1).
            </span>
          </div>
          <span className="text-[11px] bg-white text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-200 font-semibold shrink-0">
            151 AC Benchmark
          </span>
        </div>
      )}

      {activePreset === 'bifurcation_2014' && (
        <div className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200/90 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
            <span>
              <strong className="text-slate-900 font-semibold">2014 Bifurcation Mandate (106 NDA / 67 YSRCP / 2 OTH):</strong> TDP (102) &amp; BJP (4) won 106 seats with outside JSP support; YSRCP won 67 seats.
            </span>
          </div>
          <span className="text-[11px] bg-white text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-200 font-semibold shrink-0">
            106 AC Bifurcation
          </span>
        </div>
      )}

      {activePreset === 'nda_2029_defense' && (
        <div className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200/90 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
            <span>
              <strong className="text-slate-900 font-semibold">2029 NDA Defense (Alliance Holds):</strong> TDP, JSP, and BJP contest collectively under 2024 pact. Natural 5-year anti-incumbency (-3.5% swing) checked by alliance vote transfer.
            </span>
          </div>
          <span className="text-[11px] bg-white text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-200 font-semibold shrink-0">
            Alliance Holds
          </span>
        </div>
      )}

      {(activePreset === 'triangular_2029_solo' || activePreset === 'jsp_solo_split') && (
        <div className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200/90 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>
              <strong className="text-slate-900 font-semibold">2029 Triangular Contest (TDP vs JSP vs YSRCP):</strong> Alliance collapses &mdash; Janasena contests all 175 ACs solo, capturing ~18&ndash;24% Kapu &amp; youth votes and splitting anti-incumbency pools.
            </span>
          </div>
          <span className="text-[11px] bg-white text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-200 font-semibold shrink-0">
            175 AC JSP Solo Contest
          </span>
        </div>
      )}

      {activePreset === 'tdp_vs_jsp_bjp_2029' && (
        <div className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200/90 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
            <span>
              <strong className="text-slate-900 font-semibold">2029 Realigned 3-Way War (TDP Solo vs JSP+BJP vs YSRCP):</strong> JSP and BJP partner against TDP statewide, consolidating urban and youth pockets in Coastal Andhra.
            </span>
          </div>
          <span className="text-[11px] bg-white text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-200 font-semibold shrink-0">
            JSP+BJP vs TDP &amp; YSRCP
          </span>
        </div>
      )}

      {activePreset === 'ysrcp_2029_resurgence' && (
        <div className="px-3.5 py-2 bg-slate-50 rounded-xl border border-slate-200/90 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0" />
            <span>
              <strong className="text-slate-900 font-semibold">2029 YSRCP Agrarian &amp; Welfare Resurgence:</strong> Backlash over welfare delay and rural distress flips 30+ rural battlegrounds back to YSRCP past 88 seats.
            </span>
          </div>
          <span className="text-[11px] bg-white text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-200 font-semibold shrink-0">
            Welfare Discontent Swing
          </span>
        </div>
      )}

      {(activePreset.startsWith('survey_') || activePreset.startsWith('custom_survey_')) && activeSurvey && (
        <div className="px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200/90 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="p-1.5 bg-slate-900 text-white rounded-lg shrink-0 mt-0.5">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-xs">{activeSurvey.title}</span>
                <span className="text-[10px] bg-white text-slate-700 font-semibold px-1.5 py-0.2 rounded border border-slate-200">
                  {activeSurvey.agency}
                </span>
                <span className="text-[10px] bg-white text-slate-600 font-mono px-1.5 py-0.2 rounded border border-slate-200">
                  Sample: {activeSurvey.sampleSize?.toLocaleString()} ({activeSurvey.marginOfError})
                </span>
                <span className="text-[10px] bg-white text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                  {activeSurvey.conductedDate}
                </span>
              </div>
              <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-1 sm:line-clamp-none">
                {activeSurvey.executiveSummary}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenSurveyModal}
            className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-medium text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors shrink-0"
          >
            <Sliders className="w-3 h-3 text-indigo-600" />
            <span>Configure Sliders</span>
          </button>
        </div>
      )}
    </div>
  );
};
