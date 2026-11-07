import type {
  CasteKey,
  AgeKey,
  IssueKey,
  IssueMeta,
  PersuadabilityTier,
  TouchpointStep,
  CampaignParty,
  CohortPersuadability,
} from '../../types/voterReach';

export interface CasteMeta {
  key: CasteKey;
  name: string;
  teluguName: string;
  category: 'OC' | 'BC' | 'SC' | 'ST' | 'Minority';
  color: string;
  description: string;
  coreRegions: string;
}

export const CASTE_METAS: Record<CasteKey, CasteMeta> = {
  kapu: {
    key: 'kapu',
    name: 'Kapu / Balija / Telaga',
    teluguName: 'కాపు / బలిజ / తెలగ',
    category: 'OC',
    color: '#f97316',
    description: 'Crucial decisive swing community in Godavari, Krishna & Rayalaseema districts.',
    coreRegions: 'East & West Godavari, Krishna, Visakhapatnam, Rayalaseema',
  },
  kamma: {
    key: 'kamma',
    name: 'Kamma',
    teluguName: 'కమ్మ',
    category: 'OC',
    color: '#eab308',
    description: 'Agrarian enterprise, capital city investors & strong TDP institutional anchor.',
    coreRegions: 'Krishna, Guntur, Prakasam, Chittoor, Anantapur',
  },
  reddy: {
    key: 'reddy',
    name: 'Reddy',
    teluguName: 'రెడ్డి',
    category: 'OC',
    color: '#ef4444',
    description: 'Traditional political leadership and landholders, bedrock base for YSRCP.',
    coreRegions: 'Kadapa, Kurnool, Nellore, Tirupati, Prakasam',
  },
  bc_turpu_kapu: {
    key: 'bc_turpu_kapu',
    name: 'BC Turpu Kapu',
    teluguName: 'తూర్పు కాపు',
    category: 'BC',
    color: '#06b6d4',
    description: 'Major agricultural BC demographic in North Andhra.',
    coreRegions: 'Srikakulam, Vizianagaram, Visakhapatnam',
  },
  bc_yadava: {
    key: 'bc_yadava',
    name: 'BC Yadava / Golla',
    teluguName: 'యాదవ / గొల్ల',
    category: 'BC',
    color: '#10b981',
    description: 'Livestock & pastoral community, substantial presence in South Coastal & Rayalaseema.',
    coreRegions: 'Prakasam, Nellore, Guntur, Anantapur, Kurnool',
  },
  bc_kuruba_boya: {
    key: 'bc_kuruba_boya',
    name: 'BC Kuruba / Boya / Valmiki',
    teluguName: 'కురుబ / బోయ / వాల్మీకి',
    category: 'BC',
    color: '#14b8a6',
    description: 'Dominant BC demographic in Western Rayalaseema; vital for Rayalaseema parity.',
    coreRegions: 'Anantapur, Kurnool, Chittoor, Kadapa',
  },
  bc_settibalija_goud: {
    key: 'bc_settibalija_goud',
    name: 'BC Settibalija / Goud',
    teluguName: 'శెట్టిబలిజ / గౌడ్',
    category: 'BC',
    color: '#0ea5e9',
    description: 'Traditional toddy-tapping & business community in Coastal delta belts.',
    coreRegions: 'East Godavari, Konaseema, West Godavari, Krishna',
  },
  bc_padmashali: {
    key: 'bc_padmashali',
    name: 'BC Padmashali / Weavers',
    teluguName: 'పద్మశాలి / చేనేత',
    category: 'BC',
    color: '#8b5cf6',
    description: 'Textile handloom & urban craft artisans; sensitive to power tariff and raw material subsidies.',
    coreRegions: 'Anantapur (Dharmavaram), Guntur (Mangalagiri), Prakasam (Chirala)',
  },
  bc_other: {
    key: 'bc_other',
    name: 'BC Other Artisan Groups',
    teluguName: 'ఇతర బీసీ కులాలు',
    category: 'BC',
    color: '#6366f1',
    description: 'Viswabrahmin, Nayee Brahmin, Rajaka, Vaddera & allied services.',
    coreRegions: 'Statewide spread across all 175 assembly constituencies',
  },
  sc_madiga_relli: {
    key: 'sc_madiga_relli',
    name: 'SC Madiga / Relli',
    teluguName: 'ఎస్సీ మాదిగ / రెల్లి',
    category: 'SC',
    color: '#ec4899',
    description: 'Historically active on internal reservation categorization; major swing in 2024.',
    coreRegions: 'Rayalaseema, Prakasam, Guntur, North Andhra',
  },
  sc_mala: {
    key: 'sc_mala',
    name: 'SC Mala',
    teluguName: 'ఎస్సీ మాల',
    category: 'SC',
    color: '#d946ef',
    description: 'Strong civil society and educational attainment; historically anchor for YSR family.',
    coreRegions: 'Krishna, Guntur, Godavari, Nellore',
  },
  st_tribal: {
    key: 'st_tribal',
    name: 'ST Tribal (Koya/Yanadi/Sugali)',
    teluguName: 'ఎస్టీ గిరిజనులు',
    category: 'ST',
    color: '#84cc16',
    description: 'Forest rights, agency welfare, coffee & minor forest produce MSP.',
    coreRegions: 'Alluri Sitharama Raju, Parvathipuram Manyam, Araku, Polavaram',
  },
  minority_muslim: {
    key: 'minority_muslim',
    name: 'Muslim Minority',
    teluguName: 'ముస్లిం మైనారిటీ',
    category: 'Minority',
    color: '#059669',
    description: 'Urban trade, craft & artisan segments; focused on 4% reservation and educational aid.',
    coreRegions: 'Kurnool, Kadapa, Guntur, Vijayawada, Nandyal, Nellore',
  },
  minority_christian: {
    key: 'minority_christian',
    name: 'Christian Minority',
    teluguName: 'క్రైస్తవ మైనారిటీ',
    category: 'Minority',
    color: '#a855f7',
    description: 'Substantial presence in coastal delta; high loyalty to YSR welfare programs.',
    coreRegions: 'Guntur, Krishna, Godavari, Prakasam',
  },
};

