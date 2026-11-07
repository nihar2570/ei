import React, { useState, useMemo } from 'react';
import type { PersuadabilityTier, ChannelType } from '../../types/voterReach';
import { TEN_TOUCH_CADENCE_BLUEPRINT } from './voterReachData';
import {
  Calendar,
  Layers,
  PhoneCall,
  Users2,
  Share2,
  Video,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

interface MultiTouchCadencePlannerProps {
  selectedTier: PersuadabilityTier;
  targetVotersCount: number;
  casteName: string;
  ageLabel: string;
  topIssueTitle: string;
}

export const MultiTouchCadencePlanner: React.FC<MultiTouchCadencePlannerProps> = ({
  selectedTier,
  targetVotersCount,
  casteName,
  ageLabel,
  topIssueTitle,
}) => {
  const [activeTouchCount, setActiveTouchCount] = useState<number>(() => {
    return selectedTier === 'easy' ? 5 : selectedTier === 'mid' ? 10 : 6;
  });
  const [activeChannelFilter, setActiveChannelFilter] = useState<string>('ALL');
  const [copiedMemo, setCopiedMemo] = useState(false);

  // Filter blueprint steps according to tier applicability and touch count cap
  const applicableSteps = useMemo(() => {
    return TEN_TOUCH_CADENCE_BLUEPRINT.slice(0, activeTouchCount);
  }, [activeTouchCount]);

  const displayedSteps = useMemo(() => {
    if (activeChannelFilter === 'ALL') return applicableSteps;
    return applicableSteps.filter((s) => s.channel === activeChannelFilter);
  }, [applicableSteps, activeChannelFilter]);

  // Conversion yield estimate
  const conversionYieldPct = useMemo(() => {
    if (activeTouchCount >= 9) return 5.8;
    if (activeTouchCount >= 7) return 4.2;
    return 2.5;
  }, [activeTouchCount]);

  const uniqueChannelsCount = useMemo(() => {
    return new Set(applicableSteps.map((s) => s.channel)).size;
  }, [applicableSteps]);

  const getChannelIcon = (ch: ChannelType) => {
    switch (ch) {
      case 'digital':
        return <Video className="w-3.5 h-3.5 text-blue-500" />;
      case 'dark_social':
        return <Share2 className="w-3.5 h-3.5 text-emerald-500" />;
      case 'voice_ivr':
        return <PhoneCall className="w-3.5 h-3.5 text-amber-500" />;
      case 'ground_panna':
        return <Users2 className="w-3.5 h-3.5 text-indigo-500" />;
      case 'community':
        return <Layers className="w-3.5 h-3.5 text-purple-500" />;
      case 'gotv':
        return <Zap className="w-3.5 h-3.5 text-rose-500" />;
      default:
        return <Calendar className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const handleCopyMemo = () => {
    const memo = `
# 45-Day Multi-Touch Statewide Voter Outreach Brief
Scope: Andhra Pradesh Statewide (All 175 Assembly Constituencies)
Target Audience: ${casteName} (${ageLabel})
Persuadability Tier: ${selectedTier.toUpperCase()}
Audience Universe: ${targetVotersCount.toLocaleString()} statewide swing voters
Hero Grievance: ${topIssueTitle}
Planned Touchpoints: ${activeTouchCount} Touches
Channel Saturation: ${uniqueChannelsCount} Channels (Digital, WhatsApp, IVR & Ground)
Projected Persuasion Lift: +${conversionYieldPct}% swing

## Phased Cadence Matrix:
${applicableSteps
  .map(
    (s) =>
      `- Touch #${s.id} (${s.dayWindow}): [${s.channelLabel}] ${s.touchName}\n  Goal: ${s.objective}\n  Telugu Copy: "${s.sampleTeluguCopy}"`
  )
  .join('\n\n')}
    `.trim();

    navigator.clipboard.writeText(memo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2500);
  };

  return (
    <div id="reach-cadence" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-6 scroll-mt-24">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              The 5–10 Touch Multi-Channel Ad Cadence Planner
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Sequential 45-day exposure program to touch each voter through Digital, WhatsApp, IVR &amp; Doorstep Panna.
          </p>
        </div>

        {/* Cadence count switch */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Target Touches:</span>
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            {[5, 7, 10].map((num) => (
              <button
                key={num}
                onClick={() => setActiveTouchCount(num)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTouchCount === num
                    ? 'bg-indigo-600 text-white shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {num} Touches
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign Strategy & Reach Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Target Audience</span>
          <div className="text-lg font-black text-slate-900">{targetVotersCount.toLocaleString()}</div>
          <span className="text-[10px] text-slate-500 font-medium">Statewide Swing Electors</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Touch Frequency</span>
          <div className="text-lg font-black text-indigo-700">{activeTouchCount} Exposures</div>
          <span className="text-[10px] text-slate-500 font-medium">Over 45 Campaign Days</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Media Channels</span>
          <div className="text-lg font-black text-indigo-700">{uniqueChannelsCount} Platforms</div>
          <span className="text-[10px] text-slate-500 font-medium">Digital, WhatsApp &amp; Ground</span>
        </div>

        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Projected Impact</span>
          <div className="text-lg font-black text-emerald-700">+{conversionYieldPct}% Swing</div>
          <span className="text-[10px] font-bold text-emerald-600 font-mono">
            Decisive Persuasion Edge
          </span>
        </div>
      </div>

      {/* Channel Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-xs font-bold text-slate-500 mr-1">Filter Channel:</span>
          {['ALL', 'digital', 'dark_social', 'voice_ivr', 'ground_panna', 'community', 'gotv'].map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveChannelFilter(ch)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer capitalize ${
                activeChannelFilter === ch
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ch.replace('_', ' ')}
            </button>
          ))}
        </div>

        <button
          onClick={handleCopyMemo}
          className="text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {copiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedMemo ? 'Copied Outreach Brief!' : 'Copy Campaign Brief'}</span>
        </button>
      </div>

      {/* 10-Touch Timeline Cards */}
      <div className="space-y-3">
        {displayedSteps.map((step) => (
          <div
            key={step.id}
            className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs transition-all flex flex-col md:flex-row md:items-start justify-between gap-4"
          >
            {/* Step Left: Number + Days + Channel */}
            <div className="flex items-start gap-3.5 md:w-1/3 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-black text-xs text-indigo-700 shrink-0">
                #{step.id}
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900">{step.touchName}</span>
                </div>
                <div className="text-[11px] font-mono font-bold text-indigo-600">
                  {step.dayWindow}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 pt-1">
                  {getChannelIcon(step.channel)}
                  <span>{step.channelLabel}</span>
                </div>
              </div>
            </div>

            {/* Step Center: Objective & Creative Preview */}
            <div className="md:w-1/2 space-y-1.5">
              <div className="text-xs text-slate-700 font-medium">
                <span className="font-bold text-slate-900">Objective:</span> {step.objective}
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 text-[11.5px] text-slate-800 space-y-1">
                <div className="font-bold text-indigo-900 flex items-center gap-1">
                  <span>Telugu Script / Ad Hook:</span>
                </div>
                <p className="font-medium text-slate-700 leading-snug">"{step.sampleTeluguCopy}"</p>
              </div>
            </div>

            {/* Step Right: Channel & Frequency Tag */}
            <div className="md:w-1/5 shrink-0 flex md:flex-col items-center md:items-end justify-between text-right gap-1.5">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700">
                {step.channel.replace('_', ' ')}
              </span>
              <span className="text-[9.5px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {step.frequency}x Frequency
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
