'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

interface Candidate {
  id: string;
  name: string;
  course_year: string;
  picture_url?: string;
  votes: number;
}

interface PositionResult {
  position: string;
  candidates: Candidate[];
}

interface ElectionResultsDisplayProps {
  electionId?: string;
  type?: 'university' | 'organization';
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
  "Secretary",
  "Treasurer",
  // Add more as needed
];

export default function ElectionResultsDisplay({
  electionId,
  type = 'university',
  department_org,
  isLive = false,
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
      
      let url = `/api/get-vote-counts?type=${type}`;
      if (electionId) {
        url += `&election_id=${electionId}`;
      }
      if (department_org) {
        url += `&department_org=${encodeURIComponent(department_org)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch vote data');
      }
      
      const data = await response.json();
      if (data.success) {
        setPollsData(data.results);
      } else {
        throw new Error(data.error || 'Failed to load vote data');
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
  }, [electionId, type, department_org]);

  const handleViewFullResults = () => {
    const params = new URLSearchParams({
      type,
      ...(electionId && { election_id: electionId }),
      ...(department_org && { department_org })
    });
    router.push(`/Election_Results?${params.toString()}`);
  };

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
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 ${className}`}>
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
      <div className={`p-4 ${className}`}>
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No results available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with live indicator and last updated */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-semibold text-white">Election Results</h3>
          {isLive && (
            <span className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              LIVE
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showRefreshButton && (
            <button
              onClick={fetchVoteData}
              className="text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Refresh
            </button>
          )}
        </div>
      </div>

      {/* Full Results */}
      <div className="space-y-6">
        {sortedPollsData.map((poll, index) => (
          <div key={index} className="bg-white/10 rounded-lg border border-white/20 p-6">
            <h4 className="text-xl font-semibold text-white mb-4">{poll.position}</h4>
            <div className="space-y-3">
              {poll.candidates.map((candidate, candidateIndex) => {
                const percent = totalVoters && totalVoters > 0 ? (candidate.votes / totalVoters) * 100 : 0;
                return (
                  <div key={candidate.id} className="flex flex-col gap-1 p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {candidateIndex + 1}
                        </div>
                        <div>
                          <p className="text-lg font-medium text-white">{candidate.name}</p>
                          <p className="text-sm text-gray-300">{candidate.course_year}</p>
                        </div>
                      </div>
                      <div className="text-right min-w-[80px]">
                        <p className="text-2xl font-bold text-yellow-400">{candidate.votes}</p>
                        <p className="text-sm text-gray-300">votes</p>
                        {totalVoters !== null && (
                          <p className="text-xs text-gray-400">{percent.toFixed(1)}%</p>
                        )}
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="text-center pt-4">
        <p className="text-gray-300 text-sm">
          Total Positions: {sortedPollsData.length} | 
          Total Candidates: {sortedPollsData.reduce((sum, poll) => sum + poll.candidates.length, 0)}
          {totalVoters !== null && ` | Registered Voters: ${totalVoters}`}
        </p>
      </div>
    </div>
  );
} 