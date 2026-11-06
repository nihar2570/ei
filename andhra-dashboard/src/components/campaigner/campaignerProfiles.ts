import type { CasteProfile } from '../../types';

export type CampaignerTier = 'A' | 'B' | 'C' | 'M';

export interface TierConfig {
  tier: CampaignerTier;
  title: string;
  role: string;
  durationLabel: string;
  stepDays: number;
  maxDaysPerAc: number;
  suggestedSquadDays: number;
  totalDays: number;
  voteLiftPerDayPct: number;
  badgeBg: string;
  badgeText: string;
  borderClr: string;
}

export const TIER_METADATA: Record<CampaignerTier, TierConfig> = {
  A: {
    tier: 'A',
    title: 'Class A • Top Leadership',
    role: 'Chief Minister / National Star Orator',
    durationLabel: '1–2 Days per AC (Mega Blitz)',
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedSquadDays: 2,
    totalDays: 20,
    voteLiftPerDayPct: 0.92,
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    borderClr: 'border-amber-300',
  },
  B: {
    tier: 'B',
    title: 'Class B • Cabinet Ministers',
    role: 'Cabinet Minister / Ex-Minister / MP',
    durationLabel: '3–7 Days per AC (Mandal Padayatra)',
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedSquadDays: 7,
    totalDays: 45,
    voteLiftPerDayPct: 0.38,
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-900',
    borderClr: 'border-indigo-300',
  },
  C: {
    tier: 'C',
    title: 'Class C • Ground Cadre',
    role: 'MLA / Ex-MLA / DCC President',
    durationLabel: '10–30 Days per AC (Ground Camp)',
    stepDays: 5,
    maxDaysPerAc: 30,
    suggestedSquadDays: 15,
    totalDays: 90,
    voteLiftPerDayPct: 0.13,
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    borderClr: 'border-emerald-300',
  },
  M: {
    tier: 'M',
    title: 'Class M • Cultural & Outside Icons',
    role: 'Tollywood Movie Star / Caste Icon / Cultural Mascot',
    durationLabel: '1–2 Days per AC (Mega Roadshow)',
    stepDays: 1,
    maxDaysPerAc: 3,
    suggestedSquadDays: 1,
    totalDays: 12,
    voteLiftPerDayPct: 2.20,
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-900',
    borderClr: 'border-purple-300',
  },
};

export interface CampaignerProfile {
  id: string;
  code: string;
  party: 'TDP' | 'YSRCP' | 'JSP' | 'BJP';
  tier: CampaignerTier;
  designation: string;
  caste: string;
  casteKey: string;
  subCastes: string[];
  keyStrength: string;
  totalDays: number;
  stepDays: number;
  maxDaysPerAc: number;
  suggestedDays: number;
  voteLiftPerDayPct: number;
  resonanceZones: string;
  avatarBg: string;
  isOutsideIcon?: boolean;
}

