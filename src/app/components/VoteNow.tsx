'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { formatDateOnlyToSingaporeTime, formatTimeRemainingInSingaporeTime } from '@/utils/dateUtils';

interface Candidate {
  id: string;
  name: string;
  email: string;
  course_year: string;
  position_id: string;
  status: string;
  platform: string;
  detailed_achievements: string;
}

interface Position {
  id: string;
  title: string;
  description: string;
  max_candidates: number;
  max_winners: number;
  is_required: boolean;
  election_id: string;
}

interface Election {
  id: string;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_uni_level: boolean;
  allow_abstain: boolean;
  eligible_courseYear: string[];
  org_id: string;
  positions: Position[];
  candidates: Candidate[];
  candidatesByPosition: { [key: string]: Candidate[] };
}

export default function VoteNow() {
  const router = useRouter();
  const [selectedCandidates, setSelectedCandidates] = useState<{[key: string]: string}>({});
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchElectionData();
  }, []);

  const fetchElectionData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/get-voting-data?type=university`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Election API error:', errorText);
        throw new Error('Failed to fetch election data');
      }
      const data = await response.json();
      setElections(data.elections || []);
    } catch (err) {
      console.error('Error fetching election data:', err);
      setError('Failed to load election data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    router.push('/Voterdashboard');
  };

  const handleLogout = () => {
    router.push('/');
  };

  const handleNavigation = (route: string) => {
    switch (route) {
      case 'home':
        router.push('/Voterdashboard');
        break;
      case 'results':
        router.push('/Election_Results');
        break;
      case 'updates':
        router.push('/Update_Section');
        break;
      default:
        break;
    }
  };

  const handleCandidateSelect = (positionId: string, candidateId: string) => {
    setSelectedCandidates(prev => ({
      ...prev,
      [positionId]: candidateId
    }));
  };

  const handleSubmitVote = () => {
    console.log('Votes submitted:', selectedCandidates);
    alert('Your vote has been submitted successfully!');
    router.push('/Voterdashboard');
  };

  const formatTimeRemaining = (endDate: string) => {
    return formatTimeRemainingInSingaporeTime(endDate);
  };

  const formatDate = (dateString: string) => {
    return formatDateOnlyToSingaporeTime(dateString);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 to-red-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading election data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 to-red-900 flex items-center justify-center">
        <div className="text-white text-xl text-center">
          <div className="mb-4">{error}</div>
          <button 
            onClick={fetchElectionData}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (elections.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-950 to-red-900 flex flex-col">
        {/* Header */}
        <div className="w-full h-32 bg-rose-950 shadow-lg flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <img className="w-28 h-28" src="/Website Logo.png" alt="Logo" />
            <h1 className="text-white text-5xl font-normal font-['Abyssinica_SIL']">UniVote</h1>
          </div>
          
          <div className="flex items-center gap-11">
            <button 
              onClick={() => handleNavigation('home')}
              className="text-white text-xl font-medium font-['Inter'] cursor-pointer transition-all duration-300 hover:text-orange-300 hover:scale-105 relative group"
            >
              Home
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 transition-all duration-300 group-hover:w-full"></div>
            </button>
            
            <div className="text-white text-xl font-medium font-['Inter'] cursor-pointer transition-all duration-300 hover:text-orange-300 hover:scale-105 relative group">
              Candidates
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 transition-all duration-300 group-hover:w-full"></div>
            </div>
            
            <button 
              onClick={() => handleNavigation('results')}
              className="text-white text-xl font-medium font-['Inter'] cursor-pointer transition-all duration-300 hover:text-orange-300 hover:scale-105 relative group"
            >
              Results
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 transition-all duration-300 group-hover:w-full"></div>
            </button>
            
            <button 
              onClick={() => handleNavigation('updates')}
              className="text-white text-xl font-medium font-['Inter'] cursor-pointer transition-all duration-300 hover:text-orange-300 hover:scale-105 relative group"
            >
              Updates
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 transition-all duration-300 group-hover:w-full"></div>
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="px-6 py-3.5 bg-gradient-to-br from-stone-600 to-orange-300 rounded-full shadow-lg text-white text-xl font-normal font-['Jaldi'] cursor-pointer transition-all duration-300 hover:from-orange-400 hover:to-orange-500 hover:scale-105 hover:shadow-xl"
          >
            LOGOUT
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-stone-50 overflow-y-auto">
          <div className="p-4 bg-gradient-to-r from-red-50 to-yellow-50 min-h-full">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Header Section */}
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleBackToDashboard}
                  className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
                >
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-red-600 text-sm font-medium">Back to Dashboard</span>
                </button>
                
                <div>
                  <h1 className="text-red-700 text-3xl font-bold font-['Geist']">Cast Your Vote</h1>
                  <p className="text-yellow-700 text-base font-normal font-['Geist']">Select your preferred candidates for each election</p>
                </div>
              </div>

              {/* No Elections Message */}
              <div className="bg-stone-50 rounded-lg shadow-lg border border-yellow-300 p-8 text-center">
                <div className="text-red-700 text-xl font-semibold mb-2">No Active Elections</div>
                <p className="text-yellow-700">There are currently no active elections available for voting.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full h-40 bg-rose-950 shadow-lg flex items-center justify-center">
          <div className="text-white text-sm">© 2024 UniVote. All rights reserved.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 to-red-900 flex flex-col">
      {/* Header */}
      <div className="w-full h-32 bg-rose-950 shadow-lg flex items-center justify-between px-8">
        <div className="flex items-center gap-4">
          <img className="w-28 h-28" src="/Website Logo.png" alt="Logo" />
          <h1 className="text-white text-5xl font-normal font-['Abyssinica_SIL']">UniVote</h1>
        </div>
        
        <div className="flex items-center gap-11">
          <button 
            onClick={() => handleNavigation('home')}
            className="text-white text-xl font-medium font-['Inter'] cursor-pointer transition-all duration-300 hover:text-orange-300 hover:scale-105 relative group"
          >
            Home
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 transition-all duration-300 group-hover:w-full"></div>
          </button>
          
          <div className="text-white text-xl font-medium font-['Inter'] cursor-pointer transition-all duration-300 hover:text-orange-300 hover:scale-105 relative group">
            Candidates
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 transition-all duration-300 group-hover:w-full"></div>
          </div>
          
          <button 
            onClick={() => handleNavigation('results')}
            className="text-white text-xl font-medium font-['Inter'] cursor-pointer transition-all duration-300 hover:text-orange-300 hover:scale-105 relative group"
          >
            Results
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 transition-all duration-300 group-hover:w-full"></div>
          </button>
          
          <button 
            onClick={() => handleNavigation('updates')}
            className="text-white text-xl font-medium font-['Inter'] cursor-pointer transition-all duration-300 hover:text-orange-300 hover:scale-105 relative group"
          >
            Updates
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 transition-all duration-300 group-hover:w-full"></div>
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="px-6 py-3.5 bg-gradient-to-br from-stone-600 to-orange-300 rounded-full shadow-lg text-white text-xl font-normal font-['Jaldi'] cursor-pointer transition-all duration-300 hover:from-orange-400 hover:to-orange-500 hover:scale-105 hover:shadow-xl"
        >
          LOGOUT
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-stone-50 overflow-y-auto">
        <div className="p-4 bg-gradient-to-r from-red-50 to-yellow-50 min-h-full">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBackToDashboard}
                className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
              >
                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-red-600 text-sm font-medium">Back to Dashboard</span>
              </button>
              
              <div>
                <h1 className="text-red-700 text-3xl font-bold font-['Geist']">Cast Your Vote</h1>
                <p className="text-yellow-700 text-base font-normal font-['Geist']">Select your preferred candidates for each election</p>
              </div>
            </div>

            {/* Elections Section */}
            <div className="space-y-6">
              {elections.map((election) => {
                // Sort positions: important first, then custom
                const importantOrder = [
                  'President',
                  'Vice President',
                  'Secretary',
                  'Treasurer',
                ];
                const sortedPositions = [
                  ...election.positions.filter((pos: Position) => importantOrder.includes(pos.title))
                    .sort((a: Position, b: Position) => importantOrder.indexOf(a.title) - importantOrder.indexOf(b.title)),
                  ...election.positions.filter((pos: Position) => !importantOrder.includes(pos.title)),
                ];
                return (
                  <div key={election.id} className="bg-stone-50 rounded-lg shadow-lg border border-yellow-300 overflow-hidden">
                    <div className="px-6 py-6 border-b border-yellow-200">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h2 className="text-red-700 text-xl font-semibold font-['Geist']">{election.name}</h2>
                          <p className="text-yellow-700 text-sm font-normal font-['Geist']">{election.description}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-red-600 text-sm">{formatTimeRemaining(election.end_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-yellow-600 text-sm">Voting ends: {formatDate(election.end_date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-8">
                        {sortedPositions.map((position: Position) => {
                          const positionCandidates = election.candidatesByPosition[position.id] || [];
                          
                          return (
                            <div key={position.id} className="border border-yellow-200 rounded-lg p-6">
                              <div className="mb-4">
                                <h3 className="text-red-700 text-lg font-semibold font-['Geist'] mb-2">{position.title}</h3>
                                <p className="text-yellow-700 text-sm font-normal font-['Geist']">{position.description}</p>
                                {position.is_required && (
                                  <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">Required Position</span>
                                )}
                              </div>
                              
                              {positionCandidates.length > 0 ? (
                                <div className="space-y-4">
                                  {positionCandidates.map((candidate: Candidate) => (
                                    <div key={candidate.id} className="border border-yellow-300 rounded-lg p-4 hover:bg-yellow-50 transition-colors">
                                      <div className="flex items-start gap-4">
                                        <button 
                                          onClick={() => handleCandidateSelect(position.id, candidate.id)}
                                          className="mt-1"
                                        >
                                          <div className={`w-4 h-4 rounded-full border-2 ${selectedCandidates[position.id] === candidate.id ? 'bg-red-600 border-red-600' : 'border-red-600'}`} />
                                        </button>
                                        
                                        <div className="flex-1">
                                          <div className="flex items-start gap-4">
                                            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                                              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                              </svg>
                                            </div>
                                            
                                            <div className="flex-1 space-y-2">
                                              <div>
                                                <h4 className="text-red-700 text-lg font-semibold font-['Geist']">{candidate.name}</h4>
                                                <p className="text-yellow-700 text-sm font-medium font-['Geist']">{candidate.course_year}</p>
                                              </div>
                                              
                                              {candidate.platform && (
                                                <div className="space-y-1">
                                                  <p className="text-red-600 text-sm font-medium font-['Geist']">Platform:</p>
                                                  <p className="text-yellow-700 text-sm font-medium font-['Geist']">{candidate.platform}</p>
                                                </div>
                                              )}
                                              
                                              {candidate.detailed_achievements && (
                                                <div className="space-y-1">
                                                  <p className="text-red-600 text-sm font-medium font-['Geist']">Experience & Achievements:</p>
                                                  <p className="text-yellow-700 text-sm font-medium font-['Geist']">{candidate.detailed_achievements}</p>
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center py-8 text-gray-500">
                                  <p>No candidates available for this position.</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Submit Vote Button */}
              <div className="flex justify-center pt-6 pb-8">
                <button
                  onClick={handleSubmitVote}
                  className="px-8 py-4 bg-gradient-to-r from-red-700 to-red-800 hover:from-red-600 hover:to-red-700 text-white text-xl font-bold rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Submit Vote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full h-40 bg-rose-950 shadow-lg flex items-center justify-center">
        <div className="text-white text-sm">© 2024 UniVote. All rights reserved.</div>
      </div>
    </div>
  );
} 