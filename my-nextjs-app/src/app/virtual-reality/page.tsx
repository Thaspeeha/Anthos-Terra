"use client";
import Image from "next/image";
import { useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const CaliforniaBloomParticlesVR = dynamic(
  () => import("../components/CaliforniaBloomParticlesVR"),
  { ssr: false }
);

export default function VRPage() {
  const [selectedEnv, setSelectedEnv] = useState<string | null>(null);
  const [showVR, setShowVR] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF2E5] flex flex-col">
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
            <main className="flex-1 flex flex-col items-left ml-4">
              <p className="text-sm text-[#6c8a72] mb-6">
                Home &gt; Garden Tools &gt;{" "}
                <span className="font-semibold">Virtual Garden</span>
              </p>

              <h1 className="text-3xl font-semibold text-[#2f4f2f] mb-8">
                Choose Your Environment
              </h1>

              {/* Environment Cards */}
              <div className="flex gap-10 mb-12">
                <div
                  className={`cursor-pointer border rounded-xl shadow hover:shadow-lg p-4 max-w-[200px] bg-white ${
                    selectedEnv === "rainforest" ? "ring-2 ring-[#73917E]" : ""
                  }`}
                  onClick={() => setSelectedEnv("rainforest")}
                >
                  <Image
                    src="/images/blooms.jpg"
                    alt="Rainforest"
                    width={200}
                    height={160}
                    className="rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-[#2f4f2f] mb-2">Plant Blooms</h3>
                  <p className="text-sm text-[#4a4a4a]">
                    Experience the beauty of flowering plants in their natural bloom cycles.
                  </p>
                </div>

                <div
                  className={`cursor-pointer border rounded-xl shadow hover:shadow-lg p-4 max-w-[200px] bg-white ${
                    selectedEnv === "desert" ? "ring-2 ring-[#73917E]" : ""
                  }`}
                  onClick={() => setSelectedEnv("desert")}
                >
                  <Image
                    src="/unknown.png"
                    alt="Desert"
                    width={200}
                    height={150}
                    className="rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-[#2f4f2f] mb-2">Algal Blooms</h3>
                  <p className="text-sm text-[#4a4a4a]">
                    Future Development. Not available yet.
                  </p>
                </div>
              </div>

              {/* Getting Started */}
              <h2 className="text-2xl font-semibold text-[#2f4f2f] mb-4">
                Getting Started
              </h2>
              <p className="text-[#4a4a4a] mb-6 max-w-2xl">
                To enjoy the VR experience, click on one of the VR above. Then
                select enter the virtual garden.
              </p>

              <ul className="space-y-4 mb-10">
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#cde3d0] flex items-center justify-center rounded-lg text-[#2f4f2f] font-bold">
                    1
                  </div>
                  <span className="text-[#2f4f2f]">Click VR scene</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#cde3d0] flex items-center justify-center rounded-lg text-[#2f4f2f] font-bold">
                    2
                  </div>
                  <span className="text-[#2f4f2f]">Enter Virtual Garden</span>
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
                    ? "bg-[#73917E] text-white hover:bg-[#6c8a72]"
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
