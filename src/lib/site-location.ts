export const CATER_TECH_LOCATION = {
  companyName: "Catertech Food Catering Services LLC",
  addressLine: "176 Ras Al Khor St, Dubai",
  fullAddress:
    "176 Ras Al Khor St, Ras Al Khor Industrial Area 2, Dubai, United Arab Emirates",
  phone: "+971 4 320 3586",
  coords: {
    lat: 25.1843725,
    lng: 55.350218,
  },
  /** Verified Google Business Profile place ID */
  googlePlaceId: "ChIJ4d8foK9nXz4RUota1WSbql0",
} as const;

/** Opens the verified Google Business listing (app + web, directions, details). */
export function buildGoogleMapsPlaceUrl(
  location: typeof CATER_TECH_LOCATION = CATER_TECH_LOCATION
) {
  const params = new URLSearchParams({
    api: "1",
    query: location.companyName,
    query_place_id: location.googlePlaceId,
  });

  return `https://www.google.com/maps/search/?${params.toString()}`;
}

export const GOOGLE_MAPS_PLACE_URL = buildGoogleMapsPlaceUrl();
