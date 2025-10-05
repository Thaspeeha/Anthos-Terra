"use client";

import React, { useEffect, useState } from "react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ResponsiveLine } from "@nivo/line";
import Papa from 'papaparse';
const bloomIntensity = 45;
const pollenAlert = bloomIntensity > 40 ? 'High' : 'Low';



const ndviData = [
  {
    id: "NDVI",
    color: "hsl(120, 70%, 50%)",
    data: [
      { x: "2020", y: 0.45 },
      { x: "2021", y: 0.48 },
      { x: "2022", y: 0.42 },
      { x: "2023", y: 0.50 },
      { x: "2024", y: 0.47 },
      { x: "2025", y: 0.51 },
    ],
  },
];

interface MonthlyBloomIntensityEntry {
  month: string;
  intensity: number;
}

interface BloomData {
  bloomPrediction: string;
  monthlyBloomIntensitySeries?: MonthlyBloomIntensityEntry[];
}

interface TribulusProps {
  data: BloomData | null;
}

// Simple linear regression
function simpleLinearRegression(xs: number[], ys: number[]) {
  const n = xs.length;
  if (n === 0) throw new Error("No data points");

  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (xs[i] - meanX) * (ys[i] - meanY);
    denominator += (xs[i] - meanX) ** 2;
  }
  if (denominator === 0) throw new Error("Cannot compute regression");

  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  return {
    predict: (x: number) => intercept + slope * x,
  };
}

