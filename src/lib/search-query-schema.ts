import { z } from "zod";
import { MAX_SEARCH_LENGTH, MIN_SEARCH_LENGTH, normalizeSearch } from "@/lib/search";

export const searchQuerySchema = z.string().trim().max(MAX_SEARCH_LENGTH)
  .transform(normalizeSearch)
  .refine((value) => !value || value.length >= MIN_SEARCH_LENGTH, {
    message: `Enter at least ${MIN_SEARCH_LENGTH} characters.`,
  })
  .default("");
