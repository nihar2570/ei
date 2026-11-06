// Andhra Pradesh Strategic Simulation Models & Political Parameters

export interface CoalitionSettings {
  tdpToJspTransferPct: number; // e.g. 85% TDP cadre transfer to JSP candidates in JSP-allotted ACs
  jspToTdpTransferPct: number; // e.g. 80% JSP cadre transfer to TDP candidates in TDP-allotted ACs
  ndaToBjpTransferPct: number; // e.g. 75% NDA alliance transfer in BJP-allotted ACs
  rebelLeakagePct: number;     // e.g. 12% disgruntled cadre who rebel and vote for YSRCP opposition
}

export const DEFAULT_COALITION_SETTINGS: CoalitionSettings = {
  tdpToJspTransferPct: 85,
  jspToTdpTransferPct: 80,
  ndaToBjpTransferPct: 75,
  rebelLeakagePct: 12,
};

export interface MlaFatigueSettings {
  replaceIncumbentPct: number;     // 0 to 50 sitting MLAs dropped for fresh faces
  unpopularMlaPenalty: number;     // -8% to 0% fatigue penalty if retained
  freshFaceBoost: number;          // 0% to +8% brand recovery if new face nominated
  targetParty: 'TDP' | 'YSRCP' | 'JSP'; // Party applying ticket distribution surgery
}

export const DEFAULT_MLA_FATIGUE_SETTINGS: MlaFatigueSettings = {
  replaceIncumbentPct: 0,
  unpopularMlaPenalty: -4.5,
  freshFaceBoost: 4.0,
  targetParty: 'TDP',
};

// Andhra Pradesh 26 Reorganized Districts across 3 Key Geographic Zones
export const UTTARANDHRA_DISTRICTS = new Set([
  'Srikakulam',
  'Vizianagaram',
  'Parvathipuram Manyam',
  'Alluri Sitharama Raju',
  'Visakhapatnam',
  'Anakapalli',
]);

export const KOSTA_ANDHRA_DISTRICTS = new Set([
  'Kakinada',
  'Dr. B.R. Ambedkar Konaseema',
  'East Godavari',
  'West Godavari',
  'Eluru',
  'Krishna',
  'NTR',
  'Guntur',
  'Bapatla',
  'Palnadu',
  'Prakasam',
  'Sri Potti Sriramulu Nellore',
]);

export const RAYALASEEMA_DISTRICTS = new Set([
  'Tirupati',
  'Chittoor',
  'Annamayya',
  'YSR Kadapa',
  'Sri Sathya Sai',
  'Anantapur',
  'Kurnool',
  'Nandyal',
]);

export interface GroundCrisisSettings {
  amaravatiPaceSlowdown: number;          // 0% to 10% swing penalty in Guntur, NTR, Krishna capital region
  superSixFiscalFriction: number;         // 0% to 8% rural welfare delivery delay penalty
  vizagSteelPlantBacklash: number;        // 0% to 10% industrial penalty across Visakhapatnam & Anakapalli
  redBookPolarization: number;            // 0% to 8% law & order / vendetta perception penalty in factional seats
  tdpJspCadreClash: number;               // 0% to 8% friction penalty between TDP and Janasena grassroots
  rayalaseemaWaterGrievance: number;      // 0% to 8% agrarian drought & irrigation penalty in Rayalaseema
  tirupatiPrasadamControversy: number;    // 0% to 8% NDA Hindu devotional consolidation in Tirupati, Chittoor & pilgrim corridors
  polavaramDisplacementAgitation: number; // 0% to 8% NDA penalty in Godavari & Agency tribal resettlement belts
  aquaFarmerPowerTariffCrisis: number;    // 0% to 8% NDA penalty in coastal aquaculture hatcheries & processing belt
  cropInsuranceFarmerDistress: number;    // 0% to 8% NDA agrarian distress penalty across rainfed farming mandals
  liquorPolicyRetailDisruption: number;   // 0% to 8% NDA penalty among rural women / SHG DWCRA voter segments
  govtEmployeePensionDiscontent: number;  // 0% to 8% NDA penalty among govt employees and teachers over GPS/CPS pension arrears
}

export const DEFAULT_GROUND_CRISIS_SETTINGS: GroundCrisisSettings = {
  amaravatiPaceSlowdown: 0,
  superSixFiscalFriction: 0,
  vizagSteelPlantBacklash: 0,
  redBookPolarization: 0,
  tdpJspCadreClash: 0,
  rayalaseemaWaterGrievance: 0,
  tirupatiPrasadamControversy: 0,
  polavaramDisplacementAgitation: 0,
  aquaFarmerPowerTariffCrisis: 0,
  cropInsuranceFarmerDistress: 0,
  liquorPolicyRetailDisruption: 0,
  govtEmployeePensionDiscontent: 0,
};