export default function Tribulus({ data }: TribulusProps) {
  const [predictedBloom, setPredictedBloom] = useState<number | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [monthlyAvgData, setMonthlyAvgData] = useState<{month: number, intensity: number}[]>([]);

  const targetYear = 2026;
  const targetMonth = 1; // January

  useEffect(() => {
    async function fetchAndPredict() {
      try {
        const bloomRes = await fetch('/data/liwa-HLSS30-020-results.csv');
        const bloomText = await bloomRes.text();
        const parsedBloom = Papa.parse(bloomText, { header: true });

        if (!parsedBloom || !parsedBloom.data?.length) {
          setPredictionError('No bloom data found in CSV.');
          return;
        }

        const bloomMap = new Map<string, number[]>();
        for (const row of parsedBloom.data as any[]) {
          const dateStr = (row.Date || '').trim();
          const valStr = (row.HLSS30_020_B08 || '').trim();
          if (!dateStr || !valStr) continue;
          const date = new Date(dateStr);
          if (isNaN(date.getTime())) continue;
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const val = parseFloat(valStr);
          if (isNaN(val) || val < 0) continue;

          const key = `${year}-${month.toString().padStart(2, '0')}`;
          if (!bloomMap.has(key)) bloomMap.set(key, []);
          bloomMap.get(key)!.push(val);
        }

        if (bloomMap.size === 0) {
          setPredictionError('No valid bloom data to predict.');
          return;
        }

        const bloomByMonth = Array.from(bloomMap.entries()).map(([key, values]) => {
          const [yearStr, monthStr] = key.split('-');
          return {
            Year: parseInt(yearStr, 10),
            Month: parseInt(monthStr, 10),
            BloomIntensity: values.reduce((a, b) => a + b, 0) / values.length,
          };
        });

        // Initialize all 12 months with empty arrays
        const monthlyMap = new Map<number, number[]>();
        for (let m = 1; m <= 12; m++) {
          monthlyMap.set(m, []);
        }
        
        // Fill in the data
        for (const entry of bloomByMonth) {
          monthlyMap.get(entry.Month)!.push(entry.BloomIntensity);
        }
        
        // Calculate averages (or 0 for months with no data)
        const monthlyAvg = Array.from(monthlyMap.entries()).map(([month, vals]) => ({
          month,
          intensity: vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
        })).sort((a, b) => a.month - b.month);

        setMonthlyAvgData(monthlyAvg);

        const xs = bloomByMonth.map(d => d.Year + (d.Month - 1) / 12);
        const ys = bloomByMonth.map(d => d.BloomIntensity);

        if (xs.length === 0) {
          setPredictionError('No bloom data available to predict.');
          return;
        }

        const regression = simpleLinearRegression(xs, ys);
        const targetX = targetYear + (targetMonth - 1) / 12;
        const predicted = regression.predict(targetX);

        setPredictedBloom(predicted);
        setPredictionError(null);

      } catch (err) {
        setPredictionError('Failed to load or process bloom data.');
      }
    }
    fetchAndPredict();
  }, []);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6 mt-6 w-full">
        <div
          className="bg-white shadow rounded-lg p-3 flex-1"
          style={{ height: 220 }}
        >
          <h2 className="text-sm font-semibold text-[#4A6544] text-center mb-2">
            NDVI Historical Trends
          </h2>
          <div style={{ color: '#4A6544', height: 160 }}>
            <ResponsiveLine
              data={ndviData}
              margin={{ top: 24, right: 32, bottom: 36, left: 50 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: 0, max: 1 }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                legend: "Year",
                legendOffset: 28,
                legendPosition: "middle",
              }}
              axisLeft={{
                legend: "NDVI Value",
                legendOffset: -36,
                legendPosition: "middle",
              }}
              colors={{ scheme: "green_blue" }}
              pointSize={7}
              pointBorderWidth={2}
              pointBorderColor={{ from: "serieColor" }}
              pointColor= "#ff6b6b"
              enableGridX={false}
              enableGridY={true}
              useMesh={true}
              enableSlices="x"
              tooltip={({ point }) => (
                <div
                  style={{
                    background: "red",
                    color:"black",
                    padding: 7,
                    border: "1px solid #ccc",
                  }}
                >
                  <strong>{point.data.xFormatted}</strong>:{" "}
                  {point.data.yFormatted}
                </div>
              )}
            />
          </div>
        </div>

        <div
          className="bg-white shadow rounded-lg p-3 flex-1"
          style={{ height: 220 }}
        >
          <h2 className="text-sm font-semibold text-[#4A6544] text-center mb-2">
            Monthly Bloom Intensity
          </h2>
          <div style={{ color: '#4A6544', height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyAvgData.length > 0 ? monthlyAvgData : (data?.monthlyBloomIntensitySeries || [])}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" label={{ value: 'Month' }} fontSize={10} />
                <YAxis label={{ value: 'Intensity', angle: -90, position: 'insideLeft' }} fontSize={10} />
                <Tooltip />
                <Bar dataKey="intensity" fill="#f9a825" barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      

      <div className="bg-white shadow rounded-lg p-6 text-center w-full mt-6">
        <h2 className="text-lg font-semibold text-[#4A6544] mb-2">
          Next Bloom In {targetYear}-{targetMonth.toString().padStart(2, '0')}
        </h2>
        {predictionError ? (
          <p className="text-red-600 font-medium">{predictionError}</p>
        ) : predictedBloom !== null ? (
          <div className="space-y-2">
            <p className="text-2xl font-bold text-[#4A6544]">
              {predictedBloom.toFixed(4)}
            </p>
            <p className="text-sm text-gray-600 font-bold">
              Predicted Bloom Intensity 
            </p>
            <p className=" text-green-600 font-bold mt-4">
              {data?.bloomPrediction ?? "  High bloom intensity expected in March-April based on current rainfall and temperature patterns."}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">Loading prediction...</p>
        )}
      </div>

       {/* Health Alert */}
    <div className="bg-white shadow rounded-lg p-4 w-full mt-6">
      <h2 className="font-semibold text-[#4A6544] mb-2">Health Alert</h2>
      <p className="text-gray-700">Pollen Alert Level: <strong className="text-red-500">{pollenAlert}</strong></p>
      <ul className="list-disc pl-5 mt-2 text-gray-700">
        <li>Limit outdoor activities if sensitive to pollen</li>
        <li>Use air filters or masks during high pollen periods</li>
        <li>Consult healthcare providers for allergy management</li>
      </ul>
      <p className="text-black font-bold mt-3">
        Note : This alert is based on predicted bloom intensity and may vary.
      </p>
    </div>

      <div className="bg-white shadow rounded-lg p-6 w-full mt-6">
        <h2 className="text-lg font-semibold text-[#4A6544] mb-4">
          Conservation Information
        </h2>
        <div className="text-left space-y-3 text-sm text-gray-700">
          <p>
            <strong>Tribulus omanense</strong> is a rare endemic plant species
            found in the Liwa region of the UAE. It plays a crucial role in the
            desert ecosystem and requires careful conservation efforts.
          </p>
          <div>
            <h3 className="font-semibold text-[#4A6544] mb-1">
              Conservation Status:
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Endemic to UAE desert regions</li>
              <li>Threatened by habitat loss and climate change</li>
              <li>Protected under UAE environmental regulations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[#4A6544] mb-1">
              Ecological Importance:
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Provides food and shelter for native wildlife</li>
              <li>Helps prevent soil erosion in desert areas</li>
              <li>Supports biodiversity in arid ecosystems</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 text-center w-full mt-6">
        <h2 className="text-lg font-semibold text-[#4A6544] mb-2">
          Learn More Through Video
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Watch our educational video about Tribulus omanense and its
          conservation
        </p>
        <button className="mt-3 px-6 py-3 bg-green-100 text-green-700 rounded-md text-base hover:bg-green-200 transition-colors">
          Watch Video
        </button>
      </div>
    </>
  );
}