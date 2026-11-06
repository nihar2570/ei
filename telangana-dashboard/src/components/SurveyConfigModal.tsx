import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  X,
  ClipboardList,
  RotateCcw,
  Download,
  Upload,
  CheckCircle,
  Copy,
  Info,
  Check,
  Search,
  AlertCircle,
} from 'lucide-react';
import type {
  CasteSurveyDefinition,
  CasteCommunityKey,
} from '../data/surveys/types';
import {
  ALL_CASTE_COMMUNITIES,
  BASELINE_2023_EXIT_POLL_CASTES,
} from '../data/surveys/types';
import {
  getAllSurveys,
  saveSurveyConfig,
  resetSurveyToBuiltin,
  exportSurveyToJson,
  importSurveyFromJson,
  calculateProjectedShares,
} from '../data/surveys';

interface SurveyConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSurveyId?: string;
  onApplySurvey: (survey: CasteSurveyDefinition) => void;
}

export const SurveyConfigModal: React.FC<SurveyConfigModalProps> = ({
  isOpen,
  onClose,
  activeSurveyId,
  onApplySurvey,
}) => {
  const [allSurveys, setAllSurveys] = useState<CasteSurveyDefinition[]>(() => getAllSurveys());
  const [selectedId, setSelectedId] = useState<string>(() => {
    if (activeSurveyId && allSurveys.some((s) => s.id === activeSurveyId)) {
      return activeSurveyId;
    }
    return allSurveys[0]?.id || 'survey_peoples_pulse';
  });

  // Current survey being viewed and edited
  const [currentSurvey, setCurrentSurvey] = useState<CasteSurveyDefinition>(() => {
    const match = allSurveys.find((s) => s.id === selectedId) || allSurveys[0];
    return JSON.parse(JSON.stringify(match));
  });

  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'BC' | 'SC_ST' | 'OC_MIN'>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync when activeSurveyId changes or modal opens
  useEffect(() => {
    if (isOpen) {
      const refreshed = getAllSurveys();
      setAllSurveys(refreshed);
      const targetId =
        activeSurveyId && refreshed.some((s) => s.id === activeSurveyId)
          ? activeSurveyId
          : selectedId;
      setSelectedId(targetId);
      const match = refreshed.find((s) => s.id === targetId) || refreshed[0];
      if (match) {
        setCurrentSurvey(JSON.parse(JSON.stringify(match)));
      }
    }
  }, [isOpen, activeSurveyId]);

  // When selectedId changes, switch current survey
  const handleSelectSurveyId = (id: string) => {
    setSelectedId(id);
    const match = allSurveys.find((s) => s.id === id);
    if (match) {
      setCurrentSurvey(JSON.parse(JSON.stringify(match)));
      showToast(`Loaded ${match.name}`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const showError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 4000);
  };

  // Modify swing for a specific caste community
  const handleSwingChange = (
    key: CasteCommunityKey,
    party: 'INC' | 'BRS' | 'BJP',
    val: number
  ) => {
    setCurrentSurvey((prev) => {
      const updated = { ...prev };
      const currentSwings = { ...updated.swings };
      const currentComm = { ...(currentSwings[key] || { INC: 0, BRS: 0, BJP: 0 }) };
      currentComm[party] = Math.round(val * 10) / 10;
      currentSwings[key] = currentComm;
      updated.swings = currentSwings;
      return updated;
    });
  };

  // Zero-sum balance a caste community swing so INC + BRS + BJP net shift is zero
  const handleAutoBalance = (key: CasteCommunityKey) => {
    const sw = currentSurvey.swings[key] || { INC: 0, BRS: 0, BJP: 0 };
    const sum = sw.INC + sw.BRS + sw.BJP;
    if (Math.abs(sum) < 0.05) return;

    // Distribute negative offset equally to non-zero or remaining parties
    const offset = sum / 3;
    setCurrentSurvey((prev) => {
      const updated = { ...prev };
      const currentSwings = { ...updated.swings };
      currentSwings[key] = {
        INC: Math.round((sw.INC - offset) * 10) / 10,
        BRS: Math.round((sw.BRS - offset) * 10) / 10,
        BJP: Math.round((sw.BJP - offset) * 10) / 10,
      };
      updated.swings = currentSwings;
      return updated;
    });
    showToast(`Balanced net swing for ${key}`);
  };

  // Reset current survey to its original agency defaults
  const handleResetToAgencyDefault = () => {
    const defaultSurvey = resetSurveyToBuiltin(currentSurvey.id);
    if (defaultSurvey) {
      setCurrentSurvey(JSON.parse(JSON.stringify(defaultSurvey)));
      const refreshed = getAllSurveys();
      setAllSurveys(refreshed);
      showToast(`Reset ${defaultSurvey.name} to official agency baseline.`);
    }
  };

  // Save changes & apply to parent simulation
  const handleApplyAndRun = () => {
    saveSurveyConfig(currentSurvey);
    const refreshed = getAllSurveys();
    setAllSurveys(refreshed);
    onApplySurvey(currentSurvey);
    onClose();
  };

  // Export JSON file download
  const handleExportJson = () => {
    try {
      const jsonStr = exportSurveyToJson(currentSurvey);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentSurvey.id}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Survey JSON downloaded to your computer');
    } catch (err: any) {
      showError(err.message || 'Failed to export survey JSON');
    }
  };

  // Import JSON file
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const imported = importSurveyFromJson(text);
        saveSurveyConfig(imported);
        const refreshed = getAllSurveys();
        setAllSurveys(refreshed);
        setSelectedId(imported.id);
        setCurrentSurvey(imported);
        showToast(`Successfully loaded "${imported.name}" from JSON`);
      } catch (err: any) {
        showError(err.message || 'Invalid survey JSON file');
      }
    };
    reader.readAsText(file);
    // Reset file input value so same file can be selected again
    e.target.value = '';
  };

  // Copy JSON to clipboard
  const handleCopyJson = () => {
    try {
      const jsonStr = exportSurveyToJson(currentSurvey);
      navigator.clipboard.writeText(jsonStr);
      showToast('Survey JSON copied to clipboard');
    } catch {
      showError('Failed to copy to clipboard');
    }
  };

  // Filtered caste communities
  const filteredCommunities = useMemo(() => {
    return ALL_CASTE_COMMUNITIES.filter((c) => {
      if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        return (
          c.label.toLowerCase().includes(q) ||
          c.subCategory.toLowerCase().includes(q) ||
          c.decisiveRegions.toLowerCase().includes(q) ||
          c.politicalContext.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [categoryFilter, searchTerm]);

  // Projected vote shares
  const projectedShares = useMemo(() => {
    return calculateProjectedShares(currentSurvey.swings);
  }, [currentSurvey.swings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900 my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header Bar */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 shadow-xs">
              <ClipboardList className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider font-mono text-indigo-300">
                  Caste Demographics Studio
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold px-2 py-0.5 rounded-full">
                  100% Pure Caste Data
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                Pre-Filled Surveys &amp; Caste Configuration Engine
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alerts */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              {toastMessage}
            </span>
            <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
        {errorToast && (
          <div className="bg-rose-600 text-white text-xs font-bold px-4 py-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              {errorToast}
            </span>
            <button onClick={() => setErrorToast(null)} className="text-rose-200 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Survey Tabs / Selector Ribbon */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-thin">
            <span className="text-xs font-black text-slate-600 uppercase tracking-wider mr-1 shrink-0">
              Agency Polls:
            </span>
            {allSurveys.map((survey) => {
              const isSelected = survey.id === selectedId;
              return (
                <button
                  key={survey.id}
                  onClick={() => handleSelectSurveyId(survey.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs ring-2 ring-indigo-400/40'
                      : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{survey.shortLabel}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 text-xs rounded-lg font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              title="Load custom survey from JSON file"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import JSON</span>
            </button>
            <button
              onClick={handleExportJson}
              className="px-2.5 py-1 text-xs rounded-lg font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
              title="Export current survey configuration as JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export</span>
            </button>
            <button
              onClick={handleCopyJson}
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              title="Copy JSON configuration"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Active Survey Executive Card */}
          <div className="bg-gradient-to-br from-indigo-50/70 via-slate-50 to-purple-50/50 rounded-xl p-4 border border-indigo-200/80 shadow-xs">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-black font-mono bg-indigo-700 text-white">
                    {currentSurvey.agency}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Sample: <strong className="text-slate-800">{currentSurvey.sampleSize.toLocaleString()}</strong> | MoE: <strong className="text-slate-800">{currentSurvey.marginOfError}</strong>
                  </span>
                  <span className="text-xs text-slate-500">
                    Lead: <strong className="text-slate-800">{currentSurvey.leadAnalyst}</strong>
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>{currentSurvey.name}</span>
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {currentSurvey.narrativeSummary}
                </p>
                <div className="text-[11px] text-indigo-900 bg-indigo-100/60 px-2.5 py-1 rounded-md border border-indigo-200/60 font-semibold inline-block">
                  <strong>Headline Finding:</strong> {currentSurvey.headlineFinding}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-300 font-bold px-2 py-0.5 rounded">
                  All 14 Castes Prefilled
                </span>
                <button
                  onClick={handleResetToAgencyDefault}
                  className="px-2.5 py-1 text-[11px] rounded-lg font-bold bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                  title="Reset to default official survey data"
                >
                  <RotateCcw className="w-3 h-3 text-slate-500" />
                  <span>Reset to Official Survey</span>
                </button>
              </div>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-600">Category:</span>
              <button
                onClick={() => setCategoryFilter('ALL')}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold cursor-pointer transition-colors ${
                  categoryFilter === 'ALL'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All 14 Communities
              </button>
              <button
                onClick={() => setCategoryFilter('BC')}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold cursor-pointer transition-colors ${
                  categoryFilter === 'BC'
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                }`}
              >
                Backward Classes (BC ~50%)
              </button>
              <button
                onClick={() => setCategoryFilter('SC_ST')}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold cursor-pointer transition-colors ${
                  categoryFilter === 'SC_ST'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
                }`}
              >
                SC &amp; ST (~28%)
              </button>
              <button
                onClick={() => setCategoryFilter('OC_MIN')}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold cursor-pointer transition-colors ${
                  categoryFilter === 'OC_MIN'
                    ? 'bg-sky-600 text-white'
                    : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
                }`}
              >
                Minorities &amp; OC (~22%)
              </button>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search caste, region, issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Caste Communities Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredCommunities.map((comm) => {
              const key = comm.key;
              const swing = currentSurvey.swings[key] || { INC: 0, BRS: 0, BJP: 0 };
              const baseline = BASELINE_2023_EXIT_POLL_CASTES[key];
              const projected = projectedShares[key];
              const netSum = swing.INC + swing.BRS + swing.BJP;
              const isBalanced = Math.abs(netSum) < 0.1;

              return (
                <div
                  key={key}
                  className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors space-y-3"
                >
                  {/* Community Header */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-sm font-black text-slate-900">{comm.label}</h4>
                        <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded border border-slate-200">
                          {comm.stateShareEst}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            comm.category === 'BC'
                              ? 'bg-amber-100 text-amber-800'
                              : comm.category === 'SC_ST'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}
                        >
                          {comm.categoryLabel}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {comm.subCategory}
                      </div>
                    </div>

                    <div className="text-right">
                      <button
                        onClick={() => handleAutoBalance(key)}
                        disabled={isBalanced}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          isBalanced
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                        }`}
                        title={isBalanced ? 'Swing is zero-sum balanced' : 'Click to auto-balance net swing'}
                      >
                        {isBalanced ? '✓ Net Balanced' : `Net ${netSum > 0 ? '+' : ''}${Math.round(netSum * 10) / 10}% (Balance)`}
                      </button>
                    </div>
                  </div>

                  {/* Context Note */}
                  <div className="text-[10px] text-slate-600 line-clamp-1" title={comm.politicalContext}>
                    <span className="font-semibold text-slate-700">Dynamics:</span> {comm.politicalContext}
                  </div>

                  {/* Baseline vs Projected Comparison Ribbon */}
                  <div className="grid grid-cols-3 gap-2 text-center bg-slate-50 p-2 rounded-lg border border-slate-200">
                    {/* INC */}
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold text-sky-700">INC (Congress)</div>
                      <div className="text-xs font-mono font-black text-slate-800">
                        {projected.INC}%
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Base: {baseline.INC}% ({swing.INC >= 0 ? `+${swing.INC}` : swing.INC}%)
                      </div>
                    </div>

                    {/* BRS */}
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold text-pink-700">BRS (Car)</div>
                      <div className="text-xs font-mono font-black text-slate-800">
                        {projected.BRS}%
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Base: {baseline.BRS}% ({swing.BRS >= 0 ? `+${swing.BRS}` : swing.BRS}%)
                      </div>
                    </div>

                    {/* BJP */}
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-bold text-orange-700">BJP (Lotus)</div>
                      <div className="text-xs font-mono font-black text-slate-800">
                        {projected.BJP}%
                      </div>
                      <div className="text-[9px] text-slate-400">
                        Base: {baseline.BJP}% ({swing.BJP >= 0 ? `+${swing.BJP}` : swing.BJP}%)
                      </div>
                    </div>
                  </div>

                  {/* Interactive Party Swing Sliders */}
                  <div className="space-y-2 pt-1">
                    {/* INC Slider */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-sky-700 w-10">INC:</span>
                      <input
                        type="range"
                        min="-25"
                        max="25"
                        step="0.5"
                        value={swing.INC}
                        onChange={(e) => handleSwingChange(key, 'INC', parseFloat(e.target.value))}
                        className="flex-1 h-1.5 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
                      />
                      <input
                        type="number"
                        min="-30"
                        max="30"
                        step="0.5"
                        value={swing.INC}
                        onChange={(e) => handleSwingChange(key, 'INC', parseFloat(e.target.value) || 0)}
                        className="w-14 px-1.5 py-0.5 text-xs font-mono text-center font-bold bg-white border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                      />
                      <span className="text-[10px] text-slate-400">%</span>
                    </div>

                    {/* BRS Slider */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-pink-700 w-10">BRS:</span>
                      <input
                        type="range"
                        min="-25"
                        max="25"
                        step="0.5"
                        value={swing.BRS}
                        onChange={(e) => handleSwingChange(key, 'BRS', parseFloat(e.target.value))}
                        className="flex-1 h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-600"
                      />
                      <input
                        type="number"
                        min="-30"
                        max="30"
                        step="0.5"
                        value={swing.BRS}
                        onChange={(e) => handleSwingChange(key, 'BRS', parseFloat(e.target.value) || 0)}
                        className="w-14 px-1.5 py-0.5 text-xs font-mono text-center font-bold bg-white border border-slate-300 rounded focus:ring-1 focus:ring-pink-500"
                      />
                      <span className="text-[10px] text-slate-400">%</span>
                    </div>

                    {/* BJP Slider */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-orange-700 w-10">BJP:</span>
                      <input
                        type="range"
                        min="-25"
                        max="25"
                        step="0.5"
                        value={swing.BJP}
                        onChange={(e) => handleSwingChange(key, 'BJP', parseFloat(e.target.value))}
                        className="flex-1 h-1.5 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
                      />
                      <input
                        type="number"
                        min="-30"
                        max="30"
                        step="0.5"
                        value={swing.BJP}
                        onChange={(e) => handleSwingChange(key, 'BJP', parseFloat(e.target.value) || 0)}
                        className="w-14 px-1.5 py-0.5 text-xs font-mono text-center font-bold bg-white border border-slate-300 rounded focus:ring-1 focus:ring-orange-500"
                      />
                      <span className="text-[10px] text-slate-400">%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400 shrink-0" />
            <span>
              Configured caste parameters drive all 119 assembly constituencies via SEEEPC household stratification.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApplyAndRun}
              className="px-5 py-2 text-xs font-black rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Apply &amp; Run Simulation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
