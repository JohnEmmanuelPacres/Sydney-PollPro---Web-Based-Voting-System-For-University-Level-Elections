'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminHeader from '../../../components/AdminHeader';
import PollCard from '../../../components/PollCard';
import { supabase } from '@/utils/supabaseClient';

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

interface ElectionDetails {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_uni_level: boolean;
}

export default function AdminElectionResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pollsData, setPollsData] = useState<PositionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [electionDetails, setElectionDetails] = useState<ElectionDetails | null>(null);
  const [electionStatus, setElectionStatus] = useState<string>('');
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const electionId = searchParams.get('election_id');
  const type = searchParams.get('type') || 'university';
  const department_org = searchParams.get('department_org');

  const fetchVoteData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `/api/get-vote-counts?type=${type}&access_level=admin`;
      if (electionId) {
        url += `&election_id=${electionId}`;
      }
      if (department_org) {
        url += `&department_org=${encodeURIComponent(department_org)}`;
      }
      if (isLive) {
        url += '&live=true';
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch vote data');
      }
      
      const data = await response.json();
      if (data.success) {
        setPollsData(data.results);
        setElectionDetails(data.electionDetails);
        setElectionStatus(data.electionStatus);
        setLastUpdated(new Date());
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

  useEffect(() => {
    fetchVoteData();
  }, [electionId, type, department_org, isLive]);

  // Auto-refresh for live results
  useEffect(() => {
    if (!isLive || electionStatus !== 'active') return;

    const interval = setInterval(() => {
      fetchVoteData();
    }, 15000); // Refresh every 15 seconds for live results

    return () => clearInterval(interval);
  }, [isLive, electionStatus]);

  const handleBackToAdmin = () => {
    const params = new URLSearchParams();
    if (department_org) {
      params.append('administered_Org', department_org);
    }
    router.push(`/dashboard/Admin?${params.toString()}`);
  };

  const toggleLiveResults = () => {
    setIsLive(!isLive);
  };

  const exportResults = () => {
    if (!pollsData.length) return;

    const csvContent = [
      'Position,Candidate Name,Course Year,Votes',
      ...pollsData.flatMap(poll =>
        poll.candidates.map(candidate =>
          `"${poll.position}","${candidate.name}","${candidate.course_year}",${candidate.votes}`
        )
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `election-results-${electionDetails?.name || 'unknown'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'upcoming': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 to-red-900">
        <AdminHeader />
        <main className="pt-24 pb-8 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading election results...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 to-red-900">
      <AdminHeader />
      
      <main className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToAdmin}
                className="flex items-center gap-2 px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Admin
              </button>
              <div>
                <h1 className="text-white text-3xl font-bold">Admin Election Results</h1>
                {electionDetails && (
                  <p className="text-gray-300 text-lg">{electionDetails.name}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {electionStatus && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(electionStatus)}`}>
                  {electionStatus.toUpperCase()}
                </span>
              )}
              {lastUpdated && (
                <span className="text-gray-300 text-sm">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>

          {/* Admin Controls */}
          <div className="bg-white/10 rounded-lg p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleLiveResults}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isLive 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-600 hover:bg-gray-700 text-white'
                  }`}
                >
                  {isLive ? '🟢 Live Results' : '⚪ Static Results'}
                </button>
                {electionStatus === 'active' && (
                  <span className="text-green-400 text-sm">
                    Auto-refresh every 15 seconds
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchVoteData}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Refresh
                </button>
                <button
                  onClick={exportResults}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-red-200 font-semibold">Error</span>
              </div>
              <p className="text-red-300 mt-2">{error}</p>
            </div>
          )}

          {/* Results */}
          {pollsData.length > 0 ? (
            <div className="space-y-6">
              {pollsData.map((poll, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <PollCard position={poll.position} candidates={poll.candidates} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-300 text-xl">No election results available</p>
              <button
                onClick={fetchVoteData}
                className="mt-4 px-6 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Refresh Results
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 