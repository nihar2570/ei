import React, { useState, useMemo, useEffect } from 'react';
import type { DemographicsDataset } from '../types';
import { Calendar, Search } from 'lucide-react';
import {
  type CampaignerTier,
  type TierConfig,
  type CampaignerProfile,
  TIER_METADATA,
  CAMPAIGNER_PROFILES,
  getConstituencySquadRecommendation,
} from './campaigner/campaignerProfiles';
import { CampaignerSquadSummary } from './campaigner/CampaignerSquadSummary';
import { CampaignerAcCard, type CampaignerAcItem } from './campaigner/CampaignerAcCard';

export type { CampaignerTier, TierConfig, CampaignerProfile };
export { TIER_METADATA, CAMPAIGNER_PROFILES, getConstituencySquadRecommendation };

interface StarCampaignerAllocatorProps {
  data: DemographicsDataset;
  targetParty?: 'TDP' | 'YSRCP' | 'JSP' | 'BJP';
  onTargetPartyChange?: (p: 'TDP' | 'YSRCP' | 'JSP' | 'BJP') => void;
  activeConstituencyNo?: number | null;
  onSelectConstituency?: (acNo: number) => void;
  allocations: Record<string, Record<number, number>>;
  setAllocations?: React.Dispatch<React.SetStateAction<Record<string, Record<number, number>>>>;
  onAllocationsChange?: React.Dispatch<React.SetStateAction<Record<string, Record<number, number>>>>;
  onSimulatedLiftChange?: (liftMap: Map<number, number>) => void;
  compact?: boolean;
  cumulativeAcImpacts?: Record<number, {
    resourceSwing: number;
    starLift: number;
    defectionShift: number;
    totalCumulativeSwing: number;
    cumulativeProjectedMargin: number;
    isCumulativelyFlipped: boolean;
  }>;
  onOpenDossier?: (acNo: number) => void;
}

