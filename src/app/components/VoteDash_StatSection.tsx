import React from "react";
import StatCard from "./VoteDash_StatCard";

export default function StatsSection() {
  return (
    <div className="w-full px-4 md:px-8 lg:px-20 py-8">
      <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-semibold font-['Inter'] mb-8">
        Current Election Stats
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        <StatCard 
          title="Total Registered Voters"
          value="2,847"
          description="Active Student Voters"
          icon="👥"
        />
        <StatCard 
          title="Total Votes Cast"
          value="847"
          description="Type of Election"
          icon="🗳️"
        />
        <StatCard 
          title="Avg. Participation"
          value="25%"
          description="Student Engagement"
          icon="📈"
        />
      </div>
    </div>
  );
}