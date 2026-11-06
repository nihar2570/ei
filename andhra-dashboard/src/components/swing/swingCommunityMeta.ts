export type PartySwing = Record<string, number>;
export type MacroSwing = Record<string, number>;

export const DECISIVE_KEYS = new Set([
  'kapu',
  'kamma',
  'reddy',
  'bc_turpu_kapu',
  'bc_yadava',
  'bc_kuruba_boya',
  'sc_madiga_relli',
  'youth_18_25',
]);

export interface CommunityMeta {
  key: string;
  name: string;
  category: 'BC' | 'SC_ST' | 'OC_MIN' | 'AGE';
  categoryLabel: string;
  sharePct: string;
  region: string;
  keyIssues: string;
}

export const ALL_COMMUNITIES: CommunityMeta[] = [
  // Backward Classes (BCs ~50% AP)
  {
    key: 'bc_turpu_kapu',
    name: 'Turpu Kapu (BC-D)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~8%',
    region: 'Uttarandhra: Srikakulam, Vizianagaram, Visakhapatnam',
    keyIssues: 'BC quota protection, cashew & irrigation MSP, regional political representation',
  },
  {
    key: 'bc_yadava',
    name: 'Yadava / Golla (BC-D)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~8%',
    region: 'Statewide: Prakasam, Nellore, Anantapur, Kurnool',
    keyIssues: 'Dairy subsidies, pasture land allocation, animal husbandry welfare',
  },
  {
    key: 'bc_kuruba_boya',
    name: 'Kuruba / Boya / Valmiki (BC-A)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~7%',
    region: 'Rayalaseema: Kurnool, Anantapur, Sri Sathya Sai',
    keyIssues: 'ST status demand for Boya/Valmiki, drip irrigation incentives, groundnut MSP',
  },
  {
    key: 'bc_settibalija_goud',
    name: 'Settibalija / Goud / Ediga (BC-B)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~6%',
    region: 'Godavari delta (Konaseema, East & West Godavari) & Rayalaseema',
    keyIssues: 'Toddy tapping rights, toddy tappers insurance, welfare corporation funding',
  },
  {
    key: 'bc_padmashali',
    name: 'Padmashali / Weavers (BC-B)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~4%',
    region: 'Dharmavaram, Mangalagiri, Chirala, Madhavaram',
    keyIssues: 'Handloom power subsidy, silk yarn price stabilization, loom modernization',
  },
  {
    key: 'bc_other',
    name: 'Other BC Castes (BC-A/B/C/D)',
    category: 'BC',
    categoryLabel: 'Backward Classes',
    sharePct: '~15%',
    region: 'Statewide spread across all 26 districts',
    keyIssues: 'BC sub-plan funds, caste census representation, self-employment loans',
  },

  // Scheduled Castes & Scheduled Tribes (~25% AP)
  {
    key: 'sc_madiga_relli',
    name: 'SC Madiga / Relli',
    category: 'SC_ST',
    categoryLabel: 'Scheduled Castes & Tribes',
    sharePct: '~9%',
    region: 'Rayalaseema, Guntur, Prakasam & Uttarandhra urban fringes',
    keyIssues: 'SC sub-categorization implementation (Supreme Court verdict), Leather park revival',
  },
  {
    key: 'sc_mala',
    name: 'SC Mala & Sub-castes',
    category: 'SC_ST',
    categoryLabel: 'Scheduled Castes & Tribes',
    sharePct: '~9%',
    region: 'Coastal Andhra: Godavari, Krishna, Guntur, Bapatla',
    keyIssues: 'Education scholarships, housing patta titles, land allocation protection',
  },
  {
    key: 'st_tribal',
    name: 'ST Agency Tribals (Koya, Konda Reddi, Savara, Jatapu)',
    category: 'SC_ST',
    categoryLabel: 'Scheduled Castes & Tribes',
    sharePct: '~6%',
    region: 'Alluri Sitharama Raju (ASR) & Parvathipuram Manyam Agency belts',
    keyIssues: 'Agency 1/70 Act preservation, Podu forest land pattas (RoFR), coffee/turmeric MSP',
  },

  // Dominant Communities & Minorities (~25% AP)
  {
    key: 'kapu',
    name: 'Kapu / Balija / Telaga (OC)',
    category: 'OC_MIN',
    categoryLabel: 'Dominant & Minorities',
    sharePct: '~16%',
    region: 'Godavari, Krishna, Guntur, Visakhapatnam & Rayalaseema (Balija)',
    keyIssues: 'Pawan Kalyan leadership consolidation, NDA alliance unity, political empowerment',
  },
  {
    key: 'kamma',
    name: 'Kamma (OC)',
    category: 'OC_MIN',
    categoryLabel: 'Dominant & Minorities',
    sharePct: '~5%',
    region: 'Krishna, Guntur, Prakasam, Chittoor & Godavari',
    keyIssues: 'Amaravati capital development, agro-business protection, TDP core base loyalty',
  },
  {
    key: 'reddy',
    name: 'Reddy (OC)',
    category: 'OC_MIN',
    categoryLabel: 'Dominant & Minorities',
    sharePct: '~7%',
    region: 'Rayalaseema (Kadapa, Kurnool, Chittoor, Anantapur) & Nellore/Prakasam',
    keyIssues: 'YSR legacy connect, irrigation projects (Rayalaseema Lift), agrarian power',
  },
  {
    key: 'minority_muslim',
    name: 'Muslim Minorities (Sunni / Dudekula)',
    category: 'OC_MIN',
    categoryLabel: 'Dominant & Minorities',
    sharePct: '~8%',
    region: 'Rayalaseema (Kurnool, Kadapa), Guntur Urban, Vijayawada',
    keyIssues: '4% BC-E reservation protection, Dulhan scheme, Waqf property protection',
  },
  {
    key: 'minority_christian',
    name: 'Christian Minorities',
    category: 'OC_MIN',
    categoryLabel: 'Dominant & Minorities',
    sharePct: '~3%',
    region: 'Coastal Andhra: Guntur, Bapatla, Krishna, Godavari',
    keyIssues: 'Church land rights, SC status for Dalit Christians, educational institution autonomy',
  },

  // Demographic Cohorts
  {
    key: 'youth_18_25',
    name: 'First-Time & Youth Voters (18-25)',
    category: 'AGE',
    categoryLabel: 'Demographic Cohorts',
    sharePct: '~14%',
    region: 'Statewide: Vizag, Vijayawada, Guntur, Tirupati & educational hubs',
    keyIssues: 'Mega DSC teacher recruitment, APPSC job calendar, IT investments, unemployment allowance',
  },
  {
    key: 'age_60_plus',
    name: 'Senior Citizens & Pensioners (60+)',
    category: 'AGE',
    categoryLabel: 'Demographic Cohorts',
    sharePct: '~13%',
    region: 'All 175 Constituencies',
    keyIssues: 'NTR Bharosa pension hike to ₹4,000/month, doorstep pension delivery, healthcare security',
  },
];

