import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/BloomPredictionDashboard";

export default function Page() {
  return (
    <div className="min-h-screen bg-yellow-50 font-body flex flex-col">
      <Navbar />

      {/* Main content pushed below navbar */}
      <main className="flex w-full max-w-screen-xl mx-auto gap-6 px-4 pt-[163px]">
        {/* Sidebar wraps content naturally */}
        <div className="self-start" >
            <Sidebar />
         </div>

        {/* Dashboard fills remaining space */}
        <div className="flex-1">
          <Dashboard />
          
        </div>
      </main>
    </div>
  );
}