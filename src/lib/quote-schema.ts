import { z } from "zod";

/**
 * Request-a-Quote (RFQ) schema — shared by the client form and the API route.
 * All fields are plain strings so records remain easy to edit/replace later.
 */
export const quoteSchema = z.object({
  company: z.string().trim().min(2, "Company name is required"),
  contactName: z.string().trim().min(2, "Contact name is required"),
  email: z.email("Enter a valid email address"),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  product: z.string().trim().min(1, "Select a product or line"),
  format: z.enum(["fresh", "frozen", "both"]),
  volume: z.string().trim().min(1, "Estimated volume is required"),
  destination: z.string().trim().min(1, "Destination market is required"),
  packaging: z.string().trim().max(200).optional().or(z.literal("")),
  shipmentDate: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

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
