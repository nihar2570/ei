import React, { useState, useMemo } from 'react';
import type { ConstituencyCandidatesData, DemographicsDataset, ElectionData } from '../types';
import {
  ExternalLink,
  Award,
  Building2,
  FileText,
  PieChart,
  Flame,
  MapPin,
  ArrowLeft,
} from 'lucide-react';
import { CONSTITUENCY_MANDALS } from '../data/mandalData';
import { FORM_20_URLS } from '../data/form20Urls';
import { CONSTITUENCY_TOPICS } from '../data/constituencyTopics';
import { BoothPannaDeficitSolver } from './BoothPannaDeficitSolver';
import { CandidateRosterTab } from './dossier/CandidateRosterTab';
import { MandalBreakdownTab } from './dossier/MandalBreakdownTab';
import { DemographicsProfileTab } from './dossier/DemographicsProfileTab';
import { ConstituencyTopicsTab } from './dossier/ConstituencyTopicsTab';
import { FloatingSideNav, type NavSection } from './common/FloatingSideNav';

const DOSSIER_SECTIONS: NavSection[] = [
  { id: 'candidates', label: 'Candidates & ADR', shortLabel: 'Candidates', icon: <Award className="w-4 h-4" /> },
  { id: 'mandals', label: 'Mandals & Circles', shortLabel: 'Mandals', icon: <Building2 className="w-4 h-4" /> },
  { id: 'booths', label: 'Polling Stations', shortLabel: 'Booths', icon: <MapPin className="w-4 h-4" /> },
  { id: 'demographics', label: 'Demographics Profile', shortLabel: 'Demographics', icon: <PieChart className="w-4 h-4" /> },
  { id: 'topics', label: 'Key Issues', shortLabel: 'Issues', icon: <Flame className="w-4 h-4" /> },
];

interface ConstituencyDossierProps {
  data: ConstituencyCandidatesData | null;
  isOpen?: boolean;
  onClose: () => void;
  demographicsData?: DemographicsDataset | null;
  geoJsonData?: any;
  onSelectAc?: (acNo: number) => void;
  allConstituencies?: { ac_no: number; ac_name: string; district: string }[];
  electionData?: ElectionData | null;
  onNavigateToBoothData?: (acNo: number, boothNo?: number, viewMode?: string) => void;
}

