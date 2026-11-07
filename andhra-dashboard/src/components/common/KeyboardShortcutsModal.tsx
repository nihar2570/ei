import React from 'react';
import { X, Command, Sparkles } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Ctrl + K / ⌘K', desc: 'Open Command Palette (instant AC & caste search)' },
    { key: '1', desc: 'Jump to 📊 Results & Map' },
    { key: '2', desc: 'Jump to 🔮 Simulations / Forecasts' },
    { key: '3', desc: 'Jump to 🎯 Playbook & Actions' },
    { key: '4', desc: 'Jump to 📢 Voter Reach (Targeting)' },
    { key: '5', desc: 'Jump to 📋 Voter Rolls & E-Panna' },
    { key: 'Z', desc: 'Toggle Fullscreen Presentation Mode' },
    { key: '?', desc: 'Open this Keyboard Shortcuts cheat sheet' },
    { key: 'Esc', desc: 'Close any active dialog, search or modal' },
  ];

  return (
    <div
      className="fixed inset-0 z-[3100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Command className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-black text-slate-900">Keyboard Shortcuts</h3>
              <p className="text-[11px] text-slate-500">Speed up your war room workflow</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {shortcuts.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
            >
              <span className="text-slate-600 font-medium">{s.desc}</span>
              <kbd className="px-2 py-1 bg-white border border-slate-200 rounded-md font-mono font-bold text-slate-800 shadow-2xs text-[11px]">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <span className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Press <kbd className="font-mono font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">?</kbd> anywhere to bring up this sheet
          </span>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
