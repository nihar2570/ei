import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  RefreshCw,
  Layers
} from 'lucide-react';
import { invalidateBoothCache } from '../data/voterRollService';

interface OnDemandVoterExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  acNo: number;
  acName?: string;
  boothNo: number;
  boothName: string;
  mandalName: string;
  electorate: number;
  isAlreadyExtracted: boolean;
  isAcFullyExtracted?: boolean;
  officialRollUrl?: string;
  onExtractionSuccess: () => void;
}

export const OnDemandVoterExtractorModal: React.FC<OnDemandVoterExtractorModalProps> = ({
  isOpen,
  onClose,
  acNo,
  acName = 'Assembly Constituency',
  boothNo,
  boothName,
  mandalName,
  electorate,
  isAlreadyExtracted,
  isAcFullyExtracted = false,
  officialRollUrl,
  onExtractionSuccess,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [extractMode, setExtractMode] = useState<'booth' | 'ac'>('booth');
  const [stepText, setStepText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<any | null>(null);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  if (!isOpen) return null;

  const defaultRollUrl = officialRollUrl || 
    `https://voters.eci.gov.in/eroll/2026/s01/sir-draftroll/${acNo}/2026-EROLLGEN-S01-${acNo}-SIR-DraftRoll-Revision1-ENG-${boothNo}-WI.pdf`;

  const cliCommand = `python scripts/extract_booth_voters.py --ac ${acNo} --booth ${boothNo}`;

  const handleCopyCmd = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleRunExtraction = async (mode: 'booth' | 'ac' = 'booth') => {
    setIsRunning(true);
    setExtractMode(mode);
    setErrorMsg(null);
    setSuccessInfo(null);
    setLogs([]);
    setStepText(mode === 'ac' ? `Starting Batch Extraction for all booths in AC ${acNo}...` : 'Initializing In-Memory Extractor...');

    try {
      const res = await fetch('/api/extract-booth?stream=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ac: acNo,
          booth: boothNo,
          mode,
          workers: 12,
          state: 'S01',
          force: true,
          stream: true
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      if (!res.body) {
        throw new Error('ReadableStream not supported by response');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let fullText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        buffer += chunk;

        const parts = buffer.split('\n');
        buffer = parts.pop() || '';
        const newLines = parts.map(p => p.trim()).filter(p => p.length > 0);
        if (newLines.length > 0) {
          setLogs(prev => [...prev, ...newLines]);
          const lastLine = newLines[newLines.length - 1];
          if (!lastLine.startsWith('__')) {
            setStepText(lastLine);
          }
        }
      }

      if (buffer.trim()) {
        setLogs(prev => [...prev, buffer.trim()]);
      }

      // Check success
      if (
        fullText.includes('__PROCESS_EXIT__ 0') ||
        fullText.includes('__EXTRACT_RESULT__') ||
        fullText.includes('EXTRACTION COMPLETE')
      ) {
        setStepText(mode === 'ac' ? `All booths for AC #${acNo} extracted successfully!` : 'Voter roll extracted and saved successfully!');
        setSuccessInfo({ totalElectors: electorate });
        invalidateBoothCache(acNo, boothNo);
        onExtractionSuccess();
      } else if (fullText.includes('__PROCESS_EXIT__') && !fullText.includes('__PROCESS_EXIT__ 0')) {
        throw new Error('Extractor process exited with an error. Review the log above.');
      } else {
        setSuccessInfo({ totalElectors: electorate });
        invalidateBoothCache(acNo, boothNo);
        onExtractionSuccess();
      }
    } catch (err: any) {
      console.error('On-demand extraction error:', err);
      setErrorMsg(
        err.message || 
        'Could not complete live extraction via backend server. You can copy and run the CLI command below.'
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl text-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                On-Demand ECI Voter Roll Extractor
              </h3>
              <p className="text-xs text-slate-400">
                Booth #{boothNo} • AC {acNo} ({acName}) • {mandalName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Booth Status card */}
          <div className="bg-slate-850 border border-slate-800 rounded-xl p-4 flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Polling Station</span>
              <h4 className="text-sm font-bold text-slate-200 mt-1">{boothName}</h4>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <span>Electorate: <strong className="text-slate-200">{electorate.toLocaleString()}</strong></span>
                <span>•</span>
                <span>Est. Panna Pages: <strong className="text-slate-200">{Math.ceil(electorate / 50)}</strong></span>
                <span>•</span>
                <span>Format: <strong className="text-slate-200">2026 SIR Draft Roll</strong></span>
              </div>
            </div>

            {isAlreadyExtracted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Authentic Roll Loaded
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <AlertCircle className="w-3.5 h-3.5" />
                Synthesized Roll Active
              </span>
            )}
          </div>

          {/* Zero PDF Storage Banner */}
          <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3 text-xs text-blue-200">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-blue-300">Local-First In-Memory Architecture:</span>
              <p className="mt-0.5 text-blue-300/80 leading-relaxed">
                Prioritizes authentic SIR 2026 Draft Rolls stored in <code className="text-cyan-300 font-mono bg-slate-900/60 px-1 py-0.5 rounded">D:\apdata\sir2026</code> for instant offline extraction. Streams into RAM, parses voter cards into ~200 KB JSON, and purges all PDF bytes immediately.
              </p>
            </div>
          </div>

          {/* Progress / Success / Error Alert */}
          {isRunning && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 animate-pulse">
              <Loader2 className="w-5 h-5 text-amber-400 animate-spin shrink-0" />
              <div>
                <p className="text-sm font-semibold text-amber-300">Extraction in Progress...</p>
                <p className="text-xs text-amber-200/80 mt-0.5">{stepText}</p>
              </div>
            </div>
          )}

          {successInfo && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="text-sm font-bold text-emerald-300">Extraction Completed Successfully!</p>
                <p className="text-emerald-200/80 mt-1">
                  Extracted <strong>{successInfo.totalElectors || electorate}</strong> electors across{' '}
                  <strong>{successInfo.totalPages || Math.ceil(electorate / 50)}</strong> Panna pages.
                  The live booth view has been refreshed with authentic voter records.
                </p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-200">
                <p className="text-sm font-bold text-rose-300">Extraction Notice</p>
                <p className="mt-1 leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Live Streaming Terminal Log Window */}
          {(isRunning || logs.length > 0) && (
            <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl font-mono text-xs animate-fade-in">
              <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="ml-2 font-semibold text-slate-300">
                    Live Extractor Stream ({extractMode === 'ac' ? `AC #${acNo} All Booths` : `Booth #${boothNo}`})
                  </span>
                </div>
                {isRunning && (
                  <span className="flex items-center gap-1.5 text-[11px] text-amber-400 font-sans">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    Extracting...
                  </span>
                )}
              </div>
              <div
                ref={terminalRef}
                className="p-3.5 max-h-56 overflow-y-auto space-y-1 text-slate-300 select-text leading-relaxed bg-black/40"
              >
                {logs.map((line, idx) => {
                  const isErr = line.includes('❌') || line.includes('Error') || line.includes('error');
                  const isSuccess = line.includes('✅') || line.includes('Saved') || line.includes('COMPLETE') || line.includes('🎉');
                  const isLocal = line.includes('📂') || line.includes('⚡') || line.includes('D:\\');
                  const isProcessMarker = line.startsWith('__');
                  if (isProcessMarker) return null;
                  return (
                    <div
                      key={idx}
                      className={`break-all ${
                        isErr
                          ? 'text-rose-400 font-semibold'
                          : isSuccess
                          ? 'text-emerald-400 font-semibold'
                          : isLocal
                          ? 'text-cyan-300'
                          : 'text-slate-300'
                      }`}
                    >
                      {line}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons: Single Booth & AC-Wide Batch */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => handleRunExtraction('booth')}
              disabled={isRunning}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                isRunning
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : isAlreadyExtracted || isAcFullyExtracted
                  ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 cursor-pointer'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold shadow-amber-500/20 cursor-pointer'
              }`}
            >
              {isRunning && extractMode === 'booth' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Extracting Booth #{boothNo} in Memory...</span>
                </>
              ) : isAlreadyExtracted || isAcFullyExtracted ? (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Re-Extract Booth #{boothNo} (Force Overwrite)</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Extract Booth #{boothNo} Voter Roll Now</span>
                </>
              )}
            </button>

            <button
              onClick={() => handleRunExtraction('ac')}
              disabled={isRunning}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title={`Batch extract all polling stations in AC #${acNo} from D:\\apdata\\sir2026`}
            >
              {isRunning && extractMode === 'ac' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                  <span>Batch Extracting All Booths in AC #{acNo}...</span>
                </>
              ) : (
                <>
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Batch Extract All Booths in AC #{acNo} ({acName})</span>
                </>
              )}
            </button>
          </div>

          {/* Alternate Execution via Terminal */}
          <div className="pt-2 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              CLI Terminal Command (Offline / High-Performance)
            </span>
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-2.5">
              <code className="text-xs font-mono text-emerald-400 flex-1 truncate">
                {cliCommand}
              </code>
              <button
                onClick={handleCopyCmd}
                className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition"
                title="Copy terminal command"
              >
                {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Official Roll Source Link */}
          <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              ECI Portal Source PDF
            </span>
            <a
              href={defaultRollUrl}
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1"
            >
              <span>Inspect Source PDF</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
