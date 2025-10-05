import { NextRequest, NextResponse } from "next/server";

// Mock plant database
type PlantInfo = {
  name: string;
  growth: string;
  water: string;
  light: string;
  habitat: string;
};

const plantDB: Record<string, PlantInfo> = {
  "aloe vera": {
    name: "Aloe Vera",
    growth: "Perennial",
    water: "Low",
    light: "6 - 8 Hrs",
    habitat: "Africa",
  },
  "blue agava": {
    name: "Blue Agava",
    growth: "Perennial",
    water: "Medium",
    light: "6 Hrs",
    habitat: "Mexico",
  },
  "gasteria": {
    name: "Gasteria",
    growth: "Perennial",
    water: "Low",
    light: "4 - 6 Hrs",
    habitat: "South Africa",
  },
  "ghaf tree": {
    name: "Ghaf Tree",
    growth: "Perennial",
    water: "Very low",
    light: "Full sun",
    habitat: "Desert, native to UAE",
  },
  "desert hyacinth": {
    name: "Desert Hyacinth",
    growth: "Perennial herb",
    water: "Minimal (parasitic plant)",
    light: "Full desert sun",
    habitat: "Sandy deserts of UAE",
  },
  "tribulus omanense": {
    name: "Tribulus omanense",
    growth: "Annual ground cover",
    water: "Low",
    light: "Full sun",
    habitat: "Desert plains of UAE",
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Detect plant by file name
    let predictedPlant = "unknown"; // default fallback
    const fileName = file.name.toLowerCase();

    if (fileName.includes("blueagava")) predictedPlant = "blue agava";
    else if (fileName.includes("gasteria")) predictedPlant = "gasteria";
    else if (fileName.includes("aloevera")) predictedPlant = "aloe vera";
    else if (fileName.includes("ghaf")) predictedPlant = "ghaf tree";
    else if (fileName.includes("deserthyacinth")) predictedPlant = "desert hyacinth";
    else if (fileName.includes("tribulusomanese")) predictedPlant = "tribulus omanense";

    const details = plantDB[predictedPlant] || {
      name: "Unknown Plant",
      growth: "-",
      water: "-",
      light: "-",
      habitat: "-",
    };

    return NextResponse.json({
      success: true,
      plant: details,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Plant API is working 🚀" });
}
