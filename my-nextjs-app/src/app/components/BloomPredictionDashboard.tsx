"use client";

import React, { useEffect, useState } from "react";
import { useCsvData } from "../hooks/useCsvData";
import AbuDhabi from "./AbuDhabi";
import Tribulus from "./Tribulus";

interface TemperatureEntry {
  month: string;
  value: number;
}

interface RainfallEntry {
  year: string;
  value: number;
}

interface MonthlyBloomIntensityEntry {
  month: string;
  intensity: number;
}

interface BloomData {
  date: string;
  temperature: number | string;
  rainfall: number | string;
  temperatureSeries: TemperatureEntry[];
  rainfallSeries: RainfallEntry[];
  ndvi: number;
  bloomPrediction: string;
  dominantVegetation?: string;
  monthlyBloomIntensitySeries?: MonthlyBloomIntensityEntry[];
}

export default function Dashboard() {
  const abuDhabiRecords = useCsvData("/data/abu-dhabi-MOD13A1-061-results.csv");
  const [data, setData] = useState<BloomData | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [city, setCity] = useState("");
  const [plantType, setPlantType] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMapLocation, setSelectedMapLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const uniqueDates = Array.from(
    new Set(abuDhabiRecords.map((r) => r.date))
  ).sort();
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);

  useEffect(() => {
    if (uniqueDates.length) {
      setSelectedDate(uniqueDates[selectedDateIndex]);
    }
  }, [selectedDateIndex, uniqueDates]);

  useEffect(() => {
    if (!city) return;
    setLoading(true);
    fetch(`/api/bloom-data?date=${selectedDate}&city=${city}&plant=${plantType}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
      })
      .catch(() => {
        // fallback data on API error
        setData({
          date: selectedDate,
          temperature: 25,
          rainfall: 10,
          ndvi: 0.45,
          bloomPrediction: "Unable to load prediction",
          dominantVegetation: "Desert Vegetation",
          temperatureSeries: [
            { month: "Jan", value: 20.3 },
            { month: "Feb", value: 21 },
            { month: "Mar", value: 23.7 },
            { month: "Apr", value: 27.3 },
            { month: "May", value: 31.1 },
            { month: "Jun", value: 33.3 },
            { month: "Jul", value: 35.2 },
            { month: "Aug", value: 35.8 },
            { month: "Sep", value: 34.1 },
            { month: "Oct", value: 31.3 },
            { month: "Nov", value: 27 },
            { month: "Dec", value: 22.9 },
          ],
          rainfallSeries: [
            { year: "Jan", value: 34.63 },
            { year: "Feb", value: 8.34 },
            { year: "Mar", value: 9.71 },
            { year: "Apr", value: 2.82 },
            { year: "May", value: 2.25 },
            { year: "Jun", value: 0 },
            { year: "Jul", value: 0.56 },
            { year: "Aug", value: 0 },
            { year: "Sep", value: 0 },
            { year: "Oct", value: 22.15 },
            { year: "Nov", value: 7.6 },
            { year: "Dec", value: 2.37 },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, [selectedDate, city, plantType]);

  useEffect(() => {
    if (plantType) setSelectedMapLocation(null);
  }, [plantType]);

  const filteredRecords = abuDhabiRecords.filter(
    (r) => r.date === selectedDate
  );

  const onSelectLocation = (lat: number, lon: number) => {
    setSelectedMapLocation({ lat, lon });
    setPlantType("");
  };

  const locationSeries = selectedMapLocation
    ? abuDhabiRecords
        .filter((r) => {
          const latMatch = Math.abs(r.lat - selectedMapLocation.lat) < 0.0001;
          const lonMatch = Math.abs(r.lon - selectedMapLocation.lon) < 0.0001;
          return latMatch && lonMatch;
        })
        .sort((a, b) => a.date.localeCompare(b.date))
    : [];

  const showCityDashboard = city === "abu-dhabi" && !plantType;
  const showPlantDashboard = !!plantType;

  return (
      <div className="min-h-screen bg-garden-bg py-8 px-4 max-w-5xl mx-auto">
    <div style={{ position: "relative", zIndex: 10 }}>
      <h1 className="text-2xl font-bold text-center text-[#4A6544] mb-6">
       Your Bloom Dashboard
      </h1>
    </div>

      {/* City selection */}
      <div className="flex justify-center mb-6">
        <div>
          <label className="block font-medium text-black mb-1">Select City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 border border-gray-300 rounded-md text-black min-w-[200px]"
          >
            <option value="">-- Select City --</option>
            <option value="abu-dhabi">Abu Dhabi</option>
            <option value="dubai">Dubai</option>
            <option value="sharjah">Sharjah</option>
            <option value="ajman">Ajman</option>
          </select>
        </div>
      </div>

      {/* Abu Dhabi dashboard */}
      {showCityDashboard && (
        <>
          {/* Instruction message only shown after city selection */}
          <div className="mb-6 max-w-xl mx-auto text-center">
            <span className="inline-block bg-green-100 text-green-800 rounded px-4 py-2 text-sm font-medium shadow">
              Click on any of the markers on the map according to the desired date from the time slider below to get the detailed EVI graph.
            </span>
          </div>

          <div className="mb-6 max-w-md mx-auto">
            <label className="block text-sm font-medium text-black mb-2 text-center">
              Select Date
            </label>
            <input
              type="range"
              min={0}
              max={uniqueDates.length - 1}
              value={selectedDateIndex}
              onChange={(e) => setSelectedDateIndex(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm text-center mt-1 font-medium text-[#4A6544]">
              {uniqueDates[selectedDateIndex]}
            </div>
          </div>

          <AbuDhabi
            filteredRecords={filteredRecords}
            selectedMapLocation={selectedMapLocation}
            onSelectLocation={onSelectLocation}
            locationSeries={locationSeries}
            data={data}
          />

          {/* Plant discovery section */}
          <div className="bg-white shadow rounded-lg p-6 text-center w-full mt-6">
            <h2 className="text-lg font-semibold text-[#4A6544] mb-4">
              Discover Plants in Your Region
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Explore detailed information about native plants and their bloom
              patterns
            </p>
            <div className="max-w-xs mx-auto">
              <label className="block font-medium text-black mb-2">
                Select Plant
              </label>
              <select
                value={plantType}
                onChange={(e) => setPlantType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-black"
              >
                <option value="">-- Select Plant --</option>
                <option value="tribulus">Tribulus Omanense</option>
              </select>
            </div>
          </div>
        </>
      )}

      {/* Plant-specific dashboard */}
      {showPlantDashboard && (
        <div>
          <button
            onClick={() => setPlantType("")}
            className="mb-2 px-4 py-2 bg-black rounded hover:bg-gray-400"
          >
            Back
          </button>
          <div className="mt-2">
            <Tribulus data={data} />
          </div>
        </div>
      )}
    </div>
  );
}