export const AGE_METAS: Record<AgeKey, { label: string; range: string; focus: string; icon: string }> = {
  youth_18_25: {
    label: 'Gen-Z & First-Time Voters',
    range: '18–25 Yrs',
    focus: 'Jobs, Skill centers, Tech investments, Competitive exams (Mega DSC)',
    icon: '⚡',
  },
  age_26_40: {
    label: 'Aspirational Young Working Class',
    range: '26–40 Yrs',
    focus: 'Amaravati/Vizag FDI, MSME loans, Housing schemes, Inflation, School fees',
    icon: '💼',
  },
  age_41_60: {
    label: 'Household Breadwinners & Farmers',
    range: '41–60 Yrs',
    focus: 'Rythu Bharosa, Crop MSP, Irrigation canals, Power tariffs, Women DBT',
    icon: '🌾',
  },
  age_60_plus: {
    label: 'Senior Pensioners & Elders',
    range: '60+ Yrs',
    focus: 'NTR Bharosa ₹4,000 Pension, Aarogyasri hospital bills, Doorstep delivery',
    icon: '🧓',
  },
};

export const ISSUES_METAS: Record<IssueKey, IssueMeta> = {
  jobs_fdi: {
    key: 'jobs_fdi',
    title: 'Job Creation, IT Investments & Mega DSC',
    shortLabel: 'Jobs & Investments',
    icon: '💼',
    category: 'Economic',
    description: 'Private industrial job parks, IT corridors in Amaravati & Vizag, Mega DSC teacher recruitment.',
    tdpAdvantage: +35,
    sampleTeluguHeadline: 'యువతకు ఉద్యోగ విప్లవం - 20 లక్షల కొలువులు & మెగా డీఎస్సీ!',
    sampleTeluguSubtext: 'ఐటీ కంపెనీల పునరుజ్జీవం, అమరావతి గ్లోబల్ ఇన్వెస్ట్‌మెంట్ హబ్ ద్వారా యువతకు బాసట.',
    sampleEnglishHook: 'Guaranteed 20 Lakh Youth Jobs, Accelerated IT investments & Immediate Mega DSC recruitment.',
  },
  welfare_dbt: {
    key: 'welfare_dbt',
    title: 'Direct Welfare Transfers (Super Six / Amma Vodi)',
    shortLabel: 'Welfare & DBT',
    icon: '💳',
    category: 'Welfare',
    description: 'Aadabidda Nidhi (₹1,500/mo), Thalliki Vandanam (₹15,000/yr), 3 free LPG gas cylinders.',
    tdpAdvantage: +12,
    sampleTeluguHeadline: 'సూపర్ సిక్స్ పథకాలతో ప్రతి మహిళా సాధికారత!',
    sampleTeluguSubtext: 'నెలకు ₹1,500 స్త్రీ నిధి, ఏడాదికి 3 ఉచిత గ్యాస్ సిలిండర్లు, ఆర్టీసీ బస్సుల్లో ఉచిత ప్రయాణం.',
    sampleEnglishHook: 'Super Six Household Shield: ₹1,500/mo women allowance, 3 free LPG cylinders, free RTC bus travel.',
  },
  agriculture_irrigation: {
    key: 'agriculture_irrigation',
    title: 'Rythu Bharosa, Crop MSP & Polavaram Water',
    shortLabel: 'Farmer MSP & Water',
    icon: '🌾',
    category: 'Agrarian',
    description: '₹20,000 annual farmer investment aid, round-the-clock free power, Polavaram canal completion.',
    tdpAdvantage: +22,
    sampleTeluguHeadline: 'రైతన్నకు భరోసా - ఏడాదికి ₹20,000 పెట్టుబడి సాయం!',
    sampleTeluguSubtext: 'పోలవరం ప్రాజెక్ట్ వేగవంతం, డ్రిప్ ఇరిగేషన్ రాయితీలు, మద్దతు ధరల గ్యారంటీ.',
    sampleEnglishHook: '₹20,000 annual farmer support, guaranteed crop procurement price, Polavaram canal water supply.',
  },
  pension_healthcare: {
    key: 'pension_healthcare',
    title: 'Senior Pensions (NTR Bharosa ₹4,000) & Aarogyasri',
    shortLabel: 'Pensions & Health',
    icon: '🏥',
    category: 'Welfare',
    description: 'Doorstep monthly pension enhanced to ₹4,000 from day one; expanded Aarogyasri hospital cashless cover.',
    tdpAdvantage: +30,
    sampleTeluguHeadline: 'ఎన్టీఆర్ భరోసా - ₹4,000 పెన్షన్ ఒకటో తారీఖునే ఇంటి వద్ద!',
    sampleTeluguSubtext: 'పెన్షన్ పై ₹1,000 పెంపు, ఆరోగ్యశ్రీ కింద ₹25 లక్షల వరకు ఉచిత వైద్య సేవలు.',
    sampleEnglishHook: 'NTR Bharosa: ₹4,000 doorstep pension on 1st of every month + ₹25L cashless health coverage.',
  },
  inflation_tariffs: {
    key: 'inflation_tariffs',
    title: 'Electricity Tariffs, Cooking Gas & Living Costs',
    shortLabel: 'Power & Living Costs',
    icon: '⚡',
    category: 'Economic',
    description: 'Rolling back electricity true-up charges, transparent sand policy, curbing daily food inflation.',
    tdpAdvantage: +18,
    sampleTeluguHeadline: 'విద్యుత్ ట్రూ-అప్ భారాల రద్దు & ఉచిత ఇసుక విధానం!',
    sampleTeluguSubtext: 'కరంట్ బిల్లుల భారం తగ్గింపు, నిత్యావసరాల ధరల నియంత్రణకు మార్కెట్ జోక్యం.',
    sampleEnglishHook: 'Relief from surging power bills, cancellation of true-up surcharge, transparent free sand policy.',
  },
  capital_governance: {
    key: 'capital_governance',
    title: 'Amaravati Capital City & Clean Governance',
    shortLabel: 'Capital & Infrastructure',
    icon: '🏛️',
    category: 'Governance',
    description: 'Single world-class people’s capital in Amaravati, world bank funding, fast-track highway connectivity.',
    tdpAdvantage: +40,
    sampleTeluguHeadline: 'ప్రజల రాజధాని అమరావతి - ప్రపంచ స్థాయి అభివృద్ధి!',
    sampleTeluguSubtext: 'రూ. 15,000 కోట్ల ప్రపంచ బ్యాంకు నిధులతో రాజధాని నిర్మాణం, రీజినల్ రింగ్ రోడ్ వేగవంతం.',
    sampleEnglishHook: 'World-Class Single Capital at Amaravati with ₹15,000 Cr multilateral funding & high-speed corridors.',
  },
  caste_dignity: {
    key: 'caste_dignity',
    title: 'BC/SC/ST Social Dignity & Self-Employment Funds',
    shortLabel: 'Social Dignity & Funds',
    icon: '🤝',
    category: 'Identity',
    description: 'Restoration of 56 BC corporations with dedicated budgets, SC categorization, artisan subsidized kits.',
    tdpAdvantage: +15,
    sampleTeluguHeadline: 'బీసీ, ఎస్సీ, ఎస్టీలకు కార్పొరేషన్ల ద్వారా నేరుగా ఉపాధి రుణాలు!',
    sampleTeluguSubtext: '56 బీసీ కార్పొరేషన్లకు నిధుల పునరుద్ధరణ, కులవృత్తుల వారికి పనిముట్ల పంపిణీ.',
    sampleEnglishHook: 'Revival of 56 BC corporations with self-employment capital subsidies & direct artisan toolkits.',
  },
};

