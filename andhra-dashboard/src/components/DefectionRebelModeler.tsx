import React, { useState, useMemo } from 'react';
import type { DemographicsDataset } from '../types';
import { getPartyColor } from '../types';
import {
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle,
  TrendingDown,
  Sparkles,
  Search,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  X,
  Layers,
  Info
} from 'lucide-react';

export const DEFECTION_IMPACT_FACTOR = 0.2; // User requested: divide impact by a factor of 5

export interface DefectionEvent {
  id: string;
  acNo: number;
  leaderName: string;
  eventType: 'defection' | 'rebel_spoiler';
  fromParty: 'TDP' | 'YSRCP' | 'JSP' | 'BJP' | 'INC';
  toParty: 'TDP' | 'YSRCP' | 'JSP' | 'BJP' | 'IND' | 'INC';
  cadreTransferPct: number; // raw personal vote base %
  backlashPct: number; // raw voter cynicism penalty %
  notes: string;
  enabled: boolean;
}

// 24 Empirically Calibrated 2029 Predictive Scenarios: NDA (TDP / JSP / BJP) -> YSRCP / IND
export const PRESET_SCENARIOS: Omit<DefectionEvent, 'id'>[] = [
  // --- Krishna, NTR & Amaravati Corridor ---
  {
    acNo: 71, // Gannavaram (Krishna)
    leaderName: 'Sitting TDP MLA Dissidence & Mandal Bloc (Gannavaram)',
    eventType: 'defection',
    fromParty: 'TDP',
    toParty: 'YSRCP',
    cadreTransferPct: 9.5,
    backlashPct: 2.2,
    notes: '2029 Prediction: Factional rift in Amaravati peri-urban corridor; corporators and village sarpanch network cross over from TDP to YSRCP.',
    enabled: true,
  },
  {
    acNo: 78, // Penamaluru (Krishna)
    leaderName: 'BC Community Leadership Floor-Cross (Penamaluru)',
    eventType: 'defection',
    fromParty: 'TDP',
    toParty: 'YSRCP',
    cadreTransferPct: 8.5,
    backlashPct: 1.8,
    notes: '2029 Prediction: Backward Classes community discontent over NDA policy shifts; former minister cadre bloc defects to YSRCP.',
    enabled: true,
  },
  {
    acNo: 87, // Mangalagiri (Guntur)
    leaderName: 'Weaver Community Elders & Ward Councillors (Mangalagiri)',
    eventType: 'defection',
    fromParty: 'TDP',
    toParty: 'YSRCP',
    cadreTransferPct: 9.0,
    backlashPct: 2.0,
    notes: '2029 Prediction: Capital zone weaver community elders and municipal ward councillors break away from NDA to YSRCP.',
    enabled: true,
  },
  {
    acNo: 91, // Tenali (Guntur)
    leaderName: 'Denied TDP Ticket Aspirant Rebel Bid (Tenali)',
    eventType: 'rebel_spoiler',
    fromParty: 'JSP',
    toParty: 'IND',
    cadreTransferPct: 8.0,
    backlashPct: 1.0,
    notes: '2029 Prediction: JSP-TDP seat collision resurfaces; bypassed TDP heavyweight enters as formidable independent spoiler.',
    enabled: true,
  },
  {
    acNo: 96, // Chilakaluripet (Palnadu)
    leaderName: 'Market Committee Syndicate Defection (Chilakaluripet)',
    eventType: 'defection',
    fromParty: 'TDP',
    toParty: 'YSRCP',
    cadreTransferPct: 8.5,
    backlashPct: 2.0,
    notes: '2029 Prediction: Intense Palnadu factional rivalry within NDA causes senior agricultural market syndicate leaders to defect to YSRCP.',
    enabled: true,
  },

  // --- Godavari Delta & Coastal Corridor ---
  {
    acNo: 37, // Pithapuram (Kakinada)
    leaderName: 'Aggrieved Grassroots Cadre Independent Spoiler (Pithapuram)',
    eventType: 'rebel_spoiler',
    fromParty: 'JSP',
    toParty: 'IND',
    cadreTransferPct: 7.5,
    backlashPct: 1.0,
    notes: '2029 Prediction: Grassroots local cadre resents centralized alliance domination; aggrieved constituency leader runs as independent.',
    enabled: true,
  },
  {
    acNo: 40, // Anaparthy (East Godavari)
    leaderName: 'Alliance Seat Denial Rebel - Ex-MLA Independent (Anaparthy)',
    eventType: 'rebel_spoiler',
    fromParty: 'BJP',
    toParty: 'IND',
    cadreTransferPct: 8.5,
    backlashPct: 1.2,
    notes: '2029 Prediction: Traditional TDP bastion revolts against continued BJP alliance quota; heavyweight launches independent campaign.',
    enabled: true,
  },
  {
    acNo: 45, // Razole (Konaseema)
    leaderName: 'Delta Grassroots & OBC Committee Cross-Over (Razole)',
    eventType: 'defection',
    fromParty: 'JSP',
    toParty: 'YSRCP',
    cadreTransferPct: 7.0,
    backlashPct: 1.5,
    notes: '2029 Prediction: Delta Dalit and OBC grassroots committees split from JSP after term fatigue, shifting mandal machinery to YSRCP.',
    enabled: true,
  },
  {
    acNo: 60, // Undi (West Godavari)
    leaderName: 'Denied Sitting MLA Cadre Revolt (Undi)',
    eventType: 'rebel_spoiler',
    fromParty: 'TDP',
    toParty: 'IND',
    cadreTransferPct: 8.5,
    backlashPct: 1.2,
    notes: '2029 Prediction: Denied sitting MLA loyalists trigger open cadre mutiny, fielding a high-profile independent rebel spoiler.',
    enabled: true,
  },
  {
    acNo: 73, // Kaikalur (Eluru)
    leaderName: 'Kolleru Lake Belt Alliance Seat Rebel (Kaikalur)',
    eventType: 'rebel_spoiler',
    fromParty: 'BJP',
    toParty: 'IND',
    cadreTransferPct: 7.0,
    backlashPct: 1.0,
    notes: '2029 Prediction: Kolleru aqua farmer belt seat-sharing discontent: bypassed TDP grassroots machinery revolts against alliance nominee as independent.',
    enabled: true,
  },

  // --- Uttarandhra (North Coastal Corridor) ---
  {
    acNo: 20, // Bhimili (Visakhapatnam)
    leaderName: 'Coastal Real Estate & Tourism Bloc Defection (Bhimili)',
    eventType: 'defection',
    fromParty: 'TDP',
    toParty: 'YSRCP',
    cadreTransferPct: 8.0,
    backlashPct: 1.8,
    notes: '2029 Prediction: Northern coastal infrastructure and tourism investor bloc defect from TDP to YSRCP over port and zoning issues.',
    enabled: true,
  },
  {
    acNo: 22, // Visakhapatnam South (Visakhapatnam)
    leaderName: 'Port Corridor Corporator & Fisherfolk Bloc (Vizag South)',
    eventType: 'defection',
    fromParty: 'TDP',
    toParty: 'YSRCP',
    cadreTransferPct: 8.0,
    backlashPct: 2.0,
    notes: '2029 Prediction: Port dock labor leaders and coastal fisherfolk corporators break away from NDA to align with YSRCP.',
    enabled: true,
  },
  {
    acNo: 25, // Gajuwaka (Visakhapatnam)
    leaderName: 'Industrial Union & Steel Plant Stewards (Gajuwaka)',
    eventType: 'defection',
    fromParty: 'TDP',
    toParty: 'YSRCP',
    cadreTransferPct: 9.0,
    backlashPct: 1.8,
    notes: '2029 Prediction: Industrial trade union leaders and steel plant anti-privatization committees floor-cross from NDA to YSRCP.',
    enabled: true,
  },

  // --- South Coastal (Prakasam & Nellore) ---
  {
    acNo: 108, // Ongole (Prakasam)
    leaderName: 'Municipal Corporator & Factional Exodus (Ongole)',
    eventType: 'defection',
    fromParty: 'TDP',
    toParty: 'YSRCP',
    cadreTransferPct: 9.5,
    backlashPct: 2.2,
    notes: '2029 Prediction: Factional rift between MP and MLA camps in Prakasam district sparks mass municipal corporator exodus from TDP to YSRCP.',
    enabled: true,
  },
  {
    acNo: 112, // Giddalur (Prakasam)
    leaderName: 'Western Prakasam Faction Rebel Spoiler (Giddalur)',
    eventType: 'rebel_spoiler',
    fromParty: 'TDP',
    toParty: 'IND',
    cadreTransferPct: 7.5,
    backlashPct: 1.0,
    notes: '2029 Prediction: Western Prakasam faction feud: denied ticket aspirant enters as independent rebel, fracturing NDA rural vote base.',
    enabled: true,
  },

  // --- Rayalaseema Faction Belts ---
  {
    acNo: 167, // Tirupati (Tirupati)
    leaderName: 'Municipal Corporator & Merchant Association Switch (Tirupati)',
    eventType: 'defection',
    fromParty: 'JSP',
    toParty: 'YSRCP',
    cadreTransferPct: 9.0,
    backlashPct: 2.0,
    notes: '2029 Prediction: Temple city municipal corporators and merchant associations defect from JSP to YSRCP amidst urban anti-incumbency.',
    enabled: true,
  },
  {
    acNo: 166, // Chandragiri (Tirupati)
    leaderName: 'Rural Faction Rebel Spoiler (Chandragiri)',
    eventType: 'rebel_spoiler',
    fromParty: 'TDP',
    toParty: 'IND',
    cadreTransferPct: 7.0,
    backlashPct: 1.0,
    notes: '2029 Prediction: Rural Rayalaseema faction within TDP revolts against sitting leadership, fielding an independent rebel spoiler.',
    enabled: true,
  },
  {
    acNo: 160, // Dharmavaram (Sri Sathya Sai)
    leaderName: 'TDP Weaver Cadre Backing Independent Rebel (Dharmavaram)',
    eventType: 'rebel_spoiler',
    fromParty: 'BJP',
    toParty: 'IND',
    cadreTransferPct: 8.5,
    backlashPct: 1.2,
    notes: '2029 Prediction: Acute alliance friction over BJP sitting MLA; native TDP weaver cadre backs aggressive independent challenger against NDA.',
    enabled: true,
  },
  {
    acNo: 164, // Madanapalle (Annamayya)
    leaderName: 'Market Syndicate & Transport Union Rebel (Madanapalle)',
    eventType: 'rebel_spoiler',
    fromParty: 'TDP',
    toParty: 'IND',
    cadreTransferPct: 6.5,
    backlashPct: 0.8,
    notes: '2029 Prediction: Commercial tomato market committee heads and transport union leaders enter as independent spoiler against NDA ticket.',
    enabled: true,
  },
  {
    acNo: 124, // Badvel (Kadapa)
    leaderName: 'Alliance Friction SC Constituency Rebel (Badvel)',
    eventType: 'rebel_spoiler',
    fromParty: 'BJP',
    toParty: 'IND',
    cadreTransferPct: 7.0,
    backlashPct: 0.9,
    notes: '2029 Prediction: Scheduled Caste reserved seat coalition friction: local cadre revolts against alliance pick, running as independent.',
    enabled: true,
  },
  {
    acNo: 131, // Jammalamadugu (Kadapa)
    leaderName: 'Traditional Faction Floor-Crossing (Jammalamadugu)',
    eventType: 'defection',
    fromParty: 'BJP',
    toParty: 'YSRCP',
    cadreTransferPct: 8.5,
    backlashPct: 2.0,
    notes: '2029 Prediction: Historic Kadapa factional rivalry prompts dissident political dynasty to floor-cross from BJP to YSRCP.',
    enabled: true,
  },
  {
    acNo: 137, // Kurnool (Kurnool)
    leaderName: 'Urban Business & Minority Heavyweight Floor-Cross (Kurnool)',
    eventType: 'defection',
    fromParty: 'TDP',
    toParty: 'YSRCP',
    cadreTransferPct: 8.5,
    backlashPct: 2.0,
    notes: '2029 Prediction: Urban trade chamber leaders and minority community ward representatives defect from TDP to YSRCP.',
    enabled: true,
  },
  {
    acNo: 147, // Alur (Kurnool)
    leaderName: 'Boya Community Regional Leadership Floor-Cross (Alur)',
    eventType: 'defection',
    fromParty: 'TDP',
    toParty: 'YSRCP',
    cadreTransferPct: 9.0,
    backlashPct: 2.2,
    notes: '2029 Prediction: Boya community regional leaders break with TDP over border irrigation grievances, returning to YSRCP.',
    enabled: true,
  },
  {
    acNo: 175, // Kuppam (Chittoor)
    leaderName: 'Mandal Parishad & Sarpanch Resentment Cross-Over (Kuppam)',
    eventType: 'defection',
    fromParty: 'TDP',
    toParty: 'YSRCP',
    cadreTransferPct: 8.0,
    backlashPct: 1.5,
    notes: '2029 Prediction: Resentful village sarpanches and rural Mandal Parishad leaders cross over from TDP to YSRCP after 5-year anti-incumbency.',
    enabled: true,
  },
];

