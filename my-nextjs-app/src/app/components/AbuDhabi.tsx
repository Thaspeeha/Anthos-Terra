"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import BloomMap from "./BloomMap";
import { BloomRecord } from "../hooks/useCsvData";
import dynamic from "next/dynamic";
import type { Layout, Data } from "plotly.js";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface TemperatureEntry {
  month: string;
  value: number;
}

interface RainfallEntry {
  year: string;
  value: number;
}

interface BloomData {
  temperatureSeries: TemperatureEntry[];
  rainfallSeries: RainfallEntry[];
  dominantVegetation?: string;
}

interface AbuDhabiProps {
  filteredRecords: BloomRecord[];
  selectedMapLocation: { lat: number; lon: number } | null;
  onSelectLocation: (lat: number, lon: number) => void;
  locationSeries: BloomRecord[];
  data: BloomData | null;
}

export default function AbuDhabi({
  filteredRecords,
  selectedMapLocation,
  onSelectLocation,
  locationSeries,
  data,
}: AbuDhabiProps) {
  // Debug logging
  console.log("AbuDhabi component data:", data);
  console.log("Temperature series:", data?.temperatureSeries);
  console.log("Rainfall series:", data?.rainfallSeries);

  // Helper to ensure all 12 months are present in temperature series
  const fillMonths = (series: TemperatureEntry[]) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const map = new Map(series.map(({ month, value }) => [month, value]));
    return months.map((month) => ({
      month,
      value: map.get(month) ?? 0,
    }));
  };

  const filledTemperatureSeries = fillMonths(data?.temperatureSeries || []);

  const timeSeriesData: Data[] = locationSeries.length
    ? [
        {
          x: locationSeries.map((r) => r.date),
          y: locationSeries.map((r) => r.evi),
          type: "scatter",
          mode: "lines+markers",
          marker: { color: "green" },
          name: "EVI",
        },
      ]
    : [];

  const layout: Partial<Layout> = {
    title: {
      text: "EVI Time Series at Selected Location",
      x: 0.5,
      xanchor: "center",
    },
    xaxis: { title: { text: "Date" } },
    yaxis: { title: { text: "EVI" }, range: [0, 1] },
    autosize: true,
  };

  return (
    <>
      {/* Map positioned inside a container with margin */}
      <div className="mb-4 relative z-0">
        <BloomMap records={filteredRecords} onSelectLocation={onSelectLocation} />
      </div>

      {/* Selected location info */}
      {selectedMapLocation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4 text-sm">
          <div>
            <strong className="text-black">Selected Location:</strong>
            <span className="ml-2 text-blue-600 font-semibold">
              Lat: {selectedMapLocation.lat.toFixed(4)},
              <span className="ml-1">Lon: {selectedMapLocation.lon.toFixed(4)}</span>
            </span>
          </div>
          <div>
            <strong className="text-black">Time Series Records:</strong>
            <span className="ml-2 text-green-600 font-semibold">
              {locationSeries.length} data points
            </span>
          </div>
        </div>
      )}

      {/* Time series plot or no data message */}
      {locationSeries.length > 0 ? (
        <div className="bg-white shadow rounded-lg p-3 mt-6">
          <h2 className="text-sm font-semibold text-[#4A6544] mb-3">EVI Time Series</h2>
          <Plot
            key={`${selectedMapLocation?.lat}-${selectedMapLocation?.lon}-${locationSeries.length}`}
            data={timeSeriesData}
            layout={layout}
            style={{ width: "100%", height: 300 }}
            config={{ responsive: true }}
          />
        </div>
      ) : (
        selectedMapLocation && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6 text-center">
            <p className="text-sm text-yellow-800">
              No time series data available for this location
            </p>
          </div>
        )
      )}

      {/* Temperature and Rainfall side by side */}
      <div className="text-black flex gap-4 mt-6 flex-col md:flex-row">
        <div className="bg-white shadow rounded-lg p-3 flex-1">
          <h2 className="text-sm font-semibold text-[#4A6544] mb-3">
            Monthly Temperature(°C)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={filledTemperatureSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#4A6544"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded-lg p-3 flex-1">
          <h2 className="text-sm font-semibold text-[#4A6544] mb-3">
            Monthly Rainfall (mm)
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data?.rainfallSeries || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
