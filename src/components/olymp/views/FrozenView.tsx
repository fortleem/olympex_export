"use client";

import { FormatView } from "@/components/olymp/views/FormatView";

/** Frozen-produce page — copy only; layout and explorer are shared. */
export default function FrozenView() {
  return (
    <FormatView
      format="frozen"
      hero={{
        eyebrow: "Frozen produce",
        title: "IQF programmes built for industrial consistency",
        description:
          "Frozen supply is judged on repeatability. Our IQF lines are specified, graded and packed so every pallet in a programme behaves the same way in your process.",
      }}
      handling={{ eyebrow: "How we handle frozen", title: "From tunnel to reefer without a gap" }}
      pillars={[
        {
          title: "Blanch & freeze",
          text: "Controlled blanching and IQF tunnels to lock colour, texture and sweetness.",
        },
        {
          title: "Formats",
          text: "Whole, halved, sliced, diced and custom multi-way blends.",
        },
        {
          title: "Packing",
          text: "400g / 1kg retail bags, 10kg bulk and private-label programmes.",
        },
        {
          title: "Chain",
          text: "−18°C maintained from tunnel to reefer, with temperature logging.",
        },
      ]}
      image={{
        src: "/images/frozen-produce.jpg",
        alt: "Individually quick frozen mixed berries covered in frost",
        width: 800,
        height: 1200,
      }}
      imageSide="right"
      lines={{
        eyebrow: "Frozen lines",
        title: "{count} lines available in IQF format",
        description:
          "All frozen programmes run at −18 °C with closed reefer ventilation — filter by packing window or download the IQF catalogue with full cold-chain data.",
      }}
      logistics={{
        eyebrow: "Logistics",
        title: "Where frozen consignments go",
        description: "Indicative transit windows from Egyptian gateways.",
      }}
    />
  );
}
