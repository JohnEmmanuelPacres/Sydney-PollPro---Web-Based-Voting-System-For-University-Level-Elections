// app/dashboard/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import VoterHeader from "../components/VoteDash_Header";
//import WelcomeSection from "../components/VoteDash_WelcomeSection";
//import StatsSection from "../components/VoteDash_StatSection";
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vote, Building, University, TrendingUp, Users } from "lucide-react"
import { useElection } from "../components/election-context"
import { UniversityElectionCard } from "../components/university-election-card"
import { OrganizationElectionCard } from "../components/organization-election-card"
import Footer from "../components/Footer";

export default function VotingDashboard() {
  const { getOrganizationById } = useElection()
  const router = useRouter()
  const [selectedElection, setSelectedElection] = useState<any>(null)
  const [universityElections, setUniversityElections] = useState<any[]>([])
  const [organizationElections, setOrganizationElections] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<{ [electionId: string]: any }>({})
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchParams = useSearchParams();
  const [userProfile, setUserProfile] = useState<any>(null);
  // Use userProfile data instead of URL parameters
  const departmentOrg = userProfile?.department_org || searchParams.get("department_org") || searchParams.get("administered_Org");
  const email = userProfile?.email || searchParams.get("email") || "";

  // Always call hooks at the top level
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      setAuthChecked(true);
      
      // If user is logged in, fetch their profile
      if (user) {
        try {
          const { data: voterProfile, error: voterProfileError } = await supabase
            .from('voter_profiles')
            .select('*')
            .eq('email', user.email)
            .single();
            
          if (!voterProfileError && voterProfile) {
            setUserProfile(voterProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (!userProfile) return; // Wait for user profile to load
    
    setLoading(true);
    async function fetchElections() {
      // 1. Fetch all university-wide elections
      const uniRes = await fetch('/api/get-voting-data?scope=university');
      const uniData = await uniRes.json();

      // 2. Fetch all organization elections (unfiltered)
      const orgRes = await fetch(`/api/get-voting-data?scope=organization${`&department_org=${departmentOrg}`}`);
      const orgData = await orgRes.json();

      // Helper to fetch positions for an election
      async function fetchPositions(electionId: string) {
        const res = await fetch(`/api/get-election-details`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ electionId }),
        });
        const data = await res.json();
        return data?.election?.positions || [];
      }

      // Attach positions to each election
      const uniElectionsWithPositions = await Promise.all(
        (uniData.elections || []).map(async (election: any) => ({
          ...election,
          positions: await fetchPositions(election.id),
        }))
      );
      setUniversityElections(uniElectionsWithPositions);

      const orgElectionsWithPositions = await Promise.all(
        (orgData.elections || []).map(async (election: any) => ({
          ...election,
          positions: await fetchPositions(election.id),
        }))
      );
      setOrganizationElections(orgElectionsWithPositions);

      setLoading(false);
      // Fetch stats for all elections
      const allElections = [...uniElectionsWithPositions, ...orgElectionsWithPositions];
      allElections.forEach(async (election) => {
        const statsRes = await fetch(`/api/get-vote-counts?scope=${election.is_uni_level ? 'university' : 'organization'}${election.is_uni_level ? '' : `&department_org=${encodeURIComponent(election.department_org || '')}`}`);
        const statsData = await statsRes.json();
        setStats(prev => ({ ...prev, [election.id]: statsData }));
      });
    }
    fetchElections();
  }, [userProfile, departmentOrg]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/User_RegxLogin');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#52100D" }}>
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-900 mb-4">Loading...</h2>
            <p className="text-gray-600 mb-4">Checking authentication status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#52100D" }}>
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-900 mb-4">Please Log In</h2>
            <p className="text-gray-600 mb-4">You need to log in to view available elections.</p>
            <Button onClick={handleLogout} className="bg-red-900 hover:bg-red-800">Log In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleVoteNow = (electionId: string) => {
    router.push(`/OrganizationElection?election_id=${electionId}${userProfile?.department_org ? `&department_org=${encodeURIComponent(userProfile.department_org)}` : ''}`);
  }

  // Helper to format date and time in Singapore timezone (like ElectionStatusBar)
  function formatDateForDisplay(date: string, time?: string) {
    if (!date) return '';
    let dateObj;
    if (time) {
      dateObj = new Date(`${date}T${time}`);
    } else {
      dateObj = new Date(date);
    }
    return dateObj.toLocaleString('en-SG', {
      timeZone: 'Asia/Singapore',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  // Helper to normalize election object for cards
  function normalizeElectionForCard(election: any) {
    if (!election) return election;
    // Prefer camelCase, fallback to snake_case
    const rawStartDate = election.startDate || election.start_date || '';
    const rawEndDate = election.endDate || election.end_date || '';
    const rawStartTime = election.startTime || election.start_time || (rawStartDate ? new Date(rawStartDate).toTimeString().slice(0,5) : '');
    const rawEndTime = election.endTime || election.end_time || (rawEndDate ? new Date(rawEndDate).toTimeString().slice(0,5) : '');
    return {
      ...election,
      startDate: formatDateForDisplay(rawStartDate),
      startTime: rawStartTime,
      endDate: formatDateForDisplay(rawEndDate),
      endTime: rawEndTime,
      organizationId: election.organizationId || election.org_id,
    };
  }

  // Fetch full election details for modal
  async function handleViewDetails(election: any) {
    setModalLoading(true);
    setModalError(null);
    setSelectedElection(null);
    try {
      const response = await fetch('/api/get-election-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ electionId: election.id }),
      });
      const result = await response.json();
      if (!response.ok || !result.election) {
        setModalError(result.error || 'Failed to fetch election details.');
        setModalLoading(false);
        return;
      }
      setSelectedElection(result.election);
    } catch (err: any) {
      setModalError(err.message || 'Failed to fetch election details.');
    } finally {
      setModalLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#52100D]">
      <VoterHeader />
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white p-6 mt-33">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">Election Dashboard</h2>
          {userProfile && (
            <>
              <p className="text-red-100">Welcome to the UniVote {userProfile.email}</p>
              <p className="text-red-100">{userProfile.course_year}</p>
            </>
          )}
        </div>
      </div>
      <main className="flex-1 pt-15 pb-8 px-4 space-y-8">
        <div className="max-w-7xl mx-auto p-6">
          {/* Elections Columns Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* University-wide Elections Column */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <University className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">University-wide Elections</h2>
                <Badge variant="outline" className="bg-red-700 text-red-100 border-red-600">
                  {universityElections.length} active
                </Badge>
              </div>
              <div className="flex flex-col gap-6">
                {universityElections.map((election) => {
                  const normElection = normalizeElectionForCard(election);
                  return (
                    <div
                      key={normElection.id}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      <UniversityElectionCard
                        election={normElection}
                        organization={getOrganizationById(normElection.organizationId)}
                        hasVoted={false}
                        onVoteNow={() => handleVoteNow(normElection.id)}
                        onViewDetails={handleViewDetails}
                      />
                    </div>
                  );
                })}
                {universityElections.length === 0 && (
                  <div className="text-center text-yellow-200 mt-4">No active university-wide elections at this time.</div>
                )}
              </div>
            </div>
            {/* Organization Elections Column */}
            <div className="md:border-l-2 md:border-red-300 md:pl-8">
              <div className="flex items-center gap-3 mb-6">
                <Building className="w-6 h-6 text-white" />
                <h2 className="text-2xl font-bold text-white">Organization Elections</h2>
                <Badge variant="outline" className="bg-red-700 text-red-100 border-red-600">
                  {organizationElections.length} active
                </Badge>
              </div>
              <div className="flex flex-col gap-6">
                {organizationElections.map((election) => {
                  const normElection = normalizeElectionForCard(election);
                  return (
                    <div
                      key={normElection.id}
                      className="transition-all duration-200 hover:scale-105"
                    >
                      <OrganizationElectionCard
                        election={normElection}
                        organization={getOrganizationById(normElection.organizationId)}
                        hasVoted={false}
                        onVoteNow={() => handleVoteNow(normElection.id)}
                        onViewDetails={handleViewDetails}
                      />
                    </div>
                  );
                })}
                {organizationElections.length === 0 && (
                  <div className="text-center text-yellow-200 mt-4">No active organization elections at this time.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {/* Election Details Modal */}
      {(modalLoading || selectedElection) && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="border-b border-red-100">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl text-red-900">{modalLoading ? 'Loading...' : selectedElection?.name}</CardTitle>
                  {selectedElection && <p className="text-red-600 mt-1">{getOrganizationById(selectedElection.organizationId)?.name}</p>}
                </div>
                <Button onClick={() => { setSelectedElection(null); setModalError(null); setModalLoading(false); }} variant="outline" size="sm">
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                  <div className="text-lg text-red-900 font-semibold mb-2">Loading election details...</div>
                </div>
              ) : modalError ? (
                <div className="flex flex-col items-center justify-center min-h-[200px]">
                  <div className="text-lg text-red-900 font-semibold mb-2">{modalError}</div>
                </div>
              ) : selectedElection && (
              <div className="space-y-6">
                {/* Voting Period */}
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">Voting Period</h3>
                  <div className="flex flex-col md:flex-row md:gap-8 bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div>
                      <span className="font-semibold text-red-700">Starts</span>
                      <div className="text-red-900">
                        {formatDateForDisplay(selectedElection.startDate || selectedElection.start_date, selectedElection.startTime)}
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-red-700">Ends</span>
                      <div className="text-red-900">
                        {formatDateForDisplay(selectedElection.endDate || selectedElection.end_date, selectedElection.endTime)}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Election Description */}
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2">About This Election</h3>
                  <p className="text-gray-700">{selectedElection.description}</p>
                </div>

                {/* Positions and Candidates */}
                <div>
                  <h3 className="text-lg font-semibold text-red-900 mb-4">Positions & Candidates</h3>
                  <div className="space-y-4">
                    {selectedElection.positions.map((position: any) => {
                      const positionCandidates = selectedElection.candidates.filter(
                        (c: any) => (c.positionId === position.id || c.position_id === position.id) && c.status === "approved"
                      )
                      return (
                        <Card key={position.id} className="border border-red-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-red-900">{position.title}</h4>
                              <Badge className="bg-yellow-100 text-yellow-800">
                                {positionCandidates.length} candidates
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{position.description}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {positionCandidates.map((candidate: any) => (
                                <div key={candidate.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex gap-3 items-center">
                                  {/* Profile Picture or Initial */}
                                  {candidate.avatar || candidate.picture_url ? (
                                    <img
                                      src={candidate.avatar || candidate.picture_url}
                                      alt={candidate.name}
                                      className="w-10 h-10 rounded-full object-cover border border-red-200"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-red-900 rounded-full flex items-center justify-center">
                                      <span className="text-white text-sm font-bold">{candidate.name.charAt(0)}</span>
                                    </div>
                                  )}
                                    <div className="flex-1">
                                      <p className="font-semibold text-gray-900">{candidate.name}</p>
                                      <p className="text-xs text-gray-600">
                                        {candidate.course_year || 'Course not specified'}
                                      </p>
                                    </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}