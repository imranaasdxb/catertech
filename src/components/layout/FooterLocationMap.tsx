"use client";

import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const OFFICE_COORDS = {
  lat: 25.184327,
  lng: 55.350027,
} as const;

/** Latin-script / English-friendly OSM labels (Wikimedia intl layer). */
const ENGLISH_TILE_URL = "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png";

function createOfficePin(companyName: string) {
  return L.divIcon({
    className: "footer-map-marker",
    html: `
      <div class="footer-map-marker__wrap" role="button" tabindex="0" aria-label="Open ${companyName} in Google Maps">
        <div class="footer-map-marker__label">${companyName}</div>
        <div class="footer-map-marker__pin">
          <span class="footer-map-pin__ring" aria-hidden="true"></span>
          <span class="footer-map-pin__dot" aria-hidden="true"></span>
        </div>
      </div>
    `,
    iconSize: [228, 78],
    iconAnchor: [114, 58],
  });
}

type FooterLocationMapProps = {
  mapsUrl: string;
  companyName: string;
};

export default function FooterLocationMap({
  mapsUrl,
  companyName,
}: FooterLocationMapProps) {
  const pinIcon = useMemo(() => createOfficePin(companyName), [companyName]);

  const openInGoogleMaps = () => {
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <MapContainer
      center={[OFFICE_COORDS.lat, OFFICE_COORDS.lng]}
      zoom={15}
      minZoom={14}
      maxZoom={18}
      scrollWheelZoom={false}
      zoomControl={false}
      attributionControl={false}
      dragging={false}
      doubleClickZoom={false}
      boxZoom={false}
      keyboard={false}
      touchZoom={false}
      className="footer-location-map h-full w-full"
    >
      <TileLayer url={ENGLISH_TILE_URL} maxZoom={19} />
      <Marker
        position={[OFFICE_COORDS.lat, OFFICE_COORDS.lng]}
        icon={pinIcon}
        eventHandlers={{
          click: openInGoogleMaps,
          keydown: (event) => {
            if (event.originalEvent.key === "Enter" || event.originalEvent.key === " ") {
              event.originalEvent.preventDefault();
              openInGoogleMaps();
            }
          },
        }}
      />
    </MapContainer>
  );
}
