import React from 'react';
import {
  UserCheck,
  CheckCircle,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Info,
  Film,
} from 'lucide-react';
import { getPartyColor } from '../../types';
import {
  type CampaignerProfile,
  TIER_METADATA,
} from './campaignerProfiles';

export interface CampaignerAcItem {
  ac_no: number;
  ac_name: string;
  district: string;
  reservation?: string;
  winner_2023: string;
  margin_2023: number;
  total_votes: number;
  isPartyWinner: boolean;
  totalLiftPct: number;
  voteGain: number;
  newMargin: number;
  isFlippedToWin: boolean;
  squadRec: {
    recommendedA: string;
    recommendedB: string;
    recommendedC: string;
    recommendedM: string;
    strategyBrief: string;
    topCasteName: string;
    topCastePct?: number;
  };
  deployedDetails: Array<{
    camp: CampaignerProfile;
    days: number;
    liftPct: number;
  }>;
}

interface CampaignerAcCardProps {
  c: CampaignerAcItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  partyCampaigners: CampaignerProfile[];
  allocations: Record<string, Record<number, number>>;
  campaignerStats: Record<string, { totalDays: number; usedDays: number; remainingDays: number }>;
  cumulativeAcImpacts?: Record<number, any>;
  onDayChange: (campaignerId: string, acNo: number, delta: number, e: React.MouseEvent) => void;
  onOpenDossier?: (acNo: number) => void;
}

