import React from 'react';
import {
  FileText,
  Printer,
  Share2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Command,
  Zap,
  Shield,
  CheckCircle2,
} from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

interface FloatingActionBarProps {
  onOpenBriefing?: () => void;
  onReset?: () => void;
  ndaSeats?: number;
  tdpSeats?: number;
  jspSeats?: number;
  bjpSeats?: number;
  ysrcpSeats?: number;
  incSeats?: number;
}

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  onOpenBriefing,
  onReset,
  ndaSeats = 164,
  tdpSeats = 135,
  jspSeats = 21,
  bjpSeats = 8,
  ysrcpSeats = 11,
  incSeats = 0,
}) => {
  const { isZenMode, toggleZenMode, showToast, setIsShortcutsOpen, setIsCommandPaletteOpen } = useDashboard();

  const supermajorityBuffer = ndaSeats - 88;
  const isSupermajority = ndaSeats >= 88;

  const handleShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('🔗 Live scenario URL copied to clipboard!');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMemo = () => {
    if (typeof window === 'undefined') return;

    const dateStr = new Date().toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const memoText = `🏛️ *AP ELECTION INTELLIGENCE // NDA ALLIANCE WAR ROOM BRIEFING*
📅 *Date:* ${dateStr}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 *GOVERNING COALITION SEAT STANDING:*
• *Combined NDA Alliance:* ${ndaSeats} / 175 Seats (${isSupermajority ? `+${supermajorityBuffer} Supermajority Buffer` : `-${88 - ndaSeats} Deficit`})
• *TDP:* ${tdpSeats} Seats
• *Janasena (JSP):* ${jspSeats} Seats (100% Strike Rate)
• *BJP:* ${bjpSeats} Seats
• *Opposition (YSRCP):* ${ysrcpSeats} Seats | *INC:* ${incSeats} Seats

🎯 *CORE STRATEGIC DIRECTIVES:*
1. *Kapu-Balija + BC Coalition Anchor:* Sustain delta harmony across East/West Godavari & Krishna.
2. *Super Six Welfare Delivery:* Accelerate saturation across all 175 assembly segments.
3. *175-Seat Sweep Blueprint:* Concentrate tactical resources on flipping the remaining ${ysrcpSeats} YSRCP seats.

🔗 *Live Dashboard & Simulation:* ${window.location.origin}`;

    navigator.clipboard.writeText(memoText);
    showToast('📋 Copied NDA Strategy Memo to clipboard!');
  };

  return (
    <div
      aria-label="NDA Alliance strategic floating briefing HUD"
      className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-[1150] flex items-center gap-1 sm:gap-2 bg-slate-950/95 backdrop-blur-xl text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl border border-amber-500/40 shadow-2xl shadow-amber-950/40 animate-in fade-in slide-in-from-bottom-3 duration-200 print:hidden max-w-[96vw] overflow-x-auto scrollbar-none"
    >
      {/* NDA Alliance Live Strategic Tally HUD */}
      <div className="flex items-center gap-1.5 sm:gap-2 pr-1 shrink-0">
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <Shield className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20 shrink-0" />
          <div className="flex items-baseline gap-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-300 hidden xs:inline">
              NDA
            </span>
            <span className="text-sm font-black text-amber-400 font-mono">
              {ndaSeats}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              /175
            </span>
          </div>

          {/* Supermajority buffer pill */}
          <span
            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5 font-mono ${
              isSupermajority
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            {isSupermajority ? (
              <>
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                <span>+{supermajorityBuffer}</span>
              </>
            ) : (
              <span>-{88 - ndaSeats}</span>
            )}
          </span>
        </div>

        {/* Breakdown chips (TDP / JSP / BJP) */}
        <div className="hidden lg:flex items-center gap-1 text-[10px] font-mono text-slate-300">
          <span className="px-1.5 py-0.5 rounded-md bg-yellow-500/15 text-yellow-300 border border-yellow-500/30 font-semibold" title="Telugu Desam Party">
            TDP {tdpSeats}
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 font-semibold" title="Janasena Party">
            JSP {jspSeats}
          </span>
          <span className="px-1.5 py-0.5 rounded-md bg-orange-500/15 text-orange-300 border border-orange-500/30 font-semibold" title="Bharatiya Janata Party">
            BJP {bjpSeats}
          </span>
        </div>
      </div>

      <div className="w-[1px] h-4 sm:h-5 bg-slate-800 shrink-0" />

      {/* NDA Executive Briefing Trigger Button */}
      {onOpenBriefing && (
        <button
          onClick={onOpenBriefing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition-all shadow-md shadow-amber-500/25 cursor-pointer shrink-0 active:scale-95"
          title="Open NDA Alliance Supermajority Strategy Briefing"
        >
          <FileText className="w-3.5 h-3.5 text-slate-950" />
          <span className="tracking-wide">NDA Briefing</span>
        </button>
      )}

      {/* Quick 1-Click WhatsApp/Signal Memo Generator */}
      <button
        onClick={handleCopyMemo}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs font-semibold transition-colors cursor-pointer shrink-0"
        title="Copy 1-Click NDA War Room WhatsApp Memo"
      >
        <Zap className="w-3.5 h-3.5 text-amber-400" />
        <span className="hidden md:inline">Copy Memo</span>
      </button>

      <div className="w-[1px] h-4 sm:h-5 bg-slate-800 shrink-0 hidden sm:block" />

      {/* Quick Command Palette trigger */}
      <button
        onClick={() => setIsCommandPaletteOpen(true)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-all cursor-pointer shrink-0"
        title="Quick Command Search (Ctrl + K)"
      >
        <Command className="w-3.5 h-3.5 text-indigo-400" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="text-[10px] font-mono bg-slate-800 px-1 py-0.2 rounded hidden sm:inline text-slate-400">⌘K</kbd>
      </button>

      {/* Share scenario URL */}
      <button
        onClick={handleShareLink}
        className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer shrink-0"
        title="Copy Shareable Scenario Link"
      >
        <Share2 className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden xl:inline ml-1">Share</span>
      </button>

      {/* Print Dossier */}
      <button
        onClick={handlePrint}
        className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer shrink-0"
        title="Print or Save PDF"
      >
        <Printer className="w-3.5 h-3.5 text-sky-400" />
        <span className="hidden xl:inline ml-1">Print</span>
      </button>

      {/* Fullscreen Zen Mode */}
      <button
        onClick={toggleZenMode}
        className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
        title={isZenMode ? 'Exit Fullscreen' : 'Fullscreen War Room Mode (Z)'}
      >
        {isZenMode ? <Minimize2 className="w-3.5 h-3.5 text-amber-400" /> : <Maximize2 className="w-3.5 h-3.5 text-amber-400" />}
      </button>

      {/* Reset simulations to baseline */}
      {onReset && (
        <button
          onClick={onReset}
          className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
          title="Reset to 2024 Actual Mandate Baseline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Keyboard Shortcuts Sheet trigger */}
      <button
        onClick={() => setIsShortcutsOpen(true)}
        className="w-6 h-6 sm:w-7 sm:h-7 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs font-mono font-bold transition-colors cursor-pointer shrink-0"
        title="Keyboard Shortcuts Cheat Sheet (?)"
      >
        ?
      </button>
    </div>
  );
};

export default FloatingActionBar;
