import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Target,
  Check,
  Type,
  Users,
  Search,
  BookOpen,
  Keyboard,
  Layers,
  FileSpreadsheet,
  Award,
  Zap,
  Palette,
  Compass,
  RotateCcw,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { useDashboard, MAP_SHADE_OPTIONS } from '../context/DashboardContext';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type HelpTab = 'how-to-use' | 'modules' | 'solvers' | 'demographics' | 'shortcuts' | 'display';

export interface FontFamilyOption {
  key: string;
  name: string;
  fontValue: string;
  category: string;
  badge: string;
  description: string;
  previewSample: string;
}

export const FONT_FAMILY_OPTIONS: FontFamilyOption[] = [
  {
    key: 'google_sans',
    name: 'Google Sans',
    fontValue: "'Google Sans', 'Google Sans Text', 'Inter', system-ui, sans-serif",
    category: 'Sans-Serif',
    badge: 'Recommended',
    description: 'Clean, modern geometric proportions designed for digital reading and dashboards',
    previewSample: 'AP 175 AC Strategic War Room &middot; Majority Benchmark 88',
  },
  {
    key: 'inter',
    name: 'Inter',
    fontValue: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    category: 'Sans-Serif',
    badge: 'High Precision',
    description: 'Silicon Valley tech standard with tall x-height and exceptional micro-typography',
    previewSample: 'Panna Pramukh Deficit Solver: +4.2% Swing Needed',
  },
  {
    key: 'plus_jakarta',
    name: 'Plus Jakarta Sans',
    fontValue: "'Plus Jakarta Sans', system-ui, sans-serif",
    category: 'Sans-Serif',
    badge: 'Executive',
    description: 'Sophisticated contemporary typography, optimal for C-Suite briefings & presentations',
    previewSample: 'NDA Coalition 164 Seats (+76 Supermajority Buffer)',
  },
  {
    key: 'outfit',
    name: 'Outfit',
    fontValue: "'Outfit', system-ui, sans-serif",
    category: 'Display Sans',
    badge: 'Modern Display',
    description: 'Bold, distinctive letterforms crafted for high-contrast viewing at a distance',
    previewSample: '175 Assembly Constituencies &middot; 45,791 Polling Stations',
  },
  {
    key: 'roboto',
    name: 'Roboto',
    fontValue: "'Roboto', 'Segoe UI', Arial, sans-serif",
    category: 'Sans-Serif',
    badge: 'Universal',
    description: 'Classic Google neo-grotesque, universally balanced and readable across all screens',
    previewSample: 'Form-20 Official Polling Station Certified Ground Tally',
  },
  {
    key: 'jetbrains_mono',
    name: 'JetBrains Mono',
    fontValue: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    category: 'Monospace',
    badge: 'War Room Terminal',
    description: 'Developer & quant terminal monospace font for tabular numerical and data density',
    previewSample: 'AC #175 KUPPAM &middot; MARGIN +33,806 (60.1%) &middot; STATUS: SAFE',
  },
  {
    key: 'system_native',
    name: 'System Native',
    fontValue: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    category: 'System',
    badge: 'Fastest OS',
    description: 'Direct native OS font (San Francisco / Segoe UI / Roboto) with zero webfont download',
    previewSample: 'Instant Native Rendering & Lowest Battery Consumption',
  },
];

