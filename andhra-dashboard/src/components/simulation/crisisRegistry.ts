import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  Flame,
  ShieldAlert,
  Scale,
  GraduationCap,
  Car,
  Trees,
  Briefcase,
  Sprout,
  Waves,
} from 'lucide-react';
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
  | 'govtEmployeePensionDiscontent';

export interface CrisisConfig {
  key: CrisisKey;
  title: string;
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
  {
    key: 'amaravatiPaceSlowdown',
    title: 'Amaravati Delivery Pace',
    icon: Building2,
    iconColorClass: 'text-amber-400',
    hoverBorderClass: 'hover:border-amber-900/60',
    accentClass: 'accent-amber-500',
    badgeBgActive: 'bg-amber-950',
    badgeTextActive: 'text-amber-300',
    badgeBorderActive: 'border-amber-800',
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
      colorClass: 'text-amber-400/90',
    }),
  },
  {
    key: 'superSixFiscalFriction',
    title: 'Super Six Fiscal Delay',
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
    key: 'vizagSteelPlantBacklash',
    title: 'Vizag Steel Plant Friction',
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
    unit: '% Agitation',
    tickLabels: ['0% (Peace)', '-5% (Active Agitation)', '-10% (Mass Strikes)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% penalty across steel corridor; flips Tuni & pressures Narsipatnam`
          : '○ Industrial peace maintained in steel corridor',
      colorClass: 'text-indigo-300',
    }),
  },
  {
    key: 'tdpJspCadreClash',
    title: 'TDP-JSP Cadre Clashes',
    icon: GraduationCap,
    iconColorClass: 'text-yellow-400',
    hoverBorderClass: 'hover:border-yellow-900/60',
    accentClass: 'accent-yellow-500',
    badgeBgActive: 'bg-yellow-950',
    badgeTextActive: 'text-yellow-300',
    badgeBorderActive: 'border-yellow-800',
    tooltip:
      'Models grassroots coordination failure, seat disputes, and contract rivalries between TDP and Janasena cadres, leading to mutual cross-voting and sabotage.',
    description:
      'Clashes over local contracts, temple committee posts, and police station dominance triggering mutual cross-voting.',
    targetGeography: {
      primary: 'Statewide Alliance ACs',
      details: 'High friction in 21 JSP seats & Godavari/Krishna/Vizag Kapu-Kamma overlap zones',
    },
    calibratedImpact: {
      primary: '0% to -8% Leakage',
      details: 'At -3% flips 15 battlegrounds; at -5% flips 38 seats; at -8% flips 57 seats to YSRCP',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Friction',
    tickLabels: ['0% (Harmonious)', '-4% (Moderate Friction)', '-8% (Open Sabotage)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% cross-voting leak: flips up to ${Math.round(val * 7)} alliance seats`
          : '○ Alliance cadres perfectly united',
      colorClass: 'text-yellow-400/90',
    }),
  },
  {
    key: 'redBookPolarization',
    title: 'Red Book Polarization',
    icon: Car,
    iconColorClass: 'text-red-400',
    hoverBorderClass: 'hover:border-red-900/60',
    accentClass: 'accent-red-500',
    badgeBgActive: 'bg-red-950',
    badgeTextActive: 'text-red-300',
    badgeBorderActive: 'border-red-800',
    tooltip:
      'Simulates defensive voter consolidation and victimhood sympathy for YSRCP caused by high-profile police cases, political arrests, and perceived retribution in factional bastions.',
    description:
      'High-profile police cases and factional raids creating victimhood sympathy and galvanizing YSRCP cadre into defensive turnout.',
    targetGeography: {
      primary: 'Palnadu & Faction Belts',
      details: 'Palnadu, Prakasam, Kadapa, Kurnool plus all seats won by under 15,000 votes',
    },
    calibratedImpact: {
      primary: '0% to -8% Factional Drag',
      details: 'At -3% flips 19 battlegrounds; galvanizes defensive YSRCP Reddy/minority turnout',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Vendetta Drag',
    tickLabels: ['0% (Standard Law)', '-4% (Noticeable Friction)', '-8% (Violent Polarization)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% penalty across factional battlegrounds; mobilizes sympathetic Reddy/BC voters`
          : '○ Normal governance & policing perception',
      colorClass: 'text-red-400/90',
    }),
  },
  {
    key: 'rayalaseemaWaterGrievance',
    title: 'Rayalaseema Irrigation Friction',
    icon: Trees,
    iconColorClass: 'text-emerald-400',
    hoverBorderClass: 'hover:border-emerald-900/60',
    accentClass: 'accent-emerald-500',
    badgeBgActive: 'bg-emerald-950',
    badgeTextActive: 'text-emerald-300',
    badgeBorderActive: 'border-emerald-800',
    tooltip:
      'Models farmer anger over canal water supply delays in Handri-Neeva and Galeru Nagari (GNSS) projects across the 52 constituencies of Rayalaseema.',
    description:
      'Canal water supply anxieties and delays in Handri-Neeva/GNSS projects revive traditional YSR family loyalties in dryland mandals.',
    targetGeography: {
      primary: '52 Rayalaseema ACs',
      details: 'Kadapa, Kurnool, Nandyal, Anantapur, Sri Sathya Sai, Chittoor, Annamayya, Tirupati',
    },
    calibratedImpact: {
      primary: '0% to -8% Seema Drag',
      details: 'At -3.5% flips 13 seats; at -5% flips 21 seats; at -8% sweeps 36 Rayalaseema seats',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Drought Drag',
    tickLabels: ['0% (Water Plentiful)', '-4% (Agrarian Anxiety)', '-8% (Acute Drought Revolt)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% penalty in 52 Seema ACs: flips up to ${Math.round(val * 4.5)} seats`
          : '○ Rayalaseema agrarian baseline stable',
      colorClass: 'text-emerald-400/90',
    }),
  },
  {
    key: 'tirupatiPrasadamControversy',
    title: 'Tirupati Laddu Sanctity',
    icon: Flame,
    iconColorClass: 'text-orange-400',
    hoverBorderClass: 'hover:border-orange-900/60',
    accentClass: 'accent-orange-500',
    badgeBgActive: 'bg-orange-950',
    badgeTextActive: 'text-orange-300',
    badgeBorderActive: 'border-orange-800',
    tooltip:
      'Simulates Sanatana Dharma devotional consolidation triggered by the Tirumala laddu adulteration controversy. Surges Hindu devotional voter turnout directly into NDA candidates across 16 major temple corridor constituencies.',
    description:
      'Sacred prasadam adulteration controversy ignites Sanatana Dharma consolidation. Directly flips Punganur, Rajampet & Mantralayam to NDA as surge scales.',
    targetGeography: {
      primary: '16 Temple ACs',
      details: 'Tirupati, Chandragiri, Srikalahasti, Srisailam, Mantralayam, Rajampet, Allagadda, Punganur',
    },
    calibratedImpact: {
      primary: '0% to +8% NDA Surge',
      details: 'At +2.0% flips Punganur (Peddireddy) to TDP; at +3.5% flips Rajampet; at +5.5% Mantralayam',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Devotional Surge',
    tickLabels: ['0% (Neutral)', '+4% (Flips Punganur & Rajampet)', '+8% (Sweeps Mantralayam)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ +${val}% devotional surge: flips Punganur (Peddireddy) & Rajampet from YSRCP to NDA`
          : '○ Normal devotional baseline (no surge active)',
      colorClass: 'text-orange-400/90',
    }),
  },
  {
    key: 'polavaramDisplacementAgitation',
    title: 'Polavaram Tribal Agitation',
    icon: Trees,
    iconColorClass: 'text-teal-400',
    hoverBorderClass: 'hover:border-teal-900/60',
    accentClass: 'accent-teal-500',
    badgeBgActive: 'bg-teal-950',
    badgeTextActive: 'text-teal-300',
    badgeBorderActive: 'border-teal-800',
    tooltip:
      'Simulates tribal discontent over delayed compensation packages, colony resettlement rehabilitation (R&R), and forest patta land grievances in the Polavaram submergence zones.',
    description:
      'Delays in R&R package compensation, colony rehabilitation, and tribal patta land disputes triggering discontent across ST mandals.',
    targetGeography: {
      primary: '6 Agency Tribal ACs',
      details: 'Polavaram, Rampachodavaram, Araku Valley, Paderu, Palakonda, Kurupam',
    },
    calibratedImpact: {
      primary: '0% to -8% ST Penalty',
      details: 'At -4.0% flips Rampachodavaram & Polavaram to YSRCP; seals Agency tracts',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% ST Backlash',
    tickLabels: ['0% (Peaceful)', '-4% (Flips Rampachodavaram)', '-8% (Sweeps Agency Belts)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% ST penalty: flips Polavaram & Rampachodavaram to YSRCP`
          : '○ Agency tribal baseline peaceful',
      colorClass: 'text-teal-400/90',
    }),
  },
  {
    key: 'aquaFarmerPowerTariffCrisis',
    title: 'Aqua-Farmers Tariff Friction',
    icon: Waves,
    iconColorClass: 'text-cyan-400',
    hoverBorderClass: 'hover:border-cyan-900/60',
    accentClass: 'accent-cyan-500',
    badgeBgActive: 'bg-cyan-950',
    badgeTextActive: 'text-cyan-300',
    badgeBorderActive: 'border-cyan-800',
    tooltip:
      'Models economic distress among prawn and fish cultivators due to power tariff subsidy revisions, feed price surges, and export certification delays along the coastal delta.',
    description:
      'Fluctuating power subsidy tariffs, shrimp disease outbreaks, and seed testing lab certification costs sparking protests among delta prawn cultivators.',
    targetGeography: {
      primary: '12 Coastal Aqua ACs',
      details: 'Bhimavaram, Narasapuram, Undi, Razole, Repalle, Vemuru, Bapatla, Avanigadda',
    },
    calibratedImpact: {
      primary: '0% to -8% Delta Drag',
      details: 'At -4.0% flips Vemuru to YSRCP; severely cuts NDA margins in Bapatla & Avanigadda',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Tariff Drag',
    tickLabels: ['0% (Subsidized)', '-4% (Tariff Hikes)', '-8% (Hatchery Shutdowns)'],
    statusFormatter: (val) => ({
      text:
        val > 0
          ? `⚡ -${val}% penalty across coastal delta: flips Vemuru & pressures Bapatla`
          : '○ Aqua-culture electricity subsidies stable',
      colorClass: 'text-cyan-400/90',
    }),
  },
  {
    key: 'cropInsuranceFarmerDistress',
    title: 'Crop Insurance Distress',
    icon: Sprout,
    iconColorClass: 'text-lime-400',
    hoverBorderClass: 'hover:border-lime-900/60',
    accentClass: 'accent-lime-500',
    badgeBgActive: 'bg-lime-950',
    badgeTextActive: 'text-lime-300',
    badgeBorderActive: 'border-lime-800',
    tooltip:
      'Simulates agrarian unrest across non-urban rainfed farming mandals due to delays in PM Fasal Bima crop damage claims and Rythu Bharosa input subsidies.',
    description:
      'Delays in PM Fasal Bima crop damage settlements and Rythu Bharosa input subsidy disbursement creating widespread farmer resentment.',
    targetGeography: {
      primary: '147 Non-Urban ACs',
      details: 'Statewide rainfed farming and dryland mandals (excluding 28 urban constituencies)',
    },
    calibratedImpact: {
      primary: '0% to -8% Agrarian Drag',
      details: 'At -3% flips 18 rural seats; at -6% flips 36 seats; at -8% flips up to 48 rural seats',
    },
    min: 0,
    max: 8,
    step: 0.5,
    unit: '% Agrarian Distress',
    tickLabels: ['0% (Timely Disbursal)', '-4% (Widespread Distress)', '-8% (Agrarian Crisis)'],
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
];
