import React from "react";

export default function SessionStatusBar() {
  return (
    <div className="w-full mb-8">
      <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-semibold font-['Inter'] mb-6">
        Realtime Updates
      </h2>
      <div className="w-full h-32 bg-gradient-to-r from-red-900 to-stone-950 rounded-md shadow-lg border-4 border-orange-400 overflow-hidden p-6">
        <div className="flex flex-col h-full justify-center">
          <div className="text-white text-xl md:text-2xl font-normal font-['Baloo_Bhai_2']">
            Voting Session: <span className="text-orange-300">Active</span>
          </div>
          <div className="text-white text-xl md:text-2xl font-normal font-['Baloo_Bhai_2'] mt-2">
            Session Status: <span className="text-green-300">Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}