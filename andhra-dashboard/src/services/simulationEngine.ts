// Andhra Pradesh Electoral Simulation Engine
// Pure TypeScript calculation service for vote shifts, crisis modifiers, and coalition redistribution.

import type {
  DemographicsDataset,
  ElectionData,
  SimulatedConstituencyResult,
  ScenarioWhatIfItem,
} from '../types';
import type { MacroSwing, PartySwing } from '../components/SwingStudioModal';
import type { TurnoutSettings } from '../components/AdvancedSimulationSuite';
import { URBAN_AC_NOS } from '../components/AdvancedSimulationSuite';
import type {
  CoalitionSettings,
  MlaFatigueSettings,
  GroundCrisisSettings,
} from '../components/StrategicSimulationModels';
import {
  VIZAG_STEEL_PLANT_AC_NOS,
  AMARAVATI_CORE_AC_NOS,
  TEMPLE_BELT_AC_NOS,
  POLAVARAM_AGENCY_AC_NOS,
  COASTAL_AQUA_AC_NOS,
  URBAN_GOVT_EMPLOYEE_AC_NOS,
  JSP_SEATS_2024,
  BJP_SEATS_2024,
  RAYALASEEMA_DISTRICTS,
  YSR_FAMILY_BASTION_AC_NOS,
  JR_NTR_BELT_AC_NOS,
  MINORITY_DENSE_AC_NOS,
} from '../components/StrategicSimulationModels';

export const READABLE_COMMUNITY_NAMES: Record<string, string> = {
  kapu: 'Kapu / Balija / Telaga',
  kamma: 'Kamma',
  reddy: 'Reddy',
  bc_turpu_kapu: 'BC Turpu Kapu',
  bc_yadava: 'BC Yadava / Golla',
  bc_kuruba_boya: 'BC Kuruba / Boya / Valmiki',
  bc_settibalija_goud: 'BC Settibalija / Goud',
  bc_padmashali: 'BC Padmashali',
  bc_other: 'Other BC Castes',
  sc_madiga_relli: 'SC Madiga / Relli',
  sc_mala: 'SC Mala',
  st_tribal: 'ST / Adivasi Tribals',
  minority_muslim: 'Muslim Minorities',
  minority_christian: 'Christian Minorities',
  brahmin_vaisya: 'Brahmin & Arya Vaisya',
  youth_18_25: 'First-Time Youth (18-25)',
  women_shg_dwcra: 'Rural Women / DWCRA SHG',
  govt_employees_cps: 'Govt Employees & CPS',
  age_26_40: 'Working Age (26-40)',
  age_41_60: 'Middle Age (41-60)',
  age_60_plus: 'Seniors (60+)',
};

export const DEFAULT_ZERO_SWINGS: Record<string, PartySwing> = {
  kapu: { TDP: 0, YSRCP: 0, JSP: 0 },
  kamma: { TDP: 0, YSRCP: 0, JSP: 0 },
  reddy: { TDP: 0, YSRCP: 0, JSP: 0 },
  bc_turpu_kapu: { TDP: 0, YSRCP: 0, JSP: 0 },
  bc_yadava: { TDP: 0, YSRCP: 0, JSP: 0 },
  bc_kuruba_boya: { TDP: 0, YSRCP: 0, JSP: 0 },
  bc_settibalija_goud: { TDP: 0, YSRCP: 0, JSP: 0 },
  bc_padmashali: { TDP: 0, YSRCP: 0, JSP: 0 },
  bc_other: { TDP: 0, YSRCP: 0, JSP: 0 },
  sc_madiga_relli: { TDP: 0, YSRCP: 0, JSP: 0 },
  sc_mala: { TDP: 0, YSRCP: 0, JSP: 0 },
  st_tribal: { TDP: 0, YSRCP: 0, JSP: 0 },
  minority_muslim: { TDP: 0, YSRCP: 0, JSP: 0 },
  minority_christian: { TDP: 0, YSRCP: 0, JSP: 0 },
  youth_18_25: { TDP: 0, YSRCP: 0, JSP: 0 },
  age_26_40: { TDP: 0, YSRCP: 0, JSP: 0 },
  age_41_60: { TDP: 0, YSRCP: 0, JSP: 0 },
  age_60_plus: { TDP: 0, YSRCP: 0, JSP: 0 },
};

export interface SimulationEngineInput {
  data: DemographicsDataset;
  activePreset: string;
  activeCustomizedCount?: number;
  swings: Record<string, PartySwing>;
  macroSwing: MacroSwing;
  turnoutSettings: TurnoutSettings;
  coalitionSettings: CoalitionSettings;
  mlaFatigueSettings: MlaFatigueSettings;
  groundCrisisSettings: GroundCrisisSettings;
  activeElectionData?: ElectionData | null;
  tossUpThreshold?: number;
}

export interface SimulationTally {
  counts: Record<string, number>;
  flippedCount: number;
  tossUpCount: number;
  ndaTotal: number;
  tdpDiff: number;
  ysrcpDiff: number;
  jspDiff: number;
  bjpDiff: number;
}

/**
 * Runs the complete constituency simulation across all 175 Andhra Pradesh Assembly segments.
 */
