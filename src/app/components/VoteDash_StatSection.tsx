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
      try {
        // First, get the latest university-level election
        const uniRes = await fetch('/api/get-voting-data?scope=university');
        const uniData = await uniRes.json();
        const latestElection = uniData?.elections && uniData.elections.length > 0 ? uniData.elections[0] : null;
        
        if (latestElection) {
          // Check if the election is active or ended (not upcoming)
          const now = new Date();
          const startDate = new Date(latestElection.start_date);
          
          if (now >= startDate) {
            // Fetch stats for active or ended elections
            const statsRes = await fetch(`/api/global-stats?electionId=${latestElection.id}`);
            const statsData = await statsRes.json();
            setVotersCount(statsData.voters !== undefined ? statsData.voters.toLocaleString() : 'N/A');
            setVotesCount(statsData.votes !== undefined ? statsData.votes.toLocaleString() : 'N/A');
            setParticipation(statsData.participation !== undefined ? `${statsData.participation}%` : 'N/A');
          } else {
            // For upcoming elections, show N/A
            setVotersCount('N/A');
            setVotesCount('N/A');
            setParticipation('N/A');
          }
        } else {
          // No elections found
          setVotersCount('N/A');
          setVotesCount('N/A');
          setParticipation('N/A');
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        setVotersCount('N/A');
        setVotesCount('N/A');
        setParticipation('N/A');
      }
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