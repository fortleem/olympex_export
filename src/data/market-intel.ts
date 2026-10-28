/**
 * Egyptian market intelligence — the knowledge base that powers the
 * Market Intel page and grounds the AI Trade Copilot.
 *
 * Compiled 2026-10 from verified sources (PEI Trade, SIS/Ahram, ICC,
 * CBI, World Bank, SCA releases, ministry/terminal announcements);
 * refresh quarterly. Islamic holiday dates depend on lunar sighting.
 */

export interface Port {
  name: string;
  location: string;
  sea: "Mediterranean" | "Red Sea";
  type: string;
  note: string;
}

export const PORTS: Port[] = [
  {
    name: "Alexandria",
    location: "Alexandria governorate",
    sea: "Mediterranean",
    type: "Egypt's largest general-cargo & container hub",
    note: "Historic main gateway with strong multi-purpose handling and reefer services.",
  },
  {
    name: "El Dekheila",
    location: "Western Alexandria",
    sea: "Mediterranean",
    type: "Container terminal (AICT)",
    note: "One of the four ports handling almost all fresh & frozen produce exports; good reefer-plug capacity.",
  },
  {
    name: "Damietta",
    location: "Damietta governorate, NE Delta",
    sea: "Mediterranean",
    type: "Container-focused transhipment port",
    note: "Handles the largest volume of Egypt's reefer container exports — tens of thousands of reefer TEUs every season; terminal expansion adding 12 quay cranes.",
  },
  {
    name: "Port Said (East/West)",
    location: "Northern Suez Canal entrance",
    sea: "Mediterranean",
    type: "Container terminal (SCCT, East)",
    note: "Line-haul container hub at the canal mouth — efficient for transhipment routings.",
  },
  {
    name: "Ain Sokhna",
    location: "Suez governorate, Gulf of Suez (SCZone)",
    sea: "Red Sea",
    type: "Deep-sea container terminal (Hutchison)",
    note: "Closest deep-sea port to Cairo; commercial ops since Jan 2026 — best for Asia & Gulf routings.",
  },
];

export interface Holiday {
  date: string;
  name: string;
  impact: string;
  fixed: boolean;
}

/**
 * Egyptian public holidays 2026 relevant to export operations.
 * Islamic dates are astronomical estimates and shift with lunar sighting.
 */
export const HOLIDAYS_2026: Holiday[] = [
  { date: "Wed 7 Jan", name: "Coptic Christmas", impact: "Authorities/banks closed 1 day", fixed: true },
  { date: "Sun 25 Jan", name: "Revolution Day / Police Day", impact: "Authorities/banks closed 1 day", fixed: true },
  { date: "Thu 19 – Mon 23 Mar", name: "Eid al-Fitr", impact: "Multi-day port/customs closures (cabinet decree)", fixed: false },
  { date: "Mon 13 Apr", name: "Sham Ennessim (Coptic Easter Monday)", impact: "Public holiday, 1 day", fixed: true },
  { date: "Sat 25 Apr", name: "Sinai Liberation Day", impact: "Authorities/banks closed 1 day", fixed: true },
  { date: "Fri 1 May", name: "Labour Day", impact: "Authorities/banks closed 1 day", fixed: true },
  { date: "Tue 26 – Thu 28 May", name: "Eid al-Adha (est.)", impact: "Multi-day closures expected (Arafat Day + Eid)", fixed: false },
  { date: "Thu 18 Jun", name: "Islamic New Year (declared)", impact: "Authorities/banks closed 1 day", fixed: false },
  { date: "Thu 23 Jul", name: "July 23 Revolution Day", impact: "Authorities/banks closed 1 day", fixed: true },
  { date: "Tue 25 Aug", name: "Prophet's Birthday (Mawlid)", impact: "Authorities/banks closed 1 day", fixed: false },
  { date: "Tue 6 Oct", name: "Armed Forces Day", impact: "Authorities/banks closed 1 day", fixed: true },
];

export interface Incoterm {
  code: string;
  buyer: string;
  risk: string;
}

/** Incoterms 2020 — the buyer's plain-language view (ICC rules). */
export const INCOTERMS: Incoterm[] = [
  { code: "EXW", buyer: "You collect goods at the seller's premises and arrange everything else", risk: "At seller's premises, before loading" },
  { code: "FCA", buyer: "Seller hands export-cleared goods to your carrier at a named place", risk: "On handover to carrier" },
  { code: "FAS", buyer: "Sea only — goods placed alongside the vessel; you load and ship", risk: "Alongside ship at origin" },
  { code: "FOB", buyer: "Sea only — seller delivers on board; you pay freight onward", risk: "On board at origin port" },
  { code: "CFR", buyer: "Seller pays freight to your port, but risk is yours from loading", risk: "On board at origin port" },
  { code: "CIF", buyer: "CFR plus seller pays minimum marine insurance", risk: "On board at origin port" },
  { code: "CPT", buyer: "Seller pays carriage to a named destination; risk passes at first carrier", risk: "Handover to first carrier" },
  { code: "CIP", buyer: "CPT plus seller arranges insurance", risk: "Handover to first carrier" },
  { code: "DAP", buyer: "Seller delivers to your named place, ready for unloading", risk: "Before unloading at destination" },
  { code: "DPU", buyer: "The only rule where the seller unloads at destination", risk: "After unloading at destination" },
  { code: "DDP", buyer: "Seller bears everything, including import duties, to your door", risk: "At disposal at destination" },
];

