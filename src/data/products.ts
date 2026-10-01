/**
 * Olymp Ex product catalogue — Egyptian fresh & frozen (IQF) export lines.
 *
 * Seasonality (export availability months, 1 = January … 12 = December) and
 * cold-chain temperatures are compiled from Egyptian export-trade sources
 * and standard postharvest references (UC Davis produce fact sheets),
 * cross-checked against reefer setpoints used by Egyptian exporters.
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
  /** Relative humidity, e.g. "90–95%". */
  rh?: string;
  /** Practical shelf life at temperature, e.g. "5–10 days". */
  shelfLife?: string;
  /** Usual transport mode for this format. */
  transport?: string;
  /** Cold-chain caution, e.g. chilling sensitivity. */
  note?: string;
}

export interface Product {
  slug: string;
  name: string;
  latin?: string;
  category: ProductCategory;
  formats: ProductFormat[];
  /** Display seasonality, e.g. "Nov – Apr (fresh) · year-round (IQF)". */
  season: string;
  /** Main Egyptian growing regions. */
  regions: string;
  varieties: string[];
  packaging: string[];
  summary: string;
  detail: string;
  /** Availability calendar + temperatures, per format. */
  calendar: Partial<Record<ProductFormat, FormatInfo>>;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

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

export const products: Product[] = [
  {
    slug: "strawberries",
    name: "Strawberries",
    latin: "Fragaria × ananassa",
    category: "fruit",
    formats: ["fresh", "frozen"],
    season: "Nov – Apr (fresh) · year-round (IQF)",
    regions: "Beheira · Nubaria · Qalyubia",
    varieties: ["Festival", "Fortuna", "Sensation", "Winter Dawn", "Sweet Charlie"],
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
        shelfLife: "24 months (best within 18)",
        transport: "Reefer sea freight at −18 °C",
        note: "Whole, sliced, diced and purée formats; calibrated and uncalibrated grades.",
      },
    },
  },
  {
    slug: "navel-oranges",
    name: "Navel Oranges",
    latin: "Citrus sinensis",
    category: "fruit",
    formats: ["fresh"],
    season: "Nov – Apr",
    regions: "Nubaria · Beheira · Minufiya (Delta new lands)",
    varieties: ["Washington Navel", "Navel Late"],
    packaging: ["15 kg telescopic cartons", "8 / 10 kg bags (Gulf trade)", "Bulk bins"],
    summary: "The opening act of Egypt's flagship citrus season — the world's largest fresh-orange export programme.",
    detail:
      "Egypt ships around 1.66 million tonnes of oranges a year, and Navel opens the season: graded on calibre, colour and skin finish, packed in telescopic cartons and palletised for high-cube reefer loading (25–28 t per 40' container). Documentation and phytosanitary handling are coordinated per destination.",
    calendar: {
      fresh: {
        months: monthRange(11, 4),
        peak: "Dec – Feb",
        tempC: "5–8 °C",
        tempF: "41–46 °F",
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
    latin: "Vitis vinifera",
    category: "fruit",
    formats: ["fresh", "frozen"],
    season: "May – Aug (fresh) · year-round (IQF niche)",
    regions: "Beheira · Nubaria · Minya",
    varieties: [
      "Early Sweet",
      "Superior",
      "Prime",
      "Flame Seedless",
      "Red Globe",
      "Crimson Seedless",
      "Autumn Royal",
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
        rh: "90–95%",
        shelfLife: "3–6 weeks (Crimson to 8)",
        transport: "Reefer sea freight · air freight",
        note: "Pre-cool within 8 hours of harvest; SO₂ generator pads on long hauls.",
      },
      frozen: {
        months: YEAR_ROUND,
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Niche line — whole and halves for bakery/pastry buyers.",
      },
    },
  },
  {
    slug: "pomegranates",
    name: "Pomegranates",
    latin: "Punica granatum",
    category: "fruit",
    formats: ["fresh", "frozen"],
    season: "Aug – Jan (fresh) · year-round (arils)",
    regions: "Minya · Assiut (Manfalout) · Beheira · Fayoum",
    varieties: ["Early 116", "Baladi", "Manfalouty", "Wonderful"],
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
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "IQF arils — Wonderful-class deep-red colour.",
      },
    },
  },
  {
    slug: "green-beans",
    name: "Green Beans",
    latin: "Phaseolus vulgaris",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Oct – May (fresh) · year-round (IQF)",
    regions: "Beheira · Qalyubia · Ismailia",
    varieties: ["Fine", "Extra fine", "Bobby"],
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
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "IQF whole, cut and French-cut formats.",
      },
    },
  },
  {
    slug: "artichokes",
    name: "Artichokes",
    latin: "Cynara cardunculus var. scolymus",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Nov – Apr (fresh) · year-round (IQF)",
    regions: "Beheira · Alexandria / Mariut · Qalyubia",
    varieties: ["Baladi green globe", "Local violet"],
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
        shelfLife: "6–8 months (practical)",
        transport: "Reefer sea freight at −18 °C",
        note: "Shorter practical life than other IQF lines — agree programme timing before the season opens.",
      },
    },
  },
  {
    slug: "okra",
    name: "Okra",
    latin: "Abelmoschus esculentus",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "May – Nov (fresh) · year-round (IQF)",
    regions: "Delta · Beheira · Upper Egypt",
    varieties: ["Baladi short-pod", "Hybrids"],
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
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Whole Extra / Zero / Fine / One grades plus cut formats.",
      },
    },
  },
  {
    slug: "mangoes",
    name: "Mangoes",
    latin: "Mangifera indica",
    category: "fruit",
    formats: ["fresh", "frozen"],
    season: "Jun – Dec (fresh) · year-round (IQF)",
    regions: "Ismailia · Sharkia · Beheira · Qalyubia",
    varieties: ["Ewais", "Zebdeya", "Naomi", "Alphonso", "Kent", "Keitt", "Tommy Atkins", "Fajri"],
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
        shelfLife: "24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "IQF chunks, dices, slices and purée.",
      },
    },
  },
  {
    slug: "valencia-oranges",
    name: "Valencia Oranges",
    latin: "Citrus sinensis",
    category: "fruit",
    formats: ["fresh"],
    season: "Feb – Jul",
    regions: "Nubaria (largest Valencia district) · Delta",
    varieties: ["Valencia", "Valencia Late"],
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
        rh: "85–90%",
        shelfLife: "4–8 weeks",
        transport: "Reefer sea freight (2–4 °C on long hauls)",
      },
    },
  },
  {
    slug: "mandarins",
    name: "Mandarins & Clementines",
    latin: "Citrus reticulata",
    category: "fruit",
    formats: ["fresh"],
    season: "Nov – Apr",
    regions: "Beheira · Minufiya · Nubaria",
    varieties: ["Fremont", "Clementine", "Minneola", "Murcott", "W. Murcott", "Baladi"],
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
    latin: "Citrus limon",
    category: "fruit",
    formats: ["fresh"],
    season: "Dec – Jul (yellow) · Aug – Oct (green lime)",
    regions: "Delta · Nubaria",
    varieties: ["Eureka (Adalia)", "Lisbon", "Baladi", "Green lime"],
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
    latin: "Citrus × paradisi",
    category: "fruit",
    formats: ["fresh"],
    season: "Nov – May",
    regions: "Delta new lands",
    varieties: ["Star Ruby", "Ruby Red", "Marsh"],
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
    latin: "Citrullus lanatus",
    category: "fruit",
    formats: ["fresh"],
    season: "Apr – Oct",
    regions: "Beheira · Ismailia · Sharqiya · Aswan (early crop)",
    varieties: ["Red seedless", "Red seeded", "Yellow-flesh (minor)"],
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
    latin: "Cucumis melo",
    category: "fruit",
    formats: ["fresh"],
    season: "Apr – Sep",
    regions: "Beheira · Ismailia · Sharqiya (tunnel-early Feb–Mar)",
    varieties: ["Galia", "Cantaloupe", "Honeydew"],
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
        rh: "90–95%",
        shelfLife: "2–4 weeks (cantaloupe 10–14 days)",
        transport: "Reefer sea freight",
        note: "Cantaloupe tolerates 2–5 °C; galia and honeydew are chilling-sensitive above 7 °C.",
      },
    },
  },
  {
    slug: "peaches-nectarines",
    name: "Peaches & Nectarines",
    latin: "Prunus persica",
    category: "fruit",
    formats: ["fresh", "frozen"],
    season: "Apr – Jun (fresh) · year-round (IQF slices)",
    regions: "Beheira · Qalyubia · Minya (low-chill districts)",
    varieties: ["Florida Prince", "Dessert (Gold)", "Swiling", "Early low-chill nectarines"],
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
        rh: "90–95%",
        shelfLife: "2–4 weeks",
        transport: "Reefer sea freight · air freight",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed May – Jul",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Small-volume IQF slices and dices.",
      },
    },
  },
  {
    slug: "apricots",
    name: "Apricots",
    latin: "Prunus armeniaca",
    category: "fruit",
    formats: ["fresh", "frozen"],
    season: "May – Jul (fresh) · year-round (IQF)",
    regions: "Delta · Middle Egypt",
    varieties: ["Local Canino-type"],
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
        rh: "90–95%",
        shelfLife: "1–3 weeks",
        transport: "Air freight · reefer",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed May – Jul",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Small-volume processing line.",
      },
    },
  },
  {
    slug: "dates",
    name: "Dates",
    latin: "Phoenix dactylifera",
    category: "fruit",
    formats: ["fresh"],
    season: "Sep – Mar (Ramadan-driven)",
    regions: "Siwa · Aswan · Farafra / Bahariya oases · Nubaria (Medjool)",
    varieties: ["Medjool", "Siwi", "Barhi (rutab)", "Amhat"],
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
    latin: "Psidium guajava",
    category: "fruit",
    formats: ["fresh"],
    season: "Sep – Dec · Jan – Mar (winter crop)",
    regions: "Beheira · Sharkia · Qalyubia",
    varieties: ["White-flesh Baladi", "Pink Allahabadi"],
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
        rh: "90%",
        shelfLife: "2–3 weeks",
        transport: "Reefer sea freight · air freight",
      },
    },
  },
  {
    slug: "fresh-figs",
    name: "Fresh Figs",
    latin: "Ficus carica",
    category: "fruit",
    formats: ["fresh"],
    season: "Jun – Aug · Nov – Jan",
    regions: "Beheira · Alexandria",
    varieties: ["Local black & green Sultani-type"],
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
        rh: "85–90%",
        shelfLife: "7–10 days",
        transport: "Air freight",
      },
    },
  },
  {
    slug: "onions",
    name: "Onions",
    latin: "Allium cepa",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Feb – Sep (fresh) · year-round (IQF)",
    regions: "Minufiya · Beheira · Upper Egypt spring belt",
    varieties: ["Golden / yellow", "Red", "White"],
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
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "The only IQF line with year-round farm-level raw material.",
      },
    },
  },
  {
    slug: "potatoes",
    name: "Potatoes",
    latin: "Solanum tuberosum",
    category: "vegetable",
    formats: ["fresh"],
    season: "Feb – Jun · Sep – Dec",
    regions: "Upper Egypt (spring) · Delta / Nubaria (autumn)",
    varieties: ["Spunta", "Diamant", "Lady Rosetta", "Hermes", "Cara"],
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
    latin: "Ipomoea batatas",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Aug – Mar (fresh) · year-round (IQF)",
    regions: "Beheira · Nile Delta",
    varieties: ["Baladi (orange-flesh)", "Beauregard", "Bellevue"],
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
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "IQF dices, cubes and slices.",
      },
    },
  },
  {
    slug: "garlic",
    name: "Garlic",
    latin: "Allium sativum",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Jan – Apr (fresh) · year-round (IQF)",
    regions: "Beni Suef · Minya",
    varieties: ["Baladi", "White", "Red"],
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
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Peeled cloves, diced and crushed.",
      },
    },
  },
  {
    slug: "tomatoes",
    name: "Tomatoes",
    latin: "Solanum lycopersicum",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Year-round (greenhouse) · export peak Oct – Mar",
    regions: "Nubaria · Beheira · Sinai greenhouses",
    varieties: ["Beef", "Roma / round", "Cluster", "Cherry"],
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
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "IQF dices, peeled and cherry-whole from the summer processing crop.",
      },
    },
  },
  {
    slug: "bell-peppers",
    name: "Bell & Sweet Peppers",
    latin: "Capsicum annuum",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Oct – Jun (fresh) · year-round (IQF)",
    regions: "Beheira · Nubaria · Ismailia (greenhouses)",
    varieties: ["Red blocky", "Yellow blocky", "Orange blocky", "Green blocky"],
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
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Red/green/yellow dices, strips and rings.",
      },
    },
  },
  {
    slug: "hot-peppers",
    name: "Hot Peppers",
    latin: "Capsicum frutescens / annuum",
    category: "vegetable",
    formats: ["fresh"],
    season: "Sep – May",
    regions: "Delta",
    varieties: ["Red / green chili (8–12 cm)", "Bird's-eye"],
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
    latin: "Cucumis sativus",
    category: "vegetable",
    formats: ["fresh"],
    season: "Oct – May",
    regions: "Delta · Sinai greenhouses",
    varieties: ["English / telegraph", "Slicer"],
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
    latin: "Pisum sativum",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Nov – Apr (fresh) · year-round (IQF)",
    regions: "Delta winter",
    varieties: ["Garden peas", "Petit pois"],
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
        rh: "95–98%",
        shelfLife: "1–2 weeks",
        transport: "Air freight",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Jan – Mar",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        shelfLife: "24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Standard, fine and extra-fine (petit pois) grades.",
      },
    },
  },
  {
    slug: "eggplants",
    name: "Eggplants",
    latin: "Solanum melongena",
    category: "vegetable",
    formats: ["fresh"],
    season: "Sep – Jun",
    regions: "Delta · greenhouses",
    varieties: ["Black Roumy", "Black Arous", "White Arous"],
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
    latin: "Cucurbita pepo",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Oct – Jun (fresh) · year-round (IQF)",
    regions: "Delta winter · greenhouses",
    varieties: ["Classic green", "Yellow (minor)"],
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
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Slices and dices.",
      },
    },
  },
  {
    slug: "carrots",
    name: "Carrots",
    latin: "Daucus carota subsp. sativus",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Nov – Apr (fresh) · year-round (IQF)",
    regions: "Beheira · Nubaria winter",
    varieties: ["Nantes", "Chantenay"],
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
        rh: "95–100%",
        shelfLife: "1–3 months (topped)",
        transport: "Reefer sea freight",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Dec – Apr",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Dices and slices for blends.",
      },
    },
  },
  {
    slug: "lettuce",
    name: "Lettuce & Baby Leaf",
    latin: "Lactuca sativa",
    category: "vegetable",
    formats: ["fresh"],
    season: "Oct – Apr",
    regions: "Delta winter · greenhouses",
    varieties: ["Iceberg", "Romaine", "Lollo", "Baby-leaf mixes"],
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
    latin: "Brassica oleracea var. capitata",
    category: "vegetable",
    formats: ["fresh"],
    season: "Sep – Apr",
    regions: "Delta winter",
    varieties: ["Green / white", "Red"],
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
        rh: "95–100%",
        shelfLife: "3–6 weeks",
        transport: "Reefer sea freight",
      },
    },
  },
  {
    slug: "cauliflower",
    name: "Cauliflower",
    latin: "Brassica oleracea var. botrytis",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Sep – Apr (fresh) · year-round (IQF)",
    regions: "Delta winter",
    varieties: ["Snowball-type white"],
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
        rh: "95%",
        shelfLife: "3–4 weeks",
        transport: "Reefer sea freight",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Nov – Apr",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Florets.",
      },
    },
  },
  {
    slug: "celery",
    name: "Celery",
    latin: "Apium graveolens",
    category: "vegetable",
    formats: ["fresh"],
    season: "Oct – Apr",
    regions: "Delta winter",
    varieties: ["Green / Pascal"],
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
        rh: "95%+",
        shelfLife: "2–4 weeks",
        transport: "Reefer sea freight",
      },
    },
  },
  {
    slug: "fresh-herbs",
    name: "Fresh Herbs",
    latin: "Petroselinum crispum & others",
    category: "vegetable",
    formats: ["fresh"],
    season: "Year-round (winter emphasis Oct – May)",
    regions: "Qalyubia · Beheira · Monufiya · Upper Egypt (winter)",
    varieties: [
      "Parsley (curly & flat)",
      "Coriander",
      "Mint",
      "Dill",
      "Chives",
      "Basil",
      "Rocket",
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
    latin: "Allium fistulosum",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "Jan – Apr · Sep – Dec (two-region relay)",
    regions: "Upper Egypt (spring) · Delta (autumn)",
    varieties: ["Red-rooted", "White Lisbon-type"],
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
        rh: "95–100%",
        shelfLife: "2–3 weeks",
        transport: "Reefer sea freight",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Nov – Feb",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Chopped and sliced garnish grades.",
      },
    },
  },
  {
    slug: "molokhia",
    name: "Molokhia",
    latin: "Corchorus olitorius",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    season: "May – Oct (fresh) · year-round (IQF)",
    regions: "Delta · Middle Egypt",
    varieties: ["Local Corchorus olitorius"],
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
        rh: "95%",
        shelfLife: "3–7 days",
        transport: "Air freight",
      },
      frozen: {
        months: YEAR_ROUND,
        peak: "Packed Jun – Sep",
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Minced and whole-leaf formats.",
      },
    },
  },
  {
    slug: "sweet-corn",
    name: "Sweet Corn",
    latin: "Zea mays var. saccharata",
    category: "vegetable",
    formats: ["frozen"],
    season: "Year-round (IQF) · packed Jun – Sep",
    regions: "Delta summer",
    varieties: ["Yellow supersweet kernels"],
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
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "IQF kernels.",
      },
    },
  },
  {
    slug: "broad-beans",
    name: "Broad Beans (Ful)",
    latin: "Vicia faba",
    category: "vegetable",
    formats: ["frozen"],
    season: "Year-round (IQF) · packed Jan – May",
    regions: "Delta winter",
    varieties: ["Peeled", "Unpeeled"],
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
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Peeled and unpeeled grades.",
      },
    },
  },
  {
    slug: "broccoli",
    name: "Broccoli",
    latin: "Brassica oleracea var. italica",
    category: "vegetable",
    formats: ["frozen"],
    season: "Year-round (IQF) · packed Nov – Apr",
    regions: "Delta winter",
    varieties: ["Calabrese-type florets"],
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
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Florets and stems.",
      },
    },
  },
  {
    slug: "spinach",
    name: "Spinach",
    latin: "Spinacia oleracea",
    category: "vegetable",
    formats: ["frozen"],
    season: "Year-round (IQF) · packed Oct – Apr",
    regions: "Delta",
    varieties: ["Savoy / semi-savoy leaf"],
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
        shelfLife: "18–24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Whole leaf, chopped and portions.",
      },
    },
  },
  {
    slug: "mixed-vegetables",
    name: "Mixed Vegetables",
    latin: "Blends to recipe",
    category: "vegetable",
    formats: ["frozen"],
    season: "Year-round — blended from frozen stock",
    regions: "Delta-wide",
    varieties: ["California mix", "Two-way", "Three-way", "Four-way", "Custom recipes"],
    packaging: ["400 / 450 g · 1 kg · 2.5 kg retail", "10 / 20 kg bulk"],
    summary: "Custom IQF blends built to buyer recipes, all twelve months.",
    detail:
      "Because every component is packed in its own harvest window and held at −18 °C, blends assemble year-round: peas, carrots, green beans, corn, broccoli and more, mixed to an agreed ratio and packed under buyer or private-label branding.",
    calendar: {
      frozen: {
        months: YEAR_ROUND,
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        shelfLife: "24 months",
        transport: "Reefer sea freight at −18 °C",
        note: "Blends assembled from frozen stock — availability all 12 months.",
      },
    },
  },
  {
    slug: "potato-fries",
    name: "Frozen Potato Fries",
    latin: "Solanum tuberosum (processing)",
    category: "vegetable",
    formats: ["frozen"],
    season: "Year-round — two contract harvests",
    regions: "Delta / Nubaria contract farms · 10th of Ramadan processing",
    varieties: ["Shoestring", "Regular cut", "Wedges · from Spunta / Lady Rosetta / Hermes"],
    packaging: ["450 g – 2.5 kg retail", "10 kg catering · 4 × 2.5 kg"],
    summary: "Egypt runs one of the region's largest fries platforms — 160,000+ t a year.",
    detail:
      "Contract farms feeding Delta and Nubaria processing plants — including operations of over 160,000 tonnes a year — produce shoestring, regular-cut and wedge fries for retail and QSR chains across MENA and beyond, from the same two potato harvests that supply the fresh trade.",
    calendar: {
      frozen: {
        months: YEAR_ROUND,
        tempC: "−18 °C",
        tempF: "−0.4 °F",
        shelfLife: "24 months (best 12–18)",
        transport: "Reefer sea freight at −18 °C",
        note: "Produced year-round from the Feb–Jun and Sep–Dec harvests.",
      },
    },
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const contactDetails = {
  email: "info@olymp-ex.com",
  phone: "+20 122 704 1884",
  whatsapp: "+20 122 704 1884",
  address: "Cairo, Egypt",
  note: "Commercial enquiries answered within one business day.",
};
