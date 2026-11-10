import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  Flame,
  ShieldAlert,
  Scale,
  Car,
  Trees,
  Briefcase,
  Sprout,
  Crown,
  Film,
  Handshake,
  Landmark,
  Gavel,
  Lock,
  Users,
  Banknote,
} from 'lucide-react';

export type CrisisCategory =
  | 'family_dynastic'
  | 'coalition_alliance'
  | 'governance_economy'
  | 'legal_investigative'
  | 'caste_social'
  | 'agrarian_labor';

export const CRISIS_CATEGORIES: { id: 'all' | CrisisCategory; label: string }[] = [
  { id: 'all', label: 'All Crises' },
  { id: 'family_dynastic', label: 'Family & Dynastic' },
  { id: 'coalition_alliance', label: 'Coalition & Satraps' },
  { id: 'governance_economy', label: 'Governance & Fiscal' },
  { id: 'legal_investigative', label: 'Legal & Enforcement' },
  { id: 'caste_social', label: 'Caste & Social' },
  { id: 'agrarian_labor', label: 'Agrarian & Labor' },
];

export type CrisisKey =
  | 'amaravatiPaceSlowdown'
  | 'superSixFiscalFriction'
  | 'vizagSteelPlantBacklash'
  | 'redBookPolarization'
  | 'tdpJspCadreClash'
  | 'rayalaseemaWaterGrievance'
  | 'tirupatiPrasadamControversy'
  | 'polavaramDisplacementAgitation'
  | 'aquaFarmerPowerTariffCrisis'
  | 'cropInsuranceFarmerDistress'
  | 'liquorPolicyRetailDisruption'
  | 'govtEmployeePensionDiscontent'
  | 'ysrFamilyLegacyWar'
  | 'jrNtrVoteSplit'
  | 'pawanKalyanCoalitionUltimatum'
  | 'bjpCentralPressureMinorityAlienation'
  | 'centralAgencyLeadershipArrest'
  | 'assetFreezingCampaignFreeze'
  | 'scSubCategorizationBacklash'
  | 'kapuReservationBcFriction'
  | 'treasuryOverdraftDbtFreeze';

export interface CrisisConfig {
  key: CrisisKey;
  title: string;
  category: CrisisCategory;
  categoryLabel: string;
  icon: LucideIcon;
  iconColorClass: string;
  hoverBorderClass: string;
  accentClass: string;
  badgeBgActive: string;
  badgeTextActive: string;
  badgeBorderActive: string;
  tooltip: string;
  description: string;
  targetGeography: {
    primary: string;
    details: string;
  };
  calibratedImpact: {
    primary: string;
    details: string;
  };
  min: number;
  max: number;
  step: number;
  unit: string;
  tickLabels: [string, string, string];
  statusFormatter: (val: number) => { text: string; colorClass: string };
}