export const FONT_SIZE_OPTIONS = [
  { key: '15px', label: 'Compact', sub: '15px', scaleText: 'A--', desc: 'Dense laptops & large tables' },
  { key: '16.5px', label: 'Default', sub: '16.5px', scaleText: 'A-', desc: 'Standard desktop view' },
  { key: '18px', label: 'Comfortable', sub: '18px', scaleText: 'A', desc: 'Balanced readability' },
  { key: '19.5px', label: 'Large', sub: '19.5px', scaleText: 'A+', desc: 'Tablets & extended reading' },
  { key: '21px', label: 'War Room 2XL', sub: '21px', scaleText: 'A++', desc: 'Wall LED screens & projectors' },
];

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const { mapColorShade, setMapColorShade } = useDashboard();
  const [activeTab, setActiveTab] = useState<HelpTab>('how-to-use');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Font preferences state
  const [currentFontFamily, setCurrentFontFamily] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ts_dash_font_family_key') || 'google_sans';
    }
    return 'google_sans';
  });

  const [currentFontSize, setCurrentFontSize] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('ts_dash_font_size') || document.documentElement.style.fontSize || '18px').trim();
    }
    return '18px';
  });

  const [isHighContrast, setIsHighContrast] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ts_dash_font_contrast') === 'high';
    }
    return false;
  });

  // Sync settings when modal opens
  useEffect(() => {
    if (typeof window !== 'undefined' && isOpen) {
      const savedKey = localStorage.getItem('ts_dash_font_family_key') || 'google_sans';
      const savedSize = (localStorage.getItem('ts_dash_font_size') || document.documentElement.style.fontSize || '18px').trim();
      const savedContrast = localStorage.getItem('ts_dash_font_contrast') === 'high';
      setCurrentFontFamily(savedKey);
      setCurrentFontSize(savedSize);
      setIsHighContrast(savedContrast);
    }
  }, [isOpen]);

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

  const handleSelectFontSize = (size: string) => {
    setCurrentFontSize(size);
    if (typeof document !== 'undefined') {
      document.documentElement.style.setProperty('font-size', size);
      document.documentElement.style.fontSize = size;
    }
    try {
      localStorage.setItem('ts_dash_font_size', size);
    } catch {}
  };

  const handleToggleContrast = () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    if (typeof document !== 'undefined') {
      if (next) {
        document.documentElement.classList.add('high-contrast-text');
      } else {
        document.documentElement.classList.remove('high-contrast-text');
      }
    }
    try {
      localStorage.setItem('ts_dash_font_contrast', next ? 'high' : 'normal');
    } catch {}
  };

  const handleResetDisplay = () => {
    handleSelectFontFamily('google_sans', "'Google Sans', 'Google Sans Text', 'Inter', system-ui, sans-serif");
    handleSelectFontSize('18px');
    if (isHighContrast) handleToggleContrast();
    setMapColorShade('medium_dark');
  };

  const tabs: { key: HelpTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'how-to-use', label: '🚀 How to Use (Master Guide)', icon: Compass },
    { key: 'modules', label: '📊 6 War Room Modules', icon: Layers },
    { key: 'solvers', label: '🧮 Tactical Solvers', icon: Target },
    { key: 'demographics', label: '👥 Caste Equations & Mandate', icon: Users },
    { key: 'shortcuts', label: '⌨️ Shortcuts & Hotkeys', icon: Keyboard },
    { key: 'display', label: '🎨 Font & Display Options', icon: Type },
  ];

  // Filter content if search query is active
  const q = searchQuery.toLowerCase().trim();

  if (!isOpen) return null;

  const activeFontObj = FONT_FAMILY_OPTIONS.find((f) => f.key === currentFontFamily) || FONT_FAMILY_OPTIONS[0];

  return (
    <div
      className="fixed inset-0 z-[3200] flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-5 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full flex flex-col max-h-[94vh] overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-indigo-400 uppercase flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                AP 175 AC STRATEGIC WAR ROOM &middot; KNOWLEDGE BASE &amp; USER MANUAL
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                Election Intelligence Platform &mdash; How to Use &amp; Guides
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close help modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Header: Search bar & Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 sm:px-6 py-3 space-y-3 shrink-0">
          {/* Quick Search in Help */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, workflows & solvers (e.g., How to use, Panna Pramukh, Font, Margin, Simulations, Star Campaigners)..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="flex flex-wrap items-center gap-1.5 pb-0.5">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs font-black'
                      : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-7 text-slate-800 text-xs leading-relaxed">

          {/* ========================================================================= */}
          {/* TAB 1: COMPREHENSIVE HOW-TO-USE MASTER GUIDE */}
          {/* ========================================================================= */}
          {(activeTab === 'how-to-use' || q) && (
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-indigo-600" />
                    Master How-to-Use Guide &amp; Tactical Campaign Workflows
                  </h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    6-Step Operational Lifecycle
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  How political strategists, field directors, and data analysts leverage the platform from macro seat forecasting down to booth-level victory execution.
                </p>
              </div>

              {/* Master 6-Step Workflow Pipeline Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">1</span>
                    <h4 className="font-bold text-indigo-950 text-xs">Diagnose Historical Ground Truth</h4>
                  </div>
                  <p className="text-[11px] text-indigo-900/80">
                    Explore the <strong>Results &amp; Map</strong> tab. Filter by district/region, review past 2014/2019/2024 elections, and identify vulnerable battlegrounds won by &lt;10,000 votes.
                  </p>
                </div>

                <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">2</span>
                    <h4 className="font-bold text-indigo-950 text-xs">Inspect AC Dossier &amp; Candidate Equity</h4>
                  </div>
                  <p className="text-[11px] text-indigo-900/80">
                    Switch to <strong>AC Dossier</strong>. Evaluate candidate wealth affidavits, criminal cases, mandal demographics, and personal candidate value (+EV vs drag).
                  </p>
                </div>

                <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">3</span>
                    <h4 className="font-bold text-indigo-950 text-xs">Execute Hyper-Local Booth Solvers</h4>
                  </div>
                  <p className="text-[11px] text-indigo-900/80">
                    Drill into <strong>Voter Rolls &amp; Booths</strong>. Use the <em>Panna Pramukh Deficit Solver</em> to calculate exact voter quotas needed per 30-voter page and plan Padayatra routes.
                  </p>
                </div>

                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center">4</span>
                    <h4 className="font-bold text-amber-950 text-xs">Model What-If Scenarios &amp; Swings</h4>
                  </div>
                  <p className="text-[11px] text-amber-900/80">
                    Open <strong>Simulations</strong>. Dial caste swing percentages across 14 demographic blocs, test coalition friction, and watch the <em>88-seat Live Majority Barometer</em> react.
                  </p>
                </div>

                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center">5</span>
                    <h4 className="font-bold text-amber-950 text-xs">Deploy Resources &amp; Star Campaigners</h4>
                  </div>
                  <p className="text-[11px] text-amber-900/80">
                    In <strong>Playbook &amp; Actions</strong>, allocate finite Resource Points (Digital, Rallies, Welfare) and deploy Star Campaigners (CBN, PK, Lokesh) to fit local caste dominance.
                  </p>
                </div>

                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-white font-bold text-[10px] flex items-center justify-center">6</span>
                    <h4 className="font-bold text-amber-950 text-xs">Target Audiences &amp; Deploy Cadences</h4>
                  </div>
                  <p className="text-[11px] text-amber-900/80">
                    Under <strong>Voter Reach</strong>, target age cohorts (Gen Z, Millennials, Seniors), assign optimal communication touchpoints (WhatsApp, D2D), and trigger emotional persuasion levers.
                  </p>
                </div>
              </div>

              {/* Comprehensive Step-by-Step Task Guides ("How Do I...?") */}
              <div className="space-y-4 pt-2">
                <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Task-by-Task Operational Guides &amp; Tactical Walkthroughs
                </h4>

                {/* Guide 1: Analyzing Narrow Battlegrounds */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold text-[10px]">TASK 1</span>
                      How to Identify and Triage Razor-Thin Battleground Seats (&lt;5,000 Margin)
                    </h5>
                    <span className="text-[10px] font-mono text-slate-500">Tab: Results &amp; Map [1]</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li>Navigate to the <strong>Results &amp; Map</strong> tab (press hotkey <kbd className="px-1 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold">1</kbd>).</li>
                    <li>In the map control bar, toggle the view mode from <strong>Winner</strong> to <strong>Victory Margins</strong>.</li>
                    <li>Constituencies with victory margins under 5,000 votes are highlighted with red warning borders and pulsing badges.</li>
                    <li>Use the <strong>District Filter Ribbon</strong> to narrow down to vulnerable regions (e.g., Rayalaseema vs Godavari deltas).</li>
                    <li>Click on any constituency card to inspect historical trends across 2014, 2019, and 2024 to verify if it is a chronic swing seat.</li>
                  </ol>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-[10px] text-indigo-700 font-medium">
                    💡 <strong>Pro Tip:</strong> Press <kbd className="px-1 py-0.2 bg-slate-100 border rounded font-mono font-bold">Ctrl + K</kbd> to open the Command Palette, type "Narrow Margin" or an AC name, and jump directly into its dossier.
                  </div>
                </div>

                {/* Guide 2: Panna Pramukh Deficit Solver */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">TASK 2</span>
                      How to Calculate Exact Page-Level Votes to Overturn a Deficit (Panna Pramukh Solver)
                    </h5>
                    <span className="text-[10px] font-mono text-slate-500">Tab: Voter Rolls &amp; Booths [3]</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li>Select the target constituency and switch to the <strong>Voter Rolls &amp; Booth Data</strong> tab (hotkey <kbd className="px-1 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold">3</kbd>).</li>
                    <li>Open the <strong>Form-20 Deficit &amp; Panna Solver</strong> panel located in the booth workspace.</li>
                    <li>The solver automatically loads the certified deficit margin from Form-20 data across all polling stations.</li>
                    <li>Review the <strong>Target Net Vote Flip Quota</strong>: The platform divides the margin by total booths and then calculates the required votes to flip per <strong>30-voter electoral roll page</strong>.</li>
                    <li>Inspect the <strong>Panna Pramukh Sheet</strong> to assign karyakarta names, phone numbers, and door-to-door visit dates.</li>
                    <li>Export the certified Panna assignment sheet as a printable roster or share directly via WhatsApp.</li>
                  </ol>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 text-[10px] text-emerald-700 font-medium">
                    💡 <strong>Operational Standard:</strong> Fipping just <strong>2 to 3 voters per page</strong> across 200 booths routinely converts a 10,000-vote deficit into an insurmountable victory.
                  </div>
                </div>

                {/* Guide 3: Running Caste Swing Simulations */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-[10px]">TASK 3</span>
                      How to Simulate Caste Demographic Swings &amp; Coalition Friction
                    </h5>
                    <span className="text-[10px] font-mono text-slate-500">Tab: Simulations &amp; Barometer [4]</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li>Jump to <strong>Simulations &amp; What-If Scenarios</strong> (hotkey <kbd className="px-1 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold">4</kbd>).</li>
                    <li>In the <strong>Caste &amp; Demographic Blocs</strong> sub-tab, locate the 14 community sliders (Kapu/Balija, BC Turpu Kapu, Reddy, SC Mala/Madiga, Minorities, etc.).</li>
                    <li>Drag the swing slider (e.g., set <em>Kapu Swing</em> to +4.5% or <em>BC Yadava</em> to +3.0%).</li>
                    <li>Observe the <strong>Live Assembly Majority Barometer</strong> at the top: watch the NDA seat count shift against the 88-seat threshold in real-time.</li>
                    <li>Inspect the <strong>Flipped Seats Table</strong> to see exactly which constituencies change hands.</li>
                    <li>Click <strong>Export Scenario to Playbook</strong> in the Scenario Bridge Ribbon to immediately load these simulated deficits into the campaign execution pipeline!</li>
                  </ol>
                </div>

                {/* Guide 4: Deploying Star Campaigners */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono font-bold text-[10px]">TASK 4</span>
                      How to Optimize Star Campaigner Deployments by Caste-Demographic Dominance
                    </h5>
                    <span className="text-[10px] font-mono text-slate-500">Tab: Playbook &amp; Actions [5]</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li>Open <strong>Playbook &amp; Campaign Actions</strong> (hotkey <kbd className="px-1 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold">5</kbd>).</li>
                    <li>Select the target constituency card to open the <strong>Star Campaigner Allocator</strong>.</li>
                    <li>The system recommends an optimal <strong>Tiered Squad (A + B + C + M)</strong> matched to that constituency's primary demographics:
                      <ul className="list-disc list-inside pl-3 pt-0.5 text-slate-600">
                        <li><strong>Tier A (Chief Crowd-Puller):</strong> N. Chandrababu Naidu or Pawan Kalyan for mega-rallies.</li>
                        <li><strong>Tier B (Demographic Champion):</strong> Nara Lokesh (Youth/BC), Daggubati Purandeswari (Women/Central), or regional ministers.</li>
                        <li><strong>Tier C &amp; M:</strong> Influential local community elders and minority leaders.</li>
                      </ul>
                    </li>
                    <li>Allocate finite Campaign Points to schedule rallies and door-to-door blitzes to maximize swing impact.</li>
                  </ol>
                </div>

                {/* Guide 5: War Room Presentations & Zen Mode */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono font-bold text-[10px]">TASK 5</span>
                      How to Run Live War Room Screenings &amp; 1-Click Executive Briefings
                    </h5>
                    <span className="text-[10px] font-mono text-slate-500">Global Controls</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 pl-1">
                    <li>Press <kbd className="px-1 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold">Z</kbd> anywhere on the dashboard to engage <strong>Fullscreen Zen Mode</strong>, eliminating browser chrome for pristine projection onto wall monitors.</li>
                    <li>Click the <strong>NDA Floating HUD</strong> at the bottom of the screen to view real-time state totals (164/175 seats, +76 supermajority buffer).</li>
                    <li>Click <strong>Generate C-Suite Briefing</strong> to produce an instant markdown/PDF summary ready for immediate presentation to party leadership.</li>
                    <li>Use <strong>Copy WhatsApp Memo</strong> to format critical constituency talking points and booth targets for direct broadcast to ground coordinators.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: 6 WAR ROOM MODULES */}
          {/* ========================================================================= */}
          {(activeTab === 'modules' || q) && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  The 6 Core War Room Modules across 2 Strategic Groups
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Partitioned into Ground Truth Intelligence (Diagnosis) and War Room Intervention (Action)
                </p>
              </div>

              {/* Group 1: Ground Intelligence */}
              <div className="space-y-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 flex items-center gap-1.5">
                  <span>Group 1: Ground &amp; Constituency Intelligence (Diagnosis)</span>
                </div>

                {/* 1. Results & Map */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold text-[10px]">1</span>
                      📊 Results &amp; Map (Historical Ground Truth)
                    </h4>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">Hotkey: 1</kbd>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Interactive choropleth map and 175-constituency directory across 2014, 2019, and 2024 elections. Switch between <strong>Party Colors</strong>, <strong>Victory Margins</strong> (highlights seats won by &lt;10k votes), and <strong>Seat Swings</strong>. Switch to <strong>Hex Cartogram</strong> for population-weighted equal-area analysis. Click any constituency to inspect its battle card and voter trends.
                  </p>
                </div>

                {/* 2. AC Dossier */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold text-[10px]">2</span>
                      🏛️ AC Dossier (Candidate Roster &amp; Affidavits)
                    </h4>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">Hotkey: 2</kbd>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Full-page constituency dossier. Inspect candidate wealth, educational qualifications, criminal affidavits, local issue priorities, mandal circles, and demographic caste share for any selected constituency with an instant dropdown switcher. Features the <strong>Candidate Personal Equity Decomposer</strong> to evaluate personal brand value vs party drag.
                  </p>
                </div>

                {/* 3. Voter Rolls & Booths */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold text-[10px]">3</span>
                      📋 Voter Rolls &amp; E-Panna Booth Data
                    </h4>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">Hotkey: 3</kbd>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Hyper-local booth and polling station operations across all 45,791 booths. Inspect certified Form-20 numbers, polling station buildings, onomastic surname clusters, and assign field targets using the <strong>Panna Pramukh (Page Committee) Deficit Solver</strong> down to 30-voter pages. Includes the <strong>Padayatra Route Planner</strong> and <strong>On-Demand Voter Roll Extractor</strong>.
                  </p>
                </div>
              </div>

              {/* Group 2: Strategy */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100 flex items-center gap-1.5">
                  <span>Group 2: War Room &amp; Strategy (Intervention &amp; Forecasting)</span>
                </div>

                {/* 4. Simulations */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-[10px]">4</span>
                      🔮 Simulations &amp; What-If Scenarios
                    </h4>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">Hotkey: 4</kbd>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Senior Chief-Advisor forecasting suite. Dial community swing percentages across 14 caste and demographic blocs to observe projected seat outcomes on the <strong>Live Assembly Majority Barometer</strong>. Model coalition friction (TDP-JSP-BJP), MLA anti-incumbency fatigue, and turnout shocks. Features the <strong>Scenario Bridge Ribbon</strong> to export scenario assumptions into the Playbook.
                  </p>
                </div>

                {/* 5. Playbook & Actions */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-[10px]">5</span>
                      🎯 Playbook &amp; Campaign Actions
                    </h4>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">Hotkey: 5</kbd>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Tactical campaign execution center. Allocate <strong>Resource Points</strong> (Digital Blitz, Field Rallies, Welfare beneficiary drives) across battlegrounds. Deploy <strong>Star Campaigners</strong> (Chandrababu Naidu, Pawan Kalyan, Nara Lokesh, Purandeswari) and model the vote-splintering impact of independent and factional rebels in the <strong>Defection Modeler</strong>.
                  </p>
                </div>

                {/* 6. Voter Reach */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono font-bold text-[10px]">6</span>
                      📢 Voter Reach &amp; Micro-Targeting
                    </h4>
                    <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono font-bold text-slate-600">Hotkey: 6</kbd>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Audience segmentation engine cross-tabulating <strong>Caste &times; Age</strong> (18&ndash;25 Gen Z first-timers, 26&ndash;40 Millennials, 41&ndash;55 Middle Age, 56+ Seniors). Maps channel touchpoints (WhatsApp Communities, Door-to-Door, Mega Rallies, Local Cable/IVR) with priority issues (Unemployment, Polavaram/Irrigation, Amaravati, Welfare Subsidies) and the <strong>Red Pill Emotional Triggers Matrix</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: TACTICAL SOLVERS & QUANT ENGINES */}
          {/* ========================================================================= */}
          {(activeTab === 'solvers' || q) && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Target className="w-4 h-4 text-rose-600" />
                  Built-In Strategic Solvers &amp; Decision Engines
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proprietary quantitative algorithms designed to solve victory deficits and optimize field resource deployment
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    Form-20 Deficit &amp; Panna Pramukh Solver (#5)
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Calculates the exact number of net votes needed per polling booth and per 30-voter page to overcome an opposition victory margin. Generates actionable target quotas for local page-in-charge (Panna Pramukh) karyakartas with zero guesswork.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-800 bg-emerald-50 p-2 rounded border border-emerald-100">
                    Formula: Votes Per Page = [Margin Deficit &times; 1.15 Safety Buffer] &divide; [Total Booths &times; 33 Pages/Booth]
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <Award className="w-4 h-4 text-indigo-600" />
                    Candidate Personal Equity Decomposer (#6)
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Located in the Full Constituency Dossier. Decouples a candidate&apos;s personal brand equity (local philanthropy, accessibility, community goodwill) from their party symbol baseline. Shows whether the candidate added positive value (+EV) or acted as a drag on party baseline.
                  </p>
                  <div className="text-[10px] font-mono text-indigo-800 bg-indigo-50 p-2 rounded border border-indigo-100">
                    Equity Score = Actual Vote Share &minus; Expected Base Party Share (controlled for regional swing)
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <Zap className="w-4 h-4 text-amber-600" />
                    Super Six Welfare Saturation Tracker
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Audits constituency-level delivery of the NDA Government&apos;s flagship welfare pledges: <em>Thalliki Vandanam</em> (₹15,000/student), <em>Deepam 2.0</em> (3 free gas cylinders/year), <em>Annadata</em> (₹20,000 farmer income support), <em>Aadabidda Nidhi</em> (₹1,500/month), <em>Youth Allowance</em> (₹3,000/month), and <em>Free RTC Bus Travel</em> for women.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
                    <Flame className="w-4 h-4 text-rose-600" />
                    Defection &amp; Independent Rebel Splinter Modeler
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Simulates the vote-cannibalization effect when a disgruntled party leader breaks away as an independent or joins a rival party. Calculates the exact threshold of rebel vote share that flips a safe seat into a high-risk red zone.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: CASTE & POLITICAL MANDATE */}
          {/* ========================================================================= */}
          {(activeTab === 'demographics' || q) && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-600" />
                  Andhra Pradesh Demographic Playbook &amp; 2024 Mandate Architecture
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  175 Assembly Constituencies &middot; 88 Majority Benchmark &middot; 26 Administrative Districts
                </p>
              </div>

              {/* 2024 Mandate Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-amber-800">NDA Alliance</div>
                  <div className="text-2xl font-black text-amber-600 font-mono mt-0.5">164 Seats</div>
                  <div className="text-[10px] text-amber-700 mt-0.5">+76 Supermajority Buffer</div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-yellow-800">TDP (Ruling Anchor)</div>
                  <div className="text-2xl font-black text-yellow-600 font-mono mt-0.5">135 Seats</div>
                  <div className="text-[10px] text-yellow-700 mt-0.5">77.1% Assembly Share</div>
                </div>

                <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-rose-800">Janasena (JSP)</div>
                  <div className="text-2xl font-black text-rose-600 font-mono mt-0.5">21 / 21</div>
                  <div className="text-[10px] text-rose-700 mt-0.5">100% Strike Rate Record</div>
                </div>

                <div className="bg-slate-100 border border-slate-200 p-3 rounded-xl">
                  <div className="text-[11px] font-bold text-slate-600">YSRCP (Opposition)</div>
                  <div className="text-2xl font-black text-slate-700 font-mono mt-0.5">11 Seats</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">-140 Net Seat Loss</div>
                </div>
              </div>

              {/* Caste demographic cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Kapu / Balija / Telaga</span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-mono font-bold text-[10px]">~22% State Share</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Decisive kingmaker community across East Godavari, West Godavari, Krishna, Guntur, and Rayalaseema Balija belts. Pawan Kalyan&apos;s Janasena alignment ensures high strike rates; preserving coalition synergy with TDP is critical to maintaining supermajority buffers.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">BC Turpu Kapu</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono font-bold text-[10px]">~7% (Uttarandhra)</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Dominant agrarian community in Srikakulam and Vizianagaram. Highly responsive to local irrigation initiatives, welfare delivery, and BC representation in government bodies.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">BC Yadava &amp; Kuruba / Boya</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">~14% State Share</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Core backbone across Rayalaseema (Anantapur, Kurnool) and coastal pastoral belts. Critical to neutralizing traditional opposition holds; key demands center on animal husbandry, rural credit, and water security.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">Reddy Community</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono font-bold text-[10px]">~11-12% State Share</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Historically dominant political and agrarian leadership across Rayalaseema (Kadapa, Kurnool) and Palnadu/Nellore. Factions frequently split between parties based on local candidate equity.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: KEYBOARD SHORTCUTS */}
          {/* ========================================================================= */}
          {(activeTab === 'shortcuts' || q) && (
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-indigo-600" />
                  Keyboard Shortcuts &amp; Power Navigation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Execute key war room actions instantaneously without touching the mouse
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Command Palette Search (175 ACs &amp; Tools)</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    Ctrl + K / ⌘K
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Quick Search Slash Hotkey</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    /
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Jump to 📊 Results &amp; Map</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    1
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Jump to 🏛️ AC Dossier</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    2
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Jump to 📋 Voter Rolls &amp; E-Panna</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    3
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Jump to 🔮 Simulations &amp; Barometer</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    4
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Jump to 🎯 Playbook &amp; Actions</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    5
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Jump to 📢 Voter Reach &amp; Targeting</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    6
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Fullscreen War Room Zen Mode</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    Z
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Open this Help &amp; Guides Modal</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    ?
                  </kbd>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-700 font-medium text-xs">Close Active Modal / Dropdown</span>
                  <kbd className="px-2 py-1 bg-white border border-slate-200 rounded font-mono font-bold text-slate-800 text-xs shadow-2xs">
                    Esc
                  </kbd>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: FONT & DISPLAY PREFERENCES */}
          {/* ========================================================================= */}
          {(activeTab === 'display' || q) && (
            <div className="space-y-5">
              <div className="border-b border-slate-200 pb-2 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Type className="w-4 h-4 text-indigo-600" />
                    Font &amp; Display Typography Preferences
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Customize font family typefaces, display scaling, and text contrast across the entire platform
                  </p>
                </div>
                <button
                  onClick={handleResetDisplay}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                  title="Reset all display preferences to defaults"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Defaults</span>
                </button>
              </div>

              {/* 1. FONT FAMILY (TYPEFACE) SELECTION */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-indigo-600" />
                      Platform Font Family (Typeface)
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Select your preferred typography typeface; updates all cards, tables, maps, and menus instantly
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Active: {activeFontObj.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  {FONT_FAMILY_OPTIONS.map((f) => {
                    const isSelected = currentFontFamily === f.key;
                    return (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => handleSelectFontFamily(f.key, f.fontValue)}
                        className={`p-3 rounded-xl transition-all cursor-pointer flex flex-col items-start gap-1.5 border text-left relative ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm shadow-indigo-600/30'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded font-mono ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {f.badge}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>

                        <div>
                          <div
                            className={`text-sm font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}
                            style={{ fontFamily: f.fontValue }}
                          >
                            {f.name}
                          </div>
                          <div className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-500'} mt-0.5 line-clamp-2`}>
                            {f.description}
                          </div>
                        </div>

                        <div
                          className={`text-[10.5px] px-2 py-1 rounded w-full mt-1 font-medium truncate ${
                            isSelected ? 'bg-white/10 text-indigo-100 border border-white/20' : 'bg-slate-50 text-slate-700 border border-slate-200'
                          }`}
                          style={{ fontFamily: f.fontValue }}
                        >
                          Aa Bb 123 &middot; {f.name}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. TEXT SIZE SCALING */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Application Text Size Scale</div>
                    <div className="text-[11px] text-slate-500">Fine-tune base scaling for small laptops, standard displays, or giant war room projectors</div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Active: {FONT_SIZE_OPTIONS.find((o) => o.key === currentFontSize)?.label || currentFontSize}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {FONT_SIZE_OPTIONS.map((opt) => {
                    const isSelected = currentFontSize === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => handleSelectFontSize(opt.key)}
                        className={`py-3 px-2 rounded-xl transition-all cursor-pointer flex flex-col items-center justify-center gap-1 border ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm shadow-indigo-600/30 font-black'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <span className="text-sm font-extrabold flex items-center gap-1">
                          {opt.scaleText}
                          {isSelected && <Check className="w-3 h-3" />}
                        </span>
                        <span className={`text-[10px] font-semibold ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {opt.label}
                        </span>
                        <span className={`text-[9px] font-mono ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {opt.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. HIGH CONTRAST TEXT TOGGLE */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900">High-Contrast Text Sharpness Mode</div>
                  <div className="text-[11px] text-slate-500">
                    Darkens muted labels and slightly boosts font weights for washed-out projectors or bright ambient light
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleToggleContrast}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                    isHighContrast
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${isHighContrast ? 'opacity-100' : 'opacity-0'}`} />
                  <span>{isHighContrast ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              {/* 4. LIVE INTERACTIVE FONT & DISPLAY PREVIEW */}
              <div className="bg-indigo-950 text-white p-4 sm:p-5 rounded-xl border border-indigo-900/60 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-800/60 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-indigo-200 uppercase tracking-wider font-mono">
                      Live Typography &amp; Scale Preview
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-900 text-indigo-300 border border-indigo-700">
                    {activeFontObj.name} &middot; {currentFontSize} &middot; {isHighContrast ? 'High Contrast' : 'Standard'}
                  </span>
                </div>

                <div
                  className="space-y-2.5"
                  style={{ fontFamily: activeFontObj.fontValue }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase">
                      TDP 135
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-rose-500 text-white uppercase">
                      JSP 21
                    </span>
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-orange-500 text-white uppercase">
                      BJP 8
                    </span>
                    <span className="text-xs font-bold text-indigo-300">
                      Total Alliance: 164 / 175 (+76 Supermajority Buffer)
                    </span>
                  </div>

                  <h4 className="text-base sm:text-lg font-black text-white tracking-tight">
                    AP 175 Assembly Constituencies &middot; Strategic War Room Live Telemetry
                  </h4>

                  <p className="text-xs text-indigo-200 leading-relaxed max-w-3xl">
                    "Constituency #175 (Kuppam) recorded an overwhelming 60.1% vote share with a victory margin of +33,806 votes. Panna Pramukh allocation across 248 polling stations achieved 96.4% ground verification efficiency."
                  </p>
                </div>
              </div>

              {/* 5. MAP PASTEL COLOR SHADE PICKER */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-indigo-600" />
                      Map Baseline Shade &amp; Contrast
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Adjust pastel darkness and saturation for electoral baseline choropleth maps
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Active: {MAP_SHADE_OPTIONS.find((o) => o.key === mapColorShade)?.label}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                  {MAP_SHADE_OPTIONS.map((opt) => {
                    const isSelected = mapColorShade === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setMapColorShade(opt.key)}
                        className={`p-3 rounded-xl transition-all cursor-pointer flex flex-col items-start gap-2 border text-left ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm shadow-indigo-600/30'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {opt.badge}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>

                        {/* Color preview swatches: TDP, JSP, YSRCP, BJP */}
                        <div className="flex items-center gap-1.5 w-full py-0.5">
                          {opt.previewColors.map((hex, i) => (
                            <span
                              key={i}
                              className="h-3 flex-1 rounded border border-black/10 shadow-2xs"
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>

                        <div>
                          <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {opt.label}
                          </div>
                          <div className={`text-[10px] ${isSelected ? 'text-indigo-100' : 'text-slate-500'} mt-0.5`}>
                            {opt.sub}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Tip: Press <kbd className="font-mono font-bold text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">Ctrl + K</kbd> to search 175 constituencies, castes, booths &amp; solvers.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('how-to-use')}
              className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
            >
              How-to-Use Guide
            </button>
            <button
              onClick={() => setActiveTab('display')}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Type className="w-3 h-3" />
              <span>Font Options</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
