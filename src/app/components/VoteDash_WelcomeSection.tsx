// components/VoteDash_WelcomeSection.tsx
import React from "react";

export default function WelcomeSection() {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-8 relative mt-10">
      <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold font-['Baloo_2'] mb-6">
        Welcome, VoterName
      </h1>
      <button 
        className="bg-green-800 hover:bg-green-700 text-white text-lg font-semibold py-3 px-8 rounded-md flex items-center gap-2 transition-colors duration-300"
      >
        <span className="inline-flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12L12 8M12 8L8 4M12 8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        VOTE NOW
      </button>
    </div>
  );
}