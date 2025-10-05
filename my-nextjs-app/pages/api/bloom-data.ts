import { NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

interface TemperatureRecord {
  month: string;
  value: number;
}

interface RainfallRecord {
  year: string;
  value: number;
}

interface MonthlyBloomIntensityRecord {
  month: string;
  intensity: number;
}

type RainRow = { [key: string]: string | undefined };

function parseTempCSV(csv: string): string[][] {
  return Papa.parse<string[]>(csv, {
    skipEmptyLines: true,
    header: false,
    delimiter: ",",
  }).data;
}

function parseRainCSV(csv: string): RainRow[] {
  return Papa.parse<RainRow>(csv, {
    skipEmptyLines: true,
    header: true,
    delimiter: ",",
  }).data;
}

// For App Router (Next.js 13+)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const city = searchParams.get('city');
    const plant = searchParams.get('plant');

    let temperatureSeries: TemperatureRecord[] = [];
    let rainfallSeries: RainfallRecord[] = [];
    let monthlyBloomIntensitySeries: MonthlyBloomIntensityRecord[] = [];
    let dominantVegetation = "Desert Vegetation";
    let bloomPrediction = "No prediction available";

    // Load temperature data for Abu Dhabi
    if (city === 'abu-dhabi') {
      const tempPath = path.join(process.cwd(), 'data', 'Temperatures.csv');
      
      if (fs.existsSync(tempPath)) {
        const tempCsv = fs.readFileSync(tempPath, 'utf-8');
        const tempParsed = parseTempCSV(tempCsv);
        
        if (tempParsed && tempParsed.length > 0) {
          const monthHeader = tempParsed[0].map((h) => String(h).trim());
          const dbAvgRow = tempParsed.find((r) => String(r[0]).trim() === "DBAvg (C)");
          
          if (dbAvgRow) {
            temperatureSeries = monthHeader.slice(1, 13).map((m, i) => ({
              month: m,
              value: Number(dbAvgRow[i + 1]) || 0
            }));
          }
        }
      }
      
      // Fallback if no data found
      if (temperatureSeries.length === 0) {
        temperatureSeries = [
          { month: 'Jan', value: 20.3 },
          { month: 'Feb', value: 21 },
          { month: 'Mar', value: 23.7 },
          { month: 'Apr', value: 27.3 },
          { month: 'May', value: 31.1 },
          { month: 'Jun', value: 33.3 },
          { month: 'Jul', value: 35.2 },
          { month: 'Aug', value: 35.8 },
          { month: 'Sep', value: 34.1 },
          { month: 'Oct', value: 31.3 },
          { month: 'Nov', value: 27 },
          { month: 'Dec', value: 22.9 },
        ];
      }

      // Load rainfall data for Abu Dhabi
      const rainPath = path.join(process.cwd(), 'data', 'Rainfall.csv');
      
      if (fs.existsSync(rainPath)) {
        const rainCsv = fs.readFileSync(rainPath, 'utf-8');
        const rainParsed = parseRainCSV(rainCsv);
        
        const rainNormalized = rainParsed.map((r) => ({
          measure: (r.CLIMATE_INDIC ?? r['Climate Indicators'] ?? "").toUpperCase(),
          yearMonth: String(r.TIME_PERIOD ?? r["Time period"] ?? ""),
          value: Number(r.OBS_VALUE ?? r["Observation value"] ?? 0),
        }));

        // Group by month and calculate average rainfall across years
        const monthlyRainfall: { [key: string]: number[] } = {};
        
        rainNormalized.forEach((r) => {
          if (r.measure === 'RAIN_TOTAL' && r.yearMonth) {
            const month = parseInt(r.yearMonth.split('-')[1]);
            const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1];
            
            if (!isNaN(r.value)) {
              if (!monthlyRainfall[monthName]) {
                monthlyRainfall[monthName] = [];
              }
              monthlyRainfall[monthName].push(r.value);
            }
          }
        });
        
        // Calculate average for each month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        rainfallSeries = months.map(month => {
          const values = monthlyRainfall[month] || [0];
          const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
          return {
            year: month,
            value: parseFloat(avg.toFixed(2))
          };
        });
      }
      
      // Fallback if no data found
      if (rainfallSeries.length === 0) {
        rainfallSeries = [
          { year: 'Jan', value: 34.63 },
          { year: 'Feb', value: 8.34 },
          { year: 'Mar', value: 9.71 },
          { year: 'Apr', value: 2.82 },
          { year: 'May', value: 2.25 },
          { year: 'Jun', value: 0 },
          { year: 'Jul', value: 0.56 },
          { year: 'Aug', value: 0 },
          { year: 'Sep', value: 0 },
          { year: 'Oct', value: 22.15 },
          { year: 'Nov', value: 7.60 },
          { year: 'Dec', value: 2.37 },
        ];
      }
    }

    // Load plant-specific data
    if (plant === 'tribulus') {
      dominantVegetation = "Tribulus Omanense";
      bloomPrediction = "High bloom intensity expected in March-April based on current rainfall and temperature patterns.";
      
      // Mock or load pollen/bloom intensity data
      monthlyBloomIntensitySeries = [
        { month: 'Jan', intensity: 20 },
        { month: 'Feb', intensity: 45 },
        { month: 'Mar', intensity: 85 },
        { month: 'Apr', intensity: 95 },
        { month: 'May', intensity: 70 },
        { month: 'Jun', intensity: 30 },
        { month: 'Jul', intensity: 10 },
        { month: 'Aug', intensity: 5 },
        { month: 'Sep', intensity: 8 },
        { month: 'Oct', intensity: 15 },
        { month: 'Nov', intensity: 25 },
        { month: 'Dec', intensity: 30 },
      ];
    }

    return NextResponse.json({
      date,
      temperature: 25,
      rainfall: 10,
      ndvi: 0.45,
      temperatureSeries,
      rainfallSeries,
      monthlyBloomIntensitySeries,
      dominantVegetation,
      bloomPrediction,
    });
  } catch (error) {
    console.error('Error loading bloom data:', error);
    return NextResponse.json(
      { error: 'Failed to load bloom data' },
      { status: 500 }
    );
  }
}

