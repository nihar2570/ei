import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  MapPin,
  Sparkles,
  Target,
  Users,
  Calendar,
  Layers,
  ArrowRight,
  Sliders,
  AlertTriangle,
  RotateCcw,
  Maximize2,
  FileText,
  X,
} from 'lucide-react';
import type { ActiveTab } from '../../types';
import { useDashboard } from '../../context/DashboardContext';

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: ActiveTab) => void;
  onSelectAc: (acNo: number) => void;
  allConstituencies?: { ac_no: number; ac_name: string; district: string }[];
  onOpenBriefing?: () => void;
  onResetSimulations?: () => void;
}

interface CommandItem {
  id: string;
  category: 'Constituency' | 'Navigation' | 'Caste Demographic' | 'Actions & Tools';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onSelectAc,
  allConstituencies = [],
  onOpenBriefing,
  onResetSimulations,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { isPlainEnglish, setIsPlainEnglish, toggleZenMode, showToast } = useDashboard();

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const commands = useMemo<CommandItem[]>(() => {
    const list: CommandItem[] = [];

    // Tab Navigation Commands
    list.push(
      {
        id: 'nav-results',
        category: 'Navigation',
        title: isPlainEnglish ? '📊 Past Results & Map' : '📊 Assembly Results & Choropleth Map',
        subtitle: 'View historical 2014, 2019, 2024 mandates & constituency cards',
        icon: <Layers className="w-4 h-4 text-indigo-600" />,
        action: () => {
          onSelectTab('results');
          onClose();
        },
      },
      {
        id: 'nav-simulations',
        category: 'Navigation',
        title: isPlainEnglish ? '🔮 Election Forecasts & What-Ifs' : '🔮 Chief Advisor Simulations & Assembly Barometer',
        subtitle: 'Model coalition stress, caste swings, turnout, and battlegrounds',
        icon: <Sparkles className="w-4 h-4 text-purple-600" />,
        action: () => {
          onSelectTab('simulations');
          onClose();
        },
      },
      {
        id: 'nav-actions',
        category: 'Navigation',
        title: isPlainEnglish ? '🎯 Strategy & Field Game Plan' : '🎯 Playbook & Compounded Actions Engine',
        subtitle: 'Resource allocation points, Star Campaigner tours & Defections',
        icon: <Target className="w-4 h-4 text-emerald-600" />,
        action: () => {
          onSelectTab('actions');
          onClose();
        },
      },
      {
        id: 'nav-reach',
        category: 'Navigation',
        title: isPlainEnglish ? '📢 Who to Target (Voter Reach)' : '📢 Statewide Voter Reach & 5–10 Touch Cadence',
        subtitle: 'Caste × Age demographic cohorts and quantitative grievance salience',
        icon: <Users className="w-4 h-4 text-amber-600" />,
        action: () => {
          onSelectTab('reach');
          onClose();
        },
      },
      {
        id: 'nav-rolls',
        category: 'Navigation',
        title: isPlainEnglish ? '📋 Voter Lists & Booths' : '📋 E-Panna Rolls & Polling Station Explorer',
        subtitle: 'Booth triage, household clusters, onomastic caste & padayatra route planner',
        icon: <Calendar className="w-4 h-4 text-blue-600" />,
        action: () => {
          onSelectTab('booth-data');
          onClose();
        },
      }
    );

    // Quick Action Tools
    list.push(
      {
        id: 'tool-briefing',
        category: 'Actions & Tools',
        title: '📋 Executive Intelligence Briefing',
        subtitle: 'Open printable C-Suite Strategic Dossier & War Room memo',
        icon: <FileText className="w-4 h-4 text-indigo-600" />,
        action: () => {
          if (onOpenBriefing) onOpenBriefing();
          onClose();
        },
      },
      {
        id: 'tool-plain-english',
        category: 'Actions & Tools',
        title: isPlainEnglish ? '🎯 Switch to Campaign Strategist Jargon' : '🗣️ Switch to Plain English Mode (For Dummies)',
        subtitle: 'Toggle simplified terminology across the entire dashboard',
        icon: <Sliders className="w-4 h-4 text-amber-500" />,
        action: () => {
          setIsPlainEnglish((prev) => !prev);
          showToast(isPlainEnglish ? 'Switched to Campaign Strategist Mode' : 'Plain English Mode Activated!');
          onClose();
        },
      },
      {
        id: 'tool-zen',
        category: 'Actions & Tools',
        title: '🖥️ Toggle Fullscreen War Room Mode',
        subtitle: 'Maximize workspace for projection and presentations',
        icon: <Maximize2 className="w-4 h-4 text-sky-600" />,
        action: () => {
          toggleZenMode();
          onClose();
        },
      },
      {
        id: 'tool-defections',
        category: 'Actions & Tools',
        title: '⚡ MLA Floor-Crossing & Rebel Spoiler Modeler',
        subtitle: 'Simulate candidate defections and independent rebel vote splits',
        icon: <AlertTriangle className="w-4 h-4 text-rose-600" />,
        action: () => {
          onSelectTab('actions');
          onClose();
        },
      }
    );

    if (onResetSimulations) {
      list.push({
        id: 'tool-reset',
        category: 'Actions & Tools',
        title: '↺ Reset All Models to 2024 Actual Mandate',
        subtitle: 'Clear all simulated swings, defection events and point allocations',
        icon: <RotateCcw className="w-4 h-4 text-slate-500" />,
        action: () => {
          onResetSimulations();
          showToast('Reset all models to official 2024 results baseline');
          onClose();
        },
      });
    }

    // Caste Communities (1-click jump to Voter Reach)
    const castes = [
      { name: 'Kapu / Balija / Telaga / Munnuru Kapu', key: 'kapu' },
      { name: 'Kamma', key: 'kamma' },
      { name: 'Reddy', key: 'reddy' },
      { name: 'BC-A (Fisherfolk, Vaddera, Nayee)', key: 'bc_a' },
      { name: 'BC-B (Padmashali, Gowda, Dudekula)', key: 'bc_b' },
      { name: 'BC-D (Yadava, Kuruba, Koppula Velama)', key: 'bc_d' },
      { name: 'SC Madiga', key: 'sc_madiga' },
      { name: 'SC Mala', key: 'sc_mala' },
      { name: 'ST (Lambada, Koya, Yanadi)', key: 'st_tribal' },
      { name: 'Muslim Minorities', key: 'muslim' },
    ];

    castes.forEach((c) => {
      list.push({
        id: `caste-${c.key}`,
        category: 'Caste Demographic',
        title: `Target ${c.name} Voters`,
        subtitle: 'Analyze grievance impact and launch multi-channel ad cadence in Voter Reach',
        icon: <Users className="w-4 h-4 text-amber-500" />,
        action: () => {
          onSelectTab('reach');
          onClose();
        },
      });
    });

    // 175 Constituencies
    allConstituencies.forEach((ac) => {
      list.push({
        id: `ac-${ac.ac_no}`,
        category: 'Constituency',
        title: `#${ac.ac_no} ${ac.ac_name}`,
        subtitle: `${ac.district} District • Assembly Constituency`,
        icon: <MapPin className="w-4 h-4 text-indigo-500" />,
        action: () => {
          onSelectAc(ac.ac_no);
          onClose();
        },
      });
    });

    return list;
  }, [
    isPlainEnglish,
    allConstituencies,
    onSelectTab,
    onSelectAc,
    onOpenBriefing,
    onResetSimulations,
    setIsPlainEnglish,
    toggleZenMode,
    showToast,
    onClose,
  ]);

