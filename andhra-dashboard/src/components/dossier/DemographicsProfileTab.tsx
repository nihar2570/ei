import React from 'react';
import {
  PieChart,
  Users,
  Clock,
} from 'lucide-react';

interface DemographicsProfileTabProps {
  acDemographics: any;
  demographicSummary: any;
  electorateBase: number;
}

export const DemographicsProfileTab: React.FC<DemographicsProfileTabProps> = ({
  acDemographics,
  demographicSummary,
  electorateBase,
}) => {
  if (!acDemographics || !demographicSummary) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-10 text-center space-y-3">
        <PieChart className="w-10 h-10 text-slate-400 mx-auto" />
        <div className="font-bold text-slate-800 text-sm">Demographics Loading</div>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Constituency-level caste and age survey data from the Directorate of Economics and Statistics is
          currently loading.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Demographics Survey Header / Context Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-800 text-white p-4 rounded-xl border border-indigo-700/50 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-indigo-500 text-white font-mono text-xs px-2 py-0.5 rounded-md font-bold flex items-center gap-1">
              <PieChart className="w-3.5 h-3.5" />
              AP Demographics
            </span>
            <span className="font-bold text-sm text-slate-100">
              Official Socio-Economic &amp; Caste Demographic Profile
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                acDemographics.reservation === 'SC'
                  ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/50'
                  : acDemographics.reservation === 'ST'
                  ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50'
                  : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50'
              }`}
            >
              {acDemographics.reservation === 'SC'
                ? 'SC Reserved AC'
                : acDemographics.reservation === 'ST'
                ? 'ST Reserved AC'
                : 'General (Open) Seat'}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Door-to-door enumeration data by Directorate of Economics &amp; Statistics (DES), Government of
            Andhra Pradesh.
            <span className="ml-1 text-indigo-200/90 font-medium">14-community census segments &amp; generational age cohorts detailed below.</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('generational-age-cohorts');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-slate-100 hover:text-white transition-all cursor-pointer group shadow-xs"
            title="Jump to Generational & Age Cohort breakdown below"
          >
            <Clock className="w-3.5 h-3.5 text-indigo-300 group-hover:text-white transition-colors" />
            <span>Generational Age Profile</span>
            <span className="text-indigo-300 group-hover:translate-y-0.5 transition-transform text-xs">↓</span>
          </button>

          <div className="text-right pl-3 border-l border-indigo-700/50">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Estimated AC Electorate
            </div>
            <div className="text-lg font-black font-mono text-white">
              {electorateBase.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Broad Social Categories Coalition */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              Broad Social Coalition Composition (Demographic Model)
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated voter shares across the five constitutional and reservation groupings with state
              baseline comparison. Age cohorts (18–25, 26–40, 41–60, 60+) are detailed below.
            </p>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            AP State Baseline: BC 49.2% &middot; OC 19.7% &middot; SC 17.1% &middot; Min 8.5% &middot; ST 5.5%
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {/* BC */}
          <div className="bg-sky-50/60 border border-sky-100 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-800">Backward Classes</span>
                <span className="text-[10px] bg-sky-200/70 text-sky-800 px-1.5 py-0.2 rounded font-bold">BC</span>
              </div>
              <div className="text-2xl font-black text-sky-950 font-mono mt-1">
                {demographicSummary.bcTotal}%
              </div>
              <div className="text-[11px] text-sky-700 mt-0.5 font-mono">
                ~{Math.round((demographicSummary.bcTotal / 100) * electorateBase).toLocaleString()} voters
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-sky-100 text-[11px]">
              <span className={demographicSummary.bcTotal >= 49.2 ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                {demographicSummary.bcTotal >= 49.2
                  ? `+${(demographicSummary.bcTotal - 49.2).toFixed(1)}%`
                  : `${(demographicSummary.bcTotal - 49.2).toFixed(1)}%`}{' '}
                vs State
              </span>
            </div>
          </div>

          {/* SC */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-800">Scheduled Castes</span>
                <span className="text-[10px] bg-indigo-200/70 text-indigo-800 px-1.5 py-0.2 rounded font-bold">SC</span>
              </div>
              <div className="text-2xl font-black text-indigo-950 font-mono mt-1">
                {demographicSummary.scTotal}%
              </div>
              <div className="text-[11px] text-indigo-700 mt-0.5 font-mono">
                ~{Math.round((demographicSummary.scTotal / 100) * electorateBase).toLocaleString()} voters
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-indigo-100 text-[11px]">
              <span className={demographicSummary.scTotal >= 17.1 ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                {demographicSummary.scTotal >= 17.1
                  ? `+${(demographicSummary.scTotal - 17.1).toFixed(1)}%`
                  : `${(demographicSummary.scTotal - 17.1).toFixed(1)}%`}{' '}
                vs State
              </span>
            </div>
          </div>

          {/* ST */}
          <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800">Scheduled Tribes</span>
                <span className="text-[10px] bg-amber-200/70 text-amber-800 px-1.5 py-0.2 rounded font-bold">ST</span>
              </div>
              <div className="text-2xl font-black text-amber-950 font-mono mt-1">
                {demographicSummary.stTotal}%
              </div>
              <div className="text-[11px] text-amber-700 mt-0.5 font-mono">
                ~{Math.round((demographicSummary.stTotal / 100) * electorateBase).toLocaleString()} voters
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-amber-100 text-[11px]">
              <span className={demographicSummary.stTotal >= 5.5 ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                {demographicSummary.stTotal >= 5.5
                  ? `+${(demographicSummary.stTotal - 5.5).toFixed(1)}%`
                  : `${(demographicSummary.stTotal - 5.5).toFixed(1)}%`}{' '}
                vs State
              </span>
            </div>
          </div>

          {/* Minorities */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">Religious Minorities</span>
                <span className="text-[10px] bg-emerald-200/70 text-emerald-800 px-1.5 py-0.2 rounded font-bold">MIN</span>
              </div>
              <div className="text-2xl font-black text-emerald-950 font-mono mt-1">
                {demographicSummary.minorityTotal}%
              </div>
              <div className="text-[11px] text-emerald-700 mt-0.5 font-mono">
                ~{Math.round((demographicSummary.minorityTotal / 100) * electorateBase).toLocaleString()} voters
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-emerald-100 text-[11px]">
              <span
                className={demographicSummary.minorityTotal >= 8.5 ? 'text-emerald-700 font-semibold' : 'text-slate-600'}
              >
                {demographicSummary.minorityTotal >= 8.5
                  ? `+${(demographicSummary.minorityTotal - 8.5).toFixed(1)}%`
                  : `${(demographicSummary.minorityTotal - 8.5).toFixed(1)}%`}{' '}
                vs State
              </span>
            </div>
          </div>

          {/* Open Categories */}
          <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-800">Open Categories</span>
                <span className="text-[10px] bg-rose-200/70 text-rose-800 px-1.5 py-0.2 rounded font-bold">OC</span>
              </div>
              <div className="text-2xl font-black text-rose-950 font-mono mt-1">
                {demographicSummary.ocTotal}%
              </div>
              <div className="text-[11px] text-rose-700 mt-0.5 font-mono">
                ~{Math.round((demographicSummary.ocTotal / 100) * electorateBase).toLocaleString()} voters
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-rose-100 text-[11px]">
              <span className={demographicSummary.ocTotal >= 19.7 ? 'text-rose-700 font-semibold' : 'text-slate-600'}>
                {demographicSummary.ocTotal >= 19.7
                  ? `+${(demographicSummary.ocTotal - 19.7).toFixed(1)}%`
                  : `${(demographicSummary.ocTotal - 19.7).toFixed(1)}%`}{' '}
                vs State
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Granular 14-Community Electorate Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="bg-slate-100/90 px-4 py-2.5 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2 text-xs">
          <span className="font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            Constituency Community Breakdown (14 Demographic Census Segments)
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Ranked by Electorate Share</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2 px-3 w-12 text-center">#</th>
                <th className="py-2 px-3">Community / Caste</th>
                <th className="py-2 px-3">Broad Category</th>
                <th className="py-2 px-3 text-right">Population %</th>
                <th className="py-2 px-3 text-right">Estimated Electorate</th>
                <th className="py-2 px-3 w-44">Proportion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {demographicSummary.sortedCommunities.map((c: any, idx: number) => {
                const estCount = Math.round((c.pct / 100) * electorateBase);
                return (
                  <tr key={c.key} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 px-3 text-center font-mono text-slate-400 font-bold">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-slate-900">{c.meta.name}</td>
                    <td className="py-2 px-3">
                      <span
                        className="px-2 py-0.5 rounded text-[11px] font-semibold"
                        style={{ backgroundColor: c.meta.bg, color: c.meta.color }}
                      >
                        {c.meta.category}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                      {c.pct.toFixed(2)}%
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-600">
                      {estCount.toLocaleString()}
                    </td>
                    <td className="py-2 px-3">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(4, (c.pct / (demographicSummary.dominant?.pct || 30)) * 100)
                            )}%`,
                            backgroundColor: c.meta.color,
                          }}
                          className="h-full rounded-full"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Age Cohorts Distribution Card */}
      <div id="generational-age-cohorts" className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs scroll-mt-6">
        <div className="mb-4 pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600" />
            Generational &amp; Age Cohort Electorate Profile
          </h3>
          <p className="text-xs text-slate-500">
            Voter distribution across 4 distinct age brackets and their primary political-welfare priorities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Cohort 1: 18-25 */}
          <div className="border border-slate-200 rounded-xl p-3 bg-gradient-to-b from-sky-50/40 to-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">18–25 Years</span>
                <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full">
                  Gen-Z / Youth
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1.5">
                {acDemographics.age_profile.youth_18_25}%
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                ~{Math.round((acDemographics.age_profile.youth_18_25 / 100) * electorateBase).toLocaleString()}{' '}
                voters
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  style={{ width: `${acDemographics.age_profile.youth_18_25}%` }}
                  className="bg-sky-500 h-full rounded-full"
                />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-700">Campaign Levers:</span> APPSC recruitments, Mega
              DSC, job calendar, skill training, Stree Shakti free RTC bus travel.
            </div>
          </div>

          {/* Cohort 2: 26-40 */}
          <div className="border border-slate-200 rounded-xl p-3 bg-gradient-to-b from-indigo-50/40 to-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">26–40 Years</span>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                  Core Workforce
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1.5">
                {acDemographics.age_profile.age_26_40}%
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                ~{Math.round((acDemographics.age_profile.age_26_40 / 100) * electorateBase).toLocaleString()}{' '}
                voters
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  style={{ width: `${acDemographics.age_profile.age_26_40}%` }}
                  className="bg-indigo-500 h-full rounded-full"
                />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-700">Campaign Levers:</span> Private sector employment,
              Indiramma housing, SME business loans, inflation.
            </div>
          </div>

          {/* Cohort 3: 41-60 */}
          <div className="border border-slate-200 rounded-xl p-3 bg-gradient-to-b from-emerald-50/40 to-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">41–60 Years</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  Family Heads
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1.5">
                {acDemographics.age_profile.age_41_60}%
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                ~{Math.round((acDemographics.age_profile.age_41_60 / 100) * electorateBase).toLocaleString()}{' '}
                voters
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  style={{ width: `${acDemographics.age_profile.age_41_60}%` }}
                  className="bg-emerald-500 h-full rounded-full"
                />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-700">Campaign Levers:</span> Rythu Bharosa / crop loan
              waivers, continuous agricultural power, MSP guarantees.
            </div>
          </div>

          {/* Cohort 4: 60+ */}
          <div className="border border-slate-200 rounded-xl p-3 bg-gradient-to-b from-amber-50/40 to-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-900">60+ Years</span>
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Senior Elders
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 font-mono mt-1.5">
                {acDemographics.age_profile.age_60_plus}%
              </div>
              <div className="text-[11px] text-slate-500 font-mono">
                ~{Math.round((acDemographics.age_profile.age_60_plus / 100) * electorateBase).toLocaleString()}{' '}
                voters
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                <div
                  style={{ width: `${acDemographics.age_profile.age_60_plus}%` }}
                  className="bg-amber-500 h-full rounded-full"
                />
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              <span className="font-semibold text-slate-700">Campaign Levers:</span> Aasara social security
              pensions, Aarogyasri health coverage, subsidized pilgrimage.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