// For Pages Router (Next.js 12 and below) - keep your existing handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dateStr = (req.query.date as string) || new Date().toISOString().slice(0, 10);
    const city = req.query.city as string;
    const plant = req.query.plant as string;
    
    const d = new Date(dateStr);

    if (isNaN(d.getTime())) {
      res.status(400).json({ error: "Invalid date" });
      return;
    }

    const month = d.toLocaleString("en-US", { month: "short" });
    const year = String(d.getFullYear());

    let temperatureSeries: TemperatureRecord[] = [];
    let rainfallSeries: RainfallRecord[] = [];
    let monthlyBloomIntensitySeries: MonthlyBloomIntensityRecord[] = [];
    let dominantVegetation = "Desert Vegetation";
    let bloomPrediction = "No prediction available";

    // --- Read Temperature CSV ---
    const tempCsvPath = path.join(process.cwd(),"public", "data", "Temperatures.csv");
    
    if (fs.existsSync(tempCsvPath)) {
      const tempCsv = fs.readFileSync(tempCsvPath, "utf8");
      const tempParsed = parseTempCSV(tempCsv);

      if (tempParsed && tempParsed.length > 0) {
        const monthHeader = tempParsed[0].map((h) => String(h).trim());
        const dbAvgRow = tempParsed.find((r) => String(r[0]).trim() === "DBAvg (C)");

        if (dbAvgRow) {
          const monthIndex = monthHeader.indexOf(month);
          const tempVal = monthIndex !== -1 ? Number(dbAvgRow[monthIndex]) || "No updates yet" : "No updates yet";

          temperatureSeries = monthHeader.slice(1, 13).map((m, i) => ({
            month: m,
            value: Number(dbAvgRow[i + 1]) || 0,
          }));
        }
      }
    }

    // --- Read Rainfall CSV ---
    const rainCsvPath = path.join(process.cwd(),"public", "data", "Rainfall.csv");
    
    if (fs.existsSync(rainCsvPath)) {
      const rainCsv = fs.readFileSync(rainCsvPath, "utf8");
      const rainParsed = parseRainCSV(rainCsv);

      const rainNormalized = rainParsed.map((r) => ({
        measure: (r.CLIMATE_INDIC ?? r['Climate Indicators'] ?? "").toUpperCase(),
        yearMonth: String(r.TIME_PERIOD ?? r["Time period"] ?? ""),
        value: Number(r.OBS_VALUE ?? r["Observation value"] ?? 0),
      }));

      // Group by month for monthly average
      const monthlyRainfall: { [key: string]: number[] } = {};
      
      rainNormalized.forEach((r) => {
        if (r.measure === 'RAIN_TOTAL' && r.yearMonth) {
          const monthNum = parseInt(r.yearMonth.split('-')[1]);
          const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthNum - 1];
          
          if (!isNaN(r.value)) {
            if (!monthlyRainfall[monthName]) {
              monthlyRainfall[monthName] = [];
            }
            monthlyRainfall[monthName].push(r.value);
          }
        }
      });
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      rainfallSeries = months.map(m => {
        const values = monthlyRainfall[m] || [0];
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        return {
          year: m,
          value: parseFloat(avg.toFixed(2))
        };
      });
    }

    // Plant-specific data
    if (plant === 'tribulus') {
      dominantVegetation = "Tribulus Omanense";
      bloomPrediction = "High bloom intensity expected in March-April based on current rainfall and temperature patterns.";
      
      monthlyBloomIntensitySeries = [
        { month: 'Jan', intensity: 20 },
        { month: 'Feb', intensity: 45 },
        { month: 'Mar', intensity: 85 },
        { month: 'Apr', intensity: 95 },
        { month: 'May', intensity: 70 },
        { month: 'Jun', intensity: 30 },
        { month: 'Jul', intensity: 10 },
        { month: 'Aug', intensity: 5 },
        { month: 'Sep', intensity: 8 },
        { month: 'Oct', intensity: 15 },
        { month: 'Nov', intensity: 25 },
        { month: 'Dec', intensity: 30 },
      ];
    }

    const response = {
      date: dateStr,
      temperature: 25,
      rainfall: 10,
      temperatureSeries,
      rainfallSeries,
      monthlyBloomIntensitySeries,
      ndvi: 0.45,
      bloomPrediction,
      dominantVegetation,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}