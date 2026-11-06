import * as turf from '@turf/turf';
import type { MandalDetail } from '../data/mandalData';

export interface BoothDetail {
  boothNo: number;
  name: string;
  location: string;
  mandalName: string;
  electorate: number;
  turnoutPct: number;
  targetVotes: number;
  opponentVotes: number;
  margin: number;
  triage: 'fortress' | 'battleground' | 'vulnerable' | 'hostile';
  pannaPages: number;
  actionNote: string;
  lat: number;
  lng: number;
}

export const FACILITY_TYPES = [
  'Mandal Parishad Primary School (MPPS)',
  'Zilla Parishad High School (ZPHS)',
  'Mandal Parishad Upper Primary School (MPUPS)',
  'Government Junior College (GJC)',
  'Gram Panchayat Office',
  'Community Welfare Hall (Samkshema Bhavan)',
  'Anganwadi Centre',
];

export const ROOM_VARIANTS = [
  'Main Hall',
  'East Wing, Room 1',
  'East Wing, Room 2',
  'West Wing, Room 1',
  'North Wing',
  'South Wing',
  'New Building, Room 1',
  'Old Block, Room 2',
];

export const LOCALITY_SUFFIXES = [
  'Main Town',
  'Colony',
  'Bazaar',
  'Brahmanapalle',
  'Kothapeta',
  'Ramachandrapuram',
  'Shivampet',
  'Gundlapally',
  'Venkateshwara Colony',
  'Ambedkar Nagar',
  'Gandhi Nagar',
  'Indira Nagar',
  'Peddapalle',
  'Chinna Thanda',
  'Lingareddypalle',
  'Madharam',
  'Subhash Nagar',
  'RTC X Road',
  'Market Yard',
  'Railway Gate',
];

