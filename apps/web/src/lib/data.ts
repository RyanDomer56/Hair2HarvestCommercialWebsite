export type ShopStatus = "Candidate" | "Enrolled" | "Paused" | "Withdrawn";
export type Contamination = "Clean" | "Minor" | "Mixed";
export type TreatedFlag = "No" | "Yes" | "Unsure";
export type PickupStatus = "Scheduled" | "Collected" | "Weighed" | "Skipped" | "Rescheduled";
export type BatchStatus =
  | "Preparing"
  | "Composting"
  | "Curing"
  | "Sampling"
  | "Pending"
  | "On Hold"
  | "Rejected"
  | "Approved";

export type Shop = {
  code: string;
  name: string;
  barangay: string;
  contact: string;
  mobile: string;
  channel: "SMS" | "Messenger" | "Viber" | "Call";
  status: ShopStatus;
  inPilotArea: boolean;
  frequency: string;
  days: string[];
  window: string;
  access: string;
  peakDay: boolean;
  registeredOn: string;
  consentOn: string;
  photoPermission: boolean;
  totalKg: number;
  pickups: number;
};

export type Pickup = {
  id: string;
  code: string;
  shop: string;
  shopCode: string;
  date: string;
  window: string;
  sacks: number;
  grossKg: number;
  netKg: number;
  grade: Contamination;
  treated: TreatedFlag;
  status: PickupStatus;
  collector: string;
  acknowledged: boolean;
  note?: string;
};

export type Batch = {
  id: string;
  recipe: string;
  operator: string;
  startedOn: string;
  stage: BatchStatus;
  inputKg: number;
  currentKg: number;
  moisture: number;
  temperature: number;
  days: number;
  shopCodes: string[];
};

export type LabResult = {
  id: string;
  batch: string;
  lab: string;
  date: string;
  n: number;
  p: number;
  k: number;
  ph: number;
  moisture: number;
  maturity: string;
  pathogens: "Absent" | "Detected";
  verdict: "Pass" | "Review" | "Fail";
};

/* -------------------------------------------------------------- fixtures */

export const shops: Shop[] = [
  {
    code: "HB-001",
    name: "Barako Brothers Grooming",
    barangay: "Nova Proper",
    contact: "Ruel Santos",
    mobile: "+63 917 402 1188",
    channel: "SMS",
    status: "Enrolled",
    inPilotArea: true,
    frequency: "Twice weekly",
    days: ["Tue", "Fri"],
    window: "After closing · 8–9 PM",
    access: "Side door on Mabini. Ask for Ruel.",
    peakDay: true,
    registeredOn: "2026-09-14",
    consentOn: "2026-09-14",
    photoPermission: true,
    totalKg: 46.8,
    pickups: 12,
  },
  {
    code: "HB-002",
    name: "Corte Manila Barbershop",
    barangay: "Nova Proper",
    contact: "Jomar Dela Cruz",
    mobile: "+63 916 220 7741",
    channel: "Messenger",
    status: "Enrolled",
    inPilotArea: true,
    frequency: "Twice weekly",
    days: ["Mon", "Thu"],
    window: "After closing · 9–10 PM",
    access: "Mall loading dock, level B1. Guard has the sack.",
    peakDay: true,
    registeredOn: "2026-09-16",
    consentOn: "2026-09-16",
    photoPermission: true,
    totalKg: 38.2,
    pickups: 10,
  },
  {
    code: "HB-003",
    name: "The Cutting Room",
    barangay: "Nova Proper",
    contact: "Ana Villamor",
    mobile: "+63 927 118 3390",
    channel: "Viber",
    status: "Enrolled",
    inPilotArea: true,
    frequency: "Weekly",
    days: ["Wed"],
    window: "Midday · 11 AM–12 NN",
    access: "Front counter. Ana keeps the sack behind the mirror.",
    peakDay: false,
    registeredOn: "2026-09-21",
    consentOn: "2026-09-21",
    photoPermission: false,
    totalKg: 21.4,
    pickups: 6,
  },
  {
    code: "HB-004",
    name: "Fade District",
    barangay: "Nova Proper",
    contact: "Nikko Reyes",
    mobile: "+63 905 771 2264",
    channel: "SMS",
    status: "Enrolled",
    inPilotArea: true,
    frequency: "Twice weekly",
    days: ["Tue", "Sat"],
    window: "After closing · 8–9 PM",
    access: "Back alley entrance. Dog is friendly.",
    peakDay: true,
    registeredOn: "2026-10-02",
    consentOn: "2026-10-02",
    photoPermission: true,
    totalKg: 17.6,
    pickups: 5,
  },
  {
    code: "HB-005",
    name: "Gupit ni Tatay",
    barangay: "Nova Proper",
    contact: "Efren Bautista",
    mobile: "+63 918 664 0021",
    channel: "Call",
    status: "Paused",
    inPilotArea: false,
    frequency: "Weekly",
    days: ["Sat"],
    window: "Afternoon · 2–4 PM",
    access: "Closed for renovation until December.",
    peakDay: false,
    registeredOn: "2026-10-08",
    consentOn: "2026-10-08",
    photoPermission: true,
    totalKg: 6.2,
    pickups: 2,
  },
  {
    code: "HB-006",
    name: "Sharp & Co.",
    barangay: "Nova Proper",
    contact: "Migs Aquino",
    mobile: "+63 939 220 1187",
    channel: "Messenger",
    status: "Candidate",
    inPilotArea: true,
    frequency: "Twice weekly",
    days: ["—"],
    window: "To confirm on first visit",
    access: "Not yet visited.",
    peakDay: false,
    registeredOn: "2026-10-27",
    consentOn: "—",
    photoPermission: false,
    totalKg: 0,
    pickups: 0,
  },
  {
    code: "HB-007",
    name: "Bente Singko Barber Studio",
    barangay: "Nova Proper",
    contact: "Dennis Ocampo",
    mobile: "+63 917 883 5512",
    channel: "SMS",
    status: "Candidate",
    inPilotArea: true,
    frequency: "Twice weekly",
    days: ["—"],
    window: "To confirm on first visit",
    access: "Not yet visited.",
    peakDay: false,
    registeredOn: "2026-10-27",
    consentOn: "—",
    photoPermission: false,
    totalKg: 0,
    pickups: 0,
  },
  {
    code: "HB-008",
    name: "Heneral Gupit",
    barangay: "Nova Proper",
    contact: "Lito Marasigan",
    mobile: "+63 921 447 0093",
    channel: "Viber",
    status: "Withdrawn",
    inPilotArea: false,
    frequency: "Weekly",
    days: ["Thu"],
    window: "After closing · 7–8 PM",
    access: "Owner declined after trial month.",
    peakDay: false,
    registeredOn: "2026-09-29",
    consentOn: "2026-09-29",
    photoPermission: false,
    totalKg: 3.1,
    pickups: 1,
  },
];