export const CRISIS_REGISTRY: CrisisConfig[] = [
  // --- Category: Family & Dynastic ---
  {
    key: 'ysrFamilyLegacyWar',
    title: 'YSR Family Legacy War',
    category: 'family_dynastic',
    categoryLabel: 'Family & Dynastic',
    icon: Crown,
    iconColorClass: 'text-amber-400',
    hoverBorderClass: 'hover:border-amber-700/60',
    accentClass: 'accent-amber-500',
    badgeBgActive: 'bg-amber-950',
    badgeTextActive: 'text-amber-300',
    badgeBorderActive: 'border-amber-800',
    tooltip:
      'Models internal YSR family fracture with YS Sharmila (APCC) and Dr. Sunitha campaigning on the Viveka murder trial, eroding YSRCP moral authority in Kadapa & Rayalaseema.',
    description:
      'YS Sharmila and Dr. Sunitha Viveka campaign offensive causing moral fatigue and vote diversion among traditional YSR loyalists, Christian minorities, and SC Mala blocs.',
    targetGeography: {
      primary: '13 Rayalaseema ACs',
      details: 'Kadapa, Pulivendula, Mydukur, Kamalapuram, Badvel, Rajampet, Rayachoti & Annamayya',
    },
    calibratedImpact: {
      primary: '0% to -8% YSRCP Cut',
      details: 'At -4.5% Kadapa flips to TDP; cuts Jagan margin in Pulivendula and splits Christian/SC vote',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% YSR Split',
    tickLabels: ['0% (Family United)', '-4% (Cadre Confusion)', '-8% (Dynastic Fracture)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% YSRCP drag in Kadapa/Seema: pressures Kadapa, Badvel & Mydukur`
          : '○ YSR family voter base unified',
      colorClass: 'text-amber-400/90',
    }),
  },
  {
    key: 'jrNtrVoteSplit',
    title: 'Jr NTR Vote Split',
    category: 'family_dynastic',
    categoryLabel: 'Family & Dynastic',
    icon: Film,
    iconColorClass: 'text-yellow-400',
    hoverBorderClass: 'hover:border-yellow-700/60',
    accentClass: 'accent-yellow-500',
    badgeBgActive: 'bg-yellow-950',
    badgeTextActive: 'text-yellow-300',
    badgeBorderActive: 'border-yellow-800',
    tooltip:
      'Models voter apathy and silent abstention among young Nandamuri / Jr. NTR fans and traditional NTR purists alienated by succession disputes, reducing youth booth mobilization.',
    description:
      'Silent boycott & disengagement by Jr. NTR fans clubs and Nandamuri loyalists over party succession dynamics and perceived sidelining.',
    targetGeography: {
      primary: '14 Krishna-Godavari ACs',
      details: 'Gudivada, Vijayawada (W/C/E), Guntur (W/E), Eluru, Bhimavaram, Rajahmundry & Tenali',
    },
    calibratedImpact: {
      primary: '0% to -8% NDA Drag',
      details: 'At -3.5% flips Gudivada; depresses youth turnout by 4.2% across coastal urban belts',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Fan Split',
    tickLabels: ['0% (United Cadre)', '-4% (Fan Discontent)', '-8% (Active Boycott)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% youth penalty: flips Gudivada and erodes Vijayawada/Guntur margins`
          : '○ Nandamuri fan base mobilized for NDA',
      colorClass: 'text-yellow-400/90',
    }),
  },

  // --- Category: Coalition & Alliance ---
  {
    key: 'pawanKalyanCoalitionUltimatum',
    title: 'Pawan Kalyan Coalition Ultimatum',
    category: 'coalition_alliance',
    categoryLabel: 'Coalition & Satraps',
    icon: Handshake,
    iconColorClass: 'text-red-400',
    hoverBorderClass: 'hover:border-red-700/60',
    accentClass: 'accent-red-500',
    badgeBgActive: 'bg-red-950',
    badgeTextActive: 'text-red-300',
    badgeBorderActive: 'border-red-800',
    tooltip:
      'Simulates severe friction between Janasena and TDP leadership over grassroots respect, nominated posts, and cabinet authority, leading to JSP cadre withholding vote transfer.',
    description:
      'Janasena cadre revolt and boycott in retaliation for local dominance by TDP MLA incumbents and delayed nominated posts.',
    targetGeography: {
      primary: '21 JSP Contested ACs',
      details: 'Pithapuram, Bhimavaram, Kakinada Rural, Tadepalligudem, Tenali, Avanigadda & Godavari delta',
    },
    calibratedImpact: {
      primary: '0% to -10% NDA Cut',
      details: 'At -4.0% flips Avanigadda & Nidadavole; at -7.0% threatens 12 JSP seats to YSRCP',
    },
    min: 0,
    max: 10,
    step: 0.5,
    unit: '% JSP Drag',
    tickLabels: ['0% (Seamless Alliance)', '-5% (Cadre Boycott)', '-10% (Open Alliance Revolt)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% coalition drag: flips up to ${Math.round(val * 1.8)} JSP-TDP alliance seats`
          : '○ 100% coalition cadre transfer harmony',
      colorClass: 'text-red-400/90',
    }),
  },
  {
    key: 'tdpJspCadreClash',
    title: 'TDP - JSP Cadre Turf Rivalry',
    category: 'coalition_alliance',
    categoryLabel: 'Coalition & Satraps',
    icon: Flame,
    iconColorClass: 'text-orange-400',
    hoverBorderClass: 'hover:border-orange-900/60',
    accentClass: 'accent-orange-500',
    badgeBgActive: 'bg-orange-950',
    badgeTextActive: 'text-orange-300',
    badgeBorderActive: 'border-orange-800',
    tooltip:
      'Models local territory dominance friction between TDP and JSP cadres in shared mandals. Causes cross-voting leakage to YSRCP in 21 JSP seats and 35 TDP-JSP overlap seats.',
    description:
      'Local territory dominance rivalry between TDP & Janasena cadres in shared mandals causing cross-voting and rebel sabotage.',
    targetGeography: {
      primary: '35 Battleground ACs',
      details: 'East & West Godavari, Krishna, Visakhapatnam & Kakinada districts',
    },
    calibratedImpact: {
      primary: '0% to -8% Mutual Leakage',
      details: 'At -4.0% flips Avanigadda, Razole & Rajanagaram to YSRCP; endangers 9 coastal seats',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Cross-Voting',
    tickLabels: ['0% (Unified Transfer)', '-4% (Cadre Friction)', '-8% (Widespread Sabotage)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% mutual leakage: flips up to ${Math.round(val * 2.2)} JSP & TDP shared seats`
          : '○ Seamless TDP-JSP cadre coordination',
      colorClass: 'text-orange-400/90',
    }),
  },
  {
    key: 'bjpCentralPressureMinorityAlienation',
    title: 'BJP Pressure & Minority Shift',
    category: 'coalition_alliance',
    categoryLabel: 'Coalition & Satraps',
    icon: Landmark,
    iconColorClass: 'text-amber-500',
    hoverBorderClass: 'hover:border-amber-700/60',
    accentClass: 'accent-amber-500',
    badgeBgActive: 'bg-amber-950',
    badgeTextActive: 'text-amber-300',
    badgeBorderActive: 'border-amber-800',
    tooltip:
      'Models aggressive central BJP ideological positioning and national bills pushing Muslim & Christian minorities into tactical consolidation for YSRCP and Congress.',
    description:
      'Central ideological polarization and minority concerns over alliance posture triggering anti-NDA consolidation among Muslim & Christian voters.',
    targetGeography: {
      primary: '10 Minority-Dense ACs',
      details: 'Kurnool, Kadapa, Guntur East, Nellore City, Adoni, Nandyal, Hindupur, Rayachoti & Vijayawada West',
    },
    calibratedImpact: {
      primary: '0% to -8% Minority Drag',
      details: 'At -4.0% flips Kurnool, Adoni & Guntur East to YSRCP; cements opposition minority base',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Minority Cut',
    tickLabels: ['0% (Moderate Alliance)', '-4% (Minority Consolidation)', '-8% (Tactical En-Bloc Voting)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% minority penalty: flips Kurnool, Adoni & Guntur East`
          : '○ Traditional split in minority voting',
      colorClass: 'text-amber-400/90',
    }),
  },

  // --- Category: Governance & Fiscal ---
  {
    key: 'amaravatiPaceSlowdown',
    title: 'Amaravati Delivery Pace',
    category: 'governance_economy',
    categoryLabel: 'Governance & Fiscal',
    icon: Building2,
    iconColorClass: 'text-cyan-400',
    hoverBorderClass: 'hover:border-cyan-900/60',
    accentClass: 'accent-cyan-500',
    badgeBgActive: 'bg-cyan-950',
    badgeTextActive: 'text-cyan-300',
    badgeBorderActive: 'border-cyan-800',
    tooltip:
      'Models voter disillusionment in capital region due to construction delays & land pooling disputes. Directly cuts NDA votes across 12 Amaravati core ACs.',
    description:
      'Construction timeline fatigue, contractor delays, and land compensation dissatisfaction in Amaravati capital belt.',
    targetGeography: {
      primary: '12 Capital ACs',
      details: 'Guntur, NTR & Krishna Core (Mangalagiri, Tadikonda, Gannavaram, Vijayawada)',
    },
    calibratedImpact: {
      primary: '0% to -10% NDA Cut',
      details: 'At -8.5% flips Gannavaram to YSRCP; severe pressure on Ponnur',
    },
    min: 0,
    max: 10,
    step: 0.5,
    unit: '% Penalty',
    tickLabels: ['0% (On Schedule)', '-5% (Noticeable Drag)', '-10% (Severe Crisis)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% penalty across Amaravati core; pressures Gannavaram & Ponnur`
          : '○ Capital city development on schedule',
      colorClass: 'text-cyan-400/90',
    }),
  },
  {
    key: 'superSixFiscalFriction',
    title: 'Super Six Fiscal Delay',
    category: 'governance_economy',
    categoryLabel: 'Governance & Fiscal',
    icon: ShieldAlert,
    iconColorClass: 'text-rose-400',
    hoverBorderClass: 'hover:border-rose-900/60',
    accentClass: 'accent-rose-500',
    badgeBgActive: 'bg-rose-950',
    badgeTextActive: 'text-rose-300',
    badgeBorderActive: 'border-rose-800',
    tooltip:
      'Simulates statewide public backlash when treasury liquidity constraints delay core cash transfers (Aadabidda Nidhi ₹1,500/mo, Thalliki Vandanam, free LPG cylinders). Hitting close rural seats hardest.',
    description:
      'Fiscal liquidity constraints delaying ₹1,500/mo cash transfers, farmer subsidies, and free cylinder disbursals.',
    targetGeography: {
      primary: 'Statewide (175 ACs)',
      details: 'Heaviest impact across 147 rural & welfare-dependent assembly constituencies',
    },
    calibratedImpact: {
      primary: '0% to -8% Statewide Drag',
      details: 'At -2% flips 8 seats; at -4% flips 26 seats; at -6% flips 42 seats to YSRCP',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Delivery Drag',
    tickLabels: ['0% (Smooth DBT)', '-4% (Moderate Delay)', '-8% (Severe Backlash)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% rural drag: flips up to ${Math.round(val * 6.5)} close rural seats`
          : '○ Smooth DBT welfare disbursals',
      colorClass: 'text-rose-400/90',
    }),
  },
  {
    key: 'treasuryOverdraftDbtFreeze',
    title: 'Treasury Overdraft & DBT Freeze',
    category: 'governance_economy',
    categoryLabel: 'Governance & Fiscal',
    icon: Banknote,
    iconColorClass: 'text-red-500',
    hoverBorderClass: 'hover:border-red-700/60',
    accentClass: 'accent-red-500',
    badgeBgActive: 'bg-red-950',
    badgeTextActive: 'text-red-300',
    badgeBorderActive: 'border-red-800',
    tooltip:
      'Models extreme fiscal liquidity emergency: state hits RBI Ways & Means Advance (WMA) ceiling, completely halting Aadabidda Nidhi and Thalliki Vandanam DBT transfers 90 days before polls.',
    description:
      'Severe treasury cash crunch freezing DBT welfare transfers (Aadabidda Nidhi, Thalliki Vandanam) for 3 consecutive months prior to elections.',
    targetGeography: {
      primary: 'Statewide (147 Rural ACs)',
      details: 'Intense backlash among rural women, SHG DWCRA members, and smallholder farming families',
    },
    calibratedImpact: {
      primary: '0% to -10% Women & SHG Cut',
      details: 'At -5.0% flips 34 rural seats; at -8.0% flips 58 seats to YSRCP',
    },
    min: 0,
    max: 10,
    step: 0.5,
    unit: '% Cash Freeze',
    tickLabels: ['0% (Fluid DBT)', '-5% (3-Month Delay)', '-10% (Catastrophic Freeze)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% acute DBT freeze: flips up to ${Math.round(val * 6.8)} rural seats`
          : '○ Uninterrupted monthly DBT welfare transfers',
      colorClass: 'text-rose-400/90',
    }),
  },
  {
    key: 'redBookPolarization',
    title: 'Red Book Polarization',
    category: 'governance_economy',
    categoryLabel: 'Governance & Fiscal',
    icon: Car,
    iconColorClass: 'text-red-400',
    hoverBorderClass: 'hover:border-red-900/60',
    accentClass: 'accent-red-500',
    badgeBgActive: 'bg-red-950',
    badgeTextActive: 'text-red-300',
    badgeBorderActive: 'border-red-800',
    tooltip:
      'Models political vendetta backlash and police action anxiety among fence-sitters and opposition sympathizers in factional belts. Diverts independent voters toward YSRCP in 24 sensitive seats.',
    description:
      'Perceptions of political retaliation, bureaucratic reshuffles, and legal action against opposition leaders energizing YSRCP voter turnout.',
    targetGeography: {
      primary: '24 Factional ACs',
      details: 'Palnadu, Prakasam, YSR Kadapa & Kurnool districts with tight margins',
    },
    calibratedImpact: {
      primary: '0% to -8% Backlash',
      details: 'At -3.5% flips Macherla, Gurajala & Vinukonda to YSRCP; consolidates YSRCP hard-core base',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Backlash',
    tickLabels: ['0% (Calm Rule of Law)', '-4% (Moderate Polarization)', '-8% (Severe Sympathy Wave)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% penalty in factional seats: pressures Palnadu & Kadapa margins`
          : '○ Rule of law perceived as standard',
      colorClass: 'text-red-400/90',
    }),
  },

  // --- Category: Legal & Enforcement ---
  {
    key: 'centralAgencyLeadershipArrest',
    title: 'CBI / ED Leadership Arrest',
    category: 'legal_investigative',
    categoryLabel: 'Legal & Enforcement',
    icon: Gavel,
    iconColorClass: 'text-purple-400',
    hoverBorderClass: 'hover:border-purple-700/60',
    accentClass: 'accent-purple-500',
    badgeBgActive: 'bg-purple-950',
    badgeTextActive: 'text-purple-300',
    badgeBorderActive: 'border-purple-800',
    tooltip:
      'Simulates sudden pre-poll arrest or prosecution chargesheets against top political figures, causing campaign headquarters paralysis and operational shock in close battlegrounds.',
    description:
      'Central agency summons, raids, and chargesheet arrests of top echelon leaders causing leadership shock and logistical paralysis.',
    targetGeography: {
      primary: '38 Battleground ACs',
      details: 'All assembly seats with winning margin under 10,000 votes statewide',
    },
    calibratedImpact: {
      primary: '0% to -8% Operational Drag',
      details: 'At -3.5% flips 14 narrow battlegrounds due to candidate paralysis and cancelled rallies',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Shock Drag',
    tickLabels: ['0% (Clean Slate)', '-4% (Campaign Paralysis)', '-8% (Complete Ground Shock)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% campaign shock in close battlegrounds: flips up to ${Math.round(val * 3.5)} seats`
          : '○ Campaign leadership and operations intact',
      colorClass: 'text-purple-400/90',
    }),
  },
  {
    key: 'assetFreezingCampaignFreeze',
    title: 'Campaign War Chest Freeze',
    category: 'legal_investigative',
    categoryLabel: 'Legal & Enforcement',
    icon: Lock,
    iconColorClass: 'text-indigo-400',
    hoverBorderClass: 'hover:border-indigo-700/60',
    accentClass: 'accent-indigo-500',
    badgeBgActive: 'bg-indigo-950',
    badgeTextActive: 'text-indigo-300',
    badgeBorderActive: 'border-indigo-800',
    tooltip:
      'Models election commission and tax authority freezes on campaign accounts and cash logistics 30 days before election, hobbling booth-level mobilization.',
    description:
      'Freezing of campaign trusts, contractor accounts, and fuel/transport logistics 30 days before polling day.',
    targetGeography: {
      primary: '147 Rural Assembly ACs',
      details: 'Heaviest impact on rural seats requiring high GOTV vehicle transport & booth kits',
    },
    calibratedImpact: {
      primary: '0% to -6% GOTV Drag',
      details: 'At -3.0% reduces rural GOTV efficiency; flips 12 low-margin rural seats',
    },
    min: 0,
    max: 6,
    step: 0.5,
    unit: '% GOTV Cut',
    tickLabels: ['0% (Liquid War Chest)', '-3% (Logistics Freeze)', '-6% (Total Booth Cash Dry)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% GOTV logistics drag: depresses rural turnout and flips close seats`
          : '○ Full liquidity and booth mobilization machinery',
      colorClass: 'text-indigo-400/90',
    }),
  },

  // --- Category: Caste & Social ---
  {
    key: 'scSubCategorizationBacklash',
    title: 'SC Sub-Categorization Backlash',
    category: 'caste_social',
    categoryLabel: 'Caste & Social',
    icon: Scale,
    iconColorClass: 'text-blue-400',
    hoverBorderClass: 'hover:border-blue-700/60',
    accentClass: 'accent-blue-500',
    badgeBgActive: 'bg-blue-950',
    badgeTextActive: 'text-blue-300',
    badgeBorderActive: 'border-blue-800',
    tooltip:
      'Models Dalit community polarization following Supreme Court SC sub-categorization ruling: Madiga/Relli consolidation behind NDA countered by aggressive Mala counter-mobilization behind YSRCP/Congress.',
    description:
      'Dalit community rupture following SC sub-categorization implementation: Madiga consolidation vs Mala counter-mobilization.',
    targetGeography: {
      primary: '29 SC-Reserved ACs',
      details: 'Tadikonda, Razole, Gannavaram, Prathipadu, Nandikotkur, Badvel, Kodur, Chintalapudi & 21 other SC seats',
    },
    calibratedImpact: {
      primary: '0% to -8% Mala Polarization',
      details: 'At -4.0% flips Tadikonda, Razole & Nandikotkur; deepens Mala-Madiga electoral division',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% SC Polarization',
    tickLabels: ['0% (Dalit Unity)', '-4% (Mala Counter-Surge)', '-8% (Sharp Rupture)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% net Dalit shift in 29 SC seats: flips Tadikonda & Nandikotkur`
          : '○ Baseline Dalit voting pattern intact',
      colorClass: 'text-blue-400/90',
    }),
  },
  {
    key: 'kapuReservationBcFriction',
    title: 'Kapu Quota vs BC Friction',
    category: 'caste_social',
    categoryLabel: 'Caste & Social',
    icon: Users,
    iconColorClass: 'text-emerald-400',
    hoverBorderClass: 'hover:border-emerald-700/60',
    accentClass: 'accent-emerald-500',
    badgeBgActive: 'bg-emerald-950',
    badgeTextActive: 'text-emerald-300',
    badgeBorderActive: 'border-emerald-800',
    tooltip:
      'Models revived Kapu quota agitations colliding with Backward Classes (BC) organizations who fear dilution of the 50% reservation ceiling, causing mutual cross-voting.',
    description:
      'Re-emergence of Kapu reservation demands creating friction and counter-mobilization among Backward Classes in Godavari and Uttarandhra.',
    targetGeography: {
      primary: '32 Godavari & Uttarandhra ACs',
      details: 'Kakinada, Konaseema, East/West Godavari, Anakapalli, Visakhapatnam & Vizianagaram',
    },
    calibratedImpact: {
      primary: '0% to -8% Social Friction',
      details: 'At -4.0% flips 9 dual-dominant seats; destabilizes the Kapu-BC coalition backbone',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Friction Drag',
    tickLabels: ['0% (Harmonious)', '-4% (Mutual Suspicion)', '-8% (Open Social Backlash)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% friction drag in Godavari-Uttarandhra: destabilizes 9 Kapu-BC battlegrounds`
          : '○ Strong Kapu-BC alliance cohesion',
      colorClass: 'text-emerald-400/90',
    }),
  },
  {
    key: 'tirupatiPrasadamControversy',
    title: 'Tirupati Laddu Devotional Surge',
    category: 'caste_social',
    categoryLabel: 'Caste & Social',
    icon: Flame,
    iconColorClass: 'text-amber-400',
    hoverBorderClass: 'hover:border-amber-900/60',
    accentClass: 'accent-amber-500',
    badgeBgActive: 'bg-amber-950',
    badgeTextActive: 'text-amber-300',
    badgeBorderActive: 'border-amber-800',
    tooltip:
      'Models Sanatana Dharma devotional consolidation benefiting the NDA coalition following the Tirumala laddu ghee adulteration inquiry and temple autonomy campaign.',
    description:
      'Sanatana Dharma devotional consolidation benefiting NDA following Tirumala laddu adulteration inquiry across pilgrim corridors.',
    targetGeography: {
      primary: '16 Temple Hub ACs',
      details: 'Tirupati, Chandragiri, Srikalahasti, Kuppam, Chittoor, Srisailam, Mantralayam, Rajampet, Allagadda',
    },
    calibratedImpact: {
      primary: '0% to +8% NDA Surge',
      details: 'At +3% secures Tirupati & Chandragiri; strengthens NDA in pilgrim town belts',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Devotional Surge',
    tickLabels: ['0% (Neutral Baseline)', '+4% (Noticeable Surge)', '+8% (Deep Devotional Consolidation)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ +${val}% devotional surge: consolidates NDA across 16 pilgrim corridors`
          : '○ Devotional polarization neutral',
      colorClass: 'text-amber-400/90',
    }),
  },

  // --- Category: Agrarian & Labor ---
  {
    key: 'vizagSteelPlantBacklash',
    title: 'Vizag Steel Plant Disinvestment',
    category: 'agrarian_labor',
    categoryLabel: 'Agrarian & Labor',
    icon: Scale,
    iconColorClass: 'text-indigo-400',
    hoverBorderClass: 'hover:border-indigo-900/60',
    accentClass: 'accent-indigo-500',
    badgeBgActive: 'bg-indigo-950',
    badgeTextActive: 'text-indigo-300',
    badgeBorderActive: 'border-indigo-800',
    tooltip:
      'Models trade union strikes, worker rallies, and regional pride protests against RINL disinvestment. Diverts votes to YSRCP (85%) and Congress/Left (15%) across 13 industrial constituencies.',
    description:
      'Trade union strikes and worker rallies against RINL disinvestment impacting steel city & peripheral industrial mandals.',
    targetGeography: {
      primary: '13 Industrial ACs',
      details: 'Visakhapatnam & Anakapalli (Gajuwaka, Bheemili, Vizag E/W/N/S, Tuni, Narsipatnam)',
    },
    calibratedImpact: {
      primary: '0% to -10% Penalty',
      details: 'At -6% flips Tuni to YSRCP; severely erodes NDA margins in Gajuwaka & Narsipatnam',
    },
    min: 0,
    max: 10,
    step: 0.5,
    unit: '% Penalty',
    tickLabels: ['0% (Status Quo)', '-5% (Moderate Agitation)', '-10% (Mass Worker Strike)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% penalty in steel city belt: endangers Gajuwaka & flips Tuni`
          : '○ Industrial & trade union relations calm',
      colorClass: 'text-indigo-400/90',
    }),
  },
  {
    key: 'rayalaseemaWaterGrievance',
    title: 'Rayalaseema Irrigation Grievance',
    category: 'agrarian_labor',
    categoryLabel: 'Agrarian & Labor',
    icon: Sprout,
    iconColorClass: 'text-teal-400',
    hoverBorderClass: 'hover:border-teal-900/60',
    accentClass: 'accent-teal-500',
    badgeBgActive: 'bg-teal-950',
    badgeTextActive: 'text-teal-300',
    badgeBorderActive: 'border-teal-800',
    tooltip:
      'Models agrarian drought anxiety, delayed Handri-Neeva canal works, and Krishna water allocation discontent across Rayalaseema. Feeds YSRCP irrigation grievance narrative.',
    description:
      'Handri-Neeva & Galeru-Nagari canal delay concerns, borewell depletion, and summer water scarcity across 52 Rayalaseema ACs.',
    targetGeography: {
      primary: '52 Rayalaseema ACs',
      details: 'Kurnool, Nandyal, Anantapur, Sri Sathya Sai, YSR Kadapa, Annamayya, Chittoor & Tirupati',
    },
    calibratedImpact: {
      primary: '0% to -8% Regional Drag',
      details: 'At -3.5% flips Alur, Mantralayam & Rayachoti; at -6% flips 18 seats to YSRCP',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Water Drag',
    tickLabels: ['0% (Adequate Inflows)', '-4% (Drought Anxiety)', '-8% (Severe Canal Protests)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% regional drag: flips up to ${Math.round(val * 3)} Rayalaseema seats`
          : '○ Normal canal inflows & groundwater',
      colorClass: 'text-teal-400/90',
    }),
  },
  {
    key: 'aquaFarmerPowerTariffCrisis',
    title: 'Coastal Aqua Farmers Tariff',
    category: 'agrarian_labor',
    categoryLabel: 'Agrarian & Labor',
    icon: Sprout,
    iconColorClass: 'text-cyan-400',
    hoverBorderClass: 'hover:border-cyan-900/60',
    accentClass: 'accent-cyan-500',
    badgeBgActive: 'bg-cyan-950',
    badgeTextActive: 'text-cyan-300',
    badgeBorderActive: 'border-cyan-800',
    tooltip:
      'Models shrimp and fish aquaculture farmer distress over power tariff subsidies, export freight spikes, and processing delays across coastal Godavari and Krishna delta mandals.',
    description:
      'Electricity tariff disputes for hatcheries & feed cost inflation creating severe friction among coastal aquaculture cultivators.',
    targetGeography: {
      primary: '12 Coastal Delta ACs',
      details: 'Konaseema, West Godavari, Krishna & Bapatla (Razole, Bhimavaram, Undi, Avanigadda, Repalle)',
    },
    calibratedImpact: {
      primary: '0% to -8% Aqua Penalty',
      details: 'At -4.0% flips Avanigadda & Razole to YSRCP; endangers Undi & Bhimavaram',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Aqua Distress',
    tickLabels: ['0% (Subsidized Tariffs)', '-4% (Feed Cost Distress)', '-8% (Hatchery Shutdowns)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% penalty in coastal belt: flips Avanigadda & pressures Bhimavaram`
          : '○ Aquaculture electricity subsidies running smoothly',
      colorClass: 'text-cyan-400/90',
    }),
  },
  {
    key: 'cropInsuranceFarmerDistress',
    title: 'Crop Insurance & Agrarian Distress',
    category: 'agrarian_labor',
    categoryLabel: 'Agrarian & Labor',
    icon: Sprout,
    iconColorClass: 'text-lime-400',
    hoverBorderClass: 'hover:border-lime-900/60',
    accentClass: 'accent-lime-500',
    badgeBgActive: 'bg-lime-950',
    badgeTextActive: 'text-lime-300',
    badgeBorderActive: 'border-lime-800',
    tooltip:
      'Models statewide agrarian distress caused by delayed crop insurance claim settlements (Pradhan Mantri Fasal Bima / state matching fund), unseasonal rains, and MSP procurement defaults.',
    description:
      'Delayed crop insurance payouts for unseasonal cyclone damage and paddy/chilli MSP procurement delays across rural farming mandals.',
    targetGeography: {
      primary: '147 Rural Assembly ACs',
      details: 'Paddy, cotton, chilli, groundnut and tobacco agrarian mandals statewide',
    },
    calibratedImpact: {
      primary: '0% to -8% Rural Drag',
      details: 'At -2.5% flips 11 close rural seats; at -5% flips 29 seats; at -7.5% flips 44 seats',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Agrarian Drag',
    tickLabels: ['0% (Timely Settlement)', '-4% (Payout Delays)', '-8% (Widespread Agitation)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% penalty across 147 rural seats: flips up to ${Math.round(val * 6)} seats`
          : '○ Normal agrarian harvest & insurance baseline',
      colorClass: 'text-lime-400/90',
    }),
  },
  {
    key: 'liquorPolicyRetailDisruption',
    title: 'Liquor Policy & DWCRA Friction',
    category: 'agrarian_labor',
    categoryLabel: 'Agrarian & Labor',
    icon: ShieldAlert,
    iconColorClass: 'text-pink-400',
    hoverBorderClass: 'hover:border-pink-900/60',
    accentClass: 'accent-pink-500',
    badgeBgActive: 'bg-pink-950',
    badgeTextActive: 'text-pink-300',
    badgeBorderActive: 'border-pink-800',
    tooltip:
      'Models backlash among women voters and DWCRA Self-Help Groups against the privatization of liquor retail shops, syndicate markups, and neighborhood outlet proliferation.',
    description:
      'Excise policy privatization, syndicates, and liquor shop location disputes near residential colonies triggering protests among female SHG voters.',
    targetGeography: {
      primary: '147 Rural Women ACs',
      details: 'Rural DWCRA SHG women voters across 147 non-urban constituencies statewide',
    },
    calibratedImpact: {
      primary: '0% to -8% Women Drag',
      details: 'At -3.5% flips 17 close seats; at -6% flips 30 seats; at -8% flips up to 40 seats',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% DWCRA Drag',
    tickLabels: ['0% (Satisfied)', '-4% (SHG Protests)', '-8% (Women Voter Revolt)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% penalty among women voters: flips up to ${Math.round(val * 5)} seats`
          : '○ DWCRA women loyalty baseline intact',
      colorClass: 'text-pink-400/90',
    }),
  },
  {
    key: 'govtEmployeePensionDiscontent',
    title: 'Govt Employees GPS Pension',
    category: 'agrarian_labor',
    categoryLabel: 'Agrarian & Labor',
    icon: Briefcase,
    iconColorClass: 'text-violet-400',
    hoverBorderClass: 'hover:border-violet-900/60',
    accentClass: 'accent-violet-500',
    badgeBgActive: 'bg-violet-950',
    badgeTextActive: 'text-violet-300',
    badgeBorderActive: 'border-violet-800',
    tooltip:
      'Simulates state government employee and teachers union discontent over pending Dearness Allowance (DA) arrears and demands for Old Pension Scheme (OPS) restoration over GPS.',
    description:
      'Pending DA arrears and friction over Guaranteed Pension Scheme (GPS) vs Old Pension Scheme (OPS) mobilizing state employees & teachers.',
    targetGeography: {
      primary: '14 Major Urban ACs',
      details: 'Vijayawada (W/C/E), Vizag (E/S/N/W), Guntur (W/E), Nellore City, Kadapa, Kurnool, Tirupati',
    },
    calibratedImpact: {
      primary: '0% to -8% Urban Union Cut',
      details: 'At -4.0% flips Kurnool to YSRCP; severely erodes NDA margins in Anantapur Urban & Kadapa',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Union Agitation',
    tickLabels: ['0% (Satisfied)', '-4% (Union Protests)', '-8% (Pen-Down Strike)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% penalty in urban hubs: flips Kurnool & pressures Anantapur Urban`
          : '○ Government employee unions satisfied',
      colorClass: 'text-violet-400/90',
    }),
  },
  {
    key: 'polavaramDisplacementAgitation',
    title: 'Polavaram R&R Agitation',
    category: 'agrarian_labor',
    categoryLabel: 'Agrarian & Labor',
    icon: Trees,
    iconColorClass: 'text-emerald-400',
    hoverBorderClass: 'hover:border-emerald-900/60',
    accentClass: 'accent-emerald-500',
    badgeBgActive: 'bg-emerald-950',
    badgeTextActive: 'text-emerald-300',
    badgeBorderActive: 'border-emerald-800',
    tooltip:
      'Models tribal and local community protests over rehabilitation & resettlement (R&R) compensation, diaphragm wall repairs, and water impoundment backwater submergence in agency mandals.',
    description:
      'Resettlement & rehabilitation package disputes, delayed compensation payouts, and tribal displacement anxieties in agency areas.',
    targetGeography: {
      primary: '6 Agency & Tribal ACs',
      details: 'Polavaram, Rampachodavaram, Araku Valley, Paderu, Palakonda, Kurupam',
    },
    calibratedImpact: {
      primary: '0% to -8% Agency Penalty',
      details: 'At -4.5% flips Polavaram and Rampachodavaram; consolidates tribal vote for YSRCP & Left',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Tribal Agitation',
    tickLabels: ['0% (R&R Progressing)', '-4% (R&R Sit-ins)', '-8% (Mass Agency Blockades)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% penalty in agency belts: flips Polavaram & Rampachodavaram`
          : '○ Resettlement compensation on schedule',
      colorClass: 'text-emerald-400/90',
    }),
  },
];
