import type { ElectionData } from '../../types';

export const HEAVYWEIGHT_DATABASE: Record<number, {
  name: string;
  party: string;
  equityVotes: number;
  tier: 'HEAVYWEIGHT_CHIEF' | 'STRONGMAN_MINISTER' | 'LOCAL_INFLUENCER';
  rationale: string;
}> = {
  // Kuppam - Chandrababu Naidu
  175: {
    name: 'Nara Chandrababu Naidu',
    party: 'TDP',
    equityVotes: 32000,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'Chief Minister, 4-time CM of Andhra Pradesh, undefeated 8-term Kuppam MLA, commanding personal devotion and generational institutional development across Chittoor.',
  },
  // Pulivendla - YS Jagan Mohan Reddy
  129: {
    name: 'Y.S. Jagan Mohan Reddy',
    party: 'YSRCP',
    equityVotes: 36000,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'Former Chief Minister & YSRCP President, YSR family political fortress, unassailable grassroots welfare loyalty across Kadapa.',
  },
  // Pithapuram - Pawan Kalyan
  37: {
    name: 'Konidela Pawan Kalyan',
    party: 'JSP',
    equityVotes: 38000,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'Deputy Chief Minister, Janasena Party founder, cinema superstar and cultural powerhouse, catalytic youth and Kapu consolidation wave.',
  },
  // Mangalagiri - Nara Lokesh
  85: {
    name: 'Nara Lokesh',
    party: 'TDP',
    equityVotes: 28500,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'Cabinet Minister (IT & HRD), Yuva Galam Padayatra architect, secured record 91,413-vote victory margin in the capital Amaravati core.',
  },
  // Gajuwaka - Palla Srinivasa Rao
  25: {
    name: 'Palla Srinivasa Rao',
    party: 'TDP',
    equityVotes: 24000,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'TDP Andhra Pradesh State President, won with state-highest victory margin (95,235 votes), dominant industrial labour and BC leader in Vizag.',
  },
  // Hindupur - Nandamuri Balakrishna
  157: {
    name: 'Nandamuri Balakrishna',
    party: 'TDP',
    equityVotes: 22000,
    tier: 'HEAVYWEIGHT_CHIEF',
    rationale: 'Legendary cine star, 3-time consecutive Hindupur MLA, NTR family legacy stronghold, hospital philanthropy and Rayalaseema connect.',
  },
  // Tenali - Nadendla Manohar
  91: {
    name: 'Nadendla Manohar',
    party: 'JSP',
    equityVotes: 18500,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Cabinet Minister (Civil Supplies), former AP Assembly Speaker, Janasena Political Affairs Committee Chairman, elite urban statesman in Guntur.',
  },
  // Kurnool - T.G. Bharath
  137: {
    name: 'T.G. Bharath',
    party: 'TDP',
    equityVotes: 16800,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Cabinet Minister (Industries & Commerce), prominent industrialist, TG Venkatesh family legacy and massive urban middle-class philanthropy.',
  },
  // Tekkali - Kinjarapu Atchannaidu
  3: {
    name: 'Kinjarapu Atchannaidu',
    party: 'TDP',
    equityVotes: 19500,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Cabinet Minister (Agriculture), veteran North Andhra strongman, Kinjarapu Yerran Naidu political dynasty anchor.',
  },
  // Vijayawada West - Sujana Chowdary
  79: {
    name: 'Y.S. Chowdary (Sujana Chowdary)',
    party: 'BJP',
    equityVotes: 14500,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Former Union Minister of State, prominent industrial leader, key architect of NDA coalition coordination in Krishna-NTR commercial capital.',
  },
  // Dharmavaram - Y. Satya Kumar
  160: {
    name: 'Y. Satya Kumar',
    party: 'BJP',
    equityVotes: 15200,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Cabinet Minister (Health & Family Welfare), BJP National Secretary, high-impact developmental and weaver-welfare mobilization.',
  },
  // Atmakur - Anam Ramanarayana Reddy
  115: {
    name: 'Anam Ramanarayana Reddy',
    party: 'TDP',
    equityVotes: 17200,
    tier: 'STRONGMAN_MINISTER',
    rationale: 'Cabinet Minister (Endowments), 40-year veteran Nellore political patriarch, formidable cross-party institutional network.',
  },
};

