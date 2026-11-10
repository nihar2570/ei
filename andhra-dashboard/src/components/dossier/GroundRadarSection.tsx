import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  ExternalLink,
  RefreshCw,
  Clock,
  Radio,
} from 'lucide-react';
import {
  getACGroundRadar,
  type GroundRadarData,
} from '../../services/groundRadarService';

interface GroundRadarSectionProps {
  acNo: number;
  acName: string;
  district: string;
  primaryConcern?: string;
}

export const GroundRadarSection: React.FC<GroundRadarSectionProps> = ({
  acNo,
  acName,
  district,
  primaryConcern,
}) => {
  const [radarData, setRadarData] = useState<GroundRadarData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async (forceRefresh = false) => {
    setLoading(true);
    if (forceRefresh) {
      sessionStorage.removeItem(`ap_ground_radar_ac_${acNo}`);
    }
    try {
      const data = await getACGroundRadar(acNo, acName, district, primaryConcern);
      setRadarData(data);
    } catch (err) {
      console.error('Error loading ground radar:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(false);
  }, [acNo, acName, district]);

  if (loading && !radarData) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs animate-pulse flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Radio className="w-4 h-4 text-indigo-600 animate-spin" />
          </div>
          <div className="space-y-1.5">
            <div className="h-4 w-48 bg-slate-200 rounded" />
            <div className="h-3 w-32 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="h-8 w-24 bg-slate-100 rounded-lg" />
      </div>
    );
  }

  if (!radarData) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 sm:p-5 space-y-4">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 uppercase tracking-wider font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
              </span>
              Live News Wire
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-mono">
              Updated {radarData.lastUpdated}
            </span>
          </div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Regional Media &amp; Field Reporting</span>
            <span className="text-xs font-normal text-slate-500 hidden sm:inline">
              ({radarData.newsArticles.length} coverage items)
            </span>
          </h3>
        </div>

        {/* Live Search Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadData(true)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all text-xs flex items-center gap-1 cursor-pointer border border-slate-200"
            title="Refresh news wire"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <a
            href={radarData.searchUrls.googleNews}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-indigo-200 shadow-2xs"
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Google</span> News
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <a
            href={radarData.searchUrls.googleNewsTelugu}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-amber-200 shadow-2xs"
          >
            <span>తెలుగు వార్తలు</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>

      {/* Articles Grid */}
      {radarData.newsArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {radarData.newsArticles.map((article, idx) => (
            <a
              key={idx}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-slate-50/70 hover:bg-white p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-xs flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-mono">
                    {article.source}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {article.pubDate}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h4>

                {article.snippet && (
                  <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                    {article.snippet}
                  </p>
                )}
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-indigo-600 font-bold">
                <span>Read Coverage</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-indigo-500" />
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-slate-500 space-y-2 bg-slate-50 rounded-xl border border-slate-200">
          <p>No direct regional articles indexed for #{acNo} {acName} in this RSS window.</p>
          <a
            href={radarData.searchUrls.googleNews}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:underline"
          >
            <span>Search live Google News directly</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Footer Note */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <span>
          Aggregated regional coverage from Eenadu, Sakshi, Andhra Jyothy, Prajasakti &amp; The Hindu.
        </span>
        <a
          href={radarData.searchUrls.googleNewsTelugu}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 shrink-0"
        >
          <span>తెలుగు వార్తలు (Google News)</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
