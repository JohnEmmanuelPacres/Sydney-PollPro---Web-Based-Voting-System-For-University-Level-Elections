'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminHeader from '../../../components/AdminHeader';
import PollCard from '../../../components/PollCard';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from '@/utils/supabaseClient';
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, Users, Vote, TrendingUp, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "../../../components/Footer";

interface Candidate {
  id: string;
  name: string;
  positionId: string;
  course_year: string;
  picture_url?: string;
  votes: number;
}

interface Position {
  id?: string
  title: string
  description: string
}

interface PositionResult {
  position: any;
  candidates: Candidate[];
}

interface ElectionDetails {
  name: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  positions: Position[];
  candidates: Candidate[];
  settings: {
    isUniLevel: boolean;
    allowAbstain: boolean;
    eligibleCourseYear: string[];
  };
}

export default function ElectionSummaryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pollsData, setPollsData] = useState<PositionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [electionStatus, setElectionStatus] = useState<string>('');
  const [displayStatus, setDisplayStatus] = useState<string>(''); // For manual status override
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'results'>('preview');
  const [electionStats, setElectionStats] = useState({
    votersCount: 'N/A',
    votesCount: 'N/A',
    participation: 'N/A'
  });
  const [exporting, setExporting] = useState(false);
  const [election, setElection] = useState<ElectionDetails>({
    name: "",
    description: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    positions: [],
    candidates: [],
    settings: {
      isUniLevel: false,
      allowAbstain: true,
      eligibleCourseYear: [],
    },
  })

  // Position hierarchy order for sorting
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

  const electionId = searchParams.get('election_id');
  const type = searchParams.get('scope') || 'university';
  const department_org = searchParams.get('administered_Org');

  // Sort positions by hierarchy
  const sortedPositions = [...election.positions].sort((a, b) => {
    const aIndex = positionOrder.indexOf(a.title);
    const bIndex = positionOrder.indexOf(b.title);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.title.localeCompare(b.title);
  });

  // Sort polls data by hierarchy
  const sortedPollsData = [...pollsData].sort((a, b) => {
    const aIndex = positionOrder.indexOf(a.position);
    const bIndex = positionOrder.indexOf(b.position);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return a.position.localeCompare(b.position);
  });

  const fetchVoteData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = `/api/get-vote-counts?scope=${type}&access_level=admin`;
      if (electionId) {
        url += `&election_id=${electionId}`;
      }
      if (department_org) {
        url += `&department_org=${encodeURIComponent(department_org)}`;
      }
      if (isLive) {
        url += '&live=true';
      }
      
      const response1 = await fetch(url);
      if (!response1.ok) {
        const errorText = await response1.text();
        console.error('Failed to fetch vote data:', errorText);
        throw new Error('Failed to fetch vote data');
      }
      
      const data = await response1.json();
      if (data.success) {
        setPollsData(data.results);
        setElectionStatus(data.electionStatus);
      } else {
        throw new Error(data.error || 'Failed to load vote data');
      }

      // Fetch election statistics
      if (electionId) {
        await fetchElectionStats();
      }

      const response2 = await fetch('/api/get-election-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ electionId }),
      });

      const result = await response2.json();

      if (!response2.ok) {
        setError(result.error || 'Failed to fetch election data');
        setLoading(false);
        return;
      }
      if (!result.election) {
        setError('No election data returned');
        setLoading(false);
        return;
      }

      console.log("📊 Fetched election data:", {
        name: result.election.name,
        positionsCount: result.election.positions.length,
        candidatesCount: result.election.candidates.length,
        candidates: result.election.candidates.map((c: any) => ({ name: c.name, id: c.id }))
      });

      setElection(result.election);

    } catch (err) {
      console.error('Error fetching vote data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load election results');
    } finally {
      setLoading(false);
    }
  };

  const fetchElectionStats = async () => {
    try {
      if (!electionId) return;
      
      const response = await fetch(`/api/global-stats?electionId=${electionId}`);
      const data = await response.json();
      
      setElectionStats({
        votersCount: data.voters !== undefined ? data.voters.toLocaleString() : 'N/A',
        votesCount: data.votes !== undefined ? data.votes.toLocaleString() : 'N/A',
        participation: data.participation !== undefined ? `${data.participation}%` : 'N/A'
      });
    } catch (error) {
      console.error('Error fetching election stats:', error);
      setElectionStats({
        votersCount: 'N/A',
        votesCount: 'N/A',
        participation: 'N/A'
      });
    }
  };

  useEffect(() => {
    fetchVoteData();
  }, [electionId, type, department_org, isLive]);

  // Sync display status with actual election status when it changes
  useEffect(() => {
    if (electionStatus && !displayStatus) {
      setDisplayStatus(electionStatus);
    }
  }, [electionStatus, displayStatus]);

  // Auto-refresh for live results
  useEffect(() => {
    if (!isLive || electionStatus !== 'active') return;

    const interval = setInterval(() => {
      fetchVoteData();
    }, 15000); // Refresh every 15 seconds for live results

    return () => clearInterval(interval);
  }, [isLive, electionStatus]);

  const handleBackToAdmin = () => {
    router.push(`/dashboard/Admin?administered_Org=${department_org}`);
  };

  const toggleLiveResults = () => {
    setIsLive(!isLive);
  };

  const exportResults = () => {
    if (!sortedPollsData.length) {
      alert('No election results available to export.');
      return;
    }

    setExporting(true);

    try {
      // Create comprehensive CSV content with multiple sections
    const csvContent = [
        // Election Summary Section
        'ELECTION SUMMARY',
        `Election Name,${election?.name || 'Unknown'}`,
        `Description,${election?.description || 'No description'}`,
        `Start Date,${election?.startDate || 'Unknown'}`,
        `End Date,${election?.endDate || 'Unknown'}`,
        `Election Status,${displayStatus || electionStatus || 'Unknown'}`,
        `Election Type,${election?.settings?.isUniLevel ? 'University Level' : 'Organization Level'}`,
        `Allow Abstain,${election?.settings?.allowAbstain ? 'Yes' : 'No'}`,
        '',
        
        // Election Statistics Section
        'ELECTION STATISTICS',
        `Eligible Voters,${electionStats.votersCount}`,
        `Votes Cast,${electionStats.votesCount}`,
        `Participation Rate,${electionStats.participation}`,
        `Total Positions,${sortedPollsData.length}`,
        `Total Candidates,${sortedPollsData.reduce((sum, poll) => sum + poll.candidates.length, 0)}`,
        '',
        
        // Detailed Results Section
        'DETAILED RESULTS',
        'Position,Candidate Name,Course Year,Votes,Vote Percentage,Rank',
        ...sortedPollsData.flatMap(poll => {
          // Sort candidates by votes (descending) to determine rank
          const sortedCandidates = [...poll.candidates].sort((a, b) => b.votes - a.votes);
          const maxVotes = Math.max(...poll.candidates.map(c => c.votes));
          
          return sortedCandidates.map((candidate, index) => {
            const percent = maxVotes > 0 ? (candidate.votes / maxVotes) * 100 : 0;
            const rank = index + 1;
            return `"${poll.position}","${candidate.name}","${candidate.course_year}",${candidate.votes},${percent.toFixed(1)}%,${rank}`;
          });
        }),
        '',
        
        // Position Summary Section
        'POSITION SUMMARY',
        'Position,Total Candidates,Total Votes,Average Votes per Candidate',
        ...sortedPollsData.map(poll => {
          const totalVotes = poll.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
          const avgVotes = poll.candidates.length > 0 ? (totalVotes / poll.candidates.length).toFixed(1) : '0';
          return `"${poll.position}",${poll.candidates.length},${totalVotes},${avgVotes}`;
        }),
        '',
        
        // Export Information
        'EXPORT INFORMATION',
        `Exported Date,${new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })}`,
        `Exported By,Admin`,
        `Data Source,Election Summary Page`
    ].join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
      
      // Create a more descriptive filename
      const electionName = election?.name || 'unknown-election';
      const cleanName = electionName.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-').toLowerCase();
      const dateStr = new Date().toISOString().split('T')[0];
      a.download = `election-results-${cleanName}-${dateStr}.csv`;
      
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
      
      // Show success message
      alert('Election results exported successfully!');
      
    } catch (error) {
      console.error('Error exporting results:', error);
      alert('Failed to export results. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'upcoming': return 'text-yellow-600 bg-yellow-100';
      case 'annulled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 to-red-900">
        <AdminHeader />
        <main className="pt-50 pb-8 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading election results...</p>
          </div>
        </main>
      </div>
    );
  }

  const getPositionCandidates = (positionId: string) => {
    return election.candidates.filter((c) => c.positionId === positionId)
  }

  return (
    <div className="min-h-screen bg-[#52100D]">
      <header className="fixed top-0 left-0 right-0 z-50">
      <AdminHeader />
      </header>
      <main className="pt-24 sm:pt-32">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Election Summary</h1>
          <p className="text-red-100 mt-1 text-sm sm:text-base">View election preview and results</p>
        </div>
        
        {/* Loading/Error States - Moved here to appear after header */}
        {loading ? (
          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            <div className="text-white text-lg sm:text-xl text-center py-16 sm:py-20 mt-8 sm:mt-12">Loading election data...</div>
          </div>
        ) : error ? (
          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            <div className="text-red-400 text-lg sm:text-xl text-center py-16 sm:py-20 mt-8 sm:mt-12">{error}</div>
          </div>
        ) : election && (
          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            {/* Back to Admin Button */}
            <div className="mb-4">
              <button
                onClick={handleBackToAdmin}
                className="flex items-center gap-2 text-white hover:text-red-200 transition-all duration-200 hover:scale-105 hover:translate-x-[-2px] text-sm sm:text-base"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Admin
              </button>
            </div>
            
            {/* Tab Switcher */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6 bg-white p-2 rounded-lg shadow-sm border border-red-100">
              <Button
                variant={activeTab === 'preview' ? 'default' : 'outline'}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
                  activeTab === 'preview'
                    ? "bg-red-900 text-white"
                    : "text-red-900 hover:bg-red-50"
                }`}
                onClick={() => setActiveTab('preview')}
              >
                Preview
              </Button>
              <Button
                variant={activeTab === 'results' ? 'default' : 'outline'}
                className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
                  activeTab === 'results'
                    ? "bg-red-900 text-white"
                    : "text-red-900 hover:bg-red-50"
                }`}
                onClick={() => setActiveTab('results')}
              >
                Results
              </Button>
            </div>
            <>
              {/* Preview Tab */}
              {activeTab === "preview" && (
                <Card className="mb-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-red-900 flex items-center gap-2 text-lg sm:text-xl">
                      <Eye className="w-5 h-5" />
                      Election Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="[background:linear-gradient(90deg,_#f0fdf4,_#fefce8)] p-4 sm:p-6 rounded-lg border border-red-200">
                      <h2 className="text-xl sm:text-2xl font-bold text-red-900 mb-2">{election.name || "Untitled Election"}</h2>
                      <p className="text-gray-700 mb-4 text-sm sm:text-base">{election.description || "No description provided"}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                        <div>
                          <span className="font-semibold text-red-900">Voting Opened:</span>
                          <p className="break-words">
                            {election.startDate}
                          </p>
                        </div>
                        <div>
                          <span className="font-semibold text-red-900">Voting Closed:</span>
                          <p className="break-words">
                            {election.endDate}
                          </p>
                        </div>
            </div>
          </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-red-900 mb-3 sm:mb-4">Positions & Candidates</h3>
                      <div className="space-y-3 sm:space-y-4">
                        {sortedPositions.map((position: any) => (
                          <Card key={position.id ?? position.title ?? 'generated-id'} className="border border-red-200">
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-2">
                                <h4 className="font-semibold text-red-900 text-base sm:text-lg">{position.title}</h4>
                                <Badge className="bg-yellow-100 text-yellow-800 w-fit">
                                  {getPositionCandidates(position.id ?? position.title ?? 'generated-id').length} candidates
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{position.description}</p>
                              <div className="flex flex-wrap gap-1 sm:gap-2">
                                {getPositionCandidates(position.id ?? position.title ?? 'generated-id').map((candidate: any) => (
                                  <Badge key={candidate.id ?? candidate.email ?? 'generated-id'} variant="outline" className="bg-white text-xs sm:text-sm">
                                    {candidate.name}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {/* Results Tab */}
              {activeTab === "results" && (
                <Card className="mb-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-red-900 flex items-center gap-2 text-lg sm:text-xl">
                      <CheckCircle className="w-5 h-5" />
                      Election Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-700">Status:</span>
                          <Select value={displayStatus} onValueChange={setDisplayStatus}>
                            <SelectTrigger className="w-32 sm:w-40">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="completed">Completed</SelectItem>
                              <SelectItem value="annulled">Annulled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {displayStatus && (
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(displayStatus)}`}>
                            {displayStatus.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        * Status can be manually changed for display and export purposes
                      </div>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  onClick={fetchVoteData}
                          className="px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  Refresh
                </button>
                <button
                  onClick={exportResults}
                          disabled={exporting}
                          className={`px-3 sm:px-4 py-2 text-white rounded-lg transition-colors text-sm sm:text-base ${
                            exporting 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {exporting ? 'Exporting...' : 'Export CSV'}
                </button>
                      </div>
                    </div>
                    
                    {/* Election Statistics */}
                    <div className="mb-4 sm:mb-6">
                      <h3 className="text-base sm:text-lg font-semibold text-red-900 mb-3 sm:mb-4">Election Statistics</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border border-yellow-200 text-center">
                          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mx-auto mb-2" />
                          <p className="text-lg sm:text-xl font-bold text-yellow-900">{electionStats.votersCount}</p>
                          <p className="text-xs sm:text-sm text-yellow-700">Eligible Voters</p>
                        </div>
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200 text-center">
                          <Vote className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mx-auto mb-2" />
                          <p className="text-lg sm:text-xl font-bold text-blue-900">{electionStats.votesCount}</p>
                          <p className="text-xs sm:text-sm text-blue-700">Votes Cast</p>
                        </div>
                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-200 text-center sm:col-span-2 lg:col-span-1">
                          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-2" />
                          <p className="text-lg sm:text-xl font-bold text-green-900">{electionStats.participation}</p>
                          <p className="text-xs sm:text-sm text-green-700">Participation Rate</p>
              </div>
            </div>
          </div>

                    {sortedPollsData.length > 0 ? (
                      <div className="space-y-4 sm:space-y-6">
                        {sortedPollsData.map((poll, index) => (
                          <Card key={index} className="border border-red-200">
                            <CardContent className="p-4 sm:p-6">
                              <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-[#2D0907] mb-4 sm:mb-6 lg:mb-8">
                                {poll.position}
                              </h3>
                              <div className="space-y-4 sm:space-y-6">
                                {poll.candidates.map((candidate, candidateIndex) => {
                                  const percent = candidate.votes > 0 ? (candidate.votes / Math.max(...poll.candidates.map(c => c.votes))) * 100 : 0;
                                  return (
                                    <div
                                      key={candidate.id}
                                      className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 lg:gap-8 mb-4 sm:mb-6"
                                    >
                                      {/* Candidate Picture */}
                                      <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center shadow-md mb-2 sm:mb-0 border-4 border-gray-400 flex-shrink-0">
                                        {candidate.picture_url ? (
                                          <img
                                            src={candidate.picture_url}
                                            alt={candidate.name}
                                            className="w-full h-full object-cover"
                                          />
                                        ) : (
                                          <span className="text-gray-500 text-lg sm:text-2xl lg:text-3xl font-bold">
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
                                          <div className="font-semibold text-[#2D0907] text-base sm:text-lg lg:text-xl xl:text-2xl text-center sm:text-left">
                                            {candidate.name}
                                          </div>
                                          <div className="text-xs sm:text-sm lg:text-base text-[#3B2321] mb-2 text-center sm:text-left">
                                            {candidate.course_year}
                                          </div>
                                          {/* Progress Bar */}
                                          <div className="w-full h-2 sm:h-3 lg:h-4 bg-gray-200 rounded-full overflow-hidden border border-gray-500">
                                            <div
                                              className="h-full bg-[#52100D] transition-all duration-700 ease-out"
                                              style={{ 
                                                width: `${percent}%`,
                                                borderRadius: '9999px'
                                              }}
                                            />
                                          </div>
                                        </div>
                                        {/* Vote Count and Percentage */}
                                        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-center sm:justify-end min-w-[80px] sm:min-w-[90px] lg:min-w-[100px] ml-0 sm:ml-4 lg:ml-6 mt-2 sm:mt-0">
                                          <span className="text-sm sm:text-base lg:text-lg text-[#2D0907] font-bold text-center sm:text-right block">
                                            {candidate.votes.toLocaleString()} votes
                                          </span>
                                          <span className="text-sm sm:text-base lg:text-lg text-[#3B2321] font-semibold text-center sm:text-right block ml-3 sm:ml-0">
                                            {percent.toFixed(1)}%
                                          </span>
                                        </div>
              </div>
            </div>
                                  );
                                })}
                </div>
                            </CardContent>
                          </Card>
                        ))}
                        {/* Summary */}
                        <div className="text-center pt-2 sm:pt-4">
                          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                            Total Positions: {sortedPollsData.length} | Total Candidates: {sortedPollsData.reduce((sum, poll) => sum + poll.candidates.length, 0)}
                          </p>
                        </div>
            </div>
          ) : (
                      <div className="text-center py-8 sm:py-12">
                        <p className="text-gray-300 text-lg sm:text-xl">No election results available</p>
              <button
                onClick={fetchVoteData}
                          className="mt-4 px-4 sm:px-6 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                Refresh Results
              </button>
            </div>
          )}
                  </CardContent>
                </Card>
              )}
            </>
        </div>
        )}
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
} 