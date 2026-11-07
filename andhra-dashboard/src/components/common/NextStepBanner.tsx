import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ActiveTab } from '../../types';
import { useDashboard } from '../../context/DashboardContext';

interface NextStepBannerProps {
  currentTab: ActiveTab;
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenBriefing?: () => void;
}

export const NextStepBanner: React.FC<NextStepBannerProps> = ({
  currentTab,
  onNavigateTab,
  onOpenBriefing,
}) => {
  const { isPlainEnglish } = useDashboard();

  const getStepInfo = () => {
    switch (currentTab) {
      case 'results':
        return {
          stepNum: 'Step 1 of 5 Completed',
          heading: isPlainEnglish ? 'Understood the past results? Now forecast the next election!' : 'Baseline Mandate Verified: Ready for Forward Projections',
          subtext: isPlainEnglish
            ? 'Test how caste voting changes, new alliances, or wave swings alter the assembly majority mark.'
            : 'Simulate coalition stress, demographic swing matrices, and identify vulnerable battlegrounds in the Simulation Suite.',
          buttonText: isPlainEnglish ? 'Go to Forecasts & What-Ifs' : 'Launch Simulation Suite',
          targetTab: 'simulations' as ActiveTab,
          isBriefing: false,
        };
      case 'simulations':
        return {
          stepNum: 'Step 2 of 5 Completed',
          heading: isPlainEnglish ? 'Forecasts ready! Now build your winning strategy.' : 'Simulation Scenario Formulated: Ready for Tactical Interventions',
          subtext: isPlainEnglish
            ? 'Allocate campaign points, deploy star campaigners to close seats, and model party defections.'
            : 'Compound baseline simulation swings with ground action point allocations, leadership tours, and rebel modelers.',
          buttonText: isPlainEnglish ? 'Go to Strategy & Game Plan' : 'Open Strategic Playbook',
          targetTab: 'actions' as ActiveTab,
          isBriefing: false,
        };
      case 'actions':
        return {
          stepNum: 'Step 3 of 5 Completed',
          heading: isPlainEnglish ? 'Plan ready! Now target the exact voters to persuade.' : 'Resource Priorities Set: Ready for Demographic Messaging',
          subtext: isPlainEnglish
            ? 'Find out which caste communities and age groups swing, and launch a 5 to 10 touch ad campaign.'
            : 'Examine quantitative grievance weights by community and plan multi-touch digital, IVR & door-to-door cadences.',
          buttonText: isPlainEnglish ? 'Go to Who to Target' : 'Explore Voter Reach & Cadence',
          targetTab: 'reach' as ActiveTab,
          isBriefing: false,
        };
      case 'reach':
        return {
          stepNum: 'Step 4 of 5 Completed',
          heading: isPlainEnglish ? 'Target audience locked! Now inspect their polling booths.' : 'Audience Profile Finalized: Ready for Polling Station Triage',
          subtext: isPlainEnglish
            ? 'Look up individual polling booths, door-to-door padayatra routes, and voter lists page-by-page.'
            : 'Inspect 175-AC polling station rosters, onomastic caste classifications, and padayatra street itineraries.',
          buttonText: isPlainEnglish ? 'Go to Voter Lists & Booths' : 'Open E-Panna Rolls & Polling Stations',
          targetTab: 'booth-data' as ActiveTab,
          isBriefing: false,
        };
      case 'booth-data':
        return {
          stepNum: 'Step 5 of 5 Completed',
          heading: isPlainEnglish ? 'War room review complete! Export your final briefing.' : 'Campaign Funnel Complete: Generate Executive Strategy Dossier',
          subtext: isPlainEnglish
            ? 'Create a clean, printable 1-page briefing note for leadership and candidates.'
            : 'Compile the complete C-Suite Executive Intelligence Briefing with battleground priorities and coalition buffers.',
          buttonText: 'Export Executive Briefing',
          targetTab: 'results' as ActiveTab,
          isBriefing: true,
        };
    }
  };

  const info = getStepInfo();

  return (
    <aside
      aria-label="Workflow recommendation"
      className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-indigo-900/60 shadow-lg mt-8 mb-4 relative overflow-hidden"
    >
      <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-amber-400" />
              {info.stepNum}
            </span>
            <span className="text-xs text-indigo-300 font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Recommended Next Action
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
            {info.heading}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {info.subtext}
          </p>
        </div>

        <button
          onClick={() => {
            if (info.isBriefing && onOpenBriefing) {
              onOpenBriefing();
            } else {
              onNavigateTab(info.targetTab);
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer group shrink-0"
        >
          <span>{info.buttonText}</span>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </aside>
  );
};

export default NextStepBanner;