export function runConstituencySimulation(input: SimulationEngineInput): SimulatedConstituencyResult[] {
  const {
    data,
    activePreset,
    activeCustomizedCount = 0,
    swings,
    macroSwing,
    turnoutSettings,
    coalitionSettings,
    mlaFatigueSettings,
    groundCrisisSettings,
    activeElectionData,
    tossUpThreshold = 5000,
  } = input;

  const list: SimulatedConstituencyResult[] = [];

  const isHistorical = ['nda_2024_sweep', 'baseline', 'ysrcp_2019_wave', 'bifurcation_2014'].includes(activePreset);

  // If viewing official historical benchmark without manual customization, show certified historical results directly
  if (isHistorical && activeCustomizedCount === 0 && macroSwing.TDP === 0 && macroSwing.YSRCP === 0 && macroSwing.JSP === 0) {
    const targetYear = activePreset === 'ysrcp_2019_wave' ? '2019' : activePreset === 'bifurcation_2014' ? '2014' : '2024';
    const yearResults = activeElectionData?.results?.[targetYear];

    if (yearResults) {
      Object.values(data.constituencies).forEach((ac) => {
        const hist = yearResults[String(ac.ac_no)];
        if (hist) {
          const isFlipped = targetYear === '2024' ? false : hist.winner.party !== ac.winner_2023.party;
          const tier: 'TOSS_UP' | 'LEAN' | 'SOLID' =
            hist.margin <= tossUpThreshold ? 'TOSS_UP' : hist.margin < 15000 ? 'LEAN' : 'SOLID';

          let maxComm = 'kapu';
          let maxPct = 0;
          Object.entries(ac.caste_profile).forEach(([k, v]) => {
            if (v > maxPct) {
              maxPct = v;
              maxComm = k;
            }
          });

          list.push({
            ac_no: ac.ac_no,
            ac_name: ac.ac_name,
            district: ac.district,
            reservation: ac.reservation,
            votes_2023: {
              winner_party: ac.winner_2023.party,
              runner_party: ac.runner_up_2023.party,
              margin: ac.margin_2023,
              margin_pct: ac.margin_pct_2023,
            },
            simulated: {
              winner_party: hist.winner.party,
              runner_party: hist.runner_up.party,
              winner_votes: hist.winner.votes,
              runner_votes: hist.runner_up.votes,
              margin: hist.margin,
              margin_pct: hist.margin_pct,
              party_votes: {
                TDP: hist.winner.party === 'TDP' ? hist.winner.votes : hist.runner_up.party === 'TDP' ? hist.runner_up.votes : 0,
                YSRCP: hist.winner.party === 'YSRCP' ? hist.winner.votes : hist.runner_up.party === 'YSRCP' ? hist.runner_up.votes : 0,
                JSP: hist.winner.party === 'JSP' ? hist.winner.votes : hist.runner_up.party === 'JSP' ? hist.runner_up.votes : 0,
                BJP: hist.winner.party === 'BJP' ? hist.winner.votes : hist.runner_up.party === 'BJP' ? hist.runner_up.votes : 0,
                INC: hist.winner.party === 'INC' ? hist.winner.votes : hist.runner_up.party === 'INC' ? hist.runner_up.votes : 0,
              },
              is_flipped: isFlipped,
              flipped_from: isFlipped ? ac.winner_2023.party : undefined,
            },
            key_demographic: READABLE_COMMUNITY_NAMES[maxComm] || maxComm,
            key_demographic_pct: maxPct,
            battleground_tier: tier,
          });
        }
      });

      if (list.length === 175) {
        return list;
      }
    }
  }

  // Active Simulation Engine Loop
  Object.values(data.constituencies).forEach((ac) => {
    const actualWinner = ac.winner_2023.party;
    const actualRunner = ac.runner_up_2023.party;
    const totalVotes = ac.total_votes_2023;

    const majorParties = ['TDP', 'YSRCP', 'JSP', 'BJP', 'INC'];
    const winnerIsMajor = majorParties.includes(actualWinner);
    const runnerIsMajor = majorParties.includes(actualRunner);

    const partyPairs: [string, number][] = [];
    if (!winnerIsMajor) partyPairs.push([actualWinner, ac.winner_2023.votes]);
    if (!runnerIsMajor) partyPairs.push([actualRunner, ac.runner_up_2023.votes]);

    const isBjpSeat = BJP_SEATS_2024.has(ac.ac_no);
    const isJspSeat = JSP_SEATS_2024.has(ac.ac_no);

    const fallbackTdp = totalVotes * 0.44;
    const fallbackYsrcp = totalVotes * 0.39;
    const fallbackJsp = totalVotes * 0.48;
    const fallbackBjp = totalVotes * 0.44;
    const fallbackInc = totalVotes * 0.02;

    let tdpVotes = 0;
    let jspVotes = 0;
    let bjpVotes = 0;
    let ysrcpVotes = actualWinner === 'YSRCP' ? ac.winner_2023.votes : actualRunner === 'YSRCP' ? ac.runner_up_2023.votes : fallbackYsrcp;
    let incVotes = actualWinner === 'INC' ? ac.winner_2023.votes : actualRunner === 'INC' ? ac.runner_up_2023.votes : fallbackInc;

    if (isBjpSeat) {
      bjpVotes = actualWinner === 'BJP' ? ac.winner_2023.votes : actualRunner === 'BJP' ? ac.runner_up_2023.votes : fallbackBjp;
    } else if (isJspSeat) {
      jspVotes = actualWinner === 'JSP' ? ac.winner_2023.votes : actualRunner === 'JSP' ? ac.runner_up_2023.votes : fallbackJsp;
    } else {
      tdpVotes = actualWinner === 'TDP' ? ac.winner_2023.votes : actualRunner === 'TDP' ? ac.runner_up_2023.votes : fallbackTdp;
    }

    // Turnout & Mobilization Modeler
    const isUrban = URBAN_AC_NOS.has(ac.ac_no);
    const turnoutDiffPct = isUrban ? turnoutSettings.urbanShift : turnoutSettings.ruralShift;
    if (turnoutDiffPct !== 0) {
      const turnoutMultiplier = 1 + turnoutDiffPct / 100;
      tdpVotes *= turnoutMultiplier;
      ysrcpVotes *= turnoutMultiplier;
      jspVotes *= turnoutMultiplier;
      bjpVotes *= turnoutMultiplier;
    }

    // Female Mobilization (Aadabidda Nidhi & Super Six)
    if (turnoutSettings.femaleShift !== 0) {
      const femaleVoteShift = totalVotes * (turnoutSettings.femaleShift * 0.005);
      tdpVotes += femaleVoteShift * 0.70;
      jspVotes += femaleVoteShift * 0.30;
      ysrcpVotes -= femaleVoteShift;
    }

    // Community-weighted demographic swings
    const cp = ac.caste_profile;
    const ap = ac.age_profile;

    Object.entries(swings).forEach(([commKey, swingObj]) => {
      let weightPct = 0;
      if (commKey in cp) {
        weightPct = (cp as any)[commKey] || 0;
      } else if (commKey in ap) {
        weightPct = (ap as any)[commKey] || 0;
      }

      if (weightPct > 0) {
        const communityVoters = totalVotes * (weightPct / 100);
        const tdpShift = communityVoters * ((swingObj.TDP || 0) / 100);
        const ysrcpShift = communityVoters * ((swingObj.YSRCP || 0) / 100);
        const jspShift = communityVoters * ((swingObj.JSP || 0) / 100);

        tdpVotes += tdpShift;
        ysrcpVotes += ysrcpShift;
        jspVotes += jspShift;
      }
    });

    // Statewide Uniform Macro Swing
    tdpVotes += totalVotes * ((macroSwing.TDP || 0) / 100);
    ysrcpVotes += totalVotes * ((macroSwing.YSRCP || 0) / 100);
    jspVotes += totalVotes * ((macroSwing.JSP || 0) / 100);

    // Seat Sharing & Coalition Dynamics
    if (
      activePreset === 'nda_2024_sweep' ||
      activePreset === 'baseline' ||
      activePreset.startsWith('survey_') ||
      activePreset.startsWith('custom_survey_')
    ) {
      // Clean baseline without artificial double transfers
    } else if (activePreset === 'nda_2029_defense' || activePreset === 'nda_2029_max_surge') {
      const isJspContested = JSP_SEATS_2024.has(ac.ac_no);
      const isBjpContested = BJP_SEATS_2024.has(ac.ac_no);

      if (isJspContested) {
        const tdpPool = Math.max(0, tdpVotes);
        const transferRatio = coalitionSettings.tdpToJspTransferPct / 100;
        const leakRatio = coalitionSettings.rebelLeakagePct / 100;
        jspVotes += tdpPool * transferRatio;
        ysrcpVotes += tdpPool * leakRatio;
        tdpVotes = 0;
      } else if (isBjpContested) {
        const tdpPool = Math.max(0, tdpVotes);
        const transferRatio = coalitionSettings.ndaToBjpTransferPct / 100;
        const leakRatio = coalitionSettings.rebelLeakagePct / 100;
        bjpVotes += tdpPool * transferRatio;
        ysrcpVotes += tdpPool * leakRatio;
        tdpVotes = 0;
      } else {
        const jspPool = Math.max(0, jspVotes);
        const transferRatio = coalitionSettings.jspToTdpTransferPct / 100;
        const leakRatio = coalitionSettings.rebelLeakagePct / 100;
        tdpVotes += jspPool * transferRatio;
        ysrcpVotes += jspPool * leakRatio;
        jspVotes = 0;
      }
    } else if (activePreset === 'triangular_2029_solo' || activePreset === 'jsp_solo_split') {
      if (!JSP_SEATS_2024.has(ac.ac_no)) {
        const kapuShare = ((cp as any).kapu || 12.0) / 100;
        const youthShare = ((ap as any).youth_18_25 || 14.0) / 100;
        const jspBase = totalVotes * (kapuShare * 0.52 + youthShare * 0.32 + 0.04);
        tdpVotes = Math.max(0, tdpVotes - jspBase * 0.65);
        ysrcpVotes = Math.max(0, ysrcpVotes - jspBase * 0.35);
        jspVotes = jspBase;
      }
    } else if (activePreset === 'tdp_vs_jsp_bjp_2029') {
      if (BJP_SEATS_2024.has(ac.ac_no)) {
        const jspPool = Math.max(0, jspVotes);
        bjpVotes += jspPool * 0.85;
        jspVotes = 0;
      } else {
        const bjpPool = Math.max(0, bjpVotes);
        jspVotes += bjpPool * 0.85;
        bjpVotes = 0;
        if (!JSP_SEATS_2024.has(ac.ac_no)) {
          const kapuShare = ((cp as any).kapu || 12.0) / 100;
          const youthShare = ((ap as any).youth_18_25 || 14.0) / 100;
          const jspBase = totalVotes * (kapuShare * 0.58 + youthShare * 0.32 + 0.05);
          tdpVotes = Math.max(0, tdpVotes - jspBase * 0.65);
          ysrcpVotes = Math.max(0, ysrcpVotes - jspBase * 0.35);
          jspVotes = jspBase;
        }
      }
    }

    // Candidate Fatigue & Incumbent MLA Replacement Simulator
    const isTargetWinner = actualWinner === mlaFatigueSettings.targetParty;
    if (isTargetWinner) {
      const isNarrowWin = ac.margin_2023 < 8000;
      const isUnpopular = isNarrowWin || ac.margin_pct_2023 < 5.0;

      if (mlaFatigueSettings.replaceIncumbentPct > 0) {
        const replacementChance = mlaFatigueSettings.replaceIncumbentPct / 50;
        if (isUnpopular && ((ac.ac_no * 7 + 13) % 100) / 100 <= replacementChance) {
          const boost = totalVotes * (mlaFatigueSettings.freshFaceBoost / 100);
          if (actualWinner === 'TDP') {
            tdpVotes += boost;
            ysrcpVotes -= boost;
          } else if (actualWinner === 'YSRCP') {
            ysrcpVotes += boost;
            tdpVotes -= boost;
          } else if (actualWinner === 'JSP') {
            jspVotes += boost;
            ysrcpVotes -= boost;
          }
        } else {
          const penalty = totalVotes * (Math.abs(mlaFatigueSettings.unpopularMlaPenalty) / 100);
          if (actualWinner === 'TDP') {
            tdpVotes -= penalty;
            ysrcpVotes += penalty;
          } else if (actualWinner === 'YSRCP') {
            ysrcpVotes -= penalty;
            tdpVotes += penalty;
          } else if (actualWinner === 'JSP') {
            jspVotes -= penalty;
            ysrcpVotes += penalty;
          }
        }
      }
    }

    // Crisis Modifiers Engine
    const applyNdaCut = (cutRatio: number, ysrcpShare = 1.0, incShare = 0) => {
      const cut = totalVotes * cutRatio;
      if (isJspSeat) jspVotes = Math.max(0, jspVotes - cut);
      else if (isBjpSeat) bjpVotes = Math.max(0, bjpVotes - cut);
      else tdpVotes = Math.max(0, tdpVotes - cut);

      ysrcpVotes += cut * ysrcpShare;
      if (incShare > 0) incVotes += cut * incShare;
    };

    const applyNdaSurge = (surgeRatio: number) => {
      const surge = totalVotes * surgeRatio;
      ysrcpVotes = Math.max(0, ysrcpVotes - surge);
      if (isJspSeat) jspVotes += surge;
      else if (isBjpSeat) bjpVotes += surge;
      else tdpVotes += surge;
    };

    const applyYsrcpCut = (cutRatio: number, ndaShare = 0.65, incShare = 0.35) => {
      const cut = totalVotes * cutRatio;
      ysrcpVotes = Math.max(0, ysrcpVotes - cut);
      incVotes += cut * incShare;
      const ndaBoost = cut * ndaShare;
      if (isJspSeat) jspVotes += ndaBoost;
      else if (isBjpSeat) bjpVotes += ndaBoost;
      else tdpVotes += ndaBoost;
    };

    if (groundCrisisSettings.amaravatiPaceSlowdown > 0 && AMARAVATI_CORE_AC_NOS.has(ac.ac_no)) {
      applyNdaCut(groundCrisisSettings.amaravatiPaceSlowdown / 100);
    }
    if (groundCrisisSettings.superSixFiscalFriction > 0) {
      applyNdaCut(groundCrisisSettings.superSixFiscalFriction / 100);
    }
    if (groundCrisisSettings.vizagSteelPlantBacklash > 0 && VIZAG_STEEL_PLANT_AC_NOS.has(ac.ac_no)) {
      applyNdaCut(groundCrisisSettings.vizagSteelPlantBacklash / 100, 0.85, 0.15);
    }
    if (groundCrisisSettings.tdpJspCadreClash > 0) {
      applyNdaCut(groundCrisisSettings.tdpJspCadreClash / 100);
    }
    if (
      groundCrisisSettings.redBookPolarization > 0 &&
      (ac.margin_2023 < 15000 || ['Palnadu', 'Prakasam', 'YSR Kadapa', 'Kurnool'].includes(ac.district))
    ) {
      applyNdaCut(groundCrisisSettings.redBookPolarization / 100);
    }
    if (groundCrisisSettings.rayalaseemaWaterGrievance > 0 && RAYALASEEMA_DISTRICTS.has(ac.district)) {
      applyNdaCut(groundCrisisSettings.rayalaseemaWaterGrievance / 100);
    }
    if (groundCrisisSettings.tirupatiPrasadamControversy > 0 && TEMPLE_BELT_AC_NOS.has(ac.ac_no)) {
      applyNdaSurge(groundCrisisSettings.tirupatiPrasadamControversy / 100);
    }
    if (groundCrisisSettings.polavaramDisplacementAgitation > 0 && POLAVARAM_AGENCY_AC_NOS.has(ac.ac_no)) {
      applyNdaCut(groundCrisisSettings.polavaramDisplacementAgitation / 100, 0.85, 0.15);
    }
    if (groundCrisisSettings.aquaFarmerPowerTariffCrisis > 0 && COASTAL_AQUA_AC_NOS.has(ac.ac_no)) {
      applyNdaCut(groundCrisisSettings.aquaFarmerPowerTariffCrisis / 100);
    }
    if (groundCrisisSettings.cropInsuranceFarmerDistress > 0 && !URBAN_AC_NOS.has(ac.ac_no)) {
      applyNdaCut(groundCrisisSettings.cropInsuranceFarmerDistress / 100);
    }
    if (groundCrisisSettings.liquorPolicyRetailDisruption > 0 && !URBAN_AC_NOS.has(ac.ac_no)) {
      applyNdaCut(groundCrisisSettings.liquorPolicyRetailDisruption / 100);
    }
    if (groundCrisisSettings.govtEmployeePensionDiscontent > 0 && URBAN_GOVT_EMPLOYEE_AC_NOS.has(ac.ac_no)) {
      applyNdaCut(groundCrisisSettings.govtEmployeePensionDiscontent / 100, 0.75, 0.25);
    }

    // New Family & Regional Crises
    if (
      groundCrisisSettings.ysrFamilyLegacyWar > 0 &&
      (YSR_FAMILY_BASTION_AC_NOS.has(ac.ac_no) || ['YSR Kadapa', 'Annamayya'].includes(ac.district))
    ) {
      applyYsrcpCut(groundCrisisSettings.ysrFamilyLegacyWar / 100, 0.6, 0.4);
    }
    if (
      groundCrisisSettings.jrNtrVoteSplit > 0 &&
      (JR_NTR_BELT_AC_NOS.has(ac.ac_no) || ['Krishna', 'NTR', 'Guntur'].includes(ac.district))
    ) {
      applyNdaCut(groundCrisisSettings.jrNtrVoteSplit / 100);
    }
    if (
      groundCrisisSettings.pawanKalyanCoalitionUltimatum > 0 &&
      (JSP_SEATS_2024.has(ac.ac_no) ||
        ['Kakinada', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'West Godavari'].includes(ac.district))
    ) {
      applyNdaCut(groundCrisisSettings.pawanKalyanCoalitionUltimatum / 100);
    }
    if (
      groundCrisisSettings.bjpCentralPressureMinorityAlienation > 0 &&
      (MINORITY_DENSE_AC_NOS.has(ac.ac_no) ||
        (((cp as any).minority_muslim || 0) + ((cp as any).minority_christian || 0) > 12))
    ) {
      applyNdaCut(groundCrisisSettings.bjpCentralPressureMinorityAlienation / 100, 0.75, 0.25);
    }
    if (
      groundCrisisSettings.centralAgencyLeadershipArrest > 0 &&
      (ac.margin_2023 < 10000 || ac.margin_pct_2023 < 5.0)
    ) {
      applyNdaCut(groundCrisisSettings.centralAgencyLeadershipArrest / 100);
    }
    if (
      groundCrisisSettings.assetFreezingCampaignFreeze > 0 &&
      !URBAN_AC_NOS.has(ac.ac_no)
    ) {
      applyNdaCut(groundCrisisSettings.assetFreezingCampaignFreeze / 100);
    }
    if (
      groundCrisisSettings.scSubCategorizationBacklash > 0 &&
      ac.reservation === 'SC'
    ) {
      applyNdaCut(groundCrisisSettings.scSubCategorizationBacklash / 100, 0.8, 0.2);
    }
    if (
      groundCrisisSettings.kapuReservationBcFriction > 0 &&
      ['Kakinada', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'West Godavari', 'Visakhapatnam', 'Anakapalli'].includes(ac.district)
    ) {
      applyNdaCut(groundCrisisSettings.kapuReservationBcFriction / 100);
    }
    if (
      groundCrisisSettings.treasuryOverdraftDbtFreeze > 0 &&
      !URBAN_AC_NOS.has(ac.ac_no)
    ) {
      applyNdaCut(groundCrisisSettings.treasuryOverdraftDbtFreeze / 100);
    }

    // Tally integer votes
    tdpVotes = Math.max(0, Math.round(tdpVotes));
    ysrcpVotes = Math.max(0, Math.round(ysrcpVotes));
    jspVotes = Math.max(0, Math.round(jspVotes));
    bjpVotes = Math.max(0, Math.round(bjpVotes));
    incVotes = Math.max(0, Math.round(incVotes));

    if (tdpVotes > 0) partyPairs.push(['TDP', tdpVotes]);
    if (ysrcpVotes > 0) partyPairs.push(['YSRCP', ysrcpVotes]);
    if (jspVotes > 0) partyPairs.push(['JSP', jspVotes]);
    if (bjpVotes > 0) partyPairs.push(['BJP', bjpVotes]);
    if (incVotes > 0) partyPairs.push(['INC', incVotes]);
    partyPairs.sort((a, b) => b[1] - a[1]);

    const simWinner = partyPairs[0][0];
    const simWinnerVotes = partyPairs[0][1];
    const simRunner = partyPairs[1] ? partyPairs[1][0] : 'OTH';
    const simRunnerVotes = partyPairs[1] ? partyPairs[1][1] : 0;

    const margin = simWinnerVotes - simRunnerVotes;
    const marginPct = Number(((margin / Math.max(1, simWinnerVotes + simRunnerVotes)) * 100).toFixed(2));
    const isFlipped = simWinner !== actualWinner;

    let maxComm = 'kapu';
    let maxPct = 0;
    Object.entries(cp).forEach(([k, v]) => {
      if (v > maxPct) {
        maxPct = v;
        maxComm = k;
      }
    });

    const tier: 'TOSS_UP' | 'LEAN' | 'SOLID' =
      margin <= tossUpThreshold ? 'TOSS_UP' : margin < 15000 ? 'LEAN' : 'SOLID';

    list.push({
      ac_no: ac.ac_no,
      ac_name: ac.ac_name,
      district: ac.district,
      reservation: ac.reservation,
      votes_2023: {
        winner_party: actualWinner,
        runner_party: actualRunner,
        margin: ac.margin_2023,
        margin_pct: ac.margin_pct_2023,
      },
      simulated: {
        winner_party: simWinner,
        runner_party: simRunner,
        winner_votes: simWinnerVotes,
        runner_votes: simRunnerVotes,
        margin,
        margin_pct: marginPct,
        party_votes: {
          TDP: tdpVotes,
          YSRCP: ysrcpVotes,
          JSP: jspVotes,
          BJP: bjpVotes,
          INC: incVotes,
        },
        is_flipped: isFlipped,
        flipped_from: isFlipped ? actualWinner : undefined,
      },
      key_demographic: READABLE_COMMUNITY_NAMES[maxComm] || maxComm,
      key_demographic_pct: maxPct,
      battleground_tier: tier,
    });
  });

  return list;
}