/**
 * Real-world automatic persuadability calculator based on Party perspective,
 * Caste social network, and Age aspiration/lifestage.
 * Eliminates artificial manual toggles and reflects actual AP political dynamics.
 */
export function calculateCohortPersuadability(
  party: CampaignParty,
  caste: CasteKey,
  age: AgeKey
): CohortPersuadability {
  let basePct = 45;
  let swingPct = 40;
  let oppositionPct = 15;
  let whyTheySwing = '';
  let winningStrategy = '';
  let teluguHook = '';

  if (party === 'TDP_JSP') {
    // Campaigning for TDP-JSP-BJP Alliance
    if (caste === 'kamma') {
      basePct = 80;
      swingPct = 14;
      oppositionPct = 6;
      whyTheySwing = 'Historic cornerstone of TDP. Minor swing stems only from local MLA candidate disputes or localized canal water issues.';
      winningStrategy = 'Ensure 100% booth turnout on polling day morning (GOTV focus).';
      teluguHook = 'బూత్ స్థాయి ఓటర్లను 100% పోలింగ్ కేంద్రాలకు తరలించండి.';
    } else if (caste === 'kapu') {
      if (age === 'youth_18_25') {
        basePct = 82;
        swingPct = 14;
        oppositionPct = 4;
        whyTheySwing = 'Massive emotional alignment with Pawan Kalyan and JanaSena. Highly energized by alliance unity.';
        winningStrategy = 'Channel their passion into digital campaigning, WhatsApp group leadership, and booth policing.';
        teluguHook = 'పవన్ కళ్యాణ్ ఆశయ సాధనకు యువతను ముందుంచి ప్రచారం చేయండి.';
      } else {
        basePct = 58;
        swingPct = 32;
        oppositionPct = 10;
        whyTheySwing = 'Weighing Pawan Kalyan alliance dignity and community respect vs. previous regime direct DBT cash transfers.';
        winningStrategy = 'Emphasize Super Six ₹1,500/mo women allowance, Thalliki Vandanam, and Kapu welfare corporation budgets.';
        teluguHook = 'సూపర్ సిక్స్ పథకాల ద్వారా ప్రతి ఇంటికి అందే ఆర్థిక లబ్ధిని వివరించండి.';
      }
    } else if (caste === 'reddy') {
      if (age === 'youth_18_25') {
        basePct = 28;
        swingPct = 52;
        oppositionPct = 20;
        whyTheySwing = 'Youth break with traditional family elders over Mega DSC recruitment delays, job scarcity, and Amaravati IT stoppage.';
        winningStrategy = 'Campaign aggressively on Amaravati IT parks, 20 Lakh private jobs guarantee, and exam transparency.';
        teluguHook = 'యువత కొలువుల కోసం అమరావతి అభివృద్ధి & మెగా డీఎస్సీపై హామీ ఇవ్వండి.';
      } else {
        basePct = 14;
        swingPct = 26;
        oppositionPct = 60;
        whyTheySwing = 'Traditional deep loyalty to YSR family; accessible only through local candidate trust and agricultural concerns.';
        winningStrategy = 'Depolarize with neutral governance messaging; avoid aggressive partisan attacks on leadership.';
        teluguHook = 'వ్యవసాయ సమస్యలు, సాగునీటి ప్రాజెక్టులపై మాత్రమే దృష్టి పెట్టండి.';
      }
    } else if (
      caste === 'bc_turpu_kapu' ||
      caste === 'bc_yadava' ||
      caste === 'bc_kuruba_boya' ||
      caste === 'bc_settibalija_goud' ||
      caste === 'bc_padmashali' ||
      caste === 'bc_other'
    ) {
      // BCs are the decisive 50% swing heartland of AP
      basePct = 54;
      swingPct = 36;
      oppositionPct = 10;
      whyTheySwing = 'Frustrated by high electricity true-up charges, free sand bans, and defunct BC welfare corporations, but value DBT continuity.';
      winningStrategy = 'Deploy 8–10 multi-channel touches on power bill rollbacks, free sand, and ₹10,000 Cr BC self-employment funds.';
      teluguHook = 'విద్యుత్ ట్రూ-అప్ రద్దు & 56 బీసీ కార్పొరేషన్ల పునరుద్ధరణను విస్తృతంగా ప్రచారం చేయండి.';
    } else if (caste === 'sc_madiga_relli') {
      basePct = 48;
      swingPct = 38;
      oppositionPct = 14;
      whyTheySwing = 'Historic movement for SC internal categorization (A/B/C/D) supported by NDA + ₹4,000 monthly pension promise.';
      winningStrategy = 'Reaffirm SC categorization commitment and ₹4,000 doorstep pension delivery on 1st of every month.';
      teluguHook = 'ఎస్సీ వర్గీకరణకు కట్టుబడి ఉన్నామని, రూ. 4,000 పెన్షన్ అందుతుందని భరోసా ఇవ్వండి.';
    } else if (caste === 'sc_mala') {
      basePct = 20;
      swingPct = 34;
      oppositionPct = 46;
      whyTheySwing = 'High civil society awareness; evaluating educational quality and legal protections alongside welfare.';
      winningStrategy = 'Promote Thalliki Vandanam (₹15,000 per child) and quality English medium school modernization.';
      teluguHook = 'పిల్లల నాణ్యమైన విద్య, విదేశీ విద్యా దీవెన పునరుద్ధరణపై ప్రచారం చేయండి.';
    } else if (caste === 'st_tribal') {
      basePct = 45;
      swingPct = 39;
      oppositionPct = 16;
      whyTheySwing = 'Sensitive to agency area road connectivity, drinking water schemes, and forest produce procurement prices.';
      winningStrategy = 'Promise forest land patta rights, Girijan cooperative support, and all-weather road access.';
      teluguHook = 'ఏజెన్సీ ప్రాంతాలలో తాగునీరు మరియు గిరిజన హక్కుల రక్షణపై హామీ ఇవ్వండి.';
    } else {
      // Minorities (Muslim / Christian)
      basePct = 22;
      swingPct = 38;
      oppositionPct = 40;
      whyTheySwing = 'Skeptical of national BJP alliance; evaluate TDP local leadership credibility and 4% reservation protection.';
      winningStrategy = 'Firm public guarantee on protecting 4% Muslim reservation, Haj house facilities, and minority business loans.';
      teluguHook = 'మైనారిటీల హక్కులు, 4% రిజర్వేషన్లకు ఎటువంటి భంగం కలగదని స్పష్టం చేయండి.';
    }
  } else {
    // Campaigning for YSRCP
    if (caste === 'reddy') {
      basePct = 68;
      swingPct = 24;
      oppositionPct = 8;
      whyTheySwing = 'Agrarian distress, input subsidy delays, and anti-incumbency against local sitting MLAs.';
      winningStrategy = 'Consolidate community leadership networks and maximize rural voter turnout.';
      teluguHook = 'రైతు భరోసా మరియు సంక్షేమ పథకాల కొనసాగింపుపై నమ్మకం కలిగించండి.';
    } else if (caste === 'kamma') {
      basePct = 8;
      swingPct = 16;
      oppositionPct = 76;
      whyTheySwing = 'Entrenched historical TDP baseline; near-impossible to flip at scale.';
      winningStrategy = 'Conserve positive ad spend; rely exclusively on personal candidate relationships.';
      teluguHook = 'స్థానిక వ్యక్తిగత సంబంధాలపై మాత్రమే ఆధారపడండి.';
    } else if (caste === 'kapu') {
      basePct = 26;
      swingPct = 44;
      oppositionPct = 30;
      whyTheySwing = 'Pawan Kalyan alliance excitement vs. direct DBT cash received in bank accounts over 5 years.';
      winningStrategy = 'Target women beneficiaries directly on Cheyutha, Aasara, and Kapu Nestam direct transfers.';
      teluguHook = 'డ్వాక్రా మహిళలు & చేయూత లబ్ధిదారులతో ప్రత్యేక సమావేశాలు నిర్వహించండి.';
    } else if (caste === 'sc_mala' || caste === 'minority_christian') {
      basePct = 64;
      swingPct = 26;
      oppositionPct = 10;
      whyTheySwing = 'High baseline loyalty to YSR family and direct welfare delivery.';
      winningStrategy = 'Ensure high polling turnout and warn against welfare stoppage if opposition wins.';
      teluguHook = 'సంక్షేమ పథకాల రక్షణ కోసం ఓటు వేయాలని పిలుపునివ్వండి.';
    } else {
      // BCs under YSRCP
      basePct = 36;
      swingPct = 44;
      oppositionPct = 20;
      whyTheySwing = 'Frustrated by sand policy, electricity charges, and lack of jobs, but appreciate direct DBT.';
      winningStrategy = 'Highlight total direct cash transferred into household bank accounts without middlemen.';
      teluguHook = 'గత 5 ఏళ్లలో నేరుగా అకౌంట్లలో పడ్డ నగదు బదిలీల లెక్కను చూపించండి.';
    }
  }

  // Age cohort refinement
  if (age === 'youth_18_25') {
    swingPct = Math.min(swingPct + 8, 62);
    basePct = Math.max(basePct - 5, 8);
    oppositionPct = 100 - basePct - swingPct;
  } else if (age === 'age_60_plus') {
    swingPct = Math.max(swingPct - 6, 12);
    basePct = Math.min(basePct + 4, 82);
    oppositionPct = 100 - basePct - swingPct;
  }

  return {
    party,
    basePct,
    swingPct,
    oppositionPct,
    whyTheySwing,
    winningStrategy,
    teluguHook,
  };
}

