/**
 * Per-product hero imagery.
 *
 * All 44 catalogue lines map to a dedicated editorial photo (see
 * `public/images/products/`). Lines that share a visual family (e.g. the two
 * orange lines) intentionally share one shot so the set stays cohesive; the
 * legacy generic fresh/frozen shots remain as final fallbacks.
 */

/** Family images shared by several slugs. */
const IMAGES: Record<string, string> = {
  // Fruit
  strawberries: "/images/products/strawberries.jpg",
  "navel-oranges": "/images/products/oranges.jpg",
  "valencia-oranges": "/images/products/oranges.jpg",
  mandarins: "/images/products/mandarins.jpg",
  lemons: "/images/products/lemons.jpg",
  grapefruit: "/images/products/grapefruit.jpg",
  "table-grapes": "/images/products/grapes.jpg",
  pomegranates: "/images/products/pomegranates.jpg",
  mangoes: "/images/products/mangoes.jpg",
  "peaches-nectarines": "/images/products/stone-fruit.jpg",
  apricots: "/images/products/apricots.jpg",
  dates: "/images/products/dates.jpg",
  guava: "/images/products/guava.jpg",
  "fresh-figs": "/images/products/figs.jpg",
  watermelons: "/images/products/watermelons.jpg",
  melons: "/images/products/melons.jpg",
  // Vegetables — fresh
  "green-beans": "/images/products/green-beans.jpg",
  "broad-beans": "/images/products/broad-beans.jpg",
  artichokes: "/images/products/artichokes.jpg",
  okra: "/images/products/okra.jpg",
  onions: "/images/products/onions.jpg",
  "spring-onions": "/images/products/spring-onions.jpg",
  garlic: "/images/products/garlic.jpg",
  potatoes: "/images/products/potatoes.jpg",
  "sweet-potatoes": "/images/products/sweet-potatoes.jpg",
  tomatoes: "/images/products/tomatoes.jpg",
  "bell-peppers": "/images/products/peppers.jpg",
  "hot-peppers": "/images/products/peppers.jpg",
  cucumbers: "/images/products/cucumbers.jpg",
  courgettes: "/images/products/courgettes.jpg",
  eggplants: "/images/products/eggplants.jpg",
  "green-peas": "/images/products/peas.jpg",
  carrots: "/images/products/carrots.jpg",
  lettuce: "/images/products/lettuce.jpg",
  cabbage: "/images/products/cabbage.jpg",
  cauliflower: "/images/products/cauliflower.jpg",
  broccoli: "/images/products/broccoli.jpg",
  celery: "/images/products/celery.jpg",
  "fresh-herbs": "/images/products/herbs.jpg",
  molokhia: "/images/products/molokhia.jpg",
  spinach: "/images/products/spinach.jpg",
  "sweet-corn": "/images/products/sweet-corn.jpg",
  // Frozen-only lines
  "mixed-vegetables": "/images/products/mixed-vegetables.jpg",
  "potato-fries": "/images/products/potato-fries.jpg",
};

/**
 * Hero image for a catalogue line. Dedicated product photo when available,
 * otherwise the generic fresh/frozen shot.
 */
export function productImage(slug: string, formats: readonly string[]): string {
  const mapped = IMAGES[slug];
  if (mapped) return mapped;
  return formats.includes("fresh") ? "/images/fresh-produce.jpg" : "/images/frozen-produce.jpg";
}
