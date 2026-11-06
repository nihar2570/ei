import React from 'react';
import {
  Sparkles,
  RotateCcw,
  Sliders,
  Target,
  Flame,
  TrendingUp,
  Handshake,
  ShieldCheck,
  Scale,
  BarChart3,
  Vote,
  Globe,
} from 'lucide-react';
import type { CasteSurveyDataset } from '../../data/surveyScenarioService';

interface ScenarioPresetRibbonProps {
  activePreset: string;
  applyPreset: (presetKey: string) => void;
  activeSurvey: CasteSurveyDataset | null;
  onOpenSurveyModal: () => void;
}

export const ScenarioPresetRibbon: React.FC<ScenarioPresetRibbonProps> = ({
  activePreset,
  applyPreset,
  activeSurvey,
  onOpenSurveyModal,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2.5 bg-slate-50/90 p-3.5 rounded-xl border border-slate-200">
        {/* Row 1: Historical Mandate Benchmarks */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-800 font-mono flex items-center gap-1.5 min-w-[170px]">
              <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
              <span>Historical Mandates:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => applyPreset('nda_2024_sweep')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'nda_2024_sweep'
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/50 font-black'
                    : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
                }`}
                title="2024 Actual Mandate: TDP 135 + JSP 21 + BJP 8 = 164 seats vs YSRCP 11"
              >
                <Handshake className="w-3.5 h-3.5 text-amber-300" />
                <span>🤝 2024 Actual Mandate (164)</span>
              </button>
              <button
                onClick={() => applyPreset('ysrcp_2019_wave')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'ysrcp_2019_wave'
                    ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-400/50 font-black'
                    : 'bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-900 border border-slate-200'
                }`}
                title="2019 YSRCP Landslide benchmark: 151 seats, 49.9% vote share"
              >
                <Target className="w-3.5 h-3.5" />
                <span>🌊 2019 YSRCP Wave (151)</span>
              </button>
              <button
                onClick={() => applyPreset('bifurcation_2014')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'bifurcation_2014'
                    ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400/50 font-black'
                    : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
                }`}
                title="2014 Post-Bifurcation Mandate: TDP 102 + BJP 4 = 106 seats vs YSRCP 67 (and 2 OTH)"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>⚖️ 2014 Bifurcation Mandate (106)</span>
              </button>
              <button
                onClick={() => applyPreset('baseline')}
                className={`px-2.5 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activePreset === 'baseline'
                    ? 'bg-slate-800 text-white shadow-xs font-black'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
                title="Reset all swings to 2024 baseline (TDP 135, JSP 21, BJP 8, YSRCP 11)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
          <span className="text-[11px] font-mono text-slate-500 font-medium hidden xl:inline">
            Official ECI Certified Returns
          </span>
        </div>

        <div className="border-t border-slate-200/70" />

        {/* Row 2: 2029 Strategic Future Scenarios & Coalition Formations */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-950 font-mono flex items-center gap-1.5 min-w-[170px]">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>2029 Strategic Scenarios:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => applyPreset('nda_2029_defense')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'nda_2029_defense'
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/50 font-black'
                    : 'bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200'
                }`}
                title="2029 Pre-poll alliance holds: TDP + JSP + BJP collective defense against 5-yr anti-incumbency (-3.5% swing)"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>🛡️ 2029 NDA Defense (Alliance Holds)</span>
              </button>

              <button
                onClick={() => applyPreset('triangular_2029_solo')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'triangular_2029_solo' || activePreset === 'jsp_solo_split'
                    ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/50 font-black'
                    : 'bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-900 border border-slate-200'
                }`}
                title="2029 Alliance Breaks: Janasena contests all 175 ACs solo, dividing Kapu and youth vote pools"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>💥 2029 Triangular: TDP vs JSP vs YSRCP</span>
              </button>

              <button
                onClick={() => applyPreset('tdp_vs_jsp_bjp_2029')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'tdp_vs_jsp_bjp_2029'
                    ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-400/50 font-black'
                    : 'bg-white text-slate-700 hover:bg-purple-50 hover:text-purple-900 border border-slate-200'
                }`}
                title="2029 Realigned: JSP and BJP form alliance against TDP and YSRCP across all 175 seats"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>🤝🔥 2029 Realigned: TDP Solo vs JSP+BJP</span>
              </button>

              <button
                onClick={() => applyPreset('ysrcp_2029_resurgence')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'ysrcp_2029_resurgence'
                    ? 'bg-sky-700 text-white shadow-sm ring-2 ring-sky-400/50 font-black'
                    : 'bg-white text-slate-700 hover:bg-sky-50 hover:text-sky-900 border border-slate-200'
                }`}
                title="2029 Agrarian & Welfare Backlash: Discontent over Super-Six execution and rural distress pushes YSRCP past 88"
              >
                <Target className="w-3.5 h-3.5" />
                <span>⚡ 2029 YSRCP Resurgence</span>
              </button>

              <button
                onClick={() => applyPreset('nda_2029_max_surge')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'nda_2029_max_surge' || activePreset === 'nda_super_wave'
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/50 font-black'
                    : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
                }`}
                title="2029 NDA Max Surge: Amaravati delivery & mega-industrial push crushes YSRCP to single digits (170+ sweep)"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>🎯 2029 NDA Max Surge (170+)</span>
              </button>
            </div>
          </div>
          <span className="text-[11px] font-mono text-indigo-700 font-bold hidden xl:inline">
            Forward War Room Models
          </span>
        </div>

        <div className="border-t border-slate-200/70" />

        {/* Row 3: Pre-filled Complete Caste Demographic Surveys */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950 font-mono flex items-center gap-1.5 min-w-[170px]">
              <Vote className="w-3.5 h-3.5 text-emerald-600" />
              <span>Field Caste Surveys:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => applyPreset('survey_peoples_pulse_2026')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'survey_peoples_pulse_2026'
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/50 font-black'
                    : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200'
                }`}
                title="People's Pulse 2026: Multistage caste tracker (54,200 sample) - Solid BC retention & Kapu consolidation (154 NDA)"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>📊 Survey by People's Pulse</span>
              </button>

              <button
                onClick={() => applyPreset('survey_lok_poll_2026')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'survey_lok_poll_2026'
                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/50 font-black'
                    : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-900 border border-slate-200'
                }`}
                title="Lok Poll 2026: Macro demographic field study (42,800 sample) - Rural BC price-rise friction (142 NDA / 33 YSRCP)"
              >
                <Target className="w-3.5 h-3.5" />
                <span>🎯 Survey by Lok Poll</span>
              </button>

              <button
                onClick={() => applyPreset('survey_sib_intelligence_2026')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'survey_sib_intelligence_2026'
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/50 font-black'
                    : 'bg-white text-slate-700 hover:bg-amber-50 hover:text-amber-900 border border-slate-200'
                }`}
                title="SIB Intelligence 2026: Administrative Beat Assessment (68,000 interactions) - Law & order + Amaravati push (160 NDA)"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>🛡️ Survey by SIB Intelligence</span>
              </button>

              <button
                onClick={() => applyPreset('survey_ipac_field_wing_2026')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'survey_ipac_field_wing_2026'
                    ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-400/50 font-black'
                    : 'bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-900 border border-slate-200'
                }`}
                title="IPAC Field Wing 2026: DBT & Welfare saturation survey (85,000 respondents) - High rural agrarian competition (118 NDA / 57 YSRCP)"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>🔥 Survey by IPAC Field Wing</span>
              </button>

              <button
                onClick={() => applyPreset('survey_atma_sakshi_2026')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'survey_atma_sakshi_2026'
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/50 font-black'
                    : 'bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 border border-slate-200'
                }`}
                title="Atma Sakshi (CPS) 2026: Granular caste arithmetic index (46,500 sample) - BC + Kapu + Kamma social coalition (148 NDA)"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>⚖️ Survey by Atma Sakshi (CPS)</span>
              </button>

              <button
                onClick={() => applyPreset('survey_cvoter_macro_2026')}
                className={`px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePreset === 'survey_cvoter_macro_2026'
                    ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-400/50 font-black'
                    : 'bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-900 border border-slate-200'
                }`}
                title="C-Voter / Macro Pulse 2026: National CATI tracker (38,500 sample) - Double-engine governance approval (150 NDA)"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>🌐 Survey by C-Voter Pulse</span>
              </button>

              <button
                onClick={onOpenSurveyModal}
                className="px-3 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                title="Configure and tune caste demographics, swings, and sample preferences for this survey"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>⚙️ Configure / Tune Survey...</span>
              </button>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 font-bold hidden xl:inline">
            Complete Caste Demography Surveys
          </span>
        </div>
      </div>

      {/* Strategic Barometer Banner for Active Preset */}
      {(activePreset === 'nda_2024_sweep' || activePreset === 'baseline') && (
        <div className="px-4 py-2.5 bg-amber-50/90 rounded-xl border border-amber-200 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <span className="font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>2024 Actual Mandate (164 NDA / 11 YSRCP):</strong> Official pre-poll alliance (TDP 135 + JSP 21 + BJP 8) secured 55.4% vote share with clean transfers across Coastal Andhra &amp; Rayalaseema.
            </span>
          </span>
          <span className="text-[11px] bg-amber-100 text-amber-900 font-mono px-2.5 py-0.5 rounded border border-amber-300 font-bold">
            88 Majority Mark &middot; 164 Baseline
          </span>
        </div>
      )}

      {activePreset === 'ysrcp_2019_wave' && (
        <div className="px-4 py-2.5 bg-sky-50/90 rounded-xl border border-sky-200 text-xs text-sky-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <span className="font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>2019 YSRCP Wave Benchmark (151 Seats / 49.9% Vote Share):</strong> Y.S. Jagan Mohan Reddy's historic wave propelled by Navaratnalu, rural consolidation, and a fractured opposition (TDP 23, JSP 1).
            </span>
          </span>
          <span className="text-[11px] bg-sky-100 text-sky-900 font-mono px-2.5 py-0.5 rounded border border-sky-300 font-bold">
            151 AC Benchmark
          </span>
        </div>
      )}

      {activePreset === 'bifurcation_2014' && (
        <div className="px-4 py-2.5 bg-emerald-50/90 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <span className="font-semibold flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>2014 Bifurcation Mandate (106 NDA / 67 YSRCP / 2 OTH):</strong> Post-bifurcation election where TDP (102) &amp; BJP (4) won 106 seats with Pawan Kalyan's JSP supporting from outside, while YSRCP won 67 seats.
            </span>
          </span>
          <span className="text-[11px] bg-emerald-100 text-emerald-900 font-mono px-2.5 py-0.5 rounded border border-emerald-300 font-bold">
            106 AC Bifurcation Mandate
          </span>
        </div>
      )}

      {activePreset === 'nda_2029_defense' && (
        <div className="px-4 py-2.5 bg-indigo-50/90 rounded-xl border border-indigo-200 text-xs text-indigo-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <span className="font-semibold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>2029 NDA Defense (Alliance Holds):</strong> TDP, JSP, and BJP contest collectively under the 2024 seat-sharing pact. Natural 5-year anti-incumbency (-3.5% swing) is checked by alliance cohesion and candidate surgery.
            </span>
          </span>
          <span className="text-[11px] bg-indigo-100 text-indigo-900 font-mono px-2.5 py-0.5 rounded border border-indigo-300 font-bold">
            Pre-poll Alliance Holds
          </span>
        </div>
      )}

      {(activePreset === 'triangular_2029_solo' || activePreset === 'jsp_solo_split') && (
        <div className="px-4 py-2.5 bg-rose-50/90 rounded-xl border border-rose-200 text-xs text-rose-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <span className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              <strong>2029 Triangular Contest (TDP vs JSP vs YSRCP):</strong> Alliance collapses &mdash; Janasena contests all 175 ACs solo. JSP captures ~18&ndash;24% Kapu &amp; youth vote share, splitting anti-YSRCP votes and generating volatile 3-corner dogfights.
            </span>
          </span>
          <span className="text-[11px] bg-rose-100 text-rose-900 font-mono px-2.5 py-0.5 rounded border border-rose-300 font-bold">
            175 AC JSP Solo Contest
          </span>
        </div>
      )}

      {activePreset === 'tdp_vs_jsp_bjp_2029' && (
        <div className="px-4 py-2.5 bg-purple-50/90 rounded-xl border border-purple-200 text-xs text-purple-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <span className="font-semibold flex items-center gap-2">
            <Flame className="w-4 h-4 text-purple-600 shrink-0" />
            <span>
              <strong>2029 Realigned 3-Way War (TDP Solo vs JSP+BJP vs YSRCP):</strong> Janasena and BJP partner against TDP statewide. JSP+BJP consolidates urban, youth, and Kapu pockets, confronting TDP in Coastal Andhra while YSRCP tests rural bastions.
            </span>
          </span>
          <span className="text-[11px] bg-purple-100 text-purple-900 font-mono px-2.5 py-0.5 rounded border border-purple-300 font-bold">
            JSP + BJP Alliance vs TDP &amp; YSRCP
          </span>
        </div>
      )}

      {activePreset === 'ysrcp_2029_resurgence' && (
        <div className="px-4 py-2.5 bg-sky-50/90 rounded-xl border border-sky-200 text-xs text-sky-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <span className="font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-sky-700 shrink-0" />
            <span>
              <strong>2029 YSRCP Agrarian &amp; Welfare Resurgence:</strong> Backlash over Super-Six delivery friction, welfare delay, and rural water grievances flips 30+ rural battlegrounds back to YSRCP past the 88-seat majority line.
            </span>
          </span>
          <span className="text-[11px] bg-sky-100 text-sky-900 font-mono px-2.5 py-0.5 rounded border border-sky-300 font-bold">
            Welfare Discontent Swing
          </span>
        </div>
      )}

      {(activePreset === 'nda_2029_max_surge' || activePreset === 'nda_super_wave') && (
        <div className="px-4 py-2.5 bg-amber-50/90 rounded-xl border border-amber-200 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <span className="font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>2029 NDA Max Surge (170+ Clean Sweep):</strong> Completion of Amaravati Phase 1, Polavaram milestones, and industrial investments generate a pro-incumbency wave, breaching YSRCP's last 11 bastions.
            </span>
          </span>
          <span className="text-[11px] bg-amber-100 text-amber-900 font-mono px-2.5 py-0.5 rounded border border-amber-300 font-bold">
            170+ Seat Clean Sweep
          </span>
        </div>
      )}

      {(activePreset.startsWith('survey_') || activePreset.startsWith('custom_survey_')) && activeSurvey && (
        <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50/70 rounded-xl border border-emerald-300 text-xs text-emerald-950 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-emerald-600 text-white rounded-lg shrink-0 mt-0.5">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-black text-slate-900 text-sm">{activeSurvey.title}</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded border border-emerald-300">
                  {activeSurvey.agency}
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-700 font-mono px-1.5 py-0.5 rounded border border-slate-300 font-bold">
                  Sample: {activeSurvey.sampleSize?.toLocaleString()} ({activeSurvey.marginOfError})
                </span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-1.5 py-0.5 rounded border border-indigo-200">
                  {activeSurvey.conductedDate}
                </span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed max-w-4xl">
                {activeSurvey.executiveSummary}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenSurveyModal}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Configure Caste Sliders</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