/**
 * Computes statewide party tallies, flips, and majority differentials.
 */
export function computeSimulationTally(results: SimulatedConstituencyResult[]): SimulationTally {
  const counts: Record<string, number> = { TDP: 0, YSRCP: 0, JSP: 0, BJP: 0, INC: 0, OTH: 0 };
  let flippedCount = 0;
  let tossUpCount = 0;

  results.forEach((r) => {
    counts[r.simulated.winner_party] = (counts[r.simulated.winner_party] || 0) + 1;
    if (r.simulated.is_flipped) flippedCount++;
    if (r.battleground_tier === 'TOSS_UP') tossUpCount++;
  });

  const ndaTotal = (counts.TDP || 0) + (counts.JSP || 0) + (counts.BJP || 0);

  return {
    counts,
    flippedCount,
    tossUpCount,
    ndaTotal,
    tdpDiff: (counts.TDP || 0) - 135,
    ysrcpDiff: (counts.YSRCP || 0) - 11,
    jspDiff: (counts.JSP || 0) - 21,
    bjpDiff: (counts.BJP || 0) - 8,
  };
}

/**
 * Generates what-if summary chips for active scenario synchronization.
 */
export function generateScenarioWhatIfs(
  activePreset: string,
  _coalitionSettings: CoalitionSettings,
  swings: Record<string, PartySwing>,
  turnoutSettings: TurnoutSettings,
  macroSwing: MacroSwing,
  mlaFatigueSettings: MlaFatigueSettings,
  groundCrisisSettings: GroundCrisisSettings,
  activeSurveyTitle?: string
): ScenarioWhatIfItem[] {
  const list: ScenarioWhatIfItem[] = [];

  // Preset summary
  if (activePreset === 'nda_2024_sweep' || activePreset === 'baseline') {
    list.push({
      id: 'nda_2024_base',
      label: '🤝 2024 Official Baseline (164 NDA / 11 YSRCP)',
      category: 'coalition',
      detail: 'Official 2024 election outcome without demographic swing offsets',
    });
  } else if (activePreset === 'ysrcp_2019_wave') {
    list.push({
      id: 'ysrcp_wave',
      label: '🌊 2019 YSRCP Wave Benchmark (151 Seats)',
      category: 'anti_incumbency',
      detail: 'Navaratnalu agrarian & welfare wave (49.9% vote share)',
    });
  } else if (activePreset === 'bifurcation_2014') {
    list.push({
      id: 'bifurcation_14',
      label: '⚖️ 2014 Bifurcation Mandate (106 NDA / 67 YSRCP)',
      category: 'coalition',
      detail: 'Post-bifurcation election: TDP (102) + BJP (4) = 106 seats vs YSRCP 67 & 2 OTH',
    });
  } else if (activePreset === 'nda_2029_defense') {
    list.push({
      id: 'nda_29_defense',
      label: '🛡️ 2029 NDA Alliance Defense (TDP+JSP+BJP Holds)',
      category: 'coalition',
      detail: `Pre-poll pact holds against natural 5-yr incumbency friction (-3.5% swing)`,
    });
  } else if (activePreset === 'triangular_2029_solo' || activePreset === 'jsp_solo_split') {
    list.push({
      id: 'jsp_solo_29',
      label: '💥 2029 Triangular Contest: TDP vs JSP vs YSRCP',
      category: 'coalition',
      detail: 'Alliance breaks: Janasena contests all 175 seats solo, dividing anti-YSRCP vote',
    });
  } else if (activePreset === 'tdp_vs_jsp_bjp_2029') {
    list.push({
      id: 'realigned_29',
      label: '🤝🔥 2029 Realigned: TDP Solo vs JSP+BJP vs YSRCP',
      category: 'coalition',
      detail: 'JSP and BJP contest in alliance against both TDP and YSRCP across all 175 seats',
    });
  } else if (activePreset === 'ysrcp_2029_resurgence') {
    list.push({
      id: 'ysrcp_resurgence_29',
      label: '⚡ 2029 YSRCP Agrarian & Welfare Resurgence',
      category: 'anti_incumbency',
      detail: 'Discontent over Super-Six execution and rural distress pushes YSRCP past 88 majority',
    });
  } else if (activePreset === 'nda_2029_max_surge') {
    list.push({
      id: 'nda_surge_29',
      label: '🎯 2029 NDA Max Delivery Surge (170+ Sweep)',
      category: 'coalition',
      detail: 'Amaravati delivery and mega industrial investments breach YSRCP last 11 bastions',
    });
  } else if (activePreset.startsWith('survey_') || activePreset.startsWith('custom_survey_')) {
    if (activeSurveyTitle) {
      list.push({
        id: activePreset,
        label: `📊 ${activeSurveyTitle}`,
        category: 'caste_blocs',
        detail: 'Field survey cohort projections mapped onto 175 ACs',
      });
    }
  }

  // Caste Blocs
  const modifiedCastes: string[] = [];
  if (swings.kapu?.TDP) modifiedCastes.push(`Kapu ${swings.kapu.TDP >= 0 ? '+' : ''}${swings.kapu.TDP}%`);
  if (swings.kamma?.TDP) modifiedCastes.push(`Kamma ${swings.kamma.TDP >= 0 ? '+' : ''}${swings.kamma.TDP}%`);
  if (swings.reddy?.YSRCP) modifiedCastes.push(`Reddy ${swings.reddy.YSRCP >= 0 ? '+' : ''}${swings.reddy.YSRCP}%`);
  if (swings.bc_turpu_kapu?.TDP) modifiedCastes.push(`Turpu Kapu ${swings.bc_turpu_kapu.TDP >= 0 ? '+' : ''}${swings.bc_turpu_kapu.TDP}%`);
  if (swings.bc_yadava?.TDP) modifiedCastes.push(`Yadava ${swings.bc_yadava.TDP >= 0 ? '+' : ''}${swings.bc_yadava.TDP}%`);

  if (modifiedCastes.length > 0) {
    list.push({
      id: 'caste_swings',
      label: `👥 Castes: ${modifiedCastes.slice(0, 2).join(', ')}${modifiedCastes.length > 2 ? ` +${modifiedCastes.length - 2}` : ''}`,
      category: 'caste_blocs',
      detail: modifiedCastes.join(' | '),
    });
  }

  // Turnout
  if (turnoutSettings.urbanShift !== 0 || turnoutSettings.ruralShift !== 0 || turnoutSettings.femaleShift !== 0) {
    const parts: string[] = [];
    if (turnoutSettings.urbanShift !== 0) parts.push(`Urban ${turnoutSettings.urbanShift >= 0 ? '+' : ''}${turnoutSettings.urbanShift}%`);
    if (turnoutSettings.ruralShift !== 0) parts.push(`Rural ${turnoutSettings.ruralShift >= 0 ? '+' : ''}${turnoutSettings.ruralShift}%`);
    if (turnoutSettings.femaleShift !== 0) parts.push(`Women ${turnoutSettings.femaleShift >= 0 ? '+' : ''}${turnoutSettings.femaleShift}%`);
    list.push({
      id: 'turnout_modifier',
      label: `🗳️ Turnout: ${parts.join(', ')}`,
      category: 'turnout',
      detail: parts.join(' | '),
    });
  }

  // Macro
  if (macroSwing.TDP !== 0 || macroSwing.YSRCP !== 0 || macroSwing.JSP !== 0) {
    list.push({
      id: 'macro_swing',
      label: `📉 Macro: TDP ${macroSwing.TDP >= 0 ? '+' : ''}${macroSwing.TDP}% | YSRCP ${macroSwing.YSRCP >= 0 ? '+' : ''}${macroSwing.YSRCP}% | JSP ${macroSwing.JSP >= 0 ? '+' : ''}${macroSwing.JSP}%`,
      category: 'anti_incumbency',
      detail: 'Uniform statewide political shift',
    });
  }

  // Candidate Surgery
  if (mlaFatigueSettings.replaceIncumbentPct > 0) {
    list.push({
      id: 'mla_surgery',
      label: `✂️ MLA Surgery: ${mlaFatigueSettings.replaceIncumbentPct}% denied tickets`,
      category: 'anti_incumbency',
      detail: `Fresh face boost: +${mlaFatigueSettings.freshFaceBoost}%`,
    });
  }

  // AP Ground Crises
  if (groundCrisisSettings.amaravatiPaceSlowdown > 0) {
    list.push({
      id: 'crisis_amaravati',
      label: `🏗️ Amaravati: -${groundCrisisSettings.amaravatiPaceSlowdown}% Capital`,
      category: 'anti_incumbency',
      detail: 'Delivery timeline fatigue across 12 capital ACs',
    });
  }
  if (groundCrisisSettings.superSixFiscalFriction > 0) {
    list.push({
      id: 'crisis_super_six',
      label: `💰 Super Six: -${groundCrisisSettings.superSixFiscalFriction}% Delivery Friction`,
      category: 'anti_incumbency',
      detail: 'Rural welfare delivery delay friction penalty',
    });
  }
  if (groundCrisisSettings.vizagSteelPlantBacklash > 0) {
    list.push({
      id: 'crisis_vizag_steel',
      label: `🏭 Vizag Steel: -${groundCrisisSettings.vizagSteelPlantBacklash}% Disinvestment Backlash`,
      category: 'anti_incumbency',
      detail: 'Trade union penalty across Visakhapatnam & Anakapalli industrial seats',
    });
  }
  if (groundCrisisSettings.tdpJspCadreClash > 0) {
    list.push({
      id: 'crisis_cadre_clash',
      label: `🤝 TDP-JSP Clash: -${groundCrisisSettings.tdpJspCadreClash}% Local Rivalry`,
      category: 'anti_incumbency',
      detail: 'Domination rivalry and mutual grassroots cross-voting',
    });
  }
  if (groundCrisisSettings.redBookPolarization > 0) {
    list.push({
      id: 'crisis_red_book',
      label: `📕 Red Book: -${groundCrisisSettings.redBookPolarization}% Vendetta Polarization`,
      category: 'anti_incumbency',
      detail: 'Factional retribution consolidating YSRCP sympathy',
    });
  }
  if (groundCrisisSettings.rayalaseemaWaterGrievance > 0) {
    list.push({
      id: 'crisis_seema_water',
      label: `🌾 Seema Irrigation: -${groundCrisisSettings.rayalaseemaWaterGrievance}% Drought`,
      category: 'anti_incumbency',
      detail: 'Handri-Neeva & canal water anxiety across 52 Rayalaseema ACs',
    });
  }
  if (groundCrisisSettings.tirupatiPrasadamControversy > 0) {
    list.push({
      id: 'crisis_tirupati_prasadam',
      label: `🪔 Tirupati Laddu: +${groundCrisisSettings.tirupatiPrasadamControversy}% Devotional Surge`,
      category: 'anti_incumbency',
      detail: 'Sanatana Dharma devotional consolidation in 16 temple and pilgrim ACs',
    });
  }
  if (groundCrisisSettings.polavaramDisplacementAgitation > 0) {
    list.push({
      id: 'crisis_polavaram_displacement',
      label: `🏞️ Polavaram: -${groundCrisisSettings.polavaramDisplacementAgitation}% Tribal Agitation`,
      category: 'anti_incumbency',
      detail: 'Displacement compensation protests across 6 Agency ACs',
    });
  }
  if (groundCrisisSettings.aquaFarmerPowerTariffCrisis > 0) {
    list.push({
      id: 'crisis_aqua_farmers',
      label: `🦐 Aqua Farmers: -${groundCrisisSettings.aquaFarmerPowerTariffCrisis}% Power Tariff Friction`,
      category: 'anti_incumbency',
      detail: 'Electricity subsidy & processing cost grievance across 12 coastal ACs',
    });
  }
  if (groundCrisisSettings.cropInsuranceFarmerDistress > 0) {
    list.push({
      id: 'crisis_crop_insurance',
      label: `🌾 Agrarian Distress: -${groundCrisisSettings.cropInsuranceFarmerDistress}% Crop Insurance`,
      category: 'anti_incumbency',
      detail: 'Fasal Bima payout delays across non-urban assembly seats',
    });
  }
  if (groundCrisisSettings.liquorPolicyRetailDisruption > 0) {
    list.push({
      id: 'crisis_liquor_policy',
      label: `🍷 Liquor Policy: -${groundCrisisSettings.liquorPolicyRetailDisruption}% DWCRA Friction`,
      category: 'anti_incumbency',
      detail: 'Retail licensing & excise policy friction among rural women',
    });
  }
  if (groundCrisisSettings.govtEmployeePensionDiscontent > 0) {
    list.push({
      id: 'crisis_govt_employees',
      label: `👨‍🏫 Govt Employees: -${groundCrisisSettings.govtEmployeePensionDiscontent}% GPS Pension`,
      category: 'anti_incumbency',
      detail: 'DA arrears and pension friction across 14 administrative urban hubs',
    });
  }

  // New Regional & Family Crises
  if (groundCrisisSettings.ysrFamilyLegacyWar > 0) {
    list.push({
      id: 'crisis_ysr_family',
      label: `👑 YSR Family Split: -${groundCrisisSettings.ysrFamilyLegacyWar}% Sibling War`,
      category: 'anti_incumbency',
      detail: 'Sharmila & Sunitha Viveka trial offensive in Kadapa & Rayalaseema',
    });
  }
  if (groundCrisisSettings.jrNtrVoteSplit > 0) {
    list.push({
      id: 'crisis_jr_ntr',
      label: `🎬 Jr NTR Vote Split: -${groundCrisisSettings.jrNtrVoteSplit}% Fan Discontent`,
      category: 'anti_incumbency',
      detail: 'Nandamuri fan disengagement and youth abstention in Krishna-Guntur',
    });
  }
  if (groundCrisisSettings.pawanKalyanCoalitionUltimatum > 0) {
    list.push({
      id: 'crisis_pawan_ultimatum',
      label: `🤝 Pawan Kalyan Ultimatum: -${groundCrisisSettings.pawanKalyanCoalitionUltimatum}% JSP Revolt`,
      category: 'anti_incumbency',
      detail: 'JSP cadre withholding transfer across 21 seats & Godavari Kapu belt',
    });
  }
  if (groundCrisisSettings.bjpCentralPressureMinorityAlienation > 0) {
    list.push({
      id: 'crisis_bjp_minority',
      label: `🏛️ BJP Minority Friction: -${groundCrisisSettings.bjpCentralPressureMinorityAlienation}% Minority Shift`,
      category: 'anti_incumbency',
      detail: 'Minority Muslim & Christian anti-NDA consolidation in Rayalaseema hubs',
    });
  }
  if (groundCrisisSettings.centralAgencyLeadershipArrest > 0) {
    list.push({
      id: 'crisis_cbi_ed_arrest',
      label: `⚖️ CBI/ED Arrest: -${groundCrisisSettings.centralAgencyLeadershipArrest}% Leadership Shock`,
      category: 'anti_incumbency',
      detail: 'Pre-poll top leadership arrest causing campaign paralysis in battlegrounds',
    });
  }
  if (groundCrisisSettings.assetFreezingCampaignFreeze > 0) {
    list.push({
      id: 'crisis_asset_freeze',
      label: `🔒 Campaign War Chest: -${groundCrisisSettings.assetFreezingCampaignFreeze}% Logistics Freeze`,
      category: 'anti_incumbency',
      detail: 'Election bank accounts & cash freezes hampering rural GOTV mobilization',
    });
  }
  if (groundCrisisSettings.scSubCategorizationBacklash > 0) {
    list.push({
      id: 'crisis_sc_subcat',
      label: `⚖️ SC Sub-Categorization: -${groundCrisisSettings.scSubCategorizationBacklash}% Mala Backlash`,
      category: 'anti_incumbency',
      detail: 'Madiga gain offset by aggressive Mala counter-mobilization in 29 SC seats',
    });
  }
  if (groundCrisisSettings.kapuReservationBcFriction > 0) {
    list.push({
      id: 'crisis_kapu_bc_friction',
      label: `👥 Kapu Quota vs BC: -${groundCrisisSettings.kapuReservationBcFriction}% Social Friction`,
      category: 'anti_incumbency',
      detail: 'Reservation demands causing friction between Kapu & BC voting blocs',
    });
  }
  if (groundCrisisSettings.treasuryOverdraftDbtFreeze > 0) {
    list.push({
      id: 'crisis_treasury_dbt_freeze',
      label: `💸 Treasury DBT Freeze: -${groundCrisisSettings.treasuryOverdraftDbtFreeze}% WMA Ceiling Shock`,
      category: 'anti_incumbency',
      detail: 'Three-month halt on Aadabidda Nidhi & Thalliki Vandanam cash transfers',
    });
  }

  return list;
}
