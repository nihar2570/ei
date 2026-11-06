import React from 'react';
import { Info, MapPin, Zap } from 'lucide-react';
import type { CrisisConfig } from './crisisRegistry';

interface CrisisCardProps {
  config: CrisisConfig;
  value: number;
  onChange: (val: number) => void;
}

export const CrisisCard: React.FC<CrisisCardProps> = ({ config, value, onChange }) => {
  const Icon = config.icon;
  const status = config.statusFormatter(value);

  return (
    <div
      className={`bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 ${config.hoverBorderClass} transition-colors space-y-2.5`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className={`w-4 h-4 ${config.iconColorClass} shrink-0`} />
          <span className="font-bold text-xs text-white">{config.title}</span>
          <span title={config.tooltip}>
            <Info className={`w-3.5 h-3.5 text-slate-400 hover:${config.iconColorClass} cursor-help transition-colors shrink-0`} />
          </span>
        </div>
        <span
          className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
            value > 0
              ? `${config.badgeBgActive} ${config.badgeTextActive} border ${config.badgeBorderActive}`
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {value > 0
            ? `${config.key === 'tirupatiPrasadamControversy' ? '+' : '-'}${value}${config.unit}`
            : 'Off'}
        </span>
      </div>

      {/* Description */}
      <p className="text-[11px] text-slate-400 leading-snug">{config.description}</p>

      {/* 2-Column Data Box */}
      <div className="grid grid-cols-2 gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px]">
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

      {/* Slider Input */}
      <input
        type="range"
        min={config.min}
        max={config.max}
        step={config.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${config.accentClass} cursor-pointer`}
      />

      {/* Tick Labels */}
      <div className="flex justify-between text-[10px] font-mono text-slate-500">
        <span>{config.tickLabels[0]}</span>
        <span>{config.tickLabels[1]}</span>
        <span>{config.tickLabels[2]}</span>
      </div>

      {/* Status Footer */}
      <div className={`pt-2 border-t border-slate-900 text-[10px] font-mono ${status.colorClass}`}>
        {status.text}
      </div>
    </div>
  );
};
