import React from "react";
import ElectionCard from "./VoteDash_ElectionCard";

export default function CurrentElections() {
  const elections = [
    {
      title: "Student Government President",
      description: "Annual election for student body president",
      status: "Active",
      endDate: "June 30, 2025",
      candidates: "3 candidates",
      participation: "41%",
      participationWidth: "w-[72px]" // Changed to Tailwind class format
    },
    {
      title: "Faculty Senate Representative",
      description: "Computer Science Department representative",
      status: "Active",
      endDate: "July 1, 2025",
      candidates: "3 candidates",
      participation: "41%",
      participationWidth: "w-[96px]"
    },
    {
      title: "Dormitory Council Elections",
      description: "Representatives for residence halls",
      status: "Ending Soon",
      endDate: "June 27, 2025",
      candidates: "3 candidates",
      participation: "41%",
      participationWidth: "w-full" // Changed from fixed pixel width
    }
  ];

  return (
    <div className="w-full bg-red-950/60 rounded-lg shadow-md border border-yellow-400 p-6">
      <div className="border-b border-yellow-500 pb-6 mb-6">
        <h3 className="text-white text-2xl font-semibold font-['Geist'] mb-1">
          Active Elections
        </h3>
        <p className="text-lime-300 text-sm font-normal font-['Geist']">
          Currently running elections and their status
        </p>
      </div>
      <div className="space-y-4">
        {elections.map((election, index) => (
          <ElectionCard key={index} {...election} />
        ))}
      </div>
    </div>
  );
}