/**
 * Calculates issue impact percentages based on (Caste, Age)
 * Derived from political survey heuristics across Andhra's 175 constituencies.
 */
export function calculateCohortIssueWeights(
  caste: CasteKey,
  age: AgeKey,
  tier?: PersuadabilityTier
): Record<IssueKey, number> {
  // Baseline initial weights (sum = 100)
  const weights: Record<IssueKey, number> = {
    jobs_fdi: 20,
    welfare_dbt: 20,
    agriculture_irrigation: 15,
    pension_healthcare: 15,
    inflation_tariffs: 12,
    capital_governance: 10,
    caste_dignity: 8,
  };

  // 1. Age skew adjustments
  if (age === 'youth_18_25') {
    weights.jobs_fdi += 24;
    weights.capital_governance += 8;
    weights.pension_healthcare -= 12;
    weights.agriculture_irrigation -= 10;
    weights.welfare_dbt -= 6;
  } else if (age === 'age_26_40') {
    weights.jobs_fdi += 14;
    weights.inflation_tariffs += 8;
    weights.capital_governance += 6;
    weights.pension_healthcare -= 10;
    weights.welfare_dbt += 2;
    weights.agriculture_irrigation -= 5;
  } else if (age === 'age_41_60') {
    weights.agriculture_irrigation += 16;
    weights.welfare_dbt += 10;
    weights.inflation_tariffs += 6;
    weights.jobs_fdi -= 12;
    weights.capital_governance -= 4;
  } else if (age === 'age_60_plus') {
    weights.pension_healthcare += 34;
    weights.welfare_dbt += 6;
    weights.jobs_fdi -= 18;
    weights.capital_governance -= 6;
    weights.inflation_tariffs += 2;
  }

  // 2. Caste skew adjustments
  if (caste === 'kamma') {
    weights.capital_governance += 16;
    weights.jobs_fdi += 6;
    weights.welfare_dbt -= 12;
  } else if (caste === 'reddy') {
    weights.agriculture_irrigation += 10;
    weights.welfare_dbt += 8;
    weights.capital_governance -= 6;
  } else if (caste === 'kapu') {
    weights.jobs_fdi += 6;
    weights.caste_dignity += 8;
    weights.inflation_tariffs += 4;
  } else if (
    caste === 'bc_turpu_kapu' ||
    caste === 'bc_yadava' ||
    caste === 'bc_kuruba_boya' ||
    caste === 'bc_settibalija_goud' ||
    caste === 'bc_padmashali' ||
    caste === 'bc_other'
  ) {
    weights.caste_dignity += 12;
    weights.inflation_tariffs += 5;
    weights.welfare_dbt += 4;
    weights.capital_governance -= 4;
  } else if (caste === 'sc_madiga_relli' || caste === 'sc_mala' || caste === 'st_tribal') {
    weights.welfare_dbt += 10;
    weights.caste_dignity += 14;
    weights.capital_governance -= 8;
  } else if (caste === 'minority_muslim' || caste === 'minority_christian') {
    weights.welfare_dbt += 12;
    weights.caste_dignity += 8;
    weights.jobs_fdi += 4;
  }

  // 3. Persuadability Tier adjustments
  if (tier === 'mid') {
    // Fence sitters care intensely about inflation, candidate delivery, and jobs
    weights.inflation_tariffs += 8;
    weights.jobs_fdi += 6;
    weights.caste_dignity -= 4;
  } else if (tier === 'hard') {
    // Opposition base requires governance and economic depolarization
    weights.capital_governance += 8;
    weights.inflation_tariffs += 8;
    weights.welfare_dbt -= 6;
  }

  // Normalize all to ensure positive numbers and sum = 100%
  const keys = Object.keys(weights) as IssueKey[];
  keys.forEach((k) => {
    if (weights[k] < 3) weights[k] = 3;
  });

  const rawSum = keys.reduce((acc, k) => acc + weights[k], 0);
  const normalized: Record<IssueKey, number> = {} as any;
  let runningTotal = 0;

  keys.forEach((k, idx) => {
    if (idx === keys.length - 1) {
      normalized[k] = 100 - runningTotal;
    } else {
      const rounded = Math.round((weights[k] / rawSum) * 100);
      normalized[k] = rounded;
      runningTotal += rounded;
    }
  });

  return normalized;
}

