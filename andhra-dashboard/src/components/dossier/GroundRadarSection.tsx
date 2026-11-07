import React, { useState, useEffect } from 'react';
import {
  Radio,
  Newspaper,
  ExternalLink,
  Flame,
  Activity,
  RefreshCw,
  Sparkles,
  Clock,
  TrendingUp,
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
  const [activeRadarTab, setActiveRadarTab] = useState<'buzz' | 'news'>('buzz');

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
      <div className="bg-slate-900/90 text-white p-5 rounded-xl border border-slate-800 animate-pulse flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
            <Radio className="w-4 h-4 text-rose-400 animate-spin" />
          </div>
          <div>
            <div className="h-4 w-48 bg-slate-700 rounded mb-1.5" />
            <div className="h-3 w-32 bg-slate-800 rounded" />
          </div>
        </div>
        <div className="h-7 w-24 bg-slate-800 rounded-lg" />
      </div>
    );
  }

  if (!radarData) return null;

  return (
    <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-xl border border-slate-800 shadow-sm overflow-hidden space-y-4 p-4 sm:p-5">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-rose-400 uppercase tracking-wider font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
              </span>
              Ground Radar &amp; News Wire
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
              Updated {radarData.lastUpdated}
            </span>
          </div>
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <span>Live Field Coverage &amp; Regional Media Pulse</span>
          </h3>
        </div>

        {/* Live Search Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => loadData(true)}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs flex items-center gap-1 cursor-pointer border border-slate-700"
            title="Refresh feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <a
            href={radarData.searchUrls.googleNews}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span> News
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>

          <a
            href={radarData.searchUrls.googleNewsTelugu}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-slate-700 shadow-xs"
          >
            <span>తెలుగు వార్తలు</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
        </div>
      </div>

      {/* Internal View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveRadarTab('buzz')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeRadarTab === 'buzz'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ground Buzz Summary</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveRadarTab('news')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeRadarTab === 'news'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>Live News Wire</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/30 text-indigo-200">
              {radarData.newsArticles.length}
            </span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
          Filtering regional reporting for #{acNo} {acName} ({district})
        </span>
      </div>

      {/* 1. LIVE NEWS WIRE TAB */}
      {activeRadarTab === 'news' && (
        <div className="space-y-2.5 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {radarData.newsArticles.map((article, idx) => (
              <a
                key={idx}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-slate-850 hover:bg-slate-800 p-3.5 rounded-xl border border-slate-700/80 flex flex-col justify-between transition-all hover:border-slate-500"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 px-2 py-0.5 rounded font-mono">
                      {article.source}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.pubDate}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h4>

                  {article.snippet && (
                    <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {article.snippet}
                    </p>
                  )}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-indigo-400 font-bold">
                  <span>Read Full Coverage</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            ))}
          </div>

          <div className="bg-slate-850/80 rounded-xl p-3 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Newspaper className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-slate-300">
                Live Google News RSS aggregated from Eenadu, Sakshi, Andhra Jyothy, Prajasakti &amp; The Hindu.
              </span>
            </div>
            <a
              href={radarData.searchUrls.googleNewsTelugu}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 shrink-0"
            >
              <span>తెలుగు వార్తలు ఓపెన్ చేయండి (Google News)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* 2. GROUND BUZZ SUMMARY TAB */}
      {activeRadarTab === 'buzz' && (
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <Activity className="w-3 h-3 text-rose-400" />
                Media Buzz Volume
              </span>
              <div className="text-lg font-black text-white font-mono flex items-center gap-2">
                <span>{radarData.mediaBuzz.activityLevel}</span>
                <span className="text-xs bg-rose-950 text-rose-300 px-1.5 py-0.2 rounded border border-rose-700/50">
                  Daily Press Stories
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Regular coverage of district representations and public petitions.
              </p>
            </div>

            <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-amber-400" />
                Dominant Public Sentiment
              </span>
              <div className="text-lg font-black text-amber-300 font-mono">
                {radarData.mediaBuzz.dominantTone}
              </div>
              <p className="text-[11px] text-slate-400">
                Sharply divided on civic infrastructure delivery vs. direct pension satisfaction.
              </p>
            </div>

            <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-700/80 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-400" />
                Key Ground Flashpoints
              </span>
              <div className="text-xs font-bold text-slate-200">
                Drinking Water, Canal MSP, Road Quality, Youth DSC
              </div>
              <p className="text-[11px] text-slate-400">
                Primary grievances driving public representations.
              </p>
            </div>
          </div>

          <div className="bg-slate-850 p-4 rounded-xl border border-slate-700/80 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Press &amp; Ground Narrative Synthesis
            </h4>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {radarData.mediaBuzz.sentimentSummary}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 self-center mr-1">Trending Topics:</span>
              {radarData.mediaBuzz.topTopics.map((top, tIdx) => (
                <span
                  key={tIdx}
                  className="text-[10px] bg-slate-900 text-slate-300 px-2.5 py-0.5 rounded-full border border-slate-750 font-medium"
                >
                  #{top}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
