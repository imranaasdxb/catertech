import { createClient } from "next-sanity";
import {
  hasSanityConfig,
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "@/sanity/env";

export function getSanityClient() {
  if (!hasSanityConfig()) return null;

  return createClient({
    projectId: sanityProjectId,
    dataset: sanityDataset,
    apiVersion: sanityApiVersion,
    useCdn: true,
  });
}
