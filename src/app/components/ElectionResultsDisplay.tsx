'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { motion } from 'framer-motion';

interface Candidate {
  id: string;
  name: string;
  course_year: string;
  picture_url?: string;
  votes: number;
  is_abstain?: boolean;
}

interface PositionResult {
  position: string;
  candidates: Candidate[];
}

interface ElectionResultsDisplayProps {
  electionId?: string;
  type?: string;
  department_org?: string;
  isLive?: boolean;
  showRefreshButton?: boolean;
  className?: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const positionOrder = [
  "President",
  "Vice President",
  "Vice President Internal",
  "Vice President External",
  "Secretary",
  "Treasurer",
  "Auditor",
  "Public Relations Officer",
  "Business Manager",
  "Board Member",
  "Representative",
  "Councilor",
  "Senator",
  "Delegate",
  "Committee"
];

export default function ElectionResultsDisplay({
  electionId,
  type,
  department_org,
  isLive,
  showRefreshButton = true,
  className = ''
}: ElectionResultsDisplayProps) {
  const router = useRouter();
  const [pollsData, setPollsData] = useState<PositionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalVoters, setTotalVoters] = useState<number | null>(null);

  const fetchVoteData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `/api/get-vote-counts?scope=${type}`;
      if (electionId) {
        url += `&election_id=${electionId}`;
      }
      else if (department_org) {
        url += `&department_org=${encodeURIComponent(department_org)}`;
      }
      
      const response = await fetch(url);
      
      const data = await response.json();
      if (data.success) {
        setPollsData(data.results);
      } else {
        setError(data.error || 'Failed to load vote data');
      }
    } catch (err) {
      console.error('Error fetching vote data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load election results');
    } finally {
      setLoading(false);
    }
  };

  // Fetch total registered voters
  useEffect(() => {
    const fetchTotalVoters = async () => {
      const { count, error } = await supabase
        .from('voter_profiles')
        .select('id', { count: 'exact', head: true });
      if (!error) setTotalVoters(count || 0);
    };
    fetchTotalVoters();
  }, []);

  useEffect(() => {
    fetchVoteData();
  }, [/*electionId,*/ type, department_org]);

  // Sort positions by power before rendering
  const sortedPollsData = [...pollsData].sort((a, b) => {
    const aIndex = positionOrder.indexOf(a.position);
    const bIndex = positionOrder.indexOf(b.position);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.position.localeCompare(b.position);
  });

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 min-h-screen ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-200">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 min-h-screen ${className}`}>
        <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center">
          <p className="text-red-600 text-sm mb-2">⚠️ {error}</p>
          {showRefreshButton && (
            <button
              onClick={fetchVoteData}
              className="text-red-600 hover:text-red-800 text-sm underline"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  if (pollsData.length === 0) {
    return (
      <div className={`p-4 min-h-screen ${className}`}>
        <div className="text-center py-4">
          <p className="text-gray-200 text-sm">No results available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-8 px-2 md:px-0 ${className}`}>
      <div className="space-y-12 rounded-2xl p-4 sm:p-8 md:p-12 bg-gray-900/10 backdrop-blur-md border border-gray-200">
        {sortedPollsData.map((poll, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-10 lg:p-14 mb-10 max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-6xl w-full mx-auto"
          >
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2D0907] mb-6 sm:mb-8">
              {poll.position}
            </h3>
            <div className="space-y-8">
              {/* Regular candidates only - abstain votes are hidden from public results */}
              {poll.candidates
                .filter(candidate => !candidate.is_abstain)
                .map((candidate, candidateIndex) => {
                const percent =
                  totalVoters && totalVoters > 0
                    ? (candidate.votes / totalVoters) * 100
                    : 0;
                return (
                  <div
                    key={candidate.id}
                    className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 mb-6"
                  >
                    {/* Candidate Picture */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-md mb-2 sm:mb-0 border-4 border-gray-400">
                      {candidate.picture_url ? (
                        <img
                          src={candidate.picture_url}
                          alt={candidate.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-500 text-2xl sm:text-3xl font-bold">
                          {candidate.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                    {/* Candidate Info and Progress */}
                    <div className="flex-1 w-full flex flex-col sm:flex-row items-center sm:items-stretch gap-2 sm:gap-0">
                      <div className="flex-1 w-full flex flex-col justify-center">
                        <div className="font-semibold text-[#2D0907] text-lg sm:text-xl lg:text-2xl">
                          {candidate.name}
                        </div>
                        <div className="text-sm sm:text-md text-[#3B2321] mb-1">
                          {candidate.course_year}
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-3 sm:h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-500">
                          <motion.div
                            className="h-full bg-[#52100D]"
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                            style={{ borderRadius: '9999px' }}
                          />
                        </div>
                      </div>
                      {/* Vote Count and Percentage */}
                      <div className="flex flex-row sm:flex-col items-end sm:items-end justify-end min-w-[90px] sm:min-w-[100px] ml-0 sm:ml-6 mt-2 sm:mt-0">
                        <span className="text-base text-[#2D0907] font-bold text-right block">
                          {candidate.votes.toLocaleString()} votes
                        </span>
                        <span className="text-base text-[#3B2321] font-semibold text-right block ml-4 sm:ml-0">
                          {percent.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      {/* Summary */}
        <div className="text-center pt-4 text-white">
          <p className="text-gray-200 text-base sm:text-lg">
            Total Positions: {sortedPollsData.length} | Total Candidates: {sortedPollsData.reduce((sum, poll) => sum + poll.candidates.length, 0)}
          {totalVoters !== null && ` | Registered Voters: ${totalVoters}`}
        </p>
        </div>
      </div>
    </div>
  );
} 