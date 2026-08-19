import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Snowflake,
  Leaf,
  ShieldCheck,
  Ship,
  Thermometer,
  FileCheck2,
  Globe2,
  Sprout,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeader, Eyebrow } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/data/products";
import heroImg from "@/assets/hero-produce.jpg";
import freshImg from "@/assets/fresh-produce.jpg";
import frozenImg from "@/assets/frozen-produce.jpg";
import fieldsImg from "@/assets/egypt-fields.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Olymp Ex — Egypt's Harvest, Delivered to the World" },
      {
        name: "description",
        content:
          "Olymp Ex exports premium Egyptian fresh and frozen fruits and vegetables — disciplined sourcing, quality control, cold chain and reliable international delivery.",
      },
      { property: "og:title", content: "Olymp Ex — Egypt's Harvest, Delivered to the World" },
      {
        property: "og:description",
        content:
          "Premium Egyptian fresh and frozen produce for importers, distributors and food-service partners worldwide.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const trust = [
  { label: "Origin", value: "Egypt" },
  { label: "Capability", value: "Fresh & IQF frozen" },
  { label: "Chain", value: "Temperature controlled" },
  { label: "Buyers", value: "Import · retail · food service" },
];

const processSteps = [
  { icon: Sprout, title: "Sourcing", text: "Grower selection aligned to variety, calibre and destination programme." },
  { icon: ShieldCheck, title: "Inspection", text: "Incoming lots assessed on condition, maturity and defect tolerance." },
  { icon: Leaf, title: "Grading", text: "Size, colour and quality grading against the agreed buyer specification." },
  { icon: FileCheck2, title: "Packing", text: "Packing to retail, wholesale or industrial format with lot identification." },
  { icon: Thermometer, title: "Cold chain", text: "Pre-cooling and temperature control maintained through to loading." },
  { icon: Ship, title: "Shipment", text: "Documentation coordinated and consignments dispatched to destination." },
];