export const pickups: Pickup[] = [
  {
    id: "p1",
    code: "PK-2418",
    shop: "Barako Brothers Grooming",
    shopCode: "HB-001",
    date: "2026-11-02",
    window: "8–9 PM",
    sacks: 3,
    grossKg: 6.42,
    netKg: 5.88,
    grade: "Clean",
    treated: "No",
    status: "Collected",
    collector: "R. Cepeda",
    acknowledged: true,
  },
  {
    id: "p2",
    code: "PK-2417",
    shop: "Corte Manila Barbershop",
    shopCode: "HB-002",
    date: "2026-11-02",
    window: "9–10 PM",
    sacks: 4,
    grossKg: 8.1,
    netKg: 7.38,
    grade: "Minor",
    treated: "Unsure",
    status: "Collected",
    collector: "R. Cepeda",
    acknowledged: true,
    note: "Some tissue in sack two. Coaching note left.",
  },
  {
    id: "p3",
    code: "PK-2416",
    shop: "Fade District",
    shopCode: "HB-004",
    date: "2026-11-02",
    window: "8–9 PM",
    sacks: 2,
    grossKg: 3.94,
    netKg: 3.58,
    grade: "Clean",
    treated: "No",
    status: "Scheduled",
    collector: "J. Ramos",
    acknowledged: false,
  },
  {
    id: "p4",
    code: "PK-2415",
    shop: "The Cutting Room",
    shopCode: "HB-003",
    date: "2026-11-01",
    window: "11 AM–12 NN",
    sacks: 2,
    grossKg: 4.1,
    netKg: 3.74,
    grade: "Clean",
    treated: "No",
    status: "Weighed",
    collector: "J. Ramos",
    acknowledged: true,
  },
  {
    id: "p5",
    code: "PK-2414",
    shop: "Barako Brothers Grooming",
    shopCode: "HB-001",
    date: "2026-10-30",
    window: "8–9 PM",
    sacks: 3,
    grossKg: 5.7,
    netKg: 5.16,
    grade: "Mixed",
    treated: "Yes",
    status: "Weighed",
    collector: "R. Cepeda",
    acknowledged: true,
    note: "Plastic sachets mixed in. Held on treated line.",
  },
  {
    id: "p6",
    code: "PK-2413",
    shop: "Corte Manila Barbershop",
    shopCode: "HB-002",
    date: "2026-10-29",
    window: "9–10 PM",
    sacks: 0,
    grossKg: 0,
    netKg: 0,
    grade: "Clean",
    treated: "No",
    status: "Skipped",
    collector: "R. Cepeda",
    acknowledged: true,
    note: "Shop closed for a private event.",
  },
  {
    id: "p7",
    code: "PK-2412",
    shop: "Fade District",
    shopCode: "HB-004",
    date: "2026-10-27",
    window: "8–9 PM",
    sacks: 2,
    grossKg: 3.62,
    netKg: 3.26,
    grade: "Minor",
    treated: "No",
    status: "Weighed",
    collector: "J. Ramos",
    acknowledged: true,
  },
];

