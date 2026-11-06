import type { SimulatedConstituencyResult } from '../../types';

export type RegionKey =
  | 'ALL'
  | 'NORTH_COASTAL'
  | 'GODAVARI'
  | 'KRISHNA_GUNTUR'
  | 'SOUTH_COASTAL'
  | 'RAYALASEEMA';

export type ElectionCycle = '2024' | '2029';

export interface CampaignMilestone {
  id: string;
  date: string;
  timestamp: number;
  title: string;
  shortLabel: string;
  description: string;
  impact: string;
  yLevel: 1 | 2 | 3;
}

export interface PollDataPoint {
  id: string;
  pollster: string;
  date: string;
  timestamp: number;
  sampleSize: number;
  ndaVotePct: number;
  ysrcpVotePct: number;
  jspVotePct?: number;
  incVotePct: number;
  ndaSeats: number;
  ysrcpSeats: number;
  jspSeats?: number;
  isExitPoll?: boolean;
  region: RegionKey;
}

export interface AccuracyRow {
  agency: string;
  type: 'Pre-Poll Survey' | 'Exit Poll' | 'Official Certified Count' | '2029 Strategic Scenario';
  date: string;
  sample: string;
  ndaSeatsEst: string;
  ysrcpSeatsEst: string;
  jspSeatsEst?: string;
  ndaVotePct: number;
  ysrcpVotePct: number;
  jspVotePct?: number;
  calledWinner: 'NDA' | 'YSRCP' | 'TDP' | 'Hung';
  verdictDelta: string;
  accuracyGrade: 'A+' | 'A' | 'B' | 'Failed' | 'Forecast';
  presetKey?: string;
}

export interface CampaignPollingTrackerProps {
  activePreset?: string;
  simulatedResults?: SimulatedConstituencyResult[];
  onApplyPreset?: (presetKey: string) => void;
}

// 175 AC Regional Partition (ECI official constituency numbering)
export const isACInRegion = (acNo: number, region: RegionKey): boolean => {
  if (region === 'ALL') return true;
  if (region === 'NORTH_COASTAL') return acNo >= 1 && acNo <= 34;
  if (region === 'GODAVARI') return acNo >= 35 && acNo <= 68;
  if (region === 'KRISHNA_GUNTUR') return acNo >= 69 && acNo <= 101;
  if (region === 'SOUTH_COASTAL') return acNo >= 102 && acNo <= 123;
  if (region === 'RAYALASEEMA') return acNo >= 124 && acNo <= 175;
  return true;
};

