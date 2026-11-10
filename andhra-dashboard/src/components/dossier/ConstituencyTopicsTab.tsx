import React from 'react';
import {
  Flame,
  Target,
  Building2,
  Briefcase,
  Users,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import type { ConstituencyCandidatesData } from '../../types';
import { GroundRadarSection } from './GroundRadarSection';

interface ConstituencyTopicsTabProps {
  data: ConstituencyCandidatesData;
  acTopics: any;
}

export const ConstituencyTopicsTab: React.FC<ConstituencyTopicsTabProps> = ({
  data,
  acTopics,
}) => {
  if (!acTopics) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-3 shadow-xs">
        <Flame className="w-10 h-10 text-slate-300 mx-auto" />
        <div className="font-bold text-slate-800 text-sm">Topic Dossier Being Compiled</div>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Verified constituency intelligence brief for AC #{data.ac_no} is currently being compiled from local field reports.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* 1. Primary Strategic Focus & Ground Pulse Banner */}
      <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-rose-500 p-5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="bg-rose-50 text-rose-700 border border-rose-200 font-mono text-xs px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              Primary Battleground Focus
            </span>
            <span className="text-xs text-slate-500 font-medium">
              AC #{data.ac_no} {data.ac_name}
            </span>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full border border-slate-200 font-mono">
            {acTopics.key_issues.length} Verified Issues
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
          {acTopics.primary_concern}
        </h3>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-4xl">
          {acTopics.summary}
        </p>

        {acTopics.ground_pulse && acTopics.ground_pulse !== acTopics.summary && (
          <div className="bg-slate-50 border border-slate-200/90 rounded-lg p-3 text-xs text-slate-700 flex items-start gap-2">
            <span className="font-bold text-slate-900 shrink-0 text-[11px] uppercase tracking-wider mt-0.5">
              Ground Pulse:
            </span>
            <span className="leading-relaxed text-slate-600">
              {acTopics.ground_pulse}
            </span>
          </div>
        )}
      </div>

      {/* 2. Key Local Grievances & Policy Flashpoints Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            Key Local Grievances &amp; Policy Flashpoints
          </h3>
          <span className="text-xs text-slate-400 font-mono">Ranked by field urgency</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {acTopics.key_issues.map((issue: any, idx: number) => {
            const isCritical = issue.impact_level === 'Critical';
            const isHigh = issue.impact_level === 'High';

            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xs rounded-xl p-4 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      {issue.category === 'Infrastructure' && <Building2 className="w-3 h-3 text-slate-500" />}
                      {issue.category === 'Agriculture & Irrigation' && (
                        <Target className="w-3 h-3 text-emerald-600" />
                      )}
                      {issue.category === 'Employment & Industry' && (
                        <Briefcase className="w-3 h-3 text-blue-600" />
                      )}
                      {issue.category === 'Welfare & Social' && <Users className="w-3 h-3 text-purple-600" />}
                      {issue.category === 'Governance & Local' && <MapPin className="w-3 h-3 text-amber-600" />}
                      {issue.category}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        isCritical
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : isHigh
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {issue.impact_level} Impact
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mb-1.5 leading-snug">{issue.title}</h4>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">{issue.description}</p>
                </div>

                {issue.affected_demographic && (
                  <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Users className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span className="font-medium text-slate-400">Target Group:</span>
                    <span className="text-slate-700 font-medium truncate">{issue.affected_demographic}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Landmark Projects & Economic Infrastructure */}
      {acTopics.key_projects && acTopics.key_projects.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2.5">
          <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Key Infrastructure, Industrial &amp; Irrigation Assets
          </h4>
          <div className="flex flex-wrap gap-2">
            {acTopics.key_projects.map((proj: string, pIdx: number) => (
              <div
                key={pIdx}
                className="bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-800 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-medium">{proj}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Streamlined Live Regional News Wire */}
      <GroundRadarSection
        acNo={data.ac_no}
        acName={data.ac_name}
        district={data.district}
        primaryConcern={acTopics.primary_concern}
      />
    </div>
  );
};