export const batches: Batch[] = [
  {
    id: "BATCH-2601",
    recipe: "v3.2 · hair 40 / carbon 35 / greens 25",
    operator: "M. Salazar",
    startedOn: "2026-10-14",
    stage: "Curing",
    inputKg: 24.5,
    currentKg: 15.2,
    moisture: 31,
    temperature: 41.2,
    days: 19,
    shopCodes: ["HB-001", "HB-002"],
  },
  {
    id: "BATCH-2602",
    recipe: "v3.2 · hair 40 / carbon 35 / greens 25",
    operator: "M. Salazar",
    startedOn: "2026-10-21",
    stage: "Composting",
    inputKg: 18.0,
    currentKg: 14.1,
    moisture: 54,
    temperature: 58.6,
    days: 12,
    shopCodes: ["HB-001", "HB-004"],
  },
  {
    id: "BATCH-2603",
    recipe: "v3.3 · hair 45 / carbon 30 / greens 25",
    operator: "M. Salazar",
    startedOn: "2026-10-26",
    stage: "Composting",
    inputKg: 21.2,
    currentKg: 18.4,
    moisture: 61,
    temperature: 62.1,
    days: 7,
    shopCodes: ["HB-002", "HB-003"],
  },
  {
    id: "BATCH-2604",
    recipe: "v3.3 · hair 45 / carbon 30 / greens 25",
    operator: "M. Salazar",
    startedOn: "2026-10-31",
    stage: "Preparing",
    inputKg: 12.6,
    currentKg: 12.6,
    moisture: 66,
    temperature: 28.4,
    days: 2,
    shopCodes: ["HB-004"],
  },
  {
    id: "BATCH-2512",
    recipe: "v3.1 · hair 35 / carbon 40 / greens 25",
    operator: "M. Salazar",
    startedOn: "2026-09-18",
    stage: "Approved",
    inputKg: 22.0,
    currentKg: 12.9,
    moisture: 24,
    temperature: 29.0,
    days: 45,
    shopCodes: ["HB-001"],
  },
];

export const labResults: LabResult[] = [
  {
    id: "LR-0412",
    batch: "BATCH-2512",
    lab: "Central Luzon Soil Laboratory",
    date: "2026-10-30",
    n: 1.42,
    p: 0.86,
    k: 1.19,
    ph: 7.1,
    moisture: 24,
    maturity: "Mature",
    pathogens: "Absent",
    verdict: "Pass",
  },
  {
    id: "LR-0411",
    batch: "BATCH-2601",
    lab: "Central Luzon Soil Laboratory",
    date: "2026-10-28",
    n: 1.18,
    p: 0.74,
    k: 1.02,
    ph: 6.8,
    moisture: 31,
    maturity: "Mature",
    pathogens: "Absent",
    verdict: "Pass",
  },
  {
    id: "LR-0410",
    batch: "BATCH-2602",
    lab: "Central Luzon Soil Laboratory",
    date: "2026-10-26",
    n: 0.94,
    p: 0.61,
    k: 0.88,
    ph: 6.4,
    moisture: 54,
    maturity: "Immature",
    pathogens: "Absent",
    verdict: "Review",
  },
  {
    id: "LR-0409",
    batch: "BATCH-2512",
    lab: "Bureau of Soils (re-test)",
    date: "2026-10-18",
    n: 1.31,
    p: 0.81,
    k: 1.11,
    ph: 7.0,
    moisture: 26,
    maturity: "Mature",
    pathogens: "Absent",
    verdict: "Pass",
  },
];

/* ------------------------------------------------------------ aggregates */

export const collectionSeries = [
  { label: "Wk 36", kg: 18.4, month: "Sep" },
  { label: "Wk 37", kg: 22.1, month: "Sep" },
  { label: "Wk 38", kg: 26.8, month: "Sep" },
  { label: "Wk 39", kg: 24.2, month: "Sep" },
  { label: "Wk 40", kg: 31.6, month: "Oct" },
  { label: "Wk 41", kg: 29.4, month: "Oct" },
  { label: "Wk 42", kg: 35.8, month: "Oct" },
  { label: "Wk 43", kg: 38.2, month: "Oct" },
  { label: "Wk 44", kg: 41.7, month: "Nov" },
  { label: "Wk 45", kg: 44.6, month: "Nov" },
];

export const gradeMix = [
  { label: "Clean", value: 62, tone: "moss" as const },
  { label: "Minor", value: 27, tone: "clay" as const },
  { label: "Mixed", value: 11, tone: "rust" as const },
];

export const overviewStats = {
  suppliers: shops.filter((s) => s.status === "Enrolled").length,
  suppliersDelta: 2,
  pickupsDue: pickups.filter((p) => p.status === "Scheduled").length,
  pickupsOverdue: 1,
  activeBatches: batches.filter((b) => b.stage !== "Approved" && b.stage !== "Rejected").length,
  awaitingQc: 2,
  approvedMaterials: 134,
  approvedDelta: 9,
  machineRunning: 5,
  machineTotal: 6,
  experimentProgress: 68,
  experimentRuns: 4,
  experimentTotal: 6,
  totalKg: shops.reduce((sum, s) => sum + s.totalKg, 0),
};