// 9 Key 2024 Campaign Milestones (Vertical Dotted Lines like 538)
export const CAMPAIGN_MILESTONES_2024: CampaignMilestone[] = [
  {
    id: 'm1',
    date: '2023-09-09',
    timestamp: new Date('2023-09-09').getTime(),
    title: 'Naidu Arrest & Pawan Kalyan Alliance Pact',
    shortLabel: 'Naidu Arrest & PK Alliance',
    description: 'Chandrababu Naidu arrested in Rajahmundry. Pawan Kalyan visits prison and declares joint TDP-JSP alliance.',
    impact: 'Catalyzed emotional consolidation among anti-YSRCP voters and united Kapu-Kamma cadre.',
    yLevel: 1,
  },
  {
    id: 'm2',
    date: '2024-01-14',
    timestamp: new Date('2024-01-14').getTime(),
    title: 'Joint Yuva Galam & Sankranti Manifesto',
    shortLabel: 'Joint Sankranti Pact',
    description: 'Lokesh Yuva Galam yatra culminates with joint TDP-JSP public declaration of common minimum welfare vision.',
    impact: 'Cadre alignment formalized; youth and rural workers mobilized ahead of election year.',
    yLevel: 2,
  },
  {
    id: 'm3',
    date: '2024-03-09',
    timestamp: new Date('2024-03-09').getTime(),
    title: 'BJP Officially Enters Triple NDA Alliance',
    shortLabel: 'BJP Joins NDA (144-21-10)',
    description: 'Seat sharing finalized in New Delhi: TDP 144, JSP 21, BJP 10. Triangular contest completely eliminated.',
    impact: 'Consolidated Central backing and prevented splitting of urban middle-class and Hindu devotional votes.',
    yLevel: 3,
  },
  {
    id: 'm4',
    date: '2024-03-27',
    timestamp: new Date('2024-03-27').getTime(),
    title: "Jagan Launches 'Memantha Siddham' Bus Yatra",
    shortLabel: "'Memantha Siddham' Yatra",
    description: "YS Jagan Mohan Reddy tours all 26 districts pitching DBT welfare schemes vs 'feudal coalition'.",
    impact: 'YSRCP grassroots consolidation among rural SC, ST, and women SHG beneficiaries.',
    yLevel: 1,
  },
  {
    id: 'm5',
    date: '2024-04-30',
    timestamp: new Date('2024-04-30').getTime(),
    title: "TDP-JSP 'Super Six' & Land Titling Act Backlash",
    shortLabel: 'Super Six & Land Act Clash',
    description: 'Alliance releases Super-Six manifesto. TDP weaponizes AP Land Titling Act as an existential threat to private property.',
    impact: 'Massive rural agrarian panic shifted small and medium landholders heavily towards the alliance.',
    yLevel: 2,
  },
  {
    id: 'm6',
    date: '2024-05-08',
    timestamp: new Date('2024-05-08').getTime(),
    title: 'Praja Galam Mega Rallies (Modi-Naidu-Pawan)',
    shortLabel: 'Praja Galam Mega Rallies',
    description: 'Prime Minister Narendra Modi joins Chandrababu Naidu and Pawan Kalyan in massive joint rallies across Chilakaluripet & Rajahmundry.',
    impact: 'Final surge created an undeniable wave sentiment across coastal deltas and Rayalaseema.',
    yLevel: 3,
  },
  {
    id: 'm7',
    date: '2024-05-13',
    timestamp: new Date('2024-05-13').getTime(),
    title: 'Polling Day: Historic 81.79% Turnout',
    shortLabel: 'Polling Day (81.79% Turnout)',
    description: 'Voters queue past midnight across 46,389 booths. Huge influx of non-resident Telugus arriving to vote.',
    impact: 'Unprecedented 81.79% turnout signaled massive anti-incumbency mobilization.',
    yLevel: 1,
  },
  {
    id: 'm8',
    date: '2024-06-01',
    timestamp: new Date('2024-06-01').getTime(),
    title: 'Exit Polls Release: Landslide Consensus',
    shortLabel: 'Exit Polls Drop (135-160 NDA)',
    description: 'Major exit poll agencies unanimously project decisive NDA alliance victory (130 to 160 seats).',
    impact: 'Exit polls confirmed unprecedented grassroots transfer of JSP votes to TDP and BJP.',
    yLevel: 2,
  },
  {
    id: 'm9',
    date: '2024-06-04',
    timestamp: new Date('2024-06-04').getTime(),
    title: 'Form-20 Official Result: NDA 164 - YSRCP 11',
    shortLabel: 'Counting Day: NDA 164 / YSRCP 11',
    description: 'Certified ECI Form-20 counts confirm historic landslide: TDP 135, JSP 21 (100%), BJP 8, YSRCP 11.',
    impact: '55.38% NDA vote share marks the largest victory margin in Andhra Pradesh electoral history.',
    yLevel: 3,
  },
];

