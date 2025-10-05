import { useEffect, useState } from "react";
import Papa from "papaparse";

export interface BloomRecord {
  date: string;
  lat: number;
  lon: number;
  evi: number;
  quality: number;
}

export function useCsvData(csvPath: string): BloomRecord[] {
  const [data, setData] = useState<BloomRecord[]>([]);

  useEffect(() => {
    Papa.parse(csvPath, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (result) => {
        console.log("CSV Raw Data:", result.data);

        const parsed: BloomRecord[] = (result.data as any[])
          .map((row, i) => {
            const rec: BloomRecord = {
              date: row.Date ?? "",
              lat: Number(row.Latitude),
              lon: Number(row.Longitude),
              evi: Number(row["MOD13A1_061__500m_16_days_EVI"]),
              quality: Number(row["MOD13A1_061__500m_16_days_VI_Quality"]),
            };
            console.log("Parsed row", i, rec);
            return rec;
          })
          .filter((r) => !isNaN(r.lat) && !isNaN(r.lon));

        setData(parsed);
      },
      error: (err) => {
        console.error("CSV parsing error:", err);
      },
    });
  }, [csvPath]);

  return data;
}
