import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

// Andhra Pradesh 26 Reorganized Districts & Regional Division
export const AP_REGIONS = {
  coastal: {
    name: 'Coastal Andhra',
    seats: 123,
    districts: [
      'Srikakulam',
      'Parvathipuram Manyam',
      'Vizianagaram',
      'Visakhapatnam',
      'Alluri Sitharama Raju',
      'Anakapalli',
      'Kakinada',
      'East Godavari',
      'Dr. B.R. Ambedkar Konaseema',
      'West Godavari',
      'Eluru',
      'Krishna',
      'NTR',
      'Guntur',
      'Bapatla',
      'Palnadu',
      'Prakasam',
      'Nellore',
    ],
  },
  rayalaseema: {
    name: 'Rayalaseema',
    seats: 52,
    districts: [
      'Kurnool',
      'Nandyal',
      'Ananthapuramu',
      'Sri Sathya Sai',
      'YSR Kadapa',
      'Annamayya',
      'Tirupati',
      'Chittoor',
    ],
  },
};

interface DistrictFilterRibbonProps {
  onSelectDistrict?: (districtName: string) => void;
}

export const DistrictFilterRibbon: React.FC<DistrictFilterRibbonProps> = ({
  onSelectDistrict,
}) => {
  const { districtFilter, setDistrictFilter, showToast } = useDashboard();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSelect = (val: string) => {
    setDistrictFilter(val);
    if (onSelectDistrict) onSelectDistrict(val);
    showToast(val === 'ALL' ? 'Showing all 175 Constituencies' : `Filtered to ${val}`);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-2xs space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-md bg-indigo-50 text-indigo-600 border border-indigo-200">
            <Filter className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Regional Drilldown:
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Active: <strong className="text-indigo-700">{districtFilter}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleSelect('ALL')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              districtFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All AP (175 ACs)
          </button>

          <button
            onClick={() => handleSelect('COASTAL')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              districtFilter === 'COASTAL'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60'
            }`}
          >
            Coastal Andhra (123)
          </button>

          <button
            onClick={() => handleSelect('RAYALASEEMA')}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              districtFilter === 'RAYALASEEMA'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
            }`}
          >
            Rayalaseema (52)
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <span>26 Districts</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable 26 Districts Grid */}
      {isExpanded && (
        <div className="pt-2 border-t border-slate-100 space-y-2.5 animate-in fade-in duration-150">
          <div>
            <span className="text-[10px] font-mono uppercase font-black text-indigo-700 block mb-1">
              Coastal Andhra Districts:
            </span>
            <div className="flex flex-wrap gap-1">
              {AP_REGIONS.coastal.districts.map((d) => (
                <button
                  key={d}
                  onClick={() => handleSelect(d)}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    districtFilter === d
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {districtFilter === d && <Check className="w-3 h-3" />}
                  <span>{d}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase font-black text-amber-700 block mb-1">
              Rayalaseema Districts:
            </span>
            <div className="flex flex-wrap gap-1">
              {AP_REGIONS.rayalaseema.districts.map((d) => (
                <button
                  key={d}
                  onClick={() => handleSelect(d)}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer flex items-center gap-1 ${
                    districtFilter === d
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {districtFilter === d && <Check className="w-3 h-3" />}
                  <span>{d}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistrictFilterRibbon;