export function pseudoHash(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export interface GenerateBoothsParams {
  acNo: number;
  mandals: MandalDetail[];
  totalValidVotes: number;
  targetParty: string;
  winnerParty?: string;
  runnerParty?: string;
  totalBooths: number;
  geoJsonData?: any;
  officialBoothData?: BoothDetail[] | null;
}

export function generateAllBooths({
  acNo,
  mandals,
  totalValidVotes,
  targetParty,
  winnerParty: _winnerParty,
  runnerParty: _runnerParty,
  totalBooths,
  geoJsonData,
  officialBoothData,
}: GenerateBoothsParams): BoothDetail[] {
  if (officialBoothData && officialBoothData.length > 0) {
    if (geoJsonData?.features) {
      const match = geoJsonData.features.find((f: any) => {
        const props = f.properties || {};
        const pAcNo = props.AC_NO ?? props.ac_no ?? props.ac ?? props.ID;
        return Number(pAcNo) === Number(acNo);
      });
      if (match) {
        try {
          const bbox = turf.bbox(match);
          const center = turf.center(match);
          const cLng = center?.geometry?.coordinates?.[0] ?? (bbox[0] + bbox[2]) / 2;
          const cLat = center?.geometry?.coordinates?.[1] ?? (bbox[1] + bbox[3]) / 2;
          return officialBoothData.map((b) => {
            try {
              const pt = turf.point([b.lng, b.lat]);
              if (!turf.booleanPointInPolygon(pt, match)) {
                return {
                  ...b,
                  lng: Number((cLng + (b.lng - cLng) * 0.4).toFixed(6)),
                  lat: Number((cLat + (b.lat - cLat) * 0.4).toFixed(6)),
                };
              }
            } catch {
              // keep b on error
            }
            return b;
          });
        } catch {
          return officialBoothData;
        }
      }
    }
    return officialBoothData;
  }

  const list: BoothDetail[] = [];
  let currentBoothIndex = 1;

  let acFeature: any = null;
  let acBbox: [number, number, number, number] = [78.0, 17.0, 79.0, 18.0];
  let centerLng = 78.5;
  let centerLat = 17.5;
  let width = 0.4;
  let height = 0.4;

  if (geoJsonData?.features) {
    const match = geoJsonData.features.find((f: any) => {
      const props = f.properties || {};
      const pAcNo = props.AC_NO ?? props.ac_no ?? props.ac ?? props.ID;
      return Number(pAcNo) === Number(acNo);
    });
    if (match) {
      acFeature = match;
      try {
        acBbox = turf.bbox(match) as [number, number, number, number];
        const c = turf.center(match);
        if (c?.geometry?.coordinates) {
          centerLng = c.geometry.coordinates[0];
          centerLat = c.geometry.coordinates[1];
        }
        width = Math.max(0.02, acBbox[2] - acBbox[0]);
        height = Math.max(0.02, acBbox[3] - acBbox[1]);
      } catch (e) {
        console.warn('Error calculating turf bbox/center for AC:', e);
      }
    }
  }

  mandals.forEach((m, mIdx) => {
    const bCount = m.booths || 20;
    const avgElectorate = Math.round((m.electorate || (totalValidVotes / 0.76)) / totalBooths);
    const isTargetLeadMandal = m.lead_party === targetParty;

    const mandalAngle = (mIdx / Math.max(1, mandals.length)) * 2 * Math.PI + 0.35;
    const mandalDistRatio = 0.22 + 0.28 * pseudoHash(acNo * 401 + (m.mandal_id || mIdx) * 179);
    const mandalBaseLng = centerLng + Math.cos(mandalAngle) * (width * 0.4) * mandalDistRatio;
    const mandalBaseLat = centerLat + Math.sin(mandalAngle) * (height * 0.4) * mandalDistRatio;

    for (let i = 1; i <= bCount; i++) {
      const rand1 = pseudoHash(acNo * 7919 + m.mandal_id * 1013 + i * 97);
      const rand2 = pseudoHash(acNo * 3571 + m.mandal_id * 631 + i * 43);
      const rand3 = pseudoHash(acNo * 1237 + m.mandal_id * 883 + i * 19);

      const facility = FACILITY_TYPES[Math.floor(rand1 * FACILITY_TYPES.length)];
      const room = ROOM_VARIANTS[Math.floor(rand2 * ROOM_VARIANTS.length)];
      const locality = i <= 3 ? `${m.name} Main Town` : `${m.name} ${LOCALITY_SUFFIXES[Math.floor(rand3 * LOCALITY_SUFFIXES.length)]}`;
      const name = `${facility} (${room})`;
      const location = `${locality}, ${m.name} Mandal`;

      const clusterId = Math.floor((i - 1) / 3);
      const roomOffset = (i - 1) % 3;
      const clusterAngle = pseudoHash((m.mandal_id || mIdx) * 997 + clusterId * 53) * 2 * Math.PI;
      const clusterSpread = 0.04 + 0.14 * pseudoHash((m.mandal_id || mIdx) * 331 + clusterId * 89);
      const clusterLng = mandalBaseLng + Math.cos(clusterAngle) * (width * clusterSpread);
      const clusterLat = mandalBaseLat + Math.sin(clusterAngle) * (height * clusterSpread);

      const roomOffsetX = (roomOffset - 1) * 0.00032;
      const roomOffsetY = ((roomOffset % 2) - 0.5) * 0.00032;

      let candLng = clusterLng + roomOffsetX;
      let candLat = clusterLat + roomOffsetY;

      if (acFeature) {
        try {
          const pt = turf.point([candLng, candLat]);
          if (!turf.booleanPointInPolygon(pt, acFeature)) {
            candLng = centerLng + (candLng - centerLng) * 0.45;
            candLat = centerLat + (candLat - centerLat) * 0.45;
          }
        } catch {
          candLng = Math.max(acBbox[0] + width * 0.05, Math.min(acBbox[2] - width * 0.05, candLng));
          candLat = Math.max(acBbox[1] + height * 0.05, Math.min(acBbox[3] - height * 0.05, candLat));
        }
      }

      const electorate = Math.max(620, Math.min(1180, Math.round(avgElectorate + (rand1 - 0.5) * 180)));
      const turnoutPct = Number((m.turnout_pct + (rand2 - 0.5) * 5).toFixed(1));
      const polledVotes = Math.round(electorate * (turnoutPct / 100));
      const pannaPages = Math.ceil(electorate / 50);

      let targetMargin = 0;
      let triage: 'fortress' | 'battleground' | 'vulnerable' | 'hostile' = 'battleground';
      let actionNote = '';

      if (isTargetLeadMandal) {
        if (rand3 < 0.35) {
          targetMargin = Math.round(65 + rand1 * 160);
          triage = 'fortress';
          actionNote = '100% GOTV mobilization; arrange transport for senior citizens; zero ad spend required';
        } else if (rand3 < 0.70) {
          targetMargin = Math.round((rand2 - 0.5) * 85);
          if (Math.abs(targetMargin) > 45) targetMargin = targetMargin > 0 ? 38 : -38;
          triage = 'battleground';
          const gap = Math.abs(targetMargin);
          actionNote = targetMargin <= 0
            ? `🎯 High Priority: Flip ${Math.ceil(gap / 2)} voters across Pages 3 & 8 to win this booth`
            : `🔥 Tight Edge: Defend fragile +${targetMargin} lead; deploy local youth leaders`;
        } else if (rand3 < 0.88) {
          targetMargin = Math.round(5 + rand1 * 35);
          triage = 'vulnerable';
          actionNote = `⚠️ Fragile Hold: Address ward grievance; prevent ${targetMargin} vote leakage to opponent`;
        } else {
          targetMargin = -Math.round(60 + rand1 * 170);
          triage = 'hostile';
          actionNote = '🛑 Hostile Zone: Appoint vigilant polling agents; prevent bogus voting';
        }
      } else {
        if (rand3 < 0.18) {
          targetMargin = Math.round(55 + rand1 * 140);
          triage = 'fortress';
          actionNote = 'Safe island in opponent territory; maintain 100% turnout of committed families';
        } else if (rand3 < 0.62) {
          targetMargin = Math.round((rand2 - 0.5) * 85);
          if (Math.abs(targetMargin) > 45) targetMargin = targetMargin > 0 ? 35 : -35;
          triage = 'battleground';
          const gap = Math.abs(targetMargin);
          actionNote = targetMargin <= 0
            ? `🎯 High Priority: Target ${Math.ceil(gap / 2)} undecided voters across Pages 4 & 11 to flip`
            : `🔥 Tight Margin: Guard against opponent surge; mobilize fence-sitters`;
        } else if (rand3 < 0.75) {
          targetMargin = Math.round(5 + rand1 * 32);
          triage = 'vulnerable';
          actionNote = `⚠️ Vulnerable Hold: Defend slender +${targetMargin} margin with targeted house visits`;
        } else {
          targetMargin = -Math.round(65 + rand1 * 180);
          triage = 'hostile';
          actionNote = '🛑 Hostile Stronghold: Minimize vote bleed; protect EVM polling process';
        }
      }

      const baseTargetVotes = Math.round((polledVotes + targetMargin) / 2);
      const baseOpponentVotes = polledVotes - baseTargetVotes;
      const targetVotes = Math.max(15, baseTargetVotes);
      const opponentVotes = Math.max(15, baseOpponentVotes);

      list.push({
        boothNo: currentBoothIndex++,
        name,
        location,
        mandalName: m.name,
        electorate,
        turnoutPct,
        targetVotes,
        opponentVotes,
        margin: targetMargin,
        triage,
        pannaPages,
        actionNote,
        lat: Number(candLat.toFixed(6)),
        lng: Number(candLng.toFixed(6)),
      });
    }
  });

  return list;
}

export interface PannaMobilizationResult {
  directPersuasionGain: number;
  turnoutExtraVotes: number;
  totalSimulatedGain: number;
  projectedNewMargin: number;
  isFlipped: boolean;
  isSolidified: boolean;
}

export function computePannaMobilization(
  pannaConversionTarget: number,
  turnoutPushPct: number,
  totalBooths: number,
  targetActualVotes: number,
  actualMargin: number,
  targetIsWinner: boolean
): PannaMobilizationResult {
  const directPersuasionGain = Math.round(pannaConversionTarget * totalBooths);
  const turnoutExtraVotes = Math.round(targetActualVotes * (turnoutPushPct / 100));
  const totalSimulatedGain = directPersuasionGain + turnoutExtraVotes;
  const projectedNewMargin = targetIsWinner
    ? actualMargin + totalSimulatedGain
    : -actualMargin + totalSimulatedGain;

  const isFlipped = !targetIsWinner && projectedNewMargin > 0;
  const isSolidified = targetIsWinner && projectedNewMargin > actualMargin;

  return {
    directPersuasionGain,
    turnoutExtraVotes,
    totalSimulatedGain,
    projectedNewMargin,
    isFlipped,
    isSolidified,
  };
}
