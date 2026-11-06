import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  TrendingUp,
  BarChart3,
  Award,
  Sparkles,
} from 'lucide-react';
import type {
  RegionKey,
  ElectionCycle,
  CampaignMilestone,
  PollDataPoint,
  CampaignPollingTrackerProps,
} from './tracker/pollingData';
import {
  isACInRegion,
  CAMPAIGN_MILESTONES_2024,
  CAMPAIGN_MILESTONES_2029,
} from './tracker/pollingData';
import { PollingChartSvg } from './tracker/PollingChartSvg';
import { ScrubberPlayerBar } from './tracker/ScrubberPlayerBar';
import { AccuracyScorecardTab } from './tracker/AccuracyScorecardTab';

export * from './tracker/pollingData';

export const CampaignPollingTracker538: React.FC<CampaignPollingTrackerProps> = ({
  activePreset,
  simulatedResults = [],
  onApplyPreset,
}) => {
  // Election Cycle State: 2024 Retrospective vs 2029 Forward Forecast
  const isPreset2029 = useMemo(() => Boolean(activePreset && activePreset.includes('2029')), [activePreset]);
  const [electionCycle, setElectionCycle] = useState<ElectionCycle>(isPreset2029 ? '2029' : '2024');

  // Sync election cycle if user switches to a 2029 preset from parent
  useEffect(() => {
    if (activePreset && activePreset.includes('2029')) {
      setElectionCycle('2029');
    }
  }, [activePreset]);

  // Region Selection
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('ALL');

  // Chart Mode: Vote Share % vs Projected Seats
  const [displayMode, setDisplayMode] = useState<'VOTE_SHARE' | 'SEATS'>('VOTE_SHARE');

  // SubTab: Polling & Momentum Trajectory Chart vs Scorecard/Scenario Matrix
  const [activeSubTab, setActiveSubTab] = useState<'TRACKER' | 'SCORECARD'>('TRACKER');

  // Check if active scenario is a 3-way triangular contest
  const isTriangularSolo = useMemo(() => {
    return (
      electionCycle === '2029' &&
      (activePreset === 'triangular_2029_solo' || activePreset === 'jsp_solo_split' || activePreset === 'tdp_vs_jsp_bjp_2029')
    );
  }, [electionCycle, activePreset]);

  // Date Boundaries for Active Cycle
  const startDate = useMemo(() => {
    return electionCycle === '2024'
      ? new Date('2023-10-01').getTime()
      : new Date('2024-06-04').getTime();
  }, [electionCycle]);

  const endDate = useMemo(() => {
    return electionCycle === '2024'
      ? new Date('2024-06-05').getTime()
      : new Date('2029-05-15').getTime();
  }, [electionCycle]);

  // Scrubber Time
  const [scrubberTime, setScrubberTime] = useState<number>(endDate);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Update scrubber time when cycle changes
  useEffect(() => {
    setScrubberTime(endDate);
    setIsPlaying(false);
  }, [endDate]);

  // Hover Tooltips
  const [hoveredPoll, setHoveredPoll] = useState<PollDataPoint | null>(null);
  const [hoveredMilestone, setHoveredMilestone] = useState<CampaignMilestone | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // Auto-play timer for campaign scrubber
  useEffect(() => {
    if (isPlaying) {
      const stepInterval = electionCycle === '2024' ? 4 * 24 * 60 * 60 * 1000 : 45 * 24 * 60 * 60 * 1000;
      playTimerRef.current = setInterval(() => {
        setScrubberTime((prev) => {
          const next = prev + stepInterval;
          if (next > endDate) {
            setIsPlaying(false);
            return endDate;
          }
          return next;
        });
      }, 350);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, endDate, electionCycle]);

  // Compute Live Simulation Aggregates for the Selected Region
  const liveSimulationData = useMemo(() => {
    if (!simulatedResults || simulatedResults.length === 0) {
      return {
        totalSeats: 175,
        tally: { TDP: 135, YSRCP: 11, JSP: 21, BJP: 8, INC: 0, OTH: 0 },
        ndaSeats: 164,
        ysrcpSeats: 11,
        jspSeats: 21,
        votePcts: { TDP: 45.6, YSRCP: 39.6, JSP: 8.5, BJP: 1.3, NDA: 55.4 },
      };
    }

    const filtered = simulatedResults.filter((r) => isACInRegion(r.ac_no, selectedRegion));
    const totalSeats = filtered.length || 1;
    const tally: Record<string, number> = { TDP: 0, YSRCP: 0, JSP: 0, BJP: 0, INC: 0, OTH: 0 };
    let totalVotes = 0;
    let tdpVotes = 0;
    let ysrcpVotes = 0;
    let jspVotes = 0;
    let bjpVotes = 0;

    filtered.forEach((r) => {
      const winner = r.simulated.winner_party;
      tally[winner] = (tally[winner] || 0) + 1;

      const votes = r.simulated.party_votes;
      const tdp = votes.TDP || 0;
      const ysrcp = votes.YSRCP || 0;
      const jsp = votes.JSP || 0;
      const bjp = votes.BJP || 0;
      const acTotal = Object.values(votes).reduce((a, b) => a + b, 0) || 180000;

      tdpVotes += tdp;
      ysrcpVotes += ysrcp;
      jspVotes += jsp;
      bjpVotes += bjp;
      totalVotes += acTotal;
    });

    const safeTotal = totalVotes || 1;
    const tdpPct = Number(((tdpVotes / safeTotal) * 100).toFixed(1));
    const ysrcpPct = Number(((ysrcpVotes / safeTotal) * 100).toFixed(1));
    const jspPct = Number(((jspVotes / safeTotal) * 100).toFixed(1));
    const bjpPct = Number(((bjpVotes / safeTotal) * 100).toFixed(1));
    const ndaPct = Number((tdpPct + jspPct + bjpPct).toFixed(1));
    const ndaSeats = (tally.TDP || 0) + (tally.JSP || 0) + (tally.BJP || 0);

    return {
      totalSeats,
      tally,
      ndaSeats,
      ysrcpSeats: tally.YSRCP || 0,
      jspSeats: tally.JSP || 0,
      votePcts: { TDP: tdpPct, YSRCP: ysrcpPct, JSP: jspPct, BJP: bjpPct, NDA: ndaPct },
    };
  }, [simulatedResults, selectedRegion]);

  // Regional Contest Summaries for Multi-Segment Selector
  const regionSummaries = useMemo(() => {
    return [
      { key: 'ALL' as const, label: 'Statewide', seats: 175 },
      { key: 'NORTH_COASTAL' as const, label: 'North Coastal', seats: 34 },
      { key: 'GODAVARI' as const, label: 'Godavari Delta', seats: 34 },
      { key: 'KRISHNA_GUNTUR' as const, label: 'Krishna-Guntur', seats: 33 },
      { key: 'SOUTH_COASTAL' as const, label: 'South Coastal', seats: 22 },
      { key: 'RAYALASEEMA' as const, label: 'Rayalaseema', seats: 52 },
    ].map((reg) => {
      const regFiltered = simulatedResults.filter((r) => isACInRegion(r.ac_no, reg.key));
      const regNdaSeats = regFiltered.filter((r) => ['TDP', 'JSP', 'BJP'].includes(r.simulated.winner_party)).length;
      const regYsrcpSeats = regFiltered.filter((r) => r.simulated.winner_party === 'YSRCP').length;
      return {
        ...reg,
        ndaSeats: regNdaSeats,
        ysrcpSeats: regYsrcpSeats,
      };
    });
  }, [simulatedResults]);

  // Active Milestones List
  const activeMilestones = useMemo(() => {
    return electionCycle === '2024' ? CAMPAIGN_MILESTONES_2024 : CAMPAIGN_MILESTONES_2029;
  }, [electionCycle]);

  // SVG Chart Layout Coordinate Helpers
  const svgWidth = 920;
  const svgHeight = 380;
  const paddingLeft = 45;
  const paddingRight = 115;
  const paddingTop = 65;
  const paddingBottom = 45;
  const chartW = svgWidth - paddingLeft - paddingRight;
  const chartH = svgHeight - paddingTop - paddingBottom;

  const timeToX = (t: number) => {
    const fraction = (t - startDate) / (endDate - startDate);
    return paddingLeft + fraction * chartW;
  };

  const valToY = (val: number) => {
    if (displayMode === 'VOTE_SHARE') {
      const minVal = isTriangularSolo ? 10 : 20;
      const maxVal = 65;
      const clamped = Math.max(minVal, Math.min(maxVal, val));
      const fraction = (clamped - minVal) / (maxVal - minVal);
      return paddingTop + chartH - fraction * chartH;
    } else {
      const maxSeats = liveSimulationData.totalSeats;
      const fraction = Math.max(0, Math.min(maxSeats, val)) / maxSeats;
      return paddingTop + chartH - fraction * chartH;
    }
  };

  // Target Terminal Values (Decouples 2024 Certified Ground Reality from 2029 Active Simulation)
  const terminalValues = useMemo(() => {
    const isVote = displayMode === 'VOTE_SHARE';
    if (electionCycle === '2024') {
      const ndaVal = isVote
        ? 55.4
        : selectedRegion === 'ALL'
        ? 164
        : Math.round(164 * (liveSimulationData.totalSeats / 175));
      const ysrcpVal = isVote
        ? 39.6
        : Math.max(0, liveSimulationData.totalSeats - Number(ndaVal));
      return {
        ndaVal: Number(ndaVal),
        ndaLabel: isVote ? '55.4%' : `${ndaVal}s`,
        ndaParty: 'NDA (Form-20)',
        ysrcpVal: Number(ysrcpVal),
        ysrcpLabel: isVote ? '39.6%' : `${ysrcpVal}s`,
        ysrcpParty: 'YSRCP',
        jspVal: 0,
        jspLabel: '',
        jspParty: '',
      };
    } else {
      const ndaVal = isVote
        ? isTriangularSolo
          ? liveSimulationData.votePcts.TDP
          : liveSimulationData.votePcts.NDA
        : isTriangularSolo
        ? liveSimulationData.tally.TDP || 0
        : liveSimulationData.ndaSeats;
      const ndaLabel = isVote
        ? `${isTriangularSolo ? liveSimulationData.votePcts.TDP : liveSimulationData.votePcts.NDA}%`
        : `${isTriangularSolo ? liveSimulationData.tally.TDP || 0 : liveSimulationData.ndaSeats}s`;
      const ysrcpVal = isVote ? liveSimulationData.votePcts.YSRCP : liveSimulationData.ysrcpSeats;
      const ysrcpLabel = isVote ? `${liveSimulationData.votePcts.YSRCP}%` : `${liveSimulationData.ysrcpSeats}s`;
      const jspVal = isVote ? liveSimulationData.votePcts.JSP : liveSimulationData.jspSeats;
      const jspLabel = isVote ? `${liveSimulationData.votePcts.JSP}%` : `${liveSimulationData.jspSeats}s`;

      return {
        ndaVal: Number(ndaVal),
        ndaLabel,
        ndaParty: isTriangularSolo ? 'TDP' : 'NDA',
        ysrcpVal: Number(ysrcpVal),
        ysrcpLabel,
        ysrcpParty: 'YSRCP',
        jspVal: Number(jspVal),
        jspLabel,
        jspParty: isTriangularSolo ? (activePreset === 'tdp_vs_jsp_bjp_2029' ? 'JSP+BJP' : 'JSP') : '',
      };
    }
  }, [electionCycle, displayMode, selectedRegion, liveSimulationData, isTriangularSolo, activePreset]);

  // Collision-Free Y-Coordinates for Right Margin Labels
  const rightBadgePositions = useMemo(() => {
    const rawNdaY = valToY(terminalValues.ndaVal);
    const rawYsrcpY = valToY(terminalValues.ysrcpVal);
    const rawJspY = isTriangularSolo ? valToY(terminalValues.jspVal) : 999;

    const items = [
      { key: 'nda', y: rawNdaY },
      { key: 'ysrcp', y: rawYsrcpY },
    ];
    if (isTriangularSolo) {
      items.push({ key: 'jsp', y: rawJspY });
    }

    items.sort((a, b) => a.y - b.y);
    const minGap = 28;
    for (let i = 1; i < items.length; i++) {
      if (items[i].y - items[i - 1].y < minGap) {
        const overlap = minGap - (items[i].y - items[i - 1].y);
        items[i].y += overlap / 2;
        items[i - 1].y -= overlap / 2;
      }
    }

    const map: Record<string, number> = {};
    items.forEach((it) => {
      map[it.key] = it.y;
    });
    return map;
  }, [terminalValues, isTriangularSolo, displayMode, liveSimulationData.totalSeats]);

  // Generate Smooth LOESS / Spline Curves
  const {
    ndaSplinePath,
    ysrcpSplinePath,
    jspSplinePath,
    currentScrubberValues,
  } = useMemo(() => {
    const steps = 35;
    const timeStep = (endDate - startDate) / steps;
    const curvePointsNda: { x: number; y: number; val: number; t: number }[] = [];
    const curvePointsYsrcp: { x: number; y: number; val: number; t: number }[] = [];
    const curvePointsJsp: { x: number; y: number; val: number; t: number }[] = [];

    // Target Terminal Values at May 2029 (Pulled Live from Simulation Engine)
    const termNdaVote = isTriangularSolo ? liveSimulationData.votePcts.TDP : liveSimulationData.votePcts.NDA;
    const termYsrcpVote = liveSimulationData.votePcts.YSRCP;
    const termJspVote = liveSimulationData.votePcts.JSP;

    const termNdaSeats = isTriangularSolo ? liveSimulationData.tally.TDP || 0 : liveSimulationData.ndaSeats;
    const termYsrcpSeats = liveSimulationData.ysrcpSeats;
    const termJspSeats = liveSimulationData.jspSeats;

    for (let i = 0; i <= steps; i++) {
      const t = startDate + i * timeStep;
      const progress = i / steps; // 0 to 1

      let curNdaVal: number;
      let curYsrcpVal: number;
      let curJspVal = 0;

      if (electionCycle === '2024') {
        // 2024 Retrospective Trajectory
        let baseNdaVote: number;
        let baseYsrcpVote: number;
        if (progress < 0.3) {
          const localP = progress / 0.3;
          baseNdaVote = 43.5 + localP * 3.0;
          baseYsrcpVote = 46.0 - localP * 2.2;
        } else if (progress < 0.6) {
          const localP = (progress - 0.3) / 0.3;
          baseNdaVote = 46.5 + localP * 3.8;
          baseYsrcpVote = 43.8 - localP * 2.1;
        } else {
          const localP = (progress - 0.6) / 0.4;
          baseNdaVote = 50.3 + localP * 5.08;
          baseYsrcpVote = 41.7 - localP * 2.1;
        }

        const seatRatio = liveSimulationData.totalSeats / 175;
        const targetNdaSeats = Math.round(164 * seatRatio);
        const startNdaSeats = Math.round(85 * seatRatio);
        const easeP24 = progress * progress * (3 - 2 * progress);
        const curSeats = Math.round(startNdaSeats + (targetNdaSeats - startNdaSeats) * easeP24);

        curNdaVal = displayMode === 'VOTE_SHARE' ? baseNdaVote : curSeats;
        curYsrcpVal = displayMode === 'VOTE_SHARE' ? baseYsrcpVote : Math.max(0, liveSimulationData.totalSeats - curNdaVal);
      } else {
        // 2029 Forward Forecast Trajectory: Interpolates smoothly from 2024 baseline (55.4% / 39.6%) to live 2029 simulated result!
        const startNdaVote = isTriangularSolo ? 45.6 : 55.4;
        const startYsrcpVote = 39.6;
        const startJspVote = isTriangularSolo ? 8.5 : 0;

        const startNdaSeats = isTriangularSolo ? 135 : 164;
        const startYsrcpSeats = 11;
        const startJspSeats = 21;

        // Smooth cubic ease-in-out transition reflecting natural 5-year anti-incumbency curve
        const easeP = progress * progress * (3 - 2 * progress);

        if (displayMode === 'VOTE_SHARE') {
          curNdaVal = Number((startNdaVote + (termNdaVote - startNdaVote) * easeP).toFixed(1));
          curYsrcpVal = Number((startYsrcpVote + (termYsrcpVote - startYsrcpVote) * easeP).toFixed(1));
          curJspVal = Number((startJspVote + (termJspVote - startJspVote) * easeP).toFixed(1));
        } else {
          const seatRatio = liveSimulationData.totalSeats / 175;
          curNdaVal = Math.round((startNdaSeats + (termNdaSeats - startNdaSeats) * easeP) * seatRatio);
          curYsrcpVal = Math.round((startYsrcpSeats + (termYsrcpSeats - startYsrcpSeats) * easeP) * seatRatio);
          curJspVal = Math.round((startJspSeats + (termJspSeats - startJspSeats) * easeP) * seatRatio);
        }
      }

      curvePointsNda.push({ x: timeToX(t), y: valToY(curNdaVal), val: curNdaVal, t });
      curvePointsYsrcp.push({ x: timeToX(t), y: valToY(curYsrcpVal), val: curYsrcpVal, t });
      if (isTriangularSolo) {
        curvePointsJsp.push({ x: timeToX(t), y: valToY(curJspVal), val: curJspVal, t });
      }
    }

    const buildBezier = (pts: { x: number; y: number }[]) => {
      if (pts.length < 2) return '';
      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i === 0 ? 0 : i - 1];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];
        const cp1x = p1.x + (p2.x - p0.x) / 6;
        const cp1y = p1.y + (p2.y - p0.y) / 6;
        const cp2x = p2.x - (p3.x - p1.x) / 6;
        const cp2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      }
      return d;
    };

    // Scrubber current value lookup
    let closestIndex = 0;
    let minTimeDiff = Infinity;
    curvePointsNda.forEach((pt, idx) => {
      const diff = Math.abs(pt.t - scrubberTime);
      if (diff < minTimeDiff) {
        minTimeDiff = diff;
        closestIndex = idx;
      }
    });

    const activeNdaVal = curvePointsNda[closestIndex]?.val || termNdaVote;
    const activeYsrcpVal = curvePointsYsrcp[closestIndex]?.val || termYsrcpVote;
    const activeJspVal = curvePointsJsp[closestIndex]?.val || termJspVote;

    return {
      ndaSplinePath: buildBezier(curvePointsNda),
      ysrcpSplinePath: buildBezier(curvePointsYsrcp),
      jspSplinePath: isTriangularSolo ? buildBezier(curvePointsJsp) : '',
      currentScrubberValues: {
        nda: activeNdaVal,
        ysrcp: activeYsrcpVal,
        jsp: activeJspVal,
        lead: Number((activeNdaVal - activeYsrcpVal).toFixed(1)),
      },
    };
  }, [
    startDate,
    endDate,
    electionCycle,
    displayMode,
    isTriangularSolo,
    liveSimulationData,
    scrubberTime,
  ]);

  // Active milestone narrative for scrubber
  const activeMilestoneNarrative = useMemo(() => {
    let active = activeMilestones[0];
    for (const m of activeMilestones) {
      if (m.timestamp <= scrubberTime) {
        active = m;
      } else {
        break;
      }
    }
    return active;
  }, [scrubberTime, activeMilestones]);

  const scrubberDateFormatted = useMemo(() => {
    const d = new Date(scrubberTime);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [scrubberTime]);

  const handleJumpToMilestone = (m: CampaignMilestone) => {
    setScrubberTime(m.timestamp);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header & Filter Pill Ribbon */}
      <div className="bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-900 pb-3.5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/30">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Polling &amp; Momentum
              </h2>
              {/* Election Cycle Badge */}
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                  electionCycle === '2029'
                    ? 'bg-purple-950 text-purple-300 border-purple-700/60'
                    : 'bg-indigo-950 text-indigo-300 border-indigo-700/60'
                }`}
              >
                {electionCycle === '2029' ? '2029 Forward Forecast' : '2024 General Election'}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              {electionCycle === '2024'
                ? 'An updating average of Andhra Pradesh 2024 general election pre-poll & exit surveys, accounting for sample size and pollster track record.'
                : 'Forward-projected 2024-2029 trajectory modeling 5-year anti-incumbency, coalition cohesion (TDP-JSP-BJP), and live simulation adjustments.'}
            </p>
          </div>

          {/* Cycle Switcher + Mode Switcher + SubTab Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Cycle Switcher: 2024 vs 2029 */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setElectionCycle('2024')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  electionCycle === '2024'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2024 Historic
              </button>
              <button
                onClick={() => setElectionCycle('2029')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  electionCycle === '2029'
                    ? 'bg-purple-600 text-white shadow-sm font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>2029 Forecast</span>
              </button>
            </div>

            {/* Vote Share vs Seats Mode */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setDisplayMode('VOTE_SHARE')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  displayMode === 'VOTE_SHARE'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Vote %
              </button>
              <button
                onClick={() => setDisplayMode('SEATS')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                  displayMode === 'SEATS'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Seats
              </button>
            </div>

            {/* Sub-tab: Chart vs Scorecard/Scenarios */}
            <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveSubTab('TRACKER')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeSubTab === 'TRACKER'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Chart</span>
              </button>
              <button
                onClick={() => setActiveSubTab('SCORECARD')}
                className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeSubTab === 'SCORECARD'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5" />
                <span>{electionCycle === '2024' ? 'Polls vs Reality' : '2029 Scenarios'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Regional Multi-Segment Contest Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-bold uppercase tracking-wider text-slate-500">Filter Contest / Assembly Zone:</span>
            <span className="font-mono text-indigo-400">
              Active: <strong>{selectedRegion} ({liveSimulationData.totalSeats} ACs)</strong>
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {regionSummaries.map((c) => {
              const isSelected = selectedRegion === c.key;
              return (
                <button
                  key={c.key}
                  onClick={() => setSelectedRegion(c.key)}
                  className={`p-2 text-left rounded-xl font-bold cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-indigo-950/80 text-white border-indigo-500 shadow-md ring-1 ring-indigo-400/50'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:bg-slate-800/80 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-black">
                    <span className="truncate">{c.label}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-1">{c.seats}</span>
                  </div>
                  <div className="text-[10px] font-mono mt-0.5 text-amber-400 font-bold truncate">
                    {c.ndaSeats} NDA / {c.ysrcpSeats} YSR
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {activeSubTab === 'TRACKER' ? (
        <div className="space-y-4">
          <PollingChartSvg
            isTriangularSolo={isTriangularSolo}
            activePreset={activePreset}
            displayMode={displayMode}
            totalSeats={liveSimulationData.totalSeats}
            timeToX={timeToX}
            valToY={valToY}
            chartW={chartW}
            chartH={chartH}
            paddingLeft={paddingLeft}
            paddingTop={paddingTop}
            svgWidth={svgWidth}
            svgHeight={svgHeight}
            electionCycle={electionCycle}
            activeMilestones={activeMilestones}
            handleJumpToMilestone={handleJumpToMilestone}
            hoveredMilestone={hoveredMilestone}
            setHoveredMilestone={setHoveredMilestone}
            hoveredPoll={hoveredPoll}
            setHoveredPoll={setHoveredPoll}
            tooltipPos={tooltipPos}
            setTooltipPos={setTooltipPos}
            ndaSplinePath={ndaSplinePath}
            ysrcpSplinePath={ysrcpSplinePath}
            jspSplinePath={jspSplinePath}
            terminalValues={terminalValues}
            rightBadgePositions={rightBadgePositions}
            scrubberTime={scrubberTime}
          />

          <ScrubberPlayerBar
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            scrubberTime={scrubberTime}
            setScrubberTime={setScrubberTime}
            startDate={startDate}
            endDate={endDate}
            electionCycle={electionCycle}
            scrubberDateFormatted={scrubberDateFormatted}
            currentScrubberValues={currentScrubberValues}
            isTriangularSolo={isTriangularSolo}
            displayMode={displayMode}
            activeMilestoneNarrative={activeMilestoneNarrative}
          />
        </div>
      ) : (
        <AccuracyScorecardTab
          electionCycle={electionCycle}
          liveSimulationData={liveSimulationData}
          isTriangularSolo={isTriangularSolo}
          activePreset={activePreset}
          onApplyPreset={onApplyPreset}
        />
      )}
    </div>
  );
};
