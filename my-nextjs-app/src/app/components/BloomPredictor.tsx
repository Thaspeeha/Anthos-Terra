import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type BloomData = { Year: number; Month: number; BloomIntensity: number; };

// Simple linear regression for 1-D input
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

export default function BloomPredictor() {
  const [predictedBloom, setPredictedBloom] = useState<number | null>(null);
  const [bloomTable, setBloomTable] = useState<BloomData[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Set target prediction year/month here
  const targetYear = 2026;
  const targetMonth = 1; // January

  // For chart: aggregated average per month across all years
  const [monthlyAvgData, setMonthlyAvgData] = useState<{month: number, avgIntensity: number}[]>([]);

  useEffect(() => {
    async function fetchAndPredict() {
      try {
        const bloomRes = await fetch('/data/liwa-HLSS30-020-results.csv');
        const bloomText = await bloomRes.text();
        const parsedBloom = Papa.parse(bloomText, { header: true });

        if (!parsedBloom || !parsedBloom.data?.length) {
          setErrorMessage('No bloom data found in CSV.');
          setPredictedBloom(null);
          return;
        }

        const bloomMap = new Map<string, number[]>(); // key "YYYY-MM"
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
          setErrorMessage('No valid bloom data to predict.');
          setPredictedBloom(null);
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

        setBloomTable(bloomByMonth);

        // Aggregate monthly average bloom intensity for chart (across all years)
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
          avgIntensity: vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0
        })).sort((a, b) => a.month - b.month);

        // Regression using Year+month
        const xs = bloomByMonth.map(d => d.Year + (d.Month - 1) / 12);
        const ys = bloomByMonth.map(d => d.BloomIntensity);

        if (xs.length === 0) {
          setErrorMessage('No bloom data available to predict.');
          setPredictedBloom(null);
          return;
        }

        const regression = simpleLinearRegression(xs, ys);
        const targetX = targetYear + (targetMonth - 1) / 12;
        const predicted = regression.predict(targetX);

        setPredictedBloom(predicted);
        setErrorMessage(null);

      } catch (err) {
        setErrorMessage('Failed to load or process bloom data.');
        setPredictedBloom(null);
      }
    }
    fetchAndPredict();
  }, []);

  return (
    <div>
      <h2>Monthly Bloom Intensity Data</h2>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Month</th>
            <th>Bloom Intensity</th>
          </tr>
        </thead>
        <tbody>
          {bloomTable.map(({ Year, Month, BloomIntensity }) => (
            <tr key={`${Year}-${Month}`}>
              <td>{Year}</td>
              <td>{Month}</td>
              <td>{BloomIntensity.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Monthly Average Bloom Intensity Histogram</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyAvgData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" label={{ value: 'Month', position: 'bottom' }} />
          <YAxis label={{ value: 'Avg Bloom Intensity', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="avgIntensity" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <h2>Predicted Bloom Intensity for {targetYear}-{targetMonth.toString().padStart(2, '0')}</h2>
      {errorMessage ? (
        <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>
      ) : predictedBloom !== null ? (
        <p>{predictedBloom.toFixed(4)}</p>
      ) : (
        <p>Loading prediction...</p>
      )}
    </div>
  );
}
