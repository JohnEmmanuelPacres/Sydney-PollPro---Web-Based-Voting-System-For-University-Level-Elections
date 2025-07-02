import React, { useEffect, useState } from "react";
import StatCard from "./VoteDash_StatCard";

export default function StatsSection() {
  const [votersCount, setVotersCount] = useState<string | null>(null);
  const [votesCount, setVotesCount] = useState<string | null>(null);
  const [participation, setParticipation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const res = await fetch('/api/global-stats');
      const data = await res.json();
      setVotersCount(data.voters !== undefined ? data.voters.toLocaleString() : 'N/A');
      setVotesCount(data.votes !== undefined ? data.votes.toLocaleString() : 'N/A');
      setParticipation(data.participation !== undefined ? `${data.participation}%` : 'N/A');
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div className="w-full px-4 md:px-8 lg:px-20 py-8">
      <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-semibold font-['Inter'] mb-8">
        Current Election Stats
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        <StatCard 
          title="Total Registered Voters"
          value={loading ? 'Loading...' : votersCount ?? 'N/A'}
          description="Active Student Voters"
          icon="👥"
        />
        <StatCard 
          title="Total Votes Cast"
          value={loading ? 'Loading...' : votesCount ?? 'N/A'}
          description="Type of Election"
          icon="🗳️"
        />
        <StatCard 
          title="Avg. Participation"
          value={loading ? 'Loading...' : participation ?? 'N/A'}
          description="Student Engagement"
          icon="📈"
        />
      </div>
    </div>
  );
}