export function rebalanceShares(
  current: { TDP: number; YSRCP: number; JSP: number; OTH: number },
  changedParty: 'TDP' | 'YSRCP' | 'JSP',
  newVal: number,
  locked: { TDP?: boolean; YSRCP?: boolean; JSP?: boolean }
): { TDP: number; YSRCP: number; JSP: number; OTH: number } {
  const maxAllowed = 100 - (current.OTH || 0);
  const clampedVal = Math.max(0, Math.min(maxAllowed, newVal));
  const diff = clampedVal - current[changedParty];
  if (Math.abs(diff) < 0.05) return current;

  const otherParties = (['TDP', 'YSRCP', 'JSP'] as const).filter(
    (p) => p !== changedParty && !locked[p]
  );

  if (otherParties.length === 0) return current;

  const currentPool = otherParties.reduce((acc, p) => acc + current[p], 0);
  const updated = { ...current, [changedParty]: clampedVal };

  if (currentPool === 0) {
    const shareEach = diff / otherParties.length;
    otherParties.forEach((p) => {
      updated[p] = Math.max(0, Math.round((updated[p] - shareEach) * 10) / 10);
    });
  } else {
    let remainingToDeduct = diff;
    otherParties.forEach((p, idx) => {
      if (idx === otherParties.length - 1) {
        updated[p] = Math.max(0, Math.round((current[p] - remainingToDeduct) * 10) / 10);
      } else {
        const proportion = current[p] / currentPool;
        const deduction = Math.round(diff * proportion * 10) / 10;
        updated[p] = Math.max(0, current[p] - deduction);
        remainingToDeduct -= deduction;
      }
    });
  }

  const targetSum = 100;
  const currentSum = updated.TDP + updated.YSRCP + updated.JSP + (updated.OTH || 0);
  const drift = Math.round((targetSum - currentSum) * 10) / 10;
  if (Math.abs(drift) > 0 && otherParties.length > 0) {
    const adjustParty = otherParties[0];
    updated[adjustParty] = Math.max(0, Math.round((updated[adjustParty] + drift) * 10) / 10);
  }

  return updated;
}