export const CAMPAIGNER_PROFILES: CampaignerProfile[] = [
  // ==========================================
  // --- TELUGU DESAM PARTY (TDP) ---
  // ==========================================
  {
    id: 'tdp_a1',
    code: 'A1',
    party: 'TDP',
    tier: 'A',
    designation: 'A1 • N. Chandrababu Naidu (CM / Visionary)',
    caste: 'Kamma / Urban BC Alliances',
    casteKey: 'kamma',
    subCastes: ['kamma', 'bc_yadava', 'youth_18_25'],
    keyStrength: 'Mega-rally draw, Super Six governance guarantees, Amaravati resurrection, industrial investor confidence',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 0.95,
    resonanceZones: 'Statewide, Krishna, Guntur, Amaravati, Kuppam & Rayalaseema',
    avatarBg: 'bg-yellow-500',
  },
  {
    id: 'tdp_a2',
    code: 'A2',
    party: 'TDP',
    tier: 'A',
    designation: 'A2 • Nara Lokesh (IT & HRD Minister)',
    caste: 'Kamma & Youth Corridors',
    casteKey: 'kamma',
    subCastes: ['kamma', 'youth_18_25', 'bc_turpu_kapu'],
    keyStrength: 'Yuva Galam padayatra connect, mega DSC teacher job recruitment, Red Book anti-corruption governance',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 0.88,
    resonanceZones: 'Mangalagiri, Uttarandhra, Rayalaseema youth belt',
    avatarBg: 'bg-amber-600',
  },
  {
    id: 'tdp_b1',
    code: 'B1',
    party: 'TDP',
    tier: 'B',
    designation: 'B1 • K. Atchannaidu (Agri & BC Welfare Minister)',
    caste: 'BC Turpu Kapu',
    casteKey: 'bc_turpu_kapu',
    subCastes: ['bc_turpu_kapu', 'bc_yadava', 'bc_settibalija_goud'],
    keyStrength: 'Agrarian BC consolidation, rythu welfare subsidy releases, fiery vernacular orator',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.38,
    resonanceZones: 'Srikakulam, Vizianagaram, Tekkali & North Coastal Andhra',
    avatarBg: 'bg-indigo-600',
  },
  {
    id: 'tdp_b2',
    code: 'B2',
    party: 'TDP',
    tier: 'B',
    designation: 'B2 • Payyavula Keshav (Finance Minister)',
    caste: 'Rayalaseema Agrarian / BC Allies',
    casteKey: 'bc_kuruba_boya',
    subCastes: ['bc_kuruba_boya', 'bc_yadava', 'reddy'],
    keyStrength: 'Rayalaseema drought management, Handri-Neeva irrigation channel delivery, fiscal credibility',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.36,
    resonanceZones: 'Anantapur, Uravakonda, Kurnool, Kadapa',
    avatarBg: 'bg-emerald-600',
  },
  {
    id: 'tdp_c1',
    code: 'C1',
    party: 'TDP',
    tier: 'C',
    designation: 'C1 • Telugu Yuvatha / Ground Cadre Captain',
    caste: 'BC & Mixed Ground Cadre',
    casteKey: 'bc_yadava',
    subCastes: ['bc_yadava', 'bc_settibalija_goud', 'youth_18_25'],
    keyStrength: 'Panna pramukh booth committees, intensive door-to-door welfare verification, booth agent training',
    totalDays: 90,
    stepDays: 5,
    maxDaysPerAc: 30,
    suggestedDays: 15,
    voteLiftPerDayPct: 0.13,
    resonanceZones: 'Village polling stations, mandal headquarters across 175 ACs',
    avatarBg: 'bg-slate-700',
  },
  {
    id: 'tdp_m1',
    code: 'M1',
    party: 'TDP',
    tier: 'M',
    designation: 'M1 • Nandamuri Balakrishna (Tollywood Legend & MLA)',
    caste: 'Tollywood Cinema Mass Base & Youth',
    casteKey: 'kamma',
    subCastes: ['kamma', 'youth_18_25', 'bc_kuruba_boya'],
    keyStrength: 'Unrivaled mass cinema craze, electric dialogue delivery, NTR legacy sentiment, pulls non-political voters',
    totalDays: 14,
    stepDays: 1,
    maxDaysPerAc: 3,
    suggestedDays: 1,
    voteLiftPerDayPct: 2.30,
    resonanceZones: 'Hindupur, Rayalaseema, Guntur, Krishna mass urban centers',
    avatarBg: 'bg-yellow-600',
    isOutsideIcon: true,
  },

  // ==========================================
  // --- JANASENA PARTY (JSP) ---
  // ==========================================
  {
    id: 'jsp_a1',
    code: 'A1',
    party: 'JSP',
    tier: 'A',
    designation: 'A1 • Pawan Kalyan (Deputy CM / Janasenani)',
    caste: 'Kapu / Balija / Telaga & Youth Icon',
    casteKey: 'kapu',
    subCastes: ['kapu', 'youth_18_25', 'bc_settibalija_goud'],
    keyStrength: 'Frenzied youth appeal, Sanatana Dharma pitch, anti-vendetta self-respect crusade, clean sweep in 21 ACs',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 1.15,
    resonanceZones: 'East & West Godavari, Pithapuram, Visakhapatnam, Kakinada, Tirupati',
    avatarBg: 'bg-red-600',
  },
  {
    id: 'jsp_b1',
    code: 'B1',
    party: 'JSP',
    tier: 'B',
    designation: 'B1 • Nadendla Manohar (Civil Supplies Minister)',
    caste: 'Coastal Urban & BC Allies',
    casteKey: 'kapu',
    subCastes: ['kapu', 'kamma', 'minority_muslim'],
    keyStrength: 'Paddy procurement & PDS transparency, cadre negotiation, NDA alliance synergy management',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.36,
    resonanceZones: 'Tenali, Guntur, Krishna, Godavari belt',
    avatarBg: 'bg-rose-700',
  },
  {
    id: 'jsp_c1',
    code: 'C1',
    party: 'JSP',
    tier: 'C',
    designation: 'C1 • Janasainik Youth & Veera Mahila Cadre',
    caste: 'Kapu & Social Media Youth',
    casteKey: 'kapu',
    subCastes: ['kapu', 'youth_18_25'],
    keyStrength: 'Social media virality, grassroots village volunteer vigil, female voter connect',
    totalDays: 90,
    stepDays: 5,
    maxDaysPerAc: 30,
    suggestedDays: 15,
    voteLiftPerDayPct: 0.14,
    resonanceZones: 'Coastal Andhra rural hamlets, urban colleges',
    avatarBg: 'bg-red-800',
  },
  {
    id: 'jsp_m1',
    code: 'M1',
    party: 'JSP',
    tier: 'M',
    designation: 'M1 • Mega Family Cultural Icon / Tollywood Orator',
    caste: 'Cinema Fandom & Youth Non-Caste',
    casteKey: 'youth_18_25',
    subCastes: ['youth_18_25', 'kapu'],
    keyStrength: 'Massive highway bike rallies, youth festival crowd puller, pop cultural resonance',
    totalDays: 12,
    stepDays: 1,
    maxDaysPerAc: 3,
    suggestedDays: 1,
    voteLiftPerDayPct: 2.20,
    resonanceZones: 'Bhimavaram, Rajahmundry, Vijayawada, Gajuwaka',
    avatarBg: 'bg-rose-600',
    isOutsideIcon: true,
  },

  // ==========================================
  // --- YSR CONGRESS PARTY (YSRCP) ---
  // ==========================================
  {
    id: 'ysrcp_a1',
    code: 'A1',
    party: 'YSRCP',
    tier: 'A',
    designation: 'A1 • Y.S. Jagan Mohan Reddy (President / Ex-CM)',
    caste: 'Reddy / SC Mala & Christian Minorities',
    casteKey: 'reddy',
    subCastes: ['reddy', 'sc_mala', 'minority_christian'],
    keyStrength: 'Direct Benefit Transfer (DBT) beneficiary connect, Navaratnalu welfare loyalty, defiant anti-establishment fight',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 0.92,
    resonanceZones: 'Pulivendula, Kadapa, Kurnool, Nellore, Prakasam',
    avatarBg: 'bg-sky-700',
  },
  {
    id: 'ysrcp_a2',
    code: 'A2',
    party: 'YSRCP',
    tier: 'A',
    designation: 'A2 • Senior YSRCP State Campaigner',
    caste: 'Reddy & Minorities',
    casteKey: 'reddy',
    subCastes: ['reddy', 'minority_muslim', 'minority_christian'],
    keyStrength: 'Odarpu yatra sentiment, emotional defense against TDP Red Book police harassment',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 0.85,
    resonanceZones: 'Rayalaseema, Guntur Rural, Bapatla',
    avatarBg: 'bg-blue-800',
  },
  {
    id: 'ysrcp_b1',
    code: 'B1',
    party: 'YSRCP',
    tier: 'B',
    designation: 'B1 • Botcha Satyanarayana (Senior BC Uttarandhra Strongman)',
    caste: 'BC Turpu Kapu',
    casteKey: 'bc_turpu_kapu',
    subCastes: ['bc_turpu_kapu', 'bc_yadava'],
    keyStrength: 'Deep North Coastal backward class networks, Cheepurupalli strongman, faction management',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.38,
    resonanceZones: 'Vizianagaram, Visakhapatnam, Srikakulam',
    avatarBg: 'bg-teal-700',
  },
  {
    id: 'ysrcp_b2',
    code: 'B2',
    party: 'YSRCP',
    tier: 'B',
    designation: 'B2 • Peddireddy Ramachandra Reddy (Rayalaseema Pillar)',
    caste: 'Reddy',
    casteKey: 'reddy',
    subCastes: ['reddy', 'bc_kuruba_boya'],
    keyStrength: 'Chittoor-Punganur factional mastery, local sarpanch loyalty, resource deployment',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.36,
    resonanceZones: 'Chittoor, Punganur, Pileru, Tirupati rural',
    avatarBg: 'bg-indigo-800',
  },
  {
    id: 'ysrcp_c1',
    code: 'C1',
    party: 'YSRCP',
    tier: 'C',
    designation: 'C1 • YSRCP Mandal Convener / Village Secretariat Cadre',
    caste: 'SC & Rural BC Volunteers',
    casteKey: 'sc_mala',
    subCastes: ['sc_mala', 'sc_madiga_relli', 'bc_yadava'],
    keyStrength: 'Door-to-door welfare pension verification, volunteer network mobilization, booth-level defensive vigil',
    totalDays: 90,
    stepDays: 5,
    maxDaysPerAc: 30,
    suggestedDays: 15,
    voteLiftPerDayPct: 0.13,
    resonanceZones: 'Rural village secretariats across 175 ACs',
    avatarBg: 'bg-slate-800',
  },
  {
    id: 'ysrcp_m1',
    code: 'M1',
    party: 'YSRCP',
    tier: 'M',
    designation: 'M1 • Cultural Balladeer & YSR Welfare Singer',
    caste: 'Dalit Folk & Rural Agrarian Identity',
    casteKey: 'sc_mala',
    subCastes: ['sc_mala', 'minority_christian'],
    keyStrength: 'Heartfelt rural songs praising YSR Rajanna welfare schemes, emotional crowd gatherings',
    totalDays: 14,
    stepDays: 1,
    maxDaysPerAc: 3,
    suggestedDays: 1,
    voteLiftPerDayPct: 2.10,
    resonanceZones: 'Rayalaseema & Palnadu rural mandals',
    avatarBg: 'bg-sky-800',
    isOutsideIcon: true,
  },

  // ==========================================
  // --- BHARATIYA JANATA PARTY (BJP) ---
  // ==========================================
  {
    id: 'bjp_a1',
    code: 'A1',
    party: 'BJP',
    tier: 'A',
    designation: 'A1 • Daggubati Purandeswari (AP BJP President)',
    caste: 'Kamma / Urban Middle Class',
    casteKey: 'kamma',
    subCastes: ['kamma', 'youth_18_25', 'minority_muslim'],
    keyStrength: 'NTR daughter heritage sentiment, central Modi government development credentials, clean public image',
    totalDays: 20,
    stepDays: 1,
    maxDaysPerAc: 4,
    suggestedDays: 2,
    voteLiftPerDayPct: 0.86,
    resonanceZones: 'Rajahmundry, Visakhapatnam, Vijayawada Urban',
    avatarBg: 'bg-orange-600',
  },
  {
    id: 'bjp_b1',
    code: 'B1',
    party: 'BJP',
    tier: 'B',
    designation: 'B1 • CM Ramesh / Sujana Chowdary (MP / Leader)',
    caste: 'Reddy / Kamma Industrial Base',
    casteKey: 'reddy',
    subCastes: ['reddy', 'kamma'],
    keyStrength: 'Central project clearance narrative, industrial investments in Rayalaseema & Visakhapatnam',
    totalDays: 45,
    stepDays: 1,
    maxDaysPerAc: 14,
    suggestedDays: 7,
    voteLiftPerDayPct: 0.35,
    resonanceZones: 'Anakapalli, Vijayawada West, Jammalamadugu, Dharmavaram',
    avatarBg: 'bg-amber-600',
  },
  {
    id: 'bjp_c1',
    code: 'C1',
    party: 'BJP',
    tier: 'C',
    designation: 'C1 • RSS Sangathan Mantri & District In-Charge',
    caste: 'Urban BC & Nationalist Cadre',
    casteKey: 'bc_yadava',
    subCastes: ['bc_yadava', 'youth_18_25'],
    keyStrength: 'Disciplined shakha-level booth deployment, temple committee consolidation',
    totalDays: 90,
    stepDays: 5,
    maxDaysPerAc: 30,
    suggestedDays: 15,
    voteLiftPerDayPct: 0.12,
    resonanceZones: 'Urban & semi-urban constituencies in Coastal AP',
    avatarBg: 'bg-orange-800',
  },
];

