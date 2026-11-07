import React from 'react';
import { Search, HelpCircle, Printer } from 'lucide-react';
import type { Year, ViewMode, DemographicsDataset, ElectionData, ActiveTab } from '../types';
import { useDashboard } from '../context/DashboardContext';

interface HeaderBarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedYear: Year;
  setSelectedYear: (year: Year) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  electionData: ElectionData | null;
  setSelectedAcNo?: (acNo: number) => void;
  onOpenDossier?: (acNo: number) => void;
  demographicsData?: DemographicsDataset | null;
  setIsExecutiveBriefingOpen?: (open: boolean) => void;
  onHelpOpen: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeTab,
  setActiveTab,
  selectedYear: _selectedYear,
  setSelectedYear: _setSelectedYear,
  viewMode: _viewMode,
  setViewMode: _setViewMode,
  electionData: _electionData,
  setSelectedAcNo: _setSelectedAcNo,
  onOpenDossier: _onOpenDossier,
  demographicsData: _demographicsData,
  setIsExecutiveBriefingOpen: _setIsExecutiveBriefingOpen,
  onHelpOpen,
}) => {
  const { setIsCommandPaletteOpen } = useDashboard();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-[1100] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 via-purple-600 to-blue-500 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-xs shrink-0">
              AP
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-tight">
                Andhra Pradesh Intelligence
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                175 Constituencies War Room
              </p>
            </div>
          </div>

          {/* Central tab switcher: Arranged in the logical campaign funnel (Results -> Simulations -> Playbook -> Reach -> Rolls) */}
          <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shadow-2xs gap-0.5">
            {/* 1. Results & Map */}
            <button
              onClick={() => setActiveTab('results')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-white text-indigo-700 shadow-xs font-black ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Historical Election Results & Choropleth Map"
            >
              <span>📊 Results &amp; Map</span>
            </button>

            {/* 2. Simulations (Forward Forecasts) */}
            <button
              onClick={() => setActiveTab('simulations')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'simulations'
                  ? 'bg-white text-indigo-700 shadow-xs font-black ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Chief Advisor What-If Scenarios & Assembly Majority Barometer"
            >
              <span>🔮 Simulations</span>
            </button>

            {/* 3. Playbook & Actions (Strategy & Allocation) */}
            <button
              onClick={() => setActiveTab('actions')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'actions'
                  ? 'bg-white text-indigo-700 shadow-xs font-black ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Campaign Playbook: Star Campaigners, Resource Allocator & Defection Modeler"
            >
              <span>🎯 Playbook &amp; Actions</span>
            </button>

            {/* 4. Voter Reach & Cadence (Audience & Messaging) */}
            <button
              onClick={() => setActiveTab('reach')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'reach'
                  ? 'bg-white text-indigo-700 shadow-xs font-black ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Statewide Caste & Age Micro-Targeting and 5-10 Touch Campaign Cadence"
            >
              <span>📢 Voter Reach</span>
            </button>

            {/* 5. Voter Rolls & Polling Stations (Ground Execution) */}
            <button
              onClick={() => setActiveTab('booth-data')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'booth-data'
                  ? 'bg-white text-indigo-700 shadow-xs font-black ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="E-Panna Sheet, Polling Station Triage & Padayatra Street Routes"
            >
              <span>📋 Voter Rolls</span>
            </button>
          </div>

          {/* Right side: Search, Print & Thorough Help Guide Trigger */}
          <div className="flex items-center gap-2">
            {/* Search Icon Trigger for Command Palette (Ctrl + K / /) */}
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer shadow-2xs active:scale-95"
              title="Search constituencies, castes, and tools (Ctrl + K / /)"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-slate-600" />
            </button>

            {/* Print / Save PDF Button */}
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-2xs active:scale-95 print:hidden"
              title="Print Page or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Thorough Help & Knowledge Base Modal Trigger */}
            <button
              onClick={onHelpOpen}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
              title="Comprehensive War Room Manual, Mandate Architecture, Demographic Playbooks & Tactical Solvers (?)"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span>Help &amp; Guides</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