export const StarCampaignerAllocator: React.FC<StarCampaignerAllocatorProps> = ({
  data,
  targetParty = 'TDP',
  onTargetPartyChange,
  activeConstituencyNo,
  onSelectConstituency: _onSelectConstituency,
  allocations,
  setAllocations,
  onAllocationsChange,
  onSimulatedLiftChange,
  cumulativeAcImpacts,
  onOpenDossier,
}) => {
  const updateAllocations = setAllocations || onAllocationsChange || (() => {});
  const [selectedParty, setSelectedParty] = useState<'TDP' | 'YSRCP' | 'JSP' | 'BJP'>(targetParty);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'battleground' | 'flipped'>('battleground');
  const [battlegroundMarginThreshold, setBattlegroundMarginThreshold] = useState<number>(8000);
  const [expandedAcNo, setExpandedAcNo] = useState<number | null>(activeConstituencyNo || null);

  useEffect(() => {
    if (targetParty && targetParty !== selectedParty) {
      setSelectedParty(targetParty);
    }
  }, [targetParty]);

  const handlePartyChange = (p: 'TDP' | 'YSRCP' | 'JSP' | 'BJP') => {
    setSelectedParty(p);
    if (onTargetPartyChange) onTargetPartyChange(p);
  };

  const partyCampaigners = useMemo(() => {
    return CAMPAIGNER_PROFILES.filter((c) => c.party === selectedParty);
  }, [selectedParty]);

  // Aggregate used days per campaigner
  const campaignerStats = useMemo(() => {
    const stats: Record<string, { totalDays: number; usedDays: number; remainingDays: number }> = {};
    partyCampaigners.forEach((camp) => {
      const campAllocs = allocations[camp.id] || {};
      const used = Object.values(campAllocs).reduce((sum, d) => sum + d, 0);
      stats[camp.id] = {
        totalDays: camp.totalDays,
        usedDays: used,
        remainingDays: Math.max(0, camp.totalDays - used),
      };
    });
    return stats;
  }, [partyCampaigners, allocations]);

  // Per-AC Lift computation
  const acLifts = useMemo(() => {
    const list: CampaignerAcItem[] = [];
    const liftByAc = new Map<number, number>();

    Object.values(data.constituencies).forEach((ac) => {
      let totalLiftPct = 0;
      const deployedDetails: CampaignerAcItem['deployedDetails'] = [];

      partyCampaigners.forEach((camp) => {
        const days = allocations[camp.id]?.[ac.ac_no] || 0;
        if (days > 0) {
          const lift = Math.min(6.0, days * camp.voteLiftPerDayPct);
          totalLiftPct += lift;
          deployedDetails.push({ camp, days, liftPct: lift });
        }
      });

      totalLiftPct = Math.min(10.0, totalLiftPct);

      const estimatedTotalVotes = ac.total_votes_2023 || 185000;
      const voteGain = Math.round((totalLiftPct / 100) * estimatedTotalVotes);
      liftByAc.set(ac.ac_no, voteGain);

      const isPartyWinner = ac.winner_2023.party === selectedParty;
      const baselineMargin = ac.margin_2023;
      const newMargin = isPartyWinner
        ? baselineMargin + voteGain
        : -baselineMargin + voteGain;

      const isFlippedToWin = !isPartyWinner && newMargin > 0;
      const squadRec = getConstituencySquadRecommendation(ac.caste_profile, ac.reservation, selectedParty);

      list.push({
        ac_no: ac.ac_no,
        ac_name: ac.ac_name,
        district: ac.district,
        reservation: ac.reservation,
        winner_2023: ac.winner_2023.party,
        margin_2023: baselineMargin,
        total_votes: estimatedTotalVotes,
        isPartyWinner,
        totalLiftPct,
        voteGain,
        newMargin,
        isFlippedToWin,
        squadRec,
        deployedDetails,
      });
    });

    list.sort((a, b) => {
      const aClose = Math.abs(a.margin_2023);
      const bClose = Math.abs(b.margin_2023);
      return aClose - bClose;
    });

    return { list, liftByAc };
  }, [data, partyCampaigners, allocations, selectedParty]);

  useEffect(() => {
    if (onSimulatedLiftChange) {
      onSimulatedLiftChange(acLifts.liftByAc);
    }
  }, [acLifts.liftByAc, onSimulatedLiftChange]);

  const handleDayChange = (campaignerId: string, acNo: number, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    updateAllocations((prev) => {
      const currentAcMap = prev[campaignerId] || {};
      const currentDays = currentAcMap[acNo] || 0;
      const newDays = Math.max(0, currentDays + delta);

      const camp = CAMPAIGNER_PROFILES.find((c) => c.id === campaignerId);
      if (camp && newDays > camp.maxDaysPerAc) return prev;

      const stats = campaignerStats[campaignerId];
      if (delta > 0 && stats && stats.remainingDays < delta) return prev;

      return {
        ...prev,
        [campaignerId]: {
          ...currentAcMap,
          [acNo]: newDays,
        },
      };
    });
  };

  const handleAutoDeploySquads = () => {
    const topBattlegrounds = acLifts.list
      .filter((c) => !c.isPartyWinner && c.margin_2023 <= 14000)
      .slice(0, 15);

    updateAllocations((prev) => {
      const updated = { ...prev };
      partyCampaigners.forEach((camp) => {
        if (!updated[camp.id]) updated[camp.id] = {};
      });

      topBattlegrounds.forEach((item) => {
        const rec = item.squadRec;
        const matchingA = partyCampaigners.find((c) => c.tier === 'A' && c.code === rec.recommendedA);
        const matchingB = partyCampaigners.find((c) => c.tier === 'B' && c.code === rec.recommendedB);
        const matchingC = partyCampaigners.find((c) => c.tier === 'C' && c.code === rec.recommendedC);
        const matchingM = partyCampaigners.find((c) => c.tier === 'M' && c.code === rec.recommendedM);

        [matchingA, matchingB, matchingC, matchingM].forEach((camp) => {
          if (!camp) return;
          const currentTotal = Object.values(updated[camp.id] || {}).reduce((s, d) => s + d, 0);
          const remaining = camp.totalDays - currentTotal;
          if (remaining >= camp.suggestedDays) {
            updated[camp.id] = {
              ...(updated[camp.id] || {}),
              [item.ac_no]: camp.suggestedDays,
            };
          }
        });
      });

      return updated;
    });
  };

  const handleResetParty = () => {
    updateAllocations((prev) => {
      const next = { ...prev };
      partyCampaigners.forEach((c) => {
        delete next[c.id];
      });
      return next;
    });
  };

  const filteredList = useMemo(() => {
    return acLifts.list.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = c.ac_name.toLowerCase().includes(q);
        const matchesDist = c.district.toLowerCase().includes(q);
        const matchesNo = `${c.ac_no}` === q || `#${c.ac_no}`.includes(q);
        if (!matchesName && !matchesDist && !matchesNo) return false;
      }
      if (filterType === 'battleground') {
        return Math.abs(c.margin_2023) <= battlegroundMarginThreshold;
      }
      if (filterType === 'flipped') {
        return c.isFlippedToWin || c.deployedDetails.length > 0;
      }
      return true;
    });
  }, [acLifts.list, searchQuery, filterType, battlegroundMarginThreshold]);

  const totalSeatsCovered = useMemo(() => {
    return acLifts.list.filter((c) => c.deployedDetails.length > 0).length;
  }, [acLifts.list]);

  const totalSeatsFlipped = useMemo(() => {
    return acLifts.list.filter((c) => c.isFlippedToWin).length;
  }, [acLifts.list]);

  const totalVotesGained = useMemo(() => {
    return acLifts.list.reduce((sum, c) => sum + c.voteGain, 0);
  }, [acLifts.list]);

  return (
    <div className="space-y-4">
      {/* Leadership Squad Summary Barometer */}
      <CampaignerSquadSummary
        selectedParty={selectedParty}
        setSelectedParty={handlePartyChange}
        partyCampaigners={partyCampaigners}
        campaignerStats={campaignerStats}
        totalSeatsCovered={totalSeatsCovered}
        totalSeatsFlipped={totalSeatsFlipped}
        totalVotesGained={totalVotesGained}
        onAutoDeploySquads={handleAutoDeploySquads}
        onResetParty={handleResetParty}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
            Constituency Campaign Schedule &amp; Caste Demographic Squad Recommendations
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search AC or District..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 w-44"
            />
          </div>

          {/* Battleground Margin Threshold Input */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-xs">
            <span className="text-slate-500 font-semibold text-[11px]">Margin &le;</span>
            <input
              type="number"
              min="500"
              max="50000"
              step="500"
              value={battlegroundMarginThreshold}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                setBattlegroundMarginThreshold(isNaN(val) ? 0 : Math.max(0, val));
                setFilterType('battleground');
              }}
              className="w-16 px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-xs text-slate-900 text-right focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
            <span className="text-slate-400 text-[10px]">votes</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setFilterType('battleground')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'battleground'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Battlegrounds ({filteredList.length})
            </button>
            <button
              onClick={() => setFilterType('flipped')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'flipped'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Flipped / Scheduled
            </button>
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-black'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All 175
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible Card List */}
      <div className="space-y-2">
        {filteredList.map((c) => (
          <CampaignerAcCard
            key={c.ac_no}
            c={c}
            isExpanded={expandedAcNo === c.ac_no}
            onToggleExpand={() => setExpandedAcNo(expandedAcNo === c.ac_no ? null : c.ac_no)}
            partyCampaigners={partyCampaigners}
            allocations={allocations}
            campaignerStats={campaignerStats}
            cumulativeAcImpacts={cumulativeAcImpacts}
            onDayChange={handleDayChange}
            onOpenDossier={onOpenDossier}
          />
        ))}
      </div>
    </div>
  );
};