export const CampaignerAcCard: React.FC<CampaignerAcCardProps> = ({
  c,
  isExpanded,
  onToggleExpand,
  partyCampaigners,
  allocations,
  campaignerStats,
  cumulativeAcImpacts,
  onDayChange,
  onOpenDossier,
}) => {
  const hasDeployments = c.deployedDetails.length > 0;
  const isFlipped = c.isFlippedToWin;
  const winnerColor = getPartyColor(c.winner_2023);

  return (
    <div
      className={`bg-white rounded-xl border transition-all ${
        isFlipped
          ? 'border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
          : hasDeployments
          ? 'border-amber-300 ring-1 ring-amber-400/20 shadow-2xs'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Compact 1-Line Row Summary */}
      <div
        onClick={onToggleExpand}
        className="p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none"
      >
        {/* 1. AC No + Name + District */}
        <div className="flex items-center gap-2.5 min-w-[170px]">
          <span className="font-mono text-xs font-black bg-slate-900 text-white px-2 py-0.5 rounded">
            #{c.ac_no}
          </span>
          <div>
            <h4 className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1.5">
              {c.ac_name}
              {c.reservation && c.reservation !== 'GEN' && (
                <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono font-bold">
                  {c.reservation}
                </span>
              )}
            </h4>
            <span className="text-[11px] text-slate-500">{c.district}</span>
          </div>
        </div>

        {/* 2. Recommended Squad Archetype Badge */}
        <div className="hidden lg:flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Ideal Squad:</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-amber-600" />
            {c.squadRec.recommendedA} + {c.squadRec.recommendedB} + {c.squadRec.recommendedC} + {c.squadRec.recommendedM}
          </span>
          <span className="text-[11px] text-slate-600 font-medium">
            ({c.squadRec.topCasteName})
          </span>
        </div>

        {/* 3. 2023 Baseline Result vs Projected Outcome */}
        <div className="flex items-center gap-3 text-xs">
          <div className="text-right hidden sm:block">
            <div className="text-slate-400 text-[10px]">2023 Result</div>
            <div className="font-bold">
              <span style={{ color: winnerColor }}>{c.winner_2023}</span>{' '}
              <span className="text-slate-500 font-mono">+{c.margin_2023.toLocaleString()}</span>
            </div>
          </div>

          {isFlipped ? (
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-black flex items-center gap-1 shadow-2xs">
              <CheckCircle className="w-3 h-3 text-emerald-600" />
              FLIPPED (+{c.newMargin.toLocaleString()})
            </span>
          ) : c.isPartyWinner ? (
            <span className="px-2.5 py-1 bg-sky-100 text-sky-800 border border-sky-300 rounded-lg text-xs font-bold">
              Defended (+{c.newMargin.toLocaleString()})
            </span>
          ) : (
            <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold">
              Deficit: -{Math.abs(c.newMargin).toLocaleString()}
            </span>
          )}

          {/* Cumulative Compounded Actions Badge */}
          {cumulativeAcImpacts && cumulativeAcImpacts[c.ac_no] && (cumulativeAcImpacts[c.ac_no].resourceSwing > 0 || cumulativeAcImpacts[c.ac_no].defectionShift !== 0) && (
            <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md bg-indigo-50 border border-indigo-200 text-[10px] font-bold text-indigo-950">
              <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
              <span>Cumulative:</span>
              <span className={`font-mono font-black ${cumulativeAcImpacts[c.ac_no].cumulativeProjectedMargin > 0 ? 'text-emerald-700' : 'text-slate-800'}`}>
                {cumulativeAcImpacts[c.ac_no].cumulativeProjectedMargin > 0
                  ? `+${cumulativeAcImpacts[c.ac_no].cumulativeProjectedMargin.toLocaleString()} (WIN)`
                  : `${cumulativeAcImpacts[c.ac_no].cumulativeProjectedMargin.toLocaleString()}`}
              </span>
            </div>
          )}
        </div>

        {/* 4. Active Deployed Squad Pills & Expand Chevron */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 text-[11px] font-mono">
            {c.deployedDetails.length > 0 ? (
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                +{c.totalLiftPct.toFixed(1)}% lift ({c.deployedDetails.map((d) => `${d.camp.code}: ${d.days}d`).join(', ')})
              </span>
            ) : (
              <span className="text-slate-400 text-xs">No days scheduled</span>
            )}
          </div>

          <button className="text-slate-400 hover:text-slate-700 p-1">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsed Drawer (Revealed on Click) */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/60 rounded-b-xl text-xs space-y-3 animate-in fade-in duration-150">
          {/* Strategic caste recommendation statement */}
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 mb-1">
              <Info className="w-4 h-4 text-indigo-600" />
              Caste Demographics &amp; Strategic Deployment Requirement for {c.ac_name}
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              {c.squadRec.strategyBrief}
            </p>
          </div>

          {/* Allocation Table for Campaigners of Selected Party */}
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <div className="px-3 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between font-bold text-slate-700 text-[11px]">
              <span>Deploy Campaigner Classes (1–2d CM Blitz, 3–7d Minister Mandal, 10–30d MLA Ground, 1d Mega Star Roadshow)</span>
              <span>Days &amp; Impact</span>
            </div>

            <div className="divide-y divide-slate-100">
              {partyCampaigners.map((prof) => {
                const currentDays = allocations[prof.id]?.[c.ac_no] || 0;
                const stats = campaignerStats[prof.id];
                const liftPct = Math.min(6.0, currentDays * prof.voteLiftPerDayPct);
                const isRecommended =
                  prof.code === c.squadRec.recommendedA ||
                  prof.code === c.squadRec.recommendedB ||
                  prof.code === c.squadRec.recommendedC ||
                  prof.code === c.squadRec.recommendedM;

                return (
                  <div
                    key={prof.id}
                    className={`p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs transition-colors ${
                      currentDays > 0 ? 'bg-amber-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Profile details */}
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`font-mono text-xs font-black px-2 py-0.5 rounded ${
                          TIER_METADATA[prof.tier].badgeBg
                        } ${TIER_METADATA[prof.tier].badgeText}`}
                      >
                        Class {prof.tier} • {prof.code}
                      </span>

                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{prof.designation}</span>
                          {isRecommended && (
                            <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-black uppercase tracking-wide">
                              Recommended
                            </span>
                          )}
                          {prof.isOutsideIcon && (
                            <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-black uppercase tracking-wide flex items-center gap-0.5">
                              <Film className="w-2.5 h-2.5" /> Outside Star Icon
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Appeal: <strong>{prof.caste}</strong> • +{prof.voteLiftPerDayPct}% lift/day (up to {prof.maxDaysPerAc}d)
                        </div>
                      </div>
                    </div>

                    {/* Stepper + Days impact */}
                    <div className="flex items-center gap-3">
                      {currentDays > 0 && (
                        <span className="font-mono text-[11px] font-bold text-emerald-700">
                          +{liftPct.toFixed(2)}% lift
                        </span>
                      )}

                      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
                        <button
                          onClick={(e) => onDayChange(prof.id, c.ac_no, -prof.stepDays, e)}
                          disabled={currentDays <= 0}
                          className="w-6 h-6 rounded bg-white border border-slate-300 disabled:opacity-30 hover:bg-slate-200 font-bold text-slate-700 text-xs flex items-center justify-center cursor-pointer shadow-2xs"
                          title={`Remove ${prof.stepDays} day(s)`}
                        >
                          -
                        </button>
                        <span className="font-mono font-bold text-xs text-slate-900 w-16 text-center">
                          {currentDays} {currentDays === 1 ? 'day' : 'days'}
                        </span>
                        <button
                          onClick={(e) => onDayChange(prof.id, c.ac_no, prof.stepDays, e)}
                          disabled={
                            currentDays + prof.stepDays > prof.maxDaysPerAc ||
                            (stats && stats.remainingDays < prof.stepDays)
                          }
                          className="w-6 h-6 rounded bg-amber-500 disabled:opacity-30 hover:bg-amber-400 font-black text-slate-950 text-xs flex items-center justify-center cursor-pointer shadow-2xs"
                          title={`Add ${prof.stepDays} day(s)`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Summary & AC Dossier Link */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              Total Scheduled: <strong>{c.deployedDetails.reduce((s, d) => s + d.days, 0)} days</strong> across all classes
            </span>
            {onOpenDossier && (
              <button
                onClick={() => onOpenDossier(c.ac_no)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
              >
                Inspect Full AC Dossier ↗
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
