import React from 'react';
import { Sliders, History } from 'lucide-react';
import type { PartySwing } from '../SwingStudioModal';

interface CasteBlocsTabProps {
  swings: Record<string, PartySwing>;
  setSwings: React.Dispatch<React.SetStateAction<Record<string, PartySwing>>>;
  onOpenDemographicStudio?: () => void;
  activeCustomizedCount?: number;
  isHistorical: boolean;
  activePreset: string;
}

export const CasteBlocsTab: React.FC<CasteBlocsTabProps> = ({
  swings,
  setSwings,
  onOpenDemographicStudio,
  activeCustomizedCount = 0,
  isHistorical,
  activePreset,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Demographic Studio Launcher Ribbon */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-amber-950/70 p-4 rounded-xl border border-indigo-700/50 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              <Sliders className="w-4 h-4 text-indigo-300" />
            </span>
            <span className="font-bold text-xs text-white uppercase tracking-wider font-mono">
              Demographics &amp; Community Swings Engine
            </span>
            {activeCustomizedCount > 0 && (
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono font-bold">
                {activeCustomizedCount} Cohorts Customized
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Model demographic voting swings across all 18 Andhra Pradesh community and age cohorts (Kapu/Balija, Kamma, Reddy, BC Turpu Kapu, BC Yadava, Kuruba/Boya, Settibalija, SC Madiga, SC Mala, ST Tribals, Muslim Minorities, Youth 18-25).
          </p>
        </div>

        {onOpenDemographicStudio && (
          <button
            onClick={onOpenDemographicStudio}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 border border-indigo-400/30 group shrink-0"
          >
            <span>Configure Full Demographic Studio</span>
            <span className="group-hover:translate-x-0.5 transition-transform font-bold">↗</span>
          </button>
        )}
      </div>

      {/* Historical Mandate Notification Ribbon */}
      {isHistorical && (
        <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-amber-200 text-xs">
          <div className="flex items-center gap-2.5">
            <History className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Official Historical Results Active:</strong> Displaying certified ECI returns for{' '}
              <span className="font-bold underline decoration-amber-400">
                {activePreset === 'ysrcp_2019_wave'
                  ? '2019 (151 YSRCP Seats)'
                  : activePreset === 'bifurcation_2014'
                  ? '2014 (106 NDA / 67 YSRCP / 2 OTH)'
                  : '2024 (164 NDA / 11 YSRCP)'}
              </span>
              . Caste demographic swing sliders are set to 0.0% baseline (historical mandate).
            </span>
          </div>
          <span className="text-[10px] font-mono bg-amber-900/60 text-amber-300 px-2 py-0.5 rounded border border-amber-700/50 font-bold shrink-0">
            ECI Certified
          </span>
        </div>
      )}

      {/* Quick Sliders for Key Decisive Kingmaker Blocs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
          <span>Quick-Tune Decisive Kingmaker Blocs:</span>
          <span className="text-[11px] text-slate-500">Fine-tune shifts below or use the Studio above</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Caste 1: Kapu / Balija / Telaga */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-300">Kapu / Balija (22% AP)</span>
              <span className="font-mono text-[11px] text-rose-400 font-bold">
                {(swings.kapu?.JSP || 0) >= 0 ? `+${swings.kapu?.JSP || 0}%` : `${swings.kapu?.JSP}%`}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Pawan Kalyan / Janasena alliance wave in Godavari &amp; Rayalaseema</p>
            <input
              type="range"
              min="-15"
              max="15"
              step="1"
              value={swings.kapu?.JSP || 0}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSwings((prev) => ({
                  ...prev,
                  kapu: { TDP: Math.round(v * 0.5), YSRCP: -v, JSP: v },
                }));
              }}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          {/* Caste 2: Kamma */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-yellow-300">Kamma (10% AP)</span>
              <span className="font-mono text-[11px] text-yellow-400 font-bold">
                {(swings.kamma?.TDP || 0) >= 0 ? `+${swings.kamma?.TDP || 0}%` : `${swings.kamma?.TDP}%`}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Amaravati core, Krishna, Guntur &amp; NRI financial backing</p>
            <input
              type="range"
              min="-15"
              max="15"
              step="1"
              value={swings.kamma?.TDP || 0}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSwings((prev) => ({
                  ...prev,
                  kamma: { TDP: v, YSRCP: -v, JSP: 0 },
                }));
              }}
              className="w-full accent-yellow-500 cursor-pointer"
            />
          </div>

          {/* Caste 3: Reddy */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-sky-300">Reddy (12% AP)</span>
              <span className="font-mono text-[11px] text-sky-400 font-bold">
                {(swings.reddy?.YSRCP || 0) >= 0 ? `+${swings.reddy?.YSRCP || 0}%` : `${swings.reddy?.YSRCP}%`}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Rayalaseema fortresses &amp; traditional YSR family loyalty</p>
            <input
              type="range"
              min="-15"
              max="15"
              step="1"
              value={swings.reddy?.YSRCP || 0}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSwings((prev) => ({
                  ...prev,
                  reddy: { TDP: -v, YSRCP: v, JSP: 0 },
                }));
              }}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          {/* Caste 4: BC Turpu Kapu */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-300">BC Turpu Kapu</span>
              <span className="font-mono text-[11px] text-indigo-400 font-bold">
                {(swings.bc_turpu_kapu?.TDP || 0) >= 0 ? `+${swings.bc_turpu_kapu?.TDP || 0}%` : `${swings.bc_turpu_kapu?.TDP}%`}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Decisive in Srikakulam &amp; Vizianagaram northern belt</p>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={swings.bc_turpu_kapu?.TDP || 0}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSwings((prev) => ({
                  ...prev,
                  bc_turpu_kapu: { TDP: v, YSRCP: -v, JSP: 0 },
                }));
              }}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Caste 5: BC Yadava & Kuruba/Boya */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-300">BC Yadava &amp; Kuruba</span>
              <span className="font-mono text-[11px] text-emerald-400 font-bold">
                {(swings.bc_yadava?.TDP || 0) >= 0 ? `+${swings.bc_yadava?.TDP || 0}%` : `${swings.bc_yadava?.TDP}%`}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Prakasam, Nellore, Anantapur &amp; Kurnool agrarian BCs</p>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={swings.bc_yadava?.TDP || 0}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSwings((prev) => ({
                  ...prev,
                  bc_yadava: { TDP: v, YSRCP: -v, JSP: 0 },
                }));
              }}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Caste 6: Youth 18-25 */}
          <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300">Youth (18-25)</span>
              <span className="font-mono text-[11px] text-amber-400 font-bold">
                {(swings.youth_18_25?.JSP || 0) >= 0 ? `+${swings.youth_18_25?.JSP || 0}%` : `${swings.youth_18_25?.JSP}%`}
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Mega star fandom, job DSC notifications &amp; anti-incumbency</p>
            <input
              type="range"
              min="-10"
              max="10"
              step="1"
              value={swings.youth_18_25?.JSP || 0}
              onChange={(e) => {
                const v = Number(e.target.value);
                setSwings((prev) => ({
                  ...prev,
                  youth_18_25: { TDP: Math.round(v * 0.4), YSRCP: -v, JSP: Math.round(v * 0.6) },
                }));
              }}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
