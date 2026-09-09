/**
 * Logistics reference data — destination lanes and the farm-to-port journey.
 * Values are representative placeholders; confirm per shipment.
 */

export interface Lane {
  flag: string;
  region: string;
  ports: string;
  transit: string;
}

export const lanes: Lane[] = [
  {
    flag: "🇪🇺",
    region: "European Union",
    ports: "Rotterdam · Hamburg · Marseille",
    transit: "7–10 days transit",
  },
  {
    flag: "🇸🇦",
    region: "Gulf & MENA",
    ports: "Jeddah · Dubai · Kuwait",
    transit: "3–5 days transit",
  },
  {
    flag: "🇬🇧",
    region: "United Kingdom",
    ports: "Felixstowe · London Gateway",
    transit: "9–11 days transit",
  },
  {
    flag: "🌏",
    region: "Asia & Americas",
    ports: "Singapore · Shanghai · NY",
    transit: "14–21 days transit",
  },
];

export interface JourneyStep {
  icon: "grow" | "harvest" | "process" | "certify" | "ship";
  title: string;
  text: string;
}

export const journeySteps: JourneyStep[] = [
  {
    icon: "grow",
    title: "Grow",
    text: "Contracted GlobalG.A.P. farms across the Delta & Upper Egypt",
  },
  {
    icon: "harvest",
    title: "Harvest",
    text: "Hand-picked at peak ripeness, field-sorted within minutes",
  },
  {
    icon: "process",
    title: "Process",
    text: "Pre-cooling, grading, IQF freezing & hygienic packing",
  },
  {
    icon: "certify",
    title: "Certify",
    text: "Lab testing, SGS inspection & phytosanitary clearance",
  },
  {
    icon: "ship",
    title: "Ship",
    text: "Reefer containers & air freight from Alexandria, Sokhna & Cairo",
  },
];

export const freightModes = [
  {
    title: "Reefer sea freight",
    text: "Temperature-set 40ft high-cube reefers from Alexandria, Damietta and Ain Sokhna.",
  },
  {
    title: "Air freight",
    text: "Cairo International for short-shelf-life lines and urgent programme top-ups.",
  },
  {
    title: "Documentation",
    text: "Phytosanitary certificates, certificates of origin, EUR.1 and full shipping set.",
  },
  {
    title: "Cold-chain integrity",
    text: "Pre-cooling, temperature logging and container inspection prior to stuffing.",
  },
];