export default function Home() {
  const featured = products.slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-background">
        <div className="grid-motif pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div
          className="pointer-events-none absolute top-1/3 -left-40 h-[32rem] w-[32rem] rounded-full opacity-[0.12] blur-3xl"
          style={{ background: "var(--gradient-brand)" }}
          aria-hidden
        />
        <div className="container-x relative grid items-center gap-14 py-16 lg:grid-cols-2 lg:gap-8 lg:py-24">
          <Reveal className="is-revealed max-w-2xl">
            <Eyebrow>Egyptian Agritrade · Fresh &amp; Frozen</Eyebrow>
            <h1 className="mt-7 text-[2.6rem] leading-[1.02] font-extrabold sm:text-6xl xl:text-7xl">
              Egypt&apos;s Harvest.
              <br />
              <span className="text-gradient-brand">Delivered to the World.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground">
              We source from Egyptian growing regions, control quality at every handover, hold the
              cold chain from field to vessel, and deliver fresh and IQF frozen produce to
              international buyers with the paperwork and predictability trade demands.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <Link to="/contact">
                  Request a Quote
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/products">Explore Products</Link>
              </Button>
            </div>

            <dl className="mt-14 grid max-w-xl grid-cols-2 gap-x-8 gap-y-6 border-t border-border pt-8 sm:grid-cols-4">
              {trust.map((t) => (
                <div key={t.label}>
                  <dt className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-muted-foreground">
                    {t.label}
                  </dt>
                  <dd className="mt-1.5 text-sm font-bold">{t.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="relative">
            <div className="relative overflow-hidden border border-border bg-surface shadow-elevated">
              <img
                src={heroImg}
                alt="Fresh Egyptian strawberries, grapes, oranges and pomegranates arranged on a white surface"
                width={1920}
                height={1280}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-4 hidden w-64 border border-border bg-background/90 p-5 shadow-soft backdrop-blur-md sm:block lg:-left-10">
              <p className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-accent">
                From Egypt to the world
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Programme-based supply built around your season, format and destination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <div className="border-y border-border bg-surface">
        <div className="container-x flex flex-wrap items-center justify-between gap-6 py-6">
          {[
            "Programme-based supply",
            "Specification-led grading",
            "Temperature-controlled handling",
            "Export documentation support",
            "Private-label packing",
          ].map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.12em] uppercase text-muted-foreground"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* FEATURED CATEGORIES */}
      <Section>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeader
            eyebrow="Product portfolio"
            title="Premium Egyptian lines, packed to your specification"
            description="A representative selection of our core export lines. Every specification below is an editable placeholder — confirmed availability, calibre and packing are agreed per programme."
          />
          <Button asChild variant="outline">
            <Link to="/products">
              All products <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 70}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FROM EGYPT TO THE WORLD */}
      <Section tone="surface">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative overflow-hidden border border-border shadow-soft">
            <img
              src={fieldsImg}
              alt="Geometric rows of irrigated crops in an Egyptian growing region at golden hour"
              width={1600}
              height={900}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[1.2s] hover:scale-[1.04]"
            />
          </Reveal>
          <div>
            <SectionHeader
              eyebrow="From Egypt to the world"
              title="An origin advantage, run with export discipline"
              description="Egypt's climate delivers early windows, long seasons and consistent volume. Olymp Ex converts that natural advantage into dependable commercial supply — planned by programme, verified at each stage and shipped against agreed documentation."
            />
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {[
                {
                  title: "Season planning",
                  text: "Windows mapped ahead of harvest so volume, format and pricing are agreed early.",
                },
                {
                  title: "Single point of contact",
                  text: "One commercial team across sourcing, quality, logistics and documentation.",
                },
                {
                  title: "Format flexibility",
                  text: "Fresh export packs and IQF frozen formats from the same sourcing base.",
                },
                {
                  title: "Buyer-ready presentation",
                  text: "Retail, wholesale, food-service and private-label packing options.",
                },
              ].map((b, i) => (
                <Reveal key={b.title} delay={i * 80}>
                  <h3 className="text-base font-bold">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* QUALITY PROCESS */}
      <Section>
        <SectionHeader
          eyebrow="Quality & traceability"
          title="Controlled at every handover, from field to destination"
          description="Food safety and quality are treated as operating principles, not marketing claims. Each consignment is identified, inspected and documented as it moves through the chain."
        />
        <ol className="mt-14 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2 xl:grid-cols-3">
          {processSteps.map((s, i) => (
            <Reveal key={s.title} as="li" delay={i * 60} className="group bg-card p-8 transition-colors hover:bg-surface">
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center border border-primary/25 bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <s.icon className="size-5" aria-hidden />
                </span>
                <span className="font-[family-name:var(--font-display)] text-3xl text-border">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 text-lg font-bold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mt-10">
          <Button asChild variant="outline">
            <Link to="/quality">
              See the full process <ArrowRight aria-hidden />
            </Link>
          </Button>
        </Reveal>
      </Section>

      {/* FRESH VS FROZEN */}
      <Section tone="surface">
        <SectionHeader
          eyebrow="Two capabilities, one origin"
          title="Fresh export packs and IQF frozen programmes"
          align="center"
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {[
            {
              img: freshImg,
              icon: Leaf,
              title: "Fresh Produce",
              text: "Rapid pre-cooling, calibre grading and destination-specific packing for retail and wholesale programmes.",
              to: "/fresh-produce" as const,
              points: ["Pre-cooling after harvest", "Calibre & colour grading", "Air and reefer options"],
            },
            {
              img: frozenImg,
              icon: Snowflake,
              title: "Frozen Produce",
              text: "IQF fruits and vegetables in whole, sliced, diced and blended formats for industry and food service.",
              to: "/frozen-produce" as const,
              points: ["IQF whole, sliced, diced", "Retail and bulk packing", "−18°C chain maintained"],
            },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 100}>
              <article className="group flex h-full flex-col overflow-hidden border border-border bg-card transition-shadow duration-500 hover:shadow-elevated">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={c.img}
                    alt={c.title}
                    width={1280}
                    height={960}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1.1s] group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-8">
                  <span className="inline-flex h-11 w-11 items-center justify-center border border-accent/25 bg-accent/5 text-accent">
                    <c.icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-6 text-2xl font-bold">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
                  <ul className="mt-6 space-y-2 text-sm">
                    {c.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-muted-foreground">
                        <span className="inline-block h-1 w-4 bg-primary" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 pt-2">
                    <Button asChild variant="outline">
                      <Link to={c.to}>
                        Learn more <ArrowRight aria-hidden />
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* MARKETS */}
      <Section>
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="Global markets"
              title="Built to serve buyers across regions"
              description="Destination regions below are editable placeholders for presentation. Actual routing, lead time and market coverage are confirmed per enquiry."
            />
            <div className="mt-10 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3">
              {["Europe", "Gulf & Middle East", "Africa", "Asia", "United Kingdom", "Americas"].map(
                (m, i) => (
                  <Reveal key={m} delay={i * 50} className="bg-card p-5">
                    <Globe2 className="size-4 text-accent" aria-hidden />
                    <p className="mt-3 text-sm font-semibold">{m}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Placeholder region</p>
                  </Reveal>
                ),
              )}
            </div>
            <Reveal className="mt-10">
              <Button asChild variant="outline">
                <Link to="/global-markets">
                  Export capability <ArrowRight aria-hidden />
                </Link>
              </Button>
            </Reveal>
          </div>
          <Reveal className="relative aspect-square overflow-hidden border border-border bg-surface">
            <div className="grid-motif absolute inset-0 opacity-70" aria-hidden />
            <ExportDiagram />
          </Reveal>
        </div>
      </Section>

      {/* SUSTAINABILITY */}
      <Section tone="surface">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Sustainability"
              title="Responsible sourcing as a long-term commercial position"
              description="Working with growers over multiple seasons, reducing waste through accurate grading and planning, and handling water, packaging and energy with intent."
            />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
            {[
              { title: "Grower partnerships", text: "Long-horizon relationships instead of spot-market churn." },
              { title: "Waste reduction", text: "Accurate grading and planning to minimise rejected volume." },
              { title: "Water awareness", text: "Preference for growers applying efficient irrigation practice." },
              { title: "Packaging review", text: "Continuous review of recyclable and reduced-material formats." },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 70} className="border border-border bg-card p-7">
                <h3 className="text-base font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* TESTIMONIALS */}
      <Section>
        <SectionHeader
          eyebrow="Partner voices"
          title="What buyers expect from a serious origin partner"
          description="Illustrative statements shown as placeholders until approved partner references are supplied."
          align="center"
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              quote:
                "Clear specifications, honest availability and consistent presentation matter more than headline pricing.",
              who: "Importer",
              where: "Placeholder reference",
            },
            {
              quote:
                "A single contact who owns quality, logistics and paperwork removes most of the friction in origin trade.",
              who: "Distributor",
              where: "Placeholder reference",
            },
            {
              quote:
                "Frozen programmes only work when the cold chain is treated as non-negotiable from the first hour.",
              who: "Food-service buyer",
              where: "Placeholder reference",
            },
          ].map((t, i) => (
            <Reveal key={t.who} delay={i * 80} className="border border-border bg-card p-8">
              <Quote className="size-6 text-accent" aria-hidden />
              <blockquote className="mt-5 text-base leading-relaxed">{t.quote}</blockquote>
              <footer className="mt-6 border-t border-border pt-5 text-xs">
                <p className="font-semibold">{t.who}</p>
                <p className="mt-1 text-muted-foreground">{t.where}</p>
              </footer>
            </Reveal>
          ))}
        </div>
      </Section>

      <FinalCta />
    </>
  );
}

export function ExportDiagram() {
  const arcs = [
    { d: "M50 62 C 32 40, 26 26, 22 18", label: "Europe" },
    { d: "M50 62 C 66 46, 76 34, 84 24", label: "Asia" },
    { d: "M50 62 C 62 58, 74 54, 86 50", label: "Gulf" },
    { d: "M50 62 C 42 76, 36 84, 30 90", label: "Africa" },
  ];
  return (
    <svg viewBox="0 0 100 100" className="relative h-full w-full" role="img" aria-label="Abstract export routes from Egypt to destination regions">
      <defs>
        <linearGradient id="arc" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.53 0.132 148)" />
          <stop offset="100%" stopColor="oklch(0.46 0.166 300)" />
        </linearGradient>
      </defs>
      {arcs.map((a, i) => (
        <g key={a.label}>
          <path
            d={a.d}
            fill="none"
            stroke="url(#arc)"
            strokeWidth="0.6"
            strokeDasharray="2 1.6"
            opacity="0.85"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-14.4"
              dur={`${4 + i}s`}
              repeatCount="indefinite"
            />
          </path>
          <circle
            cx={Number(a.d.split(" ").at(-2))}
            cy={Number(a.d.split(" ").at(-1))}
            r="1.6"
            fill="oklch(0.46 0.166 300)"
          />
        </g>
      ))}
      <circle cx="50" cy="62" r="3.2" fill="oklch(0.53 0.132 148)" />
      <circle cx="50" cy="62" r="7" fill="none" stroke="oklch(0.53 0.132 148)" strokeWidth="0.4" opacity="0.5" />
      <text x="50" y="74" textAnchor="middle" fontSize="3.4" fontWeight="700" fill="oklch(0.21 0.02 155)">
        EGYPT
      </text>
    </svg>
  );
}

export function FinalCta() {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-brand)" }}>
      <div className="grid-motif absolute inset-0 opacity-10" aria-hidden />
      <div className="container-x relative py-20 text-primary-foreground md:py-28">
        <div className="max-w-3xl">
          <h2 className="text-3xl leading-[1.06] font-extrabold md:text-5xl">
            Tell us the specification. We&apos;ll confirm the season, the format and the route.
          </h2>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/85">
            Share your product, volume, packaging and destination — our commercial team responds
            with an availability position and an indicative offer.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="onBrand">
              <Link to="/contact">
                Request a Quote <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="onBrand">
              <Link to="/products">Explore Products</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
