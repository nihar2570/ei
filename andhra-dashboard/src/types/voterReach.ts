export type CampaignParty = 'TDP_JSP' | 'YSRCP';

export type PersuadabilityTier = 'easy' | 'mid' | 'hard';

export interface CohortPersuadability {
  party: CampaignParty;
  basePct: number;
  swingPct: number;
  oppositionPct: number;
  whyTheySwing: string;
  winningStrategy: string;
  teluguHook: string;
}

export type AgeKey = 'youth_18_25' | 'age_26_40' | 'age_41_60' | 'age_60_plus';

export type CasteKey =
  | 'kapu'
  | 'kamma'
  | 'reddy'
  | 'bc_turpu_kapu'
  | 'bc_yadava'
  | 'bc_kuruba_boya'
  | 'bc_settibalija_goud'
  | 'bc_padmashali'
  | 'bc_other'
  | 'sc_madiga_relli'
  | 'sc_mala'
  | 'st_tribal'
  | 'minority_muslim'
  | 'minority_christian';

export type IssueKey =
  | 'jobs_fdi'
  | 'welfare_dbt'
  | 'agriculture_irrigation'
  | 'pension_healthcare'
  | 'inflation_tariffs'
  | 'capital_governance'
  | 'caste_dignity';

export interface IssueMeta {
  key: IssueKey;
  title: string;
  shortLabel: string;
  icon: string;
  category: 'Economic' | 'Welfare' | 'Agrarian' | 'Governance' | 'Identity';
  description: string;
  tdpAdvantage: number; // -50 to +50 net credibility advantage
  sampleTeluguHeadline: string;
  sampleTeluguSubtext: string;
  sampleEnglishHook: string;
}

export type ChannelType =
  | 'digital'
  | 'dark_social'
  | 'voice_ivr'
  | 'ground_panna'
  | 'community'
  | 'gotv';

export interface TouchpointStep {
  id: number;
  dayWindow: string;
  channel: ChannelType;
  channelLabel: string;
  touchName: string;
  objective: string;
  format: string;
  costPerVoterInr: number;
  frequency: number;
  sampleTeluguCopy: string;
  sampleEnglishCopy: string;
  tierApplicability: PersuadabilityTier[];
}

export interface CohortSalienceResult {
  issueKey: IssueKey;
  weightPct: number;
  impactScore: number;
  confidence: number;
}
