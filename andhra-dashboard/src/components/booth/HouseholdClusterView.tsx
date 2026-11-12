import React from 'react';
import { Home } from 'lucide-react';
import type { ElectorRecord } from '../../data/voterRollService';
import { predictHouseholdCaste, type CastePrediction } from '../../data/casteClassifierService';

interface HouseholdClusterViewProps {
  householdGroups: Array<{ houseNo: string; section: string; members: ElectorRecord[] }>;
  dominantCaste?: string;
  casteMap: Map<string, CastePrediction>;
}

export const HouseholdClusterView: React.FC<HouseholdClusterViewProps> = ({
  householdGroups,
  dominantCaste,
  casteMap,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
      {householdGroups.map((h) => {
        const hCaste = predictHouseholdCaste(h.members, dominantCaste);
        return (
          <div
            key={h.houseNo}
            className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-mono font-bold text-xs text-slate-900">
                  Door #{h.houseNo}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${hCaste.color.badge}`}
                >
                  {hCaste.casteName} · {hCaste.probabilityPercent}
                </span>
                <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded-full">
                  {h.members.length}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              {h.members.map((m) => {
                const pred = casteMap.get(m.epic);
                return (
                  <div
                    key={m.epic}
                    className="flex items-center justify-between text-xs py-0.5 px-1 rounded bg-slate-50"
                  >
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-slate-800 text-[11px]">
                        {m.name === 'Data to be added' ? (
                          <span className="text-slate-400 font-mono italic font-normal">
                            Data to be added
                          </span>
                        ) : (
                          m.name
                        )}
                      </span>
                      {pred && (
                        <span
                          className={`text-[8px] px-1 rounded font-medium border ${pred.color.badge}`}
                        >
                          {pred.casteName}
                        </span>
                      )}
                    </div>
                    <span className="font-mono text-[9px] text-slate-500">
                      ({m.gender}) &middot;{' '}
                      {m.name !== 'Data to be added' && m.age >= 18 ? (
                        <span className="font-semibold text-slate-700">{m.age}y</span>
                      ) : (
                        <span className="text-slate-400 italic">Data to be added</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
