"use client";
import React from "react";
import { Leaf } from "lucide-react";

const tools = [
  { name: "Bloom Prediction", icon: "🏵️", desc: "Get insights on when your plants will flower" },
  { name: "AI plant detector", icon: "🤖", desc: "Identify plants instantly with smart recognition" },
  { name: "Virtual garden", icon: "🌎", desc: "Experience botanical wonders in immersive reality" },
  { name: "Endangered plants", icon: "🛡️", desc: "Discover and learn about plants that need our protection" },
  { name: "Bloom journal", icon: "📓", desc: "Document your garden’s journey through seasons" },
  { name: "Plant history", icon: "🌱", desc: "Explore the fascinating stories of your favorite plants" },
  { name: "Flora for everyone", icon: "👨‍👩‍👧‍👦", desc: "Open for all: farmers, children, tourists and more" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white rounded-2xl p-6 flex flex-col shadow-md">
      {/* Garden Tools Header */}
      <div className="flex items-center gap-2 mb-6">
        <Leaf className="text-green-600 w-5 h-5" />
        <span className="text-lg text-[#4A6544] font-semibold relative inline-block">
          Garden tools
          <span className="absolute left-0 -bottom-1 w-full h-[3px] bg-yellow-400 rounded-md"></span>
        </span>
      </div>
      {/* Tools */}
      <div className="flex flex-col gap-3 flex-1">
        {tools.map((tool) => (
          <button
            key={tool.name}
            className="flex items-start gap-3 p-3 rounded-xl text-left transition hover:bg-[#F7F8F3]"
          >
            <span className="text-xl">{tool.icon}</span>
            <div className="flex flex-col leading-tight">
              <span className="font-medium text-[#4A6544]">{tool.name}</span>
              <span className="text-xs text-gray-500">{tool.desc}</span>
            </div>
          </button>
        ))}
      </div>
      {/* Logout */}
      <button className="mt-4 py-1.5 px-4 border border-[#D01818] text-[#D01818] rounded-full font-medium w-fit self-center text-sm hover:bg-[#ffeaea]">
        Logout
      </button>
    </aside>
  );
}