export interface Certification {
  name: string;
  who: string;
  detail: string;
}

/** Certifications & protocols for Egyptian fresh produce export. */
export const CERTIFICATIONS: Certification[] = [
  { name: "GLOBALG.A.P. (GGN)", who: "EU retail baseline", detail: "Pre-farm-gate food-safety standard — EU supermarket chains require GGN-numbered lots on labels and traceability." },
  { name: "GRASP", who: "Social compliance", detail: "GLOBALG.A.P. add-on assessing labour practices in primary production; increasingly requested by EU buyers." },
  { name: "BRC / IFS", who: "Frozen & processed lines", detail: "GFSI-benchmarked food-safety standards for processing and packing — the right certificates for IQF programmes." },
  { name: "HACCP / ISO 22000", who: "Packhouses & processors", detail: "Food-safety management systems covering packhouse and processing facilities." },
  { name: "Phytosanitary certificate", who: "Every plant-origin consignment", detail: "Issued by Egypt's Central Administration of Plant Quarantine (Ministry of Agriculture) after inspection — the export 'passport'." },
  { name: "Traceability / lot codes", who: "EU labelling rules", detail: "Lot number for traceability (or GGN) plus producer/packer identity on every carton." },
  { name: "Cold treatment (citrus)", who: "Med-fly protocol markets", detail: "Mediterranean fruit fly drives cold-treatment schedules (typically ~1.1–2.2 °C pulp for 14–22 days, market-specific). Japan opened to Egyptian citrus in 2020; China accesses under a zero-tariff protocol; US access is pending USDA APHIS authorization." },
];

export interface ContextNote {
  title: string;
  detail: string;
}

/** Currency & logistics context for buyers planning Egyptian programmes. */
export const CONTEXT_NOTES: ContextNote[] = [
  {
    title: "Egyptian pound (EGP)",
    detail: "Managed float since March 2024; traded ≈ 47–50 EGP/USD through 2025, sliding toward ≈ 56 by late 2026. Quote EGP prices with a USD claw-back clause.",
  },
  {
    title: "Suez Canal & Red Sea",
    detail: "Canal revenue fell to $7.2B in FY2023/24 on Red Sea attacks and is recovering (IMF: ~$6.3B FY2025/26). Mediterranean sailings are unaffected; Asia-bound routings from Sokhna share the Red Sea risk calculus.",
  },
  {
    title: "Reefer equipment",
    detail: "The reefer container market remains under pressure from Red Sea disruptions, extended transits and carrier alliances — book equipment early for the citrus peak (November–January).",
  },
  {
    title: "Market access notes",
    detail: "Egypt is the world's #1 orange exporter (6 straight seasons) and #1 IQF strawberry exporter. EU potato imports run under strict brown-rot controls; dried-onion trade is volatile with state export bans.",
  },
];

/** Compact digest for grounding the AI copilot (kept under ~1.5k tokens). */
export const MARKET_INTEL_DIGEST = `
EGYPT EXPORT PORTS: Alexandria (largest hub, Mediterranean), El Dekheila (reefer plugs, Mediterranean), Damietta (largest reefer-container volume, Mediterranean), Port Said East (SCCT container hub at canal mouth), Ain Sokhna (closest deep-sea port to Cairo, Red Sea, best for Asia/Gulf).
EGYPT HOLIDAYS 2026 (multi-day closures matter): Eid al-Fitr Mar 19-23 (5 days, confirmed cabinet decree), Eid al-Adha est. May 26-28, Islamic New Year Jun 18, Prophet's Birthday Aug 25. One-day closures: Coptic Christmas Jan 7, Revolution Day Jan 25, Sham Ennessim Apr 13, Sinai Liberation Apr 25, Labour Day May 1, July 23 Revolution, Armed Forces Day Oct 6. Islamic dates shift with lunar sighting.
INCOTERMS 2020 (buyer view / risk transfer): EXW collect at premises / at premises; FCA export-cleared to your carrier / handover; FAS alongside vessel; FOB on board at origin; CFR seller pays freight, risk at origin; CIF CFR+insurance; CPT carriage paid, risk at first carrier; CIP +insurance; DAP delivered ready to unload; DPU seller unloads; DDP seller bears all incl. duties.
CERTIFICATIONS: GLOBALG.A.P. GGN (EU retail baseline), GRASP (social), BRC/IFS (frozen/processed), HACCP/ISO 22000 (packhouses), phytosanitary certificate from Egypt Plant Quarantine (every consignment), lot-code traceability, citrus cold treatment ~1.1-2.2C pulp 14-22 days for Med-fly protocol markets (Japan open since 2020, China zero-tariff protocol, US pending APHIS authorization).
CURRENCY/LOGISTICS: EGP managed float since Mar 2024 (~47-50/USD in 2025, ~56 late 2026) — use USD claw-back clauses; Suez revenue recovering from Red Sea disruption ($7.2B FY23/24 → ~$6.3B FY25/26); book reefers early for citrus peak Nov-Jan; Egypt is world #1 orange exporter (6 seasons) and #1 IQF strawberry exporter; EU potatoes under brown-rot controls; onion trade volatile with state bans.
`.trim();