export function getConstituencySquadRecommendation(
  casteProfile: CasteProfile | Record<string, number>,
  _reservation?: string,
  party: 'TDP' | 'YSRCP' | 'JSP' | 'BJP' = 'TDP'
) {
  const sorted = Object.entries(casteProfile).sort((a, b) => (b[1] as number) - (a[1] as number));
  const dominant = sorted[0];
  const second = sorted[1];

  const readableCaste: Record<string, string> = {
    kapu: 'Kapu / Balija / Telaga',
    kamma: 'Kamma',
    reddy: 'Reddy',
    bc_turpu_kapu: 'BC Turpu Kapu',
    bc_yadava: 'BC Yadava',
    bc_kuruba_boya: 'BC Kuruba / Boya',
    bc_settibalija_goud: 'BC Settibalija / Goud',
    bc_padmashali: 'BC Padmashali',
    bc_other: 'BC Other',
    sc_madiga_relli: 'SC Madiga / Relli',
    sc_mala: 'SC Mala',
    st_tribal: 'ST Tribals',
    minority_muslim: 'Muslim Minorities',
    minority_christian: 'Christian Minorities',
  };

  const topCasteName = readableCaste[dominant[0]] || dominant[0];
  const secondCasteName = readableCaste[second?.[0]] || second?.[0] || '';

  let recommendedA = 'A1';
  let recommendedB = 'B1';
  let recommendedC = 'C1';
  let recommendedM = 'M1';
  let strategyBrief = '';

  if (dominant[0] === 'kapu' || second?.[0] === 'kapu') {
    recommendedA = 'A1';
    recommendedB = 'B1';
    recommendedC = 'C1';
    recommendedM = 'M1';
    strategyBrief = `High Kapu / Balija presence (${dominant[1]}% ${topCasteName}). Deploy A1 for joint alliance consolidation, B1 for BC harmony, and M1 for mass youth turnouts.`;
  } else if (dominant[0] === 'reddy' || second?.[0] === 'reddy') {
    recommendedA = party === 'YSRCP' ? 'A1' : 'A1';
    recommendedB = 'B2';
    recommendedC = 'C1';
    recommendedM = 'M1';
    strategyBrief = `Prominent Reddy community presence (${dominant[1]}% ${topCasteName}). Deploy A1 and Rayalaseema agrarian B2 (Payyavula/Peddireddy) with local cadre C1.`;
  } else if (dominant[0].startsWith('bc_') || second?.[0]?.startsWith('bc_')) {
    recommendedA = 'A2';
    recommendedB = 'B1';
    recommendedC = 'C1';
    recommendedM = 'M1';
    strategyBrief = `Decisive Backward Classes corridor (${dominant[1]}% ${topCasteName}, ${second?.[1] || 0}% ${secondCasteName}). Deploy Atchannaidu/Botcha (B1) with youth captain A2 and C1 ground camps.`;
  } else {
    strategyBrief = `Diverse demography (${topCasteName} + ${secondCasteName}). Balanced 4-tier deployment recommended.`;
  }

  return {
    recommendedA,
    recommendedB,
    recommendedC,
    recommendedM,
    strategyBrief,
    topCasteName,
    secondCasteName,
  };
}