// 7 Key 2029 Forward Forecast Milestones (2024-2029 5-Year Arc)
export const CAMPAIGN_MILESTONES_2029: CampaignMilestone[] = [
  {
    id: 'm29_1',
    date: '2024-06-04',
    timestamp: new Date('2024-06-04').getTime(),
    title: '2024 Mandate Baseline (NDA 164 / YSRCP 11)',
    shortLabel: '2024 Baseline (164 vs 11)',
    description: 'Historic landslide establishes NDA coalition dominance with a 15.8% vote lead. Chandrababu Naidu sworn in as CM.',
    impact: 'High benchmark setting immense delivery pressure for 5-year anti-incumbency cycle.',
    yLevel: 1,
  },
  {
    id: 'm29_2',
    date: '2025-05-15',
    timestamp: new Date('2025-05-15').getTime(),
    title: 'Amaravati Phase 1 & Polavaram Milestones',
    shortLabel: 'Amaravati Delivery & Capital Momentum',
    description: 'World Bank and ADB financing releases speed up capital construction; Polavaram diaphragm wall progress.',
    impact: 'Delivery test: Determines if Krishna-Guntur and Godavari middle-class stay consolidated.',
    yLevel: 2,
  },
  {
    id: 'm29_3',
    date: '2026-11-20',
    timestamp: new Date('2026-11-20').getTime(),
    title: '2.5-Year Mid-term Coalition Review',
    shortLabel: 'Mid-term Review & Cadre Alignment',
    description: 'Cabinet reshuffle, nominated posts allocation between TDP, JSP, and BJP, and welfare audit.',
    impact: 'Crucial turning point for grassroots harmony between TDP and Janasena workers.',
    yLevel: 3,
  },
  {
    id: 'm29_4',
    date: '2028-01-10',
    timestamp: new Date('2028-01-10').getTime(),
    title: 'Pre-Poll Seat Talks & Delimitation Prep',
    shortLabel: 'Seat Sharing & Coalition Stress',
    description: 'JSP evaluates demand for expanded seat allocation; YSRCP launches grassroots resurgence campaign.',
    impact: 'Decisive milestone: Determines whether alliance holds collectively or splits into a triangular contest.',
    yLevel: 1,
  },
  {
    id: 'm29_5',
    date: '2028-10-15',
    timestamp: new Date('2028-10-15').getTime(),
    title: 'Manifesto Clash: Super-Six 2.0 vs Navaratnalu 3.0',
    shortLabel: 'Manifesto War (Super-Six 2.0)',
    description: 'Parties roll out flagship welfare agendas; economic guarantees clash against fiscal realities.',
    impact: 'Rural DWCRA women and agrarian farmer voting intentions begin crystallizing.',
    yLevel: 2,
  },
  {
    id: 'm29_6',
    date: '2029-03-25',
    timestamp: new Date('2029-03-25').getTime(),
    title: '2029 Campaign Climax & Praja Galam 2.0',
    shortLabel: 'Campaign Sprint & Final Mobilization',
    description: 'Statewide marathon rallies across Uttarandhra, Coastal Deltas, and Rayalaseema.',
    impact: 'Peak campaign polarization; ground worker machinery activated for booth management.',
    yLevel: 3,
  },
  {
    id: 'm29_7',
    date: '2029-05-10',
    timestamp: new Date('2029-05-10').getTime(),
    title: '2029 General Election: Simulated Mandate',
    shortLabel: '2029 Polling & Final Verdict',
    description: 'Andhra Pradesh votes to deliver its verdict on 5 years of coalition governance vs opposition revival.',
    impact: 'Terminal outcome calculated live by your dashboard simulation engine.',
    yLevel: 1,
  },
];

