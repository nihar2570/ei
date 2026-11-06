import type { ConstituencyResult, Year, ViewMode, DemographicsDataset } from '../../types';

export type ThematicLayerKey =
  | 'NONE'
  | 'kapu'
  | 'kamma'
  | 'reddy'
  | 'bc_turpu_kapu'
  | 'bc_yadava'
  | 'bc_settibalija_goud'
  | 'sc_mala'
  | 'sc_madiga_relli'
  | 'minority_muslim'
  | 'st_tribal'
  | 'youth_18_25';

export const THEMATIC_LAYERS_META: Record<ThematicLayerKey, { label: string; icon: string; description: string }> = {
  NONE: { label: 'Electoral Baseline', icon: '🗳️', description: 'Standard Party / Margin / District view' },
  kapu: { label: 'Kapu / Balija / Telaga', icon: '🦁', description: 'Decisive demographic across Godavari, Krishna & Coastal AP' },
  kamma: { label: 'Kamma', icon: '🌾', description: 'Strong concentration in Krishna, Guntur & Godavari deltas' },
  reddy: { label: 'Reddy', icon: '🏰', description: 'Major agrarian & political bloc across Rayalaseema & Palnadu' },
  bc_turpu_kapu: { label: 'BC Turpu Kapu', icon: '🌱', description: 'Core OBC demographic across Srikakulam & Vizianagaram' },
  bc_yadava: { label: 'BC Yadava / Golla', icon: '🐄', description: 'Substantial presence across Rayalaseema & Coastal belts' },
  bc_settibalija_goud: { label: 'BC Settibalija / Goud', icon: '🌴', description: 'Key OBC community in Konaseema & Godavari' },
  sc_mala: { label: 'SC Mala', icon: '🏛️', description: 'Concentration in Godavari, Krishna & Central Coastal ACs' },
  sc_madiga_relli: { label: 'SC Madiga / Relli', icon: '👞', description: 'Significant across Rayalaseema & Prakasam reserved seats' },
  minority_muslim: { label: 'Muslim Minorities', icon: '🌙', description: 'Concentration in Rayalaseema (Kurnool, Kadapa) & Guntur urban' },
  st_tribal: { label: 'ST Tribal (Koya/Yanadi)', icon: '🏹', description: 'Agency belt concentration in ASR, Parvathipuram & Polavaram' },
  youth_18_25: { label: 'Youth (18-25)', icon: '🎓', description: 'Young first-time voter demographic density' },
};

export function getDemographicColor(pct: number): string {
  if (pct <= 4) return '#f1f5f9';
  if (pct <= 8) return '#c7d2fe';
  if (pct <= 14) return '#818cf8';
  if (pct <= 20) return '#6366f1';
  if (pct <= 26) return '#4f46e5';
  return '#312e81'; // 26%+
}

export interface MapProps {
  geoJsonData: any;
  districtGeoJsonData?: any;
  yearResults: Record<string, ConstituencyResult>;
  selectedAcNo: number | null;
  onSelectAc: (acNo: number) => void;
  viewMode: ViewMode;
  selectedYear: Year;
  demographicsData?: DemographicsDataset | null;
}
