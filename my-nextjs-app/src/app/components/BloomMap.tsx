"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from "react-leaflet";
import L from "leaflet";
import Image from "next/image";
import "leaflet/dist/leaflet.css";
import { FeatureCollection } from "geojson";

// ---- Leaflet marker fix for Next.js ----
interface FixedIcon extends L.Icon.Default {
  _getIconUrl?: () => string;
}
delete (L.Icon.Default.prototype as FixedIcon)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// ---- Types ----
type BloomInfo = {
  name: string;
  coords: [number, number];
  description: string[]; // changed to array of strings
  image: string;
};
type CountryData = {
  coords: [number, number];
  zoom: number;
  blooms: BloomInfo[];
};

// ---- Data ----
const data: Record<string, CountryData> = {
  India: {
    coords: [10.0896, 77.0595],
    zoom: 8,
    blooms: [
      {
        name: "Neelakurinji",
        coords: [10.0896, 77.0595],
        description: [
          "Neelakurinji (Strobilanthes kunthiana) is a rare flowering shrub found in the Western Ghats of South India, particularly in Kerala and Tamil Nadu.",
          "🌍 Location: Found in the Western Ghats of South India, especially in Munnar, Idukki, Wayanad, and the Nilgiris at high-altitude grasslands (1,200–2,500 meters).",
          "🌸 Cause: Bloom occurs naturally every 12 years as part of the plant’s life cycle; seeds regenerate after each flowering.",
          "🦋 Pollinators & Ecology: Supports bees, butterflies, and birds, maintains grassland ecosystems, and prevents soil erosion.",
          "📅 Timing: Flowers once every 12 years; the last major bloom was in 2018, and the next is expected around 2030.",
          "🏞️ Impacts: Creates vast purple-blue landscapes, attracts eco-tourism, boosts local economy, and has cultural significance in the region.",
          "🔬 Monitoring & Conservation: Protected in national parks and reserves; researchers track blooms to study ecosystem health and biodiversity."
        ],
        image: "/images/Kurinji_Bloom_in_Munnar.jpg",
      },
    ],
  },
  UAE: {
    coords: [24.4539, 54.3773],
    zoom: 6,
    blooms: [
      {
        name: "Red Algae Bloom",
        coords: [24.5, 54.4],
        description: [
          "Red tide is a phenomenon caused by the rapid proliferation of harmful algae (Harmful Algal Blooms – HABs) in coastal waters.",
          "🌡️ Cause: Triggered by warm water, high nutrients from runoff, calm seas, and salinity changes.",
          "🦠 Types: Includes toxic species (e.g., Alexandrium, Karenia) harmful to marine life and humans, and non-toxic species (e.g., Noctiluca scintillans) that mainly discolor water.",
          "📅 Timing: Most frequent in summer months (June–September), but can vary yearly.",
          "⚖️ Impacts: Can cause fish kills, shellfish contamination, human irritation, affect fisheries and tourism, and alter marine ecosystems.",
          "🔬 Monitoring: Managed through water sampling, satellite imagery, and public advisories to protect health, fisheries, and coastal environments."
        ],
        image: "/images/Red_tide.jpg",
      },
    ],
  },
  USA: {
    coords: [34.5, -119.7],
    zoom: 6,
    blooms: [
      {
        name: "California Bloom",
        coords: [34.5, -119.7],
        description: [
          "The California Super Bloom is a rare and spectacular natural event when vast areas of wildflowers bloom simultaneously, carpeting deserts, hills, and valleys with vibrant colors.",
          "🌍 Location: Occur in deserts and reserves like Anza-Borrego, Carrizo Plain, and Antelope Valley.",
          "🌱 Cause: Triggered by rare perfect conditions—abundant rain, cool temps, low wind, and dormant seed banks.",
          "📅 Timing: Happen in spring (Feb – Apr), with true super blooms only every 10–15 years.",
          "🌦️ Importance: Boost pollinators, attract tourists, raise conservation concerns, and aid scientific study.",
          "🌍 Recent events: Major blooms in 2019 and 2023, visible from space and internationally famous."
        ],
        image: "/images/California_Superbloom.jpg",
      },
    ],
  },
};