// Survey Scatter Dataset for 2024
export const SURVEY_DATA_POINTS_2024: PollDataPoint[] = [
  { id: 'p1', pollster: 'Peoples Pulse', date: '2023-10-08', timestamp: new Date('2023-10-08').getTime(), sampleSize: 18500, ndaVotePct: 43.5, ysrcpVotePct: 45.8, incVotePct: 1.8, ndaSeats: 82, ysrcpSeats: 93, region: 'ALL' },
  { id: 'p2', pollster: 'Times Now-ETG', date: '2023-10-22', timestamp: new Date('2023-10-22').getTime(), sampleSize: 12000, ndaVotePct: 42.0, ysrcpVotePct: 46.5, incVotePct: 2.1, ndaSeats: 76, ysrcpSeats: 99, region: 'ALL' },
  { id: 'p3', pollster: 'Lok Poll Track', date: '2023-10-28', timestamp: new Date('2023-10-28').getTime(), sampleSize: 8400, ndaVotePct: 44.0, ysrcpVotePct: 45.0, incVotePct: 1.5, ndaSeats: 85, ysrcpSeats: 90, region: 'ALL' },
  { id: 'p4', pollster: 'ABP-CVoter', date: '2023-11-12', timestamp: new Date('2023-11-12').getTime(), sampleSize: 14200, ndaVotePct: 43.8, ysrcpVotePct: 45.2, incVotePct: 1.9, ndaSeats: 84, ysrcpSeats: 91, region: 'ALL' },
  { id: 'p5', pollster: 'JanMat Survey', date: '2023-11-25', timestamp: new Date('2023-11-25').getTime(), sampleSize: 16000, ndaVotePct: 45.2, ysrcpVotePct: 44.8, incVotePct: 1.6, ndaSeats: 91, ysrcpSeats: 84, region: 'ALL' },
  { id: 'p6', pollster: 'SAS Group Track', date: '2023-12-10', timestamp: new Date('2023-12-10').getTime(), sampleSize: 9500, ndaVotePct: 45.8, ysrcpVotePct: 44.2, incVotePct: 1.7, ndaSeats: 94, ysrcpSeats: 81, region: 'ALL' },
  { id: 'p7', pollster: 'Peoples Pulse Tracker', date: '2023-12-28', timestamp: new Date('2023-12-28').getTime(), sampleSize: 22000, ndaVotePct: 46.5, ysrcpVotePct: 43.6, incVotePct: 1.5, ndaSeats: 98, ysrcpSeats: 77, region: 'ALL' },
  { id: 'p8', pollster: 'India Today - MOTN', date: '2024-01-16', timestamp: new Date('2024-01-16').getTime(), sampleSize: 15000, ndaVotePct: 47.0, ysrcpVotePct: 43.5, incVotePct: 1.8, ndaSeats: 102, ysrcpSeats: 73, region: 'ALL' },
  { id: 'p9', pollster: 'Matrize Track', date: '2024-01-26', timestamp: new Date('2024-01-26').getTime(), sampleSize: 18000, ndaVotePct: 47.4, ysrcpVotePct: 43.0, incVotePct: 1.6, ndaSeats: 105, ysrcpSeats: 70, region: 'ALL' },
  { id: 'p10', pollster: 'TV9 Telugu Mood', date: '2024-02-12', timestamp: new Date('2024-02-12').getTime(), sampleSize: 11000, ndaVotePct: 48.0, ysrcpVotePct: 42.8, incVotePct: 1.7, ndaSeats: 108, ysrcpSeats: 67, region: 'ALL' },
  { id: 'p11', pollster: 'Times Now-ETG Rd 2', date: '2024-02-24', timestamp: new Date('2024-02-24').getTime(), sampleSize: 13500, ndaVotePct: 48.2, ysrcpVotePct: 42.4, incVotePct: 1.9, ndaSeats: 110, ysrcpSeats: 65, region: 'ALL' },
  { id: 'p12', pollster: 'News18-CNX Survey', date: '2024-03-12', timestamp: new Date('2024-03-12').getTime(), sampleSize: 16500, ndaVotePct: 49.5, ysrcpVotePct: 42.0, incVotePct: 1.6, ndaSeats: 115, ysrcpSeats: 60, region: 'ALL' },
  { id: 'p13', pollster: 'Peoples Pulse March Wave', date: '2024-03-22', timestamp: new Date('2024-03-22').getTime(), sampleSize: 26000, ndaVotePct: 50.4, ysrcpVotePct: 41.6, incVotePct: 1.5, ndaSeats: 121, ysrcpSeats: 54, region: 'ALL' },
  { id: 'p14', pollster: 'Lok Poll Wave 2', date: '2024-03-29', timestamp: new Date('2024-03-29').getTime(), sampleSize: 10000, ndaVotePct: 49.0, ysrcpVotePct: 42.5, incVotePct: 1.8, ndaSeats: 112, ysrcpSeats: 63, region: 'ALL' },
  { id: 'p15', pollster: 'ABP-CVoter Round 2', date: '2024-04-10', timestamp: new Date('2024-04-10').getTime(), sampleSize: 14000, ndaVotePct: 50.8, ysrcpVotePct: 41.2, incVotePct: 1.5, ndaSeats: 124, ysrcpSeats: 51, region: 'ALL' },
  { id: 'p16', pollster: 'Matrize Pre-Poll', date: '2024-04-20', timestamp: new Date('2024-04-20').getTime(), sampleSize: 21000, ndaVotePct: 51.5, ysrcpVotePct: 40.8, incVotePct: 1.6, ndaSeats: 128, ysrcpSeats: 47, region: 'ALL' },
  { id: 'p17', pollster: 'JanMat State Track', date: '2024-04-28', timestamp: new Date('2024-04-28').getTime(), sampleSize: 19000, ndaVotePct: 52.2, ysrcpVotePct: 40.4, incVotePct: 1.4, ndaSeats: 132, ysrcpSeats: 43, region: 'ALL' },
  { id: 'p18', pollster: 'Peoples Pulse Final Track', date: '2024-05-06', timestamp: new Date('2024-05-06').getTime(), sampleSize: 31000, ndaVotePct: 53.6, ysrcpVotePct: 40.1, incVotePct: 1.5, ndaSeats: 142, ysrcpSeats: 33, region: 'ALL' },
  { id: 'p19', pollster: 'TV5 Ground Intel', date: '2024-05-09', timestamp: new Date('2024-05-09').getTime(), sampleSize: 17500, ndaVotePct: 54.2, ysrcpVotePct: 39.8, incVotePct: 1.6, ndaSeats: 148, ysrcpSeats: 27, region: 'ALL' },
  { id: 'p20', pollster: 'India TV-CNX', date: '2024-05-11', timestamp: new Date('2024-05-11').getTime(), sampleSize: 14500, ndaVotePct: 52.8, ysrcpVotePct: 40.5, incVotePct: 1.7, ndaSeats: 136, ysrcpSeats: 39, region: 'ALL' },
  { id: 'p21', pollster: 'Axis My India (Exit)', date: '2024-06-01', timestamp: new Date('2024-06-01').getTime(), sampleSize: 45000, ndaVotePct: 53.8, ysrcpVotePct: 40.2, incVotePct: 1.6, ndaSeats: 144, ysrcpSeats: 31, isExitPoll: true, region: 'ALL' },
  { id: 'p22', pollster: "Today's Chanakya (Exit)", date: '2024-06-01', timestamp: new Date('2024-06-01').getTime(), sampleSize: 38000, ndaVotePct: 54.5, ysrcpVotePct: 39.0, incVotePct: 1.5, ndaSeats: 148, ysrcpSeats: 27, isExitPoll: true, region: 'ALL' },
  { id: 'p23', pollster: 'Peoples Pulse (Exit)', date: '2024-06-01', timestamp: new Date('2024-06-01').getTime(), sampleSize: 52000, ndaVotePct: 54.8, ysrcpVotePct: 39.5, incVotePct: 1.4, ndaSeats: 152, ysrcpSeats: 23, isExitPoll: true, region: 'ALL' },
  { id: 'p24', pollster: 'TV5 Telugu (Exit)', date: '2024-06-01', timestamp: new Date('2024-06-01').getTime(), sampleSize: 35000, ndaVotePct: 55.0, ysrcpVotePct: 39.2, incVotePct: 1.5, ndaSeats: 161, ysrcpSeats: 14, isExitPoll: true, region: 'ALL' },
  { id: 'p25', pollster: 'Matrize (Exit)', date: '2024-06-01', timestamp: new Date('2024-06-01').getTime(), sampleSize: 40000, ndaVotePct: 52.5, ysrcpVotePct: 41.8, incVotePct: 1.6, ndaSeats: 135, ysrcpSeats: 40, isExitPoll: true, region: 'ALL' },
  { id: 'p26', pollster: 'ECI Form-20 Certified Result', date: '2024-06-04', timestamp: new Date('2024-06-04').getTime(), sampleSize: 33700000, ndaVotePct: 55.38, ysrcpVotePct: 39.6, incVotePct: 1.72, ndaSeats: 164, ysrcpSeats: 11, isExitPoll: true, region: 'ALL' },
];