export const ConstituencyDossier: React.FC<ConstituencyDossierProps> = ({
  data,
  isOpen = true,
  onClose,
  demographicsData,
  geoJsonData,
  onSelectAc,
  allConstituencies,
  electionData,
  onNavigateToBoothData,
}) => {
  const [dossierTab, setDossierTab] = useState<'candidates' | 'mandals' | 'booths' | 'demographics' | 'topics'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'mandals' || tabParam === 'booths' || tabParam === 'demographics' || tabParam === 'topics') {
        return tabParam;
      }
    }
    return 'candidates';
  });
  const [isBoothMapOnly, setIsBoothMapOnly] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') === 'booth-map';
    }
    return false;
  });

  const handleExitBoothMapOnly = () => {
    setIsBoothMapOnly(false);
    setDossierTab('booths');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('view');
      url.searchParams.set('tab', 'booths');
      window.history.replaceState({}, '', url.pathname + url.search);
    }
  };

  const handleTabChange = (tab: 'candidates' | 'mandals' | 'booths' | 'demographics' | 'topics') => {
    setDossierTab(tab);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url.pathname + url.search);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [minVotes, setMinVotes] = useState<number>(1000);
  const [topLimit, setTopLimit] = useState<number | 'ALL'>('ALL');
  const [filterMode, setFilterMode] = useState<'1000' | '5000' | 'all'>('1000');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Column visibility toggles
  const [showAge, setShowAge] = useState<boolean>(true);
  const [showEducation, setShowEducation] = useState<boolean>(true);
  const [showCriminalCases, setShowCriminalCases] = useState<boolean>(true);
  const [showNetWorth, setShowNetWorth] = useState<boolean>(true);

  // Handle filter preset change
  const handleFilterPreset = (preset: '1000' | '5000' | 'all') => {
    setFilterMode(preset);
    if (preset === '1000') {
      setMinVotes(1000);
    } else if (preset === '5000') {
      setMinVotes(5000);
    } else if (preset === 'all') {
      setMinVotes(0);
    }
  };

  // Filtered and sorted candidate roster
  const filteredCandidates = useMemo(() => {
    if (!data || !data.candidates) return [];
    let list = [...data.candidates];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.party.toLowerCase().includes(q) ||
          c.raw_party.toLowerCase().includes(q)
      );
    }

    list = list.filter((c) => c.votes >= minVotes || c.is_nota);

    if (topLimit !== 'ALL') {
      list = list.slice(0, topLimit);
    }

    return list;
  }, [data, minVotes, topLimit, searchQuery]);

  // Mandal & Booth Level Breakdown Data
  const mandals = useMemo(() => {
    if (!data) return [];
    return CONSTITUENCY_MANDALS[data.ac_no] || [];
  }, [data]);

  const mandalTotals = useMemo(() => {
    const totalBooths = mandals.reduce((sum, m) => sum + (m.booths || 0), 0);
    const totalElectorate =
      data?.voters_info?.electors_total ||
      mandals.reduce((sum, m) => sum + (m.electorate || 0), 0);
    const avgTurnout =
      data?.voters_info?.turnout_pct !== undefined
        ? String(data.voters_info.turnout_pct)
        : mandals.length > 0
        ? (mandals.reduce((sum, m) => sum + (m.turnout_pct || 0), 0) / mandals.length).toFixed(1)
        : '0.0';
    return { totalBooths, totalElectorate, avgTurnout };
  }, [mandals, data?.voters_info]);

  const [mandalSearch, setMandalSearch] = useState('');
  const filteredMandals = useMemo(() => {
    if (!mandalSearch.trim()) return mandals;
    const q = mandalSearch.toLowerCase();
    return mandals.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.lead_party?.toLowerCase().includes(q) ||
        m.dominant_caste?.toLowerCase().includes(q)
    );
  }, [mandals, mandalSearch]);

  // AC Demographics & Key Topics hooks
  const acDemographics = useMemo(() => {
    if (!data || !demographicsData?.constituencies) return null;
    return demographicsData.constituencies[String(data.ac_no)] || null;
  }, [data, demographicsData]);

  const acTopics = useMemo(() => {
    if (!data) return null;
    return CONSTITUENCY_TOPICS[data.ac_no] || null;
  }, [data]);

  const demographicSummary = useMemo(() => {
    if (!acDemographics?.caste_profile) return null;
    const cp = acDemographics.caste_profile;
    const bcTotal = Number((
      (cp.bc_turpu_kapu || 0) +
      (cp.bc_yadava || cp.bc_yadav || 0) +
      (cp.bc_kuruba_boya || 0) +
      (cp.bc_settibalija_goud || cp.bc_goud || 0) +
      (cp.bc_padmashali || 0) +
      (cp.bc_mudiraj || 0) +
      (cp.bc_munnuru_kapu || 0) +
      (cp.bc_other || 0)
    ).toFixed(1));

    const scTotal = Number((
      (cp.sc_madiga_relli || cp.sc_madiga || 0) +
      (cp.sc_mala || 0)
    ).toFixed(1));

    const stTotal = Number((
      (cp.st_tribal || cp.st_lambada || 0) +
      (cp.st_koya_gond || 0)
    ).toFixed(1));

    const minorityTotal = Number((
      (cp.minority_muslim || 0) +
      (cp.minority_christian || 0)
    ).toFixed(1));

    const ocTotal = Number((
      (cp.kapu || 0) +
      (cp.kamma || 0) +
      (cp.reddy || cp.oc_reddy || 0) +
      (cp.oc_velama || 0) +
      (cp.oc_other || 0)
    ).toFixed(1));

    const COMM_META: Record<string, { name: string; category: string; color: string; bg: string }> = {
      bc_turpu_kapu: { name: 'BC Turpu Kapu', category: 'Backward Classes', color: '#0284c7', bg: '#e0f2fe' },
      bc_yadava: { name: 'BC Yadava / Golla', category: 'Backward Classes', color: '#0369a1', bg: '#e0f2fe' },
      bc_kuruba_boya: { name: 'BC Kuruba / Boya', category: 'Backward Classes', color: '#0284c7', bg: '#e0f2fe' },
      bc_settibalija_goud: { name: 'BC Settibalija / Goud', category: 'Backward Classes', color: '#0ea5e9', bg: '#e0f2fe' },
      bc_padmashali: { name: 'BC Padmashali', category: 'Backward Classes', color: '#06b6d4', bg: '#cffafe' },
      bc_other: { name: 'Other BCs', category: 'Backward Classes', color: '#64748b', bg: '#f1f5f9' },
      sc_madiga_relli: { name: 'SC Madiga / Relli', category: 'Scheduled Castes', color: '#6366f1', bg: '#ede9fe' },
      sc_mala: { name: 'SC Mala', category: 'Scheduled Castes', color: '#7c3aed', bg: '#ede9fe' },
      st_tribal: { name: 'ST Tribals (Sugali / Agency)', category: 'Scheduled Tribes', color: '#d97706', bg: '#fef3c7' },
      kapu: { name: 'Kapu / Balija / Telaga', category: 'Open Categories', color: '#e11d48', bg: '#ffe4e6' },
      kamma: { name: 'Kamma', category: 'Open Categories', color: '#be123c', bg: '#ffe4e6' },
      reddy: { name: 'Reddy', category: 'Open Categories', color: '#9f1239', bg: '#ffe4e6' },
      minority_muslim: { name: 'Muslim Minorities', category: 'Religious Minorities', color: '#16a34a', bg: '#dcfce7' },
      minority_christian: { name: 'Christian Minorities', category: 'Religious Minorities', color: '#059669', bg: '#d1fae5' },
    };

    const sortedCommunities = Object.entries(cp)
      .map(([key, pct]) => {
        let meta = COMM_META[key];
        if (!meta) {
          const formattedName = key
            .split('_')
            .map((w) => {
              const low = w.toLowerCase();
              if (['bc', 'sc', 'st', 'oc'].includes(low)) return low.toUpperCase();
              return w.charAt(0).toUpperCase() + w.slice(1);
            })
            .join(' ');
          let cat = 'Open Categories';
          let col = '#e11d48';
          let bgCol = '#ffe4e6';
          if (key.startsWith('bc_')) {
            cat = 'Backward Classes';
            col = '#0284c7';
            bgCol = '#e0f2fe';
          } else if (key.startsWith('sc_')) {
            cat = 'Scheduled Castes';
            col = '#6366f1';
            bgCol = '#ede9fe';
          } else if (key.startsWith('st_')) {
            cat = 'Scheduled Tribes';
            col = '#d97706';
            bgCol = '#fef3c7';
          } else if (key.includes('minority') || key.includes('muslim') || key.includes('christian')) {
            cat = 'Religious Minorities';
            col = '#16a34a';
            bgCol = '#dcfce7';
          }
          meta = { name: formattedName, category: cat, color: col, bg: bgCol };
        }
        return {
          key,
          pct: Number(pct.toFixed(2)),
          meta,
        };
      })
      .sort((a, b) => b.pct - a.pct);

    const dominant = sortedCommunities[0];

    return {
      bcTotal,
      scTotal,
      stTotal,
      minorityTotal,
      ocTotal,
      sortedCommunities,
      dominant,
    };
  }, [acDemographics]);

  if (!isOpen || !data || !data.candidates) return null;

  const form20Url = FORM_20_URLS[data.ac_no];
  const winner = data.candidates[0];
  const runnerUp = data.candidates[1];
  const margin = winner && runnerUp ? (winner.votes || 0) - (runnerUp.votes || 0) : 0;
  const marginPct =
    winner && runnerUp && data.total_valid_votes > 0
      ? ((margin / data.total_valid_votes) * 100).toFixed(2)
      : '0.00';

  const electorateBase =
    mandalTotals.totalElectorate > 0
      ? mandalTotals.totalElectorate
      : data.total_valid_votes > 0
      ? Math.round(data.total_valid_votes / 0.72)
      : 220000;

  // ADR Aggregate Statistics for candidates in this AC
  const adrStats = data.candidates.reduce(
    (acc, c) => {
      if (c.myneta) {
        acc.totalCriminalCases += c.myneta.criminal_cases || 0;
        if ((c.myneta.criminal_cases || 0) > 0) acc.candidatesWithCases += 1;
        if (c.myneta.is_crorepati) acc.crorepatiCount += 1;
        if ((c.myneta.total_assets || 0) > acc.maxAssets) {
          acc.maxAssets = c.myneta.total_assets || 0;
          acc.maxAssetCand = c.name;
          acc.maxAssetFormatted = c.myneta.total_assets_formatted || '₹0';
        }
      }
      return acc;
    },
    {
      totalCriminalCases: 0,
      candidatesWithCases: 0,
      crorepatiCount: 0,
      maxAssets: 0,
      maxAssetCand: '',
      maxAssetFormatted: '₹0',
    }
  );

  const dossierTabsAndContent = (
    <>
      {/* Sticky Dossier Section Tabs */}
      <nav className="sticky top-[53px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleTabChange('candidates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                dossierTab === 'candidates'
                  ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-200 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-indigo-600" />
              <span>Candidates &amp; ADR ({data.candidates.length})</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('mandals')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                dossierTab === 'mandals'
                  ? 'bg-amber-50 text-amber-700 shadow-xs border border-amber-200 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Mandals &amp; Circles ({mandals.length})</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('booths')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                dossierTab === 'booths'
                  ? 'bg-emerald-50 text-emerald-700 shadow-xs border border-emerald-200 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Polling Stations ({mandalTotals.totalBooths})</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('demographics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                dossierTab === 'demographics'
                  ? 'bg-cyan-50 text-cyan-700 shadow-xs border border-cyan-200 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PieChart className="w-3.5 h-3.5 text-cyan-600" />
              <span>Demographics (Caste &amp; Age)</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('topics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                dossierTab === 'topics'
                  ? 'bg-rose-50 text-rose-700 shadow-xs border border-rose-200 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              <span>Key Issues</span>
              {acTopics && (
                <span className="text-[10px] bg-rose-100 text-rose-700 border border-rose-200 px-1.5 py-0.2 rounded font-mono font-bold">
                  {acTopics.key_issues.length}
                </span>
              )}
            </button>
          </div>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            AC #{data.ac_no} {data.ac_name}
          </span>
        </div>
      </nav>

      {/* Dossier Content Container */}
      <main id="dossier-tab-content" className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 pb-16 space-y-5">
        {/* TAB 1: CANDIDATES & ADR PROFILE */}
        {dossierTab === 'candidates' && (
          <CandidateRosterTab
            data={data}
            electionData={electionData}
            winner={winner}
            margin={margin}
            marginPct={marginPct}
            adrStats={adrStats}
            filterMode={filterMode}
            handleFilterPreset={handleFilterPreset}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            topLimit={topLimit}
            setTopLimit={setTopLimit}
            filteredCandidates={filteredCandidates}
            showAge={showAge}
            setShowAge={setShowAge}
            showEducation={showEducation}
            setShowEducation={setShowEducation}
            showCriminalCases={showCriminalCases}
            setShowCriminalCases={setShowCriminalCases}
            showNetWorth={showNetWorth}
            setShowNetWorth={setShowNetWorth}
            setMinVotes={setMinVotes}
          />
        )}

        {/* TAB 2: MANDAL & POLLING BOOTH DRILLDOWN */}
        {dossierTab === 'mandals' && (
          <MandalBreakdownTab
            data={data}
            mandals={mandals}
            filteredMandals={filteredMandals}
            mandalTotals={mandalTotals}
            mandalSearch={mandalSearch}
            setMandalSearch={setMandalSearch}
            form20Url={form20Url}
            setDossierTab={setDossierTab}
            onNavigateToBoothData={onNavigateToBoothData}
          />
        )}

        {/* TAB 3: POLLING STATIONS & FORM-20 TRIAGE */}
        {dossierTab === 'booths' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <BoothPannaDeficitSolver
              acNo={data.ac_no}
              acName={data.ac_name}
              district={data.district}
              mandals={mandals}
              totalValidVotes={data.total_valid_votes}
              winnerParty={data.candidates[0]?.party || 'TDP'}
              winnerCandidate={data.candidates[0]?.name || 'Winner'}
              winnerVotes={data.candidates[0]?.votes || 0}
              runnerParty={data.candidates[1]?.party || 'YSRCP'}
              runnerCandidate={data.candidates[1]?.name || 'Runner-up'}
              runnerVotes={data.candidates[1]?.votes || 0}
              geoJsonData={geoJsonData}
              onNavigateToBoothData={onNavigateToBoothData}
            />
          </div>
        )}

        {/* TAB 4: DEMOGRAPHICS & CASTE PROFILE */}
        {dossierTab === 'demographics' && (
          <DemographicsProfileTab
            acDemographics={acDemographics}
            demographicSummary={demographicSummary}
            electorateBase={electorateBase}
          />
        )}

        {/* TAB 5: KEY TOPICS & LOCAL ISSUES */}
        {dossierTab === 'topics' && (
          <ConstituencyTopicsTab
            data={data}
            acTopics={acTopics}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            Data Sources: Election Commission of India (ECI Form 20) &middot; Association for Democratic Reforms (ADR) &middot; DES Andhra Pradesh (Demographics Profile)
          </div>
          <div className="text-slate-400">
            Andhra Pradesh Assembly Constituency Intelligence Dossier
          </div>
        </div>
      </footer>
    </>
  );

  if (isBoothMapOnly) {
    return (
      <div className="h-screen w-full bg-slate-100 text-slate-900 flex flex-col font-sans overflow-hidden">
        {/* Standalone Map Sticky Navbar */}
        <header className="shrink-0 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-slate-900 shadow-xs">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleExitBoothMapOnly}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-semibold border border-slate-300 transition-all cursor-pointer shadow-2xs"
              title={`Return to AC #${data.ac_no} Dossier`}
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600" />
              <span>Back to AC #{data.ac_no} Dossier</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-medium hover:underline transition-all cursor-pointer"
              title="Return to State Map and Election Dashboard"
            >
              <span>State Overview</span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-indigo-600 text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-md">
                AC #{data.ac_no}
              </span>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900">{data.ac_name}</h1>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 font-medium">
                {data.district} District
              </span>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                🗺️ Polling Station Geospatial &amp; Field Triage Map
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {allConstituencies && allConstituencies.length > 0 && onSelectAc && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 hidden sm:inline">Constituency:</span>
                <select
                  value={data.ac_no}
                  onChange={(e) => onSelectAc(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden font-medium cursor-pointer shadow-2xs"
                >
                  {allConstituencies.map((c) => (
                    <option key={c.ac_no} value={c.ac_no}>
                      #{c.ac_no} {c.ac_name} ({c.district})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {form20Url && (
              <a
                href={form20Url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs"
                title="View Certified Official Form-20 Polling Station PDF from CEO Andhra Pradesh"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Official</span> Form-20 PDF
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </a>
            )}
          </div>
        </header>

        {/* Full Page Body with Only the Map Box */}
        <main className="w-full flex-1 flex flex-col p-2 sm:p-3 min-h-0 overflow-hidden">
          <BoothPannaDeficitSolver
            acNo={data.ac_no}
            acName={data.ac_name}
            district={data.district}
            mandals={mandals}
            totalValidVotes={data.total_valid_votes}
            winnerParty={data.candidates[0]?.party || 'TDP'}
            winnerCandidate={data.candidates[0]?.name || 'Winner'}
            winnerVotes={data.candidates[0]?.votes || 0}
            runnerParty={data.candidates[1]?.party || 'YSRCP'}
            runnerCandidate={data.candidates[1]?.name || 'Runner-up'}
            runnerVotes={data.candidates[1]?.votes || 0}
            geoJsonData={geoJsonData}
            standaloneMapOnly={true}
            onNavigateToBoothData={onNavigateToBoothData}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-100/90 text-slate-800 flex flex-col font-sans">
      {/* Quick-Jump Floating Side Navigation for Constituency Dossier */}
      <FloatingSideNav
        sections={DOSSIER_SECTIONS}
        navTitle="DOSSIER"
        activeSectionId={dossierTab}
        onSelectSection={(k) => handleTabChange(k as any)}
      />

      {/* Full Page Sticky Navbar */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-slate-900">
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-lg text-xs font-semibold border border-slate-300 transition-all cursor-pointer shadow-2xs"
              title="Return to State Map and Election Dashboard"
            >
              <ArrowLeft className="w-4 h-4 text-indigo-600" />
              <span>Back to State Overview</span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-indigo-600 text-white font-mono font-bold text-xs px-2.5 py-0.5 rounded-md">
                AC #{data.ac_no}
              </span>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-900">{data.ac_name}</h1>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200 font-medium">
                {data.district} District
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full border border-slate-200">
                LS: {data.pc_name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {allConstituencies && allConstituencies.length > 0 && onSelectAc && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 hidden sm:inline">Constituency:</span>
                <select
                  value={data.ac_no}
                  onChange={(e) => onSelectAc(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-hidden font-medium cursor-pointer shadow-2xs"
                >
                  {allConstituencies.map((c) => (
                    <option key={c.ac_no} value={c.ac_no}>
                      #{c.ac_no} {c.ac_name} ({c.district})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {form20Url && (
              <a
                href={form20Url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-xs"
                title="View Certified Official Form-20 Polling Station PDF from CEO Andhra Pradesh"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Form-20 PDF</span>
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </a>
            )}
          </div>
        </div>
      </header>

      {dossierTabsAndContent}
    </div>
  );
};
