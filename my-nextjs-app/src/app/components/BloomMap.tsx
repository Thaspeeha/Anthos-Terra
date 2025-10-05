"use client";

import React, { useMemo } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { BloomRecord } from "../hooks/useCsvData";

// Fix for missing default icon URLs in React Leaflet
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

interface BloomMapProps {
  records: BloomRecord[];
  onSelectLocation: (lat: number, lon: number) => void;
  minRadius?: number; // optional: minimum marker radius
  maxRadius?: number; // optional: maximum marker radius
}

// Utility to get a color from EVI (low=tawny, high=green)
function getEviColor(evi: number): string {
  // Clamp EVI between 0.2 and 0.7 for domain
  const eviClamped = Math.max(0.2, Math.min(evi, 0.7));
  // Linear interpolate: 0.2 (tan) to 0.7 (green)
  const t = (eviClamped - 0.2) / 0.5;
  // HSV 30° (tan) to 110° (green)
  const hue = 30 + 80 * t;
  return `hsl(${hue}, 75%, 49%)`;
}

export default function BloomMap({
  records,
  onSelectLocation,
  minRadius = 7,
  maxRadius = 22,
}: BloomMapProps) {
  // Compute map center: average coordinates, fallback to default
  const mapCenter = useMemo(() => {
    if (!records.length) return [24.0, 51.0];
    const avgLat = records.reduce((sum, r) => sum + Number(r.lat), 0) / records.length;
    const avgLon = records.reduce((sum, r) => sum + Number(r.lon), 0) / records.length;
    return [avgLat, avgLon];
  }, [records]);

  // Compute EVI domain for scaling
  const [minEvi, maxEvi] = useMemo(() => {
    if (!records.length) return [0.2, 0.7];
    let min = +records[0].evi;
    let max = +records[0].evi;
    records.forEach(r => {
      const v = Number(r.evi);
      if (v < min) min = v;
      if (v > max) max = v;
    });
    // avoid zero range
    if (min === max) max = min + 0.1;
    return [min, max];
  }, [records]);

  // Map EVI to radius
  function getRadius(evi: number): number {
    // linear scale
    const t = (evi - minEvi) / (maxEvi - minEvi);
    return minRadius + t * (maxRadius - minRadius);
  }

  return (
    <MapContainer center={mapCenter as [number, number]} zoom={9} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {records.length === 0 ? (
        <></>
      ) : (
        records.map((rec, idx) => {
          const evi = Number(rec.evi);
          const markerColor = getEviColor(evi);
          const radius = getRadius(evi);
          return (
            <CircleMarker
              key={idx}
              center={[Number(rec.lat), Number(rec.lon)]}
              radius={radius}
              color="#333"
              fillColor={markerColor}
              fillOpacity={0.85}
              eventHandlers={{ click: () => onSelectLocation(rec.lat, rec.lon) }}
            >
              <Tooltip direction="top" offset={[0, -3]} opacity={1}>
                <div>
                  <div><b>Date</b>: {rec.date}</div>
                  <div><b>EVI</b>: {evi.toFixed(3)}</div>
                  <div><b>Lat/Lon</b>: {Number(rec.lat).toFixed(4)}, {Number(rec.lon).toFixed(4)}</div>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })
      )}
    </MapContainer>
  );
}