  // Filter commands by search query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) {
      return commands.slice(0, 15);
    }
    const q = query.toLowerCase().trim();
    return commands.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.subtitle && c.subtitle.toLowerCase().includes(q)) ||
        c.category.toLowerCase().includes(q)
    ).slice(0, 20);
  }, [commands, query]);

  // Keyboard navigation inside list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-start justify-center pt-20 sm:pt-28 px-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-slate-200 flex items-center px-4 bg-slate-50/50">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search constituency (e.g. Kuppam, 175), caste, tab, or action..."
            className="w-full px-3 py-3.5 bg-transparent text-sm text-slate-900 font-semibold focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[10px] font-mono bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase ml-2 shrink-0">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div ref={listRef} className="overflow-y-auto p-2 space-y-1 flex-1">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-1">
              <Search className="w-6 h-6 mx-auto stroke-1 text-slate-300" />
              <p className="text-xs font-semibold">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-[11px] text-slate-400">Try searching by AC name, number, or caste community.</p>
            </div>
          ) : (
            filteredCommands.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                    isSelected ? 'bg-indigo-600 text-white shadow-xs' : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`p-2 rounded-lg shrink-0 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100'}`}>
                      {item.icon}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {item.title}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-black shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200/70 text-slate-600'
                          }`}
                        >
                          {item.category}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]">↑</kbd>{' '}
              <kbd className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]">↵</kbd> to select
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {filteredCommands.length} matches
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPaletteModal;
