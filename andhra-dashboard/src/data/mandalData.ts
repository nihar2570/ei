export interface MandalDetail {
  mandal_id: number;
  name: string;
  booths: number;
  electorate: number;
  turnout_pct: number;
  lead_party: string;
  margin: number;
  dominant_caste: string;
  dominant_caste_pct: number;
  status: string;
}

export const CONSTITUENCY_MANDALS: Record<number, MandalDetail[]> = {
  "1": [
    {
      "mandal_id": 101,
      "name": "Ichchapuram",
      "booths": 76,
      "electorate": 69745,
      "turnout_pct": 76.5,
      "lead_party": "TDP",
      "margin": 10825,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 102,
      "name": "Kaviti",
      "booths": 58,
      "electorate": 52912,
      "turnout_pct": 75.6,
      "lead_party": "TDP",
      "margin": 8323,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 103,
      "name": "Sompeta",
      "booths": 123,
      "electorate": 100934,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 17159,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 104,
      "name": "Kanchili",
      "booths": 62,
      "electorate": 57078,
      "turnout_pct": 66.9,
      "lead_party": "TDP",
      "margin": 4632,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "LEAN"
    }
  ],
  "2": [
    {
      "mandal_id": 201,
      "name": "Palasa",
      "booths": 98,
      "electorate": 89625,
      "turnout_pct": 66.7,
      "lead_party": "TDP",
      "margin": 19078,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 202,
      "name": "Mandasa",
      "booths": 90,
      "electorate": 83049,
      "turnout_pct": 59.3,
      "lead_party": "TDP",
      "margin": 8279,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 203,
      "name": "Vajrapukotturu",
      "booths": 114,
      "electorate": 101050,
      "turnout_pct": 67.2,
      "lead_party": "TDP",
      "margin": 18944,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    }
  ],
  "3": [
    {
      "mandal_id": 301,
      "name": "Tekkali",
      "booths": 70,
      "electorate": 64780,
      "turnout_pct": 68.8,
      "lead_party": "OTH",
      "margin": 958,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 302,
      "name": "Santhabommali",
      "booths": 68,
      "electorate": 61866,
      "turnout_pct": 69.2,
      "lead_party": "OTH",
      "margin": 7598,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 303,
      "name": "Kotabommali",
      "booths": 96,
      "electorate": 85720,
      "turnout_pct": 69.7,
      "lead_party": "TDP",
      "margin": 3334,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 304,
      "name": "Nandigam",
      "booths": 84,
      "electorate": 76336,
      "turnout_pct": 58.5,
      "lead_party": "TDP",
      "margin": 7408,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    }
  ],
  "4": [
    {
      "mandal_id": 401,
      "name": "Pathapatnam",
      "booths": 68,
      "electorate": 63440,
      "turnout_pct": 71.5,
      "lead_party": "TDP",
      "margin": 5583,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 402,
      "name": "Meliaputti",
      "booths": 79,
      "electorate": 73819,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 9598,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 403,
      "name": "Saravakota",
      "booths": 6,
      "electorate": 5255,
      "turnout_pct": 78.0,
      "lead_party": "TDP",
      "margin": 753,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 404,
      "name": "Kothuru",
      "booths": 60,
      "electorate": 54962,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 7103,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 405,
      "name": "Hiramandalam",
      "booths": 110,
      "electorate": 100525,
      "turnout_pct": 81.7,
      "lead_party": "TDP",
      "margin": 10761,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "LEAN"
    }
  ],
  "5": [
    {
      "mandal_id": 501,
      "name": "Srikakulam Rural",
      "booths": 25,
      "electorate": 22957,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 49759,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 502,
      "name": "Srikakulam Urban",
      "booths": 234,
      "electorate": 214884,
      "turnout_pct": 78.3,
      "lead_party": "TDP",
      "margin": 49759,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 503,
      "name": "Gara",
      "booths": 65,
      "electorate": 60630,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 10010,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    }
  ],
  "6": [
    {
      "mandal_id": 601,
      "name": "Amadalavalasa",
      "booths": 74,
      "electorate": 67803,
      "turnout_pct": 73.2,
      "lead_party": "OTH",
      "margin": 24967,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 602,
      "name": "Sarubujjili",
      "booths": 44,
      "electorate": 40659,
      "turnout_pct": 67.5,
      "lead_party": "OTH",
      "margin": 14505,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 603,
      "name": "Burja",
      "booths": 88,
      "electorate": 82324,
      "turnout_pct": 80.1,
      "lead_party": "TDP",
      "margin": 10699,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 604,
      "name": "Ponduru",
      "booths": 64,
      "electorate": 60306,
      "turnout_pct": 78.8,
      "lead_party": "TDP",
      "margin": 4729,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "LEAN"
    }
  ],
  "7": [
    {
      "mandal_id": 701,
      "name": "Etcherla",
      "booths": 127,
      "electorate": 111640,
      "turnout_pct": 75.5,
      "lead_party": "BJP",
      "margin": 15806,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 702,
      "name": "Laveru",
      "booths": 65,
      "electorate": 58926,
      "turnout_pct": 74.6,
      "lead_party": "BJP",
      "margin": 7398,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 703,
      "name": "Ranastalam",
      "booths": 70,
      "electorate": 65455,
      "turnout_pct": 74.7,
      "lead_party": "BJP",
      "margin": 10000,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 704,
      "name": "G.Sigadam",
      "booths": 56,
      "electorate": 52415,
      "turnout_pct": 64.5,
      "lead_party": "BJP",
      "margin": 5836,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    }
  ],
  "8": [
    {
      "mandal_id": 801,
      "name": "Narasannapeta",
      "booths": 73,
      "electorate": 66691,
      "turnout_pct": 71.7,
      "lead_party": "TDP",
      "margin": 10540,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 802,
      "name": "Jalumuru",
      "booths": 66,
      "electorate": 61318,
      "turnout_pct": 69.4,
      "lead_party": "TDP",
      "margin": 5483,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 803,
      "name": "Saravakota",
      "booths": 55,
      "electorate": 52144,
      "turnout_pct": 73.3,
      "lead_party": "TDP",
      "margin": 6947,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 804,
      "name": "Polaki",
      "booths": 96,
      "electorate": 89810,
      "turnout_pct": 74.2,
      "lead_party": "TDP",
      "margin": 9831,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 23.9,
      "status": "LEAN"
    }
  ],
  "9": [
    {
      "mandal_id": 901,
      "name": "Rajam",
      "booths": 69,
      "electorate": 64745,
      "turnout_pct": 69.8,
      "lead_party": "OTH",
      "margin": 15658,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 902,
      "name": "Vangara",
      "booths": 41,
      "electorate": 38180,
      "turnout_pct": 65.9,
      "lead_party": "TDP",
      "margin": 3427,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 903,
      "name": "Santhakavati",
      "booths": 119,
      "electorate": 109757,
      "turnout_pct": 77.5,
      "lead_party": "TDP",
      "margin": 10945,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 904,
      "name": "Regidi Amadalavalasa",
      "booths": 66,
      "electorate": 59703,
      "turnout_pct": 72.1,
      "lead_party": "OTH",
      "margin": 5244,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    }
  ],
  "10": [
    {
      "mandal_id": 1001,
      "name": "Palakonda",
      "booths": 63,
      "electorate": 57087,
      "turnout_pct": 73.0,
      "lead_party": "JSP",
      "margin": 10914,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1002,
      "name": "Seethampeta",
      "booths": 95,
      "electorate": 88925,
      "turnout_pct": 55.0,
      "lead_party": "JSP",
      "margin": 8738,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1003,
      "name": "Bhamini",
      "booths": 33,
      "electorate": 30598,
      "turnout_pct": 60.8,
      "lead_party": "OTH",
      "margin": 514,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 1004,
      "name": "Veeraghattam",
      "booths": 116,
      "electorate": 105985,
      "turnout_pct": 74.4,
      "lead_party": "JSP",
      "margin": 16166,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    }
  ],
  "11": [
    {
      "mandal_id": 1101,
      "name": "Kurupam",
      "booths": 42,
      "electorate": 39616,
      "turnout_pct": 70.8,
      "lead_party": "TDP",
      "margin": 2013,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 1102,
      "name": "Gummalakshmipuram",
      "booths": 51,
      "electorate": 47204,
      "turnout_pct": 64.8,
      "lead_party": "TDP",
      "margin": 4212,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 1103,
      "name": "Jiyyammavalasa",
      "booths": 56,
      "electorate": 52543,
      "turnout_pct": 70.8,
      "lead_party": "TDP",
      "margin": 5680,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1104,
      "name": "Komarada",
      "booths": 56,
      "electorate": 51842,
      "turnout_pct": 64.2,
      "lead_party": "TDP",
      "margin": 5508,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1105,
      "name": "Garugubilli",
      "booths": 67,
      "electorate": 60465,
      "turnout_pct": 71.0,
      "lead_party": "TDP",
      "margin": 6413,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "LEAN"
    }
  ],
  "12": [
    {
      "mandal_id": 1201,
      "name": "Parvathipuram",
      "booths": 100,
      "electorate": 92388,
      "turnout_pct": 78.8,
      "lead_party": "TDP",
      "margin": 22539,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1202,
      "name": "Seethanagaram",
      "booths": 53,
      "electorate": 48588,
      "turnout_pct": 69.3,
      "lead_party": "TDP",
      "margin": 6184,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1203,
      "name": "Balijipeta",
      "booths": 89,
      "electorate": 82616,
      "turnout_pct": 75.5,
      "lead_party": "TDP",
      "margin": 17797,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "STRONGHOLD"
    }
  ],
  "13": [
    {
      "mandal_id": 1301,
      "name": "Salur",
      "booths": 80,
      "electorate": 74067,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 5211,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 1302,
      "name": "Pachipenta",
      "booths": 38,
      "electorate": 35530,
      "turnout_pct": 75.8,
      "lead_party": "TDP",
      "margin": 3718,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 1303,
      "name": "Mentada",
      "booths": 46,
      "electorate": 41809,
      "turnout_pct": 73.6,
      "lead_party": "TDP",
      "margin": 4386,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 1304,
      "name": "Makkuva",
      "booths": 92,
      "electorate": 85228,
      "turnout_pct": 81.1,
      "lead_party": "TDP",
      "margin": 7473,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 28.5,
      "status": "LEAN"
    }
  ],
  "14": [
    {
      "mandal_id": 1401,
      "name": "Bobbili",
      "booths": 104,
      "electorate": 96134,
      "turnout_pct": 80.7,
      "lead_party": "TDP",
      "margin": 23155,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1402,
      "name": "Ramabhadrapuram",
      "booths": 41,
      "electorate": 36668,
      "turnout_pct": 74.2,
      "lead_party": "TDP",
      "margin": 4392,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1403,
      "name": "Badangi",
      "booths": 46,
      "electorate": 42252,
      "turnout_pct": 70.2,
      "lead_party": "TDP",
      "margin": 4853,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1404,
      "name": "Therlam",
      "booths": 103,
      "electorate": 94780,
      "turnout_pct": 76.9,
      "lead_party": "TDP",
      "margin": 13648,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    }
  ],
  "15": [
    {
      "mandal_id": 1501,
      "name": "Cheepurupalli",
      "booths": 56,
      "electorate": 51805,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 3219,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 1502,
      "name": "Garividi",
      "booths": 58,
      "electorate": 53259,
      "turnout_pct": 69.9,
      "lead_party": "TDP",
      "margin": 1838,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 1503,
      "name": "Gurla",
      "booths": 89,
      "electorate": 80572,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 4016,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 1504,
      "name": "Merakamudidam",
      "booths": 58,
      "electorate": 52911,
      "turnout_pct": 69.2,
      "lead_party": "TDP",
      "margin": 2460,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    }
  ],
  "16": [
    {
      "mandal_id": 1601,
      "name": "Gajapathinagaram",
      "booths": 69,
      "electorate": 63059,
      "turnout_pct": 72.5,
      "lead_party": "TDP",
      "margin": 2382,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 1602,
      "name": "Bondapalli",
      "booths": 60,
      "electorate": 55615,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 4965,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 1603,
      "name": "Gantyada",
      "booths": 72,
      "electorate": 68615,
      "turnout_pct": 75.3,
      "lead_party": "TDP",
      "margin": 7981,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1604,
      "name": "Dattirajeru",
      "booths": 66,
      "electorate": 61492,
      "turnout_pct": 75.3,
      "lead_party": "TDP",
      "margin": 8069,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    }
  ],
  "17": [
    {
      "mandal_id": 1701,
      "name": "Nellimarla",
      "booths": 65,
      "electorate": 60295,
      "turnout_pct": 85.2,
      "lead_party": "OTH",
      "margin": 34738,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1702,
      "name": "Pusapatirega",
      "booths": 65,
      "electorate": 58948,
      "turnout_pct": 78.4,
      "lead_party": "OTH",
      "margin": 24036,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1703,
      "name": "Denkada",
      "booths": 49,
      "electorate": 45453,
      "turnout_pct": 78.6,
      "lead_party": "OTH",
      "margin": 9435,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1704,
      "name": "Bhogapuram",
      "booths": 73,
      "electorate": 66518,
      "turnout_pct": 80.7,
      "lead_party": "JSP",
      "margin": 8173,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    }
  ],
  "18": [
    {
      "mandal_id": 1801,
      "name": "Vizianagaram Urban",
      "booths": 296,
      "electorate": 274967,
      "turnout_pct": 72.3,
      "lead_party": "TDP",
      "margin": 18168,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 1802,
      "name": "Vizianagaram Rural",
      "booths": 25,
      "electorate": 23223,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 27274,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    }
  ],
  "19": [
    {
      "mandal_id": 1901,
      "name": "Srungavarapukota",
      "booths": 23,
      "electorate": 20945,
      "turnout_pct": 80.7,
      "lead_party": "OTH",
      "margin": 12627,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1902,
      "name": "Vepada",
      "booths": 70,
      "electorate": 63757,
      "turnout_pct": 75.4,
      "lead_party": "OTH",
      "margin": 22782,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1903,
      "name": "Lakkavarapukota",
      "booths": 23,
      "electorate": 21124,
      "turnout_pct": 78.0,
      "lead_party": "OTH",
      "margin": 13723,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1904,
      "name": "Kothavalasa",
      "booths": 82,
      "electorate": 76189,
      "turnout_pct": 80.8,
      "lead_party": "OTH",
      "margin": 34497,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 1905,
      "name": "Jami",
      "booths": 81,
      "electorate": 73491,
      "turnout_pct": 81.6,
      "lead_party": "TDP",
      "margin": 3956,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.8,
      "status": "LEAN"
    }
  ],
  "20": [
    {
      "mandal_id": 2001,
      "name": "Bheemili",
      "booths": 77,
      "electorate": 71126,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 18517,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2002,
      "name": "Anandapuram",
      "booths": 125,
      "electorate": 115408,
      "turnout_pct": 82.4,
      "lead_party": "TDP",
      "margin": 30913,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2003,
      "name": "Padmanabham",
      "booths": 121,
      "electorate": 111425,
      "turnout_pct": 84.7,
      "lead_party": "TDP",
      "margin": 28440,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2004,
      "name": "Visakhapatnam Rural",
      "booths": 77,
      "electorate": 69643,
      "turnout_pct": 82.6,
      "lead_party": "TDP",
      "margin": 17904,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    }
  ],
  "21": [
    {
      "mandal_id": 2101,
      "name": "Visakhapatnam East",
      "booths": 235,
      "electorate": 216905,
      "turnout_pct": 77.8,
      "lead_party": "TDP",
      "margin": 55266,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2102,
      "name": "MVP Colony",
      "booths": 25,
      "electorate": 23075,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 19657,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2103,
      "name": "Arilova",
      "booths": 25,
      "electorate": 23075,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 16402,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    }
  ],
  "22": [
    {
      "mandal_id": 2201,
      "name": "Visakhapatnam South",
      "booths": 198,
      "electorate": 182358,
      "turnout_pct": 71.6,
      "lead_party": "JSP",
      "margin": 90905,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2202,
      "name": "Town Area",
      "booths": 25,
      "electorate": 23024,
      "turnout_pct": 75.0,
      "lead_party": "JSP",
      "margin": 30169,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2203,
      "name": "Port Area",
      "booths": 25,
      "electorate": 23025,
      "turnout_pct": 75.0,
      "lead_party": "JSP",
      "margin": 29779,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    }
  ],
  "23": [
    {
      "mandal_id": 2301,
      "name": "Visakhapatnam North",
      "booths": 243,
      "electorate": 223874,
      "turnout_pct": 74.1,
      "lead_party": "BJP",
      "margin": 52210,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2302,
      "name": "Maddilapalem",
      "booths": 25,
      "electorate": 23032,
      "turnout_pct": 75.0,
      "lead_party": "BJP",
      "margin": 17376,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2303,
      "name": "Dwarakanagar",
      "booths": 25,
      "electorate": 23032,
      "turnout_pct": 75.0,
      "lead_party": "BJP",
      "margin": 17172,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    }
  ],
  "24": [
    {
      "mandal_id": 2401,
      "name": "Visakhapatnam West",
      "booths": 211,
      "electorate": 194402,
      "turnout_pct": 69.2,
      "lead_party": "TDP",
      "margin": 44130,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2402,
      "name": "Gopalapatnam",
      "booths": 1,
      "electorate": 670,
      "turnout_pct": 80.7,
      "lead_party": "TDP",
      "margin": 120,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2403,
      "name": "Pendurthi West",
      "booths": 25,
      "electorate": 23033,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 15631,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    }
  ],
  "25": [
    {
      "mandal_id": 2501,
      "name": "Gajuwaka",
      "booths": 255,
      "electorate": 230727,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 85860,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2502,
      "name": "Pedagantyada",
      "booths": 59,
      "electorate": 52775,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 18710,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2503,
      "name": "Kurmannapalem",
      "booths": 25,
      "electorate": 22620,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 6306,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 19.8,
      "status": "STRONGHOLD"
    }
  ],
  "26": [
    {
      "mandal_id": 2601,
      "name": "Chodavaram",
      "booths": 111,
      "electorate": 103030,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 28970,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2602,
      "name": "Rolugunta",
      "booths": 43,
      "electorate": 40354,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 6962,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2603,
      "name": "Ravikamatham",
      "booths": 59,
      "electorate": 53871,
      "turnout_pct": 84.6,
      "lead_party": "TDP",
      "margin": 13714,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2604,
      "name": "Butchayyapeta",
      "booths": 59,
      "electorate": 54917,
      "turnout_pct": 76.6,
      "lead_party": "TDP",
      "margin": 9101,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    }
  ],
  "27": [
    {
      "mandal_id": 2701,
      "name": "Madugula",
      "booths": 54,
      "electorate": 50182,
      "turnout_pct": 78.7,
      "lead_party": "TDP",
      "margin": 3021,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 2702,
      "name": "Cheedikada",
      "booths": 37,
      "electorate": 35120,
      "turnout_pct": 72.0,
      "lead_party": "TDP",
      "margin": 1510,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "LEAN"
    },
    {
      "mandal_id": 2703,
      "name": "Devarapalli",
      "booths": 43,
      "electorate": 40040,
      "turnout_pct": 77.8,
      "lead_party": "TDP",
      "margin": 5480,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2704,
      "name": "K.Kotapadu",
      "booths": 104,
      "electorate": 95192,
      "turnout_pct": 81.1,
      "lead_party": "TDP",
      "margin": 16976,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    }
  ],
  "28": [
    {
      "mandal_id": 2801,
      "name": "Araku Valley",
      "booths": 50,
      "electorate": 46038,
      "turnout_pct": 72.7,
      "lead_party": "OTH",
      "margin": 8958,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2802,
      "name": "Ananthagiri",
      "booths": 94,
      "electorate": 86005,
      "turnout_pct": 78.8,
      "lead_party": "BJP",
      "margin": 14921,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2803,
      "name": "Dumbriguda",
      "booths": 25,
      "electorate": 22873,
      "turnout_pct": 75.0,
      "lead_party": "BJP",
      "margin": 1575,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 2804,
      "name": "Hukumpeta",
      "booths": 78,
      "electorate": 71274,
      "turnout_pct": 69.3,
      "lead_party": "OTH",
      "margin": 24563,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2805,
      "name": "Pedabayalu",
      "booths": 36,
      "electorate": 33727,
      "turnout_pct": 64.5,
      "lead_party": "OTH",
      "margin": 12072,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2806,
      "name": "Munchingiputtu",
      "booths": 36,
      "electorate": 32950,
      "turnout_pct": 68.7,
      "lead_party": "OTH",
      "margin": 8943,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    }
  ],
  "29": [
    {
      "mandal_id": 2901,
      "name": "Paderu",
      "booths": 143,
      "electorate": 132926,
      "turnout_pct": 75.8,
      "lead_party": "TDP",
      "margin": 3908,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 2902,
      "name": "G.Madugula",
      "booths": 44,
      "electorate": 39651,
      "turnout_pct": 60.9,
      "lead_party": "OTH",
      "margin": 6248,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2903,
      "name": "Chintapalle",
      "booths": 50,
      "electorate": 45826,
      "turnout_pct": 70.1,
      "lead_party": "OTH",
      "margin": 4617,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 2904,
      "name": "G.K.Veedhi",
      "booths": 49,
      "electorate": 44217,
      "turnout_pct": 67.1,
      "lead_party": "OTH",
      "margin": 9477,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 2905,
      "name": "Koyyuru",
      "booths": 46,
      "electorate": 42156,
      "turnout_pct": 62.6,
      "lead_party": "OTH",
      "margin": 10382,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    }
  ],
  "30": [
    {
      "mandal_id": 3001,
      "name": "Anakapalle",
      "booths": 194,
      "electorate": 178621,
      "turnout_pct": 79.6,
      "lead_party": "JSP",
      "margin": 59471,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3002,
      "name": "Kasimkota",
      "booths": 56,
      "electorate": 51377,
      "turnout_pct": 73.2,
      "lead_party": "JSP",
      "margin": 7302,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3003,
      "name": "Munagapaka",
      "booths": 25,
      "electorate": 23018,
      "turnout_pct": 75.0,
      "lead_party": "JSP",
      "margin": 2373,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    }
  ],
  "31": [
    {
      "mandal_id": 3101,
      "name": "Pendurthi",
      "booths": 224,
      "electorate": 208780,
      "turnout_pct": 80.8,
      "lead_party": "JSP",
      "margin": 73786,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3102,
      "name": "Parawada",
      "booths": 25,
      "electorate": 23301,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 22514,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3103,
      "name": "Sabbavaram",
      "booths": 67,
      "electorate": 61483,
      "turnout_pct": 78.0,
      "lead_party": "JSP",
      "margin": 17709,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3104,
      "name": "Pedagantyada",
      "booths": 25,
      "electorate": 23301,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 21490,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    }
  ],
  "32": [
    {
      "mandal_id": 3201,
      "name": "Elamanchili",
      "booths": 69,
      "electorate": 63550,
      "turnout_pct": 77.7,
      "lead_party": "OTH",
      "margin": 32996,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3202,
      "name": "Rambilli",
      "booths": 62,
      "electorate": 58174,
      "turnout_pct": 76.9,
      "lead_party": "OTH",
      "margin": 36658,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3203,
      "name": "Atchutapuram",
      "booths": 124,
      "electorate": 113920,
      "turnout_pct": 83.2,
      "lead_party": "OTH",
      "margin": 1799,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 3204,
      "name": "S.Rayavaram",
      "booths": 11,
      "electorate": 9904,
      "turnout_pct": 76.1,
      "lead_party": "JSP",
      "margin": 1715,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    }
  ],
  "33": [
    {
      "mandal_id": 3301,
      "name": "Payakaraopeta",
      "booths": 109,
      "electorate": 100419,
      "turnout_pct": 81.1,
      "lead_party": "TDP",
      "margin": 271,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 3302,
      "name": "Nakkapalli",
      "booths": 110,
      "electorate": 100970,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 16318,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3303,
      "name": "Kotauratla",
      "booths": 93,
      "electorate": 85218,
      "turnout_pct": 77.6,
      "lead_party": "TDP",
      "margin": 4134,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "LEAN"
    }
  ],
  "34": [
    {
      "mandal_id": 3401,
      "name": "Narsipatnam",
      "booths": 74,
      "electorate": 69028,
      "turnout_pct": 78.5,
      "lead_party": "OTH",
      "margin": 1541,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 3402,
      "name": "Golugonda",
      "booths": 47,
      "electorate": 43148,
      "turnout_pct": 75.2,
      "lead_party": "OTH",
      "margin": 1308,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 3403,
      "name": "Makavarapalem",
      "booths": 93,
      "electorate": 84602,
      "turnout_pct": 79.8,
      "lead_party": "TDP",
      "margin": 14438,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3404,
      "name": "Nathavaram",
      "booths": 59,
      "electorate": 54149,
      "turnout_pct": 74.0,
      "lead_party": "TDP",
      "margin": 2128,
      "dominant_caste": "BC Turpu Kapu",
      "dominant_caste_pct": 22.5,
      "status": "LEAN"
    }
  ],
  "35": [
    {
      "mandal_id": 3501,
      "name": "Tuni",
      "booths": 105,
      "electorate": 96382,
      "turnout_pct": 89.1,
      "lead_party": "TDP",
      "margin": 11925,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 3502,
      "name": "Kotananduru",
      "booths": 36,
      "electorate": 33510,
      "turnout_pct": 95.0,
      "lead_party": "TDP",
      "margin": 3808,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 3503,
      "name": "Thondangi",
      "booths": 124,
      "electorate": 111614,
      "turnout_pct": 92.0,
      "lead_party": "TDP",
      "margin": 15115,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "LEAN"
    }
  ],
  "36": [
    {
      "mandal_id": 3601,
      "name": "Prathipadu",
      "booths": 57,
      "electorate": 51672,
      "turnout_pct": 84.5,
      "lead_party": "TDP",
      "margin": 11875,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3602,
      "name": "Sankhavaram",
      "booths": 108,
      "electorate": 99601,
      "turnout_pct": 79.8,
      "lead_party": "TDP",
      "margin": 18459,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3603,
      "name": "Yeleswaram",
      "booths": 57,
      "electorate": 53650,
      "turnout_pct": 86.9,
      "lead_party": "TDP",
      "margin": 11410,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3604,
      "name": "Rowthulapudi",
      "booths": 25,
      "electorate": 23055,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 8474,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    }
  ],
  "37": [
    {
      "mandal_id": 3701,
      "name": "Pithapuram",
      "booths": 45,
      "electorate": 40748,
      "turnout_pct": 87.9,
      "lead_party": "JSP",
      "margin": 8575,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3702,
      "name": "Gollaprolu",
      "booths": 113,
      "electorate": 104009,
      "turnout_pct": 86.3,
      "lead_party": "JSP",
      "margin": 31297,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3703,
      "name": "U.Kothapalli",
      "booths": 108,
      "electorate": 99624,
      "turnout_pct": 80.9,
      "lead_party": "JSP",
      "margin": 25491,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    }
  ],
  "38": [
    {
      "mandal_id": 3801,
      "name": "Kakinada Rural",
      "booths": 231,
      "electorate": 212315,
      "turnout_pct": 80.7,
      "lead_party": "JSP",
      "margin": 84954,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3802,
      "name": "Karasapa",
      "booths": 25,
      "electorate": 22977,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 26414,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3803,
      "name": "Indrapalem",
      "booths": 25,
      "electorate": 22977,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 21612,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    }
  ],
  "39": [
    {
      "mandal_id": 3901,
      "name": "Peddapuram",
      "booths": 213,
      "electorate": 195549,
      "turnout_pct": 85.1,
      "lead_party": "TDP",
      "margin": 37683,
      "dominant_caste": "Kapu",
      "dominant_caste_pct": 32.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 3902,
      "name": "Samalkota",
      "booths": 25,
      "electorate": 22951,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 16251,
      "dominant_caste": "Kapu",
      "dominant_caste_pct": 28.4,
      "status": "STRONGHOLD"
    }
  ],
  "40": [
    {
      "mandal_id": 4001,
      "name": "Anaparthy",
      "booths": 56,
      "electorate": 51514,
      "turnout_pct": 86.6,
      "lead_party": "BJP",
      "margin": 6628,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 4002,
      "name": "Pedapudi",
      "booths": 154,
      "electorate": 142039,
      "turnout_pct": 82.4,
      "lead_party": "BJP",
      "margin": 11368,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 4003,
      "name": "Biccavolu",
      "booths": 53,
      "electorate": 48008,
      "turnout_pct": 82.0,
      "lead_party": "BJP",
      "margin": 3755,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 4004,
      "name": "Rangampeta",
      "booths": 45,
      "electorate": 42301,
      "turnout_pct": 80.8,
      "lead_party": "BJP",
      "margin": 3481,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "LEAN"
    }
  ],
  "41": [
    {
      "mandal_id": 4101,
      "name": "Kakinada City",
      "booths": 211,
      "electorate": 192484,
      "turnout_pct": 82.9,
      "lead_party": "TDP",
      "margin": 59097,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4102,
      "name": "Jagannaickpur",
      "booths": 25,
      "electorate": 22806,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 18807,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4103,
      "name": "Suryaraopeta",
      "booths": 25,
      "electorate": 22806,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 19942,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    }
  ],
  "42": [
    {
      "mandal_id": 4201,
      "name": "Ramachandrapuram",
      "booths": 125,
      "electorate": 112433,
      "turnout_pct": 81.6,
      "lead_party": "TDP",
      "margin": 16816,
      "dominant_caste": "Kapu",
      "dominant_caste_pct": 26.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4202,
      "name": "Kajuluru",
      "booths": 92,
      "electorate": 85118,
      "turnout_pct": 80.7,
      "lead_party": "TDP",
      "margin": 12492,
      "dominant_caste": "Settibalija",
      "dominant_caste_pct": 24.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4203,
      "name": "Pamarru (Ramachandrapuram)",
      "booths": 30,
      "electorate": 27986,
      "turnout_pct": 74.6,
      "lead_party": "YSRCP",
      "margin": 807,
      "dominant_caste": "Kapu",
      "dominant_caste_pct": 22.8,
      "status": "BATTLEGROUND"
    }
  ],
  "43": [
    {
      "mandal_id": 4301,
      "name": "Mummidivaram",
      "booths": 59,
      "electorate": 53163,
      "turnout_pct": 81.3,
      "lead_party": "OTH",
      "margin": 15952,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4302,
      "name": "I.Polavaram",
      "booths": 139,
      "electorate": 127838,
      "turnout_pct": 81.9,
      "lead_party": "TDP",
      "margin": 16259,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 4303,
      "name": "Katrenikona",
      "booths": 84,
      "electorate": 76472,
      "turnout_pct": 77.0,
      "lead_party": "OTH",
      "margin": 35521,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4304,
      "name": "Tallarevu",
      "booths": 25,
      "electorate": 22992,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 16264,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    }
  ],
  "44": [
    {
      "mandal_id": 4401,
      "name": "Amalapuram",
      "booths": 110,
      "electorate": 102481,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 7387,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 4402,
      "name": "Uppalaguptam",
      "booths": 92,
      "electorate": 83979,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 17212,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4403,
      "name": "Allavaram",
      "booths": 57,
      "electorate": 53824,
      "turnout_pct": 78.5,
      "lead_party": "TDP",
      "margin": 7523,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    }
  ],
  "45": [
    {
      "mandal_id": 4501,
      "name": "Razole",
      "booths": 68,
      "electorate": 61994,
      "turnout_pct": 78.1,
      "lead_party": "JSP",
      "margin": 14752,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4502,
      "name": "Malikipuram",
      "booths": 72,
      "electorate": 66896,
      "turnout_pct": 80.2,
      "lead_party": "JSP",
      "margin": 11803,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4503,
      "name": "Sakhinetipalle",
      "booths": 70,
      "electorate": 63314,
      "turnout_pct": 80.5,
      "lead_party": "JSP",
      "margin": 7359,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "LEAN"
    }
  ],
  "46": [
    {
      "mandal_id": 4601,
      "name": "Gannavaram (Konaseema)",
      "booths": 11,
      "electorate": 10226,
      "turnout_pct": 77.3,
      "lead_party": "JSP",
      "margin": 1425,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4602,
      "name": "P.Gannavaram",
      "booths": 70,
      "electorate": 64534,
      "turnout_pct": 79.2,
      "lead_party": "JSP",
      "margin": 9501,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4603,
      "name": "Ambajipeta",
      "booths": 65,
      "electorate": 59023,
      "turnout_pct": 82.6,
      "lead_party": "JSP",
      "margin": 8607,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4604,
      "name": "Ainavilli",
      "booths": 68,
      "electorate": 62036,
      "turnout_pct": 78.6,
      "lead_party": "JSP",
      "margin": 10204,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    }
  ],
  "47": [
    {
      "mandal_id": 4701,
      "name": "Kothapeta",
      "booths": 58,
      "electorate": 53550,
      "turnout_pct": 88.1,
      "lead_party": "TDP",
      "margin": 13973,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4702,
      "name": "Ravulapalem",
      "booths": 64,
      "electorate": 58307,
      "turnout_pct": 83.6,
      "lead_party": "TDP",
      "margin": 4913,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 4703,
      "name": "Atreyapuram",
      "booths": 61,
      "electorate": 55373,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 13637,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4704,
      "name": "Alamuru",
      "booths": 94,
      "electorate": 87027,
      "turnout_pct": 84.2,
      "lead_party": "TDP",
      "margin": 20802,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    }
  ],
  "48": [
    {
      "mandal_id": 4801,
      "name": "Mandapeta",
      "booths": 104,
      "electorate": 95897,
      "turnout_pct": 82.9,
      "lead_party": "TDP",
      "margin": 4348,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 4802,
      "name": "Rayavaram",
      "booths": 51,
      "electorate": 46791,
      "turnout_pct": 88.8,
      "lead_party": "TDP",
      "margin": 3996,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 4803,
      "name": "Kapileswarapuram",
      "booths": 84,
      "electorate": 76751,
      "turnout_pct": 85.5,
      "lead_party": "TDP",
      "margin": 14339,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    }
  ],
  "49": [
    {
      "mandal_id": 4901,
      "name": "Rajanagaram",
      "booths": 120,
      "electorate": 110497,
      "turnout_pct": 89.5,
      "lead_party": "JSP",
      "margin": 15038,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 4902,
      "name": "Korukonda",
      "booths": 60,
      "electorate": 55467,
      "turnout_pct": 88.1,
      "lead_party": "JSP",
      "margin": 4606,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 4903,
      "name": "Seethanagaram",
      "booths": 58,
      "electorate": 54429,
      "turnout_pct": 86.3,
      "lead_party": "JSP",
      "margin": 4746,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "LEAN"
    }
  ],
  "50": [
    {
      "mandal_id": 5001,
      "name": "Rajahmundry City",
      "booths": 213,
      "electorate": 197081,
      "turnout_pct": 82.9,
      "lead_party": "TDP",
      "margin": 71820,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5002,
      "name": "Danavaipeta",
      "booths": 25,
      "electorate": 23131,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 12589,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5003,
      "name": "Innespeta",
      "booths": 25,
      "electorate": 23131,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 14811,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.1,
      "status": "STRONGHOLD"
    }
  ],
  "51": [
    {
      "mandal_id": 5101,
      "name": "Rajahmundry Rural",
      "booths": 147,
      "electorate": 133830,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 33731,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5102,
      "name": "Kadiam",
      "booths": 163,
      "electorate": 149771,
      "turnout_pct": 81.7,
      "lead_party": "TDP",
      "margin": 38187,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    }
  ],
  "52": [
    {
      "mandal_id": 5201,
      "name": "Jaggampeta",
      "booths": 61,
      "electorate": 56149,
      "turnout_pct": 79.0,
      "lead_party": "OTH",
      "margin": 6974,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5202,
      "name": "Gandepalle",
      "booths": 41,
      "electorate": 35557,
      "turnout_pct": 87.1,
      "lead_party": "OTH",
      "margin": 19297,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5203,
      "name": "Gokavaram",
      "booths": 53,
      "electorate": 47927,
      "turnout_pct": 80.2,
      "lead_party": "OTH",
      "margin": 12367,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5204,
      "name": "Kirlampudi",
      "booths": 109,
      "electorate": 101888,
      "turnout_pct": 75.6,
      "lead_party": "TDP",
      "margin": 15462,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    }
  ],
  "53": [
    {
      "mandal_id": 5301,
      "name": "Rampachodavaram",
      "booths": 225,
      "electorate": 207395,
      "turnout_pct": 82.3,
      "lead_party": "YSRCP",
      "margin": 16621,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 5302,
      "name": "Devipatnam",
      "booths": 26,
      "electorate": 24462,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 544,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 5303,
      "name": "Maredumilli",
      "booths": 25,
      "electorate": 23364,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 1149,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 5304,
      "name": "Rajavommangi",
      "booths": 31,
      "electorate": 28070,
      "turnout_pct": 80.6,
      "lead_party": "TDP",
      "margin": 1275,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 5305,
      "name": "Y.Ramavaram",
      "booths": 26,
      "electorate": 23806,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 1425,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 5306,
      "name": "Addateegala",
      "booths": 37,
      "electorate": 34598,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 1390,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 5307,
      "name": "Gangavaram",
      "booths": 29,
      "electorate": 26387,
      "turnout_pct": 79.7,
      "lead_party": "TDP",
      "margin": 1635,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "LEAN"
    }
  ],
  "54": [
    {
      "mandal_id": 5401,
      "name": "Kovvur",
      "booths": 121,
      "electorate": 110994,
      "turnout_pct": 90.0,
      "lead_party": "TDP",
      "margin": 20788,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5402,
      "name": "Chagallu",
      "booths": 52,
      "electorate": 47198,
      "turnout_pct": 98.3,
      "lead_party": "TDP",
      "margin": 8888,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5403,
      "name": "Tallapudi",
      "booths": 39,
      "electorate": 36002,
      "turnout_pct": 88.2,
      "lead_party": "TDP",
      "margin": 5631,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 19.6,
      "status": "STRONGHOLD"
    }
  ],
  "55": [
    {
      "mandal_id": 5501,
      "name": "Nidadavole",
      "booths": 116,
      "electorate": 109105,
      "turnout_pct": 83.0,
      "lead_party": "JSP",
      "margin": 20899,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5502,
      "name": "Undrajavaram",
      "booths": 25,
      "electorate": 23513,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 2741,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 5503,
      "name": "Peravali",
      "booths": 107,
      "electorate": 99990,
      "turnout_pct": 82.7,
      "lead_party": "JSP",
      "margin": 14632,
      "dominant_caste": "ST Tribal",
      "dominant_caste_pct": 78.4,
      "status": "STRONGHOLD"
    }
  ],
  "56": [
    {
      "mandal_id": 5601,
      "name": "Achanta",
      "booths": 74,
      "electorate": 68482,
      "turnout_pct": 81.9,
      "lead_party": "TDP",
      "margin": 16458,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5602,
      "name": "Poduru",
      "booths": 26,
      "electorate": 24297,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 2005,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 5603,
      "name": "Penugonda",
      "booths": 52,
      "electorate": 47752,
      "turnout_pct": 85.5,
      "lead_party": "TDP",
      "margin": 6423,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5604,
      "name": "Penumantra",
      "booths": 47,
      "electorate": 43402,
      "turnout_pct": 84.0,
      "lead_party": "TDP",
      "margin": 5555,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    }
  ],
  "57": [
    {
      "mandal_id": 5701,
      "name": "Palakollu",
      "booths": 105,
      "electorate": 96379,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 32193,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5702,
      "name": "Yelamanchili",
      "booths": 445,
      "electorate": 409392,
      "turnout_pct": 83.8,
      "lead_party": "TDP",
      "margin": 139500,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5703,
      "name": "Palakollu Rural",
      "booths": 8,
      "electorate": 7341,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 2336,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    }
  ],
  "58": [
    {
      "mandal_id": 5801,
      "name": "Narasapuram",
      "booths": 180,
      "electorate": 167267,
      "turnout_pct": 71.2,
      "lead_party": "JSP",
      "margin": 39740,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5802,
      "name": "Mogalthur",
      "booths": 1,
      "electorate": 822,
      "turnout_pct": 83.9,
      "lead_party": "JSP",
      "margin": 218,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    }
  ],
  "59": [
    {
      "mandal_id": 5901,
      "name": "Bhimavaram",
      "booths": 188,
      "electorate": 175923,
      "turnout_pct": 89.2,
      "lead_party": "OTH",
      "margin": 44369,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 5902,
      "name": "Veeravasaram",
      "booths": 49,
      "electorate": 46745,
      "turnout_pct": 87.9,
      "lead_party": "OTH",
      "margin": 6141,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 5903,
      "name": "Bhimavaram Urban",
      "booths": 25,
      "electorate": 23394,
      "turnout_pct": 75.0,
      "lead_party": "OTH",
      "margin": 44369,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    }
  ],
  "60": [
    {
      "mandal_id": 6001,
      "name": "Undi",
      "booths": 88,
      "electorate": 81441,
      "turnout_pct": 88.2,
      "lead_party": "OTH",
      "margin": 40344,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6002,
      "name": "Kalla",
      "booths": 75,
      "electorate": 70219,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 21054,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6003,
      "name": "Akividu",
      "booths": 57,
      "electorate": 52198,
      "turnout_pct": 84.5,
      "lead_party": "OTH",
      "margin": 23355,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6004,
      "name": "Palakoderu",
      "booths": 24,
      "electorate": 22470,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 11191,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    }
  ],
  "61": [
    {
      "mandal_id": 6101,
      "name": "Tanuku",
      "booths": 112,
      "electorate": 103102,
      "turnout_pct": 97.5,
      "lead_party": "TDP",
      "margin": 38302,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6102,
      "name": "Attili",
      "booths": 56,
      "electorate": 52248,
      "turnout_pct": 92.0,
      "lead_party": "TDP",
      "margin": 15375,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6103,
      "name": "Iragavaram",
      "booths": 86,
      "electorate": 80676,
      "turnout_pct": 84.2,
      "lead_party": "TDP",
      "margin": 23205,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    }
  ],
  "62": [
    {
      "mandal_id": 6201,
      "name": "Tadepalligudem",
      "booths": 143,
      "electorate": 132197,
      "turnout_pct": 82.6,
      "lead_party": "JSP",
      "margin": 43932,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6202,
      "name": "Pentapadu",
      "booths": 106,
      "electorate": 98537,
      "turnout_pct": 82.8,
      "lead_party": "JSP",
      "margin": 28881,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    }
  ],
  "63": [
    {
      "mandal_id": 6301,
      "name": "Unguturu",
      "booths": 81,
      "electorate": 75169,
      "turnout_pct": 89.6,
      "lead_party": "JSP",
      "margin": 6182,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "LEAN"
    },
    {
      "mandal_id": 6302,
      "name": "Nidamarru",
      "booths": 52,
      "electorate": 48400,
      "turnout_pct": 93.1,
      "lead_party": "JSP",
      "margin": 7392,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6303,
      "name": "Ganapavaram",
      "booths": 112,
      "electorate": 103006,
      "turnout_pct": 80.9,
      "lead_party": "JSP",
      "margin": 18166,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    }
  ],
  "64": [
    {
      "mandal_id": 6401,
      "name": "Denduluru",
      "booths": 121,
      "electorate": 113149,
      "turnout_pct": 82.6,
      "lead_party": "OTH",
      "margin": 3935,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 6402,
      "name": "Pedavegi",
      "booths": 73,
      "electorate": 67825,
      "turnout_pct": 83.2,
      "lead_party": "OTH",
      "margin": 16938,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6403,
      "name": "Pedapadu",
      "booths": 54,
      "electorate": 49301,
      "turnout_pct": 82.1,
      "lead_party": "OTH",
      "margin": 5510,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 16.8,
      "status": "LEAN"
    }
  ],
  "65": [
    {
      "mandal_id": 6501,
      "name": "Eluru Urban",
      "booths": 222,
      "electorate": 206056,
      "turnout_pct": 77.8,
      "lead_party": "TDP",
      "margin": 66789,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6502,
      "name": "Eluru Rural",
      "booths": 25,
      "electorate": 23204,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 22472,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    }
  ],
  "66": [
    {
      "mandal_id": 6601,
      "name": "Gopalapuram",
      "booths": 49,
      "electorate": 44328,
      "turnout_pct": 92.5,
      "lead_party": "OTH",
      "margin": 22540,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6602,
      "name": "Nallajerla",
      "booths": 64,
      "electorate": 58136,
      "turnout_pct": 84.6,
      "lead_party": "OTH",
      "margin": 20150,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6603,
      "name": "Devarapalli",
      "booths": 52,
      "electorate": 47054,
      "turnout_pct": 85.2,
      "lead_party": "OTH",
      "margin": 23093,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6604,
      "name": "Dwarakatirumala",
      "booths": 115,
      "electorate": 105347,
      "turnout_pct": 85.7,
      "lead_party": "TDP",
      "margin": 13733,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    }
  ],
  "67": [
    {
      "mandal_id": 6701,
      "name": "Polavaram",
      "booths": 107,
      "electorate": 99222,
      "turnout_pct": 82.5,
      "lead_party": "YSRCP",
      "margin": 208,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 6702,
      "name": "Buttayagudem",
      "booths": 97,
      "electorate": 89979,
      "turnout_pct": 80.6,
      "lead_party": "JSP",
      "margin": 14190,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6703,
      "name": "Jeelugumilli",
      "booths": 70,
      "electorate": 63183,
      "turnout_pct": 80.6,
      "lead_party": "OTH",
      "margin": 1096,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 6704,
      "name": "Kukunoor",
      "booths": 25,
      "electorate": 23182,
      "turnout_pct": 75.0,
      "lead_party": "JSP",
      "margin": 971,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 6705,
      "name": "Velairpadu",
      "booths": 25,
      "electorate": 23190,
      "turnout_pct": 75.0,
      "lead_party": "JSP",
      "margin": 1220,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    }
  ],
  "68": [
    {
      "mandal_id": 6801,
      "name": "Chintalapudi",
      "booths": 73,
      "electorate": 67063,
      "turnout_pct": 88.8,
      "lead_party": "TDP",
      "margin": 5402,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 6802,
      "name": "Lingapalem",
      "booths": 94,
      "electorate": 86709,
      "turnout_pct": 85.2,
      "lead_party": "TDP",
      "margin": 18815,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6803,
      "name": "Kamavarapukota",
      "booths": 45,
      "electorate": 41033,
      "turnout_pct": 92.2,
      "lead_party": "TDP",
      "margin": 5428,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 6804,
      "name": "Jangareddigudem",
      "booths": 80,
      "electorate": 74198,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 13079,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 18.0,
      "status": "STRONGHOLD"
    }
  ],
  "69": [
    {
      "mandal_id": 6901,
      "name": "Tiruvuru",
      "booths": 62,
      "electorate": 56940,
      "turnout_pct": 83.9,
      "lead_party": "OTH",
      "margin": 9042,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6902,
      "name": "A.Konduru",
      "booths": 73,
      "electorate": 68307,
      "turnout_pct": 84.3,
      "lead_party": "TDP",
      "margin": 5266,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 6903,
      "name": "Gampalagudem",
      "booths": 54,
      "electorate": 50018,
      "turnout_pct": 80.0,
      "lead_party": "OTH",
      "margin": 15384,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 6904,
      "name": "Vissannapeta",
      "booths": 57,
      "electorate": 53450,
      "turnout_pct": 74.7,
      "lead_party": "OTH",
      "margin": 13143,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    }
  ],
  "70": [
    {
      "mandal_id": 7001,
      "name": "Nuzvid",
      "booths": 102,
      "electorate": 92838,
      "turnout_pct": 96.1,
      "lead_party": "TDP",
      "margin": 29813,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7002,
      "name": "Agiripalli",
      "booths": 78,
      "electorate": 72145,
      "turnout_pct": 81.9,
      "lead_party": "TDP",
      "margin": 9018,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 7003,
      "name": "Chatrai",
      "booths": 25,
      "electorate": 23123,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 5900,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 7004,
      "name": "Musunuru",
      "booths": 86,
      "electorate": 77017,
      "turnout_pct": 107.1,
      "lead_party": "TDP",
      "margin": 26791,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    }
  ],
  "71": [
    {
      "mandal_id": 7101,
      "name": "Gannavaram",
      "booths": 25,
      "electorate": 22795,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 5741,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 7102,
      "name": "Bapulapadu",
      "booths": 72,
      "electorate": 66058,
      "turnout_pct": 79.5,
      "lead_party": "TDP",
      "margin": 5557,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 7103,
      "name": "Unguturu",
      "booths": 124,
      "electorate": 114944,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 21023,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7104,
      "name": "Vijayawada Rural",
      "booths": 106,
      "electorate": 96656,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 14238,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    }
  ],
  "72": [
    {
      "mandal_id": 7201,
      "name": "Gudivada",
      "booths": 121,
      "electorate": 113445,
      "turnout_pct": 76.5,
      "lead_party": "TDP",
      "margin": 27111,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7202,
      "name": "Gudlavalleru",
      "booths": 98,
      "electorate": 89880,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 21982,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7203,
      "name": "Nandivada",
      "booths": 35,
      "electorate": 32080,
      "turnout_pct": 82.6,
      "lead_party": "OTH",
      "margin": 6975,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    }
  ],
  "73": [
    {
      "mandal_id": 7301,
      "name": "Kaikalur",
      "booths": 58,
      "electorate": 53165,
      "turnout_pct": 85.2,
      "lead_party": "OTH",
      "margin": 3440,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 7302,
      "name": "Mandavalli",
      "booths": 45,
      "electorate": 41759,
      "turnout_pct": 79.8,
      "lead_party": "OTH",
      "margin": 408,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 7303,
      "name": "Kalidindi",
      "booths": 82,
      "electorate": 76332,
      "turnout_pct": 81.9,
      "lead_party": "BJP",
      "margin": 16541,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7304,
      "name": "Mudinepalle",
      "booths": 59,
      "electorate": 54161,
      "turnout_pct": 78.1,
      "lead_party": "BJP",
      "margin": 2331,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "LEAN"
    }
  ],
  "74": [
    {
      "mandal_id": 7401,
      "name": "Pedana",
      "booths": 80,
      "electorate": 73728,
      "turnout_pct": 73.2,
      "lead_party": "TDP",
      "margin": 7906,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 7402,
      "name": "Gudur",
      "booths": 51,
      "electorate": 46423,
      "turnout_pct": 73.8,
      "lead_party": "TDP",
      "margin": 6551,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7403,
      "name": "Bantumilli",
      "booths": 25,
      "electorate": 23040,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 14586,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7404,
      "name": "Kruthivennu",
      "booths": 63,
      "electorate": 59277,
      "turnout_pct": 72.1,
      "lead_party": "TDP",
      "margin": 10675,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    }
  ],
  "75": [
    {
      "mandal_id": 7501,
      "name": "Machilipatnam Urban",
      "booths": 198,
      "electorate": 179569,
      "turnout_pct": 85.8,
      "lead_party": "TDP",
      "margin": 40430,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7502,
      "name": "Machilipatnam Rural",
      "booths": 25,
      "electorate": 22672,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 24900,
      "dominant_caste": "Kapu / Balija",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    }
  ],
  "76": [
    {
      "mandal_id": 7601,
      "name": "Avanigadda",
      "booths": 25,
      "electorate": 22819,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 6989,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7602,
      "name": "Nagayalanka",
      "booths": 214,
      "electorate": 195335,
      "turnout_pct": 81.1,
      "lead_party": "JSP",
      "margin": 42349,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7603,
      "name": "Koduru",
      "booths": 42,
      "electorate": 38824,
      "turnout_pct": 77.6,
      "lead_party": "JSP",
      "margin": 8710,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7604,
      "name": "Challapalli",
      "booths": 49,
      "electorate": 45841,
      "turnout_pct": 77.5,
      "lead_party": "JSP",
      "margin": 8026,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7605,
      "name": "Mopidevi",
      "booths": 65,
      "electorate": 59972,
      "turnout_pct": 76.3,
      "lead_party": "JSP",
      "margin": 14108,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7606,
      "name": "Ghantasala",
      "booths": 41,
      "electorate": 37835,
      "turnout_pct": 70.5,
      "lead_party": "JSP",
      "margin": 6030,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    }
  ],
  "77": [
    {
      "mandal_id": 7701,
      "name": "Pamarru",
      "booths": 100,
      "electorate": 91853,
      "turnout_pct": 75.8,
      "lead_party": "TDP",
      "margin": 48594,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7702,
      "name": "Thotlavalluru",
      "booths": 34,
      "electorate": 31497,
      "turnout_pct": 74.4,
      "lead_party": "TDP",
      "margin": 21888,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7703,
      "name": "Pamidimukkala",
      "booths": 49,
      "electorate": 45788,
      "turnout_pct": 75.1,
      "lead_party": "TDP",
      "margin": 33592,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7704,
      "name": "Movva",
      "booths": 25,
      "electorate": 22963,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 8128,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7705,
      "name": "Pedaparupudi",
      "booths": 30,
      "electorate": 26638,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 15755,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    }
  ],
  "78": [
    {
      "mandal_id": 7801,
      "name": "Penamaluru",
      "booths": 168,
      "electorate": 154433,
      "turnout_pct": 80.5,
      "lead_party": "OTH",
      "margin": 33997,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7802,
      "name": "Kankipadu",
      "booths": 101,
      "electorate": 92622,
      "turnout_pct": 79.1,
      "lead_party": "OTH",
      "margin": 12498,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7803,
      "name": "Poranki",
      "booths": 50,
      "electorate": 46202,
      "turnout_pct": 72.4,
      "lead_party": "TDP",
      "margin": 6431,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    }
  ],
  "79": [
    {
      "mandal_id": 7901,
      "name": "Vijayawada West",
      "booths": 219,
      "electorate": 200849,
      "turnout_pct": 78.9,
      "lead_party": "BJP",
      "margin": 61178,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7902,
      "name": "Bhavanipuram",
      "booths": 25,
      "electorate": 22927,
      "turnout_pct": 75.0,
      "lead_party": "BJP",
      "margin": 19757,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 7903,
      "name": "One Town",
      "booths": 25,
      "electorate": 22927,
      "turnout_pct": 75.0,
      "lead_party": "BJP",
      "margin": 20959,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    }
  ],
  "80": [
    {
      "mandal_id": 8001,
      "name": "Vijayawada Central",
      "booths": 243,
      "electorate": 223662,
      "turnout_pct": 82.2,
      "lead_party": "OTH",
      "margin": 28230,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 8002,
      "name": "Gandhinagar",
      "booths": 25,
      "electorate": 23010,
      "turnout_pct": 75.0,
      "lead_party": "OTH",
      "margin": 6298,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 8003,
      "name": "Satyanarayanapuram",
      "booths": 25,
      "electorate": 23010,
      "turnout_pct": 75.0,
      "lead_party": "OTH",
      "margin": 8241,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8004,
      "name": "Gunadala",
      "booths": 25,
      "electorate": 23010,
      "turnout_pct": 75.0,
      "lead_party": "OTH",
      "margin": 8016,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 12.0,
      "status": "LEAN"
    }
  ],
  "81": [
    {
      "mandal_id": 8101,
      "name": "Vijayawada East",
      "booths": 246,
      "electorate": 226459,
      "turnout_pct": 68.0,
      "lead_party": "TDP",
      "margin": 15278,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8102,
      "name": "Patamata",
      "booths": 25,
      "electorate": 23014,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 4447,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8103,
      "name": "Benz Circle",
      "booths": 25,
      "electorate": 23014,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 4581,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8104,
      "name": "Autonagar",
      "booths": 25,
      "electorate": 23014,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 2675,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "BATTLEGROUND"
    }
  ],
  "82": [
    {
      "mandal_id": 8201,
      "name": "Mylavaram",
      "booths": 50,
      "electorate": 46387,
      "turnout_pct": 87.1,
      "lead_party": "TDP",
      "margin": 6154,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 18.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8202,
      "name": "Ibrahimpatnam",
      "booths": 70,
      "electorate": 63223,
      "turnout_pct": 84.7,
      "lead_party": "TDP",
      "margin": 16933,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 17.5,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8203,
      "name": "G. Konduru",
      "booths": 43,
      "electorate": 38436,
      "turnout_pct": 87.8,
      "lead_party": "TDP",
      "margin": 6951,
      "dominant_caste": "BC",
      "dominant_caste_pct": 22.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8204,
      "name": "Reddigudem",
      "booths": 34,
      "electorate": 31602,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 3722,
      "dominant_caste": "Reddy",
      "dominant_caste_pct": 19.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8205,
      "name": "Vijayawada Rural",
      "booths": 126,
      "electorate": 117047,
      "turnout_pct": 82.8,
      "lead_party": "TDP",
      "margin": 18947,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 16.8,
      "status": "STRONGHOLD"
    }
  ],
  "83": [
    {
      "mandal_id": 8301,
      "name": "Nandigama",
      "booths": 54,
      "electorate": 49429,
      "turnout_pct": 86.4,
      "lead_party": "OTH",
      "margin": 5227,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8302,
      "name": "Kanchikacherla",
      "booths": 92,
      "electorate": 84085,
      "turnout_pct": 87.7,
      "lead_party": "TDP",
      "margin": 13212,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8303,
      "name": "Chandarlapadu",
      "booths": 47,
      "electorate": 43083,
      "turnout_pct": 84.5,
      "lead_party": "OTH",
      "margin": 40,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 8304,
      "name": "Veerullapadu",
      "booths": 41,
      "electorate": 37933,
      "turnout_pct": 83.3,
      "lead_party": "OTH",
      "margin": 3617,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    }
  ],
  "84": [
    {
      "mandal_id": 8401,
      "name": "Jaggayyapeta",
      "booths": 105,
      "electorate": 96405,
      "turnout_pct": 83.4,
      "lead_party": "TDP",
      "margin": 9313,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8402,
      "name": "Vatsavai",
      "booths": 64,
      "electorate": 60422,
      "turnout_pct": 78.3,
      "lead_party": "TDP",
      "margin": 4164,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8403,
      "name": "Penuganchiprolu",
      "booths": 56,
      "electorate": 51361,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 4356,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    }
  ],
  "85": [
    {
      "mandal_id": 8501,
      "name": "Pedakurapadu",
      "booths": 42,
      "electorate": 38920,
      "turnout_pct": 87.4,
      "lead_party": "TDP",
      "margin": 6796,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8502,
      "name": "Bellamkonda",
      "booths": 31,
      "electorate": 28364,
      "turnout_pct": 93.2,
      "lead_party": "TDP",
      "margin": 3745,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8503,
      "name": "Atchampet",
      "booths": 45,
      "electorate": 40226,
      "turnout_pct": 84.2,
      "lead_party": "TDP",
      "margin": 4450,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 8504,
      "name": "Krosuru",
      "booths": 44,
      "electorate": 40570,
      "turnout_pct": 89.3,
      "lead_party": "TDP",
      "margin": 7439,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8505,
      "name": "Amaravathi",
      "booths": 119,
      "electorate": 105717,
      "turnout_pct": 87.3,
      "lead_party": "TDP",
      "margin": 21341,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    }
  ],
  "86": [
    {
      "mandal_id": 8601,
      "name": "Tadikonda",
      "booths": 55,
      "electorate": 49223,
      "turnout_pct": 80.2,
      "lead_party": "TDP",
      "margin": 7379,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8602,
      "name": "Thullur",
      "booths": 47,
      "electorate": 42971,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 12,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 8603,
      "name": "Firangipuram",
      "booths": 108,
      "electorate": 98381,
      "turnout_pct": 81.7,
      "lead_party": "TDP",
      "margin": 17803,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8604,
      "name": "Medikonduru",
      "booths": 42,
      "electorate": 38775,
      "turnout_pct": 78.4,
      "lead_party": "TDP",
      "margin": 7293,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 13.4,
      "status": "STRONGHOLD"
    }
  ],
  "87": [
    {
      "mandal_id": 8701,
      "name": "Mangalagiri",
      "booths": 107,
      "electorate": 98981,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 29352,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8702,
      "name": "Tadepalli",
      "booths": 65,
      "electorate": 61515,
      "turnout_pct": 74.8,
      "lead_party": "TDP",
      "margin": 13947,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8703,
      "name": "Duggirala",
      "booths": 181,
      "electorate": 167031,
      "turnout_pct": 82.0,
      "lead_party": "TDP",
      "margin": 47417,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    }
  ],
  "88": [
    {
      "mandal_id": 8801,
      "name": "Ponnur",
      "booths": 164,
      "electorate": 150565,
      "turnout_pct": 81.1,
      "lead_party": "TDP",
      "margin": 22583,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8802,
      "name": "Chebrolu",
      "booths": 56,
      "electorate": 50464,
      "turnout_pct": 81.1,
      "lead_party": "TDP",
      "margin": 7567,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 8803,
      "name": "Kakumanu",
      "booths": 57,
      "electorate": 52028,
      "turnout_pct": 81.6,
      "lead_party": "TDP",
      "margin": 5714,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "LEAN"
    }
  ],
  "89": [
    {
      "mandal_id": 8901,
      "name": "Vemuru",
      "booths": 38,
      "electorate": 35445,
      "turnout_pct": 81.1,
      "lead_party": "TDP",
      "margin": 3106,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 8902,
      "name": "Kolluru",
      "booths": 50,
      "electorate": 44857,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 4652,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 8903,
      "name": "Amruthaluru",
      "booths": 41,
      "electorate": 38382,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 4696,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 8904,
      "name": "Bhattiprolu",
      "booths": 68,
      "electorate": 63303,
      "turnout_pct": 81.5,
      "lead_party": "TDP",
      "margin": 6640,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 8905,
      "name": "Tsunduru",
      "booths": 40,
      "electorate": 36279,
      "turnout_pct": 83.6,
      "lead_party": "TDP",
      "margin": 2456,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "LEAN"
    }
  ],
  "90": [
    {
      "mandal_id": 9001,
      "name": "Repalle",
      "booths": 93,
      "electorate": 85324,
      "turnout_pct": 81.1,
      "lead_party": "OTH",
      "margin": 6746,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9002,
      "name": "Nizampatnam",
      "booths": 50,
      "electorate": 45855,
      "turnout_pct": 83.3,
      "lead_party": "TDP",
      "margin": 7575,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9003,
      "name": "Nagaram",
      "booths": 47,
      "electorate": 43298,
      "turnout_pct": 82.5,
      "lead_party": "TDP",
      "margin": 7304,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9004,
      "name": "Cherukupalle",
      "booths": 109,
      "electorate": 100706,
      "turnout_pct": 82.7,
      "lead_party": "TDP",
      "margin": 16317,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    }
  ],
  "91": [
    {
      "mandal_id": 9101,
      "name": "Tenali",
      "booths": 177,
      "electorate": 163574,
      "turnout_pct": 77.0,
      "lead_party": "JSP",
      "margin": 49979,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9102,
      "name": "Kollipara",
      "booths": 140,
      "electorate": 130916,
      "turnout_pct": 80.2,
      "lead_party": "JSP",
      "margin": 32381,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    }
  ],
  "92": [
    {
      "mandal_id": 9201,
      "name": "Bapatla",
      "booths": 109,
      "electorate": 99863,
      "turnout_pct": 78.8,
      "lead_party": "TDP",
      "margin": 14746,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9202,
      "name": "Pittalavanipalem",
      "booths": 132,
      "electorate": 121050,
      "turnout_pct": 81.7,
      "lead_party": "TDP",
      "margin": 14722,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 9203,
      "name": "Karlapalem",
      "booths": 40,
      "electorate": 37042,
      "turnout_pct": 77.2,
      "lead_party": "TDP",
      "margin": 4872,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    }
  ],
  "93": [
    {
      "mandal_id": 9301,
      "name": "Prathipadu (Guntur)",
      "booths": 74,
      "electorate": 67753,
      "turnout_pct": 82.5,
      "lead_party": "OTH",
      "margin": 13172,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9302,
      "name": "Vatticherukuru",
      "booths": 71,
      "electorate": 66192,
      "turnout_pct": 79.2,
      "lead_party": "OTH",
      "margin": 4513,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9303,
      "name": "Pedanandipadu",
      "booths": 70,
      "electorate": 63036,
      "turnout_pct": 76.5,
      "lead_party": "TDP",
      "margin": 5828,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9304,
      "name": "Guntur Rural",
      "booths": 119,
      "electorate": 108465,
      "turnout_pct": 84.8,
      "lead_party": "OTH",
      "margin": 22823,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    }
  ],
  "94": [
    {
      "mandal_id": 9401,
      "name": "Guntur West",
      "booths": 263,
      "electorate": 242298,
      "turnout_pct": 74.0,
      "lead_party": "TDP",
      "margin": 35063,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9402,
      "name": "Brodipet",
      "booths": 25,
      "electorate": 23032,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 7983,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9403,
      "name": "Arundalpet",
      "booths": 25,
      "electorate": 23032,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 6594,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9404,
      "name": "Pattabhipuram",
      "booths": 25,
      "electorate": 23032,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 7636,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    }
  ],
  "95": [
    {
      "mandal_id": 9501,
      "name": "Guntur East",
      "booths": 1,
      "electorate": 1121,
      "turnout_pct": 89.7,
      "lead_party": "TDP",
      "margin": 233,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9502,
      "name": "Old Guntur",
      "booths": 286,
      "electorate": 263408,
      "turnout_pct": 79.3,
      "lead_party": "TDP",
      "margin": 574,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 9503,
      "name": "Autonagar Guntur",
      "booths": 25,
      "electorate": 23025,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 206,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "BATTLEGROUND"
    }
  ],
  "96": [
    {
      "mandal_id": 9601,
      "name": "Chilakaluripet",
      "booths": 183,
      "electorate": 168280,
      "turnout_pct": 78.3,
      "lead_party": "TDP",
      "margin": 52636,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9602,
      "name": "Nadendla",
      "booths": 50,
      "electorate": 45977,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 4293,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9603,
      "name": "Edlapadu",
      "booths": 45,
      "electorate": 41794,
      "turnout_pct": 74.1,
      "lead_party": "OTH",
      "margin": 1498,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "BATTLEGROUND"
    }
  ],
  "97": [
    {
      "mandal_id": 9701,
      "name": "Narasaraopet",
      "booths": 260,
      "electorate": 241525,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 31034,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9702,
      "name": "Rompicherla",
      "booths": 25,
      "electorate": 23223,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 14382,
      "dominant_caste": "Kamma",
      "dominant_caste_pct": 11.6,
      "status": "STRONGHOLD"
    }
  ],
  "98": [
    {
      "mandal_id": 9801,
      "name": "Sattenapalle",
      "booths": 89,
      "electorate": 80641,
      "turnout_pct": 76.6,
      "lead_party": "TDP",
      "margin": 10757,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9802,
      "name": "Rajupalem",
      "booths": 37,
      "electorate": 33500,
      "turnout_pct": 76.6,
      "lead_party": "TDP",
      "margin": 3294,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9803,
      "name": "Nekarikallu",
      "booths": 49,
      "electorate": 44908,
      "turnout_pct": 76.0,
      "lead_party": "TDP",
      "margin": 2937,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9804,
      "name": "Muppalla",
      "booths": 120,
      "electorate": 110759,
      "turnout_pct": 81.3,
      "lead_party": "TDP",
      "margin": 11096,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    }
  ],
  "99": [
    {
      "mandal_id": 9901,
      "name": "Vinukonda",
      "booths": 82,
      "electorate": 73853,
      "turnout_pct": 77.5,
      "lead_party": "TDP",
      "margin": 9232,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9902,
      "name": "Nuzendla",
      "booths": 120,
      "electorate": 112207,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 10221,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9903,
      "name": "Savalyapuram",
      "booths": 30,
      "electorate": 28389,
      "turnout_pct": 77.0,
      "lead_party": "TDP",
      "margin": 2381,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 9904,
      "name": "Bollapalle",
      "booths": 57,
      "electorate": 52657,
      "turnout_pct": 75.8,
      "lead_party": "TDP",
      "margin": 6511,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 9905,
      "name": "Ipuru",
      "booths": 40,
      "electorate": 37440,
      "turnout_pct": 77.6,
      "lead_party": "TDP",
      "margin": 2916,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    }
  ],
  "100": [
    {
      "mandal_id": 10001,
      "name": "Gurazala",
      "booths": 52,
      "electorate": 48182,
      "turnout_pct": 86.9,
      "lead_party": "TDP",
      "margin": 9115,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10002,
      "name": "Dachepalli",
      "booths": 97,
      "electorate": 88949,
      "turnout_pct": 79.2,
      "lead_party": "TDP",
      "margin": 9853,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 10003,
      "name": "Piduguralla",
      "booths": 154,
      "electorate": 142771,
      "turnout_pct": 80.2,
      "lead_party": "TDP",
      "margin": 16285,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 10004,
      "name": "Machavaram",
      "booths": 25,
      "electorate": 23176,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 3538,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    }
  ],
  "101": [
    {
      "mandal_id": 10101,
      "name": "Macherla",
      "booths": 115,
      "electorate": 107071,
      "turnout_pct": 78.2,
      "lead_party": "OTH",
      "margin": 73294,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10102,
      "name": "Veldurthi",
      "booths": 25,
      "electorate": 22953,
      "turnout_pct": 75.0,
      "lead_party": "OTH",
      "margin": 3821,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 10103,
      "name": "Rentachintala",
      "booths": 35,
      "electorate": 32176,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 4105,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10104,
      "name": "Karempudi",
      "booths": 113,
      "electorate": 103752,
      "turnout_pct": 81.9,
      "lead_party": "TDP",
      "margin": 14602,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 10105,
      "name": "Durgi",
      "booths": 33,
      "electorate": 30282,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 3786,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    }
  ],
  "102": [
    {
      "mandal_id": 10201,
      "name": "Yerragondapalem",
      "booths": 48,
      "electorate": 44974,
      "turnout_pct": 79.1,
      "lead_party": "YSRCP",
      "margin": 7360,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10202,
      "name": "Pullalacheruvu",
      "booths": 46,
      "electorate": 42518,
      "turnout_pct": 77.1,
      "lead_party": "YSRCP",
      "margin": 2116,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 10203,
      "name": "Tripuranthakam",
      "booths": 54,
      "electorate": 49870,
      "turnout_pct": 75.6,
      "lead_party": "YSRCP",
      "margin": 7284,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10204,
      "name": "Dornala",
      "booths": 36,
      "electorate": 33438,
      "turnout_pct": 81.3,
      "lead_party": "YSRCP",
      "margin": 6618,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10205,
      "name": "Peddaraveedu",
      "booths": 83,
      "electorate": 78582,
      "turnout_pct": 81.2,
      "lead_party": "YSRCP",
      "margin": 3096,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "BATTLEGROUND"
    }
  ],
  "103": [
    {
      "mandal_id": 10301,
      "name": "Darsi",
      "booths": 76,
      "electorate": 70130,
      "turnout_pct": 76.5,
      "lead_party": "YSRCP",
      "margin": 9008,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10302,
      "name": "Donakonda",
      "booths": 43,
      "electorate": 38359,
      "turnout_pct": 81.1,
      "lead_party": "YSRCP",
      "margin": 1860,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 10303,
      "name": "Kurichedu",
      "booths": 35,
      "electorate": 31589,
      "turnout_pct": 80.1,
      "lead_party": "OTH",
      "margin": 1099,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 10304,
      "name": "Mundlamuru",
      "booths": 112,
      "electorate": 103681,
      "turnout_pct": 82.4,
      "lead_party": "YSRCP",
      "margin": 7073,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 10305,
      "name": "Thallur",
      "booths": 25,
      "electorate": 23143,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 5664,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 10.6,
      "status": "LEAN"
    }
  ],
  "104": [
    {
      "mandal_id": 10401,
      "name": "Parchur",
      "booths": 56,
      "electorate": 51772,
      "turnout_pct": 83.0,
      "lead_party": "TDP",
      "margin": 4033,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 10402,
      "name": "Yeddanapudi",
      "booths": 26,
      "electorate": 24335,
      "turnout_pct": 82.2,
      "lead_party": "TDP",
      "margin": 2686,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 10403,
      "name": "Karamchedu",
      "booths": 39,
      "electorate": 35339,
      "turnout_pct": 83.2,
      "lead_party": "TDP",
      "margin": 1736,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 10404,
      "name": "Inkollu",
      "booths": 46,
      "electorate": 42317,
      "turnout_pct": 82.6,
      "lead_party": "TDP",
      "margin": 3668,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 10405,
      "name": "Chinaganjam",
      "booths": 84,
      "electorate": 77386,
      "turnout_pct": 82.6,
      "lead_party": "TDP",
      "margin": 6796,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 10406,
      "name": "Martur",
      "booths": 53,
      "electorate": 48762,
      "turnout_pct": 82.6,
      "lead_party": "TDP",
      "margin": 7149,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    }
  ],
  "105": [
    {
      "mandal_id": 10501,
      "name": "Addanki",
      "booths": 76,
      "electorate": 69273,
      "turnout_pct": 71.9,
      "lead_party": "OTH",
      "margin": 9921,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10502,
      "name": "J.Panguluru",
      "booths": 38,
      "electorate": 34088,
      "turnout_pct": 76.1,
      "lead_party": "TDP",
      "margin": 2716,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 10503,
      "name": "Santhamaguluru",
      "booths": 49,
      "electorate": 45972,
      "turnout_pct": 66.9,
      "lead_party": "OTH",
      "margin": 14594,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10504,
      "name": "Ballikurava",
      "booths": 45,
      "electorate": 41730,
      "turnout_pct": 74.9,
      "lead_party": "OTH",
      "margin": 22082,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10505,
      "name": "Korisapadu",
      "booths": 106,
      "electorate": 97770,
      "turnout_pct": 80.1,
      "lead_party": "TDP",
      "margin": 7845,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    }
  ],
  "106": [
    {
      "mandal_id": 10601,
      "name": "Chirala",
      "booths": 136,
      "electorate": 125424,
      "turnout_pct": 80.1,
      "lead_party": "TDP",
      "margin": 11012,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 10602,
      "name": "Vetapalem",
      "booths": 110,
      "electorate": 103433,
      "turnout_pct": 81.1,
      "lead_party": "TDP",
      "margin": 965,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "BATTLEGROUND"
    }
  ],
  "107": [
    {
      "mandal_id": 10701,
      "name": "Santhanuthalapadu",
      "booths": 14,
      "electorate": 12948,
      "turnout_pct": 87.9,
      "lead_party": "OTH",
      "margin": 966,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 10702,
      "name": "Maddipadu",
      "booths": 61,
      "electorate": 56177,
      "turnout_pct": 76.2,
      "lead_party": "TDP",
      "margin": 10134,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10703,
      "name": "Chimakurthi",
      "booths": 77,
      "electorate": 70510,
      "turnout_pct": 86.4,
      "lead_party": "TDP",
      "margin": 8429,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 10704,
      "name": "Naguluppalapadu",
      "booths": 113,
      "electorate": 104474,
      "turnout_pct": 77.8,
      "lead_party": "TDP",
      "margin": 14645,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    }
  ],
  "108": [
    {
      "mandal_id": 10801,
      "name": "Ongole Urban",
      "booths": 245,
      "electorate": 225340,
      "turnout_pct": 79.8,
      "lead_party": "TDP",
      "margin": 30263,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10802,
      "name": "Ongole Rural",
      "booths": 25,
      "electorate": 22993,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 8043,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 10803,
      "name": "Kothapatnam",
      "booths": 1,
      "electorate": 419,
      "turnout_pct": 84.0,
      "lead_party": "TDP",
      "margin": 58,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 11.7,
      "status": "STRONGHOLD"
    }
  ],
  "109": [
    {
      "mandal_id": 10901,
      "name": "Kandukur",
      "booths": 71,
      "electorate": 64924,
      "turnout_pct": 80.0,
      "lead_party": "TDP",
      "margin": 5372,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 10902,
      "name": "Voletivaripalem",
      "booths": 36,
      "electorate": 33339,
      "turnout_pct": 80.1,
      "lead_party": "TDP",
      "margin": 3085,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 10903,
      "name": "Ulavapadu",
      "booths": 112,
      "electorate": 103636,
      "turnout_pct": 82.0,
      "lead_party": "TDP",
      "margin": 7128,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 10904,
      "name": "Gudluru",
      "booths": 39,
      "electorate": 36313,
      "turnout_pct": 80.8,
      "lead_party": "TDP",
      "margin": 2922,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 10905,
      "name": "Lingasamudram",
      "booths": 35,
      "electorate": 32381,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 2160,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    }
  ],
  "110": [
    {
      "mandal_id": 11001,
      "name": "Kondapi",
      "booths": 45,
      "electorate": 42144,
      "turnout_pct": 71.4,
      "lead_party": "TDP",
      "margin": 3572,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11002,
      "name": "Zarugumalli",
      "booths": 43,
      "electorate": 38434,
      "turnout_pct": 72.9,
      "lead_party": "TDP",
      "margin": 3415,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11003,
      "name": "Singarayakonda",
      "booths": 105,
      "electorate": 97217,
      "turnout_pct": 80.9,
      "lead_party": "TDP",
      "margin": 9315,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11004,
      "name": "Tangutur",
      "booths": 58,
      "electorate": 54335,
      "turnout_pct": 75.8,
      "lead_party": "TDP",
      "margin": 6118,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11005,
      "name": "Ponnaluru",
      "booths": 40,
      "electorate": 36493,
      "turnout_pct": 65.4,
      "lead_party": "TDP",
      "margin": 5012,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    }
  ],
  "111": [
    {
      "mandal_id": 11101,
      "name": "Markapuram",
      "booths": 95,
      "electorate": 88948,
      "turnout_pct": 61.5,
      "lead_party": "OTH",
      "margin": 34170,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11102,
      "name": "Tarlupadu",
      "booths": 30,
      "electorate": 27454,
      "turnout_pct": 81.2,
      "lead_party": "TDP",
      "margin": 2039,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "LEAN"
    },
    {
      "mandal_id": 11103,
      "name": "Konakanamitla",
      "booths": 38,
      "electorate": 33717,
      "turnout_pct": 52.9,
      "lead_party": "OTH",
      "margin": 17846,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11104,
      "name": "Podili",
      "booths": 114,
      "electorate": 104747,
      "turnout_pct": 74.6,
      "lead_party": "TDP",
      "margin": 1696,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "BATTLEGROUND"
    }
  ],
  "112": [
    {
      "mandal_id": 11201,
      "name": "Giddalur",
      "booths": 70,
      "electorate": 65493,
      "turnout_pct": 74.8,
      "lead_party": "OTH",
      "margin": 14743,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11202,
      "name": "Besthavaripeta",
      "booths": 44,
      "electorate": 41512,
      "turnout_pct": 66.4,
      "lead_party": "OTH",
      "margin": 1884,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11203,
      "name": "Racherla",
      "booths": 26,
      "electorate": 23538,
      "turnout_pct": 72.7,
      "lead_party": "OTH",
      "margin": 3547,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11204,
      "name": "Komarolu",
      "booths": 82,
      "electorate": 76575,
      "turnout_pct": 81.6,
      "lead_party": "TDP",
      "margin": 454,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 11205,
      "name": "Cumbum",
      "booths": 37,
      "electorate": 34288,
      "turnout_pct": 66.2,
      "lead_party": "OTH",
      "margin": 3145,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11206,
      "name": "Ardhaveedu",
      "booths": 28,
      "electorate": 26675,
      "turnout_pct": 84.6,
      "lead_party": "OTH",
      "margin": 10572,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    }
  ],
  "113": [
    {
      "mandal_id": 11301,
      "name": "Kanigiri",
      "booths": 83,
      "electorate": 75735,
      "turnout_pct": 74.0,
      "lead_party": "TDP",
      "margin": 2665,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 11302,
      "name": "Hanumanthunipadu",
      "booths": 10,
      "electorate": 9190,
      "turnout_pct": 73.6,
      "lead_party": "TDP",
      "margin": 1582,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11303,
      "name": "CS Puram",
      "booths": 46,
      "electorate": 43484,
      "turnout_pct": 74.5,
      "lead_party": "OTH",
      "margin": 5886,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11304,
      "name": "Pamuru",
      "booths": 124,
      "electorate": 113132,
      "turnout_pct": 78.4,
      "lead_party": "TDP",
      "margin": 14886,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11305,
      "name": "Veligandla",
      "booths": 41,
      "electorate": 37851,
      "turnout_pct": 74.9,
      "lead_party": "TDP",
      "margin": 1153,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 11306,
      "name": "Pedacherlopalle",
      "booths": 10,
      "electorate": 9427,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 1449,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    }
  ],
  "114": [
    {
      "mandal_id": 11401,
      "name": "Kavali",
      "booths": 122,
      "electorate": 111361,
      "turnout_pct": 65.3,
      "lead_party": "TDP",
      "margin": 11505,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11402,
      "name": "Bogole",
      "booths": 44,
      "electorate": 39973,
      "turnout_pct": 72.6,
      "lead_party": "OTH",
      "margin": 5858,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11403,
      "name": "Allur",
      "booths": 123,
      "electorate": 112316,
      "turnout_pct": 76.3,
      "lead_party": "TDP",
      "margin": 6217,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11404,
      "name": "Dagadarthi",
      "booths": 35,
      "electorate": 32588,
      "turnout_pct": 70.4,
      "lead_party": "OTH",
      "margin": 657,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "BATTLEGROUND"
    }
  ],
  "115": [
    {
      "mandal_id": 11501,
      "name": "Atmakur",
      "booths": 54,
      "electorate": 49618,
      "turnout_pct": 72.2,
      "lead_party": "TDP",
      "margin": 5118,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    },
    {
      "mandal_id": 11502,
      "name": "Chejerla",
      "booths": 70,
      "electorate": 63159,
      "turnout_pct": 71.9,
      "lead_party": "TDP",
      "margin": 7681,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11503,
      "name": "Ananthasagaram",
      "booths": 27,
      "electorate": 24635,
      "turnout_pct": 67.4,
      "lead_party": "TDP",
      "margin": 2719,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11504,
      "name": "Marripadu",
      "booths": 60,
      "electorate": 55583,
      "turnout_pct": 73.7,
      "lead_party": "TDP",
      "margin": 6781,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11505,
      "name": "AS Peta",
      "booths": 39,
      "electorate": 36277,
      "turnout_pct": 70.8,
      "lead_party": "TDP",
      "margin": 3993,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11506,
      "name": "Sangam",
      "booths": 33,
      "electorate": 30922,
      "turnout_pct": 64.0,
      "lead_party": "TDP",
      "margin": 2403,
      "dominant_caste": "SC Madiga / Relli",
      "dominant_caste_pct": 12.1,
      "status": "LEAN"
    }
  ],
  "116": [
    {
      "mandal_id": 11601,
      "name": "Kovur",
      "booths": 63,
      "electorate": 58742,
      "turnout_pct": 77.8,
      "lead_party": "TDP",
      "margin": 10162,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11602,
      "name": "Kodavalur",
      "booths": 48,
      "electorate": 43055,
      "turnout_pct": 72.6,
      "lead_party": "TDP",
      "margin": 7017,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11603,
      "name": "Vidavalur",
      "booths": 44,
      "electorate": 40794,
      "turnout_pct": 67.4,
      "lead_party": "TDP",
      "margin": 7228,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11604,
      "name": "Buchireddypalem",
      "booths": 71,
      "electorate": 65468,
      "turnout_pct": 74.1,
      "lead_party": "TDP",
      "margin": 10712,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11605,
      "name": "Indukurpet",
      "booths": 101,
      "electorate": 94417,
      "turnout_pct": 79.8,
      "lead_party": "TDP",
      "margin": 19364,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    }
  ],
  "117": [
    {
      "mandal_id": 11701,
      "name": "Nellore City",
      "booths": 208,
      "electorate": 190792,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 16598,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "LEAN"
    },
    {
      "mandal_id": 11702,
      "name": "Stonehousepet",
      "booths": 25,
      "electorate": 22931,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 2777,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 11703,
      "name": "Dargamitta",
      "booths": 25,
      "electorate": 22931,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 2272,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "BATTLEGROUND"
    }
  ],
  "118": [
    {
      "mandal_id": 11801,
      "name": "Nellore Rural",
      "booths": 319,
      "electorate": 293593,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 33433,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "LEAN"
    },
    {
      "mandal_id": 11802,
      "name": "Podalakur",
      "booths": 25,
      "electorate": 23008,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 24562,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    }
  ],
  "119": [
    {
      "mandal_id": 11901,
      "name": "Sarvepalli",
      "booths": 25,
      "electorate": 23310,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 13048,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11902,
      "name": "Venkatachalam",
      "booths": 50,
      "electorate": 45862,
      "turnout_pct": 74.0,
      "lead_party": "TDP",
      "margin": 1230,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 11903,
      "name": "Thotapalligudur",
      "booths": 79,
      "electorate": 73662,
      "turnout_pct": 66.4,
      "lead_party": "OTH",
      "margin": 48441,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11904,
      "name": "Muthukur",
      "booths": 43,
      "electorate": 40163,
      "turnout_pct": 63.2,
      "lead_party": "OTH",
      "margin": 25393,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 11905,
      "name": "Manubolu",
      "booths": 92,
      "electorate": 86712,
      "turnout_pct": 80.1,
      "lead_party": "TDP",
      "margin": 6446,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "LEAN"
    }
  ],
  "120": [
    {
      "mandal_id": 12001,
      "name": "Gudur",
      "booths": 211,
      "electorate": 189816,
      "turnout_pct": 73.9,
      "lead_party": "TDP",
      "margin": 33658,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12002,
      "name": "Chillakur",
      "booths": 25,
      "electorate": 22489,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 5861,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12003,
      "name": "Kota",
      "booths": 25,
      "electorate": 22489,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 6896,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12004,
      "name": "Vakadu",
      "booths": 25,
      "electorate": 22489,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 7930,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12005,
      "name": "Chittamur",
      "booths": 25,
      "electorate": 22490,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 6551,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    }
  ],
  "121": [
    {
      "mandal_id": 12101,
      "name": "Sullurpeta",
      "booths": 285,
      "electorate": 255278,
      "turnout_pct": 85.0,
      "lead_party": "TDP",
      "margin": 68567,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12102,
      "name": "Tada",
      "booths": 25,
      "electorate": 22392,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 11927,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12103,
      "name": "Doravarisatram",
      "booths": 65,
      "electorate": 59092,
      "turnout_pct": 66.2,
      "lead_party": "TDP",
      "margin": 13933,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12104,
      "name": "Naidupeta",
      "booths": 25,
      "electorate": 22392,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 10805,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12105,
      "name": "Pellakur",
      "booths": 146,
      "electorate": 133921,
      "turnout_pct": 72.0,
      "lead_party": "TDP",
      "margin": 16600,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12106,
      "name": "Ozili",
      "booths": 25,
      "electorate": 22392,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 11560,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    }
  ],
  "122": [
    {
      "mandal_id": 12201,
      "name": "Venkatagiri",
      "booths": 95,
      "electorate": 86349,
      "turnout_pct": 81.4,
      "lead_party": "TDP",
      "margin": 13660,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12202,
      "name": "Dakkili",
      "booths": 25,
      "electorate": 23075,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 4061,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12203,
      "name": "Balayapalle",
      "booths": 25,
      "electorate": 22723,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 3355,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12204,
      "name": "Rapur",
      "booths": 3,
      "electorate": 2802,
      "turnout_pct": 78.6,
      "lead_party": "YSRCP",
      "margin": 54,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 12205,
      "name": "Sydapuram",
      "booths": 98,
      "electorate": 90458,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 17265,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12206,
      "name": "Kaluvoya",
      "booths": 78,
      "electorate": 73243,
      "turnout_pct": 71.5,
      "lead_party": "OTH",
      "margin": 2030,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "BATTLEGROUND"
    }
  ],
  "123": [
    {
      "mandal_id": 12301,
      "name": "Udayagiri",
      "booths": 39,
      "electorate": 35633,
      "turnout_pct": 72.6,
      "lead_party": "TDP",
      "margin": 1414,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12302,
      "name": "Varikuntapadu",
      "booths": 40,
      "electorate": 36010,
      "turnout_pct": 81.1,
      "lead_party": "TDP",
      "margin": 2590,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12303,
      "name": "Vinjamur",
      "booths": 5,
      "electorate": 4831,
      "turnout_pct": 78.6,
      "lead_party": "TDP",
      "margin": 237,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12304,
      "name": "Duttalur",
      "booths": 67,
      "electorate": 61782,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 2998,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12305,
      "name": "Kaligiri",
      "booths": 42,
      "electorate": 37758,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 756,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 12306,
      "name": "Jaladanki",
      "booths": 104,
      "electorate": 94913,
      "turnout_pct": 82.5,
      "lead_party": "TDP",
      "margin": 2855,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 12307,
      "name": "Seetharamapuram",
      "booths": 27,
      "electorate": 25265,
      "turnout_pct": 75.6,
      "lead_party": "TDP",
      "margin": 569,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "BATTLEGROUND"
    }
  ],
  "124": [
    {
      "mandal_id": 12401,
      "name": "Badvel",
      "booths": 54,
      "electorate": 50208,
      "turnout_pct": 82.2,
      "lead_party": "YSRCP",
      "margin": 3771,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12402,
      "name": "Gopavaram",
      "booths": 103,
      "electorate": 94414,
      "turnout_pct": 81.8,
      "lead_party": "YSRCP",
      "margin": 6543,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12403,
      "name": "Sankhavaram",
      "booths": 4,
      "electorate": 3862,
      "turnout_pct": 83.8,
      "lead_party": "YSRCP",
      "margin": 147,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 12404,
      "name": "Kalasapadu",
      "booths": 38,
      "electorate": 35477,
      "turnout_pct": 70.2,
      "lead_party": "YSRCP",
      "margin": 5307,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12405,
      "name": "Porumamilla",
      "booths": 61,
      "electorate": 56306,
      "turnout_pct": 80.9,
      "lead_party": "YSRCP",
      "margin": 5420,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 12406,
      "name": "B.Kodur",
      "booths": 4,
      "electorate": 3675,
      "turnout_pct": 79.1,
      "lead_party": "BJP",
      "margin": 61,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 12407,
      "name": "Atlur",
      "booths": 25,
      "electorate": 23804,
      "turnout_pct": 82.7,
      "lead_party": "YSRCP",
      "margin": 2270,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    }
  ],
  "125": [
    {
      "mandal_id": 12501,
      "name": "Rajampet",
      "booths": 107,
      "electorate": 99464,
      "turnout_pct": 78.4,
      "lead_party": "OTH",
      "margin": 14263,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12502,
      "name": "Nandalur",
      "booths": 59,
      "electorate": 53864,
      "turnout_pct": 75.9,
      "lead_party": "OTH",
      "margin": 5278,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "LEAN"
    },
    {
      "mandal_id": 12503,
      "name": "Vontimitta",
      "booths": 55,
      "electorate": 51167,
      "turnout_pct": 68.6,
      "lead_party": "OTH",
      "margin": 12601,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12504,
      "name": "Sidhout",
      "booths": 60,
      "electorate": 56258,
      "turnout_pct": 72.1,
      "lead_party": "OTH",
      "margin": 17412,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12505,
      "name": "Pullampeta",
      "booths": 25,
      "electorate": 23101,
      "turnout_pct": 78.7,
      "lead_party": "YSRCP",
      "margin": 121,
      "dominant_caste": "BC Other",
      "dominant_caste_pct": 11.2,
      "status": "BATTLEGROUND"
    }
  ],
  "126": [
    {
      "mandal_id": 12601,
      "name": "Kadapa Urban",
      "booths": 315,
      "electorate": 290682,
      "turnout_pct": 77.9,
      "lead_party": "TDP",
      "margin": 16771,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 12602,
      "name": "Kadapa Rural",
      "booths": 25,
      "electorate": 23070,
      "turnout_pct": 75.0,
      "lead_party": "YSRCP",
      "margin": 9747,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    }
  ],
  "127": [
    {
      "mandal_id": 12701,
      "name": "Kodur",
      "booths": 66,
      "electorate": 61097,
      "turnout_pct": 73.7,
      "lead_party": "JSP",
      "margin": 11127,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12702,
      "name": "Penagalur",
      "booths": 74,
      "electorate": 69385,
      "turnout_pct": 76.7,
      "lead_party": "JSP",
      "margin": 4749,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 12703,
      "name": "Chitvel",
      "booths": 40,
      "electorate": 36856,
      "turnout_pct": 76.5,
      "lead_party": "JSP",
      "margin": 5885,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12704,
      "name": "Pullampeta",
      "booths": 42,
      "electorate": 38230,
      "turnout_pct": 67.5,
      "lead_party": "JSP",
      "margin": 5339,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12705,
      "name": "Obulavaripalle",
      "booths": 47,
      "electorate": 43095,
      "turnout_pct": 73.9,
      "lead_party": "JSP",
      "margin": 6104,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    }
  ],
  "128": [
    {
      "mandal_id": 12801,
      "name": "Rayachoti",
      "booths": 25,
      "electorate": 23051,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 1015,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 12802,
      "name": "Sambepalli",
      "booths": 25,
      "electorate": 23245,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 829,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 12803,
      "name": "Chinnamandem",
      "booths": 90,
      "electorate": 82988,
      "turnout_pct": 80.2,
      "lead_party": "YSRCP",
      "margin": 214,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 12804,
      "name": "Galiveedu",
      "booths": 40,
      "electorate": 37712,
      "turnout_pct": 77.5,
      "lead_party": "OTH",
      "margin": 1462,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 12805,
      "name": "Lakkireddipalli",
      "booths": 32,
      "electorate": 29402,
      "turnout_pct": 79.2,
      "lead_party": "TDP",
      "margin": 2068,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 12806,
      "name": "Ramapuram",
      "booths": 90,
      "electorate": 83686,
      "turnout_pct": 71.6,
      "lead_party": "OTH",
      "margin": 571,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "BATTLEGROUND"
    }
  ],
  "129": [
    {
      "mandal_id": 12901,
      "name": "Pulivendla",
      "booths": 63,
      "electorate": 59066,
      "turnout_pct": 79.4,
      "lead_party": "YSRCP",
      "margin": 14561,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12902,
      "name": "Vempalli",
      "booths": 53,
      "electorate": 47704,
      "turnout_pct": 80.4,
      "lead_party": "YSRCP",
      "margin": 12084,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12903,
      "name": "Simhadripuram",
      "booths": 32,
      "electorate": 29718,
      "turnout_pct": 66.5,
      "lead_party": "YSRCP",
      "margin": 4279,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12904,
      "name": "Lingala",
      "booths": 31,
      "electorate": 28248,
      "turnout_pct": 77.9,
      "lead_party": "YSRCP",
      "margin": 7122,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12905,
      "name": "Thondur",
      "booths": 29,
      "electorate": 25533,
      "turnout_pct": 79.5,
      "lead_party": "YSRCP",
      "margin": 5920,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12906,
      "name": "Vemula",
      "booths": 23,
      "electorate": 20741,
      "turnout_pct": 79.4,
      "lead_party": "YSRCP",
      "margin": 4417,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 12907,
      "name": "Chakrayapet",
      "booths": 78,
      "electorate": 72077,
      "turnout_pct": 82.1,
      "lead_party": "YSRCP",
      "margin": 15387,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    }
  ],
  "130": [
    {
      "mandal_id": 13001,
      "name": "Kamalapuram",
      "booths": 59,
      "electorate": 53732,
      "turnout_pct": 65.9,
      "lead_party": "TDP",
      "margin": 6998,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13002,
      "name": "Veerapunayunipalle",
      "booths": 37,
      "electorate": 33788,
      "turnout_pct": 76.6,
      "lead_party": "TDP",
      "margin": 5110,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13003,
      "name": "Yerraguntla",
      "booths": 6,
      "electorate": 4911,
      "turnout_pct": 83.0,
      "lead_party": "TDP",
      "margin": 696,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13004,
      "name": "Pendlimarri",
      "booths": 44,
      "electorate": 40017,
      "turnout_pct": 75.7,
      "lead_party": "TDP",
      "margin": 4994,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13005,
      "name": "Vallur",
      "booths": 32,
      "electorate": 29538,
      "turnout_pct": 80.6,
      "lead_party": "TDP",
      "margin": 2143,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 13006,
      "name": "Chinthakommadinne",
      "booths": 101,
      "electorate": 91786,
      "turnout_pct": 82.1,
      "lead_party": "TDP",
      "margin": 14824,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    }
  ],
  "131": [
    {
      "mandal_id": 13101,
      "name": "Jammalamadugu",
      "booths": 88,
      "electorate": 82652,
      "turnout_pct": 81.6,
      "lead_party": "BJP",
      "margin": 4668,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13102,
      "name": "Muddanur",
      "booths": 56,
      "electorate": 52876,
      "turnout_pct": 82.1,
      "lead_party": "BJP",
      "margin": 4031,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13103,
      "name": "Kondapuram",
      "booths": 64,
      "electorate": 59832,
      "turnout_pct": 81.4,
      "lead_party": "BJP",
      "margin": 4509,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13104,
      "name": "Mylavaram (YSR)",
      "booths": 64,
      "electorate": 59069,
      "turnout_pct": 81.8,
      "lead_party": "BJP",
      "margin": 2918,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13105,
      "name": "Peddamudium",
      "booths": 55,
      "electorate": 49789,
      "turnout_pct": 77.5,
      "lead_party": "BJP",
      "margin": 8491,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    }
  ],
  "132": [
    {
      "mandal_id": 13201,
      "name": "Proddatur",
      "booths": 277,
      "electorate": 255174,
      "turnout_pct": 82.5,
      "lead_party": "TDP",
      "margin": 20077,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13202,
      "name": "Rajupalem",
      "booths": 33,
      "electorate": 30460,
      "turnout_pct": 57.7,
      "lead_party": "TDP",
      "margin": 4761,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    }
  ],
  "133": [
    {
      "mandal_id": 13301,
      "name": "Mydukur",
      "booths": 87,
      "electorate": 79313,
      "turnout_pct": 75.5,
      "lead_party": "TDP",
      "margin": 2329,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 13302,
      "name": "Duvvur",
      "booths": 62,
      "electorate": 55902,
      "turnout_pct": 75.5,
      "lead_party": "TDP",
      "margin": 7189,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13303,
      "name": "S.Mydukur",
      "booths": 12,
      "electorate": 11100,
      "turnout_pct": 75.7,
      "lead_party": "TDP",
      "margin": 1172,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "LEAN"
    },
    {
      "mandal_id": 13304,
      "name": "Chapadu",
      "booths": 49,
      "electorate": 45050,
      "turnout_pct": 77.8,
      "lead_party": "TDP",
      "margin": 9319,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13305,
      "name": "Brahmamgarimattam",
      "booths": 11,
      "electorate": 10670,
      "turnout_pct": 77.8,
      "lead_party": "TDP",
      "margin": 1339,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13306,
      "name": "Khajipet",
      "booths": 63,
      "electorate": 58285,
      "turnout_pct": 69.4,
      "lead_party": "TDP",
      "margin": 8451,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    }
  ],
  "134": [
    {
      "mandal_id": 13401,
      "name": "Allagadda",
      "booths": 61,
      "electorate": 56218,
      "turnout_pct": 73.0,
      "lead_party": "OTH",
      "margin": 13273,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13402,
      "name": "Chagalamarri",
      "booths": 91,
      "electorate": 82556,
      "turnout_pct": 77.4,
      "lead_party": "TDP",
      "margin": 1511,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 13403,
      "name": "Rudravaram",
      "booths": 48,
      "electorate": 44280,
      "turnout_pct": 77.9,
      "lead_party": "OTH",
      "margin": 19384,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13404,
      "name": "Sirvel",
      "booths": 62,
      "electorate": 56744,
      "turnout_pct": 78.2,
      "lead_party": "OTH",
      "margin": 11756,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13405,
      "name": "Uyyalawada",
      "booths": 31,
      "electorate": 27853,
      "turnout_pct": 69.8,
      "lead_party": "OTH",
      "margin": 16617,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13406,
      "name": "Dornipadu",
      "booths": 19,
      "electorate": 17714,
      "turnout_pct": 77.7,
      "lead_party": "OTH",
      "margin": 8290,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.3,
      "status": "STRONGHOLD"
    }
  ],
  "135": [
    {
      "mandal_id": 13501,
      "name": "Srisailam",
      "booths": 42,
      "electorate": 36965,
      "turnout_pct": 72.3,
      "lead_party": "TDP",
      "margin": 2861,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 13502,
      "name": "Atmakur (Kurnool)",
      "booths": 101,
      "electorate": 91104,
      "turnout_pct": 79.4,
      "lead_party": "TDP",
      "margin": 1867,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 13503,
      "name": "Pamulapadu",
      "booths": 11,
      "electorate": 9762,
      "turnout_pct": 81.8,
      "lead_party": "TDP",
      "margin": 88,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 13504,
      "name": "Sunnipenta",
      "booths": 11,
      "electorate": 10049,
      "turnout_pct": 80.1,
      "lead_party": "TDP",
      "margin": 111,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 13505,
      "name": "Velgode",
      "booths": 21,
      "electorate": 18566,
      "turnout_pct": 78.9,
      "lead_party": "TDP",
      "margin": 884,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 13506,
      "name": "Bandi Atmakur",
      "booths": 53,
      "electorate": 50006,
      "turnout_pct": 80.3,
      "lead_party": "TDP",
      "margin": 341,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "BATTLEGROUND"
    }
  ],
  "136": [
    {
      "mandal_id": 13601,
      "name": "Nandikotkur",
      "booths": 76,
      "electorate": 70798,
      "turnout_pct": 78.6,
      "lead_party": "OTH",
      "margin": 16417,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13602,
      "name": "Pagidyala",
      "booths": 47,
      "electorate": 41473,
      "turnout_pct": 83.8,
      "lead_party": "OTH",
      "margin": 16093,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13603,
      "name": "Jupadu Bungalow",
      "booths": 48,
      "electorate": 44236,
      "turnout_pct": 72.4,
      "lead_party": "OTH",
      "margin": 12410,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13604,
      "name": "Kothapalle",
      "booths": 51,
      "electorate": 47463,
      "turnout_pct": 72.8,
      "lead_party": "OTH",
      "margin": 6839,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13605,
      "name": "Midthur",
      "booths": 54,
      "electorate": 50002,
      "turnout_pct": 78.1,
      "lead_party": "OTH",
      "margin": 18379,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    }
  ],
  "137": [
    {
      "mandal_id": 13701,
      "name": "Kurnool Urban",
      "booths": 268,
      "electorate": 246101,
      "turnout_pct": 75.8,
      "lead_party": "TDP",
      "margin": 60588,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13702,
      "name": "Kurnool Rural",
      "booths": 25,
      "electorate": 22957,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 5662,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 13703,
      "name": "Gargapuram",
      "booths": 25,
      "electorate": 22957,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 6606,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    }
  ],
  "138": [
    {
      "mandal_id": 13801,
      "name": "Panyam",
      "booths": 145,
      "electorate": 134149,
      "turnout_pct": 80.5,
      "lead_party": "TDP",
      "margin": 15055,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 13802,
      "name": "Gadivemula",
      "booths": 25,
      "electorate": 23125,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 10655,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13803,
      "name": "Kallur",
      "booths": 142,
      "electorate": 131352,
      "turnout_pct": 76.2,
      "lead_party": "OTH",
      "margin": 23718,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13804,
      "name": "Orvakal",
      "booths": 61,
      "electorate": 55804,
      "turnout_pct": 75.2,
      "lead_party": "OTH",
      "margin": 4486,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    }
  ],
  "139": [
    {
      "mandal_id": 13901,
      "name": "Nandyal Urban",
      "booths": 173,
      "electorate": 158696,
      "turnout_pct": 78.0,
      "lead_party": "OTH",
      "margin": 34651,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 13902,
      "name": "Nandyal Rural",
      "booths": 25,
      "electorate": 22932,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 3494,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 13903,
      "name": "Gospadu",
      "booths": 136,
      "electorate": 125715,
      "turnout_pct": 83.7,
      "lead_party": "TDP",
      "margin": 4388,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "BATTLEGROUND"
    }
  ],
  "140": [
    {
      "mandal_id": 14001,
      "name": "Banaganapalle",
      "booths": 87,
      "electorate": 79717,
      "turnout_pct": 78.1,
      "lead_party": "OTH",
      "margin": 33504,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14002,
      "name": "Owk",
      "booths": 85,
      "electorate": 77170,
      "turnout_pct": 72.9,
      "lead_party": "OTH",
      "margin": 32927,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14003,
      "name": "Koilkuntla",
      "booths": 94,
      "electorate": 87600,
      "turnout_pct": 79.6,
      "lead_party": "TDP",
      "margin": 8494,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 14004,
      "name": "Sanjamala",
      "booths": 15,
      "electorate": 13396,
      "turnout_pct": 67.8,
      "lead_party": "OTH",
      "margin": 2042,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14005,
      "name": "Kolimigundla",
      "booths": 25,
      "electorate": 23297,
      "turnout_pct": 75.0,
      "lead_party": "OTH",
      "margin": 6621,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.0,
      "status": "STRONGHOLD"
    }
  ],
  "141": [
    {
      "mandal_id": 14101,
      "name": "Dhone",
      "booths": 136,
      "electorate": 123496,
      "turnout_pct": 75.3,
      "lead_party": "OTH",
      "margin": 46103,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14102,
      "name": "Bethamcherla",
      "booths": 137,
      "electorate": 126849,
      "turnout_pct": 78.3,
      "lead_party": "TDP",
      "margin": 1725,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 14103,
      "name": "Peapally",
      "booths": 23,
      "electorate": 20964,
      "turnout_pct": 74.7,
      "lead_party": "OTH",
      "margin": 8786,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "STRONGHOLD"
    }
  ],
  "142": [
    {
      "mandal_id": 14201,
      "name": "Pattikonda",
      "booths": 41,
      "electorate": 37190,
      "turnout_pct": 71.8,
      "lead_party": "TDP",
      "margin": 2387,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14202,
      "name": "Maddikera",
      "booths": 46,
      "electorate": 41215,
      "turnout_pct": 82.1,
      "lead_party": "TDP",
      "margin": 7703,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14203,
      "name": "Tuggali",
      "booths": 46,
      "electorate": 42669,
      "turnout_pct": 68.5,
      "lead_party": "TDP",
      "margin": 3095,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14204,
      "name": "Veldurthi",
      "booths": 108,
      "electorate": 99646,
      "turnout_pct": 80.7,
      "lead_party": "TDP",
      "margin": 4541,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14205,
      "name": "Krishnagiri",
      "booths": 36,
      "electorate": 32282,
      "turnout_pct": 80.6,
      "lead_party": "TDP",
      "margin": 1630,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    }
  ],
  "143": [
    {
      "mandal_id": 14301,
      "name": "Kodumur",
      "booths": 142,
      "electorate": 130262,
      "turnout_pct": 80.2,
      "lead_party": "OTH",
      "margin": 11741,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14302,
      "name": "C.Belagal",
      "booths": 48,
      "electorate": 43952,
      "turnout_pct": 72.6,
      "lead_party": "OTH",
      "margin": 10837,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14303,
      "name": "Gudur (Kurnool)",
      "booths": 101,
      "electorate": 92343,
      "turnout_pct": 78.0,
      "lead_party": "OTH",
      "margin": 39903,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "STRONGHOLD"
    }
  ],
  "144": [
    {
      "mandal_id": 14401,
      "name": "Yemmiganur",
      "booths": 121,
      "electorate": 111292,
      "turnout_pct": 79.2,
      "lead_party": "TDP",
      "margin": 14210,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14402,
      "name": "Nandavaram",
      "booths": 41,
      "electorate": 38099,
      "turnout_pct": 74.9,
      "lead_party": "TDP",
      "margin": 2561,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14403,
      "name": "Gonegandla",
      "booths": 160,
      "electorate": 146438,
      "turnout_pct": 82.7,
      "lead_party": "TDP",
      "margin": 17342,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    }
  ],
  "145": [
    {
      "mandal_id": 14501,
      "name": "Mantralayam",
      "booths": 46,
      "electorate": 43484,
      "turnout_pct": 78.9,
      "lead_party": "YSRCP",
      "margin": 5543,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14502,
      "name": "Kosigi",
      "booths": 51,
      "electorate": 46665,
      "turnout_pct": 85.3,
      "lead_party": "YSRCP",
      "margin": 3167,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14503,
      "name": "Kowthalam",
      "booths": 166,
      "electorate": 152905,
      "turnout_pct": 82.2,
      "lead_party": "YSRCP",
      "margin": 3001,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 14504,
      "name": "Peddakadubur",
      "booths": 4,
      "electorate": 3590,
      "turnout_pct": 59.2,
      "lead_party": "YSRCP",
      "margin": 171,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    }
  ],
  "146": [
    {
      "mandal_id": 14601,
      "name": "Adoni Urban",
      "booths": 259,
      "electorate": 239984,
      "turnout_pct": 82.7,
      "lead_party": "BJP",
      "margin": 15207,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    },
    {
      "mandal_id": 14602,
      "name": "Adoni Rural",
      "booths": 25,
      "electorate": 23164,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 7719,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "LEAN"
    }
  ],
  "147": [
    {
      "mandal_id": 14701,
      "name": "Alur",
      "booths": 198,
      "electorate": 170420,
      "turnout_pct": 84.7,
      "lead_party": "YSRCP",
      "margin": 19017,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 14702,
      "name": "Aspari",
      "booths": 25,
      "electorate": 21517,
      "turnout_pct": 75.0,
      "lead_party": "YSRCP",
      "margin": 1678,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14703,
      "name": "Devanakonda",
      "booths": 1,
      "electorate": 806,
      "turnout_pct": 87.0,
      "lead_party": "TDP",
      "margin": 19,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 14704,
      "name": "Holagunda",
      "booths": 44,
      "electorate": 40019,
      "turnout_pct": 76.4,
      "lead_party": "YSRCP",
      "margin": 4394,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 14705,
      "name": "Halaharvi",
      "booths": 39,
      "electorate": 34846,
      "turnout_pct": 77.9,
      "lead_party": "YSRCP",
      "margin": 4434,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14706,
      "name": "Chippagiri",
      "booths": 13,
      "electorate": 10969,
      "turnout_pct": 77.7,
      "lead_party": "YSRCP",
      "margin": 1194,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    }
  ],
  "148": [
    {
      "mandal_id": 14801,
      "name": "Rayadurg",
      "booths": 25,
      "electorate": 23043,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 8331,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14802,
      "name": "D.Hirehal",
      "booths": 32,
      "electorate": 28190,
      "turnout_pct": 79.1,
      "lead_party": "TDP",
      "margin": 5185,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14803,
      "name": "Kanekal",
      "booths": 25,
      "electorate": 23043,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 7915,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14804,
      "name": "Bommanahal",
      "booths": 236,
      "electorate": 217529,
      "turnout_pct": 82.9,
      "lead_party": "TDP",
      "margin": 38351,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 14805,
      "name": "Gummagatta",
      "booths": 25,
      "electorate": 23043,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 7498,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    }
  ],
  "149": [
    {
      "mandal_id": 14901,
      "name": "Uravakonda",
      "booths": 185,
      "electorate": 171259,
      "turnout_pct": 82.5,
      "lead_party": "TDP",
      "margin": 14080,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 14902,
      "name": "Guntakal Rural",
      "booths": 25,
      "electorate": 23142,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 4123,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 14903,
      "name": "Vajrakarur",
      "booths": 25,
      "electorate": 23142,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 4774,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 14904,
      "name": "Vidapanakal",
      "booths": 25,
      "electorate": 23142,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 3906,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 14905,
      "name": "Kudair",
      "booths": 25,
      "electorate": 23142,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 4557,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    }
  ],
  "150": [
    {
      "mandal_id": 15001,
      "name": "Guntakal Urban",
      "booths": 27,
      "electorate": 24101,
      "turnout_pct": 84.3,
      "lead_party": "OTH",
      "margin": 513,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 15002,
      "name": "Gooty",
      "booths": 11,
      "electorate": 9818,
      "turnout_pct": 75.0,
      "lead_party": "OTH",
      "margin": 44,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 15003,
      "name": "Pamidi",
      "booths": 8,
      "electorate": 7140,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 102,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "BATTLEGROUND"
    }
  ],
  "151": [
    {
      "mandal_id": 15101,
      "name": "Tadipatri",
      "booths": 9,
      "electorate": 8215,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 7626,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15102,
      "name": "Peddavadugur",
      "booths": 21,
      "electorate": 19171,
      "turnout_pct": 79.8,
      "lead_party": "OTH",
      "margin": 4288,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15103,
      "name": "Yadiki",
      "booths": 11,
      "electorate": 10659,
      "turnout_pct": 82.3,
      "lead_party": "TDP",
      "margin": 1834,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15104,
      "name": "Peddapappur",
      "booths": 6,
      "electorate": 5477,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 5892,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    }
  ],
  "152": [
    {
      "mandal_id": 15201,
      "name": "Singanamala",
      "booths": 8,
      "electorate": 7358,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 1318,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 15202,
      "name": "Garladinne",
      "booths": 9,
      "electorate": 8280,
      "turnout_pct": 71.5,
      "lead_party": "TDP",
      "margin": 3139,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 15203,
      "name": "Putlur",
      "booths": 6,
      "electorate": 5519,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 1244,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 15204,
      "name": "Yellanur",
      "booths": 5,
      "electorate": 4599,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 1464,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 15205,
      "name": "Narpala",
      "booths": 4,
      "electorate": 3679,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 1684,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "LEAN"
    },
    {
      "mandal_id": 15206,
      "name": "B.K. Samudram",
      "booths": 3,
      "electorate": 2759,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 1391,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "BATTLEGROUND"
    }
  ],
  "153": [
    {
      "mandal_id": 15301,
      "name": "Anantapur Urban",
      "booths": 13,
      "electorate": 12144,
      "turnout_pct": 60.0,
      "lead_party": "OTH",
      "margin": 9526,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15302,
      "name": "Anantapur Rural",
      "booths": 4,
      "electorate": 3736,
      "turnout_pct": 75.0,
      "lead_party": "OTH",
      "margin": 4853,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    }
  ],
  "154": [
    {
      "mandal_id": 15401,
      "name": "Kalyandurg",
      "booths": 129,
      "electorate": 118343,
      "turnout_pct": 79.0,
      "lead_party": "TDP",
      "margin": 31317,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15402,
      "name": "Brahmasamudram",
      "booths": 25,
      "electorate": 22934,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 7546,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15403,
      "name": "Settur",
      "booths": 25,
      "electorate": 22934,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 8678,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15404,
      "name": "Kundurpi",
      "booths": 25,
      "electorate": 22934,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 7169,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15405,
      "name": "Atmakur (Anantapur)",
      "booths": 25,
      "electorate": 22934,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 8301,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 18.7,
      "status": "STRONGHOLD"
    }
  ],
  "155": [
    {
      "mandal_id": 15501,
      "name": "Raptadu",
      "booths": 101,
      "electorate": 95856,
      "turnout_pct": 81.6,
      "lead_party": "TDP",
      "margin": 13016,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 15502,
      "name": "Atmakur",
      "booths": 25,
      "electorate": 23726,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 5365,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 15503,
      "name": "Kanaganapalle",
      "booths": 25,
      "electorate": 23726,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 4432,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 15504,
      "name": "C.K. Palle",
      "booths": 25,
      "electorate": 23726,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 5132,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 15505,
      "name": "Ramagiri",
      "booths": 25,
      "electorate": 23726,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 4199,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "LEAN"
    }
  ],
  "156": [
    {
      "mandal_id": 15601,
      "name": "Madakasira",
      "booths": 141,
      "electorate": 120336,
      "turnout_pct": 89.1,
      "lead_party": "TDP",
      "margin": 20925,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 15602,
      "name": "Amarapuram",
      "booths": 25,
      "electorate": 21335,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 150,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 15603,
      "name": "Gudibanda",
      "booths": 25,
      "electorate": 21335,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 150,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 15604,
      "name": "Rolla",
      "booths": 25,
      "electorate": 21335,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 150,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 15605,
      "name": "Agali",
      "booths": 25,
      "electorate": 21335,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 150,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "BATTLEGROUND"
    }
  ],
  "157": [
    {
      "mandal_id": 15701,
      "name": "Hindupur Urban",
      "booths": 176,
      "electorate": 155486,
      "turnout_pct": 86.8,
      "lead_party": "TDP",
      "margin": 46237,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15702,
      "name": "Hindupur Rural",
      "booths": 25,
      "electorate": 22085,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 13437,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15703,
      "name": "Lepakshi",
      "booths": 25,
      "electorate": 22085,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 12483,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15704,
      "name": "Chilamathur",
      "booths": 25,
      "electorate": 22086,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 8158,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    }
  ],
  "158": [
    {
      "mandal_id": 15801,
      "name": "Penukonda",
      "booths": 189,
      "electorate": 162291,
      "turnout_pct": 90.2,
      "lead_party": "TDP",
      "margin": 31619,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15802,
      "name": "Somandepalle",
      "booths": 25,
      "electorate": 21466,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 6009,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15803,
      "name": "Roddam",
      "booths": 1,
      "electorate": 1064,
      "turnout_pct": 79.9,
      "lead_party": "TDP",
      "margin": 99,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 15804,
      "name": "Parigi",
      "booths": 25,
      "electorate": 21467,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 5675,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15805,
      "name": "Gorantla",
      "booths": 25,
      "electorate": 21467,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 6677,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    }
  ],
  "159": [
    {
      "mandal_id": 15901,
      "name": "Puttaparthi",
      "booths": 114,
      "electorate": 105327,
      "turnout_pct": 81.1,
      "lead_party": "OTH",
      "margin": 58391,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 15902,
      "name": "Kothacheruvu",
      "booths": 25,
      "electorate": 23097,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 1839,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 15903,
      "name": "Bukkapatnam",
      "booths": 25,
      "electorate": 23097,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 1489,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 15904,
      "name": "O.D. Cheruvu",
      "booths": 25,
      "electorate": 23098,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 1752,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 15905,
      "name": "Amadagur",
      "booths": 25,
      "electorate": 23098,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 2014,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "LEAN"
    }
  ],
  "160": [
    {
      "mandal_id": 16001,
      "name": "Dharmavaram",
      "booths": 1,
      "electorate": 1000,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 980,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 16002,
      "name": "Bathalapalle",
      "booths": 1,
      "electorate": 1000,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 793,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 16003,
      "name": "Tadimarri",
      "booths": 2,
      "electorate": 1888,
      "turnout_pct": 72.1,
      "lead_party": "OTH",
      "margin": 3403,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16004,
      "name": "Mudigubba",
      "booths": 1,
      "electorate": 1000,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 1073,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 19.0,
      "status": "BATTLEGROUND"
    }
  ],
  "161": [
    {
      "mandal_id": 16101,
      "name": "Kadiri",
      "booths": 2,
      "electorate": 1775,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 887,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 16102,
      "name": "Talupula",
      "booths": 4,
      "electorate": 3552,
      "turnout_pct": 82.8,
      "lead_party": "OTH",
      "margin": 8083,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16103,
      "name": "Nambulapulakunta",
      "booths": 2,
      "electorate": 1775,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 1200,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 16104,
      "name": "Gandlapenta",
      "booths": 1,
      "electorate": 1000,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 991,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 16105,
      "name": "Nallacheruvu",
      "booths": 1,
      "electorate": 1000,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 1148,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 16106,
      "name": "Tanakal",
      "booths": 1,
      "electorate": 1000,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 939,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "BATTLEGROUND"
    }
  ],
  "162": [
    {
      "mandal_id": 16201,
      "name": "Thamballapalle",
      "booths": 25,
      "electorate": 21498,
      "turnout_pct": 75.0,
      "lead_party": "YSRCP",
      "margin": 3569,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 16202,
      "name": "Peddamandyam",
      "booths": 25,
      "electorate": 21498,
      "turnout_pct": 75.0,
      "lead_party": "YSRCP",
      "margin": 4954,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16203,
      "name": "Kurabalakota",
      "booths": 25,
      "electorate": 21498,
      "turnout_pct": 75.0,
      "lead_party": "YSRCP",
      "margin": 3703,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 16204,
      "name": "B.Kothakota",
      "booths": 25,
      "electorate": 21498,
      "turnout_pct": 75.0,
      "lead_party": "YSRCP",
      "margin": 2529,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 16205,
      "name": "PTM",
      "booths": 25,
      "electorate": 21498,
      "turnout_pct": 75.0,
      "lead_party": "YSRCP",
      "margin": 1434,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 16206,
      "name": "Mulakalacheruvu",
      "booths": 114,
      "electorate": 98031,
      "turnout_pct": 91.9,
      "lead_party": "YSRCP",
      "margin": 17724,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    }
  ],
  "163": [
    {
      "mandal_id": 16301,
      "name": "Pileru",
      "booths": 9,
      "electorate": 8355,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 58,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 16302,
      "name": "Gurramkonda",
      "booths": 16,
      "electorate": 14854,
      "turnout_pct": 78.7,
      "lead_party": "TDP",
      "margin": 3145,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 16303,
      "name": "Kalakada",
      "booths": 3,
      "electorate": 2730,
      "turnout_pct": 79.3,
      "lead_party": "YSRCP",
      "margin": 8,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 16304,
      "name": "K.V. Palle",
      "booths": 6,
      "electorate": 5570,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 4514,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    },
    {
      "mandal_id": 16305,
      "name": "Valmikipuram",
      "booths": 5,
      "electorate": 4641,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 5267,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 15.6,
      "status": "LEAN"
    }
  ],
  "164": [
    {
      "mandal_id": 16401,
      "name": "Madanapalle",
      "booths": 12,
      "electorate": 11541,
      "turnout_pct": 72.4,
      "lead_party": "YSRCP",
      "margin": 54,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 16402,
      "name": "Nimmanapalle",
      "booths": 5,
      "electorate": 4808,
      "turnout_pct": 75.0,
      "lead_party": "YSRCP",
      "margin": 73,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 16403,
      "name": "Ramasamudram",
      "booths": 4,
      "electorate": 3847,
      "turnout_pct": 75.0,
      "lead_party": "YSRCP",
      "margin": 355,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    }
  ],
  "165": [
    {
      "mandal_id": 16501,
      "name": "Punganur",
      "booths": 33,
      "electorate": 30382,
      "turnout_pct": 89.9,
      "lead_party": "OTH",
      "margin": 38300,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16502,
      "name": "Chowdepalle",
      "booths": 15,
      "electorate": 14308,
      "turnout_pct": 78.1,
      "lead_party": "OTH",
      "margin": 9146,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16503,
      "name": "Somala",
      "booths": 19,
      "electorate": 17491,
      "turnout_pct": 75.0,
      "lead_party": "YSRCP",
      "margin": 1279,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 16504,
      "name": "Sodum",
      "booths": 14,
      "electorate": 12888,
      "turnout_pct": 75.0,
      "lead_party": "YSRCP",
      "margin": 1036,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 16505,
      "name": "Pulicherla",
      "booths": 11,
      "electorate": 10127,
      "turnout_pct": 75.0,
      "lead_party": "YSRCP",
      "margin": 1219,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "BATTLEGROUND"
    }
  ],
  "166": [
    {
      "mandal_id": 16601,
      "name": "Chandragiri",
      "booths": 25,
      "electorate": 21950,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 13120,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16602,
      "name": "Tirupati Rural",
      "booths": 25,
      "electorate": 21950,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 12287,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16603,
      "name": "Ramachandrapuram",
      "booths": 25,
      "electorate": 21950,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 12440,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16604,
      "name": "Chinnagottigallu",
      "booths": 25,
      "electorate": 21950,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 12646,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16605,
      "name": "Yerravaripalem",
      "booths": 456,
      "electorate": 400375,
      "turnout_pct": 75.9,
      "lead_party": "TDP",
      "margin": 76068,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16606,
      "name": "Pakala",
      "booths": 25,
      "electorate": 21950,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 12618,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    }
  ],
  "167": [
    {
      "mandal_id": 16701,
      "name": "Tirupati Urban",
      "booths": 214,
      "electorate": 196528,
      "turnout_pct": 64.2,
      "lead_party": "OTH",
      "margin": 117783,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16702,
      "name": "Alipiri",
      "booths": 25,
      "electorate": 22958,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 17554,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16703,
      "name": "Tirumala",
      "booths": 25,
      "electorate": 22958,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 20652,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    }
  ],
  "168": [
    {
      "mandal_id": 16801,
      "name": "Srikalahasti",
      "booths": 24,
      "electorate": 21904,
      "turnout_pct": 74.0,
      "lead_party": "TDP",
      "margin": 7864,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16802,
      "name": "Yerpedu",
      "booths": 14,
      "electorate": 12776,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 2217,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16803,
      "name": "Thottambedu",
      "booths": 10,
      "electorate": 9126,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 1255,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "LEAN"
    },
    {
      "mandal_id": 16804,
      "name": "Renigunta",
      "booths": 8,
      "electorate": 7301,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 2584,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 14.4,
      "status": "STRONGHOLD"
    }
  ],
  "169": [
    {
      "mandal_id": 16901,
      "name": "Satyavedu",
      "booths": 8,
      "electorate": 7527,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 623,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 16902,
      "name": "Varadaiahpalem",
      "booths": 6,
      "electorate": 5646,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 716,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 16903,
      "name": "B.N. Kandriga",
      "booths": 9,
      "electorate": 8469,
      "turnout_pct": 77.7,
      "lead_party": "OTH",
      "margin": 7957,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 16904,
      "name": "K.V.B. Puram",
      "booths": 4,
      "electorate": 3764,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 685,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 16905,
      "name": "Pichatur",
      "booths": 3,
      "electorate": 2823,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 560,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 16906,
      "name": "Nagalapuram",
      "booths": 2,
      "electorate": 1882,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 654,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "BATTLEGROUND"
    }
  ],
  "170": [
    {
      "mandal_id": 17001,
      "name": "Nagari",
      "booths": 3,
      "electorate": 2688,
      "turnout_pct": 75.0,
      "lead_party": "OTH",
      "margin": 1164,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17002,
      "name": "Nindra",
      "booths": 2,
      "electorate": 1792,
      "turnout_pct": 75.0,
      "lead_party": "OTH",
      "margin": 853,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17003,
      "name": "Vijayapuram",
      "booths": 2,
      "electorate": 1792,
      "turnout_pct": 75.0,
      "lead_party": "OTH",
      "margin": 1891,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17004,
      "name": "Puttur",
      "booths": 1,
      "electorate": 1000,
      "turnout_pct": 75.0,
      "lead_party": "OTH",
      "margin": 1037,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17005,
      "name": "Vadamalapeta",
      "booths": 6,
      "electorate": 5379,
      "turnout_pct": 86.4,
      "lead_party": "OTH",
      "margin": 5933,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "STRONGHOLD"
    }
  ],
  "171": [
    {
      "mandal_id": 17101,
      "name": "Gangadhara Nellore",
      "booths": 85,
      "electorate": 78619,
      "turnout_pct": 78.7,
      "lead_party": "TDP",
      "margin": 45960,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17102,
      "name": "Penumur",
      "booths": 25,
      "electorate": 23122,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 4768,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17103,
      "name": "Vedurukuppam",
      "booths": 25,
      "electorate": 23122,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 3901,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17104,
      "name": "Karvetinagar",
      "booths": 25,
      "electorate": 23122,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 4551,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17105,
      "name": "S.R. Puram",
      "booths": 25,
      "electorate": 23122,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 3684,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17106,
      "name": "Palasamudram",
      "booths": 25,
      "electorate": 23123,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 4335,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "STRONGHOLD"
    }
  ],
  "172": [
    {
      "mandal_id": 17201,
      "name": "Chittoor Urban",
      "booths": 137,
      "electorate": 126361,
      "turnout_pct": 79.2,
      "lead_party": "TDP",
      "margin": 18407,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17202,
      "name": "Chittoor Rural",
      "booths": 25,
      "electorate": 23058,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 4381,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17203,
      "name": "Gudipala",
      "booths": 25,
      "electorate": 23058,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 5111,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    }
  ],
  "173": [
    {
      "mandal_id": 17301,
      "name": "Puthalapattu",
      "booths": 119,
      "electorate": 110386,
      "turnout_pct": 82.0,
      "lead_party": "TDP",
      "margin": 8128,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "BATTLEGROUND"
    },
    {
      "mandal_id": 17302,
      "name": "Irala",
      "booths": 25,
      "electorate": 23190,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 3283,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17303,
      "name": "Thavanampalle",
      "booths": 25,
      "electorate": 23190,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 2657,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17304,
      "name": "Bangarupalem",
      "booths": 25,
      "electorate": 23190,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 3126,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17305,
      "name": "Yadamarri",
      "booths": 25,
      "electorate": 23190,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 3595,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    }
  ],
  "174": [
    {
      "mandal_id": 17401,
      "name": "Palamaner",
      "booths": 128,
      "electorate": 116506,
      "turnout_pct": 80.2,
      "lead_party": "OTH",
      "margin": 8496,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17402,
      "name": "Bireddypalli",
      "booths": 25,
      "electorate": 22754,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 3420,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17403,
      "name": "V.Kota",
      "booths": 25,
      "electorate": 22754,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 4024,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17404,
      "name": "Peddapanjani",
      "booths": 25,
      "electorate": 22755,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 4628,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    },
    {
      "mandal_id": 17405,
      "name": "Gangavaram (Chittoor)",
      "booths": 25,
      "electorate": 22755,
      "turnout_pct": 75.0,
      "lead_party": "TDP",
      "margin": 3823,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 16.0,
      "status": "LEAN"
    }
  ],
  "175": [
    {
      "mandal_id": 17501,
      "name": "Kuppam",
      "booths": 122,
      "electorate": 111520,
      "turnout_pct": 86.1,
      "lead_party": "TDP",
      "margin": 25703,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17502,
      "name": "Shantipuram",
      "booths": 59,
      "electorate": 51341,
      "turnout_pct": 80.4,
      "lead_party": "TDP",
      "margin": 10134,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17503,
      "name": "Gudupalle",
      "booths": 50,
      "electorate": 44188,
      "turnout_pct": 67.6,
      "lead_party": "TDP",
      "margin": 5240,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "STRONGHOLD"
    },
    {
      "mandal_id": 17504,
      "name": "Ramakuppam",
      "booths": 63,
      "electorate": 55668,
      "turnout_pct": 78.6,
      "lead_party": "TDP",
      "margin": 8385,
      "dominant_caste": "BC Kuruba / Boya",
      "dominant_caste_pct": 17.9,
      "status": "STRONGHOLD"
    }
  ]
};
