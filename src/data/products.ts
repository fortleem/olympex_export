/**
 * Olymp Ex product catalogue — Egyptian fresh & frozen (IQF) export lines.
 *
 * Seasonality (export availability months, 1 = January … 12 = December) and
 * cold-chain temperatures are compiled from Egyptian export-trade sources
 * and standard postharvest references (UC Davis produce fact sheets),
 * cross-checked against reefer setpoints used by Egyptian exporters.
 * Every line also carries its commercial subtypes (cultivars, colours or
 * grades), each with its own harvest/packing window and detail.
 * Commercial terms are confirmed per programme.
 *
 * Shape is intentionally flat so it can be swapped for an API/CMS later.
 */

export type ProductFormat = "fresh" | "frozen";
export type ProductCategory = "fruit" | "vegetable";

export interface FormatInfo {
  /** Export availability months (1 = Jan … 12 = Dec). */
  months: number[];
  /** Peak window display, e.g. "Dec – Feb". */
  peak?: string;
  /** Optimal storage/transport temperature, e.g. "0–2 °C". */
  tempC: string;
  /** Fahrenheit equivalent, e.g. "32–36 °F". */
  tempF: string;
  /** Reefer fresh-air exchange, e.g. "15–20 m³/h" — closed (0 m³/h) for frozen. */
  ventilation?: string;
  /** Relative humidity, e.g. "90–95%". */
  rh?: string;
  /** Practical shelf life at temperature, e.g. "5–10 days". */
  shelfLife?: string;
  /** Usual transport mode for this format. */
  transport?: string;
  /** Cold-chain caution, e.g. chilling sensitivity. */
  note?: string;
}

/** Egypt's standing in world trade for one product line. */
export interface TradeInfo {
  /** Annual export volume (all formats), display form, e.g. "≈ 1.8 million t". */
  volume: string;
  /** Reference season/year for the volume figure. */
  year: string;
  /** One-line world standing, e.g. "World's #1 orange exporter". */
  headline: string;
  /** Detailed share of world trade / context. */
  share: string;
  /** Biggest importers of Egyptian product, ordered by size. */
  topImporters: string[];
  /** Recommended maximum transit to avoid spoilage, per format. */
  transit: Partial<Record<ProductFormat, string>>;
}

/** A commercial subtype — cultivar, colour or grade — with its own season window. */
export interface Subtype {
  /** Name as traded, e.g. "Wonderful", "Golden / yellow", "Shoestring (7 mm)". */
  name: string;
  /** Harvest / packing window (1 = Jan … 12 = Dec). May extend beyond the
   *  format calendar for lines that ship from cold storage or frozen stock. */
  months: number[];
  /** Peak display, e.g. "Nov – Dec". */
  peak?: string;
  /** Short badge, e.g. "Earliest", "Main line", "Premium". */
  tag?: string;
  /** One-to-two-sentence commercial detail. */
  detail: string;
}

export interface Product {
  slug: string;
  name: string;
  latin?: string;
  category: ProductCategory;
  formats: ProductFormat[];
  /** Flagship lines surfaced on the homepage. */
  featured?: boolean;
  /** Egypt export-trade profile: volumes, world share, top markets, transit ceilings. */
  trade?: TradeInfo;
  /** Display seasonality, e.g. "Nov – Apr (fresh) · year-round (IQF)". */
  season: string;
  /** Main Egyptian growing regions. */
  regions: string;
  /** Commercial subtypes / cultivars, each with its own season window and detail. */
  subtypes: Subtype[];
  packaging: string[];
  summary: string;
  detail: string;
  /** Availability calendar + temperatures, per format. */
  calendar: Partial<Record<ProductFormat, FormatInfo>>;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Compact transit form for chips, e.g. "≤ 21–40 days at sea (protocol…)" → "≤ 21–40 days at sea". */
export function shortTransit(t: string): string {
  return t.split(" (")[0].split(" — ")[0];
}

/** Inclusive month range that wraps across the year end (11, 4) = Nov–Apr. */
export const monthRange = (start: number, end: number): number[] => {
  const out: number[] = [];
  let m = start;
  for (;;) {
    out.push(m);
    if (m === end) break;
    m = (m % 12) + 1;
  }
  return out;
};

export const YEAR_ROUND = monthRange(1, 12);

export const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const MONTH_LETTER = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"] as const;

/** Human label for a month list, e.g. [11,12,1,2] → "Nov – Dec, Jan – Feb". */
export function monthsLabel(months: number[]): string {
  if (months.length === 0) return "On request";
  if (months.length === 12) return "Year-round";
  const sorted = [...months].sort((a, b) => a - b);
  const runs: string[] = [];
  const push = (s: number, e: number) =>
    runs.push(s === e ? MONTH_SHORT[s - 1] : `${MONTH_SHORT[s - 1]} – ${MONTH_SHORT[e - 1]}`);
  let start = sorted[0];
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const m = sorted[i];
    if (m === prev + 1) {
      prev = m;
      continue;
    }
    push(start, prev);
    start = m;
    prev = m;
  }
  push(start, prev);
  return runs.join(", ");
}

/* ------------------------------------------------------------------ */
/* Catalogue — flagship lines first                                    */
/* ------------------------------------------------------------------ */

/**
 * Verified standing of Egypt's agricultural exports — the "by the numbers" band.
 * Compiled from CAPMAS/SIS releases, USDA FAS reports and WITS/OEC trade data
 * (2024–2025 seasons); ranges denote season volatility.
 */
export const EGYPT_TRADE_STATS = [
  {
    value: "9.5M t",
    label: "of agricultural exports in 2025",
    note: "A record $11.5 B — ≈ 24% of Egypt's total goods exports, reaching 167 countries.",
  },
  {
    value: "#1",
    label: "world orange exporter, six seasons running",
    note: "≈ 1.8 M t of oranges a season — ≈ 35–40% of global orange export volume.",
  },
  {
    value: "36%",
    label: "of world IQF-strawberry export value",
    note: "$697 M in 2025 — the single biggest line in world frozen-berry trade.",
  },
  {
    value: "917k t",
    label: "of fresh produce to Europe in 2024",
    note: "Europe's largest non-EU fresh-produce supplier.",
  },
  {
    value: "2.44M t",
    label: "of citrus in the 2025/26 season",
    note: "$1.34 B across oranges, mandarins, lemons and grapefruit.",
  },
  {
    value: "#4–5",
    label: "world potato exporter",
    note: "≈ 1 M t in 2024/25 — alongside #3 in dried onions and #2 in dried fava beans.",
  },
] as const;