export function matchCandidateName(name1?: string, name2?: string): boolean {
  if (!name1 || !name2) return false;
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/\b(dr|shri|sri|smt|mr|mrs|prof|ch|k|t|a|m)\b/g, '')
      .replace(/[^a-z0-9 ]/g, '')
      .trim();

  const n1 = clean(name1);
  const n2 = clean(name2);
  if (n1 === n2 || n1.includes(n2) || n2.includes(n1)) return true;

  const words1 = n1.split(/\s+/).filter((w) => w.length > 2);
  const words2 = n2.split(/\s+/).filter((w) => w.length > 2);
  const common = words1.filter((w) => words2.includes(w));
  if (common.length >= 2) return true;
  if (common.length === 1 && common[0].length >= 5 && (words1.length <= 2 || words2.length <= 2)) return true;
  return false;
}

export interface CandidatePastRecord {
  is2018Winner: boolean;
  is2018RunnerUp: boolean;
  is2014Winner: boolean;
  is2014RunnerUp: boolean;
  ac2018Name?: string;
  ac2014Name?: string;
  tags: string[];
  incumbencyBonusPct: number;
}

export function getCandidatePastRecord(
  candidateName: string,
  acNo: number,
  electionData?: ElectionData | null
): CandidatePastRecord {
  const record: CandidatePastRecord = {
    is2018Winner: false,
    is2018RunnerUp: false,
    is2014Winner: false,
    is2014RunnerUp: false,
    tags: [],
    incumbencyBonusPct: 0,
  };

  if (!candidateName || !electionData?.results) return record;

  const res2018 = electionData.results['2018'];
  const res2014 = electionData.results['2014'];

  const ac2018 = res2018?.[String(acNo)];
  if (ac2018) {
    if (matchCandidateName(candidateName, ac2018.winner?.candidate)) {
      record.is2018Winner = true;
      record.ac2018Name = ac2018.ac_name;
      record.tags.push('2018 Incumbent MLA');
      record.incumbencyBonusPct += 10.0;
    } else if (matchCandidateName(candidateName, ac2018.runner_up?.candidate)) {
      record.is2018RunnerUp = true;
      record.ac2018Name = ac2018.ac_name;
      record.tags.push('2018 Runner-up');
      record.incumbencyBonusPct += 6.0;
    }
  }

  const ac2014 = res2014?.[String(acNo)];
  if (ac2014) {
    if (matchCandidateName(candidateName, ac2014.winner?.candidate)) {
      record.is2014Winner = true;
      record.ac2014Name = ac2014.ac_name;
      record.tags.push('2014 Former MLA');
      record.incumbencyBonusPct += 5.0;
    } else if (matchCandidateName(candidateName, ac2014.runner_up?.candidate)) {
      record.is2014RunnerUp = true;
      record.ac2014Name = ac2014.ac_name;
      record.tags.push('2014 Runner-up');
      record.incumbencyBonusPct += 3.0;
    }
  }

  if (!record.is2018Winner && res2018) {
    for (const [key, item] of Object.entries(res2018)) {
      if (key !== String(acNo) && matchCandidateName(candidateName, item.winner?.candidate)) {
        record.is2018Winner = true;
        record.ac2018Name = item.ac_name;
        record.tags.push(`2018 MLA (${item.ac_name})`);
        record.incumbencyBonusPct += 7.0;
        break;
      }
    }
  }

  if (!record.is2014Winner && res2014) {
    for (const [key, item] of Object.entries(res2014)) {
      if (key !== String(acNo) && matchCandidateName(candidateName, item.winner?.candidate)) {
        record.is2014Winner = true;
        record.ac2014Name = item.ac_name;
        record.tags.push(`2014 MLA (${item.ac_name})`);
        record.incumbencyBonusPct += 3.5;
        break;
      }
    }
  }

  return record;
}
