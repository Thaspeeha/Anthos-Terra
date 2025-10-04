"use client";
import React from 'react';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

const InfoCards = () => {
  const router = useRouter();

  const handleExploreClick = () => {
    router.push('/explore');
  };

  return (
    <div className="flex gap-6 mt-6 w-full max-w-[720px]">
      {/* Left Card - Abu Dhabi Vegetation */}
      <div className="flex-1 bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 shadow-sm border border-amber-200">
        <div className="text-center">
          <div className="inline-block bg-amber-100 rounded-full p-2 mb-3">
            <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Blooming in your area
          </h3>
          <div className="flex justify-center my-4">
            <Image 
              src="/uae.jpg" 
              alt="Abu Dhabi vegetation - Date palms"
              width={200}
              height={200}
              className="rounded-lg object-cover shadow-sm"
            />
          </div>
          <div className="mt-4 bg-white/60 rounded-lg p-3 space-y-2">
            <button className="w-full mt-2 pt-2 border-t border-gray-200 text-xs text-gray-700 hover:text-green-700 font-medium transition-colors">
              Perfect season for desert flora! 🌵
            </button>
          </div>
        </div>
      </div>

      {/* Right Card - Blooms Around the Globe */}
      <div className="flex-1 bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl p-6 shadow-sm border border-amber-200">
        <div className="flex flex-col h-full">
          <div className="text-center mb-4">
            <div className="inline-block bg-blue-100 rounded-full p-2 mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Blooms Around the World
            </h3>
          </div>
          
          <div className="flex-1 space-y-3">
            <div className="bg-white/60 rounded-lg p-3 flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">California Superblooms</p>
                <p className="text-xs text-gray-600">California, USA</p>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3 flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Neelakurinji</p>
                <p className="text-xs text-gray-600">Kerala, India</p>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-lg p-3 flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">Red Tide</p>
                <p className="text-xs text-gray-600">Abu Dhabi, UAE</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleExploreClick}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition"
          >
            Explore Global Blooms →
          </button>
        </div>
      </div>
    </div>
  );
};

export default InfoCards;