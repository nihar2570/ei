import React from 'react';
import { Layers } from 'lucide-react';
import type { ElectorRecord } from '../../data/voterRollService';
import type { CastePrediction } from '../../data/casteClassifierService';

interface PannaPramukhSheetProps {
  pannaGroups: Array<{ pageNum: number; members: ElectorRecord[] }>;
  voterTags: Record<string, ElectorRecord['triageTag']>;
  casteMap: Map<string, CastePrediction>;
}

export const PannaPramukhSheet: React.FC<PannaPramukhSheetProps> = ({
  pannaGroups,
  voterTags,
  casteMap,
}) => {
  return (
    <div className="space-y-3">
      {pannaGroups.map((group) => (
        <div
          key={group.pageNum}
          className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden"
        >
          <div className="px-3.5 py-2 bg-gradient-to-r from-emerald-950 to-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-xs font-mono">
                Panna Page #{group.pageNum}
              </span>
              <span className="text-[11px] text-slate-300">
                ({group.members.length} Electors)
              </span>
            </div>
            <span className="text-[11px] font-mono text-emerald-300">
              Sl #{group.members[0]?.slNo} – #{group.members[group.members.length - 1]?.slNo}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2.5">
            {group.members.map((e) => {
              const tag = voterTags[e.epic] || e.triageTag;
              const pred = casteMap.get(e.epic);
              return (
                <div
                  key={e.epic}
                  className="p-2 rounded-lg border border-slate-200 bg-slate-50/60 text-xs space-y-1"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[9px] text-slate-400 block">
                        Sl #{e.slNo} &middot; {e.epic}
                      </span>
                      <div className="font-bold text-slate-900 text-xs">
                        {e.name === 'Data to be added' ? (
                          <span className="text-slate-400 font-mono italic font-normal text-[11px]">
                            Data to be added
                          </span>
                        ) : (
                          e.name
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                        tag === 'committed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tag === 'swing'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tag.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {e.relativeName === 'Data to be added' ? (
                      <span className="text-slate-400 font-mono italic">Data to be added</span>
                    ) : (
                      `${e.relationType}/o ${e.relativeName}`
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                    <span>
                      Door:{' '}
                      {e.houseNo === 'Data to be added' ? (
                        <span className="text-slate-400 font-mono italic font-normal">
                          Data to be added
                        </span>
                      ) : (
                        <strong>{e.houseNo}</strong>
                      )}
                    </span>
                    {pred ? (
                      <span
                        className={`px-1 py-0.2 rounded font-bold text-[9px] border ${pred.color.badge}`}
                        title={pred.sourceBasis}
                      >
                        {pred.casteName} ({pred.probabilityPercent})
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono text-[9px] italic">
                        Data to be added
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
