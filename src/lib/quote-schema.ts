import { z } from "zod";

/**
 * Request-a-Quote (RFQ) schema — shared by the client form and the API route.
 * All fields are plain strings so records remain easy to edit/replace later.
 *
 * `makeQuoteSchema` accepts localized validation messages: the API keeps the
 * English schema, the form builds one from the active locale dictionary.
 */

export interface QuoteFieldMessages {
  company: string;
  contactName: string;
  email: string;
  product: string;
  volume: string;
  destination: string;
}

export function makeQuoteSchema(m: QuoteFieldMessages) {
  return z.object({
    company: z.string().trim().min(2, m.company).max(120),
    contactName: z.string().trim().min(2, m.contactName).max(80),
    email: z.email(m.email).max(120),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    product: z.string().trim().min(1, m.product).max(80),
    format: z.enum(["fresh", "frozen", "both"]),
    volume: z.string().trim().min(1, m.volume).max(60),
    destination: z.string().trim().min(1, m.destination).max(80),
    packaging: z.string().trim().max(200).optional().or(z.literal("")),
    shipmentDate: z.string().trim().max(40).optional().or(z.literal("")),
    message: z.string().trim().max(2000).optional().or(z.literal("")),
    /**
     * Honeypot — a hidden field humans never see or fill.
     * If it arrives non-empty the submitter is a bot; the API accepts the
     * request silently but discards it.
     */
    website: z.string().trim().max(200).optional().or(z.literal("")),
  });
}

export const quoteSchema = makeQuoteSchema({
  company: "Company name is required",
  contactName: "Contact name is required",
  email: "Enter a valid email address",
  product: "Select a product or line",
  volume: "Estimated volume is required",
  destination: "Destination market is required",
});

export type QuoteInput = z.infer<typeof quoteSchema>;

/**
 * Canonical (English) option values — these are what gets submitted and
 * stored; the form displays localized labels over them.
 */
export const formatLabels: Record<QuoteInput["format"], string> = {
  fresh: "Fresh",
  frozen: "Frozen / IQF",
  both: "Fresh & frozen",
};

export const volumeOptions = [
  "1 pallet",
  "2–5 pallets",
  "Full reefer container (≈24 t)",
  "Multiple containers / annual programme",
  "Air freight uplift",
  "To be discussed",
];

export const destinationOptions = [
  "European Union",
  "United Kingdom",
  "Gulf & MENA",
  "Africa",
  "Asia",
  "Americas",
  "Other / multiple markets",
];
