import React from 'react';
import { ChevronRight, MapPin, Building2, Home } from 'lucide-react';
import type { ActiveTab } from '../../types';
import { useDashboard } from '../../context/DashboardContext';

interface GlobalBreadcrumbProps {
  activeTab: ActiveTab;
  selectedAcNo?: number | null;
  onSelectAc: (acNo: number) => void;
  allConstituencies?: { ac_no: number; ac_name: string; district: string }[];
  selectedBoothNo?: number;
  onSelectBooth?: (boothNo: number) => void;
  onSelectTab: (tab: ActiveTab) => void;
}

export const GlobalBreadcrumb: React.FC<GlobalBreadcrumbProps> = ({
  activeTab,
  selectedAcNo,
  onSelectAc,
  allConstituencies = [],
  selectedBoothNo,
  onSelectTab,
}) => {
  const { isPlainEnglish } = useDashboard();
  const currentAc = allConstituencies.find((c) => c.ac_no === selectedAcNo);

  const getTabLabel = (tab: ActiveTab) => {
    switch (tab) {
      case 'results':
        return isPlainEnglish ? 'Past Results & Map' : 'Results & Map';
      case 'simulations':
        return isPlainEnglish ? 'Forecasts & What-Ifs' : 'Simulations Barometer';
      case 'actions':
        return isPlainEnglish ? 'Strategy & Game Plan' : 'Playbook & Actions';
      case 'reach':
        return isPlainEnglish ? 'Who to Target' : 'Voter Reach & Cadence';
      case 'booth-data':
        return isPlainEnglish ? 'Voter Lists & Booths' : 'E-Panna & Polling Stations';
      default:
        return tab;
    }
  };

  // Group constituencies by district
  const districts = Array.from(new Set(allConstituencies.map((c) => c.district))).sort();
  const districtAcs = currentAc ? allConstituencies.filter((c) => c.district === currentAc.district) : [];

  return (
    <nav
      aria-label="Breadcrumb"
      className="bg-white/90 backdrop-blur-xs border-b border-slate-200/80 px-4 sm:px-6 py-1.5 text-xs text-slate-500 flex flex-wrap items-center gap-1.5 shadow-2xs"
    >
      {/* State Root */}
      <button
        onClick={() => onSelectTab('results')}
        className="flex items-center gap-1 font-bold text-slate-700 hover:text-indigo-600 cursor-pointer transition-colors"
      >
        <Home className="w-3.5 h-3.5 text-slate-400" />
        <span>Andhra Pradesh (175 ACs)</span>
      </button>

      <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />

      {/* District Dropdown Selector */}
      {currentAc && (
        <div className="flex items-center gap-1">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={currentAc.district}
            onChange={(e) => {
              const dist = e.target.value;
              const firstInDist = allConstituencies.find((c) => c.district === dist);
              if (firstInDist) onSelectAc(firstInDist.ac_no);
            }}
            className="bg-transparent font-semibold text-slate-700 hover:text-indigo-600 focus:outline-hidden cursor-pointer text-xs pr-1"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d} District
              </option>
            ))}
          </select>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
        </div>
      )}

      {/* Constituency Dropdown Selector */}
      {currentAc && (
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <select
            value={selectedAcNo || ''}
            onChange={(e) => onSelectAc(Number(e.target.value))}
            className="bg-indigo-50 border border-indigo-200 text-indigo-900 font-black rounded-md px-1.5 py-0.5 focus:outline-hidden cursor-pointer text-xs"
          >
            {districtAcs.map((c) => (
              <option key={c.ac_no} value={c.ac_no}>
                #{c.ac_no} {c.ac_name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Active Tab indicator */}
      <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
        {getTabLabel(activeTab)}
      </span>

      {/* Booth number badge if in booth tab */}
      {activeTab === 'booth-data' && selectedBoothNo && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
            Booth #{selectedBoothNo}
          </span>
        </>
      )}
    </nav>
  );
};

export default GlobalBreadcrumb;
