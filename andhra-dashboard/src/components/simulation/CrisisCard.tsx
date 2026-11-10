import React, { useState } from 'react';
import { Info, MapPin, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import type { CrisisConfig } from './crisisRegistry';

interface CrisisCardProps {
  config: CrisisConfig;
  value: number;
  onChange: (val: number) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const CrisisCard: React.FC<CrisisCardProps> = ({
  config,
  value,
  onChange,
  isExpanded: externalExpanded,
  onToggleExpand,
}) => {
  const [internalExpanded, setInternalExpanded] = useState<boolean>(false);
  const isExpanded = externalExpanded !== undefined ? externalExpanded : internalExpanded;

  const toggleExpand = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded((prev) => !prev);
    }
  };

  const Icon = config.icon;
  const status = config.statusFormatter(value);

  return (
    <div
      className={`bg-slate-950/90 rounded-xl border border-slate-800/90 ${
        value > 0 ? config.badgeBorderActive + ' ring-1 ring-rose-500/20' : config.hoverBorderClass
      } transition-all duration-200 p-3.5 space-y-2.5 shadow-sm hover:shadow-md`}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="p-1 rounded-md bg-slate-900 border border-slate-800 shrink-0">
            <Icon className={`w-3.5 h-3.5 ${config.iconColorClass}`} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-xs text-white truncate">{config.title}</span>
              <span
                className="text-[9px] px-1.5 py-0.2 rounded font-medium bg-slate-900 text-slate-400 border border-slate-800 shrink-0"
                title={`Category: ${config.categoryLabel}`}
              >
                {config.categoryLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span
            className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
              value > 0
                ? `${config.badgeBgActive} ${config.badgeTextActive} border ${config.badgeBorderActive}`
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            {value > 0
              ? `${config.key === 'tirupatiPrasadamControversy' ? '+' : '-'}${value}${config.unit}`
              : 'Off'}
          </span>

          <button
            type="button"
            onClick={toggleExpand}
            className="flex items-center gap-0.5 text-[10px] font-medium text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-800 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse card details' : 'Expand full description and calibrated metrics'}
            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
          >
            <span>{isExpanded ? 'Less' : 'Details'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Direct Interactive Range Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min={config.min}
          max={config.max}
          step={config.step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full ${config.accentClass} cursor-pointer h-1.5 bg-slate-800 rounded-lg`}
        />
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
          <span>0%</span>
          <span className="text-slate-400 font-bold">
            {value > 0 ? `${value}${config.unit}` : 'Baseline'}
          </span>
          <span>{config.max}%</span>
        </div>
      </div>

      {/* Dynamic One-Line Status */}
      <div className={`text-[11px] font-mono leading-tight ${status.colorClass} truncate`}>
        {status.text}
      </div>

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="pt-2 border-t border-slate-800/80 space-y-2.5 animate-fadeIn">
          {/* Description */}
          <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
            {config.description}
          </p>

          {/* 2-Column Data Box */}
          <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800/80 text-[11px]">
            {/* Column 1: Target Geography */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Target Geography</span>
              </div>
              <div className="text-[11px] font-semibold text-slate-200 leading-tight">
                {config.targetGeography.primary}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {config.targetGeography.details}
              </div>
            </div>

            {/* Column 2: Calibrated Electoral Impact */}
            <div className="space-y-0.5 border-l border-slate-800 pl-2">
              <div className="flex items-center gap-1 text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                <Zap className={`w-3 h-3 ${config.iconColorClass} shrink-0`} />
                <span>Calibrated Impact</span>
              </div>
              <div className={`text-[11px] font-semibold ${config.badgeTextActive} leading-tight font-mono`}>
                {config.calibratedImpact.primary}
              </div>
              <div className="text-[10px] text-slate-400 leading-tight">
                {config.calibratedImpact.details}
              </div>
            </div>
          </div>

          {/* Tick Details */}
          <div className="grid grid-cols-3 text-[9px] font-mono text-slate-400 text-center gap-1 pt-1">
            <span className="truncate bg-slate-900/50 p-1 rounded border border-slate-800/60">
              {config.tickLabels[0]}
            </span>
            <span className="truncate bg-slate-900/50 p-1 rounded border border-slate-800/60">
              {config.tickLabels[1]}
            </span>
            <span className="truncate bg-slate-900/50 p-1 rounded border border-slate-800/60">
              {config.tickLabels[2]}
            </span>
          </div>

          {/* Detailed Context Note */}
          <div className="flex items-start gap-1.5 text-[10px] text-slate-400 bg-slate-900/40 p-1.5 rounded border border-slate-800/40">
            <Info className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{config.tooltip}</span>
          </div>
        </div>
      )}
    </div>
  );
};
