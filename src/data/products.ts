/**
 * Representative product catalogue for Olymp Ex.
 * All values are editable placeholders — replace with confirmed commercial data.
 * Shape is intentionally flat so it can be swapped for an API/CMS later.
 */

export type ProductFormat = "fresh" | "frozen";
export type ProductCategory = "fruit" | "vegetable";

export interface Product {
  slug: string;
  name: string;
  latin?: string;
  category: ProductCategory;
  formats: ProductFormat[];
  origin: string;
  season: string;
  varieties: string[];
  packaging: string[];
  availability: string;
  summary: string;
  detail: string;
  specs: { label: string; value: string }[];
}

export const products: Product[] = [
  {
    slug: "strawberries",
    name: "Strawberries",
    latin: "Fragaria × ananassa",
    category: "fruit",
    formats: ["fresh", "frozen"],
    origin: "Egypt",
    season: "December – April (fresh) · year-round (IQF)",
    varieties: ["Festival", "Fortuna", "Winter Dawn"],
    packaging: ["250g / 500g punnets", "Open-top cartons", "10kg IQF bulk bags"],
    availability: "Representative — confirm per season",
    summary: "Bright, aromatic Egyptian strawberries for retail punnets and IQF processing.",
    detail:
      "Sourced from growers in Egypt's principal strawberry belts and moved into pre-cooling shortly after picking to protect firmness, colour and shelf life. Available as fresh export packs and as IQF whole, sliced or diced formats for industrial buyers.",
    specs: [
      { label: "Formats", value: "Fresh · IQF whole / sliced / diced" },
      { label: "Temperature", value: "0–2°C fresh · −18°C frozen" },
      { label: "Transport", value: "Air freight · reefer sea freight" },
    ],
  },
  {
    slug: "grapes",
    name: "Table Grapes",
    latin: "Vitis vinifera",
    category: "fruit",
    formats: ["fresh"],
    origin: "Egypt",
    season: "May – August",
    varieties: ["Early Sweet", "Flame Seedless", "Superior", "Crimson"],
    packaging: ["500g punnets", "4.5kg / 5kg cartons", "Bagged bunches"],
    availability: "Representative — confirm per season",
    summary: "Early-window seedless grapes with consistent bunch presentation.",
    detail:
      "Egypt's early harvest window positions table grapes ahead of many Northern Hemisphere origins. Bunches are field-selected, trimmed and cold-packed with buyer-specified punnet or carton presentation.",
    specs: [
      { label: "Formats", value: "Fresh only" },
      { label: "Temperature", value: "0–1°C" },
      { label: "Transport", value: "Reefer sea freight · air freight" },
    ],
  },
  {
    slug: "citrus-oranges",
    name: "Citrus & Oranges",
    latin: "Citrus sinensis",
    category: "fruit",
    formats: ["fresh"],
    origin: "Egypt",
    season: "December – May",
    varieties: ["Valencia", "Navel", "Baladi", "Mandarin", "Lemon"],
    packaging: ["15kg telescopic cartons", "Mesh bags", "Bulk bins"],
    availability: "Representative — confirm per season",
    summary: "Egypt's flagship export citrus, graded by calibre and colour.",
    detail:
      "Oranges, mandarins and lemons graded on calibre, colour and juice content, then packed to destination-market specification. Documentation and phytosanitary handling are coordinated per shipment.",
    specs: [
      { label: "Formats", value: "Fresh only" },
      { label: "Temperature", value: "3–6°C" },
      { label: "Transport", value: "Reefer sea freight" },
    ],
  },
  {
    slug: "pomegranates",
    name: "Pomegranates",
    latin: "Punica granatum",
    category: "fruit",
    formats: ["fresh", "frozen"],
    origin: "Egypt",
    season: "September – December (fresh) · year-round (arils)",
    varieties: ["Wonderful", "116", "Early Foreign"],
    packaging: ["4kg / 5kg cartons", "Aril tubs", "IQF aril bulk bags"],
    availability: "Representative — confirm per season",
    summary: "Deep-coloured pomegranates plus IQF arils for processing buyers.",
    detail:
      "Whole fruit is selected for skin finish and aril colour. Arils are extracted, inspected and individually quick frozen for beverage, bakery and food-service customers.",
    specs: [
      { label: "Formats", value: "Fresh whole · IQF arils" },
      { label: "Temperature", value: "5–7°C fresh · −18°C frozen" },
      { label: "Transport", value: "Reefer sea freight" },
    ],
  },
  {
    slug: "onions",
    name: "Onions",
    latin: "Allium cepa",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    origin: "Egypt",
    season: "February – July (fresh)",
    varieties: ["Golden / yellow", "Red", "White"],
    packaging: ["10kg / 20kg / 25kg mesh bags", "Jumbo bags", "IQF diced bags"],
    availability: "Representative — confirm per season",
    summary: "Cured export onions in multiple calibres, plus IQF diced formats.",
    detail:
      "Onions are cured, sized and inspected for neck finish and skin quality before bagging. Diced and sliced IQF formats are produced for industrial kitchens and manufacturers.",
    specs: [
      { label: "Formats", value: "Fresh cured · IQF diced / sliced" },
      { label: "Temperature", value: "Ambient-controlled · −18°C frozen" },
      { label: "Transport", value: "Dry container · reefer" },
    ],
  },
  {
    slug: "potatoes",
    name: "Potatoes",
    latin: "Solanum tuberosum",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    origin: "Egypt",
    season: "January – June",
    varieties: ["Spunta", "Hermes", "Lady Rosetta", "Diamond"],
    packaging: ["10kg / 25kg bags", "1.2t jumbo bags", "IQF cut formats"],
    availability: "Representative — confirm per season",
    summary: "Table and processing potatoes with calibre-based grading.",
    detail:
      "Table and processing varieties are graded by calibre, washed or field-packed to buyer preference, and staged for prompt loading to preserve condition on arrival.",
    specs: [
      { label: "Formats", value: "Fresh · IQF cuts" },
      { label: "Temperature", value: "6–8°C fresh · −18°C frozen" },
      { label: "Transport", value: "Reefer sea freight" },
    ],
  },
  {
    slug: "green-beans",
    name: "Green Beans",
    latin: "Phaseolus vulgaris",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    origin: "Egypt",
    season: "October – May (fresh) · year-round (IQF)",
    varieties: ["Fine", "Extra fine", "Bobby"],
    packaging: ["Retail flow-packs", "5kg cartons", "IQF 10kg bulk"],
    availability: "Representative — confirm per season",
    summary: "Fine and extra-fine beans, hand-selected and rapidly cooled.",
    detail:
      "Hand-picked and graded by calibre, then hydro-cooled or blanched and frozen. A core line for both retail programmes and food-service supply.",
    specs: [
      { label: "Formats", value: "Fresh · IQF whole / cut" },
      { label: "Temperature", value: "4–7°C fresh · −18°C frozen" },
      { label: "Transport", value: "Air freight · reefer" },
    ],
  },
  {
    slug: "green-peas",
    name: "Green Peas",
    latin: "Pisum sativum",
    category: "vegetable",
    formats: ["frozen"],
    origin: "Egypt",
    season: "Year-round (IQF)",
    varieties: ["Garden peas", "Petit pois"],
    packaging: ["400g / 1kg retail bags", "10kg bulk bags"],
    availability: "Representative — confirm per season",
    summary: "Sweet IQF peas graded by size for retail and industry.",
    detail:
      "Shelled, blanched and individually quick frozen within a controlled window to hold sweetness and colour. Size-graded for retail packs or bulk industrial supply.",
    specs: [
      { label: "Formats", value: "IQF only" },
      { label: "Temperature", value: "−18°C" },
      { label: "Transport", value: "Reefer sea freight" },
    ],
  },
  {
    slug: "mixed-vegetables",
    name: "Mixed Vegetables",
    category: "vegetable",
    formats: ["frozen"],
    origin: "Egypt",
    season: "Year-round (IQF)",
    varieties: ["Two-way", "Three-way", "Four-way", "Custom recipes"],
    packaging: ["400g / 1kg retail bags", "10kg bulk bags"],
    availability: "Representative — confirm per season",
    summary: "Custom IQF vegetable blends built to buyer recipes.",
    detail:
      "Blends of peas, carrots, green beans, corn and other lines, mixed to an agreed ratio and packed under buyer or private-label branding.",
    specs: [
      { label: "Formats", value: "IQF blends" },
      { label: "Temperature", value: "−18°C" },
      { label: "Transport", value: "Reefer sea freight" },
    ],
  },
  {
    slug: "seasonal-produce",
    name: "Seasonal Produce",
    category: "vegetable",
    formats: ["fresh", "frozen"],
    origin: "Egypt",
    season: "Varies by line",
    varieties: ["Mangoes", "Sweet potatoes", "Artichokes", "Molokhia", "Okra"],
    packaging: ["To buyer specification"],
    availability: "On request",
    summary: "Additional Egyptian lines sourced against confirmed programmes.",
    detail:
      "Beyond core lines, Olymp Ex sources seasonally available Egyptian produce against confirmed buyer programmes. Share your specification and we will confirm feasibility, window and format.",
    specs: [
      { label: "Formats", value: "Fresh · frozen (line dependent)" },
      { label: "Temperature", value: "Line dependent" },
      { label: "Transport", value: "Air freight · reefer sea freight" },
    ],
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const contactDetails = {
  email: "hello@olympex.example",
  phone: "+20 000 000 0000",
  whatsapp: "+20 000 000 0000",
  address: "Cairo, Egypt",
  note: "Contact details are placeholders — replace with live company details.",
};
