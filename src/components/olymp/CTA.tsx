"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ALink } from "@/lib/router";

export function ExportDiagram() {
  const arcs = [
    { d: "M50 62 C 32 40, 26 26, 22 18", label: "Europe" },
    { d: "M50 62 C 66 46, 76 34, 84 24", label: "Asia" },
    { d: "M50 62 C 62 58, 74 54, 86 50", label: "Gulf" },
    { d: "M50 62 C 42 76, 36 84, 30 90", label: "Africa" },
  ];
  return (
    <svg
      viewBox="0 0 100 100"
      className="relative h-full w-full"
      role="img"
      aria-label="Abstract export routes from Egypt to destination regions"
    >
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
              <ALink to="/contact">
                Request a Quote <ArrowRight aria-hidden />
              </ALink>
            </Button>
            <Button asChild size="lg" variant="onBrand">
              <ALink to="/products">Explore Products</ALink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
