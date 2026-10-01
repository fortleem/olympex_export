"use client";

import { FormatView } from "@/components/olymp/views/FormatView";

/** Frozen-produce page — format only; layout and copy come from FormatView + i18n. */
export default function FrozenView() {
  return <FormatView format="frozen" prefix="frozen" />;
}
