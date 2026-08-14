import { z } from "zod";
import {
  sanitizeEmail,
  sanitizeMultilineText,
  sanitizePhone,
  sanitizeText,
} from "@/lib/sanitize";

function requiredText(max: number) {
  return z
    .string()
    .max(max * 2)
    .transform(sanitizeText)
    .pipe(z.string().min(1).max(max));
}

function optionalText(max: number) {
  return z
    .union([
      z.string().max(max * 2).transform(sanitizeText).pipe(z.string().max(max)),
      z.literal(""),
    ])
    .optional();
}

function requiredMultiline(max: number) {
  return z
    .string()
    .max(max * 2)
    .transform(sanitizeMultilineText)
    .pipe(z.string().min(1).max(max));
}

function optionalMultiline(max: number) {
  return z
    .union([
      z
        .string()
        .max(max * 2)
        .transform(sanitizeMultilineText)
        .pipe(z.string().max(max)),
      z.literal(""),
    ])
    .optional();
}

const emailField = z
  .string()
  .max(640)
  .transform(sanitizeEmail)
  .pipe(z.string().email().max(320));

const phoneField = z
  .string()
  .max(100)
  .transform(sanitizePhone)
  .pipe(z.string().min(1).max(50));

const optionalPhoneField = z
  .union([
    z.string().max(100).transform(sanitizePhone).pipe(z.string().max(50)),
    z.literal(""),
  ])
  .optional();

export const contactSchema = z.object({
  fullName: requiredText(200),
  email: emailField,
  phone: optionalPhoneField,
  message: requiredMultiline(10000),
});

export const enquirySchema = z.object({
  companyName: requiredText(300),
  contactName: requiredText(200),
  phone: phoneField,
  email: emailField,
  emirate: optionalText(100),
  serviceInterest: optionalText(200),
  message: requiredMultiline(10000),
});

export const quoteSchema = z.object({
  customerName: requiredText(200),
  email: emailField,
  phone: phoneField,
  company: optionalText(300),
  address: requiredText(500),
  message: optionalMultiline(5000),
  source: z.enum(["email", "whatsapp"]).optional(),
  items: z
    .array(
      z.object({
        name: requiredText(200),
        category: requiredText(120),
        /** Optional line price shown in WhatsApp / notification email. */
        price: optionalText(120),
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
  companyName: requiredText(300),
  tradeLicenceNo: optionalText(200),
  contactPerson: requiredText(200),
  phone: phoneField,
  email: emailField,
  budgetAed: optionalText(100),
  emirate: optionalText(100),
  eventName: requiredText(300),
  eventType: z.enum(rfqEventTypes),
  eventDate: optionalText(50),
  eventDuration: optionalText(100),
  venueName: optionalText(300),
  venueLocation: optionalText(300),
  expectedGuests: optionalText(50),
  notes: optionalMultiline(10000),
});

export type RfqPayload = z.infer<typeof rfqSchema>;
