import React, { useState, useMemo } from 'react';
import {
  Layers,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  UserX,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { ElectorRecord } from '../../data/voterRollService';
import type { CastePrediction } from '../../data/casteClassifierService';

interface PannaPramukhSheetProps {
  pannaGroups: Array<{ pageNum: number; members: ElectorRecord[] }>;
  voterTags: Record<string, ElectorRecord['triageTag']>;
  casteMap: Map<string, CastePrediction>;
}

export type AuditDisposition = 'VERIFIED' | 'UNREACHABLE' | 'GHOST_FLAGGED';

export const PannaPramukhSheet: React.FC<PannaPramukhSheetProps> = ({
  pannaGroups,
  voterTags,
  casteMap,
}) => {
  const [isAuditMode, setIsAuditMode] = useState<boolean>(false);
  const [activeAuditingElector, setActiveAuditingElector] = useState<ElectorRecord | null>(null);
  const [auditDispositions, setAuditDispositions] = useState<Record<string, AuditDisposition>>({});

  // Deterministically select 10% sample electors (roughly 2-3 per 30-voter page)
  const auditSampleEpics = useMemo(() => {
    const sampleSet = new Set<string>();
    pannaGroups.forEach((g) => {
      if (g.members.length === 0) return;
      // Pick indices 2, 12, 24 if available
      [2, 12, 24].forEach((idx) => {
        if (g.members[idx]) sampleSet.add(g.members[idx].epic);
      });
      // Ensure at least 1 sample per page
      if (g.members[0] && !sampleSet.has(g.members[0].epic) && sampleSet.size === 0) {
        sampleSet.add(g.members[0].epic);
      }
    });
    return sampleSet;
  }, [pannaGroups]);

  // Overall audit statistics
  const auditStats = useMemo(() => {
    const totalSampled = auditSampleEpics.size;
    let verifiedCount = 0;
    let unreachableCount = 0;
    let ghostCount = 0;

    auditSampleEpics.forEach((epic) => {
      const disp = auditDispositions[epic];
      if (disp === 'VERIFIED') verifiedCount++;
      else if (disp === 'UNREACHABLE') unreachableCount++;
      else if (disp === 'GHOST_FLAGGED') ghostCount++;
    });

    const auditedSoFar = verifiedCount + unreachableCount + ghostCount;
    const genuineRate = auditedSoFar > 0 ? Math.round((verifiedCount / auditedSoFar) * 100) : 100;
    const ghostRate = auditedSoFar > 0 ? Math.round((ghostCount / auditedSoFar) * 100) : 0;

    return {
      totalSampled,
      auditedSoFar,
      verifiedCount,
      unreachableCount,
      ghostCount,
      genuineRate,
      ghostRate,
      hasSevereAnomaly: ghostCount >= 2 || ghostRate >= 25,
    };
  }, [auditSampleEpics, auditDispositions]);

  const handleSetDisposition = (epic: string, disp: AuditDisposition) => {
    setAuditDispositions((prev) => ({ ...prev, [epic]: disp }));
    setActiveAuditingElector(null);
  };

  const handleResetAudit = () => {
    setAuditDispositions({});
  };

  return (
    <div className="space-y-3">
      {/* War Room Cadre Audit Control Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl border border-slate-800 p-3.5 shadow-md space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <PhoneCall className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-black text-xs sm:text-sm tracking-tight">
                  Central War Room Cadre Audit &amp; Ghost Worker Detection
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Prashant Kishor Protocol
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Random 10% telephonic verification sample to verify booth karyakartas actually visited households.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAuditMode(!isAuditMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                isAuditMode
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{isAuditMode ? 'Exit Audit Mode' : 'Start 10% Tele-Audit'}</span>
            </button>

            {auditStats.auditedSoFar > 0 && (
              <button
                type="button"
                onClick={handleResetAudit}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Reset Audit Sample"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Audit Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 text-[10px] block uppercase">Sample Size</span>
            <span className="text-white font-black text-sm">
              {auditStats.auditedSoFar} / {auditStats.totalSampled} Electors
            </span>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <span className="text-emerald-400 text-[10px] block uppercase">Verified Genuine</span>
            <span className="text-emerald-300 font-black text-sm">
              {auditStats.verifiedCount} ({auditStats.genuineRate}%)
            </span>
          </div>

          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <span className="text-amber-400 text-[10px] block uppercase">Unreachable / Out</span>
            <span className="text-amber-300 font-black text-sm">
              {auditStats.unreachableCount}
            </span>
          </div>

          <div
            className={`p-2 rounded-lg border ${
              auditStats.ghostCount > 0
                ? 'bg-rose-950/80 border-rose-600/70 text-rose-200 animate-pulse'
                : 'bg-slate-950/60 border-slate-800 text-slate-300'
            }`}
          >
            <span className="text-rose-400 text-[10px] block uppercase font-bold">
              Ghost Worker Flag
            </span>
            <span className="font-black text-sm text-rose-300">
              {auditStats.ghostCount} ({auditStats.ghostRate}%)
            </span>
          </div>
        </div>

        {auditStats.hasSevereAnomaly && (
          <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/80 text-rose-200 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>HIGH ANOMALY DETECTED:</strong> Multiple electors denied being contacted by the Panna Pramukh. Field supervisor must audit this polling station immediately.
            </span>
          </div>
        )}
      </div>

      {/* Interactive Tele-Audit Dialing Dialog (Overlay) */}
      {activeAuditingElector && (
        <div className="p-4 rounded-xl border-2 border-amber-400 bg-amber-50/95 shadow-xl space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500 text-white">
                <PhoneCall className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase text-amber-800 tracking-wider">
                  Active War-Room Verification Call
                </span>
                <h4 className="text-sm font-black text-slate-900">
                  {activeAuditingElector.name} &middot; Sl #{activeAuditingElector.slNo} (Door: {activeAuditingElector.houseNo})
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveAuditingElector(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded-md bg-white border border-slate-300 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="p-3 rounded-lg bg-white border border-amber-200 text-xs space-y-1.5 font-sans text-slate-800">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Standard Verification Script (Telugu / English):</span>
            </div>
            <p className="italic bg-amber-50/60 p-2 rounded border border-amber-100 text-slate-800 text-[11px] leading-relaxed">
              &quot;నమస్కారం అండి, {activeAuditingElector.name} గారేనా? మేము పార్టీ సెంట్రల్ వార్ రూమ్ నుండి మాట్లాడుతున్నాము. మా బూత్ కార్యకర్త మీ ఇంటికి వచ్చి ఓటరు స్లిప్పు ఇచ్చి మాట్లాడారా?&quot;<br />
              <span className="text-slate-500 not-italic text-[10px]">
                (Namaskaram, is this {activeAuditingElector.name}? Calling from the central election war room. Did our booth karyakarta visit your doorstep recently?)
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleSetDisposition(activeAuditingElector.epic, 'VERIFIED')}
              className="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>✓ Confirmed In-Person Visit (Genuine)</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetDisposition(activeAuditingElector.epic, 'UNREACHABLE')}
              className="flex-1 py-2 px-3 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>⚠️ Switched Off / Out of Town</span>
            </button>

            <button
              type="button"
              onClick={() => handleSetDisposition(activeAuditingElector.epic, 'GHOST_FLAGGED')}
              className="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>🚨 Elector Denied Contact (Fake / Ghost)</span>
            </button>
          </div>
        </div>
      )}

      {/* Panna Page Groups */}
      {pannaGroups.map((group) => {
        // Calculate page-level audit status
        const pageSampleMembers = group.members.filter((m) => auditSampleEpics.has(m.epic));
        const pageGhostCount = pageSampleMembers.filter(
          (m) => auditDispositions[m.epic] === 'GHOST_FLAGGED'
        ).length;
        const pageVerifiedCount = pageSampleMembers.filter(
          (m) => auditDispositions[m.epic] === 'VERIFIED'
        ).length;

        return (
          <div
            key={group.pageNum}
            className={`bg-white rounded-xl border shadow-2xs overflow-hidden transition-all ${
              pageGhostCount > 0
                ? 'border-rose-400 ring-1 ring-rose-300'
                : 'border-slate-200'
            }`}
          >
            <div className="px-3.5 py-2 bg-gradient-to-r from-emerald-950 to-slate-900 text-white flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs font-mono">
                  Panna Page #{group.pageNum}
                </span>
                <span className="text-[11px] text-slate-300">
                  ({group.members.length} Electors)
                </span>
                {pageGhostCount > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-rose-500 text-white font-black animate-pulse flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>Ghost Worker Anomaly</span>
                  </span>
                )}
                {pageVerifiedCount > 0 && pageGhostCount === 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-500/30 text-emerald-300 font-bold">
                    ✓ {pageVerifiedCount} Verified Genuine
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-emerald-300">
                  Sl #{group.members[0]?.slNo} – #{group.members[group.members.length - 1]?.slNo}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2.5">
              {group.members.map((e) => {
                const tag = voterTags[e.epic] || e.triageTag;
                const pred = casteMap.get(e.epic);
                const isSampleElector = auditSampleEpics.has(e.epic);
                const auditDisp = auditDispositions[e.epic];

                return (
                  <div
                    key={e.epic}
                    className={`p-2 rounded-lg border text-xs space-y-1 transition-all ${
                      auditDisp === 'GHOST_FLAGGED'
                        ? 'border-rose-400 bg-rose-50/80 ring-1 ring-rose-300'
                        : auditDisp === 'VERIFIED'
                        ? 'border-emerald-400 bg-emerald-50/80'
                        : isSampleElector && isAuditMode
                        ? 'border-amber-400 bg-amber-50/70 ring-1 ring-amber-300 shadow-2xs'
                        : 'border-slate-200 bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-[9px] text-slate-400 block">
                            Sl #{e.slNo} &middot; {e.epic}
                          </span>
                          {isSampleElector && (
                            <span className="text-[8px] font-mono font-black px-1.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                              10% AUDIT
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-slate-900 text-xs mt-0.5">
                          {e.name === 'Data to be added' ? (
                            <span className="text-slate-400 font-mono italic font-normal text-[11px]">
                              Data to be added
                            </span>
                          ) : (
                            e.name
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-1">
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

                        {auditDisp && (
                          <span
                            className={`text-[8px] font-mono font-black px-1 rounded ${
                              auditDisp === 'VERIFIED'
                                ? 'bg-emerald-200 text-emerald-900'
                                : auditDisp === 'GHOST_FLAGGED'
                                ? 'bg-rose-200 text-rose-900 font-extrabold'
                                : 'bg-slate-200 text-slate-800'
                            }`}
                          >
                            {auditDisp}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center justify-between gap-2">
                      <span className="truncate">
                        {e.relativeName === 'Data to be added' ? (
                          <span className="text-slate-400 font-mono italic">Data to be added</span>
                        ) : (
                          `${e.relationType}/o ${e.relativeName}`
                        )}
                      </span>
                      {e.name !== 'Data to be added' && e.age >= 18 && (
                        <span className="font-mono text-[9px] font-bold text-slate-600 shrink-0">
                          {e.age}y · {e.gender}
                        </span>
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

                    {/* Interactive Tele-Audit Trigger Button */}
                    {(isAuditMode || isSampleElector) && (
                      <div className="pt-1 border-t border-slate-200 flex items-center justify-between">
                        <span className="text-[9px] font-mono text-slate-500">
                          {auditDisp ? 'Audit Logged' : 'Audit Pending'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveAuditingElector(e)}
                          className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <PhoneCall className="w-2.5 h-2.5 text-indigo-600" />
                          <span>{auditDisp ? 'Re-Audit' : 'Call & Verify 📞'}</span>
                        </button>
                      </div>
                    )}
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
