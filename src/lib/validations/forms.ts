import { z } from "zod";

export const contactSchema = z.object({
  fullName: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(50).optional().or(z.literal("")),
  message: z.string().min(1).max(10000),
});

export const enquirySchema = z.object({
  companyName: z.string().min(1).max(300),
  contactName: z.string().min(1).max(200),
  phone: z.string().min(1).max(50),
  email: z.string().email().max(320),
  emirate: z.string().max(100).optional().or(z.literal("")),
  serviceInterest: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(1).max(10000),
});

export const quoteSchema = z.object({
  customerName: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().min(1).max(50),
  company: z.string().max(300).optional().or(z.literal("")),
  address: z.string().min(1).max(500),
  message: z.string().max(5000).optional().or(z.literal("")),
  source: z.enum(["email", "whatsapp"]).optional(),
  items: z
    .array(
      z.object({
        name: z.string(),
        category: z.string(),
        /** Optional line price shown in WhatsApp / notification email. */
        price: z.string().max(120).optional(),
        qty: z.number().int().positive(),
      })
    )
    .min(1),
});

export const rfqEventTypes = [
  "Wedding",
  "Corporate Event",
  "Exhibition",
  "Conference",
  "Private Party",
  "Catering Event",
  "Government Event",
  "Other",
] as const;

export const rfqSchema = z.object({
  companyName: z.string().min(1).max(300),
  tradeLicenceNo: z.string().max(200).optional().or(z.literal("")),
  contactPerson: z.string().min(1).max(200),
  phone: z.string().min(1).max(50),
  email: z.string().email().max(320),
  budgetAed: z.string().max(100).optional().or(z.literal("")),
  emirate: z.string().max(100).optional().or(z.literal("")),
  eventName: z.string().min(1).max(300),
  eventType: z.enum(rfqEventTypes),
  eventDate: z.string().max(50).optional().or(z.literal("")),
  eventDuration: z.string().max(100).optional().or(z.literal("")),
  venueName: z.string().max(300).optional().or(z.literal("")),
  venueLocation: z.string().max(300).optional().or(z.literal("")),
  expectedGuests: z.string().max(50).optional().or(z.literal("")),
  notes: z.string().max(10000).optional().or(z.literal("")),
});

export type RfqPayload = z.infer<typeof rfqSchema>;