// ---- MapZoom helper ----
function MapZoom({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

// ---- BloomMap Component ----
export default function BloomMap() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedBloom, setSelectedBloom] = useState<BloomInfo | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  const [geoJSONData, setGeoJSONData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch(
      "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
    )
      .then((res) => res.json())
      .then((data: FeatureCollection) => setGeoJSONData(data));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          padding: "1rem",
          background: "#f0f4f8",
          overflowY: "auto",
          height: "100vh",
        }}
      >
        <h2 style={{ color: "#1b3a57", fontWeight: "bold", marginBottom: "0.5rem" }}>
          Bloom Explorer
        </h2>
        <p style={{ color: "#3b5998", marginBottom: "1rem" }}>
          Select a country and bloom:
        </p>

        {Object.keys(data).map((country) => (
          <button
            key={country}
            style={{
              display: "block",
              width: "100%",
              margin: "0.25rem 0",
              padding: "0.5rem",
              background: selectedCountry === country ? "#1b95e0" : "#fff",
              color: selectedCountry === country ? "#fff" : "#1b3a57",
              border: "1px solid #1b3a57",
              borderRadius: "6px",
              cursor: "pointer",
              textAlign: "left",
              fontWeight: "500",
            }}
            onClick={() => {
              setSelectedCountry(country);
              setSelectedBloom(null);
              setPanelOpen(true);
            }}
          >
            {country}
          </button>
        ))}

        {selectedCountry && (
          <div style={{ marginTop: "1rem" }}>
            <h3 style={{ color: "#d35400", marginBottom: "0.5rem" }}>
              Blooms in {selectedCountry}
            </h3>
            {data[selectedCountry].blooms.map((bloom) => (
              <button
                key={bloom.name}
                style={{
                  display: "block",
                  width: "100%",
                  margin: "0.25rem 0",
                  padding: "0.5rem",
                  background: selectedBloom?.name === bloom.name ? "#f39c12" : "#fff",
                  color: selectedBloom?.name === bloom.name ? "#fff" : "#d35400",
                  border: "1px solid #d35400",
                  borderRadius: "6px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontWeight: "500",
                }}
                onClick={() => {
                  setSelectedBloom(bloom);
                  setPanelOpen(true);
                }}
              >
                {bloom.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Expandable Panel */}
      <div
        style={{
          width: panelOpen ? "320px" : "40px",
          transition: "width 0.3s",
          background: "#fffdf5",
          borderRight: "1px solid #ddd",
          position: "relative",
          height: "100vh", // ensure panel fills screen!
          overflowY: "auto",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={() => setPanelOpen(!panelOpen)}
          style={{
            position: "absolute",
            top: "10px",
            right: "-30px",
            background: "#6c8a72",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "4px 8px",
            cursor: "pointer",
          }}
        >
          {panelOpen ? "⮜" : "⮞"}
        </button>

        {panelOpen && selectedBloom && (
         <div style={{ padding: "1rem" }}>
           <h3 style={{ color: "#16a085", marginBottom: "0.25rem" }}>
             {selectedBloom.name}
           </h3>
           <div style={{ color: "#555", marginBottom: "0.5rem" }}>
             {selectedBloom.description.map((line, index) => (
               <p key={index} style={{ margin: "0.25rem 0" }}>{line}</p>
            ))}
          </div>
          {/* Fixed image section */}
          <div style={{ width: "100%", maxWidth: "320px", height: "220px", overflow: "hidden", borderRadius: "6px" }}>
           <Image
             src={selectedBloom.image}
             alt={selectedBloom.name}
             width={320}          // fixed width
             height={220}         // fixed height
             style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
         </div>
        </div>
       )}
      </div>

      {/* Map */}
      <div style={{ flex: 1, height: "100vh"  }}>
        <MapContainer center={[20, 0]} zoom={2} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri WorldImagery"
          />

          {geoJSONData && (
            <GeoJSON
              data={geoJSONData}
              style={() => ({
                color: "#1b3a57",
                weight: 1,
                fillOpacity: 0,
              })}
              onEachFeature={(feature, layer) => {
                if (feature.properties && feature.properties.name) {
                  layer.bindTooltip(feature.properties.name, {
                    permanent: false,
                    direction: "center",
                    className: "country-label",
                  });
                }
              }}
            />
          )}

          {selectedCountry && (
            <MapZoom center={data[selectedCountry].coords} zoom={data[selectedCountry].zoom} />
          )}

          {selectedBloom && (
            <Marker position={selectedBloom.coords}>
              <Popup>
                <b>{selectedBloom.name}</b>
                <br />
                {selectedBloom.description.map((line, index) => (
                  <span key={index}>
                    {line}
                    <br />
                  </span>
                ))}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}














