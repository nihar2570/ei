import React, { useState, useEffect } from 'react';
import {
  X,
  BarChart3,
  Sparkles,
  Target,
  FileText,
  HelpCircle,
  Check,
  Type,
  Compass,
  Users,
  Award,
  Layers,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FontFamilyOption {
  key: string;
  name: string;
  fontValue: string;
  badge: string;
  description: string;
}

export const FONT_FAMILY_OPTIONS: FontFamilyOption[] = [
  {
    key: 'google_sans',
    name: 'Google Sans',
    fontValue: "'Google Sans', 'Google Sans Text', 'Inter', system-ui, sans-serif",
    badge: 'Recommended',
    description: 'Clean, modern geometric proportions designed for digital reading and dashboards',
  },
  {
    key: 'inter',
    name: 'Inter',
    fontValue: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    badge: 'High Precision',
    description: 'Silicon Valley tech standard with tall x-height and exceptional micro-typography',
  },
  {
    key: 'plus_jakarta',
    name: 'Plus Jakarta Sans',
    fontValue: "'Plus Jakarta Sans', system-ui, sans-serif",
    badge: 'Executive',
    description: 'Sophisticated contemporary typography, optimal for briefings & presentations',
  },
  {
    key: 'outfit',
    name: 'Outfit',
    fontValue: "'Outfit', system-ui, sans-serif",
    badge: 'Modern Display',
    description: 'Bold, distinctive letterforms crafted for high-contrast viewing at a distance',
  },
  {
    key: 'roboto',
    name: 'Roboto',
    fontValue: "'Roboto', 'Segoe UI', Arial, sans-serif",
    badge: 'Universal',
    description: 'Classic Google neo-grotesque, universally balanced and readable across all screens',
  },
  {
    key: 'jetbrains_mono',
    name: 'JetBrains Mono',
    fontValue: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    badge: 'Terminal / Quant',
    description: 'Developer & quant terminal monospace font for tabular numerical and data density',
  },
  {
    key: 'system_native',
    name: 'System Native',
    fontValue: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    badge: 'Fastest OS',
    description: 'Direct native OS font with zero webfont download and maximum rendering speed',
  },
];

const FONT_SIZE_OPTIONS = [
  { key: '15px', label: 'Compact', sub: '15px', scaleText: 'A--' },
  { key: '16.5px', label: 'Default', sub: '16.5px', scaleText: 'A-' },
  { key: '18px', label: 'Comfortable', sub: '18px', scaleText: 'A' },
  { key: '19.5px', label: 'Large', sub: '19.5px', scaleText: 'A+' },
  { key: '21px', label: 'War Room 2XL', sub: '21px', scaleText: 'A++' },
];

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'how-to-use' | 'display' | 'modules'>('how-to-use');
  const [currentFontSize, setCurrentFontSize] = useState<string>('18px');
  const [currentFontFamily, setCurrentFontFamily] = useState<string>('google_sans');

  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const saved = localStorage.getItem('ts_dash_font_size') || document.documentElement.style.fontSize || '18px';
      const savedFont = localStorage.getItem('ts_dash_font_family_key') || 'google_sans';
      setCurrentFontSize(saved.trim());
      setCurrentFontFamily(savedFont);
    }
  }, [isOpen]);

  const handleSelectFontSize = (size: string) => {
    setCurrentFontSize(size);
    document.documentElement.style.fontSize = size;
    try {
      localStorage.setItem('ts_dash_font_size', size);
    } catch {}
  };

  const handleSelectFontFamily = (key: string, fontVal: string) => {
    setCurrentFontFamily(key);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('--app-font-family', fontVal);
      document.documentElement.style.fontFamily = fontVal;
      document.body.style.fontFamily = fontVal;
    }
    try {
      localStorage.setItem('ts_dash_font_family_key', key);
      localStorage.setItem('ts_dash_font_family', fontVal);
    } catch {}
  };

  const handleResetDisplay = () => {
    handleSelectFontFamily('google_sans', "'Google Sans', 'Google Sans Text', 'Inter', system-ui, sans-serif");
    handleSelectFontSize('18px');
  };

  if (!isOpen) return null;

  const activeFontObj = FONT_FAMILY_OPTIONS.find((f) => f.key === currentFontFamily) || FONT_FAMILY_OPTIONS[0];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close help modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <BookOpen className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-black text-slate-900 leading-tight">
              Election Intelligence &mdash; How to Use &amp; Guides
            </h2>
            <p className="text-xs text-slate-500">Telangana 119 Assembly Constituencies &middot; Knowledge Base &amp; Display Preferences</p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 my-4 border-b border-slate-100 pb-2">
          <button
            onClick={() => setActiveTab('how-to-use')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'how-to-use' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>How to Use</span>
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'modules' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Modules &amp; Solvers</span>
          </button>
          <button
            onClick={() => setActiveTab('display')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'display' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Font &amp; Display</span>
          </button>
        </div>

        {/* TAB 1: HOW TO USE */}
        {activeTab === 'how-to-use' && (
          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div className="bg-indigo-50/80 p-3.5 rounded-xl border border-indigo-100 space-y-1.5">
              <h3 className="font-bold text-indigo-950 text-xs flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">1</span>
                Quick-Start Master Operational Workflow
              </h3>
              <p className="text-[11px] text-indigo-900/80">
                1. <strong>Examine Baseline Ground Truth:</strong> Toggle between 2014, 2018, and 2023 in the top bar. Switch between Party Colors, Victory Margins (&lt;10k votes), and Swings.<br />
                2. <strong>Inspect Constituency Dossier:</strong> Click any constituency on the map or search by name. Check candidate assets, criminal affidavits, and the <em>Candidate Equity Decomposer</em>.<br />
                3. <strong>Run Panna Deficit Solver:</strong> View required net votes per polling booth and per 30-voter page committee to flip contested margins.<br />
                4. <strong>Simulate What-If Swings:</strong> Adjust community swing sliders in <em>Simulations</em> to watch the majority line dynamically update.<br />
                5. <strong>Deploy Strategic Resources:</strong> In <em>Actions &amp; Playbook</em>, allocate Digital/Field/Welfare points and assign Star Campaigners.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" />
                Key Built-In Strategic Solvers
              </h4>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                <li><strong>Candidate Personal Equity Decomposer (#6):</strong> Decouples candidate personal popularity from party baseline to measure positive brand equity (+EV) vs drag.</li>
                <li><strong>Form-20 Deficit &amp; Panna Solver (#5):</strong> Calculates exact votes needed per 30-voter page committee (Panna Pramukh) to overturn deficit margins.</li>
                <li><strong>Star Campaigner Allocator:</strong> Evaluates surrogate leadership fit across demographic caste concentrations.</li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: MODULES */}
        {activeTab === 'modules' && (
          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            <div className="border border-slate-200 rounded-xl p-3.5 space-y-1 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-indigo-600" /> Results &amp; Map
              </h4>
              <p className="text-[11px] text-slate-600">
                Choropleth map with 119 constituencies across 2014, 2018, and 2023. Toggle Winner, Margin, and Swing modes. Click any AC for instant telemetry.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-3.5 space-y-1 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" /> Simulations &amp; Swing Studio
              </h4>
              <p className="text-[11px] text-slate-600">
                Interactive community swing modeling across caste groups with real-time seat tally updates. Fine-tune macro swings and turnout stress tests.
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-3.5 space-y-1 bg-slate-50">
              <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Target className="w-4 h-4 text-rose-600" /> Actions &amp; Playbook
              </h4>
              <p className="text-[11px] text-slate-600">
                Resource Point allocation (Digital, Rally, Welfare), Star Campaigner deployment, and independent rebel defection modeling.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: DISPLAY & FONT PREFERENCES */}
        {activeTab === 'display' && (
          <div className="space-y-4">
            {/* Font Family Selection */}
            <section className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-bold text-slate-900">Platform Font Family (Typeface)</h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Active: {activeFontObj.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {FONT_FAMILY_OPTIONS.map((f) => {
                  const isSelected = currentFontFamily === f.key;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => handleSelectFontFamily(f.key, f.fontValue)}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer flex flex-col items-start gap-1 border text-left ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm shadow-indigo-600/30'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded font-mono ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                          {f.badge}
                        </span>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`} style={{ fontFamily: f.fontValue }}>
                        {f.name}
                      </div>
                      <div className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {f.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Display Text Scaling */}
            <section className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900">Display Text Scaling</h3>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Active: {FONT_SIZE_OPTIONS.find((o) => o.key === currentFontSize)?.label || currentFontSize}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {FONT_SIZE_OPTIONS.map((opt) => {
                  const isSelected = currentFontSize === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleSelectFontSize(opt.key)}
                      className={`py-2 px-1 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm shadow-indigo-600/30 font-black'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs font-extrabold flex items-center gap-0.5">
                        {opt.scaleText}
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </span>
                      <span className={`text-[10px] font-semibold ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Live Preview Card */}
            <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 space-y-1.5">
              <div className="text-[10px] font-mono text-indigo-400 uppercase">Live Typography Preview</div>
              <div className="text-sm font-bold" style={{ fontFamily: activeFontObj.fontValue }}>
                Telangana 119 AC War Room &middot; Majority Mark: 60 Seats
              </div>
              <p className="text-xs text-slate-300" style={{ fontFamily: activeFontObj.fontValue }}>
                "INC won 64 seats, BRS secured 39 seats, BJP won 8 seats. Panna deficit solver active across all polling stations."
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono">Esc</kbd> to close</span>
          <button
            onClick={handleResetDisplay}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Display Defaults</span>
          </button>
        </div>
      </div>
    </div>
  );
};
