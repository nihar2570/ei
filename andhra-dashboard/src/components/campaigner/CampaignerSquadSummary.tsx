import React from 'react';
import { Star, Sparkles, RotateCcw } from 'lucide-react';
import {
  type CampaignerTier,
  TIER_METADATA,
  type CampaignerProfile,
} from './campaignerProfiles';

interface CampaignerSquadSummaryProps {
  selectedParty: 'TDP' | 'YSRCP' | 'JSP' | 'BJP';
  setSelectedParty: (p: 'TDP' | 'YSRCP' | 'JSP' | 'BJP') => void;
  partyCampaigners: CampaignerProfile[];
  campaignerStats: Record<string, { totalDays: number; usedDays: number; remainingDays: number }>;
  totalSeatsCovered: number;
  totalSeatsFlipped: number;
  totalVotesGained: number;
  onAutoDeploySquads: () => void;
  onResetParty: () => void;
}

export const CampaignerSquadSummary: React.FC<CampaignerSquadSummaryProps> = ({
  selectedParty,
  setSelectedParty,
  partyCampaigners,
  campaignerStats,
  totalSeatsCovered,
  totalSeatsFlipped,
  totalVotesGained,
  onAutoDeploySquads,
  onResetParty,
}) => {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-4 shadow-xl">
      {/* Top Header & Party Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-mono text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
              <Star className="w-3 h-3 fill-slate-950" /> STRATEGIC CAMPAIGNERS
            </span>
            <span className="text-xs text-slate-400">
              Class A (CM) • Class B (Ministers) • Class C (MLAs) • Class M (Movie Stars &amp; Cultural Icons)
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
            Leadership Deployment &amp; Demographic Match Plan
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Party Switcher */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs font-bold">
            <button
              onClick={() => setSelectedParty('TDP')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedParty === 'TDP'
                  ? 'bg-yellow-500 text-slate-950 shadow-xs font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-slate-950" />
              TDP
            </button>
            <button
              onClick={() => setSelectedParty('YSRCP')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedParty === 'YSRCP'
                  ? 'bg-sky-700 text-white shadow-xs font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              YSRCP
            </button>
            <button
              onClick={() => setSelectedParty('JSP')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedParty === 'JSP'
                  ? 'bg-red-600 text-white shadow-xs font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              JSP
            </button>
            <button
              onClick={() => setSelectedParty('BJP')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedParty === 'BJP'
                  ? 'bg-orange-600 text-white shadow-xs font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white" />
              BJP
            </button>
          </div>

          <button
            onClick={onAutoDeploySquads}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            title="Automatically deploy complementary A+B+C+M squads to top battlegrounds"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            1-Click Smart Squad Plan
          </button>

          <button
            onClick={onResetParty}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            title="Reset all campaign days for this party"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row 2: Four Tier Class Cards (A, B, C, M) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {(['A', 'B', 'C', 'M'] as CampaignerTier[]).map((tierKey) => {
          const meta = TIER_METADATA[tierKey];
          const profilesInTier = partyCampaigners.filter((p) => p.tier === tierKey);
          const totalTierDaysUsed = profilesInTier.reduce(
            (sum, p) => sum + (campaignerStats[p.id]?.usedDays || 0),
            0
          );
          const totalTierDays = profilesInTier.reduce((sum, p) => sum + p.totalDays, 0);

          return (
            <div
              key={tierKey}
              className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/80 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black px-2 py-0.5 rounded font-mono ${meta.badgeBg} ${meta.badgeText}`}>
                    Class {tierKey}
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono font-bold">
                    +{meta.voteLiftPerDayPct}% / Day
                  </span>
                </div>
                <div className="font-bold text-white text-xs leading-snug line-clamp-1">{meta.role}</div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-0.5">
                  <span>{meta.durationLabel}</span>
                  <span className="font-mono text-[10px] text-slate-300">{totalTierDaysUsed} / {totalTierDays}d deployed</span>
                </div>
              </div>

              {/* Profiles in this tier */}
              <div className="pt-2 border-t border-slate-700/60 flex flex-wrap gap-1">
                {profilesInTier.map((prof) => {
                  const stats = campaignerStats[prof.id];
                  return (
                    <div
                      key={prof.id}
                      className="bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-700 text-[10px] flex items-center justify-between gap-1.5 flex-1 min-w-[100px]"
                      title={`${prof.designation} (${prof.caste})`}
                    >
                      <div className="truncate">
                        <span className="font-black text-amber-400 mr-1">{prof.code}</span>
                        <span className="text-slate-200 text-[9px] font-bold truncate">{prof.caste}</span>
                      </div>
                      <span className="font-mono text-slate-400 text-[9px] shrink-0">
                        {stats?.remainingDays || 0}d
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Row 3: Deployment KPI Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-950/60 px-4 py-2.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Selected Party:</span>
          <strong className="text-white font-bold">{selectedParty} Strategic Campaign Plan</strong>
        </div>
        <div className="flex items-center gap-5 text-xs">
          <div>
            <span className="text-slate-400">Target Seats Covered: </span>
            <strong className="text-amber-400 font-mono font-black">{totalSeatsCovered}</strong>
          </div>
          <div>
            <span className="text-slate-400">Projected Flips: </span>
            <strong className="text-emerald-400 font-mono font-black">+{totalSeatsFlipped}</strong>
          </div>
          <div>
            <span className="text-slate-400">Total Net Votes Mobilized: </span>
            <strong className="text-sky-400 font-mono font-black">+{totalVotesGained.toLocaleString()}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