// 13 ACs in the Visakhapatnam & Anakapalli Urban Industrial & Steel Plant Belt
export const VIZAG_STEEL_PLANT_AC_NOS = new Set([
  20, // Bheemili
  21, // Visakhapatnam East
  22, // Visakhapatnam South
  23, // Visakhapatnam North
  24, // Visakhapatnam West
  25, // Gajuwaka (Steel Plant core)
  30, // Anakapalle
  31, // Pendurthi
  32, // Elamanchili
  33, // Payakaraopet
  34, // Narsipatnam
  35, // Tuni
  36, // Prathipadu
]);

// 12 ACs in Amaravati Capital Region (Guntur, NTR, Krishna)
export const AMARAVATI_CORE_AC_NOS = new Set([
  71, // Gannavaram (Krishna)
  78, // Penamaluru
  79, // Vijayawada West
  80, // Vijayawada Central
  81, // Vijayawada East
  82, // Mylavaram
  86, // Tadikonda (Amaravati core)
  87, // Mangalagiri (Amaravati core)
  88, // Ponnur
  91, // Tenali
  94, // Guntur West
  95, // Guntur East
]);

// 16 ACs in Temple & Pilgrim Hubs (Tirupati, Chittoor, Srisailam, Mantralayam, Rajampet, Allagadda)
export const TEMPLE_BELT_AC_NOS = new Set([
  167, // Tirupati (TTD Core)
  166, // Chandragiri (Tirumala Foothills)
  168, // Srikalahasti (Vayu Lingam)
  169, // Satyavedu
  170, // Nagari
  171, // Gangadhara Nellore
  172, // Chittoor
  173, // Puthalapattu
  174, // Palamaner
  175, // Kuppam
  165, // Punganur (Chittoor - critical battleground)
  125, // Rajampet (Tallapaka Annamacharya & Kodandarama Swamy)
  135, // Srisailam (Mallikarjuna Jyotirlinga)
  145, // Mantralayam (Guru Raghavendra Swamy Kshetram)
  134, // Allagadda (Ahobilam Narasimha Swamy)
  139, // Nandyal (Mahanandi temple hub)
]);

// 6 ACs in Polavaram Agency & Tribal Resettlement Belts
export const POLAVARAM_AGENCY_AC_NOS = new Set([
  10, // Palakonda
  11, // Kurupam
  28, // Araku Valley
  29, // Paderu
  53, // Rampachodavaram
  67, // Polavaram
]);

// 12 ACs in Coastal Aquaculture & Marine Processing Belts
export const COASTAL_AQUA_AC_NOS = new Set([
  45, // Razole
  46, // Gannavaram (Konaseema)
  58, // Narasapuram
  59, // Bhimavaram
  60, // Undi
  74, // Pedana
  75, // Machilipatnam
  76, // Avanigadda
  89, // Vemuru
  90, // Repalle
  92, // Bapatla
  107, // Santhanuthalapadu / Chirala
]);

// 14 ACs with High Concentration of State Government Employees & Teachers
export const URBAN_GOVT_EMPLOYEE_AC_NOS = new Set([
  21, // Visakhapatnam East
  22, // Visakhapatnam South
  23, // Visakhapatnam North
  24, // Visakhapatnam West
  79, // Vijayawada West
  80, // Vijayawada Central
  81, // Vijayawada East
  94, // Guntur West
  95, // Guntur East
  117, // Nellore City
  126, // Kadapa
  137, // Kurnool
  153, // Anantapur Urban
  167, // Tirupati
]);

// 21 ACs Contested and Won by Janasena (JSP) in 2024
export const JSP_SEATS_2024 = new Set([
  10, // Palakonda (ST)
  17, // Nellimarla
  22, // Visakhapatnam South
  30, // Anakapalli
  31, // Pendurthi
  32, // Elamanchili
  37, // Pithapuram (Pawan Kalyan)
  38, // Kakinada Rural
  45, // Razole (SC)
  46, // Gannavaram (SC)
  49, // Rajanagaram
  55, // Nidadavole
  58, // Narasapuram
  59, // Bhimavaram
  62, // Tadepalligudem
  63, // Unguturu
  67, // Polavaram (ST)
  76, // Avanigadda
  91, // Tenali
  127, // Kodur (SC)
  167, // Tirupati
]);

// 10 ACs Contested by BJP in 2024 (won 8)
export const BJP_SEATS_2024 = new Set([
  7,   // Etcherla (Won)
  23,  // Visakhapatnam North (Won)
  28,  // Araku Valley (Runner-up to YSRCP)
  40,  // Anaparthy (Won)
  73,  // Kaikalur (Won)
  79,  // Vijayawada West (Won)
  124, // Badvel (Runner-up to YSRCP)
  131, // Jammalamadugu (Won)
  146, // Adoni (Won)
  160, // Dharmavaram (Won)
]);