export const products: Product[] = [
  {
    slug: "strawberries",
    name: "Strawberries",
    trade: {
      volume: "≈ 190,000 t frozen + ≈ 60,000 t fresh",
      year: "2024/25",
      headline: "World's #1 frozen-strawberry exporter",
      share:
        "≈ 36% of global frozen-strawberry export value in 2025 ($697 M) — the biggest single line in world IQF trade; fresh berries rank in the world top 10 by value.",
      topImporters: ["Germany", "USA", "UK", "Russia", "France", "Canada"],
      transit: {
        fresh: "≤ 7 days (air freight is the norm; ≤ 10 days by sea to the Gulf)",
        frozen: "≤ 90 days at −18 °C — no spoilage while the chain holds; 24-month total shelf life",
      },
    },
    latin: "Fragaria × ananassa",
    category: "fruit",
    formats: ["fresh", "frozen"],
    featured: true,
    season: "Nov – Apr (fresh) · year-round (IQF)",
    regions: "Beheira · Nubaria · Qalyubia",
    subtypes: [
      {
        name: "Sweet Charlie",
        months: monthRange(11, 1),
        peak: "Dec",
        tag: "Earliest",
        detail:
          "The opening variety of the Delta season — sweet, low-acid berries that start the air-freight programmes in November.",
      },
      {
        name: "Fortuna",
        months: monthRange(11, 2),
        peak: "Dec – Jan",
        tag: "Early",
        detail: "Large, glossy, light-red fruit — a fresh-market favourite for Gulf and European punnet programmes.",
      },
      {
        name: "Festival",
        months: monthRange(11, 4),
        peak: "Dec – Mar",
        tag: "Main line",
        detail:
          "The workhorse of Egyptian strawberries — roughly 95% of planted area — firm, deep-red berries that carry both the fresh trade and the entire IQF industry.",
      },
      {
        name: "Sensation",
        months: monthRange(12, 3),
        peak: "Jan",
        tag: "Mid",
        detail: "A newer Florida variety gaining area — large, firm berries through the heart of winter.",
      },
      {
        name: "Winter Dawn",
        months: monthRange(12, 2),
        peak: "Jan – Feb",
        tag: "Late winter",
        detail: "Compact, aromatic berries extending the fresh programme through the late-winter window.",
      },
    ],
    packaging: [
      "250 g / 500 g clamshell punnets",
      "2 kg / 5 kg fresh cartons",
      "IQF: 10 / 12.5 kg bulk cartons",
      "IQF retail: 250–500 g · 1 kg · 2.5 kg",
    ],
    summary:
      "Egypt is the world's #1 frozen-strawberry exporter — counter-seasonal winter berries for retail and the largest IQF processing platform in the sector.",
    detail:
      "Fresh berries are picked from the Delta's principal strawberry belts and pre-cooled within hours for air-freight programmes, landing in Europe exactly when local supply is zero. The same crop feeds Egypt's IQF industry — Festival accounts for ~95% of frozen volume — as whole calibrated and uncalibrated grades, slices, dices and purée, packed Nov–Mar and held at −18 °C for year-round supply.",
    calendar: {
      fresh: {
        months: monthRange(11, 4),
        peak: "Dec – Mar",
        tempC: "0–2 °C",
        tempF: "32–36 °F",
        ventilation: "15–20 m³/h",
        rh: "90–95%",
        shelfLife: "5–10 days",
        transport: "Air freight (primary) · reefer sea freight",
        note: "Pre-cool immediately after picking; mostly air freighted.",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Nov – Mar",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "24 months (best within 18)",
        transport: "Reefer sea freight at −18 °C",
        note: "Whole, sliced, diced and purée formats; calibrated and uncalibrated grades.",
      },
    },
  },
  {
    slug: "navel-oranges",
    name: "Navel Oranges",
    trade: {
      volume: "≈ 1.8 million t (all Egyptian oranges)",
      year: "2024/25 – 2025/26",
      headline: "World's #1 orange exporter — six consecutive seasons",
      share:
        "≈ 35–40% of global orange export volume (≈ $1.0 B); the record season shipped ≈ 1.93 M t.",
      topImporters: ["Netherlands", "Russia", "Saudi Arabia", "India", "UAE", "Bangladesh"],
      transit: {
        fresh: "≤ 21–40 days at sea (protocol cold treatment can extend beyond 40 days)",
      },
    },
    latin: "Citrus sinensis",
    category: "fruit",
    formats: ["fresh"],
    featured: true,
    season: "Nov – Apr",
    regions: "Nubaria · Beheira · Minufiya (Delta new lands)",
    subtypes: [
      {
        name: "Navelina",
        months: monthRange(11, 1),
        peak: "Nov – Dec",
        tag: "Earliest",
        detail: "The earliest navel — small-to-medium, deep-orange fruit that opens Egypt's citrus season in November.",
      },
      {
        name: "Thomson",
        months: monthRange(12, 2),
        peak: "Dec – Jan",
        tag: "Early-mid",
        detail: "Smooth, thin-skinned early navel — lighter in colour than Washington but first into the market.",
      },
      {
        name: "Washington Navel",
        months: monthRange(12, 3),
        peak: "Dec – Feb",
        tag: "Main line",
        detail:
          "The flagship export navel — large, seedless, easy-peeling fruit; the backbone of Egypt's record orange seasons.",
      },
      {
        name: "Cara Cara",
        months: monthRange(1, 2),
        peak: "Jan",
        tag: "Specialty",
        detail: "Pink-fleshed navel grown in small volumes for premium programmes.",
      },
    ],
    packaging: ["15 kg telescopic cartons", "8 / 10 kg bags (Gulf trade)", "Bulk bins"],
    summary: "The opening act of Egypt's flagship citrus season — the world's largest fresh-orange export programme.",
    detail:
      "Egypt ships around 1.8 million tonnes of oranges a year, and Navel opens the season: graded on calibre, colour and skin finish, packed in telescopic cartons and palletised for high-cube reefer loading (25–28 t per 40' container). Documentation and phytosanitary handling are coordinated per destination.",
    calendar: {
      fresh: {
        months: monthRange(11, 4),
        peak: "Dec – Feb",
        tempC: "5–8 °C",
        tempF: "41–46 °F",
        ventilation: "25–30 m³/h · closed during cold treatment",
        rh: "85–90%",
        shelfLife: "3–8 weeks",
        transport: "Reefer sea freight",
        note: "Some destinations require protocol cold treatment — confirm per market.",
      },
    },
  },
  {
    slug: "table-grapes",
    name: "Table Grapes",
    trade: {
      volume: "≈ 190,000 – 220,000 t",
      year: "2024/25",
      headline: "Top-5 world table-grape exporter",
      share:
        "≈ 5–8% of global export volume; USDA forecasts 220,000 t for the 2025/26 season.",
      topImporters: ["UK", "Netherlands", "Germany", "Russia", "Saudi Arabia", "UAE"],
      transit: {
        fresh: "≤ 28–42 days at sea with SO₂ pads",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Vitis vinifera",
    category: "fruit",
    formats: ["fresh", "frozen"],
    featured: true,
    season: "May – Aug (fresh) · year-round (IQF niche)",
    regions: "Beheira · Nubaria · Minya",
    subtypes: [
      {
        name: "Early Sweet",
        months: monthRange(5, 6),
        peak: "Mid-May – Jun",
        tag: "Earliest",
        detail: "Egypt's earliest grape — white seedless berries that land in Europe weeks before any Mediterranean competitor.",
      },
      {
        name: "Prime",
        months: monthRange(5, 6),
        peak: "Late May – Jun",
        tag: "Early",
        detail: "Early white seedless with compact bunches for the first punnet programmes.",
      },
      {
        name: "Superior Seedless",
        months: monthRange(6, 7),
        peak: "Jun",
        tag: "Main line",
        detail: "The dominant white seedless of the early window — crunchy, golden-green berries.",
      },
      {
        name: "Flame Seedless",
        months: monthRange(6, 7),
        peak: "Jun – Jul",
        tag: "Main line",
        detail: "Red seedless with a crunchy bite — the volume red of the early summer.",
      },
      {
        name: "Red Globe",
        months: monthRange(7, 8),
        peak: "Jul – Aug",
        tag: "Seeded",
        detail: "Large red seeded berries for markets that prize size — Russia, the Gulf and South-East Asia.",
      },
      {
        name: "Thompson Seedless",
        months: monthRange(7, 8),
        peak: "Jul",
        tag: "Classic",
        detail: "The classic light-green seedless — sweet, elongated bunches.",
      },
      {
        name: "Crimson Seedless",
        months: monthRange(7, 10),
        peak: "Aug – Sep",
        tag: "Late",
        detail:
          "The late-season flagship — crisp red berries that store for months and stretch shipments deep into autumn.",
      },
      {
        name: "Autumn Royal",
        months: monthRange(9, 10),
        peak: "Sep",
        tag: "Latest",
        detail: "Black seedless latecomer for the tail of the export season.",
      },
    ],
    packaging: ["4.5 / 5 kg export cartons", "8–9 kg boxes", "500 g punnets"],
    summary: "Egypt's early window lands seedless grapes in Europe ahead of Mediterranean competitors.",
    detail:
      "An early varietal sequence — Early Sweet and Superior through Flame and Red Globe to late Crimson — gives Egypt a May–August shipping window with cold-stored Crimson extending into autumn. Bunches are field-selected, trimmed and cold-packed with SO₂ pads for long-haul reefer voyages. Small volumes of IQF whole and half berries serve pastry and dessert processors year-round.",
    calendar: {
      fresh: {
        months: monthRange(5, 8),
        peak: "Jun – Jul",
        tempC: "0–1 °C",
        tempF: "32–34 °F",
        ventilation: "10–15 m³/h (SO₂ pad loads)",
        rh: "90–95%",
        shelfLife: "3–6 weeks (Crimson to 8)",
        transport: "Reefer sea freight · air freight",
        note: "Pre-cool within 8 hours of harvest; SO₂ generator pads on long hauls.",
      },
      frozen: {
        months: YEAR_ROUND,
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Niche line — whole and halves for bakery/pastry buyers.",
      },
    },
  },
  {
    slug: "pomegranates",
    name: "Pomegranates",
    trade: {
      volume: "≈ 136,000 t",
      year: "2025",
      headline: "World top-5 pomegranate exporter",
      share:
        "≈ 5.4% of global export value (world #5, ≈ $78 M); the UAE alone takes about half of the volume.",
      topImporters: ["UAE", "Saudi Arabia", "Russia", "Netherlands", "UK"],
      transit: {
        fresh: "≤ 30–60 days at sea (cold-stored stock ships into January)",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Punica granatum",
    category: "fruit",
    formats: ["fresh", "frozen"],
    featured: true,
    season: "Aug – Jan (fresh) · year-round (arils)",
    regions: "Minya · Assiut (Manfalout) · Beheira · Fayoum",
    subtypes: [
      {
        name: "Early 116",
        months: monthRange(8, 9),
        peak: "Aug",
        tag: "Earliest",
        detail: "The earliest commercial line — medium-large fruit with pinkish-red skin that opens the season in August.",
      },
      {
        name: "Acco",
        months: monthRange(8, 10),
        peak: "Sep",
        tag: "Early",
        detail: "Soft-seeded cultivar with sweet pink arils — taking a growing share of new plantings.",
      },
      {
        name: "Baladi",
        months: monthRange(9, 11),
        peak: "Oct",
        tag: "Traditional",
        detail: "The traditional local pomegranate — sweet, deep-red arils for regional and Gulf markets.",
      },
      {
        name: "Manfalouty",
        months: monthRange(10, 12),
        peak: "Oct – Nov",
        tag: "Upper Egypt",
        detail: "Assiut's signature strain from the Manfalout district — very large fruit with intense aril colour.",
      },
      {
        name: "Wonderful",
        months: monthRange(10, 1),
        peak: "Nov – Dec",
        tag: "Main line",
        detail:
          "The flagship export variety — deep-red skin, high Brix and dark juicy arils; it stores the longest and ships into January.",
      },
    ],
    packaging: ["4 / 5 kg cartons", "2 kg retail trays", "IQF arils: 10 kg bulk · 350–500 g retail"],
    summary: "Deep-red aril varieties in an unbroken Aug–Jan sequence, plus IQF arils for beverage and dairy.",
    detail:
      "The varietal relay — 116, Baladi, Manfalouty, Wonderful — covers the season from August into January, with cold storage extending shipments to early spring. Fruit is selected for skin finish and aril colour; extracted arils are inspected and individually quick frozen for juice, bakery and food-service programmes.",
    calendar: {
      fresh: {
        months: monthRange(8, 1),
        peak: "Sep – Nov",
        tempC: "5–7 °C",
        tempF: "41–45 °F",
        ventilation: "15–20 m³/h",
        rh: "90%",
        shelfLife: "4–8 weeks (2–3 months cold-stored)",
        transport: "Reefer sea freight",
        note: "Early thin-skin types prefer the warmer end of the band.",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Sep – Jan",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "IQF arils — Wonderful-class deep-red colour.",
      },
    },
  },
  {
    slug: "green-beans",
    name: "Green Beans",
    trade: {
      volume: "≈ 30,000 – 45,000 t fresh, plus IQF",
      year: "2024/25",
      headline: "A pillar of Europe's winter fine-bean supply",
      share:
        "Top-5 world exporter; beans and okra lead Egypt's ≈ 167,000 t frozen-vegetable programme to the EU.",
      topImporters: ["UK", "Netherlands", "France", "Germany", "Italy"],
      transit: {
        fresh: "≤ 7–12 days (fine and extra-fine grades move by air)",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Phaseolus vulgaris",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Oct – May (fresh) · year-round (IQF)",
    regions: "Beheira · Qalyubia · Ismailia",
    subtypes: [
      {
        name: "Extra fine",
        months: monthRange(10, 5),
        peak: "Dec – Mar",
        tag: "Top grade",
        detail: "The premium filet grade — pods under 6 mm, air-freighted to top-end EU retail.",
      },
      {
        name: "Fine",
        months: monthRange(10, 5),
        peak: "Dec – Mar",
        tag: "Main line",
        detail: "The standard export grade (6–8 mm) — the volume line of the winter air-freight programme.",
      },
      {
        name: "Bobby",
        months: monthRange(11, 4),
        peak: "Jan – Mar",
        tag: "Processing",
        detail: "Thicker pods (8–10 mm) for IQF and canning programmes, mostly grown under contract.",
      },
    ],
    packaging: ["3–5 kg cartons", "Flow-packs · 250 g bags", "IQF: 10 kg bulk · 400 g / 2.5 kg retail"],
    summary: "Winter fine beans flown into Europe when local supply is zero — and frozen at peak quality.",
    detail:
      "Hand-picked and graded by calibre through the Delta winter, fresh fine beans move by air freight (1–2 days to the EU) with hydro-cooling before dispatch. The same raw material is blanched and individually quick frozen as whole, cut and French-cut formats for retail and food-service programmes.",
    calendar: {
      fresh: {
        months: monthRange(10, 5),
        peak: "Dec – Mar",
        tempC: "4–7 °C",
        tempF: "39–45 °F",
        ventilation: "20–25 m³/h",
        rh: "95%",
        shelfLife: "7–14 days",
        transport: "Air freight · reefer",
        note: "Below 3 °C causes chilling injury.",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Nov – Mar",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "IQF whole, cut and French-cut formats.",
      },
    },
  },
  {
    slug: "artichokes",
    name: "Artichokes",
    trade: {
      volume: "≈ 20,000 – 27,000 t fresh, plus processed",
      year: "2024",
      headline: "From the world's #1 artichoke producer",
      share:
        "≈ 460,000 t of domestic production; a top-3 exporter with Italy and Spain, supplying up to 95% of Italy's frozen-artichoke imports.",
      topImporters: ["Italy", "France", "Spain", "USA"],
      transit: {
        fresh: "≤ 14–21 days at sea at 0–2 °C",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Cynara cardunculus var. scolymus",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    featured: true,
    season: "Nov – Apr (fresh) · year-round (IQF)",
    regions: "Beheira · Alexandria / Mariut · Qalyubia",
    subtypes: [
      {
        name: "Baladi green globe",
        months: monthRange(11, 4),
        peak: "Jan – Mar",
        tag: "Main line",
        detail:
          "The classic Egyptian green globe — compact, thick-hearted buds anchoring both the fresh trade and the IQF-bottom industry.",
      },
      {
        name: "Local violet",
        months: monthRange(11, 1),
        peak: "Dec",
        tag: "Early",
        detail: "Earlier violet-tinged buds from Alexandria and Mariut — a shorter niche window.",
      },
    ],
    packaging: ["5 / 10 kg fresh cartons", "IQF: 10 kg cartons · 400 g retail"],
    summary: "A signature Egyptian line — counter-seasonal winter buds and the famous IQF artichoke bottoms.",
    detail:
      "Egyptian artichokes hit the European market in exactly the months when Mediterranean supply disappears. Fresh buds are cut, hydro-cooled and shipped at 0–1 °C; the same crop feeds a specialist IQF industry — bottoms in 5/7 cm and 3/5 cm calibres, hearts and quarters — sold worldwide.",
    calendar: {
      fresh: {
        months: monthRange(11, 4),
        peak: "Jan – Mar",
        tempC: "0–1 °C",
        tempF: "32–34 °F",
        ventilation: "20–25 m³/h",
        rh: "95–100%",
        shelfLife: "2–3 weeks",
        transport: "Air freight · reefer sea freight",
        note: "Very high humidity is critical — buds dehydrate fast.",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Jan – May",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "6–8 months (practical)",
        transport: "Reefer sea freight at −18 °C",
        note: "Shorter practical life than other IQF lines — agree programme timing before the season opens.",
      },
    },
  },
  {
    slug: "okra",
    name: "Okra",
    trade: {
      volume: "≈ 30,000 – 50,000 t IQF + ≈ 20,000 t fresh",
      year: "2024/25",
      headline: "World's #1–2 frozen-okra origin",
      share:
        "Frozen okra leads Egypt's EU frozen-vegetable programme alongside beans, and is a staple of Gulf imports.",
      topImporters: ["Saudi Arabia", "UAE", "USA", "Kuwait", "UK", "Qatar"],
      transit: {
        fresh: "≤ 5–7 days (air freight is standard)",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Abelmoschus esculentus",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "May – Nov (fresh) · year-round (IQF)",
    regions: "Delta · Beheira · Upper Egypt",
    subtypes: [
      {
        name: "Baladi short-pod",
        months: monthRange(5, 11),
        peak: "Jun – Sep",
        tag: "Main line",
        detail: "The traditional short-pod cultivar behind both the fresh air-freight trade and the frozen grades.",
      },
      {
        name: "Hybrid uniform",
        months: monthRange(6, 10),
        peak: "Jul – Sep",
        tag: "IQF",
        detail: "Uniform hybrid pods bred for the frozen trade — consistent calibre through the season.",
      },
    ],
    packaging: ["5 kg fresh cartons", "IQF: 10 kg bulk · 400 g / 2.5 kg retail"],
    summary: "The signature Egyptian frozen line — pod-size grades for MENA retail and food service worldwide.",
    detail:
      "Okra grades (Zero 0–2.5 cm, Fine, One) are pod-size selections made at the line, not by season. Fresh pods move mainly to Gulf markets by air; the frozen programme — whole graded pods and cuts — is one of Egypt's most recognised IQF exports, with Upper Egypt winter production extending the raw-material window.",
    calendar: {
      fresh: {
        months: monthRange(5, 11),
        peak: "Jun – Sep",
        tempC: "7–10 °C",
        tempF: "45–50 °F",
        ventilation: "20–25 m³/h",
        rh: "95–100%",
        shelfLife: "7–10 days",
        transport: "Air freight",
        note: "Chilling-sensitive — do not hold below 7 °C.",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Jun – Sep",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Whole Extra / Zero / Fine / One grades plus cut formats.",
      },
    },
  },
  {
    slug: "mangoes",
    name: "Mangoes",
    trade: {
      volume: "≈ 65,000 – 150,000 t fresh by season, plus IQF",
      year: "2023 – 2025",
      headline: "Top-6 world fresh-mango exporter",
      share:
        "≈ 4–5% of global fresh-mango export volume; Saudi Arabia, the UAE and Kuwait take over 60% combined.",
      topImporters: ["Saudi Arabia", "UAE", "Kuwait", "UK", "Jordan", "Netherlands"],
      transit: {
        fresh: "≤ 14–21 days at sea after hot-water treatment (air 1–3 days)",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Mangifera indica",
    category: "fruit",
    formats: ["fresh", "frozen"],
    featured: true,
    season: "Jun – Dec (fresh) · year-round (IQF)",
    regions: "Ismailia · Sharkia · Beheira · Qalyubia",
    subtypes: [
      {
        name: "Tommy Atkins",
        months: monthRange(6, 8),
        peak: "Jul",
        tag: "Early",
        detail: "The red-blush international workhorse — bred for long sea voyages.",
      },
      {
        name: "Alphonso",
        months: monthRange(7, 8),
        peak: "Jul – Aug",
        tag: "Aromatic",
        detail: "Small volumes of the famed Indian cultivar — intensely aromatic, mostly regional trade.",
      },
      {
        name: "Zebdeya",
        months: monthRange(7, 9),
        peak: "Aug",
        tag: "Local favourite",
        detail: "Egypt's beloved buttery local variety — the taste of the Egyptian summer and a Gulf staple.",
      },
      {
        name: "Fajri",
        months: monthRange(8, 9),
        peak: "Aug – Sep",
        tag: "Large",
        detail: "Very large green-fruited Indian-type cultivar for ethnic markets.",
      },
      {
        name: "Kent",
        months: monthRange(8, 9),
        peak: "Sep",
        tag: "Export",
        detail: "Sweet, fibreless and blushing — a top export variety for European retail.",
      },
      {
        name: "Ewais",
        months: monthRange(8, 10),
        peak: "Sep",
        tag: "Signature",
        detail:
          "Egypt's signature late mango — fibreless and aromatic, unique to Egyptian orchards; the flagship of the season.",
      },
      {
        name: "Naomi",
        months: monthRange(8, 9),
        peak: "Sep",
        tag: "Premium",
        detail: "New premium red-blush cultivar gaining area for late-summer programmes.",
      },
      {
        name: "Keitt",
        months: monthRange(9, 11),
        peak: "Sep – Oct",
        tag: "Late",
        detail: "The late green-yellow variety closing the fresh season — also the main IQF side-stream.",
      },
    ],
    packaging: ["4 / 5 kg cartons (counts 5–12)", "3.5 kg cartons", "IQF: 10 kg bags · 2.5 kg retail"],
    summary: "Aromatic Egyptian desi varieties and export-grade Kent/Keitt — fresh and IQF cubes year-round.",
    detail:
      "Egypt's mango belt runs from Ismailia through Sharkia to the Delta, harvesting the prized aromatic Ewais and Zebdeya alongside international varieties. Export fruit is picked mature-green, hot-water treated where required and shipped at 10–13 °C. Kent and Keitt sides also stream into the IQF programme as chunks, dices, slices and purée.",
    calendar: {
      fresh: {
        months: monthRange(6, 12),
        peak: "Jul – Sep",
        tempC: "10–13 °C",
        tempF: "50–55 °F",
        ventilation: "20–25 m³/h",
        rh: "85–90%",
        shelfLife: "2–4 weeks",
        transport: "Reefer sea freight · air freight",
        note: "Chilling-sensitive — never below 10 °C on voyages over two weeks.",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Aug – Sep",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "IQF chunks, dices, slices and purée.",
      },
    },
  },
  {
    slug: "valencia-oranges",
    name: "Valencia Oranges",
    trade: {
      volume: "≈ 1.8 million t (all Egyptian oranges)",
      year: "2024/25 – 2025/26",
      headline: "World's #1 orange exporter — six consecutive seasons",
      share:
        "≈ 35–40% of global orange export volume; Valencia closes the season Mar – Aug, when Southern Hemisphere fruit is scarce.",
      topImporters: ["Russia", "Saudi Arabia", "India", "UAE", "Netherlands", "Bangladesh"],
      transit: {
        fresh: "≤ 21–40 days at sea (protocol cold treatment can extend beyond 40 days)",
      },
    },
    latin: "Citrus sinensis",
    category: "fruit",
    formats: ["fresh"],
    season: "Feb – Jul",
    regions: "Nubaria (largest Valencia district) · Delta",
    subtypes: [
      {
        name: "Valencia",
        months: monthRange(2, 7),
        peak: "Mar – Jun",
        tag: "Main line",
        detail:
          "The standard late orange — high juice content and colour that carries Egyptian exports deep into the northern summer.",
      },
      {
        name: "Olinda",
        months: monthRange(4, 7),
        peak: "May – Jul",
        tag: "Late",
        detail: "A late Valencia selection that holds quality on the tree into the final weeks of the season.",
      },
    ],
    packaging: ["15 kg telescopic cartons", "Juice-trade bulk bins"],
    summary: "The late-season, high-juice orange that carries Egyptian exports into early summer.",
    detail:
      "Valencia extends Egypt's orange shipments from February to July — deep into the Northern Hemisphere summer gap. Nubaria's reclaimed lands are the country's largest Valencia district; fruit is graded by calibre, colour and Brix with juice-grade volumes available for the trade.",
    calendar: {
      fresh: {
        months: monthRange(2, 7),
        peak: "Mar – Jun",
        tempC: "3–6 °C",
        tempF: "37–43 °F",
        ventilation: "20–30 m³/h · closed during cold treatment",
        rh: "85–90%",
        shelfLife: "4–8 weeks",
        transport: "Reefer sea freight (2–4 °C on long hauls)",
      },
    },
  },
  {
    slug: "mandarins",
    name: "Mandarins & Clementines",
    trade: {
      volume: "≈ 361,000 t",
      year: "2025/26 (246,000 t in 2024/25)",
      headline: "Top-6 world mandarin exporter",
      share:
        "≈ 8–10% of global export volume, growing ≈ 47% season-on-season; ≈ 208,000 t went to Europe alone in 2025/26.",
      topImporters: ["Russia", "Saudi Arabia", "UK", "Netherlands", "Ukraine", "Bangladesh"],
      transit: {
        fresh: "≤ 21–35 days at sea",
      },
    },
    latin: "Citrus reticulata",
    category: "fruit",
    formats: ["fresh"],
    season: "Nov – Apr",
    regions: "Beheira · Minufiya · Nubaria",
    subtypes: [
      {
        name: "Clementine",
        months: monthRange(11, 12),
        peak: "Nov",
        tag: "Opener",
        detail: "Seedless, easy-peel clementine that opens the mandarin season for European retail.",
      },
      {
        name: "Fremont",
        months: monthRange(11, 1),
        peak: "Dec",
        tag: "Early",
        detail: "Deep orange-red mandarin with rich flavour — the early volume line.",
      },
      {
        name: "Minneola",
        months: monthRange(12, 2),
        peak: "Jan",
        tag: "Mid",
        detail: "The bell-shaped tangelo hybrid with a tart-sweet zip — a distinctive mid-season line.",
      },
      {
        name: "Baladi mandarin",
        months: monthRange(11, 1),
        peak: "Dec",
        tag: "Local",
        detail: "The traditional seeded local mandarin — aromatic, mostly for regional and Gulf trade.",
      },
      {
        name: "W. Murcott",
        months: monthRange(1, 3),
        peak: "Feb",
        tag: "Premium",
        detail: "The high-Brix late murcott — the premium flagship of the easy-peeler programme.",
      },
      {
        name: "Murcott",
        months: monthRange(2, 4),
        peak: "Feb – Mar",
        tag: "Late",
        detail: "Classic late murcott for the final programmes of the winter.",
      },
    ],
    packaging: ["6 / 8 / 10 kg cartons (sizes 36–60)"],
    summary: "Easy-peeler winter trade — Fremont opens the season, Murcott is the premium flagship.",
    detail:
      "Egypt's easy-peeler programme runs the full winter with a clean varietal handover: Fremont and Clementine first, Minneola mid-season, and the high-Brix W. Murcott carrying the premium tail. Packed in 6–10 kg cartons, size-graded 36–60 count.",
    calendar: {
      fresh: {
        months: monthRange(11, 4),
        peak: "Dec – Feb",
        tempC: "5–8 °C",
        tempF: "41–46 °F",
        ventilation: "25–30 m³/h · closed during cold treatment",
        rh: "85–90%",
        shelfLife: "2–6 weeks",
        transport: "Reefer sea freight",
        note: "Often shipped at 3–4 °C in practice — a recognised pitting risk; recommended band is 5–8 °C.",
      },
    },
  },
  {
    slug: "lemons",
    name: "Lemons & Limes",
    trade: {
      volume: "≈ 217,000 t",
      year: "2025/26 (+25% year-on-year)",
      headline: "Top-5 world lemon exporter",
      share: "≈ 6–7% of global export volume; ≈ 174,000 t in 2024/25 rising to ≈ 217,000 t.",
      topImporters: ["Saudi Arabia", "UAE", "Russia", "Ukraine", "UK", "Jordan"],
      transit: {
        fresh: "≤ 21–40 days at sea",
      },
    },
    latin: "Citrus limon",
    category: "fruit",
    formats: ["fresh"],
    season: "Dec – Jul (yellow) · Aug – Oct (green lime)",
    regions: "Delta · Nubaria",
    subtypes: [
      {
        name: "Adalia",
        months: monthRange(12, 4),
        peak: "Feb – Apr",
        tag: "Main line",
        detail: "Egypt's signature export lemon — smooth, thin-skinned and juicy through the winter peak.",
      },
      {
        name: "Eureka",
        months: monthRange(1, 6),
        peak: "Mar – May",
        tag: "Volume",
        detail: "The classic true lemon extending the yellow season into early summer.",
      },
      {
        name: "Lisbon",
        months: monthRange(2, 6),
        peak: "Apr – May",
        tag: "Late spring",
        detail: "A vigorous, productive true lemon holding the late-spring window.",
      },
      {
        name: "Baladi",
        months: monthRange(12, 3),
        peak: "Jan",
        tag: "Local",
        detail: "The traditional local lemon — smaller and seedier, with strong peel oil; regional trade.",
      },
      {
        name: "Green lime",
        months: monthRange(8, 10),
        peak: "Sep",
        tag: "Autumn",
        detail: "The distinctive autumn green-lime window that fills the gap before the yellow crop.",
      },
    ],
    packaging: ["15 kg cartons", "10 / 18 kg bags"],
    summary: "Near year-round lemon supply with a distinctive autumn green-lime window.",
    detail:
      "Yellow lemons run from December into July with the peak in late winter and spring; the green-lime window (Aug–Oct) covers the remaining months. Lemons are chilling-sensitive and ship warmer than oranges — a detail many programmes get wrong.",
    calendar: {
      fresh: {
        months: [8, 9, 10, 12, 1, 2, 3, 4, 5, 6, 7],
        peak: "Feb – May",
        tempC: "10–12 °C",
        tempF: "50–54 °F",
        ventilation: "25–30 m³/h",
        rh: "85–90%",
        shelfLife: "4–8 weeks",
        transport: "Reefer sea freight",
        note: "Chilling-sensitive; storage rooms 10–13 °C.",
      },
    },
  },
  {
    slug: "grapefruit",
    name: "Grapefruit",
    trade: {
      volume: "≈ 30,000 t",
      year: "2024/25",
      headline: "Boutique citrus line",
      share:
        "Under 3% of world grapefruit trade — a specialist extension of the world's largest citrus-export programme.",
      topImporters: ["Russia", "Ukraine", "Netherlands", "Saudi Arabia"],
      transit: {
        fresh: "≤ 21–35 days at sea",
      },
    },
    latin: "Citrus × paradisi",
    category: "fruit",
    formats: ["fresh"],
    season: "Nov – May",
    regions: "Delta new lands",
    subtypes: [
      {
        name: "Star Ruby",
        months: monthRange(11, 2),
        peak: "Dec – Jan",
        tag: "Main line",
        detail: "Deep-red flesh and thin skin — the variety behind most Egyptian grapefruit exports.",
      },
      {
        name: "Ruby Red",
        months: monthRange(12, 3),
        peak: "Jan – Feb",
        tag: "Mid",
        detail: "Reliable pink-red colour through the heart of winter.",
      },
      {
        name: "Marsh Seedless",
        months: monthRange(1, 4),
        peak: "Feb – Mar",
        tag: "Late white",
        detail: "The classic white seedless — late fruit with a clean, sharp finish.",
      },
    ],
    packaging: ["15 / 17 kg cartons"],
    summary: "Red-fleshed winter grapefruit with the best internal colour from January.",
    detail:
      "Star Ruby and Ruby Red dominate Egypt's grapefruit shipments, with colour peaking through the January–March window. Like lemons, grapefruit is chilling-sensitive and ships at a warmer setpoint than oranges.",
    calendar: {
      fresh: {
        months: monthRange(11, 5),
        peak: "Jan – Mar",
        tempC: "10–12 °C",
        tempF: "50–54 °F",
        ventilation: "25–30 m³/h · closed during cold treatment",
        rh: "85–90%",
        shelfLife: "4–6 weeks",
        transport: "Reefer sea freight",
        note: "Chilling-sensitive — keep above 10 °C.",
      },
    },
  },
  {
    slug: "watermelons",
    name: "Watermelons",
    trade: {
      volume: "≈ 30,000 – 60,000 t",
      year: "2025 (record season)",
      headline: "Fast-growing Gulf watermelon programme",
      share:
        "A regional line focused on the Gulf — Saudi Arabia alone took ≈ 18,500 t in the first nine months of 2025.",
      topImporters: ["Saudi Arabia", "Kuwait", "UAE", "Qatar", "Jordan"],
      transit: {
        fresh: "≤ 14–21 days at sea at 7–10 °C",
      },
    },
    latin: "Citrullus lanatus",
    category: "fruit",
    formats: ["fresh"],
    season: "Apr – Oct",
    regions: "Beheira · Ismailia · Sharqiya · Aswan (early crop)",
    subtypes: [
      {
        name: "Giza 1",
        months: monthRange(4, 6),
        peak: "May",
        tag: "Earliest",
        detail: "The classic early round melon from Aswan's warm winter that opens the season in April.",
      },
      {
        name: "Sugar Baby",
        months: monthRange(5, 7),
        peak: "Jun",
        tag: "Small",
        detail: "Small, dark-skinned melons for retail singles and the Gulf trade.",
      },
      {
        name: "Crimson Sweet",
        months: monthRange(5, 9),
        peak: "Jun – Aug",
        tag: "Main line",
        detail: "The large striped volume melon of the Delta summer.",
      },
      {
        name: "Seedless red",
        months: monthRange(5, 9),
        peak: "Jun – Aug",
        tag: "Premium",
        detail: "Triploid seedless programme growing quickly for European retail.",
      },
      {
        name: "Yellow-flesh",
        months: monthRange(6, 8),
        peak: "Jul",
        tag: "Specialty",
        detail: "Small volumes of yellow-flesh melons for specialty programmes.",
      },
    ],
    packaging: ["Loose on pallets / bins", "Film-wrapped retail singles"],
    summary: "Warm-season volume melons from an early Aswan crop through the Delta summer.",
    detail:
      "Aswan's early crop opens the watermelon season in April before Delta volumes take over through the summer. Fruit travels loose on pallets or film-wrapped for retail, at a setpoint that keeps it cool without chilling injury.",
    calendar: {
      fresh: {
        months: monthRange(4, 10),
        peak: "Apr – Jul",
        tempC: "10–15 °C",
        tempF: "50–59 °F",
        ventilation: "15–20 m³/h",
        rh: "90%",
        shelfLife: "2–3 weeks",
        transport: "Reefer sea freight",
        note: "Chilling-sensitive — never below 10 °C.",
      },
    },
  },
  {
    slug: "melons",
    name: "Melons — Galia, Cantaloupe & Honeydew",
    trade: {
      volume: "≈ 15,000 – 30,000 t",
      year: "2024/25",
      headline: "Regional speciality-melon programme",
      share:
        "A Gulf-focused line that complements the watermelon programme through the spring and early summer.",
      topImporters: ["Saudi Arabia", "Kuwait", "UAE", "Qatar", "UK"],
      transit: {
        fresh: "≤ 14–21 days at sea",
      },
    },
    latin: "Cucumis melo",
    category: "fruit",
    formats: ["fresh"],
    season: "Apr – Sep",
    regions: "Beheira · Ismailia · Sharqiya (tunnel-early Feb–Mar)",
    subtypes: [
      {
        name: "Galia",
        months: monthRange(4, 7),
        peak: "May – Jun",
        tag: "Earliest",
        detail: "Tunnel-grown netted galia beats Spanish supply into the EU spring market by weeks.",
      },
      {
        name: "Cantaloupe",
        months: monthRange(5, 8),
        peak: "Jun – Jul",
        tag: "Main line",
        detail: "Orange-flesh netted cantaloupe — the coldest-tolerant melon of the group.",
      },
      {
        name: "Yellow Canary",
        months: monthRange(6, 8),
        peak: "Jul",
        tag: "Long life",
        detail: "Yellow-skinned canary melon with a long shelf life — a Gulf favourite.",
      },
      {
        name: "Honeydew",
        months: monthRange(6, 9),
        peak: "Jul – Aug",
        tag: "Late",
        detail: "Smooth white honeydew with green flesh closing the melon season.",
      },
    ],
    packaging: ["4–6 kg cartons (counts 4 / 6 / 8)"],
    summary: "Tunnel-early production beats Spanish melons into the EU spring market.",
    detail:
      "Egyptian tunnels deliver the first galia and cantaloupe of the season from April, weeks ahead of open-field Mediterranean origins. Netted cantaloupe tolerates the coldest setpoint of the group; galia and honeydew must stay warmer.",
    calendar: {
      fresh: {
        months: monthRange(4, 9),
        peak: "May – Aug",
        tempC: "7–10 °C (galia · honeydew)",
        tempF: "45–50 °F",
        ventilation: "15–20 m³/h",
        rh: "90–95%",
        shelfLife: "2–4 weeks (cantaloupe 10–14 days)",
        transport: "Reefer sea freight",
        note: "Cantaloupe tolerates 2–5 °C; galia and honeydew are chilling-sensitive below 7 °C.",
      },
    },
  },
  {
    slug: "peaches-nectarines",
    name: "Peaches & Nectarines",
    trade: {
      volume: "≈ 10,000 – 20,000 t",
      year: "2024/25",
      headline: "Boutique stone-fruit line",
      share:
        "Low-chill Delta orchards serve a Gulf and Eastern-European niche in April – June.",
      topImporters: ["Saudi Arabia", "UAE", "Kuwait", "Russia"],
      transit: {
        fresh: "≤ 14–21 days at sea",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Prunus persica",
    category: "fruit",
    formats: ["fresh", "frozen"],
    season: "Apr – Jun (fresh) · year-round (IQF slices)",
    regions: "Beheira · Qalyubia · Minya (low-chill districts)",
    subtypes: [
      {
        name: "Florida Prince",
        months: monthRange(4, 5),
        peak: "Apr – May",
        tag: "Earliest",
        detail: "The earliest peach on any world market — low-chill red-blushed fruit from April.",
      },
      {
        name: "Dessert (Gold)",
        months: monthRange(5, 6),
        peak: "May",
        tag: "Early",
        detail: "Yellow-fleshed early dessert peach — the volume line of the stone-fruit programme.",
      },
      {
        name: "Swiling",
        months: monthRange(5, 6),
        peak: "May – Jun",
        tag: "Mid",
        detail: "Mid-season yellow peach extending the window into June.",
      },
      {
        name: "Low-chill nectarines",
        months: monthRange(5, 7),
        peak: "Jun",
        tag: "Nectarine",
        detail:
          "Early low-chill nectarines — smooth-skinned and high-colour for Gulf and Eastern-European markets.",
      },
    ],
    packaging: ["4 / 5 kg cartons", "Punnets", "IQF slices: 10 kg bulk"],
    summary: "Low-chill early varieties give Egypt a May head start on the stone-fruit season.",
    detail:
      "Egypt's low-chill districts produce the earliest stone fruit on the market — Florida Prince peaches from April, weeks before Mediterranean competitors. Small volumes of IQF slices and dices serve the bakery and dairy industries year-round.",
    calendar: {
      fresh: {
        months: monthRange(4, 7),
        peak: "May – Jun",
        tempC: "0–1 °C",
        tempF: "32–34 °F",
        ventilation: "15–20 m³/h",
        rh: "90–95%",
        shelfLife: "2–4 weeks",
        transport: "Reefer sea freight · air freight",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed May – Jul",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Small-volume IQF slices and dices.",
      },
    },
  },
  {
    slug: "apricots",
    name: "Apricots",
    trade: {
      volume: "≈ 10,000 – 15,000 t fresh, plus IQF",
      year: "2024/25",
      headline: "From a top-3 world apricot producer",
      share:
        "Most of the crop processes domestically; exports split between the fresh Gulf trade and IQF for processors.",
      topImporters: ["Saudi Arabia", "UAE", "Kuwait", "UK", "Russia"],
      transit: {
        fresh: "≤ 14–21 days at sea",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Prunus armeniaca",
    category: "fruit",
    formats: ["fresh", "frozen"],
    season: "May – Jul (fresh) · year-round (IQF)",
    regions: "Delta · Middle Egypt",
    subtypes: [
      {
        name: "Baladi early",
        months: monthRange(5, 6),
        peak: "May",
        tag: "Earliest",
        detail: "Small, aromatic local apricots that open the season at premium prices.",
      },
      {
        name: "Canino-type",
        months: monthRange(6, 7),
        peak: "Jun",
        tag: "Main line",
        detail: "The classic export and processing apricot — firm golden fruit for fresh shipping and IQF slices.",
      },
    ],
    packaging: ["5 kg cartons", "IQF: 10 kg bulk"],
    summary: "A short, high-price early-summer window — fresh and frozen.",
    detail:
      "Egyptian apricots concentrate a compact May–July harvest into strong early-season pricing. Fresh fruit ships at 0–1 °C; processing volumes become IQF slices for the food industry.",
    calendar: {
      fresh: {
        months: monthRange(5, 7),
        peak: "May – Jun",
        tempC: "0–1 °C",
        tempF: "32–34 °F",
        ventilation: "15–20 m³/h",
        rh: "90–95%",
        shelfLife: "1–3 weeks",
        transport: "Air freight · reefer",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed May – Jul",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Small-volume processing line.",
      },
    },
  },
  {
    slug: "dates",
    name: "Dates",
    trade: {
      volume: "≈ 40,000 – 50,000 t",
      year: "2024 (≈ $106 M)",
      headline: "From the world's #1 date producer",
      share:
        "≈ 2 million t of production — 19–21% of world output; #7–9 as an exporter (< 3% of trade), led by Siwa and Delta dry dates.",
      topImporters: ["Morocco", "Turkey", "Indonesia", "Malaysia", "Bangladesh"],
      transit: {
        fresh: "≤ 30–60 days at sea (dry dates); fresh khalal moves by air",
      },
    },
    latin: "Phoenix dactylifera",
    category: "fruit",
    formats: ["fresh"],
    season: "Sep – Mar (Ramadan-driven)",
    regions: "Siwa · Aswan · Farafra / Bahariya oases · Nubaria (Medjool)",
    subtypes: [
      {
        name: "Barhi (rutab)",
        months: monthRange(8, 9),
        peak: "Aug – Sep",
        tag: "Fresh rutab",
        detail: "Honey-sweet fresh rutab eaten soft — air-freighted in its short golden window.",
      },
      {
        name: "Samani",
        months: monthRange(8, 9),
        peak: "Sep",
        tag: "Ramadan",
        detail: "The beloved soft early date that commands the Ramadan market across the region.",
      },
      {
        name: "Amhat",
        months: monthRange(8, 10),
        peak: "Sep",
        tag: "Siwa",
        detail: "A signature Siwan cultivar — amber, semi-soft fruit and a mainstay of the dry-date trade.",
      },
      {
        name: "Siwi",
        months: monthRange(9, 10),
        peak: "Sep – Oct",
        tag: "Main line",
        detail: "Siwa's flagship soft date — the variety that built Egypt's dry-date export reputation.",
      },
      {
        name: "Medjool",
        months: monthRange(9, 11),
        peak: "Oct",
        tag: "Premium",
        detail: "Jumbo Medjool from the new lands of Nubaria — the fastest-growing premium line.",
      },
    ],
    packaging: ["200–500 g trays / punnets", "5 kg cartons", "10 kg bulk"],
    summary: "Siwan dry dates and premium Medjool moving on the Ramadan calendar.",
    detail:
      "Egypt is one of the world's largest date producers. Dry and semi-dry Siwi ships at ambient temperature; premium Medjool from the new lands moves in winter programmes; fresh Barhi rutab is air freighted in its short season. Export volumes spike ahead of Ramadan.",
    calendar: {
      fresh: {
        months: monthRange(9, 3),
        peak: "Sep – Nov harvest",
        tempC: "Ambient (dry) · 0–4 °C (rutab)",
        tempF: "59–77 °F dry · 32–39 °F rutab",
        ventilation: "Ventilated dry containers · 30–50 m³/h (dry dates)",
        rh: "65–75% (dry)",
        shelfLife: "6–12 months (dry) · 2–4 weeks (rutab)",
        transport: "Dry containers (dry dates) · reefer/air (rutab, Medjool)",
        note: "Fresh rutab and long-term storage lots held at 0 °C.",
      },
    },
  },
  {
    slug: "guava",
    name: "Guava",
    trade: {
      volume: "≈ 10,000 – 20,000 t",
      year: "2024/25",
      headline: "From a top-5 world guava producer",
      share:
        "Winter guava is a Gulf favourite; the broader crop feeds Egypt's juice and processing industry.",
      topImporters: ["Saudi Arabia", "UAE", "Kuwait", "Russia", "UK"],
      transit: {
        fresh: "≤ 14–21 days at sea",
      },
    },
    latin: "Psidium guajava",
    category: "fruit",
    formats: ["fresh"],
    season: "Sep – Dec · Jan – Mar (winter crop)",
    regions: "Beheira · Sharkia · Qalyubia",
    subtypes: [
      {
        name: "White-flesh Baladi",
        months: [9, 10, 11, 12, 1, 2, 3],
        peak: "Oct – Nov",
        tag: "Main line",
        detail:
          "The classic Egyptian white guava — aromatic and sweet across both the autumn crop and the lighter winter crop.",
      },
      {
        name: "Pink Allahabadi",
        months: monthRange(9, 11),
        peak: "Oct",
        tag: "Pink",
        detail: "Pink-fleshed variety serving specific Gulf and processing programmes.",
      },
    ],
    packaging: ["4 / 5 kg cartons"],
    summary: "Two-crop guava spanning autumn and late winter for Gulf and ethnic EU markets.",
    detail:
      "Egyptian guava harvests twice — the main autumn crop and a lighter winter crop — giving near-continuous supply from September to March. White Baladi dominates; pink-flesh volumes serve specific markets.",
    calendar: {
      fresh: {
        months: monthRange(9, 3),
        peak: "Oct – Nov",
        tempC: "5–10 °C",
        tempF: "41–50 °F",
        ventilation: "15–20 m³/h",
        rh: "90%",
        shelfLife: "2–3 weeks",
        transport: "Reefer sea freight · air freight",
      },
    },
  },
  {
    slug: "fresh-figs",
    name: "Fresh Figs",
    trade: {
      volume: "≈ 3,000 – 6,000 t",
      year: "2024/25",
      headline: "Premium niche air-freight line",
      share: "Short pre-harvest windows and air freight keep it a high-value boutique programme.",
      topImporters: ["UK", "Netherlands", "Germany", "Saudi Arabia", "UAE"],
      transit: {
        fresh: "≤ 5–7 days — air freight only",
      },
    },
    latin: "Ficus carica",
    category: "fruit",
    formats: ["fresh"],
    season: "Jun – Aug · Nov – Jan",
    regions: "Beheira · Alexandria",
    subtypes: [
      {
        name: "Green Sultani",
        months: monthRange(6, 8),
        peak: "Jun – Jul",
        tag: "Main line",
        detail: "The classic local green-skinned fig of the main summer harvest.",
      },
      {
        name: "Black local",
        months: [6, 7, 11, 12, 1],
        peak: "Jun",
        tag: "Two windows",
        detail: "Dark-skinned local figs moving in both the summer harvest and the autumn crop.",
      },
    ],
    packaging: ["250–500 g punnets", "2 kg cartons"],
    summary: "A high-price niche — air freight only, two harvest windows.",
    detail:
      "Egyptian fresh figs move in two windows — the main summer harvest and a Breba-type autumn crop — packed in small punnets and flown. Fragile and short-dated; programmes are built on firm weekly volumes.",
    calendar: {
      fresh: {
        months: [6, 7, 8, 11, 12, 1],
        peak: "Jun – Aug",
        tempC: "0–1 °C",
        tempF: "32–34 °F",
        ventilation: "Air freight — no reefer vents",
        rh: "85–90%",
        shelfLife: "7–10 days",
        transport: "Air freight",
      },
    },
  },
  {
    slug: "onions",
    name: "Onions",
    trade: {
      volume: "≈ 288,000 t (2025 rebound)",
      year: "2025",
      headline: "World top-5 dry-onion exporter",
      share:
        "Over 500,000 t in peak seasons and the EU's leading third-country onion supplier; volumes move with export-ban policy (2023/24 season was restricted).",
      topImporters: ["Russia", "Saudi Arabia", "UAE", "Jordan", "Bangladesh", "UK"],
      transit: {
        fresh: "≤ 60–90 days at sea",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Allium cepa",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Feb – Sep (fresh) · year-round (IQF)",
    regions: "Minufiya · Beheira · Upper Egypt spring belt",
    subtypes: [
      {
        name: "Golden / yellow",
        months: monthRange(2, 9),
        peak: "Apr – Aug",
        tag: "Main line",
        detail:
          "The volume export onion — golden-brown bulbs graded 45–80 mm, from the Minufiya start in February to the Upper-Egypt tail.",
      },
      {
        name: "Red",
        months: monthRange(3, 8),
        peak: "Apr – Jul",
        tag: "Premium",
        detail: "Deep-red onions with real bite — a premium line into Russia, the Gulf and the EU.",
      },
      {
        name: "White",
        months: monthRange(2, 6),
        peak: "Mar – May",
        tag: "Dehydration",
        detail:
          "High-solids white onions — mostly contracted to the dehydration industry, with fresh export volumes in spring.",
      },
    ],
    packaging: [
      "10 / 20 / 25 kg mesh bags",
      "1.25 t jumbo bags · 550 kg bins",
      "IQF diced: 10 / 20 kg · retail 400 g / 1 kg",
    ],
    summary: "Overlapping regional harvests give near-year-round onions into the EU storage gap.",
    detail:
      "Egyptian onions ship from February through September as the Minufiya, Beheira and Upper-Egypt harvests overlap, with ventilated dry containers in cool months switching to reefers as ambient rises. Onions are the one commodity that wants LOW humidity — cured, sized and inspected for neck finish before bagging. IQF white and red dices, rings and slices run all year.",
    calendar: {
      fresh: {
        months: monthRange(2, 9),
        peak: "Apr – Aug",
        tempC: "0–4 °C",
        tempF: "32–39 °F",
        ventilation: "40–50 m³/h (high)",
        rh: "65–70%",
        shelfLife: "1–3 months (cured)",
        transport: "Ventilated dry containers (cool months) · reefer",
        note: "Low humidity is critical — never store with high-RH loads.",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Mar – Jun",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "The only IQF line with year-round farm-level raw material.",
      },
    },
  },
  {
    slug: "potatoes",
    name: "Potatoes",
    trade: {
      volume: "≈ 1.0 million t",
      year: "2024/25",
      headline: "World's #4–5 potato exporter",
      share: "≈ 8–10% of global potato export volume; Russia, the Levant and West Africa anchor the programme.",
      topImporters: ["Russia", "Lebanon", "Jordan", "Kuwait", "UAE", "UK"],
      transit: {
        fresh: "≤ 30–45 days at sea",
      },
    },
    latin: "Solanum tuberosum",
    category: "vegetable",
    formats: ["fresh"],
    season: "Feb – Jun · Sep – Dec",
    regions: "Upper Egypt (spring) · Delta / Nubaria (autumn)",
    subtypes: [
      {
        name: "Spunta",
        months: [...monthRange(2, 6), ...monthRange(9, 12)],
        peak: "Feb – May",
        tag: "Main line",
        detail: "The Egyptian table standard — the great majority of planted area; long oval tubers with pale-yellow flesh.",
      },
      {
        name: "Diamant",
        months: monthRange(2, 6),
        peak: "Mar – Apr",
        tag: "Early",
        detail: "Yellow-fleshed early table potato with strong skin finish for long transit.",
      },
      {
        name: "Lady Rosetta",
        months: monthRange(3, 6),
        peak: "Apr – May",
        tag: "Crisp",
        detail: "High dry-matter red-skinned chipping potato grown under crisp contracts.",
      },
      {
        name: "Hermes",
        months: [...monthRange(3, 6), ...monthRange(10, 12)],
        peak: "Apr – May",
        tag: "Crisp",
        detail: "Long-oval crisp variety with light-gold fry colour — a contract-processing staple.",
      },
      {
        name: "Cara",
        months: monthRange(9, 12),
        peak: "Oct – Nov",
        tag: "Autumn",
        detail: "Tall, late maincrop for the autumn harvest and the storage trade.",
      },
    ],
    packaging: ["10 / 15 / 25 kg mesh bags", "1.25 t jumbo bags", "550 kg bins (45–75 mm EU grade)"],
    summary: "Two harvests bracket the European storage trough — 25–28 t per 40' reefer.",
    detail:
      "Egypt's spring crop (Upper Egypt) and autumn crop (Delta/Nubaria) ship table and processing potatoes almost year-round, graded 45–75 mm for the EU trade. Lady Rosetta and Hermes feed crisp contracts; Spunta is the table standard. Setpoints hold at 6–8 °C — colder sugar-loading ruins fry colour.",
    calendar: {
      fresh: {
        months: [2, 3, 4, 5, 6, 9, 10, 11, 12],
        peak: "Feb – Jun",
        tempC: "6–8 °C",
        tempF: "43–46 °F",
        ventilation: "20–30 m³/h",
        rh: "85–90%",
        shelfLife: "2–6 months",
        transport: "Reefer sea freight · ventilated containers (cool months)",
        note: "Never below 4 °C — sugars accumulate and after-cooking darkening follows.",
      },
    },
  },
  {
    slug: "sweet-potatoes",
    name: "Sweet Potatoes",
    trade: {
      volume: "≈ 50,000 t",
      year: "2024",
      headline: "Fast-rising sweet-potato origin",
      share:
        "Up from ≈ 28,500 t in 2020 — nearly doubled in four years into the world's top-10 exporters.",
      topImporters: ["UK", "Netherlands", "France", "Russia", "Saudi Arabia"],
      transit: {
        fresh: "≤ 30–60 days at sea at 13–15 °C",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Ipomoea batatas",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Aug – Mar (fresh) · year-round (IQF)",
    regions: "Beheira · Nile Delta",
    subtypes: [
      {
        name: "Baladi (white-flesh)",
        months: monthRange(8, 11),
        peak: "Sep – Oct",
        tag: "Local",
        detail: "The traditional cream-flesh local sweet potato — the Gulf and domestic favourite.",
      },
      {
        name: "Beauregard",
        months: monthRange(9, 2),
        peak: "Oct – Dec",
        tag: "Main line",
        detail: "The orange-flesh American variety behind Egypt's boom in UK sweet-potato supply.",
      },
      {
        name: "Bellevue",
        months: monthRange(10, 3),
        peak: "Nov – Jan",
        tag: "Late storage",
        detail: "Newer orange variety with blocky roots and long storage life for winter programmes.",
      },
    ],
    packaging: ["6 kg cartons (3.4 t / 40')", "10 kg mesh (25 t / 40')", "IQF cubes: 10 kg · 2.5 kg retail"],
    summary: "Egypt's fastest-growing UK line — cured, orange-flesh roots plus IQF cubes.",
    detail:
      "Egyptian sweet potato volumes to the UK have grown faster than almost any other line. Roots are cured before shipment — part of the specification — and must never see cold setpoints: sweet potato is the most chilling-sensitive root in the catalogue. IQF dices, cubes and slices ride the same boom.",
    calendar: {
      fresh: {
        months: monthRange(8, 3),
        peak: "Oct – Dec",
        tempC: "13–15 °C",
        tempF: "55–59 °F",
        ventilation: "15–20 m³/h",
        rh: "85–90%",
        shelfLife: "1–3 months (cured) · 2–6 stored",
        transport: "Reefer sea freight",
        note: "Never below 12 °C — chilling injury ruins the flesh.",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Oct – Dec",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "IQF dices, cubes and slices.",
      },
    },
  },
  {
    slug: "garlic",
    name: "Garlic",
    trade: {
      volume: "≈ 5,000 – 15,000 t",
      year: "2024/25",
      headline: "Boutique fresh-garlic line",
      share:
        "Egypt is a net garlic importer; early Delta garlic serves Gulf windows between Chinese and Spanish supply.",
      topImporters: ["Saudi Arabia", "UAE", "Russia", "Kuwait"],
      transit: {
        fresh: "≤ 60–90 days at sea",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Allium sativum",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Jan – Apr (fresh) · year-round (IQF)",
    regions: "Beni Suef · Minya",
    subtypes: [
      {
        name: "Baladi",
        months: monthRange(1, 4),
        peak: "Feb – Mar",
        tag: "Main line",
        detail: "The pungent purple-streaked local garlic — the flavour benchmark of the Egyptian kitchen.",
      },
      {
        name: "Chinese-type white",
        months: monthRange(1, 3),
        peak: "Feb",
        tag: "Large heads",
        detail: "Large, tight-headed white garlic from imported seed — milder and uniform for retail.",
      },
      {
        name: "Red",
        months: monthRange(2, 4),
        peak: "Mar",
        tag: "Late",
        detail: "Hard-neck red garlic holding the tail of the fresh window.",
      },
    ],
    packaging: ["2–20 kg nets · cartons · mesh", "IQF cloves/diced: 1 kg · 10 kg"],
    summary: "Pungent Baladi garlic, cold-stored well past the fresh window.",
    detail:
      "Egyptian garlic is prized for pungency. The fresh window runs January–April with cold storage extending supply for months; like onions it wants low humidity. Peeled cloves, dices and crushed formats are frozen year-round for convenience lines.",
    calendar: {
      fresh: {
        months: [1, 2, 3, 4],
        peak: "Feb – Mar",
        tempC: "0 °C",
        tempF: "32 °F",
        ventilation: "40–50 m³/h (high)",
        rh: "65–70%",
        shelfLife: "Up to 6 months cold-stored",
        transport: "Ventilated / reefer containers",
        note: "Low humidity storage.",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed May – Jun",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Peeled cloves, diced and crushed.",
      },
    },
  },
  {
    slug: "tomatoes",
    name: "Tomatoes",
    trade: {
      volume: "≈ 30,000 – 60,000 t",
      year: "2024/25",
      headline: "Regional tomato programme",
      share: "≈ 2–3% of world fresh-tomato trade, focused on Gulf and Eastern-European markets.",
      topImporters: ["Saudi Arabia", "UAE", "Russia", "Jordan", "Qatar"],
      transit: {
        fresh: "≤ 7–14 days at sea (mature-green at 10–13 °C)",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Solanum lycopersicum",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Year-round (greenhouse) · export peak Oct – Mar",
    regions: "Nubaria · Beheira · Sinai greenhouses",
    subtypes: [
      {
        name: "Cluster / on-the-vine",
        months: monthRange(10, 6),
        peak: "Nov – Feb",
        tag: "Main line",
        detail:
          "The flagship greenhouse line — five- and six-fruit trusses packed for retail through the European winter.",
      },
      {
        name: "Beef",
        months: monthRange(10, 5),
        peak: "Nov – Mar",
        tag: "Large",
        detail: "Large beefsteak fruit for Gulf retail and food service.",
      },
      {
        name: "Roma / plum",
        months: YEAR_ROUND,
        peak: "Oct – Mar",
        tag: "Year-round",
        detail: "The year-round plum line — greenhouse in winter, Delta field fruit through summer.",
      },
      {
        name: "Cherry",
        months: monthRange(11, 4),
        peak: "Dec – Feb",
        tag: "Premium",
        detail: "Snacking cherries in punnets — air-freight and premium sea programmes.",
      },
    ],
    packaging: ["2 kg cartons", "6 kg loose", "IQF: 10 kg bulk"],
    summary: "Greenhouse backbone keeps Egypt in the tomato market twelve months a year.",
    detail:
      "Sinai and Delta greenhouses produce year-round, with the export peak from October to March when European field supply disappears. IQF dices, peeled and whole cherry lines run from the summer processing crop on the opposite side of the calendar.",
    calendar: {
      fresh: {
        months: YEAR_ROUND,
        peak: "Oct – Mar",
        tempC: "10–12 °C",
        tempF: "50–54 °F",
        ventilation: "20–25 m³/h",
        rh: "90–95%",
        shelfLife: "1–2 weeks",
        transport: "Reefer sea freight",
        note: "Mature-green fruit tolerates 13 °C; never refrigerate ripe tomatoes below 10 °C.",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Mar – Sep",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "IQF dices, peeled and cherry-whole from the summer processing crop.",
      },
    },
  },
  {
    slug: "bell-peppers",
    name: "Bell & Sweet Peppers",
    trade: {
      volume: "≈ 60,000 – 100,000 t",
      year: "2024/25",
      headline: "Notable world pepper supplier",
      share: "≈ 5–8% of global pepper exports; colour-mix programmes for EU and Russian retail.",
      topImporters: ["Russia", "UK", "Netherlands", "Germany", "Saudi Arabia"],
      transit: {
        fresh: "≤ 14–21 days at sea at 7–10 °C",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Capsicum annuum",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Oct – Jun (fresh) · year-round (IQF)",
    regions: "Beheira · Nubaria · Ismailia (greenhouses)",
    subtypes: [
      {
        name: "Green blocky",
        months: monthRange(10, 3),
        peak: "Nov – Feb",
        tag: "Volume",
        detail: "The volume colour — picked green through the first half of the season.",
      },
      {
        name: "Red blocky",
        months: monthRange(11, 6),
        peak: "Dec – Mar",
        tag: "Main line",
        detail: "Fully coloured reds from December — the anchor of colour-mix programmes.",
      },
      {
        name: "Yellow blocky",
        months: monthRange(12, 5),
        peak: "Jan – Mar",
        tag: "Colour mix",
        detail: "Bright yellows for the three-colour retail mix.",
      },
      {
        name: "Orange blocky",
        months: monthRange(1, 4),
        peak: "Feb – Mar",
        tag: "Niche",
        detail: "Orange specialty peppers for premium mixes.",
      },
    ],
    packaging: ["5 kg cartons", "250 / 500 g retail packs", "IQF dice/strips: 10 kg"],
    summary: "The coloured-pepper winter greenhouse trade — volumes to Europe have tripled.",
    detail:
      "Egyptian greenhouse peppers anchor winter Mediterranean programmes with red, yellow and orange blocky fruit from October to June. Coloured dices, strips and rings feed the IQF food-service trade all year.",
    calendar: {
      fresh: {
        months: monthRange(10, 6),
        peak: "Nov – Feb",
        tempC: "7–10 °C",
        tempF: "45–50 °F",
        ventilation: "20–25 m³/h",
        rh: "90–95%",
        shelfLife: "2–3 weeks",
        transport: "Reefer sea freight · air freight",
        note: "Chilling injury below 7 °C — pitting and colour loss.",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Nov – Mar",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Red/green/yellow dices, strips and rings.",
      },
    },
  },
  {
    slug: "hot-peppers",
    name: "Hot Peppers",
    trade: {
      volume: "≈ 20,000 – 40,000 t",
      year: "2024/25",
      headline: "Gulf & UK hot-pepper supplier",
      share: "A regional line alongside the sweet-pepper programme.",
      topImporters: ["Saudi Arabia", "UAE", "UK", "Netherlands", "Russia"],
      transit: {
        fresh: "≤ 14–21 days at sea",
      },
    },
    latin: "Capsicum frutescens / annuum",
    category: "vegetable",
    formats: ["fresh"],
    season: "Sep – May",
    regions: "Delta",
    subtypes: [
      {
        name: "Green chili (8–12 cm)",
        months: monthRange(9, 2),
        peak: "Nov – Dec",
        tag: "Main line",
        detail: "The green finger chili — the volume line for Gulf and UK ethnic retail.",
      },
      {
        name: "Red chili",
        months: monthRange(11, 5),
        peak: "Jan – Feb",
        tag: "Coloured",
        detail: "Fully red fruit for programmes that want colour as well as heat.",
      },
      {
        name: "Bird's-eye",
        months: monthRange(10, 4),
        peak: "Dec – Jan",
        tag: "Hot",
        detail: "Small, fiercely hot pods for South-East-Asian and African markets.",
      },
    ],
    packaging: ["3 / 5 kg cartons"],
    summary: "Fresh chili riding Egypt's world-leading pepper platform.",
    detail:
      "Egypt is the world's largest dried-chili exporter, and fresh hot peppers ride the same winter infrastructure — 8–12 cm red and green chili plus bird's-eye grades for ethnic and food-service markets.",
    calendar: {
      fresh: {
        months: monthRange(9, 5),
        peak: "Nov – Feb",
        tempC: "7–10 °C",
        tempF: "45–50 °F",
        ventilation: "20–25 m³/h",
        rh: "90–95%",
        shelfLife: "2–3 weeks",
        transport: "Air freight · reefer",
        note: "Chilling-sensitive, like bell peppers.",
      },
    },
  },
  {
    slug: "cucumbers",
    name: "Cucumbers",
    trade: {
      volume: "≈ 20,000 – 40,000 t",
      year: "2024/25",
      headline: "Regional cucumber programme",
      share: "A Gulf- and Russia-focused winter line from Delta greenhouses.",
      topImporters: ["Saudi Arabia", "UAE", "Kuwait", "Russia"],
      transit: {
        fresh: "≤ 10–14 days at sea at 10–12 °C",
      },
    },
    latin: "Cucumis sativus",
    category: "vegetable",
    formats: ["fresh"],
    season: "Oct – May",
    regions: "Delta · Sinai greenhouses",
    subtypes: [
      {
        name: "English / telegraph",
        months: monthRange(10, 5),
        peak: "Dec – Mar",
        tag: "Main line",
        detail: "Long, smooth greenhouse cucumbers film-wrapped for retail.",
      },
      {
        name: "Slicer",
        months: monthRange(11, 4),
        peak: "Jan – Mar",
        tag: "Short",
        detail: "Thicker slicer types for Gulf wholesale and food service.",
      },
    ],
    packaging: ["12-count / 24-count cartons"],
    summary: "Greenhouse cucumbers through the European winter.",
    detail:
      "English and slicer cucumbers from Delta and Sinai greenhouses supply winter programmes. Cucumbers are distinctly chilling-sensitive — the warmest setpoint in the vegetable catalogue alongside eggplant.",
    calendar: {
      fresh: {
        months: monthRange(10, 5),
        peak: "Dec – Mar",
        tempC: "10–12 °C",
        tempF: "50–54 °F",
        ventilation: "20–25 m³/h",
        rh: "90–95%",
        shelfLife: "10–14 days",
        transport: "Reefer sea freight",
        note: "Chilling injury below 10 °C.",
      },
    },
  },
  {
    slug: "green-peas",
    name: "Green Peas",
    trade: {
      volume: "≈ 10,000 – 30,000 t (mostly IQF)",
      year: "2024/25",
      headline: "Steady IQF pea programme",
      share: "Part of Egypt's ≈ $296 M frozen-vegetable exports — the world's #8 frozen-veg exporter.",
      topImporters: ["UK", "Germany", "Netherlands", "Belgium", "France"],
      transit: {
        fresh: "≤ 7–10 days",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Pisum sativum",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Nov – Apr (fresh) · year-round (IQF)",
    regions: "Delta winter",
    subtypes: [
      {
        name: "Garden peas",
        months: monthRange(11, 4),
        peak: "Jan – Mar",
        tag: "Main line",
        detail: "Standard shelling peas — the raw material of the IQF programme and a small fresh winter line.",
      },
      {
        name: "Petit pois",
        months: monthRange(1, 3),
        peak: "Feb",
        tag: "Fine grade",
        detail: "Small, ultra-sweet petit pois frozen within hours of picking.",
      },
    ],
    packaging: ["2 / 3 kg fresh bags", "10 kg fresh bulk", "IQF: 400 g / 1 kg / 2.5 kg retail · 10 kg bulk"],
    summary: "Sweet, size-graded peas — almost all volume flows to IQF.",
    detail:
      "Egyptian garden peas and petit pois are shelled and blanched within hours of picking, locking sweetness and colour for the frozen trade. Fresh peas are a small winter line for Gulf and EU markets.",
    calendar: {
      fresh: {
        months: monthRange(11, 4),
        peak: "Jan – Mar",
        tempC: "0–1 °C",
        tempF: "32–34 °F",
        ventilation: "15–20 m³/h",
        rh: "95–98%",
        shelfLife: "1–2 weeks",
        transport: "Air freight",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Jan – Mar",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Standard, fine and extra-fine (petit pois) grades.",
      },
    },
  },
  {
    slug: "eggplants",
    name: "Eggplants",
    trade: {
      volume: "≈ 30,000 – 60,000 t",
      year: "2024/25",
      headline: "Major Gulf eggplant supplier",
      share: "From a top-5 world production base — a staple of the Gulf vegetable basket.",
      topImporters: ["Saudi Arabia", "Kuwait", "UAE", "Jordan", "Russia"],
      transit: {
        fresh: "≤ 7–14 days at sea at 10–12 °C",
      },
    },
    latin: "Solanum melongena",
    category: "vegetable",
    formats: ["fresh"],
    season: "Sep – Jun",
    regions: "Delta · greenhouses",
    subtypes: [
      {
        name: "Black Roumy",
        months: monthRange(9, 6),
        peak: "Nov – Feb",
        tag: "Main line",
        detail: "The classic wide oval purple aubergine of Egyptian cooking — the volume export line.",
      },
      {
        name: "Black Arous",
        months: monthRange(10, 5),
        peak: "Dec – Feb",
        tag: "Elongated",
        detail: "The slender 'bride' aubergine prized for grilling across Gulf kitchens.",
      },
      {
        name: "White Arous",
        months: monthRange(10, 3),
        peak: "Nov – Dec",
        tag: "Specialty",
        detail: "Creamy-white specialty fruit for niche programmes.",
      },
    ],
    packaging: ["5 / 6 kg cartons"],
    summary: "Long-season aubergine for Gulf and ethnic European markets.",
    detail:
      "Egyptian eggplant runs from the autumn winter fields through the summer field crop, shipping to Gulf and diaspora markets. Warm setpoint — eggplant shows chilling injury within a week below 10 °C.",
    calendar: {
      fresh: {
        months: monthRange(9, 6),
        peak: "Nov – Feb",
        tempC: "10–12 °C",
        tempF: "50–54 °F",
        ventilation: "20–25 m³/h",
        rh: "90–95%",
        shelfLife: "1–2 weeks",
        transport: "Reefer sea freight",
        note: "Chilling injury within 6–8 days at 5 °C.",
      },
    },
  },
  {
    slug: "courgettes",
    name: "Courgettes",
    trade: {
      volume: "≈ 20,000 – 40,000 t",
      year: "2024/25",
      headline: "Gulf & Northern-Europe courgette line",
      share: "Winter counter-seasonal supply for UK, Dutch and Gulf programmes.",
      topImporters: ["Saudi Arabia", "UAE", "UK", "Netherlands", "Russia"],
      transit: {
        fresh: "≤ 10–14 days at sea at 7–10 °C",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Cucurbita pepo",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Oct – Jun (fresh) · year-round (IQF)",
    regions: "Delta winter · greenhouses",
    subtypes: [
      {
        name: "Classic green",
        months: monthRange(10, 6),
        peak: "Dec – Mar",
        tag: "Main line",
        detail: "Straight, dark-green courgettes through the European winter gap.",
      },
      {
        name: "Yellow",
        months: monthRange(11, 4),
        peak: "Jan – Feb",
        tag: "Niche",
        detail: "Golden courgettes for mixed-colour retail packs.",
      },
    ],
    packaging: ["4 / 5 kg cartons", "IQF slices/dices: 10 kg"],
    summary: "Tender winter squash bridging the European supply gap.",
    detail:
      "Delta winter production and greenhouses keep courgettes moving from October well into June. IQF slices and dices serve soup and ready-meal manufacturers year-round.",
    calendar: {
      fresh: {
        months: monthRange(10, 6),
        peak: "Dec – Mar",
        tempC: "5–10 °C",
        tempF: "41–50 °F",
        ventilation: "20–25 m³/h",
        rh: "90–95%",
        shelfLife: "1–2 weeks",
        transport: "Reefer sea freight",
        note: "Moderately chilling-sensitive.",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Nov – Apr",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Slices and dices.",
      },
    },
  },
  {
    slug: "carrots",
    name: "Carrots",
    trade: {
      volume: "≈ 30,000 – 50,000 t",
      year: "2024/25",
      headline: "Regional carrot supplier",
      share: "Delta and reclaimed-land carrots shipped as top-iced reefer loads.",
      topImporters: ["Russia", "Saudi Arabia", "UAE", "UK"],
      transit: {
        fresh: "≤ 30–45 days at sea (top-iced)",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Daucus carota subsp. sativus",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Nov – Apr (fresh) · year-round (IQF)",
    regions: "Beheira · Nubaria winter",
    subtypes: [
      {
        name: "Nantes",
        months: monthRange(11, 4),
        peak: "Dec – Feb",
        tag: "Main line",
        detail: "Cylindrical, blunt-tipped Nantes types — the sweet standard of the winter carrot trade.",
      },
      {
        name: "Chantenay",
        months: monthRange(11, 3),
        peak: "Dec – Jan",
        tag: "Processing",
        detail: "Shorter, thicker Chantenay roots — the dice-grade material behind IQF blends.",
      },
    ],
    packaging: ["10 kg bags", "450 g / 1 kg wash-ready retail", "IQF dice/slices: 10 kg"],
    summary: "Winter roots for juicing and retail, plus dice-grade IQF carrots.",
    detail:
      "Nantes and Chantenay carrots from the winter Delta pack both washed retail bags and industrial juicing volumes. Dice-grade roots feed the IQF blend trade — the backbone of mixed-vegetable programmes.",
    calendar: {
      fresh: {
        months: monthRange(11, 4),
        peak: "Dec – Feb",
        tempC: "0–1 °C",
        tempF: "32–34 °F",
        ventilation: "20–25 m³/h",
        rh: "95–100%",
        shelfLife: "1–3 months (topped)",
        transport: "Reefer sea freight",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Dec – Apr",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Dices and slices for blends.",
      },
    },
  },
  {
    slug: "lettuce",
    name: "Lettuce & Baby Leaf",
    trade: {
      volume: "≈ 10,000 – 25,000 t",
      year: "2024/25",
      headline: "Winter salad supplier",
      share: "Vacuum-cooled winter lettuce and baby leaf for Gulf and European retail programmes.",
      topImporters: ["Saudi Arabia", "UAE", "UK", "Russia"],
      transit: {
        fresh: "≤ 7–10 days (vacuum-cooled)",
      },
    },
    latin: "Lactuca sativa",
    category: "vegetable",
    formats: ["fresh"],
    season: "Oct – Apr",
    regions: "Delta winter · greenhouses",
    subtypes: [
      {
        name: "Iceberg",
        months: monthRange(10, 4),
        peak: "Dec – Feb",
        tag: "Main line",
        detail: "Dense, crisp heads vacuum-cooled for long reefer voyages.",
      },
      {
        name: "Romaine",
        months: monthRange(10, 3),
        peak: "Dec – Jan",
        tag: "Volume",
        detail: "Upright cos hearts for Gulf retail and Caesar programmes.",
      },
      {
        name: "Lollo",
        months: monthRange(11, 2),
        peak: "Dec",
        tag: "Specialty",
        detail: "Fringed lollo rosso and bionda leaves for premium salad mixes.",
      },
      {
        name: "Baby-leaf mixes",
        months: monthRange(10, 4),
        peak: "Nov – Mar",
        tag: "Value-added",
        detail: "Washed rocket, chard and spinach blends in retail bags — the value-added salad line.",
      },
    ],
    packaging: ["6 / 12-head cartons", "200–500 g baby-leaf bags"],
    summary: "Iceberg core with value-added baby-leaf mixes.",
    detail:
      "Whole-head iceberg and romaine move in bulk cartons while washed baby-leaf mixes — rocket, chard, spinach blends — take Egypt's value-added salad trade upmarket. Near-freezing setpoints and high humidity hold crispness on reefer voyages.",
    calendar: {
      fresh: {
        months: monthRange(10, 4),
        peak: "Dec – Feb",
        tempC: "0–1 °C",
        tempF: "32–34 °F",
        ventilation: "15–20 m³/h",
        rh: "95%+",
        shelfLife: "2–3 weeks",
        transport: "Reefer sea freight · air freight (baby leaf)",
        note: "Ice-free cooling; avoid freezing the wrapper leaves.",
      },
    },
  },
  {
    slug: "cabbage",
    name: "Cabbage",
    trade: {
      volume: "≈ 20,000 – 40,000 t",
      year: "2024/25",
      headline: "Regional cabbage programme",
      share: "A durable long-transit brassica for Russian and Gulf buying programmes.",
      topImporters: ["Russia", "Saudi Arabia", "UAE", "UK"],
      transit: {
        fresh: "≤ 30–45 days at sea",
      },
    },
    latin: "Brassica oleracea var. capitata",
    category: "vegetable",
    formats: ["fresh"],
    season: "Sep – Apr",
    regions: "Delta winter",
    subtypes: [
      {
        name: "Green / white",
        months: monthRange(9, 4),
        peak: "Dec – Feb",
        tag: "Main line",
        detail: "Dense storage heads that hold condition through long Russian and Gulf voyages.",
      },
      {
        name: "Red",
        months: monthRange(10, 2),
        peak: "Dec – Jan",
        tag: "Niche",
        detail: "Deep-red heads for colour retail packs.",
      },
    ],
    packaging: ["8–10 head cartons", "Nets"],
    summary: "Storable winter brassica for Russia and Gulf programmes.",
    detail:
      "A workhorse of the winter brassica trade — dense green and red heads that hold condition for weeks at near-freezing temperatures, packed loose or netted for volume markets.",
    calendar: {
      fresh: {
        months: monthRange(9, 4),
        peak: "Dec – Feb",
        tempC: "0–1 °C",
        tempF: "32–34 °F",
        ventilation: "20–25 m³/h",
        rh: "95–100%",
        shelfLife: "3–6 weeks",
        transport: "Reefer sea freight",
      },
    },
  },
  {
    slug: "cauliflower",
    name: "Cauliflower",
    trade: {
      volume: "≈ 20,000 – 40,000 t",
      year: "2024/25",
      headline: "Gulf & Europe winter cauliflower",
      share: "Wrapped-curded winter lines for Gulf and Northern-European programmes.",
      topImporters: ["Saudi Arabia", "UAE", "Russia", "UK", "Netherlands"],
      transit: {
        fresh: "≤ 14–21 days at sea",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Brassica oleracea var. botrytis",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Sep – Apr (fresh) · year-round (IQF)",
    regions: "Delta winter",
    subtypes: [
      {
        name: "Snowball-type white",
        months: monthRange(9, 4),
        peak: "Dec – Mar",
        tag: "Main line",
        detail:
          "Snow-white self-wrapping curds — film-wrapped heads for fresh, with the same crop feeding the IQF floret trade.",
      },
      {
        name: "Romanesco",
        months: monthRange(10, 2),
        peak: "Dec",
        tag: "Specialty",
        detail: "Spiralled green curds in small volumes for specialty programmes.",
      },
    ],
    packaging: ["6 / 10 kg cartons (film-wrapped heads)", "IQF florets: 10 kg · 2.5 kg retail"],
    summary: "Snow-white winter curds feeding both fresh and IQF floret lines.",
    detail:
      "Film-wrapped fresh curds ship through the winter while the same crop feeds IQF floret production for frozen programmes. Trimmed, cored and blanched within hours of cutting.",
    calendar: {
      fresh: {
        months: monthRange(9, 4),
        peak: "Dec – Mar",
        tempC: "0–1 °C",
        tempF: "32–34 °F",
        ventilation: "20–25 m³/h",
        rh: "95%",
        shelfLife: "3–4 weeks",
        transport: "Reefer sea freight",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Nov – Apr",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Florets.",
      },
    },
  },
  {
    slug: "celery",
    name: "Celery",
    trade: {
      volume: "≈ 10,000 – 20,000 t",
      year: "2024/25",
      headline: "Regional celery line",
      share: "Winter celery for Gulf and Russian programmes.",
      topImporters: ["Saudi Arabia", "UAE", "Russia", "UK"],
      transit: {
        fresh: "≤ 14–21 days at sea",
      },
    },
    latin: "Apium graveolens",
    category: "vegetable",
    formats: ["fresh"],
    season: "Oct – Apr",
    regions: "Delta winter",
    subtypes: [
      {
        name: "Green / Pascal",
        months: monthRange(10, 4),
        peak: "Dec – Feb",
        tag: "Single line",
        detail: "Crisp Pascal-type petioles — the one commercial celery type Egypt grows.",
      },
    ],
    packaging: ["10–12 kg cartons"],
    summary: "A small winter line for Gulf and EU soup programmes.",
    detail:
      "Pascal-type celery from the winter Delta packs into cartons for Gulf retail and European soup processors. High humidity and rapid cooling keep the petioles crisp.",
    calendar: {
      fresh: {
        months: monthRange(10, 4),
        peak: "Dec – Feb",
        tempC: "0–1 °C",
        tempF: "32–34 °F",
        ventilation: "15–20 m³/h",
        rh: "95%+",
        shelfLife: "2–4 weeks",
        transport: "Reefer sea freight",
      },
    },
  },
  {
    slug: "fresh-herbs",
    name: "Fresh Herbs",
    trade: {
      volume: "≈ 8,000 – 15,000 t fresh",
      year: "2024",
      headline: "Top-3 EU winter herb supplier",
      share:
        "≈ 5,100 t to the EU alone in 2024, growing ≈ 21% a year, and the #1 herb supplier to Russia; the wider herb complex (incl. dried) is worth ≈ $330 M.",
      topImporters: ["UK", "Netherlands", "Germany", "Saudi Arabia", "UAE", "Russia"],
      transit: {
        fresh: "≤ 3–5 days air freight (10–14 days by sea with modified atmosphere)",
      },
    },
    latin: "Petroselinum crispum & others",
    category: "vegetable",
    formats: ["fresh"],
    season: "Year-round (winter emphasis Oct – May)",
    regions: "Qalyubia · Beheira · Monufiya · Upper Egypt (winter)",
    subtypes: [
      {
        name: "Parsley (curly & flat)",
        months: YEAR_ROUND,
        peak: "Oct – May",
        tag: "Main line",
        detail: "The anchor of the herb programme — bunched curly and flat-leaf parsley twelve months a year.",
      },
      {
        name: "Mint",
        months: YEAR_ROUND,
        peak: "Oct – May",
        tag: "Year-round",
        detail: "Garden mint from the Delta winter and Upper-Egypt summer for continuous supply.",
      },
      {
        name: "Chives",
        months: YEAR_ROUND,
        peak: "Oct – May",
        tag: "Year-round",
        detail: "Chives flow all year, with Upper-Egypt farms covering the summer months.",
      },
      {
        name: "Coriander",
        months: monthRange(10, 4),
        peak: "Dec – Feb",
        tag: "Winter",
        detail: "Fragrant coriander bunches through the cool months.",
      },
      {
        name: "Dill",
        months: monthRange(10, 4),
        peak: "Dec – Feb",
        tag: "Winter",
        detail: "Fine, feathery dill for Scandinavian and Eastern-European retail.",
      },
      {
        name: "Rocket",
        months: monthRange(10, 5),
        peak: "Nov – Mar",
        tag: "Salad",
        detail: "Peppery rocket bunches and baby leaf for salad programmes.",
      },
      {
        name: "Basil",
        months: monthRange(5, 10),
        peak: "Jun – Sep",
        tag: "Summer",
        detail: "Summer basil from Upper Egypt — always shipped at 10–12 °C, segregated from cold herb loads.",
      },
    ],
    packaging: ["20–50 g bunches (12–24 per carton)", "2–4 kg vented cartons"],
    summary: "The classic air-freight herb platform — twelve months, a dozen varieties.",
    detail:
      "Egypt supplies European retail herbs year-round, with the winter programme (Oct–May) flowing from Qalyubia and Beheira and Upper-Egypt farms covering the summer. Basil is the exception: it travels at 10–12 °C, always segregated from 0–2 °C herb loads. Herbs bill by volume — freight weight exceeds net weight.",
    calendar: {
      fresh: {
        months: YEAR_ROUND,
        peak: "Oct – May",
        tempC: "0–2 °C",
        tempF: "32–36 °F",
        ventilation: "15–20 m³/h",
        rh: "95%+",
        shelfLife: "7–14 days",
        transport: "Air freight (primary)",
        note: "Basil kept separate at 10–12 °C — chilling injury below 10 °C.",
      },
    },
  },
  {
    slug: "spring-onions",
    name: "Spring Onions",
    trade: {
      volume: "≈ 10,000 – 20,000 t",
      year: "2024/25",
      headline: "Steady EU & Gulf salad-onion line",
      share: "Bundle-packed spring onions for retail salad programmes.",
      topImporters: ["UK", "Netherlands", "Russia", "Saudi Arabia"],
      transit: {
        fresh: "≤ 7–14 days at sea",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Allium fistulosum",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Jan – Apr · Sep – Dec (two-region relay)",
    regions: "Upper Egypt (spring) · Delta (autumn)",
    subtypes: [
      {
        name: "White Lisbon-type",
        months: [1, 2, 3, 4, 9, 10, 11, 12],
        peak: "Feb – Apr",
        tag: "Main line",
        detail: "The classic white-rooted salad onion carrying both legs of the two-region relay.",
      },
      {
        name: "Red-rooted",
        months: [9, 10, 11, 12],
        peak: "Oct – Nov",
        tag: "Autumn",
        detail: "Red-rooted bunching onions from the Delta autumn crop.",
      },
    ],
    packaging: ["8 / 12-bunch cartons (~100 g bunches)", "IQF chopped: 10 kg"],
    summary: "A two-region relay keeps bunched onions in market seven-plus months.",
    detail:
      "Upper Egypt supplies the February–June spring window before the Delta autumn crop takes over from September — the relay covers most of the year. IQF chopped and sliced formats serve garnish and ready-meal buyers.",
    calendar: {
      fresh: {
        months: [1, 2, 3, 4, 9, 10, 11, 12],
        peak: "Feb – Jun",
        tempC: "0–1 °C",
        tempF: "32–34 °F",
        ventilation: "20–25 m³/h",
        rh: "95–100%",
        shelfLife: "2–3 weeks",
        transport: "Reefer sea freight",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Nov – Feb",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Chopped and sliced garnish grades.",
      },
    },
  },
  {
    slug: "molokhia",
    name: "Molokhia",
    trade: {
      volume: "≈ 5,000 – 10,000 t fresh + 10,000 – 20,000 t IQF",
      year: "2024/25",
      headline: "Effectively the world's only commercial origin",
      share: "Egyptian molokhia dominates world supply in both fresh and frozen form.",
      topImporters: ["Saudi Arabia", "Kuwait", "UAE", "Jordan", "USA", "UK"],
      transit: {
        fresh: "≤ 3–5 days — air freight",
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Corchorus olitorius",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "May – Oct (fresh) · year-round (IQF)",
    regions: "Delta · Middle Egypt",
    subtypes: [
      {
        name: "Baladi molokhia",
        months: monthRange(5, 10),
        peak: "Jun – Sep",
        tag: "Single cultivar",
        detail:
          "The one local cultivar — summer leaf harvest feeding both air-freight fresh bundles and the IQF minced trade.",
      },
    ],
    packaging: ["IQF: 400 / 500 g retail (dominant) · 10 kg bulk", "Fresh: 2 / 3 kg bags (air)"],
    summary: "The definitive Egyptian frozen herb for MENA and diaspora retail.",
    detail:
      "Molokhia is overwhelmingly a frozen product — minced and whole-leaf IQF formats dominate MENA retail shelves from Cairo to London and Detroit. Fresh summer leaves move by air in smaller volumes.",
    calendar: {
      fresh: {
        months: monthRange(5, 10),
        peak: "Jun – Sep",
        tempC: "0–4 °C",
        tempF: "32–39 °F",
        ventilation: "Air freight — no reefer vents",
        rh: "95%",
        shelfLife: "3–7 days",
        transport: "Air freight",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Jun – Sep",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Minced and whole-leaf formats.",
      },
    },
  },
  {
    slug: "sweet-corn",
    name: "Sweet Corn",
    trade: {
      volume: "≈ 10,000 – 20,000 t",
      year: "2024/25",
      headline: "Growing IQF sweet-corn line",
      share: "Part of Egypt's ≈ $296 M frozen-vegetable export programme (world #8).",
      topImporters: ["Saudi Arabia", "UAE", "UK", "Netherlands", "Russia"],
      transit: {
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Zea mays var. saccharata",
    category: "vegetable",
    formats: ["frozen"],
    season: "Year-round (IQF) · packed Jun – Sep",
    regions: "Delta summer",
    subtypes: [
      {
        name: "Yellow supersweet (sh2)",
        months: monthRange(6, 9),
        peak: "Jul – Aug",
        tag: "Packing window",
        detail:
          "Supersweet kernels harvested and blanched the same day through the Delta summer, then held year-round at −18 °C.",
      },
    ],
    packaging: ["10 kg bulk", "400 g retail bags"],
    summary: "Summer corn frozen within hours of picking.",
    detail:
      "Supersweet varieties are harvested and blanched on the same day through the Delta summer, locking sugar before it converts to starch. Kernels pack for retail and bulk food service.",
    calendar: {
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Jun – Sep",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "IQF kernels.",
      },
    },
  },
  {
    slug: "broad-beans",
    name: "Broad Beans (Ful)",
    trade: {
      volume: "≈ 90,000 t dried fava, plus IQF",
      year: "2024 (≈ $47.8 M)",
      headline: "World's #2 dried-fava exporter",
      share: "≈ 7.9% of world dried-fava exports; the fresh and IQF crop serves Gulf and Mediterranean buyers.",
      topImporters: ["Saudi Arabia", "Libya", "Sudan", "Jordan"],
      transit: {
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Vicia faba",
    category: "vegetable",
    formats: ["frozen"],
    season: "Year-round (IQF) · packed Jan – May",
    regions: "Delta winter",
    subtypes: [
      {
        name: "Unpeeled ful",
        months: monthRange(1, 5),
        peak: "Feb – Apr",
        tag: "Traditional",
        detail: "Skin-on whole beans for traditional ful medames programmes.",
      },
      {
        name: "Peeled ful",
        months: monthRange(1, 4),
        peak: "Feb – Mar",
        tag: "Convenience",
        detail: "Skin-off peeled beans — the convenience line for modern retail.",
      },
    ],
    packaging: ["10 kg bulk", "400 / 500 g retail"],
    summary: "Classic Egyptian ful for diaspora and MENA markets.",
    detail:
      "Egypt's winter broad-bean crop is frozen as peeled and unpeeled ful medames, a staple retail line across the Middle East and diaspora markets in Europe and North America.",
    calendar: {
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Feb – Apr",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Peeled and unpeeled grades.",
      },
    },
  },
  {
    slug: "broccoli",
    name: "Broccoli",
    trade: {
      volume: "≈ 5,000 – 15,000 t",
      year: "2024/25",
      headline: "Growing IQF broccoli line",
      share: "New reclaimed-land broccoli feeding the frozen programme.",
      topImporters: ["Saudi Arabia", "UAE", "UK", "USA"],
      transit: {
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Brassica oleracea var. italica",
    category: "vegetable",
    formats: ["frozen"],
    season: "Year-round (IQF) · packed Nov – Apr",
    regions: "Delta winter",
    subtypes: [
      {
        name: "Calabrese-type",
        months: monthRange(11, 4),
        peak: "Dec – Mar",
        tag: "Packing window",
        detail: "Winter calabrese cut and floretted through the cool season, blanched and frozen within hours.",
      },
    ],
    packaging: ["10 kg bulk", "2.5 kg retail"],
    summary: "A rising Egyptian IQF line — winter florets, bright and firm.",
    detail:
      "Delta winter broccoli is cut, floretted and blanched through the cool season, producing the deep-green firm florets the frozen trade demands. Volumes have grown quickly as buyers diversify away from single origins.",
    calendar: {
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Dec – Mar",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Florets and stems.",
      },
    },
  },
  {
    slug: "spinach",
    name: "Spinach",
    trade: {
      volume: "≈ 10,000 – 20,000 t",
      year: "2024/25",
      headline: "Significant EU IQF spinach supplier",
      share: "Part of Egypt's world-#8 frozen-vegetable exports.",
      topImporters: ["Germany", "UK", "Netherlands", "USA", "Saudi Arabia"],
      transit: {
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Spinacia oleracea",
    category: "vegetable",
    formats: ["frozen"],
    season: "Year-round (IQF) · packed Oct – Apr",
    regions: "Delta",
    subtypes: [
      {
        name: "Savoy / semi-savoy",
        months: monthRange(10, 4),
        peak: "Nov – Feb",
        tag: "Packing window",
        detail: "Dark, blistered leaf blanched bright green through the Delta winter.",
      },
    ],
    packaging: ["10 kg bulk", "400 g / 2.5 kg retail"],
    summary: "Dark winter leaf blanched bright green.",
    detail:
      "Winter Delta spinach is washed, blanched and individually quick frozen as whole leaf, chopped leaf and portion formats within hours of cutting — colour retention is the specification.",
    calendar: {
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Nov – Feb",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Whole leaf, chopped and portions.",
      },
    },
  },
  {
    slug: "mixed-vegetables",
    name: "Mixed Vegetables",
    trade: {
      volume: "≈ 10,000 – 20,000 t",
      year: "2024/25",
      headline: "Gulf & EU blend programme",
      share: "Custom IQF blends for retail and food-service buyers.",
      topImporters: ["Saudi Arabia", "UAE", "Kuwait", "UK"],
      transit: {
        frozen: "≤ 90 days at −18 °C",
      },
    },
    latin: "Blends to recipe",
    category: "vegetable",
    formats: ["frozen"],
    season: "Year-round — blended from frozen stock",
    regions: "Delta-wide",
    subtypes: [
      {
        name: "California mix",
        months: YEAR_ROUND,
        tag: "Classic",
        detail: "The classic carrot, pea, green-bean and corn blend for retail and food service.",
      },
      {
        name: "Two- & three-way blends",
        months: YEAR_ROUND,
        tag: "Simple blends",
        detail: "Simple pea-and-carrot and three-component blends packed to agreed ratios.",
      },
      {
        name: "Four-way & custom recipes",
        months: YEAR_ROUND,
        tag: "Custom",
        detail: "Four-way mixes and bespoke recipes blended and packed under buyer or private-label branding.",
      },
    ],
    packaging: ["400 / 450 g · 1 kg · 2.5 kg retail", "10 / 20 kg bulk"],
    summary: "Custom IQF blends built to buyer recipes, all twelve months.",
    detail:
      "Because every component is packed in its own harvest window and held at −18 °C, blends assemble year-round: peas, carrots, green beans, corn, broccoli and more, mixed to an agreed ratio and packed under buyer or private-label branding.",
    calendar: {
      frozen: {
        months: YEAR_ROUND,
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Blends assembled from frozen stock — availability all 12 months.",
      },
    },
  },
  {
    slug: "potato-fries",
    name: "Frozen Potato Fries",
    trade: {
      volume: "≈ 250,000 t",
      year: "2025 (≈ $330 M)",
      headline: "Egypt's fastest-growing processed line",
      share:
        "249,732 t in 2025 — up from just 75,000 t in 2021 (+920% in 2024 alone); ≈ 2% of world fries trade.",
      topImporters: ["Saudi Arabia", "UAE", "Kuwait", "Qatar", "Jordan", "Libya"],
      transit: {
        frozen: "≤ 90 days at −18 °C (12-month shelf life)",
      },
    },
    latin: "Solanum tuberosum (processing)",
    category: "vegetable",
    formats: ["frozen"],
    season: "Year-round — two contract harvests",
    regions: "Delta / Nubaria contract farms · 10th of Ramadan processing",
    subtypes: [
      {
        name: "Shoestring (7 mm)",
        months: YEAR_ROUND,
        tag: "Thin cut",
        detail: "7 mm thin-cut fries from Spunta and Lady Rosetta lines — the QSR standard.",
      },
      {
        name: "Regular cut (9 mm)",
        months: YEAR_ROUND,
        tag: "Main line",
        detail: "The 9 mm retail and catering standard cut.",
      },
      {
        name: "Crinkle-cut",
        months: YEAR_ROUND,
        tag: "Texture",
        detail: "Crinkle-cut fries with extra surface for crunch.",
      },
      {
        name: "Wedges (12 mm)",
        months: YEAR_ROUND,
        tag: "Thick cut",
        detail: "Thick, skin-on wedges for casual dining.",
      },
    ],
    packaging: ["450 g – 2.5 kg retail", "10 kg catering · 4 × 2.5 kg"],
    summary: "Egypt runs one of the region's largest fries platforms — 160,000+ t a year.",
    detail:
      "Contract farms feeding Delta and Nubaria processing plants — including operations of over 160,000 tonnes a year — produce shoestring, regular-cut and wedge fries for retail and QSR chains across MENA and beyond, from the same two potato harvests that supply the fresh trade.",
    calendar: {
      frozen: {
        months: YEAR_ROUND,
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        ventilation: "Closed (0 m³/h)",
        shelfLife: "24 months (best 12–18)",
        transport: "Reefer sea freight at −18 °C",
        note: "Produced year-round from the Feb–Jun and Sep–Dec harvests.",
      },
    },
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** Flagship lines shown on the homepage. */
export const featuredProducts = products.filter((p) => p.featured);

/** Every line available in fresh format. */
export const freshProducts = products.filter((p) => p.formats.includes("fresh"));

/** Every line available in IQF frozen format. */
export const frozenProducts = products.filter((p) => p.formats.includes("frozen"));

export const contactDetails = {
  email: "info@olymp-ex.com",
  phone: "+20 122 704 1884",
  whatsapp: "+20 122 704 1884",
  address: "Cairo, Egypt",
  note: "Commercial enquiries answered within one business day.",
};
