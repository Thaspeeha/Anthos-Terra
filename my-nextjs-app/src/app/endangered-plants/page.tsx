"use client";
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

type Plant = {
  name: string;
  latin: string;
  image: string;
  region: string;
  status: string;
  type: string;
  endangeredReason: string;
  country: string;
  isEndangered: boolean;
};

const PLANTS: Plant[] = [
  {
    name: "Grewia",
    latin: "Grewia erythraea",
    image: "/grewia.png",
    region: "United Arab Emirates",
    status: "Endangered",
    type: "Flower",
    endangeredReason: "Deterioration, drought and over-grazing",
    country: "United Arab Emirates",
    isEndangered: true,
  },
  {
    name: "Rhanterium",
    latin: "Rhanterium epapposum",
    image: "/rhanterium.png",
    region: "United Arab Emirates",
    status: "Endangered",
    type: "Flower",
    endangeredReason: "Coastal development, drought and over-grazing",
    country: "United Arab Emirates",
    isEndangered: true,
  },
];

const REGIONS = ["Region", "United Arab Emirates", "USA"];
const STATUS = ["Status", "Endangered", "Extinct in wild"];
const TYPES = ["Type", "Flower", "Tree"];

export default function EndangeredPlantsPage() {
  const [region, setRegion] = useState("Region");
  const [status, setStatus] = useState("Status");
  const [type, setType] = useState("Type");
  const [search, setSearch] = useState("");
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);

  const filteredPlants = PLANTS.filter(
    (plant) =>
      (region === "Region" || plant.region === region) &&
      (status === "Status" || plant.status === status) &&
      (type === "Type" || plant.type === type) &&
      (plant.name.toLowerCase().includes(search.toLowerCase()) ||
        plant.latin.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#FAF2E5] flex flex-col">
      <Navbar />

      <div className="flex flex-1 pt-[180px] px-4 gap-6">
        {/* Sidebar */}
        <div className="w-[220px] min-w-[220px]">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 flex flex-col items-center ml-4 relative">
          <nav className="w-full max-w-4xl text-sm text-gray-500 mb-2">
            Home &gt; Garden Tools &gt;{" "}
            <b className="text-gray-700">Endangered plants</b>
          </nav>

          <h1 className="text-3xl md:text-4xl font-extrabold text-[#304c3a] mt-1 mb-1 max-w-4xl w-full">
            Endangered Plants of UAE
          </h1>
          <p className="mb-7 mt-1 max-w-4xl w-full text-gray-700">
            Discover plants at risk, their distribution and how we can protect them
          </p>

          {/* Filters */}
          <div className="flex gap-3 mb-7 w-full max-w-4xl">
            <select
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              {REGIONS.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <select
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <input
              type="text"
              className="px-3 py-2 rounded-lg border border-gray-300 bg-white flex-1"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button
              className="px-4 py-2 rounded bg-[#e5dbbe] hover:bg-[#ede2c7] text-[#304c3a] font-semibold border"
              type="button"
            >
              <svg width={18} height={18} fill="none" viewBox="0 0 24 24">
                <path
                  d="M21 21l-4.35-4.35M3.5 11a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>

          {/* Plant cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 w-full max-w-4xl">
            {filteredPlants.map((plant) => (
              <div
                key={plant.name}
                onClick={() => setSelectedPlant(plant.name)}
                className="bg-[#FAF2E5] border-2 border-[#EBBE7F] rounded-xl p-4 shadow flex flex-col items-start min-h-[270px] max-w-xs cursor-pointer hover:shadow-lg transition"
              >
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-36 object-cover rounded-xl mb-3"
                />
                <div className="font-semibold text-[15px] text-[#304c3a] mb-1">
                  {plant.name}{" "}
                  <span className="text-gray-400">({plant.latin})</span>
                </div>
                <div className="text-xs mb-1 font-bold text-red-700">
                  {plant.status === "Endangered"
                    ? "● Endangered"
                    : plant.status}
                </div>
                <div className="text-xs mb-1 text-gray-700">
                  {plant.region && <>🌍 {plant.region}</>}
                </div>
                <div className="text-xs text-gray-700">
                  {plant.endangeredReason &&
                    `❓ Due to ${plant.endangeredReason}`}
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Conditional Map Popups */}
          {selectedPlant === "Grewia" && (
            <div className="absolute top-32 bg-white border-2 border-[#EBBE7F] rounded-xl shadow-xl p-4 z-50">
              <button
                onClick={() => setSelectedPlant(null)}
                className="absolute top-1 right-2 text-gray-600 hover:text-gray-900"
              >
                ✖
              </button>
              <img
                src="/grewia-map.png"
                alt="Map showing Grewia location"
                className="w-[400px] h-auto rounded-lg"
              />
              <p className="text-sm text-center mt-2 text-[#304c3a] font-semibold">
                Distribution of Grewia erythraea in UAE
              </p>
            </div>
          )}

          {selectedPlant === "Rhanterium" && (
            <div className="absolute top-32 bg-white border-2 border-[#EBBE7F] rounded-xl shadow-xl p-4 z-50">
              <button
                onClick={() => setSelectedPlant(null)}
                className="absolute top-1 right-2 text-gray-600 hover:text-gray-900"
              >
                ✖
              </button>
              <img
                src="/rhanterium-map.png" // 👈 your Rhanterium map image here
                alt="Rhanterium map"
                className="w-[400px] h-auto rounded-lg"
              />
              <p className="text-sm text-center mt-2 text-[#304c3a] font-semibold">
                Distribution of Rhanterium epapposum in UAE
              </p>
            </div>
          )}
        </main>

        {/* Right side: Plant of the week */}
        <aside className="w-[280px] min-w-[220px] bg-white rounded-2xl shadow border p-4 flex flex-col items-center">
          <div className="w-full">
            <div className="flex items-center gap-2 mb-1 text-gray-700 font-semibold text-[15px]">
              <span>★</span> Plant of the week
            </div>
            <img
              src="/rhanterium.png"
              alt="Rhanterium"
              className="w-full h-28 object-cover rounded-lg mb-3"
            />
            <div>
              <div className="font-bold text-[16px] mb-1 text-[#304c3a]">
                Rhanterium
              </div>
              <div className="block text-sm mb-2 text-gray-600">
                Endangered in the wild, species occurs in Jabal Hafit National Park,
                which is a protected area and is regularly monitored by EAD.
              </div>
              <hr className="my-2 border-[#ebbe7f]" />
              <div className="font-semibold text-[#5A7056] text-[14px] mb-1">
                Conservation tips
              </div>
              <ol className="list-decimal ml-5 text-xs text-[#5A7056]">
                <li>Reduce plant poaching</li>
                <li>Support local gardens</li>
                <li>Avoid overharvesting</li>
                <li>Protect natural habitats</li>
              </ol>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}