/**
 * 10-Touch Campaign Playbook Cadence
 * Designed to touch each target voter 5 to 10 times across 45 campaign days.
 */
export const TEN_TOUCH_CADENCE_BLUEPRINT: TouchpointStep[] = [
  {
    id: 1,
    dayWindow: 'Day 1–7',
    channel: 'digital',
    channelLabel: 'Digital Air-Cover (Meta & YouTube)',
    touchName: 'Broad Narrative & Vision Video',
    objective: 'Establish emotional connection and announce candidate manifesto pledge.',
    format: '15s non-skippable YouTube pre-roll + Meta 9:16 vertical reel targeted by age/geo.',
    costPerVoterInr: 0.45,
    frequency: 1.5,
    sampleTeluguCopy: 'ఆంధ్రప్రదేశ్ పునర్నిర్మాణానికి తొలి అడుగు - మన ఊరు, మన భవిష్యత్తు కోసం!',
    sampleEnglishCopy: 'Step 1 of rebuilding Andhra: Vision video for our constituency youth & families.',
    tierApplicability: ['easy', 'mid', 'hard'],
  },
  {
    id: 2,
    dayWindow: 'Day 8–14',
    channel: 'dark_social',
    channelLabel: 'Dark Social (WhatsApp Micro-Networks)',
    touchName: 'Targeted Explainer Infographic',
    objective: 'Break down the #1 cohort issue into a 3-point visual card shared in booth groups.',
    format: 'High-res JPEG / Telugu sticker card with candidate photo and certified data.',
    costPerVoterInr: 0.15,
    frequency: 1.0,
    sampleTeluguCopy: 'మీ కుటుంబానికి ఏటా రూ. 45,000 లబ్ధి ఎలా వస్తుందో ఇక్కడ లెక్క చూడండి!',
    sampleEnglishCopy: 'Constituency household calculator: How your family gains ₹45,000/year.',
    tierApplicability: ['easy', 'mid', 'hard'],
  },
  {
    id: 3,
    dayWindow: 'Day 15–20',
    channel: 'voice_ivr',
    channelLabel: 'Voice IVR & Direct Audio Note',
    touchName: 'Personalized Candidate Voice Call',
    objective: 'High-attention audio message in Telugu addressing local assembly challenges.',
    format: '30-second automated crystal audio call to voter registered mobile.',
    costPerVoterInr: 0.35,
    frequency: 1.0,
    sampleTeluguCopy: 'నమస్కారం, మీ కుటుంబ సంక్షేమం గురించి మీ నియోజకవర్గ నాయకుడు మాట్లాడే మాట వినండి...',
    sampleEnglishCopy: 'Vanakkam/Namaskaram: 30-sec personal audio from candidate on local drinking water & roads.',
    tierApplicability: ['easy', 'mid'],
  },
  {
    id: 4,
    dayWindow: 'Day 21–27',
    channel: 'ground_panna',
    channelLabel: 'Ground Fieldwork (Panna Pramukh)',
    touchName: 'Door-to-Door Household Guarantee Card',
    objective: 'Direct in-person physical touchpoint delivering the signed constituency pledge card.',
    format: 'Laminated physical card with family member names + Panna Pramukh badge handshake.',
    costPerVoterInr: 6.5,
    frequency: 1.0,
    sampleTeluguCopy: 'ఇంటింటికి మన వాగ్దానం - మీ ఇంట్లో అర్హులైన వారికి అందించే పథకాల గ్యారంటీ బాండ్.',
    sampleEnglishCopy: 'Physical Household Guarantee Bond handed personally at doorstep by Panna worker.',
    tierApplicability: ['easy', 'mid'],
  },
  {
    id: 5,
    dayWindow: 'Day 28–33',
    channel: 'community',
    channelLabel: 'Community & Caste Sangham Meeting',
    touchName: 'Community Elder / DWCRA Dialogue',
    objective: 'Social proof through trusted community heads, caste elders, and self-help group leaders.',
    format: 'Ward-level hall meeting or street corner chaupal with tea and open Q&A.',
    costPerVoterInr: 3.2,
    frequency: 1.0,
    sampleTeluguCopy: 'కుల సంఘ పెద్దలతో ముఖాముఖి - మన హక్కులు, గౌరవం, కార్పొరేషన్ నిధులపై స్పష్టమైన హామీ.',
    sampleEnglishCopy: 'Ward-level meeting with community elders & self-help leaders to address representation.',
    tierApplicability: ['easy', 'mid', 'hard'],
  },
  {
    id: 6,
    dayWindow: 'Day 34–38',
    channel: 'digital',
    channelLabel: 'Digital Retargeting (Meta/Instagram)',
    touchName: 'Comparative Performance & Contrast Ad',
    objective: 'Contrast previous regime record with proposed manifesto on top grievance.',
    format: 'Carousel ad comparing 2019-2024 vs Proposed 2024-2029 welfare & job metrics.',
    costPerVoterInr: 0.6,
    frequency: 2.0,
    sampleTeluguCopy: 'గత ఐదేళ్ల విధ్వంసం vs రాబోయే ఐదేళ్ల స్వర్ణయుగం - ఆలోచించి ఓటేయండి!',
    sampleEnglishCopy: '5 Years of Broken Promises vs 5 Years of Proven Governance: Side-by-side comparison.',
    tierApplicability: ['mid', 'hard'],
  },
  {
    id: 7,
    dayWindow: 'Day 39–41',
    channel: 'ground_panna',
    channelLabel: 'Mass Mobilization (Townhall / Roadshow)',
    touchName: 'Candidate Constituency Mega-Rally',
    objective: 'Demonstration of unstoppable public momentum and crowd enthusiasm.',
    format: 'Public roadshow through main mandal junctions with live local cultural troupes.',
    costPerVoterInr: 4.8,
    frequency: 1.0,
    sampleTeluguCopy: 'నియోజకవర్గ కేంద్రంలో భారీ బహిరంగ సభ - మార్పునకు నాంది!',
    sampleEnglishCopy: 'High-energy roadshow passing through all major mandal headquarters with candidate speech.',
    tierApplicability: ['easy', 'mid'],
  },
  {
    id: 8,
    dayWindow: 'D-3 Days',
    channel: 'dark_social',
    channelLabel: 'WhatsApp & SMS Slip Broadcast',
    touchName: 'Personalized Polling Station Slip',
    objective: 'Ensure zero voter friction by sending booth serial number and polling location map.',
    format: 'Digital voter slip card sent on WhatsApp with Google Maps pin of booth.',
    costPerVoterInr: 0.25,
    frequency: 1.0,
    sampleTeluguCopy: 'మీ పోలింగ్ బూత్ వివరాలు: పోలింగ్ స్టేషన్ నం. 42, జడ్పీ హైస్కూల్. మీ ఓటు హక్కును వినియోగించుకోండి!',
    sampleEnglishCopy: 'Digital Voter Slip: Booth #42, ZP High School. View directions & serial number.',
    tierApplicability: ['easy', 'mid', 'hard'],
  },
  {
    id: 9,
    dayWindow: 'D-1 Evening',
    channel: 'voice_ivr',
    channelLabel: 'Final Appeal (Top Leader Voice Call)',
    touchName: 'Party Supreme Leader Call & SMS',
    objective: 'Emotional closing appeal from party president on election eve.',
    format: 'Personal 45-second phone call from Chandrababu Naidu / Pawan Kalyan in Telugu.',
    costPerVoterInr: 0.4,
    frequency: 1.0,
    sampleTeluguCopy: 'రాష్ట్రాన్ని కాపాడుకునే సమయం ఆసన్నమైంది. రేపు ఉదయమే ఓటు వేసి భవిష్యత్తును గెలిపించండి!',
    sampleEnglishCopy: 'Election Eve call from party leadership: Turn out tomorrow early to safeguard our future.',
    tierApplicability: ['easy', 'mid'],
  },
  {
    id: 10,
    dayWindow: 'D-Day Morning (6 AM – 11 AM)',
    channel: 'gotv',
    channelLabel: 'Ground GOTV Strike (Booth Table)',
    touchName: 'Doorstep Knock & Turnout Transport',
    objective: '100% booth turnout mobilization for friendly and converted fence-sitters.',
    format: 'Volunteer morning knock at 7:00 AM + auto-rickshaw transport for elderly/disabled.',
    costPerVoterInr: 5.0,
    frequency: 1.0,
    sampleTeluguCopy: 'ఓటు వేయడానికి రండి! మా బూత్ కార్యకర్తలు మీకు సహాయం చేయడానికి సిద్ధంగా ఉన్నారు.',
    sampleEnglishCopy: 'Final GOTV door knock by Panna Pramukh with immediate transport assist to voting booth.',
    tierApplicability: ['easy', 'mid'],
  },
];
