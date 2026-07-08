"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CATER_TECH_LOCATION } from "@/lib/site-location";

/** Carto basemap — reliable in production (Wikimedia tiles often 403 off localhost). */
const MAP_TILE_URL =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
const MAP_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const OFFICE_COORDS = CATER_TECH_LOCATION.coords;

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

function MapResizeFix() {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => {
      map.invalidateSize({ animate: false });
    };

    invalidate();
    const timers = [150, 400, 900].map((ms) => window.setTimeout(invalidate, ms));

    const container = map.getContainer();
    const resizeTarget = container.parentElement ?? container;

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(invalidate)
        : null;
    resizeObserver?.observe(resizeTarget);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) invalidate();
      },
      { threshold: 0.01 },
    );
    intersectionObserver.observe(container);

    window.addEventListener("resize", invalidate);

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      resizeObserver?.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("resize", invalidate);
    };
  }, [map]);

  return null;
}

function MapOpenLink({ mapsUrl }: { mapsUrl: string }) {
  const openInGoogleMaps = () => {
    window.open(mapsUrl, "_blank", "noopener,noreferrer");
  };

  useMapEvents({
    click: openInGoogleMaps,
  });

  return null;
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
      attributionControl
      dragging={false}
      doubleClickZoom={false}
      boxZoom={false}
      keyboard={false}
      touchZoom={false}
      className="footer-location-map h-full min-h-[200px] w-full cursor-pointer"
    >
      <TileLayer
        url={MAP_TILE_URL}
        attribution={MAP_TILE_ATTRIBUTION}
        subdomains="abcd"
        maxZoom={20}
      />
      <MapResizeFix />
      <MapOpenLink mapsUrl={mapsUrl} />
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