export interface DefectionRebelModelerProps {
  data: DemographicsDataset;
  onOpenDossier?: (acNo: number) => void;
  events?: DefectionEvent[];
  onEventsChange?: (events: DefectionEvent[]) => void;
  cumulativeAcImpacts?: Record<number, {
    resourceSwing: number;
    starLift: number;
    totalCumulativeSwing: number;
    cumulativeProjectedMargin: number;
    isCumulativelyFlipped: boolean;
  }>;
}

export const DefectionRebelModeler: React.FC<DefectionRebelModelerProps> = ({
  data,
  onOpenDossier,
  events: externalEvents,
  onEventsChange,
  cumulativeAcImpacts,
}) => {
  const [internalEvents, setInternalEvents] = useState<DefectionEvent[]>(() =>
    PRESET_SCENARIOS.map((s, idx) => ({ ...s, id: `preset_${idx + 1}` }))
  );

  const events = externalEvents !== undefined ? externalEvents : internalEvents;
  const setEvents = (updater: React.SetStateAction<DefectionEvent[]>) => {
    if (onEventsChange) {
      if (typeof updater === 'function') {
        const next = updater(events);
        onEventsChange(next);
      } else {
        onEventsChange(updater);
      }
    } else {
      setInternalEvents(updater);
    }
  };

  // Card collapse state: Set of expanded IDs. All individual cards are collapsed by default!
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Filter tabs: 'all' | 'rebels' | 'defections' | 'flipped'
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'rebels' | 'defections' | 'flipped'>('all');

  // New Event Form State
  const [formAcNo, setFormAcNo] = useState<number>(175); // Default to Kuppam (#175)
  const [formType, setFormType] = useState<'defection' | 'rebel_spoiler'>('defection');
  const [formLeaderName, setFormLeaderName] = useState('Senior Constituency Heavyweight');
  const [formFromParty, setFormFromParty] = useState<'TDP' | 'YSRCP' | 'JSP' | 'BJP' | 'INC'>('YSRCP');
  const [formToParty, setFormToParty] = useState<'TDP' | 'YSRCP' | 'JSP' | 'BJP' | 'IND' | 'INC'>('TDP');
  const [formCadreTransfer, setFormCadreTransfer] = useState<number>(8.0);
  const [formBacklash, setFormBacklash] = useState<number>(2.0);
  const [formNotes, setFormNotes] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Toggle single card collapse/expand
  const toggleCardCollapse = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand all cards
  const handleExpandAll = () => {
    setExpandedIds(new Set(events.map((e) => e.id)));
  };

  // Collapse all cards
  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  // Apply archetype preset to form
  const applyArchetype = (archetype: 'rebel_denied' | 'sitting_mla' | 'heavyweight' | 'mandal_faction') => {
    if (archetype === 'rebel_denied') {
      setFormType('rebel_spoiler');
      setFormToParty('IND');
      setFormCadreTransfer(8.0);
      setFormBacklash(1.0);
      setFormNotes('Alliance seat-sharing friction: denied party ticket aspirant files as independent with dedicated cadre.');
    } else if (archetype === 'sitting_mla') {
      setFormType('defection');
      setFormCadreTransfer(9.5);
      setFormBacklash(2.2);
      setFormNotes('Sitting legislator floor-crossing brings ward corporators and village sarpanches to rival fold.');
    } else if (archetype === 'heavyweight') {
      setFormType('defection');
      setFormCadreTransfer(14.0);
      setFormBacklash(2.0);
      setFormNotes('Multi-term veteran / ex-minister shifts personal caste and contractor network.');
    } else {
      setFormType('rebel_spoiler');
      setFormToParty('IND');
      setFormCadreTransfer(5.0);
      setFormBacklash(0.8);
      setFormNotes('Local mandal parishad or subcaste panchayat leader running independent to assert leverage.');
    }
  };

  // Add event
  const handleAddEvent = () => {
    const newEvent: DefectionEvent = {
      id: `evt_${Date.now()}`,
      acNo: formAcNo,
      leaderName: formLeaderName.trim() || 'Constituency Leader',
      eventType: formType,
      fromParty: formFromParty,
      toParty: formType === 'rebel_spoiler' ? 'IND' : formToParty,
      cadreTransferPct: formCadreTransfer,
      backlashPct: formBacklash,
      notes: formNotes || (formType === 'defection' ? 'Cross-party defection' : 'Rebel independent spoiler'),
      enabled: true,
    };

    setEvents((prev) => [newEvent, ...prev]);
    setIsFormOpen(false);
    setFormNotes('');
  };

  // Toggle event enabled
  const toggleEvent = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEvents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  // Delete event
  const deleteEvent = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEvents((prev) => prev.filter((item) => item.id !== id));
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  // Reset to default presets
  const handleReset = () => {
    setEvents(PRESET_SCENARIOS.map((s, idx) => ({ ...s, id: `preset_${idx + 1}` })));
    setExpandedIds(new Set()); // Keep collapsed by default on reset
  };

  // Clear all
  const handleClearAll = () => {
    setEvents([]);
    setExpandedIds(new Set());
  };

  // Compute live impacts for each event (Divided by a factor of 5)
  const analyzedEvents = useMemo(() => {
    return events.map((evt) => {
      const ac = data.constituencies[evt.acNo];
      if (!ac) return null;

      const baselineWinner = ac.winner_2023.party;
      const baselineMargin = ac.margin_2023;
      const totalEstimatedVotes = ac.total_votes_2023 || 185000;

      // Transfer votes (Calibrated with factor of 5 divisor)
      const effectiveTransferPct = Number((evt.cadreTransferPct * DEFECTION_IMPACT_FACTOR).toFixed(2));
      const effectiveBacklashPct = Number((evt.backlashPct * DEFECTION_IMPACT_FACTOR).toFixed(2));
      const transferredVotes = Math.round((effectiveTransferPct / 100) * totalEstimatedVotes);
      const backlashVotes = Math.round((effectiveBacklashPct / 100) * totalEstimatedVotes);

      let projectedWinner = baselineWinner;
      let projectedMargin = baselineMargin;
      let isFlipped = false;
      let flipWinner = '';

      if (evt.enabled) {
        if (evt.eventType === 'defection') {
          // If fromParty was the winner and toParty was the runner-up:
          if (baselineWinner === evt.fromParty && ac.runner_up_2023.party === evt.toParty) {
            // Net shift = 2 * transferredVotes + backlash
            const totalSwing = (2 * transferredVotes) + backlashVotes;
            projectedMargin = baselineMargin - totalSwing;
            if (projectedMargin < 0) {
              isFlipped = true;
              projectedWinner = evt.toParty;
              projectedMargin = Math.abs(projectedMargin);
              flipWinner = evt.toParty;
            }
          } else if (ac.runner_up_2023.party === evt.fromParty && baselineWinner === evt.toParty) {
            // Target party was already winning, margin expands
            projectedMargin = baselineMargin + (2 * transferredVotes) + backlashVotes;
          } else {
            // General shift
            const totalShift = transferredVotes + backlashVotes;
            if (baselineWinner === evt.fromParty && totalShift > baselineMargin) {
              isFlipped = true;
              projectedWinner = evt.toParty;
              flipWinner = evt.toParty;
              projectedMargin = totalShift - baselineMargin;
            }
          }
        } else {
          // Rebel spoiler: Siphons votes from fromParty
          if (baselineWinner === evt.fromParty) {
            const loss = transferredVotes + backlashVotes;
            projectedMargin = baselineMargin - loss;
            if (projectedMargin < 0) {
              isFlipped = true;
              projectedWinner = ac.runner_up_2023.party;
              flipWinner = ac.runner_up_2023.party;
              projectedMargin = Math.abs(projectedMargin);
            }
          } else {
            // Rebel from the runner-up makes winner win bigger
            projectedMargin = baselineMargin + transferredVotes;
          }
        }
      }

      return {
        ...evt,
        acName: ac.ac_name,
        district: ac.district,
        baselineWinner,
        baselineRunner: ac.runner_up_2023.party,
        baselineMargin,
        effectiveTransferPct,
        effectiveBacklashPct,
        transferredVotes,
        backlashVotes,
        projectedWinner,
        projectedMargin,
        isFlipped,
        flipWinner,
      };
    }).filter(Boolean) as (DefectionEvent & {
      acName: string;
      district: string;
      baselineWinner: string;
      baselineRunner: string;
      baselineMargin: number;
      effectiveTransferPct: number;
      effectiveBacklashPct: number;
      transferredVotes: number;
      backlashVotes: number;
      projectedWinner: string;
      projectedMargin: number;
      isFlipped: boolean;
      flipWinner: string;
    })[];
  }, [events, data]);

  // Summary counts
  const totalFlippedCount = useMemo(() => {
    return analyzedEvents.filter((e) => e.enabled && e.isFlipped).length;
  }, [analyzedEvents]);

  const activeCount = useMemo(() => {
    return analyzedEvents.filter((e) => e.enabled).length;
  }, [analyzedEvents]);

  const rebelCount = useMemo(() => {
    return analyzedEvents.filter((e) => e.eventType === 'rebel_spoiler').length;
  }, [analyzedEvents]);

  const defectionCount = useMemo(() => {
    return analyzedEvents.filter((e) => e.eventType === 'defection').length;
  }, [analyzedEvents]);

  const avgEffectiveTransferPct = useMemo(() => {
    if (analyzedEvents.length === 0) return 0;
    const sum = analyzedEvents.reduce((acc, curr) => acc + curr.effectiveTransferPct, 0);
    return Number((sum / analyzedEvents.length).toFixed(1));
  }, [analyzedEvents]);

  const avgTransferredVotes = useMemo(() => {
    if (analyzedEvents.length === 0) return 0;
    const sum = analyzedEvents.reduce((acc, curr) => acc + curr.transferredVotes, 0);
    return Math.round(sum / analyzedEvents.length);
  }, [analyzedEvents]);

  // Filtered events by category and search
  const filteredEvents = useMemo(() => {
    return analyzedEvents.filter((e) => {
      // Category filter
      if (categoryFilter === 'rebels' && e.eventType !== 'rebel_spoiler') return false;
      if (categoryFilter === 'defections' && e.eventType !== 'defection') return false;
      if (categoryFilter === 'flipped' && (!e.enabled || !e.isFlipped)) return false;

      // Text search
      if (!searchFilter.trim()) return true;
      const q = searchFilter.toLowerCase();
      return (
        e.acName.toLowerCase().includes(q) ||
        e.district.toLowerCase().includes(q) ||
        e.leaderName.toLowerCase().includes(q) ||
        e.fromParty.toLowerCase().includes(q) ||
        e.toParty.toLowerCase().includes(q)
      );
    });
  }, [analyzedEvents, categoryFilter, searchFilter]);

  const allConstituencyOptions = useMemo(() => {
    return Object.values(data.constituencies).sort((a, b) => a.ac_no - b.ac_no);
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div id="defection-scorecard" className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-5 scroll-mt-24">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-rose-500 text-white font-mono text-xs font-black px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                <AlertTriangle className="w-3.5 h-3.5" /> DEFECTION &amp; REBEL ENGINE
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md border border-slate-700 flex items-center gap-1 font-semibold">
                <Info className="w-3 h-3 text-amber-400" /> Impact Calibrated (1/5 Factor)
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              2029 Defection &amp; Rebel Impact Modeler (NDA → YSRCP / IND)
            </h2>
            <p className="text-xs text-slate-400">
              Predict 2029 anti-incumbency floor-crossings, coalition ticket denial rebels, and independent spoilers across Andhra Pradesh battlegrounds with calibrated 1/5th empirical vote dampening.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className={
                isFormOpen
                  ? "flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                  : "flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/50 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
              }
            >
              {isFormOpen ? <X className="w-4 h-4 text-rose-400" /> : <Plus className="w-4 h-4 stroke-[2.5]" />}
              <span>{isFormOpen ? 'Close Builder' : 'Add Custom Defection / Rebel'}</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl border border-slate-700/80 transition-all cursor-pointer"
              title="Reset to 22 authentic historical presets"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Scorecard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 font-semibold mb-1">Active Events</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{activeCount}</span>
              <span className="text-xs text-slate-400">/ {events.length} Modeled</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              {defectionCount} Defections · {rebelCount} Rebels
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 font-semibold mb-1">Seats Flipped to Rival</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-400">+{totalFlippedCount}</span>
              <span className="text-xs text-slate-400">Flips</span>
            </div>
            <div className="text-[11px] text-rose-300 font-medium flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3" /> Due to vote splintering
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 font-semibold mb-1">Effective Transfer Base</div>
            <div className="text-2xl font-black text-amber-400">{avgEffectiveTransferPct}%</div>
            <div className="text-[11px] text-slate-400 mt-1">
              ~{avgTransferredVotes.toLocaleString()} votes / leader (1/5 calibrated)
            </div>
          </div>

          <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700">
            <div className="text-xs text-slate-400 font-semibold mb-1">Impact Calibration</div>
            <div className="text-2xl font-black text-sky-400">0.2x Factor</div>
            <div className="text-[11px] text-slate-400 mt-1">Realistic ground dampening</div>
          </div>
        </div>
      </div>

      {/* Custom Defection / Rebel Builder Form */}
      {isFormOpen && (
        <div className="bg-white p-5 rounded-2xl border-2 border-indigo-500 shadow-lg space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-black text-slate-900">
                Configure Defection or Rebel Event
              </h3>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200">
                1/5 Impact Factor Applied
              </span>
            </div>
            <span className="text-xs text-slate-500">Simulate localized candidate dynamics</span>
          </div>

          {/* Quick Archetype Selectors */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-indigo-600" /> Quick-Apply Realistic Political Archetypes:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                type="button"
                onClick={() => applyArchetype('rebel_denied')}
                className="p-2 rounded-lg bg-white border border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 text-left cursor-pointer transition-all"
              >
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>⚡ Alliance-Denied Rebel</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">8.0% Base (Eff: 1.6%) · 1.0% Backlash</div>
              </button>

              <button
                type="button"
                onClick={() => applyArchetype('sitting_mla')}
                className="p-2 rounded-lg bg-white border border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 text-left cursor-pointer transition-all"
              >
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>🔄 Sitting MLA Defection</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">9.5% Base (Eff: 1.9%) · 2.2% Backlash</div>
              </button>

              <button
                type="button"
                onClick={() => applyArchetype('heavyweight')}
                className="p-2 rounded-lg bg-white border border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 text-left cursor-pointer transition-all"
              >
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>👑 Ex-Minister Heavyweight</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">14.0% Base (Eff: 2.8%) · 2.0% Backlash</div>
              </button>

              <button
                type="button"
                onClick={() => applyArchetype('mandal_faction')}
                className="p-2 rounded-lg bg-white border border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 text-left cursor-pointer transition-all"
              >
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <span>👥 Mandal / Caste Faction</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">5.0% Base (Eff: 1.0%) · 0.8% Backlash</div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
            {/* Target AC */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Select Constituency:</label>
              <select
                value={formAcNo}
                onChange={(e) => setFormAcNo(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                {allConstituencyOptions.map((ac) => (
                  <option key={ac.ac_no} value={ac.ac_no}>
                    #{ac.ac_no} {ac.ac_name} ({ac.district}) - Won by {ac.winner_2023.party} (+{ac.margin_2023.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {/* Event Type */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Event Classification:</label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setFormType('defection')}
                  className={`p-2 rounded-lg font-bold border cursor-pointer text-center ${
                    formType === 'defection'
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Party Defection
                </button>
                <button
                  type="button"
                  onClick={() => setFormType('rebel_spoiler')}
                  className={`p-2 rounded-lg font-bold border cursor-pointer text-center ${
                    formType === 'rebel_spoiler'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Rebel Spoiler
                </button>
              </div>
            </div>

            {/* Leader Name / Designation */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Leader / Candidate Title:</label>
              <input
                type="text"
                value={formLeaderName}
                onChange={(e) => setFormLeaderName(e.target.value)}
                placeholder="e.g. Sitting MLA / Ex-Minister"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
              />
            </div>

            {/* From Party */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Originating Party:</label>
              <select
                value={formFromParty}
                onChange={(e) => setFormFromParty(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
              >
                <option value="YSRCP">YSRCP (YSR Congress Party)</option>
                <option value="TDP">TDP (Telugu Desam Party)</option>
                <option value="JSP">JSP (Janasena Party)</option>
                <option value="BJP">BJP (Bharatiya Janata Party)</option>
                <option value="INC">INC (Congress)</option>
              </select>
            </div>

            {/* To Party */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">
                {formType === 'defection' ? 'Destination Party:' : 'Running As:'}
              </label>
              {formType === 'defection' ? (
                <select
                  value={formToParty}
                  onChange={(e) => setFormToParty(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-bold text-slate-800"
                >
                  <option value="TDP">TDP</option>
                  <option value="YSRCP">YSRCP</option>
                  <option value="JSP">JSP</option>
                  <option value="BJP">BJP</option>
                  <option value="INC">INC</option>
                </select>
              ) : (
                <div className="p-2 bg-slate-100 rounded-lg text-slate-700 font-bold border border-slate-200">
                  IND (Independent Rebel Candidate)
                </div>
              )}
            </div>

            {/* Cadre Base Transfer Slider */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Personal Vote Base:</span>
                <span className="font-mono text-indigo-600">
                  {formCadreTransfer}% <span className="text-[10px] text-slate-500">(Eff: {(formCadreTransfer * DEFECTION_IMPACT_FACTOR).toFixed(1)}%)</span>
                </span>
              </div>
              <input
                type="range"
                min="2.0"
                max="20.0"
                step="0.5"
                value={formCadreTransfer}
                onChange={(e) => setFormCadreTransfer(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500">
                ~{Math.round(((formCadreTransfer * DEFECTION_IMPACT_FACTOR) / 100) * 185000).toLocaleString()} net votes transferred (1/5 calibrated)
              </div>
            </div>

            {/* Anti-Defection Backlash */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Voter Backlash Penalty:</span>
                <span className="font-mono text-rose-600">
                  {formBacklash}% <span className="text-[10px] text-slate-500">(Eff: {(formBacklash * DEFECTION_IMPACT_FACTOR).toFixed(1)}%)</span>
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.5"
                value={formBacklash}
                onChange={(e) => setFormBacklash(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="text-[10px] text-slate-500">
                ~{Math.round(((formBacklash * DEFECTION_IMPACT_FACTOR) / 100) * 185000).toLocaleString()} penalty votes (1/5 calibrated)
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1 sm:col-span-2">
              <label className="font-bold text-slate-700">Tactical Strategic Rationale:</label>
              <input
                type="text"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="e.g. Caste elders consolidate behind rebel, leaving official candidate exposed"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-medium text-slate-800"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddEvent}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Add to Defection Registry
            </button>
          </div>
        </div>
      )}

      {/* Events Registry Section */}
      <div id="defection-registry" className="scroll-mt-24 space-y-4">
        {/* Events Registry Bar with Filter Pills & Collapse Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 flex-wrap">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
              Active Registry ({filteredEvents.length} Events)
            </h3>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs ml-2">
              <button
                type="button"
                onClick={() => setCategoryFilter('all')}
                className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                  categoryFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({analyzedEvents.length})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('rebels')}
                className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                  categoryFilter === 'rebels'
                    ? 'bg-rose-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⚡ Rebels ({rebelCount})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('defections')}
                className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                  categoryFilter === 'defections'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔄 Defections ({defectionCount})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter('flipped')}
                className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                  categoryFilter === 'flipped'
                    ? 'bg-rose-100 text-rose-800 border border-rose-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🚩 Flipped ({totalFlippedCount})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Expand / Collapse All Controls */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={handleExpandAll}
                className="px-2 py-0.5 rounded text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                title="Expand all cards"
              >
                Expand All
              </button>
              <span className="text-slate-300">|</span>
              <button
                type="button"
                onClick={handleCollapseAll}
                className="px-2 py-0.5 rounded text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
                title="Collapse all cards"
              >
                Collapse All
              </button>
            </div>

            {/* Search Filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by AC, Leader or Party..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-1 focus:ring-indigo-500 w-44 sm:w-52"
              />
            </div>

            <button
              onClick={handleClearAll}
              className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 rounded cursor-pointer"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Events Grid (Individual cards collapsed by default) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredEvents.map((evt) => {
            const isExpanded = expandedIds.has(evt.id);
            const fromColor = getPartyColor(evt.fromParty);
            const toColor = evt.toParty === 'IND' ? '#64748b' : getPartyColor(evt.toParty);

            return (
              <div
                key={evt.id}
                className={`rounded-xl border transition-all ${
                  !evt.enabled
                    ? 'opacity-60 bg-slate-50/80 border-slate-200'
                    : evt.isFlipped
                    ? 'bg-rose-50/30 border-rose-300 ring-2 ring-rose-500/10 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Collapsed Card Header (Always Visible) */}
                <div
                  onClick={() => toggleCardCollapse(evt.id)}
                  className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none hover:bg-slate-50/60 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Expand/Collapse Chevron Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCardCollapse(evt.id);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      title={isExpanded ? 'Collapse card' : 'Expand card details'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-600" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {/* AC Badge & Name */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[11px] font-bold bg-slate-900 text-white px-1.5 py-0.2 rounded">
                          #{evt.acNo}
                        </span>
                        <h4 className="font-black text-slate-900 text-xs sm:text-sm truncate">
                          {evt.acName}
                        </h4>
                        <span className="text-[10px] text-slate-500 truncate hidden sm:inline">
                          ({evt.district})
                        </span>

                        {/* Event Type Badge */}
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            evt.eventType === 'defection'
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {evt.eventType === 'defection' ? '🔄 Defection' : '⚡ Rebel'}
                        </span>
                      </div>

                      {/* Leader Name */}
                      <div className="text-xs font-semibold text-slate-700 truncate mt-0.5">
                        {evt.leaderName}
                      </div>
                    </div>
                  </div>

                  {/* Transfer Summary Pill & Status */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* From -> To */}
                    <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold">
                      <span
                        className="px-1.5 py-0.2 rounded text-white text-[10px]"
                        style={{ backgroundColor: fromColor }}
                      >
                        {evt.fromParty}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span
                        className="px-1.5 py-0.2 rounded text-white text-[10px]"
                        style={{ backgroundColor: toColor }}
                      >
                        {evt.toParty}
                      </span>
                    </div>

                    {/* Calibrated Net Impact Pill */}
                    <span
                      className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200"
                      title={`Raw personal base: ${evt.cadreTransferPct}% | Calibrated impact (1/5): +${evt.effectiveTransferPct}% (~${evt.transferredVotes.toLocaleString()} votes)`}
                    >
                      +{evt.effectiveTransferPct}%
                    </span>

                    {/* Flip Status Badge */}
                    {evt.isFlipped ? (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded text-[10px] font-black flex items-center gap-1">
                        <TrendingDown className="w-3 h-3 text-rose-600" />
                        FLIPPED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-[10px] font-bold hidden md:inline">
                        HELD
                      </span>
                    )}

                    {/* Checkbox toggle */}
                    <input
                      type="checkbox"
                      checked={evt.enabled}
                      onChange={(e) => toggleEvent(evt.id, e as any)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                      title="Enable/disable scenario"
                    />

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={(e) => deleteEvent(evt.id, e)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="Remove event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-100 space-y-3 text-xs animate-in fade-in duration-150">
                    {/* Transfer Flow Diagram */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="px-2 py-0.5 rounded font-black text-xs text-white"
                          style={{ backgroundColor: fromColor }}
                        >
                          {evt.fromParty}
                        </span>
                        <span className="text-slate-400 text-[11px]">(Base)</span>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-500 font-bold text-xs">
                        <ArrowRight className="w-4 h-4 text-indigo-600" />
                        <span className="text-indigo-600 font-mono">
                          +{evt.effectiveTransferPct}% <span className="text-[10px] text-slate-400 font-normal">({evt.cadreTransferPct}% / 5)</span>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className="px-2 py-0.5 rounded font-black text-xs text-white"
                          style={{ backgroundColor: toColor }}
                        >
                          {evt.toParty}
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {evt.eventType === 'defection' ? '(Recipient)' : '(Rebel IND)'}
                        </span>
                      </div>
                    </div>

                    {/* Mathematical Swing Breakdown */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-slate-500">Transferred Cadre Votes:</span>
                        <div className="font-mono font-bold text-slate-900">
                          +{evt.transferredVotes.toLocaleString()} votes{' '}
                          <span className="text-[10px] text-slate-400 font-normal">({evt.effectiveTransferPct}%)</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500">Voter Backlash Penalty:</span>
                        <div className="font-mono font-bold text-rose-600">
                          -{evt.backlashVotes.toLocaleString()} votes{' '}
                          <span className="text-[10px] text-slate-400 font-normal">({evt.effectiveBacklashPct}%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Result impact badge */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[11px] text-slate-600">
                        2023: Won by <strong>{evt.baselineWinner}</strong> (+{evt.baselineMargin.toLocaleString()})
                      </div>

                      {evt.isFlipped ? (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-300 rounded-md text-[11px] font-black flex items-center gap-1">
                          <TrendingDown className="w-3 h-3 text-rose-600" />
                          FLIPPED TO {evt.projectedWinner} (+{evt.projectedMargin.toLocaleString()})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[11px] font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                          {evt.projectedWinner} HELD (+{evt.projectedMargin.toLocaleString()})
                        </span>
                      )}
                    </div>

                    {evt.notes && (
                      <p className="text-[11px] text-slate-600 italic border-t border-slate-100 pt-2 bg-slate-50/40 p-2 rounded">
                        "{evt.notes}"
                      </p>
                    )}

                    {/* Cumulative Campaign Compound Margin */}
                    {cumulativeAcImpacts && cumulativeAcImpacts[evt.acNo] && (cumulativeAcImpacts[evt.acNo].resourceSwing > 0 || cumulativeAcImpacts[evt.acNo].starLift > 0) && (
                      <div className="p-2 rounded-lg bg-indigo-50/80 border border-indigo-200 text-[11px] flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-indigo-950 font-bold">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Cumulative AC Margin:</span>
                        </div>
                        <div className="text-right font-mono font-black">
                          <span className={cumulativeAcImpacts[evt.acNo].cumulativeProjectedMargin > 0 ? 'text-emerald-700' : 'text-slate-800'}>
                            {cumulativeAcImpacts[evt.acNo].cumulativeProjectedMargin > 0
                              ? `+${cumulativeAcImpacts[evt.acNo].cumulativeProjectedMargin.toLocaleString()} (INC WIN)`
                              : `${cumulativeAcImpacts[evt.acNo].cumulativeProjectedMargin.toLocaleString()} (Deficit)`}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Footer Links */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-[10px] text-slate-400 font-semibold">
                        Impact factor 0.2x applied · ECI baseline: #{evt.acNo}
                      </span>

                      {onOpenDossier && (
                        <button
                          type="button"
                          onClick={() => onOpenDossier(evt.acNo)}
                          className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer"
                        >
                          Constituency Dossier ↗
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
