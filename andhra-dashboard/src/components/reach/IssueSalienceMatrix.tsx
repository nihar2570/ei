import React, { useState } from 'react';
import type { IssueKey } from '../../types/voterReach';
import { ISSUES_METAS } from './voterReachData';
import { BarChart3, TrendingUp, CheckCircle, Copy, Check, MessageSquare } from 'lucide-react';

interface IssueSalienceMatrixProps {
  issueWeights: Record<IssueKey, number>;
  selectedIssue: IssueKey;
  onSelectIssue: (issue: IssueKey) => void;
  targetParty?: 'TDP' | 'YSRCP' | 'JSP';
}

export const IssueSalienceMatrix: React.FC<IssueSalienceMatrixProps> = ({
  issueWeights,
  selectedIssue,
  onSelectIssue,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const sortedIssues = (Object.keys(issueWeights) as IssueKey[]).sort(
    (a, b) => (issueWeights[b] || 0) - (issueWeights[a] || 0)
  );

  const activeMeta = ISSUES_METAS[selectedIssue] || ISSUES_METAS.jobs_fdi;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div id="reach-issues" className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-6 scroll-mt-24">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-amber-600" />
              Issue Salience &amp; Persuasion Impact Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Quantitative weight (%) of voter grievances for this specific demographic cross-section.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          Normalized Total: <strong className="text-slate-900 font-bold">100%</strong>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Ranked Impact Bars */}
        <div className="lg:col-span-7 space-y-3">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between mb-1">
            <span>Ranked Voter Grievances</span>
            <span>Impact Salience %</span>
          </div>

          <div className="space-y-2">
            {sortedIssues.map((key, idx) => {
              const meta = ISSUES_METAS[key];
              const pct = issueWeights[key] || 0;
              const isSelected = selectedIssue === key;

              return (
                <div
                  key={key}
                  onClick={() => onSelectIssue(key)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-mono text-slate-600 shrink-0">
                        #{idx + 1}
                      </span>
                      <span>{meta.icon}</span>
                      <span className={isSelected ? 'text-amber-950 font-black' : ''}>
                        {meta.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {meta.category}
                      </span>
                      <span className="font-mono font-black text-sm text-amber-700 min-w-[36px] text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* Impact Progress Bar */}
                  <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        idx === 0
                          ? 'bg-amber-500'
                          : idx === 1
                          ? 'bg-amber-400'
                          : idx === 2
                          ? 'bg-indigo-400'
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${Math.min(pct * 2.2, 100)}%` }}
                    />
                  </div>

                  {/* Partisan Edge Indicator */}
                  <div className="flex items-center justify-between text-[10.5px] text-slate-500 mt-2">
                    <span className="truncate max-w-[280px]">{meta.description}</span>
                    <span
                      className={`font-semibold shrink-0 ${
                        meta.tdpAdvantage > 0 ? 'text-emerald-600' : 'text-blue-600'
                      }`}
                    >
                      {meta.tdpAdvantage > 0
                        ? `+${meta.tdpAdvantage}% TDP Credibility Edge`
                        : `${meta.tdpAdvantage}% YSRCP Base`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 cols): Selected Issue Ad Angle Generator */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{activeMeta.icon}</span>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block">
                  Creative Angle &amp; Copy
                </span>
                <h3 className="text-sm font-black text-white">{activeMeta.shortLabel}</h3>
              </div>
            </div>
            <span className="text-xs font-mono font-bold bg-amber-400/20 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-400/30">
              {issueWeights[activeMeta.key]}% Salience
            </span>
          </div>

          {/* Telugu Ad Headline */}
          <div className="space-y-1.5 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                Telugu Ad Copy Headline (వాట్సాప్ &amp; వీడియో టైటిల్)
              </span>
              <button
                onClick={() => handleCopy(activeMeta.sampleTeluguHeadline, 'telugu_hl')}
                className="text-xs text-amber-300 hover:text-white flex items-center gap-1 cursor-pointer"
                title="Copy headline"
              >
                {copiedKey === 'telugu_hl' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'telugu_hl' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-sm font-bold text-amber-200 leading-snug">
              {activeMeta.sampleTeluguHeadline}
            </p>
            <p className="text-xs text-slate-300 mt-1">
              {activeMeta.sampleTeluguSubtext}
            </p>
          </div>

          {/* English Hook */}
          <div className="space-y-1.5 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                Digital Ad Angle (Strategist Hook)
              </span>
              <button
                onClick={() => handleCopy(activeMeta.sampleEnglishHook, 'eng_hook')}
                className="text-xs text-cyan-300 hover:text-white flex items-center gap-1 cursor-pointer"
                title="Copy pitch hook"
              >
                {copiedKey === 'eng_hook' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'eng_hook' ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              "{activeMeta.sampleEnglishHook}"
            </p>
          </div>

          {/* Strategic Delivery Guidance */}
          <div className="bg-indigo-900/40 border border-indigo-500/30 rounded-xl p-3 text-xs text-indigo-200 space-y-1">
            <span className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Strategist Rule of Thumb
            </span>
            <p className="text-[11px] text-indigo-200/90 leading-normal">
              In this cohort, <strong className="text-white">{activeMeta.shortLabel}</strong> drives over{' '}
              {issueWeights[activeMeta.key]}% of ballot decisions. Make this the hero visual in Touch #1, #2, and #4.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
