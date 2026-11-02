import "dotenv/config";
import { connect, disconnect } from "./lib/db.js";
import { Shop } from "./models/Shop.js";
import { Pickup } from "./models/Pickup.js";
import { Batch } from "./models/Batch.js";
import { LabResult } from "./models/LabResult.js";
import { User } from "./models/User.js";

const shops = [
  ["HB-001", "Barako Brothers Grooming", "Ruel Santos", "Balanga · Poblacion", "Enrolled", ["Tue", "Fri"], 46.8, 12, true],
  ["HB-002", "Corte Manila Barbershop", "Jomar Dela Cruz", "Balanga · Cupang", "Enrolled", ["Mon", "Thu"], 38.2, 10, true],
  ["HB-003", "The Cutting Room", "Ana Villamor", "Balanga · Tuyo", "Enrolled", ["Wed"], 21.4, 6, false],
  ["HB-004", "Fade District", "Nikko Reyes", "Abucay · Poblacion", "Enrolled", ["Tue", "Sat"], 17.6, 5, true],
  ["HB-005", "Gupit ni Tatay", "Efren Bautista", "Samal · Poblacion", "Paused", ["Sat"], 6.2, 2, false],
  ["HB-006", "Sharp & Co.", "Migs Aquino", "Balanga · Ibayo", "Candidate", [], 0, 0, false],
  ["HB-007", "Bente Singko Barber Studio", "Dennis Ocampo", "Balanga · San Jose", "Candidate", [], 0, 0, false],
  ["HB-008", "Heneral Gupit", "Lito Marasigan", "Pilar · Poblacion", "Withdrawn", ["Thu"], 3.1, 1, false],
] as const;

async function seed() {
  await connect();
  console.log("[seed] connected");

  await Promise.all([
    Shop.deleteMany({}),
    Pickup.deleteMany({}),
    Batch.deleteMany({}),
    LabResult.deleteMany({}),
    User.deleteMany({}),
  ]);

  const created = [];
  for (const [code, name, contact, barangay, status, days, totalNetKg, pickupCount, inPilotArea] of shops) {
    created.push(
      await Shop.create({
        code,
        name,
        contact,
        mobile: `+63 917 ${String(1000000 + Math.floor(Math.random() * 8999999)).slice(0, 7)}`,
        barangay,
        status,
        inPilotArea,
        pickupRule: {
          frequency: days.length >= 2 ? "Twice weekly" : "Weekly",
          days: days.length ? [...days] : ["Tue", "Fri"],
          window: "After closing · 8–9 PM",
          access: "Ask for the contact person at the counter.",
          peakDay: code === "HB-002",
        },
        consent: { given: status !== "Candidate", on: new Date("2026-09-14"), explainedBy: "Staff visit", photoPermission: true },
        registeredBy: "R. Cepeda",
        totalNetKg,
        pickupCount,
      }),
    );
  }

  const byCode = new Map(created.map((s) => [s.code, s]));

  const pickupRows = [
    ["HB-001", 3, 6.42, "Clean", "No", "Collected"],
    ["HB-002", 4, 8.1, "Minor", "Unsure", "Collected"],
    ["HB-004", 2, 3.94, "Clean", "No", "Scheduled"],
    ["HB-003", 2, 4.1, "Clean", "No", "Weighed"],
    ["HB-001", 3, 5.7, "Mixed", "Yes", "Weighed"],
    ["HB-002", 0, 0, "Clean", "No", "Skipped"],
    ["HB-004", 2, 3.62, "Minor", "No", "Weighed"],
  ] as const;

  for (let i = 0; i < pickupRows.length; i++) {
    const [code, sacks, grossKg, grade, treated, status] = pickupRows[i];
    const shop = byCode.get(code)!;
    const tare = 0.18;
    await Pickup.create({
      code: `PK-${2418 - i}`,
      clientId: `seed-${i}`,
      shop: shop._id,
      shopCode: code,
      scheduledFor: new Date(Date.now() - i * 86400000),
      window: "8–9 PM",
      sacks,
      grossKg,
      tareKg: tare,
      netKg: Math.max(0, Number((grossKg - tare).toFixed(2))),
      grade,
      treated,
      status,
      collector: i % 2 ? "J. Ramos" : "R. Cepeda",
      acknowledged: status !== "Scheduled",
    });
  }

  const batchRows = [
    ["BATCH-2601", "Curing", 24.5, 15.2, 41.2, 31, 19],
    ["BATCH-2602", "Composting", 18.0, 14.1, 58.6, 54, 12],
    ["BATCH-2603", "Composting", 21.2, 18.4, 62.1, 61, 7],
    ["BATCH-2604", "Preparing", 12.6, 12.6, 28.4, 66, 2],
    ["BATCH-2512", "Approved", 22.0, 12.9, 29.0, 24, 45],
  ] as const;

  for (const [code, stage, inputKg, currentKg, temperature, moisture, days] of batchRows) {
    await Batch.create({
      code,
      operator: "M. Salazar",
      shopCodes: ["HB-001", "HB-002"],
      inputKg,
      currentKg,
      temperature,
      moisture,
      stage,
      startedOn: new Date(Date.now() - days * 86400000),
      stageHistory: [{ stage, at: new Date(), by: "M. Salazar", remark: "Seeded" }],
    });
  }

  await LabResult.create({
    code: "LR-0412",
    version: 1,
    batch: (await Batch.findOne({ code: "BATCH-2512" }))!._id,
    batchCode: "BATCH-2512",
    laboratory: "Central Luzon Soil Laboratory",
    n: 1.42,
    p: 0.86,
    k: 1.19,
    ph: 7.1,
    moisture: 24,
    maturity: "Mature",
    pathogens: "Absent",
    verdict: "Pass",
    enteredBy: "Researcher",
    reviewedBy: "Admin",
    reviewedAt: new Date(),
  });

  for (const [name, email, role] of [
    ["Ryan C. Domer", "ryandomer566@gmail.com", "Admin"],
    ["M. Salazar", "operator@hair2harvest.ph", "Operator"],
    ["J. Ramos", "staff@hair2harvest.ph", "Staff"],
  ] as const) {
    await User.create({ name, email, role, passwordHash: "seed-placeholder-bcrypt" });
  }

  console.log(`[seed] ${created.length} shops · ${pickupRows.length} pickups · ${batchRows.length} batches`);
  await disconnect();
}

seed().catch((error) => {
  console.error("[seed] failed", error);
  process.exit(1);
});
