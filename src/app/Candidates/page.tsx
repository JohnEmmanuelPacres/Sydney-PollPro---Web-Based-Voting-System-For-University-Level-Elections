'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import VoteDash_Header from '../components/VoteDash_Header';
import AdminHeader from '../components/AdminHeader';
import { useSearchParams } from 'next/navigation';
import Footer from '../components/Footer';

interface Candidate {
  id: string;
  name: string;
  email: string;
  course_year: string;
  position_id: string;
  status: string;
  platform: string;
  detailed_achievements: string;
  picture_url?: string;
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
}

const CandidatesPage = () => {
  const [election, setElection] = useState<Election | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<string>('all');
  const [filterScope, setFilterScope] = useState<'university' | 'organization'>('university');
  const searchParams = useSearchParams();
  const departmentOrg = searchParams.get('department_org') || searchParams.get('administered_Org');
  const isAdmin = searchParams.get('administered_Org') !== null;

  useEffect(() => {
    const fetchElection = async () => {
      setLoading(true);
      setError(null);
      try {
        let type = filterScope;
        if (filterScope === 'organization' && departmentOrg) {
          const typeRes = await fetch(`/api/get-relevant-elections?department_org=${encodeURIComponent(departmentOrg)}`);
          if (!typeRes) {
            setError('API Error');
            console.error('API Error: No response from /api/get-relevant-elections');
            setElection(null);
            setLoading(false);
            return;
          }
          const typeData = await typeRes.json();
          if (typeData && typeData.type) {
            type = typeData.type;
          } else {
            setError('Error fetching organization election scope/type.');
            setElection(null);
            setLoading(false);
            console.error('Error: typeData missing expected fields', typeData);
            return;
          }
        }
        // Now fetch the election data using the determined type
        const params = [`scope=${type}`];
        if (departmentOrg) params.push(`department_org=${encodeURIComponent(departmentOrg)}`);
        const response = await fetch(`/api/get-voting-data?${params.join('&')}`);
        if (!response) {
          setError('API Error');
          setElection(null);
          setLoading(false);
          console.error('API Error: No response from /api/get-voting-data');
          return;
        }
        const result = await response.json();
        if (result.elections && result.elections.length > 0) {
          setElection(result.elections[0]);
          setLoading(false);
          setError(null);
          return;
        }
        setError('No active election found.');
        setElection(null);
      } catch (err) {
        setError('Failed to load candidates.');
        setElection(null);
        console.error('Error fetching candidates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchElection();
  }, [filterScope, departmentOrg]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading candidates...</div>;
  }
  if (error || !election) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        {isAdmin ? <AdminHeader /> : <VoteDash_Header />}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-2xl text-red-700 font-bold text-center">
            There are no elections at this time.
          </div>
        </div>
        <div className="w-full h-40 bg-rose-950 shadow-lg flex items-center justify-center mt-auto">
          <div className="text-white text-sm">© 2024 UniVote. All rights reserved.</div>
        </div>
      </div>
    );
  }

  // Sort positions: important first, then custom alphabetical
  const importantOrder = [
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
  const sortedPositions = [
    ...election.positions.filter(pos => importantOrder.includes(pos.title))
      .sort((a, b) => importantOrder.indexOf(a.title) - importantOrder.indexOf(b.title)),
    ...election.positions.filter(pos => !importantOrder.includes(pos.title))
      .sort((a, b) => a.title.localeCompare(b.title)),
  ];

  // Group candidates by position
  const candidatesByPosition: { [positionId: string]: Candidate[] } = {};
  election.positions.forEach((position) => {
    candidatesByPosition[position.id] = election.candidates.filter(
      (candidate) => candidate.position_id === position.id
    );
  });

  // Filtered positions for dropdown
  const filterOptions = [
    { value: 'all', label: 'All Positions' },
    ...sortedPositions.map(pos => ({ value: pos.id, label: pos.title })),
  ];

  return (
    <div className="w-screen min-h-screen bg-white flex flex-col">
      {isAdmin ? <AdminHeader /> : <VoteDash_Header />}
      <div className="flex-1 w-full px-0 md:px-0 py-8 flex flex-col">
        <div className="w-full h-full p-0 flex-1">
          <h1 className="text-3xl font-bold text-center text-red-700 mb-8 pt-8">Candidates for {election.name}</h1>
          {/* Filter Scope Dropdown */}
          <div className="flex justify-center mb-8">
            <select
              className="bg-white text-black rounded px-4 py-2 text-lg font-medium shadow border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
              value={filterScope}
              onChange={e => setFilterScope(e.target.value as 'university' | 'organization')}
            >
              <option value="university">University Candidates</option>
              <option value="organization">Organization Candidates</option>
            </select>
          </div>
          {/* Filter Dropdown */}
          <div className="flex justify-end mb-8 pr-4 md:pr-16">
            <div className="relative" style={{ minWidth: 200 }}>
              <select
                value={selectedPosition}
                onChange={e => setSelectedPosition(e.target.value)}
                className="border border-red-700 bg-red-700 text-yellow-300 rounded px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-red-400 appearance-none w-full pr-10"
              >
                {filterOptions.map(option => (
                  <option key={option.value} value={option.value} className="text-yellow-700 bg-white">
                    {option.label}
                  </option>
                ))}
              </select>
              {/* Down arrow icon */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-12 w-full px-4 md:px-16">
            {selectedPosition === 'all' ? (
              sortedPositions.map((position) => (
                <div key={position.id} className="mb-8">
                  <h2 className="text-2xl font-bold text-red-800 mb-4 border-b pb-2">{position.title}</h2>
                  <div className="flex flex-col gap-6">
                    {candidatesByPosition[position.id].length === 0 ? (
                      <div className="text-gray-500 italic">No candidates for this position.</div>
                    ) : (
                      candidatesByPosition[position.id].map((candidate) => (
                        <div key={candidate.id} className="flex flex-col md:flex-row gap-6 items-start border-b pb-6 w-full">
                          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {candidate.picture_url ? (
                              <img src={candidate.picture_url} alt={candidate.name} className="w-full h-full object-cover" />
                            ) : (
                              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-xl font-bold text-red-700">{candidate.name}</div>
                            <div className="text-yellow-700 font-medium mb-1">
                              {position.title}
                            </div>
                            <div className="mb-1">
                              <span className="font-semibold text-red-600">Platform:</span>
                              <span className="ml-2 text-yellow-700">{candidate.platform}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-red-600">Experience & Achievements:</span>
                              <span className="ml-2 text-yellow-700">{candidate.detailed_achievements}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))
            ) : (
              (() => {
                const position = election.positions.find(pos => pos.id === selectedPosition);
                if (!position) return null;
                return (
                  <div key={position.id} className="mb-8">
                    <h2 className="text-2xl font-bold text-red-800 mb-4 border-b pb-2">{position.title}</h2>
                    <div className="flex flex-col gap-6">
                      {candidatesByPosition[position.id].length === 0 ? (
                        <div className="text-gray-500 italic">No candidates for this position.</div>
                      ) : (
                        candidatesByPosition[position.id].map((candidate) => (
                          <div key={candidate.id} className="flex flex-col md:flex-row gap-6 items-start border-b pb-6 w-full">
                            <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                              {candidate.picture_url ? (
                                <img src={candidate.picture_url} alt={candidate.name} className="w-full h-full object-cover" />
                              ) : (
                                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="text-xl font-bold text-red-700">{candidate.name}</div>
                              <div className="text-yellow-700 font-medium mb-1">
                                {position.title}
                              </div>
                              <div className="mb-1">
                                <span className="font-semibold text-red-600">Platform:</span>
                                <span className="ml-2 text-yellow-700">{candidate.platform}</span>
                              </div>
                              <div>
                                <span className="font-semibold text-red-600">Experience & Achievements:</span>
                                <span className="ml-2 text-yellow-700">{candidate.detailed_achievements}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CandidatesPage; 