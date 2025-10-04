"use client";
import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar"; // ✅ Import Navbar component

// --- Dynamic import for Three.js VR component ---
const CaliforniaBloomParticlesVR = dynamic(
  () => import("../components/CaliforniaBloomParticlesVR"), // adjust path if needed
  { ssr: false }
);

export default function VRPage() {
  const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
  const [showVR, setShowVR] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF2E5] flex flex-col">
      {/* ✅ Shared Navbar at top */}
      <Navbar />

      <div className="flex flex-1 pt-[180px] px-4 gap-6">
        {/* Sidebar */}
        <div className="w-[220px] min-w-[220px]">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center ml-4">
          {showVR ? (
            <div style={{ height: "80vh", width: "100%", position: "relative" }}>
              <CaliforniaBloomParticlesVR />
              <button
                onClick={() => setShowVR(false)}
                className="absolute bottom-4 right-4 px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Exit VR
              </button>
            </div>
          ) : (
            <main className="lex-1 flex flex-col items-left ml-4">
              <p className="text-sm text-gray-500 mb-6">
                Home &gt; Garden Tools &gt;{" "}
                <span className="font-semibold">Virtual Garden</span>
              </p>

              <h1 className="text-2xl font-semibold text-gray-800 mb-8">
                Choose Your Environment
              </h1>

              {/* Environment Cards */}
              <div className="flex gap-10 mb-12">
                <div
                  className={`cursor-pointer border rounded-xl shadow hover:shadow-lg p-4 max-w-[200px] ${
                    selectedEnv === "rainforest" ? "ring-2 ring-green-600" : ""
                  }`}
                  onClick={() => setSelectedEnv("rainforest")}
                >
                  <Image
                    src="/rainforest.jpg"
                    alt="Rainforest"
                    width={200}
                    height={160}
                    className="rounded-lg mb-4"
                  />
                  <h3 className="font-semibold">Plant Blooms</h3>
                  <p className="text-sm text-green-700">
                    Immerse yourself in a lush, tropical rainforest filled with
                    exotic plants.
                  </p>
                </div>

                <div
                  className={`cursor-pointer border rounded-xl shadow hover:shadow-lg p-4 max-w-[200px] ${
                    selectedEnv === "desert" ? "ring-2 ring-green-600" : ""
                  }`}
                  onClick={() => setSelectedEnv("desert")}
                >
                  <Image
                    src="/desert.jpg"
                    alt="Desert"
                    width={200}
                    height={160}
                    className="rounded-lg mb-4"
                  />
                  <h3 className="font-semibold">Algal Blooms</h3>
                  <p className="text-sm text-green-700">
                    Future Development. Not available yet.
                  </p>
                </div>
              </div>

              {/* Getting Started */}
              <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
              <p className="text-gray-600 mb-6 max-w-2xl">
                To enjoy the VR experience, click on one of the VR above. Then
                select enter the virtual garden.
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 flex items-center justify-center rounded-lg text-green-700 font-bold">
                    1
                  </div>
                  <span>Click VR scene</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 flex items-center justify-center rounded-lg text-green-700 font-bold">
                    2
                  </div>
                  <span>Enter Virtual Garden</span>
                </li>
              </ul>

              {/* Start Button */}
              <button
                disabled={!selectedEnv}
                onClick={() => {
                  if (selectedEnv === "rainforest") setShowVR(true);
                }}
                className={`px-6 py-3 rounded-lg font-medium ${
                  selectedEnv
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Enter Virtual Garden
              </button>
            </main>
          )}
        </div>
      </div>
    </div>
  );
}
