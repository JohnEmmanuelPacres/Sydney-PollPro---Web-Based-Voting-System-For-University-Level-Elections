import React, { useState } from "react";
import ElectionCard from "./VoteDash_ElectionCard";

export default function CurrentElections() {
  const [elections, setElections] = useState([
    {
      id: 1,
      title: "VOTING 2025: ICPEP",
      description: "Department",
      status: "Active",
      endDate: "June 30, 2025",
      candidates: "50 candidates",
      participation: "41%",
      participationWidth: "w-[72px]",
      viewed: false,
      expanded: false // New state for expanded view
    },
    {
      id: 2,
      title: "Faculty Senate Representative",
      description: "Computer Science Department representative",
      status: "Active",
      endDate: "July 1, 2025",
      candidates: "3 candidates",
      participation: "41%",
      participationWidth: "w-[96px]",
      viewed: false,
      expanded: false
    },
    {
      id: 3,
      title: "Dormitory Council Elections",
      description: "Representatives for residence halls",
      status: "Ending Soon",
      endDate: "June 27, 2025",
      candidates: "3 candidates",
      participation: "41%",
      participationWidth: "w-full",
      viewed: false,
      expanded: false
    }
  ]);

  const handleViewStatus = (id: number) => {
    setElections(elections.map(election => 
      election.id === id ? { 
        ...election, 
        viewed: true,
        expanded: !election.expanded // Toggle expanded state
      } : election
    ));
    console.log(`Viewing status for election ${id}`);
  };

  return (
    <div className="w-full bg-red-950/60 rounded-lg shadow-md border border-yellow-900 p-6">
      <div className="border-b border-yellow-900 pb-6 mb-6">
        <h3 className="text-white text-2xl font-semibold font-['Geist'] mb-1">
          Active Elections
        </h3>
        <p className="text-lime-300 text-sm font-normal font-['Geist']">
          Currently running elections and their status
        </p>
      </div>
      <div className="space-y-4">
        {elections.map((election) => (
          <ElectionCard 
            key={election.id}
            {...election}
            onViewStatus={() => handleViewStatus(election.id)}
          />
        ))}
      </div>
    </div>
  );
}