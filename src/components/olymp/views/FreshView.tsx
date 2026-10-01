"use client";

import { FormatView } from "@/components/olymp/views/FormatView";

/** Fresh-produce page — copy only; layout and explorer are shared. */
export default function FreshView() {
  return (
    <FormatView
      format="fresh"
      hero={{
        eyebrow: "Fresh produce",
        title: "Harvest condition, held all the way to your warehouse",
        description:
          "Our fresh programmes are built around the shortest possible interval between picking, cooling and loading — the single biggest determinant of arrival quality.",
      }}
      handling={{ eyebrow: "How we handle fresh", title: "Four controls that decide arrival quality" }}
      pillars={[
        {
          title: "Pre-cooling",
          text: "Field heat removed shortly after harvest to protect firmness and shelf life.",
        },
        {
          title: "Grading",
          text: "Calibre, colour and defect grading against the agreed buyer specification.",
        },
        {
          title: "Packing",
          text: "Punnets, flow-packs, cartons and private-label presentation.",
        },
        {
          title: "Dispatch",
          text: "Air freight for short-shelf-life lines, reefer sea freight for volume.",
        },
      ]}
      image={{
        src: "/images/fresh-produce.jpg",
        alt: "Freshly graded Egyptian vegetables being packed for export",
        width: 1280,
        height: 960,
      }}
      imageSide="left"
      lines={{
        eyebrow: "Fresh lines",
        title: "{count} lines available in fresh format",
        description:
          "Filter by month of availability, download the fresh catalogue with temperatures, ventilation and humidity — the same tools as the full products page.",
      }}
      logistics={{
        eyebrow: "Logistics",
        title: "Where fresh consignments go",
        description: "Indicative transit windows from Egyptian gateways.",
      }}
    />
  );
}
